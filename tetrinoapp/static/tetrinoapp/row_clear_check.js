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

const rowFillProcess = (gameCoords, filledRows) => {
    /* 
    Now it's where things get funny D8
    What we need to do:

    Starting on the line ABOVE current filledRows's row:

        - copy current object's status and color
        - find a way to 'paste it' on the row below
        - clear current row by setting status to 'free' and color to ''

    Sounds easy, but arrays don't deal well with it. It works great unti after
    line cleaning
    */
    console.log(`Received full rows: ${filledRows}`)
    let copyGameCoords = JSON.parse(JSON.stringify(gameCoords))
    console.log(copyGameCoords)

    for (let currProcessingRow of filledRows) {
        console.log(`Last 'row' moveDownBoardPieces received: ${currProcessingRow}`)
        // clear current row
        rowFillClear(gameCoords, currProcessingRow)



        // then try moving everything down
        for (let row = currProcessingRow - 1; row > 0; row--) {
            // we are reverse iterating (bottom to top of array)
            // not to self that this board shouldn't be modified
            console.log(`Current row to process: ${currProcessingRow}`)

            for (let element = 0; element < gameCoords[row].length; element++) {
                let copyStatus = gameCoords[row][element].tileStatus
                let copyColor = gameCoords[row][element].tileColor

                copyGameCoords[row + 1][element].tileStatus = copyStatus
                copyGameCoords[row + 1][element].tileStatus = copyColor
            }
        }
    }
    console.log(copyGameCoords)
}

const rowFillCheck = (gameCoords) => {
    /* 
    It's our main function that is called after moveDownCheck returns false
 
    It will iterate backwards (from bottom to top) and will count each tile
    marked as 'occupied' on a row to increment a counter. If this counter on
    a row reaches 10, it means the current row is full, so rowFillProcess is
    called to further process it.
    */

    let filledRows = []
    let cleanedRowCount = 0

    for (let row = 0; row < gameCoords.length; row++) {
        let rowFillCount = 0

        for (let element = 0; element < gameCoords[row].length; element++) {
            if (gameCoords[row][element].tileStatus == 'occupied') {
                rowFillCount++
            }
        }

        if (rowFillCount == 10) {
            cleanedRowCount++
            filledRows.push(row)
            console.log(`gameScoreCheck: Current row ${row} is full`)
            rowFillProcess(gameCoords, filledRows)
        }
    }
    console.log(cleanedRowCount)
    console.log(filledRows)
}

export { rowFillCheck }