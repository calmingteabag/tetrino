/* 
These functions are called specifically to deal with the problem
of pieces's coordinates going out of bounds after an rotation movement, 
for example.

What it does is shift piece position by "space" number of tiles
to the left or right to keep it in our board.

*/

const shiftPosition = (coords, space, position, reverse) => {

    if (position == 'left' && reverse == false) {
        for (let values of coords) {
            values[1] += space
        }
    } else if (position == 'right' && reverse == false) {
        for (let values of coords) {
            values[1] -= space
        }
    } else if (position == 'down' && reverse == false) {
        for (let values of coords) {
            values[0] -= space
        }
    } else if (position == 'left' && reverse == true) {
        for (let coord of currCoords) {
            coord[1] -= space
        }
    } else if (position == 'right' && reverse == true) {
        for (let coord of currCoords) {
            coord[1] += space
        }
    } else if (position == 'down' && reverse == true) {
        for (let coord of currCoords) {
            coord[0] += space
        }
    }
}

const shiftTetrinoHandler = (pieceCoords) => {

    for (let coords of pieceCoords) {
        if (coords[1] == 0) {
            shiftPosition(pieceCoords, 1, 'left')
        } else if (coords[1] == this.gamewidth.length - 1) {
            shiftPosition(pieceCoords, 1, 'right')
        } else if (coords[0] > this.gameheight.length - 1) {
            shiftPosition(pieceCoords, 1, 'down')
        }
    }
}

export { shiftPosition, shiftTetrinoHandler }