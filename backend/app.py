from flask import Flask, request, jsonify
from flask_cors import CORS
from ai import AIService
from infograph import InfoService
from flask import send_from_directory

app = Flask(__name__)
CORS(app)
AI = AIService()
infograph = InfoService()

@app.route('/api/generate-presentation', methods=['POST'])
def generate_presentation():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
       
        presentation_data = AI.generate_presentation_structure(prompt)
        
        infograph_context = {
            "title": presentation_data.get("title", ""),
            "slides": presentation_data.get("slides", [])
        }
        infograph_data = infograph.generate_infograph(infograph_context)
        
        # Adding infograph as the last slide for now
        infograph_slide = {
            "id": f"slide-{len(presentation_data['slides']) + 1}",
            "type": "infograph",
            "html": f"""
            <div class='h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-12'>
                <div class='text-center mb-8'>
                    <h2 class='text-5xl font-bold text-white mb-4'>Key Insights</h2>
                    <div class='w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto'></div>
                </div>
                <div class='w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20'>
                    <img src='{infograph_data.get("image_url", "")}' alt='Infographic' class='w-full h-auto rounded-lg' />
                </div>
            </div>
            """
        }
        presentation_data['slides'].append(infograph_slide)
        presentation_data['totalSlides'] = len(presentation_data['slides'])
        
        return jsonify({
            'success': True,
            'data': presentation_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/generate-infograph', methods=['POST'])
def generate_infograph_from_presentation():
    try:
        data = request.get_json()
        presentation = data.get('presentation', None)

        if not presentation:
            return jsonify({'error': 'Presentation data is required'}), 400

        infograph_context = {
            "title": presentation.get("title", ""),
            "slides": presentation.get("slides", [])
        }
        
        infograph_data = infograph.generate_infograph(infograph_context)

        return jsonify({
            'success': True,
            'infograph': infograph_data
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/public/<path:filename>')
def serve_public_file(filename):
    public_dir = os.path.join(os.path.dirname(__file__), "public")
    return send_from_directory(public_dir, filename)

if __name__ == '__main__':
    app.run(debug=True)
