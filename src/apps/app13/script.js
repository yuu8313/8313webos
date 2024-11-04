// script.js
document.addEventListener('DOMContentLoaded', function () {
    const boardSize = 8;
    const gameBoard = document.getElementById('game-board');
    const restartButton = document.getElementById('restart-button');
    let board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
    let currentPlayer = 'black';
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    function initializeBoard() {
        board[3][3] = 'white';
        board[3][4] = 'black';
        board[4][3] = 'black';
        board[4][4] = 'white';
        renderBoard();
    }

    function renderBoard() {
        gameBoard.innerHTML = '';
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                if (board[row][col]) {
                    cell.classList.add(board[row][col]);
                } else if (isValidMove(row, col, currentPlayer)) {
                    cell.classList.add('valid-move');
                }
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', handleCellClick);
                gameBoard.appendChild(cell);
            }
        }
        document.getElementById('player-color').textContent = currentPlayer === 'black' ? '黒' : '白';
        checkForValidMoves();
    }

    function handleCellClick(event) {
        const row = parseInt(event.target.dataset.row, 10);
        const col = parseInt(event.target.dataset.col, 10);
        if (isValidMove(row, col, currentPlayer)) {
            makeMove(row, col, currentPlayer);
            currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
            renderBoard();
            if (isBoardFull()) {
                endGame();
            }
        }
    }

    function isValidMove(row, col, player) {
        if (board[row][col] !== null) {
            return false;
        }

        for (let [dx, dy] of directions) {
            let x = row + dx, y = col + dy;
            let hasOpponentPiece = false;
            while (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
                if (board[x][y] === null) break;
                if (board[x][y] !== player) {
                    hasOpponentPiece = true;
                } else if (hasOpponentPiece) {
                    return true;
                } else {
                    break;
                }
                x += dx;
                y += dy;
            }
        }
        return false;
    }

    function makeMove(row, col, player) {
        board[row][col] = player;

        for (let [dx, dy] of directions) {
            let x = row + dx, y = col + dy;
            let cellsToFlip = [];

            while (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
                if (board[x][y] === null) break;
                if (board[x][y] !== player) {
                    cellsToFlip.push([x, y]);
                } else {
                    for (let [flipRow, flipCol] of cellsToFlip) {
                        board[flipRow][flipCol] = player;
                    }
                    break;
                }
                x += dx;
                y += dy;
            }
        }
    }

    function checkForValidMoves() {
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (isValidMove(row, col, currentPlayer)) {
                    return;
                }
            }
        }
        if (!isBoardFull()) {
            alert('置けるところがありません。ターンをスキップします。');
            currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
            renderBoard();
        }
    }

    function isBoardFull() {
        return board.every(row => row.every(cell => cell !== null));
    }

    function countPieces() {
        let blackCount = 0;
        let whiteCount = 0;
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (board[row][col] === 'black') {
                    blackCount++;
                } else if (board[row][col] === 'white') {
                    whiteCount++;
                }
            }
        }
        return { blackCount, whiteCount };
    }

    function endGame() {
        const { blackCount, whiteCount } = countPieces();
        let winner;
        if (blackCount > whiteCount) {
            winner = '黒の勝ち';
        } else if (whiteCount > blackCount) {
            winner = '白の勝ち';
        } else {
            winner = '引き分け';
        }
        alert(`ゲーム終了\n黒: ${blackCount} - 白: ${whiteCount}\n${winner}`);
        restartGame();
    }

    function restartGame() {
        board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
        currentPlayer = 'black';
        initializeBoard();
    }

    restartButton.addEventListener('click', restartGame);

    initializeBoard();
});
