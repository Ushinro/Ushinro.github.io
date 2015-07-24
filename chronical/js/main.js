//
// AUTHOR: Ushinro
// DATE CREATED:  2015-07-24
// LAST MODIFIED: 2015-07-24
//


"use strict";


var $ = function (string) {
	var identifier = string.substring(0, 1),
		elementName = string.substring(1);

	switch(identifier) {
		case '#':
			return document.getElementById(elementName);
			break;
		case '.':
			return document.getElementsByClassName(elementName);
			break;
	}
}

var Event = {
	HOURS_PER_DAY      : 24,
	MINUTES_PER_HOUR   : 60,
	SECONDS_PER_MINUTE : 60,


	// init : function () {
	// 	var field = $('#datetime');

	// 	field.value = new Date();
	// },

	adjustDate : function (dateAdjustment, unit) {
		var field;

		switch(unit) {
			case 'd':
				field = $('#day');
				break;
			case 'm':
				field = $('#month');
				break;
			case 'y':
				field = $('#year');
				break;
		}
	},

	adjustTime : function (timeAdjustment, unit) {
		var field = $('#datetime'),
			newTime = field.value;

		if (newTime == null || newTime == "") {
			newTime = new Date('00:00');
			console.log(newTime);
		}
	},
}

// window.addEventListener("DOMContentLoaded", Event.init, false);