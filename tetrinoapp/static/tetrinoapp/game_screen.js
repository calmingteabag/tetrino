/* 
This module handles the issue of having fixed canvas size on different screen
sizes, which makes it look ugly depending on where it's being ran.
*/

const screenSizeReader = () => {

    let size = {
        height: window.innerHeight,
        width: window.innerWidth
    }
    return size
}

const canvasSizeSet = (canvasName) => {
    /* 
    Sets canvas size based on current screen size AT the
    moment of loading.
    */
    let screenSize = screenSizeReader()
    console.log(screenSize.width, screenSize.height)
    /* 
    Assuming widescreen, browser view size:

    1512 x 765 for my firefox
    1691 x 899 for my chrome 
    
    */

    if (screenSize.width > screenSize.height) {
        let targetWidth = Math.floor(screenSize.width / 4)
        let targetHeight = targetWidth * 2
        document.getElementById(canvasName).setAttribute("height", targetHeight)
        document.getElementById(canvasName).setAttribute("width", targetWidth)

    } else if (screenSize.width < screenSize.height) {
        console.log("vertical screen")
    }
}

export { canvasSizeSet }