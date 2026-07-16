import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "../action-plan/page.module.css";

export default function ThankYouPage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.simpleMain}>
        <section className={styles.final}>
          <p className={styles.eyebrow}>Free result</p>
          <h1>Your Call-Readiness Result Has Been Sent</h1>
          <p>You can return to your on-page result or review the optional action plan.</p>
          <div className={styles.compare}>
            <ButtonLink href="/result">Return to Result</ButtonLink>
            <ButtonLink href="/action-plan" variant="secondary">
              View the Action Plan
            </ButtonLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
