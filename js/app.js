document.addEventListener('DOMContentLoaded', async () => {
  await loadGlossary();
  initGrammarBuilder();

  document.getElementById('analyse-btn').addEventListener('click', () => {
    const input = document.getElementById('user-input').value.trim();
    if (!input) return;

    const type = /[a-zA-Z]/.test(input) ? 'english' : 'arabic';
    let arabicInput = input;

    if (type === 'english') {
      // Placeholder translation
      arabicInput = 'كتب';
    }

    // Placeholder analysis
    const result = {
      translation: arabicInput === 'كتب' ? 'wrote' : 'translation',
      morphology: { pattern: 'فعل ماضٍ', root: 'ك-ت-ب', type: 'verb' },
      grammarType: 'past tense verb'
    };

    document.getElementById('translation').textContent = `Translation: ${result.translation}`;
    document.getElementById('morphology').textContent = `Pattern: ${result.morphology.pattern}`;
    document.getElementById('grammar-type').textContent = `Type: ${result.grammarType}`;
  });
});
