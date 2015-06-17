function LPiece() {
        this.state1 = [ [1, 0],
                        [1, 0],
                        [1, 1] ];

        this.state2 = [ [0, 0, 1],
                        [1, 1, 1] ];

        this.state3 = [ [1, 1],
                        [0, 1],
                        [0, 1] ];

        this. state4 = [ [1, 1, 1],
                         [1, 0, 0] ];

        this.states = [ this.state1, this.state2, this.state3, this.state4 ];
        this.currentState = 0;

        this.color = 0;
        this.gridX = 4;         // Start at around horizontal center
        this.gridY = -3;        // Initially start above the board
}


function ReverseLPiece() {
        this.state1 = [ [0, 1],
                        [0, 1],
                        [1, 1] ];

        this.state2 = [ [1, 1, 1],
                        [0, 0, 1] ];

        this.state3 = [ [1, 1],
                        [1, 0],
                        [1, 0] ];

        this.state4 = [ [1, 0, 0],
                        [1, 1, 1] ];

        this.states = [ this.state1, this.state2, this.state3, this.state4 ];
        this.currentState = 0;

        this.color = 0;
        this.gridX = 4;         // Start at around horizontal center
        this.gridY = -3;        // Initially start above the board
}


function BlockPiece() {
        this.state1 = [ [1, 1],
                        [1, 1] ];

        this.states = [ this.state1 ];
        this.currentState = 0;

        this.color = 0;
        this.gridX = 4;         // Start at around horizontal center
        this.gridY = -2;        // Initially start above the board
}


function LinePiece() {
        this.state1 = [ [1],
                        [1],
                        [1],
                        [1] ];

        this.state2 = [ [1, 1, 1, 1] ];

        this.states = [ this.state1, this.state2 ];
        this.currentState = 0;

        this.color = 0;
        this.gridX = 5;         // Start at around horizontal center
        this.gridY = -4;        // Initially start above the board
}


function TPiece() {
        this.state1 = [ [1, 1, 1],
                        [0, 1, 0] ];

        this.state2 = [ [1, 0],
                        [1, 1],
                        [1, 0] ];

        this.state3 = [ [0, 1, 0],
                        [1, 1, 1] ];

        this.state4 = [ [0, 1],
                        [1, 1],
                        [0, 1] ];

        this.states = [ this.state1, this.state2, this.state3, this.state4 ];
        this.currentState = 0;

        this.color = 0;
        this.gridX = 4;         // Start at around horizontal center
        this.gridY = -2;        // Initially start above the board
}


function ZPiece() {
        this.state1 = [ [1, 1, 0],
                        [0, 1, 1] ];

        this.state2 = [ [0, 1],
                        [1, 1],
                        [1, 0] ];

        this.states = [ this.state1, this.state2 ];
        this.currentState = 0;

        this.color = 0;
        this.gridX =  4;
        this.gridY = -2;
}


function ReverseZPiece() {
        this.state1 = [ [0, 1, 1],
                        [1, 1, 0] ];

        this.state2 = [ [1, 0],
                        [1, 1],
                        [0, 1] ];

        this.states = [ this.state1, this.state2 ];
        this.currentState = 0;

        this.color = 0;
        this.gridX =  4;
        this.gridY = -2;
}


function getRandomPiece() {
        var numPieces = 7;
        var numColors = 8;
        var randomIndex = Math.floor( Math.random() * numPieces );
        var piece;              // Hold new piece object

        switch(randomIndex) {
                case 0: piece = new LPiece();           break;
                case 1: piece = new BlockPiece();       break;
                case 2: piece = new ZPiece();           break;
                case 3: piece = new TPiece();           break;
                case 4: piece = new ReverseLPiece();    break;
                case 5: piece = new ReverseZPiece();    break;
                case 6: piece = new LinePiece();        break;
        }

        piece.color = Math.floor( Math.random() * numColors );

        return piece;
}