# Rami's KPI Dashboard

Executive KPI dashboard for **Rami AL Ajrami** (CEO, Savvy World) — designed for large-screen display at 4–5m viewing distance in Riyadh HQ meeting rooms.

## Live Preview

Open `index.html` in any modern browser. The file is fully self-contained (only external dependency: Google Fonts).

## Sections

5 pages × 6 blocks = **30 KPIs**, navigated by swipe / arrow keys / topbar dots.

| # | Page | Focus |
|---|------|-------|
| 1 | المشهد والتعلُّم | LiDAR scene reader · live transcript · 40 dialects · languages vs target · voice samples · R&D pipeline |
| 2 | العلامة والفريق | Mr. Savvy social · Hoksha viral · brand compliance · integration team · audience reach · content production |
| 3 | إدارة الأسطول | Robot units (KYC) · MENA fleet map · remote console · health · live alerts · WiFi |
| 4 | كاتالوج Mr. Savvy | 6 events: LEAP · NEOM · Saudi Founders · KAUST · Riyadh Season · GITEX |
| 5 | كاتالوج حكشة | 6 viral clips across TikTok / Snap / IG / X |

## Design System

- **Background:** Apple gray `#F5F5F7`
- **Accent:** Admiral Blue `#003D82` / `#0057B7`
- **Type:** Tajawal (Arabic) + system stack
- **Radius:** 28px cards · 18px sub-cards
- **Glass topbar:** `backdrop-filter: blur(28px)`

## Status Badges

- 🔒 **READ-ONLY · ملف رامي** — display copy only; modifications restricted to SM
- 🟡 **DEMO** — placeholder data; real APIs not yet wired
- ℹ️ **`i` button on every block** — opens an Apple-style popover explaining what the block measures

## Roadmap

This repo is the **v0.1 single-HTML mockup**. Upcoming:

- [ ] **Phase 1** — Vite + React + TypeScript + Tailwind + shadcn/ui migration
- [ ] **Phase 2** — Replace placeholders: real Mapbox MENA, ApexCharts, photographic catalog thumbnails, polished G1 render
- [ ] **Phase 3** — Mock API layer (Zod schemas + MSW) so the integration team can plug in real endpoints
- [ ] **Phase 4** — Live data binding (LiDAR scene, fleet GPS, social APIs, geofence)

## Integration Team (6 people)

| # | Name | Country | Role |
|---|------|---------|------|
| 1 | ليلى أبو-حسّان | 🇵🇸 | PM · knowledge / dialects / R&D |
| 2 | كريم الخطيب | 🇵🇸 | Integration · APIs + SOTI |
| 3 | Olena Petrova | 🇺🇦 | Sr. LiDAR + Vision |
| 4 | Maksym Ivanov | 🇺🇦 | Sr. TTS + Speech |
| 5 | Astrid Lindberg | 🇸🇪 | Creative Director · Brand |
| 6 | Erik Sandström | 🇸🇪 | 3D / Motion Design |

## Source Spec

See the original session brief (Mac, 2026-05-07) for full context, decisions, and rules:
`Sm-Brain/03_Logbook/2026-05-07_Rami_KPI_Dashboard_Brief.md`

---

© 2026 Savvy World · internal use only
