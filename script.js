document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const player = document.getElementById('player');
    const rollButton = document.getElementById('roll-button');
    const diceResult = document.getElementById('dice-result');
    const gameMessage = document.getElementById('game-message');

    const boardSize = 100;
    const cells = [];
    let playerPosition = 1; // Start at cell 1
    let gameWon = false;

    // Define the snakes and ladders
    // Format: { start_cell: end_cell }
    const snakesAndLadders = {
        // Ladders
        4: 14,
        9: 31,
        20: 38,
        28: 84,
        40: 59,
        51: 67,
        63: 81,
        71: 91,
        
        // Snakes
        17: 7,
        54: 34,
        62: 19,
        64: 60,
        87: 24,
        93: 73,
        95: 75,
        99: 78
    };

    // --- 1. Create the Game Board ---
    function createBoard() {
        for (let i = 1; i <= boardSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `cell-${i}`;
            
            let label = i;
            if (snakesAndLadders[i]) {
                if (snakesAndLadders[i] > i) {
                    label = `L ⬆ ${snakesAndLadders[i]}`;
                    cell.classList.add('ladder');
                } else {
                    label = `S ⬇ ${snakesAndLadders[i]}`;
                    cell.classList.add('snake');
                }
            }
            cell.innerHTML = `<span>${label}</span>`;
            cells.push(cell);
            board.appendChild(cell);
        }
        updatePlayerPosition();
    }

    // --- 2. Update Player's Visual Position ---
    function updatePlayerPosition() {
        // Find the coordinates of the target cell
        const targetCell = document.getElementById(`cell-${playerPosition}`);
        if (!targetCell) return;

        // Calculate position relative to the game-container
        const containerRect = board.parentElement.getBoundingClientRect();
        const cellRect = targetCell.getBoundingClientRect();
        
        // Calculate the 'bottom' and 'left' properties
        // containerRect.bottom is the screen position of the container's bottom edge
        // cellRect.bottom is the screen position of the cell's bottom edge
        // The difference gives the cell's 'bottom' offset relative to the container
        let bottom = containerRect.bottom - cellRect.bottom;
        let left = cellRect.left - containerRect.left;

        // Center the player in the cell
        bottom += (cellRect.height - player.offsetHeight) / 2;
        left += (cellRect.width - player.offsetWidth) / 2;

        player.style.bottom = `${bottom}px`;
        player.style.left = `${left}px`;
    }

    // --- 3. Handle Game Logic ---
    function rollDice() {
        if (gameWon) return;

        gameMessage.textContent = '';
        const roll = Math.floor(Math.random() * 6) + 1;
        diceResult.textContent = `You rolled a ${roll}!`;

        let newPosition = playerPosition + roll;

        if (newPosition > 100) {
            newPosition = playerPosition; // Don't move if roll overshoots 100
        }

        // Move player
        playerPosition = newPosition;
        updatePlayerPosition();

        // Use a timeout to show the initial move before the snake/ladder move
        setTimeout(() => {
            // Check for snakes or ladders
            if (snakesAndLadders[playerPosition]) {
                const isLadder = snakesAndLadders[playerPosition] > playerPosition;
                gameMessage.textContent = isLadder ? 'You found a ladder!' : 'Oh no, a snake!';
                playerPosition = snakesAndLadders[playerPosition];
                updatePlayerPosition();
            }

            // Check for win
            if (playerPosition === 100) {
                gameWon = true;
                gameMessage.textContent = 'Congratulations, you won!';
                rollButton.disabled = true;
                diceResult.textContent = 'You reached 100!';
            }
        }, 600); // 0.6 second delay
    }

    // --- 4. Initialize the Game ---
    createBoard();
    rollButton.addEventListener('click', rollDice);
    
    // Adjust player position on window resize
    window.addEventListener('resize', updatePlayerPosition);
});
