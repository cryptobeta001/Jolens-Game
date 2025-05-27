let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1;
let level = 1;
let gameOver = false;

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const matchSound = document.getElementById('match-sound');
const winSound = document.getElementById('win-sound');

const colors = ['#FF0000', '#0000FF', '#FFFF00', '#008000'];
const marbles = [];
const gridWidth = 10;
const gridHeight = 10;
const marbleSize = 40;

class Marble {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x * marbleSize + marbleSize / 2, this.y * marbleSize + marbleSize / 2, marbleSize / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initializeMarbles() {
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            marbles.push(new Marble(x, y, color));
        }
    }
}

function drawGrid() {
    ctx.strokeStyle = '#000';
    for (let x = 0; x <= gridWidth; x++) {
        ctx.beginPath();
        ctx.moveTo(x * marbleSize, 0);
        ctx.lineTo(x * marbleSize, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= gridHeight; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * marbleSize);
        ctx.lineTo(canvas.width, y * marbleSize);
        ctx.stroke();
    }
}

function drawMarbles() {
    marbles.forEach(marble => marble.draw());
}

function updateScores() {
    document.getElementById('player1-score-value').innerText = player1Score;
    document.getElementById('player2-score-value').innerText = player2Score;
    document.getElementById('level-value').innerText = level;
}

function checkMatch(x, y) {
    if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return false;
    const marble = marbles.find(m => m.x === x && m.y === y);
    if (!marble || marble.color === '') return false;

    const targetColor = marble.color;
    let matched = [];
    const visited = new Set();

    function dfs(cx, cy) {
        if (cx < 0 || cx >= gridWidth || cy < 0 || cy >= gridHeight) return;
        if (visited.has(`${cx},${cy}`)) return;
        const m = marbles.find(m => m.x === cx && m.y === cy);
        if (!m || m.color !== targetColor) return;

        visited.add(`${cx},${cy}`);
        matched.push(m);

        dfs(cx + 1, cy);
        dfs(cx - 1, cy);
        dfs(cx, cy + 1);
        dfs(cx, cy - 1);
    }

    dfs(x, y);

    if (matched.length >= 3) {
        matched.forEach(m => m.color = '');
        playMatchSound();
        return true;
    }

    return false;
}

function clearEmptySpaces() {
    for (let x = 0; x < gridWidth; x++) {
        let emptyCount = 0;
        for (let y = gridHeight - 1; y >= 0; y--) {
            if (marbles[y * gridWidth + x].color === '') {
                emptyCount++;
            } else if (emptyCount > 0) {
                marbles[(y + emptyCount) * gridWidth + x].color = marbles[y * gridWidth + x].color;
                marbles[y * gridWidth + x].color = '';
            }
        }
    }

    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < emptyCount; y++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            marbles[y * gridWidth + x] = new Marble(x, y, color);
        }
    }
}

function playMatchSound() {
    matchSound.currentTime = 0;
    matchSound.play();
}

function playWinSound() {
    winSound.currentTime = 0;
    winSound.play();
}

function updateGame() {
    drawGrid();
    drawMarbles();
    updateScores();

    if (gameOver) return;

    requestAnimationFrame(updateGame);
}

function handleClick(event) {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const x = Math.floor(mouseX / marbleSize);
    const y = Math.floor(mouseY / marbleSize);

    if (checkMatch(x, y)) {
        clearEmptySpaces();
        if (currentPlayer === 1) {
            player1Score++;
        } else {
            player2Score++;
        }
        level++;
        if (level > 100) {
            gameOver = true;
            document.getElementById('result').innerText = currentPlayer === 1 ? 'Player 1 wins!' : 'Player 2 wins!';
            playWinSound();
        }
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }
}

function resetGame() {
    gameOver = false;
    player1Score = 0;
    player2Score = 0;
    level = 1;
    currentPlayer = 1;
    marbles.length = 0;
    document.getElementById('result').innerText = '';
    playMatchSound();
    initializeMarbles();
    updateGame();
}

canvas.addEventListener('click', handleClick);
document.getElementById('reset-button').addEventListener('click', resetGame);

initializeMarbles();
updateGame();
