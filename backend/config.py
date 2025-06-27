import os
from dotenv import load_dotenv

load_dotenv()

class ConfigAI:
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_REGION = os.getenv('AWS_REGION')
    BEDROCK_MODEL_ID = os.getenv('BEDROCK_MODEL_ID')

    DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    CORS_ORIGINS = os.getenv('CORS_ORIGINS')
    BEDROCK_TIMEOUT = int(os.getenv('BEDROCK_TIMEOUT', 60))
    