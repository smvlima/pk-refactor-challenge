import { useRef, useState } from "react";
import { ReservationData } from "../models";
import { getReservation, saveReservation } from "../api/fakeApi";

interface useUpdateReservationProps {
  id: string | null;
}

export const useUpdateReservation = ({ id }: useUpdateReservationProps) => {
  const [data, setData] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [nights, setNights] = useState(1);
  const [fees, setFees] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  if (id) {
    getReservation(id).then((r: ReservationData) => {
      setData(r);
      setGuestName(r.guestName);
      setNights(r?.nights);
      setFees(r?.fees);
      setLoading(false);
      setTotal((r.basePrice || 0) * (nights || 0) + (fees || 0));
    });
  }

  return { data, error, loading };
};
