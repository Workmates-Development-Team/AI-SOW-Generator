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
        """Generate structured presentation data for frontend styling"""
        try:
            system_prompt = """
            You are a presentation content generator. Create structured content that will be styled in the frontend.
            Return ONLY a valid JSON object with this structure:
            {
                "title": "Presentation Title",
                "theme_suggestions": ["modern", "corporate", "creative", "minimal"],
                "color_palette": ["#1f2937", "#3b82f6", "#ef4444", "#10b981"],
                "slides": [
                    {
                        "id": "slide-1",
                        "type": "title",
                        "title": "Main Title",
                        "subtitle": "Subtitle text",
                        "layout": "center",
                        "elements": [
                            {
                                "id": "element-1",
                                "type": "text",
                                "content": "Main Title",
                                "style": "title",
                                "position": {"x": 50, "y": 30},
                                "size": {"width": 80, "height": 20}
                            },
                            {
                                "id": "element-2", 
                                "type": "text",
                                "content": "Subtitle",
                                "style": "subtitle",
                                "position": {"x": 50, "y": 60},
                                "size": {"width": 80, "height": 15}
                            }
                        ]
                    },
                    {
                        "id": "slide-2",
                        "type": "content",
                        "title": "Content Slide",
                        "layout": "left-right",
                        "elements": [
                            {
                                "id": "element-3",
                                "type": "text",
                                "content": "Slide Title",
                                "style": "heading",
                                "position": {"x": 10, "y": 10},
                                "size": {"width": 80, "height": 15}
                            },
                            {
                                "id": "element-4",
                                "type": "bullet-list",
                                "content": ["Point 1", "Point 2", "Point 3"],
                                "style": "bullets",
                                "position": {"x": 10, "y": 30},
                                "size": {"width": 45, "height": 60}
                            },
                            {
                                "id": "element-5",
                                "type": "image-placeholder",
                                "content": "Chart or Image",
                                "style": "placeholder",
                                "position": {"x": 60, "y": 30},
                                "size": {"width": 35, "height": 60}
                            }
                        ]
                    }
                ]
            }
            Create the number of slides specified by the user with varied layouts and content types.
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