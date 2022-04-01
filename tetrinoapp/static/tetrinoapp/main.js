import { someFunction } from "./testfile.js";

console.log(someFunction('sss'))

class TetrinoGame {
    constructor() {
        // Board could be customized here, insted of fixed values, it
        // would use values from constructor, for example:
        // newGame = TetrinoGame(10,20, 40) which would represent a board 10 tiles wide, 20 tiles
        // long, with a base piece width of 40pixels. 

        this.width = 40;
        this.gameCoords = []; // board
        this.gameheight = 20; // board height
        this.gamewidth = 10; // board width
        this.currPiece = ''
        this.pieceCoord = ''
        this.orientation = ''
        this.pieceColor = ''
    };

    // ###################
    // ### Board Setup ###
    // ###################

    gameBoardCreate(rowsize, colsize) {

        for (let column = 0; column < colsize; column++) {
            this.gameCoords.push([])
            this.gameCoords[column].push(new Array(this.gamewidth))

            for (let row = 0; row < rowsize; row++) {
                this.gameCoords[column][row] = {
                    'tileXinit': 0,
                    'tileYinit': 0,
                    'tileStatus': 'free',
                    'tileColor': '',
                };
            };
        };
    };

    gameBoardFill() {
        /*
        Fills Board with objects containing coordinates for drawing and an occupied/free flag for each
        coordinate.

        Why yTileValue = -40:

        Rows are updated on inner loop and their indexes are reset when game changes columns. Since the very 
        first run already sets yTileValue to +40, making our first set of coordinates wrong (all y coords will 
        start at 40 insted of 0) I offset initial value to compensate.
        */

        let columnTileValue = 0
        let rowTileValue = -this.width

        let gameCoordValues = Object.values(this.gameCoords)

        for (let row = 0; row < gameCoordValues.length; row++) {
            // when piece moves up or down, it means it changes which ROWs
            // it occupies. And in this games, rows goes from 0 to 19
            columnTileValue = 0
            // rows should take into account line width
            // starting from 0 width, it should increment 2x line width + its own width
            rowTileValue += this.width

            for (let column = 0; column < gameCoordValues[row].length; column++) {
                // when a piece moves left or right, it changes which COLUMN It
                // occupies.
                let value = gameCoordValues[row][column]
                value['tileXinit'] = rowTileValue
                value['tileYinit'] = columnTileValue
                columnTileValue += this.width
            }
        }
    }

    // ###################
    // ### Game Flow #####
    // ###################
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

    gameBoardRefresh() {

        const gameCanvas = document.getElementById("gamecanvas")
        const gameContext = gameCanvas.getContext("2d")

        for (let row = 0; row < this.gameCoords.length; row++) {
            for (let column = 0; column < this.gameCoords[row].length; column++) {
                // else if to check if all elements are marked as occupied
                // if so, find a way to shift everything down by 1 row

                if (this.gameCoords[row][column].tileStatus == 'free') {

                    let xCoordClear = this.gameCoords[row][column].tileYinit
                    let yCoordClear = this.gameCoords[row][column].tileXinit
                    gameContext.clearRect(xCoordClear, yCoordClear, this.width, this.width)
                }
            }
        }
    };

    tetrinoSpawn() {
        // Randomly generates a tetrino
        const pieceChoice = {
            'shapeSqr': [[[3, 3], [4, 3], [3, 4], [4, 4]], 'yellow'],
            'shapeS': [[[3, 3], [4, 3], [4, 4], [5, 4]], 'green'],
            'shapeI': [[[3, 3], [4, 3], [5, 3], [6, 3]], 'red'],
            'shapeL': [[[3, 3], [4, 3], [5, 3], [5, 4]], 'orange'],
            'shapeCross': [[[3, 4], [4, 3], [4, 4], [4, 5]], 'purple'],
        }

        let percent = Math.random();
        let num = Math.floor(percent * (Math.floor(4) - Math.ceil(0) + 1))

        let pieceCoord = {
            // change [1] for [num] to enable random generation
            piece: Object.keys(pieceChoice)[num],
            coords: Object.values(pieceChoice)[num][0],
            color: Object.values(pieceChoice)[num][1]
        }

        return pieceCoord
    }


    tetrinoGame(key) {

        if (this.currPiece == '') {
            let pieceData = this.tetrinoSpawn()

            this.currPiece = pieceData.piece
            this.pieceCoord = pieceData.coords
            this.pieceColor = pieceData.color
            this.orientation = 'north'
        }

        this.moveTetrino(key, this.currPiece, this.pieceCoord, this.pieceColor, this.orientation)
    }

    tetrinoGameAuto() {
        if (this.currPiece == '') {
            let pieceData = this.tetrinoSpawn()

            this.currPiece = pieceData.piece
            this.pieceCoord = pieceData.coords
            this.pieceColor = pieceData.color
            this.orientation = 'north'
        }
    }

    // ####################
    // ### Tetrino Draw ###
    // ####################
    tetrinoBaseShape(y, x, width, color) {

        const gameCanvas = document.getElementById("gamecanvas")
        const gameContext = gameCanvas.getContext("2d")

        gameContext.fillStyle = color
        gameContext.fillRect(y, x, width, width)
        gameContext.lineWidth = 5
        gameContext.strokeStyle = 'grey'
        gameContext.strokeRect(y, x, width, width)
    };

    tetrinoDraw(width, pieceColor) {
        // After generating a tetrino, it needs to be drawn on canvas.
        // It draws each 'square' of the tetrino separately by looping though 
        // its coordinates. Each coordinate is reference to a object's position
        // in an 2D array (which is our board this.gameCoords).

        // Each of those objects have references to positions on Canvas (called
        // tyleXinit, tyleYinit) and these tells where the program should
        // start drawing a square.
        for (let coord = 0; coord < this.pieceCoord.length; coord++) {

            let xCoord = this.pieceCoord[coord][0]
            let yCoord = this.pieceCoord[coord][1]

            let currObj = this.gameCoords[xCoord][yCoord]
            let xDraw = currObj.tileYinit
            let yDraw = currObj.tileXinit

            this.tetrinoBaseShape(xDraw, yDraw, width, pieceColor)
            // console.log('Current Coordinates')
            // console.log(xCoord, yCoord, xDraw, yDraw)
        }
    }


    // ########################
    // ### Tetrino Movement ###
    // ########################
    moveCheckPosition(moveDir) {
        // Loops through each coordinate of a tetrino and check for
        // collisions (end of board, occupied positions, etc)
        if (moveDir == 'down') {

            for (let coord = 0; coord < this.pieceCoord.length; coord++) {
                let xCoord = this.pieceCoord[coord][0]
                let yCoord = this.pieceCoord[coord][1]

                if (xCoord + 1 >= this.gameheight || this.gameCoords[xCoord + 1][yCoord].tileStatus == 'occupied') {
                    return false
                }
            }

        } else if (moveDir == 'left') {

            for (let coord = 0; coord < this.pieceCoord.length; coord++) {
                let xCoord = this.pieceCoord[coord][0]
                let yCoord = this.pieceCoord[coord][1]

                if (yCoord == 0 || this.gameCoords[xCoord][yCoord - 1].tileStatus == 'occupied') {
                    return false
                }
            }

        } else if (moveDir == 'right') {

            for (let coord = 0; coord < this.pieceCoord.length; coord++) {
                let xCoord = this.pieceCoord[coord][0]
                let yCoord = this.pieceCoord[coord][1]

                if (yCoord + 1 >= this.gamewidth || this.gameCoords[xCoord][yCoord + 1].tileStatus == 'occupied') {
                    return false
                }
            }

        } else if (moveDir == 'up') {
            for (let coord of this.pieceCoord) {
                if (coord[0] == 0) {
                    return false
                }
            }
        }
        return true
    }

    rotateCoord(piece, direction, reverse) {
        // rotate pieces based on transformation coordinates
        // excludes the 'square' tetrino for obvious reasons

        const rotateCoords = {
            "shapeS": {
                'north': [[-1, 1], [0, 0], [1, 1], [2, 0]],
                'east': [[1, -1], [0, 0], [-1, -1], [-2, 0]],
                'south': [[-1, 1], [0, 0], [1, 1], [2, 0]],
                'west': [[1, -1], [0, 0], [-1, -1], [-2, 0]],
            },
            "shapeI": {
                'north': [[-2, -2], [-1, -1], [0, 0], [1, 1]],
                'east': [[2, 2], [1, 1], [0, 0], [-1, -1]],
                'south': [[-2, -2], [-1, -1], [0, 0], [1, 1]],
                'west': [[2, 2], [1, 1], [0, 0], [-1, -1]],
            },
            "shapeL": {
                'north': [[-2, 2], [-1, 1], [0, 0], [1, 1]],
                'east': [[2, 2], [1, 1], [0, 0], [1, -1]],
                'south': [[2, -2], [1, -1], [0, 0], [-1, -1]],
                'west': [[-2, -2], [-1, -1], [0, 0], [-1, 1]],
            },
            "shapeCross": {
                'north': [[-1, 1], [-1, -1], [0, 0], [1, 1]],
                'east': [[0, 0], [1, 1], [0, 0], [0, 0]],
                'south': [[1, -1], [0, 0], [0, 0], [0, 0]],
                'west': [[0, 0], [0, 0], [0, 0], [-1, -1]],
            },
        }

        if (piece != 'shapeSqr' && reverse == false) {
            let rotateDirection = rotateCoords[`${piece}`][`${direction}`]
            console.log(rotateDirection)

            for (let coord = 0; coord < rotateDirection.length; coord++) {
                this.pieceCoord[coord][0] += rotateDirection[coord][0]
                this.pieceCoord[coord][1] += rotateDirection[coord][1]
            }

            for (let coord of this.pieceCoord) {
                if (coord[1] < 0) {
                    this.shiftPosition(this.pieceCoord, 1, 'left')
                } else if (coord[1] > this.gamewidth.length - 1) {
                    this.shiftPostion(this.pieceCoord, 3, 'right')
                }
            }

        } else if (piece != 'shapeSqr' && reverse == true) {
            let rotateCoordReverse = rotateCoords[`${piece}`][`${direction}`]

            for (let coord = 0; coord < rotateCoordReverse.length; coord++) {
                this.pieceCoord[coord][0] -= rotateCoordReverse[coord][0]
                this.pieceCoord[coord][1] -= rotateCoordReverse[coord][1]
            }
        }
    }

    rotateCheckPosition(piece, direction) {
        if (piece != 'shapeSqr') {
            this.rotateCoord(piece, direction, false)

            for (let coords of this.pieceCoord) {
                let xCoord = coords[0]
                let yCoord = coords[1]

                if (this.gameCoords[xCoord][yCoord].tileStatus == 'occupied') {
                    this.rotateCoord(piece, direction, true)
                    return false
                }
            }
            this.rotateCoord(piece, direction, true)
            return true
        }
    }

    shiftPosition(coords, space, position, reverse) {

        if (position == 'left' && reverse == false) {
            for (let values of coords) {
                values[1] += space
            }
        } else if (position == 'right' && reverse == false) {
            for (let values of coords) {
                values[1] -= space
            }
        } else if (position == 'down' && reverse == false) {
            for (let values of coords) {
                values[0] -= space
            }
        } else if (position == 'left' && reverse == true) {
            for (let coord of currCoords) {
                coord[1] -= space
            }
        } else if (position == 'right' && reverse == true) {
            for (let coord of currCoords) {
                coord[1] += space
            }
        } else if (position == 'down' && reverse == true) {
            for (let coord of currCoords) {
                coord[0] += space
            }
        }
    }

    shiftTetrinoHandler(pieceCoords) {

        for (let coords of pieceCoords) {
            if (coords[1] == 0) {
                this.shiftPosition(this.pieceCoord, 1, 'left')
            } else if (coords[1] == this.gamewidth.length - 1) {
                this.shiftPosition(this.pieceCoord, 1, 'right')
            } else if (coords[0] > this.gameheight.length - 1) {
                this.shiftPosition(this.pieceCoord, 1, 'down')
            }
        }
    }

    moveTetrino(usrkey, piece, pieceCoord, pieceColor) {
        // Moves tetrino based on pressed key
        // gameBoardRefresh() needs to be called because without cleaning
        // the canvas, tetrinos will left a trail of positions it occupies 
        // while moving)
        if ((usrkey.key == 'ArrowUp' || usrkey.key == 'w')) {

            for (let coord of this.pieceCoord) {
                coord[0]--
            }
            console.log('Current Position:', this.pieceCoord)
            this.gameBoardRefresh()
            this.tetrinoDraw(this.width, pieceColor)

        } else if ((usrkey.key == 'ArrowDown' || usrkey.key == 's') && (this.moveCheckPosition('down', pieceCoord) == true)) {

            for (let coord of this.pieceCoord) {
                coord[0]++
            }
            console.log('Current Position:', this.pieceCoord)
            this.gameBoardRefresh()
            this.tetrinoDraw(this.width, pieceColor)

        } else if ((usrkey.key == 'ArrowLeft' || usrkey.key == 'a') && (this.moveCheckPosition('left', pieceCoord) == true)) {

            for (let coord of this.pieceCoord) {
                coord[1]--
            }
            console.log('Current Position:', this.pieceCoord)
            this.gameBoardRefresh()
            this.tetrinoDraw(this.width, pieceColor)

        } else if ((usrkey.key == 'ArrowRight' || usrkey.key == 'd') && (this.moveCheckPosition('right', pieceCoord) == true)) {

            for (let coord of this.pieceCoord) {
                coord[1]++
            }
            console.log('Current Position:', this.pieceCoord)
            this.gameBoardRefresh()
            this.tetrinoDraw(this.width, pieceColor)

        } else if (usrkey.key == 'r' || usrkey.key == 'R') {

            // rotate
            if (this.orientation == 'north' && this.rotateCheckPosition(piece, 'east') == true) {
                this.orientation = 'east'
                this.gameBoardRefresh()
                console.log(this.orientation)

                this.rotateCoord(piece, this.orientation, false)
                this.tetrinoDraw(this.width, pieceColor)

            } else if (this.orientation == 'east' && this.rotateCheckPosition(piece, 'south') == true) {
                this.orientation = 'south'
                this.gameBoardRefresh()
                console.log(this.orientation)

                this.rotateCoord(piece, this.orientation, false)
                this.tetrinoDraw(this.width, pieceColor)

            } else if (this.orientation == 'south' && this.rotateCheckPosition(piece, 'west') == true) {
                this.orientation = 'west'
                this.gameBoardRefresh()
                console.log(this.orientation)

                this.rotateCoord(piece, this.orientation, false)
                this.tetrinoDraw(this.width, pieceColor)

            } else if (this.orientation == 'west' && this.rotateCheckPosition(piece, 'north') == true) {
                this.orientation = 'north'
                this.gameBoardRefresh()
                console.log(this.orientation)

                this.rotateCoord(piece, this.orientation, false)
                this.tetrinoDraw(this.width, pieceColor)

            } else {
                this.gameBoardRefresh()
                this.tetrinoDraw(this.width, pieceColor)
            }

        } else if ((usrkey.key == 'ArrowDown' || usrkey.key == 's') && (this.moveCheckPosition('down', pieceCoord) == false)) {

            for (let coords of this.pieceCoord) {
                let xCoord = coords[0]
                let yCoord = coords[1]
                let currPosition = this.gameCoords[xCoord][yCoord]

                currPosition.tileStatus = 'occupied'
                currPosition.tileColor = this.pieceColor
                console.log(currPosition.tileStatus)
            }

            this.gameScoreCheck()
            this.currPiece = ''
            this.pieceCoord = ''
            this.orientation = ''
            this.pieceColor = ''
        }
    };

    clearRow(gameBoard, row) {

        for (let item of gameBoard[row]) {
            item.tileStatus = 'free'
            item.tileColor = ''
        }
    }

    moveDownBoardPieces(arrayOfRows) {
        // moves everything down after line cleaning

        // Did a bit of change. Now it receives an array of numbers representing
        // which rows are full and needed to be processed.
        let board = this.gameCoords
        console.log(`Last 'row' moveDownBoardPieces received: ${lastFullRow}`)

        for (let filledRow of arrayOfRows) {
            // iterate over received array to
            // 1 - clear current line
            // 2 - move everything above that line down
            this.clearRow(this.gameCoords, filledRow)
            for (let row = filledRow - 1; row > 0; moveRows++) {

            }

        }

        // for (let row = lastFullRow - 1; row > 0; row--) {
        //     console.log(`Current row to process: ${row}`)
        //     for (let element = 0; element < board[row].length; element++) {
        //         let copyElement = JSON.parse(JSON.stringify(board[row][element]))
        //         let copyStatus = copyElement.tileStatus
        //         let copyColor = copyElement.tileColor

        //         board[row + 1][element].tileStatus = copyStatus
        //         board[row + 1][element].tileColor = copyColor
        //         board[row][element].tileStatus = 'free'
        //         board[row][element].tileColor = ''

        //         console.log(copyElement.tileStatus)
        //         console.log(board[row][element].tileStatus)
        //     }
        // }
    }

    gameScoreCheck() {
        // checks array for score
        // will iterate over every row and count how many tiles
        // are marked with 'occupied'. When full, calls clearRow (for now)
        let cleanedRowCount = 0
        let cleanRows = []

        for (let row = 0; row < this.gameCoords.length; row++) {
            // console.log(this.gameCoords[row])
            let rowFillCount = 0

            for (let element = 0; element < this.gameCoords[row].length; element++) {
                if (this.gameCoords[row][element].tileStatus == 'occupied') {
                    rowFillCount++
                }
            }

            if (rowFillCount == 10) {
                cleanedRowCount++
                console.log(`gameScoreCheck: Current row ${row} is full`)
                cleanRows.push(row)
                this.moveDownBoardPieces(cleanRows)
            }
        }
        console.log(cleanedRowCount)
        console.log(cleanRows)

    }

    movePiece() {
        if (this.moveCheckPosition('down', this.pieceCoord) == true) {
            for (let coord of this.pieceCoord) {
                coord[0]++
            }
        } else if (this.moveCheckPosition('down', this.pieceCoord) == false) {
            for (let coords of this.pieceCoord) {
                let xCoord = coords[0]
                let yCoord = coords[1]
                let currPosition = this.gameCoords[xCoord][yCoord]
                currPosition.tileStatus = 'occupied'
                currPosition.tileColor = this.pieceColor
            }

            this.gameScoreCheck()
            this.currPiece = ''
            this.pieceCoord = ''
            this.orientation = ''
            this.pieceColor = ''
        }
    }

    async autoMoveHandler() {
        // Automatically moves pieces downwards. If it hits
        // something (end of board or another piece), it will
        // 'mark' current piece on the board and check for
        // score (aka, filled rows)

        this.tetrinoGameAuto()
        this.tetrinoDraw(this.width, this.pieceColor)

        await new Promise((resolve) => setTimeout(resolve, 500))
        this.movePiece()
        this.gameBoardRefresh()
        this.autoMoveHandler()
    }

    // ###################
    // ### Game Run ######
    // ###################
    loadAllListeners() {
        // document.addEventListener("DOMContentLoaded", () => { this.tetrinoTestShape(40, 40, 40, 'red') }, false);
        document.addEventListener('keydown', (key) => { this.tetrinoGame(key) });
        document.addEventListener('DOMContentLoaded', () => { this.autoMoveHandler() })
    };

    // promiseFunction(value) {
    //     return new Promise((resolve, reject) => {
    //         if (value == 'logger') {
    //             resolve(console.log('returning an console.log'))
    //         } else if (value == "2") {
    //             resolve('returning string')
    //         } else {
    //             reject('value is not 1 or 2')
    //         }

    //     })
    // }

    // async promiseFunctionConsume(value) {
    //     try {
    //         const result = await this.promiseFunction(value)
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }
};


let newGame = new TetrinoGame()
newGame.gameBoardCreate(10, 20)
newGame.gameBoardFill()
newGame.loadAllListeners()


// newGame.testF(10, 201)
// newGame.testPromises(11, 20).then(response => {
//     console.log('Response received')
//     return newGame.processReq(response)
// }).then(processedstuff => {
//     console.log(processedstuff)
// }).catch(err => {
//     console.log(err)
// })


