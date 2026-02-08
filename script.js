const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const actions = document.getElementById('actions');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');
const noMessageEl = document.getElementById('noMessage');

let evadeCount = 0;
let yesScale = 1;

// Buttons stay in place — no movement functions needed

// When No is clicked, do NOT move the button — show sequential questions instead
noBtn.addEventListener('click', (e) => {
  // grow the Yes button each time No is clicked
  yesScale = Math.min(yesScale * 1.18, 3); // cap the scale to avoid runaway
  yesBtn.style.transition = 'box-shadow 260ms ease';
  yesBtn.style.setProperty('--yes-scale', yesScale);
  yesBtn.style.boxShadow = `0 12px 28px rgba(255,59,142,${0.22 + (yesScale - 1) * 0.08})`;

  // show a follow-up question/message
  if (noMessageEl) {
    messageIndex = (messageIndex + 1) % messages.length;
    noMessageEl.textContent = messages[messageIndex];
    noMessageEl.style.transform = 'translateY(-6px) scale(1.02)';
    noMessageEl.style.opacity = '1';
    setTimeout(() => {
      noMessageEl.style.transform = '';
    }, 220);
  }
});

yesBtn.addEventListener('click', () => {
  overlay.classList.remove('hidden');
  // reset Yes button back to original size/style
  yesScale = 1;
  yesBtn.style.transition = 'box-shadow 200ms ease';
  yesBtn.style.setProperty('--yes-scale', 1);
  // clear inline box-shadow so CSS box-shadow applies
  yesBtn.style.boxShadow = '';
});

// close overlay when close button is clicked
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
  });
}

// initialize positions after load
window.addEventListener('load', () => {
  // make sure actions has relative positioning
  actions.style.position = 'relative';
  // spawn some decorative hearts in the background
  spawnHearts();
});

// decorative background hearts
function spawnHearts() {
  const container = document.querySelector('.hearts') || document.createElement('div');
  container.className = 'hearts';
  if (!document.body.contains(container)) document.body.appendChild(container);

  function createHeart() {
    const h = document.createElement('div');
    h.className = 'heart';
    h.textContent = '❤️';
    const x = Math.random() * 100; // vw
    const size = 12 + Math.random() * 36;
    const duration = 3 + Math.random() * 6; // seconds
    h.style.left = x + 'vw';
    h.style.fontSize = size + 'px';
    h.style.animationDuration = duration + 's';
    h.style.opacity = (0.4 + Math.random() * 0.6).toString();
    container.appendChild(h);
    // remove after animation completes
    setTimeout(() => {
      h.remove();
    }, duration * 1000 + 500);
  }

  // initial burst
  for (let i = 0; i < 12; i++) {
    setTimeout(createHeart, i * 120);
  }

  // steady shower (store interval so it can be cleared)
  if (window._heartInterval) clearInterval(window._heartInterval);
  window._heartInterval = setInterval(() => {
    // spawn 1-3 hearts per tick
    const r = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < r; i++) createHeart();
  }, 280);
  // clear on unload
  window.addEventListener('beforeunload', () => {
    if (window._heartInterval) clearInterval(window._heartInterval);
  });
}
const messages = [
  'Really?',
  "Don't you love me?",
  'Are you sure?',
  'Please?',
  'How can you say no?'
];
let messageIndex = -1; // will increment to 0 on first click
