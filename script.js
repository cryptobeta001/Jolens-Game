let player1Score = 0;
let player2Score = 0;
let gameOver = false;

const hitSound = document.getElementById('hit-sound');
const winSound = document.getElementById('win-sound');

function playHitSound() {
    hitSound.currentTime = 0; // Rewind the sound
    hitSound.play();
}

function playWinSound() {
    winSound.currentTime = 0; // Rewind the sound
    winSound.play();
}

document.getElementById('player1-button').addEventListener('click', function() {
    if (!gameOver) {
        gameOver = true;
        player1Score++;
        document.getElementById('player1-score-value').innerText = player1Score;
        document.getElementById('result').innerText = 'Player 1 wins!';
        playHitSound();
        playWinSound();
    }
});

document.getElementById('player2-button').addEventListener('click', function() {
    if (!gameOver) {
        gameOver = true;
        player2Score++;
        document.getElementById('player2-score-value').innerText = player2Score;
        document.getElementById('result').innerText = 'Player 2 wins!';
        playHitSound();
        playWinSound();
    }
});

document.getElementById('reset-button').addEventListener('click', function() {
    gameOver = false;
    document.getElementById('result').innerText = '';
    playHitSound();
});