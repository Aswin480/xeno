# XENO Copilot â€” AI-Native Mini CRM

> **Intelligent Customer Marketing for Modern Brands**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-xeno--production.netlify.app-blue?style=for-the-badge)](https://xeno-production.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Aswin480%2Fxeno-black?style=for-the-badge&logo=github)](https://github.com/Aswin480/xeno)
[![Backend](https://img.shields.io/badge/Backend-Render-green?style=for-the-badge)](https://render.com)
[![DB](https://img.shields.io/badge/Database-Neon%20PostgreSQL-teal?style=for-the-badge)](https://neon.tech)

XENO Copilot is an AI-native marketing decision operating system built for the Xeno take-home assignment. A marketer describes a business objective in plain English â€” *"Bring back dormant coffee customers"* â€” and the system formulates the audience, selects the optimal channel, generates personalized copy, orchestrates delivery through a callback-driven simulator, tracks outcomes in real time, and recommends the next best action.

**This is not a campaign builder bolted with AI. AI is the interface. Deterministic logic is the engine.**

---

## ðŸ“‹ Table of Contents

1. [The Problem & Product Vision](#1-the-problem--product-vision)
2. [Live Demo](#2-live-demo)
3. [Features](#3-features)
4. [Dataset](#4-dataset)
5. [System Architecture](#5-system-architecture)
6. [Tech Stack](#6-tech-stack)
7. [AI Integration Deep Dive](#7-ai-integration-deep-dive)
8. [Campaign Lifecycle](#8-campaign-lifecycle)
9. [Project Structure](#9-project-structure)
10. [Getting Started](#10-getting-started-local-setup)
11. [Environment Variables](#11-environment-variables)
12. [Deployment](#12-deployment)
13. [API Reference](#13-api-reference)
14. [Tradeoffs & Scale](#14-tradeoffs--what-id-do-differently-at-scale)
15. [AI-Native Development Workflow](#15-ai-native-development-workflow)
16. [Roadmap](#16-roadmap)

---

## 1. The Problem & Product Vision

### What problem does this solve for a marketer?

Modern marketers inside brands like Xeno's customers don't struggle with the mechanics of sending a message. They struggle with five questions that recur every single campaign cycle:

| Question | Traditional Answer | XENO Copilot's Answer |
|---|---|---|
| Who should we reach? | Write SQL. Ask a data analyst. | Type a goal. Get a resolved audience instantly. |
| What should we say? | Write copy manually. A/B test later. | AI generates copy grounded in what worked historically. |
| Which channel? | Gut feel or channel cost. | Historical open/conversion rate comparison across SMS, Email, WhatsApp. |
| Is it working? | Check dashboards tomorrow. | Live funnel: Sent â†’ Delivered â†’ Read, updating every 1.5s. |
| What's next? | Another meeting. | Automatic next-action recommendation: Scale / Pivot / A-B Test / Pause. |

### What makes this AI-native (not just AI-assisted)?

Most "AI-powered" CRMs bolt GPT onto an existing UI. You still navigate menus, define segments manually, and interpret dashboards yourself. AI is an afterthought.

In XENO Copilot, **AI is the primary interface**. The marketer types a business goal. The system does the rest. There are no segment dropdowns, no channel selectors, no template editors to fill out before the AI activates. The entire decision chain â€” audience â†’ channel â†’ message â†’ execution â†’ learning â€” runs in response to that single sentence.

Critically: **Gemini is not the decision-maker.** Gemini is the voice. The decisions â€” which segment to target, which channel won historically, which message template performed best, whether to scale or pause â€” are made by a deterministic closed-loop engine backed by real PostgreSQL data. This distinction is deliberate and fundamental.

---

## 2. Live Demo

ðŸŒ **Frontend:** [https://xeno-production.netlify.app](https://xeno-production.netlify.app)  
ðŸ”Œ **API Health:** [https://crm-service-production.onrender.com/health](https://crm-service-production.onrender.com/health)

### What to try:

1. **Copilot Center** â†’ Type *"Re-engage dormant coffee customers"* â†’ Watch the 6-step reasoning chain execute.
2. **Campaign Review** â†’ Inspect the AI's channel recommendation with data-backed justification.
3. **Launch a Campaign** â†’ Watch the Live Monitor update in real time as the simulator fires callbacks.
4. **Campaign History** â†’ See revenue attribution and historical performance across 70+ seeded campaigns.
5. **Customer Directory** â†’ Click any customer to see their full Shopper Journey timeline.

---

## 3. Features

### ðŸ—„ï¸ Data Layer
| Feature | Description |
|---|---|
| Customer Directory | 5,000 customers with name, email, phone, RFM segment, order history. Searchable, filterable. |
| Shopper Journey | Per-customer timeline showing every order and every marketing message they received, interleaved chronologically. |
| Order Ledger | 20,000+ orders across coffee categories (Espresso, Latte, Cold Brew, Americano, Mocha, Pastries). |

### ðŸŽ¯ Segmentation
| Feature | Description |
|---|---|
| RFM Segments | Customers are pre-classified into: `VIP / Active`, `New User`, `Cart Abandoner`, `Inactive / Dormant`, `General`. |
| Segment DSL | Every campaign stores a JSON Segment DSL that maps intent to a precise PostgreSQL query. |
| Live Count | Before launching, the Copilot resolves the exact matching customer count from the live database. |

### ðŸ“£ Campaigns
| Feature | Description |
|---|---|
| AI Campaign Formulation | Natural language â†’ full campaign plan (segment + channel + message) in ~3 seconds. |
| Human Approval Gate | The system presents its recommendation. The marketer reviews and clicks Launch. Nothing auto-fires. |
| Campaign Registry | Table of all campaigns: name, segment, channel, status, recipients, revenue recovered. |
| Campaign Memory | Historical campaigns feed back into future recommendations via the `HistoricalAnalyzer`. |

### ðŸ“¡ Channel Simulator
| Feature | Description |
|---|---|
| Separate Microservice | Deployed independently. Accepts `/send` POST, returns `202 Accepted` immediately. |
| Async Callbacks | Fires `SENT â†’ DELIVERED â†’ READ` webhooks back to CRM with realistic probabilistic delays. |
| Failure Simulation | 10% of messages simulate a `FAILED` delivery, matching real-world channel failure rates. |
| Conversion Trigger | On `READ` event: 12% probability of creating a real `Order` record (simulated purchase). |
| Idempotency | Every callback carries a unique `eventId`. The CRM deduplicates on `eventId + status`. |

### ðŸ“Š Analytics
| Feature | Description |
|---|---|
| Live Operations Monitor | Campaign funnel (Total â†’ Sent â†’ Delivered â†’ Read â†’ Failed) with animated counters, polling every 1.5s. |
| Revenue Attribution | Orders created after campaign launch and linked to recipient records are attributed as conversions. |
| Performance Intelligence Hub | Cross-campaign analytics: open rates, conversion rates, revenue by segment and channel. |
| Next Action Engine | After each campaign, the system produces one of: `scale` / `ab_test` / `pivot` / `retry` / `pause`. |

### ðŸ¤– AI Capabilities
| Feature | Description |
|---|---|
| 6-Step Reasoning Chain | Intent parsing â†’ Segment identification â†’ Historical analysis â†’ Channel selection â†’ Message selection â†’ Recommendation build. |
| Gemini Voice Layer | Gemini `gemini-1.5-flash` generates the executive summary narrative after the deterministic engine finishes. |
| Dual-Key Failover | Primary Gemini key â†’ Secondary Gemini key â†’ Local template fallback. The workflow never breaks. |
| Recommendation Strength | System rates its own confidence as `strong` / `moderate` / `limited` based on available historical data depth. |
| Channel Justification | Explains exactly why it picked Email over SMS â€” with open rate percentages from real past campaigns. |

---

## 4. Dataset

### Why a realistic dataset matters

An AI decision engine is only as useful as the data it learns from. XENO Copilot's recommendation quality at boot depends entirely on its historical campaign memory. I synthesized a large, realistic dataset rather than using toy data so the system immediately demonstrates real intelligence.

### Source Datasets

| Dataset | Source | Used For |
|---|---|---|
| Olist Brazilian E-Commerce | [Kaggle](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce) | Customer records, geographic spread, order timing patterns |
| Online Retail II | [UCI ML Repository](https://archive.ics.uci.edu/ml/datasets/Online+Retail+II) | Purchase frequency, spending patterns, RFM classification |
| Customer Personality Analysis | [Kaggle](https://www.kaggle.com/datasets/imakash3011/customer-personality-analysis) | Campaign response propensity, recency behavior, segment tendencies |

These three datasets were normalized, de-identified, and transformed into a unified fictional brand: **BrewBean Coffee**.

### Seeded Volume

| Entity | Count |
|---|---|
| Customers | 5,000 |
| Orders | 20,000+ |
| Campaigns | 70+ (historical) |
| Campaign Recipients | 100,000+ |
| Channel Events | 250,000+ |

### Schema

**Customer**
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | String | Full name |
| `email` | String | Unique email address |
| `phone` | String | Unique E.164 phone number |
| `segments` | String | JSON-encoded RFM segment tags |
| `createdAt` | DateTime | Account creation timestamp |

**Order**
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `customerId` | UUID | FK â†’ Customer |
| `amount` | Float | Order value in USD |
| `status` | String | `COMPLETED` / `PENDING` / `CANCELLED` |
| `category` | String | `Espresso`, `Latte`, `Cold Brew`, `Americano`, `Mocha`, `Coffee Beans`, `Pastries` |
| `createdAt` | DateTime | Order timestamp |

**Campaign**
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | String | Human-readable campaign name |
| `goal` | String | Original marketer input |
| `segmentDsl` | String | JSON Segment DSL query |
| `status` | String | `DRAFT` / `READY` / `LAUNCHING` / `COMPLETED` / `FAILED` |
| `channel` | String | `SMS` / `EMAIL` / `WHATSAPP` |
| `messageTemplate` | String | Message with `{name}` placeholder |
| `confidenceScore` | Float | AI recommendation strength (0â€“1) |
| `estimatedRoi` | Float | Pre-launch ROI projection |

**CampaignRecipient**
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `campaignId` | UUID | FK â†’ Campaign |
| `customerId` | UUID | FK â†’ Customer |
| `status` | String | `PENDING` / `SENT` / `DELIVERED` / `READ` / `FAILED` |
| `sentAt` | DateTime? | Timestamp when SENT callback received |
| `deliveredAt` | DateTime? | Timestamp when DELIVERED callback received |
| `readAt` | DateTime? | Timestamp when READ callback received |
| `failedAt` | DateTime? | Timestamp when FAILED callback received |
| `eventId` | String? | Idempotency key from simulator |

**ChannelEvent**
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `recipientId` | UUID | FK â†’ CampaignRecipient |
| `eventId` | String | Unique idempotent event key |
| `eventType` | String | `SENT` / `DELIVERED` / `READ` / `FAILED` |
| `timestamp` | DateTime | Event occurrence time |
| `payload` | String | Full JSON provider response |

### Sample Rows

**Customers (sample)**
| name | email | segments |
|---|---|---|
| Priya Mehta | priya@example.com | `["VIP / Active"]` |
| David Osei | david@example.com | `["Inactive / Dormant"]` |
| Carmen Liu | carmen@example.com | `["Cart Abandoner"]` |
| Raj Nair | raj@example.com | `["New User"]` |

**Orders (sample)**
| customerId | amount | category | status |
|---|---|---|---|
| uuid-001 | 14.50 | Latte | COMPLETED |
| uuid-002 | 8.75 | Espresso | COMPLETED |
| uuid-003 | 31.20 | Coffee Beans | COMPLETED |

### How data was generated

The seed script (`crm-service/prisma/seed.ts`) runs via `npm run db:seed`. It:
1. Creates 5,000 customers distributed across RFM segments using weighted randomization.
2. Generates 20,000+ orders with realistic timestamps spread over 18 months.
3. Creates 70+ historical campaigns with realistic recipient volumes.
4. Simulates conversion orders deferred **after** campaign launch timestamps, so the attribution engine has real revenue to calculate.

---

## 5. System Architecture

### Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        FE["Frontend Dashboard\n(React + Vite)\nNetlify"]
    end

    subgraph "CRM Service â€” Render"
        API["Express REST API\n:8000"]
        BRAIN["Copilot Brain\n(Deterministic Engine)"]
        GEMINI["Gemini Voice Layer\ngemini-1.5-flash"]
        ANALYTICS["Analytics Service\n+ Next Action Engine"]
        RECEIPT["Receipt Webhook\nHandler + Idempotency"]
        DB[("Neon PostgreSQL\nCustomers Â· Orders\nCampaigns Â· Events")]
    end

    subgraph "Channel Simulator â€” Render"
        SIM["Simulator Service\n:8001"]
        WORKER["Background Worker\nAsync Timer Callbacks"]
    end

    FE -->|"REST API calls\nVITE_API_URL"| API
    API --> BRAIN
    BRAIN --> GEMINI
    BRAIN --> ANALYTICS
    API --> DB
    ANALYTICS --> DB

    API -->|"POST /send\ncampaign payload"| SIM
    SIM -->|"202 Accepted"| API
    SIM --> WORKER
    WORKER -->|"POST /receipts\nSENT Â· DELIVERED Â· READ Â· FAILED"| RECEIPT
    RECEIPT --> DB
    RECEIPT -->|"12% READ â†’ Order"| DB

    FE -->|"GET /health\n:8001"| SIM
```

### Component Breakdown

| Component | Responsibility |
|---|---|
| **Frontend (Netlify)** | React SPA. Polls CRM API every 1.5s during live monitoring. Renders Copilot reasoning chain, campaign funnel, customer directory. |
| **CRM API (Render)** | Express server. Hosts REST endpoints for Copilot, Campaigns, Customers, Insights, Receipts. Rate-limited (100 req/15min on `/copilot`). Helmet + CORS secured. |
| **Copilot Brain** | 6-step deterministic decision engine. Reads real PostgreSQL data at every step. Produces structured recommendation without touching Gemini. |
| **Gemini Voice Layer** | Called after the brain finishes. Wraps the recommendation in natural language. Has dual-key failover + local template fallback. |
| **Channel Simulator (Render)** | Completely independent microservice. Accepts send requests, returns immediately, fires async webhooks after probabilistic delays. |
| **Receipt Handler** | Webhook endpoint on CRM. Enforces idempotency via `eventId`. Enforces state machine precedence (`SENT â†’ DELIVERED â†’ READ`, never backwards). |
| **Neon PostgreSQL** | Serverless PostgreSQL. All five models. Connection pooling handles concurrent webhook writes. |

### The Two-Service Callback Loop (Step by Step)

```
1. Marketer clicks "Launch" on the frontend
2. Frontend â†’ POST /campaigns/:id/launch â†’ CRM API
3. CRM sets campaign status = LAUNCHING
4. CRM resolves target customers via Segment DSL â†’ PostgreSQL query
5. CRM creates CampaignRecipient rows (status = PENDING) for each customer
6. CRM dispatches background worker (non-blocking, Promise.all in chunks of 5)
7. For each recipient: CRM â†’ POST /send â†’ Channel Simulator
8. Simulator returns 202 Accepted immediately
9. CRM updates recipient status = SENT, stores eventId
10. (Background, inside Simulator): Timer fires after 500msâ€“2s delay
11. Simulator â†’ POST /receipts â†’ CRM with { eventId, recipientId, status: "DELIVERED" }
12. CRM Receipt Handler: idempotency check â†’ state precedence check â†’ update DB
13. (Background, inside Simulator): Second timer fires
14. Simulator â†’ POST /receipts â†’ CRM with { status: "READ" }
15. CRM Receipt Handler: updates readAt, then rolls 12% dice â†’ creates Order if hit
16. (For ~10% of messages): Simulator fires status: "FAILED" instead
17. Frontend polls GET /campaigns/:id/metrics every 1.5s
18. CRM aggregates live counts from DB â†’ returns funnel metrics
19. After all recipients processed: CRM sets status = COMPLETED, clears analytics cache
20. Frontend renders next-action recommendation card
```

---

## 6. Tech Stack

| Layer | Technology | Why I chose it |
|---|---|---|
| **Frontend Framework** | React 18 + Vite | Fast HMR, tree-shaking, TypeScript-first. Vite's dev server is 10x faster than CRA. |
| **Styling** | Tailwind CSS | Utility-first prevents CSS drift across a multi-page SPA. Design tokens via CSS variables. |
| **Charts** | Recharts | Composable, React-native charting. No D3 complexity for bar/line charts. |
| **Icons** | Lucide Icons | Consistent, accessible SVG icon set. Zero runtime overhead. |
| **Backend Runtime** | Node.js + Express | Lightweight, non-blocking I/O ideal for webhook-heavy workloads. |
| **ORM** | Prisma | Type-safe schema. Migrations as code. Auto-generated client eliminates raw SQL errors. |
| **Database** | Neon PostgreSQL | Serverless PostgreSQL with connection pooling. Scales to zero when idle. Free tier covers this scale. |
| **AI Model** | Gemini 1.5 Flash | Fast inference (<2s), generous free quota, excellent instruction-following for short summaries. |
| **HTTP Client** | Axios | Interceptors for timeout handling and failover logic inside Gemini service. |
| **Logging** | Morgan + custom logger | Request correlation IDs injected into every log line for production debugging. |
| **Security** | Helmet + express-rate-limit | Security headers + rate limiting on the expensive `/copilot` endpoint. |
| **Frontend Hosting** | Netlify | Atomic deploys, edge CDN, instant rollbacks, environment variable injection at build time. |
| **Backend Hosting** | Render | Native Node.js support, health check monitoring, zero-config HTTPS, GitHub CI/CD. |
| **Monorepo** | npm Workspaces | Single `npm install` installs all three services. `concurrently` runs all three locally with one command. |

---

## 7. AI Integration Deep Dive

### Model & API

- **Model:** `gemini-1.5-flash` via `generativelanguage.googleapis.com`
- **Temperature:** `0.7` (creative enough for engaging copy, stable enough for structured output)
- **Max tokens:** `250` per call (Gemini is the voice layer, not a reasoning engine — brevity matters)
- **Timeout:** `6 seconds` (fast failover to secondary key or local template)

### Where AI is woven into the user journey

```
Marketer types goal ? [DETERMINISTIC ENGINE RUNS] ? Gemini called once ? Response displayed

Step 1: parseIntent()       ? pure JS keyword matching, no AI
Step 2: identifySegment()   ? pure JS lookup table, no AI  
Step 3: analyzeHistoricalPerformance()  ? PostgreSQL query, no AI
Step 4: selectBestChannel() ? PostgreSQL query + comparison, no AI
Step 5: selectMessage()     ? PostgreSQL best-performer query, no AI
Step 6: buildRecommendation() ? pure JS aggregation, no AI
                              ?
              GeminiService.generateVoiceSummary()  ? Gemini called HERE
```

### The exact prompt used

```
You are Xeno, the AI-Native Marketing Copilot for BrewBean Coffee.
Our decision engine has analyzed the marketer's goal and generated a data-driven campaign plan.
Your task is to act as the "mouth/voice" of our system. Present the plan in a highly engaging, 
professional, and friendly manner to the marketer.

Goal: "{goal}"
Target Segment: "{segment}"
Recommended Channel: "{channel}"
Message Template: "{template}"
Recommendation Strength: "{strength}"

Key Data Points:
- {reason_1}
- {reason_2}
- ...

Provide a concise, talkative executive summary (2 sentences max) explaining why this plan was 
built and why the marketer should launch it. Be encouraging and sound like an elite co-strategist. 
Do not output markdown lists or formatting, just plain text.
```

### Failover chain

```
Primary key (GEMINI_API_KEY_PRIMARY)
    ? fails (timeout / 429 / 5xx)
Secondary key (GEMINI_API_KEY_SECONDARY)
    ? fails
Local template fallback (deterministic string interpolation)
    ? Always returns a valid response
```

### Why Gemini is NOT the brain

The recommendation strength (`strong` / `moderate` / `limited`), channel selection, segment targeting, and message template are all decided before Gemini is called. If Gemini were removed entirely, the system would still produce correct recommendations — it just wouldn't narrate them in natural language. This is a deliberate architectural choice: AI failures should never break product functionality.

---

## 8. Campaign Lifecycle

### Status State Machine

```
DRAFT ? READY ? LAUNCHING ? COMPLETED
                    ?
                 FAILED (if all recipients fail)
```

| Status | Meaning |
|---|---|
| `DRAFT` | Campaign created but not yet reviewed |
| `READY` | AI recommendation accepted, awaiting launch |
| `LAUNCHING` | Background dispatch worker running |
| `COMPLETED` | All recipients processed (sent or failed) |
| `FAILED` | System-level error during launch |

### Recipient Status State Machine

```
PENDING ? SENT ? DELIVERED ? READ
    ?       ?        ?
  FAILED  FAILED   FAILED
```

State precedence is strictly enforced. A `READ` event cannot downgrade a recipient to `DELIVERED`. The `canTransition()` utility in `utils/statusPrecedence.ts` enforces this.

### Channel Simulator Detail

The simulator is a separate Express service. Its `/send` endpoint:
1. Accepts: `{ recipientId, channel, destination, message, callbackUrl }`
2. Returns: `{ success: true, eventId: uuid }` immediately (202)
3. In background: Fires 2–4 callbacks per message:
   - `SENT` after ~100ms
   - `DELIVERED` after 500ms–2s (90% of messages)
   - `READ` after 1s–5s (varies by channel)
   - `FAILED` instead of DELIVERED for ~10% of messages

### Conversion Simulation

When the CRM receives a `READ` callback:
```typescript
if (Math.random() < 0.12) {
  // 12% conversion rate on READ
  await prisma.order.create({
    data: {
      customerId: dbRecipient.customerId,
      amount: 8 + Math.random() * 25,  // $8–$33 order
      status: 'COMPLETED',
      category: randomCoffeeCategory,
    }
  });
}
```
This order is then attributed to the campaign in the analytics engine (orders with `createdAt >= campaign.createdAt` for recipients of that campaign).

---

## 9. Project Structure

```
xeno/
+-- package.json                    ? Monorepo root. npm workspaces for all 3 services.
+-- README.md
+-- docs/                           ? Architecture, sequence diagrams, AI workflow docs
¦
+-- frontend/                       ? React + Vite dashboard
¦   +-- src/
¦   ¦   +-- api/
¦   ¦   ¦   +-- axios.ts            ? Axios instance. Reads VITE_API_URL env var.
¦   ¦   +-- components/
¦   ¦   ¦   +-- topbar/Topbar.tsx   ? Simulator health probe (GET /health)
¦   ¦   ¦   +-- ...                 ? Shared UI components
¦   ¦   +-- routes/
¦   ¦   ¦   +-- CopilotPage.tsx         ? AI campaign formulation interface
¦   ¦   ¦   +-- CampaignReviewPage.tsx  ? Human approval + launch screen
¦   ¦   ¦   +-- CampaignMonitorPage.tsx ? Live real-time funnel (polls every 1.5s)
¦   ¦   ¦   +-- CampaignHistoryPage.tsx ? Historical campaign registry
¦   ¦   ¦   +-- InsightsPage.tsx        ? Performance Intelligence Hub
¦   ¦   ¦   +-- CustomersPage.tsx       ? Customer directory with search
¦   ¦   ¦   +-- CustomerDetailPage.tsx  ? Shopper Journey timeline
¦   ¦   +-- types/                  ? TypeScript interfaces
¦
+-- crm-service/                    ? Core CRM API (Node.js + Express + Prisma)
¦   +-- prisma/
¦   ¦   +-- schema.prisma           ? 5 models: Customer, Order, Campaign, CampaignRecipient, ChannelEvent
¦   ¦   +-- seed.ts                 ? Generates 5k customers, 20k orders, 70 campaigns
¦   +-- src/
¦       +-- app.ts                  ? Express app: Helmet, CORS, rate limiting, Morgan
¦       +-- server.ts               ? HTTP server entry point
¦       +-- config/
¦       ¦   +-- env.ts              ? Typed environment config
¦       ¦   +-- prisma.ts           ? Singleton Prisma client
¦       +-- controllers/            ? Route handlers (thin layer, delegates to services)
¦       +-- services/
¦       ¦   +-- copilotBrain.service.ts       ? 6-step deterministic decision engine
¦       ¦   +-- gemini.service.ts             ? Gemini API with dual-key failover
¦       ¦   +-- historicalAnalyzer.service.ts ? Queries past campaign performance
¦       ¦   +-- channelRecommendation.service.ts ? Channel comparison logic
¦       ¦   +-- launch.service.ts             ? Campaign dispatch + background worker
¦       ¦   +-- receipt.service.ts            ? Webhook handler + idempotency
¦       ¦   +-- analytics.service.ts          ? Metrics aggregation + cache
¦       ¦   +-- nextActionEngine.service.ts   ? Post-campaign recommendation
¦       ¦   +-- segmentation.service.ts       ? DSL ? PostgreSQL query resolution
¦       ¦   +-- insight.service.ts            ? Cross-campaign intelligence
¦       ¦   +-- campaign.service.ts           ? CRUD operations
¦       +-- repositories/           ? Data access layer (Prisma queries)
¦       +-- routes/
¦       ¦   +-- copilot.routes.ts   ? POST /copilot/plan
¦       ¦   +-- campaigns.routes.ts ? CRUD + launch + metrics
¦       ¦   +-- customers.routes.ts ? GET /customers
¦       ¦   +-- insights.routes.ts  ? GET /insights
¦       ¦   +-- receipts.routes.ts  ? POST /receipts (webhook)
¦       +-- integrations/
¦       ¦   +-- channelClient.ts    ? HTTP client for simulator POST /send
¦       +-- middleware/
¦       ¦   +-- errorHandler.ts     ? Global error handler
¦       +-- utils/
¦           +-- logger.ts           ? Structured logger with correlation IDs
¦           +-- segmentDsl.ts       ? DSL parser + canonical segment normalization
¦           +-- statusPrecedence.ts ? State machine transition validator
¦
+-- channel-simulator/              ? Stub channel microservice (Node.js + Express)
    +-- src/
        +-- server.ts               ? Express app on :8001. GET /health endpoint.
        +-- routes/
        ¦   +-- channel.routes.ts   ? POST /send
        +-- controllers/
        ¦   +-- channel.controller.ts
        +-- services/
        ¦   +-- channel.service.ts  ? Probabilistic callback firing logic
        +-- utils/                  ? Timer helpers, failure randomization
```

---

## 10. Getting Started (Local Setup)

### Prerequisites

- Node.js 18+
- npm 9+
- A Neon PostgreSQL database (or local PostgreSQL)
- A Gemini API key (free tier works)

### Clone & Install

```bash
git clone https://github.com/Aswin480/xeno.git
cd xeno
npm run install:all
```

### Configure Environment Variables

Create `.env` files in each service:

```bash
cp crm-service/.env.example crm-service/.env
cp channel-simulator/.env.example channel-simulator/.env
cp frontend/.env.example frontend/.env
```

Fill in values per the [Environment Variables](#11-environment-variables) table below.

### Seed the Database

```bash
# Push schema to your PostgreSQL database
npm run db:setup

# Seed 5k customers, 20k orders, 70 campaigns
npm run db:seed
```

> ?? Seeding takes ~2–4 minutes. It inserts ~400,000 rows.

### Run All Three Services

```bash
# Runs frontend (:5173), CRM backend (:8000), simulator (:8001) concurrently
npm run dev
```

Or run individually:

```bash
npm run dev:crm        # CRM API on http://localhost:8000
npm run dev:simulator  # Channel Simulator on http://localhost:8001
npm run dev:frontend   # Dashboard on http://localhost:5173
```

---

## 11. Environment Variables

### `crm-service/.env`

| Variable | Description | Example | Required |
|---|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` | ? |
| `GEMINI_API_KEY_PRIMARY` | Primary Gemini API key | `AIzaSy...` | ? |
| `GEMINI_API_KEY_SECONDARY` | Secondary Gemini API key (failover) | `AIzaSy...` | ? |
| `FRONTEND_URL` | Allowed CORS origin | `https://xeno-production.netlify.app` | ? |
| `SIMULATOR_URL` | Channel Simulator base URL | `https://channel-simulator-production.onrender.com` | ? |
| `BACKEND_URL` | Public URL of this CRM service | `https://crm-service-production.onrender.com` | ? |
| `PORT` | HTTP port | `8000` | ? |

### `channel-simulator/.env`

| Variable | Description | Example | Required |
|---|---|---|---|
| `PORT` | Simulator port | `8001` | ? |
| `SIMULATOR_FAILURE_RATE` | Fraction of messages that fail | `0.10` | ? |
| `SIMULATOR_LATENCY_MIN` | Min callback delay (ms) | `500` | ? |
| `SIMULATOR_LATENCY_MAX` | Max callback delay (ms) | `2000` | ? |

### `frontend/.env`

| Variable | Description | Example | Required |
|---|---|---|---|
| `VITE_API_URL` | CRM Backend URL | `https://crm-service-production.onrender.com` | ? |
| `VITE_SIMULATOR_URL` | Simulator URL (health check only) | `https://channel-simulator-production.onrender.com` | ? |

---

## 12. Deployment

### Where each service is deployed and why

| Service | Platform | Reason |
|---|---|---|
| **Frontend** | **Netlify** | Atomic edge deploys, instant HTTPS, `VITE_*` env injection at build time, GitHub auto-deploy. |
| **CRM Backend** | **Render** | Native Node.js, persistent background workers, health check monitoring, zero-downtime deploys. |
| **Channel Simulator** | **Render** | Deployed as a separate web service — network-isolated from CRM, mimicking a true third-party provider. |
| **Database** | **Neon PostgreSQL** | Serverless PostgreSQL, auto-hibernation when idle, connection pooler for concurrent webhook ingestion. |

### Deploy CRM Backend to Render

1. Push repo to GitHub.
2. New Web Service ? Connect `Aswin480/xeno`.
3. Root Directory: `crm-service`
4. Build Command: `npm install && npm run build && npx prisma generate`
5. Start Command: `npm start`
6. Add all environment variables from the table above.
7. Health Check Path: `/health`

### Deploy Channel Simulator to Render

1. New Web Service ? Same repo.
2. Root Directory: `channel-simulator`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Health Check Path: `/health`

### Deploy Frontend to Netlify

1. New Site ? Connect `Aswin480/xeno`.
2. Base Directory: `frontend`
3. Build Command: `npm run build`
4. Publish Directory: `dist`
5. Environment Variables: `VITE_API_URL`, `VITE_SIMULATOR_URL`

---

## 13. API Reference

### CRM Service Endpoints

| Method | Endpoint | Description | Rate Limited |
|---|---|---|---|
| `GET` | `/health` | Service health check | No |
| `POST` | `/copilot/plan` | Submit goal ? get AI campaign plan | Yes (100/15min) |
| `GET` | `/campaigns` | List all campaigns | No |
| `POST` | `/campaigns` | Create new campaign | No |
| `GET` | `/campaigns/:id` | Get single campaign | No |
| `POST` | `/campaigns/:id/launch` | Launch campaign (triggers dispatch) | No |
| `GET` | `/campaigns/:id/metrics` | Get live funnel metrics | No |
| `GET` | `/customers` | List customers (paginated) | No |
| `GET` | `/customers/:id` | Get customer + order history | No |
| `GET` | `/insights` | Cross-campaign performance analytics | No |
| `POST` | `/receipts` | Ingest webhook callback from simulator | No |

### Channel Simulator Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Simulator health check |
| `POST` | `/send` | Accept message dispatch request |

### Webhook Callback Payload (`POST /receipts`)

```json
{
  "eventId": "evt_abc123",
  "recipientId": "uuid-of-campaign-recipient",
  "status": "DELIVERED",
  "timestamp": "2026-06-15T07:45:00.000Z",
  "errorMessage": null,
  "payload": {
    "channel": "EMAIL",
    "destination": "customer@example.com"
  }
}
```

---

## 14. Tradeoffs & What I'd Do Differently at Scale

### Conscious cuts made for this submission

| Cut | Reason | Production Solution |
|---|---|---|
| `setTimeout` for callbacks | Simple, observable, no infra | BullMQ / RabbitMQ worker queues with dead-letter queues |
| No auth layer | Single-tenant prototype | Auth0 or Clerk for JWT-based RBAC |
| Direct HTTP between services | Simple, no queue overhead | Kafka for guaranteed delivery and replay |
| Polling every 1.5s | No WebSocket complexity | WebSocket or SSE for push-based live updates |
| In-memory analytics cache | Simple cache invalidation on launch | Redis with TTL-based invalidation |
| No retry logic on failed webhooks | Simulator controls retry timing | Exponential backoff + dead-letter queue in worker |
| Single-region deployment | No geo-latency concern at demo scale | Multi-region Render + Neon read replicas |
| Gemini only for voice summary | Deliberate — keeps AI failure surface small | Could extend to generate DSL queries for complex goals |

### What production-scale architecture looks like

```
[Marketer] ? [React SPA / CDN]
                 ? REST
[API Gateway + Auth (Kong / Nginx)]
        ?                    ?
[CRM Service]        [Analytics Service]
        ?                    ?
[Kafka Topic: campaign.dispatched]
        ?
[Worker Fleet: dispatch workers]
        ?
[Real SMS/Email/WhatsApp APIs (Twilio / SendGrid / 360dialog)]
        ? webhooks
[Kafka Topic: delivery.events]
        ?
[Event Processor: idempotent consumer]
        ?
[PostgreSQL + Redis]
```

---

## 15. AI-Native Development Workflow

I used AI heavily during development — not to write code blindly, but as a pair programmer who needs strong code review.

| Task | AI Tool Used | How I used it |
|---|---|---|
| Prisma schema design | Claude | Drafted schema, reviewed against assignment requirements manually |
| Copilot Brain architecture | Claude | Explored 3 different approaches, selected deterministic over pure-LLM |
| Gemini prompt engineering | Manual iteration | Tested 8+ prompt variants against the actual API to tune tone and length |
| Seeding strategy | Gemini | Generated realistic name/email distributions; verified data distributions manually |
| CORS debugging | Claude | Diagnosed the Netlify preview URL regex issue |
| Analytics attribution query | Manual | Revenue attribution logic is business-critical; wrote and tested every edge case by hand |
| README structure | Claude | Outlined structure; all technical content written from actual code inspection |

**Rule I followed throughout:** AI writes a first draft. I read every line, understand what it does, test it, and own it. No black-box code shipped.

---

## 16. Roadmap

If given more time, here are the five things I'd build next, in priority order:

1. **Real channel dispatch** — Integrate Twilio (SMS), SendGrid (Email), and WhatsApp Business API. The architecture already supports it: replace `channelClient.ts` target URL from simulator to real providers.

2. **A/B testing framework** — The Next Action Engine already recommends A/B tests. Build the execution layer: split audience, run two message variants, track which converts better, auto-declare winner.

3. **Marketer authentication + multi-tenancy** — Add Clerk or Auth0. Each tenant gets isolated customer/campaign data. This is the path to a real SaaS product.

4. **Kafka-backed event pipeline** — Replace `setTimeout` callbacks with a Kafka topic. Every delivery event is guaranteed, replayable, and auditable. Add a dead-letter queue for failed callbacks.

5. **Natural language segment builder** — Extend the Copilot to accept more complex queries: *"customers who bought Espresso in the last 30 days but haven't returned"* ? auto-generate a custom Segment DSL instead of mapping to fixed RFM categories.

---

## License

MIT License — built for the Xeno take-home engineering assignment.

---

*Built with ? and deterministic logic by [Aswin](https://github.com/Aswin480)*
