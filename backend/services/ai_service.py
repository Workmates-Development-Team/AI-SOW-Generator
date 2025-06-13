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
                    "max_tokens": 8000,
                    "temperature": 0.7
                }
            )
            logger.info("AI Service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize AI Service: {e}")
            raise
    
    def generate_presentation_structure(self, user_prompt: str) -> dict:
        """Generate HTML-based presentation data for React frontend"""
        try:
            system_prompt = """
            You are a presentation content generator. Create structured content with HTML that uses Tailwind CSS classes.
            Return ONLY a valid JSON object with this structure:
            {
                "title": "Presentation Title",
                "theme": "modern",
                "slides": [
                    {
                        "id": "slide-1",
                        "type": "title",
                        "html": "<div class='flex flex-col items-center justify-center h-full text-center'><h1 class='text-6xl font-bold text-gray-800 mb-6'>Main Title</h1><p class='text-2xl text-gray-600'>Subtitle description</p></div>"
                    },
                    {
                        "id": "slide-2", 
                        "type": "content",
                        "html": "<div class='p-8 h-full'><h2 class='text-4xl font-bold text-gray-800 mb-8'>Slide Title</h2><div class='grid grid-cols-2 gap-8 h-3/4'><div class='space-y-4'><ul class='space-y-3 text-xl text-gray-700'><li class='flex items-start'><span class='w-2 h-2 bg-blue-500 rounded-full mt-3 mr-4 flex-shrink-0'></span>First key point</li><li class='flex items-start'><span class='w-2 h-2 bg-blue-500 rounded-full mt-3 mr-4 flex-shrink-0'></span>Second important point</li><li class='flex items-start'><span class='w-2 h-2 bg-blue-500 rounded-full mt-3 mr-4 flex-shrink-0'></span>Third crucial point</li></ul></div><div class='bg-gray-100 rounded-lg flex items-center justify-center'><p class='text-gray-500 text-lg'>Chart/Image Placeholder</p></div></div></div>"
                    },
                    {
                        "id": "slide-3",
                        "type": "two-column",
                        "html": "<div class='p-8 h-full'><h2 class='text-4xl font-bold text-gray-800 mb-8'>Two Column Layout</h2><div class='grid grid-cols-2 gap-12 h-3/4'><div class='space-y-6'><h3 class='text-2xl font-semibold text-gray-700 mb-4'>Left Column</h3><p class='text-lg text-gray-600 leading-relaxed'>Content for left side with detailed explanation and key insights.</p></div><div class='space-y-6'><h3 class='text-2xl font-semibold text-gray-700 mb-4'>Right Column</h3><p class='text-lg text-gray-600 leading-relaxed'>Content for right side with supporting information and examples.</p></div></div></div>"
                    },
                    {
                        "id": "slide-4",
                        "type": "full-content",
                        "html": "<div class='p-8 h-full flex flex-col'><h2 class='text-4xl font-bold text-gray-800 mb-8 text-center'>Key Insights</h2><div class='flex-1 flex flex-col justify-center space-y-8'><div class='bg-blue-50 p-6 rounded-lg'><h3 class='text-2xl font-semibold text-blue-800 mb-4'>Important Point 1</h3><p class='text-gray-700 text-lg'>Detailed explanation of the first key insight with supporting details.</p></div><div class='bg-green-50 p-6 rounded-lg'><h3 class='text-2xl font-semibold text-green-800 mb-4'>Important Point 2</h3><p class='text-gray-700 text-lg'>Detailed explanation of the second key insight with supporting details.</p></div></div></div>"
                    },
                    {
                        "id": "slide-5",
                        "type": "closing",
                        "html": "<div class='flex flex-col items-center justify-center h-full text-center p-8'><h1 class='text-5xl font-bold text-gray-800 mb-6'>Thank You</h1><p class='text-xl text-gray-600 mb-8'>Questions & Discussion</p><div class='w-24 h-1 bg-blue-500 rounded'></div></div>"
                    }
                ]
            }
            
            Guidelines for HTML generation:
            - Use Tailwind CSS classes exclusively
            - Ensure responsive design with appropriate spacing
            - Use semantic HTML structure
            - Include proper heading hierarchy (h1, h2, h3)
            - Use consistent color scheme (grays, blues, greens)
            - Make layouts flexible and readable
            - Include visual elements like bullets, dividers, backgrounds
            - Ensure text is properly sized and spaced for presentations
            - Use grid and flexbox for layouts
            - Add subtle backgrounds and borders for visual appeal
            
            Create 3-7 slides based on the content complexity, with varied layouts including:
            - Title slide
            - Content slides with bullet points
            - Two-column layouts
            - Full-content slides
            - Closing slide
            """
            
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=f"Create a presentation about: {user_prompt}")
            ]
            
            response = self.llm.invoke(messages)
            content = response.content.strip()
            
            if content.startswith('```json'):
                content = content.replace('```json', '').replace('```', '').strip()
            
            parsed_content = json.loads(content)
            return parsed_content
            
        except Exception as e:
            logger.error(f"Error generating presentation: {e}")
            raise