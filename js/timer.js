//
// AUTHOR: Ushinro
// DATE CREATED:  2015-02-08
// LAST MODIFIED: 2015-02-09
//


"use strict";


const MILLISECONDS_PER_SECOND = 1000,
      MINUTES_PER_HOUR        = 60,
      SECONDS_PER_MINUTE      = 60;

var cancelRAF             = window.cancelAnimationFrame ||
                            window.mozCancelAnimationFrame ||
                            window.webkitCancelAnimationFrame,
    hours                 = 0,
    minutes               = 0,
    seconds               = 0,
    milliseconds          = 0,
    requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame,
    tickHoursHtml         = document.getElementById("tick-hours"),
    tickMinutesHtml       = document.getElementById("tick-minutes"),
    tickSecondsHtml       = document.getElementById("tick-seconds"),
    tickMillisecondsHtml  = document.getElementById("tick-milliseconds"),
    timer,
    timerRunning          = false;

function displayTime() {
        var hoursString,
            minutesString,
            secondsString,
            millisecondsString;

        if (milliseconds < 10) {
                millisecondsString = "00" + milliseconds;
        } else if (milliseconds < 100) {
                millisecondsString = "0" + milliseconds;
        } else {
                millisecondsString = milliseconds;
        }

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
        tickMillisecondsHtml.innerHTML = millisecondsString;
}

function pauseTimer() {
        if (timerRunning) {
                cancelRAF(timer);
                timerRunning = false;
        }
}

function resetTimer() {
        hours        = 0;
        minutes      = 0;
        seconds      = 0;
        milliseconds = 0;

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
                timerTicking();
                timerRunning = true;
        }
}

function stopTimer() {
        pauseTimer();
        resetTimer();
}

function timerTicking() {
        milliseconds += Math.floor(MILLISECONDS_PER_SECOND / 60);

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

        seconds = Math.floor(seconds);
        minutes = Math.floor(minutes);
        hours   = Math.floor(hours);

        displayTime();

        timer = requestAnimationFrame(timerTicking)
}