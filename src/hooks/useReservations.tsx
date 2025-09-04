import { useEffect, useState } from "react";
import { ReservationData } from "../models";
import { getReservation, getReservations } from "../api/fakeApi";
import { get } from "http";

interface useReservationProps {
  id?: string | null;
}

export const useReservation = ({ id }: useReservationProps) => {
  const [data, setData] = useState<ReservationData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id !== null && id !== undefined) {
      setIsLoading(true);
      setError(null);
      getReservation(id)
        .then((r: ReservationData) => {
          setData(r);
        })
        .catch((err: any) => setError(err?.message))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  return {
    data,
    isLoading,
    error,
  };
};
