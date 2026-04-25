# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TokenLens** is a React + Vite dashboard for monitoring Claude API token usage, costs, and efficiency. It provides real-time analytics with visualizations, PDF export capabilities, and intelligent notifications.

## Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run build           # Production build → dist/
npm run preview         # Preview production build locally
npm run lint            # Run ESLint

# Deployment
npm run predeploy       # Runs build before deploy
npm run deploy          # Deploy to GitHub Pages (gh-pages -d dist)
```

## Architecture

### Data Flow
1. **`useTokenData()` hook** (`src/hooks/useTokenData.js`) — main data source
   - Auto-fetches mock data every 60 seconds
   - Generates weekly, monthly, hourly, task breakdown, recent requests, session data, stats, plan usage, and efficiency tips
   - Exports: `{ data, loading, refreshing, lastUpdated, refresh }`

2. **Component Tree**
   - `App.jsx` — main layout (Sidebar + Header + Main content area)
   - Routes: `activeNav` state switches between 'dashboard' (default) and 'analytics' views
   - `Sidebar.jsx` — navigation, plan usage indicator, mobile burger menu
   - `Header.jsx` — refresh button, notification toggle, last-updated timestamp
   - Dashboard components consume data via props
   - `AnalyticsView.jsx` — separate analytics page with efficiency advisor and project breakdown

### Key Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `StatCard` | Display single metric (tokens, cost, requests, efficiency) with icon, delta, loading state | `components/StatCard.jsx` |
| `Charts` | Weekly usage (input/output stacked bar), hourly (line), daily cost (bar) | `components/Charts.jsx` |
| `SessionCard` | Current session stats (duration, tokens, cost) | `components/SessionCard.jsx` |
| `TaskBreakdown` | Pie chart of tasks by category | `components/TaskBreakdown.jsx` |
| `RecentRequests` | Small list of recent API calls | `components/RecentRequests.jsx` |
| `PlanLimits` | Progress bars for weekly and session limits with thresholds | `components/PlanLimits.jsx` |
| `DownloadButton` | Animated PDF export button | `components/DownloadButton.jsx` |
| `EfficiencyAdvisor` | Tips and insights (analytics view) | `components/EfficiencyAdvisor.jsx` |
| `ToastNotifications` | In-app toast portal with `useToasts()` hook | `components/ToastNotifications.jsx` |
| `Sidebar` | Navigation, responsive (mobile burger menu) | `components/Sidebar.jsx` |
| `Header` | Top bar with refresh, bell toggle, last-updated | `components/Header.jsx` |

### Hooks

- **`useTokenData()`** — Main data fetcher, 60-second auto-refresh
- **`useNotifications()`** (`src/hooks/useNotifications.js`) — Voice/chime alerts at 50%, 75%, 90%, 100% of plan limits
- **`useToasts()`** (via `ToastNotifications`) — In-app toast state management

### Mock Data Generators

`src/data/mockData.js` exports:
- `PRICING` — Per-model token costs (Opus, Sonnet, Haiku)
- `MODEL_META` — Model display info (color, label, short name)
- `TASK_CATEGORIES` — Task types (Coding, Writing, Analysis, Research, Creative, Other)
- `PLAN_LIMITS` — Weekly token limits by plan tier (Pro, Max 5, Max 20)
- `INSTALLED_SKILLS` — Skill usage data
- `PROJECT_TYPES` — Project breakdown data
- Generation functions: `generateWeeklyData()`, `generateHourlyData()`, `generateStats()`, `generatePlanUsage()`, etc.

### Styling

**Framework:** Tailwind CSS v3.4 with custom theme  
**Fonts:** DM Sans (UI), JetBrains Mono (code), Syne (display)  
**Color Palette:** 
- Background: `#F0F2F7`
- Sidebar: `#0D0F14`
- Accent colors: mint, sky, peach, lavender, yellow, rose (light + deep variants)
- Semantic: muted (`#8B95A8`), border (`#E4E8F0`)

**Custom CSS** (`src/index.css`):
- `.card-glass` — frosted glass effect
- `.card-solid` — solid white card with shadow
- `.shimmer-bg` — loading skeleton animation
- Custom animations: `fade-up`, `fade-in`, `pulse2`, `shimmer`, `counter`

**Responsive Design:**
- Mobile-first approach
- Grid breakpoints: `grid-cols-2 lg:grid-cols-4`
- Mobile sidebar with burger menu (`mobileOpen` state)

## Key Files to Know

- **`src/App.jsx`** — Root layout, state management (activeNav, notifications, refresh)
- **`src/views/AnalyticsView.jsx`** — Second major view with efficiency advisor
- **`src/lib/generatePDF.js`** — jsPDF + jsPDF-autotable logic for 6-page PDF export
- **`src/lib/sound.js`** — Web Audio API for voice + chime notifications
- **`eslint.config.js`** — ESLint rules (React hooks, refresh plugin)
- **`tailwind.config.js`** — Custom theme and animations
- **`vite.config.js`** — Vite config with base path `/token-lens/` for GitHub Pages

## Development Notes

- **Data is mocked** — All data comes from `generateXXX()` functions in `mockData.js`. To integrate real Claude  API usage, modify `useTokenData()` to fetch from an actual backend.
- **Animations** — Heavy use of `animate-fade-up` with staggered delays (see App.jsx rows 1–6)
- **Notifications** — In-app toasts (no browser permission needed); voice/chime via Web Audio API
- **PDF Export** — 6-page report with title, summary, charts, detailed request table
- **Responsive** — Fully mobile-friendly with sidebar collapse on small screens
- **Deployment** — GitHub Pages at `https://Eraj-Choriev.github.io/token-lens/`

## Deployment

Pushed to GitHub Pages via `npm run deploy`, which builds and deploys the dist folder. Ensure origin remote points to your fork or intended repository.
