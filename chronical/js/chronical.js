//
// AUTHOR: Ushinro
// DATE CREATED:  2014-11-18
// LAST MODIFIED: 2014-12-27
//


"use strict";


// Constants
const HOURS_PER_DAY      = 24,
      MINUTES_PER_HOUR   = 60,
      SECONDS_PER_MINUTE = 60;



function init() {
            // HTML Elements
        var currentTimeHtml    = document.getElementById("currentTime"),
            eventsListHtml     = document.getElementById("eventsList"),
            eventDateHtml      = document.getElementById("eventDate"),
            eventNameHtml      = document.getElementById("eventName"),
            eventTimeHtml      = document.getElementById("eventTime"),
            timezoneOffsetHtml = document.getElementById("timezoneOffset"),
            // Script Vars
            events,
            localCurrentDate,
            localCurrentHours,
            localCurrentHoursString,
            localCurrentMinutes,
            localCurrentMinutesString,
            localCurrentSeconds,
            localCurrentSecondsString,
            localTimezoneOffset,
            localTimezoneOffsetString,
            localCurrentTimeString,

            Event = function () {
                    var date = null,
                        name = "",
                        time = null;

                    function init(name, date, time) {
                            this.date = date;
                            this.name = name;
                            this.time = time;
                    }

                    function setDate(date) {
                            this.date = date;
                    }

                    function setName(name) {
                            this.name = name;
                    }

                    function setTime(time) {
                            this.time = time;
                    }

                    return {
                            init    : init,
                            setDate : setDate,
                            setName : setName,
                            setTime : setTime
                    }
            };


        function alertNoStorage() {
                alert("This device does not support HTML5 storage.");
        } // END alertNoStorage


        function displayClock(localCurrentTimeString, localTimezoneOffsetString) {
                currentTimeHtml.innerHTML = localCurrentTimeString;

                timezoneOffsetHtml.innerHTML = localTimezoneOffsetString;
        } // END displayClock


        function editEvent(index) {
                Event = loadEvent(index);
                
                eventDateHtml.value = Event["date"];
                eventNameHtml.value = Event["name"];
                eventTimeHtml.value = Event["time"];
        } // END editEvent


        function isEventInformationProvided() {
                if (eventDateHtml.value.trim().length > 0 &&
                    eventNameHtml.value.trim().length > 0 &&
                    eventTimeHtml.value.trim().length > 0) {
                        return true;
                } else {
                        return false;
                }
        } // END isEventInformationProvided


        function isStorageAvailable() {
                if (typeof(Storage) === "undefined") {
                        return false;
                } else {
                        return true;
                }
        } // END isStorageAvailable


        function listEvents() {
                var eventsLength = events.length,
                    htmlString = "";
                
                for (var i = 0; i < eventsLength; i++) {
                        htmlString += "<td>" + 
                                      "<tr>" + events[i]["name"] + "</tr>" +
                                      "<tr>" + events[i]["date"] + "</tr>" +
                                      "<tr>" + events[i]["time"] + "</tr>" +
                                      "<tr><button>Edit</button></tr>" +
                                      "<tr><button onclick='deleteEvent(" + i + ");'>Delete</button></tr>" +
                                      "</td>";
                }
                
                eventsListHtml += htmlString;
        } // END listEvents


        function loadEvent(index) {
                return events[index];
        } // END loadEvent


        function loadEvents() {
                if (isStorageAvailable()) {
                        events = localStorage["events"];
                        
                        if (typeof(events) === "undefined") {
                                events = [];
                        }
                } else {
                        alertNoStorage();
                }
        } // END loadEvents


        function reloadPage(reloadFromServer) {
                window.location.reload(reloadFromServer);
        } // END reloadPage
         

        function saveEvent() {
                if (isStorageAvailable()) {
                        if (isEventInformationProvided()) {
                                Event["date"] = eventDateHtml.value;
                                Event["name"] = eventNameHtml.value;
                                Event["time"] = eventTimeHtml.value;
                                
                                if (sessionStorage.newEvent === "true") {
                                        events.push(Event);
                                }
                                
                                localStorage["events"] = events;
                        }
                } else {
                        alertNoStorage();
                }
        } // END saveEvent


        // Update the values of the different time elements (Hours, Minutes, Seconds)
        // Then, update the string that
        function updateClock() {
                localCurrentDate    = new Date();
                localCurrentHours   = localCurrentDate.getHours();
                localCurrentMinutes = localCurrentDate.getMinutes();
                localCurrentSeconds = localCurrentDate.getSeconds(),
                localTimezoneOffset = localCurrentDate.getTimezoneOffset() / MINUTES_PER_HOUR;


                // Prefix all of the time elements with 0 if less than 10
                if (localCurrentHours < 10) {
                        localCurrentHoursString = "0" + localCurrentHours;
                } else {
                        localCurrentHoursString = localCurrentHours;
                }

                if (localCurrentMinutes < 10) {
                        localCurrentMinutesString = "0" + localCurrentMinutes;
                } else {
                        localCurrentMinutesString = localCurrentMinutes;
                }

                if (localCurrentSeconds < 10) {
                        localCurrentSecondsString = "0" + localCurrentSeconds;
                } else {
                        localCurrentSecondsString = localCurrentSeconds;
                }
                

                if (localTimezoneOffset > 0 && localTimezoneOffset < 10) {
                        localTimezoneOffsetString = "-0" + localTimezoneOffset;
                } else if (localTimezoneOffset > -10 && localTimezoneOffset <= 0) {
                        localTimezoneOffsetString = "0" + localTimezoneOffset;
                }


                // Always add a '00' suffix
                localTimezoneOffsetString = " (UTC " + localTimezoneOffsetString + "00)";

                localCurrentTimeString = localCurrentHoursString +
                                         " : " + localCurrentMinutesString +
                                         " : " + localCurrentSecondsString;


                displayClock(localCurrentTimeString, localTimezoneOffsetString);
        } // END updateClock


        // Update the clock's display every second after the page has loaded.
        updateClock();
        setInterval(updateClock, 1000);
} // END init



window.addEventListener("DOMContentLoaded", init, false);