export const currency = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(n);

export const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString() : "";

export const classNames = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");
