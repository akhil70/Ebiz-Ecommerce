import unittest
import os
import json
from unittest.mock import patch
from affiliate_hub.config.settings import settings

# Override DB settings for testing to use in-memory SQLite before importing aggregator
settings.DATABASE_URL = 'sqlite:///:memory:'

from affiliate_hub.modules.discovery.google_trends import fetch_google_trends
from affiliate_hub.modules.discovery.amazon_scrapers import fetch_amazon_bestsellers
from affiliate_hub.modules.discovery.tiktok_creative import fetch_tiktok_trends
from affiliate_hub.modules.discovery.reddit_radar import fetch_reddit_deals
from affiliate_hub.modules.discovery.aggregator import run_aggregator

class TestTrendDiscoveryModule(unittest.TestCase):
    
    def test_fetch_google_trends(self):
        """Test Google Trends fetches items with title, source, score, and payload"""
        trends = fetch_google_trends('tech gadgets')
        self.assertIsInstance(trends, list)
        self.assertTrue(len(trends) > 0)
        
        for item in trends:
            self.assertIn('title', item)
            self.assertEqual(item['source'], 'google_trends')
            self.assertIsInstance(item['score'], float)
            self.assertIn('payload', item)

    def test_fetch_amazon_bestsellers(self):
        """Test Amazon Best Sellers fetches items correctly"""
        products = fetch_amazon_bestsellers('tech gadgets')
        self.assertIsInstance(products, list)
        self.assertTrue(len(products) > 0)
        
        for item in products:
            self.assertIn('title', item)
            self.assertEqual(item['source'], 'amazon')
            self.assertIsInstance(item['score'], float)
            self.assertIn('external_id', item)
            self.assertIn('payload', item)

    def test_fetch_tiktok_trends(self):
        """Test TikTok Creative Center fetches products and hashtags"""
        trends = fetch_tiktok_trends('tech gadgets')
        self.assertIsInstance(trends, list)
        self.assertTrue(len(trends) > 0)
        
        for item in trends:
            self.assertIn('title', item)
            self.assertEqual(item['source'], 'tiktok')
            self.assertIsInstance(item['score'], float)
            self.assertIn('payload', item)
            payload_data = json.loads(item['payload'])
            self.assertIn('hashtag', payload_data)

    def test_fetch_reddit_radar(self):
        """Test Reddit scraper gathers deals successfully"""
        deals = fetch_reddit_deals('tech gadgets')
        self.assertIsInstance(deals, list)
        self.assertTrue(len(deals) > 0)
        
        for item in deals:
            self.assertIn('title', item)
            self.assertTrue(item['source'].startswith('reddit'))
            self.assertIsInstance(item['score'], float)
            self.assertIn('payload', item)

    def test_aggregator_pipeline(self):
        """Test full aggregator pipeline execution, database entries committing, and content_queue.json creation"""
        # Run aggregator
        queue_data = run_aggregator()
        
        self.assertIsInstance(queue_data, dict)
        self.assertIn('items', queue_data)
        self.assertIn('generated_at', queue_data)
        self.assertTrue(len(queue_data['items']) > 0)
        
        # Verify content_queue.json exists and contains correct keys
        queue_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
            'affiliate_hub', 
            'content_queue.json'
        )
        self.assertTrue(os.path.exists(queue_path))
        
        with open(queue_path, 'r', encoding='utf-8') as f:
            saved_data = json.load(f)
            self.assertEqual(saved_data['niche'], settings.NICHE)
            self.assertTrue(len(saved_data['items']) > 0)
            
if __name__ == '__main__':
    unittest.main()
