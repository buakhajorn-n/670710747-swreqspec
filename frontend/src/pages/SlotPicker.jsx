import { useEffect, useState } from 'react'

const packages = [
  { code: 'standard', label: 'แพ็กเกจมาตรฐาน' },
  { code: 'executive', label: 'แพ็กเกจพิเศษ' },
]

function formatDate(date) {
  return new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`))
}

function groupByDate(slots) {
  return slots.reduce((groups, slot) => {
    groups[slot.slot_date] ??= []
    groups[slot.slot_date].push(slot)
    return groups
  }, {})
}

// Supports: FR-BKG-01, FR-BKG-06
export default function SlotPicker({ client }) {
  const [packageCode, setPackageCode] = useState('standard')
  const [dateFrom] = useState(() => new Date().toISOString().slice(0, 10))
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setSelectedSlot(null)

    client.getSlots({ dateFrom, packageCode })
      .then((nextSlots) => {
        if (active) setSlots(nextSlots)
      })
      .catch(() => {
        if (active) setError('ไม่สามารถโหลดช่วงเวลาที่ว่างได้')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [client, dateFrom, packageCode])

  const slotsByDate = groupByDate(slots)

  return (
    <section className="min-h-screen bg-stone-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <p className="mb-2 text-sm font-semibold text-teal-700">ระบบจองคิวตรวจสุขภาพ</p>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">ขั้นตอนที่ 1 จาก 3</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">เลือกแพ็กเกจและช่วงเวลาตรวจ</h1>
          <p className="mt-2 max-w-2xl text-slate-600">เลือกแพ็กเกจเพื่อดูช่วงเวลาที่ว่างภายใน 30 วันข้างหน้า</p>
        </header>

        <div className="mb-8 grid gap-6 sm:grid-cols-[minmax(0,20rem)_1fr]">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">แพ็กเกจตรวจสุขภาพ</span>
            <select
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 shadow-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
              value={packageCode}
              onChange={(event) => setPackageCode(event.target.value)}
            >
              {packages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
            </select>
          </label>
          <div className="rounded-md border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-900">
            <strong>วันที่เริ่มค้นหา:</strong> {formatDate(dateFrom)}
            <br />ระบบจะแสดงช่วงเวลาต่อเนื่อง 30 วัน พร้อมจำนวนที่นั่งคงเหลือ
          </div>
        </div>

        {loading && <p className="rounded-md bg-white p-5 text-slate-600 shadow-sm">กำลังโหลดช่วงเวลาที่ว่าง...</p>}
        {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-5 text-red-800">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(slotsByDate).map(([date, dateSlots]) => (
              <article className="rounded-md border border-slate-200 bg-white p-5 shadow-sm" key={date}>
                <h2 className="mb-4 font-semibold text-slate-950">{formatDate(date)}</h2>
                <div className="grid gap-3">
                  {dateSlots.map((slot) => {
                    const unavailable = slot.remaining === 0
                    const selected = selectedSlot?.id === slot.id
                    return (
                      <button
                        className={`flex items-center justify-between rounded-md border px-4 py-3 text-left transition ${selected ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-200' : 'border-slate-200 bg-white hover:border-teal-400'} ${unavailable ? 'cursor-not-allowed opacity-50' : ''}`}
                        disabled={unavailable}
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        type="button"
                      >
                        <span className="font-semibold">{slot.start_time} น.</span>
                        <span className={unavailable ? 'text-red-700' : 'text-slate-600'}>
                          {unavailable ? 'เต็ม' : `เหลือ ${slot.remaining} ที่`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </article>
            ))}
          </div>
        )}

        {selectedSlot && (
          <div className="sticky bottom-4 mt-8 flex items-center justify-between gap-4 rounded-md bg-slate-950 px-5 py-4 text-white shadow-lg">
            <span>เลือก {formatDate(selectedSlot.slot_date)} เวลา {selectedSlot.start_time} น.</span>
            <button className="rounded-md bg-teal-400 px-4 py-2 font-semibold text-slate-950" type="button">ดำเนินการต่อ</button>
          </div>
        )}
      </div>
    </section>
  )
}
