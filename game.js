const gameBoard = document.getElementById('game-board');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const gameArea = document.getElementById('game-area');
const endScreen = document.getElementById('end-screen');
const shareBtn = document.getElementById('share-btn');
const restartBtn = document.getElementById('restart-btn');
const toggleModeBtn = document.getElementById('toggle-mode-btn');
let currentLevel = 1;
let currentScore = 0;
let gridSize = 2;
let roundsLeft = 5;

function initializeGame() {
  levelDisplay.innerText = `Level: ${currentLevel}`;
  scoreDisplay.innerText = `Score: ${currentScore}`;
  generateGrid(gridSize);
  endScreen.style.display = 'none'; // Hide end screen
}

function generateGrid(size) {
  gameBoard.innerHTML = '';
  gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  const totalTiles = size * size;
  const specialTileIndex = Math.floor(Math.random() * totalTiles);

  // Generate a base color for the level
  const hue = (currentLevel * 15) % 360; // Cycles through different hues
  const baseColor = `hsl(${hue}, 50%, 60%)`;  // Base color for the level
  const specialColor = `hsl(${hue}, 50%, 55%)`; // Slightly darker shade

  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');

    if (i === specialTileIndex) {
      tile.style.backgroundColor = specialColor; // Special tile with darker shade
      tile.dataset.special = 'true';
    } else {
      tile.style.backgroundColor = baseColor; // Normal tiles
    }

    tile.addEventListener('click', handleTileClick);
    gameBoard.appendChild(tile);
  }
}

function handleTileClick(e) {
  const clickedTile = e.target;
  if (clickedTile.dataset.special === 'true') {
    currentScore++;
    roundsLeft--;

    if (roundsLeft === 0) {
      if (currentLevel >= 150) {
        endGame(); // Game Over
      } else {
        currentLevel++;
        roundsLeft = currentLevel > 3 ? currentLevel * 2 + 1 : 5;
        gridSize = currentLevel <= 3 ? gridSize + 1 : gridSize;
        initializeGame();
      }
    } else {
      initializeGame();
    }
  } else {
    alert('Wrong tile! Game Over.');
    endGame(); // End game on wrong click
  }
}

function endGame() {
  // Disable further clicks on tiles by removing event listeners
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach(tile => {
    tile.style.pointerEvents = 'none'; // Disable clicking
  });

  // Show end game options (share and restart)
  endScreen.style.display = 'block'; 
  gameArea.style.opacity = '0.5'; // Dim the game area for a frozen effect

  // Show browser notification
  if (window.Notification && Notification.permission === "granted") {
    new Notification(`Game Over! Your final score is ${currentScore}`);
  } else if (window.Notification && Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(`Game Over! Your final score is ${currentScore}`);
      }
    });
  }
}

function restartGame() {
  currentLevel = 1;
  currentScore = 0;
  gridSize = 2;
  roundsLeft = 5;
  gameArea.style.display = 'block';
  initializeGame();
}

function startGame() {
  startScreen.style.display = 'none'; // Hide start screen
  gameArea.style.display = 'block';  // Show game area
  initializeGame();
}

// Start the game when the "Start Game" button is clicked
document.getElementById('start-btn').addEventListener('click', startGame);

// Restart the game when the "Restart Game" button is clicked
restartBtn.addEventListener('click', restartGame);

// Share the score when the "Share Score" button is clicked
shareBtn.addEventListener('click', () => {
  const shareText = `I reached level ${currentLevel} with a score of ${currentScore} in the Colorblind Test Game! Try it yourself: https://yourwebsite.com/`;
  if (navigator.share) {
    navigator.share({
      title: 'Colorblind Test Game',
      text: shareText,
      url: window.location.href
    });
  } else {
    alert('Share feature not
