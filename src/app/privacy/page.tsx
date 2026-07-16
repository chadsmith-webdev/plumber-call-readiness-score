import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import styles from "../action-plan/page.module.css";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.simpleMain}>
        <section className={styles.final}>
          <p className={styles.eyebrow}>Placeholder privacy copy</p>
          <h1>Privacy and Data Use</h1>
          <p>This page should be reviewed by the business owner or qualified counsel before launch.</p>
          <ul className={styles.list}>
            <li>We collect submitted assessment answers, email address, optional mobile number, and optional public URLs.</li>
            <li>We use this information to generate the free result, send follow-up, qualify leads, and support manual review after an action-plan purchase.</li>
            <li>Submitted URLs may be manually reviewed if you purchase an action plan or request follow-up.</li>
            <li>You can unsubscribe from email follow-up at any time.</li>
            <li>Passwords, Google account credentials, website credentials, customer records, and payment information are never requested in the assessment.</li>
            <li>To request deletion, contact Local Search Ally through the business contact channel.</li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
