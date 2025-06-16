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
          "max_tokens": 8000,
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
      You are an expert presentation designer. Create comprehensive presentations with appropriate content structure.
      
      IMPORTANT: Analyze the content depth and create the APPROPRIATE number of slides (anywhere from 5 to 20+ slides based on topic complexity).
      
      CRITICAL JSON FORMATTING RULES:
      1. The response MUST be a single, valid JSON object
      2. NO additional text, markdown, or code blocks before or after the JSON
      3. NO comments within the JSON
      4. ALL strings must be properly escaped and enclosed in double quotes
      5. NO trailing commas
      6. NO single quotes for strings
      7. ALL HTML content must be properly escaped within the JSON strings
      
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
        "totalSlides": "string"
      }
      
      Field Requirements:
      - "title": String, presentation title
      - "theme": String, must be "modern"
      - "slides": Array of objects, each containing:
        - "id": String, unique identifier (e.g., "slide-1")
        - "type": String, one of: "title", "content", "image", "quote", "list", "conclusion"
        - "html": String, properly escaped HTML content
      - "totalSlides": String, number of slides
      
      Example of valid JSON response:
      {
        "title": "Introduction to AI",
        "theme": "modern",
        "slides": [
          {
            "id": "slide-1",
            "type": "title",
            "html": "<div><h1>Introduction to AI</h1><p>Understanding Artificial Intelligence</p></div>"
          }
        ],
        "totalSlides": "1"
      }
    
      CONTENT GUIDELINES:
    
      1. **Slide Types**:
        - Title slide: Main presentation title and subtitle
        - Content slides: Main content with headings and text
        - Image/chart slides: Visual content with supporting text
        - Quote/emphasis slides: Important quotes or key messages
        - List slides: Bullet points and numbered lists
        - Conclusion slides: Summary and closing points

      2. **Content Structure**:
        - Use proper HTML semantic elements
        - Include appropriate headings (h1, h2, h3)
        - Use paragraphs for text content
        - Include lists where appropriate
        - Add images with proper alt text
        - Use semantic HTML5 elements

      3. **Slide Examples**:
    
        TITLE SLIDE:
        <div>
          <h1>Presentation Title</h1>
          <p>Subtitle or brief description</p>
        </div>
    
        CONTENT SLIDE:
        <div>
          <h2>Slide Title</h2>
          <div>
            <h3>Key Points</h3>
            <ul>
              <li>First important point</li>
              <li>Second key insight</li>
              <li>Third crucial element</li>
            </ul>
          </div>
          <div>
            <img src="https://example.com/relevant-image.jpg" alt="Supporting visualization" />
            <p>Supporting visualization description</p>
          </div>
        </div>
    
        EMPHASIS SLIDE:
        <div>
          <h2>Key Message Here</h2>
          <p>Supporting explanation or quote that emphasizes the main point</p>
        </div>

      4. **Content Scaling Rules**:
        - Simple topics: 5-8 slides
        - Medium complexity: 8-12 slides  
        - Complex topics: 12-20+ slides
        - Always include: Title, Introduction, Main Content (multiple), Key Insights, Conclusion
        - Add transition slides for topic changes
        - Include summary slides for complex sections
      
      Generate slides that are:
        - Well-structured with proper HTML
        - Content-rich and informative
        - Scalable based on content complexity
        - Professional and clear
        - Easy to read and understand
        - Consistent in structure throughout
    """
      
      messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Create a comprehensive presentation about: {user_prompt}")
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
          if not isinstance(slide, dict) or 'html' not in slide:
              logger.warning(f"Invalid slide {i}, skipping")
              continue
          
          slide['id'] = slide.get('id', f'slide-{i+1}')
          slide['type'] = slide.get('type', 'content')
      
      print(f"Generated {len(parsed_content['slides'])} slides successfully")

      return parsed_content
    
    except json.JSONDecodeError as e:
      print(f"JSON parsing error: {e}")
      print(f"Content: {content}")
      raise Exception("Failed to parse AI response")     

    except Exception as e:
      print(f"Error generating presentation: {e}")
      raise