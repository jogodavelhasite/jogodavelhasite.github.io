const cells = document.querySelectorAll(".cell");
const board = document.getElementById("board");
const restartBtn = document.getElementById("restart");
const statusMessage = document.getElementById("statusMessage");
const playerVsPlayerBtn = document.getElementById("playerVsPlayer");
const playerVsBotBtn = document.getElementById("playerVsBot");
const gameBoardSection = document.querySelector(".game-board");
const gameSetupSection = document.querySelector(".game-setup");

let currentPlayer = "X";
let gameMode = ""; // "PVP" ou "BOT"
let boardState = Array(9).fill("");

function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function updateStatusMessage() {
    statusMessage.innerHTML = `
        <a href="https://joao12394.github.io" target="_blank" class="portfolio-link">
            creator susta
        </a>
    `;
}

function checkWinner() {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }

    if (boardState.every(cell => cell)) return "Empate";

    return null;
}

function makeBotMove() {
    const emptyCells = boardState
        .map((val, index) => (val === "" ? index : null))
        .filter(val => val !== null);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    boardState[emptyCells[randomIndex]] = "O";
    cells[emptyCells[randomIndex]].textContent = "O";
    cells[emptyCells[randomIndex]].classList.add("taken");
}

function handleCellClick(e) {
    const cellIndex = e.target.dataset.index;

    if (boardState[cellIndex] !== "" || checkWinner()) return;

    boardState[cellIndex] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add("taken");

    const winner = checkWinner();
    if (winner) {
        statusMessage.innerHTML = winner === "Empate" ? "Deu empate!" : `"${winner}" venceu!`;
        restartBtn.classList.remove("hidden");
        return;
    }

    if (gameMode === "BOT" && currentPlayer === "X") {
        switchPlayer();
        setTimeout(() => {
            makeBotMove();
            const winner = checkWinner();
            if (winner) {
                statusMessage.innerHTML = winner === "Empate" ? "Deu empate!" : `"${winner}" venceu!`;
                restartBtn.classList.remove("hidden");
                return;
            }
            switchPlayer();
        }, 500);
    } else {
        switchPlayer();
    }

    updateStatusMessage(); // Atualiza o link no status
}

function startGame(mode) {
    gameMode = mode;
    gameSetupSection.classList.add("hidden");
    gameBoardSection.classList.remove("hidden");
    updateStatusMessage(); // Mostra o link ao iniciar o jogo
}

function resetGame() {
    boardState = Array(9).fill("");
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("taken");
    });
    currentPlayer = "X";
    updateStatusMessage();
    restartBtn.classList.add("hidden");
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", resetGame);
playerVsPlayerBtn.addEventListener("click", () => startGame("PVP"));
playerVsBotBtn.addEventListener("click", () => startGame("BOT"));
