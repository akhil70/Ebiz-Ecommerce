from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from datetime import datetime
from affiliate_hub.database.connection import Base, engine

class TrendOpportunity(Base):
    __tablename__ = 'trend_opportunities'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    source = Column(String(50), nullable=False)  # google_trends, amazon, tiktok, reddit
    score = Column(Float, default=0.0)            # Normalized velocity or trend rating
    external_id = Column(String(100), nullable=True) # ASIN or Thread ID
    payload = Column(Text, nullable=True)         # Serialized extra metrics (price, descriptions, URL)
    processed = Column(Boolean, default=False)    # If Content Factory has parsed this
    discovered_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'source': self.source,
            'score': self.score,
            'external_id': self.external_id,
            'payload': self.payload,
            'processed': self.processed,
            'discovered_at': self.discovered_at.isoformat()
        }

# Initializer utility to create tables
def init_db():
    Base.metadata.create_all(bind=engine)
