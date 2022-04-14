/* 
This module brings some auxiliary functions to the game.
*/

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

export { gameBoardRefresh, gameLocalVarCreate }