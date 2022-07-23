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

function setPlaylist(index){
    document.querySelectorAll('.playlist-running').forEach(function(element){
        if(!element.classList.contains('inactive-modal')) element.classList.add("inactive-modal");
    })

    document.querySelectorAll('.playlist-running')[index].classList.remove('inactive-modal');
}

function setupPlaylists(){
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    canvas.width = 200;
    canvas.height = 200;

    // Code to Generate Random Liked Music Goes Here
    const types = ["mixed_radio", "favorites"]
    for(let i = 0; i < types.length; i++){

        let playlistDiv = document.createElement('div');

        let randomMusic = musics[Math.floor(Math.random() * musics.length)];
        let randomImage = new Image();
        randomImage.onload = function(){
            let radioImage = new Image();
            radioImage.onload = function(){
                let radioImageSize = 125;

                ctx.beginPath();
                ctx.drawImage(randomImage, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(radioImage, (canvas.width - radioImageSize)/2, (canvas.height - radioImageSize)/2, radioImageSize, radioImageSize)
                ctx.closePath();

                canvas.toBlob(function(blob) {
                    const newImg = document.createElement('img');
                    const url = URL.createObjectURL(blob);

                    newImg.onload = function() {
                        let playlistRunningDiv = document.createElement('div');
                        let playlistRunningImg = document.getElementById('playlist-type-image-' + i).cloneNode();

                        playlistRunningDiv.appendChild(playlistRunningImg);

                        let playlistTextDiv = document.createElement('div')
                        let playlistRunningHeader = document.createElement('h1');
                        let playlistRunningText = document.createElement('p');

                        playlistRunningHeader.innerHTML = "Currently Playing";
                        playlistRunningText.innerHTML = toTitleCase(types[i].replace('_', " "));

                        playlistTextDiv.append(playlistRunningHeader, playlistRunningText);
                        playlistRunningDiv.appendChild(playlistTextDiv)

                        if(i !== 0) playlistRunningDiv.classList.add('inactive-modal');
                        playlistRunningDiv.classList.add('playlist-running');

                        document.getElementById('playlist-playing').appendChild(playlistRunningDiv);

                        URL.revokeObjectURL(url);
                    };

                    newImg.src = url;
                    newImg.id = "playlist-type-image-" + i;
                    playlistDiv.appendChild(newImg)
                });
            }
            radioImage.src = "./music/icons/" + types[i] + ".png";
        }
        randomImage.src = "./music/covers/min/" + randomMusic[0].toLowerCase().replace(' ', '-') + ".png";

        let playlistText = document.createElement('p');
        playlistText.innerHTML = toTitleCase(types[i].replace('_', " "))
        playlistDiv.appendChild(playlistText);
        playlistDiv.setAttribute("onclick", "setPlaylist(" + i + ")");
        document.getElementById('playlist-list').appendChild(playlistDiv);
    }
}

function toggleMusicModal(){
    if(document.getElementById('desktop-music-container').classList.contains('inactive-modal')){
        document.getElementById('desktop-music-container').classList.remove('inactive-modal');
    } else {
        document.getElementById('desktop-music-container').classList.add('inactive-modal');
    }
}

function toggleTheme(themeIndex){
    let root = document.querySelector(":root");

    if(themeIndex === 1){
        root.style.setProperty('--text-color', 'white');
        root.style.setProperty("--bg-color-1", "#121212");
        root.style.setProperty("--bg-color-2", "#212121")
        root.style.setProperty("--light-border-color", "#2c2c2c");
        root.style.setProperty("--dark-gray", "#090909");
        root.style.setProperty("--light-gray", "#2c2c2c");
        root.style.setProperty("--hover-dark", "#181818");
        root.style.setProperty("--hover-light", "black");
        root.style.setProperty("--image-invert", "0.75");
        root.style.setProperty("--light-accent", "#333");
        root.style.setProperty("--primary-accent", "#e32b78");
        root.style.setProperty("--primary-accent-gradient", "#b11074");
        root.style.setProperty("--secondary-accent", "#0d87c5");
        root.style.setProperty("--secondary-accent-gradient", "#27b4b9");
        root.style.setProperty("--tertiary-accent", "#af5112");
        root.style.setProperty("--tertiary-accent-gradient", "#d0691b");
    } else if(themeIndex === 0){
        root.style.setProperty('--text-color', 'black');
        root.style.setProperty("--bg-color-1", "#ffffff");
        root.style.setProperty("--bg-color-2", "#f6f7fb")
        root.style.setProperty("--light-border-color", "#ebebeb");
        root.style.setProperty("--dark-gray", "#1e1e1e");
        root.style.setProperty("--light-gray", "#2c2c2c");
        root.style.setProperty("--hover-dark", "#0f0f0f");
        root.style.setProperty("--hover-light", "#f5f5f5");
        root.style.setProperty("--image-invert", "0");
        root.style.setProperty("--light-accent", "#ffedf6");
        root.style.setProperty("--primary-accent", "#fe599d");
        root.style.setProperty("--primary-accent-gradient", "#f30096");
        root.style.setProperty("--secondary-accent", "#00a8ff");
        root.style.setProperty("--secondary-accent-gradient", "#31d6dc");
        root.style.setProperty("--tertiary-accent", "#f8680a");
        root.style.setProperty("--tertiary-accent-gradient", "#fa8d37");
    } else if(themeIndex === 2){
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) toggleTheme(1);
        else toggleTheme(0)
    }

    document.querySelectorAll('.profile-theme-check-img').forEach(function(element){
        element.classList.add('inactive-modal');
    })

    document.querySelectorAll('.profile-theme-check-img')[themeIndex].classList.remove('inactive-modal');

    let preferences = JSON.parse(localStorage.getItem('preferences'));
    preferences[0] = themeIndex;
    localStorage.setItem('preferences', JSON.stringify(preferences));
}

function toggleSizeSetting(value){
    const sizes = [0.75, 1, 1.25, 1.5];
    let preferences = JSON.parse(localStorage.getItem('preferences'));

    document.querySelector(':root').style.setProperty('--size', sizes[value].toString());

    document.querySelectorAll('.profile-zoom-check-img').forEach(function(element){
        element.classList.add('inactive-modal');
    })

    document.querySelectorAll('.profile-zoom-check-img')[value].classList.remove('inactive-modal');

    preferences[1] = value;
    localStorage.setItem('preferences', JSON.stringify(preferences));
}

function mainInitialize(){
    let preferences = localStorage.getItem('preferences');

    if(!preferences) {
        localStorage.setItem('preferences', JSON.stringify([2, 1]));
        preferences = localStorage.getItem('preferences');
    }

    preferences = JSON.parse(preferences);

    if(!(preferences[0] < 3)) {
        preferences = [2, preferences[1]];
    }

    if(!(preferences[1] < 4)) {
        preferences = [preferences[0], 1];
    }

    toggleTheme(preferences[0]);
    toggleSizeSetting(preferences[1])

    initializeMusic();

    localStorage.setItem('preferences', JSON.stringify(preferences));
}

mainInitialize()