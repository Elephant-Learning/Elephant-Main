let currentActiveSong;
let paused = true;
let firstTime = true;
let songManager;
let song;

const musics = [
    ["City Night", "Abhiram Boddu"],
    ["Cool Breeze", "Abhiram Boddu"],
    ["Insomnia", "Abhiram Boddu"],
    ["Nostalgia", "Sid Gupta"],
    ["Rainy Café", "Abhiram Boddu"],
    ["Road Vibes", "Abhiram Boddu"],
    ["Space Trip", "Abhiram Boddu"],
    ["Summer Strings", "Abhiram Boddu"],
    ["Timeless Inception", "Abhiram Boddu"],
]

function initializeMusic(){
    setupPlaylists()
    selectSong()
}

document.getElementById('music-play-img').onclick = toggleAudio;
document.getElementById('music-next-img').onclick = selectSong;

function toggleAudio(){
    if(paused){
        document.getElementById('music-play-img').src = "./icons/pause.png";
        document.getElementById('music-image-div').style.animationPlayState = "running";
        songManager = setInterval(sliderManager, 1000);
        song.play();
    } else {
        document.getElementById('music-play-img').src = "./icons/play.png";
        document.getElementById('music-image-div').style.animationPlayState = "paused";
        clearInterval(songManager);
        song.pause();
    }

    paused = !paused;
}

function selectSong(){
    if(!firstTime) song.pause();
    let previousSong = currentActiveSong;
    currentActiveSong = Math.floor(Math.random() * musics.length);

    if(previousSong === currentActiveSong) selectSong()
    else{
        document.getElementById('music-image').src = "./music/covers/min/" + musics[currentActiveSong][0].toLowerCase().replace(' ', '-') + ".png";
        document.getElementById('music-name').innerHTML = musics[currentActiveSong][0];
        document.getElementById('music-author').innerHTML = musics[currentActiveSong][1];

        song = new Audio("./music/" + musics[currentActiveSong][0].toLowerCase().replace(' ', '-') + ".wav");
    }

    if(firstTime) firstTime = false;
    else {
        if(paused) toggleAudio()
        else song.play();
    }
}

function sliderManager(){
    document.getElementById('slider-input').value = (song.currentTime / song.duration) * document.getElementById('slider-input').max;

    if(song.currentTime === song.duration) selectSong();

}

function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

function setupPlaylists(){
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    canvas.width = 400;
    canvas.height = 400;

    // Code to Generate Random Liked Music Goes Here
    const types = ["mixed_radio", "favorites"]
    for(let i = 0; i < types.length; i++){

        let playlistDiv = document.createElement('div');

        let randomMusic = musics[Math.floor(Math.random() * musics.length)];
        let randomImage = new Image();
        randomImage.onload = function(){
            let radioImage = new Image();
            radioImage.onload = function(){
                let radioImageSize = 250;

                ctx.beginPath();
                ctx.drawImage(randomImage, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(radioImage, (canvas.width - radioImageSize)/2, (canvas.height - radioImageSize)/2, radioImageSize, radioImageSize)
                ctx.closePath();

                canvas.toBlob(function(blob) {
                    const newImg = document.createElement('img');
                    const url = URL.createObjectURL(blob);

                    newImg.onload = function() {
                        // no longer need to read the blob so it's revoked
                        URL.revokeObjectURL(url);
                    };

                    newImg.src = url;
                    playlistDiv.appendChild(newImg)
                });
            }
            radioImage.src = "./music/icons/" + types[i] + ".png";
        }
        randomImage.src = "./music/covers/min/" + randomMusic[0].toLowerCase().replace(' ', '-') + ".png";

        let playlistText = document.createElement('p');
        playlistText.innerHTML = toTitleCase(types[i].replace('_', " "))

        playlistDiv.appendChild(playlistText);

        document.getElementById('playlist-list').appendChild(playlistDiv)
    }

}