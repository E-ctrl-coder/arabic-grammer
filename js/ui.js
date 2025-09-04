// ui.js — tooltip rendering and helpers (hover/tap)

import { getTooltipData } from './glossary.js';

const tooltipEl = document.getElementById('tooltip');
let hideTimer = null;

export function bindTermTooltips(root = document) {
  const terms = root.querySelectorAll('.term[data-term]');
  terms.forEach(el => {
    el.addEventListener('mouseenter', e => showTooltip(e.currentTarget));
    el.addEventListener('focus', e => showTooltip(e.currentTarget));
    el.addEventListener('mouseleave', hideTooltipSoon);
    el.addEventListener('blur', hideTooltip);
    el.addEventListener('click', e => toggleTooltip(e.currentTarget));
    el.addEventListener('touchstart', e => {
      e.preventDefault();
      toggleTooltip(e.currentTarget);
    }, { passive: false });
  });
}

function showTooltip(target) {
  const term = target.getAttribute('data-term');
  const data = getTooltipData(term);
  if (!data) return;

  tooltipEl.innerHTML = `<strong>${term}</strong> (${data.en})<br>${data.desc || ''}`;
  tooltipEl.style.display = 'block';
  tooltipEl.setAttribute('aria-hidden', 'false');

  const rect = target.getBoundingClientRect();
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

  const top = window.scrollY + rect.top - tooltipEl.offsetHeight - 8;
  let left = window.scrollX + rect.left + (rect.width / 2) - (tooltipEl.offsetWidth / 2);

  // Keep within viewport
  if (left < 8) left = 8;
  if (left + tooltipEl.offsetWidth > vw - 8) left = vw - tooltipEl.offsetWidth - 8;

  tooltipEl.style.top = `${Math.max(8, top)}px`;
  tooltipEl.style.left = `${left}px`;
}

function hideTooltip() {
  tooltipEl.style.display = 'none';
  tooltipEl.setAttribute('aria-hidden', 'true');
}

function hideTooltipSoon() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hideTooltip, 160);
}

function toggleTooltip(target) {
  if (tooltipEl.style.display === 'block') {
    hideTooltip();
  } else {
    showTooltip(target);
  }
}

export function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

export function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}
