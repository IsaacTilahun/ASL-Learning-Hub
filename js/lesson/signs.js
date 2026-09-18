import { state } from '../state.js';
import { ALPHABET_SIGNS } from '../data/alphabet.js';
import { NUMBER_SIGNS } from '../data/numbers.js';

export function getSigns(mode) {
  return mode === 'alphabet' ? ALPHABET_SIGNS : NUMBER_SIGNS;
}

/** The sign being practised, or null when no lesson is open. */
export function getCurrentSign() {
  if (!state.mode) return null;
  return getSigns(state.mode)[state.currentIndex] ?? null;
}
