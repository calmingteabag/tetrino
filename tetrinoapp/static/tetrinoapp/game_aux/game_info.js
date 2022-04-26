import { gameReset } from "./game_aux/game_handling.js"

const toggleInfo = (domToggle) => {
    let isVisible = document.getElementById(domToggle).style.visibility

    if (isVisible == 'hidden') {
        document.getElementById(domToggle).style.visibility = 'visible'
        sessionStorage.setItem('gameState', 'notRunning')
    } else {
        document.getElementById(domToggle).style.visibility = 'hidden'
        sessionStorage.setItem('gameState', 'running')
    }
}

const toggleResetOff = (domToggle, gameCoords, canvasName, canvasContext) => {
    document.getElementById(domToggle).style.visibility = 'hidden'
    gameReset(gameCoords, canvasName, canvasContext)
}

const showInfoListener = (domListener, domToggle) => {
    let toggle = document.getElementById(domListener)
    toggle.addEventListener("click", function () { toggleInfo(domToggle) }, false)
}

const showInfoListenerReset = (domListener, domToggle, gameCoords, canvasName, canvasContext) => {
    let toggle = document.getElementById(domListener)
    toggle.addEventListener("click", function () { toggleResetOff(domToggle, gameCoords, canvasName, canvasContext) }, false)
}


export { toggleInfo, showInfoListener, showInfoListenerReset }