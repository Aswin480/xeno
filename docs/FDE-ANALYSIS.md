# Xeno Frontend Legacy Analysis (Pre-Transformation Audit)

This document provides a retrospection of Xeno's original frontend codebase prior to the design system migration, cataloging core challenges, bottlenecks, and user experience issues.

---

## Summary of Legacy Deficiencies

Before the frontend migration, Xeno suffered from structural visual and logic defects:
1. **Hardcoded Color Palettes:** Styles were littered with static Tailwind color names (e.g. `bg-slate-900`, `text-indigo-400`). This made theme switching impossible.
2. **Broken Light Theme:** Activating the Light Theme led to unreadable white text on white backgrounds and invisible borders.
3. **Contrast Violations:** Key charts and intelligence summaries lacked contrast.
4. **Poor Status Indicators:** Campaign status transitions had color coding conflicts (e.g., failed actions styled in orange/gray instead of high-visibility rose).

---

## Legacy Engineering Audit Details

| Component / File | Legacy Color Class | Issue / Pain Point | User Impact | Priority |
| :--- | :--- | :--- | :--- | :--- |
| `CopilotThinking.tsx` | `bg-slate-900`, `text-indigo-400` | Hardcoded dark styles | Unreadable steps and status indicators in Light Mode | High |
| `DecisionCard.tsx` | `bg-slate-800`, `border-slate-700` | Fixed slate backgrounds | Visual breaks when switching themes | High |
| `RevenueChart.tsx` | `#1e293b` (hardcoded fill) | Invisible chart gridlines | Graphs look empty and broken in Light Mode | Medium |
| `MessagePreview.tsx` | `bg-slate-955`, `text-indigo-400` | Hardcoded phone shell borders | Interactive SMS/WhatsApp mockups look completely out of place in Light Mode | High |
| `CustomerDetailPage.tsx`| `text-indigo-600` | VIP crown indicators styled with low contrast | VIP user profiles look ordinary and uninspired | Low |
| `Button.tsx` | `bg-indigo-600 hover:bg-indigo-700`| Hardcoded theme accent | Button styles do not reflect brand primary color switches | Medium |

---

## Technical Bottlenecks

### 1. Style Leakage & Mismatched Classes
Without CSS variable boundaries, components used custom layout paddings and colors. Adding new widgets required copying existing code blocks, multiplying hardcoded color references.

### 2. Lack of Central Design System
Colors and border widths were customized per file. There were over 40 instances of custom gray/slate shades across the `/routes` folder.

### 3. Contrast Ratios & Accessibility (WCAG 2.1)
The contrast ratio of body copy in the legacy dashboard was often under $2.5:1$ in Light Mode, which is far below the WCAG AA requirement of $4.5:1$.
