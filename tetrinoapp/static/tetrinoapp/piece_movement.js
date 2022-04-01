import { gameBoardRefresh } from "./game_handling.js"
import { tetrinoDraw } from "./piece_creation.js"
import { rotateCheckPosition, rotateCoord } from "./piece_rotation.js"


const moveCheckPosition = (moveDir, pieceCoords, gameCoords, gameWidth, gameHeight) => {
    // Loops through each coordinate of a tetrino and check for
    // collisions (end of board, occupied positions, etc)
    if (moveDir == 'down') {
        for (let coord = 0; coord < pieceCoords.length; coord++) {
            let xCoord = pieceCoords[coord][0]
            let yCoord = pieceCoords[coord][1]

            if (xCoord + 1 >= gameHeight || gameCoords[xCoord + 1][yCoord].tileStatus == 'occupied') {
                return false
            }
        }

    } else if (moveDir == 'left') {
        for (let coord = 0; coord < pieceCoords.length; coord++) {
            let xCoord = pieceCoords[coord][0]
            let yCoord = pieceCoords[coord][1]

            if (yCoord == 0 || gameCoords[xCoord][yCoord - 1].tileStatus == 'occupied') {
                return false
            }
        }

    } else if (moveDir == 'right') {
        for (let coord = 0; coord < pieceCoords.length; coord++) {
            let xCoord = pieceCoords[coord][0]
            let yCoord = pieceCoords[coord][1]

            if (yCoord + 1 >= gameWidth || gameCoords[xCoord][yCoord + 1].tileStatus == 'occupied') {
                return false
            }
        }

    } else if (moveDir == 'up') {
        for (let coord of pieceCoords) {
            if (coord[0] == 0) {
                return false
            }
        }
    }
    return true
}


const shiftPosition = (coords, space, position, reverse) => {

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


const shiftTetrinoHandler = (pieceCoords) => {

    for (let coords of pieceCoords) {
        if (coords[1] == 0) {
            shiftPosition(pieceCoords, 1, 'left')
        } else if (coords[1] == this.gamewidth.length - 1) {
            shiftPosition(pieceCoords, 1, 'right')
        } else if (coords[0] > this.gameheight.length - 1) {
            shiftPosition(pieceCoords, 1, 'down')
        }
    }
}


const moveTetrino = (usrkey, piece, pieceCoords, pieceColor, gameCoords, tileWidth, gameWidth, gameHeight) => {
    // Moves tetrino based on pressed key
    // gameBoardRefresh() needs to be called because without cleaning
    // the canvas, tetrinos will left a trail of positions it occupies 
    // while moving)
    if ((usrkey.key == 'ArrowUp' || usrkey.key == 'w')) {

        for (let coord of pieceCoords) {
            coord[0]--
        }
        console.log('Current Position:', pieceCoords)
        gameBoardRefresh("gamecanvas", "2d", gameCoords, tileWidth)
        tetrinoDraw(tileWidth, pieceColor, pieceCoords, gameCoords)

    } else if ((usrkey.key == 'ArrowDown' || usrkey.key == 's') && (moveCheckPosition('down', pieceCoords, gameCoords, gameWidth, gameHeight) == true)) {

        for (let coord of pieceCoords) {
            coord[0]++
        }
        console.log('Current Position:', pieceCoords)
        gameBoardRefresh("gamecanvas", "2d", gameCoords, tileWidth)
        tetrinoDraw(tileWidth, pieceColor, pieceCoords, gameCoords)

    } else if ((usrkey.key == 'ArrowLeft' || usrkey.key == 'a') && (moveCheckPosition('left', pieceCoords, gameCoords, gameWidth, gameHeight) == true)) {

        for (let coord of pieceCoords) {
            coord[1]--
        }
        console.log('Current Position:', pieceCoords)
        gameBoardRefresh("gamecanvas", "2d", gameCoords, tileWidth)
        tetrinoDraw(tileWidth, pieceColor, pieceCoords, gameCoords)

    } else if ((usrkey.key == 'ArrowRight' || usrkey.key == 'd') && (moveCheckPosition('right', pieceCoords, gameCoords, gameWidth, gameHeight) == true)) {

        for (let coord of pieceCoords) {
            coord[1]++
        }
        console.log('Current Position:', pieceCoords)
        gameBoardRefresh("gamecanvas", "2d", gameCoords, tileWidth)
        tetrinoDraw(tileWidth, pieceColor, pieceCoords, gameCoords)

    } else if (usrkey.key == 'r' || usrkey.key == 'R') {

        // rotate
        console.log(piece)

        let pieceFacing = localStorage.getItem('pieceOrientation')

        if (pieceFacing == 'north' && rotateCheckPosition(piece, 'east', pieceCoords, gameCoords, gameWidth) == true) {
            localStorage.setItem('pieceOrientation', 'east')
            gameBoardRefresh("gamecanvas", "2d", gameCoords, tileWidth)
            console.log(pieceFacing)

            rotateCoord(piece, pieceFacing, pieceCoords, gameWidth, false)
            tetrinoDraw(tileWidth, pieceColor, pieceCoords, gameCoords)

        } else if (pieceFacing == 'east' && rotateCheckPosition(piece, 'south', pieceCoords, gameCoords, gameWidth) == true) {
            localStorage.setItem('pieceOrientation', 'south')
            gameBoardRefresh("gamecanvas", "2d", gameCoords, tileWidth)
            console.log(pieceFacing)

            rotateCoord(piece, pieceFacing, pieceCoords, gameWidth, false)
            tetrinoDraw(tileWidth, pieceColor, pieceCoords, gameCoords)

        } else if (pieceFacing == 'south' && rotateCheckPosition(piece, 'west', pieceCoords, gameCoords, gameWidth) == true) {
            localStorage.setItem('pieceOrientation', 'west')
            gameBoardRefresh("gamecanvas", "2d", gameCoords, tileWidth)
            console.log(pieceFacing)

            rotateCoord(piece, pieceFacing, pieceCoords, gameWidth, false)
            tetrinoDraw(tileWidth, pieceColor, pieceCoords, gameCoords)

        } else if (pieceFacing == 'west' && rotateCheckPosition(piece, 'north', pieceCoords, gameCoords, gameWidth) == true) {
            localStorage.setItem('pieceOrientation', 'north')
            gameBoardRefresh("gamecanvas", "2d", gameCoords, tileWidth)
            console.log(pieceFacing)

            rotateCoord(piece, pieceFacing, pieceCoords, gameWidth, false)
            tetrinoDraw(tileWidth, pieceColor, pieceCoords, gameCoords)

        } else {
            gameBoardRefresh("gamecanvas", "2d", gameCoords, tileWidth)
            tetrinoDraw(tileWidth, pieceColor, pieceCoords, gameCoords)
        }

    } else if ((usrkey.key == 'ArrowDown' || usrkey.key == 's') && (moveCheckPosition('down', pieceCoords, gameCoords, gameWidth, gameHeight) == false)) {

        for (let coords of pieceCoords) {
            let xCoord = coords[0]
            let yCoord = coords[1]
            let currPosition = gameCoords[xCoord][yCoord]

            currPosition.tileStatus = 'occupied'
            currPosition.tileColor = pieceColor
            console.log(currPosition.tileStatus)
        }

        // gameScoreCheck()
        pieceCoords = ''
        localStorage.setItem('currentPiece', '')
        localStorage.setItem('pieceColor', '')
        localStorage.setItem('pieceOrientation', '')
    }
};

const autoMovePiece = (pieceCoords, pieceColor, gameCoords, gameWidth, gameHeight) => {
    if (moveCheckPosition('down', pieceCoords, gameCoords, gameWidth, gameHeight) == true) {
        for (let coord of pieceCoords) {
            coord[0]++
        }
    } else if (moveCheckPosition('down', pieceCoords, gameCoords, gameWidth, gameHeight) == false) {
        for (let coords of pieceCoords) {
            let xCoord = coords[0]
            let yCoord = coords[1]
            let currPosition = gameCoords[xCoord][yCoord]
            currPosition.tileStatus = 'occupied'
            currPosition.tileColor = pieceColor
        }

        // this.gameScoreCheck()
        pieceCoords = ''
        localStorage.setItem('currentPiece', '')
        localStorage.setItem('pieceColor', '')
        localStorage.setItem('pieceOrientation', '')
    }
}

export { moveCheckPosition, shiftPosition, shiftTetrinoHandler, moveTetrino, autoMovePiece }