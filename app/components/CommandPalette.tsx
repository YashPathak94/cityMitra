"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CornerDownLeft, MapPin, Search, Sparkles, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { categories } from "@/data/city-directory";
import { indiaCities } from "@/lib/india-cities";

type PaletteProps = {
  open: boolean;
  onClose: () => void;
  onSearch: (text: string) => void;
  onSelectCity?: (city: string) => void;
};

type Item = {
  id: string;
  label: string;
  hint?: string;
  icon: ReactNode;
  group: "Search" | "Quick actions" | "Cities" | "Categories";
  run: () => void;
};

export default function CommandPalette({ open, onClose, onSearch, onSelectCity }: PaletteProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const go = (href: string) => {
    onClose();
    if (href.startsWith("#")) {
      window.setTimeout(() => document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    } else {
      router.push(href);
    }
  };

  const items = useMemo<Item[]>(() => {
    const trimmed = query.trim();
    const lower = trimmed.toLowerCase();
    const result: Item[] = [];

    if (trimmed) {
      result.push({
        id: "search-run",
        label: `Search “${trimmed}”`,
        hint: "Detect city or category",
        icon: <Search size={16} />,
        group: "Search",
        run: () => {
          onClose();
          onSearch(trimmed);
        }
      });
    }

    const actions: Array<{ label: string; href: string; icon: ReactNode; keys: string }> = [
      { label: "Open City Chat", href: "/chat", icon: <Sparkles size={16} />, keys: "chat ai assistant guide" },
      { label: "Build a Travel Plan", href: "/travel-plan", icon: <ArrowRight size={16} />, keys: "travel plan savings calculator funding" },
      { label: "Browse City Guides", href: "/cities", icon: <MapPin size={16} />, keys: "city guide guides" },
      { label: "View Offers & Deals", href: "/offers", icon: <Tag size={16} />, keys: "offers deals discounts coupons" },
      { label: "Jump to Top Picks", href: "#nearby", icon: <ArrowRight size={16} />, keys: "top picks nearby" },
      { label: "CityMitra Pro", href: "/pro", icon: <Sparkles size={16} />, keys: "pro upgrade premium" }
    ];
    actions
      .filter((a) => !lower || a.label.toLowerCase().includes(lower) || a.keys.includes(lower))
      .forEach((a) => result.push({ id: `act-${a.href}`, label: a.label, icon: a.icon, group: "Quick actions", run: () => go(a.href) }));

    const cityMatches = (lower ? indiaCities.filter((c) => c.toLowerCase().includes(lower)) : indiaCities.slice(0, 6)).slice(0, 6);
    cityMatches.forEach((c) =>
      result.push({
        id: `city-${c}`,
        label: c,
        hint: "Set city",
        icon: <MapPin size={16} />,
        group: "Cities",
        run: () => {
          onClose();
          if (onSelectCity) onSelectCity(c);
          else onSearch(c);
        }
      })
    );

    const catMatches = (lower ? categories.filter((cat) => cat.label.toLowerCase().includes(lower)) : categories.slice(0, 6)).slice(0, 6);
    catMatches.forEach((cat) => {
      const Icon = cat.icon;
      result.push({
        id: `cat-${cat.key}`,
        label: cat.label,
        hint: "Find nearby",
        icon: <Icon size={16} />,
        group: "Categories",
        run: () => {
          onClose();
          onSearch(cat.label);
        }
      });
    });

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, onSelectCity]);

  useEffect(() => {
    setActive(0);
  }, [query, open]);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(id);
    }
    setQuery("");
  }, [open]);

  function onKeyDown(event: ReactKeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      items[active]?.run();
    }
  }

  // keep active row in view
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  let renderedGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmdkBackdrop"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.16 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="cmdkPanel"
            role="dialog"
            aria-modal="true"
            aria-label="Search CityMitra"
            initial={reduceMotion ? false : { opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onMouseDown={(event) => event.stopPropagation()}
            onKeyDown={onKeyDown}
          >
            <div className="cmdkSearch">
              <Search size={18} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a city, category, or page…"
                aria-label="Search a city, category, or page"
              />
              <kbd className="cmdkEsc">Esc</kbd>
            </div>

            <div className="cmdkList" ref={listRef} role="listbox" aria-label="Results">
              {items.length === 0 && <p className="cmdkEmpty">No matches. Try a city like “Jaipur” or a category like “Hotels”.</p>}
              {items.map((item, index) => {
                const showHeader = item.group !== renderedGroup;
                renderedGroup = item.group;
                return (
                  <div key={item.id}>
                    {showHeader && <div className="cmdkGroup">{item.group}</div>}
                    <button
                      type="button"
                      data-idx={index}
                      role="option"
                      aria-selected={index === active}
                      className={index === active ? "cmdkItem active" : "cmdkItem"}
                      onMouseEnter={() => setActive(index)}
                      onClick={item.run}
                    >
                      <span className="cmdkItemIcon">{item.icon}</span>
                      <span className="cmdkItemLabel">{item.label}</span>
                      {item.hint && <span className="cmdkItemHint">{item.hint}</span>}
                      {index === active && <CornerDownLeft size={14} className="cmdkEnter" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
