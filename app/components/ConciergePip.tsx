"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BedDouble,
  Car,
  ExternalLink,
  Plane,
  Sparkles,
  Stethoscope,
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

type ConciergePipProps = {
  groups: ConciergeGroup[] | null;
  city: string;
  onClose: () => void;
  onOpen: (provider: string, category: BookingCategory) => void;
};

export default function ConciergePip({ groups, city, onClose, onOpen }: ConciergePipProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {groups && groups.length > 0 && (
        <motion.aside
          className="conciergePip"
          role="dialog"
          aria-label="Booking concierge"
          initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="conciergePipHead">
            <span>
              <Sparkles size={15} />
              Book in {city}
            </span>
            <button type="button" onClick={onClose} aria-label="Close concierge">
              <X size={16} />
            </button>
          </div>

          <div className="conciergePipBody">
            {groups.map((group) => {
              const Icon = categoryIcons[group.category];
              return (
                <div className="conciergePipGroup" key={group.category}>
                  <div className="conciergePipGroupTitle">
                    <Icon size={14} />
                    {group.label}
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

          <p className="conciergePipNote">Partner links — CityMitra may earn a commission. Confirm prices before paying.</p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
