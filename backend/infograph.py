import boto3
import json
import logging
import os
from langchain_aws import ChatBedrock
from langchain.schema import HumanMessage, SystemMessage
from config import ConfigInfo
from save_image import save_base64_image_to_public

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class InfoService:
    def __init__(self):
        try:
            self.bedrock_client = boto3.client(
                'bedrock-runtime',
                aws_access_key_id=ConfigInfo.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=ConfigInfo.AWS_SECRET_ACCESS_KEY,
                region_name= 'us-west-2' 
            )
            
            self.llm = ChatBedrock(
                client=self.bedrock_client,
                model_id="stability.sd3-5-large-v1:0",   
                model_kwargs={
                    "max_tokens": 16000,
                    "temperature": 0.7
                }
            )
            
            self.images_dir = os.path.join(os.path.dirname(__file__), "public")
            if not os.path.exists(self.images_dir):
                raise FileNotFoundError(f"Directory {self.images_dir} does not exist.")
            
            logger.info("Info-graph service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Info-graph Service: {e}")
            raise

    def generate_infograph(self, prompt: str) -> str:
        try:
            enhanced_prompt = f"{prompt}, professional infographic design, clean modern layout, data visualization, charts and graphs, high quality, corporate style, minimal text, only include labels for data points and axes, focus on visual data representation, clear hierarchy, no gibberish text, no cluttering and no distortions"
            
            body = {
                "prompt": enhanced_prompt,
                "mode": "text-to-image",
                "aspect_ratio": "16:9",
                "output_format": "png"
            }
            
            response = self.bedrock_client.invoke_model(
                modelId="stability.sd3-5-large-v1:0",
                body=json.dumps(body)
            )
            
            raw = response["body"].read()
            payload = json.loads(raw)
            images = payload.get("images", [])

            if not images:
                raise Exception("No image returned from model")

            b64_png = images[0]

            image_url = save_base64_image_to_public(b64_png, ext="png")

            return image_url
            
        except Exception as e:
            logger.error(f"Error generating image with Bedrock: {e}")
            raise
