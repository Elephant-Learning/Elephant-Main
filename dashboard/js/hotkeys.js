let controlActive = false;
let songSelectEnabled = true;

document.addEventListener('keydown', function(e){
    if(e.keyCode === 17) controlActive = true;
    if(e.keyCode === 32 && !document.getElementById('desktop-music-container').classList.contains('inactive-modal')) {
        e.preventDefault();
        toggleAudio();
    } if(controlActive && e.keyCode === 39 && songSelectEnabled) {
        selectSong();
        songSelectEnabled = false;
    } if(e.keyCode === 78 && !document.querySelectorAll('.desktop-tab')[0].classList.contains('inactive-modal')) {
        e.preventDefault();
        createDeck();
    }
});

document.addEventListener('keyup', function(e){
    if(e.keyCode === 17) controlActive = false;
    if(e.keyCode === 39) songSelectEnabled = true;
})