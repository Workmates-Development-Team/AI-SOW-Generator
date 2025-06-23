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
  
  def generate_presentation_structure(self, user_prompt: str) -> dict:
    try:
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
        
        HTML TABLE GUIDELINES:
        - Use proper HTML table structure: <table><thead><tbody><tr><th><td>
        - Add id="slide-table" to all tables
        - Include meaningful headers in <thead>
        - Use <tbody> for data rows
        - Add class="data-table" for styling hooks
        - Include tables for: comparisons, statistics, schedules, specifications, etc.
        
        Required JSON structure (MUST match exactly):
        {
          "title": "string",
          "theme": "string", 
          "slides": [
            {
              "id": "string",
              "type": "string",
              "html": "string"
            }
          ],
          "totalSlides": number
        }
        
        SLIDE TYPE EXAMPLES WITH PROPER IDs:
        
        TITLE SLIDE:
        <div id="slide-content">
          <header id="slide-header">
            <h1 id="slide-title">Main Presentation Title</h1>
            <h2 id="slide-subtitle">Compelling Subtitle</h2>
          </header>
          <div id="slide-description">
            <p>Brief presentation overview or tagline</p>
          </div>
        </div>
        
        CONTENT SLIDE WITH LIST:
        <div id="slide-content">
          <h2 id="slide-title">Section Title</h2>
          <h3 id="slide-subtitle">Key Points</h3>
          <ul id="slide-list">
            <li>First important point with detailed explanation</li>
            <li>Second crucial insight with supporting details</li>
            <li>Third key element with relevant context</li>
          </ul>
          <div id="slide-highlight">
            <p>Important note or takeaway message</p>
          </div>
        </div>
        
        DATA SLIDE WITH TABLE:
        <div id="slide-content">
          <h2 id="slide-title">Performance Metrics</h2>
          <h3 id="slide-subtitle">Quarterly Results Comparison</h3>
          <table id="slide-table" class="data-table">
            <thead>
              <tr>
                <th>Quarter</th>
                <th>Revenue ($M)</th>
                <th>Growth (%)</th>
                <th>Market Share (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Q1 2024</td>
                <td>125.5</td>
                <td>12.3</td>
                <td>18.7</td>
              </tr>
              <tr>
                <td>Q2 2024</td>
                <td>142.8</td>
                <td>13.8</td>
                <td>21.2</td>
              </tr>
              <tr>
                <td>Q3 2024</td>
                <td>158.9</td>
                <td>11.3</td>
                <td>23.1</td>
              </tr>
              <tr>
                <td>Q4 2024</td>
                <td>176.2</td>
                <td>10.9</td>
                <td>24.8</td>
              </tr>
            </tbody>
          </table>
          <div id="slide-description">
            <p>Consistent growth trajectory with expanding market presence</p>
          </div>
        </div>
        
        STATISTICS SLIDE:
        <div id="slide-content">
          <h2 id="slide-title">Key Statistics</h2>
          <div id="slide-stats">
            <div id="slide-highlight">
              <h3>85%</h3>
              <p id="slide-description">Customer Satisfaction Rate</p>
            </div>
            <div id="slide-keypoint">
              <h3>2.3M</h3>
              <p id="slide-description">Active Users Worldwide</p>
            </div>
          </div>
        </div>
        
        QUOTE/EMPHASIS SLIDE:
        <div id="slide-content">
          <h2 id="slide-title">Industry Insight</h2>
          <blockquote id="slide-quote">
            "Innovation distinguishes between a leader and a follower."
          </blockquote>
          <div id="slide-description">
            <p>- Steve Jobs, Apple Co-founder</p>
          </div>
        </div>
        
        WHEN TO INCLUDE TABLES:
        - Comparative data (features, prices, performance)
        - Financial information (budgets, revenue, costs)
        - Statistics and metrics
        - Schedules and timelines
        - Technical specifications
        - Survey results with numbers
        - Before/after comparisons
        - Product/service comparisons
        
        TABLE STYLING REQUIREMENTS:
        - Always use id="slide-table" 
        - Add class="data-table" for template styling
        - Use proper <thead> and <tbody> structure
        - Include meaningful column headers
        - Ensure data is realistic and relevant
        - Keep tables readable (max 6-8 columns)
        - Add descriptions below tables when needed
        
        CONTENT SCALING RULES:
        - Always include tables when showing comparative data
        - Simple topics: 5-8 slides (1-2 tables)
        - Medium complexity: 8-12 slides (2-3 tables)
        - Complex topics: 12-20+ slides (3-5 tables)
        
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
            
            # Validate HTML slides have proper slide-content wrapper
            if 'html' in slide and slide['html']:
                html_content = slide['html'].strip()
                if not html_content.startswith('<div id="slide-content">'):
                    # Wrap the content with slide-content div if missing
                    slide['html'] = f'<div id="slide-content">{html_content}</div>'
                    logger.info(f"Added slide-content wrapper to slide {i}")
        
        print(f"Generated {len(parsed_content['slides'])} slides successfully")
        return parsed_content
    
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Content: {content}")
        raise Exception("Failed to parse AI response")     

    except Exception as e:
        print(f"Error generating presentation: {e}")
        raise 