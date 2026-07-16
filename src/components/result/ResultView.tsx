"use client";

import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { trackEvent } from "@/lib/integrations/analytics";
import { readResult } from "@/lib/storage/resultSession";
import type { AssessmentResult } from "@/lib/assessment/types";
import styles from "./ResultView.module.css";

export function ResultView() {
  const [result, setResult] = useState<AssessmentResult | null | undefined>(undefined);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = readResult();
      setResult(stored);

      if (stored) {
        trackEvent("result_viewed", {
          scoreBand: Math.floor(stored.overallScore / 10) * 10,
          lowestCategory: stored.lowestCategory.id,
        });
      }
      });
  }, []);

  if (result === undefined) {
    return (
      <>
        <SiteHeader />
        <main className={styles.main}>
          <p className={styles.loading}>Loading result...</p>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (!result) {
    return (
      <>
        <SiteHeader />
        <main className={styles.main}>
          <section className={styles.missing}>
            <p className={styles.eyebrow}>Result not recovered</p>
            <h1>Your result could not be found in this session.</h1>
            <p>
              This MVP stores free results temporarily in the current browser session. Restart the
              assessment to generate a fresh score.
            </p>
            <ButtonLink href="/assessment">Restart Assessment</ButtonLink>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Your Plumber Call-Readiness Result</p>
            <h1>
              {result.businessName} Scored {result.overallScore}/100
            </h1>
            <p className={styles.tier}>{result.tier}</p>
            <p className={styles.summary}>{result.tierHeadline}</p>
          </div>
          <div className={styles.scoreDial} aria-label={`Overall score ${result.overallScore} out of 100`}>
            <strong>{result.overallScore}</strong>
            <span>/100</span>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Score Breakdown</h2>
          <div className={styles.categoryGrid}>
            {result.categories.map((category) => (
              <article className={styles.categoryCard} key={category.id}>
                <div className={styles.categoryHeader}>
                  <h3>{category.name}</h3>
                  <span>{category.status}</span>
                </div>
                <div className={styles.categoryScore}>
                  {category.score}/{category.maximum}
                </div>
                <div className={styles.track} aria-hidden="true">
                  <span style={{ width: `${(category.score / category.maximum) * 100}%` }} />
                </div>
                <p>{category.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.twoColumn}>
          <article className={styles.panel}>
            <p className={styles.eyebrow}>Biggest strength</p>
            <h2>{result.biggestStrength.headline}</h2>
            <p>{result.biggestStrength.explanation}</p>
            <p>{result.biggestStrength.nextStep}</p>
          </article>
          <article className={styles.panel}>
            <p className={styles.eyebrow}>Biggest risk</p>
            <h2>{result.biggestRisk.headline}</h2>
            <p>{result.biggestRisk.explanation}</p>
            <p>{result.biggestRisk.impact}</p>
          </article>
        </section>

        {result.triggeredConditions.length > 0 && (
          <section className={styles.section}>
            <h2>Conditions Noted</h2>
            <ul className={styles.conditionList}>
              {result.triggeredConditions.map((condition) => (
                <li key={condition}>{condition}</li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.section}>
          <h2>Your Three Priorities</h2>
          <div className={styles.recommendations}>
            {result.recommendations.map((recommendation, index) => (
              <article className={styles.recommendation} key={recommendation.id}>
                <span className={styles.number}>{index + 1}</span>
                <h3>{recommendation.headline}</h3>
                <dl>
                  <dt>What to fix</dt>
                  <dd>{recommendation.whatToFix}</dd>
                  <dt>Why it matters</dt>
                  <dd>{recommendation.whyItMatters}</dd>
                  <dt>How to start</dt>
                  <dd>{recommendation.howToStart}</dd>
                  <dt>Expected benefit</dt>
                  <dd>{recommendation.expectedBenefit}</dd>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.quickWin}>
          <div>
            <p className={styles.eyebrow}>Start Here Today</p>
            <h2>{result.quickWin.headline}</h2>
            <p>{result.quickWin.action}</p>
          </div>
          <dl>
            <dt>Estimated time</dt>
            <dd>{result.quickWin.estimatedTime}</dd>
            <dt>Expected benefit</dt>
            <dd>{result.quickWin.expectedBenefit}</dd>
          </dl>
        </section>

        <section className={styles.disclaimer}>
          <p>
            This result is based on the information you provided. It is designed to identify likely
            trust and contact gaps, not guarantee rankings, calls, booked jobs, or revenue.
          </p>
        </section>

        <section className={styles.bridge}>
          <p className={styles.eyebrow}>Next step</p>
          <h2>You Know What Needs Attention. Now Decide What Comes First.</h2>
          <p>
            The $99 action plan turns the free score into a reviewed 30-day repair order for one
            plumbing business, one website, and one Google Business Profile.
          </p>
          <ButtonLink href="/action-plan">Get My Personalized Action Plan</ButtonLink>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
