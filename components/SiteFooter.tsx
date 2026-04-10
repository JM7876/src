import { SITE_NAME, SUPPORT_EMAIL } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="footer">
      <p>{SITE_NAME} • Athens, Michigan • Instant digital delivery.</p>
      <p>Support: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
    </footer>
  );
}
