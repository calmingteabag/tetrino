import { tetrinoSpawn, tetrinoDraw } from "./piece_creation.js";
import { moveTetrino, moveTetrinoAuto } from "./piece_movement.js";
import { gameBoardRefresh, gameLocalVarCreate } from "./game_handling.js";

class TetrinoGame {
    constructor(canvasName, canvasContext, lineWidth, strokeColor, tileWidth, gameHeight, gameWidth, scoreDOMId, lineDOMId, levelDOMId, piecesRGBColors) {

        this.tileWidth = tileWidth;
        this.gameCoords = []; // board
        this.gameHeight = gameHeight; // board height
        this.gameWidth = gameWidth; // board width
        this.canvasName = canvasName
        this.canvasContext = canvasContext
        this.lineWidth = lineWidth
        this.strokeColor = strokeColor
        this.scoreDOMId = scoreDOMId
        this.lineDOMId = lineDOMId
        this.levelDOMId = levelDOMId
        this.piecesRGBColors = piecesRGBColors
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

    gameProcess(key, isManual) {
        /*
        Needed to set a flag (allowMoveStatus) to stop game from
        calling gameProcess while scores/line cleaning is being
        processed when user holds keydown.

        This happens because the event listener for key press is
        separated from the rest of the game.
        */
        let allowMoveStatus = sessionStorage.getItem('allowMove')

        if ((isManual && sessionStorage.getItem('currentPiece') == '') &&
            allowMoveStatus == 'true') {

            let pieceData = tetrinoSpawn(this.piecesRGBColors)
            let stringPiece = JSON.stringify(pieceData.coords)

            sessionStorage.setItem('pieceCoords', stringPiece)
            sessionStorage.setItem('currentPiece', pieceData.piece)
            sessionStorage.setItem('pieceColor', pieceData.color)
            sessionStorage.setItem('pieceOrientation', 'north')

        } else if ((isManual && sessionStorage.getItem('currentPiece') != '') &&
            allowMoveStatus == 'true') {

            moveTetrino(
                key,
                sessionStorage.getItem('currentPiece'),
                sessionStorage.getItem('pieceColor'),
                this.gameCoords,
                this.tileWidth,
                this.gameWidth,
                this.gameHeight,
                this.canvasName,
                this.canvasContext,
                this.lineWidth,
                this.strokeColor,
                this.scoreDOMId,
                this.lineDOMId,
                this.levelDOMId,
            )
        } else if ((!isManual && sessionStorage.getItem('currentPiece') == '') && (allowMoveStatus == 'true')) {

            let pieceData = tetrinoSpawn(this.piecesRGBColors)
            let stringPiece = JSON.stringify(pieceData.coords)
            // let colorData = JSON.stringify(pieceData.color)

            sessionStorage.setItem('pieceCoords', stringPiece)
            sessionStorage.setItem('currentPiece', pieceData.piece)
            sessionStorage.setItem('pieceColor', pieceData.color)
            sessionStorage.setItem('pieceOrientation', 'north')
        }
    }

    async gameRun() {
        this.gameProcess('null', false)
        let currPiece = sessionStorage.getItem('currentPiece')
        let pieceColor = sessionStorage.getItem('pieceColor')
        let currPieceCoord = JSON.parse(sessionStorage.getItem('pieceCoords'))
        let gameRunStat = sessionStorage.getItem('allowMove')
        console.log(pieceColor)

        if (gameRunStat == 'true') {
            tetrinoDraw(this.tileWidth, pieceColor, currPieceCoord, this.gameCoords, this.canvasName, this.canvasContext, this.lineWidth, this.strokeColor)
            await new Promise((resolve) => setTimeout(resolve, 1000))
            moveTetrinoAuto(
                pieceColor,
                this.gameCoords,
                this.gameWidth,
                this.gameHeight,
                this.tileWidth,
                this.canvasName,
                this.canvasContext,
                currPiece,
                this.lineWidth,
                this.strokeColor,
                this.scoreDOMId,
                this.lineDOMId,
                this.levelDOMId,
            )
            gameBoardRefresh("gamecanvas", "2d", this.gameCoords, this.tileWidth)
            this.gameRun()
        }
    }

    loadAllListeners() {
        document.addEventListener('DOMContentLoaded', () => { gameLocalVarCreate() }, false)
        document.addEventListener('keydown', (key) => { this.gameProcess(key, true) }, false);
        document.addEventListener('DOMContentLoaded', () => { this.gameRun() }, false)
    };
};

let pieceColors = {
    shapeSqr: '23,123,144',
    shapeS: '126,22,10',
    shapeI: '244,112,98',
    shapeL: '12,234,44',
    shapeCross: '98,244,11',
}

let newGame = new TetrinoGame("gamecanvas", "2d", 5, "15,82,75", 40, 20, 10, "game_score", "line_score", "game_level", pieceColors)
// "254,125,125" as in red green blue
newGame.gameBoardCreate(10, 20) // must match game width and height
newGame.gameBoardFill()
newGame.loadAllListeners()