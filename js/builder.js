function initGrammarBuilder() {
  const container = document.getElementById('builder-ui');
  container.innerHTML = `
    <label>الجذر:</label><input type="text" id="root-input"><br>
    <label>الزمن:</label>
    <select id="tense-select">
      <option value="past">ماضٍ</option>
      <option value="present">مضارع</option>
    </select>
    <br>
    <button id="validate-btn">تحقق</button>
  `;

  document.getElementById('validate-btn').addEventListener('click', () => {
    alert('Validation logic will go here.');
  });
}
