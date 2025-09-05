// builder.js — guided phrase builder with basic validation and live preview

import { setHTML } from './ui.js';

// ---------- Static Data ----------

const PRONOUNS = ['هو', 'هي', 'أنا', 'نحن', 'أنتَ', 'أنتِ', 'أنتم', 'هم'];

const TENSES = [
  { id: 'past', label: 'ماضٍ' },
  { id: 'present', label: 'مضارع' },
  { id: 'imperative', label: 'أمر' }
];

const PATTERNS = [
  { id: 'I', label: 'Form I' },
  { id: 'II', label: 'Form II' },
  { id: 'III', label: 'Form III' }
];

// ---------- State ----------

const state = {
  root: '',
  pattern: 'I',
  pronoun: 'هو',
  tense: 'past',
  modifiers: []
};

/**
 * Initialises the Grammar Builder UI and event bindings.
 */
export function initGrammarBuilder() {
  const ui = document.getElementById('builder-ui');
  if (!ui) {
    console.warn('#builder-ui not found in DOM');
    return;
  }

  ui.innerHTML = `
    <div class="field">
      <label for="root-input">الجذر</label>
      <input type="text" id="root-input" placeholder="ك-ت-ب" />
    </div>
    <div class="field">
      <label for="pattern-select">الوزن/الباب</label>
      <select id="pattern-select">
        ${PATTERNS.map(p => `<option value="${p.id}">${p.label}</option>`).join('')}
      </select>
    </div>
    <div class="field">
      <label for="tense-select">الزمن</label>
      <select id="tense-select">
        ${TENSES.map(t => `<option value="${t.id}">${t.label}</option>`).join('')}
      </select>
    </div>
    <div class="field">
      <label for="pronoun-select">الضمير</label>
      <select id="pronoun-select">
        ${PRONOUNS.map(p => `<option value="${p}">${p}</option>`).join('')}
      </select>
    </div>
    <div class="field actions">
      <button id="validate-btn" class="primary">تحقق</button>
      <button id="reset-btn">إعادة تعيين</button>
    </div>
  `;

  // Bind events
  ui.querySelector('#root-input')?.addEventListener('input', e => {
    state.root = e.target.value.trim();
    updatePreview();
  });

  ui.querySelector('#pattern-select')?.addEventListener('change', e => {
    state.pattern = e.target.value;
    updatePreview();
  });

  ui.querySelector('#tense-select')?.addEventListener('change', e => {
    state.tense = e.target.value;
    updatePreview();
  });

  ui.querySelector('#pronoun-select')?.addEventListener('change', e => {
    state.pronoun = e.target.value;
    updatePreview();
  });

  ui.querySelector('#validate-btn')?.addEventListener('click', () => validatePhrase());
  ui.querySelector('#reset-btn')?.addEventListener('click', () => resetBuilder());

  updatePreview();
}

/**
 * Updates the live preview and validation messages.
 */
function updatePreview() {
  const arabicPreview = composeDemo(state);
  const issues = validateIssues(state);

  const issuesHTML = issues.length
    ? `<ul>${issues.map(i => `<li style="color:#b91c1c">${i}</li>`).join('')}</ul>`
    : `<div style="color:#047857">✔ لا توجد أخطاء ظاهرة.</div>`;

  setHTML('builder-preview', `
    <div><strong>المعاينة:</strong> <span>${arabicPreview}</span></div>
    <div style="margin-top:.5rem"><strong>التحقق:</strong> ${issuesHTML}</div>
  `);
}

/**
 * Resets the builder state to defaults and updates the preview.
 */
function resetBuilder() {
  state.root = '';
  state.pattern = 'I';
  state.pronoun = 'هو';
  state.tense = 'past';
  state.modifiers = [];
  updatePreview();
}

/**
 * Demo composition (placeholder for real conjugation later).
 * @param {typeof state} s
 * @returns {string}
 */
function composeDemo(s) {
  const base = s.root || '—';
  const tenseLabel = {
    past: 'فعل ماضٍ',
    present: 'فعل مضارع',
    imperative: 'فعل أمر'
  }[s.tense] || '—';

  return `${s.pronoun} — (${tenseLabel}) — ${base} — ${patternLabel(s.pattern)}`;
}

/**
 * Returns the display label for a given pattern ID.
 * @param {string} id
 * @returns {string}
 */
function patternLabel(id) {
  const found = { I: 'Form I', II: 'Form II', III: 'Form III' }[id];
  return found || id;
}

/**
 * Validates the current builder state and returns an array of issues.
 * @param {typeof state} s
 * @returns {string[]}
 */
function validateIssues(s) {
  const issues = [];
  if (!s.root) issues.push('الرجاء إدخال الجذر (مثل: ك-ت-ب).');
  if (s.tense === 'imperative' && (s.pronoun === 'أنا' || s.pronoun === 'نحن')) {
    issues.push('فعل الأمر لا يُستعمل عادة مع ضمير المتكلم (أنا/نحن).');
  }
  return issues;
}

/**
 * Validates the phrase and alerts the user with the result.
 */
function validatePhrase() {
  const issues = validateIssues(state);
  if (issues.length) {
    alert('تحقّق فشل:\n- ' + issues.join('\n- '));
  } else {
    alert('تحقّق ناجح! العبارة متوافقة مع القواعد الديمو الحالية.');
  }
}