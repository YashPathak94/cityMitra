import Link from "next/link";

export default function NotFound() {
  return (
    <main className="notFound">
      <h1>City not found</h1>
      <p>CityMitra could not find that page yet.</p>
      <Link className="primaryButton" href="/">
        Back to CityMitra
      </Link>
    </main>
  );
}
