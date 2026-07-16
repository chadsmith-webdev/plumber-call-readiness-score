import Link from "next/link";
import styles from "./SiteChrome.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <p>Local Search Ally helps plumbing companies inspect trust and contact friction before the call.</p>
      <nav aria-label="Footer navigation">
        <Link href="/privacy">Privacy</Link>
        <Link href="/assessment">Start assessment</Link>
        <Link href="/action-plan">Action plan</Link>
      </nav>
    </footer>
  );
}
