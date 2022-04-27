import { pieceFillStyling, pieceColorStyling } from "./gamefiles/styling/game_styling.js";
import { canvasSizeSet, setPieceSize, setStrokeWidth, setGameHeight } from "./gamefiles/styling/game_sizes.js"
import { tetrinoDraw } from "./gamefiles/pieces/piece_creation.js";
import { gameBoardRefresh, gameLocalVarCreate, gameParamProcess } from "./gamefiles/game_aux/game_handling.js";
import { gameResetListener, gameInfoListener } from "./gamefiles/game_aux/game_info.js";
import { addTouchListeners } from "./gamefiles/mobile_control/mobile_controls.js";

class TetrinoGame {
    constructor(
        canvasName,
        canvasContext,
        lineWidth,
        strokeStyle,
        tileWidth,
        gameHeight,
        gameWidth,
        scoreDOMId,
        lineDOMId,
        levelDOMId,
        domListenerAbout,
        domToggleAbout,
        domListenerReset,
        domToggleReset,
    ) {

        this.tileWidth = tileWidth;
        this.gameCoords = []; // board
        this.gameHeight = gameHeight; // board height
        this.gameWidth = gameWidth; // board width
        this.canvasName = canvasName
        this.canvasContext = canvasContext
        this.lineWidth = lineWidth
        this.strokeStyle = strokeStyle
        this.scoreDOMId = scoreDOMId
        this.lineDOMId = lineDOMId
        this.levelDOMId = levelDOMId
        this.piecesRGBColors = pieceFillStyling()
        this.domListenerAbout = domListenerAbout
        this.domToggleAbout = domToggleAbout
        this.domListenerReset = domListenerReset
        this.domToggleReset = domToggleReset
    };

    gameBoardCreate(rowsize, colsize) {

        for (let column = 0; column < colsize; column++) {
            this.gameCoords.push([])
            this.gameCoords[column].push(new Array(this.gameWidth))

            for (let row = 0; row < rowsize; row++) {
                this.gameCoords[column][row] = {
                    'tileXinit': 0,
                    'tileYinit': 0,
                    'tileStatus': 'free',
                    'tileColor': '',
                };
            };
        };
    };

    gameBoardFill() {
        /*
        Why yTileValue = -this.tileWidth
 
        Second loop starts by incrementing row values. Since values (on canvas) starts from
        0, -this.tileWidth ensures the first loop returns 0, not tileWidth value
        */

        let columnTileValue = 0
        let rowTileValue = -this.tileWidth
        let gameCoordValues = Object.values(this.gameCoords)

        for (let row = 0; row < gameCoordValues.length; row++) {
            columnTileValue = 0
            rowTileValue += this.tileWidth

            for (let column = 0; column < gameCoordValues[row].length; column++) {
                let value = gameCoordValues[row][column]
                value['tileXinit'] = rowTileValue
                value['tileYinit'] = columnTileValue
                columnTileValue += this.tileWidth
            }
        }
    }

    gameRunManual(usrkey) {
        let gameRunStat = sessionStorage.getItem('allowMove')

        if (gameRunStat == 'true') {
            gameParamProcess(
                usrkey,
                true,
                this.gameCoords,
                this.tileWidth,
                this.gameWidth,
                this.gameHeight,
                this.canvasName,
                this.canvasContext,
                this.lineWidth,
                this.strokeStyle,
                this.scoreDOMId,
                this.lineDOMId,
                this.levelDOMId,
                this.piecesRGBColors
            )
        }
    }

    async gameRunAuto() {
        let gameRunStat = sessionStorage.getItem('gameState')

        while (gameRunStat == 'running') {

            if (gameRunStat != 'running') {
                break
            }

            gameParamProcess(
                'null',
                false,
                this.gameCoords,
                this.tileWidth,
                this.gameWidth,
                this.gameHeight,
                this.canvasName,
                this.canvasContext,
                this.lineWidth,
                this.strokeStyle,
                this.scoreDOMId,
                this.lineDOMId,
                this.levelDOMId,
                this.piecesRGBColors,
            )


            let pieceColor = sessionStorage.getItem('pieceColor')
            let coords = sessionStorage.getItem('pieceCoords')
            let currPieceCoord = await JSON.parse(coords)
            tetrinoDraw(this.tileWidth, pieceColor, currPieceCoord, this.gameCoords, this.canvasName, this.canvasContext, this.lineWidth, this.strokeStyle)
            await new Promise((resolve) => setTimeout(resolve, 1000))
            gameBoardRefresh(this.canvasName, this.canvasContext, this.gameCoords, this.tileWidth)
        }
    }

    loadGameListeners() {
        document.addEventListener('DOMContentLoaded', () => { gameLocalVarCreate() }, false)
        document.addEventListener('keydown', (key) => { this.gameRunManual(key) }, false)
        document.addEventListener('DOMContentLoaded', () => { this.gameRunAuto() }, false)
        document.addEventListener('DOMContentLoaded', () => { gameInfoListener("game_about", this.domToggleAbout) }, false)
        document.addEventListener('DOMContentLoaded', () => { gameInfoListener("about_logo", this.domToggleAbout) }, false)
        document.addEventListener('DOMContentLoaded', () => { gameInfoListener(this.domListenerAbout, this.domToggleAbout) }, false)
        document.addEventListener('DOMContentLoaded', () => { gameResetListener(this.domListenerReset, this.domToggleReset, this.gameCoords, this.canvasName, this.canvasContext) }, false)
        document.addEventListener('DOMContentLoaded', () => {
            addTouchListeners(
                this.gameCoords,
                this.tileWidth,
                this.gameWidth,
                this.gameHeight,
                this.canvasName,
                this.canvasContext,
                this.lineWidth,
                this.strokeStyle,
                this.scoreDOMId,
                this.lineDOMId,
                this.levelDOMId,
                this.piecesRGBColors)
        }, false)
    };
};

let newGame = new TetrinoGame(
    "gamecanvas",
    "2d",
    setStrokeWidth(true),
    pieceColorStyling(false),
    setPieceSize(true),
    setGameHeight(true),
    10,
    "game_score",
    "line_score",
    "game_level",
    "btn_about",
    "game_about",
    "resetbutton",
    "gameover"
)

newGame.gameBoardCreate(10, setGameHeight(true))
newGame.gameBoardFill()
newGame.loadGameListeners()
document.addEventListener('DOMContentLoaded', () => { canvasSizeSet("gamecanvas") }, false)

window.addEventListener('resize', () => {
    let viewHeight = window.innerHeight * 0.01
    document.getElementById("game_wrapper").style.height = `${viewHeight * 90}px`
})