const board = document.getElementById("game-board");
const scoreEl = document.getElementById("score");
const blockPicker = document.getElementById("block-picker");
const gameOverModal = document.getElementById("game-over");

const boardSize = 10;
let score = 0;
let grid = Array(boardSize).fill().map(() => Array(boardSize).fill(0));

function updateScore(points) {
  score += points;
  scoreEl.textContent = `Score: ${score}`;
}

function renderBoard() {
  board.innerHTML = "";
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = document.createElement("div");
      cell.className = `w-6 h-6 sm:w-8 sm:h-8 rounded ${grid[y][x] ? "bg-yellow-400" : "bg-slate-800"}`;
      board.appendChild(cell);
    }
  }
}

function clearLines() {
  let cleared = 0;

  // Clear rows
  for (let y = 0; y < boardSize; y++) {
    if (grid[y].every(cell => cell)) {
      grid[y].fill(0);
      cleared++;
    }
  }

  // Clear columns
  for (let x = 0; x < boardSize; x++) {
    if (grid.every(row => row[x])) {
      for (let y = 0; y < boardSize; y++) {
        grid[y][x] = 0;
      }
      cleared++;
    }
  }

  if (cleared) {
    updateScore(cleared * 10);
    renderBoard();
  }
}

function generateBlock() {
  const block = document.createElement("div");
  block.className = "w-16 h-16 bg-pink-400 rounded shadow-lg cursor-pointer";
  block.draggable = true;
  block.addEventListener("dragstart", () => {
    block.classList.add("opacity-50");
  });
  block.addEventListener("dragend", () => {
    block.classList.remove("opacity-50");
  });
  block.addEventListener("click", () => {
    placeBlock(0, 0); // simple fallback
  });

  blockPicker.appendChild(block);
}

function placeBlock(x, y) {
  if (grid[y][x] === 0) {
    grid[y][x] = 1;
    renderBoard();
    clearLines();
    generateBlock(); // new block
  } else {
    checkGameOver();
  }
}

function checkGameOver() {
  if (grid.every(row => row.every(cell => cell))) {
    gameOverModal.classList.remove("hidden");
  }
}

function initGame() {
  renderBoard();
  generateBlock();
}

initGame();
