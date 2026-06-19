/**
 * MYNDS — Main page interactions
 */

function goToPassword() {
  // Fade out before navigating
  document.body.style.transition = 'opacity 0.4s ease';
  document.body.style.opacity = '0';
  setTimeout(() => {
    window.location.href = 'password.html';
  }, 420);
}

// Fade in on load
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity = '1';
  });

  // Keyboard shortcut: Enter key → go to password
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToPassword();
    }
  });
});
