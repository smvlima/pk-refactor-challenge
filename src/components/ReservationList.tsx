import React, { useState } from 'react'
import { getReservations } from '../api/fakeApi'

export interface ReservationData {
  id: string
  guestName: string
  siteName: string
  startDate: string // ISO
  endDate: string   // ISO
  checkinTime: string // '15:00'
  checkoutTime: string // '11:00'
  basePrice: number
  nights: number
  fees: number
  total?: number
}

const currency = (n: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)
const fmtDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString() : ''

const ReservationList: React.FC<{
  onOpen: (id: string) => void
}> = ({ onOpen }) => {
  const [rows, setRows] = useState<ReservationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  if (rows.length === 0 && loading) {
    getReservations()
      .then((list: ReservationData[]) => {
        setRows(list || [])
        setLoading(false)
      })
      .catch((e: any) => {
        setError(e?.message || 'Failed to load reservations')
        setLoading(false)
      })
  }

  const filtered = !query
    ? rows
    : rows.filter(r =>
        (r.guestName || '').toLowerCase().includes(query.toLowerCase()) ||
        (r.siteName || '').toLowerCase().includes(query.toLowerCase()) ||
        (r.id || '').toLowerCase().includes(query.toLowerCase())
      )

  return (
    <div className='w-full max-w-7xl mx-auto p-4'>
      <div className='mb-4 flex items-center justify-between gap-3'>
        <div>
          <h1 className='text-xl font-semibold tracking-tight'>Reservations</h1>
          <p className='text-sm text-gray-500'>Manage stays, guests, and balances</p>
        </div>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='Search name, site, id…'
          className='w-60 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-200'
        />
      </div>

      {error && (
        <div role='alert' className='mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-red-700'>
          {error}
        </div>
      )}

      <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
        <table className='min-w-full border-collapse'>
          <thead className='bg-gray-50 text-left text-sm text-gray-600'>
            <tr>
              <th className='px-4 py-3 font-medium'>Guest</th>
              <th className='px-4 py-3 font-medium'>Site</th>
              <th className='px-4 py-3 font-medium'>Start</th>
              <th className='px-4 py-3 font-medium'>End</th>
              <th className='px-4 py-3 font-medium'>Check-in</th>
              <th className='px-4 py-3 font-medium'>Check-out</th>
              <th className='px-4 py-3 font-medium text-right'>Total owed</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {loading && (
              <tr>
                <td colSpan={7} className='px-4 py-6 text-sm text-gray-500'>Loading…</td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className='px-4 py-6 text-sm text-gray-500'>No reservations</td>
              </tr>
            )}

            {filtered.map(r => {
              const total = (r.basePrice || 0) * (r.nights || 0) + (r.fees || 0)
              return (
                <tr
                  key={r.id}
                  className='hover:bg-gray-50 cursor-pointer'
                  onClick={() => onOpen(r.id)}
                >
                  <td className='px-4 py-3 text-nowrap'>
                    <div className='font-medium text-gray-900'>{r.guestName}</div>
                    <div className='text-xs text-gray-500'>#{r.id}</div>
                  </td>
                  <td className='px-4 py-3'>{r.siteName}</td>
                  <td className='px-4 py-3'>{fmtDate(r.startDate)}</td>
                  <td className='px-4 py-3'>{fmtDate(r.endDate)}</td>
                  <td className='px-4 py-3'>{r.checkinTime}</td>
                  <td className='px-4 py-3'>{r.checkoutTime}</td>
                  <td className='px-4 py-3 text-right font-medium'>{currency(total)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ReservationList
