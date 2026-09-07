// rewards.js — Simple celebration animation for daily-todo-list
// ELI5: whenever a task is completed, call Rewards.celebrate()
// and it shows a quick confetti burst + a friendly message. That's it.

const Rewards = (() => {
  const MESSAGES = ['🎉', '⭐', '🚀', '🌟', '🔥', '🏆', '💪', '✨', '🎊', '👏']

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'reward-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('reward-toast--visible'));

    setTimeout(() => {
      toast.classList.remove('reward-toast--visible');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 1500);
  }

  function fireConfetti() {
    const colors = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'];
    const container = document.createElement('div');
    container.className = 'reward-confetti-container';
    document.body.appendChild(container);

    for (let i = 0; i < 20; i++) {
      const piece = document.createElement('span');
      piece.className = 'reward-confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.backgroundColor = colors[i % colors.length];
      piece.style.animationDelay = Math.random() * 0.3 + 's';
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(piece);
    }

    setTimeout(() => container.remove(), 1800);
  }

  function celebrate() {
    const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    showToast(message);
    fireConfetti();
  }

  return { celebrate };
})();
