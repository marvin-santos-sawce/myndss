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

  setTimeout(() => {
    submitBtn.classList.remove('loading');

    if (enteredVal === 'trisalmet') {
      inputWrap.style.borderColor = 'var(--pink)';
      inputWrap.style.boxShadow = '0 0 20px rgba(255,45,120,0.4)';
      showToast('Bota firme no cuzinho do Erick e do Thiago');
    } else {
      showError();
    }
  }, 1000);

  function showError() {
    inputWrap.classList.add('shake');
    errorMsg.classList.add('visible');
    input.focus();
  }
}

function showToast(message) {
  const existing = document.getElementById('mynds-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'mynds-toast';
  toast.innerHTML = `
    <div class="toast-brand">MYNDS<sup>®</sup></div>
    <div class="toast-msg">${message}</div>
  `;
  toast.style.cssText = `
    position: fixed;
    top: 28px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    background: rgba(0, 0, 0, 0.92);
    border: 1px solid rgba(255, 45, 120, 0.5);
    box-shadow: 0 0 32px rgba(255, 45, 120, 0.25), inset 0 0 20px rgba(255,45,120,0.04);
    backdrop-filter: blur(16px);
    padding: 14px 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.35s ease, transform 0.35s ease;
    min-width: 180px;
    text-align: center;
  `;

  toast.querySelector('.toast-brand').style.cssText = `
    font-family: 'Orbitron', monospace;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.35em;
    color: rgba(255, 45, 120, 0.8);
  `;
  toast.querySelector('.toast-brand sup').style.cssText = `
    font-size: 7px;
    vertical-align: super;
  `;
  toast.querySelector('.toast-msg').style.cssText = `
    font-family: 'Share Tech Mono', monospace;
    font-size: 14px;
    letter-spacing: 0.12em;
    color: #ffffff;
  `;

  // Corner accents via pseudo-borders workaround (inline divs)
  ['tl', 'br'].forEach(pos => {
    const corner = document.createElement('div');
    const isTop = pos === 'tl';
    corner.style.cssText = `
      position: absolute;
      width: 10px; height: 10px;
      border-color: #ff2d78; border-style: solid;
      ${isTop
        ? 'top: -1px; left: -1px; border-width: 2px 0 0 2px;'
        : 'bottom: -1px; right: -1px; border-width: 0 2px 2px 0;'}
    `;
    toast.appendChild(corner);
  });

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
  });

  // Animate out after 3.5s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-12px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// Fade page in on load
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity = '1';
  });
});