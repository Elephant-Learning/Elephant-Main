let audio = undefined;
const songs = [
    ["Rainy Café", "Abhiram Boddu"],
    ["Space Trip", "Abhiram Boddu"],
    ["Road Vibes", "Abhiram Boddu"]
];

let selectedSongIndex;

let paused = true;
let savedVolume = document.getElementById('music-volume').value / 100;

function setVolume(){
    audio.volume = document.getElementById('music-volume').value / 100;
}

function randomizeSongs(play){
    let chosen = Math.floor(Math.random() * songs.length);

    if(selectedSongIndex === chosen){
        randomizeSongs();
    } else {
        document.getElementById('album-name').innerHTML = songs[chosen][0];
        document.getElementById('artist-name').innerHTML = songs[chosen][1] + " - Elephant Team";

        let name = songs[chosen][0].toLowerCase().replace(' ', '-')
        document.getElementById('album-cover').src = "./music/covers/" + name + ".png";
        audio = new Audio('./music/' + name + ".wav");
        audio.volume = document.getElementById('music-volume').value / 100;
        if(play){
            paused = true;
            pausePlay();
        }
        selectedSongIndex = chosen;
    }
}

function pausePlay() {

    let currentVolume = document.getElementById('music-volume').value / 100;
    let volumeChange = currentVolume / 50;

    if(paused) {
        audio.play();
        document.getElementById('music-pause').src = "./icons/music/pause.svg";

    } else {
        document.getElementById('music-pause').src = "./icons/music/play.svg";
        /*savedVolume = currentVolume;

        let fadeOut = setInterval(function(){
            try{audio.volume -= volumeChange;}
            catch{
                audio.pause();
                clearInterval(fadeOut);
            }

            if(audio.volume < 0.01){
                audio.pause();
                clearInterval(fadeOut);
            }
        }, 20)

        audio.volume = savedVolume;*/
        audio.pause();
    }

    paused = !paused;
}

setInterval(function(){
    document.getElementById('music-timeline').value = (audio.currentTime / audio.duration) * document.getElementById('music-timeline').getAttribute('max');
    if(audio.currentTime / audio.duration === 1){
        randomizeSongs(true)
    }
}, 1000)

randomizeSongs(false);
document.getElementById('dashboard-review-btn').style.bottom = "25px";