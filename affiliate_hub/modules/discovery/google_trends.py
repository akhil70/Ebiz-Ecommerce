import pandas as pd
from affiliate_hub.config.logging import setup_logger
from affiliate_hub.config.settings import settings

logger = setup_logger('google_trends')

def fetch_google_trends(keyword: str = None) -> list:
    """Fetch rising search trends on Google Trends using pytrends with robust fallback"""
    kw = keyword or settings.NICHE
    logger.info(f"Scanning Google Trends for keywords related to: {kw}")
    
    results = []
    try:
        from pytrends.request import TrendReq
        
        # Initialize pytrends
        pt = TrendReq(hl='en-US', tz=360, timeout=10)
        pt.build_payload([kw], timeframe='now 7-d')
        
        related = pt.related_queries()
        rising = related.get(kw, {}).get('rising')
        
        if rising is not None and not rising.empty:
            for _, row in rising.head(5).iterrows():
                results.append({
                    'title': row['query'],
                    'source': 'google_trends',
                    'score': float(row['value']),
                    'external_id': None,
                    'payload': f"Rising search interest: +{row['value']}%"
                })
            logger.info(f"Gathered {len(results)} items from Google Trends API.")
            return results
    except Exception as e:
        logger.warning(f"Google Trends API fetch failed or rate-limited: {e}. Falling back to mock data.")
        
    # Mock data fallback aligned with niche (in case of Google Trends rate limits)
    logger.info("Executing mock data generation for Google Trends...")
    mock_keywords = {
        'tech gadgets': [
            'best pocket camera 2026',
            'cheap mechanical keyboard bluetooth',
            'magnetic wireless power bank fast charge',
            'minimalist desk setup accessories',
            'wearable neck fan sports'
        ],
        'default': [
            f'top trending {kw} products',
            f'must-have {kw} items',
            f'best budget {kw} 2026'
        ]
    }
    
    selected_kws = mock_keywords.get(kw.lower(), mock_keywords['default'])
    for idx, title in enumerate(selected_kws):
        results.append({
            'title': title,
            'source': 'google_trends',
            'score': 100.0 - (idx * 15.0),
            'external_id': f"mock_gt_{idx}",
            'payload': "Mocked rising Google Trend for development testing"
        })
        
    logger.info(f"Generated {len(results)} fallback trends from Google Trends mockup.")
    return results
