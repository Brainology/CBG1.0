const gameBoard = document.getElementById('game-board');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');

let currentLevel = 1;
let currentScore = 0;
let gridSize = 2;
let roundsLeft = 5;

// Retrieve saved game state from localStorage
const savedState = JSON.parse(localStorage.getItem('gameState')) || {};
if (savedState.currentLevel) {
  currentLevel = savedState.currentLevel;
  currentScore = savedState.currentScore;
  gridSize = savedState.gridSize;
  roundsLeft = savedState.roundsLeft;
}

function initializeGame() {
  levelDisplay.innerText = `Level: ${currentLevel}`;
  scoreDisplay.innerText = `Score: ${currentScore}`;
  generateGrid(gridSize);
}

function generateGrid(size) {
  gameBoard.innerHTML = '';
  gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  
  const totalTiles = size * size;
  const specialTileIndex = Math.floor(Math.random() * totalTiles);

  // Generate tiles with one special tile
  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    
    if (i === specialTileIndex) {
      tile.style.backgroundColor = 'rgb(100, 100, 100)'; // Slightly different color
      tile.dataset.special = 'true';
    } else {
      tile.style.backgroundColor = 'rgb(120, 120, 120)';
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
      currentLevel++;
      roundsLeft = currentLevel > 3 ? currentLevel * 2 + 1 : 5;
      gridSize = currentLevel <= 3 ? gridSize + 1 : gridSize;
    }

    updateGameState();
    initializeGame();
  } else {
    // Wrong choice
    alert('Wrong tile! Try again.');
  }
}

function updateGameState() {
  localStorage.setItem('gameState', JSON.stringify({
    currentLevel,
    currentScore,
    gridSize,
    roundsLeft
  }));
}

// Share the score
document.getElementById('share-btn').addEventListener('click', () => {
  const shareText = `I reached level ${currentLevel} with a score of ${currentScore} in the Colorblind Test Game! Try it yourself: https://yourwebsite.com/`;
  if (navigator.share) {
    navigator.share({
      title: 'Colorblind Test Game',
      text: shareText,
      url: window.location.href
    });
  } else {
    // Fallback for unsupported browsers
    alert('Share feature not supported on your browser.');
  }
});

initializeGame();
