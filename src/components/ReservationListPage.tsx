import React, { useState } from "react";
import ReservationList from "./ReservationList";
import ReservationDrawer from "./ReservationDrawer";

const ReservationListPage: React.FC<{}> = ({}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const openDrawer = (rid: string) => {
    setSelectedId(rid);
    setDrawerOpen(true);
  };

  return (
    <div className="w-full">
      <ReservationList onOpen={openDrawer} />
      {drawerOpen && (
        <ReservationDrawer
          id={selectedId}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
};

export default ReservationListPage;
