// tables.js — interactive grammar tables with semantic cross-linking

import { getTooltipData } from './glossary.js';
import { bindTermTooltips } from './ui.js';

/**
 * Renders all grammar tables into #tables-container.
 * Each block is built from a title and an array of cell definitions.
 */
export function renderGrammarTables() {
  const container = document.getElementById('tables-container');
  if (!container) {
    console.warn('#tables-container not found in DOM');
    return;
  }

  container.innerHTML = '';

  // Block 1: Verb tenses
  container.appendChild(
    block('الأزمنة الفعلية', [
      cell('فعل ماضٍ', 'فعل ماضٍ', ['فعل مضارع', 'فعل أمر']),
      cell('فعل مضارع', 'فعل مضارع', ['فعل ماضٍ', 'فعل أمر']),
      cell('فعل أمر', 'فعل أمر', ['فعل ماضٍ', 'فعل مضارع'])
    ])
  );

  // Block 2: Cases
  container.appendChild(
    block('علامات الإعراب', [
      cell('مرفوع', 'مرفوع', ['الخبر', 'المبتدأ']),
      cell('منصوب', 'منصوب', []),
      cell('مجرور', 'مجرور', ['حرف جر', 'إضافة'])
    ])
  );

  // Block 3: Pronouns
  container.appendChild(
    block('الضمائر', [
      cell('ضمير متصل', 'ضمير متصل', []),
      cell('ضمير منفصل', 'ضمير منفصل', [])
    ])
  );

  // Bind glossary tooltips and cross-linking
  bindTermTooltips(container);
  wireCrossLinking(container);
}

/**
 * Creates a table block with a title and a grid of cells.
 * @param {string} title
 * @param {HTMLElement[]} cells
 * @returns {HTMLElement}
 */
function block(title, cells) {
  const wrap = document.createElement('div');
  wrap.className = 'table-block';

  const h = document.createElement('h3');
  h.textContent = title;
  wrap.appendChild(h);

  const grid = document.createElement('div');
  grid.className = 'table-grid';
  cells.forEach(c => grid.appendChild(c));
  wrap.appendChild(grid);

  return wrap;
}

/**
 * Creates a single clickable cell with tooltip and related-term highlighting.
 * @param {string} label - The visible label in the cell.
 * @param {string} term - The glossary term key.
 * @param {string[]} related - Array of related term keys.
 * @returns {HTMLElement}
 */
function cell(label, term, related = []) {
  const div = document.createElement('div');
  div.className = 'cell';
  div.setAttribute('data-term', term);
  div.setAttribute('tabindex', '0');

  div.innerHTML = `<span class="term" data-term="${term}" tabindex="0">${label}</span>`;

  if (!getTooltipData(term)) {
    div.title = 'No glossary entry found';
  }

  div.addEventListener('click', () => highlightRelated(term, related));
  div.addEventListener('keyup', e => {
    if (e.key === 'Enter') highlightRelated(term, related);
  });

  return div;
}

/**
 * Wires hover-based cross-link highlighting between related cells.
 * @param {HTMLElement} container
 */
function wireCrossLinking(container) {
  container.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('mouseenter', () => setRelatedState(cell, true));
    cell.addEventListener('mouseleave', () => setRelatedState(cell, false));
  });
}

/**
 * Adds or removes the 'related' class on cells related to the hovered cell.
 * @param {HTMLElement} cell
 * @param {boolean} on
 */
function setRelatedState(cell, on) {
  const term = cell.getAttribute('data-term');
  if (!term) return;

  const relatedTerms = neighborMap[term] || [];
  document.querySelectorAll('.cell[data-term]').forEach(el => {
    const t = el.getAttribute('data-term');
    if (t !== term && relatedTerms.includes(t)) {
      el.classList.toggle('related', on);
    }
  });
}

/**
 * Highlights the clicked cell and marks its related cells.
 * @param {string} term
 * @param {string[]} related
 */
function highlightRelated(term, related) {
  document.querySelectorAll('.cell').forEach(c => {
    c.classList.remove('highlight', 'related');
  });

  document.querySelectorAll(`.cell[data-term="${term}"]`).forEach(c => {
    c.classList.add('highlight');
  });

  related.forEach(r => {
    document.querySelectorAll(`.cell[data-term="${r}"]`).forEach(c => {
      c.classList.add('related');
    });
  });
}

// Map of term → directly related terms
const neighborMap = {
  'فعل ماضٍ': ['فعل مضارع', 'فعل أمر'],
  'فعل مضارع': ['فعل ماضٍ', 'فعل أمر'],
  'فعل أمر': ['فعل ماضٍ', 'فعل مضارع'],
  'مجرور': ['حرف جر', 'إضافة'],
  'مرفوع': ['المبتدأ', 'الخبر']
};