import boto3
from langchain_aws import ChatBedrock
from langchain.schema import HumanMessage, SystemMessage
from config import Config

class AIService:
    def __init__(self):
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
    
    def generate_ppt_content(self, user_prompt: str):
        system_prompt = """
        You are a PowerPoint presentation generator. Create a structured presentation based on the user's prompt.
        Return a JSON object with the following structure:
        {
            "title": "Presentation Title",
            "slides": [
                {
                    "title": "Slide Title",
                    "content": ["Bullet point 1", "Bullet point 2"],
                    "slide_type": "title|content|conclusion"
                }
            ]
        }
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ]
        
        response = self.llm.invoke(messages)
        return response.content