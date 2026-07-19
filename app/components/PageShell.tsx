import Link from "next/link";
import SiteFooter from "@/app/components/SiteFooter";
import LogoMark from "@/app/components/Logo";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="glassNav scrolled">
        <div className="glassNavInner">
          <Link className="brand" href="/" aria-label="CityMitra home">
            <span className="brandMark brandMarkRich">
              <LogoMark />
            </span>
            <span className="brandText">
              CityMitra
              <span className="brandTagline">Your Need. Your Mitra.</span>
            </span>
          </Link>
          <nav className="subpageLinks" aria-label="Site navigation">
            <Link href="/">Home</Link>
            <Link href="/chat">City Chat</Link>
            <Link href="/travel-plan">Travel Plan</Link>
            <Link href="/blog">Blogs</Link>
            <Link href="/offers">Offers</Link>
            <Link href="/pro">Pro</Link>
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
