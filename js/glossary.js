// glossary.js — single source of truth loader
// Deterministic: version pinned within JSON; exported here for UI components.

export const Glossary = {
  version: 'unknown', // Will be set from glossary.json
  terms: {},          // Key/value pairs of term → { en, desc, ... }
  loaded: false       // True once glossary has been successfully fetched
};

/**
 * Loads the glossary JSON from /data/glossary.json.
 * Ensures deterministic state: version, terms, and loaded flag are always set.
 * @returns {Promise<typeof Glossary>} The populated Glossary object.
 */
export async function loadGlossary() {
  try {
    const res = await fetch('data/glossary.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();

    Glossary.version = json.version || 'unknown';
    Glossary.terms = json.terms || {};
    Glossary.loaded = true;
  } catch (err) {
    console.error('Failed to load glossary:', err);
    Glossary.version = 'error';
    Glossary.terms = {};
    Glossary.loaded = false;
  }
  return Glossary;
}

/**
 * Retrieves tooltip data for a given glossary term.
 * @param {string} term - The glossary key to look up.
 * @returns {object|null} The term data object, or null if not found.
 */
export function getTooltipData(term) {
  if (!term || typeof term !== 'string') return null;
  return Glossary.terms[term] || null;
}