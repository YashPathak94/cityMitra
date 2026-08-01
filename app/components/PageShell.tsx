import Link from "next/link";
import SiteFooter from "@/app/components/SiteFooter";
import LogoMark from "@/app/components/Logo";
import PageShellNav from "@/app/components/PageShellNav";

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
          <PageShellNav />
        </div>
      </header>
      <main id="main" className="pageShellMain">
        {children}
      </main>
      <SiteFooter city="Delhi" category="markets" />
    </>
  );
}
