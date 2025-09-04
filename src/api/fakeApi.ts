import { ReservationData } from "../components/ReservationDrawer"

const db: Record<string, ReservationData> = {
  abc123: {
    id: 'abc123',
    guestName: 'Alex Camper',
    siteName: 'Site A',
    startDate: '2023-02-01',
    endDate: '2023-02-03',
    checkinTime: '15:00',
    checkoutTime: '11:00',
    basePrice: 40,
    nights: 2,
    fees: 10
  },
  def456: {
    id: 'def456',
    guestName: 'Jordan Smith',
    siteName: 'Site B',
    startDate: '2023-02-01',
    endDate: '2023-02-03',
    checkinTime: '15:00',
    checkoutTime: '11:00',
    basePrice: 50,
    nights: 2,
    fees: 15
  },
  ghi789: {
    id: 'ghi789',
    guestName: 'Taylor Johnson',
    siteName: 'Site C',
    startDate: '2023-02-02',
    endDate: '2023-02-07',
    checkinTime: '15:00',
    checkoutTime: '11:00',
    basePrice: 60,
    nights: 2,
    fees: 20
  },
  jkl012: {
    id: 'jkl012',
    guestName: 'Morgan Lee',
    siteName: 'Site B',
    startDate: '2023-02-15',
    endDate: '2023-02-17',
    checkinTime: '15:00',
    checkoutTime: '11:00',
    basePrice: 70,
    nights: 2,
    fees: 25
  }
}

export async function getReservations(): Promise<ReservationData[]> {
  await delay(150)
  return Object.values(db)
}

export async function getReservation(id: string): Promise<ReservationData> {
  await delay(150)
  const r = db[id]
  if (!r) throw new Error('not found')
  return { ...r }
}

export async function saveReservation(r: ReservationData & { total?: number }): Promise<void> {
  await delay(150)
  if (!r.guestName?.trim()) throw new Error('Guest name is required')
  db[r.id] = { ...r }
}

function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms))
}
