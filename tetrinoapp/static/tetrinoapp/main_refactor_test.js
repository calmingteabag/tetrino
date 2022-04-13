import { tetrinoSpawn, tetrinoDraw } from "./piece_creation.js";
import { moveTetrino, moveTetrinoAuto } from "./piece_movement.js";
import { gameBoardRefresh } from "./game_handling.js";

class TetrinoGame {
    constructor(canvasName, canvasContext, lineWidth, strokeStyle, tileWidth, gameHeight, gameWidth) {

        this.tileWidth = tileWidth;
        this.gameCoords = []; // board
        this.gameHeight = gameHeight; // board height
        this.gameWidth = gameWidth; // board width
        this.pieceCoord = ''
        this.canvasName = canvasName
        this.canvasContext = canvasContext
        this.lineWidth = lineWidth
        this.strokeStyle = strokeStyle
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
        Fills Board with objects containing coordinates for drawing and an occupied/free flag for each
        coordinate.
 
        Why yTileValue = -40:
 
        Rows are updated on inner loop and their indexes are reset when game changes columns. Since the very 
        first run already sets yTileValue to +40, making our first set of coordinates wrong (all y coords will 
        start at 40 insted of 0) I offset initial value to compensate.
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

    gameLocalVarCreate() {
        const sessionStorageValues = new Map([
            ['gameState', 'running'],
            ['currentPiece', ''],
            ['pieceColor', ''],
            ['pieceCoords', ''],
            ['allowMove', 'true']
        ])

        for (let values of sessionStorageValues) {
            sessionStorage.setItem(values[0], values[1])
        }
    }

    gameProcess(key, isManual) {
        let allowMoveStatus = sessionStorage.getItem('allowMove')

        if ((isManual && sessionStorage.getItem('currentPiece') == '') &&
            allowMoveStatus == 'true') {
            let pieceData = tetrinoSpawn()
            let stringPiece = JSON.stringify(pieceData.coords)

            sessionStorage.setItem('pieceCoords', stringPiece)
            sessionStorage.setItem('currentPiece', pieceData.piece)
            sessionStorage.setItem('pieceColor', pieceData.color)
            sessionStorage.setItem('pieceOrientation', 'north')

        } else if ((isManual && sessionStorage.getItem('currentPiece') != '') &&
            allowMoveStatus == 'true') {
            console.log('move is allowed')
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
                this.strokeStyle,
            )
        } else if ((!isManual && sessionStorage.getItem('currentPiece') == '') && (allowMoveStatus == 'true')) {
            console.log('move is allowed')
            let pieceData = tetrinoSpawn()
            let stringPiece = JSON.stringify(pieceData.coords)

            sessionStorage.setItem('pieceCoords', stringPiece)
            sessionStorage.setItem('currentPiece', pieceData.piece)
            sessionStorage.setItem('pieceColor', pieceData.color)
            sessionStorage.setItem('pieceOrientation', 'north')
        } else {
            console.log('movemnt locked, game processing')
        }
    }

    async gameRun() {
        this.gameProcess('null', false)
        let currPiece = sessionStorage.getItem('currentPiece')
        let pieceColor = sessionStorage.getItem('pieceColor')
        let currPieceCoord = JSON.parse(sessionStorage.getItem('pieceCoords'))
        let gameRunStat = sessionStorage.getItem('allowMove')

        if (gameRunStat == 'true') {
            tetrinoDraw(this.tileWidth, pieceColor, currPieceCoord, this.gameCoords, this.canvasName, this.canvasContext, this.lineWidth, this.strokeStyle)
            await new Promise((resolve) => setTimeout(resolve, 1000))
            moveTetrinoAuto(pieceColor, this.gameCoords, this.gameWidth, this.gameHeight, this.tileWidth, this.canvasName, this.canvasContext, currPiece, this.lineWidth, this.strokeStyle)
            gameBoardRefresh("gamecanvas", "2d", this.gameCoords, this.tileWidth)
            this.gameRun()
        } else {
            console.log('WAIT')
        }
    }

    loadAllListeners() {
        document.addEventListener('DOMContentLoaded', () => { this.gameLocalVarCreate() }, false)
        document.addEventListener('keydown', (key) => { this.gameProcess(key, true) }, false);
        document.addEventListener('DOMContentLoaded', () => { this.gameRun() }, false)
    };
};

let newGame = new TetrinoGame("gamecanvas", "2d", 5, "red", 40, 20, 10)
newGame.gameBoardCreate(10, 20) // must match game width and height
newGame.gameBoardFill()
newGame.loadAllListeners()