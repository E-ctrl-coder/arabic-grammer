function showTooltip(term, x, y) {
  const data = getTooltipData(term);
  if (!data) return;

  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  tooltip.innerHTML = `<strong>${term}</strong> (${data.en})<br>${data.desc || ''}`;
  document.body.appendChild(tooltip);
  tooltip.style.display = 'block';

  setTimeout(() => tooltip.remove(), 3000);
}
