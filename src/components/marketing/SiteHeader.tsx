import Link from "next/link";
import styles from "./SiteChrome.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="Local Search Ally home">
        <span className={styles.brandMark}>LSA</span>
        <span>Local Search Ally</span>
      </Link>
      <nav className={styles.nav} aria-label="Primary navigation">
        <Link href="/assessment">Assessment</Link>
        <Link href="/action-plan">Action Plan</Link>
        <Link href="/pilot">Pilot</Link>
        <Link href="/privacy">Privacy</Link>
      </nav>
    </header>
  );
}
