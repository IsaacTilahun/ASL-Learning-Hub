// Emoji stand-ins shown when a sign's reference image fails to load.
const SIGN_EMOJI = {
  A: '✊', B: '🖐️', C: '🤚', D: '🖐️', E: '🤐', F: '🤌', G: '🫲',
  H: '🫲', I: '☝️', J: '☝️', K: '🤟', L: '🤟', M: '✋', N: '✊',
  O: '⭕', P: '🤟', Q: '🤟', R: '🤞', S: '✊', T: '✊', U: '☝️',
  V: '✌️', W: '🖖', X: '✌️', Y: '🙌', Z: '✌️',
  1: '☝️', 2: '✌️', 3: '🖐️', 4: '✋', 5: '🖐️',
  6: '✊', 7: '☝️', 8: '✊', 9: '☝️', 10: '🙌'
};

export function getSignEmoji(label) {
  return SIGN_EMOJI[label] || '🤟';
}
