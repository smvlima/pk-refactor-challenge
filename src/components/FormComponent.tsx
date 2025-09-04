import React, { useEffect, useState } from "react";
import {
  FormDateField,
  FormNumField,
  FormTextField,
  FormTimeField,
} from "./FormFields";
import { ReservationData } from "../models";
import { saveReservation } from "../api/fakeApi";
import { currency } from "../utils";
import { log } from "console";

interface FormComponentProps {
  data: ReservationData;
  isRequestLoading: boolean;
  onClose: () => void;
}

export const FormComponent: React.FC<FormComponentProps> = ({
  data,
  isRequestLoading,
  onClose,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(isRequestLoading);
  const [guestName, setGuestName] = useState(data.guestName);
  const [siteName, setSiteName] = useState(data.siteName);
  const [startDate, setStartDate] = useState(data.startDate);
  const [endDate, setEndDate] = useState(data.endDate);
  const [checkinTime, setCheckinTime] = useState(data.checkinTime ?? "15:00");
  const [checkoutTime, setCheckoutTime] = useState(data.checkinTime ?? "11:00");
  const [nights, setNights] = useState(data.nights ?? 1);
  const [fees, setFees] = useState(data.fees);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (data) {
      setTotal((data.basePrice || 0) * (nights || 0) + (fees || 0));
    }
  }, [nights, fees, data]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setError(null);
    setIsLoading(true);

    const payload: ReservationData = {
      ...data,
      guestName,
      siteName,
      startDate,
      endDate,
      checkinTime,
      checkoutTime,
      nights,
      fees,
      total,
    };

    saveReservation(payload)
      .then(() => {
        alert("saved");
        onClose();
      })
      .catch((err: any) => setError(err?.message || "failed to save"))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700"
        >
          {error}
        </div>
      )}

      {isLoading && <div className="text-sm text-gray-500">Loading…</div>}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormTextField
            label="Guest name"
            fieldValue={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
          <FormTextField
            label="Site name"
            fieldValue={siteName}
            onChange={(e) => setSiteName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormDateField
              label="Start date"
              fieldValue={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <FormDateField
              label="End date"
              fieldValue={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormTimeField
              label="Check-in time"
              fieldValue={checkinTime}
              onChange={(e) => setCheckinTime(e.target.value)}
            />
            <FormTimeField
              label="Check-out time"
              fieldValue={checkoutTime}
              onChange={(e) => setCheckoutTime(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormNumField
              label="Nights"
              fieldValue={nights}
              onChange={(e) => setNights(Number(e.target.value))}
            />
            <FormNumField
              label="Fees"
              fieldValue={fees}
              onChange={(e) => setFees(Number(e.target.value))}
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">
                Price/night
              </label>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800">
                {currency(data.basePrice ?? 0)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="text-base">
            Total: <span className="font-semibold">{currency(total)}</span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
};
