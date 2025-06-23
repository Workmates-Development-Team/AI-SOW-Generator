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
                    "max_tokens": 16000,
                    "temperature": 0.7
                }
            )
            logger.info("AI Service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize AI Service: {e}")
            raise
    
    def generate_presentation_structure(self, user_prompt) -> dict:
        try:
            # If user_prompt is a dict, treat as SOW structured input
            if isinstance(user_prompt, dict):
                return self._generate_sow_structure(user_prompt)
            # Detect if this is a SOW-related request (legacy string prompt)
            sow_keywords = ['statement of work', 'sow', 'project proposal', 'work agreement', 'project scope', 'deliverables', 'timeline', 'budget', 'payment terms']
            is_sow_request = any(keyword in user_prompt.lower() for keyword in sow_keywords)
            if is_sow_request:
                return self._generate_sow_structure({'projectDescription': user_prompt})
            else:
                return self._generate_standard_presentation(user_prompt)
        except Exception as e:
            logger.error(f"Error generating presentation: {e}")
            raise

    def _generate_sow_structure(self, sow_fields) -> dict:
        system_prompt = """
        You are an expert business consultant creating professional Statement of Work (SOW) documents. 
        Create a comprehensive SOW with proper business structure and professional content.
        
        CRITICAL JSON FORMATTING RULES:
        1. The response MUST be a single, valid JSON object
        2. NO additional text, markdown, or code blocks before or after the JSON
        3. ALL strings must be properly escaped and enclosed in double quotes
        4. NO trailing commas
        5. ALL HTML content must be properly escaped within the JSON strings
        
        TEMPLATE MAPPING REQUIREMENTS:
        You MUST create slides with these exact template mappings:
        - template: "cover" -> Uses background image 1.png (Cover page)
        - template: "scope" -> Uses background image 2.png (Scope of Work)  
        - template: "deliverables" -> Uses background image 3.png (Deliverables)
        - template: "generic" -> Uses background image 4.png (For other content like objectives, timeline, budget, etc.)
        
        REQUIRED SOW STRUCTURE (in this exact order with template assignments):
        1. Cover/Title Page (template: "cover")
        2. Introduction (template: "generic") 
        3. Objectives (template: "generic")
        4. Scope of Work (template: "scope")
        5. Deliverables (template: "deliverables")
        6. Timeline (template: "generic")
        7. Budget (template: "generic")
        8. Payment Terms (template: "generic")
        9. Acceptance Criteria (template: "generic")
        10. Assumptions and Constraints (template: "generic")
        11. Support Services (template: "generic")
        12. General Terms (template: "generic")
        13. Project Terms (template: "generic")
        14. Termination (template: "generic")
        15. Signature Page (template: "generic")
        
        HTML STRUCTURE REQUIREMENTS:
        - EVERY slide MUST start with <div id="slide-content">
        - Use minimal HTML as text will be overlaid on template images
        - Focus on clean, readable text content
        - Use these standardized IDs for proper positioning:
          - id="slide-title" - Main headings
          - id="slide-subtitle" - Section headings  
          - id="slide-list" - Bullet points and lists
          - id="slide-table" - Data tables
          - id="slide-description" - Body text
          - id="slide-highlight" - Important notes
        
        Required JSON structure:
        {
          "title": "Statement of Work (SOW)",
          "theme": "sow", 
          "template": "sow",
          "slides": [
            {
              "id": "string",
              "type": "string", 
              "template": "cover|scope|deliverables|generic",
              "html": "string"
            }
          ],
          "totalSlides": 15
        }
        
        SAMPLE SOW SLIDES WITH TEMPLATES:
        
        COVER SLIDE (template: "cover"):
        <div id="slide-content">
          <h1 id="slide-title">Statement of Work (SOW)</h1>
          <h2 id="slide-subtitle">[Project Name from prompt]</h2>
          <div id="slide-description">
            <p>Prepared for: [Client Name]</p>
            <p>Date: June 23, 2025</p>
            <p>Version: 1.0</p>
          </div>
        </div>
        
        SCOPE OF WORK SLIDE (template: "scope"):
        <div id="slide-content">
          <h1 id="slide-title">Scope of Work</h1>
          <ul id="slide-list">
            <li>[Specific scope item 1 based on prompt]</li>
            <li>[Specific scope item 2 based on prompt]</li>
            <li>[Specific scope item 3 based on prompt]</li>
            <li>[Specific scope item 4 based on prompt]</li>
          </ul>
          <div id="slide-highlight">
            <p>This project will deliver [specific deliverable based on prompt]</p>
          </div>
        </div>
        
        DELIVERABLES SLIDE (template: "deliverables"):
        <div id="slide-content">
          <h1 id="slide-title">Deliverables</h1>
          <table id="slide-table">
            <thead>
              <tr>
                <th>Deliverable</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>[Deliverable 1]</td>
                <td>[Description based on prompt]</td>
                <td>Week 1</td>
                <td>Project Manager</td>
              </tr>
              <tr>
                <td>[Deliverable 2]</td>
                <td>[Description based on prompt]</td>
                <td>Week 3</td>
                <td>Technical Lead</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        GENERIC TEMPLATE SLIDES (template: "generic"):
        <div id="slide-content">
          <h1 id="slide-title">[Section Title]</h1>
          <div id="slide-description">
            <p>[Content based on prompt and section requirements]</p>
          </div>
          <ul id="slide-list">
            <li>[Relevant bullet point 1]</li>
            <li>[Relevant bullet point 2]</li>
          </ul>
        </div>
        
        Create professional, business-appropriate content for each section.
        Make content specific to the user's request while maintaining SOW structure.
        Ensure each slide has the correct template assignment for proper background image mapping.
        """
        # Compose a structured prompt from all fields
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
            structured_prompt = '\n'.join(prompt_lines)
        else:
            structured_prompt = str(sow_fields)
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Create a professional Statement of Work for: {structured_prompt}")
        ]
        return self._process_ai_response(messages)

    def _generate_standard_presentation(self, user_prompt: str) -> dict:
        system_prompt = """
        You are an expert presentation designer. Create comprehensive presentations with structured HTML, standardized IDs, data tables, and appropriate content.
        
        IMPORTANT: Analyze the content depth and create the APPROPRIATE number of slides (as many slides as requested by the user).
        
        CRITICAL JSON FORMATTING RULES:
        1. The response MUST be a single, valid JSON object
        2. NO additional text, markdown, or code blocks before or after the JSON
        3. NO comments within the JSON
        4. ALL strings must be properly escaped and enclosed in double quotes
        5. NO trailing commas
        6. NO single quotes for strings
        7. ALL HTML content must be properly escaped within the JSON strings
        
        CRITICAL HTML STRUCTURE REQUIREMENTS:
        - EVERY slide's HTML content MUST start with <div id="slide-content">
        - ALL content must be wrapped inside the slide-content div
        - This wrapper is essential for template styling to work properly
        - Never generate HTML without the slide-content wrapper
        
        STANDARDIZED HTML ID CONVENTIONS (MUST USE THESE EXACT IDs):
        - id="slide-content" - Main content area (div) - REQUIRED: ALL slides MUST start with <div id="slide-content">
        - id="slide-title" - Main slide title (h1/h2)
        - id="slide-subtitle" - Subtitle or secondary heading (h2/h3)
        - id="slide-list" - Lists (ul/ol)
        - id="slide-table" - Data tables (table)
        - id="slide-image" - Images (img)
        - id="slide-quote" - Quotes or emphasis (blockquote/div)
        - id="slide-description" - Descriptions or captions (p)
        - id="slide-header" - Header section (header/div)
        - id="slide-footer" - Footer section (footer/div)
        - id="slide-highlight" - Highlighted content (div/span)
        - id="slide-stats" - Statistical data (div)
        - id="slide-keypoint" - Key points (div)
        
        Required JSON structure (MUST match exactly):
        {
          "title": "string",
          "theme": "standard", 
          "template": "plain",
          "slides": [
            {
              "id": "string",
              "type": "string",
              "template": "generic",
              "html": "string"
            }
          ],
          "totalSlides": number
        }
        
        Generate slides that are:
        - Well-structured with proper HTML and standardized IDs
        - Include relevant data tables using proper HTML structure
        - Professional and clear with consistent ID usage
        - Data-driven where appropriate
        - Template-ready with standardized element IDs
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Create a comprehensive presentation with data visualizations about: {user_prompt}")
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
            
            # Validate HTML slides have proper slide-content wrapper
            if 'html' in slide and slide['html']:
                html_content = slide['html'].strip()
                if not html_content.startswith('<div id="slide-content">'):
                    # Wrap the content with slide-content div if missing
                    slide['html'] = f'<div id="slide-content">{html_content}</div>'
                    logger.info(f"Added slide-content wrapper to slide {i}")
        
        print(f"Generated {len(parsed_content['slides'])} slides successfully")
        return parsed_content