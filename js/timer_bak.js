//
// AUTHOR: Ushinro
// DATE CREATED:  2015-02-08
// LAST MODIFIED: 2015-02-09
//


"use strict";


const MILLISECONDS_PER_SECOND = 1000,
      MINUTES_PER_HOUR        = 60,
      SECONDS_PER_MINUTE      = 60;

var hours                 = 0,
    minutes               = 0,
    seconds               = 0,
    milliseconds          = 0,
    tickHoursHtml         = document.getElementById("tick-hours"),
    tickMinutesHtml       = document.getElementById("tick-minutes"),
    tickSecondsHtml       = document.getElementById("tick-seconds"),
    // tickMillisecondsHtml = document.getElementById("tick-milliseconds"),
    timer,
    timerRunning          = false;

function displayTime() {
        var hoursString,
            minutesString,
            secondsString;

        if (seconds < 10) {
                secondsString = "0" + seconds;
        } else {
                secondsString = seconds;
        }

        if (minutes < 10) {
                minutesString = "0" + minutes;
        } else {
                minutesString = minutes;
        }

        if (hours < 10) {
                hoursString = "0" + hours;
        } else {
                hoursString = hours;
        }

        tickHoursHtml.innerHTML        = hoursString;
        tickMinutesHtml.innerHTML      = minutesString;
        tickSecondsHtml.innerHTML      = secondsString;
        // tickMillisecondsHtml.innerHTML = milliseconds;
}

function pauseTimer() {
        if (timerRunning) {
                clearInterval(timer);
                timerRunning = false;
        }
}

function resetTimer() {
        hours   = 0;
        minutes = 0;
        seconds = 0;

        displayTime();
}

function startPauseTimer() {
        if (timerRunning == true) {
                pauseTimer();
        } else if (timerRunning == false) {
                startTimer();
        }
}

function startTimer() {
        if (!timerRunning) {
                timer = setInterval("timerTicking()", 1000);
                timerRunning = true;
        }
}

function stopTimer() {
        pauseTimer();
        resetTimer();
}

function timerTicking() {
        seconds += 1;

        if (milliseconds >= MILLISECONDS_PER_SECOND) {
                seconds     += milliseconds / MILLISECONDS_PER_SECOND;
                milliseconds = milliseconds % MILLISECONDS_PER_SECOND;
        }

        if (seconds >= SECONDS_PER_MINUTE) {
                minutes += seconds / SECONDS_PER_MINUTE;
                seconds  = seconds % SECONDS_PER_MINUTE;
        }

        if (minutes >= MINUTES_PER_HOUR) {
                hours  += minutes / MINUTES_PER_HOUR;
                minutes = minutes % MINUTES_PER_HOUR;
        }

        displayTime();
}