function triggerConfetti() {
  const confettiCount = 50; // Number of confetti pieces
  const explosionOriginX = window.innerWidth / 2; // Center of screen
  const explosionOriginY = window.innerHeight; // Bottom of screen

  for (let i = 0; i < confettiCount; i++) {
    let confetti = document.createElement("div");
    confetti.className = "confetti";
    document.body.appendChild(confetti);

    // Random trajectory
    let x = (Math.random() - 0.5) * window.innerWidth + "px"; // Spread horizontally
    let y = (Math.random() * -(window.innerHeight)) + "px"; // Upward explosion

    confetti.style.setProperty('--x', x);
    confetti.style.setProperty('--y', y);
    confetti.style.left = `${explosionOriginX}px`;
    confetti.style.top = `${explosionOriginY}px`;
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random colors

    // Remove confetti after animation
    setTimeout(() => confetti.remove(), 1500);
  }
}

export {
  triggerConfetti
}
