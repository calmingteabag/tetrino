// Game Setup
// Okay I just understood what I need to do
// Basically, some sort of pooling needs to be set up. If a square moves to the right, the entire canvas needs to be reset (aka,
// all pixes refering to the square erased ) then square needs to be redrawn again in the next position


class TetrinoGame {
    constructor() {
        this.x_pos = 0;
        this.y_pos = 0;
        // this.classCanvas = document.getElementById("gamecanvas")
        // Need to know why this.classCanvas returns null
    };

    clearGamingArea() {
        let gameCanvas = document.getElementById("gamecanvas")
        let gameContext = gameCanvas.getContext("2d")

        gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height)
    };

    // Element (it's a square for now)
    squareElement(x_pos, y_pos, color) {
        // Element that will be drawn 
        let gameCanvas = document.getElementById("gamecanvas")
        let gameContext = gameCanvas.getContext("2d")

        // Width is relative to the canvas size instead of fixed values in px. it 'solves'
        // the problem regarding screen size

        // Math.ceil to return a integer number, so squares won't be blurry. Hopefully it won't
        // mess collision
        let width = Math.ceil(gameCanvas.width / 10)
        let height = Math.ceil(gameCanvas.height / 20)

        gameContext.fillStyle = color
        gameContext.fillRect(x_pos, y_pos, width, height)
    };

    // Element movement
    moveElementUp() {
        // Moves upward (just for testing, pieces don't move up in tetris)
        this.refreshGameArea()
        let gameCanvas = document.getElementById("gamecanvas")
        let x_move = this.x_pos
        let y_move = this.y_pos -= Math.floor(gameCanvas.height / 20)
        if (y_move < 0) {
            this.squareElement(x_move, y_move, 'red')
        }

    }

    moveElementDown() {
        // Moves downward
        this.refreshGameArea()
        let gameCanvas = document.getElementById("gamecanvas")
        let x_move = this.x_pos
        let y_move = this.y_pos += Math.ceil(gameCanvas.height / 20)
        if (y_move <= gameCanvas.height) {
            this.squareElement(x_move, y_move, 'red')
        }


    }

    moveElementLeft() {
        // Moves left
        this.refreshGameArea()
        let gameCanvas = document.getElementById("gamecanvas")
        let x_move = this.x_pos -= Math.ceil(gameCanvas.width / 10)
        let y_move = this.y_pos
        this.squareElement(x_move, y_move, 'red')
    }

    moveElementRight() {
        // Moves right
        this.refreshGameArea()
        let gameCanvas = document.getElementById("gamecanvas")
        let x_move = this.x_pos += Math.ceil(gameCanvas.width / 10)
        let y_move = this.y_pos
        this.squareElement(x_move, y_move, 'red')
    }

    moveElementRotate() {
        // Rotates element
    }

    moveSquare(usrkey) {
        // Moves element by calling directions
        console.log(usrkey.key)

        if (usrkey.key == 'ArrowUp' || usrkey.key == 'w') {
            this.moveElementUp()

        } else if (usrkey.key == 'ArrowDown' || usrkey.key == 's') {
            this.moveElementDown()

        } else if (usrkey.key == 'ArrowLeft' || usrkey.key == 'a') {
            this.moveElementLeft()

        } else if (usrkey.key == 'ArrowRight' || usrkey.key == 'd')
            this.moveElementRight()
    };

    refreshGameArea() {
        this.clearGamingArea()
    };

    // Run game
    loadAllListeners() {
        document.addEventListener("DOMContentLoaded", () => { this.squareElement(0, 0, 'red') }, false);
        // document.addEventListener("DOMContentLoaded", this.clearGamingArea, false);
        document.addEventListener('keydown', (key) => { this.moveSquare(key) });
    };
};

// Game Execution
newGame = new TetrinoGame()
newGame.loadAllListeners()

