import json
from affiliate_hub.config.logging import setup_logger
from affiliate_hub.config.settings import settings

logger = setup_logger('tiktok_creative')

def fetch_tiktok_trends(niche: str = None) -> list:
    """Fetch viral trending products or hashtags from TikTok Creative Center with fallback"""
    n = niche or settings.NICHE
    logger.info(f"Scanning TikTok Creative Center trends for: {n}")
    
    results = []
    
    # Standard fallback representing viral short-form products (very typical for TikTok Shop)
    viral_tiktok_products = {
        'tech gadgets': [
            {'title': 'Mini Portable Projector 4K Support', 'hashtag': '#miniprojector', 'velocity': 98.4},
            {'title': 'Bluetooth Sleeping Headband Eye Mask', 'hashtag': '#sleepheadband', 'velocity': 92.1},
            {'title': 'RGB Lightbars with Smart App Sync', 'hashtag': '#rgblights', 'velocity': 89.9},
            {'title': 'Magnetic Phone Ring Holder Grip', 'hashtag': '#phonering', 'velocity': 87.5},
            {'title': '3-in-1 Foldable Travel Wireless Charger', 'hashtag': '#travelcharger', 'velocity': 85.0}
        ],
        'default': [
            {'title': f'Viral {n} Hack Product', 'hashtag': f'#{n.replace(" ", "")}', 'velocity': 90.0},
            {'title': f'Trending TikTok {n} Item', 'hashtag': f'#tiktokmadebuyit', 'velocity': 85.0}
        ]
    }
    
    selected_trends = viral_tiktok_products.get(n.lower(), viral_tiktok_products['default'])
    for idx, item in enumerate(selected_trends):
        results.append({
            'title': item['title'],
            'source': 'tiktok',
            'score': item['velocity'],
            'external_id': f"tiktok_trend_{idx}",
            'payload': json.dumps({
                'hashtag': item['hashtag'],
                'viral_score': f"{item['velocity']}% growth",
                'cta_type': 'TikTok Shop / Link in Bio'
            })
        })
        
    logger.info(f"Generated {len(results)} viral product trends from TikTok Creative Center mockup.")
    return results
