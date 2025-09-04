import { ReservationData } from "../components/ReservationDrawer"

const siteNames = ['Site A', 'Site B', 'Site C', 'Site D', 'Site E']
const guestFirstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Drew', 'Harper', 'Quinn', 'Avery']
const guestLastNames = ['Smith', 'Johnson', 'Lee', 'Brown', 'Garcia', 'Martinez', 'Davis', 'Rodriguez', 'Lopez', 'Gonzalez']

const randomItem = <T>(arr: T[]): T | undefined => arr[Math.floor(Math.random() * arr.length)]

const randomDate = (): { start: string; end: string; nights: number } => {
  const start = new Date(2023, 1, Math.floor(Math.random() * 28) + 1)
  const nights = Math.floor(Math.random() * 5) + 1
  const end = new Date(start)
  end.setDate(start.getDate() + nights)
  return {
    start: start.toISOString().split('T')[0] || '',
    end: end.toISOString().split('T')[0] || '',
    nights
  }
}

const generateMockData = (count: number): Record<string, ReservationData> => {
  const data: Record<string, ReservationData> = {}

  for (let i = 0; i < count; i++) {
    const id = Math.random().toString(36).substring(2, 8)
    const guestName = `${randomItem(guestFirstNames)} ${randomItem(guestLastNames)}`
    const siteName = randomItem(siteNames) || ''
    const { start, end, nights } = randomDate()

    data[id] = {
      id,
      guestName,
      siteName,
      startDate: start,
      endDate: end,
      checkinTime: '15:00',
      checkoutTime: '11:00',
      basePrice: Math.floor(Math.random() * 100) + 30,
      nights,
      fees: Math.floor(Math.random() * 30) + 5
    }
  }

  return data
}

const db = generateMockData(500)

type GetReservationsParams = {
  page?: number
  perPage?: number
}

type Paginated<T> = {
  data: T[]
  page: number
  perPage: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export async function getReservations(
  params: GetReservationsParams = {}
): Promise<Paginated<ReservationData>> {
  const {
    page = 1,
    perPage = 25,
  } = params

  await delay(150)

  const items = Object.values(db)

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const start = (safePage - 1) * perPage
  const end = start + perPage

  return {
    data: items.slice(start, end),
    page: safePage,
    perPage,
    total,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1
  }
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
