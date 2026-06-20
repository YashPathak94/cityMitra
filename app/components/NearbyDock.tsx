"use client";

import { Map, Navigation, X } from "lucide-react";
import { useState } from "react";

type NearbyDockProps = {
  locationOn: boolean;
  onLocation: () => void;
  onOpenMaps: () => void;
};

export default function NearbyDock({ locationOn, onLocation, onOpenMaps }: NearbyDockProps) {
  const [open, setOpen] = useState(false);

  const actions = [
    {
      key: "location",
      label: locationOn ? "Location on" : "Use my location",
      cls: locationOn ? "dockLoc on" : "dockLoc",
      icon: <Navigation size={20} />,
      onClick: onLocation
    },
    {
      key: "maps",
      label: "Open Maps",
      cls: "dockMap",
      icon: <Map size={20} />,
      onClick: onOpenMaps
    }
  ];

  return (
    <>
      {/* Desktop: right-edge tabs that slide out on hover */}
      <div className="nearbyDock" aria-label="Nearby quick actions">
        {actions.map((action) => (
          <button key={action.key} type="button" className={`nearbyDockTab ${action.cls}`} onClick={action.onClick}>
            <span className="nearbyDockIcon">{action.icon}</span>
            <span className="nearbyDockLabel">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile: floating dock bottom-right */}
      <div className="nearbyDockMobile">
        {open && <button type="button" aria-label="Close" className="nearbyDockScrim" onClick={() => setOpen(false)} />}
        <div className={open ? "nearbyDockFan open" : "nearbyDockFan"}>
          {actions.map((action) => (
            <button
              key={action.key}
              type="button"
              className={`nearbyDockFab ${action.cls}`}
              aria-label={action.label}
              onClick={() => {
                action.onClick();
                setOpen(false);
              }}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
        <button type="button" className="nearbyDockToggle" aria-label="Nearby quick actions" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
          {open ? <X size={22} /> : <Navigation size={22} />}
        </button>
      </div>
    </>
  );
}
