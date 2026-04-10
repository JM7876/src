import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "About | Wolf Flow LLC",
  description: "About Wolf Flow LLC and our digital AI workflow products.",
};

export default function AboutPage() {
  return (
    <main className="container">
      <SiteHeader />
      <h1>About Wolf Flow LLC</h1>
      <p>
        Wolf Flow LLC is a Michigan-based company building practical AI execution tools for small businesses and
        professional services firms.
      </p>
      <p>
        We focus on production-ready templates, governance assets, and operational kits that help teams deploy AI
        responsibly and efficiently.
      </p>
      <SiteFooter />
    </main>
  );
}
