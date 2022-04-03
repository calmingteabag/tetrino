/* 
This module is responsible for moving pieces horizontally or vertically. 

It consists of four functions:

- moveTetrino, main function, will move based on pressed 
key (currently 'WASD' + R (rotate) and arrow keys)
- moveChekPosition, checks if movement is valid
- moveTetrinoAuto, to emulate original tetris's pieces 'falling'
- moveTetrinoProcess, auxiliary function to declutter moveTetrino
*/

import { gameBoardRefresh } from "./game_handling.js"
import { tetrinoDraw } from "./piece_creation.js"
import { rotateCheckPosition, rotateCoord } from "./piece_rotation.js"
import { rowFillCheck } from "./row_clear_check.js";

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

const moveTetrinoProcess = (pieceCoords, pieceColor, gameCoords, tileWidth, wantRotate, rotateDirection, piece, gameWidth) => {
    if (wantRotate == false) {
        let currPieceCoords = JSON.stringify(pieceCoords)
        sessionStorage.setItem('pieceCoords', currPieceCoords)
        // first thing it does is set sessionStorage to the last coordinate received. 
        // For example, if it is called by moveTetrino, it is  after a loop ran
        // through previous set of coordinates. This new set (After the loop) needs
        // to be updated on sessionStorage, or else pieces will keep moving to previous
        // positions after key presses.

        // console.log('Current Position:', pieceCoords)
        gameBoardRefresh("gamecanvas", "2d", gameCoords, tileWidth)
        tetrinoDraw(tileWidth, pieceColor, pieceCoords, gameCoords)
    } else if (wantRotate == true) {
        // set current direction to rotate
        sessionStorage.setItem('pieceOrientation', rotateDirection)

        // rotate piece
        rotateCoord(piece, rotateDirection, pieceCoords, gameWidth, false)


        // set new coords to storage
        let currPieceCoords = JSON.stringify(pieceCoords)
        sessionStorage.setItem('pieceCoords', currPieceCoords)

        // refresh and redraw after everything is updated
        gameBoardRefresh("gamecanvas", "2d", gameCoords, tileWidth)
        tetrinoDraw(tileWidth, pieceColor, pieceCoords, gameCoords)

    }
}

const moveTetrino = (usrkey, piece, pieceColor, gameCoords, tileWidth, gameWidth, gameHeight) => {
    /* 
    Moves tetrino based on pressed key
    gameBoardRefresh() needs to be called because without cleaning
    the canvas, tetrinos will left a trail of positions it occupies 
    while moving) 
    */

    let currPieceCoords = JSON.parse(sessionStorage.getItem('pieceCoords'))

    if ((usrkey.key == 'ArrowUp' || usrkey.key == 'w')) {
        for (let coord of currPieceCoords) {
            coord[0]--
        }
        moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, false)

    } else if ((usrkey.key == 'ArrowDown' || usrkey.key == 's') && (moveCheckPosition('down', currPieceCoords, gameCoords, gameWidth, gameHeight) == true)) {
        for (let coord of currPieceCoords) {
            coord[0]++
        }
        moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, false)

    } else if ((usrkey.key == 'ArrowLeft' || usrkey.key == 'a') && (moveCheckPosition('left', currPieceCoords, gameCoords, gameWidth, gameHeight) == true)) {
        for (let coord of currPieceCoords) {
            coord[1]--
        }
        moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, false)

    } else if ((usrkey.key == 'ArrowRight' || usrkey.key == 'd') && (moveCheckPosition('right', currPieceCoords, gameCoords, gameWidth, gameHeight) == true)) {
        for (let coord of currPieceCoords) {
            coord[1]++
        }
        moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, false)

    } else if (usrkey.key == 'r' || usrkey.key == 'R') {
        let pieceFacing = sessionStorage.getItem('pieceOrientation')

        if (pieceFacing == 'north' && rotateCheckPosition(piece, 'east', gameCoords, gameWidth) == true) {
            moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, true, 'east', piece, gameWidth)

        } else if (pieceFacing == 'east' && rotateCheckPosition(piece, 'south', gameCoords, gameWidth) == true) {
            moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, true, 'south', piece, gameWidth)

        } else if (pieceFacing == 'south' && rotateCheckPosition(piece, 'west', gameCoords, gameWidth) == true) {
            moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, true, 'west', piece, gameWidth)

        } else if (pieceFacing == 'west' && rotateCheckPosition(piece, 'north', gameCoords, gameWidth) == true) {
            moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, true, 'north', piece, gameWidth)
        }

    } else if ((usrkey.key == 'ArrowDown' || usrkey.key == 's') && (moveCheckPosition('down', currPieceCoords, gameCoords, gameWidth, gameHeight) == false)) {

        for (let coords of currPieceCoords) {
            let xCoord = coords[0]
            let yCoord = coords[1]
            let currPosition = gameCoords[xCoord][yCoord]

            currPosition.tileStatus = 'occupied'
            currPosition.tileColor = pieceColor
            console.log(currPosition.tileStatus)
        }

        rowFillCheck(gameCoords)
        currPieceCoords = ''
        sessionStorage.setItem('currentPiece', '')
        sessionStorage.setItem('pieceColor', '')
        sessionStorage.setItem('pieceOrientation', '')
    }
};

const moveTetrinoAuto = (pieceColor, gameCoords, gameWidth, gameHeight, tileWidth) => {
    let currPieceCoords = JSON.parse(sessionStorage.getItem('pieceCoords'))
    // currPieceCoords to get updated coordinates

    if (moveCheckPosition('down', currPieceCoords, gameCoords, gameWidth, gameHeight) == true) {
        for (let coord of currPieceCoords) {
            coord[0]++
        }
        moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, false)
        // moveTetrinoProcess will update with currentCoordinates

    } else if (moveCheckPosition('down', currPieceCoords, gameCoords, gameWidth, gameHeight) == false) {
        // next tile (downwards) is occupied, mark currPieceCoordinate atribute (color) on gameCoords and set
        // positions to 'occupied' so next pieces will see it as occupied too.
        for (let coords of currPieceCoords) {
            let xCoord = coords[0]
            let yCoord = coords[1]
            let currPosition = gameCoords[xCoord][yCoord]
            currPosition.tileStatus = 'occupied'
            currPosition.tileColor = pieceColor
        }

        rowFillCheck(gameCoords)
        currPieceCoords = ''
        sessionStorage.setItem('currentPiece', '')
        sessionStorage.setItem('pieceColor', '')
        sessionStorage.setItem('pieceOrientation', '')
    }
}

export { moveCheckPosition, moveTetrino, moveTetrinoAuto }