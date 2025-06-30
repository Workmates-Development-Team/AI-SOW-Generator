import boto3
import json
import logging
from langchain_aws import ChatBedrock
from langchain.schema import HumanMessage, SystemMessage
import re
import json
import logging
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
                model_id='anthropic.claude-3-5-haiku-20241022-v1:0',#ConfigAI.BEDROCK_MODEL_ID,
                model_kwargs={
                    "max_tokens": 30000,
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
        - template: "signature" -> For the final signature page
           
        REQUIRED SOW STRUCTURE (in this exact order with template assignments):
        1. Cover/Title Page (template: "cover")
        2. Introduction (template: "generic") -- The title should ALWAYS be just 'Introduction'
        3. Objectives (template: "generic") -- The title should ALWAYS be just 'Objectives'
        4. Scope of Work (template: "scope")
        5. Deliverables (template: "deliverables") -- ALWAYS include this slide
        6. Timeline (template: "generic")
        7. Budget (template: "generic")
        8. Payment Terms (template: "generic")
        9. Acceptance Criteria (template: "generic")
        10. Assumptions and Constraints (template: "generic")
        11. Support Services (template: "generic") -- ALWAYS include this slide
        12. General Terms (template: "generic") -- The title should ALWAYS be just 'General Terms' and ALWAYS include this slide
        13. Project Terms (template: "generic") -- The title should ALWAYS be just 'Project Terms' and ALWAYS include this slide
        14. Termination (template: "generic") -- The title should ALWAYS be just 'Termination' and ALWAYS include this slide
        15. Signature Page (template: "signature") -- The title should ALWAYS be just 'Signature' and the content should be ONLY the client name
           
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
        {
          "title": "[Project Title from Project Description]",
          "template": "sow",
          "slides": [
            {
              "id": "string",
              "type": "string", 
              "template": "cover|scope|deliverables|generic",
              "title": "string",
              "content": "markdown_content_string",
              "contentType": "text|list|table|mixed"
            }
          ],
          "totalSlides": number
        }
           
        COVER SLIDE STRICT RULE:
        The cover slide's content field MUST contain ONLY the line: **Prepared for:** [Client Name].
        Do NOT include any other text, such as title, date, 'Statement of Work', 'Confidential Document', or anything else. No blank lines, no extra formatting, no additional information. Just the 'Prepared for' line.
        
        SAMPLE COVER SLIDE:
        {
          "id": "slide-1",
          "type": "cover",
          "template": "cover",
          "title": "[Project Title]",
          "content": "**Prepared for:** [Client Name]",
          "contentType": "text"
        }
           
        SCOPE OF WORK SLIDE:
        {
          "id": "slide-4",
          "type": "scope",
          "template": "scope",
          "title": "",
          "content": "1. **Phase 1: Planning & Analysis**  \n   1.1 Objectives  \n     • Define project scope  \n   1.2 Key Activities  \n     • Stakeholder meetings  \n   1.3 Scope Items  \n     a. **Requirements Gathering**  \n        – Interview stakeholders  \n2. **Phase 2: Implementation**  \n   2.1 Objectives  \n     • Develop solution  \n   2.2 Key Activities  \n     • Coding, testing  \n   2.3 Scope Items  \n     a. **Module Development**  \n        – Build core modules  \n3. **Phase 3: Delivery**  \n   ...  \n   (Continue structure as needed based on context)",
          "contentType": "mixed"
        }
           
        DELIVERABLES SLIDE:
        {
          "id": "slide-5",
          "type": "deliverables",
          "template": "deliverables",
          "title": "", 
          "content": "1. **Phase 1: Discovery and Planning**  \n   1.1 Objectives  \n     • Understand needs  \n   1.2 Key Activities  \n     • Gather requirements  \n   1.3 Deliverables  \n     a. **Requirements Document**  \n        – Description placeholder  \n2. **Phase 2: Development**  \n   2.1 Objectives  \n     • Build modules  \n   2.2 Deliverables  \n     a. **Module Example**  \n        – Feature description  \n3. **Phase 3: Integration**  \n   ...  \n   (Continue structure as needed based on context)",
          "contentType": "mixed"
        }

        TIMELINE SLIDE:
        {
          "id": "slide-6",
          "type": "timeline",
          "template": "generic",
          "title": "Project Timeline",
          "content": "| Phase | Start Date | End Date | Milestone |\n|-------|------------|----------|-----------|\n| Planning & Analysis | 2024-06-01 | 2024-06-07 | Requirements Complete |\n| Implementation     | 2024-06-08 | 2024-07-15 | MVP Delivery         |\n| Delivery           | 2024-07-16 | 2024-07-31 | Final Handover       |",
          "contentType": "table"
        }
           
        Create professional, business-appropriate content for each section.
        Make content specific to the user's request while maintaining SOW structure.
        For the Timeline slide, always use a markdown table format for the content.
        Use clean markdown formatting.
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
        try:
            parsed_content = self._extract_json_from_response(content)
        except ValueError as e:
            logger.error(f"Failed to extract JSON from LLM response: {e}")
            # Log the raw response for debugging
            logger.debug(f"Raw LLM response: {content}")
            raise
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

    @staticmethod
    def _extract_json_from_response(content: str) -> dict:
        """
        Robustly extract JSON from LLM response, handling various formats.
        """
        content = content.strip()
        # Remove markdown code blocks if present
        if content.startswith('```json'):
            content = content.replace('```json', '').replace('```', '').strip()
        elif content.startswith('```'):
            content = content.replace('```', '').strip()
        # Try to find JSON object boundaries
        try:
            # Method 1: Look for the first { and try to parse from there
            start_idx = content.find('{')
            if start_idx != -1:
                # Find the matching closing brace
                brace_count = 0
                end_idx = start_idx
                for i in range(start_idx, len(content)):
                    if content[i] == '{':
                        brace_count += 1
                    elif content[i] == '}':
                        brace_count -= 1
                        if brace_count == 0:
                            end_idx = i + 1
                            break
                json_str = content[start_idx:end_idx]
                return json.loads(json_str)
        except (json.JSONDecodeError, IndexError):
            pass
        # Method 2: Use regex to find JSON-like structure
        try:
            json_pattern = r'\{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*\}'
            matches = re.findall(json_pattern, content, re.DOTALL)
            for match in matches:
                try:
                    return json.loads(match)
                except json.JSONDecodeError:
                    continue
        except Exception:
            pass
        # Method 3: Try parsing the entire content as JSON (fallback)
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            raise ValueError(f"Could not extract valid JSON from response: {content[:200]}...")