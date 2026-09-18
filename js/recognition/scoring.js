import { SIGN_PATTERNS } from '../data/signPatterns.js';
import { getFrameFingerStates, aggregateFingerStates } from './fingers.js';

// Returned when a sign has no pattern to compare against, so an unmapped sign
// neither rewards nor punishes the learner.
const NEUTRAL_SCORE = 50;

// Rewards partial matches so early attempts stay encouraging rather than
// collapsing to near zero.
function applyCurve(matchRatio) {
  const base = matchRatio * 100;
  if (base >= 60) return base;                 // already generous enough
  if (base >= 40) return 45 + (base - 40) * 0.7;
  return 25 + base * 0.5;
}

function comparePattern(fingerStates, pattern) {
  let matches = 0;
  let checks = 0;

  pattern.forEach((expected, i) => {
    if (expected === null) return;
    checks++;
    if (fingerStates[i] === (expected === 1)) matches++;
  });

  return { matches, checks };
}

/**
 * Score finger states against a sign's expected pattern.
 * @param {boolean[]} fingerStates - One flag per finger.
 * @param {string} label - Sign being attempted, e.g. 'A' or '5'.
 * @returns {number} Score from 0-100.
 */
function scoreFingerStates(fingerStates, label) {
  const pattern = SIGN_PATTERNS[label];
  if (!pattern || !fingerStates) return pattern ? 0 : NEUTRAL_SCORE;

  const { matches, checks } = comparePattern(fingerStates, pattern);
  if (checks === 0) return NEUTRAL_SCORE;

  return Math.round(applyCurve(matches / checks));
}

/**
 * Score a single live frame, for the confidence meter.
 * @returns {number} Score from 0-100, or 0 when the frame is unusable.
 */
export function scoreLiveFrame(landmarks, label) {
  const states = getFrameFingerStates(landmarks);
  return states ? scoreFingerStates(states, label) : 0;
}

/**
 * Score a completed recording.
 * @returns {number} Score from 0-100, or 0 if too few frames were usable.
 */
export function scoreRecording(frames, label) {
  const reading = aggregateFingerStates(frames);
  return reading ? scoreFingerStates(reading.states, label) : 0;
}
