"use client";

import { Menu, Navigation, Search, X } from "lucide-react";
import { FormEvent, useState } from "react";

type SiteHeaderProps = {
  onSearch: (text: string) => void;
};

export default function SiteHeader({ onSearch }: SiteHeaderProps) {
  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedSearch = searchText.trim();
    if (!trimmedSearch) return;
    onSearch(trimmedSearch);
    setSearchText("");
    setMenuOpen(false);
  }

  return (
    <nav className="topbar" aria-label="Primary navigation">
      <a className="brand" href="#top" aria-label="CityMitra home">
        <span className="brandMark">
          <Navigation size={18} />
        </span>
        CityMitra
      </a>
      <form className="topSearch" onSubmit={submitSearch} role="search">
        <Search size={16} />
        <input
          aria-label="Search any city or category"
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search city, food, hotels, repair..."
          value={searchText}
        />
        <button type="submit">Search</button>
      </form>
      <button
        className="navToggle"
        type="button"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen((current) => !current)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className={menuOpen ? "navActions open" : "navActions"}>
        <a href="#directory" onClick={() => setMenuOpen(false)}>Directory</a>
        <a href="#ai" onClick={() => setMenuOpen(false)}>AI Guide</a>
        <a href="#monetize" onClick={() => setMenuOpen(false)}>Monetize</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#coverage" onClick={() => setMenuOpen(false)}>Coverage</a>
      </div>
    </nav>
  );
}
