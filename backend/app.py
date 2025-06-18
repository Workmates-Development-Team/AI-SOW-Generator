from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ai import AIService
from infograph import InfoService
import json

app = Flask(
    __name__,
    static_folder="public",
    static_url_path="/public"
)
CORS(app)
ai = AIService()
infograph = InfoService()

@app.route('/api/generate-presentation', methods=['POST'])
def generate_presentation():
    try:
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be JSON'}), 400
            
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Invalid JSON data'}), 400
            
        prompt = data.get('prompt')

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
       
        presentation_data = ai.generate_presentation_structure(prompt)
        
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

@app.route('/api/generate-infograph', methods=['POST'])
def generate_image():
    try:
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be JSON'}), 400
            
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid JSON data'}), 400

        prompt = data.get('title')
        if not isinstance(prompt, str):
            return jsonify(error='prompt must be a string'), 400
            
        presentation_data = data.get('data')
        if not isinstance(presentation_data, dict):
            return jsonify({'error': 'presentation data must be an object'}), 400
        
        infograph_data = infograph.generate_infograph(prompt)

        return jsonify({
            'success': True,
            'data': infograph_data
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
