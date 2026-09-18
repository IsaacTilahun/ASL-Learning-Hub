// Tunable values for hand tracking, scoring and the optional encouragement API.

export const MEDIAPIPE_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands';

export const CAMERA_CONSTRAINTS = {
  video: { width: { ideal: 1280 }, height: { ideal: 720 } }
};

export const HANDS_OPTIONS = {
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.25,
  minTrackingConfidence: 0.25
};

// A fingertip counts as extended once it sits this much farther from the wrist
// than its own knuckle.
export const EXTENSION_RATIO = 1.1;

// Minimum horizontal gap between thumb tip and palm centre to call the thumb out.
export const THUMB_SPREAD = 0.1;

export const SCORING = {
  // Frames sampled from the end of a recording, and how many must be usable.
  framesToAnalyze: 15,
  minValidFrames: 3,
  // Share of sampled frames that must show a finger extended to count it as up.
  extendedFrameRatio: 0.4,
  // Score needed to mark a sign as learned.
  passMark: 50
};

export const LIVE_METER = {
  // Exponential moving average weight: higher reacts faster, lower is steadier.
  smoothing: 0.12,
  // Per-frame decay applied to the meter once hands leave the frame.
  decay: 0.85,
  goodThreshold: 60,
  fairThreshold: 40
};

// Optional LLM-written progress message. Never commit a key here — a static site
// ships its source to every visitor, so anything in this file is public.
// Set one at runtime instead: localStorage.setItem('encouragementApiKey', '...')
export const ENCOURAGEMENT_API = {
  endpoint: 'https://api.deepinfra.com/v1/openai/chat/completions',
  model: 'deepseek-ai/deepseek-chat',
  maxTokens: 100,
  apiKeyStorageKey: 'encouragementApiKey'
};
