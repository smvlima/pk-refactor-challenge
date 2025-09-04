export interface ReservationData {
  id: string;
  guestName: string;
  siteName: string;
  startDate: string; // ISO
  endDate: string; // ISO
  checkinTime: string; // '15:00'
  checkoutTime: string; // '11:00'
  basePrice: number;
  nights: number;
  fees: number;
  total?: number;
}
