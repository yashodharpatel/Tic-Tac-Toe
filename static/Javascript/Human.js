let origBoard;
let Player1, Player2;
let clicks = 0;
let executed = false;

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
    Player1 = symbol;
    Player2 = symbol === 'O' ? 'X' : 'O';
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', turnClick, false);
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
    if (!executed && Player2 === 'X') {
        turn(square.target.id, Player2);
        executed = true;
    }
    if (typeof origBoard[square.target.id] === 'number') {
        if (executed) {
            if (clicks % 2 == 0) 
                turn(square.target.id, Player2);
            else 
                turn(square.target.id, Player1);
        }
        else {
            if (clicks % 2 == 0) 
                turn(square.target.id, Player1);
            else 
                turn(square.target.id, Player2);
        }
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerHTML = player;
    document.querySelector('.header .turn span').innerText = player === Player1 ? Player2 : Player1;
    let gameWon = checkWin(origBoard, player);
    if (gameWon)
        gameOver(gameWon);
    checkTie();
    clicks++;
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
        document.getElementById(index).style.backgroundColor = "blue";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player === Player1 ? "Player1 Won!" : "Player2 Won!");
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
        if (checkWin(origBoard, Player1) || checkWin(origBoard, Player2)) {
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