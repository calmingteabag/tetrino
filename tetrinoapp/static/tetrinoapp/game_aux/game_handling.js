/* 
This module brings some auxiliary functions to the game.
*/

import { tetrinoSpawn } from "../pieces/piece_creation.js";
import { moveTetrino, moveTetrinoAuto } from "../movement/piece_movement.js";
// import { test } from "./test.js"
import { test } from "../test.js"

const gameBoardRefresh = (canvasName, getContextName, gameCoords, tileWidth) => {
    /* 
    When a piece moves, it does so by calling a drawing funtion on the
    new set of coordinates so, without this function, every piece would
    left a trail of movement.
    */

    const gameCanvas = document.getElementById(canvasName)
    const gameContext = gameCanvas.getContext(getContextName)

    for (let row = 0; row < gameCoords.length; row++) {
        for (let column = 0; column < gameCoords[row].length; column++) {

            if (gameCoords[row][column].tileStatus == 'free') {

                let xCoordClear = gameCoords[row][column].tileYinit
                let yCoordClear = gameCoords[row][column].tileXinit
                gameContext.clearRect(xCoordClear, yCoordClear, tileWidth, tileWidth)
            }
        }
    }
};

const gameLocalVarCreate = () => {
    const sessionStorageValues = new Map([
        ['gameState', 'running'],
        ['currentPiece', ''],
        ['pieceColor', ''],
        ['pieceCoords', ''],
        ['allowMove', 'true'],
        ['gameLevel', 1],
    ])

    for (let values of sessionStorageValues) {
        sessionStorage.setItem(values[0], values[1])
    }
}

const gameReset = (gameCoords, canvasName, canvasContext) => {
    for (let row = 0; row < gameCoords.length; row++) {
        for (let column = 0; column < gameCoords[row].length; column++) {

            gameCoords[row][column].tileStatus = 'free'
            gameCoords[row][column].tileColor = ''
        }
    }

    const gameCanvas = document.getElementById(canvasName)
    const gameContext = gameCanvas.getContext(canvasContext)

    let currWidth = document.getElementById(canvasName).width
    let currHeight = document.getElementById(canvasName).height
    gameContext.clearRect(0, 0, currWidth, currHeight)
    sessionStorage.setItem('gameState', 'running')
}

const gameOverCheck = (pieceCoords, gameCoords) => {
    for (let coords of pieceCoords) {
        let xCoord = coords[0]
        let yCoord = coords[1]
        let currPosition = gameCoords[xCoord][yCoord]

        if (currPosition.tileStatus == 'occupied') {
            return false
        }
        return true
    }
}

const gameParamProcess = (usrkey, isManual, gameCoords, tileWidth, gameWidth, gameHeight, canvasName, canvasContext, lineWidth, strokeStyle, scoreDOMId, lineDOMId, levelDOMId, piecesRGBColors) => {
    /*
    Needed to set a flag (allowMoveStatus) to stop game from
    calling gameProcess while scores/line cleaning is being
    processed when user holds keydown.

    This happens because the event listener for key press is
    separated from the rest of the game.
    */
    let allowMoveStatus = sessionStorage.getItem('allowMove')
    let pieceData = tetrinoSpawn(piecesRGBColors)
    let stringPiece = JSON.stringify(pieceData.coords)
    let runStatus = gameOverCheck(pieceData.coords, gameCoords)

    if ((isManual && !runStatus) || (!isManual && !runStatus)) {
        sessionStorage.setItem('gameState', 'notRunning')
        document.getElementById('gameover').style.visibility = 'visible'
        return

    } else if ((isManual && sessionStorage.getItem('currentPiece') == '') &&
        allowMoveStatus == 'true') {

        sessionStorage.setItem('pieceCoords', stringPiece)
        sessionStorage.setItem('currentPiece', pieceData.piece)
        sessionStorage.setItem('pieceColor', pieceData.color)
        sessionStorage.setItem('pieceOrientation', 'north')

    } else if ((isManual && sessionStorage.getItem('currentPiece') != '') &&
        allowMoveStatus == 'true') {

        moveTetrino(
            usrkey,
            sessionStorage.getItem('currentPiece'),
            sessionStorage.getItem('pieceColor'),
            gameCoords,
            tileWidth,
            gameWidth,
            gameHeight,
            canvasName,
            canvasContext,
            lineWidth,
            strokeStyle,
            scoreDOMId,
            lineDOMId,
            levelDOMId,
            piecesRGBColors,
        )
    } else if ((!isManual && sessionStorage.getItem('currentPiece') == '') && (allowMoveStatus == 'true')) {

        sessionStorage.setItem('pieceCoords', stringPiece)
        sessionStorage.setItem('currentPiece', pieceData.piece)
        sessionStorage.setItem('pieceColor', pieceData.color)
        sessionStorage.setItem('pieceOrientation', 'north')

    } else if ((!isManual && sessionStorage.getItem('currentPiece') != '') && (allowMoveStatus == 'true')) {

        moveTetrinoAuto(
            sessionStorage.getItem('pieceColor'),
            gameCoords,
            gameWidth,
            gameHeight,
            tileWidth,
            canvasName,
            canvasContext,
            sessionStorage.getItem('currentPiece'),
            lineWidth,
            strokeStyle,
            scoreDOMId,
            lineDOMId,
            levelDOMId,
            piecesRGBColors,
        )
    }
}

export { gameBoardRefresh, gameLocalVarCreate, gameParamProcess, gameOverCheck, gameReset }