var audioPlayerObj = document.getElementById('audio-player');
var sndIconObj = document.getElementById('sound-icon');
var sndWavesObj = document.getElementById('snd-waves');

sndIconObj.addEventListener('click', audioToggle, false);

var sndPlaying = true;

function audioToggle() {
    if (sndPlaying) {
        audioPlayerObj.pause();
        sndPlaying = false;
        sndIconObj.innerHTML = "<img src='/wbdv242/img/sound-off.svg' alt='sound off icon'/>";
    } else {
        audioPlayerObj.play();
        sndPlaying = true;
        sndIconObj.innerHTML = "<img src='/wbdv242/img/sound.svg' alt='sound off icon'/>";
    }
}