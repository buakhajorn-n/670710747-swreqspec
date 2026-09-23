// จุดเดียวที่หน้าจอใช้เรียก API หลังบ้าน (ตามสัญญา API ใน plan.md ข้อ 4)
// ตอน test ให้ส่ง client จำลองเข้าไปในหน้าจอแทน ไม่ต้องรันหลังบ้านจริง
// เรียกผ่าน /api (ดู proxy ใน vite.config.js) หลังบ้านต้องรันอยู่ที่ port 8000
const BASE = import.meta.env.VITE_API_BASE ?? '/api'

export const api = {
  async getSlots({ dateFrom, packageCode }) {
    const q = new URLSearchParams({ date_from: dateFrom, package_code: packageCode })
    const res = await fetch(`${BASE}/slots?${q}`)
    return res.json()
  },
  async createBooking({ slotId }) {
    const res = await fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_id: slotId }),
    })
    return { status: res.status, body: await res.json() }
  },
}

// Supports: FR-BKG-01, FR-BKG-06
export function createMockApi() {
  return {
    async getSlots({ dateFrom, packageCode }) {
      const startDate = new Date(`${dateFrom}T00:00:00`)
      const slots = []

      for (let offset = 0; offset < 30; offset += 1) {
        const slotDate = new Date(startDate)
        slotDate.setDate(startDate.getDate() + offset)
        const isoDate = slotDate.toISOString().slice(0, 10)

        for (const [index, startTime] of ['09:00', '10:30', '13:00'].entries()) {
          const capacity = packageCode === 'executive' ? 8 : 12
          const remaining = Math.max(0, capacity - ((offset + index) % 4))
          slots.push({ id: `${packageCode}-${isoDate}-${startTime}`, slot_date: isoDate, start_time: startTime, package_code: packageCode, remaining })
        }
      }

      return slots
    },
  }
}
