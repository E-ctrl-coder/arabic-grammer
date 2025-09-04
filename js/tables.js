// tables.js — interactive grammar tables with semantic cross-linking

import { getTooltipData } from './glossary.js';
import { bindTermTooltips } from './ui.js';

export function renderGrammarTables() {
  const container = document.getElementById('tables-container');
  container.innerHTML = '';

  // Block 1: Verb tenses
  container.appendChild(block(
    'الأزمنة الفعلية',
    [
      cell('فعل ماضٍ', 'فعل ماضٍ', ['فعل مضارع', 'فعل أمر']),
      cell('فعل مضارع', 'فعل مضارع', ['فعل ماضٍ', 'فعل أمر']),
      cell('فعل أمر', 'فعل أمر', ['فعل ماضٍ', 'فعل مضارع'])
    ]
  ));

  // Block 2: Cases
  container.appendChild(block(
    'علامات الإعراب',
    [
      cell('مرفوع', 'مرفوع', ['الخبر', 'المبتدأ']),
      cell('منصوب', 'منصوب', []),
      cell('مجرور', 'مجرور', ['حرف جر', 'إضافة'])
    ]
  ));

  // Block 3: Pronouns
  container.appendChild(block(
    'الضمائر',
    [
      cell('ضمير متصل', 'ضمير متصل', []),
      cell('ضمير منفصل', 'ضمير منفصل', [])
    ]
  ));

  bindTermTooltips(container);
  wireCrossLinking(container);
}

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

function cell(label, term, related = []) {
  const div = document.createElement('div');
  div.className = 'cell';
  div.setAttribute('data-term', term);
  div.setAttribute('tabindex', '0');
  div.innerHTML = `
    <span class="term" data-term="${term}" tabindex="0">${label}</span>
  `;
  if (!getTooltipData(term)) {
    div.title = 'No glossary entry found';
  }
  div.addEventListener('click', () => highlightRelated(term, related));
  div.addEventListener('keyup', (e) => { if (e.key === 'Enter') highlightRelated(term, related); });
  return div;
}

function wireCrossLinking(container) {
  container.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('mouseenter', () => setRelatedState(cell, true));
    cell.addEventListener('mouseleave', () => setRelatedState(cell, false));
  });
}

function setRelatedState(cell, on) {
  const term = cell.getAttribute('data-term');
  if (!term) return;
  const all = document.querySelectorAll(`.cell[data-term]`);
  all.forEach(el => {
    const t = el.getAttribute('data-term');
    const data = neighborMap[term] || [];
    if (t !== term && data.includes(t)) {
      el.classList.toggle('related', on);
    }
  });
}

const neighborMap = {
  'فعل ماضٍ': ['فعل مضارع', 'فعل أمر'],
  'فعل مضارع': ['فعل ماضٍ', 'فعل أمر'],
  'فعل أمر': ['فعل ماضٍ', 'فعل مضارع'],
  'مجرور': ['حرف جر', 'إضافة'],
  'مرفوع': ['المبتدأ', 'الخبر']
};

function highlightRelated(term, related) {
  document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlight'));
  document.querySelectorAll(`.cell[data-term="${term}"]`).forEach(c => c.classList.add('highlight'));
  related.forEach(r => {
    document.querySelectorAll(`.cell[data-term="${r}"]`).forEach(c => c.classList.add('related'));
  });
}
