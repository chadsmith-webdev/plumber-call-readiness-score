## The Plumber Call-Readiness Score

Layer 1 MVP for Local Search Ally. The app is a responsive result-magnet funnel for owner-operated plumbing companies and small plumbing teams. It collects a five-step assessment, calculates a deterministic 100-point score on the server, displays the complete free result, and offers a $99 hosted-checkout action plan.

The MVP does not crawl websites, inspect Google profiles automatically, guarantee rankings, guarantee calls, or use an LLM for scoring.

## Local Setup

Install dependencies, then run the development server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Commands

- `npm run dev` - local development
- `npm run lint` - ESLint
- `npm run typecheck` - TypeScript check
- `npm run test` - scoring unit tests
- `npm run build` - production build

## Environment Variables

Copy `.env.example` to `.env.local` and fill values as integrations become available.

Public:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ACTION_PLAN_CHECKOUT_URL`
- `NEXT_PUBLIC_ANALYTICS_ID`

Server:
- `CRM_WEBHOOK_URL`
- `CRM_WEBHOOK_SECRET`
- `EMAIL_PROVIDER_API_KEY`
- `EMAIL_FROM_ADDRESS`
- `EMAIL_REPLY_TO_ADDRESS`
- `DATABASE_URL`
- `CHECKOUT_WEBHOOK_SECRET`
- `ENABLE_EMAIL_DELIVERY`
- `ENABLE_CRM_SYNC`
- `ENABLE_RESULT_PERSISTENCE`
- `ENABLE_ANALYTICS`
- `ENABLE_AI_SUMMARY`

## Architecture

Routes:
- `/` landing page
- `/assessment` five-step assessment
- `/result` session result display
- `/action-plan` $99 offer page
- `/thank-you` free-result thank you
- `/purchase-confirmed` buyer thank you
- `/pilot` pilot bridge
- `/privacy` placeholder privacy page

Core scoring files live in `src/lib/assessment`. Content files live in `src/content`. Integration placeholders live in `src/lib/integrations` and are disabled by default.

## Integration Adapters

The app works without external services configured. Disabled adapters log development-safe events and do not block the on-page result.

Stripe checkout uses `NEXT_PUBLIC_ACTION_PLAN_CHECKOUT_URL`. Do not add personal information, score data, or result data to the checkout query string.

Email, CRM, persistence, analytics, checkout webhooks, and future AI summary support are placeholders for later layers.

## Known MVP Limitations

- Public website and Google-profile inspection is not automated.
- Session storage is used for temporary result recovery.
- A database is required for permanent result links.
- Email delivery requires provider configuration.
- Action-plan fulfillment remains manual.
- Pilot applications currently use a placeholder contact path.
- Privacy copy requires final business or legal review.
