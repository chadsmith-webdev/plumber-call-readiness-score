import { AssessmentForm } from "@/components/assessment/AssessmentForm";
import { PageEvent } from "@/components/marketing/PageEvent";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import styles from "./page.module.css";

export default function AssessmentPage() {
  return (
    <>
      <PageEvent name="assessment_page_viewed" />
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.intro}>
          <h1>Check Your Plumber Call-Readiness Score</h1>
          <p>
            Answer 10 short questions about your Google presence, reviews, website, contact
            experience, and business information. Most contractors can complete the assessment in
            about 60 seconds.
          </p>
        </section>
        <AssessmentForm />
      </main>
      <SiteFooter />
    </>
  );
}
