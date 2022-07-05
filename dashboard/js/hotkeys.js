let controlActive = false;
let songSelectEnabled = true;

document.addEventListener('keydown', function(e){
    let inputActive = false;

    document.querySelectorAll('input').forEach(function(element){
        if(element === document.activeElement) {
            inputActive = true;
        }
    })

    if(e.keyCode === 13 && document.getElementById('desktop-navbar-input') === document.activeElement){
        search();
        inputActive = false;
    }

    if(inputActive) return;

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
    } if(e.keyCode === 27) {
        history.pop();
        let previousPage = history.pop();
        try{togglePageFlip(previousPage[0], previousPage[1])} catch{}
    } if(e.keyCode === 77 && controlActive) toggleMusicModal();
});

document.addEventListener('keyup', function(e){
    if(e.keyCode === 17) controlActive = false;
    if(e.keyCode === 39) songSelectEnabled = true;
})