import { useState } from "react";
import { ReservationData } from "../models";
import { getReservations } from "../api/fakeApi";

export const useReservations = () => {
  const [rows, setRows] = useState<ReservationData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const startIdx = (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, total);

  if (rows.length === 0 && isLoading) {
    getReservations()
      .then(({ data, page, perPage, totalPages }) => {
        setRows(data || []);
        setPage(page);
        setPerPage(perPage);
        setTotalPages(totalPages);
        setIsLoading(false);
      })
      .catch((e: any) => {
        setError(e?.message || "Failed to load reservations");
        setIsLoading(false);
      });
  }

  return {
    rows,
    page,
    perPage,
    totalPages,
    total,
    startIdx,
    endIdx,
    isLoading,
    error,
    setPage,
    setPerPage,
  };
};
