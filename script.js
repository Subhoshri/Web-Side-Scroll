const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score'); // Access the score display element

// Setting canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let player = {
    x: canvas.width / 2, // Center horizontally
    y: canvas.height / 2, // Center vertically
    width: 50,
    height: 50,
    speed: 3, // Constant forward speed
    dy: 0 // Vertical speed initialized to 0
};
let scrollOffset = 0;
const groundHeight = 100; // Height of the ground on top and bottom
let isGameStarted = false; // Control when the game starts
let isGameOver = false; // Track game over state
let score = 0; // Score variable
let scoreIncrementRate = 1; // How fast the score increases (changeable)

// Start button event listener
startButton.addEventListener('click', startGame);

// Keyboard events for vertical movement (Arrow keys and W/S keys)
document.addEventListener('keydown', (e) => {
    if (isGameStarted && !isGameOver) {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') player.dy = -player.speed;
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') player.dy = player.speed;
    }
});

document.addEventListener('keyup', (e) => {
    if (isGameStarted && !isGameOver) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S') {
            player.dy = 0;
        }
    }
});

// Function to start the game
function startGame() {
    isGameStarted = true;
    isGameOver = false;
    startButton.style.display = 'none'; // Hide the start button
    score = 0; // Reset score
    player.y = canvas.height / 2; // Reset player position
    player.dy = 0; // Reset vertical speed to 0
    scrollOffset = 0; // Reset scroll offset
    update(); // Start the game loop
}

// Function to handle game over
function gameOver() {
    isGameOver = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Display game over screen
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 50);
    ctx.fillText(`Final Score: ${Math.floor(score)}`, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText("Press Start to Play Again", canvas.width / 2, canvas.height / 2 + 70);
    
    startButton.style.display = 'block'; // Show the start button again
}

// Update player position, background, and score
function update() {
    if (!isGameStarted || isGameOver) return; // Prevent the game loop from running if the game isn't started or it's game over

    player.y += player.dy;
    scrollOffset += player.speed; // Constant forward movement

    // Update the score continuously
    score += scoreIncrementRate / 60; // Increment score (assuming 60 frames per second)
    scoreDisplay.innerText = Math.floor(score); // Display the integer value of score

    // Boundaries for vertical movement
    if (player.y < groundHeight || player.y + player.height > canvas.height - groundHeight) {
        // Player has touched the ground (either top or bottom)
        gameOver(); // Trigger game over
        return;
    }

    draw();
    requestAnimationFrame(update);
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background (scrolling to the left to simulate forward movement)
    ctx.fillStyle = '#98FB98'; // light green for ground
    // Draw ground at the bottom
    ctx.fillRect(-scrollOffset, canvas.height - groundHeight, canvas.width * 2, groundHeight);
    // Draw ground at the top
    ctx.fillRect(-scrollOffset, 0, canvas.width * 2, groundHeight);

    // Player character
    ctx.fillStyle = '#FF6347'; // tomato color
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Initially, the game is not running until the start button is clicked.
