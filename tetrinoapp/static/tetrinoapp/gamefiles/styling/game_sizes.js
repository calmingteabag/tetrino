/* 
This module handles the issue of having fixed canvas size on different screen
sizes, which makes it look ugly depending on where it's being ran.
*/

const canvasSizeCalc = (DOMElement) => {

    let screenSize = {
        height: window.innerHeight,
        width: window.innerWidth
    }

    const currWidth = document.getElementsByClassName("tetrino_main")[0].clientWidth
    const currHeight = document.getElementsByClassName("tetrino_main")[0].clientHeight

    console.log("curr canvas:", currWidth, currHeight)

    if (screenSize.width > screenSize.height) {
        /* 
        Canvas needed to have a fixed size for the game to work properly and so far
        the best idea I could come with was to set a kind of conversion "algorithm"
        for canvas measurements based on parent element. 
        
        'newWidth' is a rounded down value from parent's width value. With that, we
        also set the 'tile' size.

        'newHeight' follows the same logic, but is calculated by how many of those tiles
        fits in current parent's height, rodunded down.

        Not the fanciest or brightest idea, but works.
        */
        let tile = Math.floor(currWidth / 10)

        if (tile % 2 != 0) {
            tile -= 3
        }

        let newWidth = tile * 10
        let tileFill = Math.floor(currHeight / tile)
        let newHeight = tileFill * tile

        let targetSizes = {
            canvasHeight: newHeight,
            canvasWidth: newWidth,
            tileSize: tile,
            gameWidth: 10,
            gameHeight: tileFill
        }

        return targetSizes

    } else if (screenSize.width < screenSize.height) {

        let tile = Math.floor(currWidth / 10)

        if (tile % 2 != 0) {
            tile -= 1
        }

        let newWidth = tile * 10
        let tileFill = Math.floor(currHeight / tile)
        let newHeight = tileFill * tile

        let targetSizes = {
            canvasHeight: newHeight,
            canvasWidth: newWidth,
            tileSize: tile,
            gameWidth: 10,
            gameHeight: tileFill
        }

        return targetSizes
    }
}

const canvasSizeSet = (canvasName) => {
    let setMeasure = canvasSizeCalc("tetrino_main")

    document.getElementById(canvasName).setAttribute("height", setMeasure.canvasHeight)
    document.getElementById(canvasName).setAttribute("width", setMeasure.canvasWidth)
}

const setPieceSize = (isWideFormat) => {
    let sizes = canvasSizeCalc("tetrino_main")

    if (isWideFormat) {
        let pieceSize = sizes.tileSize
        return pieceSize
    }
}

const setStrokeWidth = (isWideFormat) => {
    let sizes = canvasSizeCalc("tetrino_main")

    if (isWideFormat) {
        let pieceStrokeWidth = sizes.canvasWidth / 100
        return pieceStrokeWidth
    }
}

const setGameHeight = (isWideFormat) => {
    let sizes = canvasSizeCalc("tetrino_main")

    if (isWideFormat) {
        let setGameHeight = sizes.gameHeight
        return setGameHeight
    }
}

export { canvasSizeCalc, canvasSizeSet, setPieceSize, setStrokeWidth, setGameHeight }