import boto3
import json
import logging
from langchain_aws import ChatBedrock
from langchain.schema import HumanMessage, SystemMessage
from config import ConfigAI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        try:
            self.bedrock_client = boto3.client(
                'bedrock-runtime',
                aws_access_key_id=ConfigAI.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=ConfigAI.AWS_SECRET_ACCESS_KEY,
                region_name=ConfigAI.AWS_REGION
            )
            
            self.llm = ChatBedrock(
                client=self.bedrock_client,
                model_id=ConfigAI.BEDROCK_MODEL_ID,
                model_kwargs={
                    "max_tokens": 20000,
                    "temperature": 0.5
                }
            )
            logger.info("AI Service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize AI Service: {e}")
            raise
    
    def generate_sow_document(self, user_prompt) -> dict:
        try:
            return self._generate_sow_structure({'projectDescription': user_prompt})
        except Exception as e:
            logger.error(f"Error generating: {e}")
            raise

    def _generate_sow_structure(self, sow_fields) -> dict:
        system_prompt = """
        You are an expert business consultant creating professional Statement of Work (SOW) documents. 
        Create a comprehensive SOW with structured markdown content for each section.
        
        CRITICAL JSON FORMATTING RULES:
        1. The response MUST be a single, valid JSON object
        2. NO additional text, markdown, or code blocks before or after the JSON
        3. ALL strings must be properly escaped and enclosed in double quotes
        4. NO trailing commas
        5. Content should be in clean markdown format
        
        TEMPLATE MAPPING REQUIREMENTS:
        You MUST create slides with these exact template mappings:
        - template: "cover" -> Cover page content
        - template: "scope" -> Scope of Work content  
        - template: "deliverables" -> Deliverables content
        - template: "generic" -> For other content like objectives, timeline, budget, etc.
        
        REQUIRED SOW STRUCTURE (in this exact order with template assignments):
        1. Cover/Title Page (template: "cover")
        2. Introduction (template: "generic") 
        3. Objectives (template: "generic")
        4. Scope of Work (template: "scope")
        5. Deliverables (template: "deliverables") -- ALWAYS include this slide
        6. Timeline (template: "generic")
        7. Budget (template: "generic")
        8. Payment Terms (template: "generic")
        9. Acceptance Criteria (template: "generic")
        10. Assumptions and Constraints (template: "generic")
        11. Support Services (template: "generic") -- ONLY include if provided by user
        12. Special Legal Terms (template: "generic") -- ONLY include if provided by user
        15. Termination (template: "generic") -- ONLY include if provided by user
        
        CONTENT STRUCTURE:
        Each slide should have:
        - title: Main heading for the slide
        - content: Markdown formatted content
        - contentType: Type of content (text, list, table, etc.)
        
        For different content types, use appropriate markdown:
        - Lists: Use markdown bullet points (- item) or numbered lists (1. item)
        - Tables: Use markdown table syntax
        - Text: Use markdown paragraphs and formatting
        
        Required JSON structure:
        {{
          "title": "[Project Title from Project Description]",
          "template": "sow",
          "slides": [
            {{
              "id": "string",
              "type": "string", 
              "template": "cover|scope|deliverables|generic",
              "title": "string",
              "content": "markdown_content_string",
              "contentType": "text|list|table|mixed"
            }}
          ],
          "totalSlides": number
        }}
        
        SAMPLE SLIDE CONTENT:
        
        COVER SLIDE:
        {{
          "id": "slide-1",
          "type": "cover",
          "template": "cover",
          "title": "[Project Title]",
          "content": "**Prepared for:** [Client Name]\n\n**Date:** [Current Date]\n\n",
          "contentType": "text"
        }}
        
        SCOPE OF WORK SLIDE:
        {{
          "id": "slide-4",
          "type": "scope",
          "template": "scope",
          "title": "Scope of Work",
          "content": "- [Specific scope item 1 based on prompt]\n- [Specific scope item 2 based on prompt]\n- [Specific scope item 3 based on prompt]\n- [Specific scope item 4 based on prompt]",
          "contentType": "list"
        }}
        
        DELIVERABLES SLIDE:
        {{
          "id": "slide-5",
          "type": "deliverables",
          "template": "deliverables",
          "title": "Deliverables",
          "content": "| Deliverable | Description | Due Date | Owner | [Deliverable 1] | [Description based on prompt] | Week 1 | Project Manager |\n| [Deliverable 2] | [Description based on prompt] | Week 3 | Technical Lead |",
          "contentType": "table"
        }}
        
        Create professional, business-appropriate content for each section.
        Make content specific to the user's request while maintaining SOW structure.
        Use clean markdown formatting without HTML tags.
        """

        if isinstance(sow_fields, dict):
            prompt_lines = []
            if sow_fields.get('projectDescription'):
                prompt_lines.append(f"Project Description: {sow_fields['projectDescription']}")
            if sow_fields.get('requirements'):
                prompt_lines.append(f"Client Requirements: {sow_fields['requirements']}")
            if sow_fields.get('duration'):
                prompt_lines.append(f"Project Duration: {sow_fields['duration']}")
            if sow_fields.get('budget'):
                prompt_lines.append(f"Budget: {sow_fields['budget']}")
            if sow_fields.get('supportService'):
                prompt_lines.append(f"Support Service: {sow_fields['supportService']}")
            if sow_fields.get('legalTerms'):
                prompt_lines.append(f"Special Legal Terms: {sow_fields['legalTerms']}")
            if sow_fields.get('deliverables'):
                prompt_lines.append(f"Deliverables: {sow_fields['deliverables']}")
            if sow_fields.get('terminationClause'):
                prompt_lines.append(f"Termination Clause: {sow_fields['terminationClause']}")
            structured_prompt = '\n'.join(prompt_lines)
        else:
            structured_prompt = str(sow_fields)
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Create a professional Statement of Work for: {structured_prompt}")
        ]
        return self._process_ai_response(messages)

    def _process_ai_response(self, messages) -> dict:
        response = self.llm.invoke(messages)
        content = response.content.strip()
        
        if content.startswith('```json'):
            content = content.replace('```json', '').replace('```', '').strip()
        elif content.startswith('```'):
            content = content.replace('```', '').strip()
        
        parsed_content = json.loads(content)
        
        if 'slides' in parsed_content:
            parsed_content['totalSlides'] = len(parsed_content['slides'])

        if len(parsed_content['slides']) == 0:
            raise ValueError("No slides generated")
        
        if 'slides' not in parsed_content:
            raise ValueError("Invalid presentation structure")

        for i, slide in enumerate(parsed_content['slides']):
            if not isinstance(slide, dict):
                logger.warning(f"Invalid slide {i}, skipping")
                continue
            slide['id'] = slide.get('id', f'slide-{i+1}')
            slide['type'] = slide.get('type', 'content')
            slide['template'] = slide.get('template', 'generic')
            slide['title'] = slide.get('title', f'Slide {i+1}')
            slide['content'] = slide.get('content', '')
            slide['contentType'] = slide.get('contentType', 'text')
        
        print(f"Generated {len(parsed_content['slides'])} slides successfully")
        return parsed_content