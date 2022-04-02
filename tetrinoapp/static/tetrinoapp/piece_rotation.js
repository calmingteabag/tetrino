import { shiftPosition } from "./piece_movement.js"

const rotateCoord = (piece, direction, pieceCoords, gameWidth, reverse) => {
    // rotate pieces based on transformation coordinates
    // excludes the 'square' tetrino for obvious reasons

    const rotateCoords = {
        "shapeS": {
            'north': [[-1, 1], [0, 0], [1, 1], [2, 0]],
            'east': [[1, -1], [0, 0], [-1, -1], [-2, 0]],
            'south': [[-1, 1], [0, 0], [1, 1], [2, 0]],
            'west': [[1, -1], [0, 0], [-1, -1], [-2, 0]],
        },
        "shapeI": {
            'north': [[-2, -2], [-1, -1], [0, 0], [1, 1]],
            'east': [[2, 2], [1, 1], [0, 0], [-1, -1]],
            'south': [[-2, -2], [-1, -1], [0, 0], [1, 1]],
            'west': [[2, 2], [1, 1], [0, 0], [-1, -1]],
        },
        "shapeL": {
            'north': [[-2, 2], [-1, 1], [0, 0], [1, 1]],
            'east': [[2, 2], [1, 1], [0, 0], [1, -1]],
            'south': [[2, -2], [1, -1], [0, 0], [-1, -1]],
            'west': [[-2, -2], [-1, -1], [0, 0], [-1, 1]],
        },
        "shapeCross": {
            'north': [[-1, 1], [-1, -1], [0, 0], [1, 1]],
            'east': [[0, 0], [1, 1], [0, 0], [0, 0]],
            'south': [[1, -1], [0, 0], [0, 0], [0, 0]],
            'west': [[0, 0], [0, 0], [0, 0], [-1, -1]],
        },
    }

    if (piece != 'shapeSqr' && reverse == false) {
        let rotateDirection = rotateCoords[`${piece}`][`${direction}`]
        console.log(rotateDirection)

        for (let coord = 0; coord < rotateDirection.length; coord++) {
            pieceCoords[coord][0] += rotateDirection[coord][0]
            pieceCoords[coord][1] += rotateDirection[coord][1]
        }

        for (let coord of pieceCoords) {
            if (coord[1] < 0) {
                shiftPosition(pieceCoords, 1, 'left', false)
            } else if (coord[1] > gameWidth.length - 1) {
                shiftPosition(pieceCoords, 3, 'right', false)
            }
        }

    } else if (piece != 'shapeSqr' && reverse == true) {
        let rotateCoordReverse = rotateCoords[`${piece}`][`${direction}`]

        for (let coord = 0; coord < rotateCoordReverse.length; coord++) {
            pieceCoords[coord][0] -= rotateCoordReverse[coord][0]
            pieceCoords[coord][1] -= rotateCoordReverse[coord][1]
        }
    }
}

const rotateCheckPosition = (piece, direction, pieceCoords, gameCoords, gameWidth) => {
    if (piece != 'shapeSqr') {

        let checkCoords = JSON.parse(sessionStorage.getItem('pieceCoords'))
        rotateCoord(piece, direction, checkCoords, gameWidth, false)
        /*  
        First, to check if rotation position is valid, we need to apply rotation
        coordinates to current piece. Maybe we should make a copy of pieceCoords
        instead of applying it on the actual piece coordinates.
        */

        for (let coords of pieceCoords) {
            let xCoord = coords[0]
            let yCoord = coords[1]
            /* 
            After appling rotation coordinates, a loop to check if any piece lands
            on an invalid position. This is where I think I messed up.

            Just to remember, our call stack goes as follows:

            > User presses 'r' key
            > rotateCheckPosition is called first
            > if passes, processMove is called
            > processMove calls rotateCoord to execute movement


            */

            console.log(gameCoords[xCoord][yCoord])
            if (gameCoords[xCoord][yCoord].tileStatus == 'occupied') {
                rotateCoord(piece, direction, pieceCoords, gameWidth, true)
                return false
            }
        }
        rotateCoord(piece, direction, pieceCoords, gameWidth, true)
        return true
    }
}

export { rotateCoord, rotateCheckPosition }