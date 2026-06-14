# Xeno: AI-Native Autonomous Marketing Workspace

Xeno is an autonomous campaign generation and closed-loop execution workspace designed to replace manual marketing workflows with an empathetic, self-improving marketing agent. Marketers define strategic business goals, and Xeno formulates audience segments, generates multi-channel copy templates, runs live dispatches, and tracks real-time conversions back to transaction ledgers.

---

## Project Documentation

We maintain detailed design documents, diagrams, and execution plans in the [docs/](./docs) directory.

* **Project Overview & Index:** [docs/INDEX.md](./docs/INDEX.md)
* **Strategic Summary & Vision:** [docs/COMPLETE-SUMMARY.md](./docs/COMPLETE-SUMMARY.md)
* **System Architecture Blueprint:** [docs/architecture-diagram.md](./docs/architecture-diagram.md)
* **Closed-Loop OADA Engine:** [docs/copilot-v2-closed-loop-engine.md](./docs/copilot-v2-closed-loop-engine.md)
* **Design System & Theme System:** [docs/frontend-architecture.md](./docs/frontend-architecture.md)

---

## Technology Stack & Structure

The repository is structured as a multi-service workspace:

```text
xeno/
├── crm-service/        # Core Express CRM API & database manager
├── frontend/           # React + Vite client dashboard
├── channel-simulator/  # Asynchronous channel mock dispatcher
└── docs/               # System documentation & blueprints
```

### Stack Highlights
* **Frontend:** React, Vite, Tailwind CSS, Lucide Icons, Recharts.
* **CRM Backend:** Node.js, Express, Prisma ORM, Neon PostgreSQL.
* **Simulator:** Asynchronous queue mock handlers mimicking SMS/Email/WhatsApp callback webhooks.

---

## Quickstart Guide

To run Xeno locally, spin up each service in separate terminal windows.

### 1. Database & CRM Backend Setup
```bash
cd crm-service
npm install
npx prisma db push       # Sync schema to PostgreSQL database
npm run db:seed          # Seed sample customers and transactions
npm run dev              # Run server on http://localhost:8000
```

### 2. Channel Simulator Setup
```bash
cd channel-simulator
npm install
npm run dev              # Run simulator on http://localhost:8001
```

### 3. Frontend Dashboard Setup
```bash
cd frontend
npm install
npm run dev              # Launch dashboard on http://localhost:5173
```

---

## Scope & Production Trade-offs

This workspace is built as a highly observable functional prototype. To maintain focus on core AI-native campaign formulation and closed-loop database telemetry, the repository intentionally simplifies:
* **Authentication:** Assumes isolated single-tenant environments.
* **Billing Systems:** Excludes subscription payment integrations.
* **Direct Network APIs:** Dispatches are managed via the local `channel-simulator` microservice instead of direct Twilio/SendGrid developer keys.

For detailed migration paths to production networks, see the [Integration Roadmap](./docs/INTEGRATION-ROADMAP.md).
