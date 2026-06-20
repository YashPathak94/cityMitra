"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LogIn, Menu, Search, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import CityPicker from "./CityPicker";

function LogoMark() {
  return (
    <svg width={34} height={34} viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="cmLogo" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fb923c" />
          <stop offset="0.55" stopColor="#ea580c" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <rect width="34" height="34" rx="10" fill="url(#cmLogo)" />
      <path
        d="M17 6.6c-3.7 0-6.7 3-6.7 6.7 0 4.8 6.7 11.4 6.7 11.4s6.7-6.6 6.7-11.4c0-3.7-3-6.7-6.7-6.7z"
        fill="#fff"
      />
      <circle cx="17" cy="13.1" r="2.6" fill="url(#cmLogo)" />
    </svg>
  );
}

const navLinks: Array<{ href: string; id?: string; label: string }> = [
  { href: "#top", label: "Home" },
  { href: "/cities", label: "City Guide" },
  { href: "/chat", label: "City Chat" },
  { href: "/travel-plan", label: "Travel Plan" },
  { href: "#nearby", id: "nearby", label: "Top Picks" },
  { href: "/pro", label: "Pro" }
];

type SiteHeaderProps = {
  onSearch: (text: string) => void;
  city?: string;
  onSelectCity?: (city: string) => void;
};

export default function SiteHeader({ onSearch, city, onSelectCity }: SiteHeaderProps) {
  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [account, setAccount] = useState<{ email: string } | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { user: { email: string } | null }) => setAccount(data.user))
      .catch(() => setAccount(null));
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 12);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => (link.id ? document.getElementById(link.id) : null))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedSearch = searchText.trim();
    if (!trimmedSearch) return;
    onSearch(trimmedSearch);
    setSearchText("");
    setMenuOpen(false);
  }

  return (
    <header className={scrolled ? "glassNav scrolled" : "glassNav"}>
      <div className="glassNavInner">
        <div className="navLeft">
          <a className="brand" href="#top" aria-label="CityMitra home">
            <span className="brandMark brandMarkRich">
              <LogoMark />
            </span>
            CityMitra
          </a>
          {city && onSelectCity && <CityPicker city={city} onSelect={onSelectCity} />}
        </div>

        <nav className="glassNavLinks" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={link.id && activeSection === link.id ? "active" : ""}
            >
              {link.id && activeSection === link.id && (
                <motion.span
                  className="navActivePill"
                  layoutId="navActivePill"
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="glassNavActions">
          <form className="navSearch" onSubmit={submitSearch} role="search">
            <Search size={15} />
            <input
              aria-label="Search any city or category"
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search city or category..."
              value={searchText}
            />
          </form>
          <a className="navCta navCtaIcon" href="/chat" aria-label="Ask the AI guide" title="Ask AI">
            <Sparkles size={18} />
          </a>
          {account ? (
            <Link className="navAccount" href="/pro" title={account.email} aria-label="Your account">
              {account.email.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link className="navLogin" href="/signin" aria-label="Sign in">
              <LogIn size={16} />
              <span>Log in</span>
            </Link>
          )}
          <button
            className="navToggle"
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobileMenu"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <form className="navSearch mobileSearch" onSubmit={submitSearch} role="search">
              <Search size={15} />
              <input
                aria-label="Search any city or category"
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search city, food, hotels, repair..."
                value={searchText}
              />
              <button type="submit">Go</button>
            </form>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link className="mobileLogin" href={account ? "/pro" : "/signin"} onClick={() => setMenuOpen(false)}>
              <LogIn size={16} />
              {account ? account.email : "Log in / Sign up"}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
