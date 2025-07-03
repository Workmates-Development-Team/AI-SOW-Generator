from flask import Flask, request, jsonify
from flask_cors import CORS
from ai import AIService
import json
from jwt_utils import create_jwt, decode_jwt
import re

app = Flask(__name__)
from config import ConfigAI
CORS(app, resources={r"/api/*": {"origins": ConfigAI.CORS_ORIGINS.split(',') if ConfigAI.CORS_ORIGINS else "*"}})
ai = AIService()

@app.route('/api/generate-document', methods=['POST'])
def generate_presentation():
    raw_llm_output = None
    try:
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be JSON'}), 400
            
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Invalid JSON data'}), 400
        
        sow_fields = {
            'clientName': data.get('clientName') or '',
            'projectDescription': data.get('projectDescription') or '',
            'requirements': data.get('requirements') or '',
            'duration': data.get('duration') or '',
            'budget': data.get('budget') or '',
            'supportService': data.get('supportService') or '',
            'legalTerms': data.get('legalTerms') or '',
            'deliverables': data.get('deliverables') or '',
            'terminationClause': data.get('terminationClause') or '',
        }
        if any(sow_fields.values()):
            try:
                presentation_data = ai.generate_sow_document(sow_fields)
            except json.JSONDecodeError as e:
                if hasattr(e, 'doc'):
                    raw_llm_output = e.doc
                return jsonify({
                    'success': False,
                    'error': f'Invalid JSON format: {str(e)}',
                    'raw_llm_output': raw_llm_output
                }), 400
            except ValueError as e:
                error_msg = str(e)
                raw_llm_output = None
                if 'Raw LLM response:' in error_msg:
                    parts = error_msg.split('Raw LLM response:')
                    error_msg = parts[0].strip()
                    raw_llm_output = parts[1].strip()
                return jsonify({
                    'success': False,
                    'error': error_msg,
                    'raw_llm_output': raw_llm_output
                }), 400
        else:
            return jsonify({'error': 'At least one SOW field is required'}), 400
        
        return jsonify({
            'success': True,
            'data': presentation_data
        })
        
    except json.JSONDecodeError as e:
        if hasattr(e, 'doc'):
            raw_llm_output = e.doc
        return jsonify({
            'success': False,
            'error': f'Invalid JSON format: {str(e)}',
            'raw_llm_output': raw_llm_output
        }), 400

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    email_regex = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    if not re.match(email_regex, email):
        return jsonify({'error': 'Invalid email format'}), 400
    token = create_jwt(email)
    return jsonify({'token': token})

@app.route('/api/refresh', methods=['POST'])
def refresh_token():
    data = request.get_json()
    token = data.get('token')
    payload = decode_jwt(token)
    if not payload:
        return jsonify({'error': 'Invalid or expired token'}), 401
    new_token = create_jwt(payload['email'])
    return jsonify({'token': new_token})

if __name__ == '__main__':
    app.run(debug=True)
