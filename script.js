const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score'); // Access the score display element

// Setting canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let player = {
    x: canvas.width / 4.5, // Center horizontally
    y: canvas.height / 2, // Center vertically
    width: 50,
    height: 50,
    speed: 3, // Constant forward speed
    dy: 0 // Vertical speed initialized to 0
};
let scrollOffset = 0;
const groundHeight = 0; // Height of the ground on top and bottom
let isGameStarted = false; // Control when the game starts
let isGameOver = false; // Track game over state
let score = 0; // Score variable
let scoreIncrementRate = 1; // How fast the score increases (changeable)

// Pipe variables
let pipes = []; // Array to hold pipe objects
const PIPE_WIDTH = 50; // Width of the pipe
const PIPE_GAP = 150; // Space between the top and bottom pipes
const PIPE_FREQUENCY = 90; // How frequently pipes spawn (in frames)
let frameCount = 0; // Frame counter for pipe generation

// Variable to keep track of the last speed increase
let lastSpeedIncrease = 0;

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
    pipes = []; // Reset pipes
    frameCount = 0; // Reset frame count
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
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 100);
    ctx.fillText(`Final Score: ${Math.floor(score)}`, canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillText("Press Start to Play Again", canvas.width / 2, canvas.height / 2 + 70);
    
    startButton.style.display = 'block'; // Show the start button again
}

// Update player position, background, and score
function update() {
    if (!isGameStarted || isGameOver) return; // Prevent the game loop from running if the game isn't started or it's game over

    player.y += player.dy;
    scrollOffset += player.speed; // Constant forward movement

    // Update the score continuously
    score += scoreIncrementRate / 20; // Increment score (assuming 60 frames per second)
    scoreDisplay.innerText = Math.floor(score); // Display the integer value of score

    // Pipe generation logic
    frameCount++;
    if (frameCount % PIPE_FREQUENCY === 0) {
        const pipeHeight = Math.random() * (canvas.height - PIPE_GAP - groundHeight * 2) + groundHeight; // Random height for pipes
        pipes.push({ x: canvas.width, y: pipeHeight }); // Create a new pipe with a random height
    }

    // Move pipes to the left
    pipes.forEach(pipe => {
        pipe.x -= player.speed; // Move pipe left based on player speed
    });

    // Check for collision with pipes
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        if (
            player.x < pipe.x + PIPE_WIDTH &&
            player.x + player.width > pipe.x &&
            (player.y < pipe.y || player.y + player.height > pipe.y + PIPE_GAP)
        ) {
            gameOver(); // Trigger game over if a collision is detected
            return;
        }
    }

    // Remove pipes that have gone off screen
    pipes = pipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);

    // Check for score increment based on pipe passing
    pipes.forEach(pipe => {
        if (pipe.x + PIPE_WIDTH < player.x && !pipe.scored) {
            score += 1; // Increment score for each pipe passed
            pipe.scored = true; // Mark pipe as scored
        }
    });

    // Check if the score has crossed a multiple of 100
    if (Math.floor(score / 100) > lastSpeedIncrease) {
        player.speed += 1; // Increase speed
        scoreIncrementRate += 0.5; // Increase score increment rate
        lastSpeedIncrease++; // Update the last speed increase
    }

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

    // Draw pipes
    pipes.forEach(pipe => {
        ctx.fillStyle = '#228B22'; // green color for pipes
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.y); // Top pipe
        ctx.fillRect(pipe.x, pipe.y + PIPE_GAP, PIPE_WIDTH, canvas.height - pipe.y - PIPE_GAP); // Bottom pipe
    });

    // Check if the ground has scrolled out of view and reset scrollOffset
    if (scrollOffset >= canvas.width) {
        scrollOffset = 0; // Reset to create an endless effect
    }

    // Player character
    ctx.fillStyle = '#FF6347'; // tomato color
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Initially, the game is not running until the start button is clicked.
