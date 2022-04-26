/* 
This module is responsible for the row cleaning that occurs
when all tiles on a row is filled with tetrinos.
*/

import { tetrinoBaseShape } from "./pieces/piece_creation.js"
import { gameScore } from "./scoring/game_score.js"

const rowFillClear = (gameBoard, row) => {

    for (let item of gameBoard[row]) {
        item.tileStatus = 'free'
        item.tileColor = ''
    }
}

const rowFillProcess = (gameCoords, filledRow) => {
    rowFillClear(gameCoords, filledRow)

    for (let row = filledRow - 1; row > 0; row--) {
        for (let element = 0; element < gameCoords[row].length; element++) {
            let elemCopy = JSON.parse(JSON.stringify(gameCoords[row][element]))

            gameCoords[row + 1][element].tileStatus = elemCopy.tileStatus
            gameCoords[row + 1][element].tileColor = elemCopy.tileColor
        }
    }
}

const reloadBoard = (gameCoords, canvasName, canvasContext, tileWidth, lineWidth, strokeStyle) => {
    for (let row = 0; row < gameCoords.length; row++) {
        for (let element = 0; element < gameCoords[row].length; element++) {
            if (gameCoords[row][element].tileStatus == 'occupied') {
                let xDraw = gameCoords[row][element].tileYinit
                let yDraw = gameCoords[row][element].tileXinit
                let color = gameCoords[row][element].tileColor
                tetrinoBaseShape(xDraw, yDraw, tileWidth, color, canvasName, canvasContext, lineWidth, strokeStyle)
                //yDraw, xDraw, width, color, canvasName, canvasContext, lineWidth, strokeStyle
            }
        }
    }
}

const rowFillCheck = (gameCoords, canvasName, canvasContext, tileWidth, gameWidth, scoreDOMId, lineDOMId, levelDOMId, lineWidth, strokeStyle) => {
    /* 
    It's our main function that is called after moveDownCheck returns false
 
    It will iterate gameCoords and will count each tile
    marked as 'occupied' on a row to increment a counter. If this counter on
    a row reaches 10, it means the current row is full, so rowFillProcess is
    called to further process it.
    */

    let cleanedRowCount = 0

    for (let row = 0; row < gameCoords.length; row++) {
        let rowFillCount = 0

        for (let element = 0; element < gameCoords[row].length; element++) {
            if (gameCoords[row][element].tileStatus == 'occupied') {
                rowFillCount += 1
            }
        }

        if (rowFillCount == gameWidth) {
            cleanedRowCount += 1
            rowFillProcess(gameCoords, row)
            reloadBoard(gameCoords, canvasName, canvasContext, tileWidth, lineWidth, strokeStyle)
        }
    }
    gameScore(cleanedRowCount, scoreDOMId, lineDOMId, levelDOMId)
}

export { rowFillCheck }