
const toggleInfo = (domToggle) => {
    let isVisible = document.getElementById(domToggle).style.visibility

    if (isVisible == 'hidden') {
        document.getElementById(domToggle).style.visibility = 'visible'
    } else {
        document.getElementById(domToggle).style.visibility = 'hidden'
    }
}

function showInfoListener(domListener, domToggle) {
    let toggle = document.getElementById(domListener)
    console.log(toggle)
    toggle.addEventListener("click", function () { toggleInfo(domToggle) }, false)
}

export { toggleInfo, showInfoListener }