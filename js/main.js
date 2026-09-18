// Entry point: binds the DOM to the lesson, tracking and progress modules.
import { state } from './state.js';
import { el } from './ui/elements.js';
import { startCamera, stopCamera } from './tracking/camera.js';
import { handleHandResults } from './tracking/handResults.js';
import { setStatus } from './ui/feedback.js';
import { openModal, bindModalDismiss } from './ui/modal.js';
import { renderProgress } from './ui/progressModal.js';
import { renderLanding } from './ui/landing.js';
import {
  startLesson,
  exitLesson,
  nextSign,
  submitGesture,
  toggleRecording
} from './lesson/lessonController.js';

function setCameraOffUi() {
  el.toggleCameraBtn.textContent = '📷 Start Camera';
  el.recordBtn.disabled = true;
  setStatus('Listening...', 'listening');
}

async function handleCameraToggle() {
  if (state.isCameraOn) {
    stopCamera();
    setCameraOffUi();
    return;
  }

  el.toggleCameraBtn.disabled = true;
  try {
    await startCamera(handleHandResults);
    el.toggleCameraBtn.textContent = '📷 Camera On';
    el.recordBtn.disabled = false;
  } catch (error) {
    setStatus('Camera unavailable', 'error');
    alert(`Camera error: ${error.message}`);
  } finally {
    el.toggleCameraBtn.disabled = false;
  }
}

async function showProgress() {
  openModal(el.progressModal);
  await renderProgress();
}

function bindEvents() {
  el.modeSelection.querySelectorAll('.mode-btn[data-mode]').forEach(button => {
    button.addEventListener('click', () => startLesson(button.dataset.mode));
  });

  // The sign index is rebuilt on every render, so delegate from the grids.
  [el.specimenAlphabet, el.specimenNumbers].forEach(grid => {
    grid.addEventListener('click', event => {
      const cell = event.target.closest('.specimen-cell');
      if (cell) startLesson(grid.dataset.set, Number(cell.dataset.index));
    });
  });
  el.modeSelection.querySelector('[data-action="progress"]')
    .addEventListener('click', showProgress);
  el.modeSelection.querySelector('[data-action="about"]')
    .addEventListener('click', () => openModal(el.aboutModal));

  el.toggleCameraBtn.addEventListener('click', handleCameraToggle);
  el.recordBtn.addEventListener('click', toggleRecording);
  el.submitBtn.addEventListener('click', submitGesture);
  el.nextBtn.addEventListener('click', nextSign);
  el.backBtn.addEventListener('click', exitLesson);

  bindModalDismiss(el.progressModal);
  bindModalDismiss(el.aboutModal);
}

state.video = el.video;
state.canvas = el.canvas;
state.canvasContext = el.canvas.getContext('2d');
bindEvents();
renderLanding();
