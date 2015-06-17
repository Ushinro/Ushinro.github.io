//
// AUTHOR: Ushinro
// DATE CREATED:  2015-02-10
// LAST MODIFIED: 2015-02-10
//


"use strict";


const MILLISECONDS_PER_SECOND = 1000,
      MINUTES_PER_HOUR        = 60,
      SECONDS_PER_MINUTE      = 60;

var clicks                = 0,
    clickRateTimer,
    dateObject            = new Date(),
    hours                 = 0,
    minutes               = 0,
    seconds               = 0,
    milliseconds          = 0,
    startTime,
    tickHoursHtml         = document.getElementById("tick-hours"),
    tickMinutesHtml       = document.getElementById("tick-minutes"),
    tickSecondsHtml       = document.getElementById("tick-seconds"),
    // tickMillisecondsHtml = document.getElementById("tickMilliseconds"),
    timer,
    timerRunning          = false,
    timerStarted          = false;


function addClicks(amount) {
        if (clicks <= 0 && amount < 0) {
                return;
        }

        if (!timerRunning && amount > 0) {
                startStopwatch();
        }

        clicks += amount;

        displayClicks();
}

// Calculate click-rate per interval, in seconds (e.g. 14 per 60 seconds, or 14 per minute)
function calculateClicksPerInterval(intervalDuration) {
        var elapsedTime = (Date.now() - startTime) / MILLISECONDS_PER_SECOND;

        return Math.round(clicks / (elapsedTime / intervalDuration));
}

function displayClicks() {
        var clickCountHtml = document.getElementById("click-count");

        clickCountHtml.innerHTML = clicks;

        displayClickRate();
}

function displayClickRate() {
        var clickCountRateHtml = document.getElementById("click-count-rate"),
            timeInterval       = 60;    // In seconds

        clickCountRateHtml.innerHTML = calculateClicksPerInterval(timeInterval)
}

function resetClicks() {
        clicks = 0;

        displayClicks();
}



// Clock Function
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

function pauseStopwatch() {
        if (timerRunning) {
                clearInterval(timer);
                clearInterval(clickRateTimer);
                timerRunning = false;
        }
}

function resetStopwatch() {
        hours   = 0;
        minutes = 0;
        seconds = 0;
        timerStarted = false;

        displayTime();
}

function startPauseStopwatch() {
        if (timerRunning == true) {
                pauseStopwatch();
        } else if (timerRunning == false) {
                startStopwatch();
        }
}

function startStopwatch() {
        if (!timerRunning) {
                if (!timerStarted) {
                        startTime = Date.now();
                        timerStarted = true;
                }
                timer = setInterval("timerTicking()", 1000);
                timerRunning = true;

                clickRateTimer = setInterval(displayClickRate, 1000);
        }
}

function stopStopwatch() {
        pauseStopwatch();
        resetStopwatch();
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