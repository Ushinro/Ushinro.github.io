'use strict';

var httpRequest;

function changeAttendanceId(attendanceId) {
	var attendanceIdField = document.getElementById('edit-notes-id');

	attendanceIdField.value = attendanceId;
}

function getNotes(attendanceId) {
	var url = '_includes/get_notes.php';

	getHttpRequestObject();

	httpRequest.onreadystatechange = populateNotesForm;

	httpRequest.open('POST', url);
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	httpRequest.send('attendance_id=' + encodeURIComponent(attendanceId);
}

function populateNotesForm() {
	if (httpRequest.readyState === 4) {
		// Everything is good, the response is received
		if (httpRequest.status === 200) {
			// Perfect!
			var response = JSON.parse(httpRequest.responseText),
				notesField = document.getElementById('edit-notes');

				notesField.value = response['notes'];
		} else {
			// There was a problem with the request,
			// for example the response may contain a 404 (Not Found)
			// or 500 (Internal Server Error) response code
			alert('There was a problem with the request.');
		}
	}
}

function refreshAttendance() {
	var visualFeedbackHtml = document.getElementById('visual-feedback'),
		svgData = '<svg id='attendance-card' class='swipe_animation' xmlns='http://www.w3.org/2000/svg' viewBox='0 183.106 1000 679.466'><defs><style type='text/css'>    .swipe_animation {        animation-name                    : swipe_animation;        -webkit-animation-name            : swipe_animation;        animation-duration                : 2s;        -webkit-animation-duration        : 2s;        animation-iteration-count         : infinite;        -webkit-animation-iteration-count : infinite;        animation-direction               : alternate;        -webkit-animation-direction       : alternate;    }@-webkit-keyframes swipe_animation {        0% {            -webkit-transform : translateX(50px);            transform         : translateX(50px);        }100% {            -webkit-transform : translateX(-50px);            transform         : translateX(-50px);        }    }@keyframes swipe_animation {      0% {        -webkit-transform : translateX(50px);        transform         : translateX(50px);      }100% {        -webkit-transform : translateX(-50px);        transform         : translateX(-50px);      }    }</style></defs><path fill='#4C4C4C' d='M984.7,709.1H15.3v82.5c0,33.1,26.9,60,60,60h849.4c33.1,0,60-26.9,60-60V709.1z'/><path fill='#4C4C4C' d='M984.7,255.6c0-33.101-26.9-60-60-60H75.3c-33.1,0-60,26.899-60,60v343.399h969.4V255.6z'/></svg>';

	visualFeedbackHtml.innerHTML = '<p>Swipe your DragonCard to sign in.</p>' + svgData;
}

function updateExcused(excusedCheckbox, attendanceId) {
	var excused = excusedCheckbox.checked ? 1 : 0,
		url = '_includes/process_attendance.php';
	
	getHttpRequestObject();

	httpRequest.open('POST', url);
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	httpRequest.send('excused=' + encodeURIComponent(excused) +
					'&attendance_id=' + encodeURIComponent(attendanceId));
}

function updateStatus(statusField, attendanceId) {
	var url = '_includes/process_attendance.php';

	getHttpRequestObject();

	httpRequest.open('POST', url);
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	httpRequest.send('status=' + encodeURIComponent(statusField.value) +
					'&attendance_id=' + encodeURIComponent(attendanceId));
}

function getHttpRequestObject() {
	if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
		httpRequest = new XMLHttpRequest();
	} else if (window.ActiveXObject) { // IE 6 and older
		try {
			httpRequest = new ActiveXObject('Msxml2.XMLHTTP');
		} 
		catch (e) {
			try {
				httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
			} 
			catch (e) {}
		}
	}

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
}