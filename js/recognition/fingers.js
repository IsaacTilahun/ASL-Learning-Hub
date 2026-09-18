import { EXTENSION_RATIO, THUMB_SPREAD, SCORING } from '../config.js';

const LANDMARK_COUNT = 21;

// MediaPipe hand landmark indices: tip and knuckle for each finger.
const WRIST = 0;
const MIDDLE_KNUCKLE = 9;
const FINGER_LANDMARKS = [
  { tip: 4, knuckle: 2 },   // thumb
  { tip: 8, knuckle: 5 },   // index
  { tip: 12, knuckle: 9 },  // middle
  { tip: 16, knuckle: 13 }, // ring
  { tip: 20, knuckle: 17 }  // pinky
];

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// A finger reads as extended when its tip is meaningfully farther from the wrist
// than its own knuckle is.
function isExtended(tip, knuckle, wrist) {
  return distance(tip, wrist) > distance(knuckle, wrist) * EXTENSION_RATIO;
}

// The thumb folds sideways rather than outward, so spread from the palm centre
// counts as extended too.
function isThumbExtended(landmarks) {
  const wrist = landmarks[WRIST];
  const { tip, knuckle } = FINGER_LANDMARKS[0];
  const palmCenterX = (wrist.x + landmarks[MIDDLE_KNUCKLE].x) / 2;
  return (
    Math.abs(landmarks[tip].x - palmCenterX) > THUMB_SPREAD ||
    isExtended(landmarks[tip], landmarks[knuckle], wrist)
  );
}

/**
 * Finger extension for one frame of landmarks.
 * @param {Array} landmarks - 21 MediaPipe hand landmarks.
 * @returns {boolean[]|null} One flag per finger, or null if the frame is unusable.
 */
export function getFrameFingerStates(landmarks) {
  if (!landmarks || landmarks.length < LANDMARK_COUNT) return null;

  const wrist = landmarks[WRIST];
  return FINGER_LANDMARKS.map(({ tip, knuckle }, index) =>
    index === 0
      ? isThumbExtended(landmarks)
      : isExtended(landmarks[tip], landmarks[knuckle], wrist)
  );
}

/**
 * Collapse a recording into one steady reading by voting across its last frames.
 * @param {Array<Array>} frames - Landmark frames captured while recording.
 * @returns {{states: boolean[], confidence: number[], frameCount: number}|null}
 */
export function aggregateFingerStates(frames) {
  if (!frames?.length) return null;

  const sample = frames.slice(-SCORING.framesToAnalyze);
  const extendedCounts = [0, 0, 0, 0, 0];
  let validFrames = 0;

  for (const frame of sample) {
    const states = getFrameFingerStates(frame);
    if (!states) continue;
    validFrames++;
    states.forEach((extended, i) => { if (extended) extendedCounts[i]++; });
  }

  if (validFrames < SCORING.minValidFrames) return null;

  const threshold = validFrames * SCORING.extendedFrameRatio;
  return {
    states: extendedCounts.map(count => count > threshold),
    confidence: extendedCounts.map(count => Math.round((count / validFrames) * 100)),
    frameCount: validFrames
  };
}
