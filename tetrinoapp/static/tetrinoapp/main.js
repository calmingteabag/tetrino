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
        this.gameCoords = []; // board
        this.gameheight = 20; // board height
        this.gamewidth = 10; // board width
        this.currPiece = ''
        this.pieceCoord = ''
        this.pieceColor = ''
        this.orientation = ''
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

    // Ramdomly generates a tetrino
    tetrinoSpawn() {

        let pieceChoice = {
            'shapeI': [[[0, 0], [1, 0], [2, 0], [3, 0]], 'red'],
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
            this.orientation = 'north'
        }

        this.moveTetrino(key, this.currPiece, this.pieceCoord, this.pieceColor, this.orientation)
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

    tetrinoShapeI(x, y, width, color, position) {
        // console.log('Shape I')
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext('2d')

        if (position == 'north' || position == 'south') {
            ctx.beginPath()
            ctx.lineWidth = 3
            ctx.strokeStyle = color
            ctx.moveTo(x, y)
            ctx.lineTo(x + (width * 4), y)
            ctx.lineTo(x + (width * 4), y + width)
            ctx.lineTo(x, y + width)
            ctx.lineTo(x, y)
            ctx.stroke()
        } else if (position == 'west' || position == 'east') {
            ctx.beginPath()
            ctx.lineWidth = 3
            ctx.strokeStyle = color
            ctx.moveTo(x, y)
            ctx.lineTo(x, y + (width * 4))
            ctx.lineTo(x + width, y + (width * 4))
            ctx.lineTo(x + width, y)
            ctx.lineTo(x, y)
            ctx.stroke()
        }

    };

    tetrinoShapeS(x, y, width, color, position) {
        // console.log('Shape S')
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext('2d')

        if (position == 'north' || position == 'south') {
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
        } else if (position == 'east' || position == 'west') {
            ctx.beginPath()
            ctx.lineWidth = 3
            ctx.strokeStyle = color
            ctx.moveTo(x + width, y)
            ctx.lineTo(x + (width * 3), y)
            ctx.lineTo(x + (width * 3), y + width)
            ctx.lineTo(x + (width * 4), y + width)
            ctx.lineTo(x + (width * 4), y + (width * 2))
            ctx.lineTo(x + (width * 2), y + (width * 2))
            ctx.lineTo(x + (width * 2), y + width)
            ctx.lineTo(x + width, y + width)
            ctx.lineTo(x + width, y)
            ctx.stroke()
        }
    };

    tetrinoShapeSqr(x, y, width, color, position) {
        // console.log('Shape Sqr')
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext('2d')

        let tetrinoPos = ['north', 'west', 'east', 'south']

        if (tetrinoPos.includes(position)) {
            ctx.beginPath()
            ctx.lineWidth = 3
            ctx.strokeStyle = color
            ctx.moveTo(x, y)
            ctx.lineTo(x + (width * 2), y)
            ctx.lineTo(x + (width * 2), y + (width * 2))
            ctx.lineTo(x, y + (width * 2))
            ctx.lineTo(x, y)
            ctx.stroke()
        }

    };

    tetrinoShapeL(x, y, width, color, position) {
        // console.log('Shape L')
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext('2d')


        if (position == 'north') {
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
        } else if (position == 'west') {
            ctx.beginPath()
            ctx.lineWidth = 3
            ctx.strokeStyle = color
            ctx.moveTo(x + width, y + width)
            ctx.lineTo(x + (width * 3), y + width)
            ctx.lineTo(x + (width * 3), y)
            ctx.lineTo(x + (width * 4), y)
            ctx.lineTo(x + (width * 4), y + (width * 2))
            ctx.lineTo(x + width, y + (width * 2))
            ctx.lineTo(x + width, y + width)
            ctx.stroke()
        } else if (position == 'south') {
            ctx.beginPath()
            ctx.lineWidth = 3
            ctx.strokeStyle = color
            ctx.moveTo(x + width, y + width)
            ctx.lineTo(x + (width * 3), y + width)
            ctx.lineTo(x + (width * 3), y + (width * 4))
            ctx.lineTo(x + (width * 2), y + (width * 4))
            ctx.lineTo(x + (width * 2), y + (width * 2))
            ctx.lineTo(x + width, y + (width * 2))
            ctx.lineTo(x + width, y + width)
            ctx.stroke()
        } else if (position == 'east') {
            ctx.beginPath()
            ctx.lineWidth = 3
            ctx.strokeStyle = color
            ctx.moveTo(x + width, y + width)
            ctx.lineTo(x + (width * 4), y + width)
            ctx.lineTo(x + (width * 4), y + (width * 2))
            ctx.lineTo(x + (width * 2), y + (width * 2))
            ctx.lineTo(x + (width * 2), y + (width * 3))
            ctx.lineTo(x + width, y + (width * 3))
            ctx.lineTo(x + width, y + width)
            ctx.stroke()
        }
    };

    tetrinoShapeCross(x, y, width, color, position) {
        // console.log('Shape Cross')
        let gameCanvas = document.getElementById("gamecanvas")
        let ctx = gameCanvas.getContext('2d')

        if (position == 'north') {
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
        } else if (position == 'west') {
            ctx.beginPath()
            ctx.lineWidth = 3
            ctx.strokeStyle = color
            ctx.moveTo(x + width, y + width)
            ctx.lineTo(x + (width * 4), y + width)
            ctx.lineTo(x + (width * 4), y + (width * 2))
            ctx.lineTo(x + (width * 3), y + (width * 2))
            ctx.lineTo(x + (width * 3), y + (width * 3))
            ctx.lineTo(x + (width * 2), y + (width * 3))
            ctx.lineTo(x + (width * 2), y + (width * 2))
            ctx.lineTo(x + width, y + (width * 2))
            ctx.lineTo(x + width, y + width)
            ctx.stroke()
        } else if (position = 'south') {
            ctx.beginPath()
            ctx.lineWidth = 3
            ctx.strokeStyle = color
            ctx.moveTo(x + width, y + width)
            ctx.lineTo(x + (width * 2), y + width)
            ctx.lineTo(x + (width * 2), y + (width * 4))
            ctx.lineTo(x + width, y + (width * 4))
            ctx.lineTo(x + width, y + (width * 3))
            ctx.lineTo(x, y + (width * 3))
            ctx.lineTo(x, y + (width * 2))
            ctx.lineTo(x + width, y + (width * 2))
            ctx.lineTo(x + width, y + width)
            ctx.stroke()
        } else if (position = 'east') {
            ctx.beginPath()
            ctx.lineWidth = 3
            ctx.strokeStyle = color
            ctx.moveTo(x + width, y + width)
            ctx.lineTo(x + (width * 2), y + width)
            ctx.lineTo(x + (width * 2), y)
            ctx.lineTo(x + (width * 3), y)
            ctx.lineTo(x + (width * 3), y + width)
            ctx.lineTo(x + (width * 4), y + width)
            ctx.lineTo(x + (width * 4), y + (width * 2))
            ctx.lineTo(x + width, y + (width * 2))
            ctx.lineTo(x + width, y + width)
            ctx.stroke()
        }
    }
    // Draw tetrinos
    tetrinoDraw(piece, x, y, width, color, orientation) {

        if (piece == 'shapeI') {
            this.tetrinoShapeI(x, y, width, color, orientation)

        } else if (piece == 'shapeS') {
            this.tetrinoShapeS(x, y, width, color, orientation)

        } else if (piece == 'shapeSqr') {
            this.tetrinoShapeSqr(x, y, width, color, orientation)

        } else if (piece == 'shapeL') {
            this.tetrinoShapeL(x, y, width, color, orientation)

        } else if (piece == 'shapeCross') {
            this.tetrinoShapeCross(x, y, width, color, orientation)
        }
    }



    // Tetrino movement
    moveCheckPosition(moveDir) {

        if (moveDir == 'down') {

            for (let coord of this.pieceCoord) {
                if (coord[1] + 1 >= this.gameheight) {
                    return false
                }
                // also need && Object.values(this.gameCoords[this.y_pos + 1][this.x_pos])[2]) == 'occupied
            }

        } else if (moveDir == 'left') {

            for (let coord of this.pieceCoord) {
                if (coord[0] == 0) {
                    return false
                }
            }

        } else if (moveDir == 'right') {

            for (let coord of this.pieceCoord) {
                if (coord[0] + 1 >= this.gamewidth) {
                    return false
                }
            }

        } else if (moveDir == 'up') {

            for (let coord of this.pieceCoord) {
                if (coord[1] == 0) {
                    return false
                }
            }
        }
        return true
    }

    rotateCoord(piece, position) {
        // rotate piece on this.pieceCoord so collisions work properly
        if (piece == 'shapeI' && (position == 'north' || position == 'south')) {
            let currCoord = this.pieceCoord


            for (let coord = 0; coord < currCoord.length; coord++) {
                let temp = currCoord[coord][0]
                console.log(temp)
                currCoord[coord][1] == currCoord[0]
                currCoord[coord][0] == temp

            }
            // updates this.pieceCoord
            console.log(currCoord)
            this.pieceCoord = currCoord

        } else if (piece == 'shapeI' && (position == 'west' || position == 'east')) {
            let currCoord = this.pieceCoord

            for (let coord = 0; coord < currCoord.length; coord++) {
                let temp = currCoord[coord][0]
                currCoord[coord][1] == currCoord[0]
                currCoord[coord][0] == temp
            }
            // updates this.pieceCoord
            console.log(currCoord)
            this.pieceCoord = currCoord
        }
    }

    moveTetrino(usrkey, piece, pieceCoord, pieceColor, orientation) {
        /*
        How a tetrino 'moves':
 
        Game is composed of an array and a canvas. Canvas will just draw based on
        array information. But how is it done?
 
        An array is in its essence a coordinate system. 
        So when the program calls array[0][2] it means array column 0, row 2 (because
        in the way 2D arrays are done, columns goes first then rows). In this game, each
        'coordinate' in this array holds an object with information telling the program
        where in the canvas it should start drawing our tetrinos.
 
        Knowing this we can create two variables to track those 'coordinates' and to move
        a tetrino we just need to increment or decrement those values. For example, we have
        a piece standing at [5][5] and we want to move it right and to do that, it just
        needs to add 1 to the 'row' coordinate so it becomes [5][6].
 
        The program also needs to know how many tiles a tetrino occupies in the array. For that, each
        piece has a kind of 'coordinate' in this format "[0, 0], [1, 0], [2, 0], [3, 0]" and it is
        updated while the piece is moving. So if we are moving this piece down, it means the 'column'
        position on our array[x][y] is being incremented and those coordinates will become
        "[0, 1], [1, 1], [2, 1], [3, 1]" and the piece will be drawn using this coordinates.
        */

        if ((usrkey.key == 'ArrowUp' || usrkey.key == 'w') && (this.moveCheckPosition('up', pieceCoord) == true)) {
            // As it is, the program sends a flag that makes it draw a tetrino in the position we want on canvas,
            // but is still thinks its on the old position because fot this.moveCheckPosition method isn't updated
            // console.log(pieceCoord)

            if (this.orientation == 'north') {
                this.orientation = 'west'
                console.log(this.pieceCoord)
            } else if (this.orientation == 'west') {
                this.orientation = 'south'
                console.log(this.pieceCoord)
            } else if (this.orientation == 'south') {
                this.orientation = 'east'
                console.log(this.pieceCoord)
            } else if (this.orientation == 'east') {
                this.orientation = 'north'
                console.log(this.pieceCoord)
            }

            console.log(this.orientation)

            let xCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]
            let yCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]

            this.gameBoardRefresh()
            this.rotateCoord(piece, this.orientation)
            this.tetrinoDraw(piece, xCoordDraw, yCoordDraw, this.width, pieceColor, this.orientation)
            console.log(this.pieceCoord)

        } else if ((usrkey.key == 'ArrowDown' || usrkey.key == 's') && (this.moveCheckPosition('down', pieceCoord) == true)) {
            // console.log(piece)
            // console.log(pieceCoord)
            this.y_pos++

            for (let coord of this.pieceCoord) {
                coord[1]++
            }
            // console.log(this.pieceCoord)

            let xCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]
            let yCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]
            this.gameBoardRefresh()
            this.tetrinoDraw(piece, xCoordDraw, yCoordDraw, this.width, pieceColor, orientation)

        } else if ((usrkey.key == 'ArrowLeft' || usrkey.key == 'a') && (this.moveCheckPosition('left', pieceCoord) == true)) {
            // console.log(piece)
            // console.log(pieceCoord)
            this.x_pos--

            for (let coord of this.pieceCoord) {
                coord[0]--
            }
            // console.log(this.pieceCoord)

            let xCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]
            let yCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]
            this.gameBoardRefresh()
            this.tetrinoDraw(piece, xCoordDraw, yCoordDraw, this.width, pieceColor, orientation)

        } else if ((usrkey.key == 'ArrowRight' || usrkey.key == 'd') && (this.moveCheckPosition('right', pieceCoord) == true)) {
            // console.log(piece)
            // console.log(pieceCoord)
            this.x_pos++

            for (let coord of this.pieceCoord) {
                coord[0]++
            }
            // console.log(this.pieceCoord)

            let xCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[0]
            let yCoordDraw = Object.values(this.gameCoords[this.y_pos][this.x_pos])[1]
            this.gameBoardRefresh()
            this.tetrinoDraw(piece, xCoordDraw, yCoordDraw, this.width, pieceColor, orientation)

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

        // east
        // ctx.beginPath()
        // ctx.lineWidth = 3
        // ctx.strokeStyle = color
        // ctx.moveTo(x + width, y + width)
        // ctx.lineTo(x + (width * 4), y + width)
        // ctx.lineTo(x + (width * 4), y + (width * 2))
        // ctx.lineTo(x + (width * 3), y + (width * 2))
        // ctx.lineTo(x + (width * 3), y + (width * 3))
        // ctx.lineTo(x + (width * 2), y + (width * 3))
        // ctx.lineTo(x + (width * 2), y + (width * 2))
        // ctx.lineTo(x + width, y + (width * 2))
        // ctx.lineTo(x + width, y + width)
        // ctx.stroke()

        // south
        // ctx.beginPath()
        // ctx.lineWidth = 3
        // ctx.strokeStyle = color
        // ctx.moveTo(x + width, y + width)
        // ctx.lineTo(x + (width * 2), y + width)
        // ctx.lineTo(x + (width * 2), y + (width * 4))
        // ctx.lineTo(x + width, y + (width * 4))
        // ctx.lineTo(x + width, y + (width * 3))
        // ctx.lineTo(x, y + (width * 3))
        // ctx.lineTo(x, y + (width * 2))
        // ctx.lineTo(x + width, y + (width * 2))
        // ctx.lineTo(x + width, y + width)
        // ctx.stroke()

        // north
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.strokeStyle = color
        ctx.moveTo(x + width, y + width)
        ctx.lineTo(x + (width * 2), y + width)
        ctx.lineTo(x + (width * 2), y)
        ctx.lineTo(x + (width * 3), y)
        ctx.lineTo(x + (width * 3), y + width)
        ctx.lineTo(x + (width * 4), y + width)
        ctx.lineTo(x + (width * 4), y + (width * 2))
        ctx.lineTo(x + width, y + (width * 2))
        ctx.lineTo(x + width, y + width)
        ctx.stroke()




    }

    // Run game
    loadAllListeners() {
        // document.addEventListener("DOMContentLoaded", () => { this.tetrinoTestShape(40, 40, 40, 'red') }, false);
        document.addEventListener('keydown', (key) => { this.tetrinoGame(key) });
    };
};


newGame = new TetrinoGame()
newGame.gameBoardCreate(10, 20)
newGame.gameBoardFill()
newGame.loadAllListeners()
