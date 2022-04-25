import { moveTetrino } from "./piece_movement.js"

const someFunc = (toggle) => {
    console.log("moving function here")
}

const touchListener = (
    targetDOMId,
    simulatedKey,
    piece,
    pieceColor,
    gameCoords,
    tileWidth,
    gameWidth,
    gameHeight,
    canvasName,
    canvasContext,
    lineWidth,
    strokeStyle,
    scoreDOMId,
    lineDOMId,
    levelDOMId,) => {

    let domElement = document.getElementById(targetDOMId)
    domElement.addEventListener("touchstart", () => { someFunc("go") }, false)
}

export { touchListener }