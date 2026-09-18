// Draws the hand skeleton over the video feed. Replaces MediaPipe's
// drawing_utils so the app only needs the hands bundle from the CDN.

// Bones between the 21 landmarks: palm to each fingertip chain.
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20]
];

const BONE_COLOR = '#edeae2';
const JOINT_COLOR = '#9dbe7a';
const LINE_WIDTH = 2;
const JOINT_RADIUS = 3;

export function clearOverlay(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Landmarks are normalised 0-1, so scale them to the canvas.
export function drawHand(ctx, canvas, landmarks) {
  const x = point => point.x * canvas.width;
  const y = point => point.y * canvas.height;

  ctx.strokeStyle = BONE_COLOR;
  ctx.lineWidth = LINE_WIDTH;
  for (const [start, end] of HAND_CONNECTIONS) {
    const from = landmarks[start];
    const to = landmarks[end];
    if (!from || !to) continue;
    ctx.beginPath();
    ctx.moveTo(x(from), y(from));
    ctx.lineTo(x(to), y(to));
    ctx.stroke();
  }

  ctx.fillStyle = JOINT_COLOR;
  for (const landmark of landmarks) {
    ctx.beginPath();
    ctx.arc(x(landmark), y(landmark), JOINT_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
  }
}
