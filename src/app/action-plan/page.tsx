import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { CheckoutButton } from "@/components/marketing/CheckoutButton";
import { PageEvent } from "@/components/marketing/PageEvent";
import { actionPlanDeliverables, excludedScope, includedScope } from "@/content/actionPlan";
import styles from "./page.module.css";

export default function ActionPlanPage() {
  return (
    <>
      <PageEvent name="action_plan_page_viewed" />
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Personalized 30-Day Implementation Roadmap</p>
            <h1>Turn Your Call-Readiness Score Into a Clear Repair Order</h1>
            <p>
              Get a reviewed, business-specific plan showing what to fix first, what to do next,
              and what can wait across your Google profile, reviews, website, contact experience,
              and business information.
            </p>
            <CheckoutButton />
          </div>
          <aside className={styles.price} aria-label="Price">
            <div>
              <strong>$99</strong>
              <span>one-time</span>
            </div>
          </aside>
        </section>

        <section className={styles.section}>
          <h2>Free Score Versus Paid Plan</h2>
          <div className={styles.compare}>
            <article className={styles.card}>
              <h3>Free score</h3>
              <p>Shows the score, category breakdown, risk, strength, three priorities, and one quick win.</p>
            </article>
            <article className={styles.card}>
              <h3>Paid action plan</h3>
              <p>Turns the result into a reviewed repair order with a 30-day roadmap for one business.</p>
            </article>
          </div>
        </section>

        <section className={styles.section}>
          <h2>What Is Included</h2>
          <div className={styles.grid}>
            {actionPlanDeliverables.map((item) => (
              <article className={styles.card} key={item}>
                <strong>{item}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Scope</h2>
          <div className={styles.scope}>
            <article className={styles.card}>
              <h3>Included</h3>
              <ul className={styles.list}>
                {includedScope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className={styles.card}>
              <h3>Not included</h3>
              <ul className={styles.list}>
                {excludedScope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className={styles.final}>
          <h2>Delivered Within One Business Day</h2>
          <p>
            This purchase includes a personalized roadmap. Website and Google Business Profile
            changes are not included, and no passwords are requested.
          </p>
          <CheckoutButton />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
