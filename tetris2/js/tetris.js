//
// AUTHOR: Ushinro
// DATE CREATED:  2014-12-31
// LAST MODIFIED: 2015-01-17
//


"use strict";


// Everything stored in an init function to prevent use of global variables
function init() {
        var board         = [],
            canvas        = document.getElementById("gameBoard"),
            canvasContext = canvas.getContext("2d"),
            clearColor    = window.getComputedStyle(canvas).getPropertyValue('background-color'),
            dropStart     = Date.now(),
            gameOver      = false,
            lineCountHtml = document.getElementById("lines"),
            lines         = 0,
            piece         = null,
            pieces        = [
                        [LinePiece, "cyan"],
                        [JPiece, "blue"],
                        [LPiece, "orange"],
                        [OPiece, "yellow"],
                        [SPiece, "green"],
                        [TPiece, "purple"],
                        [ZPiece, "red"]
                        ],
            tileSize      = 48,      // Dimension size of each square in both directions, in px
            width         = 10,
            height        = 20;

        canvas.width  = width * tileSize;
        canvas.height = height * tileSize;

        resetBoard();
        piece = generateNewPiece();
        drawBoard();
        update();


        function drawBoard() {
                var color;

                for (var y = 0; y < height; y++) {
                        for (var x = 0; x < width; x++) {
                                color = board[y][x] || clearColor;
                                drawSquare(x, y, color);
                        }
                }
        }       // END drawBoard


        // Draws 3 squares:
        // The board (outside), the grid, and the inner square on each tile
        function drawSquare(x, y, color) {
                var darkGrey                = "#555",
                    innerSquareOffsetFactor = 3 / 8,
                    lightGrey               = "#888",
                    resizeFactor            = 0.25,
                    tempFill                = canvasContext.fillStyle,
                    tempStyle               = canvasContext.strokeStyle;                

                canvasContext.fillStyle = color;
                canvasContext.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

                canvasContext.strokeStyle = darkGrey;
                canvasContext.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
                
                canvasContext.strokeStyle = lightGrey;
                canvasContext.strokeRect(
                        (x * tileSize) + (tileSize * innerSquareOffsetFactor),
                        (y * tileSize) + (tileSize * innerSquareOffsetFactor),
                        tileSize * resizeFactor,
                        tileSize * resizeFactor);

                // Reset style so that when the code is returned,
                //     the style will be set to whatever it was before the function was called
                canvasContext.fillStyle   = tempFill
                canvasContext.strokeStyle = tempStyle;
        }       // END drawSquare


        function generateNewPiece() {
                var p = pieces[parseInt(Math.random() * pieces.length)];

                return new Piece(p[0], p[1]);
        }


        function manipulatePiece(event) {
                event.preventDefault();

                switch(event.keyCode) {
                case 37: {      // Left
                        piece.moveLeft();
                } break;

                case 38: {      // Up
                        piece.rotate();
                } break;

                case 39: {      // Right
                        piece.moveRight();
                } break;

                case 40: {      // Down
                        piece.down();
                } break;

                default: { }
                }       // END switch-case
        }       // END manipulatePiece


        function Piece(patterns, color) {
                this.pattern      = patterns[0];
                this.patterns     = patterns;
                this.patternIndex = 0;

                this.color = color;

                this.x = (width / 2) - parseInt(Math.ceil(this.pattern.length / 2), 10);     // Start piece in the center of the board
                this.y = -2;    // Start piece above the board, hidden
        }       // END Piece

        Piece.prototype._collides = function(dx, dy, pattern) {
                var BLOCK         = 2,
                    patternLength = pattern.length,
                    WALL          = 1,
                    x,
                    y;

                for (var ix = 0; ix < patternLength; ix++) {
                        for (var iy = 0; iy < patternLength; iy++) {
                                if (!pattern[ix][iy]) {
                                        continue;       // `continue` skips one iteration of a loop
                                }

                                x = this.x + ix + dx;
                                y = this.y + iy + dy;

                                if (y >= height || x < 0 || x >= width) {
                                        return WALL;
                                }

                                if (y < 0) {
                                        // Ignore negative space rows
                                        continue;
                                }

                                if (board[y][x] !== "") {
                                        return BLOCK;
                                }
                        }
                }

                return 0;
        };      // END Piece._collides

        Piece.prototype.down = function () {
                if (this._collides(0, 1, this.pattern)) {
                        // Piece hits something and should be locked in place
                        // A new piece should be spawned
                        this.lock();
                        piece = generateNewPiece();
                } else {
                        this.undraw();
                        this.y++;
                        this.draw();
                }
        };      // END Piece.down
        
        Piece.prototype.draw = function() {
                this._fill(this.color);
        };      // END Piece.draw

        Piece.prototype._fill = function (color) {
                var patternLength           = this.pattern.length,
                    x                       = this.x,
                    y                       = this.y;

                for (var ix = 0; ix < patternLength; ix++) {
                        for (var iy; iy < patternLength; iy++) {
                                if (this.pattern[ix][iy]) {
                                        drawSquare(x + ix, y + iy, color);
                                }
                        }
                }
        };      // END Piece._fill

        Piece.prototype.lock = function() {
                var line          = true,
                    numLines      = 0,
                    patternLength = this.pattern.length;

                for (var ix = 0; ix < patternLength; ix++) {
                        for (var iy = 0; iy < patternLength; iy++) {
                                if (!this.pattern[ix][iy]) {
                                        continue;
                                }

                                if (this.y + iy < 0) {
                                        // Game ends!
                                        alert("You're done!");
                                        gameOver = true;
                                        return;
                                }

                                board[this.y + iy][this.x + ix] = this.color;
                        }
                }

                for (var y = 0; y < height; y++) {
                        line = true;

                        for (var x = 0; x < width; x++) {
                                line = line && !board[y][x];
                        }

                        if (line) {
                                for (var y2 = y; y2 > 1; y2--) {
                                        for (var x = 0; x < width; x++) {
                                                board[y2][x] = board[y2 - 1][x];
                                        }
                                }

                                for (var x = 0; x < width; x++) {
                                        board[0][x] = false;
                                }

                                numLines++;
                        }
                }

                if (numLines > 0) {
                        lines += numLines;
                        drawBoard();
                        lineCountHtml.textContent = "Lines: " + lines;
                }
        };      // END Piece.lock

        Piece.prototype.moveLeft = function () {
                if (!this._collides(-1, 0, this.pattern)) {
                        this.undraw();
                        this.x--;
                        this.draw();
                }
        };      // END Piece.moveLeft

        Piece.prototype.moveRight = function () {
                if (!this._collides(1, 0, this.pattern)) {
                        this.undraw();
                        this.x++;
                        this.draw();
                }
        };      // END Piece.moveRight


        Piece.prototype.rotate = function () {
                var patternLength = this.patterns.length,
                    nextPattern   = this.patterns[(this.patternIndex + 1) % patternLength],
                    nudge         = 0;

                // Check kickback
                if (this._collides(0, 0, nextPattern)) {
                        nudge = this.x > (width / 2) ? -1 : 1;
                }
                
                if (!this._collides(0, 0, nextPattern)) {
                        this.undraw();
                        this.x += nudge;
                        this.patternIndex = (this.patternIndex + 1) % patternLength;
                        this.pattern = this.patterns[this.patternIndex];
                        this.draw();
                }
        };      // END Piece.rotate

        Piece.prototype.undraw = function() {
                this._fill(clearColor);
        };      // END Piece.undraw


        // Reset all board tiles state to empty (false)
        // Useful for starting new game or restarting
        function resetBoard() {
                lineCountHtml.textContent = "Lines: 0";

                for (var row = 0; row < height; row++) {
                        board[row] = [];
        
                        for (var column = 0; column < width; column++) {
                                board[row][column] = "";
                        }
                }
        }       // END resetBoard


        function update() {
                var currentTime  = Date.now(),
                    delta        = currentTime - dropStart,
                    gameInterval = 1000;

                if (delta > gameInterval) {
                        piece.down();
                        dropStart = currentTime;
                }

                if (!gameOver) {
                        requestAnimationFrame(update);
                }
        }


        window.addEventListener("keypress", manipulatePiece, false);
}       // END init

window.addEventListener("DOMContentLoaded", init, false);