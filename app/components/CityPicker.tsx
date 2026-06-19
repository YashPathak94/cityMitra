"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown, MapPin, Search } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { cities } from "@/data/city-directory";
import { cityAliases, titleCaseCity } from "@/lib/city-intel";

type CityPickerProps = {
  city: string;
  onSelect: (city: string) => void;
};

// Popular cities to surface even though they aren't in the core launch list.
const popularCities = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Jaipur",
  "Ahmedabad",
  "Surat",
  "Lucknow",
  "Indore",
  "Chandigarh",
  "Kochi",
  "Goa",
  "Varanasi",
  "Prayagraj",
  "Agra",
  "Leh"
];

export default function CityPicker({ city, onSelect }: CityPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const allCities = Array.from(new Set([...cities, ...popularCities]));
  const filtered = allCities.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function pick(nextCity: string) {
    onSelect(nextCity);
    setOpen(false);
    setQuery("");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    const alias = cityAliases[trimmed.toLowerCase()];
    pick(alias || filtered[0] || titleCaseCity(trimmed));
  }

  return (
    <div className="cityPicker" ref={wrapperRef}>
      <button type="button" className="cityPickerButton" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <MapPin size={15} />
        <span>{city}</span>
        <ChevronDown size={15} className={open ? "cityChevron open" : "cityChevron"} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="cityPickerPanel"
            initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <form className="cityPickerSearch" onSubmit={submit} role="search">
              <Search size={15} />
              <input
                autoFocus
                aria-label="Search city"
                placeholder="Search any city…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </form>
            <div className="cityPickerList">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <button key={item} type="button" className={item === city ? "active" : ""} onClick={() => pick(item)}>
                    <MapPin size={14} />
                    {item}
                    {item === city && <Check size={14} className="cityPickCheck" />}
                  </button>
                ))
              ) : (
                <button type="button" className="cityPickerUseTyped" onClick={() => submit({ preventDefault: () => {} } as FormEvent)}>
                  Use “{titleCaseCity(query) || query}”
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
