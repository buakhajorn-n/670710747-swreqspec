from app.db.models import Base

# Supports: CON-TECH-01, DOM-PDPA-01, IF-HIS-01

def upgrade(engine):
    Base.metadata.create_all(bind=engine)
