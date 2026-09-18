// Expected finger extension for each sign, as [thumb, index, middle, ring, pinky].
// 1 = extended, 0 = curled, null = ignored when scoring.
//
// Detection only sees which fingers are extended, so signs that differ by finger
// curvature (C/O), thumb placement (A/S/T, M/N/E) or motion (J, Z, Q) share a
// pattern and cannot be told apart. Adding a sign here makes it scorable.
export const SIGN_PATTERNS = {
  A: [1, 0, 0, 0, 0],
  B: [0, 1, 1, 1, 1],
  C: [1, 1, 1, 1, 1],
  D: [0, 1, 0, 0, 0],
  E: [0, 0, 0, 0, 0],
  F: [0, 0, 1, 1, 1],
  G: [1, 1, 0, 0, 0],
  H: [0, 1, 1, 0, 0],
  I: [0, 0, 0, 0, 1],
  J: [0, 0, 0, 0, 1],
  K: [1, 1, 1, 0, 0],
  L: [1, 1, 0, 0, 0],
  M: [0, 0, 0, 0, 0],
  N: [0, 0, 0, 0, 0],
  O: [1, 1, 1, 1, 1],
  P: [1, 1, 1, 0, 0],
  Q: [1, 1, 0, 0, 0],
  R: [0, 1, 1, 0, 0],
  S: [1, 0, 0, 0, 0],
  T: [1, 0, 0, 0, 0],
  U: [0, 1, 1, 0, 0],
  V: [0, 1, 1, 0, 0],
  W: [0, 1, 1, 1, 0],
  X: [0, 1, 0, 0, 0],
  Y: [1, 0, 0, 0, 1],
  Z: [0, 1, 0, 0, 0],

  1: [0, 1, 0, 0, 0],
  2: [0, 1, 1, 0, 0],
  3: [1, 1, 1, 0, 0],
  4: [0, 1, 1, 1, 1],
  5: [1, 1, 1, 1, 1],
  6: [1, 0, 0, 0, 1],
  7: [1, 1, 0, 0, 1],
  8: [0, 1, 0, 1, 1],
  9: [1, 1, 1, 0, 0],
  10: [1, 0, 0, 0, 0]
};
