( function () {
	"use strict";

	const SECONDS_PER_MINUTE = 60,
	MINUTES_PER_HOUR = 60;

	var playButtonHtml = '<img src="img/play.svg" alt="Play" />',
	pauseButtonHtml    = '<img src="img/pause.svg" alt="Pause" />',
	muteButtonHtml     = '<img src="img/mute.svg" alt="Mute" />',
	unmuteButtonHtml   = '<img src="img/unmute.svg" alt="Unmute" />';

	// The mediaPlayer is the wrapper for all controls
	function createPlayer( mediaPlayer ) {
		var media        = mediaPlayer.querySelector( '.media' ),
		mediaControls    = mediaPlayer.querySelector( '.mediaControls' ),
		playButton       = mediaPlayer.querySelector( '.playButton' ),
		mediaTimeDisplay = mediaPlayer.querySelector( '.mediaTimeDisplay' ),
		seekBar          = mediaPlayer.querySelector( '.seekBar' ),
		muteButton       = mediaPlayer.querySelector( '.muteButton' ),
		volumeBar        = mediaPlayer.querySelector( '.volumeBar' ),
		playerSizeMenu   = mediaPlayer.querySelector( '.playerSizeMenu' ),
		fullScreenButton = mediaPlayer.querySelector( '.fullScreenButton' );

		generateMediaEvents( media, mediaControls, playButton );

		// Controls are modular so check if they exist
		if ( playButton ) {
			createPlayButton( media, playButton );
		}
		if ( mediaTimeDisplay ) {
			createMediaTimeDisplay( media, mediaTimeDisplay );
		}
		if ( seekBar ) {
			createSeekBar( media, seekBar );
		}
		if ( muteButton ) {
			createMuteButton( media, muteButton );
		}
		if ( volumeBar ) {
			createVolumeBar( media, volumeBar );
		}
		if ( playerSizeMenu ) {
			createPlayerSizeMenu( media, mediaControls, playerSizeMenu );
		}
		if ( fullScreenButton ) {
			createFullScreenButton( media, mediaControls, fullScreenButton );
		}
	}      // END createPlayer


	// Helper functions
	function playPauseMedia( media, playButton ) {
		if ( media.paused ) {
			playButton.innerHTML = pauseButtonHtml;
			media.play();
		} else {
			playButton.innerHTML = playButtonHtml;
			media.pause();
		}
	}       // END playPauseMedia

	// Pause and set the play/pause button to 'Play'
	function onMediaEnd( media, playButton ) {
		media.pause();
		playButton.innerHTML = playButtonHtml;
	}


	function inFullScreen() {
		if ( document.fullscreen
		|| document.mozFullScreen
		|| document.webkitFullscreen ) {
			return true;
		} else {
			return false;
		}
	}       // END isInFullScreen


	function enterExitFullScreen( media, mediaControls ) {
		if ( inFullScreen() ) {
			if ( document.exitFullscreen ) {
				document.exitFullscreen();
			} else if ( document.mozCancelFullScreen ) {
				document.mozCancelFullScreen();
			} else if ( document.webkitExitFullscreen ) {
				document.webkitExitFullscreen();
			}
			mediaControls.style.width = media.style.width;
		} else {
			if ( media.requestFullscreen ) {
				media.requestFullscreen();
			} else if ( media.mozRequestFullScreen ) {
				media.mozRequestFullScreen();   // Firefox
			} else if ( media.webkitRequestFullscreen ) {
				media.webkitRequestFullscreen();        // Chrome and Safari
			}
			mediaControls.style.width = screen.width + 'px';
		}
	}       // END enterExitFullScreen


	function generateMediaEvents( media, mediaControls, playButton ) {
		function onVideoSingleClick() {
			playPauseMedia( media, playButton );
		}

		function onVideoDoubleClick() {
			enterExitFullScreen( media, mediaControls );
		}

		function onMediaEnding() {
			onMediaEnd( media, playButton );
		}

		media.addEventListener( 'click', onVideoSingleClick, false );
		media.addEventListener( 'dblclick', onVideoDoubleClick, false );
		media.addEventListener( 'ended', onMediaEnding, false );
	}       // END generateMediaEvents


	// Fix wrong input/change event implementation in Chrome/IE
	function createRangeInputChangeHelper( range, inputFn, changeFn ) {
		var inputTimer,
		releaseTimer,
		isActive;

		function destroyRelease() {
			clearTimeout( releaseTimer );
			range.removeEventListener( 'blur', releaseRange, false );
			document.removeEventListener( 'mouseup', releaseRange, false );
		}

		function setupRelease() {
			if ( !isActive ) {
				destroyRelease();
				isActive = true;
				range.addEventListener( 'blur', releaseRange, false );
				document.addEventListener( 'mouseup', releaseRange, true );
			}
		}

		function _releaseRange() {
			if ( isActive ) {
				destroyRelease();
				isActive = false;
				if ( changeFn ) {
					changeFn();
				}
			}
		}

		function releaseRange() {
			setTimeout( _releaseRange, 9 );
		}

		function onInput() {
			if ( inputFn ) {
				clearTimeout( inputTimer );
				inputTimer = setTimeout( inputFn );
			}
			clearTimeout( releaseTimer );
			releaseTimer = setTimeout( releaseRange, 999 );
			if ( !isActive ) {
				setupRelease();
			}
		}

		range.addEventListener( 'input', onInput, false );
		range.addEventListener( 'change', onInput, false );
	}      // END createRangeInputChangeHelper


	function createPlayButton( media, playButton ) {
		function onPlayButtonClick() {
			playPauseMedia( media, playButton );
		}

		playButton.addEventListener( 'click', onPlayButtonClick, false );
	}       // END createPlayButton


	function createMediaTimeDisplay( media, mediaTimeDisplay ) {
		var totalHoursContainer = mediaTimeDisplay.querySelector( '.totalHoursContainer' ),
		totalMinutesContainer   = mediaTimeDisplay.querySelector( '.totalMinutesContainer' ),
		totalSecondsContainer   = mediaTimeDisplay.querySelector( '.totalSecondsContainer' ),
		currentHourContainer    = mediaTimeDisplay.querySelector( '.currentHourContainer' ),
		currentMinuteContainer  = mediaTimeDisplay.querySelector( '.currentMinuteContainer' ),
		currentSecondContainer  = mediaTimeDisplay.querySelector( '.currentSecondContainer' ),
		totalHour,
		totalMinute,
		totalSecond,
		currentHour,
		currentMinute,
		currentSecond;

		function calculateTotalTimeValues() {
			totalHour = Math.floor( 
				media.duration / 
				( SECONDS_PER_MINUTE * MINUTES_PER_HOUR ) );
			totalMinute = Math.floor( 
				( media.duration / SECONDS_PER_MINUTE ) - 
				( totalHour * MINUTES_PER_HOUR ) );
			totalSecond = Math.floor( 
				media.duration - 
				( totalHour * MINUTES_PER_HOUR * SECONDS_PER_MINUTE ) - 
				( totalMinute * SECONDS_PER_MINUTE ) );
		}

		function updateCurrentTimeValues() {
			if ( totalHour > 0 ) {
				currentHour = Math.floor( 
					media.currentTime / 
					( SECONDS_PER_MINUTE * MINUTES_PER_HOUR ) );
			}
			currentMinute = Math.floor( 
				( media.currentTime / SECONDS_PER_MINUTE ) % MINUTES_PER_HOUR );
			currentSecond = Math.floor( 
				media.currentTime % SECONDS_PER_MINUTE );
		}

		// If value is NaN, set them to '0'
		function setTotalTimeHtml() {
			if ( !isNaN( totalHour ) && ( totalHour > 0 ) ) {
				if ( totalHour < 10 ) {
					totalHoursContainer.innerHTML = '0' + totalHour + ' :';
					
				} else {
					totalHoursContainer.innerHTML = totalHour + ' :';
				}
			}

			if ( isNaN( totalMinute ) ) {
				totalMinutesContainer.innerHTML = '00 :';
			} else {
				if ( totalMinute < 10 ) {
					totalMinute = '0' + totalMinute;
				}
				totalMinutesContainer.innerHTML = totalMinute + ' :';
			}

			if ( isNaN( totalSecond ) ) {
				totalSecondsContainer.innerHTML = '00';
			} else {
				if ( totalSecond < 10 ) {
					totalSecond = '0' + totalSecond;
				}
				totalSecondsContainer.innerHTML = totalSecond;
			}
		}      // END setTotalTimeHtml

		function updateCurrentTimeHtml() {
			if ( !isNaN( totalHour ) && totalHour > 0 ) {
				if ( currentHour < 10 ) {
					currentHour = '0' + currentHour;
				}
				currentHourContainer.innerHTML = currentHour + ' :';
			}

			if ( isNaN( currentMinute ) ) {
				currentMinuteContainer.innerHTML = '00 :';
			} else {
				if ( currentMinute < 10 ) {
					currentMinute = '0' + currentMinute;
				}
				currentMinuteContainer.innerHTML = currentMinute + ' :';
			}

			if ( isNaN( currentSecond ) ) {
				currentSecondContainer.innerHTML = '00';
			} else {
				if ( currentSecond < 10 ) {
					currentSecond = '0' + currentSecond;
				}
				currentSecondContainer.innerHTML = currentSecond;
			}
		}      // END updateCurrentTimeHtml

		calculateTotalTimeValues();
		updateCurrentTimeValues();
		setTotalTimeHtml();
		updateCurrentTimeHtml();

		if ( isNaN( totalHour )
		|| isNaN( totalMinute )
		|| isNaN( totalSecond ) ) {
			media.addEventListener( 'loadedmetadata', calculateTotalTimeValues, true );
			media.addEventListener( 'loadedmetadata', setTotalTimeHtml, false );
		}
		media.addEventListener( 'timeupdate', updateCurrentTimeValues, false );
		media.addEventListener( 'timeupdate', updateCurrentTimeHtml, false );
	}      // END createMediaTimeDisplay


	function createSeekBar( media, seekBar ) {
		var duration,
		isMediaPaused,
		blockSeek = false;

		function enableDisableSeekBar() {
			duration = media.duration;
			if ( duration && !isNaN( duration ) ) {
				seekBar.max = duration;
				seekBar.disabled = false;
			} else {
				seekBar.disabled = true;
			}
		}

		function onSeek() {
			if ( !blockSeek ) {
				blockSeek = true;
				isMediaPaused = media.paused;
				media.pause();
			}
			media.currentTime = seekBar.value;
		}

		function onSeekRelease() {
			if ( !isMediaPaused ) {
				media.play();
			}
			blockSeek = false;
		}

		function onTimeUpdate() {
			if ( !blockSeek ) {
				seekBar.value = media.currentTime;
			}
		}


		// Or duration change
		media.addEventListener( 'loadedmetadata', enableDisableSeekBar, false );
		media.addEventListener( 'emptied', enableDisableSeekBar, false );
		media.addEventListener( 'timeupdate', onTimeUpdate, false );

		createRangeInputChangeHelper( seekBar, onSeek, onSeekRelease );

		enableDisableSeekBar();
		onTimeUpdate();
	}      // END createSeekBar


	function createMuteButton( media, muteButton ) {
		function onMuteButtonClick() {
			if ( media.muted ){
				muteButton.innerHTML = muteButtonHtml;
				media.muted = false;
			} else {
				muteButton.innerHTML = unmuteButtonHtml;
				media.muted = true;
			}
		}

		muteButton.addEventListener( 'click', onMuteButtonClick, false );
	}       // END createMuteButton


	function createVolumeBar( media, volumeBar ) {
		function onScrub() {
			media.volume = volumeBar.value;
		}

		volumeBar.addEventListener( 'input', onScrub, false );
		volumeBar.addEventListener( 'change', onScrub, false );
	}       // END createVolumeBar


	function createPlayerSizeMenu( media, mediaControls, playerSizeMenu ) {
		function scaleMedia() {
			media.style.width = '100%';
			media.style.height = '100%';
		}

		function onSizeChange() {
			// Do not change size if in full screen
			if ( !inFullScreen() ) {
				if ( playerSizeMenu.value === 'auto' ) {
					media.style.width  = '100%';
					media.style.height = '100%';                                    
				} else if ( playerSizeMenu.value === '1080' ) {
					media.style.width = '1920px';
				} else if ( playerSizeMenu.value === '720' ) {
					media.style.width = '1280px';
				} else if ( playerSizeMenu.value === '480' ) {
					media.style.width = '640px';
				}

				if ( !( playerSizeMenu.value === 'auto' ) ) {
					window.removeEventListener( 'resize', scaleMedia, false );
				}

				mediaControls.style.width = media.style.width;
			}
		}

		// Initialize player and control size
		onSizeChange();

		playerSizeMenu.addEventListener( 'change', onSizeChange, false );
	}      // END createPlayerSizeMenu


	function createFullScreenButton( media, mediaControls, fullScreenButton ) {
		function onFullScreenButtonClick() {
			enterExitFullScreen( media, mediaControls );
		}

		fullScreenButton.addEventListener( 'click', onFullScreenButtonClick, false );
	}

	// Get all of the media players on the page
	Array.prototype.forEach.call( document.querySelectorAll( '.mediaPlayer' ), createPlayer );
}() );