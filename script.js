// ======= State =======
let players = { p1: "", p2: "" }; 
let turn = "x"; 
let board = Array(9).fill(""); 
let gameOver = false;

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// ======= Elements =======
const startForm = document.getElementById("start-form");
const p1Input = document.getElementById("player-1");
const p2Input = document.getElementById("player-2");
const gameEl = document.getElementById("game");
const msgEl = gameEl.querySelector(".message");
const cells = Array.from(document.querySelectorAll(".cell"));

// ======= Helpers =======
const nameFor = (mark) => (mark === "x" ? players.p1 : players.p2);

function setTurnMessage() {
  msgEl.textContent = `${nameFor(turn)}, you're up`;
}

function setWinMessage(mark) {
  msgEl.textContent = `${nameFor(mark)}, congratulations you won!`;
}

function checkWinner() {
  for (const [a,b,c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return { mark: board[a], line: [a,b,c] };
    }
  }
  return null;
}

function highlight(line) {
  line.forEach(i => document.getElementById(String(i + 1)).classList.add("winner"));
}

function endGame() {
  gameOver = true;
  cells.forEach(btn => btn.disabled = true);
}

// ======= Start form submit =======
startForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const p1 = p1Input.value.trim();
  const p2 = p2Input.value.trim();
  if (!p1 || !p2) {
    alert("Please enter both player names.");
    return;
  }

  players = { p1, p2 };

  startForm.classList.add("hidden");
  gameEl.classList.remove("hidden");

  turn = "x";
  gameOver = false;
  board = Array(9).fill("");

  cells.forEach((c) => {
    c.textContent = "";
    c.classList.remove("winner");
    c.disabled = false;
  });

  setTurnMessage();
});

// ======= Cell click handling =======
cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    if (gameOver) return;

    const idx = Number(cell.id) - 1;
    if (board[idx] !== "") return;

    board[idx] = turn;
    cell.textContent = turn;
    cell.disabled = true;

    const result = checkWinner();
    if (result) {
      highlight(result.line);
      setWinMessage(result.mark);
      endGame();
      return;
    }

    if (board.every(v => v)) {
      msgEl.textContent = "It's a draw!";
      endGame();
      return;
    }

    turn = turn === "x" ? "o" : "x";
    setTurnMessage();
  });
});
