import { state } from '../state.js';
import { LIVE_METER } from '../config.js';
import { clearOverlay, drawHand } from './overlay.js';
import { setConfidence, setFeedback, setStatus } from '../ui/feedback.js';
import { scoreLiveFrame } from '../recognition/scoring.js';
import { getCurrentSign } from '../lesson/signs.js';

// How often the recording counter refreshes, in frames.
const FRAME_REPORT_INTERVAL = 10;

// Exponential moving average keeps the meter from flickering frame to frame.
function smoothAccuracy(target) {
  const { smoothing } = LIVE_METER;
  state.smoothedAccuracy = state.smoothedAccuracy * (1 - smoothing) + target * smoothing;
  return state.smoothedAccuracy;
}

function onHandsLost() {
  setStatus('No hands detected', 'error');
  state.smoothedAccuracy *= LIVE_METER.decay;
  setConfidence(state.smoothedAccuracy, false);
}

/** MediaPipe results callback: draws the overlay, grades the frame and records. */
export function handleHandResults(results) {
  clearOverlay(state.canvasContext, state.canvas);

  const hands = results.multiHandLandmarks;
  if (!hands?.length) {
    onHandsLost();
    return;
  }

  for (const landmarks of hands) {
    drawHand(state.canvasContext, state.canvas, landmarks);
  }
  setStatus('Hands Detected ✓', 'success');

  // In a lesson the meter grades the attempt; on the menu it mirrors MediaPipe's
  // own detection confidence.
  const primaryHand = hands[0];
  const sign = getCurrentSign();
  if (sign) {
    setConfidence(smoothAccuracy(scoreLiveFrame(primaryHand, sign.label)));
  } else {
    setConfidence((results.multiHandedness?.[0]?.score || 0) * 100, false);
  }

  if (state.isRecording) {
    state.recordedFrames.push(primaryHand);
    if (state.recordedFrames.length % FRAME_REPORT_INTERVAL === 0) {
      setFeedback(`🎥 Recording... ${state.recordedFrames.length} frames`, 'warning');
    }
  }
}
