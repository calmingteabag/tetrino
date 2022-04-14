/* 
Module responsible for scoring and level system
*/

const gameLevel = (linesCleaned, DOMLevel) => {
    /* 
    Alright shit is more complicated than I thought
    What I need to do is INCREASE level for each 10 lines

    Checks to be made
    imagine we are on level 3, 32 lines cleaned.

    if lines < (level + 1) * 10, nothing
    if lines == (level + 1) * 10 or bigger than
    we bump level
    */

    console.log(typeof linesCleaned)
    let currLevel = Number(document.getElementById(DOMLevel).innerHTML)

    if (linesCleaned >= (currLevel + 1) * 10) {
        currLevel += 1
    }

    document.getElementById(DOMLevel).innerHTML = currLevel
}

const gameScore = (cleanedRows, DOMScore, DOMRow, DOMLevel) => {

    const scoreSystem = {
        '1': 1000,
        '2': 2000,
        '3': 4000,
        '4': 10000,
    }

    if (cleanedRows != 0) {
        let currentScore = scoreSystem[cleanedRows]
        let getScore = Number(document.getElementById(DOMScore).innerHTML)
        let getLines = Number(document.getElementById(DOMRow).innerHTML)



        getScore += currentScore
        getLines += cleanedRows

        document.getElementById(DOMScore).innerHTML = getScore
        document.getElementById(DOMRow).innerHTML = getLines

        gameLevel(getLines, DOMLevel)
    }
}

export { gameScore }