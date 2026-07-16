import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "../action-plan/page.module.css";

export default function PurchaseConfirmedPage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.simpleMain}>
        <section className={styles.final}>
          <p className={styles.eyebrow}>Purchase confirmed</p>
          <h1>Your Personalized Action Plan Is Being Prepared</h1>
          <p>Your completed action plan will be delivered within one business day.</p>
          <p>
            Local Search Ally will not ask for website passwords, Google account credentials, or
            payment details outside the hosted checkout provider.
          </p>
          <ButtonLink href="/result">Return to Free Result</ButtonLink>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
