"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BedDouble,
  Car,
  ExternalLink,
  MapPin,
  Plane,
  Sparkles,
  Stethoscope,
  Store,
  TrainFront,
  UtensilsCrossed,
  X
} from "lucide-react";
import { BookingCategory } from "@/lib/booking";
import { ConciergeGroup } from "@/app/components/ConciergeCard";

const categoryIcons: Record<BookingCategory, typeof Plane> = {
  flights: Plane,
  hotels: BedDouble,
  trains: TrainFront,
  food: UtensilsCrossed,
  cabs: Car,
  doctor: Stethoscope
};

export type LocalPicks = {
  label: string;
  city: string;
  items: Array<{ name: string; area: string; query: string }>;
};

type ConciergePipProps = {
  groups: ConciergeGroup[] | null;
  localPicks?: LocalPicks | null;
  city: string;
  onClose: () => void;
  onOpen: (provider: string, category: BookingCategory) => void;
};

function mapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export default function ConciergePip({ groups, localPicks, city, onClose, onOpen }: ConciergePipProps) {
  const reduceMotion = useReducedMotion();
  const hasBooking = Boolean(groups && groups.length > 0);
  const hasLocal = Boolean(localPicks && localPicks.items.length > 0);

  return (
    <AnimatePresence>
      {(hasBooking || hasLocal) && (
        <motion.aside
          className="conciergePip"
          role="dialog"
          aria-label="CityMitra concierge"
          initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="conciergePipHead">
            <span>
              <Sparkles size={15} />
              Concierge · {city}
            </span>
            <button type="button" onClick={onClose} aria-label="Close concierge">
              <X size={16} />
            </button>
          </div>

          <div className="conciergePipBody">
            {hasLocal && localPicks && (
              <div className="conciergePipGroup">
                <div className="conciergePipGroupTitle">
                  <Store size={14} />
                  Top {localPicks.label.toLowerCase()} in {localPicks.city}
                </div>
                <div className="conciergePipLocal">
                  {localPicks.items.map((item, index) => (
                    <a
                      key={`${item.name}-${index}`}
                      href={mapsSearch(item.query)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="conciergeLocalIndex">{String(index + 1).padStart(2, "0")}</span>
                      <span className="conciergeLocalText">
                        <b>{item.name}</b>
                        <small>{item.area}</small>
                      </span>
                      <MapPin size={13} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {hasBooking &&
              groups!.map((group) => {
                const Icon = categoryIcons[group.category];
                return (
                  <div className="conciergePipGroup" key={group.category}>
                    <div className="conciergePipGroupTitle">
                      <Icon size={14} />
                      Book {group.label.toLowerCase()}
                    </div>
                    <div className="conciergePipOptions">
                      {group.options.map((option) => (
                        <a
                          key={option.provider}
                          href={option.url}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          onClick={() => onOpen(option.provider, group.category)}
                        >
                          <b>{option.label}</b>
                          <small>{option.note}</small>
                          <ExternalLink size={13} />
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>

          <p className="conciergePipNote">
            Local picks open in Maps. Booking links are partner sites — CityMitra may earn a commission. Confirm before paying.
          </p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
