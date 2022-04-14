/* 
This module is responsible for moving pieces horizontally or vertically and
its checks for valid positions.

Everytime a piece wants to move down and encounters an invalid position an
checking is done to see if any row was filled, so the game can score it
*/

import { gameBoardRefresh } from "./game_handling.js"
import { tetrinoDraw } from "./piece_creation.js"
import { rotateCheckPosition, rotateCoord } from "./piece_rotation.js"
import { rowFillCheck } from "./row_clear_check.js";

const moveCheckPosition = (moveDir, pieceCoords, gameCoords, gameWidth, gameHeight) => {

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

const moveTetrinoProcess = (pieceCoords, pieceColor, gameCoords, tileWidth, wantRotate, rotateDirection, piece, gameWidth, canvasName, canvasContext, lineWidth, strokeStyle) => {
    if (wantRotate == false) {
        let currPieceCoords = JSON.stringify(pieceCoords)
        sessionStorage.setItem('pieceCoords', currPieceCoords)
        // first thing it does is set sessionStorage to the last coordinate received. 
        // For example, if it is called by moveTetrino, it is after a loop ran
        // through previous set of coordinates. This new set (After the loop) needs
        // to be updated on sessionStorage, or else pieces will keep moving to previous
        // positions after key presses.

        gameBoardRefresh("gamecanvas", "2d", gameCoords, tileWidth)
        tetrinoDraw(tileWidth, pieceColor, pieceCoords, gameCoords, canvasName, canvasContext, lineWidth, strokeStyle)
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
        tetrinoDraw(tileWidth, pieceColor, pieceCoords, gameCoords, canvasName, canvasContext, lineWidth, strokeStyle)

    }
}

const moveTetrino = (usrkey, piece, pieceColor, gameCoords, tileWidth, gameWidth, gameHeight, canvasName, canvasContext, lineWidth, strokeStyle, scoreDOMId, lineDOMId, levelDOMId) => {

    let currPieceCoords = JSON.parse(sessionStorage.getItem('pieceCoords'))

    if ((usrkey.key == 'ArrowUp' || usrkey.key == 'w')) {
        for (let coord of currPieceCoords) {
            coord[0]--
        }
        moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, false, 'none', piece, gameWidth, canvasName, canvasContext, lineWidth, strokeStyle)

    } else if ((usrkey.key == 'ArrowDown' || usrkey.key == 's') && (moveCheckPosition('down', currPieceCoords, gameCoords, gameWidth, gameHeight) == true)) {
        for (let coord of currPieceCoords) {
            coord[0]++
        }
        moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, false, 'none', piece, gameWidth, canvasName, canvasContext, lineWidth, strokeStyle)

    } else if ((usrkey.key == 'ArrowLeft' || usrkey.key == 'a') && (moveCheckPosition('left', currPieceCoords, gameCoords, gameWidth, gameHeight) == true)) {
        for (let coord of currPieceCoords) {
            coord[1]--
        }
        moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, false, 'none', piece, gameWidth, canvasName, canvasContext, lineWidth, strokeStyle)

    } else if ((usrkey.key == 'ArrowRight' || usrkey.key == 'd') && (moveCheckPosition('right', currPieceCoords, gameCoords, gameWidth, gameHeight) == true)) {
        for (let coord of currPieceCoords) {
            coord[1]++
        }
        moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, false, 'none', piece, gameWidth, canvasName, canvasContext, lineWidth, strokeStyle)

    } else if (usrkey.key == 'r' || usrkey.key == 'R') {
        let pieceFacing = sessionStorage.getItem('pieceOrientation')

        if (pieceFacing == 'north' && rotateCheckPosition(piece, 'east', gameCoords, gameWidth) == true) {
            moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, true, 'east', piece, gameWidth, canvasName, canvasContext, lineWidth, strokeStyle)

        } else if (pieceFacing == 'east' && rotateCheckPosition(piece, 'south', gameCoords, gameWidth) == true) {
            moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, true, 'south', piece, gameWidth, canvasName, canvasContext, lineWidth, strokeStyle)

        } else if (pieceFacing == 'south' && rotateCheckPosition(piece, 'west', gameCoords, gameWidth) == true) {
            moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, true, 'west', piece, gameWidth, canvasName, canvasContext, lineWidth, strokeStyle)

        } else if (pieceFacing == 'west' && rotateCheckPosition(piece, 'north', gameCoords, gameWidth) == true) {
            moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, true, 'north', piece, gameWidth, canvasName, canvasContext, lineWidth, strokeStyle)
        }

    } else if ((usrkey.key == 'ArrowDown' || usrkey.key == 's') && (moveCheckPosition('down', currPieceCoords, gameCoords, gameWidth, gameHeight) == false)) {

        sessionStorage.setItem('allowMove', 'false')
        for (let coords of currPieceCoords) {
            let xCoord = coords[0]
            let yCoord = coords[1]
            let currPosition = gameCoords[xCoord][yCoord]

            currPosition.tileStatus = 'occupied'
            currPosition.tileColor = pieceColor
        }

        rowFillCheck(gameCoords, canvasName, canvasContext, tileWidth, gameWidth, scoreDOMId, lineDOMId, levelDOMId)
        currPieceCoords = ''
        sessionStorage.setItem('currentPiece', '')
        sessionStorage.setItem('pieceColor', '')
        sessionStorage.setItem('pieceOrientation', '')
        sessionStorage.setItem('allowMove', 'true')
    }
};

const moveTetrinoAuto = (pieceColor, gameCoords, gameWidth, gameHeight, tileWidth, canvasName, canvasContext, piece, lineWidth, strokeStyle, scoreDOMId, lineDOMId, levelDOMId) => {
    let currPieceCoords = JSON.parse(sessionStorage.getItem('pieceCoords'))

    if (moveCheckPosition('down', currPieceCoords, gameCoords, gameWidth, gameHeight) == true) {
        for (let coord of currPieceCoords) {
            coord[0]++
        }
        moveTetrinoProcess(currPieceCoords, pieceColor, gameCoords, tileWidth, false, 'none', piece, gameWidth, canvasName, canvasContext, lineWidth, strokeStyle)

    } else if (moveCheckPosition('down', currPieceCoords, gameCoords, gameWidth, gameHeight) == false) {

        sessionStorage.setItem('allowMove', 'false')
        for (let coords of currPieceCoords) {
            let xCoord = coords[0]
            let yCoord = coords[1]
            let currPosition = gameCoords[xCoord][yCoord]
            currPosition.tileStatus = 'occupied'
            currPosition.tileColor = pieceColor
        }

        rowFillCheck(gameCoords, canvasName, canvasContext, tileWidth, gameWidth, scoreDOMId, lineDOMId, levelDOMId)
        currPieceCoords = ''
        sessionStorage.setItem('currentPiece', '')
        sessionStorage.setItem('pieceColor', '')
        sessionStorage.setItem('pieceOrientation', '')
        sessionStorage.setItem('allowMove', 'true')
    }
}

export { moveCheckPosition, moveTetrino, moveTetrinoAuto }