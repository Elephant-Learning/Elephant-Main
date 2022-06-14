let audio = undefined;
let favoritedPlaylist = false;

const songs = [
    ["Rainy Café", "Abhiram Boddu"],
    ["Space Trip", "Abhiram Boddu"],
    ["Road Vibes", "Abhiram Boddu"],
    ["City Night", "Abhiram Boddu"],
    ["Summer Strings", "Abhiram Boddu"],
    ["Cool Breeze", "Abhiram Boddu"],
    ["Timeless Inception", "Abhiram Boddu"],
    ["Insomnia", "Abhiram Boddu"]
];

let selectedSongIndex;

let paused = true;
let savedVolume = document.getElementById('music-volume').value / 100;

function setVolume(){
    audio.volume = document.getElementById('music-volume').value / 100;
}

function getFavoriteMusic(){
    let favoriteTrack;
    let favoriteMusic = localStorage.getItem('favorite-music');
    favoriteMusic = JSON.parse(favoriteMusic);

    try{
        favoriteTrack = songs[favoriteMusic[Math.floor(Math.random() * favoriteMusic.length)]][0].toLowerCase().replace(' ', '-')
        if(favoriteTrack === undefined) getFavoriteMusic();
        return favoriteTrack;
    } catch{
        getFavoriteMusic();
    }
}

function setupMusicPics(){
    const favoriteTrack = getFavoriteMusic();

    if(favoriteTrack === undefined){
        setupMusicPics()
    } else{
        document.getElementById('favorited-tracks').src = './music/covers/' + favoriteTrack + ".png"
        document.getElementById('mix-playlist').src = './music/covers/' + songs[Math.floor(Math.random() * songs.length)][0].toLowerCase().replace(' ', '-') + ".png"
    }
}

function favoriteMusic(){
    let favoriteMusic = localStorage.getItem('favorite-music');
    favoriteMusic = JSON.parse(favoriteMusic);

    if(document.getElementById('music-heart').classList.contains('unfilled-heart')){
        document.getElementById('music-heart').classList.remove('unfilled-heart');
        document.getElementById('music-heart').classList.add('filled-heart');
        favoriteMusic.push(selectedSongIndex);
        addNotification("heart", "Favorited: " + songs[selectedSongIndex][0]);
    } else {
        document.getElementById('music-heart').classList.remove('filled-heart');
        document.getElementById('music-heart').classList.add('unfilled-heart');
        delete favoriteMusic[favoriteMusic.indexOf(selectedSongIndex)];
        addNotification("heart", "Removed Favorite: " + songs[selectedSongIndex][0]);
    }

    localStorage.setItem('favorite-music', JSON.stringify(favoriteMusic));
}

function randomizeSongs(play){
    let chosen = Math.floor(Math.random() * songs.length);
    let favoriteMusic = localStorage.getItem('favorite-music');
    favoriteMusic = JSON.parse(favoriteMusic);

    if(selectedSongIndex === chosen || favoritedPlaylist && !favoriteMusic.includes(chosen)){
        randomizeSongs();
    } else {
        document.getElementById('album-name').innerHTML = songs[chosen][0];
        document.getElementById('artist-name').innerHTML = songs[chosen][1] + " - Elephant Team";

        if(favoriteMusic.includes(chosen)){
            document.getElementById('music-heart').classList.remove('unfilled-heart');
            document.getElementById('music-heart').classList.add('filled-heart');
        } else {
            document.getElementById('music-heart').classList.remove('filled-heart');
            document.getElementById('music-heart').classList.add('unfilled-heart');
        }

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