// app.js — bootstrap: load glossary, render tables, bind UI, examples

import { loadGlossary } from './glossary.js';
import { bindTermTooltips, setText } from './ui.js';
import { detectInputType, translateToArabic, analyseArabic } from './analysis.js';
import { renderGrammarTables } from './tables.js';
import { initGrammarBuilder } from './builder.js';

async function loadExamples() {
  const res = await fetch('data/examples.json', { cache: 'no-store' });
  return res.json();
}

function renderExamples(examples) {
  const list = document.getElementById('examples-list');
  list.innerHTML = '';
  const addChip = (label, lang) => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.innerHTML = `<span>${label}</span><span class="lang">(${lang})</span>`;
    chip.addEventListener('click', () => {
      const inp = document.getElementById('user-input');
      inp.value = label;
      document.getElementById('analyse-btn').click();
    });
    list.appendChild(chip);
  };
  examples.arabic.forEach(a => addChip(a, 'AR'));
  examples.englishVerbs.forEach(e => addChip(e, 'EN'));
}

function renderResult(result) {
  setText('translation', result.translation || '—');
  // Make morphology clickable with tooltip terms
  const morphHTML = `
    <span class="term" data-term="${result.morphology.pattern}" tabindex="0">${result.morphology.pattern}</span>
    • الجذر: ${result.morphology.root}
    • النوع: ${result.morphology.type}
  `;
  document.getElementById('morphology').innerHTML = morphHTML;

  const gt = result.grammarType || '—';
  document.getElementById('grammar-type').innerHTML =
    `<span class="term" data-term="${gt}" tabindex="0">${gt}</span>`;

  bindTermTooltips(document.getElementById('output-section'));
}

async function onAnalyse() {
  const val = document.getElementById('user-input').value.trim();
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

document.addEventListener('DOMContentLoaded', async () => {
  await loadGlossary();
  bindTermTooltips();
  renderGrammarTables();
  initGrammarBuilder();

  const examples = await loadExamples();
  renderExamples(examples);

  document.getElementById('analyse-btn').addEventListener('click', onAnalyse);
});
