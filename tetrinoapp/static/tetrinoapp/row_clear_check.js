import { tetrinoBaseShape } from "./piece_creation.js"
/* 
This module is responsible for the row cleaning that occurs
when all tiles on a row is filled with tetrinos.

It's still messy and I'm trying to figure out how to do it. Basic 
idea is to call a main function on this module always after a piece 
encounters an occupied tile below (so, after movedown check returns
false)
*/

const rowFillClear = (gameBoard, row) => {

    for (let item of gameBoard[row]) {
        item.tileStatus = 'free'
        item.tileColor = ''
    }
}

const rowFillProcess = (gameCoords, filledRow) => {
    /* 
    Bugando se foi quem um dia só me fez codar
    Bugando estará ao lembrar de um input
    Quem um dia não soube testar

    A reclamação vai estar com ident aonde for~~
    */
    rowFillClear(gameCoords, filledRow)

    for (let row = filledRow - 1; row > 0; row--) {
        for (let element = 0; element < gameCoords[row].length; element++) {
            let elemCopy = JSON.parse(JSON.stringify(gameCoords[row][element]))

            gameCoords[row + 1][element].tileStatus = elemCopy.tileStatus
            gameCoords[row + 1][element].tileColor = elemCopy.tileColor
        }
    }
}

const reloadBoard = (gameCoords, canvasName, canvasContext, tileWidth) => {
    for (let row = 0; row < gameCoords.length; row++) {
        for (let element = 0; element < gameCoords[row].length; element++) {
            if (gameCoords[row][element].tileStatus == 'occupied') {
                let xDraw = gameCoords[row][element].tileYinit
                let yDraw = gameCoords[row][element].tileXinit
                let color = gameCoords[row][element].tileColor
                tetrinoBaseShape(xDraw, yDraw, tileWidth, color, canvasName, canvasContext)
            }
        }
    }
}
const rowFillCheck = (gameCoords, canvasName, canvasContext, tileWidth) => {
    /* 
    It's our main function that is called after moveDownCheck returns false
 
    It will iterate backwards (from bottom to top) and will count each tile
    marked as 'occupied' on a row to increment a counter. If this counter on
    a row reaches 10, it means the current row is full, so rowFillProcess is
    called to further process it.
    */

    let cleanedRowCount = 0 // will be sent to future score function

    for (let row = 0; row < gameCoords.length; row++) {
        let rowFillCount = 0

        for (let element = 0; element < gameCoords[row].length; element++) {
            if (gameCoords[row][element].tileStatus == 'occupied') {
                rowFillCount++
            }
        }

        if (rowFillCount == 10) {
            cleanedRowCount++
            console.log(`gameScoreCheck: Current row ${row} is full`)
            console.log('sending it to rowFillProcess')
            rowFillProcess(gameCoords, row)
            reloadBoard(gameCoords, canvasName, canvasContext, tileWidth)
        }
    }

    // call some score function here with cleanedRowCount as parameter
}

export { rowFillCheck }