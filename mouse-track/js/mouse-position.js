function init() {
        var xPos     = 0,
            xPosHtml = document.getElementById("currentXPos"),
            yPos     = 0,
            yPosHtml = document.getElementById("currentYPos");


        function displayCurrentPosition() {
                xPosHtml.innerHTML = xPos;
                yPosHtml.innerHTML = yPos;
        }


        function getCurrentXPosition(event) {
                return event.clientX;
        }


        function getCurrentYPosition(event) {
                return event.clientY;
        }


        function paintAtMouse(event) {
                updateMousePosition(event);
                displayCurrentPosition();
        }


        function updateMousePosition(event) {
                xPos = getCurrentXPosition(event);
                yPos = getCurrentYPosition(event);
        }


        window.addEventListener("mousemove", paintAtMouse, false);
}


window.addEventListener("DOMContentLoaded", init, false);