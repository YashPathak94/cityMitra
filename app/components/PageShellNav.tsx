"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import styles from "./PageShellNav.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/cities", label: "City Guide" },
  { href: "/chat", label: "City Chat" },
  { href: "/travel-plan", label: "Travel Plan" },
  { href: "/blog", label: "Blogs" },
  { href: "/offers", label: "Offers" },
  { href: "/pro", label: "Pro" }
];

export default function PageShellNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="subpageLinks" aria-label="Site navigation">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        className={styles.menuButton}
        type="button"
        aria-label={open ? "Close site menu" : "Open site menu"}
        aria-expanded={open}
        aria-controls="subpage-mobile-menu"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <nav id="subpage-mobile-menu" className={styles.mobileMenu} aria-label="Mobile site navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
