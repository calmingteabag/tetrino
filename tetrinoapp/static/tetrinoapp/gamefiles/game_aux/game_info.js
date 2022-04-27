import { gameReset } from "./game_handling.js"

const toggleInfo = (domToggle) => {
    let isVisible = document.getElementById(domToggle).style.visibility

    if (isVisible == 'hidden') {
        document.getElementById(domToggle).style.visibility = 'visible'
    } else {
        document.getElementById(domToggle).style.visibility = 'hidden'
    }
}

const toggleResetOff = (domToggle, gameCoords, canvasName, canvasContext) => {
    document.getElementById(domToggle).style.visibility = 'hidden'
    gameReset(gameCoords, canvasName, canvasContext)
}

const gameInfoListener = (domListener, domToggle) => {
    let toggle = document.getElementById(domListener)
    toggle.addEventListener("click", function () { toggleInfo(domToggle) }, false)
}

const gameResetListener = (domListener, domToggle, gameCoords, canvasName, canvasContext) => {
    let toggle = document.getElementById(domListener)
    toggle.addEventListener("click", function () { toggleResetOff(domToggle, gameCoords, canvasName, canvasContext) }, false)
}


export { toggleInfo, gameInfoListener, gameResetListener }