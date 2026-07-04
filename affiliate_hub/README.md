# Affiliate Marketing Automation Platform (2026 Edition)

Welcome to the **Affiliate Marketing Automation Platform** codebase skeleton. This project is structured as a modular, production-ready Python backend integrated with PostgreSQL and n8n, fully compliant with modern 2026 API standards.

---

## Folder Structure

The application directories and their respective purposes are outlined below:

```text
affiliate_hub/
├── .env.example              # Template containing all platform environment variables
├── requirements.txt          # Python dependencies list
├── README.md                 # System overview and operational guide
│
├── config/                   # Global configuration & logger setups
│   ├── __init__.py
│   ├── settings.py           # Loads environment variables and maps platform config
│   └── logging.py            # Custom logger utility with output formatting
│
├── database/                 # Database logic layer (PostgreSQL)
│   ├── __init__.py
│   ├── connection.py         # SQLAlchemy engine setup and pool managers
│   ├── models.py             # SQLAlchemy models for products, queue, posts, analytics
│   └── migrations/           # DB schema changes and migration history (Alembic)
│
├── modules/                  # Main platform service layers
│   │
│   ├── discovery/            # 1. Trend Discovery Module
│   │   ├── __init__.py
│   │   ├── google_trends.py  # Fetches Google Trends queries
│   │   ├── amazon_scrapers.py# Scrapes Amazon Bestsellers via ScrapeOps
│   │   ├── tiktok_creative.py# Parses TikTok Creative Center keywords
│   │   ├── reddit_radar.py   # Scrapes popular deals subreddits (r/deals)
│   │   └── aggregator.py     # Ranks opportunities & outputs content_queue.json
│   │
│   ├── content/              # 2. Content Factory (AI Scripting)
│   │   ├── __init__.py
│   │   ├── generator.py      # Interfaces with Gemini/OpenAI (gpt-4o)
│   │   └── templates.py      # Prompts (Hook, Benefits, CTA) and formatting
│   │
│   ├── video/                # 3. Video Factory (Render Engine)
│   │   ├── __init__.py
│   │   ├── storyboarding.py  # Connects to Pictory storyboard APIs
│   │   ├── voiceover.py      # Text-To-Speech generator
│   │   └── local_editor.py   # FFmpeg script for auto subtitles/captions
│   │
│   ├── hosting/              # 4. Asset Hosting
│   │   ├── __init__.py
│   │   └── cloudinary.py     # Connects to Cloudinary SDK to upload finished videos
│   │
│   ├── publisher/            # 5. Multi Platform Publisher (Platform Upload Services)
│   │   ├── __init__.py
│   │   ├── base.py           # Abstract Base Publisher interface
│   │   ├── tiktok.py         # TikTok Direct Post Service (PULL_FROM_URL)
│   │   ├── instagram.py      # Instagram Reels Graph API container creation
│   │   ├── facebook.py       # Facebook Page Reels/Video API publisher
│   │   ├── youtube.py        # YouTube Shorts Data API v3 resumable handler
│   │   ├── pinterest.py      # Pinterest v5 video Pin creator
│   │   ├── x_twitter.py      # Tweepy Client (OAuth 1.0a) poster
│   │   └── orchestrator.py   # ThreadPoolExecutor-based multi-post scheduler
│   │
│   ├── links/                # 6. Affiliate Link Management
│   │   ├── __init__.py
│   │   └── clickmagick.py    # Matches content to ClickMagick tracking links with sub-ids
│   │
│   ├── analytics/            # 7. Analytics Dashboard Database Sync
│   │   ├── __init__.py
│   │   └── data_puller.py    # Pulls network conversion logs and syncs with DB
│   │
│   └── monitoring/           # 8. Monitoring & Alarm Watchdogs
│       ├── __init__.py
│       ├── telegram_bot.py   # Alerts bot with customized notification formatting
│       └── watchdog.py       # Validates links, checks token life, evaluates daily clicks
│
├── tests/                    # Automation and Environment diagnostics
│   ├── __init__.py
│   ├── test_env.py           # Diagnostic for checking Python environment
│   └── test_credentials.py   # Direct credential validations on live APIs
│
├── n8n/                      # n8n Automation Workflows
│   ├── master_workflow.json  # Complete export of MASTER SLEEP AUTOMATION
│   └── config_guide.md       # Setup documentation for setting local n8n nodes
│
└── scripts/                  # OS/Deployment scripts
    ├── run_flask.bat         # Windows script to startup the local uploader daemon
    ├── startup.sh            # Ubuntu droplet system configuration setup
    └── pm2.config.js         # Process Manager configuration for uploader
```
