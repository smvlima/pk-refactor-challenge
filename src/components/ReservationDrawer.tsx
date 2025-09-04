import React, { useEffect, useRef, useState } from 'react'
import { getReservation, saveReservation } from '../api/fakeApi'

export interface ReservationData {
  id: string
  guestName: string
  siteName: string
  startDate: string // ISO
  endDate: string   // ISO
  checkinTime: string // '15:00'
  checkoutTime: string // '11:00'
  basePrice: number // per night
  nights: number
  fees: number // flat
  total?: number
}

const currency = (n: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)
const classNames = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(' ')

const ReservationDrawer: React.FC<{
  open: boolean
  id: string | null
  onClose: () => void
}> = ({ open, id, onClose }) => {
  const [data, setData] = useState<ReservationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guestName, setGuestName] = useState('')
  const [siteName, setSiteName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [checkinTime, setCheckinTime] = useState('15:00')
  const [checkoutTime, setCheckoutTime] = useState('11:00')
  const [nights, setNights] = useState(1)
  const [fees, setFees] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open || !id) return
    setLoading(true)
    setError(null)
    getReservation(id)
      .then((r: ReservationData) => {
        setData(r)
        setGuestName(r.guestName)
        setNights(r?.nights)
        setFees(r?.fees)
        setLoading(false)
      })
  }, [open, id])

  useEffect(() => {
    if (data) setTotal((data.basePrice || 0) * (nights || 0) + (fees || 0))
  }, [nights])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return
    setFormError(null)
    setLoading(true)
    const payload: ReservationData = {
      ...data,
      guestName,
      siteName,
      startDate,
      endDate,
      checkinTime,
      checkoutTime,
      nights,
      fees,
      total
    }
    saveReservation(payload)
      .then(() => {
        alert('saved')
        onClose()
      })
      .catch((err: any) => setFormError(err?.message || 'failed to save'))
      .finally(() => setLoading(false))
  }

  return (
    <div
      aria-hidden={!open}
      className={classNames(
        'fixed inset-0 z-40 transition',
        open ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      <div
        className={classNames(
          'absolute inset-0 bg-black/30 transition-opacity',
          open ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={classNames(
          'absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl outline-none transition-transform',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className='flex items-center justify-between border-b px-4 py-3'>
          <div>
            <h2 className='text-lg font-semibold'>Edit reservation</h2>
            <p className='text-xs text-gray-500'>ID: {data?.id}</p>
          </div>
          <button onClick={onClose} className='rounded-md border px-2 py-1 text-sm hover:bg-gray-50'>Close</button>
        </div>

        <div className='p-4 space-y-4'>
          {error && (
            <div role='alert' className='rounded-md border border-red-200 bg-red-50 p-3 text-red-700'>
              {error}
            </div>
          )}

          {formError && (
            <div
              role='alert'
              aria-live='assertive'
              className='rounded-md border border-red-200 bg-red-50 p-3 text-red-700'
            >
              {formError}
            </div>
          )}

          {loading && (
            <div className='text-sm text-gray-500'>Loading…</div>
          )}

          {!!data && (
            <form onSubmit={handleSave} className='space-y-4'>
              <div className='grid grid-cols-1 gap-4'>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-800'>Guest name</label>
                  <input
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200'
                  />
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-800'>Site name</label>
                  <input
                    value={siteName}
                    onChange={e => setSiteName(e.target.value)}
                    className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-800'>Start date</label>
                    <input
                      type='date'
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200'
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-800'>End date</label>
                    <input
                      type='date'
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-800'>Check-in time</label>
                    <input
                      type='time'
                      value={checkinTime}
                      onChange={e => setCheckinTime(e.target.value)}
                      className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200'
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-800'>Check-out time</label>
                    <input
                      type='time'
                      value={checkoutTime}
                      onChange={e => setCheckoutTime(e.target.value)}
                      className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-4'>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-800'>Nights</label>
                    <input
                      inputMode='numeric'
                      value={String(nights)}
                      onChange={e => setNights(Number(e.target.value))}
                      className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200'
                    />
                  </div>

                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-800'>Fees</label>
                    <input
                      inputMode='numeric'
                      value={String(fees)}
                      onChange={e => setFees(Number(e.target.value))}
                      className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200'
                    />
                  </div>

                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-800'>Price/night</label>
                    <div className='rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800'>
                      {currency(data.basePrice ?? 0)}
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-2 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm'>
                <div className='text-base'>Total: <span className='font-semibold'>{currency(total)}</span></div>
                <button
                  type='submit'
                  disabled={loading}
                  className='inline-flex items-center rounded-lg border border-gray-300 bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:opacity-50'
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReservationDrawer
