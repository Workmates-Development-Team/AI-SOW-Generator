from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ai import AIService
import json

app = Flask(
    __name__,
    static_folder="public",
    static_url_path="/public"
)
CORS(app)
ai = AIService()

@app.route('/api/generate-document', methods=['POST'])
def generate_presentation():
    try:
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be JSON'}), 400
            
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Invalid JSON data'}), 400
        
        sow_fields = {
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
            presentation_data = ai.generate_sow_document(sow_fields)
        else:
            return jsonify({'error': 'At least one SOW field is required'}), 400
        
        return jsonify({
            'success': True,
            'data': presentation_data
        })
        
    except json.JSONDecodeError as e:
        return jsonify({
            'success': False,
            'error': f'Invalid JSON format: {str(e)}'
        }), 400

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
