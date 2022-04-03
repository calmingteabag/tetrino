/* 
This module is responsible for rotating pieces.

Rotation is done by applying a set of "transformation" coordinates to the
current piece's coordinates based on which direction it will face. There is a 
function elsewhere that refreshes the board after each movement (mainly to avoid 
pieces leaving trails on board) and by the time it is called, spwned piece will 
be drawm as if it has 'rotated'.

Functions:

rotateCoord is our main function for this module
rotateCheckPosition will check if rotation ended in valid positions
*/

import { shiftPosition } from "./piece_shift.js"

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
        // console.log(rotateDirection)

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
        First, to check if rotation position is valid, we need to apply rotation
        coordinates to current piece. Maybe we should make a copy of pieceCoords
        instead of applying it on the actual piece coordinates.
         
        After appling rotation coordinates, a loop is ran to check if 
        any piece lands on an invalid position. This is where I think I 
        messed up.

        Just to remember, our call stack goes as follows:

        > User presses 'r' key
        > rotateCheckPosition is called first
        > if passes, processMove is called
        > processMove calls rotateCoord to execute movement

        rotateCheckPosition needs to do all the checks before allowing 
        rotation. We have two approaches, check for occupancy first then
        for clipping or clipping first.

        If we go for occupancy first we run into an issue of a piece block
        landing out of our board making our loop break since, for example,
        our piece coordinates will pass a '-1' coordinate to our game board
        and our board range starts from 0.

        So we have to go for clipping instead
        */

        let checkCoords = JSON.parse(sessionStorage.getItem('pieceCoords'))
        console.log(`Original coords: ${checkCoords}`)
        rotateCoord(piece, direction, checkCoords, gameWidth, false)
        console.log(`Coords after rotation ${checkCoords}`)

        for (let clippingCoords of checkCoords) {
            // clipping check

            if (clippingCoords[1] < 0) {
                // clipping left wall
                shiftPosition(checkCoords, 1, 'left', false)
                // console.log(`Coords after shift ${checkCoords}`)
                break

            } else if (clippingCoords[1] > (gameWidth - 1)) {
                // clipping right wall
                shiftPosition(checkCoords, 1, 'right', false)
                // console.log(`Coords after shift ${checkCoords}`)
                break
            }
        }

        console.log(`Coords after rotation and shift ${checkCoords}`)


        for (let newCoord of checkCoords) {
            let rowCoord = newCoord[0]
            let columnCoord = newCoord[1]
            console.log(rowCoord, columnCoord)
            console.log(gameCoords[rowCoord][columnCoord])

            if (gameCoords[rowCoord][columnCoord].tileStatus == 'occupied') {
                return false
            }
        }

        return true
    }
}

export { rotateCoord, rotateCheckPosition }