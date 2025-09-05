// ui.js — tooltip rendering and helpers (hover/tap)
import { getTooltipData } from './glossary.js';

let tooltipEl = null;
let hideTimer = null;

/**
 * Binds tooltip behaviour to all .term[data-term] elements within a given root.
 * Supports mouse, keyboard focus, click, and touch interactions.
 * @param {ParentNode} root - The DOM node to search within (defaults to document).
 */
export function bindTermTooltips(root = document) {
  tooltipEl = document.getElementById('tooltip');
  if (!tooltipEl) {
    console.warn('Tooltip element #tooltip not found in DOM');
    return;
  }

  const terms = root.querySelectorAll('.term[data-term]');
  terms.forEach(el => {
    el.addEventListener('mouseenter', e => showTooltip(e.currentTarget));
    el.addEventListener('focus', e => showTooltip(e.currentTarget));
    el.addEventListener('mouseleave', hideTooltipSoon);
    el.addEventListener('blur', hideTooltip);
    el.addEventListener('click', e => toggleTooltip(e.currentTarget));
    el.addEventListener(
      'touchstart',
      e => {
        e.preventDefault(); // Prevents simulated mouse events
        toggleTooltip(e.currentTarget);
      },
      { passive: false }
    );
  });
}

/**
 * Shows the tooltip for a given target element.
 * Positions it above the element and clamps it within the viewport.
 * @param {HTMLElement} target
 */
function showTooltip(target) {
  const term = target.getAttribute('data-term');
  const data = getTooltipData(term);
  if (!data || !tooltipEl) return;

  tooltipEl.innerHTML = `<strong>${term}</strong> (${data.en})<br>${data.desc || ''}`;
  tooltipEl.style.display = 'block';
  tooltipEl.setAttribute('aria-hidden', 'false');

  // Force reflow so offsetWidth/Height are correct
  void tooltipEl.offsetWidth;

  const rect = target.getBoundingClientRect();
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

  const top = window.scrollY + rect.top - tooltipEl.offsetHeight - 8;
  let left = window.scrollX + rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2;

  // Keep within viewport horizontally
  if (left < 8) left = 8;
  if (left + tooltipEl.offsetWidth > vw - 8) {
    left = vw - tooltipEl.offsetWidth - 8;
  }

  tooltipEl.style.top = `${Math.max(8, top)}px`;
  tooltipEl.style.left = `${left}px`;
}

/**
 * Hides the tooltip immediately.
 */
function hideTooltip() {
  if (!tooltipEl) return;
  tooltipEl.style.display = 'none';
  tooltipEl.setAttribute('aria-hidden', 'true');
}

/**
 * Hides the tooltip after a short delay (for smoother mouseout).
 */
function hideTooltipSoon() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hideTooltip, 160);
}

/**
 * Toggles the tooltip for a given target element.
 * @param {HTMLElement} target
 */
function toggleTooltip(target) {
  if (!tooltipEl) return;
  if (tooltipEl.style.display === 'block') {
    hideTooltip();
  } else {
    showTooltip(target);
  }
}

/**
 * Sets the textContent of an element by ID.
 * @param {string} id
 * @param {string} text
 */
export function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/**
 * Sets the innerHTML of an element by ID.
 * @param {string} id
 * @param {string} html
 */
export function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}