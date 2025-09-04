import React, { useState } from "react";
import { getReservations } from "../api/fakeApi";
import { useReservations } from "../hooks";
import { currency, fmtDate } from "../utils";

const ReservationList: React.FC<{
  onOpen: (id: string) => void;
}> = ({ onOpen }) => {
  const {
    rows,
    page,
    perPage,
    totalPages,
    total,
    startIdx,
    endIdx,
    error,
    isLoading,
    setPage,
    setPerPage,
  } = useReservations();

  const [query, setQuery] = useState("");

  const filtered = !query
    ? rows
    : rows.filter(
        (r) =>
          (r.guestName || "").toLowerCase().includes(query.toLowerCase()) ||
          (r.siteName || "").toLowerCase().includes(query.toLowerCase()) ||
          (r.id || "").toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Reservations</h1>
          <p className="text-sm text-gray-500">
            Manage stays, guests, and balances
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, site, id…"
            className="w-60 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <select
            value={perPage}
            onChange={(e) => {
              setPage(1);
              setPerPage(Number(e.target.value));
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-200"
            aria-label="Rows per page"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-red-700"
        >
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50 text-left text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Guest</th>
              <th className="px-4 py-3 font-medium">Site</th>
              <th className="px-4 py-3 font-medium">Start</th>
              <th className="px-4 py-3 font-medium">End</th>
              <th className="px-4 py-3 font-medium">Check-in</th>
              <th className="px-4 py-3 font-medium">Check-out</th>
              <th className="px-4 py-3 font-medium text-right">Total owed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-sm text-gray-500">
                  Loading…
                </td>
              </tr>
            )}

            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-sm text-gray-500">
                  No reservations
                </td>
              </tr>
            )}

            {filtered.map((r, i) => {
              const total =
                (r.basePrice || 0) * (r.nights || 0) + (r.fees || 0);
              return (
                <tr
                  key={i}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onOpen(r.id)}
                >
                  <td className="px-4 py-3 text-nowrap">
                    <div className="font-medium text-gray-900">
                      {r.guestName}
                    </div>
                    <div className="text-xs text-gray-500">#{r.id}</div>
                  </td>
                  <td className="px-4 py-3">{r.siteName}</td>
                  <td className="px-4 py-3">{fmtDate(r.startDate)}</td>
                  <td className="px-4 py-3">{fmtDate(r.endDate)}</td>
                  <td className="px-4 py-3">{r.checkinTime}</td>
                  <td className="px-4 py-3">{r.checkoutTime}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {currency(total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-white">
          <div className="text-sm text-gray-600">
            {total > 0 ? `Showing ${startIdx}–${endIdx} of ${total}` : "—"}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-50"
              onClick={() => setPage(1)}
              disabled={page <= 1 || isLoading}
            >
              First
            </button>
            <button
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
            >
              Prev
            </button>
            <span className="text-sm text-gray-700 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
            >
              Next
            </button>
            <button
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-50"
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages || isLoading}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationList;
