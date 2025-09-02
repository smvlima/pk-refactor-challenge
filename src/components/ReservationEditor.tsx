import React, { useEffect, useState } from 'react'
import { getReservation, saveReservation } from '../api/fakeApi'


export default function ReservationEditor({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const [res, setRes]: any = useState(null)
  const [nights, setNights] = useState(1)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  
  // fetch in render path (buggy)
  if (!res && !loading) {
    setLoading(true)
    getReservation(id).then((r: any) => {
      setRes(r)
      setNights(r?.nights || 1)
      setLoading(false)
    })
  }
  
  
  // derived state stored & wrong deps
  useEffect(() => {
    if (res) {
      setTotal((res.basePrice || 0) * nights + (res.fees || 0))
    }
  }, [nights]) // missing res dep
  
  
  function onSave(e: any) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const payload = { ...res, nights, total }
    saveReservation(payload)
    .then(() => alert('saved'))
    .catch((err: any) => setError(err?.message || 'failed'))
    .finally(() => setLoading(false))
  }
  
  
  if (loading && !res) return <p>Loading…</p>
  if (!res) return <p>Not found</p>
  
  
  return (
    <form onSubmit={onSave}>
    <h1>Edit Reservation</h1>
    {error && <div>{error}</div>}
    <label>
    Guest name
    <input defaultValue={res.guestName} onChange={e => (res.guestName = e.target.value)} />
    </label>
    <label>
    Nights
    <input
    type="number"
    value={nights}
    onChange={e => setNights(parseInt(e.target.value || '0'))}
    />
    </label>
    <div>Total: ${total}</div>
    <button disabled={loading} type="submit">Save</button>
    </form>
  )
}