/* 
Module responsible for scoring and level system
*/

const gameLevel = (linesCleaned, DOMLevel) => {

    let currLevel = Number(document.getElementById(DOMLevel).innerHTML)
    console.log(currLevel)
    if (linesCleaned >= (currLevel * 10)) {
        currLevel += 1
        document.getElementById(DOMLevel).innerHTML = currLevel
    }
    console.log(currLevel)
}

const gameScore = (cleanedRows, scoreDOMId, lineDOMId, levelDOMId) => {

    const scoreSystem = {
        '1': 1000,
        '2': 2000,
        '3': 4000,
        '4': 10000,
    }

    if (cleanedRows != 0) {
        let currentScore = scoreSystem[cleanedRows]
        let getScore = Number(document.getElementById(scoreDOMId).innerHTML)
        let getLines = Number(document.getElementById(lineDOMId).innerHTML)
        let getLevel = Number(document.getElementById(levelDOMId).innerHTML)

        getScore += currentScore * getLevel
        getLines += cleanedRows

        document.getElementById(scoreDOMId).innerHTML = getScore
        document.getElementById(lineDOMId).innerHTML = getLines

        gameLevel(getLines, levelDOMId)
    }
}

export { gameScore }