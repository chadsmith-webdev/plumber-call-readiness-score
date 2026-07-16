import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { PageEvent, TrackedLink } from "@/components/marketing/PageEvent";
import styles from "../action-plan/page.module.css";

export default function PilotPage() {
  return (
    <>
      <PageEvent name="pilot_page_viewed" />
      <SiteHeader />
      <main className={styles.simpleMain}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>90-day pilot</p>
            <h1>A Fit Test for Home Service Businesses Ready to Implement</h1>
            <p>
              The pilot is for qualifying home service businesses with capacity for more work and
              identifiable implementation needs. It is a 90-day test of fit, not a guarantee of
              outcomes or automatic acceptance.
            </p>
            <TrackedLink
              className={styles.card}
              eventName="pilot_cta_clicked"
              href="mailto:chad@localsearchally.com?subject=Pilot%20Program%20Application"
            >
              Apply for the Pilot Program
            </TrackedLink>
          </div>
          <aside className={styles.card}>
            <h2>During 90 Days</h2>
            <p>Fit is evaluated through practical implementation needs, capacity, and alignment.</p>
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
