// app.js — bootstrap: load glossary, render tables, bind UI, examples

import { loadGlossary } from './glossary.js';
import { bindTermTooltips, setText } from './ui.js';
import { detectInputType, translateToArabic, analyseArabic } from './analysis.js';
import { renderGrammarTables } from './tables.js';
import { initGrammarBuilder } from './builder.js';

// ---------- Data Loading ----------

async function loadExamples() {
  try {
    const res = await fetch('data/examples.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to load examples:', err);
    return { arabic: [], englishVerbs: [] };
  }
}

// ---------- Rendering ----------

function renderExamples(examples) {
  const list = document.getElementById('examples-list');
  if (!list) return;

  list.innerHTML = '';

  const addChip = (label, lang) => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.innerHTML = `<span>${label}</span><span class="lang">(${lang})</span>`;
    chip.addEventListener('click', () => {
      const inp = document.getElementById('user-input');
      if (inp) {
        inp.value = label;
        document.getElementById('analyse-btn')?.click();
      }
    });
    list.appendChild(chip);
  };

  (examples.arabic || []).forEach(a => addChip(a, 'AR'));
  (examples.englishVerbs || []).forEach(e => addChip(e, 'EN'));
}

function renderResult(result) {
  setText('translation', result.translation || '—');

  const morph = result.morphology || { pattern: '—', root: '—', type: '—' };
  const morphHTML = `
    <span class="term" data-term="${morph.pattern}" tabindex="0">${morph.pattern}</span>
    • الجذر: ${morph.root}
    • النوع: ${morph.type}
  `;
  const morphEl = document.getElementById('morphology');
  if (morphEl) morphEl.innerHTML = morphHTML;

  const gt = result.grammarType || '—';
  const gtEl = document.getElementById('grammar-type');
  if (gtEl) {
    gtEl.innerHTML = `<span class="term" data-term="${gt}" tabindex="0">${gt}</span>`;
  }

  // Bind tooltips only within the output section
  const outputSection = document.getElementById('output-section');
  if (outputSection) bindTermTooltips(outputSection);
}

// ---------- Event Handlers ----------

async function onAnalyse() {
  const inp = document.getElementById('user-input');
  if (!inp) return;

  const val = inp.value.trim();
  if (!val) return;

  const type = detectInputType(val);
  let ar = val;

  if (type === 'english') {
    ar = translateToArabic(val);
    if (!ar) {
      renderResult({
        translation: 'No demo translation available',
        morphology: { pattern: '—', root: '—', type: '—' },
        grammarType: '—'
      });
      return;
    }
  }

  const res = analyseArabic(ar);
  renderResult(res);
}

// ---------- Bootstrap ----------

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Load glossary first
  await loadGlossary();

  // 2. Bind any static tooltips (e.g., glossary version display)
  bindTermTooltips();

  // 3. Render static grammar tables
  renderGrammarTables();

  // 4. Initialise grammar builder UI
  initGrammarBuilder();

  // 5. Load and render example chips
  const examples = await loadExamples();
  renderExamples(examples);

  // 6. Wire up analyse button
  document.getElementById('analyse-btn')?.addEventListener('click', onAnalyse);
});