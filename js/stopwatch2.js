//
// AUTHOR: Ushinro
// DATE CREATED:  2015-02-09
// LAST MODIFIED: 2015-02-09
//


"use strict";


const MILLISECONDS_PER_SECOND = 1000,
      MINUTES_PER_HOUR        = 60,
      SECONDS_PER_MINUTE      = 60;

var currentTime           = 0,
    date                  = new Date(),
    diff                  = 0,
    elapsed               = "0.0",
    hours                 = 0,
    minutes               = 0,
    seconds               = 0,
    milliseconds          = 0,
    running               = false,
    startTime,
    tickHoursHtml         = document.getElementById("tickHours"),
    tickMinutesHtml       = document.getElementById("tickMinutes"),
    tickSecondsHtml       = document.getElementById("tickSeconds"),
    tickMillisecondsHtml = document.getElementById("tickMilliseconds"),
    timer;

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

function pauseStopwatch() {
        if (running) {
                clearInterval(timer);
                running = false;
        }
}

function resetStopwatch() {
        if (!running) {
                hours   = 0;
                minutes = 0;
                seconds = 0;
                milliseconds = 0;
                diff = 0;
        
                displayTime();
        }
}

function startPauseStopwatch() {
        if (running === true) {
                pauseStopwatch();
        } else if (running === false) {
                startStopwatch();
        }
}

function startStopwatch() {
        if (!running) {
                startTime = date.getTime();
                // timer = setInterval(timerTicking, 1);
                timerTicking();
                running = true;
        }
}

function stopStopwatch() {
        pauseStopwatch();
        resetStopwatch();
}

function timerTicking() {
        currentTime += 100;

        elapsed = Math.floor(currentTime / 100) / 10;

        if (Math.round(elapsed) === elapsed) {
                elapsed += ".0";
        }

        // seconds += 1;
        milliseconds = elapsed * 1000;

        if (milliseconds >= MILLISECONDS_PER_SECOND) {
                seconds      = Math.floor(milliseconds / MILLISECONDS_PER_SECOND);
                milliseconds = milliseconds % MILLISECONDS_PER_SECOND;
        }

        if (seconds >= SECONDS_PER_MINUTE) {
                minutes  = Math.floor(seconds / SECONDS_PER_MINUTE);
                seconds  = seconds % SECONDS_PER_MINUTE;
        }

        if (minutes >= MINUTES_PER_HOUR) {
                hours   = Math.floor(minutes / MINUTES_PER_HOUR);
                minutes = minutes % MINUTES_PER_HOUR;
        }

        displayTime();

        diff = (new Date().getTime() - startTime) - currentTime;
        clearInterval(timer);
        timer = setInterval(timerTicking, (1 - diff));
}