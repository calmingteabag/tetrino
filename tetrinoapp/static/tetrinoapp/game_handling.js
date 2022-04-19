/* 
This module brings some auxiliary functions to the game.
*/

import { tetrinoSpawn, tetrinoDraw } from "./piece_creation.js";
import { moveTetrino, moveTetrinoAuto } from "./piece_movement.js";

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

const gameParamProcess = (usrkey, isManual, gameCoords, tileWidth, gameWidth, gameHeight, canvasName, canvasContext, lineWidth, strokeStyle, scoreDOMId, lineDOMId, levelDOMId, piecesRGBColors) => {
    /*
    Needed to set a flag (allowMoveStatus) to stop game from
    calling gameProcess while scores/line cleaning is being
    processed when user holds keydown.

    This happens because the event listener for key press is
    separated from the rest of the game.
    */
    let allowMoveStatus = sessionStorage.getItem('allowMove')

    if ((isManual && sessionStorage.getItem('currentPiece') == '') &&
        allowMoveStatus == 'true') {

        let pieceData = tetrinoSpawn(piecesRGBColors)
        let stringPiece = JSON.stringify(pieceData.coords)

        sessionStorage.setItem('pieceCoords', stringPiece)
        sessionStorage.setItem('currentPiece', pieceData.piece)
        sessionStorage.setItem('pieceColor', pieceData.color)
        sessionStorage.setItem('pieceOrientation', 'north')

    } else if ((isManual && sessionStorage.getItem('currentPiece') != '') &&
        allowMoveStatus == 'true') {

        // moveTetrino parameters order:
        // usrkey, piece, pieceColor, gameCoords, tileWidth, gameWidth, gameHeight, canvasName, canvasContext, lineWidth, strokeStyle, scoreDOMId, lineDOMId, levelDOMId
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

        let pieceData = tetrinoSpawn(piecesRGBColors)
        let stringPiece = JSON.stringify(pieceData.coords)

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

export { gameBoardRefresh, gameLocalVarCreate, gameParamProcess }