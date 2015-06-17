//
// AUTHOR: Ushinro
// DATE CREATED:  2015-18-18
// LAST MODIFIED: 2015-02-18
//


"use strict";


var colorCodeFormatField = document.getElementById("color-code-format-field"),
    colorCodeField       = document.getElementById("color-code-field");

// Standardize every load/reload
colorCodeFormatField.selectedIndex = 0;         // Reset the dropdown to the placeholder state
colorCodeField.value = "";                      // Reset the color code field on every load

const   // RED
	CHESTNUT_ROSE_HEX          = "#d24d57",
	CINNABAR_HEX               = "#e74c3c",
	FLAMINGO_HEX               = "#ef4836",
	MONZA_HEX                  = "#cf000f",
	OLD_BRICK_HEX              = "#d24d57",
	POMEGRANATE_HEX            = "#f22613",
	TALL_POPPY_HEX             = "#c0392b",
	THUNDERBIRD_HEX            = "#d91e18",
	VALENCIA_HEX               = "#d64541",
	// PINK
	CABARET_HEX                = "#d2527f",
	NEW_YORK_PINK_HEX          = "#e08283",
	RADICAL_RED_HEX            = "#f62459",
	RAZZMATAZZ_HEX             = "#db0a5b",
	SUNGLO_HEX                 = "#e26a6a",
	SUNSET_ORANGE_HEX          = "#f64747",
	WAX_FLOWER_HEX             = "#f1a9a0",
	// PURPLE
	HONEY_FLOWER_HEX           = "#674172",
	LIGHT_WISTERIA_HEX         = "#be90d4",
	MEDIUM_PURPLE_HEX          = "#bf55ec",
	PLUM_HEX                   = "#913d88",
	REBECCAPURPLE_HEX          = "#663399",
	SEANCE_HEX                 = "#9a12b3",
	SNUFF_HEX                  = "#dcc6e0",
	STUDIO_HEX                 = "#8e44ad",
	WISTERIA_HEX               = "#9b59b6",
	WISTFUL_HEX                = "#aea8d3",
	// BLUE
	ALICE_BLUE_HEX             = "#e4f1fe",
	CHAMBRAY_HEX               = "#3a539b",
	CURIOUS_BLUE_HEX           = "#3498db",
	CURIOUS_BLUE_2_HEX         = "#1e8bc3",
	DODGER_BLUE_HEX            = "#19b5fe",
	EBONY_CLAY_HEX             = "#22313f",
	FOUNTAIN_BLUE_HEX          = "#5c97bf",
	HOKI_HEX                   = "#67809f",
	HUMMING_BIRD_HEX           = "#c5eff7",
	JACKSONS_PURPLE_HEX        = "#1f3a93",
	JELLY_BEAN_HEX             = "#2574a9",
	JORDY_BLUE_HEX             = "#89c4f4",
	MADISON_HEX                = "#2c3e50",
	MALIBU_HEX                 = "#6bb9f0",
	MING_HEX                   = "#336e7b",
	PICKLED_BLUEWOOD_HEX       = "#34495e",
	PICTON_BLUE_HEX            = "#59abe3",
	PICTON_BLUE_2_HEX          = "#22a7f0",
	ROYAL_BLUE_HEX             = "#4183d7",
	SAN_MARINO_HEX             = "#446cb3",
	SHAKESPEARE_HEX            = "#52b3d9",
	SPRAY_HEX                  = "#81cfe0",
	STEEL_BLUE_HEX             = "#4b77be",
	// GREEN
	AQUA_ISLAND_HEX            = "#a2ded0",
	CARIBBEAN_GREEN_HEX        = "#03c9a9",
	DARK_SEA_GREEN_HEX         = "#90c695",
	DOWNY_HEX                  = "#65c5bb",
	EMERALD_HEX                = "#3fc380",
	EUCALYPTUS_HEX             = "#26a65b",
	FREE_SPEECH_AQUAMARINE_HEX = "#03a678",
	GREEN_HAZE_HEX             = "#019875",
	GOSSIP_HEX                 = "#87d37c",
	JADE_HEX                   = "#00b16a",
	JUNGLE_GREEN_HEX           = "#26c281",
	LIGHT_SEA_GREEN_HEX        = "#1ba39c",
	MADANG_HEX                 = "#c8f7c5",
	MEDIUM_AQUAMARINE_HEX      = "#66cc99",
	MEDIUM_TURQUOISE_HEX       = "#4ecdc4",
	MOUNTAIN_MEADOW_HEX        = "#1bbc9b",
	MOUNTAIN_MEADOW_2_HEX      = "#16a085",
	NIAGARA_HEX                = "#2abb9b",
	OBSERVATORY_HEX            = "#00b16a",
	OCEAN_GREEN_HEX            = "#4daf7c",
	RIPTIDE_HEX                = "#86e2d5",
	SALEM_HEX                  = "#1e824c",
	SHAMROCK_HEX               = "#2ecc71",
	SILVER_TREE_HEX            = "#68c3a3",
	TURQUOISE_HEX              = "#36d7b7",
	// YELLOW
	CREAM_CAN_HEX              = "#f5d76e",
	RIPE_LEMON_HEX             = "#f7ca18",
	SAFFRON_HEX                = "#f4d03f",
	// ORANGE
	BURNT_ORANGE_HEX           = "#d35400",
	BUTTERCUP_HEX              = "#f38c12",
	CALIFORNIA_HEX             = "#f89406",
	CAPE_HONEY_HEX             = "#fde3a7",
	CASABLANCA_HEX             = "#f4b350",
	CRUSTA_HEX                 = "#f2784b",
	ECSTASY_HEX                = "#f9690e",
	FIRE_BUSH_HEX              = "#eb9532",
	JAFFA_HEX                  = "#db974e",
	JAFFA_2_HEX                = "#f27935",
	LIGHTNING_YELLOW_HEX       = "#f5ab35",
	SANDSTORM_HEX              = "#f9bf3b",
	TAHITI_GOLD_HEX            = "#e87e04",
	ZEST_HEX                   = "#e67e22",
	// GRAY
	CARARRA_HEX                = "#f2f1ef",
	CASCADE_HEX                = "#95a5a6",
	EDWARD_HEX                 = "#abb7b7",
	GALLERY_HEX                = "#eeeeee",
	IRON_HEX                   = "#dadfe1",
	LYNCH_HEX                  = "#6c7a89",
	PORCELAIN_HEX              = "#ecf0f1",
	PUMICE_HEX                 = "#d2d7d3",
	SILVER_HEX                 = "#bfbfbf",
	SILVER_SAND_HEX            = "#bdc3c7",
	WHITE_SMOKE_HEX            = "#ececec";

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