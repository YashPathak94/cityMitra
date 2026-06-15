"use client";

import { ExternalLink, Plane, BedDouble, TrainFront, UtensilsCrossed, Car, Stethoscope, Sparkles } from "lucide-react";
import { BookingCategory, BookingOption } from "@/lib/booking";

const categoryIcons: Record<BookingCategory, typeof Plane> = {
  flights: Plane,
  hotels: BedDouble,
  trains: TrainFront,
  food: UtensilsCrossed,
  cabs: Car,
  doctor: Stethoscope
};

export type ConciergeGroup = {
  category: BookingCategory;
  label: string;
  options: BookingOption[];
};

type ConciergeCardProps = {
  groups: ConciergeGroup[];
  onOpen: (provider: string, category: BookingCategory) => void;
};

export default function ConciergeCard({ groups, onOpen }: ConciergeCardProps) {
  if (groups.length === 0) return null;

  return (
    <div className="conciergeCard" aria-label="CityMitra booking concierge">
      <div className="conciergeHead">
        <Sparkles size={15} />
        <strong>CityMitra Concierge</strong>
        <span>Compare &amp; book in one tap</span>
      </div>
      {groups.map((group) => {
        const Icon = categoryIcons[group.category];
        return (
          <div className="conciergeGroup" key={group.category}>
            <div className="conciergeGroupTitle">
              <Icon size={15} />
              {group.label}
            </div>
            <div className="conciergeOptions">
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
      <p className="conciergeNote">
        Links open partner sites. CityMitra may earn a commission — prices are set by the provider; always confirm before paying.
      </p>
    </div>
  );
}
