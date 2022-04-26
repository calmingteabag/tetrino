/* 
Module that deals with touchEvent listeners

In order to 'emulate' keypresses, keyboard events are created for each key and 
passed down to moveTetrino.

Piece's type and color atributes are get from inside moveTetrino call instead
of being set outside on addTouchListeners simply because this funciton is being called
one time only and every variable defined here won't be updated anymore.
*/

import { moveTetrino } from "./movement/piece_movement.js"


const addTouchListeners = (gameCoords, tileWidth, gameWidth, gameHeight, canvasName, canvasContext, lineWidth, strokeStyle, scoreDOMId, lineDOMId, levelDOMId) => {

    const domElemLeft = document.getElementById("control_left")
    const domElemDown = document.getElementById("control_down")
    const domElemRotate = document.getElementById("control_rotate")
    const domElemRight = document.getElementById("control_right")

    const keyEvents = {
        keyLeft: new KeyboardEvent("keydown", {
            key: "ArrowLeft",
            code: "ArrowLeft"
        }),
        keyDown: new KeyboardEvent("keydown", {
            key: "ArrowDown",
            code: "ArrowDown"
        }),
        keyRotate: new KeyboardEvent("keydown", {
            key: "r",
            code: "KeyR"
        }),
        keyRight: new KeyboardEvent("keydown", {
            key: "ArrowRight",
            code: "ArrowRight"
        }),
    }

    domElemLeft.addEventListener("touchstart", () => {
        moveTetrino(
            keyEvents.keyLeft,
            sessionStorage.getItem('currentPiece'),
            sessionStorage.getItem('pieceColor'),
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
            levelDOMId
        )
    }, false)

    domElemDown.addEventListener("touchstart", () => {
        moveTetrino(
            keyEvents.keyDown,
            sessionStorage.getItem('currentPiece'),
            sessionStorage.getItem('pieceColor'),
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
            levelDOMId
        )
    }, false)
    domElemRotate.addEventListener("touchstart", () => {
        moveTetrino(
            keyEvents.keyRotate,
            sessionStorage.getItem('currentPiece'),
            sessionStorage.getItem('pieceColor'),
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
            levelDOMId
        )
    }, false)
    domElemRight.addEventListener("touchstart", () => {
        moveTetrino(
            keyEvents.keyRight,
            sessionStorage.getItem('currentPiece'),
            sessionStorage.getItem('pieceColor'),
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
            levelDOMId
        )
    }, false)
}

export { addTouchListeners }