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
        if (this.color === '') return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x * marbleSize + marbleSize / 2, this.y * marbleSize + marbleSize / 2, marbleSize / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initializeMarbles() {
    marbles.length = 0;
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            marbles.push(new Marble(x, y, color));
        }
    }
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

function getMarble(x, y) {
    return marbles.find(m => m.x === x && m.y === y);
}

function checkMatch(x, y) {
    if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return false;
    const marble = getMarble(x, y);
    if (!marble || marble.color === '') return false;

    const targetColor = marble.color;
    let matched = [];
    const visited = new Set();

    function dfs(cx, cy) {
        const key = `${cx},${cy}`;
        if (cx < 0 || cx >= gridWidth || cy < 0 || cy >= gridHeight || visited.has(key)) return;
        const m = getMarble(cx, cy);
        if (!m || m.color !== targetColor) return;

        visited.add(key);
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
    for (let x = 0;
::contentReference[oaicite:0]{index=0}
 
