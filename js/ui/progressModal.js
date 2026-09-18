import { el } from './elements.js';
import { state } from '../state.js';
import { ALPHABET_SIGNS } from '../data/alphabet.js';
import { NUMBER_SIGNS } from '../data/numbers.js';
import { isLearned } from '../storage/progress.js';
import { getEncouragement } from '../services/encouragement.js';

const ACHIEVEMENTS = [
  { metric: 'alphabet', at: 1, text: '🌟 First Letter — Learned your first letter!' },
  { metric: 'alphabet', at: 5, text: '📝 Getting Started — Learned 5 letters' },
  { metric: 'alphabet', at: 10, text: '📚 Alphabet Learner — Learned 10 letters' },
  { metric: 'alphabet', at: 20, text: '🎓 Almost There — Learned 20 letters' },
  { metric: 'alphabet', at: 26, text: '🏆 Alphabet Master — Completed all 26 letters!' },
  { metric: 'numbers', at: 1, text: '1️⃣ First Number — Learned your first number!' },
  { metric: 'numbers', at: 5, text: '🔢 Halfway Numbers — Learned 5 numbers' },
  { metric: 'numbers', at: 10, text: '🏆 Number Master — Completed all 10 numbers!' },
  { metric: 'total', at: 36, text: '👑 ASL Champion — Mastered everything!' }
];

function learnedLabels(signs, mode) {
  return signs.filter(sign => isLearned(state.progress, mode, sign.label)).map(sign => sign.label);
}

function renderCount(percentEl, detailsEl, learned, total) {
  const ratio = learned.length / total;
  percentEl.textContent = `${Math.round(ratio * 100)}%`;
  // Fills the ring drawn in css/components.css.
  percentEl.parentElement.style.setProperty('--progress-angle', `${ratio * 360}deg`);

  if (learned.length === 0) {
    detailsEl.textContent = `0/${total} learned`;
    return;
  }
  detailsEl.innerHTML =
    `<strong>${learned.length}/${total} learned</strong>` +
    `<span class="completed-list">Completed: ${learned.join(', ')}</span>`;
}

function renderAchievements(counts) {
  const unlocked = ACHIEVEMENTS.filter(({ metric, at }) => counts[metric] >= at);

  el.achievementsList.innerHTML = unlocked.length
    ? unlocked.map(({ text }) => `<div class="achievement unlocked">${text}</div>`).join('')
    : '<p class="achievements-empty">Complete signs to earn achievements!</p>';
}

export async function renderProgress() {
  const letters = learnedLabels(ALPHABET_SIGNS, 'alphabet');
  const numbers = learnedLabels(NUMBER_SIGNS, 'numbers');

  renderCount(el.alphabetPercent, el.alphabetDetails, letters, ALPHABET_SIGNS.length);
  renderCount(el.numbersPercent, el.numbersDetails, numbers, NUMBER_SIGNS.length);
  renderAchievements({
    alphabet: letters.length,
    numbers: numbers.length,
    total: letters.length + numbers.length
  });

  el.progressMessage.textContent = await getEncouragement(letters.length, numbers.length);
}
