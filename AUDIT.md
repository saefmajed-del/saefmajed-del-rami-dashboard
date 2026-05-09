# Savvy World Industrial OS — Design Audit

**Date:** 2026-05-09
**Auditor:** Gemini CLI
**Branch:** gemini/polish-pass-2

## Executive Summary

The Savvy World Industrial OS is an impressive, high-fidelity dashboard that successfully captures a futuristic "Apple Vision Pro × Tesla" aesthetic. The technical foundation is solid, utilizing React 19, Tailwind v4, and R3F for 3D visualization. The bilingual implementation (Arabic primary) is deeply integrated into the layout.

However, this audit has identified several critical violations of brand guardrails and data inconsistencies that threaten the "enterprise-grade" claim. Specifically, the sacred personal greeting on the home page has been normalized, Eastern Arabic numerals have crept into technical settings, and the fleet data is inconsistent across pages (missing drones in detail views). This second pass aims to resolve these issues and elevate the micro-interactions to meet the stakeholder's high bar.

## Findings

### Critical (Brand & Data Integrity)

- [F-C-01] **Brand Violation: Sacred Greeting Normalized**
    - **Where:** `src/home/HomeCommandCenter.tsx:32`
    - **What:** The H1 greeting `مساء الخير، رامي` is written in normal Arabic.
    - **Why it matters:** Guardrail #2 explicitly mandates the greeting `يمار ،ريخلا ءاسم` is SACRED and must stay as the home page H1. A previous "fix" was reverted; the current state is a regression.
    - **Proposed fix:** Restore the exact sacred string: `يمار ،ريخلا ءاسم`.

- [F-C-02] **Guardrail Violation: Eastern Arabic Numerals in Technical Context**
    - **Where:** `src/pages-detail/SettingsPage.tsx:23,24,45,46,83,95` and `src/pages-detail/BrandPage.tsx:64,65,66,67`
    - **What:** Use of Eastern numerals (٢, ٣, ١٨, ٤, ١٠, ٠٩:٤٢, ٠٧:٢٠) next to LTR/technical strings.
    - **Why it matters:** Guardrail #9 mandates Western numerals (0–9) with `.tabular-nums` to prevent BiDi jumping and maintain technical legibility.
    - **Proposed fix:** Convert all Eastern numerals to 0–9.

- [F-C-03] **Data Inconsistency: Fleet Fleet mismatch**
    - **Where:** `src/pages-detail/FleetPage.tsx:36`
    - **What:** `ROBOT_DETAIL` map contains only 10 entries (humanoids/quadrupeds), but the global fleet has 13 assets (including 3 drones).
    - **Why it matters:** Navigating from the Fleet snapshot (13 assets) to the Fleet page (10 assets) creates a jarring "broken" experience for stakeholders.
    - **Proposed fix:** Sync `ROBOT_DETAIL` with `ROBOT_PINS` in `src/home/data.ts` and add drone-specific metadata.

- [F-C-04] **Bilingual Incompleteness: Missing English Sub-lines**
    - **Where:** `src/pages-detail/DigitalTwinPage.tsx:501` and others.
    - **What:** Buttons like "إعادة الكاميرا" and "دوران تلقائي" lack English sub-lines.
    - **Why it matters:** Guardrail #11 mandates every Arabic line must have a corresponding English sub-line.
    - **Proposed fix:** Add English sub-lines (e.g., "Reset Camera", "Auto Rotate") using the established `font-en text-[10px]` pattern.

- [F-C-05] **Accessibility Blocker: Missing ARIA Labels**
    - **Where:** `src/pages-detail/TelepresencePage.tsx:603,612`, `src/pages-detail/DigitalTwinPage.tsx:497,510`
    - **What:** Icon-only buttons (Pause, Maximize, Reset) lack `aria-label`.
    - **Why it matters:** Guardrail #14 and A11y standards.
    - **Proposed fix:** Add descriptive Arabic `aria-label` to all icon-only buttons.

### High (Visual & UX Coherence)

- [F-H-01] **Mobile Layout: Telepresence Camera Grid Congestion**
    - **Where:** `src/pages-detail/TelepresencePage.tsx:507`
    - **What:** Grid uses `grid-cols-3` on small screens and `xl:grid-cols-9`.
    - **Why it matters:** On 360px devices, 3 columns of video streams are too small to be useful.
    - **Proposed fix:** Change to `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` for better legibility on mobile.

- [F-H-02] **Component Duplication: KPI Tiles**
    - **Where:** `FleetPage.tsx`, `TelepresencePage.tsx`, `EngineeringOpsPage.tsx`
    - **What:** KPI tiles are reimplemented with slightly different padding, font-sizes, and glow effects.
    - **Why it matters:** Maintenance burden and subtle visual drift.
    - **Proposed fix:** Extract a unified `KpiCard` component.

- [F-H-03] **Hierarchy: Language Page orientiation**
    - **Where:** `src/pages-detail/LanguagePage.tsx`
    - **What:** 2720 lines of code. The 12 AI Voice Ops panels are very similar and lead to "scrolling fatigue."
    - **Why it matters:** Users lose context of which model/dialect they are looking at.
    - **Proposed fix:** Add sticky headers or a mini-anchor navigation for the 12 panels.

### Medium (Polish & Cleanliness)

- [F-M-01] **Spacing Inconsistency: Settings Cards**
    - **Where:** `src/pages-detail/SettingsPage.tsx:131`
    - **What:** Card padding is `p-5`, while most other page cards use `p-4` or `p-3`.
    - **Why it matters:** Breaks the 8px grid rhythm.
    - **Proposed fix:** Unify to `p-4` with consistent gaps.

- [F-M-02] **Code Quality: Inline Styles in JSX**
    - **Where:** `src/pages-detail/RoboticsEdgePage.tsx:233`
    - **What:** Use of `<style>` tag inside a component for hover effects.
    - **Why it matters:** Not idiomatic for this Tailwind-first project.
    - **Proposed fix:** Move to `src/index.css` as a utility or use Tailwind `group-hover`.

- [F-M-03] **RTL Correctness: Logic Property Slippage**
    - **Where:** `src/home/TopBar.tsx:84`
    - **What:** `ms-auto` is used (good), but check `DigitalTwinPage.tsx` HUD overlays for `left/right`.
    - **Proposed fix:** Ensure `inset-inline-start` is used for all absolute overlays.

### Low / Polish

- [F-L-01] **Animation Taste: Sparkline Entry**
    - **Where:** `src/home/parts/Sparkline.tsx`
    - **What:** Sparklines appear instantly.
    - **Proposed fix:** Add a simple `framer-motion` reveal for the path.

- [F-L-02] **Brand Compliance: Drone Shape on Map**
    - **Where:** `src/home/parts/SaudiMap.tsx`
    - **What:** Ensure the drone "quadcopter" shape is distinct enough from the humanoid circle at mobile sizes.
    - **Proposed fix:** Increase stroke weight or simplify the quad-rotor silhouette.

---
**Auditor:** Gemini CLI
**Date:** May 9, 2026
