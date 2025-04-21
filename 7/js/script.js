'use strict';
// Game variables and elements
const gameMenu = document.querySelector('.game-menu');
const wrapper = document.querySelector('.wrapper');
const gameScreen = document.querySelector('.game-screen');
const gamePanels = document.querySelector('.game-panels');
const gunman = document.querySelector('.gunman');
const message = document.querySelector('.message');
const scoreDisplay = document.querySelector('.score-panel__score_num');
const levelDisplay = document.querySelector('.score-panel__level');
const timeYouDisplay = document.querySelector('.time-panel__you');
const timeGunmanDisplay = document.querySelector('.time-panel__gunman');
const startButton = document.querySelector('.button-start-game');
const restartButton = document.querySelector('.button-restart');
const nextLevelButton = document.querySelector('.button-next-level');
const winScreen = document.querySelector('.win-screen');

// Game state
let score = 0;
let level = 1;
let isGameRunning = false;
let isDuelInProgress = false;
let playerReactionTime = 0;
let gunmanReactionTime = 0;
let startTime = 0;
let gunmanTimeout;
let messageTimeout;
let animationTimeout;

// Audio elements - Updated to match your file names
const bgMusic = new Audio('./audio/intro.m4a');
bgMusic.loop = true;
bgMusic.volume = 0.5;

const fireSound = new Audio('./audio/fire.m4a');
const winSound = new Audio('./audio/win.m4a');
const loseSound = new Audio('./audio/death.m4a'); // Changed from lose.mp3 to death.m4a
const walkSound = new Audio('./audio/wait.m4a'); // Changed from walk.mp3 to wait.m4a
walkSound.loop = true;
walkSound.volume = 0.5;

// You may want to also add these sounds that are in your directory but not used in the original code
const foulSound = new Audio('./audio/foul.m4a');
const shotSound = new Audio('./audio/shot.m4a');
const shotFallSound = new Audio('./audio/shot-fall.m4a');

// Event listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
nextLevelButton.addEventListener('click', nextLevel);
gameScreen.addEventListener('click', handleScreenClick);

// Function to start game
function startGame() {
  // Hide menu and show game elements
  gameMenu.style.display = 'none';
  wrapper.style.display = 'block';
  gameScreen.style.display = 'block';
  gamePanels.style.display = 'block';
  
  // Reset game state
  score = 0;
  level = 1;
  scoreDisplay.textContent = score;
  levelDisplay.textContent = `Level ${level}`;
  
  // Play background music
  bgMusic.play();
  
  // Start the round
  isGameRunning = true;
  moveGunman();
}

// Function to restart game
function restartGame() {
  // Hide buttons and messages
  restartButton.style.display = 'none';
  message.className = 'message';
  message.textContent = '';
  
  // Reset timers
  clearTimeout(gunmanTimeout);
  clearTimeout(messageTimeout);
  clearTimeout(animationTimeout);
  
  // Reset game screen
  gameScreen.className = 'game-screen';
  
  // Reset gunman
  gunman.className = 'gunman';
  
  // Reset score and level
  score = 0;
  level = 1;
  scoreDisplay.textContent = score;
  levelDisplay.textContent = `Level ${level}`;
  
  // Play background music
  bgMusic.play();
  
  // Start the round
  isGameRunning = true;
  moveGunman();
}

// Function to progress to next level
function nextLevel() {
  // Hide button and messages
  nextLevelButton.style.display = 'none';
  message.className = 'message';
  message.textContent = '';
  
  // Reset gunman
  gunman.className = 'gunman';
  
  // Increase level
  level++;
  levelDisplay.textContent = `Level ${level}`;
  
  // Start the round
  isGameRunning = true;
  moveGunman();
}

// Function to move gunman across the screen
function moveGunman() {
  // Reset gunman position and animation
  gunman.className = 'gunman gunman-level-1';
  gunman.style.left = '800px';
  
  // Play walking sound
  walkSound.play();
  
  // Start movement animation
  setTimeout(() => {
    gunman.classList.add('moving');
    
    // Wait for animation to finish before stopping
    setTimeout(() => {
      walkSound.pause();
      walkSound.currentTime = 0;
      prepareForDuel();
    }, 5000); // Movement duration matches the CSS transition time
  }, 1000);
}

// Function to prepare for duel
function prepareForDuel() {
  // Update gunman appearance
  gunman.className = 'gunman gunman-level-1 gunman-level-1__standing';
  
  // Wait before starting duel
  setTimeout(() => {
    // Show "FIRE!" message
    message.className = 'message message--fire';
    fireSound.play();
    
    // Record start time for reaction measurement
    startTime = Date.now();
    isDuelInProgress = true;
    
    // Set gunman reaction time based on level (gets faster with each level)
    gunmanReactionTime = Math.max(0.8 - (level * 0.05), 0.3);
    timeGunmanDisplay.textContent = gunmanReactionTime.toFixed(2);
    
    // If player doesn't shoot, gunman will shoot
    gunmanTimeout = setTimeout(() => {
      if (isDuelInProgress) {
        gunmanShootsPlayer();
      }
    }, gunmanReactionTime * 1000);
  }, 1500);
}

// Function to handle gunman shooting player
function gunmanShootsPlayer() {
  // End duel
  isDuelInProgress = false;
  
  // Play sound and update appearance
  loseSound.play();
  bgMusic.pause();
  
  // Update gunman to shooting state
  gunman.className = 'gunman gunman-level-1 gunman-level-1__shooting';
  
  // Show death message and red screen effect
  message.className = 'message message--dead';
  message.textContent = 'YOU LOSE';
  gameScreen.classList.add('game-screen--death');
  
  // Show restart button
  setTimeout(() => {
    restartButton.style.display = 'block';
  }, 2000);
}

// Function to handle player shooting gunman
function playerShootsGunman() {
  // End duel
  isDuelInProgress = false;
  clearTimeout(gunmanTimeout);
  
  // Calculate player reaction time
  playerReactionTime = (Date.now() - startTime) / 1000;
  timeYouDisplay.textContent = playerReactionTime.toFixed(2);
  
  // Play shot sound (added)
  shotSound.play();
  
  // Check if player was faster than gunman
  if (playerReactionTime < gunmanReactionTime) {
    // Player wins
    winSound.play();
    
    // Update gunman to death state
    gunman.className = 'gunman gunman-level-1 gunman-level-1__death';
    
    // Play shot-fall sound (added)
    setTimeout(() => {
      shotFallSound.play();
    }, 300);
    
    // Show win message
    message.className = 'message message--win';
    message.textContent = 'YOU WIN';
    
    // Update score
    scoreCount();
    
    // Show next level button
    setTimeout(() => {
      nextLevelButton.style.display = 'block';
    }, 2000);
  } else {
    // Gunman was faster, player loses
    gunmanShootsPlayer();
  }
}

// Function to calculate and update score
function scoreCount() {
  // Base score points
  let points = 100;
  
  // Bonus points for quick reaction
  points += Math.round(1000 * (1 - playerReactionTime));
  
  // Level multiplier
  points *= level;
  
  // Update score
  score += points;
  scoreDisplay.textContent = score;
}

// Function to handle screen clicks
function handleScreenClick(event) {
  // Only process clicks during a duel
  if (!isDuelInProgress) return;
  
  // Check if player clicked on gunman
  const gunmanRect = gunman.getBoundingClientRect();
  const clickX = event.clientX;
  const clickY = event.clientY;
  
  if (
    clickX >= gunmanRect.left &&
    clickX <= gunmanRect.right &&
    clickY >= gunmanRect.top &&
    clickY <= gunmanRect.bottom
  ) {
    // Hit the gunman
    playerShootsGunman();
  } else {
    // Missed the gunman, penalty - could play foul sound here
    foulSound.play(); // Added foul sound for missed shots
    gunmanShootsPlayer();
  }
}