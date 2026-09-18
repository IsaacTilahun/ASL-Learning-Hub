import { state } from '../state.js';
import { CAMERA_CONSTRAINTS, HANDS_OPTIONS, MEDIAPIPE_CDN } from '../config.js';

let frameInFlight = false;

async function waitForVideoReady(video) {
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) return;
  await new Promise(resolve => {
    video.addEventListener('loadedmetadata', resolve, { once: true });
  });
}

// Feeds frames to MediaPipe one at a time; queuing more would drop frames and
// grow latency.
function pumpFrames() {
  if (!state.isCameraOn) return;

  const ready = state.video.readyState === state.video.HAVE_ENOUGH_DATA;
  if (!frameInFlight && ready && state.hands) {
    frameInFlight = true;
    state.hands.send({ image: state.video }).finally(() => {
      frameInFlight = false;
      requestAnimationFrame(pumpFrames);
    });
    return;
  }
  requestAnimationFrame(pumpFrames);
}

/**
 * Open the webcam and start hand tracking.
 * @param {(results: object) => void} onResults - Called for every tracked frame.
 * @throws {Error} If camera access is denied or unavailable.
 */
export async function startCamera(onResults) {
  const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
  state.video.srcObject = stream;

  await waitForVideoReady(state.video);
  await state.video.play();

  // Match the overlay to the incoming frame size so landmarks line up.
  state.canvas.width = state.video.videoWidth;
  state.canvas.height = state.video.videoHeight;

  // MediaPipe's hands bundle is loaded from the CDN in index.html.
  state.hands = new window.Hands({ locateFile: file => `${MEDIAPIPE_CDN}/${file}` });
  state.hands.setOptions(HANDS_OPTIONS);
  state.hands.onResults(onResults);

  state.isCameraOn = true;
  pumpFrames();
}

export function stopCamera() {
  state.video.srcObject?.getTracks().forEach(track => track.stop());
  state.video.srcObject = null;
  state.isCameraOn = false;
}
