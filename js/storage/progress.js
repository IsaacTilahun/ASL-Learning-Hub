// Per-sign attempt counts persisted in localStorage, keyed as `a_<letter>` or
// `n_<number>`.
const STORAGE_KEY = 'aslProgress';

function progressKey(mode, label) {
  return `${mode === 'alphabet' ? 'a' : 'n'}_${label}`;
}

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function recordAttempt(progress, mode, label, passed) {
  const key = progressKey(mode, label);
  const entry = progress[key] || (progress[key] = { attempts: 0, correct: 0 });
  entry.attempts++;
  if (passed) entry.correct++;
  saveProgress(progress);
}

export function isLearned(progress, mode, label) {
  return (progress[progressKey(mode, label)]?.correct ?? 0) > 0;
}
