# Qur’anic Grammar & Phrase Builder (Browser-only)

A bilingual, browser-only tool to:
- Analyse Qur’anic Arabic (demo morphology and grammar tagging).
- Provide Arabic + English tooltips from a single glossary JSON.
- Build new phrases via a guided Grammar Builder with basic validation.
- Explore interactive grammar tables with semantic cross-linking.

## Features
- Single source of truth: `data/glossary.json`
- No page reloads; dynamic UI interactions
- Deterministic mock analysis/translation for demo
- Responsive, RTL-friendly UI
- Audit-safe, versioned glossary

## Quick start (GitHub Codespaces or local)

1. Open in Codespaces (or clone locally).
2. Node 18+ recommended.
3. Install (no deps, just to ensure engines are OK):
   ```bash
   npm install --no-audit --no-fund
