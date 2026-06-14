# Xeno Core Sequence Flows

This document details the step-by-step sequence diagrams governing major operational flows in Xeno.

---

## 1. AI Request Lifecycle & Campaign Formulation

This flow shows how a marketer's request is parsed, planned, and formulated by the AI Brain.

```mermaid
sequenceDiagram
    autonumber
    actor Marketer
    participant UI as React Frontend
    participant App as Express CRM Service
    participant Brain as Copilot Brain
    participant Gemini as Gemini LLM Service
    participant DB as SQLite Database

    Marketer->>UI: Types goal: "Recover cart abandoners"
    UI->>App: POST /api/copilot/chat { message: "Recover cart abandoners" }
    App->>Brain: initiatePlanningLoop()
    Brain->>DB: Query customer transaction stats & order history
    DB-->>Brain: Return sample profiles & segments counts
    Brain->>Brain: Construct prompt context with SQL-like specs
    Brain->>Gemini: Send prompt & schema requirements
    Note over Gemini: Gemini parses intent, filters audience,<br/>recommends channel & generates copy.
    Gemini-->>Brain: Return JSON (segment, channel, template, ROI)
    Brain->>DB: Save campaign draft (status: DRAFT)
    DB-->>Brain: Campaign saved
    Brain-->>App: Formulation completed
    App-->>UI: Return campaign draft JSON
    UI-->>Marketer: Display recommended plan & ROI estimate
```

### Explanation
1. The marketer specifies the goal.
2. The frontend sends a chat request to the CRM service.
3. The Copilot Brain gathers background context from the database (segment sizes, categories, past campaigns).
4. The Brain builds a context-rich prompt and issues a structured JSON request to Gemini.
5. Gemini generates the campaign parameters which are saved as a DRAFT.
6. The frontend displays the proposal.

---

## 2. Closed-Loop Execution & Delivery Callbacks

This flow shows how a campaign is launched, dispatched to the simulator, and updated asynchronously.

```mermaid
sequenceDiagram
    autonumber
    actor Marketer
    participant UI as React Frontend
    participant App as Express CRM Service
    participant DB as SQLite Database
    participant Sim as Channel Simulator
    participant Webhook as Webhook Controller

    Marketer->>UI: Clicks "Launch Campaign"
    UI->>App: POST /api/campaigns/:id/launch
    App->>DB: Update campaign status to LAUNCHING
    App->>DB: Create CampaignRecipient rows (status: PENDING)
    App->>Sim: POST /api/simulator/send { recipients }
    Sim-->>App: Acknowledge dispatch queue started
    App-->>UI: Return launch status
    UI-->>Marketer: Switch to Live Monitor screen

    Note over Sim: Simulator processes recipients asynchronously

    loop Delivery Lifecycle Callbacks
        Sim->>Webhook: POST /api/webhooks/callback { recipientId, eventType: "SENT" }
        Webhook->>DB: Update recipient status to SENT
        DB-->>Webhook: Acknowledged
        
        Sim->>Webhook: POST /api/webhooks/callback { recipientId, eventType: "DELIVERED" }
        Webhook->>DB: Update recipient status to DELIVERED
        DB-->>Webhook: Acknowledged

        Sim->>Webhook: POST /api/webhooks/callback { recipientId, eventType: "READ" }
        Webhook->>DB: Update recipient status to READ
        DB-->>Webhook: Acknowledged
    end

    Note over UI: Polling updates stats & charts in real time
```

### Explanation
1. Launching a campaign initiates recipient records marked as `PENDING`.
2. The simulator processes each record in the background.
3. The simulator posts callbacks to the CRM Webhook handler.
4. Each callback updates the status of the specific recipient.

---

## 3. Authentication & Context Isolation Flow

Xeno provides tenant and user environment checks. Because it operates inside localized business scopes, context isolation is strictly enforced.

```mermaid
sequenceDiagram
    autonumber
    actor Marketer
    participant UI as React Frontend
    participant App as Express CRM Service
    participant Guard as Auth Middleware
    participant Tenant as Tenant Context Manager

    Marketer->>UI: Access Dashboard
    UI->>App: GET /api/campaigns (with Session Header)
    App->>Guard: Validate session credentials
    Guard->>Tenant: Resolve active brand environment (e.g. Cafe Xeno)
    Tenant-->>App: Set context database tenant bindings
    App-->>UI: Return isolated data payload
```

### Explanation
All inbound REST API requests pass through the Auth Middleware to bind database transactions to the active tenant/brand, protecting data isolation.

---

## 4. Notification & Next-Action Recommendation Loop

Xeno's AI proactively prompts the marketer for the next high-value action.

```mermaid
sequenceDiagram
    autonumber
    participant Engine as Next Action Engine
    participant DB as SQLite Database
    participant UI as React Frontend

    loop Real-Time Telemetry Scans
        Engine->>DB: Query campaign counts, status logs, & feedback
        DB-->>Engine: Returns active draft campaigns or completed metrics
        Engine->>Engine: Run recommendation rules
        Note right of Engine: If drafts exist -> Suggest review.<br/>If campaigns completed -> Suggest review revenue.
        Engine-->>UI: Push next action card recommendation
    end
```

### Explanation
The Next Action Engine checks active campaign states and creates context cards suggesting launch reviews or analytics audits.

---

## 5. Error Handling & Recovery Sequence

When the simulator encounters connection limits or simulator failures, Xeno degrades gracefully.

```mermaid
sequenceDiagram
    autonumber
    participant Sim as Channel Simulator
    participant Webhook as Webhook Controller
    participant DB as SQLite Database
    participant UI as React Frontend

    Sim->xWebhook: POST /api/webhooks/callback fails (Network Timeout)
    Note over Sim: Queue retry with exponential backoff (Max: 3)
    Sim->>Webhook: POST /api/webhooks/callback (Retry Success)
    Webhook->>DB: Log callback trace
    alt Invalid Payload Recieved
        Webhook-->>Sim: Return 400 Bad Request
        Webhook->>DB: Mark recipient status as FAILED with logs
        DB-->>UI: Push error state alert
    end
```

### Explanation
Callback failures are retried automatically. If persistent payload errors are encountered, recipients are safely logged as `FAILED` with details, preventing queue blocking.
