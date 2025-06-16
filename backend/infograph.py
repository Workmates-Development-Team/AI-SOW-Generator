import boto3
import json
import logging
import base64
import uuid
import os
from datetime import datetime
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
                region_name=ConfigInfo.AWS_REGION_INFO
            )
            
            self.llm = ChatBedrock(
                client=self.bedrock_client,
                model_id=ConfigInfo.BEDROCK_MODEL_ID_INFO,
                model_kwargs={
                    "max_tokens": 16000,
                    "temperature": 0.7
                }
            )
            
            # Use consistent directory structure
            self.images_dir = os.path.join(os.path.dirname(__file__), "public")
            os.makedirs(self.images_dir, exist_ok=True)
            
            logger.info("Info-graph service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Info-graph Service: {e}")
            raise

    def generate_image_prompt(self, presentation_data: dict) -> str:
        """Generate a detailed prompt for image generation based on presentation content"""
        try:
            system_prompt = """
            Based on the presentation data provided, create a detailed, visual prompt for generating an infographic image.
            The prompt should describe:
            - Overall theme and color scheme matching the presentation
            - Key visual elements (charts, icons, diagrams)
            - Layout and composition (professional infographic style)
            - Text placement and hierarchy
            - Modern, clean design aesthetic
            - Data visualization elements
            
            Return only the image generation prompt, nothing else.
            """
            
            # Extract meaningful content from slides
            presentation_summary = {
                "title": presentation_data.get("title", ""),
                "key_topics": [],
                "theme": presentation_data.get("theme", "modern")
            }
            
            # Extract key content from slides
            for slide in presentation_data.get("slides", []):
                if slide.get("type") != "infograph":
                    html_content = slide.get("html", "")
                    # Simple text extraction from HTML
                    import re
                    text_content = re.sub('<[^<]+?>', '', html_content)
                    text_content = ' '.join(text_content.split())[:300]
                    if text_content.strip():
                        presentation_summary["key_topics"].append(text_content)
            
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=f"Create an infographic image prompt for: {json.dumps(presentation_summary)}")
            ]
            
            response = self.llm.invoke(messages)
            return response.content.strip()
            
        except Exception as e:
            logger.error(f"Error generating image prompt: {e}")
            return f"Professional infographic about {presentation_data.get('title', 'presentation topics')}, modern design, clean layout, data visualization, charts and graphs"

    def generate_image_with_bedrock(self, prompt: str) -> str:
        """Generate image using AWS Bedrock and save to public directory"""
        try:
            # Enhanced prompt for better infographic generation
            enhanced_prompt = f"{prompt}, professional infographic design, clean modern layout, data visualization, charts and graphs, high quality, 4K resolution, corporate style, readable text, clear hierarchy"
            
            body = {
                "text_prompts": [
                    {
                        "text": enhanced_prompt,
                        "weight": 1.0
                    }
                ],
                "cfg_scale": 10,
                "seed": 0,
                "steps": 50,
                "width": 1024,
                "height": 1024
            }
            
            response = self.bedrock_client.invoke_model(
                modelId=ConfigInfo.BEDROCK_MODEL_ID_INFO,
                body=json.dumps(body)
            )
            
            response_body = json.loads(response.get('body').read())
            image_data = response_body['artifacts'][0]['base64']
            
            # Use the utility function for consistent saving
            
            image_url = save_base64_image_to_public(image_data, "png")
            
            logger.info(f"Generated and saved infographic image: {image_url}")
            return image_url
            
        except Exception as e:
            logger.error(f"Error generating image with Bedrock: {e}")
            # Return a placeholder path instead of raising
            return "/public/placeholder-infographic.png"

    def generate_infograph(self, presentation_data: dict) -> dict:
        try:
            # Generate image prompt and image
            image_prompt = self.generate_image_prompt(presentation_data)
            logger.info(f"Generated image prompt: {image_prompt[:100]}...")
            
            image_url = self.generate_image_with_bedrock(image_prompt)
            
            # Generate structured infographic data
            system_prompt = """
            You are an expert infographic designer. Based on the presentation data provided,
            create a structured description of key insights that complement the generated image.
            
            Return a JSON object with this structure:
            {
              "title": "Key Insights",
              "sections": [
                {
                  "title": "Section Title",
                  "content": "Brief, impactful content",
                  "visual_type": "highlight"
                }
              ],
              "description": "Brief description of the infographic content",
              "summary": "One-line summary of key takeaway"
            }
            
            Keep sections concise and impactful. Maximum 4 sections.
            """

            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=f"Create infographic insights for: {json.dumps(presentation_data)}")
            ]

            response = self.llm.invoke(messages)
            content = response.content.strip()

            # Clean JSON response
            if content.startswith('```json'):
                content = content.replace('```json', '').replace('```', '').strip()
            elif content.startswith('```'):
                content = content.replace('```', '').strip()

            try:
                parsed_content = json.loads(content)
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                parsed_content = {
                    "title": "Key Insights",
                    "sections": [
                        {
                            "title": "Generated Insights",
                            "content": "AI-generated infographic with key presentation insights",
                            "visual_type": "highlight"
                        }
                    ],
                    "description": "Visual summary of presentation content"
                }

            # Add the generated image URL
            parsed_content['image_url'] = image_url
            parsed_content['title'] = f"Key Insights: {presentation_data.get('title', 'Presentation')}"

            logger.info(f"Generated infographic with image: {image_url}")
            return parsed_content

        except Exception as e:
            logger.error(f"Error generating infographic: {e}")
            return {
                "title": f"Insights: {presentation_data.get('title', 'Presentation')}",
                "sections": [
                    {
                        "title": "Error",
                        "content": "Unable to generate infographic at this time",
                        "visual_type": "error"
                    }
                ],
                "image_url": "/public/placeholder-infographic.png",
                "description": "Infographic generation temporarily unavailable"
            }