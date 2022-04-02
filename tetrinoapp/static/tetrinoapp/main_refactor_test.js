import { tetrinoSpawn, tetrinoBaseShape, tetrinoDraw } from "./piece_creation.js";
import { moveCheckPosition, moveTetrino, autoMovePiece } from "./piece_movement.js";
import { gameBoardRefresh } from "./game_handling.js"

class TetrinoGame {
    constructor() {
        // Board could be customized here, insted of fixed values, it
        // would use values from constructor, for example:
        // newGame = TetrinoGame(10,20, 40) which would represent a board 10 tiles wide, 20 tiles
        // long, with a base piece width of 40pixels. 

        this.width = 40;
        this.gameCoords = []; // board
        this.gameheight = 20; // board height
        this.gamewidth = 10; // board width
        this.pieceCoord = ''
    };

    // Game setup
    gameBoardCreate(rowsize, colsize) {

        for (let column = 0; column < colsize; column++) {
            this.gameCoords.push([])
            this.gameCoords[column].push(new Array(this.gamewidth))

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
        let rowTileValue = -this.width
        let gameCoordValues = Object.values(this.gameCoords)

        for (let row = 0; row < gameCoordValues.length; row++) {
            // when piece moves up or down, it means it changes which ROWs
            // it occupies. And in this games, rows goes from 0 to 19
            columnTileValue = 0
            // rows should take into account line width
            // starting from 0 width, it should increment 2x line width + its own width
            rowTileValue += this.width

            for (let column = 0; column < gameCoordValues[row].length; column++) {
                // when a piece moves left or right, it changes which COLUMN It
                // occupies.
                let value = gameCoordValues[row][column]
                value['tileXinit'] = rowTileValue
                value['tileYinit'] = columnTileValue
                columnTileValue += this.width
            }
        }
    }

    gameLocalVarCreate() {
        const sessionStorageValues = new Map([
            ['gameState', 'running'],
            ['currentPiece', ''],
            ['pieceOrientation', ''],
            ['pieceColor', ''],
            ['pieceCoords', ''],
        ])

        for (let values of sessionStorageValues) {
            sessionStorage.setItem(values[0], values[1])
        }
    }

    // Game Processing (Run, Cleaning, Checks)
    pieceGeneratorManual(key) {

        if (sessionStorage.getItem('currentPiece') == '') {
            let pieceData = tetrinoSpawn()
            let stringPiece = JSON.stringify(pieceData.coords)

            sessionStorage.setItem('pieceCoords', stringPiece)
            sessionStorage.setItem('currentPiece', pieceData.piece)
            sessionStorage.setItem('pieceColor', pieceData.color)
            sessionStorage.setItem('pieceOrientation', 'north')
        }

        moveTetrino(
            key,
            sessionStorage.getItem('currentPiece'),
            // JSON.parse(sessionStorage.getItem('pieceCoords')),
            sessionStorage.getItem('pieceColor'),
            this.gameCoords,
            this.width,
            this.gamewidth,
            this.gameheight,
            sessionStorage.getItem('pieceOrientation'),
        )
    }

    pieceGeneratorAuto() {
        let currPiece = sessionStorage.getItem('currentPiece')

        if (currPiece == '') {
            let pieceData = tetrinoSpawn()
            let stringPiece = JSON.stringify(pieceData.coords)

            sessionStorage.setItem('pieceCoords', stringPiece)
            sessionStorage.setItem('currentPiece', pieceData.piece)
            sessionStorage.setItem('pieceColor', pieceData.color)
            sessionStorage.setItem('pieceOrientation', 'north')
        }
    }

    async gameRun() {
        // Simulates pieces 'falling' effect, like on original.
        // If it hits something (end of board or another piece), 
        // it will 'mark' current piece on the board and check for
        // score (aka, filled rows)
        this.pieceGeneratorAuto()
        let currPiece = sessionStorage.getItem('currentPiece')
        let pieceOrientation = sessionStorage.getItem('pieceOrientation')
        let pieceColor = sessionStorage.getItem('pieceColor')
        let currPieceCoord = JSON.parse(sessionStorage.getItem('pieceCoords'))

        tetrinoDraw(this.width, pieceColor, currPieceCoord, this.gameCoords, currPiece, pieceOrientation)

        await new Promise((resolve) => setTimeout(resolve, 1000))
        autoMovePiece(pieceColor, this.gameCoords, this.gamewidth, this.gameheight, this.width)
        gameBoardRefresh("gamecanvas", "2d", this.gameCoords, this.width)
        this.gameRun()
    }

    // Load "Runners"
    loadAllListeners() {
        document.addEventListener('DOMContentLoaded', () => { this.gameLocalVarCreate() })
        document.addEventListener('keydown', (key) => { this.pieceGeneratorManual(key) });
        document.addEventListener('DOMContentLoaded', () => { this.gameRun() })
    };
};

let newGame = new TetrinoGame()
newGame.gameBoardCreate(10, 20)
newGame.gameBoardFill()
newGame.loadAllListeners()