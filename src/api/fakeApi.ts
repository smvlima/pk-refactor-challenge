type Reservation = {
  id: string
  guestName: string
  nights: number
  basePrice: number
  fees: number
}

const db: Record<string, Reservation> = {
  abc123: { id: 'abc123', guestName: 'Alex Camper', nights: 2, basePrice: 40, fees: 10 }
}

export async function getReservation(id: string): Promise<Reservation> {
  await delay(150)
  const r = db[id]
  if (!r) throw new Error('not found')
  return { ...r }
}

export async function saveReservation(r: Reservation & { total?: number }): Promise<void> {
  await delay(150)
  if (!r.guestName?.trim()) throw new Error('Guest name is required')
    db[r.id] = { id: r.id, guestName: r.guestName, nights: r.nights, basePrice: r.basePrice, fees: r.fees }
}

function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms))
}
