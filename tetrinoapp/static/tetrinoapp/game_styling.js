const getRandNum = () => {
    return Math.floor(Math.random() * (Math.floor(254) - Math.ceil(0) + 1))
}

const pieceStyling = (useRandom) => {
    // should return something
    if (useRandom) {
        let styling = {
            shapeSqr: `${getRandNum()},${getRandNum()},${getRandNum()}`,
            shapeS: `${getRandNum()},${getRandNum()},${getRandNum()}`,
            shapeI: `${getRandNum()},${getRandNum()},${getRandNum()}`,
            shapeL: `${getRandNum()},${getRandNum()},${getRandNum()}`,
            shapeCross: `${getRandNum()},${getRandNum()},${getRandNum()}`
        }
        return styling

    } else {
        let styling = {
            shapeSqr: `${getRandNum()},${getRandNum()},${getRandNum()}`,
            shapeS: `${getRandNum()},${getRandNum()},${getRandNum()}`,
            shapeI: `${getRandNum()},${getRandNum()},${getRandNum()}`,
            shapeL: `${getRandNum()},${getRandNum()},${getRandNum()}`,
            shapeCross: `${getRandNum()},${getRandNum()},${getRandNum()}`
        }
        return styling
    }

}

export { pieceStyling }