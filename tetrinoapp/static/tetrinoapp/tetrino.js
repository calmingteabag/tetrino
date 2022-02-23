class TetrinoGame {
    constructor() {
        this.x_pos = 0;
        this.y_pos = 0;
        this.width = 40;
        this.height = 40;
        this.gameCoords = [];
        this.gameheight = 20;
        this.gamewidth = 10;
    };

    createGameBoard(rowsize, colsize) {
        for (let column = 0; column < colsize; column++) {
            this.gameCoords.push([])
            this.gameCoords[column].push(new Array(this.gamewidth))

            for (let row = 0; row < rowsize; row++) {
                this.gameCoords[column][row] = {
                    'tileXinit': 0,
                    'tileYinit': 0,
                    'tileStatus': 'free',
                };
            };
        };


    };


    fillBoard() {

        /*
        Why yTileValue = -40:

        Rows are updated on inner loop and their indexes are reset when game changes columns. Since the very 
        first run already sets yTileValue to +40, making our first set of coordinates wrong (all y coords will 
        start at 40 insted of 0) I offset initial value to compensate.
        */

        let xTileValue = 0
        let yTileValue = -40

        let gameCoordValues = Object.values(this.gameCoords)

        for (let column = 0; column < gameCoordValues.length; column++) {
            console.log(gameCoordValues[column])
            xTileValue = 0
            yTileValue += 40

            for (let row = 0; row < gameCoordValues[column].length; row++) {
                let value = gameCoordValues[column][row]
                value['tileXinit'] = xTileValue
                value['tileYinit'] = yTileValue
                xTileValue += 40
            }
        }

        console.log(this.gameCoords)
        console.log(this.gameCoords[0][1])
    }



    clearGamingArea() {
        let gameCanvas = document.getElementById("gamecanvas")
        let gameContext = gameCanvas.getContext("2d")

        gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height)
    };

    refreshGameArea() {
        this.clearGamingArea()
    };

    // Tetrino shapes
    tetrinoBaseShape(x_init, y_init, x_end, y_end, color) {

        let gameCanvas = document.getElementById("gamecanvas")
        let gameContext = gameCanvas.getContext("2d")

        // Line Style
        gameContext.beginPath()
        gameContext.lineWidth = 1
        gameContext.strokeStyle = color
        gameContext.rect(x_init, y_init, x_end, y_end)
        gameContext.stroke()

        // Fill Style
        // gameContext.fillStyle = color
        // gameContext.fillRect(this.x_pos, this.y_pos, this.width, this.height)
    };

    tetrinoShapeI(x_init, y_init, x_width, y_width, color) {
        this.tetrinoBaseShape(x_init, y_init, x_width, y_width, color)
        this.tetrinoBaseShape(x_init, y_init + y_width, x_width, y_width, color)
        this.tetrinoBaseShape(x_init, y_init + (2 * y_width), x_width, y_width, color)
        this.tetrinoBaseShape(x_init, y_init + (3 * y_width), x_width, y_width, color)
    };

    tetrinoShapeS(x_init, y_init, x_width, y_width, color) {
        this.tetrinoBaseShape(x_init, y_init, x_width, y_width, color)
        this.tetrinoBaseShape(x_init + x_width, y_init, x_width, y_width, color)
        this.tetrinoBaseShape(x_init + x_width, y_init + y_width, x_width, y_width, color)
        this.tetrinoBaseShape(x_init + (2 * x_width), y_init + y_width, x_width, y_width, color)
    };

    tetrinoShapeSqr(x_init, y_init, x_width, y_width, color) {
        this.tetrinoBaseShape(x_init, y_init, x_width, y_width, color)
        this.tetrinoBaseShape(x_init + x_width, y_init, x_width, y_width, color)
        this.tetrinoBaseShape(x_init, y_init + y_width, x_width, y_width, color)
        this.tetrinoBaseShape(x_init + x_width, y_init + y_width, x_width, y_width, color)
    };

    tetrinoShapeL(x_init, y_init, x_width, y_width, color) {
        this.tetrinoBaseShape(x_init, y_init, x_width, y_width, color)
        this.tetrinoBaseShape(x_init, y_init + y_width, x_width, y_width, color)
        this.tetrinoBaseShape(x_init, y_init + (2 * y_width), x_width, y_width, color)
        this.tetrinoBaseShape(x_init + x_width, y_init + (2 * y_width), x_width, y_width, color)
    };

    tetrinoShapeCross(x_init, y_init, x_width, y_width, color) {
        this.tetrinoBaseShape(x_init + x_width, y_init, x_width, y_width, color)
        this.tetrinoBaseShape(x_init, y_init + y_width, x_width, y_width, color)
        this.tetrinoBaseShape(x_init + x_width, y_init + y_width, x_width, y_width, color)
        this.tetrinoBaseShape(x_init + (2 * x_width), y_init + y_width, x_width, y_width, color)
    };

    // Element movement
    moveElementUp(x, y, x_max, y_max, color, tetrino) {
        // Just for testing, pieces don't move up in tetris)
        this.refreshGameArea()

        if (this.y_pos < 0) {
            this.y_pos = 0
            this.tetrinoBaseShape(x, this.y_pos, x_max, y_max, color)
        } else {
            this.tetrinoBaseShape(x, y, x_max, y_max, color)
        }
    };

    moveElementDown(x, y, x_max, y_max, color, tetrino) {
        this.refreshGameArea()
        if (this.y_pos == 800) {
            this.y_pos = 760
            this.tetrinoBaseShape(x, this.y_pos, x_max, y_max, color)
        } else {
            this.tetrinoBaseShape(x, y, x_max, y_max, color)
        }
    };

    moveElementLeft(x, y, x_max, y_max, color, tetrino) {
        this.refreshGameArea()

        if (this.x_pos < 0) {
            this.x_pos = 0
            this.tetrinoBaseShape(this.x_pos, y, x_max, y_max, color)
        } else {
            this.tetrinoBaseShape(x, y, x_max, y_max, color)
        }
    };

    moveElementRight(x, y, x_max, y_max, color, tetrino) {
        this.refreshGameArea()

        if (this.x_pos == 400) {
            this.x_pos = 360
            this.tetrinoBaseShape(this.x_pos, y, x_max, y_max, color)
        } else {
            this.tetrinoBaseShape(x, y, x_max, y_max, color)
        }
    };

    moveElementRotate() {
        // Rotates element
        // Some code magic here
    };

    moveTetrino(usrkey) {

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
        // console.log(this.gameCoords)

    };



    // Run game
    loadAllListeners() {
        document.addEventListener("DOMContentLoaded", () => { this.tetrinoBaseShape(0, 0, 40, 40, "#33ccff") }, false);
        // document.addEventListener("DOMContentLoaded", this.clearGamingArea, false);
        document.addEventListener('keydown', (key) => { this.moveTetrino(key) });
    };
};


newGame = new TetrinoGame()
newGame.loadAllListeners()
newGame.createGameBoard(10, 20)
// newGame.fillBoard(40)
newGame.fillBoard()

