//
// AUTHOR: Ushinro
// DATE CREATED:  2014-11-18
// LAST MODIFIED: 2015-02-10
//


"use strict";


var colorCodeFormatField = document.getElementById("color-code-format-field"),
    colorCodeField       = document.getElementById("color-code-field");

// Standardize every load/reload
colorCodeFormatField.selectedIndex = 0;         // Reset the dropdown to the placeholder state
colorCodeField.value = "";                      // Reset the color code field on every load

// CONSTANTS (DO NOT CHANGE)
const TURQUOISE_HEX       = "1abc9c",
      GREEN_SEA_HEX       = "16a085",
      EMERALD_HEX         = "2ecc71",
      NEPHRITIS_HEX       = "27ae60",
      PETER_RIVER_HEX     = "3498db",
      BELIZE_HOLE_HEX     = "2980b9",
      AMETHYST_HEX        = "9b59b6",
      WISTERIA_HEX        = "8e44ad",
      WET_ASPHALT_HEX     = "34495e",
      MIDNIGHT_BLUE_HEX   = "2c3e50",
      SUN_FLOWER_HEX      = "f1c40f",
      ORANGE_HEX          = "f39c12",
      CARROT_HEX          = "e67e22",
      PUMPKIN_HEX         = "d35400",
      ALIZARIN_HEX        = "e74c3c",
      POMEGRANATE_HEX     = "c0392b",
      CLOUDS_HEX          = "ecf0f1",
      SILVER_HEX          = "bdc3c7",
      CONCRETE_HEX        = "95a5a6",
      ASBESTOS_HEX        = "7f8c8d";

var selectedOption,
    lastFormat = "#000",
    rgbObj,
    colorCodeText;

var timeOut;

// Smooth scroll to top of page
function scrollToTop() {
        // If window is not at the top, then scroll up until it is.
        if (document.body.scrollTop != 0 || document.documentElement.scrollTop != 0) {
                window.scrollBy(0, -100);
                timeOut = setTimeout('scrollToTop()', 10);
        } else {
                clearTimeout(timeOut);
        }
}



function copyColor(color) {
        selectedOption = colorCodeFormatField.options[colorCodeFormatField.selectedIndex].value;

        // Change the color code format according to the selected option
        // If the dropdown is not changed, default to "#000" format
        if (selectedOption === "#000") {
                colorCodeText = "#" + color;
        } else if (selectedOption === "000") {
                colorCodeText = color;
        } else if (selectedOption === "rgb") {
                rgbObj = hexToRgb(color);
                colorCodeText = "rgb(" + rgbObj.r + ", " + rgbObj.g + ", " + rgbObj.b + ")";
        } else if (selectedOption === "rgba") {
                rgbObj = hexToRgb(color);
                colorCodeText = "rgba(" + rgbObj.r + ", " + rgbObj.g + ", " + rgbObj.b + ", 1)";
        } else {
                colorCodeText = "#" + color;
                colorCodeFormatField.selectedIndex = 1;
                selectedOption = colorCodeFormatField.options[colorCodeFormatField.selectedIndex].value;
                lastFormat = selectedOption;
        }

        displayColorCode(colorCodeText);

        scrollToTop();

        selectColorCodeField();
}


function convertCurrentColorCode() {
        selectedOption = colorCodeFormatField.options[colorCodeFormatField.selectedIndex].value;

        // Change the color code format according to the selected option
        // If page just loaded, don't do anything if there is a change to the dropdown
        if (colorCodeField.value === "") {
                lastFormat = selectedOption;
                return;
        } else if (selectedOption === "#000") {
                if (lastFormat === "rgb" || lastFormat === "rgba") {
                        colorCodeText = rgbToHex(rgbObj.r, rgbObj.g, rgbObj.b);
                }

                colorCodeText = "#" + colorCodeText;
                lastFormat = selectedOption;
        } else if (selectedOption === "000") {
                if (lastFormat === "#000") {
                        colorCodeText = colorCodeText.substring(1);
                } else if (lastFormat === "rgb" || lastFormat === "rgba") {
                        colorCodeText = rgbToHex(rgbObj.r, rgbObj.g, rgbObj.b);
                }

                lastFormat = selectedOption;
        } else if (selectedOption === "rgb") {
                if (lastFormat === "#000") {
                        rgbObj = hexToRgb(colorCodeText.substring(1));
                } else if (lastFormat === "000") {
                        rgbObj = hexToRgb(colorCodeText);
                }

                lastFormat = selectedOption;
                colorCodeText = "rgb(" + rgbObj.r + ", " + rgbObj.g + ", " + rgbObj.b + ")";
        } else if (selectedOption === "rgba") {
                if (lastFormat === "#000") {
                        rgbObj = hexToRgb(colorCodeText.substring(1));
                } else if (lastFormat === "000") {
                        rgbObj = hexToRgb(colorCodeText);
                }

                lastFormat = selectedOption;
                colorCodeText = "rgba(" + rgbObj.r + ", " + rgbObj.g + ", " + rgbObj.b + ", 1)";
        }

        displayColorCode(colorCodeText);

        selectColorCodeField();
}


// Update the color code display in a function so that the output is uniform
// In this case, the output has any letters in upper case.
function displayColorCode(colorCode) {
        // Populate the text field with the color code for the user to copy
        colorCodeField.value = colorCodeText.toUpperCase();
}


function hexToRgb(hexCode) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hexCode = hexCode.replace(shorthandRegex, function(red, green, blue) {
                return red + red + green + green + blue + blue;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexCode);
        return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
        } : null;
}


function componentToHex(component) {
        var hex = component.toString(16);

        // If only 1 character in length, prefix it with '0' before returning,
        // otherwise, simply return it
        return hex.length == 1 ? "0" + hex : hex;
}


function rgbToHex(red, green, blue) {
        return componentToHex(red) + componentToHex(green) + componentToHex(blue);
}


// Rather than copy-and-paste the two lines of code,
// execute the function with just one line.
function selectColorCodeField() {
        // Focus on text field and select all text in it
        // User will need to Ctrl/Cmd+C to copy unfortunately
        colorCodeField.focus();
        colorCodeField.select();
}