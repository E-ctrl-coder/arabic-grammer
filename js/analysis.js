// analysis.js — deterministic mock translation and morphology
// Browser-only, no external calls. Replace with APIs later if desired.

/**
 * Detects whether the input text is Arabic, English, or empty.
 * Uses a simple heuristic: if it contains any Latin letters, treat as English.
 * @param {string} text
 * @returns {'english'|'arabic'|'empty'}
 */
export function detectInputType(text) {
  if (!text || typeof text !== 'string') return 'empty';
  return /[a-zA-Z]/.test(text) ? 'english' : 'arabic';
}

// ---------- Mock Data ----------

/** @type {Record<string,string>} */
const eng2ar = {
  write: 'كتب',
  read: 'قرأ',
  say: 'قال',
  give: 'أعطى',
  come: 'جاء'
};

/** @type {Record<string,{pattern:string,root:string,type:string,paraphrase:string}>>} */
const arMorph = {
  'كتب':   { pattern: 'فعل ماضٍ',    root: 'ك-ت-ب', type: 'verb',     paraphrase: 'wrote' },
  'يكتب':  { pattern: 'فعل مضارع',   root: 'ك-ت-ب', type: 'verb',     paraphrase: 'writes/is writing' },
  'اكتب':  { pattern: 'فعل أمر',     root: 'ك-ت-ب', type: 'verb',     paraphrase: 'write!' },
  'قرأ':   { pattern: 'فعل ماضٍ',    root: 'ق-ر-أ', type: 'verb',     paraphrase: 'read (past)' },
  'قال':   { pattern: 'فعل ماضٍ',    root: 'ق-و-ل', type: 'verb',     paraphrase: 'said' },
  'الذي':  { pattern: 'اسم موصول',   root: '-',     type: 'particle', paraphrase: 'which/who (masc. sing.)' }
};

// ---------- Public API ----------

/**
 * Translates a known English verb to Arabic using the mock dictionary.
 * @param {string} english
 * @returns {string} Arabic translation or empty string if not found.
 */
export function translateToArabic(english) {
  if (!english || typeof english !== 'string') return '';
  const key = english.trim().toLowerCase();
  return eng2ar[key] || '';
}

/**
 * Analyses an Arabic token for morphology and grammar type.
 * Falls back to a simple heuristic if the token is not in the mock dictionary.
 * @param {string} arabic
 * @returns {{
 *   input: string,
 *   translation: string,
 *   morphology: {pattern:string,root:string,type:string},
 *   grammarType: string
 * }}
 */
export function analyseArabic(arabic) {
  if (!arabic || typeof arabic !== 'string') {
    return {
      input: '',
      translation: '—',
      morphology: { pattern: '—', root: '—', type: 'unknown' },
      grammarType: '—'
    };
  }

  const token = arabic.trim();
  const entry = arMorph[token];

  if (entry) {
    return {
      input: token,
      translation: entry.paraphrase,
      morphology: {
        pattern: entry.pattern,
        root: entry.root,
        type: entry.type
      },
      grammarType: entry.pattern
    };
  }

  // Fallback heuristic for unknown words
  const guess = {
    pattern: /^(ي|ت|ن)/.test(token) ? 'فعل مضارع' : 'فعل ماضٍ',
    root: '—',
    type: 'unknown'
  };

  return {
    input: token,
    translation: '—',
    morphology: guess,
    grammarType: guess.pattern
  };
}