# Xeno Frontend Architecture & Theme System

This document outlines the React + Vite frontend architecture of Xeno, detailing component strategies, routing patterns, design tokens, and the theme engine.

---

## Project Structure Map

```text
frontend/
├── public/                 # Static assets (logos, icons)
├── src/
│   ├── api/                # Axios API clients & route bindings
│   │   └── axios.ts        # Configured endpoints for CRM & Simulator
│   ├── components/         # Shared, reusable UI blocks
│   │   ├── campaign/       # Launchpad, Decision Cards, and metrics
│   │   ├── charts/         # Recharts wrappers (Revenue, Funnel, Channel)
│   │   ├── copilot/        # AI Chat, Message Preview mockups
│   │   ├── monitor/        # Telemetry logs, counters, simulator controls
│   │   ├── sidebar/        # Global layout navigation menu
│   │   ├── topbar/         # Header with service stats & theme toggle
│   │   └── ui/             # Atomic design elements (Buttons, Alerts)
│   ├── routes/             # Core page routes
│   │   ├── CopilotPage.tsx       # AI Copilot Center view
│   │   ├── CampaignRegistry.tsx  # List of campaigns
│   │   ├── CampaignMonitor.tsx   # Live delivery graphs
│   │   └── CustomerDirectory.tsx # Customer list, orders & segments
│   ├── utils/              # Utility helpers
│   │   └── theme.ts        # Theme togglers and localStorage managers
│   ├── App.tsx             # Root layout, routing wrapper & app boot
│   ├── index.css           # Tailwind base layers & CSS variable declarations
│   └── main.tsx            # React entry point mount
├── tailwind.config.js      # Tailwind CSS configuration mapping
├── tsconfig.json           # Type configurations
└── vite.config.ts          # Vite compilation settings
```

---

## Theme Architecture: The "Soft Stone" Design System

Xeno uses a strict semantic design system. Hardcoded Tailwind gray/indigo utility colors are avoided. All components read colors from system-wide CSS variables, ensuring high-fidelity visual parity between Light and Dark modes.

### 1. Theme Configuration Code Flow

```mermaid
graph LR
    UserClick[User clicks Theme Toggle] --> ToggleFn[toggleTheme() in Topbar]
    ToggleFn --> SaveLS[Save preference to localStorage]
    ToggleFn --> ApplyClass[Add/Remove .dark class on html root]
    ApplyClass --> VariableSwap[CSS Variables dynamically swap hex values]
    VariableSwap --> Rerender[Tailwind classes read var() & update UI]
```

### 2. Design Tokens (`src/index.css` & `tailwind.config.js`)

CSS variables are defined for background layouts, card containers, borders, text hierarchies, primary branding accents, and VIP styling elements:

* **Backgrounds:**
  * Light Mode: `#F7F8FA`
  * Dark Mode: `#030712`
* **Cards:**
  * Light Mode: `#FFFFFF`
  * Dark Mode: `#0f172a`
* **Borders:**
  * Light Mode: `#D9DDE3`
  * Dark Mode: `#1e293b`
* **Primary Branding Accent:**
  * Light Mode: `#2563EB` (Premium Stripe Blue)
  * Dark Mode: `#6366f1` (Linear Indigo Purple)

### 3. Component Normalization Rules
To maintain the "Soft Stone" aesthetic, developers must follow these utility mappings:
* **Backgrounds:** Use `bg-background` and `bg-card` instead of hardcoded grays.
* **Borders:** Use `border-border` for layout dividers and card outline definitions.
* **Typography:** Use `text-text-primary`, `text-text-secondary`, and `text-text-muted` to ensure readability and contrast in both modes.

---

## Routing & State Strategy

* **Routing Layout:** Managed via `react-router-dom` in `src/App.tsx`. A global sidebar layout encompasses the viewport, leaving the main content area responsive to page transitions.
* **Data Fetching:** Handled using Axios instances bound to API base paths.
* **Real-time Telemetry Polling:** Page views (such as the Campaign Monitor) poll the backend every 3 seconds while active, updating graphs and logs dynamically.

---

## Performance Optimizations

1. **Lightweight Recharts Wrappers:** Canvas chart paths are optimized. Tooltip triggers are customized to reference semantic colors, avoiding rendering delays.
2. **Fast Theme Swapping:** Mutating classes on `document.documentElement` operates directly in the DOM tree, bypassing costly React tree reconciliation.
3. **Optimized Icons:** Icons are resolved from the `lucide-react` library, ensuring clean SVG trees.
