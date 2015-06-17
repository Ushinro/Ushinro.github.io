//
// AUTHOR: Ushinro
// DATE CREATED:  2014-12-15
// LAST MODIFIED: 2014-12-25
//


"use strict";


var MS_PER_SECOND = 1000;       // Miliseconds per second

var COLS        = 10,
    ROWS        = 20,
    SIZE        = 32,  // Size of each grid block
    GAME_WIDTH  = 320,
    GAME_HEIGHT = 640;


var updateInterval = 500,
    startTime,
    totalTime;      // In ms, can be adjusted to make game more "challenging" or easier


var backgroundImage,
    blockImage,
    canvas,
    canvasContext,
    gameOverImage;

var currentPiece,
    gameData,
    imageLoader,
    previousTime,
    currentTime,
    isGameOver,
    lineSpan,   // Reference to "lines" span object in HTML
    timeSpan,   // Reference to "time" span object in HTML
    currentLines,
    touchX,
    touchY,
    touchId;


window.addEventListener("DOMContentLoaded", onReady, false);

document.body.addEventListener("touchstart", function(event) {
        event.preventDefault();

        touchX  = event.touches[0].pageX;
        touchY  = event.touches[0].pageY;
        touchId = event.touches[0].identifier;
});

document.body.addEventListener("touchmove", function(event) {
        event.preventDefault();

        var difY = event.touches[0].pageY - touchY;

        // Swipe down based on arbitrary value of 60
        if (difY > 60) {
                if (checkMove(currentPiece.gridX, currentPiece.gridY + 1, currentPiece.currentState)) {
                        currentPiece.gridY++;
                }
        }
});


// Multi-touch
document.body.addEventListener("touchend", function(event) {
        event.preventDefault();

        var touchEndX,
            touchEndY;

        var touch = event.changedTouches.item(0);

        try {
                touchEndX = touch.pageX;
                touchEndY = touch.pageY;
        } catch (error) {
                alert(error);
                return;
        }

        var difX = Math.abs(touchEndX - touchX);
        var difY = Math.abs(touchEndY - touchY);

        // Check if the user touched and swiped,
        // or if they just tapped the screen
        if (difX < 10 && difY < 10) {
                if (!isGameOver) {
                        var newState = currentPiece.currentState - 1;

                        if (newState < 0) {
                                newState = currentPiece.states.length - 1;
                        }

                        if (checkMove(currentPiece.gridX, currentPiece.gridY, newState)) {
                                currentPiece.currentState = newState
                        }
                } else {
                        initGame();
                }
        } else {
                // Swiping left/right
                if (difX > difY) {
                        if (touchEndX < touchX) {
                                if (checkMove(currentPiece.gridX - 1, currentPiece.gridY, currentPiece.currentState)) {
                                        currentPiece.gridX--;
                                }
                        } else {
                                if (checkMove(currentPiece.gridX + 1, currentPiece.gridY, currentPiece.currentState)) {
                                        currentPiece.gridX++;
                                }
                        }
                }
        }
})

function onReady() {
        canvas          = document.getElementById("gameCanvas");
        canvasContext   = canvas.getContext("2d");
        lineSpan        = document.getElementById("lines");
        timeSpan        = document.getElementById("time");

        imageLoader = new BulkImageLoader();
        imageLoader.addImage("img/blocks.png", "blocks");
        imageLoader.addImage("img/tetris-background.png", "background");
        imageLoader.addImage("img/game-over.png", "gameover");
        imageLoader.onReadyCallback = onImagesLoaded();
        imageLoader.loadImages();

        previousTime = currentTime = 0;

        window.addEventListener("keydown", getInput, true);
} // END onReady


function getInput(event) {
        if (!event) {
                var event = window.event;
        }

        event.preventDefault(); // Prevent screen from scrolling when up/down keys are pressed

        if (isGameOver !== true) {
                switch(event.keyCode) {
                // 'Left'
                case 37: {
                        if (checkMove(currentPiece.gridX - 1, currentPiece.gridY, currentPiece.currentState)) {
                                currentPiece.gridX--;
                        }
                }
                break;

                // 'Right'
                case 39: {
                        if (checkMove(currentPiece.gridX + 1, currentPiece.gridY, currentPiece.currentState)) {
                                currentPiece.gridX++;
                        }
                }
                break;

                // 'Up' for clockwise rotation
                case 38: {
                        var newState = currentPiece.currentState - 1;

                        if (newState < 0) {
                                newState = currentPiece.states.length - 1;
                        }

                        if (checkMove(currentPiece.gridX, currentPiece.gridY, newState)) {
                                currentPiece.currentState = newState;
                        }
                }
                break;

                // 'Down' for moving the piece faster towards the bottom
                case 40: {
                        if (checkMove(currentPiece.gridX, currentPiece.gridY + 1, currentPiece.currentState)) {
                                currentPiece.gridY++;
                        }
                }
                break;

                // 'z' for counter-clockwise rotation
                case 90: {
                        var newState = currentPiece.currentState + 1;

                        if (newState > currentPiece.states.length - 1) {
                                newState = 0;
                        }

                        if (checkMove(currentPiece.gridX, currentPiece.gridY, newState)) {
                                currentPiece.currentState = newState;
                        }
                }
                break;

                // 'x' for clockwise rotation
                case 88: {
                        var newState = currentPiece.currentState - 1;

                        if (newState < 0) {
                                newState = currentPiece.states.length - 1;
                        }

                        if (checkMove(currentPiece.gridX, currentPiece.gridY, newState)) {
                                currentPiece.currentState = newState;
                        }
                }
                break;
                default: {

                }
                }       // END switch
        } else {
                initGame();     // Reset game on any key press
        }
} // END getInput


function onImagesLoaded(event) {
        blockImage      = imageLoader.getImageAtIndex(0);
        backgroundImage = imageLoader.getImageAtIndex(1);
        gameOverImage   = imageLoader.getImageAtIndex(2);

        initGame();
} // END onImagesLoaded


function initGame() {
        startTime = new Date().getTime();       // Get the time as the first thing to more accurately get the starting time

        var r, c;
        currentLines = 0;
        isGameOver   = false;

        if (gameData === undefined) {
                gameData = new Array();

                for (r = 0; r < ROWS; r++) {
                        gameData[r] = new Array();

                        for (c = 0; c < COLS; c++) {
                                gameData[r].push(0);
                        }
                }
        } else {
                for (r = 0; r < ROWS; r++) {
                        for (c = 0; c < COLS; c++) {
                                gameData[r][c] = 0;
                        }
                }
        }

        currentPiece = getRandomPiece();

        lineSpan.innerHTML = currentLines.toString();

        var requestAnimFrames = window.requestAnimationFrame || 
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.msRequestAnimationFrame;

        window.requestAnimationFrame = requestAnimFrames;

        requestAnimationFrame(update);
} // END initGame

function update() {
        currentTime        = new Date().getTime();
        totalTime          = parseInt((currentTime - startTime) / MS_PER_SECOND);
        timeSpan.innerHTML = parseInt(totalTime).toString();      // Update the time info on the page

        // Make the game harder at regular intervals
        // Could make the game harder based on score instead
        // if (updateInterval > 150 &&
        //         totalTime % 5 === 0 &&
        //         totalTime > 0) {
        //         updateInterval -= 50;
        // }
        

        if (currentTime - previousTime > updateInterval) {
                // Update the game piece
                if (checkMove(currentPiece.gridX, currentPiece.gridY + 1, currentPiece.currentState)) {
                        currentPiece.gridY += 1;
                } else {
                        copyData(currentPiece);
                        currentPiece = getRandomPiece();
                }

                // Update time
                previousTime = currentTime;
        }

        canvasContext.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        drawBoard();
        drawPiece(currentPiece);

        if (isGameOver === false) {
                requestAnimationFrame(update);
        } else {
                canvasContext.drawImage(gameOverImage, 0, 0, GAME_WIDTH, GAME_HEIGHT, 0, 0, GAME_WIDTH, GAME_HEIGHT);
        }
} // END update


function copyData(piece) {
        var xPos  = piece.gridX,
            yPos  = piece.gridY,
            state = piece.currentState;

        for (var r = 0, len = piece.states[state].length; r < len; r++) {
                for (var c = 0, len2 = piece.states[state][r].length; c < len2; c++) {
                        if (piece.states[state][r][c] === 1 && yPos >= 0) {
                                gameData[yPos][xPos] = (piece.color + 1);
                        }

                        xPos += 1;
                }

                xPos = piece.gridX;
                yPos += 1;
        }

        checkLines();

        if (piece.gridY < 0) {
                isGameOver = true;
        }
} // END copyData


function checkLines() {
        var lineFound   = false,
            fullRow     = true,
            r           = ROWS - 1,
            c           = COLS - 1;

        while (r >= 0) {
                console.log("Checking LINES");
                while (c >= 0) {
                        if (gameData[r][c] === 0) {
                                fullRow = false;
                                c = -1; // Break out of loop
                        }

                        c--;
                }

                if (fullRow === true) {
                        zeroRow(r);
                        r++;
                        lineFound = true;
                        currentLines++;
                }

                fullRow = true;
                c = COLS - 1;
                r--;
        }

        if (lineFound) {
                lineSpan.innerHTML = currentLines.toString();
        }
} // END checkLines


function zeroRow(row) {
        var r = row,
            c = 0;

        while (r >= 0) {
                while (c < COLS) {
                        if (r > 0) {
                                gameData[r][c] = gameData[r-1][c];
                        } else {
                                gameData[r][c] = 0;
                        }

                        c++;
                }

                c = 0;
                r--;
        }
} // END zeroRow


function drawBoard() {
        canvasContext.drawImage(backgroundImage, 0, 0, GAME_WIDTH, GAME_HEIGHT, 0, 0, GAME_WIDTH, GAME_HEIGHT);

        for (var r = 0; r < ROWS; r++) {
                for (var c = 0; c < COLS; c++) {
                        if (gameData[r][c] !== 0) {
                                canvasContext.drawImage(blockImage, (gameData[r][c] - 1) * SIZE, 0, SIZE, SIZE, c * SIZE, r * SIZE, SIZE, SIZE);
                        }
                }
        }
} // END drawBoard


function drawPiece(piece) {
        var drawX = piece.gridX,
            drawY = piece.gridY,
            state = piece.currentState;

        for (var r = 0, len = piece.states[state].length; r < len; r++) {
                for (var c = 0, len2 = piece.states[state][r].length; c < len2; c++) {
                        if (piece.states[state][r][c] === 1 && drawY >= 0) {
                                canvasContext.drawImage(blockImage, piece.color * SIZE, 0, SIZE, SIZE, drawX * SIZE, drawY * SIZE, SIZE, SIZE);
                        }

                        drawX++;
                }

                drawX = piece.gridX;
                drawY++;
        }
} // END drawPiece


function checkMove(x, y, newState) {
        var isValidMove = true,
            newX        = x,
            newY        = y;

        for (var r = 0, len = currentPiece.states[newState].length; r < len; r++) {
                for (var c = 0, len2 = currentPiece.states[newState][r].length; c < len2; c++) {
                        // Check if too far left or right
                        if (newX < 0 || newX >= COLS) {
                                isValidMove = false;
                                c = len2;
                                r = len;        // Get out of loop
                        }

                        if (gameData[newY] !== undefined && gameData[newY][newX] !== 0 &&
                                currentPiece.states[newState][r] !== undefined && currentPiece.states[newState][r][c] !== 0) {
                                isValidMove = false;
                                c = len2;
                                r = len;
                        }

                        newX++;
                }

                newX = x;
                newY++;

                if (newY > ROWS) {
                        r = len;
                        isValidMove = false;
                }
        }

        return isValidMove;
} // END checkMove