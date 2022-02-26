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
        this.color = 'green'
        this.gameCoords = [];
        this.gameheight = 20;
        this.gamewidth = 10;
        this.currPiece = ''
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

    // Game workflow
    /* 
    After the board is set up, need a control logic to deal, alongside movement,
    with piece spawn, and piece 'marking' - aka, when pieces stay on place after
    hitting bottom or another piece.

    Logic workflow (assuming board is created)

    - Spawn a random piece, should be at top center of board. Also 
    there should be enough space for a full spawn (pieces not clipping top part).
    - Losing condition should be trying to spawn a piece with spawn location already
    occupied by a piece (meaning board is full to the top).
    - The victory condition should be user reaching lv 99 or some crazy condition.
    It's tetris after all.
    - Pieces should fall automatically after spawning.
    - If piece reaches bottom or an obstacle(an piece already in), 'put' the piece
    in place.
    - Spawn new piece.
    */
    tetrinoSpawn() {
        // This creator function will be called by another control function

        // let pieceChoice = [
        //     this.tetrinoShapeI,
        //     this.tetrinoShapeS,
        //     this.tetrinoShapeSqr,
        //     this.tetrinoShapeL,
        //     this.tetrinoShapeCross,
        // ]


        // let percent = Math.random();
        // let num = Math.floor(percent * (Math.floor(4) - Math.ceil(0) + 1))

        // console.log(x, y, width, color)
        // return pieceChoice[num](x, y, width, color)
        let pieceChoice = ['shapeI', 'shapeS', 'shapeSqr', 'shapeL', 'shapeCross',]

        let percent = Math.random();
        let num = Math.floor(percent * (Math.floor(4) - Math.ceil(0) + 1))

        return pieceChoice[num]
    }

    tetrinoGame(key) {
        if (this.currPiece == '') {
            this.currPiece = this.tetrinoSpawn()
        }
        this.moveTetrino(key, this.currPiece)
    }

    // Tetrino shapes
    tetrinoBaseShape(x, y, width, color) {

        let gameCanvas = document.getElementById("gamecanvas")
        let gameContext = gameCanvas.getContext("2d")

        // Line Style
        gameContext.beginPath()
        gameContext.lineWidth = 1
        gameContext.strokeStyle = color
        gameContext.rect(x, y, width, width)
        gameContext.stroke()

        // Fill Style
        // gameContext.fillStyle = color
        // gameContext.fillRect(this.x_pos, this.y_pos, this.width, this.height)
    };

    tetrinoShapeI(x, y, width, color) {
        console.log('Shape I')
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext('2d')

        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = color
        ctx.moveTo(x, y)
        ctx.lineTo(x + (width * 4), y)
        ctx.lineTo(x + (width * 4), y + width)
        ctx.lineTo(x, y + width)
        ctx.lineTo(x, y)
        ctx.stroke()
    };

    tetrinoShapeS(x, y, width, color) {
        console.log('Shape S')
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext('2d')

        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = color
        ctx.moveTo(x, y)
        ctx.lineTo(x + width, y)
        ctx.lineTo(x + width, y + width)
        ctx.lineTo(x + (width * 2), y + width)
        ctx.lineTo(x + (width * 2), y + (width * 3))
        ctx.lineTo(x + (width), y + (width * 3))
        ctx.lineTo(x + (width), y + (width * 2))
        ctx.lineTo(x, y + (width * 2))
        ctx.lineTo(x, y)
        ctx.stroke()
    };

    tetrinoShapeSqr(x, y, width, color) {
        console.log('Shape Sqr')
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext('2d')

        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = color
        ctx.moveTo(x, y)
        ctx.lineTo(x + (width * 2), y)
        ctx.lineTo(x + (width * 2), y + (width * 2))
        ctx.lineTo(x, y + (width * 2))
        ctx.lineTo(x, y)
        ctx.stroke()
    };

    tetrinoShapeL(x, y, width, color) {
        console.log('Shape L')
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext('2d')

        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = color
        ctx.moveTo(x, y)
        ctx.lineTo(x + width, y)
        ctx.lineTo(x + width, y + (width * 2))
        ctx.lineTo(x + (width * 2), y + (width * 2))
        ctx.lineTo(x + (width * 2), y + (width * 3))
        ctx.lineTo(x, y + (width * 3))
        ctx.stroke()
    };

    tetrinoShapeCross(x, y, width, color) {
        console.log('Shape Cross')
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext('2d')

        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = color
        ctx.moveTo(x, y)
        ctx.lineTo(x + width, y)
        ctx.lineTo(x + width, y + width)
        ctx.lineTo(x + (width * 2), y + width)
        ctx.lineTo(x + (width * 2), y + (width * 2))
        ctx.lineTo(x + width, y + (width * 2))
        ctx.lineTo(x + width, y + (width * 3))
        ctx.lineTo(x, y + (width * 3))
        ctx.lineTo(x, y)
        ctx.stroke()
    };

    // Tetrino movement
    moveElement(piece, x, y, width, color) {

        if (piece == 'shapeI') {
            this.tetrinoShapeI(x, y, width, color)

        } else if (piece == 'shapeS') {
            this.tetrinoShapeS(x, y, width, color)

        } else if (piece = 'shapeSqr') {
            this.tetrinoShapeSqr(x, y, width, color)

        } else if (piece = 'shapeL') {
            this.tetrinoShapeL(x, y, width, color)

        } else if (piece = 'shapeCross') {
            this.teterinoShapeCross(x, y, width, color)

        }
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


        if (moveDirection == 'down' && currYpos == this.gameheight - 1) {
            // just remembering this.gameheight -1 because array goes from 0 to length -1
            // need to add another comparator, 
            // Object.values(this.gameCoords[this.y_pos][this.x_pos])[2] == '' 
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

    moveTetrino(usrkey, piece) {

        if ((usrkey.key == 'ArrowUp' || usrkey.key == 'w') && (this.moveCheckPosition('up') == true)) {
            this.y_pos--

            let xCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]
            let yCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]
            this.gameBoardRefresh()
            this.moveElement(piece, xCoordDraw, yCoordDraw, this.width, this.color)


        } else if ((usrkey.key == 'ArrowDown' || usrkey.key == 's') && (this.moveCheckPosition('down') == true)) {
            this.y_pos++

            let xCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]
            let yCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]
            this.gameBoardRefresh()
            this.moveElement(piece, xCoordDraw, yCoordDraw, this.width, this.color)


        } else if ((usrkey.key == 'ArrowLeft' || usrkey.key == 'a') && (this.moveCheckPosition('left') == true)) {
            this.x_pos--

            let xCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]
            let yCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]
            this.gameBoardRefresh()
            this.moveElement(piece, xCoordDraw, yCoordDraw, this.width, this.color)


        } else if ((usrkey.key == 'ArrowRight' || usrkey.key == 'd') && (this.moveCheckPosition('right') == true)) {
            this.x_pos++

            let xCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]
            let yCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]
            this.gameBoardRefresh()
            this.moveElement(piece, xCoordDraw, yCoordDraw, this.width, this.color)

        }

        console.log(usrkey.key)
        console.log(`Curr board X position is: ${this.x_pos}`)
        console.log(`Curr board Y position is: ${this.y_pos}`)
        console.log(`Curr draw X position is: ${Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]}`)
        console.log(`Curr draw Y position is: ${Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]}`)
        console.log(`Curr draw tile state is: ${Object.values(this.gameCoords[this.y_pos][this.x_pos])[2]}`)
    };

    tetrinoTestShape(x, y, width) {
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext("2d")

        // // Square shape

        // ctx.beginPath()
        // ctx.lineWidth = 2
        // ctx.strokeStyle = "red"
        // ctx.moveTo(x, y)
        // ctx.lineTo(x + (width * 2), y)
        // ctx.lineTo(x + (width * 2), y + (width * 2))
        // ctx.lineTo(x, y + (width * 2))
        // ctx.lineTo(x, y)
        // ctx.stroke()

        // // "I" shape

        // ctx.beginPath()
        // ctx.lineWidth = 2
        // ctx.strokeStyle = "red"
        // ctx.moveTo(x, y)
        // ctx.lineTo(x + (width * 4), y)
        // ctx.lineTo(x + (width * 4), y + width)
        // ctx.lineTo(x, y + width)
        // ctx.lineTo(x, y)
        // ctx.stroke()

        // // "L" shape

        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = "red"
        ctx.moveTo(x, y)
        ctx.lineTo(x + width, y)
        ctx.lineTo(x + width, y + (width * 2))
        ctx.lineTo(x + (width * 2), y + (width * 2))
        ctx.lineTo(x + (width * 2), y + (width * 3))
        ctx.lineTo(x, y + (width * 3))


        ctx.lineTo(x, y)
        ctx.stroke()

        // "S" shape
        // ctx.beginPath()
        // ctx.lineWidth = 2
        // ctx.strokeStyle = "red"
        // ctx.moveTo(x, y)
        // ctx.lineTo(x + width, y)
        // ctx.lineTo(x + width, y + width)
        // ctx.lineTo(x + (width * 2), y + width)
        // ctx.lineTo(x + (width * 2), y + (width * 3))
        // ctx.lineTo(x + (width), y + (width * 3))
        // ctx.lineTo(x + (width), y + (width * 2))
        // ctx.lineTo(x, y + (width * 2))
        // ctx.lineTo(x, y)
        // ctx.stroke()

        // "Cross" shape
        // ctx.beginPath()
        // ctx.lineWidth = 2
        // ctx.strokeStyle = "red"
        // ctx.moveTo(x, y)
        // ctx.lineTo(x + width, y)
        // ctx.lineTo(x + width, y + width)
        // ctx.lineTo(x + (width * 2), y + width)
        // ctx.lineTo(x + (width * 2), y + (width * 2))
        // ctx.lineTo(x + width, y + (width * 2))
        // ctx.lineTo(x + width, y + (width * 3))
        // ctx.lineTo(x, y + (width * 3))
        // ctx.lineTo(x, y)
        // ctx.stroke()


    }

    // Run game
    loadAllListeners() {
        // document.addEventListener("DOMContentLoaded", () => { this.tetrinoTestShape(0, 0, 40) }, false);
        // document.addEventListener("DOMContentLoaded", () => { this.tetrinoGame(this.x_pos, this.y_pos, this.width, this.color) }, false);
        // document.addEventListener('keydown', (key) => { this.moveTetrino(key) });
        document.addEventListener('keydown', (key) => { this.tetrinoGame(key) });


    };
};


newGame = new TetrinoGame()
newGame.gameBoardCreate(10, 20)
newGame.gameBoardFill()
newGame.loadAllListeners()
