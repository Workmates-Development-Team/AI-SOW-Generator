from flask import Flask, request, jsonify
from flask_cors import CORS
from services.ai_service import AIService

app = Flask(__name__)
CORS(app)
ai_service = AIService()

@app.route('/api/generate-presentation', methods=['POST'])
def generate_presentation():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        presentation_data = ai_service.generate_presentation_structure(prompt)
        
        return jsonify({
            'success': True,
            'data': {
                'title': presentation_data.get('title'),
                'theme': presentation_data.get('theme', 'modern'),
                'slides': presentation_data.get('slides', []),
                'totalSlides': len(presentation_data.get('slides', []))
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'presentation-generator'})

if __name__ == '__main__':
    app.run(debug=True)