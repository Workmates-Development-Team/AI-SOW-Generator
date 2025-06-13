import boto3
import json
import logging
from langchain_aws import ChatBedrock
from langchain.schema import HumanMessage, SystemMessage
from config import Config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        try:
            self.bedrock_client = boto3.client(
                'bedrock-runtime',
                aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
                region_name=Config.AWS_REGION
            )
            
            self.llm = ChatBedrock(
                client=self.bedrock_client,
                model_id=Config.BEDROCK_MODEL_ID,
                model_kwargs={
                    "max_tokens": 4000,
                    "temperature": 0.7
                }
            )
            logger.info("AI Service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize AI Service: {e}")
            raise
    
    def generate_presentation_structure(self, user_prompt: str) -> dict:
        """Generate scalable, beautifully formatted HTML presentation"""
        try:
            system_prompt = """
            You are an expert presentation designer. Create visually stunning, scalable presentations with beautiful colors and perfect centering.
            
            IMPORTANT: Analyze the content depth and create the APPROPRIATE number of slides (anywhere from 5 to 20+ slides based on topic complexity).
            
            Return ONLY a valid JSON object with this structure:
            {
                "title": "Presentation Title",
                "theme": "modern",
                "slides": [
                    {
                        "id": "slide-1",
                        "type": "title",
                        "html": "HTML_CONTENT_HERE"
                    }
                ]
            }
            
            DESIGN GUIDELINES:
            
            1. **Color Schemes** (rotate through these):
               - Ocean: bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-500, text-white
               - Sunset: bg-gradient-to-br from-orange-900 via-red-600 to-pink-500, text-white
               - Forest: bg-gradient-to-br from-green-900 via-emerald-700 to-teal-500, text-white
               - Royal: bg-gradient-to-br from-purple-900 via-violet-700 to-indigo-500, text-white
               - Corporate: bg-gradient-to-br from-gray-900 via-slate-700 to-blue-600, text-white
               - Warm: bg-gradient-to-br from-amber-900 via-orange-700 to-red-500, text-white
            
            2. **Layout Types** (vary throughout presentation):
               - Title slide: Full-screen centered with gradient background
               - Content slides: Split layouts, card-based designs
               - Image/chart slides: Large visual areas with side content
               - Quote/emphasis slides: Large centered text with decorative elements
               - List slides: Beautiful bullet points with icons
               - Conclusion slides: Call-to-action style
            
            3. **Visual Elements**:
               - Use gradients for backgrounds
               - Add subtle shadows and borders
               - Include decorative elements (circles, lines, shapes)
               - Use proper typography hierarchy
               - Perfect centering with flexbox
               - Consistent spacing
            
            4. **Slide Types Examples**:
            
            TITLE SLIDE:
            "<div class='h-full bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-500 flex flex-col items-center justify-center text-white relative overflow-hidden'><div class='absolute inset-0 bg-black bg-opacity-20'></div><div class='relative z-10 text-center space-y-8'><h1 class='text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200'>TITLE HERE</h1><div class='w-32 h-1 bg-gradient-to-r from-cyan-400 to-white mx-auto mb-6'></div><p class='text-2xl font-light text-cyan-100 max-w-2xl mx-auto leading-relaxed'>Subtitle description here</p></div><div class='absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent opacity-30'></div></div>"
            
            CONTENT SLIDE:
            "<div class='h-full bg-gradient-to-br from-purple-900 via-violet-700 to-indigo-500 p-12 flex flex-col'><div class='text-center mb-12'><h2 class='text-5xl font-bold text-white mb-4'>Slide Title</h2><div class='w-24 h-1 bg-gradient-to-r from-violet-400 to-purple-300 mx-auto'></div></div><div class='flex-1 grid grid-cols-2 gap-12 items-center'><div class='space-y-6'><div class='bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20'><h3 class='text-3xl font-semibold text-white mb-6'>Key Points</h3><ul class='space-y-4 text-xl text-white'><li class='flex items-center'><div class='w-3 h-3 bg-gradient-to-r from-violet-400 to-purple-300 rounded-full mr-4 flex-shrink-0'></div>First important point</li><li class='flex items-center'><div class='w-3 h-3 bg-gradient-to-r from-violet-400 to-purple-300 rounded-full mr-4 flex-shrink-0'></div>Second key insight</li><li class='flex items-center'><div class='w-3 h-3 bg-gradient-to-r from-violet-400 to-purple-300 rounded-full mr-4 flex-shrink-0'></div>Third crucial element</li></ul></div></div><div class='bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20 flex items-center justify-center'><p class='text-white text-xl font-light'>Chart/Visual Placeholder</p></div></div></div>"
            
            EMPHASIS SLIDE:
            "<div class='h-full bg-gradient-to-br from-orange-900 via-red-600 to-pink-500 flex items-center justify-center text-white relative overflow-hidden'><div class='absolute inset-0'><div class='absolute top-10 left-10 w-64 h-64 bg-white bg-opacity-5 rounded-full'></div><div class='absolute bottom-10 right-10 w-96 h-96 bg-white bg-opacity-5 rounded-full'></div></div><div class='relative z-10 text-center max-w-4xl mx-auto px-8'><h2 class='text-6xl font-bold mb-8 leading-tight'>Key Message Here</h2><div class='w-32 h-1 bg-gradient-to-r from-orange-300 to-pink-300 mx-auto mb-8'></div><p class='text-2xl font-light text-orange-100 leading-relaxed'>Supporting explanation or quote that emphasizes the main point beautifully</p></div></div>"
            
            5. **Content Scaling Rules**:
               - Simple topics: 5-8 slides
               - Medium complexity: 8-12 slides  
               - Complex topics: 12-20+ slides
               - Always include: Title, Introduction, Main Content (multiple), Key Insights, Conclusion
               - Add transition slides for topic changes
               - Include summary slides for complex sections
            
            6. **Typography & Spacing**:
               - Titles: text-6xl to text-7xl, font-bold or font-extrabold
               - Subtitles: text-2xl to text-3xl, font-light or font-medium
               - Body text: text-xl to text-2xl, proper line-height
               - Perfect vertical and horizontal centering
               - Consistent padding and margins
               - Use space-y-* for vertical spacing
            
            Generate slides that are:
            - Visually stunning with gradients and effects
            - Perfectly centered and balanced
            - Scalable based on content complexity
            - Professional yet creative
            - Easy to read with proper contrast
            - Consistent theme throughout
            """
            
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=f"Create a comprehensive presentation about: {user_prompt}")
            ]
            
            response = self.llm.invoke(messages)
            content = response.content.strip()
            
            if content.startswith('```json'):
                content = content.replace('```json', '').replace('```', '').strip()
            
            parsed_content = json.loads(content)
            
            # Ensure totalSlides matches actual slides
            if 'slides' in parsed_content:
                parsed_content['totalSlides'] = len(parsed_content['slides'])
            
            return parsed_content
            
        except Exception as e:
            logger.error(f"Error generating presentation: {e}")
            raise