export function openModal(modal) {
  modal.classList.remove('hidden');
}

function closeModal(modal) {
  modal.classList.add('hidden');
}

// Wires the close button and backdrop click for a modal.
export function bindModalDismiss(modal) {
  modal.querySelector('.close-btn')?.addEventListener('click', () => closeModal(modal));
  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal(modal);
  });
}
