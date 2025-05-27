let player1Score = 0;
let player2Score = 0;
let gameOver = false;

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const hitSound = document.getElementById('hit-sound');
const winSound = document.getElementById('win-sound');

const jollens = [];
const projectiles = [];

class Jollen {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.color = '#FF6347';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Projectile {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 5;
        this.size = 5;
        this.color = '#000';
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y -= Math.sin(this.angle) * this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function spawnJollen(player) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const jollen = new Jollen(x, y);
    jollen.player = player;
    jollens.push(jollen);
}

function playHitSound() {
    hitSound.currentTime = 0;
    hitSound.play();
}

function playWinSound() {
    winSound.currentTime = 0;
    winSound.play();
}

function updateScores() {
    document.getElementById('player1-score-value').innerText = player1Score;
    document.getElementById('player2-score-value').innerText = player2Score;
}

function checkCollisions() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        for (let j = jollens.length - 1; j >= 0; j--) {
            const dx = projectiles[i].x - jollens[j].x;
            const dy = projectiles[i].y - jollens[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < projectiles[i].size + jollens[j].size) {
                if (projectiles[i].player === jollens[j].player) continue;
                if (jollens[j].player === 1) {
                    player2Score++;
                } else {
                    player1Score++;
                }
                playHitSound();
                projectiles.splice(i, 1);
                jollens.splice(j, 1);
                break;
            }
        }
    }

    if (player1Score >= 10 || player2Score >= 10) {
        gameOver = true;
        if (player1Score > player2Score) {
            document.getElementById('result').innerText = 'Player 1 wins!';
        } else {
            document.getElementById('result').innerText = 'Player 2 wins!';
        }
        playWinSound();
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    jollens.forEach(jollen => jollen.draw());
    projectiles.forEach(projectile => {
        projectile.update();
        projectile.draw();
    });

    checkCollisions();

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

function shootProjectile(event, player) {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const angle = Math.atan2(canvas.height / 2 - mouseY, canvas.width / 2 - mouseX);

    const projectile = new Projectile(canvas.width / 2, canvas.height / 2, angle);
    projectile.player = player;
    projectiles.push(projectile);
}

canvas.addEventListener('click', function(event) {
    shootProjectile(event, 1);
});

canvas.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    shootProjectile(event, 2);
});

document.getElementById('reset-button').addEventListener('click', function() {
    gameOver = false;
    player1Score = 0;
    player2Score = 0;
    jollens.length = 0;
    projectiles.length = 0;
    document.getElementById('result').innerText = '';
    playHitSound();
    for (let i = 0; i < 10; i++) {
        spawnJollen(Math.random() < 0.5 ? 1 : 2);
    }
    gameLoop();
});

for (let i = 0; i < 10; i++) {
    spawnJollen(Math.random() < 0.5 ? 1 : 2);
}

gameLoop();
