from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Slot(Base):
    # Supports: FR-BKG-01, FR-BKG-06, CON-TECH-01
    __tablename__ = "slots"

    id = Column(Integer, primary_key=True, index=True)
    slot_date = Column(Date, nullable=False)
    start_time = Column(String(5), nullable=False)
    package_code = Column(String(50), nullable=False)
    capacity = Column(Integer, nullable=False)
    remaining = Column(Integer, nullable=False, default=0)


class Booking(Base):
    # Supports: FR-BKG-02, FR-BKG-04, IF-HIS-01
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    hn = Column(String(20), nullable=False)
    slot_id = Column(Integer, ForeignKey("slots.id"), nullable=False)
    booking_date = Column(Date, nullable=False)
    queue_no = Column(String(50), nullable=True)
    status = Column(String(20), nullable=False, default="confirmed")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


class AuditLog(Base):
    # Supports: DOM-PDPA-01
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(String(50), nullable=False)
    action = Column(String(50), nullable=False)
    hn = Column(String(20), nullable=False)
    accessed_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
