const clearRow = (gameBoard, row) => {

    for (let item of gameBoard[row]) {
        item.tileStatus = 'free'
        item.tileColor = ''
    }
}

const moveDownBoardPieces = (arrayOfRows) => {
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

const gameScoreCheck = () => {
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