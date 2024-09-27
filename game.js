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
