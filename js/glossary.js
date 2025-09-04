let glossary = {};

async function loadGlossary() {
  const res = await fetch('data/glossary.json');
  glossary = await res.json();
}

function getTooltipData(term) {
  return glossary[term] || null;
}
