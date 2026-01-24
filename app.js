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
  userProgress: loadProgress()
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
  const submitBtn = document.getElementById('submitBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (cameraBtn) cameraBtn.addEventListener('click', toggleCamera);
  if (recordBtn) recordBtn.addEventListener('click', recordGesture);
  if (submitBtn) submitBtn.addEventListener('click', submitGesture);
  if (nextBtn) nextBtn.addEventListener('click', nextSign);
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

    // UPDATE CONFIDENCE METER - Based on hand detection quality
    if (results.multiHandedness && results.multiHandedness.length > 0) {
      const confidence = results.multiHandedness[0].score;
      const confidencePercent = Math.round(confidence * 100);
      const confidenceFill = document.getElementById('confidenceFill');
      const confidenceValue = document.getElementById('confidenceValue');
      
      if (confidenceFill) {
        confidenceFill.style.width = confidencePercent + '%';
      }
      if (confidenceValue) {
        confidenceValue.textContent = confidencePercent + '%';
      }
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
    
    // Reset confidence meter when no hands detected
    const confidenceFill = document.getElementById('confidenceFill');
    const confidenceValue = document.getElementById('confidenceValue');
    if (confidenceFill) confidenceFill.style.width = '0%';
    if (confidenceValue) confidenceValue.textContent = '0%';
  }
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

// Format landmarks as descriptive text for LLM analysis
function formatLandmarksForLLM(frames) {
  if (frames.length === 0) return '';
  
  // Use the last 10 frames (most stable part of gesture)
  const stableFrames = frames.slice(Math.max(0, frames.length - 10));
  const lastFrame = stableFrames[stableFrames.length - 1];
  
  if (!lastFrame || lastFrame.length < 21) return '';
  
  const wrist = lastFrame[0];
  const thumbTip = lastFrame[4];
  const indexTip = lastFrame[8];
  const middleTip = lastFrame[12];
  const ringTip = lastFrame[16];
  const pinkyTip = lastFrame[20];
  
  // Calculate distances to determine openness and finger positions
  const distances = {
    thumb: Math.sqrt((thumbTip.x - wrist.x) ** 2 + (thumbTip.y - wrist.y) ** 2),
    index: Math.sqrt((indexTip.x - wrist.x) ** 2 + (indexTip.y - wrist.y) ** 2),
    middle: Math.sqrt((middleTip.x - wrist.x) ** 2 + (middleTip.y - wrist.y) ** 2),
    ring: Math.sqrt((ringTip.x - wrist.x) ** 2 + (ringTip.y - wrist.y) ** 2),
    pinky: Math.sqrt((pinkyTip.x - wrist.x) ** 2 + (pinkyTip.y - wrist.y) ** 2)
  };
  
  // Determine which fingers are extended
  const avgDistance = Object.values(distances).reduce((a, b) => a + b) / 5;
  const extendedFingers = [];
  if (distances.thumb > avgDistance * 0.8) extendedFingers.push('thumb');
  if (distances.index > avgDistance * 0.8) extendedFingers.push('index');
  if (distances.middle > avgDistance * 0.8) extendedFingers.push('middle');
  if (distances.ring > avgDistance * 0.8) extendedFingers.push('ring');
  if (distances.pinky > avgDistance * 0.8) extendedFingers.push('pinky');
  
  // Calculate hand openness
  const handOpenness = Object.values(distances).reduce((a, b) => a + b) / 5;
  const isOpenHand = handOpenness > 0.25;
  
  // Calculate finger spread
  const indexMiddleDist = Math.sqrt((indexTip.x - middleTip.x) ** 2 + (indexTip.y - middleTip.y) ** 2);
  const isSpread = indexMiddleDist > 0.12;
  
  const description = `
Hand gesture recorded for ${frames.length} frames (stable analysis on last ${stableFrames.length} frames):
- Hand is ${isOpenHand ? 'OPEN' : 'CLOSED'} (openness score: ${handOpenness.toFixed(2)})
- Fingers extended: ${extendedFingers.length > 0 ? extendedFingers.join(', ') : 'none/curled'}
- Fingers are ${isSpread ? 'SPREAD APART' : 'TOGETHER'}
- Finger distances - Thumb: ${distances.thumb.toFixed(2)}, Index: ${distances.index.toFixed(2)}, Middle: ${distances.middle.toFixed(2)}, Ring: ${distances.ring.toFixed(2)}, Pinky: ${distances.pinky.toFixed(2)}
- Average extension: ${handOpenness.toFixed(2)}
`;
  
  return description;
}

// Define exact requirements for each sign
const SIGN_REQUIREMENTS = {
  'A': { thumb_extended: true, index_extended: false, middle_extended: false, ring_extended: false, pinky_extended: false, max_openness: 0.20 },
  'B': { thumb_extended: false, index_extended: true, middle_extended: true, ring_extended: true, pinky_extended: true, min_openness: 0.30, fingers_spread: true },
  'C': { thumb_extended: true, index_extended: true, middle_extended: true, ring_extended: true, pinky_extended: true, min_openness: 0.25, fingers_spread: true },
  'D': { index_extended: true, middle_extended: false, ring_extended: false, pinky_extended: false, thumb_extended: false, max_openness: 0.22 },
  'E': { thumb_extended: false, index_extended: false, middle_extended: false, ring_extended: false, pinky_extended: false, max_openness: 0.18 },
  'F': { thumb_extended: true, index_extended: true, middle_extended: true, ring_extended: true, pinky_extended: true, max_openness: 0.15 },
  'G': { index_extended: true, middle_extended: false, ring_extended: false, pinky_extended: false, thumb_extended: true, max_openness: 0.22 },
  'H': { index_extended: true, middle_extended: true, ring_extended: false, pinky_extended: false, thumb_extended: false, max_openness: 0.22 },
  'I': { pinky_extended: true, index_extended: false, middle_extended: false, ring_extended: false, thumb_extended: false, max_openness: 0.20 },
  'J': { pinky_extended: true, index_extended: false, middle_extended: false, ring_extended: false, thumb_extended: false, max_openness: 0.20 },
  'K': { index_extended: true, middle_extended: true, ring_extended: false, pinky_extended: false, thumb_extended: true, fingers_spread: true },
  'L': { thumb_extended: true, index_extended: true, middle_extended: false, ring_extended: false, pinky_extended: false },
  'M': { index_extended: false, middle_extended: false, ring_extended: false, pinky_extended: false, thumb_extended: false, max_openness: 0.18 },
  'N': { index_extended: false, middle_extended: false, ring_extended: false, pinky_extended: false, thumb_extended: false, max_openness: 0.18 },
  'O': { thumb_extended: false, index_extended: false, middle_extended: false, ring_extended: false, pinky_extended: false, fingers_together: true, max_openness: 0.10 },
  'P': { index_extended: true, middle_extended: true, ring_extended: false, pinky_extended: false, thumb_extended: true, max_openness: 0.22 },
  'Q': { index_extended: true, middle_extended: true, ring_extended: false, pinky_extended: false, thumb_extended: true },
  'R': { index_extended: true, middle_extended: true, ring_extended: false, pinky_extended: false, thumb_extended: false, fingers_spread: true },
  'S': { thumb_extended: true, index_extended: false, middle_extended: false, ring_extended: false, pinky_extended: false, max_openness: 0.18 },
  'T': { thumb_extended: true, index_extended: false, middle_extended: false, ring_extended: false, pinky_extended: false, max_openness: 0.18 },
  'U': { index_extended: true, middle_extended: true, ring_extended: false, pinky_extended: false, thumb_extended: false, fingers_spread: false },
  'V': { index_extended: true, middle_extended: true, ring_extended: false, pinky_extended: false, thumb_extended: false, fingers_spread: true, min_openness: 0.25 },
  'W': { index_extended: true, middle_extended: true, ring_extended: true, pinky_extended: false, thumb_extended: false, fingers_spread: true },
  'X': { index_extended: true, middle_extended: true, ring_extended: false, pinky_extended: false, thumb_extended: false },
  'Y': { thumb_extended: true, pinky_extended: true, index_extended: false, middle_extended: false, ring_extended: false },
  'Z': { index_extended: true, middle_extended: false, ring_extended: false, pinky_extended: false, thumb_extended: false },
  '1': { index_extended: true, middle_extended: false, ring_extended: false, pinky_extended: false, thumb_extended: false, max_openness: 0.20 },
  '2': { index_extended: true, middle_extended: true, ring_extended: false, pinky_extended: false, thumb_extended: false, fingers_spread: true },
  '3': { index_extended: true, middle_extended: true, ring_extended: true, pinky_extended: false, thumb_extended: true },
  '4': { index_extended: true, middle_extended: true, ring_extended: true, pinky_extended: true, thumb_extended: false, min_openness: 0.28 },
  '5': { index_extended: true, middle_extended: true, ring_extended: true, pinky_extended: true, thumb_extended: true, min_openness: 0.32 },
  '6': { index_extended: false, middle_extended: false, ring_extended: false, pinky_extended: false, thumb_extended: true, max_openness: 0.20 },
  '7': { index_extended: true, middle_extended: false, ring_extended: false, pinky_extended: false, thumb_extended: true },
  '8': { index_extended: false, middle_extended: false, ring_extended: false, pinky_extended: false, thumb_extended: false, max_openness: 0.18 },
  '9': { pinky_extended: true, index_extended: false, middle_extended: false, ring_extended: false, thumb_extended: true },
  '10': { index_extended: true, middle_extended: true, ring_extended: true, pinky_extended: true, thumb_extended: true, min_openness: 0.32 }
};

// Extract concrete features from hand landmarks
function extractConcreteFeaturesFromFrames(frames) {
  if (frames.length === 0) return null;
  
  const stableFrames = frames.slice(Math.max(0, frames.length - 10));
  let features = {
    thumb_extended: 0,
    index_extended: 0,
    middle_extended: 0,
    ring_extended: 0,
    pinky_extended: 0,
    fingers_together: 0,
    fingers_spread: 0,
    hand_openness: 0
  };
  
  for (let frame of stableFrames) {
    if (!frame || frame.length < 21) continue;
    
    const wrist = frame[0];
    
    // Calculate extension of each finger
    const thumbDist = Math.sqrt((frame[4].x - wrist.x) ** 2 + (frame[4].y - wrist.y) ** 2);
    const indexDist = Math.sqrt((frame[8].x - wrist.x) ** 2 + (frame[8].y - wrist.y) ** 2);
    const middleDist = Math.sqrt((frame[12].x - wrist.x) ** 2 + (frame[12].y - wrist.y) ** 2);
    const ringDist = Math.sqrt((frame[16].x - wrist.x) ** 2 + (frame[16].y - wrist.y) ** 2);
    const pinkyDist = Math.sqrt((frame[20].x - wrist.x) ** 2 + (frame[20].y - wrist.y) ** 2);
    
    const avgDist = (thumbDist + indexDist + middleDist + ringDist + pinkyDist) / 5;
    
    // If finger is > 70% of average = extended
    if (thumbDist > avgDist * 0.7) features.thumb_extended++;
    if (indexDist > avgDist * 0.7) features.index_extended++;
    if (middleDist > avgDist * 0.7) features.middle_extended++;
    if (ringDist > avgDist * 0.7) features.ring_extended++;
    if (pinkyDist > avgDist * 0.7) features.pinky_extended++;
    
    // Finger spread (distance between index and middle tips)
    const indexMiddleDist = Math.sqrt((frame[8].x - frame[12].x) ** 2 + (frame[8].y - frame[12].y) ** 2);
    if (indexMiddleDist > 0.12) features.fingers_spread++;
    else features.fingers_together++;
    
    // Hand openness
    features.hand_openness += avgDist;
  }
  
  const numFrames = Math.max(1, stableFrames.length);
  return {
    thumb_extended: features.thumb_extended >= numFrames * 0.6,
    index_extended: features.index_extended >= numFrames * 0.6,
    middle_extended: features.middle_extended >= numFrames * 0.6,
    ring_extended: features.ring_extended >= numFrames * 0.6,
    pinky_extended: features.pinky_extended >= numFrames * 0.6,
    fingers_spread: features.fingers_spread > numFrames * 0.5,
    fingers_together: features.fingers_together > numFrames * 0.5,
    hand_openness: features.hand_openness / numFrames,
    is_open_hand: (features.hand_openness / numFrames) > 0.25,
    is_closed_hand: (features.hand_openness / numFrames) <= 0.25,
    frame_count: frames.length
  };
}

// Score gesture by checking requirements
function scoreGestureByRules(features, targetLabel) {
  const req = SIGN_REQUIREMENTS[targetLabel];
  if (!req) return 50; // Unknown sign
  
  let matchCount = 0;
  let totalChecks = 0;
  
  // Check each requirement
  if (req.thumb_extended !== undefined) {
    totalChecks++;
    if (features.thumb_extended === req.thumb_extended) matchCount++;
    else console.log(`❌ Thumb mismatch: need ${req.thumb_extended}, got ${features.thumb_extended}`);
  }
  
  if (req.index_extended !== undefined) {
    totalChecks++;
    if (features.index_extended === req.index_extended) matchCount++;
    else console.log(`❌ Index mismatch: need ${req.index_extended}, got ${features.index_extended}`);
  }
  
  if (req.middle_extended !== undefined) {
    totalChecks++;
    if (features.middle_extended === req.middle_extended) matchCount++;
    else console.log(`❌ Middle mismatch: need ${req.middle_extended}, got ${features.middle_extended}`);
  }
  
  if (req.ring_extended !== undefined) {
    totalChecks++;
    if (features.ring_extended === req.ring_extended) matchCount++;
    else console.log(`❌ Ring mismatch: need ${req.ring_extended}, got ${features.ring_extended}`);
  }
  
  if (req.pinky_extended !== undefined) {
    totalChecks++;
    if (features.pinky_extended === req.pinky_extended) matchCount++;
    else console.log(`❌ Pinky mismatch: need ${req.pinky_extended}, got ${features.pinky_extended}`);
  }
  
  if (req.max_openness !== undefined) {
    totalChecks++;
    if (features.hand_openness <= req.max_openness) matchCount++;
    else console.log(`❌ Hand too open: ${features.hand_openness.toFixed(2)} > ${req.max_openness}`);
  }
  
  if (req.min_openness !== undefined) {
    totalChecks++;
    if (features.hand_openness >= req.min_openness) matchCount++;
    else console.log(`❌ Hand too closed: ${features.hand_openness.toFixed(2)} < ${req.min_openness}`);
  }
  
  if (req.fingers_spread !== undefined) {
    totalChecks++;
    if (features.fingers_spread === req.fingers_spread) matchCount++;
    else console.log(`❌ Finger spread mismatch: need ${req.fingers_spread}, got ${features.fingers_spread}`);
  }
  
  if (req.fingers_together !== undefined) {
    totalChecks++;
    if (features.fingers_together === req.fingers_together) matchCount++;
    else console.log(`❌ Fingers together mismatch: need ${req.fingers_together}, got ${features.fingers_together}`);
  }
  
  // Calculate accuracy
  if (totalChecks === 0) return 50;
  const percentMatch = (matchCount / totalChecks) * 100;
  
  console.log(`✓ ${targetLabel}: ${matchCount}/${totalChecks} requirements matched = ${percentMatch.toFixed(0)}%`);
  
  // Convert percentage to accuracy score
  if (percentMatch >= 80) return 80 + (percentMatch - 80);
  else if (percentMatch >= 60) return 50 + (percentMatch - 60);
  else if (percentMatch >= 40) return 30 + (percentMatch - 40);
  else return Math.max(10, percentMatch / 2);
}

// Call LLM to analyze gesture accuracy
async function analyzeGestureWithLLM(recordedFrames, targetLabel) {
  // Extract concrete yes/no features
  const features = extractConcreteFeaturesFromFrames(recordedFrames);
  if (!features) return 0;
  
  console.log('📊 Extracted features:', features);
  
  // Score using deterministic rules (NOT LLM)
  const score = scoreGestureByRules(features, targetLabel);
  
  console.log(`✅ Final score for ${targetLabel}: ${score.toFixed(0)}%`);
  return score;
}

// Fallback pattern-based analysis if LLM is unavailable
function fallbackPatternAnalysis(recordedFrames, targetLabel) {
  const features = extractGestureFeatures(recordedFrames);
  if (!features) return 0;
  
  // Simple heuristic: score based on frame count and hand position stability
  let score = Math.min(100, features.frameCount * 4);
  console.log(`Fallback analysis for ${targetLabel}: ${score.toFixed(0)}%`);
  return score;
}

// Extract features from frames for fallback analysis
function extractGestureFeatures(frames) {
  if (frames.length === 0) return null;
  
  const stableFrames = frames.slice(Math.max(0, frames.length - 10));
  
  let totalHandOpenness = 0;
  let fingerExtension = { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 };
  
  for (let frame of stableFrames) {
    if (!frame || frame.length < 21) continue;
    
    const wrist = frame[0];
    const palmCenter = { x: (frame[0].x + frame[9].x) / 2, y: (frame[0].y + frame[9].y) / 2 };
    
    let openness = 0;
    for (let point of frame) {
      const dx = point.x - palmCenter.x;
      const dy = point.y - palmCenter.y;
      openness += Math.sqrt(dx * dx + dy * dy);
    }
    totalHandOpenness += openness / frame.length;
    
    fingerExtension.thumb += Math.sqrt((frame[4].x - wrist.x) ** 2 + (frame[4].y - wrist.y) ** 2);
    fingerExtension.index += Math.sqrt((frame[8].x - wrist.x) ** 2 + (frame[8].y - wrist.y) ** 2);
    fingerExtension.middle += Math.sqrt((frame[12].x - wrist.x) ** 2 + (frame[12].y - wrist.y) ** 2);
    fingerExtension.ring += Math.sqrt((frame[16].x - wrist.x) ** 2 + (frame[16].y - wrist.y) ** 2);
    fingerExtension.pinky += Math.sqrt((frame[20].x - wrist.x) ** 2 + (frame[20].y - wrist.y) ** 2);
  }
  
  const numFrames = Math.max(1, stableFrames.length);
  return {
    handOpenness: totalHandOpenness / numFrames,
    fingerExtension: fingerExtension,
    frameCount: frames.length
  };
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
  const accuracy = await analyzeGestureWithLLM(STATE.recordedFrames, label);

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
  STATE.currentMode = mode;
  STATE.currentIndex = 0;
  STATE.recordedFrames = [];
  STATE.frameCounter = 0;

  document.getElementById('modeSelection').classList.add('hidden');
  document.getElementById('learningInterface').classList.remove('hidden');

  loadSign();
}

// Load Current Sign
function loadSign() {
  const isAlphabet = STATE.currentMode === 'alphabet';
  const signs = isAlphabet ? ASL_ALPHABET : ASL_NUMBERS;
  const currentSign = signs[STATE.currentIndex];
  const label = isAlphabet ? currentSign.letter : currentSign.number;

  document.getElementById('lessonTitle').textContent = `Learning: ${label}`;
  document.getElementById('lessonCounter').textContent = `${STATE.currentIndex + 1}/${signs.length}`;
  
  // Display actual image for alphabet letters
  const signImageEl = document.getElementById('signImage');
  if (isAlphabet) {
    signImageEl.innerHTML = `<img src="images/${label}.jpeg" alt="${label}" style="max-width: 100%; height: auto; border-radius: 8px;">`;
  } else {
    // For numbers, still use emoji for now
    signImageEl.textContent = getSignEmoji(label);
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

// Next Sign
function nextSign() {
  const isAlphabet = STATE.currentMode === 'alphabet';
  const signs = isAlphabet ? ASL_ALPHABET : ASL_NUMBERS;

  if (STATE.currentIndex < signs.length - 1) {
    STATE.currentIndex++;
    loadSign();
  } else {
    alert(`🏆 Lesson Complete!`);
    backToMenu();
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
function updateProgressStats() {
  let alphabetCorrect = 0, numbersCorrect = 0;
  for (const key in STATE.userProgress) {
    if (key.startsWith('a_') && STATE.userProgress[key].correct > 0) alphabetCorrect++;
    if (key.startsWith('n_') && STATE.userProgress[key].correct > 0) numbersCorrect++;
  }

  document.getElementById('alphabetPercent').textContent = Math.round((alphabetCorrect / 26) * 100) + '%';
  document.getElementById('alphabetDetails').textContent = `${alphabetCorrect}/26 learned`;
  document.getElementById('numbersPercent').textContent = Math.round((numbersCorrect / 10) * 100) + '%';
  document.getElementById('numbersDetails').textContent = `${numbersCorrect}/10 learned`;
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

