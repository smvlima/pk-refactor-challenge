export function calcTotal(basePrice: number, nights: number, fees: number) {
  const bp = Number.isFinite(basePrice) ? basePrice : 0
  const n = Number.isFinite(nights) ? nights : 0
  const f = Number.isFinite(fees) ? fees : 0
  return bp * n + f
}
