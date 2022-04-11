/* 
This module deals with tetrinos (the pieces)

The way I did this game was to separate 'logic' tetrinos from
'canvas' tetrinos. When it generates a 'logic' tetrino, four 'coordinates'
are given to the piece, each representing a position on the game
array. Based on those coordinates, a function is called to draw an square
(tile) on each of those coordinates, so we have an illusion of a single
tetrino being drawn.

Functions:

- tetrinoSpawn, generates the 'logic' tetrinos
- tetrinoBaseShape, have instructions for a single 'tile'
- tetrinoDraw, will use tetrinoSpawn coordinates and tetrinoBaseShape to
create the full tetrino on canvas

*/

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

const tetrinoBaseShape = (yDraw, xDraw, width, color, canvasName, canvasContext, lineWidth, strokeStyle) => {

    const gameCanvas = document.getElementById(canvasName)
    const gameContext = gameCanvas.getContext(canvasContext)

    gameContext.fillStyle = color
    gameContext.fillRect(yDraw, xDraw, width, width)
    gameContext.lineWidth = lineWidth
    gameContext.strokeStyle = strokeStyle
    gameContext.strokeRect(yDraw, xDraw, width, width)
};

const tetrinoDraw = (width, pieceColor, pieceCoords, gameCoords, canvasName, canvasContext, lineWidth, strokeStyle) => {
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

        tetrinoBaseShape(xDraw, yDraw, currWidth, pieceColor, canvasName, canvasContext, lineWidth, strokeStyle)
        // console.log('Current Coordinates')
        // console.log(xCoord, yCoord, xDraw, yDraw)
    }
}

export { tetrinoSpawn, tetrinoBaseShape, tetrinoDraw }