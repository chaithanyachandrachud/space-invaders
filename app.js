// Select the game grid
const grid = document.querySelector('.grid');
const cells = [];

// Create grid cells (15x15 = 225 cells)
for (let i = 0; i < 225; i++) {
    const cell = document.createElement('div');
    grid.appendChild(cell);
    cells.push(cell);
}

// Shooter Setup
let shooterIndex = 217; // Start position (bottom-center of the grid)
cells[shooterIndex].classList.add('shooter');

// Enemy Setup
let invaderIndices = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    16, 17, 18, 19, 20,
    31, 32, 33, 34, 35,
];

// Boss Setup
let bossIndex = -1; // Boss is initially not active

// Level Setup
let level = 1;
let invaderSpeed = 1000; // Speed of invader movement in ms
let invaderInterval;

// Move Shooter with Arrow Keys
document.addEventListener('keydown', (e) => {
    cells[shooterIndex].classList.remove('shooter');
    if (e.key === 'ArrowLeft' && shooterIndex % 15 !== 0) {
        shooterIndex -= 1; // Move left
    } else if (e.key === 'ArrowRight' && shooterIndex % 15 < 14) {
        shooterIndex += 1; // Move right
    }
    cells[shooterIndex].classList.add('shooter');
});

// Animate Invaders
function moveInvaders() {
    const reachedBottom = invaderIndices.some(index => index >= 210); // Check if invaders reach bottom
    if (reachedBottom) {
        alert('Game Over! Invaders reached the bottom.');
        clearInterval(invaderInterval);
        return;
    }

    invaderIndices.forEach(index => cells[index].classList.remove('invader')); // Remove current invader positions

    for (let i = 0; i < invaderIndices.length; i++) {
        invaderIndices[i] += 15; // Move down one row
    }

    invaderIndices.forEach(index => cells[index].classList.add('invader')); // Add invaders at new positions

    // Check for Boss Appearance
    if (invaderIndices.length === 0 && bossIndex === -1) {
        spawnBoss();
    }
}

// Spawn Boss Enemy
function spawnBoss() {
    bossIndex = 112; // Position of the boss
    cells[bossIndex].classList.add('boss');
    level += 1;
    invaderSpeed -= 200; // Increase speed with each level
    invaderInterval = setInterval(moveInvaders, invaderSpeed); // Update speed
}

// Shoot Bullets
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') { // Spacebar to shoot
        let bulletIndex = shooterIndex - 15; // Bullet starts from just above the shooter

        function moveBullet() {
            if (bulletIndex < 0) {
                clearInterval(bulletInterval); // Stop bullet when it leaves the grid
                return;
            }

            cells[bulletIndex].classList.remove('bullet'); // Remove bullet from current position

            if (cells[bulletIndex].classList.contains('invader')) {
                cells[bulletIndex].classList.remove('invader'); // Remove invader
                invaderIndices = invaderIndices.filter(index => index !== bulletIndex); // Remove invader index
                updateScore(); // Update score
                clearInterval(bulletInterval); // Stop bullet
                checkWin(); // Check for win condition
                return;
            }

            if (bulletIndex === bossIndex) {
                cells[bossIndex].classList.remove('boss'); // Remove boss
                bossIndex = -1; // Boss is defeated
                updateScore();
                clearInterval(bulletInterval);
                checkWin();
                return;
            }

            bulletIndex -= 15; // Move bullet upward
            if (bulletIndex >= 0) {
                cells[bulletIndex]?.classList.add('bullet'); // Add bullet to new position
            }
        }

        const bulletInterval = setInterval(moveBullet, 100); // Move bullet every 100ms
    }
});

// Score Tracking
let score = 0;
function updateScore() {
    score += 10;
    console.log('Score:', score);
}

// Check Win Condition
function checkWin() {
    if (invaderIndices.length === 0 && bossIndex === -1) {
        alert('You Win! 🎉');
        clearInterval(invaderInterval); // Stop invader animation
    }
}

// Timer Setup
let timeLeft = 20; // Time in seconds
const timeDisplay = document.getElementById('time-left');
let timerInterval;

// Start the game timer
function startTimer() {
    timerInterval = setInterval(function() {
        if (timeLeft > 0) {
            timeLeft--;
            timeDisplay.textContent = timeLeft; // Update the displayed time
        } else {
            clearInterval(timerInterval);
            gameOver("Time's up!"); // End the game if time runs out
        }
    }, 1000); // Update every second
}

// Call startTimer when the game starts
startTimer();

// Call this function when the game ends (either win or lose)
function gameOver(message) {
    alert(message);
    clearInterval(timerInterval); // Stop the timer when the game ends
}

// Start the invader movement and level progression
invaderInterval = setInterval(moveInvaders, invaderSpeed);
   