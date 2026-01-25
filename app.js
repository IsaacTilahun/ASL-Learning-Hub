// ASL Learning Hub - Complete Application
// Global State Object
const STATE = {
  currentMode: null,
  currentIndex: 0,
  isRecording: false,
  recordedFrames: [],
  recordingStartTime: null,
  camera: null,
  hands: null,
  videoElement: null,
  canvasElement: null,
  canvasContext: null,
  frameCounter: 0,
  userProgress: loadProgress(),
  // Smoothing for live accuracy display
  smoothedAccuracy: 0,
  lastAccuracyUpdate: 0
};

// ASL Alphabet Database
const ASL_ALPHABET = [
  { letter: 'A', description: 'Make a fist with thumb pointing to the side', hints: ['Form tight fist', 'Thumb on side', 'Hold steady'] },
  { letter: 'B', description: 'Open hand with fingers together', hints: ['Straight fingers', 'Palm out', 'Thumb inside'] },
  { letter: 'C', description: 'Curve fingers like C shape', hints: ['Curve position', 'Thumb relaxed', 'Show clearly'] },
  { letter: 'D', description: 'Index finger up, others curled', hints: ['Point up', 'Curl others', 'Thumb touches'] },
  { letter: 'E', description: 'All fingers curved', hints: ['Gentle curve', 'Face level', 'Relaxed'] },
  { letter: 'F', description: 'Thumb and index circle', hints: ['Circle tight', 'Fingers up', 'Keep steady'] },
  { letter: 'G', description: 'Index and middle sideways', hints: ['Point side', 'Others down', 'Keep still'] },
  { letter: 'H', description: 'Two fingers sideways', hints: ['Both side', 'Others down', 'Similar to G'] },
  { letter: 'I', description: 'Pinky pointing up', hints: ['Pinky up', 'Curl others', 'Keep vertical'] },
  { letter: 'J', description: 'Pinky up then hook down', hints: ['Start up', 'Hook motion', 'Show J shape'] },
  { letter: 'K', description: 'Make V with index and middle', hints: ['V shape', 'Others down', 'Thumb up'] },
  { letter: 'L', description: 'Thumb and index L shape', hints: ['Thumb up', 'Index side', 'Others curled'] },
  { letter: 'M', description: 'Three fingers down', hints: ['Three down', 'Thumb out', 'Hold straight'] },
  { letter: 'N', description: 'Two fingers down', hints: ['Two down', 'Thumb out', 'Like M'] },
  { letter: 'O', description: 'Circle with all fingers', hints: ['All together', 'Circle tight', 'In front'] },
  { letter: 'P', description: 'Like K but hand down', hints: ['V shape', 'Hand down', 'Others curled'] },
  { letter: 'Q', description: 'P with downward motion', hints: ['P shape', 'Move down', 'Show motion'] },
  { letter: 'R', description: 'Index and middle crossed', hints: ['Cross them', 'Others curled', 'Palm out'] },
  { letter: 'S', description: 'Fist like A', hints: ['Tight fist', 'Thumb out', 'Hold steady'] },
  { letter: 'T', description: 'T shape with thumb', hints: ['Thumb between', 'Make T', 'Keep still'] },
  { letter: 'U', description: 'Two fingers up together', hints: ['Two up', 'Others curled', 'Palm in'] },
  { letter: 'V', description: 'V shape with fingers', hints: ['Make V', 'Others curled', 'Palm out'] },
  { letter: 'W', description: 'Three fingers pointing up', hints: ['Three up', 'Ring middle', 'Together'] },
  { letter: 'X', description: 'Cross index fingers', hints: ['Cross them', 'Others curled', 'Tight'] },
  { letter: 'Y', description: 'Thumb and pinky extended', hints: ['Thumb pinky', 'Others curled', 'Show Y'] },
  { letter: 'Z', description: 'Z motion with index', hints: ['Trace Z', 'Index finger', 'Clear motion'] }
];

// ASL Numbers Database
const ASL_NUMBERS = [
  { number: '1', description: 'Point with index finger', hints: ['One up', 'Others curled', 'Palm out'] },
  { number: '2', description: 'Two fingers in V', hints: ['V shape', 'Others curled', 'Palm out'] },
  { number: '3', description: 'Three fingers up', hints: ['Three up', 'Thumb curled', 'Palm out'] },
  { number: '4', description: 'Four fingers up', hints: ['Four extended', 'Thumb curled', 'Palm out'] },
  { number: '5', description: 'All five fingers', hints: ['All open', 'Palm out', 'Wide open'] },
  { number: '6', description: 'Thumb and fingers', hints: ['Thumb out', 'Others up', 'Make 6'] },
  { number: '7', description: 'Seven position', hints: ['Seven config', 'Thumb position', 'Clear 7'] },
  { number: '8', description: 'Eight position', hints: ['Eight config', 'Hold position', 'Clear 8'] },
  { number: '9', description: 'Nine position', hints: ['Nine config', 'Thumb pointing', 'Clear 9'] },
  { number: '10', description: 'Ten position', hints: ['One or two hands', 'Show clearly', 'Hold steady'] }
];

// Hand Connections for Drawing
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20]
];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 ASL App Loading...');
  STATE.videoElement = document.getElementById('webcam');
  STATE.canvasElement = document.getElementById('handCanvas');
  STATE.canvasContext = STATE.canvasElement.getContext('2d');
  
  setupEventListeners();
  updateProgressDisplay();
});

// Setup Event Listeners
function setupEventListeners() {
  const cameraBtn = document.getElementById('toggleCamera');
  const recordBtn = document.getElementById('recordGesture');
  // NOTE: submitBtn and nextBtn already have onclick handlers in HTML
  // Do NOT add duplicate event listeners here or the functions will run twice!

  if (cameraBtn) cameraBtn.addEventListener('click', toggleCamera);
  if (recordBtn) recordBtn.addEventListener('click', recordGesture);
  // Removed: submitBtn and nextBtn listeners - they use onclick in HTML
}

// Start or Stop Camera
async function toggleCamera() {
  if (STATE.camera) {
    stopCamera();
  } else {
    await startCamera();
  }
}

async function startCamera() {
  try {
    console.log('📹 Starting camera...');
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 } }
    });

    STATE.videoElement.srcObject = stream;
    console.log('✓ Camera stream obtained');

    await new Promise(resolve => {
      STATE.videoElement.onloadedmetadata = () => {
        STATE.videoElement.play();
        // Set canvas dimensions to match video
        STATE.canvasElement.width = STATE.videoElement.videoWidth;
        STATE.canvasElement.height = STATE.videoElement.videoHeight;
        console.log(`✓ Canvas set to ${STATE.canvasElement.width}x${STATE.canvasElement.height}`);
        resolve();
      };
    });

    console.log('✓ Video playing');

    // Initialize MediaPipe
    STATE.hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    STATE.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.25,
      minTrackingConfidence: 0.25
    });

    STATE.hands.onResults(handleHandsResults);
    console.log('✓ MediaPipe initialized');

    STATE.camera = true;
    document.getElementById('toggleCamera').textContent = '📷 Camera On';
    document.getElementById('recordGesture').disabled = false;

    processFrame();
    console.log('✅ Camera ready');
  } catch (error) {
    console.error('❌ Camera error:', error);
    alert('Camera error: ' + error.message);
  }
}

function stopCamera() {
  if (STATE.videoElement.srcObject) {
    STATE.videoElement.srcObject.getTracks().forEach(t => t.stop());
    STATE.videoElement.srcObject = null;
  }
  STATE.camera = false;
  document.getElementById('toggleCamera').textContent = '📷 Start Camera';
  document.getElementById('recordGesture').disabled = true;
}

// Frame Processing Loop
let frameProcessing = false;
function processFrame() {
  if (frameProcessing) return;
  frameProcessing = true;

  if (STATE.camera && STATE.videoElement.readyState === STATE.videoElement.HAVE_ENOUGH_DATA && STATE.hands) {
    STATE.hands.send({ image: STATE.videoElement }).finally(() => {
      frameProcessing = false;
      requestAnimationFrame(processFrame);
    });
  } else {
    frameProcessing = false;
    requestAnimationFrame(processFrame);
  }
}

// Handle Hand Detection Results
function handleHandsResults(results) {
  STATE.canvasContext.clearRect(0, 0, STATE.canvasElement.width, STATE.canvasElement.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    // Draw hands
    for (let landmarks of results.multiHandLandmarks) {
      drawConnectors(STATE.canvasContext, landmarks, HAND_CONNECTIONS, { color: '#6366f1', lineWidth: 2 });
      drawLandmarks(STATE.canvasContext, landmarks, { color: '#8b5cf6', lineWidth: 2 });
    }

    document.getElementById('statusIndicator').textContent = 'Hands Detected ✓';
    document.getElementById('statusIndicator').className = 'status success';

    // UPDATE CONFIDENCE METER - Show LIVE ACCURACY against current sign
    const confidenceFill = document.getElementById('confidenceFill');
    const confidenceValue = document.getElementById('confidenceValue');
    
    if (STATE.currentMode && confidenceFill && confidenceValue) {
      // Calculate live accuracy against current target sign
      const landmarks = results.multiHandLandmarks[0];
      const rawAccuracy = calculateLiveAccuracy(landmarks);
      
      // Smooth the accuracy using exponential moving average
      // Higher smoothing factor (0.15) = more responsive, lower (0.05) = smoother
      const smoothingFactor = 0.12;
      STATE.smoothedAccuracy = STATE.smoothedAccuracy * (1 - smoothingFactor) + rawAccuracy * smoothingFactor;
      const liveAccuracy = Math.round(STATE.smoothedAccuracy);
      
      confidenceFill.style.width = liveAccuracy + '%';
      confidenceValue.textContent = liveAccuracy + '%';
      
      // Smooth transition for the bar width
      confidenceFill.style.transition = 'width 0.15s ease-out, background 0.3s ease';
      
      // Color code based on accuracy
      if (liveAccuracy >= 60) {
        confidenceFill.style.background = 'linear-gradient(90deg, #10b981, #34d399)'; // Green
      } else if (liveAccuracy >= 40) {
        confidenceFill.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)'; // Yellow
      } else {
        confidenceFill.style.background = 'linear-gradient(90deg, #ef4444, #f87171)'; // Red
      }
    } else if (confidenceFill && confidenceValue) {
      // Not in lesson mode, show detection confidence
      const confidence = results.multiHandedness?.[0]?.score || 0;
      const confidencePercent = Math.round(confidence * 100);
      confidenceFill.style.width = confidencePercent + '%';
      confidenceValue.textContent = confidencePercent + '%';
      confidenceFill.style.background = 'linear-gradient(90deg, #6366f1, #8b5cf6)'; // Purple default
    }

    // CAPTURE FRAMES IF RECORDING
    if (STATE.isRecording && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      STATE.recordedFrames.push(landmarks);
      STATE.frameCounter++;

      if (STATE.frameCounter % 10 === 0) {
        document.getElementById('feedbackBox').innerHTML = `🎥 Recording... ${STATE.frameCounter} frames`;
        console.log(`📹 Frame ${STATE.frameCounter}`);
      }
    }
  } else {
    document.getElementById('statusIndicator').textContent = 'No hands detected';
    document.getElementById('statusIndicator').className = 'status error';
    
    // Reset confidence meter to 0 when no hands detected
    const confidenceFill = document.getElementById('confidenceFill');
    const confidenceValue = document.getElementById('confidenceValue');
    if (confidenceFill) {
      // Smoothly decay to 0 when hands are lost
      STATE.smoothedAccuracy = STATE.smoothedAccuracy * 0.85;
      const displayValue = Math.round(STATE.smoothedAccuracy);
      confidenceFill.style.width = displayValue + '%';
      confidenceFill.style.transition = 'width 0.2s ease-out';
      confidenceFill.style.background = 'linear-gradient(90deg, #6366f1, #8b5cf6)'; // Reset to default color
    }
    if (confidenceValue) confidenceValue.textContent = Math.round(STATE.smoothedAccuracy) + '%';
  }
}

// ----------------------------------------------------------------------------
// LIVE ACCURACY - Calculate accuracy from a single frame in real-time
// ----------------------------------------------------------------------------
/**
 * Calculate live accuracy from a single frame against current target sign
 * @param {Array} landmarks - Single frame of hand landmarks
 * @returns {number} Accuracy percentage 0-100
 */
function calculateLiveAccuracy(landmarks) {
  if (!landmarks || landmarks.length < 21) return 0;
  if (!STATE.currentMode) return 0;
  
  // Get current target sign
  const isAlphabet = STATE.currentMode === 'alphabet';
  const signs = isAlphabet ? ASL_ALPHABET : ASL_NUMBERS;
  const currentSign = signs[STATE.currentIndex];
  const targetLabel = isAlphabet ? currentSign.letter : currentSign.number;
  
  // Get the expected pattern
  const pattern = SIGN_PATTERNS[targetLabel];
  if (!pattern) return 0;
  
  // Extract finger states from single frame
  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const thumbBase = landmarks[2];
  const indexTip = landmarks[8];
  const indexBase = landmarks[5];
  const middleTip = landmarks[12];
  const middleBase = landmarks[9];
  const ringTip = landmarks[16];
  const ringBase = landmarks[13];
  const pinkyTip = landmarks[20];
  const pinkyBase = landmarks[17];
  
  // Helper: distance between two points
  const dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  
  // Helper: check if finger is extended
  const isExtended = (tip, base, wrist) => {
    const tipDist = dist(tip, wrist);
    const baseDist = dist(base, wrist);
    return tipDist > baseDist * 1.1;
  };
  
  // Check thumb (special case - horizontal distance)
  const palmCenter = { x: (wrist.x + landmarks[9].x) / 2, y: (wrist.y + landmarks[9].y) / 2 };
  const thumbExtended = Math.abs(thumbTip.x - palmCenter.x) > 0.1 || dist(thumbTip, wrist) > dist(thumbBase, wrist) * 1.1;
  
  // Get all finger states
  const fingerStates = [
    thumbExtended,
    isExtended(indexTip, indexBase, wrist),
    isExtended(middleTip, middleBase, wrist),
    isExtended(ringTip, ringBase, wrist),
    isExtended(pinkyTip, pinkyBase, wrist)
  ];
  
  // Compare against pattern
  let matchCount = 0;
  let totalChecks = 0;
  
  for (let i = 0; i < 5; i++) {
    if (pattern[i] === null) continue; // Skip "don't care"
    totalChecks++;
    const expectedUp = pattern[i] === 1;
    if (fingerStates[i] === expectedUp) matchCount++;
  }
  
  if (totalChecks === 0) return 50;
  
  // Calculate and apply scoring curve
  const baseAccuracy = (matchCount / totalChecks) * 100;
  
  let finalScore;
  if (baseAccuracy >= 80) {
    finalScore = 80 + (baseAccuracy - 80);
  } else if (baseAccuracy >= 60) {
    finalScore = 60 + (baseAccuracy - 60);
  } else if (baseAccuracy >= 40) {
    finalScore = 45 + (baseAccuracy - 40) * 0.7;
  } else {
    finalScore = 25 + baseAccuracy * 0.5;
  }
  
  return Math.round(finalScore);
}

// Draw Hand Connectors
function drawConnectors(ctx, landmarks, connections, style) {
  for (const [start, end] of connections) {
    const s = landmarks[start];
    const e = landmarks[end];
    if (s && e) {
      ctx.beginPath();
      ctx.moveTo(s.x * STATE.canvasElement.width, s.y * STATE.canvasElement.height);
      ctx.lineTo(e.x * STATE.canvasElement.width, e.y * STATE.canvasElement.height);
      ctx.strokeStyle = style.color;
      ctx.lineWidth = style.lineWidth;
      ctx.stroke();
    }
  }
}

// Draw Hand Landmarks
function drawLandmarks(ctx, landmarks, style) {
  for (const landmark of landmarks) {
    ctx.beginPath();
    ctx.arc(landmark.x * STATE.canvasElement.width, landmark.y * STATE.canvasElement.height, 3, 0, 2 * Math.PI);
    ctx.fillStyle = style.color;
    ctx.fill();
  }
}

// Record Gesture Function
function recordGesture() {
  const btn = document.getElementById('recordGesture');

  if (!STATE.isRecording) {
    // START RECORDING
    console.log('🔴 RECORDING STARTED');
    STATE.isRecording = true;
    STATE.recordedFrames = [];
    STATE.frameCounter = 0;
    STATE.recordingStartTime = Date.now();

    btn.textContent = '⏹️ STOP Recording';
    btn.style.background = '#ef4444';

    document.getElementById('feedbackBox').innerHTML = '🎥 RECORDING... Show your sign now!';
    document.getElementById('feedbackBox').className = 'feedback-box feedback-warning';
  } else {
    // STOP RECORDING
    console.log('⏹️ RECORDING STOPPED');
    STATE.isRecording = false;

    btn.textContent = '⏺️ Record Gesture';
    btn.style.background = '';

    const duration = ((Date.now() - STATE.recordingStartTime) / 1000).toFixed(2);
    console.log(`Frames: ${STATE.frameCounter}, Time: ${duration}s`);

    if (STATE.frameCounter > 0 && STATE.recordedFrames.length > 0) {
      document.getElementById('feedbackBox').innerHTML = `✅ SUCCESS! ${STATE.frameCounter} frames<br>Click SUBMIT to check accuracy`;
      document.getElementById('feedbackBox').className = 'feedback-box feedback-success';
      document.getElementById('submitBtn').disabled = false;
    } else {
      document.getElementById('feedbackBox').innerHTML = '❌ No frames recorded! Keep hand in frame.';
      document.getElementById('feedbackBox').className = 'feedback-box feedback-error';
      document.getElementById('submitBtn').disabled = true;
    }
  }
}

// ============================================================================
// SIGN ACCURACY SYSTEM
// ============================================================================
// 
// HOW IT WORKS:
// 1. Record frames of hand landmarks from MediaPipe
// 2. Extract finger states (extended or curled) from the frames
// 3. Compare against simple sign patterns
// 4. Calculate accuracy score
//
// TO ADD A NEW SIGN:
// 1. Add entry to SIGN_PATTERNS below with fingers that should be UP
// 2. The system will automatically score it
// ============================================================================

// ----------------------------------------------------------------------------
// SIGN PATTERNS - Define which fingers should be UP for each sign
// ----------------------------------------------------------------------------
// Format: { sign: [thumb, index, middle, ring, pinky] }
// 1 = finger should be UP/extended, 0 = finger should be DOWN/curled
// null = don't care about this finger
const SIGN_PATTERNS = {
  // ALPHABET - Based on ASL fingerspelling
  'A': [1, 0, 0, 0, 0],    // Thumb out, all others curled (fist)
  'B': [0, 1, 1, 1, 1],    // Four fingers up, thumb tucked
  'C': [1, 1, 1, 1, 1],    // All fingers curved (open C shape)
  'D': [0, 1, 0, 0, 0],    // Index up only
  'E': [0, 0, 0, 0, 0],    // All curled
  'F': [0, 0, 1, 1, 1],    // Circle with thumb+index, others up
  'G': [1, 1, 0, 0, 0],    // Thumb and index pointing
  'H': [0, 1, 1, 0, 0],    // Index and middle sideways
  'I': [0, 0, 0, 0, 1],    // Pinky up only
  'J': [0, 0, 0, 0, 1],    // Pinky up (with motion)
  'K': [1, 1, 1, 0, 0],    // Thumb, index, middle up
  'L': [1, 1, 0, 0, 0],    // Thumb and index (L shape)
  'M': [0, 0, 0, 0, 0],    // Fingers over thumb (closed)
  'N': [0, 0, 0, 0, 0],    // Two fingers over thumb (closed)
  'O': [1, 1, 1, 1, 1],    // All fingers touch (O shape)
  'P': [1, 1, 1, 0, 0],    // Like K pointing down
  'Q': [1, 1, 0, 0, 0],    // Thumb and index down
  'R': [0, 1, 1, 0, 0],    // Index and middle crossed
  'S': [1, 0, 0, 0, 0],    // Fist with thumb over
  'T': [1, 0, 0, 0, 0],    // Thumb between index and middle
  'U': [0, 1, 1, 0, 0],    // Index and middle up together
  'V': [0, 1, 1, 0, 0],    // Peace sign / V shape
  'W': [0, 1, 1, 1, 0],    // Three fingers up
  'X': [0, 1, 0, 0, 0],    // Index hooked
  'Y': [1, 0, 0, 0, 1],    // Thumb and pinky out (hang loose)
  'Z': [0, 1, 0, 0, 0],    // Index traces Z

  // NUMBERS
  '1': [0, 1, 0, 0, 0],    // One finger up
  '2': [0, 1, 1, 0, 0],    // Two fingers up
  '3': [1, 1, 1, 0, 0],    // Three (thumb + 2 fingers)
  '4': [0, 1, 1, 1, 1],    // Four fingers up
  '5': [1, 1, 1, 1, 1],    // All five up
  '6': [1, 0, 0, 0, 1],    // Thumb and pinky (like Y)
  '7': [1, 1, 0, 0, 1],    // Thumb, index, pinky
  '8': [0, 1, 0, 1, 1],    // Thumb and middle
  '9': [1, 1, 1, 0, 0],    // Thumb and index touch
  '10': [1, 0, 0, 0, 0]    // Thumbs up or all fingers
};

// ----------------------------------------------------------------------------
// FEATURE EXTRACTION - Get finger states from recorded frames
// ----------------------------------------------------------------------------
/**
 * Extracts finger extension states from recorded hand landmark frames
 * @param {Array} frames - Array of hand landmark arrays from MediaPipe
 * @returns {Object} Object with boolean for each finger and confidence scores
 */
function extractFingerStates(frames) {
  // Need at least some frames to analyze
  if (!frames || frames.length === 0) {
    console.log('❌ No frames to analyze');
    return null;
  }

  // Use the last 15 frames for stability (or all if less)
  const analyzeCount = Math.min(15, frames.length);
  const stableFrames = frames.slice(-analyzeCount);
  
  // Count how many frames each finger appears extended
  let extendedCounts = { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 };
  let validFrames = 0;

  for (const frame of stableFrames) {
    // Skip invalid frames
    if (!frame || frame.length < 21) continue;
    validFrames++;

    // Get key landmark positions
    // MediaPipe hand landmarks: 0=wrist, 4=thumb tip, 8=index tip, etc.
    const wrist = frame[0];
    const thumbTip = frame[4];
    const thumbBase = frame[2];
    const indexTip = frame[8];
    const indexBase = frame[5];
    const middleTip = frame[12];
    const middleBase = frame[9];
    const ringTip = frame[16];
    const ringBase = frame[13];
    const pinkyTip = frame[20];
    const pinkyBase = frame[17];

    // Calculate if each finger is extended
    // A finger is "extended" if the tip is far from the wrist relative to the base
    
    // Helper: distance between two points
    const dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    
    // Helper: check if finger is extended (tip farther from palm than base)
    const isExtended = (tip, base, wrist) => {
      const tipDist = dist(tip, wrist);
      const baseDist = dist(base, wrist);
      // If tip is at least 1.2x farther than base, finger is extended
      return tipDist > baseDist * 1.1;
    };

    // Check each finger
    // Thumb is special - check horizontal distance from palm center
    const palmCenter = { x: (wrist.x + frame[9].x) / 2, y: (wrist.y + frame[9].y) / 2 };
    const thumbExtended = Math.abs(thumbTip.x - palmCenter.x) > 0.1 || dist(thumbTip, wrist) > dist(thumbBase, wrist) * 1.1;
    
    if (thumbExtended) extendedCounts.thumb++;
    if (isExtended(indexTip, indexBase, wrist)) extendedCounts.index++;
    if (isExtended(middleTip, middleBase, wrist)) extendedCounts.middle++;
    if (isExtended(ringTip, ringBase, wrist)) extendedCounts.ring++;
    if (isExtended(pinkyTip, pinkyBase, wrist)) extendedCounts.pinky++;
  }

  // Need at least 3 valid frames
  if (validFrames < 3) {
    console.log('❌ Not enough valid frames:', validFrames);
    return null;
  }

  // Convert counts to booleans (extended if > 40% of frames show it extended)
  const threshold = validFrames * 0.4;
  
  const result = {
    thumb: extendedCounts.thumb > threshold,
    index: extendedCounts.index > threshold,
    middle: extendedCounts.middle > threshold,
    ring: extendedCounts.ring > threshold,
    pinky: extendedCounts.pinky > threshold,
    // Include raw confidence scores for debugging
    confidence: {
      thumb: Math.round((extendedCounts.thumb / validFrames) * 100),
      index: Math.round((extendedCounts.index / validFrames) * 100),
      middle: Math.round((extendedCounts.middle / validFrames) * 100),
      ring: Math.round((extendedCounts.ring / validFrames) * 100),
      pinky: Math.round((extendedCounts.pinky / validFrames) * 100)
    },
    frameCount: validFrames
  };

  console.log('📊 Extracted finger states:', result);
  return result;
}

// ----------------------------------------------------------------------------
// SCORING - Compare detected fingers against expected pattern
// ----------------------------------------------------------------------------
/**
 * Calculate accuracy score by comparing finger states to expected pattern
 * @param {Object} fingerStates - Detected finger states from extractFingerStates()
 * @param {string} targetSign - The sign we're trying to match (e.g., 'A', '5')
 * @returns {number} Accuracy score from 0-100
 */
function calculateAccuracy(fingerStates, targetSign) {
  // Get the expected pattern for this sign
  const pattern = SIGN_PATTERNS[targetSign];
  
  if (!pattern) {
    console.log(`⚠️ No pattern defined for sign: ${targetSign}`);
    return 50; // Default score for unknown signs
  }

  if (!fingerStates) {
    console.log('❌ No finger states to score');
    return 0;
  }

  // Compare each finger [thumb, index, middle, ring, pinky]
  const fingers = ['thumb', 'index', 'middle', 'ring', 'pinky'];
  let matchCount = 0;
  let totalChecks = 0;
  let details = [];

  for (let i = 0; i < 5; i++) {
    const expected = pattern[i];
    const actual = fingerStates[fingers[i]];
    const confidence = fingerStates.confidence[fingers[i]];

    // Skip if pattern says "don't care" (null)
    if (expected === null) continue;

    totalChecks++;
    const expectedUp = expected === 1;
    const match = actual === expectedUp;

    if (match) {
      matchCount++;
      details.push(`✓ ${fingers[i]}: ${actual ? 'UP' : 'DOWN'} (${confidence}%)`);
    } else {
      details.push(`✗ ${fingers[i]}: expected ${expectedUp ? 'UP' : 'DOWN'}, got ${actual ? 'UP' : 'DOWN'} (${confidence}%)`);
    }
  }

  // Log detailed breakdown
  console.log(`\n📋 Sign "${targetSign}" breakdown:`);
  details.forEach(d => console.log('  ' + d));

  // Calculate base accuracy from matches
  const baseAccuracy = totalChecks > 0 ? (matchCount / totalChecks) * 100 : 0;

  // Apply generous scoring curve to make it more achievable
  // This rewards partial matches and makes the experience more encouraging
  let finalScore;
  if (baseAccuracy >= 80) {
    // 80-100% match -> 80-100 score (great job!)
    finalScore = 80 + (baseAccuracy - 80);
  } else if (baseAccuracy >= 60) {
    // 60-79% match -> 60-79 score (good effort)
    finalScore = 60 + (baseAccuracy - 60);
  } else if (baseAccuracy >= 40) {
    // 40-59% match -> 45-59 score (keep trying)
    finalScore = 45 + (baseAccuracy - 40) * 0.7;
  } else {
    // Below 40% -> 25-44 score (needs work but not discouraging)
    finalScore = 25 + baseAccuracy * 0.5;
  }

  console.log(`📊 Result: ${matchCount}/${totalChecks} fingers correct = ${baseAccuracy.toFixed(0)}% -> Score: ${finalScore.toFixed(0)}%`);
  
  return Math.round(finalScore);
}

// ----------------------------------------------------------------------------
// MAIN ANALYSIS FUNCTION - Called when user submits a gesture
// ----------------------------------------------------------------------------
/**
 * Main function to analyze recorded gesture and return accuracy score
 * @param {Array} recordedFrames - Frames captured during recording
 * @param {string} targetLabel - The sign being attempted
 * @returns {number} Accuracy score 0-100
 */
async function analyzeGesture(recordedFrames, targetLabel) {
  console.log(`\n🎯 Analyzing gesture for: ${targetLabel}`);
  console.log(`📹 Frames recorded: ${recordedFrames.length}`);

  // Step 1: Extract finger states from the recorded frames
  const fingerStates = extractFingerStates(recordedFrames);
  
  if (!fingerStates) {
    console.log('❌ Could not extract finger states');
    return 0;
  }

  // Step 2: Calculate accuracy against the expected pattern
  const score = calculateAccuracy(fingerStates, targetLabel);
  
  console.log(`✅ Final score for "${targetLabel}": ${score}%\n`);
  return score;
}

// Submit Gesture Function
async function submitGesture() {
  if (STATE.recordedFrames.length === 0) {
    alert('Record a gesture first!');
    return;
  }

  const currentSign = STATE.currentMode === 'alphabet' ? ASL_ALPHABET[STATE.currentIndex] : ASL_NUMBERS[STATE.currentIndex];
  const label = STATE.currentMode === 'alphabet' ? currentSign.letter : currentSign.number;

  document.getElementById('feedbackBox').innerHTML = '⏳ Analyzing gesture...';
  document.getElementById('feedbackBox').className = 'feedback-box feedback-warning';

  // Analyze using LLM
  const accuracy = await analyzeGesture(STATE.recordedFrames, label);

  const key = `${STATE.currentMode === 'alphabet' ? 'a' : 'n'}_${label}`;
  if (!STATE.userProgress[key]) STATE.userProgress[key] = { attempts: 0, correct: 0 };
  STATE.userProgress[key].attempts++;

  // Require 50% or higher to mark as correct
  if (accuracy >= 50) {
    STATE.userProgress[key].correct++;
    document.getElementById('feedbackBox').innerHTML = `🎉 CORRECT! ${Math.round(accuracy)}%<br>Great job on ${label}!`;
    document.getElementById('feedbackBox').className = 'feedback-box feedback-success';
    triggerCelebration();
  } else {
    document.getElementById('feedbackBox').innerHTML = `😊 Try again! ${Math.round(accuracy)}%<br>Check the target image and match the hand position.`;
    document.getElementById('feedbackBox').className = 'feedback-box feedback-error';
  }

  document.getElementById('submitBtn').disabled = true;
  saveProgress();
  updateProgressDisplay();
}

// Start Lesson
function startLesson(mode) {
  console.log(`🎯 Starting lesson: ${mode}`);
  
  // Reset state for new lesson
  STATE.currentMode = mode;
  STATE.currentIndex = 0;  // Always start from first item
  STATE.recordedFrames = [];
  STATE.frameCounter = 0;

  const signs = mode === 'alphabet' ? ASL_ALPHABET : ASL_NUMBERS;
  console.log(`📋 Total signs to learn: ${signs.length}`);
  console.log(`📋 Signs: ${signs.map(s => s.letter || s.number).join(', ')}`);

  document.getElementById('modeSelection').classList.add('hidden');
  document.getElementById('learningInterface').classList.remove('hidden');

  loadSign();
}

// Load Current Sign
function loadSign() {
  const isAlphabet = STATE.currentMode === 'alphabet';
  const signs = isAlphabet ? ASL_ALPHABET : ASL_NUMBERS;
  
  // Safety check - ensure index is valid
  if (STATE.currentIndex < 0) STATE.currentIndex = 0;
  if (STATE.currentIndex >= signs.length) STATE.currentIndex = signs.length - 1;
  
  const currentSign = signs[STATE.currentIndex];
  const label = isAlphabet ? currentSign.letter : currentSign.number;

  console.log(`📖 Loading sign: ${label} (index ${STATE.currentIndex} of ${signs.length})`);

  document.getElementById('lessonTitle').textContent = `Learning: ${label}`;
  document.getElementById('lessonCounter').textContent = `${STATE.currentIndex + 1}/${signs.length}`;
  
  // Display actual image for both alphabet letters and numbers
  const signImageEl = document.getElementById('signImage');
  if (isAlphabet) {
    signImageEl.innerHTML = `<img src="images/${label}.png" alt="ASL sign for ${label}" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.onerror=null; this.parentElement.innerHTML='<span style=\\'font-size:4rem\\'>${getSignEmoji(label)}</span>';">`;
  } else {
    // For numbers, load images from images/1.png, images/2.png, etc.
    signImageEl.innerHTML = `<img src="images/${label}.png" alt="ASL sign for ${label}" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.onerror=null; this.parentElement.innerHTML='<span style=\\'font-size:4rem\\'>${getSignEmoji(label)}</span>';">`;
  }
  
  document.getElementById('signDescription').innerHTML = `
    <p><strong>${currentSign.description}</strong></p>
    <ul>${currentSign.hints.map(h => `<li>✓ ${h}</li>`).join('')}</ul>
  `;

  document.getElementById('feedbackBox').innerHTML = 'Make the sign to get feedback';
  document.getElementById('feedbackBox').className = 'feedback-box';
  document.getElementById('submitBtn').disabled = true;
  document.getElementById('recordGesture').textContent = '⏺️ Record Gesture';
  document.getElementById('recordGesture').style.background = '';

  STATE.recordedFrames = [];
  STATE.frameCounter = 0;

  updateProgressBar();
}

// Next Sign - Navigate sequentially through all signs
function nextSign() {
  const isAlphabet = STATE.currentMode === 'alphabet';
  const signs = isAlphabet ? ASL_ALPHABET : ASL_NUMBERS;
  const totalSigns = signs.length;
  
  console.log(`📍 Current index: ${STATE.currentIndex}, Total: ${totalSigns}`);
  
  // Move to next sign
  const nextIndex = STATE.currentIndex + 1;
  
  if (nextIndex < totalSigns) {
    STATE.currentIndex = nextIndex;
    console.log(`➡️ Moving to index ${STATE.currentIndex}: ${isAlphabet ? signs[STATE.currentIndex].letter : signs[STATE.currentIndex].number}`);
    loadSign();
  } else {
    // Completed all signs
    alert(`🏆 Lesson Complete! You've practiced all ${totalSigns} ${isAlphabet ? 'letters' : 'numbers'}!`);
    backToMenu();
  }
}

// Previous Sign - Go back to previous sign
function prevSign() {
  if (STATE.currentIndex > 0) {
    STATE.currentIndex--;
    console.log(`⬅️ Moving back to index ${STATE.currentIndex}`);
    loadSign();
  }
}

// Back to Menu
function backToMenu() {
  document.getElementById('learningInterface').classList.add('hidden');
  document.getElementById('modeSelection').classList.remove('hidden');
  stopCamera();
  STATE.currentMode = null;
}

// Show Progress Modal
function showProgress() {
  const modal = document.getElementById('progressModal');
  if (modal) {
    modal.classList.remove('hidden');
    updateProgressStats();
  }
}

// Close Progress Modal
function closeProgress() {
  const modal = document.getElementById('progressModal');
  if (modal) modal.classList.add('hidden');
}

// Update Progress Stats
async function updateProgressStats() {
  // Track which specific letters and numbers are completed
  const completedLetters = [];
  const completedNumbers = [];
  
  // Check all 26 letters A-Z
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i); // A=65 in ASCII
    const key = `a_${letter}`;
    if (STATE.userProgress[key] && STATE.userProgress[key].correct > 0) {
      completedLetters.push(letter);
    }
  }
  
  // Check all 10 numbers 1-10
  for (let i = 1; i <= 10; i++) {
    const key = `n_${i}`;
    if (STATE.userProgress[key] && STATE.userProgress[key].correct > 0) {
      completedNumbers.push(i.toString());
    }
  }
  
  const alphabetCorrect = completedLetters.length;
  const numbersCorrect = completedNumbers.length;

  // Update percentage displays
  document.getElementById('alphabetPercent').textContent = Math.round((alphabetCorrect / 26) * 100) + '%';
  document.getElementById('numbersPercent').textContent = Math.round((numbersCorrect / 10) * 100) + '%';
  
  // Update details with explicit list of completed items
  if (alphabetCorrect > 0) {
    document.getElementById('alphabetDetails').innerHTML = 
      `<strong>${alphabetCorrect}/26 learned</strong><br>` +
      `<span style="font-size: 0.9em; color: #4CAF50;">Completed: ${completedLetters.join(', ')}</span>`;
  } else {
    document.getElementById('alphabetDetails').textContent = '0/26 learned';
  }
  
  if (numbersCorrect > 0) {
    document.getElementById('numbersDetails').innerHTML = 
      `<strong>${numbersCorrect}/10 learned</strong><br>` +
      `<span style="font-size: 0.9em; color: #4CAF50;">Completed: ${completedNumbers.join(', ')}</span>`;
  } else {
    document.getElementById('numbersDetails').textContent = '0/10 learned';
  }
  
  // Update achievements list
  updateAchievements(alphabetCorrect, numbersCorrect, completedLetters, completedNumbers);

  // Use LLM to generate encouraging progress message
  await generateProgressMessage(alphabetCorrect, numbersCorrect);
}

// Update achievements based on progress
function updateAchievements(alphabetCount, numberCount, letters, numbers) {
  const achievementsList = document.getElementById('achievementsList');
  if (!achievementsList) return;
  
  const achievements = [];
  
  // Alphabet achievements
  if (alphabetCount >= 1) achievements.push('🌟 First Letter - Learned your first letter!');
  if (alphabetCount >= 5) achievements.push('📝 Getting Started - Learned 5 letters');
  if (alphabetCount >= 10) achievements.push('📚 Alphabet Learner - Learned 10 letters');
  if (alphabetCount >= 20) achievements.push('🎓 Almost There - Learned 20 letters');
  if (alphabetCount >= 26) achievements.push('🏆 Alphabet Master - Completed all 26 letters!');
  
  // Number achievements
  if (numberCount >= 1) achievements.push('1️⃣ First Number - Learned your first number!');
  if (numberCount >= 5) achievements.push('🔢 Halfway Numbers - Learned 5 numbers');
  if (numberCount >= 10) achievements.push('🏆 Number Master - Completed all 10 numbers!');
  
  // Total achievements
  const total = alphabetCount + numberCount;
  if (total >= 36) achievements.push('👑 ASL Champion - Mastered everything!');
  
  if (achievements.length > 0) {
    achievementsList.innerHTML = achievements.map(a => 
      `<div style="padding: 8px; margin: 4px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; font-size: 0.9em;">${a}</div>`
    ).join('');
  } else {
    achievementsList.innerHTML = '<p style="color: #888;">Complete signs to earn achievements!</p>';
  }
}

// Generate Progress Message using LLM
async function generateProgressMessage(alphabetCount, numberCount) {
  try {
    const totalSigns = alphabetCount + numberCount;
    const prompt = `You are an encouraging ASL teacher. The student has learned ${alphabetCount} out of 26 alphabet signs and ${numberCount} out of 10 number signs (total: ${totalSigns}/36). Generate a short, motivating one-line message (under 50 words) praising their progress and encouraging them to continue learning. Be enthusiastic but genuine.`;

    const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer a12a7d3705b12aeb46eb4cc8d77f5446'
      },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100
      })
    });

    if (response.ok) {
      const data = await response.json();
      const message = data.choices?.[0]?.message?.content || `Great progress! You've learned ${totalSigns} signs!`;
      
      const progressMsg = document.getElementById('progressMessage');
      if (progressMsg) {
        progressMsg.textContent = message.trim();
      }
      console.log('✨ Progress message:', message);
    }
  } catch (error) {
    console.log('Note: Could not fetch LLM progress message:', error);
    // Fallback message
    const progressMsg = document.getElementById('progressMessage');
    if (progressMsg) {
      progressMsg.textContent = `Amazing! You've learned ${alphabetCount + numberCount} signs! Keep it up! 🎉`;
    }
  }
}

// Get Sign Emoji
function getSignEmoji(label) {
  const map = {
    // Alphabet - Corrected from reference image
    'A': '✊',      // Closed fist, thumb out
    'B': '🖐️',     // Open hand, fingers together
    'C': '🤚',     // C shape, curved hand
    'D': '🖐️',     // Index up, others down
    'E': '🤐',     // Curved fingers
    'F': '🤌',     // Circle with thumb and index
    'G': '🫲',     // Two fingers sideways
    'H': '🫲',     // Two fingers sideways (like G)
    'I': '☝️',     // Pinky up
    'J': '☝️',     // Pinky up with hook motion
    'K': '🤟',     // V shape with index and middle
    'L': '🤟',     // Thumb and index forming L
    'M': '✋',     // Three fingers down
    'N': '✊',     // Two fingers down
    'O': '⭕',     // Circle with all fingers
    'P': '🤟',     // Like K but hand down
    'Q': '🤟',     // P with downward motion
    'R': '🤞',     // Index and middle crossed
    'S': '✊',     // Fist
    'T': '✊',     // T shape
    'U': '☝️',     // Two fingers up together
    'V': '✌️',     // V shape
    'W': '🖖',     // Three fingers up
    'X': '✌️',     // Cross shape
    'Y': '🙌',     // Thumb and pinky out
    'Z': '✌️',     // Z motion
    // Numbers - Corrected from reference image
    1: '☝️',       // One finger
    2: '✌️',       // Two fingers
    3: '🖐️',      // Three fingers
    4: '✋',       // Four fingers
    5: '🖐️',      // Five fingers (open hand)
    6: '✊',       // Six position
    7: '☝️',       // Seven position
    8: '✊',       // Eight position
    9: '☝️',       // Nine position
    10: '🙌'       // Ten position (both hands)
  };
  return map[label] || '🤟';
}

// Progress Functions
function loadProgress() {
  const saved = localStorage.getItem('aslProgress');
  return saved ? JSON.parse(saved) : {};
}

function saveProgress() {
  localStorage.setItem('aslProgress', JSON.stringify(STATE.userProgress));
}

function updateProgressDisplay() {
  let total = 0, correct = 0;
  for (const key in STATE.userProgress) {
    total += STATE.userProgress[key].attempts;
    correct += STATE.userProgress[key].correct;
  }
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const el = document.getElementById('accuracyDisplay');
  if (el) el.textContent = `${accuracy}%`;
}

function updateProgressBar() {
  const isAlphabet = STATE.currentMode === 'alphabet';
  const total = isAlphabet ? ASL_ALPHABET.length : ASL_NUMBERS.length;
  const progress = ((STATE.currentIndex + 1) / total) * 100;
  const bar = document.getElementById('lessonProgress');
  if (bar) bar.style.width = `${progress}%`;
}

// Celebration Animation
function triggerCelebration() {
  const celebration = document.getElementById('celebration');
  if (!celebration) return;
  
  celebration.classList.remove('hidden');
  celebration.innerHTML = '';
  for (let i = 0; i < 30; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti';
    conf.style.left = Math.random() * 100 + '%';
    conf.style.backgroundColor = ['#6366f1', '#8b5cf6', '#10b981'][Math.floor(Math.random() * 3)];
    celebration.appendChild(conf);
  }
  setTimeout(() => celebration.classList.add('hidden'), 2000);
}

// Show About Modal
function showAbout() {
  const modal = document.getElementById('progressModal');
  modal.classList.remove('hidden');
  
  const modalContent = modal.querySelector('.modal-content');
  modalContent.innerHTML = `
    <button class="close-btn" onclick="document.getElementById('progressModal').classList.add('hidden')">&times;</button>
    <h2>About ASL Learning Hub</h2>
    
    <div style="margin: 2rem 0; line-height: 1.8;">
      <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.3rem;">Interactive Learning Platform</h3>
      <p style="margin-bottom: 1rem;">An AI-powered web application designed to help you master American Sign Language (ASL) alphabet and numbers with real-time hand tracking and intelligent feedback.</p>
      
      <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.3rem; margin-top: 1.5rem;">Key Features</h3>
      <ul style="margin-left: 1.5rem; margin-bottom: 1rem;">
        <li>✨ Real-time hand tracking with MediaPipe</li>
        <li>✨ AI-based gesture recognition with accuracy scoring</li>
        <li>✨ Confidence meter for hand detection quality</li>
        <li>✨ Progress tracking and achievement system</li>
        <li>✨ Beautiful, responsive design with animations</li>
        <li>✨ Local storage persistence for your progress</li>
      </ul>
      
      <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.3rem; margin-top: 1.5rem;">Learning Modes</h3>
      <ul style="margin-left: 1.5rem; margin-bottom: 1rem;">
        <li><strong>Alphabet (A-Z):</strong> Learn all 26 letters of the ASL alphabet</li>
        <li><strong>Numbers (1-10):</strong> Learn numbers from 1 to 10</li>
        <li><strong>Progress Tracker:</strong> View your statistics and achievements</li>
      </ul>
      
      <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.3rem; margin-top: 1.5rem;">How to Get Started</h3>
      <ol style="margin-left: 1.5rem;">
        <li>Choose a learning mode (Alphabet or Numbers)</li>
        <li>Position your hand in front of the camera</li>
        <li>Record your gesture and get instant feedback</li>
        <li>Track your progress and earn achievements</li>
      </ol>
    </div>
  `;
}

