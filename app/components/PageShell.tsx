import Link from "next/link";
import { Navigation } from "lucide-react";
import SiteFooter from "@/app/components/SiteFooter";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="glassNav scrolled">
        <div className="glassNavInner">
          <Link className="brand" href="/" aria-label="CityMitra home">
            <span className="brandMark">
              <Navigation size={18} />
            </span>
            CityMitra
          </Link>
          <nav className="subpageLinks" aria-label="Site navigation">
            <Link href="/">Home</Link>
            <Link href="/cities">City Guide</Link>
            <Link href="/chat">City Chat</Link>
            <Link href="/travel-plan">Travel Plan</Link>
            <Link href="/offers">Offers</Link>
            <Link href="/#nearby">Top Picks</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </header>
      <main id="main" className="pageShellMain">
        {children}
      </main>
      <SiteFooter city="Delhi" category="markets" />
    </>
  );
}
