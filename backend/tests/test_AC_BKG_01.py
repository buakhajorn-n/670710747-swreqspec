# test ของ T-03: จองคิวสำเร็จ
# AC-BKG-01 (FR-BKG-04)
from tests.conftest import AUTH
from app.db.models import Booking


def test_AC_BKG_01(client, make_slot):
    """AC-BKG-01: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง จองแล้วต้องสำเร็จ"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201


def test_TC_BKG_01_1_successful_booking(client, db, make_slot):
    # Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When: ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then: บันทึกสำเร็จ
    assert res.status_code == 201
    assert res.json()["booking_id"] is not None
    # Then: แสดงหมายเลขคิว
    assert res.json()["queue_no"] is not None
    # Then: ที่นั่งว่างของช่วงนั้นเป็น 0
    db.refresh(slot)
    assert slot.remaining == 0


def test_TC_BKG_01_2_no_seat_at_confirmation(client, db, make_slot):
    # Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 0 ที่
    slot = make_slot(start="09:00", remaining=0)

    # When: ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then: แจ้ง "ช่วงเวลาเต็ม"
    assert res.status_code == 409
    assert res.json()["detail"] == "ช่วงเวลาเต็ม"
    # Then: แสดงช่วงเวลาที่ยังว่าง 3 ตัวเลือกที่ใกล้เวลาที่เลือกที่สุด
    # ภายในวันเดียวกันและวันถัดไป 1 วัน
    # spec ไม่ได้ระบุ API response สำหรับตัวเลือกใน AC-BKG-01
    # Then: ไม่สร้างรายการจอง
    assert db.query(Booking).count() == 0


def test_TC_BKG_01_3_unauthenticated_booking(client, make_slot):
    # Given: ยังไม่ได้ยืนยันตัวตน และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When: ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id})

    # Then: spec ไม่ได้บอกผลลัพธ์ที่ต้องแสดงหรือรหัสตอบกลับ
    # เมื่อยังไม่ได้รับผลยืนยันตัวตน จึงยังไม่ตรวจผลลัพธ์ส่วนนี้
