//
// AUTHOR: Ushinro
// DATE CREATED:  2014-12-14
// LAST MODIFIED: 2014-12-25
//


"use strict";


// HTML Elements
var currentTimeHtml = document.getElementById("current-time"),
    bodyHtml        = document.body,
    timeHexCodeHtml = document.getElementById("time-hex-code");


// Constants
const HOURS_PER_DAY      = 24,
      MINUTES_PER_HOUR   = 60,
      SECONDS_PER_MINUTE = 60;


// Script Vars
var localCurrentDate,
    localCurrentHours,
    localCurrentMinutes,
    localCurrentSeconds,
    localTimezone,
    localCurrentTimeString,
    timeHexCode;


function displayClock(localCurrentTimeString) {
	currentTimeHtml.innerHTML = localCurrentTimeString;
}


// Update the values of the different time elements (Hours, Minutes, Seconds)
// Then, update the string that
function updateClock() {
	localCurrentDate    = new Date();
	localCurrentHours   = localCurrentDate.getHours();
	localCurrentMinutes = localCurrentDate.getMinutes();
	localCurrentSeconds = localCurrentDate.getSeconds(),
	localTimezone       = localCurrentDate.getTimezoneOffset() / MINUTES_PER_HOUR;

	// Prefix all of the time elements with 0 if less than 10
	if (localCurrentHours < 10) {
		localCurrentHours = "0" + localCurrentHours;
	}
	if (localCurrentMinutes < 10) {
		localCurrentMinutes = "0" + localCurrentMinutes;
	}
	if (localCurrentSeconds < 10) {
		localCurrentSeconds = "0" + localCurrentSeconds;
	}

	if (localTimezone > 0 && localTimezone < 10) {
		localTimezone = "-0" + localTimezone;
	} else if (localTimezone > -10 && localTimezone <= 0) {
		localTimezone = "0" + localTimezone;
	}
	
	// Always add a '00' suffix
	localTimezone = localTimezone + "00";

	localCurrentTimeString = localCurrentHours +
				 " : " + localCurrentMinutes +
				 " : " + localCurrentSeconds +
				 " (UTC " + localTimezone + ")";

	displayClock(localCurrentTimeString);
}


function updateHexCodeDisplay() {
	timeHexCode               = rgbToHex(localCurrentHours, localCurrentMinutes, localCurrentSeconds)
	timeHexCodeHtml.innerHTML = ("#" + timeHexCode).toUpperCase();
}


function changeBackgroundColor() {
	bodyHtml.style.background = "#" + timeHexCode;
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


// Update the clock's display every second after the page has loaded.
window.onload = function() {
	updateClock();
	updateHexCodeDisplay();
	changeBackgroundColor();
	setInterval('updateClock()', 1000);
	setInterval('updateHexCodeDisplay()', 1000);
	setInterval('changeBackgroundColor()', 1000);
}