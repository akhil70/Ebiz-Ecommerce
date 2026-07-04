import json
import os
from datetime import datetime
from affiliate_hub.config.logging import setup_logger
from affiliate_hub.config.settings import settings
from affiliate_hub.database.connection import SessionLocal
from affiliate_hub.database.models import TrendOpportunity, init_db

# Sub-modules
from affiliate_hub.modules.discovery.google_trends import fetch_google_trends
from affiliate_hub.modules.discovery.amazon_scrapers import fetch_amazon_bestsellers
from affiliate_hub.modules.discovery.tiktok_creative import fetch_tiktok_trends
from affiliate_hub.modules.discovery.reddit_radar import fetch_reddit_deals

logger = setup_logger('discovery_aggregator')

def run_aggregator() -> dict:
    """Consolidate trends from all discovery sources, save to DB, and write content_queue.json"""
    logger.info("Initializing Trend Discovery Aggregator Pipeline...")
    
    # Initialize DB tables (creates SQLite or Postgresql schema if not exists)
    try:
        init_db()
        logger.info("Database tables initialized successfully.")
    except Exception as db_err:
        logger.error(f"Failed to initialize database: {db_err}")
        raise db_err
        
    niche = settings.NICHE
    
    # Fetch from all modules
    gt_items = fetch_google_trends(niche)
    amz_items = fetch_amazon_bestsellers(niche)
    tt_items = fetch_tiktok_trends(niche)
    rd_items = fetch_reddit_deals(niche)
    
    all_raw_items = gt_items + amz_items + tt_items + rd_items
    logger.info(f"Aggregated {len(all_raw_items)} total raw candidates from all feeds.")
    
    # Connect to DB session
    db = SessionLocal()
    new_opportunities_count = 0
    
    try:
        for raw in all_raw_items:
            # Avoid duplicating active trend titles
            exists = db.query(TrendOpportunity).filter(
                TrendOpportunity.title == raw['title'],
                TrendOpportunity.source == raw['source']
            ).first()
            
            if not exists:
                opp = TrendOpportunity(
                    title=raw['title'],
                    source=raw['source'],
                    score=raw['score'],
                    external_id=raw['external_id'],
                    payload=raw['payload'],
                    processed=False
                )
                db.add(opp)
                new_opportunities_count += 1
                
        db.commit()
        logger.info(f"Database commit completed. Added {new_opportunities_count} new trend opportunities to DB.")
        
        # Pull top 5 unprocessed opportunities sorted by score descending
        unprocessed = db.query(TrendOpportunity).filter(
            TrendOpportunity.processed == False
        ).order_index = TrendOpportunity.score.desc()
        
        # Sort and limit manually via query
        unprocessed = db.query(TrendOpportunity).filter(
            TrendOpportunity.processed == False
        ).order_by(TrendOpportunity.score.desc()).limit(5).all()
        
        if not unprocessed:
            logger.info("No unprocessed trends in DB. Pulling latest discovered items instead.")
            unprocessed = db.query(TrendOpportunity).order_by(TrendOpportunity.discovered_at.desc()).limit(5).all()
            
        queue_items = [item.to_dict() for item in unprocessed]
        
        # Output to content_queue.json
        queue_payload = {
            'generated_at': datetime.utcnow().isoformat(),
            'niche': niche,
            'count': len(queue_items),
            'items': queue_items
        }
        
        queue_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
            'content_queue.json'
        )
        
        with open(queue_path, 'w', encoding='utf-8') as f:
            json.dump(queue_payload, f, indent=2)
            
        logger.info(f"Content queue exported successfully to: {queue_path}")
        return queue_payload
        
    except Exception as pipeline_err:
        logger.error(f"Aggregator pipeline execution failed: {pipeline_err}")
        db.rollback()
        raise pipeline_err
    finally:
        db.close()

if __name__ == '__main__':
    run_aggregator()
