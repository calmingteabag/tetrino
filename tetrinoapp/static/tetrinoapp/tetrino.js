class TetrinoGame {
    constructor() {
        // Board could be customized here, insted of fixed values, it
        // would use values from constructor, for example:
        // newGame = TetrinoGame(10,20, 40) which would represent a board 10 tiles wide, 20 tiles
        // long, with a base piece width of 40pixels. 

        this.x_pos = 0;
        this.y_pos = 0;
        this.width = 40;
        this.height = 40;
        this.gameCoords = [];
        this.gameheight = 20;
        this.gamewidth = 10;
    };

    // Board setup
    gameBoardCreate(rowsize, colsize) {
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

    gameBoardFill() {
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
            xTileValue = 0
            yTileValue += 40

            for (let row = 0; row < gameCoordValues[column].length; row++) {
                let value = gameCoordValues[column][row]
                value['tileXinit'] = xTileValue
                value['tileYinit'] = yTileValue
                xTileValue += 40
            }
        }
    }

    gameBoardClear() {
        let gameCanvas = document.getElementById("gamecanvas")
        let gameContext = gameCanvas.getContext("2d")

        gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height)
    };

    gameBoardRefresh() {
        this.gameBoardClear()
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

    // Tetrino movement
    moveElementUp(x, y, x_max, y_max, color, tetrino) {
        // Just for testing, pieces don't move up in tetris)
        this.gameBoardRefresh()
        this.tetrinoBaseShape(x, y, x_max, y_max, color)
    }

    moveElementDown(x, y, x_max, y_max, color, tetrino) {
        this.gameBoardRefresh()
        this.tetrinoBaseShape(x, y, x_max, y_max, color)
    };

    moveElementLeft(x, y, x_max, y_max, color, tetrino) {
        this.gameBoardRefresh()
        this.tetrinoBaseShape(x, y, x_max, y_max, color)
    }

    moveElementRight(x, y, x_max, y_max, color, tetrino) {
        this.gameBoardRefresh()
        this.tetrinoBaseShape(x, y, x_max, y_max, color)
    }

    moveElementRotate() {
        // Rotates element
        // Some code magic here
    };

    moveCheckPosition(moveDirection) {
        /*
        Checks if next piece position is valid (cell tagged with free) or not by
        returning a bool
        
        The 'full' check would work generally this way:

        - Gets current piece orientation
        - Based on orientation and shape, get coordinates of pieces. Example, for "I" shape vertical,
        it will check one cell and for horizontal, 4 cells. EAch piece will need to have coordinates
        for that. Those coordinates are based com this.x and this.y which marks the piece's left-top 
        most part of it
        - Compares its current coordinates with the next space coordinates, based on which key was pressed
        - If next space is valid, allow piece to move
        */

        let currXpos = this.x_pos
        let currYpos = this.y_pos


        // this.gameCoords[this.y_pos][this.x_pos])[2] == 'free'

        if (moveDirection == 'down' && currYpos == this.gameheight - 1) {
            // just remembering this.gameheight -1 because array goes from 0 to length -1
            return false
        } else if (moveDirection == 'left' && currXpos == 0) {
            return false
        } else if (moveDirection == 'right' && currXpos == this.gamewidth - 1) {
            return false
        } else if (moveDirection == 'up' && currYpos == 0) {
            return false
        }
        return true
    }

    moveTetrino(usrkey) {

        if ((usrkey.key == 'ArrowUp' || usrkey.key == 'w') && (this.moveCheckPosition('up') == true)) {
            this.y_pos--

            let xCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]
            let yCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]

            this.moveElementUp(xCoordDraw, yCoordDraw, this.width, this.height, "FF00FF")

        } else if ((usrkey.key == 'ArrowDown' || usrkey.key == 's') && (this.moveCheckPosition('down') == true)) {
            this.y_pos++

            let xCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]
            let yCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]

            this.moveElementDown(xCoordDraw, yCoordDraw, this.width, this.height, "FF00FF")

        } else if ((usrkey.key == 'ArrowLeft' || usrkey.key == 'a') && (this.moveCheckPosition('left') == true)) {
            this.x_pos--

            let xCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]
            let yCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]

            this.moveElementLeft(xCoordDraw, yCoordDraw, this.width, this.height, "FF00FF")

        } else if ((usrkey.key == 'ArrowRight' || usrkey.key == 'd') && (this.moveCheckPosition('right') == true)) {
            this.x_pos++

            let xCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]
            let yCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]

            this.moveElementRight(xCoordDraw, yCoordDraw, this.width, this.height, "FF00FF")
        }

        console.log(usrkey.key)
        console.log(`Curr board X position is: ${this.x_pos}`)
        console.log(`Curr board Y position is: ${this.y_pos}`)
        console.log(`Curr draw X position is: ${Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]}`)
        console.log(`Curr draw Y position is: ${Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]}`)
        console.log(`Curr draw tile state is: ${Object.values(this.gameCoords[this.y_pos][this.x_pos])[2]}`)
        // return coord x from big ass array. Read it as, get object on array pos 0,0, get first element of dict (which is the
        // current position's x coord, for drawing)
    };

    // Run game
    loadAllListeners() {
        document.addEventListener("DOMContentLoaded", () => { this.tetrinoBaseShape(0, 0, 40, 40, "#33ccff") }, false);
        document.addEventListener('keydown', (key) => { this.moveTetrino(key) });
    };
};


newGame = new TetrinoGame()
newGame.gameBoardCreate(10, 20)
newGame.gameBoardFill()
newGame.loadAllListeners()
