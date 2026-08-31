import confetti from 'canvas-confetti';

export function fireConfetti(options = {}) {
  try {
    const count = 150;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
      ...options
    };

    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.25),
      spread: 26,
      startVelocity: 55,
    });
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.2),
      spread: 60,
    });
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.35),
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.1),
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.1),
      spread: 120,
      startVelocity: 45,
    });
  } catch (e) {
    // ignore
  }
}

export function fireStreakConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff5e3a', '#ff2a6d', '#ffb300', '#0c8fe9', '#10b981'],
      zIndex: 9999,
    });
  } catch (e) {}
}
