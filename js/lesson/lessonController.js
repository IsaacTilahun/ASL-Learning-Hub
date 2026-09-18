import { state } from '../state.js';
import { el } from '../ui/elements.js';
import { SCORING } from '../config.js';
import { getSigns } from './signs.js';
import { getSignEmoji } from '../data/signEmoji.js';
import { scoreRecording } from '../recognition/scoring.js';
import { recordAttempt } from '../storage/progress.js';
import { setFeedback } from '../ui/feedback.js';
import { celebrate } from '../ui/celebration.js';
import { stopCamera } from '../tracking/camera.js';
import { renderLanding } from '../ui/landing.js';

const RECORD_LABEL = '⏺️ Record Gesture';

// Reference photo with an emoji fallback, since images/ may be incomplete.
function renderSignImage(label) {
  const image = document.createElement('img');
  image.src = `images/${label}.png`;
  image.alt = `ASL sign for ${label}`;
  image.addEventListener('error', () => {
    el.signImage.innerHTML = `<span class="sign-emoji">${getSignEmoji(label)}</span>`;
  }, { once: true });

  el.signImage.replaceChildren(image);
}

function resetRecordingUi() {
  state.recordedFrames = [];
  state.isRecording = false;
  el.recordBtn.textContent = RECORD_LABEL;
  el.recordBtn.classList.remove('recording');
  el.submitBtn.disabled = true;
}

function updateProgressBar(total) {
  el.lessonProgress.style.width = `${((state.currentIndex + 1) / total) * 100}%`;
}

function loadSign() {
  const signs = getSigns(state.mode);
  const sign = signs[state.currentIndex];

  el.lessonTitle.textContent = `Learning: ${sign.label}`;
  el.lessonCounter.textContent = `${state.currentIndex + 1}/${signs.length}`;
  renderSignImage(sign.label);
  el.signDescription.innerHTML =
    `<p><strong>${sign.description}</strong></p>` +
    `<ul>${sign.hints.map(hint => `<li>✓ ${hint}</li>`).join('')}</ul>`;

  setFeedback('Make the sign to get feedback');
  resetRecordingUi();
  updateProgressBar(signs.length);
}

export function startLesson(mode, startIndex = 0) {
  const lastIndex = getSigns(mode).length - 1;

  state.mode = mode;
  state.currentIndex = Math.min(Math.max(startIndex, 0), lastIndex);
  state.smoothedAccuracy = 0;

  el.modeSelection.classList.add('hidden');
  el.learningInterface.classList.remove('hidden');
  loadSign();
}

export function exitLesson() {
  stopCamera();
  el.toggleCameraBtn.textContent = '📷 Start Camera';
  el.recordBtn.disabled = true;
  el.learningInterface.classList.add('hidden');
  el.modeSelection.classList.remove('hidden');
  state.mode = null;

  // Signs cleared during the lesson should show as cleared on the menu.
  renderLanding();
}

export function nextSign() {
  const signs = getSigns(state.mode);
  if (state.currentIndex + 1 < signs.length) {
    state.currentIndex++;
    loadSign();
    return;
  }

  const unit = state.mode === 'alphabet' ? 'letters' : 'numbers';
  alert(`🏆 Lesson Complete! You practised all ${signs.length} ${unit}!`);
  exitLesson();
}

export function toggleRecording() {
  if (!state.isRecording) {
    state.isRecording = true;
    state.recordedFrames = [];
    el.recordBtn.textContent = '⏹️ Stop Recording';
    el.recordBtn.classList.add('recording');
    setFeedback('🎥 Recording... Show your sign now!', 'warning');
    return;
  }

  state.isRecording = false;
  el.recordBtn.textContent = RECORD_LABEL;
  el.recordBtn.classList.remove('recording');

  const frameCount = state.recordedFrames.length;
  if (frameCount > 0) {
    setFeedback(`✅ Captured ${frameCount} frames<br>Click Submit to check accuracy`, 'success');
  } else {
    setFeedback('❌ No frames recorded! Keep your hand in frame.', 'error');
  }
  el.submitBtn.disabled = frameCount === 0;
}

export function submitGesture() {
  const signs = getSigns(state.mode);
  const { label } = signs[state.currentIndex];

  const score = scoreRecording(state.recordedFrames, label);
  const passed = score >= SCORING.passMark;
  recordAttempt(state.progress, state.mode, label, passed);

  if (passed) {
    setFeedback(`🎉 Correct! ${score}%<br>Great job on ${label}!`, 'success');
    celebrate();
  } else {
    setFeedback(`😊 Try again! ${score}%<br>Check the target image and match the hand position.`, 'error');
  }
  el.submitBtn.disabled = true;
}
