# Xeno System Walkthrough: Engineering & Architecture Presentation Script

* **Target Audience:** Senior Engineers, Architects, Technical Audit Committees
* **Speaker:** Principal Software Architect / AI Systems Lead
* **Video Length:** ~6 minutes

---

## Act I: Architecture Blueprint (0:00 - 1:30)

**[Visual: Diagram showing user layer, React frontend, Express CRM service, SQLite db, and Gemini API. Presenter highlights the disconnected channel-simulator microservice.]**

**Speaker Script:**
"Welcome, engineering team. Today, I'll walk you through Xeno's system architecture.

Our platform has three main services:
1. **The React + Vite Frontend:** A state-managed client that interacts with backend endpoints.
2. **The Express CRM Service:** The core API engine managing business logic, customer profiles, and campaign tracking.
3. **The Channel Simulator Service:** An isolated microservice simulating SMS, Email, and WhatsApp dispatches, communicating via webhook callbacks.

Our data is managed by Prisma SQLite. In production, we'll transition to PostgreSQL. Let's look at the database schema."

---

## Act II: Database Ledger & Schema (1:30 - 2:45)

**[Visual: Presenter scrolls through schema.prisma in VS Code, highlighting Customer, Campaign, CampaignRecipient, and ChannelEvent models.]**

**Speaker Script:**
"Our schema is designed for auditing and security.

The `Customer` model holds profile details and JSON tags.

The `Campaign` model stores AI parameters, segment DSL rules, and copy templates.

The core of our execution ledger is `CampaignRecipient`. This join table maps dispatches. It has a composite index on `campaignId` and `customerId` to prevent duplicate dispatches. It also features a unique `eventId` which handles webhook callback idempotency.

`ChannelEvent` logs every callback payload, creating a trace log for delivery auditing."

---

## Act III: AI Reasoning & Prompt Orchestration (2:45 - 4:15)

**[Visual: Presenter walks through copilotBrain.service.ts, showing how prompt contexts are assembled using transaction history and customer profiles, and how validation processes catch invalid JSON returns.]**

**Speaker Script:**
"Let's look at our AI campaign generator.

When a marketer sets a goal, the `CopilotBrain` queries customer directories to fetch count statistics and representative profiles.

This context is injected into our prompt templates, which request structured JSON outputs from Gemini.

Our prompt validates that generated templates use authorized variables, like `{name}`. If the LLM returns bad JSON or missing fields, our validation handlers trigger self-repair loops, ensuring type safety before saving drafts."

---

## Act IV: Closed-Loop Delivery & Webhook Processing (4:15 - 5:15)

**[Visual: Simulator terminal logs displaying dispatch loops alongside a browser showing the Live Monitor's animated graphs updating in real time.]**

**Speaker Script:**
"Once campaigns are launched, dispatches are sent to the simulator.

The simulator schedules dispatches and triggers callback hooks (`SENT`, `DELIVERED`, `READ`).

Our webhook controllers capture these events, update recipient states, and log payloads.

The analytics service computes conversions by checking if a recipient completes an order within 48 hours of reading a message. This attributes revenues to campaign budgets and updates the AI planner's history logs."

---

## Act V: Scaling Considerations (5:15 - 6:00)

**[Visual: Slide summarizing the Phase 4/5 roadmap: Redis, PostgreSQL migrations, and BullMQ queues.]**

**Speaker Script:**
"As we scale Xeno, our technical focus will cover three main areas:
1. **Distributed Queues:** Replacing synchronous HTTP dispatches with message queues like BullMQ or RabbitMQ.
2. **Caching Layers:** Utilizing Redis to cache segmentation statistics and campaign states, reducing database load.
3. **Database Migration:** Moving from SQLite to PostgreSQL to support write transactions.

This architecture ensures a scalable, observable, and self-improving platform. Thank you for your time."
