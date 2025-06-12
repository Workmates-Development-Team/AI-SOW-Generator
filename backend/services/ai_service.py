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
    
    def generate_ppt_content(self, user_prompt: str) -> dict:
        """Generate PowerPoint content based on user prompt"""
        try:
            system_prompt = """
            You are a PowerPoint presentation generator. Create a structured presentation based on the user's prompt.
            Return ONLY a valid JSON object with the following structure (no markdown formatting):
            {
                "title": "Presentation Title",
                "slides": [
                    {
                        "title": "Slide Title",
                        "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
                        "slide_type": "title"
                    },
                    {
                        "title": "Content Slide Title",
                        "content": ["Main point 1", "Main point 2", "Main point 3"],
                        "slide_type": "content"
                    }
                ]
            }
            Make sure to create engaging, informative content with 3-7 slides total.
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
            logger.info(f"Generated presentation with {len(parsed_content.get('slides', []))} slides")
            
            return parsed_content
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")
            logger.error(f"Raw content: {content}")
            raise ValueError("Failed to parse AI response as JSON")
        except Exception as e:
            logger.error(f"Error generating PPT content: {e}")
            raise