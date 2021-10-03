let origBoard;
let huPlayer, aiPlayer;

// Winning combinations using the board indexies
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [6, 4, 2],
    [2, 5, 8],
    [1, 4, 7],
    [0, 3, 6]
];

const cells = document.querySelectorAll('.cell');
startGame();

function selectSymbol(symbol) {
    huPlayer = symbol;
    aiPlayer = symbol === 'O' ? 'X' : 'O';
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', turnClick, false);
    }
    if (aiPlayer === 'X') {
        turn(bestSpot(), aiPlayer);
    }
    document.querySelector('.selectSymbol-box').style.display = "none";
}

function startGame() {
    document.querySelector('.endgame-box').style.display = "none";
    document.querySelector('.endgame-box .winner-text').innerText = "";
    document.querySelector('.selectSymbol-box').style.display = "flex";
    document.querySelector('.header .turn span').innerText = 'X';
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
    }
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] === 'number') {
        turn(square.target.id, huPlayer);
        if (!checkWin(origBoard, huPlayer) && !checkTie())
            setTimeout("turn(bestSpot(), aiPlayer)", 500);
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerHTML = player;
    document.querySelector('.header .turn span').innerText = player === huPlayer ? aiPlayer : huPlayer;
    let gameWon = checkWin(origBoard, player);
    if (gameWon)
        gameOver(gameWon);
    checkTie();
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player === huPlayer ? "blue" : "red";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player === huPlayer ? "You won!" : "Computer won!");
}

function declareWinner(winner) {
    document.querySelector(".endgame-box").style.display = "block";
    document.querySelector(".endgame-box .winner-text").innerText = winner;
}

// Returns list of the empty squares on the board
function emptySquares(board) {
    return board.filter((element, index) => index === element);
}

function checkTie() {
    if (emptySquares(origBoard).length === 0) {
        if (checkWin(origBoard, huPlayer) || checkWin(origBoard, aiPlayer)) {
            gameOver();
        }
        for (let cell of cells) {
            cell.style.backgroundColor = "green";
            cell.removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}

// The main minimax function
function minimax(newBoard, player) {
    // Available spots
    var availSpots = emptySquares(newBoard);

    // Checks for the terminal states such as win, lose, and tie and returning a value accordingly
    if (checkWin(newBoard, huPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    // An array to collect all the objects
    var moves = [];

    // Loop through available spots
    for (let i = 0; i < availSpots.length; i++) {
        // Create an object for each and store the index of that spot 
        var move = {};
        move.index = newBoard[availSpots[i]];
        
        // Set the empty spot to the current player
        newBoard[availSpots[i]] = player;

        // Collect the score resulted from calling minimax on the opponent of the current player
        if (player === aiPlayer)
            move.score = minimax(newBoard, huPlayer).score;
        else
            move.score = minimax(newBoard, aiPlayer).score;

        // Reset the available spots to empty
        newBoard[availSpots[i]] = move.index;

        // If the player is aiPlayer and score is 10 or If the player is huPlayer and score is -10 then return the object
        if ((player === aiPlayer && move.score === 10) || (player === huPlayer && move.score === -10))
            return move;
        // else push the object to the array
        else
            moves.push(move);
    }

    let bestMove, bestScore;
    // If it is the computer's turn loop over the moves and choose the move with the highest score
    if (player === aiPlayer) {
        bestScore = -1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    // else loop over the moves and choose the move with the lowest score 
    else {
        bestScore = 1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    // Return the chosen move (object) from the moves array
    return moves[bestMove];
}