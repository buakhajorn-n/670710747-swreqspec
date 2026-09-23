import importlib.util
from pathlib import Path

from sqlalchemy import inspect

from app.db.models import AuditLog, Booking, Slot
from app.db.session import engine

migration_path = Path(__file__).resolve().parents[1] / "app" / "db" / "migrations" / "001_init.py"
spec = importlib.util.spec_from_file_location("migration_001_init", migration_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
upgrade = module.upgrade


def test_T01_creates_required_tables_without_national_id():
    upgrade(engine)
    inspector = inspect(engine)

    tables = set(inspector.get_table_names())
    assert {"slots", "bookings", "audit_logs"}.issubset(tables)

    booking_columns = {column["name"] for column in inspector.get_columns("bookings")}
    assert "hn" in booking_columns
    assert "national_id" not in booking_columns

    slot_columns = {column["name"] for column in inspector.get_columns("slots")}
    assert {"slot_date", "start_time", "package_code", "capacity", "remaining"}.issubset(slot_columns)

    audit_columns = {column["name"] for column in inspector.get_columns("audit_logs")}
    assert {"actor_id", "action", "hn", "accessed_at"}.issubset(audit_columns)

    assert Slot.__tablename__ == "slots"
    assert Booking.__tablename__ == "bookings"
    assert AuditLog.__tablename__ == "audit_logs"
