"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LogIn, Menu, Navigation, Search, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const navLinks: Array<{ href: string; id?: string; label: string }> = [
  { href: "/cities", label: "City Guides" },
  { href: "/chat", label: "AI Chat" },
  { href: "#directory", id: "directory", label: "Directory" },
  { href: "#nearby", id: "nearby", label: "Nearby Picks" },
  { href: "/pro", label: "Pro" }
];

type SiteHeaderProps = {
  onSearch: (text: string) => void;
};

export default function SiteHeader({ onSearch }: SiteHeaderProps) {
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
        <a className="brand" href="#top" aria-label="CityMitra home">
          <span className="brandMark">
            <Navigation size={18} />
          </span>
          CityMitra
        </a>

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
          <a className="navCta" href="/chat">
            <Sparkles size={15} />
            Ask AI
          </a>
          {account ? (
            <Link className="navAccount" href="/pro" title={account.email} aria-label="Your account">
              {account.email.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link className="navLogin" href="/pro">
              <LogIn size={15} />
              Log in
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
            <Link className="mobileLogin" href="/pro" onClick={() => setMenuOpen(false)}>
              <LogIn size={15} />
              {account ? account.email : "Log in / Sign up"}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
