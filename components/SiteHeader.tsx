import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="header">
      <Link href="/" style={{ fontWeight: 800 }}>Wolf Flow LLC</Link>
      <nav className="nav">
        <Link href="/catalog">Catalog</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  );
}
