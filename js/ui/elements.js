// Single lookup of every element the app touches. Module scripts run after the
// document is parsed, so these are safe to resolve at import time.
const byId = id => document.getElementById(id);

export const el = {
  modeSelection: byId('modeSelection'),
  learningInterface: byId('learningInterface'),

  landingCount: byId('landingCount'),
  specimenAlphabet: byId('specimenAlphabet'),
  specimenNumbers: byId('specimenNumbers'),

  video: byId('webcam'),
  canvas: byId('handCanvas'),
  statusIndicator: byId('statusIndicator'),
  toggleCameraBtn: byId('toggleCamera'),
  recordBtn: byId('recordGesture'),

  lessonTitle: byId('lessonTitle'),
  lessonCounter: byId('lessonCounter'),
  signImage: byId('signImage'),
  signDescription: byId('signDescription'),
  feedbackBox: byId('feedbackBox'),
  confidenceFill: byId('confidenceFill'),
  confidenceValue: byId('confidenceValue'),
  nextBtn: byId('nextBtn'),
  submitBtn: byId('submitBtn'),
  lessonProgress: byId('lessonProgress'),
  backBtn: byId('backBtn'),

  progressModal: byId('progressModal'),
  progressMessage: byId('progressMessage'),
  alphabetPercent: byId('alphabetPercent'),
  alphabetDetails: byId('alphabetDetails'),
  numbersPercent: byId('numbersPercent'),
  numbersDetails: byId('numbersDetails'),
  achievementsList: byId('achievementsList'),

  aboutModal: byId('aboutModal'),
  celebration: byId('celebration')
};
