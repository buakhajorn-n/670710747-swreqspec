import os

# Supports: CON-TECH-01
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///:memory:")
