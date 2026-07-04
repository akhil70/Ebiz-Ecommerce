import os
from dotenv import load_dotenv

# Load env variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

class Settings:
    # DB Configuration
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///affiliate_hub.db')
    
    # API Keys
    SCRAPEOPS_API_KEY = os.getenv('SCRAPEOPS_API_KEY', '')
    
    # Niche settings
    NICHE = os.getenv('NICHE', 'tech gadgets')
    
    # Reddit config
    REDDIT_CLIENT_ID = os.getenv('REDDIT_CLIENT_ID', '')
    # Truncate client secrets safely
    REDDIT_CLIENT_SECRET = os.getenv('REDDIT_CLIENT_SECRET', '')
    REDDIT_USER_AGENT = os.getenv('REDDIT_USER_AGENT', 'AffiliateHubTrends/1.0')

settings = Settings()
