import React, { useRef, useState } from "react";
import { classNames } from "../utils";
import { FormComponent } from "./FormComponent";
import { useReservation } from "../hooks";
import { ReservationData } from "../models";

const ReservationDrawer: React.FC<{
  id?: string | null;
  onClose: () => void;
}> = ({ id, onClose }) => {
  const panelRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, error } = useReservation({ id });

  return (
    <div
      className={classNames(
        "fixed inset-0 z-40 transition",
        "pointer-events-auto"
      )}
    >
      <div
        className={classNames(
          "absolute inset-0 bg-black/30 transition-opacity",
          "opacity-100"
        )}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={classNames(
          "absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl outline-none transition-transform",
          "translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h2 className="text-lg font-semibold">Edit reservation</h2>
            <p className="text-xs text-gray-500">ID: {data?.id}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700"
            >
              {error}
            </div>
          )}

          {data && (
            <FormComponent
              data={data}
              isRequestLoading={Boolean(isLoading)}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationDrawer;
