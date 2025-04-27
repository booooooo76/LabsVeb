// DOM Elements
const settingsPanel = document.getElementById('settingsPanel');
const gameInfo = document.getElementById('gameInfo');
const gameBoard = document.getElementById('gameBoard');
const gameResults = document.getElementById('gameResults');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const roundInfoDisplay = document.getElementById('roundInfo');
const winnerDisplay = document.getElementById('winnerDisplay');
const statsTable = document.getElementById('statsTable');

// Settings Elements
const playerModeSelect = document.getElementById('playerMode');
const player1NameInput = document.getElementById('player1Name');
const player2NameInput = document.getElementById('player2Name');
const player2NameContainer = document.getElementById('player2NameContainer');
const gridSizeSelect = document.getElementById('gridSize');
const difficultySelect = document.getElementById('difficulty');
const roundsInput = document.getElementById('rounds');
const resetSettingsButton = document.getElementById('resetSettings');
const startGameButton = document.getElementById('startGame');

// Game Control Buttons
const restartGameButton = document.getElementById('restartGame');
const backToSettingsButton = document.getElementById('backToSettings');
const playAgainButton = document.getElementById('playAgain');
const newSettingsButton = document.getElementById('newSettings');

// Game State
const gameState = {
    isGameActive: false,
    currentPlayer: 0, // 0 for player 1, 1 for player 2
    currentRound: 1,
    moves: 0,
    matchedPairs: 0,
    totalPairs: 0,
    firstCard: null,
    secondCard: null,
    lockBoard: false,
    timerInterval: null,
    timeRemaining: 0,
    players: [
        { name: 'Player 1', score: 0, roundStats: [] },
        { name: 'Player 2', score: 0, roundStats: [] }
    ],
    settings: {
        playerMode: 1,
        gridSize: '4x4',
        difficulty: 'easy',
        rounds: 1
    }
};

// Card images - use JavaScript logo as a base with different colors
const cardImages = [
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'
];

// Event Listeners
playerModeSelect.addEventListener('change', togglePlayerMode);
resetSettingsButton.addEventListener('click', resetSettings);
startGameButton.addEventListener('click', startGame);
restartGameButton.addEventListener('click', restartGame);
backToSettingsButton.addEventListener('click', backToSettings);
playAgainButton.addEventListener('click', playAgain);
newSettingsButton.addEventListener('click', newSettings);

// Initialize the game
initializeGame();

// Functions
function initializeGame() {
    resetSettings();
    addEventListeners();
}

function addEventListeners() {
    playerModeSelect.addEventListener('change', togglePlayerMode);
}

function togglePlayerMode() {
    if (playerModeSelect.value === '2') {
        player2NameContainer.classList.remove('hidden');
    } else {
        player2NameContainer.classList.add('hidden');
    }
}

function resetSettings() {
    // Reset settings to default
    playerModeSelect.value = '1';
    player1NameInput.value = 'Player 1';
    player2NameInput.value = 'Player 2';
    player2NameContainer.classList.add('hidden');
    gridSizeSelect.value = '4x4';
    difficultySelect.value = 'easy';
    roundsInput.value = '1';
    
    // Update game state
    gameState.settings = {
        playerMode: 1,
        gridSize: '4x4',
        difficulty: 'easy',
        rounds: 1
    };
}

function saveSettings() {
    gameState.settings = {
        playerMode: parseInt(playerModeSelect.value),
        gridSize: gridSizeSelect.value,
        difficulty: difficultySelect.value,
        rounds: parseInt(roundsInput.value)
    };
    
    gameState.players[0].name = player1NameInput.value || 'Player 1';
    gameState.players[1].name = player2NameInput.value || 'Player 2';
    
    // Reset scores and stats
    gameState.players[0].score = 0;
    gameState.players[1].score = 0;
    gameState.players[0].roundStats = [];
    gameState.players[1].roundStats = [];
}

function startGame() {
    saveSettings();
    
    // Hide settings, show game info
    settingsPanel.classList.add('hidden');
    gameInfo.classList.remove('hidden');
    gameResults.classList.add('hidden');
    
    // Reset game state
    gameState.isGameActive = true;
    gameState.currentPlayer = 0;
    gameState.currentRound = 1;
    gameState.moves = 0;
    gameState.matchedPairs = 0;
    
    // Update displays
    updateCurrentPlayerDisplay();
    updateRoundInfoDisplay();
    updateMovesDisplay();
    
    // Create game board
    createGameBoard();
    
    // Start timer
    startTimer();
}

function createGameBoard() {
    // Clear previous game board
    gameBoard.innerHTML = '';
    
    // Set grid size
    const [cols, rows] = gameState.settings.gridSize.split('x').map(Number);
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    // Calculate total pairs
    const totalPairs = (cols * rows) / 2;
    gameState.totalPairs = totalPairs;
    
    // Create cards array with pairs
    const cards = [];
    for (let i = 0; i < totalPairs; i++) {
        const cardImage = cardImages[i];
        cards.push(cardImage, cardImage);
    }
    
    // Shuffle cards
    const shuffledCards = shuffleArray(cards);
    
    // Create card elements
    shuffledCards.forEach((image, index) => {
        const card = createCard(image, index);
        gameBoard.appendChild(card);
    });
}

function createCard(image, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    
    const cardImage = document.createElement('img');
    cardImage.className = 'card-image';
    cardImage.src = image;
    cardImage.alt = 'Card';
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.textContent = '?';
    
    cardFront.appendChild(cardImage);
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    card.addEventListener('click', flipCard);
    
    return card;
}

function flipCard() {
    // Prevent flipping if board is locked or card is already flipped/matched
    if (gameState.lockBoard || this === gameState.firstCard || this.classList.contains('flipped') || this.classList.contains('matched')) {
        return;
    }
    
    // Flip the card
    this.classList.add('flipped');
    
    // First card selection
    if (gameState.firstCard === null) {
        gameState.firstCard = this;
        return;
    }
    
    // Second card selection
    gameState.secondCard = this;
    gameState.moves++;
    updateMovesDisplay();
    
    // Check for match
    checkForMatch();
}

function checkForMatch() {
    const isMatch = gameState.firstCard.querySelector('.card-image').src === 
                   gameState.secondCard.querySelector('.card-image').src;
    
    if (isMatch) {
        handleMatch();
    } else {
        handleMismatch();
    }
}

function handleMatch() {
    // Disable matched cards
    gameState.firstCard.classList.add('matched');
    gameState.secondCard.classList.add('matched');
    gameState.firstCard.removeEventListener('click', flipCard);
    gameState.secondCard.removeEventListener('click', flipCard);
    
    // Increment matched pairs
    gameState.matchedPairs++;
    
    // Award point to current player in 2-player mode
    if (gameState.settings.playerMode === 2) {
        gameState.players[gameState.currentPlayer].score++;
    }
    
    // Reset card selections
    resetCardSelections();
    
    // Check if game is over
    if (gameState.matchedPairs === gameState.totalPairs) {
        endRound();
    }
}

function handleMismatch() {
    // Lock board to prevent further selections during flip animation
    gameState.lockBoard = true;
    
    // Flip cards back after a delay
    setTimeout(() => {
        gameState.firstCard.classList.remove('flipped');
        gameState.secondCard.classList.remove('flipped');
        
        // Switch player in 2-player mode
        if (gameState.settings.playerMode === 2) {
            gameState.currentPlayer = gameState.currentPlayer === 0 ? 1 : 0;
            updateCurrentPlayerDisplay();
        }
        
        resetCardSelections();
    }, 1000);
}

function resetCardSelections() {
    gameState.firstCard = null;
    gameState.secondCard = null;
    gameState.lockBoard = false;
}

function startTimer() {
    // Set time based on difficulty
    const difficultyTimes = {
        'easy': 3 * 60, // 3 minutes
        'normal': 2 * 60, // 2 minutes
        'hard': 1 * 60 // 1 minute
    };
    
    gameState.timeRemaining = difficultyTimes[gameState.settings.difficulty];
    updateTimerDisplay();
    
    // Clear any existing timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // Start new timer
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();
        
        // Check if time is up
        if (gameState.timeRemaining <= 0) {
            clearInterval(gameState.timerInterval);
            endRound(true); // Time's up
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    timerDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateMovesDisplay() {
    movesDisplay.textContent = `Moves: ${gameState.moves}`;
}

function updateCurrentPlayerDisplay() {
    currentPlayerDisplay.textContent = `Current Player: ${gameState.players[gameState.currentPlayer].name}`;
}

function updateRoundInfoDisplay() {
    roundInfoDisplay.textContent = `Round: ${gameState.currentRound} of ${gameState.settings.rounds}`;
}

function endRound(timeUp = false) {
    // Stop timer
    clearInterval(gameState.timerInterval);
    
    // Save round statistics
    const timeUsed = timeUp ? 
        getMaxTime() - gameState.timeRemaining : 
        getMaxTime() - gameState.timeRemaining;
    
    const roundStat = {
        round: gameState.currentRound,
        moves: gameState.moves,
        time: timeUsed,
        pairs: gameState.matchedPairs
    };
    
    if (gameState.settings.playerMode === 1) {
        gameState.players[0].roundStats.push(roundStat);
    } else {
        // In 2-player mode, both players get the stats
        gameState.players[0].roundStats.push({ 
            ...roundStat, 
            score: gameState.players[0].score 
        });
        gameState.players[1].roundStats.push({ 
            ...roundStat, 
            score: gameState.players[1].score 
        });
    }
    
    // Check if all rounds are complete
    if (gameState.currentRound >= gameState.settings.rounds) {
        showGameResults();
    } else {
        // Start next round
        gameState.currentRound++;
        setTimeout(() => {
            alert(`Round ${gameState.currentRound - 1} complete! Starting round ${gameState.currentRound}`);
            startNextRound();
        }, 1000);
    }
}

function startNextRound() {
    // Reset for next round
    gameState.matchedPairs = 0;
    gameState.moves = 0;
    gameState.currentPlayer = 0; // Always start with player 1
    
    // Update displays
    updateCurrentPlayerDisplay();
    updateRoundInfoDisplay();
    updateMovesDisplay();
    
    // Create new game board
    createGameBoard();
    
    // Start timer
    startTimer();
}

function showGameResults() {
    // Hide game info and game board
    gameInfo.classList.add('hidden');
    
    // Show results
    gameResults.classList.remove('hidden');
    
    // Display winner
    if (gameState.settings.playerMode === 1) {
        // Single player - just show their stats
        winnerDisplay.innerHTML = `<h3 class="winner">Game Complete!</h3>`;
    } else {
        // Two players - determine winner
        const player1Score = gameState.players[0].score;
        const player2Score = gameState.players[1].score;
        
        if (player1Score > player2Score) {
            winnerDisplay.innerHTML = `<h3 class="winner">${gameState.players[0].name} Wins!</h3>`;
        } else if (player2Score > player1Score) {
            winnerDisplay.innerHTML = `<h3 class="winner">${gameState.players[1].name} Wins!</h3>`;
        } else {
            winnerDisplay.innerHTML = `<h3 class="winner">It's a Tie!</h3>`;
        }
    }
    
    // Create stats table
    createStatsTable();
}

function createStatsTable() {
    let html = '<table class="stats-table"><thead><tr>';
    
    // Headers
    html += '<th>Round</th>';
    if (gameState.settings.playerMode === 2) {
        html += `<th>${gameState.players[0].name} Score</th>`;
        html += `<th>${gameState.players[1].name} Score</th>`;
    }
    html += '<th>Moves</th><th>Time</th></tr></thead><tbody>';
    
    // Rows
    for (let i = 0; i < gameState.currentRound; i++) {
        html += `<tr><td>${i + 1}</td>`;
        
        if (gameState.settings.playerMode === 2) {
            html += `<td>${gameState.players[0].roundStats[i].score}</td>`;
            html += `<td>${gameState.players[1].roundStats[i].score}</td>`;
        }
        
        const timeInSeconds = gameState.players[0].roundStats[i].time;
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        html += `<td>${gameState.players[0].roundStats[i].moves}</td>`;
        html += `<td>${timeFormatted}</td></tr>`;
    }
    
    // Add totals row for 2-player mode
    if (gameState.settings.playerMode === 2) {
        html += `<tr class="totals"><td>Total</td>`;
        html += `<td>${gameState.players[0].score}</td>`;
        html += `<td>${gameState.players[1].score}</td>`;
        html += `<td colspan="2"></td></tr>`;
    }
    
    html += '</tbody></table>';
    
    statsTable.innerHTML = html;
}

function restartGame() {
    // Reset game state for current round
    gameState.matchedPairs = 0;
    gameState.moves = 0;
    
    // Update displays
    updateMovesDisplay();
    
    // Create new game board
    createGameBoard();
    
    // Restart timer
    startTimer();
}

function backToSettings() {
    // Stop timer
    clearInterval(gameState.timerInterval);
    
    // Show settings, hide game info
    settingsPanel.classList.remove('hidden');
    gameInfo.classList.add('hidden');
    gameResults.classList.add('hidden');
    
    // Reset game state
    gameState.isGameActive = false;
}

function playAgain() {
    // Reset for a new game with same settings
    gameState.currentRound = 1;
    gameState.players[0].score = 0;
    gameState.players[1].score = 0;
    gameState.players[0].roundStats = [];
    gameState.players[1].roundStats = [];
    
    // Hide results, show game info
    gameResults.classList.add('hidden');
    gameInfo.classList.remove('hidden');
    
    // Start new game
    startGame();
}

function newSettings() {
    // Hide results, show settings
    gameResults.classList.add('hidden');
    settingsPanel.classList.remove('hidden');
    
    // Reset game state
    gameState.isGameActive = false;
}

// Helper Functions
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function getMaxTime() {
    const difficultyTimes = {
        'easy': 3 * 60,
        'normal': 2 * 60,
        'hard': 1 * 60
    };
    return difficultyTimes[gameState.settings.difficulty];
}