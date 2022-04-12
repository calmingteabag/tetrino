const gameScore = (cleanedRows, DOMScore, DOMRow) => {

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
        console.log(getScore)

        document.getElementById(DOMScore).innerHTML = getScore
        document.getElementById(DOMRow).innerHTML = getLines
    }
}

export { gameScore }