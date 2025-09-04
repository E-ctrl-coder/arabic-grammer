// glossary.js — single source of truth loader
// Deterministic: version pinned within JSON; exported here for UI.

export const Glossary = {
  version: 'unknown',
  terms: {},
  loaded: false
};

export async function loadGlossary() {
  const res = await fetch('data/glossary.json', { cache: 'no-store' });
  const json = await res.json();
  Glossary.version = json.version || 'unknown';
  Glossary.terms = json.terms || {};
  Glossary.loaded = true;
  return Glossary;
}

export function getTooltipData(term) {
  return Glossary.terms[term] || null;
}
