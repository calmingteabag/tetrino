const tetrinoSpawn = () => {
    // Randomly generates a tetrino
    const pieceChoice = {
        'shapeSqr': [[[3, 3], [4, 3], [3, 4], [4, 4]], 'yellow'],
        'shapeS': [[[3, 3], [4, 3], [4, 4], [5, 4]], 'green'],
        'shapeI': [[[3, 3], [4, 3], [5, 3], [6, 3]], 'red'],
        'shapeL': [[[3, 3], [4, 3], [5, 3], [5, 4]], 'orange'],
        'shapeCross': [[[3, 4], [4, 3], [4, 4], [4, 5]], 'purple'],
    }

    let percent = Math.random();
    let num = Math.floor(percent * (Math.floor(4) - Math.ceil(0) + 1))

    let pieceCoord = {
        // change [1] for [num] to enable random generation
        piece: Object.keys(pieceChoice)[num],
        coords: Object.values(pieceChoice)[num][0],
        color: Object.values(pieceChoice)[num][1]
    }

    return pieceCoord
}

const tetrinoBaseShape = (y, x, width, color, canvasName, getContextName) => {

    const gameCanvas = document.getElementById(canvasName)
    const gameContext = gameCanvas.getContext(getContextName)

    gameContext.fillStyle = color
    gameContext.fillRect(y, x, width, width)
    gameContext.lineWidth = 5
    gameContext.strokeStyle = 'grey'
    gameContext.strokeRect(y, x, width, width)
};

const tetrinoDraw = (width, pieceColor, pieceCoords, gameCoords) => {
    // After generating a tetrino, it needs to be drawn on canvas.
    // It draws each 'square' of the tetrino separately by looping though 
    // its coordinates. Each coordinate is reference to a object's position
    // in an 2D array (which is our board this.gameCoords).

    // Each of those objects have references to positions on Canvas (called
    // tyleXinit, tyleYinit) and these tells where the program should
    // start drawing a square.
    for (let coord = 0; coord < pieceCoords.length; coord++) {

        let xCoord = pieceCoords[coord][0]
        let yCoord = pieceCoords[coord][1]
        let currWidth = width

        let currObj = gameCoords[xCoord][yCoord]
        let xDraw = currObj.tileYinit
        let yDraw = currObj.tileXinit

        tetrinoBaseShape(xDraw, yDraw, currWidth, pieceColor, "gamecanvas", "2d")
        // console.log('Current Coordinates')
        // console.log(xCoord, yCoord, xDraw, yDraw)
    }
}

export { tetrinoSpawn, tetrinoBaseShape, tetrinoDraw }