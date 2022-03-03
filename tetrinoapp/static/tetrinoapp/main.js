

class TetrinoGame {
    /*
    What gave me headaches was that the game actually need to have two coordinate system, one 'logic'
    in the form of an 2x2 array in which each position is a tile and another that tells where in the 
    canvas something needs to be drawn. The way I did is, that I knew pieces should move so I used
    a single coordinate system that updated their values based on the tile size so for example if
    the user wanted to move something downwards and tiles had a size of 40x40 pixels I just made the
    program increment coordinates by 40. Tried doing this way because I feel that I had the experience
    but actually didn't had.

    It worked, but I soon realized it was just drawing and moving stuff on canvas and needed a way
    to track where things are located on it so collisions and other things like line cleaning could
    work. Went back into reseach mode and found a video of someone separating drawing from logic by
    creating two 'coordinate' systems, one that tracked wheter a tile had a piece in it and another to 
    tell where it should draw something using that specific cell as reference.
    
    So I created an 2x2 array representing the board and each element of this array is an object
    that contains coordinates and a flag to tell if its occupied or not. Those coordinates tells where
    it should start drawing a piece.

    Now to move a piece the program just needs to update the array position by incrementing one on any
    directions and the piece will be drawn based on that, using the object's values on that position
    as arguments. Collisions also works because, before moving (aka incrementing by one), it can also
    check of the next cell is a valid position or not.
    */
    constructor() {
        // Board could be customized here, insted of fixed values, it
        // would use values from constructor, for example:
        // newGame = TetrinoGame(10,20, 40) which would represent a board 10 tiles wide, 20 tiles
        // long, with a base piece width of 40pixels. 

        this.x_pos = 0;
        this.y_pos = 0;
        this.width = 40;
        this.height = 40;
        this.gameCoords = []; // board
        this.gameheight = 20; // board height
        this.gamewidth = 10; // board width
        this.currPiece = ''
        this.pieceCoord = ''
        this.pieceColor = ''
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
        // Randomly generates a tetrino.


        let pieceChoice = {
            'shapeI': [[[0, 0], [0, 1], [0, 2], [0, 3]], 'red'],
            'shapeS': [[[0, 0], [0, 1], [1, 1], [1, 2]], 'green'],
            'shapeSqr': [[[0, 0], [0, 1], [1, 0], [1, 1]], 'yellow'],
            'shapeL': [[[0, 0], [0, 1], [0, 2], [1, 2]], 'orange'],
            'shapeCross': [[[0, 0], [0, 1], [0, 2], [1, 1]], 'purple'],
        }

        let percent = Math.random();
        let num = Math.floor(percent * (Math.floor(4) - Math.ceil(0) + 1))

        let piece = Object.keys(pieceChoice)[num]
        let coords = Object.values(pieceChoice)[num][0]
        let color = Object.values(pieceChoice)[num][1]

        let pieceCoord = [piece, coords, color]

        return pieceCoord
    }

    tetrinoGame(key) {

        if (this.currPiece == '') {
            let pieceData = this.tetrinoSpawn()
            this.currPiece = pieceData[0]
            this.pieceCoord = pieceData[1]
            this.pieceColor = pieceData[2]
        }

        this.moveTetrino(key, this.currPiece, this.pieceCoord, this.pieceColor)
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
        // console.log('Shape I')
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext('2d')

        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.strokeStyle = color
        ctx.moveTo(x, y)
        ctx.lineTo(x + (width * 4), y)
        ctx.lineTo(x + (width * 4), y + width)
        ctx.lineTo(x, y + width)
        ctx.lineTo(x, y)
        ctx.stroke()
    };

    tetrinoShapeS(x, y, width, color) {
        // console.log('Shape S')
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext('2d')

        ctx.beginPath()
        ctx.lineWidth = 3
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
        // console.log('Shape Sqr')
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext('2d')

        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.strokeStyle = color
        ctx.moveTo(x, y)
        ctx.lineTo(x + (width * 2), y)
        ctx.lineTo(x + (width * 2), y + (width * 2))
        ctx.lineTo(x, y + (width * 2))
        ctx.lineTo(x, y)
        ctx.stroke()
    };

    tetrinoShapeL(x, y, width, color) {
        // console.log('Shape L')
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext('2d')

        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.strokeStyle = color
        ctx.moveTo(x, y)
        ctx.lineTo(x + width, y)
        ctx.lineTo(x + width, y + (width * 2))
        ctx.lineTo(x + (width * 2), y + (width * 2))
        ctx.lineTo(x + (width * 2), y + (width * 3))
        ctx.lineTo(x, y + (width * 3))
        ctx.lineTo(x, y)
        ctx.stroke()
    };

    tetrinoShapeCross(x, y, width, color) {
        // console.log('Shape Cross')
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext('2d')

        ctx.beginPath()
        ctx.lineWidth = 3
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

    // Tetrino Draw
    tetrinoDraw(piece, x, y, width, color) {

        if (piece == 'shapeI') {
            this.tetrinoShapeI(x, y, width, color)

        } else if (piece == 'shapeS') {
            this.tetrinoShapeS(x, y, width, color)

        } else if (piece == 'shapeSqr') {
            this.tetrinoShapeSqr(x, y, width, color)

        } else if (piece == 'shapeL') {
            this.tetrinoShapeL(x, y, width, color)

        } else if (piece == 'shapeCross') {
            this.tetrinoShapeCross(x, y, width, color)
        }
    }

    tetrinoElementRotate() {
        // Rotates element
        // Some code magic here
    };

    moveCheckPosition(moveDir, pieceCoord) {

        let currXpos = this.x_pos
        let currYpos = this.y_pos
        let checkCoord = [[], [], [], []]
        // console.log(pieceCoord)
        // console.log(pieceCoord.length)
        /* Assuming coordarray of our piece reaches this place safe and sound:

        The coordinates we receive will be 'what spaces it occupies based on 
        current this.x_pos and this.y_pos.' Those two are our base coordinates 
        of all pieces.

        So let's say, our piece is sitting on this.x_pos of [4] and this.y_pos of [5]
        and we receive coordinates for a Square tetromino, which will come in the form
        of [0,0][0,1][1,0][1,1] or something similar. 

        What this coordinates tells is relative position. So, we need to create another
        array with updated positions using the array we received. Looks confusing but
        it will be something like this:

        [0 + 4, 0 + 5][0 + 4, 1 + 5][1 + 4, 0 + 5][1 + 4, 1 + 5]

        And the result coordinates will be:
        [4,5][4,6][5,5][5,6]

        Then, if we are checking for a down movement we do some kind of loop
        through the array and check all "Y" coordinates + 1, to see if its a valid
        position by either being on board range, in this case < 20 or by checking if
        next below cell is marked as free.

        The for loop is necessary because we need to ensure all shape fills in the space below
        or else, clipping may occur.
        */


        // && currYpos == this.gameheight - 1
        if (moveDir == 'down') {
            // when player presses 'down' key, loop thorough piece's board coordinates
            // and check all x coordinates if their position + 1 is a valid space (for
            // now, its checking of board has ended). return false

            // arr.push is transforming into a list of elements [1,2,3,4] but I want [[1,2][3.4]] instead

            for (let elem of pieceCoord) {
                let tempArr = []
                tempArr.push(elem[0] + this.x_pos)
                tempArr.push(elem[1] + this.y_pos)
                console.log(tempArr)
                checkCoord += tempArr
            }


            console.log(`here is ${checkCoord}`)

            for (let coord of checkCoord) {
                if (coord[0] + 1 > this.gameheight)
                    // also need && Object.values(this.gameCoords[this.y_pos + 1][this.x_pos])[2]) == 'occupied'
                    return false
            }
            // checkCoord = ''


        } else if (moveDir == 'left' && currXpos == 0) {
            // [0,0][0,1][1,0][1,1] example piece coord
            // iterate over all elements
            // on an element, [0,0], add this.x_pos to the first value and this.y_pos to the second, add then
            // to temp arr
            // add this arr to checkcollision
            // reset temp arr

            return false
        } else if (moveDir == 'right' && currXpos == this.gamewidth - 1) {
            return false
        } else if (moveDir == 'up' && currYpos == 0) {
            return false
        }
        return true
    }

    moveTetrino(usrkey, piece, pieceCoord, pieceColor) {
        // What this function does is 'moving' elements, aka, updates this.x or this.y and draws a piece.
        // so this.moveElement was renamed to drawElement, because it just draws element in new position

        if ((usrkey.key == 'ArrowUp' || usrkey.key == 'w') && (this.moveCheckPosition('up', pieceCoord) == true)) {
            // console.log(piece)
            // console.log(pieceCoord)
            this.y_pos--
            let xCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]
            let yCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]
            this.gameBoardRefresh()
            this.tetrinoDraw(piece, xCoordDraw, yCoordDraw, this.width, pieceColor)

        } else if ((usrkey.key == 'ArrowDown' || usrkey.key == 's') && (this.moveCheckPosition('down', pieceCoord) == true)) {
            // console.log(piece)
            // console.log(pieceCoord)
            this.y_pos++

            let xCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]
            let yCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]
            this.gameBoardRefresh()
            this.tetrinoDraw(piece, xCoordDraw, yCoordDraw, this.width, pieceColor)

        } else if ((usrkey.key == 'ArrowLeft' || usrkey.key == 'a') && (this.moveCheckPosition('left', pieceCoord) == true)) {
            // console.log(piece)
            // console.log(pieceCoord)
            this.x_pos--

            let xCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]
            let yCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]
            this.gameBoardRefresh()
            this.tetrinoDraw(piece, xCoordDraw, yCoordDraw, this.width, pieceColor)

        } else if ((usrkey.key == 'ArrowRight' || usrkey.key == 'd') && (this.moveCheckPosition('right', pieceCoord) == true)) {
            // console.log(piece)
            // console.log(pieceCoord)
            this.x_pos++

            let xCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]
            let yCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]
            this.gameBoardRefresh()
            this.tetrinoDraw(piece, xCoordDraw, yCoordDraw, this.width, pieceColor)

        }

        // console.log(`Curr key pressed is: ${usrkey.key}`)
        // console.log(`Curr piece is: ${this.currPiece}`)
        // console.log(`Curr piece coords is: ${this.pieceCoord}`)
        // console.log(`Curr piece color is: ${this.pieceColor}`)
        // console.log(`Curr board X position is: ${this.x_pos}`)
        // console.log(`Curr board Y position is: ${this.y_pos}`)
        // console.log(`Curr draw X position is: ${Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]}`)
        // console.log(`Curr draw Y position is: ${Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]}`)
        // console.log(`Curr draw tile state is: ${Object.values(this.gameCoords[this.y_pos][this.x_pos])[2]}`)

    };

    tetrinoTestShape(x, y, width, color) {
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext("2d")


        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.strokeStyle = color
        ctx.moveTo(x, y)
        ctx.lineTo(x + (width * 2), y)
        ctx.lineTo(x + (width * 2), y + (width * 2))
        ctx.lineTo(x, y + (width * 2))
        ctx.lineTo(x, y)
        ctx.stroke()

        // ctx.lineWidth = 5
        // ctx.strokeStyle = 'green'
        // ctx.moveTo(x + 2, y + 2)
        // ctx.stroke()
        // ctx.lineTo(x + 2 + (width * 2), y + 2)
        // ctx.lineTo(x + 2 + ((width - 4) * 2), y + 2 + ((width - 4) * 2))
        // ctx.lineTo(x + 2, y + 2 + ((width - 4) * 2))
        // ctx.lineTo(x + 2, y + 2)



    }

    // Run game
    loadAllListeners() {
        // document.addEventListener("DOMContentLoaded", () => { this.tetrinoTestShape(0, 0, 40, 'red') }, false);
        document.addEventListener('keydown', (key) => { this.tetrinoGame(key) });
    };
};


newGame = new TetrinoGame()
newGame.gameBoardCreate(10, 20)
newGame.gameBoardFill()
newGame.loadAllListeners()
