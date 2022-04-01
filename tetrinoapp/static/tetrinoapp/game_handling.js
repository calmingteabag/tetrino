const gameBoardRefresh = (canvasName, getContextName, gameCoords, tileWidth) => {

    const gameCanvas = document.getElementById(canvasName)
    const gameContext = gameCanvas.getContext(getContextName)

    for (let row = 0; row < gameCoords.length; row++) {
        for (let column = 0; column < gameCoords[row].length; column++) {
            // else if to check if all elements are marked as occupied
            // if so, find a way to shift everything down by 1 row

            if (gameCoords[row][column].tileStatus == 'free') {

                let xCoordClear = gameCoords[row][column].tileYinit
                let yCoordClear = gameCoords[row][column].tileXinit
                gameContext.clearRect(xCoordClear, yCoordClear, tileWidth, tileWidth)
            }
        }
    }
};

export { gameBoardRefresh }