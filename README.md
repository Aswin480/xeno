# XENO Copilot — AI-Native Marketing Decision Engine

> **From Ambiguity to Action.**

XENO Copilot is an AI-native marketing workspace that helps brands decide **who to reach, what to say, which channel to use, and what to do next**.

A marketer describes a business goal in plain English:

> *"Bring back dormant coffee customers."*

XENO interprets intent, formulates the audience, recommends the optimal channel and offer, generates campaign messaging, executes campaigns through a callback-driven simulator, monitors outcomes in real time, and continuously learns from campaign history to recommend the next best action.

**AI is the interface. Deterministic logic is the engine.**

---

## Live Demo

* Frontend: https://xeno-production.netlify.app
* CRM API: https://crm-service-production.onrender.com/health

---

## The Problem

Modern marketers don't struggle with sending messages.

They struggle with deciding:

* Which customers should we reach?
* What should we say?
* Which channel should we use?
* Is the campaign working?
* What should we do next?

Traditional tools optimize execution.

XENO optimizes decision-making.

---

## The XENO Loop

Business Goal
↓
Interpret Intent
↓
Generate Campaign Plan
↓
Human Approval
↓
Execute Campaign
↓
Observe Outcomes
↓
Learn From Results
↓
Recommend Next Action

---

## Key Features

### AI Copilot Center

* Natural-language campaign planning.
* Audience, channel, and offer recommendations.
* Explainable reasoning and executive summaries.

### Campaign Registry

* Campaign overview with operational intelligence.
* Revenue influenced and engagement metrics.
* Historical campaign performance.

### Live Operations Monitor

* Real-time campaign funnel.
* Callback-driven status updates.
* Live activity timeline.

### Campaign Memory

* Learns from historical campaigns.
* Identifies what worked and what failed.
* Uses evidence to improve future recommendations.

### Performance Intelligence Hub

* Cross-campaign analytics.
* Revenue attribution.
* Next best action recommendations.

### Customer Directory

* Read-only shopper intelligence.
* Order history and communication touchpoints.
* Shopper journey timelines.

---

## System Architecture

Frontend (React)
↓
CRM Service (Express + Prisma)
↓
Copilot Brain (Deterministic Decision Engine)
↓
Gemini Voice Layer
↓
Campaign Execution
↓
Channel Simulator
↓
Webhook Receipts
↓
Analytics & Campaign Memory
↓
Next Best Actions

---

## Technology Stack

### Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* Recharts

### Backend

* Node.js
* Express
* Prisma ORM
* Neon PostgreSQL

### AI

* Gemini 1.5 Flash
* Dual-key failover
* Template fallback

### Infrastructure

* Netlify
* Render
* Neon PostgreSQL

---

## AI Philosophy

XENO intentionally treats the LLM as the **voice**, not the **brain**.

### Deterministic Systems Handle:

* Audience resolution
* Campaign execution
* Event processing
* Analytics
* Recommendation logic
* Historical memory

### Gemini Handles:

* Natural-language explanations
* Campaign summaries
* Message refinement
* Marketer-friendly communication

If Gemini becomes unavailable, the workflow continues using deterministic templates.

---

## Dataset Strategy

To create realistic campaign intelligence, three public datasets were combined and transformed into a fictional coffee brand called **BrewBean Coffee**.

### Datasets Used

* Olist Brazilian E-Commerce Dataset
* Online Retail II Dataset
* Customer Personality Analysis Dataset

### Seeded Environment

* 5,000 Customers
* 20,000+ Orders
* 70+ Historical Campaigns
* 100,000+ Communications
* 250,000+ Engagement Events

This historical data powers XENO's campaign memory and recommendations.

---

## Deployment

| Service           | Platform        |
| ----------------- | --------------- |
| Frontend          | Netlify         |
| CRM Service       | Render          |
| Channel Simulator | Render          |
| Database          | Neon PostgreSQL |

---

## Trade-offs

To focus on the core marketer workflow, this project intentionally excludes:

* Authentication and RBAC
* Billing systems
* Real messaging providers
* Multi-tenancy

For production scale, I would introduce:

* Kafka or RabbitMQ
* Background worker queues
* Dead-letter queues
* Redis caching
* WebSockets/SSE
* Multi-region deployments

---

## AI-Native Development Workflow

AI was used as a development collaborator, not an autonomous coder.

I used AI to:

* Explore architectural alternatives.
* Review schema designs.
* Refine prompts.
* Debug infrastructure issues.

Every line of production code was reviewed, understood, tested, and owned before shipping.

---

## What Makes XENO Different

Most marketing platforms help teams execute campaigns.

**XENO helps them decide.**

It transforms:

Intent → Strategy → Execution → Observation → Learning → Better Decisions

Every campaign becomes institutional memory.

Every recommendation becomes more informed than the last.

---

**Built by Aswin for the Xeno Engineering Take-Home Assignment.**
