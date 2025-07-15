const board = document.getElementById("game-board");
const scoreEl = document.getElementById("score");
const blockPicker = document.getElementById("block-picker");
const gameOverModal = document.getElementById("game-over");

const boardSize = 10;
const cellSize = 40; // in px for snap calculation
let score = 0;
let grid = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
let currentBlocks = [];

// All shape variations
const BLOCK_SHAPES = [
  [[1]],
  [[1, 1]],
  [[1], [1]],
  [[1, 1], [1, 1]],
  [[1, 1, 1]],
  [[1], [1], [1]],
  [[1, 0], [1, 1]],
  [[0, 1], [1, 1]],
  [[1, 1, 1], [0, 1, 0]]
];

// 🎯 Generate empty board
function renderBoard() {
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${boardSize}, minmax(0, 1fr))`;

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = document.createElement("div");
      cell.className = `w-[40px] h-[40px] rounded border ${grid[y][x] ? "bg-yellow-400" : "bg-slate-800 border-slate-700"}`;
      cell.dataset.x = x;
      cell.dataset.y = y;
      board.appendChild(cell);
    }
  }
}

// 🎲 Generate 3 random blocks
function generateBlocks() {
  blockPicker.innerHTML = "";
  currentBlocks = [];

  for (let i = 0; i < 3; i++) {
    const shape = JSON.parse(JSON.stringify(BLOCK_SHAPES[Math.floor(Math.random() * BLOCK_SHAPES.length)]));
    currentBlocks.push(shape);
    renderBlock(shape, i);
  }
}

// 🎨 Render a block to picker
function renderBlock(shape, index) {
  const block = document.createElement("div");
  block.className = "flex flex-col gap-0.5 cursor-pointer p-1 bg-slate-800 rounded";
  block.draggable = true;
  block.dataset.index = index;

  shape.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "flex gap-0.5";
    row.forEach(cell => {
      const cellDiv = document.createElement("div");
      cellDiv.className = `w-[40px] h-[40px] rounded ${cell ? "bg-pink-400" : "bg-transparent"}`;

      rowDiv.appendChild(cellDiv);
    });
    block.appendChild(rowDiv);
  });

  block.addEventListener("dragstart", e => {
    e.dataTransfer.setData("blockIndex", index);
  });

  block.addEventListener("click", () => {
    alert("Tap a square to place the block.");
    selectedBlockIndex = index;
  });

  blockPicker.appendChild(block);
}

// 🧠 Validate if shape can be placed at x, y
function canPlaceBlock(shape, x, y) {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j]) {
        let yy = y + i;
        let xx = x + j;
        if (
          yy >= boardSize || xx >= boardSize ||
          grid[yy][xx] !== 0
        ) return false;
      }
    }
  }
  return true;
}

// ✅ Place shape on board
function placeBlock(shape, x, y) {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j]) {
        grid[y + i][x + j] = 1;
      }
    }
  }
  updateScore(5); // base score
  renderBoard();
  clearLines();
}

// 🧹 Clear filled rows or columns
function clearLines() {
  let cleared = 0;

  // Clear rows
  for (let y = 0; y < boardSize; y++) {
    if (grid[y].every(cell => cell === 1)) {
      grid[y].fill(0);
      cleared++;
    }
  }

  // Clear columns
  for (let x = 0; x < boardSize; x++) {
    let colFull = true;
    for (let y = 0; y < boardSize; y++) {
      if (grid[y][x] !== 1) {
        colFull = false;
        break;
      }
    }
    if (colFull) {
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

  // After placement & line clear
  currentBlocks = currentBlocks.filter(b => b !== null); // remove used
  if (currentBlocks.length === 0) generateBlocks(); // next round

  if (isGameOver()) {
    gameOverModal.classList.remove("hidden");
  }
}

// 🧮 Update score display
function updateScore(points) {
  score += points;
  scoreEl.textContent = `Score: ${score}`;
}

// 🚫 Check if any of the current blocks can be placed
function isGameOver() {
  for (let shape of currentBlocks) {
    for (let y = 0; y <= boardSize - shape.length; y++) {
      for (let x = 0; x <= boardSize - shape[0].length; x++) {
        if (canPlaceBlock(shape, x, y)) return false;
      }
    }
  }
  return true;
}

// 🎯 Handle dropping block on board
board.addEventListener("dragover", e => e.preventDefault());

board.addEventListener("drop", e => {
  const rect = board.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;
  const gridX = Math.floor(offsetX / cellSize);
  const gridY = Math.floor(offsetY / cellSize);

  const index = parseInt(e.dataTransfer.getData("blockIndex"));
  const shape = currentBlocks[index];

  if (canPlaceBlock(shape, gridX, gridY)) {
    placeBlock(shape, gridX, gridY);
    currentBlocks[index] = null;
    blockPicker.children[index].style.visibility = "hidden";
  } else {
    alert("Invalid placement!");
  }
});

function initGame() {
  score = 0;
  grid = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
  renderBoard();
  generateBlocks();
  updateScore(0);
}

initGame();
