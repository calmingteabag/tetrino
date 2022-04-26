/* 
This module is responsible for rotating pieces.

Rotation is done by applying a set of "transformation" coordinates to the
current piece's coordinates based on which direction it will face. Before
allowing full rotation, game checks if rotation position is valid (by 
appliing transformation coordinates on a copy of current piece's coordi
nates)

It excludes square tetrino for obvious reasons.
*/

import { shiftPosition } from "./piece_shift.js"

const rotateCoord = (piece, direction, pieceCoords, gameWidth, reverse) => {

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

        for (let coord = 0; coord < rotateDirection.length; coord++) {
            pieceCoords[coord][0] += rotateDirection[coord][0]
            pieceCoords[coord][1] += rotateDirection[coord][1]
        }

        for (let coord of pieceCoords) {
            if (coord[1] < 0) {
                shiftPosition(pieceCoords, 1, 'left', false)
            } else if (coord[1] > (gameWidth - 1)) {
                shiftPosition(pieceCoords, 2, 'right', false)
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

const rotateCheckPosition = (piece, direction, gameCoords, gameWidth) => {
    if (piece != 'shapeSqr') {
        /*  
        Checking for valid rotation in tetris is a bit more complicated 
        than it looks like (from my limited perspective of course)

        Game needs to do two checks for each piece: If it lands on an
        'occupied' block (valid spaces) and/or out of bounds (clipping the
        board). The order of those operations matter a lot because it can
        raise errors depeding on the approach.

        Basically we can either (after "rotating") a piece, go for occupancy
        checks first or clipping first. IF we go for occupancy first (rememenber
        we just rotated it, we didn't shift yet) some coordinates will end with 
        invalid (negative) values, raising errors. Those happens because we are 
        using coordinates to return objects on specific positions in a 2x2 array
        and in this case, negative values return error because there is no object.
   
        So, we check for clipping first, do the shifting and THEN check for
        valid spaces, to avoid errors.
        */

        let checkCoords = JSON.parse(sessionStorage.getItem('pieceCoords'))
        rotateCoord(piece, direction, checkCoords, gameWidth, false)

        for (let clippingCoords of checkCoords) {

            if (clippingCoords[1] < 0) {
                // clipping left wall
                shiftPosition(checkCoords, 1, 'left', false)
                break

            } else if (clippingCoords[1] > (gameWidth - 1)) {
                // clipping right wall
                shiftPosition(checkCoords, 1, 'right', false)
                break
            }
        }

        for (let newCoord of checkCoords) {
            let rowCoord = newCoord[0]
            let columnCoord = newCoord[1]

            if (gameCoords[rowCoord][columnCoord].tileStatus == 'occupied') {
                return false
            }
        }

        return true
    }
}

export { rotateCoord, rotateCheckPosition }