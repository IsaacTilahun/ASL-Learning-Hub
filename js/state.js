import { loadProgress } from './storage/progress.js';

// Shared mutable app state. Modules import this object and read or update
// fields directly; there is no store abstraction.
export const state = {
  mode: null,            // 'alphabet' | 'numbers' | null when on the menu
  currentIndex: 0,
  isRecording: false,
  recordedFrames: [],
  recordingStartTime: null,
  isCameraOn: false,
  hands: null,           // MediaPipe Hands instance
  video: null,
  canvas: null,
  canvasContext: null,
  smoothedAccuracy: 0,
  progress: loadProgress()
};
