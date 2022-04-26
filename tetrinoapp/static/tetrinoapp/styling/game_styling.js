/* 
Module responsible for setting piece styling
*/

const getRandNum = () => {
    return Math.floor(Math.random() * (Math.floor(254) - Math.ceil(0) + 1))
}

const pieceFillStyling = (useRandom) => {

    if (useRandom) {
        let pieceStyling = {
            shapeSqr: `${getRandNum()},${getRandNum()},${getRandNum()}`,
            shapeS: `${getRandNum()},${getRandNum()},${getRandNum()}`,
            shapeI: `${getRandNum()},${getRandNum()},${getRandNum()}`,
            shapeL: `${getRandNum()},${getRandNum()},${getRandNum()}`,
            shapeCross: `${getRandNum()},${getRandNum()},${getRandNum()}`
        }
        return pieceStyling

    } else {
        let pieceStyling = {
            shapeSqr: '255,191,8',
            shapeS: '0,255,0',
            shapeI: '255,0,0',
            shapeL: '255,90,16',
            shapeCross: '149,0,255'
        }
        return pieceStyling
    }
}

const pieceColorStyling = (useRandom) => {
    if (useRandom) {
        let fillStyle = `${getRandNum()},${getRandNum()},${getRandNum()}`
        return fillStyle

    } else {
        let fillStyle = '4,114,209'
        return fillStyle
    }
}


export { pieceFillStyling, pieceColorStyling }