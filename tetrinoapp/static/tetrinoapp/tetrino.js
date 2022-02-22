// Game Setup
// Okay I just understood what I need to do
// Basically, some sort of pooling needs to be set up. If a square moves to the right, the entire canvas needs to be reset (aka,
// all pixes refering to the square erased ) then square needs to be redrawn again in the next position


// moveTetrino updates positions (x, y, etc)
// moveTetrino passes positions to moveLeft
// moveleft passes positions to baseElement
// baseElement draws element

class TetrinoGame {
    constructor() {
        this.x_pos = 0;
        this.y_pos = 0;
        this.width = 40;
        this.height = 40;
        // this.classCanvas = document.getElementById("gamecanvas")
        // Need to know why this.classCanvas returns null
    };

    clearGamingArea() {
        let gameCanvas = document.getElementById("gamecanvas")
        let gameContext = gameCanvas.getContext("2d")

        gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height)
    };

    // Elements
    baseElement(x_init, y_init, x_end, y_end, color) {
        // Base element
        let gameCanvas = document.getElementById("gamecanvas")
        let gameContext = gameCanvas.getContext("2d")

        // Square style line
        gameContext.beginPath()
        gameContext.lineWidth = 1
        gameContext.strokeStyle = color
        gameContext.rect(x_init, y_init, x_end, y_end)
        gameContext.stroke()

        // Square style fill
        // gameContext.fillStyle = color
        // gameContext.fillRect(this.x_pos, this.y_pos, this.width, this.height)
    };

    // Tetrino shapes
    // Tetrino "S"
    tetrinoShapeI(x_init, y_init, x_width, y_width, color) {
        this.baseElement(x_init, y_init, x_width, y_width, color)
        this.baseElement(x_init, y_init + y_width, x_width, y_width, color)
        this.baseElement(x_init, y_init + (2 * y_width), x_width, y_width, color)
        this.baseElement(x_init, y_init + (3 * y_width), x_width, y_width, color)
    }

    tetrinoShapeS(x_init, y_init, x_width, y_width, color) {
        this.baseElement(x_init, y_init, x_width, y_width, color)
        this.baseElement(x_init + x_width, y_init, x_width, y_width, color)
        this.baseElement(x_init + x_width, y_init + y_width, x_width, y_width, color)
        this.baseElement(x_init + (2 * x_width), y_init + y_width, x_width, y_width, color)
    }

    tetrinoShapeSqr(x_init, y_init, x_width, y_width, color) {
        this.baseElement(x_init, y_init, x_width, y_width, color)
        this.baseElement(x_init + x_width, y_init, x_width, y_width, color)
        this.baseElement(x_init, y_init + y_width, x_width, y_width, color)
        this.baseElement(x_init + x_width, y_init + y_width, x_width, y_width, color)
    }

    tetrinoShapeL(x_init, y_init, x_width, y_width, color) {
        this.baseElement(x_init, y_init, x_width, y_width, color)
        this.baseElement(x_init, y_init + y_width, x_width, y_width, color)
        this.baseElement(x_init, y_init + (2 * y_width), x_width, y_width, color)
        this.baseElement(x_init + x_width, y_init + (2 * y_width), x_width, y_width, color)
    }

    tetrinoShapeCross(x_init, y_init, x_width, y_width, color) {
        this.baseElement(x_init + x_width, y_init, x_width, y_width, color)
        this.baseElement(x_init, y_init + y_width, x_width, y_width, color)
        this.baseElement(x_init + x_width, y_init + y_width, x_width, y_width, color)
        this.baseElement(x_init + (2 * x_width), y_init + y_width, x_width, y_width, color)
    }


    // Element movement
    moveElementUp(x, y, x_max, y_max, color, tetrino) {
        // Moves upward (just for testing, pieces don't move up in tetris)

        this.refreshGameArea()

        if (this.y_pos < 0) {
            this.y_pos = 0
            this.baseElement(x, this.y_pos, x_max, y_max, color)
        } else {
            this.baseElement(x, y, x_max, y_max, color)
        }
    }

    moveElementDown(x, y, x_max, y_max, color, tetrino) {
        // Moves downward

        this.refreshGameArea()

        if (this.y_pos == 800) {
            this.y_pos = 760
            this.baseElement(x, this.y_pos, x_max, y_max, color)
        } else {
            this.baseElement(x, y, x_max, y_max, color)
        }
    }


    moveElementLeft(x, y, x_max, y_max, color, tetrino) {
        // Moves left

        this.refreshGameArea()

        if (this.x_pos < 0) {
            this.x_pos = 0
            this.baseElement(this.x_pos, y, x_max, y_max, color)
        } else {
            this.baseElement(x, y, x_max, y_max, color)
        }
    }


    moveElementRight(x, y, x_max, y_max, color, tetrino) {
        // Moves right

        this.refreshGameArea()

        if (this.x_pos == 400) {
            this.x_pos = 360
            this.baseElement(this.x_pos, y, x_max, y_max, color)
        } else {
            this.baseElement(x, y, x_max, y_max, color)
        }
    }


    moveElementRotate() {
        // Rotates element
    }

    moveTetrino(usrkey) {
        // Moves element by calling directions

        if (usrkey.key == 'ArrowUp' || usrkey.key == 'w') {
            this.y_pos -= 40
            this.moveElementUp(this.x_pos, this.y_pos, this.width, this.height, "FF00FF")

        } else if (usrkey.key == 'ArrowDown' || usrkey.key == 's') {
            this.y_pos += 40
            this.moveElementDown(this.x_pos, this.y_pos, this.width, this.height, "FF00FF")

        } else if (usrkey.key == 'ArrowLeft' || usrkey.key == 'a') {
            this.x_pos -= 40
            this.moveElementLeft(this.x_pos, this.y_pos, this.width, this.height, "FF00FF")

        } else if (usrkey.key == 'ArrowRight' || usrkey.key == 'd') {
            this.x_pos += 40
            this.moveElementRight(this.x_pos, this.y_pos, this.width, this.height, "FF00FF")
        }

        console.log(usrkey.key)
        console.log(`Curr X position is: ${this.x_pos}`)
        console.log(`Curr Y position is: ${this.y_pos}`)

    };

    refreshGameArea() {
        this.clearGamingArea()
    };

    // Run game
    loadAllListeners() {
        document.addEventListener("DOMContentLoaded", () => { this.baseElement(0, 0, 40, 40, "#33ccff") }, false);
        // document.addEventListener("DOMContentLoaded", this.clearGamingArea, false);
        document.addEventListener('keydown', (key) => { this.moveTetrino(key) });
    };
};

// Game Execution
newGame = new TetrinoGame()
newGame.loadAllListeners()

