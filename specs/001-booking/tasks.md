# Tasks: จองคิวตรวจสุขภาพ (Booking)
Feature: จองคิวตรวจสุขภาพ (Booking)
Spec ID: SPEC-BKG-001
อ้างอิง plan.md: specs/001-booking/plan.md (plan v1)
วันที่: 2569-09-23

สรุป:
- ทำทั้งหมด 13 task
- มี 1 task ที่ต้องรอ Open Questions (Q-02)

### T-01 สร้างฐานข้อมูลและ migration
- รองรับ: CON-TECH-01, DOM-PDPA-01, IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-01
- ไฟล์ที่แตะ: backend/app/config.py, backend/app/db/models.py, backend/app/db/session.py, backend/app/db/migrations/001_init.py
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: migration สร้างตาราง slots, bookings และ audit_logs พร้อมใช้งานกับ PostgreSQL และโครงฐานข้อมูลรองรับข้อจำกัดด้านความปลอดภัยและข้อมูลผู้รับบริการ
- สถานะ: เสร็จ

### T-02 สร้าง API ค้นหาช่วงว่างและประเมินประสิทธิภาพ
- รองรับ: FR-BKG-01, FR-BKG-06, NFR-PERF-01
- ตรวจด้วย: AC-BKG-05
- ไฟล์ที่แตะ: backend/app/slots/router.py, backend/app/slots/service.py, backend/tests/test_slots.py
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: GET /slots คืนช่วงเวลาว่างภายใน 30 วันพร้อมที่นั่งคงเหลือ และ p95 ของการตอบสนองในสภาวะ 200 ผู้ใช้พร้อมกันอยู่ภายใน 2 วินาที
- สถานะ: เสร็จ

### T-03 สร้าง API การจองแบบพื้นฐาน
- รองรับ: FR-BKG-04, IF-HIS-01
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: backend/app/booking/router.py, backend/app/booking/service.py, backend/tests/test_booking_basic.py
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: POST /bookings บันทึกการจอง ตัดจำนวนที่นั่งแล้วคืนหมายเลขคิว และยืนยันว่าการจองสำเร็จแล้วบันทึกในฐานข้อมูล
- สถานะ: พร้อมทำ

### T-04 ป้องกันการจองซ้ำในวันเดียวกัน
- รองรับ: FR-BKG-02
- ตรวจด้วย: AC-BKG-02
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/tests/test_booking_duplicate.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: เมื่อผู้รับบริการมีคิวที่ยังไม่ได้ใช้ในวันเดียวกัน ระบบปฏิเสธการจองใหม่และส่งกลับหมายเลขคิวเดิมที่มีอยู่
- สถานะ: พร้อมทำ

### T-05 จัดการช่วงเวลาเต็มและเสนอ 3 ตัวเลือกที่ใกล้ที่สุด
- รองรับ: FR-BKG-03
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: backend/app/slots/service.py, backend/app/booking/service.py, backend/tests/test_booking_full_slot.py
- ต้องทำหลัง: T-03, T-04
- เสร็จเมื่อ: เมื่อช่วงเวลาที่เลือกเต็ม ระบบตอบกลับ 409 พร้อม 3 ช่วงที่ว่างและใกล้เคียงที่สุดภายในวันเดียวกันและวันถัดไป และไม่สร้างรายการจองซ้อน
- สถานะ: พร้อมทำ

### T-06 รอคำตอบ Q-02 เพื่อกำหนดรูปแบบหมายเลขคิว
- รองรับ: FR-BKG-04, Q-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-06
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/app/db/models.py, frontend/src/pages/BookingResult.jsx
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: ได้คำตอบ Q-02 แล้วจึงกำหนดรูปแบบหมายเลขคิวและแสดงผลบนหน้าจอให้ตรงตามรูปแบบที่ตกลงกัน
- สถานะ: รอ Q-02

### T-07 สร้างคิวส่งข้อความและการส่งซ้ำ
- รองรับ: FR-BKG-05, IF-NOT-01, NFR-REL-02
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: backend/app/notify/queue.py, backend/app/booking/service.py, backend/tests/test_notify_retry.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: ระบบบันทึกการจองแม้ส่งข้อความไม่สำเร็จ แล้ววางงานส่งซ้ำไว้ในคิวและมีรายการค้างส่งที่กำหนดส่งภายใน 5 นาที
- สถานะ: พร้อมทำ

### T-08 เพิ่ม audit log ทุกครั้งที่เข้าถึงข้อมูลการจอง
- รองรับ: DOM-PDPA-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: backend/app/audit/middleware.py, backend/app/db/models.py, backend/tests/test_audit_log.py
- ต้องทำหลัง: T-01, T-03
- เสร็จเมื่อ: ทุกการเข้าถึงข้อมูลการจองบันทึก actor_id, action, hn และ accessed_at และ audit log เก็บได้นานกว่า 1 ปี
- สถานะ: พร้อมทำ

### T-09 เชื่อมต่อการยืนยันตัวตนและค้นหาข้อมูลผู้รับบริการจาก HIS
- รองรับ: IF-IDP-01, IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-09
- ไฟล์ที่แตะ: backend/app/auth/idp.py, backend/app/his/client.py, backend/app/booking/router.py, backend/tests/test_auth_his.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ระบบตรวจผลยืนยันตัวตนก่อนเข้าถึงข้อมูลผู้รับบริการ และการค้นหาผู้รับบริการจาก HIS ใช้เลขบัตรเพียงชั่วคราวแล้วเก็บเฉพาะ HN ในฐานข้อมูลการจอง
- สถานะ: พร้อมทำ

### T-10 สร้างหน้าเลือกแพ็กเกจและช่วงเวลา
- รองรับ: FR-BKG-01, FR-BKG-06
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-10
- ไฟล์ที่แตะ: frontend/src/pages/SlotPicker.jsx, frontend/src/App.jsx, frontend/src/api/client.js
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: ผู้ใช้เลือกแพ็กเกจแล้วเห็นช่วงเวลาว่างภายใน 30 วันพร้อมจำนวนที่นั่งคงเหลือ และเมื่อเปลี่ยนแพ็กเกจจะโหลดช่วงเวลาที่ว่างใหม่
- สถานะ: พร้อมทำ

### T-11 สร้างหน้้ายืนยันและข้อเสนอ 3 ช่วงเวลาเต็ม
- รองรับ: FR-BKG-03, FR-BKG-04, FR-BKG-05
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: frontend/src/pages/ConfirmBooking.jsx, frontend/src/pages/BookingResult.jsx, frontend/src/__tests__/AC-BKG-03.test.jsx
- ต้องทำหลัง: T-05, T-10
- เสร็จเมื่อ: หน้าแสดงข้อความ “ช่วงเวลาเต็ม” พร้อม 3 ตัวเลือกที่ใกล้ที่สุด และหลังยืนยันสำเร็จแสดงหมายเลขคิว แม้ส่งข้อความยืนยันไม่สำเร็จ
- สถานะ: พร้อมทำ

### T-12 ต่อหน้าจอกับ API จริง
- รองรับ: FR-BKG-01, FR-BKG-03, FR-BKG-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-12
- ไฟล์ที่แตะ: frontend/src/api/client.js, frontend/src/pages/SlotPicker.jsx, frontend/src/pages/ConfirmBooking.jsx, frontend/src/pages/BookingResult.jsx
- ต้องทำหลัง: T-02, T-05, T-10, T-11
- เสร็จเมื่อ: หน้าเลือกเวลาและหน้าผลลัพธ์ใช้ API จริงแทน mock data และการทำงานของหน้าเชื่อมต่อกับ backend ได้ตามสัญญา API
- สถานะ: พร้อมทำ

### T-13 ตรวจสอบสินค้าจริงและปรับปรุงตามสัญญา API สุดท้าย
- รองรับ: FR-BKG-01, FR-BKG-03, FR-BKG-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-13
- ไฟล์ที่แตะ: backend/tests, frontend/src/__tests__
- ต้องทำหลัง: T-07, T-08, T-09, T-12
- เสร็จเมื่อ: การทดสอบของ backend และ frontend ผ่านตาม AC ที่เกี่ยวข้อง และทุก API ส่วนต่อประสานตรงกับสัญญาและเงื่อนไขเดิม
- สถานะ: พร้อมทำ

## ตารางตรวจความครบ AC
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-BKG-01 | T-03 |
| AC-BKG-02 | T-04 |
| AC-BKG-03 | T-05, T-11 |
| AC-BKG-04 | T-07 |
| AC-BKG-05 | T-02 |
| AC-BKG-06 | T-08 |

## ตารางตรวจความครบ Constraint
| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-TECH-01 | T-01 |
| DOM-PDPA-01 | T-01, T-08 |
| IF-IDP-01 | T-09 |
| IF-HIS-01 | T-01, T-09 |
| IF-NOT-01 | T-07 |

## สิ่งที่ยังไม่ทำ
- Q-02 หมายเลขคิวรีเซ็ตรายวัน หรือนับต่อเนื่อง และมีรูปแบบอย่างไร (เช่น A001)?
  -> ถามเจ้าหน้าที่เวชระเบียน (ยังไม่ได้คำตอบ)
  -> รอ task: T-06
