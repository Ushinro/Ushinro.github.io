//
// AUTHOR: Ushinro
// DATE CREATED:  2015-02-08
// LAST MODIFIED: 2015-02-08
//


"use strict";


function StopWatch() {
        var startTime = null,
            stopTime  = null,
            running   = false;

        this.duration = function () {
                if (startTime === null || stopTime == null) {
                        return "Undefined";
                } else {
                        return (stopTime - startTime) / 1000;
                }
        }

        this.start = function () {
                if (running === true) {
                        return;
                } else if (startTime !== null) {
                        stopTime = null;
                }

                running = true;
                startTime = getTime();
        }

        this.stop = function () {
                if (running === false) {
                        return;
                }

                stopTime = getTime();
                running = false;
        }
}

function getTime() {
        var day = new Date();

        return day.getTime();
}