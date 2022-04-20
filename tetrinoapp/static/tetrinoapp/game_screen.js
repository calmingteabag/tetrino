/* 
This module handles the issue of having fixed canvas size on different screen
sizes, which makes it look ugly depending on where it's being ran.
*/

const canvasSizeCalc = () => {

    let screenSize = {
        height: window.innerHeight,
        width: window.innerWidth
    }

    if (screenSize.width > screenSize.height) {

        let roundWidth = Math.floor(screenSize.width / 5)
        let targetWidth = Math.floor(roundWidth / 100) * 100 // to return rounded values
        let targetHeight = targetWidth * 2

        let targetSizes = {
            height: targetHeight,
            width: targetWidth
        }
        console.log(targetSizes)
        return targetSizes

    } else if (screenSize.width < screenSize.height) {
        // do magic
    }
}

const canvasSizeSet = (canvasName) => {
    let setWidth = canvasSizeCalc()

    document.getElementById(canvasName).setAttribute("height", setWidth.height)
    document.getElementById(canvasName).setAttribute("width", setWidth.width)
}

const pieceSizeSet = () => {
    let sizes = canvasSizeCalc()
    let pieceSize = sizes.width / 10
    return pieceSize
}

const setStrokeWidth = () => {
    let sizes = canvasSizeCalc()
    let pieceStrokeWidth = sizes.width / 100
    return pieceStrokeWidth
}

export { canvasSizeCalc, canvasSizeSet, pieceSizeSet, setStrokeWidth }