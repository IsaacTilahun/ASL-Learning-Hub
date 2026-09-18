import { el } from './elements.js';
import { LIVE_METER } from '../config.js';

const FEEDBACK_VARIANTS = ['feedback-success', 'feedback-error', 'feedback-warning'];

/**
 * @param {string} html - Message markup.
 * @param {'success'|'error'|'warning'|null} variant
 */
export function setFeedback(html, variant = null) {
  el.feedbackBox.innerHTML = html;
  el.feedbackBox.classList.remove(...FEEDBACK_VARIANTS);
  if (variant) el.feedbackBox.classList.add(`feedback-${variant}`);
}

export function setStatus(text, variant) {
  el.statusIndicator.textContent = text;
  el.statusIndicator.className = `status ${variant}`;
}

function meterVariant(value) {
  if (value >= LIVE_METER.goodThreshold) return 'good';
  if (value >= LIVE_METER.fairThreshold) return 'fair';
  return 'poor';
}

/**
 * Render the confidence meter.
 * @param {number} value - Percentage 0-100.
 * @param {boolean} scored - True when the value grades the current sign, false
 *   when it is raw detection confidence and should stay visually neutral.
 */
export function setConfidence(value, scored = true) {
  const percent = Math.round(value);
  el.confidenceFill.style.width = `${percent}%`;
  el.confidenceValue.textContent = `${percent}%`;
  el.confidenceFill.className = 'confidence-fill';
  if (scored) el.confidenceFill.classList.add(meterVariant(percent));
}
