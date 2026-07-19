"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LogIn, Menu, Search, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CityPicker from "./CityPicker";
import CommandPalette from "./CommandPalette";
import LogoMark from "./Logo";

const navLinks: Array<{ href: string; id?: string; label: string }> = [
  { href: "#top", label: "Home" },
  { href: "/chat", label: "City Chat" },
  { href: "/travel-plan", label: "Travel Plan" },
  { href: "/blog", label: "Blogs" },
  { href: "/offers", label: "Offers" },
  { href: "/pro", label: "Pro" }
];

type SiteHeaderProps = {
  onSearch: (text: string) => void;
  city?: string;
  onSelectCity?: (city: string) => void;
};

export default function SiteHeader({ onSearch, city, onSelectCity }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [account, setAccount] = useState<{ email: string } | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  // Cmd/Ctrl+K opens the command palette
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

  return (
    <header className={scrolled ? "glassNav scrolled" : "glassNav"}>
      <div className="glassNavInner">
        <div className="navLeft">
          <a className="brand" href="#top" aria-label="CityMitra home">
            <span className="brandMark brandMarkRich">
              <LogoMark />
            </span>
            <span className="brandText">
              CityMitra
              <span className="brandTagline">Your Need. Your Mitra.</span>
            </span>
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
          <button className="navSearchTrigger" type="button" onClick={() => setPaletteOpen(true)} aria-label="Search any city or category">
            <Search size={15} />
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>
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
            <button
              type="button"
              className="navSearchTrigger mobileSearchTrigger"
              onClick={() => {
                setMenuOpen(false);
                setPaletteOpen(true);
              }}
            >
              <Search size={15} />
              <span>Search city, food, hotels…</span>
            </button>
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

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSearch={onSearch} onSelectCity={onSelectCity} />
    </header>
  );
}
