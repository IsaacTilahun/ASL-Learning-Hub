import { el } from './elements.js';

// Wide viewports need more pieces to read as a burst rather than a drizzle.
const pieceCount = () => Math.min(72, Math.round(34 + window.innerWidth / 28));
const TINTS = ['#edeae2', '#9dbe7a', '#d9a34e', '#d4694f', '#c9c3b4'];

const FALL_MIN_MS = 1700;
const FALL_MAX_MS = 2900;
const MAX_DELAY_MS = 400;
const CLEAR_MS = FALL_MAX_MS + MAX_DELAY_MS + 200;

let clearTimer = null;

const between = (min, max) => min + Math.random() * (max - min);
const pick = list => list[Math.floor(Math.random() * list.length)];

// Each piece carries its own size, drift, spin and timing so no two fall alike.
// css/components.css reads these as custom properties.
function buildPiece() {
  const piece = document.createElement('div');
  piece.className = 'confetti';

  const isRibbon = Math.random() < 0.35;
  const isDisc = !isRibbon && Math.random() < 0.3;
  const spinDirection = Math.random() < 0.5 ? -1 : 1;

  const style = {
    left: `${between(-2, 102).toFixed(1)}%`,
    '--size': `${between(5, 11).toFixed(1)}px`,
    '--ratio': isRibbon ? '0.35' : '1',
    '--round': isDisc ? '50%' : '1px',
    '--tint': pick(TINTS),
    '--dx': `${between(-90, 90).toFixed(0)}px`,
    '--dur': `${between(FALL_MIN_MS, FALL_MAX_MS).toFixed(0)}ms`,
    '--delay': `${between(0, MAX_DELAY_MS).toFixed(0)}ms`,
    '--spin': `${(between(180, 900) * spinDirection).toFixed(0)}deg`
  };

  for (const [prop, value] of Object.entries(style)) {
    piece.style.setProperty(prop, value);
  }
  return piece;
}

export function celebrate() {
  const burst = document.createDocumentFragment();
  for (let i = 0, n = pieceCount(); i < n; i++) burst.appendChild(buildPiece());

  el.celebration.replaceChildren(burst);
  el.celebration.classList.remove('hidden');

  // Restarting mid-burst must not let the old timer cut the new one short.
  clearTimeout(clearTimer);
  clearTimer = setTimeout(() => {
    el.celebration.classList.add('hidden');
    el.celebration.replaceChildren();
  }, CLEAR_MS);
}
