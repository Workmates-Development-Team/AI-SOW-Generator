from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from services.ai_service import AIService
from services.ppt_service import PPTService
from config import config
import uuid
import os
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    try:
        ai_service = AIService()
        logger.info("AI Service initialized")
    except Exception as e:
        logger.error(f"Failed to initialize AI Service: {e}")
        ai_service = None
    
    ppt_service = PPTService()
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'ai_service': ai_service is not None,
            'timestamp': str(uuid.uuid4())
        })
    
    @app.route('/api/generate-ppt', methods=['POST'])
    def generate_ppt():
        """Generate PowerPoint presentation from user prompt"""
        try:
            if not ai_service:
                return jsonify({'error': 'AI service not available'}), 503
            
            data = request.get_json()
            if not data:
                return jsonify({'error': 'No JSON data provided'}), 400
            
            user_prompt = data.get('prompt', '').strip()
            if not user_prompt:
                return jsonify({'error': 'Prompt is required'}), 400
            
            logger.info(f"Generating PPT for prompt: {user_prompt[:100]}...")
            
            # Generate content using AI
            ai_content = ai_service.generate_ppt_content(user_prompt)
            
            # Create PPT
            if ppt_service.create_presentation(ai_content):
                filename = f"presentation_{uuid.uuid4().hex[:8]}.pptx"
                filepath = ppt_service.save_presentation(filename)
                
                return jsonify({
                    'success': True,
                    'filename': filename,
                    'download_url': f'/api/download/{filename}',
                    'title': ai_content.get('title', 'Generated Presentation'),
                    'slide_count': len(ai_content.get('slides', []))
                })
            else:
                return jsonify({'error': 'Failed to create presentation'}), 500
                
        except ValueError as e:
            logger.error(f"Validation error: {e}")
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return jsonify({'error': 'Internal server error'}), 500
    
    @app.route('/api/download/<filename>')
    def download_file(filename):
        """Download generated presentation file"""
        try:
            from config import Config
            filepath = os.path.join(Config.GENERATED_FILES_DIR, filename)
            
            if not os.path.exists(filepath):
                return jsonify({'error': 'File not found'}), 404
            
            return send_file(
                filepath,
                as_attachment=True,
                download_name=filename,
                mimetype='application/vnd.openxmlformats-officedocument.presentationml.presentation'
            )
        except Exception as e:
            logger.error(f"Error downloading file: {e}")
            return jsonify({'error': 'Failed to download file'}), 500
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run()