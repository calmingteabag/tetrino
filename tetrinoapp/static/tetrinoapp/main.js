import { pieceFillStyling, pieceColorStyling } from "./game_styling.js";
import { tetrinoDraw } from "./piece_creation.js";
import { gameBoardRefresh, gameLocalVarCreate, gameParamProcess } from "./game_handling.js";
import { canvasSizeSet, canvasSizeCalc, setPieceSize, setStrokeWidth, setGameHeight } from "./game_sizes.js"
// import { pieceFillStyling, pieceColorStyling } from "./tetris/game_styling.js"
import { testfunc } from "./tetrinotest.js"

class TetrinoGame {
    constructor(canvasName, canvasContext, lineWidth, strokeStyle, tileWidth, gameHeight, gameWidth, scoreDOMId, lineDOMId, levelDOMId) {

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
        let gameRunStat = sessionStorage.getItem('allowMove')

        if (gameRunStat == 'true') {
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
            this.gameRunAuto()
        }
    }

    loadGameListeners() {
        document.addEventListener('DOMContentLoaded', () => { gameLocalVarCreate() }, false)
        document.addEventListener('keydown', (key) => { this.gameRunManual(key) }, false)
        document.addEventListener('DOMContentLoaded', () => { this.gameRunAuto() }, false)
    };
};

// canvasName, canvasContext, lineWidth, strokeStyle, tileWidth, gameHeight, gameWidth, scoreDOMId, lineDOMId, levelDOMId
let newGame = new TetrinoGame("gamecanvas", "2d", setStrokeWidth(true), pieceColorStyling(false),
    setPieceSize(true), setGameHeight(true), 10, "game_score", "line_score", "game_level", pieceFillStyling(false))

newGame.gameBoardCreate(10, setGameHeight(true))
newGame.gameBoardFill()
newGame.loadGameListeners()
document.addEventListener('DOMContentLoaded', () => { canvasSizeSet("gamecanvas") }, false)
document.addEventListener('DOMContentLoaded', () => { testfunc() }, false)
