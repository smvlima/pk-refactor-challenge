import { ReservationData } from "../components/ReservationDrawer"
import { db } from "../db/mockdb"

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
