# Savvy World Industrial OS — Design Audit
**Date:** 2026-05-09
**Auditor:** Gemini CLI

## Summary
The Savvy World Industrial OS dashboard is a visually striking, well-architected frontend application. It successfully achieves the "Apple Vision Pro × NVIDIA Omniverse" aesthetic with its dark-futuristic design, glass surfaces, and meticulous use of Arabic typography and RTL layouts. The architecture handles complex routing, lazy loading of heavy 3D assets, and responsive adaptation admirably.

However, a few areas require immediate attention to meet the non-negotiable enterprise quality bar. There is legacy code lingering in the repository, missing accessibility features on interactive elements, and the brand tagline is not perfectly aligned with the latest mandate. This audit details these findings and sets the course for the final polish.

## Findings

### Critical (must fix before next stakeholder demo)
- [F-C-01] Legacy dead code polluting the repository
  - **Where:** `src/pages/`, `src/components/BottomNav.tsx`, `src/components/Topbar.tsx`
  - **What:** Unused and bypassed legacy files remain in the codebase.
  - **Why it matters:** Increases maintenance overhead, creates confusion for future developers, and violates the "code cleanliness" mandate.
  - **Proposed fix:** Delete the unused files.

### High
- [F-H-01] Brand tagline missing requested copy
  - **Where:** `src/home/HomeCommandCenter.tsx:28`
  - **What:** The hero section uses "Live executive overview..." instead of the requested "Industrial OS — A real enterprise-grade robotics..." tagline.
  - **Why it matters:** Stakeholder misalignment and incorrect brand messaging on the most visible screen.
  - **Proposed fix:** Update the Arabic text and English subline to exactly match the requested tagline.
- [F-H-02] Missing ARIA labels on icon-only buttons
  - **Where:** `src/pages-detail/LanguagePage.tsx`
  - **What:** The Play and Pause buttons lack `aria-label` attributes.
  - **Why it matters:** Fails accessibility (A11y) standards, rendering the interface unusable for screen reader users.
  - **Proposed fix:** Add dynamic `aria-label="تشغيل"` and `"إيقاف"` to these buttons.

### Medium
- [F-M-01] Main chunk size slightly over 500KB warning limit
  - **Where:** `dist/assets/index-*.js`
  - **What:** The main entry chunk is ~692KB (168KB gzip), exceeding the recommended 500KB limit.
  - **Why it matters:** Slower time-to-interactive on constrained enterprise networks.
  - **Proposed fix:** Extract `DIALECTS` and other heavy static JSON data arrays into their own async chunks, though acceptable for now given gzip size.

### Low / Polish
- [F-L-01] Lack of deep model pipeline visualizations
  - **Where:** `src/pages-detail/LanguagePage.tsx`
  - **What:** The page focuses on dialect maturity rather than real-time monitoring of Whisper/XTTS logs.
  - **Why it matters:** Missing an opportunity to showcase deeper technical integrations, though acceptable for a UI prototype.