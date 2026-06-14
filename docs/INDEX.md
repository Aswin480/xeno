# Xeno AI-Native Marketing Workspace - Documentation Index

Welcome to the official technical documentation repository for Xeno, an autonomous, AI-native marketing campaign generation and execution platform. This directory contains detailed architectural blueprints, flow diagrams, data schemas, and integration guides designed to facilitate engineering onboarding, technical reviews, investor presentations, and future scaling.

---

## Documentation Map

Below is a directory of the available documentation, mapped by topic and target audience.

| Document | Purpose | Target Audience | Key Highlights |
| :--- | :--- | :--- | :--- |
| [COMPLETE-SUMMARY.md](./COMPLETE-SUMMARY.md) | Executive and Investor Summary | Investors, PMs, Staff Architects | Vision, Mission, Problem Statement, Solution, Roadmap |
| [architecture-diagram.md](./architecture-diagram.md) | Core System Architecture Blueprint | Backend & DevOps Engineers | User/Frontend/Backend/AI Layer interactions and tech stack |
| [sequence-diagram.md](./sequence-diagram.md) | Asynchronous Data & Execution Flows | System Integration Engineers | Live simulation loops, feedback callbacks, errors |
| [er-diagram.md](./er-diagram.md) | Entity Relationship & DB Schema | Database Administrators, Architects | Prisma models, Campaign relationships, Event logging |
| [ai-workflow.md](./ai-workflow.md) | AI Agentic Lifecycle & Prompts | AI/ML Engineers, Data Scientists | Tool routing, Prompt structures, LLM response validation |
| [copilot-brain-architecture.md](./copilot-brain-architecture.md) | AI Brain & Reasoning Core | AI Engineers, Software Architects | Memory loop, Planner execution flow, Fallbacks |
| [copilot-v2-closed-loop-engine.md](./copilot-v2-closed-loop-engine.md) | Telemetry & Closed-Loop Analytics | Growth & Analytics Engineers | Observe-Analyze-Decide-Act (OADA) loops, ROI tracking |
| [frontend-architecture.md](./frontend-architecture.md) | Frontend Design & Theme Architecture | Frontend Engineers, Designers | Tailwind theme systems, folder layouts, component structures |
| [FDE-ANALYSIS.md](./FDE-ANALYSIS.md) | Legacy System Audit & Pain Points | Engineering Managers, QA Leads | Visual bugs, slate/indigo purges, status mismatch analysis |
| [FDE-TRANSFORMATION.md](./FDE-TRANSFORMATION.md) | Design System Migration Records | Principal Frontends, Product Owners | Before vs After comparison, design system tokens |
| [INTEGRATION-ROADMAP.md](./INTEGRATION-ROADMAP.md) | Multi-Phase Implementation Roadmap | Staff PMs, Technical Directors | Milestones, features, dependencies, metrics from Phase 1 to 5 |
| [fde-video-script.md](./fde-video-script.md) | Technical Presentation Script | Investors, Stakeholders | Script explaining problem, transformation, and impact |
| [sde-video-script.md](./sde-video-script.md) | Engineering System Walkthrough Script | New Hires, Audit Committees | Deep-dive code walkthrough script of backend & agent workflows |

---

## Recommended Reading Order

Depending on your role, we recommend following these specific paths to get up to speed:

### 1. Executive / Investor Path
For a high-level strategic understanding of Xeno, its value proposition, and timeline:
* **Step 1:** [COMPLETE-SUMMARY.md](./COMPLETE-SUMMARY.md) — Understand the business problem, vision, and roadmap.
* **Step 2:** [fde-video-script.md](./fde-video-script.md) — Review the system demo and impact presentation structure.

### 2. AI / Agent Engineer Path
For developers working on campaign formulation, recommendation models, and memory logic:
* **Step 1:** [copilot-brain-architecture.md](./copilot-brain-architecture.md) — Learn about the Planner, Tool Manager, and Memory loop.
* **Step 2:** [ai-workflow.md](./ai-workflow.md) — Dive into LLM prompts, input cleaning, and validations.
* **Step 3:** [copilot-v2-closed-loop-engine.md](./copilot-v2-closed-loop-engine.md) — Understand the feedback loop and decision telemetry.

### 3. Frontend & Product Path
For designers and UI/UX developers working on the theme system and dashboard elements:
* **Step 1:** [frontend-architecture.md](./frontend-architecture.md) — Review the design variables, structure, and theme context.
* **Step 2:** [FDE-TRANSFORMATION.md](./FDE-TRANSFORMATION.md) — Learn about the "Soft Stone" aesthetic and semantic color tokens.

### 4. Backend / Systems Path
For integration developers, database managers, and DevOps team members:
* **Step 1:** [architecture-diagram.md](./architecture-diagram.md) — High-level layout of the microservices.
* **Step 2:** [sequence-diagram.md](./sequence-diagram.md) — Check live callback loops and message states.
* **Step 3:** [er-diagram.md](./er-diagram.md) — Reference the schema layout.

---

## Glossary

* **Xeno Copilot:** The AI-native agent interface assisting marketers in defining goals, audience criteria, and message copy.
* **Soft Stone Aesthetic:** A high-end, premium design language focusing on content-focused contrast, thin borders, and subtle HSL colors over high-contrast generic shadows.
* **Closed-Loop Engine:** The feedback system that reads message delivery events (SENT -> DELIVERED -> READ -> CLICKED), correlates them to customer orders, and refines the LLM memory context.
* **Simulator Service:** An asynchronous event dispatcher simulating delivery channels (SMS, Email, WhatsApp) and generating realistic tracking webhooks.
* **Segmentation DSL:** A JSON-based domain-specific language defining targeting query conditions (e.g., minimum purchases, date constraints).
* **Next Action Recommendation:** A context-aware card prompt suggesting the next logical operation (e.g., "Review drafts", "Adjust channel distribution", "Restart simulator").
