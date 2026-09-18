import { el } from './elements.js';
import { state } from '../state.js';
import { ALPHABET_SIGNS } from '../data/alphabet.js';
import { NUMBER_SIGNS } from '../data/numbers.js';
import { isLearned } from '../storage/progress.js';

const TOTAL_SIGNS = ALPHABET_SIGNS.length + NUMBER_SIGNS.length;

function learnedLabels(signs, mode) {
  return signs.filter(sign => isLearned(state.progress, mode, sign.label));
}

function buildCell(sign, index, mode) {
  const cell = document.createElement('button');
  cell.type = 'button';
  cell.className = 'specimen-cell';
  cell.dataset.index = index;
  cell.textContent = sign.label;

  const learned = isLearned(state.progress, mode, sign.label);
  if (learned) cell.classList.add('learned');
  cell.setAttribute('aria-label', learned
    ? `Practise ${sign.label}, already learned`
    : `Practise ${sign.label}`);

  return cell;
}

/** Draws the sign index and the learned count. Safe to call repeatedly. */
export function renderLanding() {
  el.specimenAlphabet.replaceChildren(
    ...ALPHABET_SIGNS.map((sign, i) => buildCell(sign, i, 'alphabet'))
  );
  el.specimenNumbers.replaceChildren(
    ...NUMBER_SIGNS.map((sign, i) => buildCell(sign, i, 'numbers'))
  );

  const learned = learnedLabels(ALPHABET_SIGNS, 'alphabet').length +
                  learnedLabels(NUMBER_SIGNS, 'numbers').length;
  el.landingCount.textContent = `${learned}/${TOTAL_SIGNS}`;
}
