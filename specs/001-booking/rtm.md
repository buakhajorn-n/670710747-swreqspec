# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-07 08.31 | test: backend 7 ผ่าน 0 ไม่ผ่าน, frontend 1 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | AC-BKG-05 | T-02 เสร็จ | [backend/app/slots/router.py: get_slots](/workspaces/nutchaya-swreqspec/backend/app/slots/router.py), [backend/app/slots/service.py: list_available_slots](/workspaces/nutchaya-swreqspec/backend/app/slots/service.py) | `test_AC_BKG_05` ผ่าน แต่ตรวจเพียง status และ p95 | ช่องโหว่ |
| FR-BKG-02 | AC-BKG-02 | T-04 พร้อมทำ | ยังไม่มีโค้ดตรวจคิวซ้ำ | ยังไม่มี test | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05/T-11/T-12 พร้อมทำ | ยังไม่มีโค้ดเสนอช่วงใกล้เคียงหรือหน้าจอยืนยัน | ยังไม่มี test | ยังไม่ถึง |
| FR-BKG-04 | AC-BKG-01 | T-03 เสร็จ, T-06 รอ Q-02 | [backend/app/booking/service.py: create_booking](/workspaces/nutchaya-swreqspec/backend/app/booking/service.py), [backend/app/booking/router.py: create_booking](/workspaces/nutchaya-swreqspec/backend/app/booking/router.py) | `test_AC_BKG_01`, `TC-BKG-01-1`, `TC-BKG-01-2` ผ่าน; ไม่มี test หน้าจอ | ช่องโหว่ |
| FR-BKG-05 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มีโค้ดแจ้งเตือนหรือคิวส่งซ้ำ | ยังไม่มี test | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | T-02 เสร็จ, T-10 พร้อมทำ | [backend/app/slots/service.py: list_available_slots](/workspaces/nutchaya-swreqspec/backend/app/slots/service.py) กรอง `package_code` | ไม่มี test เปลี่ยนแพ็กเกจ | ช่องโหว่ |
| NFR-PERF-01 | AC-BKG-05 | T-02 เสร็จ | [backend/app/slots/router.py: get_slots](/workspaces/nutchaya-swreqspec/backend/app/slots/router.py) | `test_AC_BKG_05` ผ่าน แต่เรียกแบบวนซ้ำ ไม่ใช่ผู้ใช้พร้อมกัน 200 คน | ช่องโหว่ |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task | ไม่มีการบังคับ TLS ในโค้ดหรือการตั้งค่า | ไม่มี test | ช่องโหว่ |
| NFR-REL-02 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มีคิวส่งซ้ำ | ยังไม่มี test | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC เฉพาะ | ไม่มี task | ยังไม่มีหน้าจอและการทดสอบผู้ใช้ 8 ใน 10 คน | ไม่มี test | ช่องโหว่ |
| CON-TECH-01 | ไม่มี AC ตรง ๆ | T-01 เสร็จ | [backend/app/config.py: DATABASE_URL](/workspaces/nutchaya-swreqspec/backend/app/config.py), [backend/app/db/session.py: engine](/workspaces/nutchaya-swreqspec/backend/app/db/session.py) | `test_T01_tables_created` ผ่านบน SQLite | ช่องโหว่ |
| DOM-PDPA-01 | AC-BKG-06 | T-08 พร้อมทำ | มีโมเดล [backend/app/db/models.py: AuditLog](/workspaces/nutchaya-swreqspec/backend/app/db/models.py) แต่ไม่มีการเขียน audit log | ไม่มี test | ยังไม่ถึง |
| IF-IDP-01 | ไม่มี AC ตรง ๆ | T-03 เสร็จ | [backend/app/auth/idp.py: get_verified_hn](/workspaces/nutchaya-swreqspec/backend/app/auth/idp.py), dependency ของ booking | `test_TC_BKG_01_3_unauthenticated_booking` ผ่านแบบไม่มี assertion | ช่องโหว่ |
| IF-HIS-01 | ไม่มี AC ตรง ๆ | T-01 เสร็จ, T-09 พร้อมทำ | ยังไม่มี HIS lookup; ตาราง Booking เก็บ `hn` และไม่มี `national_id` | `test_T01_no_national_id` ผ่าน | ยังไม่ถึง |
| IF-NOT-01 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มีโค้ดส่งข้อความแบบ asynchronous | ไม่มี test | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| [backend/app/slots/router.py: GET /slots](/workspaces/nutchaya-swreqspec/backend/app/slots/router.py) | FR-BKG-01, FR-BKG-06 | บางส่วน | คืนช่วงเวลาและ remaining และกรองแพ็กเกจ แต่ช่วงวันที่จริงอยู่ใน service เพียง 14 วัน |
| [backend/app/slots/service.py: list_available_slots](/workspaces/nutchaya-swreqspec/backend/app/slots/service.py) | FR-BKG-01, FR-BKG-06 | ไม่ครบ | `DAYS_AHEAD = 14` ไม่ตรงกับข้อกำหนด 30 วัน |
| [backend/app/booking/router.py: POST /bookings](/workspaces/nutchaya-swreqspec/backend/app/booking/router.py) | FR-BKG-04, IF-IDP-01 | บางส่วน | ตรวจตัวตน บันทึกและตัดที่นั่ง แต่ไม่มีการส่งคำขอแจ้งเตือน |
| [backend/app/booking/service.py: create_booking](/workspaces/nutchaya-swreqspec/backend/app/booking/service.py) | FR-BKG-04 | ไม่ครบ | สร้าง queue number รูปแบบ `A001` ทั้งที่ Q-02 ยังไม่ตอบ |
| [backend/app/booking/router.py: BookingRequest](/workspaces/nutchaya-swreqspec/backend/app/booking/router.py) | IF-HIS-01 | ไม่ตรง | รับ `national_id` และ log ค่า `national_id` ทั้งที่ควรส่งต่อ HIS และไม่เก็บ/ใช้ในระบบจอง |
| [backend/app/auth/idp.py: get_verified_hn](/workspaces/nutchaya-swreqspec/backend/app/auth/idp.py) | IF-IDP-01 | บางส่วน | ป้องกัน endpoint จองคิว แต่ยังไม่มีหลักฐาน test ที่ assert การปฏิเสธจริง |
| [backend/app/db/models.py: Booking](/workspaces/nutchaya-swreqspec/backend/app/db/models.py) | FR-BKG-04, IF-HIS-01 | บางส่วน | มี HN และไม่มี national_id แต่ `queue_no` ถูกใช้ทั้งที่ Q-02 ยังเปิดอยู่ |
| [backend/app/config.py: DATABASE_URL](/workspaces/nutchaya-swreqspec/backend/app/config.py) | CON-TECH-01 | ไม่ตรงกับค่าเริ่มต้น | ค่าเริ่มต้นเป็น SQLite ขณะที่ constraint กำหนด PostgreSQL |
| [backend/app/main.py: lifespan](/workspaces/nutchaya-swreqspec/backend/app/main.py) | CON-TECH-01 | บางส่วน | สร้างตารางอัตโนมัติ แต่ไม่มีการบังคับว่า engine ต้องเป็น PostgreSQL |
| [frontend/src/api/client.js: api](/workspaces/nutchaya-swreqspec/frontend/src/api/client.js) | FR-BKG-01, FR-BKG-03, FR-BKG-04 | ไม่ครบ | มี client สำหรับ slots และ booking แต่ไม่มีหน้าจอหรือการจัดการผลลัพธ์ตามสัญญา |
| [frontend/src/App.jsx: App](/workspaces/nutchaya-swreqspec/frontend/src/App.jsx) | FR-BKG-01 ถึง FR-BKG-06 | ไม่ครบ | เป็นเพียงโครงหน้าจอ ยังไม่มี workflow การจอง |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-02 | เดา Q-02 | [backend/app/booking/service.py: next_queue_no](/workspaces/nutchaya-swreqspec/backend/app/booking/service.py) | Q-02 | กำหนดรูปแบบ `A001` และรีเซ็ตรายวัน ทั้งที่ Q-02 ยังไม่มีคำตอบ | |
| F-03 | ละเมิด Constraint | [backend/app/booking/router.py: BookingRequest/create_booking](/workspaces/nutchaya-swreqspec/backend/app/booking/router.py) | IF-HIS-01 | รับและเขียน `national_id` ลง log โดยไม่จำเป็น แม้ constraint กำหนดให้อ้างอิงภายในด้วย HN และไม่เก็บเลขบัตรประชาชน | |
| F-04 | ตัวเลขไม่ตรง spec | [backend/app/slots/service.py: DAYS_AHEAD](/workspaces/nutchaya-swreqspec/backend/app/slots/service.py) | FR-BKG-01 | ใช้ 14 วันแทน 30 วัน | |
| F-05 | test อ่อน | [backend/tests/test_AC_BKG_01.py: test_TC_BKG_01_3_unauthenticated_booking](/workspaces/nutchaya-swreqspec/backend/tests/test_AC_BKG_01.py) | IF-IDP-01 | test ไม่มี assertion จึงไม่ตรวจว่าระบบปฏิเสธผู้ไม่ยืนยันตัวตนจริง | |
| F-06 | test อ่อน | [backend/tests/test_AC_BKG_05.py: test_AC_BKG_05](/workspaces/nutchaya-swreqspec/backend/tests/test_AC_BKG_05.py) | NFR-PERF-01 | วัด 200 requests แบบ sequential ไม่ใช่ผู้ใช้พร้อมกัน 200 คน และไม่ตรวจข้อมูลช่วงเวลาที่ส่งกลับ | |
| F-07 | FR ไม่มี AC | [specs/001-booking/spec.md: FR-BKG-06](/workspaces/nutchaya-swreqspec/specs/001-booking/spec.md) | FR-BKG-06 | requirement การเปลี่ยนแพ็กเกจไม่มี AC และไม่มี test ที่ตรวจพฤติกรรมนี้ | |
| F-08 | ละเมิด Constraint | [backend/app/config.py: DATABASE_URL](/workspaces/nutchaya-swreqspec/backend/app/config.py) | CON-TECH-01 | ค่าเริ่มต้นของระบบเป็น SQLite ไม่ใช่ PostgreSQL ตามมาตรฐานที่กำหนด | |
| F-09 | โค้ดไม่มี FR | [backend/app/booking/router.py: POST /bookings](/workspaces/nutchaya-swreqspec/backend/app/booking/router.py) | FR-BKG-04, IF-NOT-01 | ไม่มีการส่งคำขอข้อความยืนยันแบบ asynchronous ตาม requirement | |
| F-10 | โค้ดไม่มี FR | [backend/app/main.py: app](/workspaces/nutchaya-swreqspec/backend/app/main.py) | FR-BKG-05, DOM-PDPA-01, IF-HIS-01 | ไม่มี endpoint/detail สำหรับ GET booking, ไม่มี audit middleware และไม่มี HIS lookup ตามสัญญา API/constraint | |
| F-12 | ช่องโหว่ NFR | ทั้งระบบ | NFR-SEC-01, NFR-USE-01 | ไม่มี implementation หรือ test สำหรับ TLS 1.2 ขึ้นไป และไม่มีการทดสอบผู้ใช้ใหม่ 8 ใน 10 คนภายใน 3 นาที | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| F-13 | เปลี่ยนเงื่อนไขตรวจที่นั่งเป็น `remaining <= 0` | `TC-BKG-01-2` ผ่านและ `pytest` รวม 7 tests ผ่าน |
| F-01 | ลบ endpoint `DELETE /bookings/{booking_id}` | ตรวจ [backend/app/booking/router.py](/workspaces/nutchaya-swreqspec/backend/app/booking/router.py) แล้วไม่พบ endpoint ยกเลิก |
| F-11 | ลบฟังก์ชัน `cancel_booking` | ตรวจ [backend/app/booking/service.py](/workspaces/nutchaya-swreqspec/backend/app/booking/service.py) แล้วไม่พบฟังก์ชันยกเลิก |
