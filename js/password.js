/**
 * MYNDS — Password verification page logic
 */

function toggleVisibility() {
  const input = document.getElementById('password-input');
  const eyeIcon = document.getElementById('eye-icon');

  if (!input || !eyeIcon) return;

  if (input.type === 'password') {
    input.type = 'text';
    // Modify SVG to display eye-off icon
    eyeIcon.innerHTML = `
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
      <path d="M2 2l20 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    `;
  } else {
    input.type = 'password';
    // Restore original eye SVG
    eyeIcon.innerHTML = `
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
    `;
  }
}

function handleKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    checkPassword();
  }
}

function checkPassword() {
  const input = document.getElementById('password-input');
  const inputWrap = document.getElementById('input-wrap');
  const errorMsg = document.getElementById('error-msg');
  const submitBtn = document.getElementById('submit-btn');

  if (!input || !inputWrap || !errorMsg || !submitBtn) return;

  const enteredVal = input.value.trim();

  // Reset animations and states
  inputWrap.classList.remove('shake');
  errorMsg.classList.remove('visible');

  if (!enteredVal) {
    showError();
    return;
  }

  // Set loading state
  submitBtn.classList.add('loading');

  // Simulated validation delay — always returns incorrect
  setTimeout(() => {
    submitBtn.classList.remove('loading');
    showError();
  }, 1000);

  function showError() {
    inputWrap.classList.add('shake');
    errorMsg.classList.add('visible');
    input.focus();
  }
}

// Fade page in on load
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity = '1';
  });
});
