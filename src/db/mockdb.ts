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

const STORAGE_KEY = 'mock:reservations:v1'

const read = <T>(k: string): T | null => {
  try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null }
}
const write = (k: string, v: unknown) => {
  try { localStorage.setItem(k, JSON.stringify(v)) } catch {}
}

const build = (count = 500): Record<string, ReservationData> => {
  const existing = typeof window !== 'undefined' ? read<Record<string, ReservationData>>(STORAGE_KEY) : null
  if (existing && Object.keys(existing).length > 0) return existing
  const fresh = generateMockData(count)
  if (typeof window !== 'undefined') write(STORAGE_KEY, fresh)
  return fresh
}

export let db: Record<string, ReservationData> = build(500)

export const resetMockDb = (count = 500) => {
  db = generateMockData(count)
  if (typeof window !== 'undefined') write(STORAGE_KEY, db)
  return db
}

export const replaceMockDb = (next: Record<string, ReservationData>) => {
  db = next
  if (typeof window !== 'undefined') write(STORAGE_KEY, db)
  return db
}
