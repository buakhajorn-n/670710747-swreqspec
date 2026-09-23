# Tasks: จองคิวตรวจสุขภาพ (Booking)
Feature: จองคิวตรวจสุขภาพ (Booking)
Spec ID: SPEC-BKG-001
อ้างอิง plan.md: specs/001-booking/plan.md (plan v1)
วันที่: 2569-09-23

สรุป:
- ทำทั้งหมด 14 task
- มี 1 task ที่ต้องรอ Open Question คือ Q-02

### T-01 สร้างตารางและ migration
- รองรับ: CON-TECH-01, DOM-PDPA-01, IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-01
- ไฟล์ที่แตะ: backend/app/config.py, backend/app/db/models.py, backend/app/db/session.py, backend/app/db/migrations/001_init.py
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: migration สร้างตาราง slots, bookings และ audit_logs สำหรับ PostgreSQL โดย bookings ไม่มีเลขบัตรประชาชน
- สถานะ: พร้อมทำ

### T-02 สร้าง API ค้นหาช่วงเวลาว่าง
- รองรับ: FR-BKG-01, FR-BKG-06, NFR-PERF-01
- ตรวจด้วย: AC-BKG-05
- ไฟล์ที่แตะ: backend/app/slots/router.py, backend/app/slots/service.py, backend/tests/test_slots.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: GET /slots คืนช่วงเวลาภายใน 30 วันพร้อมที่นั่งคงเหลือและผลทดสอบ p95 รองรับผู้ใช้พร้อมกัน 200 คนตามเกณฑ์
- สถานะ: พร้อมทำ

### T-03 สร้าง API บันทึกการจองและตัดที่นั่ง
- รองรับ: FR-BKG-04
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: backend/app/booking/router.py, backend/app/booking/service.py, backend/tests/test_booking_basic.py
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: test_AC_BKG_01 ผ่าน โดยการจองถูกบันทึกและที่นั่งของช่วง 09.00 น. ลดจาก 1 เป็น 0
- สถานะ: พร้อมทำ

### T-04 ปฏิเสธการจองซ้ำในวันเดียวกัน
- รองรับ: FR-BKG-02
- ตรวจด้วย: AC-BKG-02
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/tests/test_booking_duplicate.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: test_AC_BKG_02 ผ่าน โดยระบบปฏิเสธการจองใหม่และแสดงหมายเลขคิวเดิม
- สถานะ: พร้อมทำ

### T-05 เสนอช่วงเวลาใหม่เมื่อช่วงที่เลือกเต็ม
- รองรับ: FR-BKG-03
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: backend/app/slots/service.py, backend/app/booking/service.py, backend/tests/test_booking_full_slot.py
- ต้องทำหลัง: T-03, T-04
- เสร็จเมื่อ: test_AC_BKG_03 ผ่าน โดยตอบ 409 พร้อม 3 ช่วงที่ว่างใกล้ที่สุดในวันเดียวกันและวันถัดไป และไม่สร้างการจองซ้อน
- สถานะ: พร้อมทำ

### T-06 สร้างคิวส่งข้อความยืนยันและส่งซ้ำ
- รองรับ: FR-BKG-05, IF-NOT-01, NFR-REL-02
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: backend/app/notify/queue.py, backend/app/booking/service.py, backend/tests/test_notify_retry.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: test_AC_BKG_04 ผ่าน โดยการจองยังถูกบันทึกและข้อความที่ส่งไม่สำเร็จมีงานส่งซ้ำภายใน 5 นาที
- สถานะ: พร้อมทำ

### T-07 บันทึก audit log การเข้าถึงข้อมูลการจอง
- รองรับ: DOM-PDPA-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: backend/app/audit/middleware.py, backend/app/db/models.py, backend/tests/test_audit_log.py
- ต้องทำหลัง: T-01, T-03
- เสร็จเมื่อ: test_AC_BKG_06 ผ่าน โดย audit log ระบุผู้เข้าถึง เวลา และ HN และรองรับการเก็บไม่น้อยกว่า 1 ปี
- สถานะ: พร้อมทำ

### T-08 ตรวจผลยืนยันตัวตนและค้นหา HN จาก HIS
- รองรับ: IF-IDP-01, IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-08
- ไฟล์ที่แตะ: backend/app/auth/idp.py, backend/app/his/client.py, backend/app/booking/router.py, backend/tests/test_auth_his.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: test พื้นฐานของ T-08 ผ่าน โดย endpoint ตรวจผลจาก IDP ก่อน และ lookup ส่งเลขบัตรไป HIS แต่คืนและเก็บเฉพาะ HN
- สถานะ: พร้อมทำ

### T-09 สร้างหน้าเลือกแพ็กเกจและช่วงเวลา
- รองรับ: FR-BKG-01, FR-BKG-06
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-09
- ไฟล์ที่แตะ: frontend/src/pages/SlotPicker.jsx, frontend/src/App.jsx, frontend/src/api/client.js
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: หน้าจอแสดงช่วงเวลาพร้อมที่นั่งคงเหลือ และเปลี่ยนแพ็กเกจแล้วโหลดช่วงเวลาใหม่จาก API จำลองตามสัญญา
- สถานะ: เสร็จ รอทีมตรวจ

### T-10 สร้างหน้ายืนยันและหน้าแสดงผลการจอง
- รองรับ: FR-BKG-03, FR-BKG-04, FR-BKG-05
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: frontend/src/pages/ConfirmBooking.jsx, frontend/src/pages/BookingResult.jsx, frontend/src/__tests__/AC-BKG-03.test.jsx
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: AC-BKG-03.test.jsx ผ่าน โดยหน้าแสดง “ช่วงเวลาเต็ม” และตัวเลือก 3 ช่วงจาก API จำลอง และหน้าแสดงผลแสดงหมายเลขคิวเมื่อการจองสำเร็จ
- สถานะ: พร้อมทำ

### T-11 เชื่อมหน้าจอกับ API จริง
- รองรับ: FR-BKG-01, FR-BKG-03, FR-BKG-04, FR-BKG-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-11
- ไฟล์ที่แตะ: frontend/src/api/client.js, frontend/src/pages/SlotPicker.jsx, frontend/src/pages/ConfirmBooking.jsx, frontend/src/pages/BookingResult.jsx
- ต้องทำหลัง: T-02, T-05, T-06, T-09, T-10
- เสร็จเมื่อ: หน้าจอใช้ GET /slots, POST /bookings และ GET /bookings/{id} จริงตามสัญญา API โดยไม่ใช้ข้อมูลจำลอง
- สถานะ: พร้อมทำ

### T-12 บังคับใช้การรับส่งข้อมูลผ่าน TLS
- รองรับ: NFR-SEC-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-12
- ไฟล์ที่แตะ: backend/app/main.py, backend/app/config.py, backend/tests/test_transport_security.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: test พื้นฐานของ T-12 ผ่านและตรวจได้ว่าการรับส่งข้อมูลการจองกำหนด TLS 1.2 ขึ้นไปในสภาพแวดล้อมที่ใช้งานจริง
- สถานะ: พร้อมทำ

### T-13 ตรวจ usability การจองของผู้ใช้ใหม่
- รองรับ: NFR-USE-01, ASM-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-13
- ไฟล์ที่แตะ: frontend/src/__tests__/booking-usability.test.jsx
- ต้องทำหลัง: T-11
- เสร็จเมื่อ: มีการทดสอบกับผู้ใช้ใหม่ 10 คนตาม ASM-05 และผู้ใช้ไม่น้อยกว่า 8 คนจองสำเร็จภายใน 3 นาทีโดยไม่ขอความช่วยเหลือ
- สถานะ: พร้อมทำ

### T-14 กำหนดการออกและแสดงหมายเลขคิวตาม Q-02
- รองรับ: FR-BKG-04, Q-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-14
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/app/db/models.py, frontend/src/pages/BookingResult.jsx
- ต้องทำหลัง: T-03, T-10
- เสร็จเมื่อ: หลัง Q-02 ได้คำตอบแล้ว จึงกำหนดวิธีออกและรูปแบบหมายเลขคิวตามคำตอบนั้น และแสดงผลได้ถูกต้อง
- สถานะ: รอ Q-02

## ตารางตรวจความครบ AC
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-BKG-01 | T-03 |
| AC-BKG-02 | T-04 |
| AC-BKG-03 | T-05, T-10 |
| AC-BKG-04 | T-06 |
| AC-BKG-05 | T-02 |
| AC-BKG-06 | T-07 |

## ตารางตรวจความครบ Constraint
| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-TECH-01 | T-01 |
| DOM-PDPA-01 | T-01, T-07 |
| IF-IDP-01 | T-08 |
| IF-HIS-01 | T-01, T-08 |
| IF-NOT-01 | T-06 |

## สิ่งที่ยังไม่ทำ
- Q-02 หมายเลขคิวรีเซ็ตรายวัน หรือนับต่อเนื่อง และมีรูปแบบอย่างไร (เช่น A001)?
	-> ถามเจ้าหน้าที่เวชระเบียน (ยังไม่ได้คำตอบ)
	-> รอ task: T-14
