from flask import Flask, request, jsonify
from flask_cors import CORS
from ai import AIService
import json
from jwt_utils import create_jwt, decode_jwt
import re
from db import mongo_db
from models import User, Sow
from bson import ObjectId

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
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password') # Password is not used in this flow, but kept for consistency with original
    email_regex = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
    if not email:
        return jsonify({'error': 'Email required'}), 400
    if not re.match(email_regex, email):
        return jsonify({'error': 'Invalid email format'}), 400

    users_collection = mongo_db.get_collection('users')
    user_data = users_collection.find_one({'email': email})

    if not user_data:
        # Create a new user if not found
        new_user = User(name=email.split('@')[0], email=email, tokenIdentifier=f"jwt-user-{email}")
        users_collection.insert_one(new_user.model_dump(by_alias=True, exclude_none=True))
        user_data = users_collection.find_one({'email': email})

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

def get_user_from_token(token):
    payload = decode_jwt(token)
    if not payload or not payload.get('email'):
        return None
    email = payload['email']
    users_collection = mongo_db.get_collection('users')
    user_data = users_collection.find_one({'email': email})
    return user_data

@app.route('/api/sows', methods=['POST'])
def create_sow():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Authorization token missing'}), 401
    
    user = get_user_from_token(token.split(' ')[1])
    if not user:
        return jsonify({'error': 'Not authenticated or user not found'}), 401

    data = request.get_json()
    try:
        sow = Sow(
            userId=str(user['_id']),
            title=data['title'],
            sowNumber=data['sowNumber'],
            clientName=data['clientName'],
            slides=data['slides']
        )
        sows_collection = mongo_db.get_collection('sows')
        result = sows_collection.insert_one(sow.model_dump(by_alias=True, exclude_none=True))
        return jsonify({'_id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/sows', methods=['GET'])
def get_sows():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Authorization token missing'}), 401
    
    user = get_user_from_token(token.split(' ')[1])
    if not user:
        return jsonify({'error': 'Not authenticated or user not found'}), 401

    sows_collection = mongo_db.get_collection('sows')
    user_sows = list(sows_collection.find({'userId': str(user['_id'])}))
    for sow in user_sows:
        sow['_id'] = str(sow['_id'])
    return jsonify(user_sows), 200

@app.route('/api/sows/<sow_id>', methods=['GET'])
def get_sow(sow_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Authorization token missing'}), 401
    
    user = get_user_from_token(token.split(' ')[1])
    if not user:
        return jsonify({'error': 'Not authenticated or user not found'}), 401

    sows_collection = mongo_db.get_collection('sows')
    try:
        sow = sows_collection.find_one({'_id': ObjectId(sow_id), 'userId': str(user['_id'])})
        if not sow:
            return jsonify({'error': 'SOW not found or unauthorized'}), 404
        sow['_id'] = str(sow['_id'])
        return jsonify(sow), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/sows/<sow_id>', methods=['PUT'])
def update_sow(sow_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Authorization token missing'}), 401
    
    user = get_user_from_token(token.split(' ')[1])
    if not user:
        return jsonify({'error': 'Not authenticated or user not found'}), 401

    data = request.get_json()
    sows_collection = mongo_db.get_collection('sows')
    try:
        existing_sow = sows_collection.find_one({'_id': ObjectId(sow_id), 'userId': str(user['_id'])})
        if not existing_sow:
            return jsonify({'error': 'SOW not found or unauthorized'}), 404

        update_data = {
            'title': data['title'],
            'sowNumber': data['sowNumber'],
            'clientName': data['clientName'],
            'slides': data['slides']
        }
        sows_collection.update_one({'_id': ObjectId(sow_id)}, {'$set': update_data})
        return jsonify({'message': 'SOW updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/sows/<sow_id>', methods=['DELETE'])
def delete_sow(sow_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Authorization token missing'}), 401
    
    user = get_user_from_token(token.split(' ')[1])
    if not user:
        return jsonify({'error': 'Not authenticated or user not found'}), 401

    sows_collection = mongo_db.get_collection('sows')
    try:
        result = sows_collection.delete_one({'_id': ObjectId(sow_id), 'userId': str(user['_id'])})
        if result.deleted_count == 0:
            return jsonify({'error': 'SOW not found or unauthorized'}), 404
        return jsonify({'message': 'SOW deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)