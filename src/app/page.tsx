import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { PageEvent } from "@/components/marketing/PageEvent";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { evaluationCategories, faqs, resultDeliverables } from "@/content/landing";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <PageEvent name="landing_page_viewed" />
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Free 60-Second Assessment for Plumbing Companies</p>
            <h1>Your Plumbing Company Was Found. Is It Ready to Earn the Call?</h1>
            <p className={styles.heroCopy}>
              Get a personalized score showing where your Google profile, reviews, website,
              contact experience, or business information may be helping or creating hesitation
              before a homeowner calls.
            </p>
            <div className={styles.heroActions}>
              <ButtonLink href="/assessment">Check My Call-Readiness Score</ButtonLink>
              <p className={styles.reassurance}>
                Takes about 60 seconds. You receive the complete free result and three practical
                recommendations.
              </p>
            </div>
          </div>

          <aside className={styles.scorePanel} aria-label="Example score breakdown">
            <div className={styles.scoreTop}>
              <span>Example result</span>
              <span>Five categories</span>
            </div>
            <div className={styles.scoreNumber}>
              74<span>/100</span>
            </div>
            <div className={styles.barList}>
              {[
                ["Google Presence", "78%", "78%"],
                ["Review Confidence", "65%", "65%"],
                ["Website Trust", "58%", "58%"],
                ["Call Readiness", "86%", "86%"],
                ["Consistency", "70%", "70%"],
              ].map(([label, width, value]) => (
                <div className={styles.barRow} key={label}>
                  <div>
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <span className={styles.barTrack}>
                    <span className={styles.barFill} style={{ width }} />
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Showing Up Online Is Only the First Step</h2>
            <p>
              A homeowner can find a plumbing company and still hesitate. This assessment checks
              the trust and contact signals that often sit between visibility and the call.
            </p>
          </div>
          <div className={styles.copyBlock}>
            <p>
              Visibility creates the opportunity. Trust helps earn the call. The score does not
              crawl your site or inspect your Google profile automatically; it turns your submitted
              answers into a practical, deterministic result.
            </p>
            <p>
              The goal is not a generic SEO audit. It is a first repair order for the public
              information, proof, review activity, and call path a homeowner sees before reaching
              out.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.kicker}>What you get</p>
              <h2>Your Free Result Includes</h2>
            </div>
            <p>
              You receive the full result before any paid offer appears. No blurred score, no locked
              priorities, and no invented guarantees.
            </p>
          </div>
          <div className={styles.grid}>
            {resultDeliverables.map((item) => (
              <article className={styles.card} key={item}>
                <strong>{item}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.kicker}>Evaluation categories</p>
              <h2>The Five Things the Score Checks</h2>
            </div>
            <p>
              Each category is worth 20 points, for a maximum score of 100. The server recalculates
              the result from raw answers every time.
            </p>
          </div>
          <div className={styles.categoryGrid}>
            {evaluationCategories.map((category) => (
              <article className={styles.category} key={category.name}>
                <h3>{category.name}</h3>
                <p>{category.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>How It Works</h2>
            <p>
              The assessment is designed for owner-operated plumbing companies and small teams. Most
              contractors can complete it in about a minute.
            </p>
          </div>
          <div className={styles.steps}>
            {["Answer 10 short questions", "Receive the personalized score", "See what to fix first"].map(
              (step, index) => (
                <article className={styles.step} key={step}>
                  <strong>{index + 1}</strong>
                  <p>{step}</p>
                </article>
              ),
            )}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.kicker}>Fit and limits</p>
              <h2>Built for Practical Plumbing Teams</h2>
            </div>
            <p>
              This is for businesses that want a clear first look at trust and contact friction. It
              is not a ranking guarantee, a technical crawl, or a replacement for a full manual
              review.
            </p>
          </div>
          <div className={styles.faqList}>
            {faqs.map((faq) => (
              <article className={styles.faqItem} key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.final}>
          <p className={styles.kicker}>Start here</p>
          <h2>Check the Call-Readiness of Your Plumbing Company</h2>
          <p>
            You will receive the complete free result and three practical recommendations without
            purchasing anything.
          </p>
          <ButtonLink href="/assessment">Check My Call-Readiness Score</ButtonLink>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
