// Memory Card Game Logic
const gameIcons = ['💕', '💖', '💗', '💝', '💞', '💓', '💘', '❤️'];
let cards = [...gameIcons, ...gameIcons];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;

// Shuffle array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Create game board
function createBoard() {
  const board = document.getElementById('game-board');
  if (!board) return;
  
  board.innerHTML = '';
  cards = shuffle([...gameIcons, ...gameIcons]);
  
  cards.forEach((icon, index) => {
    const card = document.createElement('div');
    card.className = 'game-card aspect-square rounded-xl border-2 border-slate-700/80 bg-gradient-to-br from-slate-800/90 to-black/90 backdrop-blur-sm cursor-pointer flex items-center justify-center text-3xl md:text-4xl transition-all duration-300 hover:border-pink-400/60 hover:scale-105';
    card.dataset.icon = icon;
    card.dataset.index = index;
    card.innerHTML = '<span class="card-icon opacity-0">?</span>';
    
    card.addEventListener('click', () => flipCard(card));
    board.appendChild(card);
  });
}

// Start timer
function startTimer() {
  if (gameStarted) return;
  gameStarted = true;
  
  timerInterval = setInterval(() => {
    timer++;
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

// Flip card
function flipCard(card) {
  if (flippedCards.length >= 2) return;
  if (card.classList.contains('flipped')) return;
  if (card.classList.contains('matched')) return;
  
  if (!gameStarted) startTimer();
  
  card.classList.add('flipped');
  card.style.background = 'linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.3))';
  card.style.borderColor = 'rgba(236, 72, 153, 0.8)';
  card.style.transform = 'scale(1.05) rotateY(180deg)';
  
  const iconSpan = card.querySelector('.card-icon');
  iconSpan.textContent = card.dataset.icon;
  iconSpan.style.opacity = '1';
  
  flippedCards.push(card);
  
  if (flippedCards.length === 2) {
    moves++;
    document.getElementById('moves').textContent = moves;
    setTimeout(checkMatch, 600);
  }
}

// Check if cards match
function checkMatch() {
  const [card1, card2] = flippedCards;
  
  if (card1.dataset.icon === card2.dataset.icon) {
    // Match!
    card1.classList.add('matched');
    card2.classList.add('matched');
    card1.style.background = 'linear-gradient(135deg, rgba(134, 239, 172, 0.3), rgba(59, 130, 246, 0.3))';
    card2.style.background = 'linear-gradient(135deg, rgba(134, 239, 172, 0.3), rgba(59, 130, 246, 0.3))';
    card1.style.borderColor = 'rgba(134, 239, 172, 0.8)';
    card2.style.borderColor = 'rgba(134, 239, 172, 0.8)';
    card1.style.transform = 'scale(1)';
    card2.style.transform = 'scale(1)';
    
    matchedPairs++;
    
    if (matchedPairs === gameIcons.length) {
      setTimeout(gameWon, 500);
    }
  } else {
    // No match
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      card1.style.background = 'linear-gradient(to bottom right, rgba(30, 41, 59, 0.9), rgba(0, 0, 0, 0.9))';
      card2.style.background = 'linear-gradient(to bottom right, rgba(30, 41, 59, 0.9), rgba(0, 0, 0, 0.9))';
      card1.style.borderColor = 'rgba(51, 65, 85, 0.8)';
      card2.style.borderColor = 'rgba(51, 65, 85, 0.8)';
      card1.style.transform = 'scale(1)';
      card2.style.transform = 'scale(1)';
      
      const icon1 = card1.querySelector('.card-icon');
      const icon2 = card2.querySelector('.card-icon');
      icon1.textContent = '?';
      icon2.textContent = '?';
      icon1.style.opacity = '0';
      icon2.style.opacity = '0';
    }, 400);
  }
  
  flippedCards = [];
}

// Game won
function gameWon() {
  clearInterval(timerInterval);
  
  const modal = document.getElementById('win-modal');
  document.getElementById('final-moves').textContent = moves;
  document.getElementById('final-time').textContent = timer;
  
  // Save score
  saveScore(moves, timer);
  
  // Show modal with animation
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.style.opacity = '1';
    modal.querySelector('.punk-border').style.transform = 'scale(1)';
  }, 10);
  
  // Confetti effect
  createConfetti();
}

// Create confetti
function createConfetti() {
  const colors = ['#ff2e88', '#ffe800', '#31ff6a', '#3ae4ff'];
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.opacity = '1';
    confetti.style.borderRadius = '50%';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    document.body.appendChild(confetti);
    
    const fallDuration = 2 + Math.random() * 3;
    const fallDistance = 100 + Math.random() * 20;
    const drift = (Math.random() - 0.5) * 100;
    
    confetti.animate([
      { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 1 },
      { transform: `translateY(${fallDistance}vh) translateX(${drift}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
      duration: fallDuration * 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    setTimeout(() => confetti.remove(), fallDuration * 1000);
  }
}

// Save score to localStorage
function saveScore(moves, time) {
  const scores = JSON.parse(localStorage.getItem('mpey-eidiel-game-scores') || '[]');
  const newScore = {
    moves,
    time,
    date: new Date().toISOString(),
    timestamp: Date.now()
  };
  
  scores.push(newScore);
  scores.sort((a, b) => {
    if (a.moves === b.moves) return a.time - b.time;
    return a.moves - b.moves;
  });
  
  localStorage.setItem('mpey-eidiel-game-scores', JSON.stringify(scores.slice(0, 10)));
  loadScores();
}

// Load scores
function loadScores() {
  const scoreList = document.getElementById('score-list');
  if (!scoreList) return;
  
  const scores = JSON.parse(localStorage.getItem('mpey-eidiel-game-scores') || '[]');
  
  if (scores.length === 0) {
    scoreList.innerHTML = '<p class="text-[0.7rem] text-slate-400 ticket-card p-4">Belum ada yang bermain. Jadilah yang pertama!</p>';
    return;
  }
  
  scoreList.innerHTML = scores.slice(0, 10).map((score, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
    const date = new Date(score.date);
    const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    
    return `
      <div class="ticket-card p-4 flex items-center justify-between gap-4 animate-float-up visible">
        <div class="flex items-center gap-3">
          <span class="text-xl">${medal}</span>
          <div class="text-xs">
            <p class="font-semibold text-slate-100">${score.moves} gerakan • ${Math.floor(score.time / 60)}:${(score.time % 60).toString().padStart(2, '0')}</p>
            <p class="text-[0.65rem] text-slate-400 mt-0.5">${dateStr}</p>
          </div>
        </div>
        ${index < 3 ? '<span class="text-[0.65rem] uppercase tracking-[0.18em] text-yellow-400">Top Player</span>' : ''}
      </div>
    `;
  }).join('');
}

// Reset game
function resetGame() {
  clearInterval(timerInterval);
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  timer = 0;
  gameStarted = false;
  
  document.getElementById('moves').textContent = '0';
  document.getElementById('timer').textContent = '0:00';
  document.getElementById('game-status').textContent = '';
  
  createBoard();
}

// Initialize game on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('game-board')) {
    createBoard();
    loadScores();
    
    // Restart button
    document.getElementById('restart-btn')?.addEventListener('click', resetGame);
    
    // Close modal
    document.getElementById('close-modal')?.addEventListener('click', () => {
      const modal = document.getElementById('win-modal');
      modal.style.opacity = '0';
      modal.querySelector('.punk-border').style.transform = 'scale(0.9)';
      setTimeout(() => {
        modal.classList.add('hidden');
        resetGame();
      }, 300);
    });
    
    // Clear scores
    document.getElementById('clear-scores')?.addEventListener('click', () => {
      if (confirm('Yakin ingin menghapus semua skor?')) {
        localStorage.removeItem('mpey-eidiel-game-scores');
        loadScores();
      }
    });
  }
});
