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
    gameBoardClear() {
        let gameCanvas = document.getElementById("gamecanvas")
        let gameContext = gameCanvas.getContext("2d")
        let gameCoordValues = Object.values(this.gameCoords)


        for (let row = 0; row < this.gameCoords.length; row++) {
            for (let column = 0; column < this.gameCoords[row].length; column++) {

                if (this.gameCoords[row][column].tileStatus == 'free') {

                    let xCoordClear = this.gameCoords[row][column].tileYinit
                    let yCoordClear = this.gameCoords[row][column].tileXinit
                    gameContext.clearRect(xCoordClear, yCoordClear, this.width, this.width)
                }
            };

        }

        // gameContext.clearRect(80, 80, 80, 80)
    }
    gameBoardRefresh() {
        this.gameBoardClear()
    };

    tetrinoSpawn() {
        // Randomly generates a tetrino
        let pieceChoice = {
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

    // ####################
    // ### Tetrino Draw ###
    // ####################
    tetrinoBaseShape(y, x, width, color) {

        let gameCanvas = document.getElementById("gamecanvas")
        let gameContext = gameCanvas.getContext("2d")

        // Line Style
        gameContext.beginPath()
        gameContext.lineWidth = 6
        gameContext.strokeStyle = color
        gameContext.rect(y, x, width, width)
        gameContext.stroke()

        // Fill Style
        // gameContext.fillStyle = color
        // gameContext.fillRect(x, y, width, width)
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

            let getXdraw = Object.values(this.gameCoords[xCoord][yCoord])[1]
            let getYdraw = Object.values(this.gameCoords[xCoord][yCoord])[0]
            let status = Object.values(this.gameCoords[xCoord][yCoord])[2]

            this.tetrinoBaseShape(getXdraw, getYdraw, width, pieceColor)
            console.log('Current Coordinates')
            console.log(xCoord, yCoord, getXdraw, getYdraw)
        }

    }

    // ########################
    // ### Tetrino Movement ###
    // ########################
    moveCheckPosition(moveDir) {
        // Loops through each coordinate of a tetrino and check for
        // collisions (end of board, occupied positions, etc)
        if (moveDir == 'down') {
            for (let coord of this.pieceCoord) {
                let coordX = coord[0]
                let coordY = coord[1]
                let fillCheck = Object.values(this.gameCoords)[coordX][coordY]

                if (coord[0] + 1 >= this.gameheight) {
                    // vertical end of board
                    return false
                }
            }

        } else if (moveDir == 'left') {
            for (let coord of this.pieceCoord) {
                if (coord[1] == 0) {
                    return false
                }
            }

        } else if (moveDir == 'right') {
            for (let coord of this.pieceCoord) {
                if (coord[1] + 1 >= this.gamewidth) {
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

    switchArrCoord(pieceCoord) {
        for (let coord = 0; coord < pieceCoord.length; coord++) {
            this.pieceCoord[coord][0] += pieceCoord[coord][0]
            this.pieceCoord[coord][1] += pieceCoord[coord][1]
        }
    }

    rotateCoord(piece, position) {
        // rotate piece on this.pieceCoord so collisions work properly

        // the position it receives from moveTetrino = TO where it needs 
        // to be rotated. So if position = 'north' it means the piece is on
        // another position and needs to be ratated 'north'

        // Square shape keeps its orientation no matter what
        // S and I shapes have only two positions
        // Cross and L have 4 positions

        let coordSwitch = {
            shapeSqr: {
                toAnyDirection: [[0, 0], [0, 0], [0, 0], [0, 0]],
            },
            shapeS: {
                toNorth: [[-1, 1], [0, 0], [1, 1], [2, 0]],
                toEast: [[1, -1], [0, 0], [-1, -1], [-2, 0]],
            },
            shapeI: {
                toNorth: [[-2, -2], [-1, -1], [0, 0], [1, 1]],
                toEast: [[2, 2], [1, 1], [0, 0], [-1, -1]],
            },
            shapeL: {
                toNorth: [[-2, 2], [-1, 1], [0, 0], [1, 1]],
                toEast: [[2, 2], [1, 1], [0, 0], [1, -1]],
                toSouth: [[2, -2], [1, -1], [0, 0], [-1, -1]],
                toWest: [[-2, -2], [-1, -1], [0, 0], [-1, 1]],
            },
            shapeCross: {
                toNorth: [[-1, 1], [-1, -1], [0, 0], [1, 1]],
                toEast: [[0, 0], [1, 1], [0, 0], [0, 0]],
                toSouth: [[1, -1], [0, 0], [0, 0], [0, 0]],
                toWest: [[0, 0], [0, 0], [0, 0], [-1, -1]],
            },
        }

        if (piece == 'shapeSqr') {
            // maybe...exclude this loop since squares don't rotate?
            let rotateCoord = coordSwitch.shapeSqr.toAnyDirection
            this.switchArrCoord(rotateCoord)

        } else if (piece == 'shapeS') {

            if (position == 'north' || position == 'south') {
                let rotateCoord = coordSwitch.shapeS.toNorth
                this.switchArrCoord(rotateCoord)
            } else {
                let rotateCoord = coordSwitch.shapeS.toEast
                this.switchArrCoord(rotateCoord)
            }
        } else if (piece == 'shapeI') {

            if (position == 'north' || position == 'south') {
                let rotateCoord = coordSwitch.shapeI.toNorth
                this.switchArrCoord(rotateCoord)
            } else {
                let rotateCoord = coordSwitch.shapeI.toEast
                this.switchArrCoord(rotateCoord)
            }
        } else if (piece == 'shapeL') {

            if (position == 'north') {
                let rotateCoord = coordSwitch.shapeL.toNorth
                this.switchArrCoord(rotateCoord)
            } else if (position == 'east') {
                let rotateCoord = coordSwitch.shapeL.toEast
                this.switchArrCoord(rotateCoord)
            } else if (position == 'south') {
                let rotateCoord = coordSwitch.shapeL.toSouth
                this.switchArrCoord(rotateCoord)
            } else if (position == 'west') {
                let rotateCoord = coordSwitch.shapeL.toWest
                this.switchArrCoord(rotateCoord)
            }
        } else if (piece == 'shapeCross') {

            if (position == 'north') {
                let rotateCoord = coordSwitch.shapeCross.toNorth
                this.switchArrCoord(rotateCoord)
            } else if (position == 'east') {
                let rotateCoord = coordSwitch.shapeCross.toEast
                this.switchArrCoord(rotateCoord)
            } else if (position == 'south') {
                let rotateCoord = coordSwitch.shapeCross.toSouth
                this.switchArrCoord(rotateCoord)
            } else if (position == 'west') {
                let rotateCoord = coordSwitch.shapeCross.toWest
                this.switchArrCoord(rotateCoord)
            }
        }
    }

    moveTetrino(usrkey, piece, pieceCoord, pieceColor) {
        // Moves tetrino based on pressed key
        // gameBoardRefresh() needs to be called because without cleaning
        // the canvas, tetrinos will left a trail of positions it occupies 
        // while moving)
        if ((usrkey.key == 'ArrowUp' || usrkey.key == 'w') && (this.moveCheckPosition('up', pieceCoord) == true)) {

            for (let coord of this.pieceCoord) {
                coord[0]--
            }
            this.gameBoardRefresh()
            this.tetrinoDraw(this.width, pieceColor)

        } else if ((usrkey.key == 'ArrowDown' || usrkey.key == 's') && (this.moveCheckPosition('down', pieceCoord) == true)) {

            for (let coord of this.pieceCoord) {
                coord[0]++
            }
            this.gameBoardRefresh()
            this.tetrinoDraw(this.width, pieceColor)

        } else if ((usrkey.key == 'ArrowLeft' || usrkey.key == 'a') && (this.moveCheckPosition('left', pieceCoord) == true)) {

            for (let coord of this.pieceCoord) {
                coord[1]--
            }
            this.gameBoardRefresh()
            this.tetrinoDraw(this.width, pieceColor)

        } else if ((usrkey.key == 'ArrowRight' || usrkey.key == 'd') && (this.moveCheckPosition('right', pieceCoord) == true)) {

            for (let coord of this.pieceCoord) {
                coord[1]++
            }
            this.gameBoardRefresh()
            this.tetrinoDraw(this.width, pieceColor)

        } else if (usrkey.key == 'r') {
            // rotate
            if (this.orientation == 'north') {
                this.orientation = 'east'

                this.gameBoardRefresh()
                console.log(this.orientation)
                this.rotateCoord(piece, this.orientation)
                this.tetrinoDraw(this.width, pieceColor)
            } else if (this.orientation == 'east') {
                this.orientation = 'south'

                this.gameBoardRefresh()
                console.log(this.orientation)
                this.rotateCoord(piece, this.orientation)
                this.tetrinoDraw(this.width, pieceColor)
            } else if (this.orientation == 'south') {
                this.orientation = 'west'

                this.gameBoardRefresh()
                console.log(this.orientation)
                this.rotateCoord(piece, this.orientation)
                this.tetrinoDraw(this.width, pieceColor)
            } else if (this.orientation == 'west') {
                this.orientation = 'north'

                this.gameBoardRefresh()
                console.log(this.orientation)
                this.rotateCoord(piece, this.orientation)
                this.tetrinoDraw(this.width, pieceColor)
            }
        } else if ((usrkey.key == 'ArrowDown' || usrkey.key == 's') && (this.moveCheckPosition('down', pieceCoord) == false)) {
            // Acho que esquema é, se arrowdown e movecheck é falso (ou seja,
            // fim da board) => loop as coordenadas, olha na board e marca essas
            // posições como ocupadas. Depois reseta this.currPiece, this.pieceCoord e this.orientation (pra spawn nova peça)

            for (let coords of this.pieceCoord) {
                let xCoord = coords[0]
                let yCoord = coords[1]
                let currPosition = this.gameCoords[xCoord][yCoord]

                currPosition.tileStatus = 'occupied'
                console.log(currPosition.tileStatus)
            }
            console.log('end board')

            this.currPiece = ''
            this.pieceCoord = ''
            this.orientation = ''
        }
    };

    // ###################
    // ### Game Run ######
    // ###################
    loadAllListeners() {
        // document.addEventListener("DOMContentLoaded", () => { this.tetrinoTestShape(40, 40, 40, 'red') }, false);
        document.addEventListener('keydown', (key) => { this.tetrinoGame(key) });
    };
};


newGame = new TetrinoGame()
newGame.gameBoardCreate(10, 20)
newGame.gameBoardFill()
newGame.loadAllListeners()
