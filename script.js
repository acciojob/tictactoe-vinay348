// ======= State =======
let players = { p1: "", p2: "" };
let current = "X";                 // X always starts
let board = Array(9).fill("");     // indexes 0..8 map to cell ids 1..9
let isGameOver = false;

const WIN_LINES = [
  [0, 1, 2], // rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // cols
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diagonals
  [2, 4, 6]
];

// ======= Elements =======
const startForm = document.getElementById("start-form");
const name1 = document.getElementById("player-1");
const name2 = document.getElementById("player-2");
const game = document.getElementById("game");
const message = game.querySelector(".message");
const cells = Array.from(document.querySelectorAll(".cell"));
const resetBtn = document.getElementById("reset");

// ======= Helpers =======
function playerNameForMark(mark) {
  return mark === "X" ? players.p1 : players.p2;
}

function setMessageTurn() {
  message.textContent = `${playerNameForMark(current)}, you're up`;
}

function setMessageWin(winnerMark) {
  message.textContent = `${playerNameForMark(winnerMark)}, congratulations you won!`;
}

function setMessageDraw() {
  message.textContent = `It's a draw!`;
}

function renderCell(i) {
  const cell = document.getElementById(String(i + 1)); // id is 1..9
  cell.textContent = board[i];
  cell.disabled = board[i] !== "" || isGameOver;
}

// Returns {winnerMark:'X'|'O', line:[a,b,c]} or null
function checkWinner() {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return { winnerMark: board[a], line };
    }
  }
  return null;
}

function isDraw() {
  return board.every(v => v !== "");
}

function highlightWinningLine(line) {
  line.forEach(index => {
    const cell = document.getElementById(String(index + 1));
    cell.classList.add("winner");
  });
}

// ======= Event Handlers =======
startForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const p1 = name1.value.trim();
  const p2 = name2.value.trim();

  if (!p1 || !p2) {
    alert("Please enter both player names.");
    return;
    }

  players = { p1, p2 };
  // Show the game screen
  startForm.classList.add("hidden");
  game.classList.remove("hidden");

  // Initialize message and board
  current = "X";
  isGameOver = false;
  board = Array(9).fill("");
  cells.forEach((_, i) => {
    const cell = document.getElementById(String(i + 1));
    cell.textContent = "";
    cell.classList.remove("winner");
    cell.disabled = false;
  });
  setMessageTurn();
});

// Each cell click
cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    if (isGameOver) return;

    const idx = Number(cell.id) - 1; // convert id 1..9 to index 0..8
    if (board[idx] !== "") return;   // ignore already used cell

    // Place current mark
    board[idx] = current;
    renderCell(idx);

    // Check game state
    const result = checkWinner();
    if (result) {
      isGameOver = true;
      highlightWinningLine(result.line);
      setMessageWin(result.winnerMark);
      // Disable all remaining cells
      cells.forEach(c => c.disabled = true);
      return;
    }

    if (isDraw()) {
      isGameOver = true;
      setMessageDraw();
      return;
    }

    // Switch turn
    current = current === "X" ? "O" : "X";
    setMessageTurn();
  });
});

// Reset: keep names, restart game
resetBtn.addEventListener("click", () => {
  isGameOver = false;
  current = "X";
  board = Array(9).fill("");
  cells.forEach((c, i) => {
    c.textContent = "";
    c.classList.remove("winner");
    c.disabled = false;
  });
  setMessageTurn();
});
