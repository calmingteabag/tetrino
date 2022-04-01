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
        rotateCoord(piece, direction, pieceCoords, gameWidth, false)

        for (let coords of pieceCoords) {
            let xCoord = coords[0]
            let yCoord = coords[1]

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