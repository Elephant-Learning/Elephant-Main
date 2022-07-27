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
        document.getElementById('music-play-img').src = "../icons/pause.png";
        document.getElementById('music-image-div').style.animationPlayState = "running";
        songManager = setInterval(sliderManager, 1000);
        song.play();
    } else {
        document.getElementById('music-play-img').src = "../icons/play.png";
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
        document.getElementById('music-image').src = "../music/covers/min/" + musics[currentActiveSong][0].toLowerCase().replace(' ', '-') + ".png";
        document.getElementById('music-name').innerHTML = musics[currentActiveSong][0];
        document.getElementById('music-author').innerHTML = musics[currentActiveSong][1];

        song = new Audio("../music/" + musics[currentActiveSong][0].toLowerCase().replace(' ', '-') + ".wav");
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
            radioImage.src = "../music/icons/" + types[i] + ".png";
        }
        randomImage.src = "../music/covers/min/" + randomMusic[0].toLowerCase().replace(' ', '-') + ".png";

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
        root.style.setProperty("--bg-color-1", "#1e1e1e");
        root.style.setProperty("--bg-color-2", "#171717")
        root.style.setProperty("--light-border-color", "#2d2d2d");
        root.style.setProperty("--dark-gray", "#2d2d2d");
        root.style.setProperty("--light-gray", "#262626");
        root.style.setProperty("--hover-dark", "#262626");
        root.style.setProperty("--hover-light", "#171717");
        root.style.setProperty("--image-invert", "0.75");
        root.style.setProperty("--light-accent", "#2d2d2d");
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

function dateToObject(DATE){
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    let endingDate = "th";
    let endingTime = "AM"

    if(DATE.getHours() > 11) {
        endingTime = "PM";
        if(DATE.getHours() > 12) DATE.setHours(DATE.getHours() - 12);
    }
    if(DATE.getHours() === 0) DATE.setHours(12);

    let refactoredMinutes;

    if(DATE.getMinutes().toString().length === 1) refactoredMinutes = "0" + DATE.getMinutes().toString();
    else refactoredMinutes = DATE.getMinutes().toString();

    if(DATE.getDate() > 20 || DATE.getDate < 4){
        if(DATE.getDate() & 10 === 1) endingDate = "st";
        if(DATE.getDate() & 10 === 2) endingDate = "nd";
        if(DATE.getDate() & 10 === 3) endingDate = "rd";
    }

    return {
        month: months[DATE.getMonth()],
        date: DATE.getDate(),
        dateEnding: endingDate,
        year: DATE.getFullYear(),
        hour: DATE.getHours(),
        minutes: refactoredMinutes,
        timeEnding: endingTime
    }
}

function createNotification(TYPE, DATA){
    let newDiv = document.createElement('div');
    let unreadDiv = document.createElement('div');
    let avatarDiv = document.createElement('div');
    let avatar = document.createElement('img');
    let textDiv = document.createElement('div');
    let timeDiv = document.createElement('p');
    let optionsDiv = document.createElement('div');

    let parentDiv;

    avatar.src = "../../icons/avatars/" + Math.floor(Math.random() * 47) + ".png";
    avatarDiv.appendChild(avatar);

    let today = dateToObject(new Date());

    timeDiv.innerHTML = today.month + " " + today.date + today.dateEnding + ", " + today.year + " at " + today.hour + ":" + today.minutes + " " + today.timeEnding;

    if(TYPE === "friend"){
        let header = document.createElement('h1');
        let span1 = document.createElement('span');
        let btn1 = document.createElement('button');
        let btn2 = document.createElement('button');

        span1.classList.add('bolded');
        span1.innerHTML = DATA.name;

        header.append(span1, document.createTextNode(" would like to be your friend."));

        btn1.innerHTML = "Accept";
        btn2.innerHTML = "Decline";
        btn1.classList.add('desktop-notification-btn-1');
        btn2.classList.add('desktop-notification-btn-2');

        optionsDiv.append(btn1, btn2);
        optionsDiv.classList.add('desktop-notification-options');

        textDiv.append(header, timeDiv, optionsDiv);

        parentDiv = document.querySelectorAll('.desktop-notifications-list')[1];

        document.querySelectorAll('.desktop-notifications-tab-number')[1].innerHTML = (parseInt(document.querySelectorAll('.desktop-notifications-tab-number')[1].textContent) + 1).toString();

    } else if(TYPE === "deckShared"){
        let header = document.createElement('h1');
        let span1 = document.createElement('span');
        let span2 = document.createElement('span');
        let btn1 = document.createElement('button');

        span1.classList.add('bolded')
        span2.classList.add('bolded')
        span1.innerHTML = DATA.sender;
        span2.innerHTML = DATA.deckName;

        header.append(span1, document.createTextNode(" shared "), span2, document.createTextNode(" with you."));

        btn1.innerHTML = "Open Deck";
        btn1.classList.add('desktop-notification-btn-1');

        optionsDiv.appendChild(btn1);
        optionsDiv.classList.add('desktop-notification-options');

        textDiv.append(header, timeDiv, optionsDiv);

        parentDiv = document.querySelectorAll('.desktop-notifications-list')[0];

        document.querySelectorAll('.desktop-notifications-tab-number')[0].innerHTML = (parseInt(document.querySelectorAll('.desktop-notifications-tab-number')[0].textContent) + 1).toString();
    } else if(TYPE === "deckFavorited"){
        let header = document.createElement('h1');
        let span1 = document.createElement('span');
        let span2 = document.createElement('span');

        span1.classList.add('bolded')
        span2.classList.add('bolded')
        span1.innerHTML = DATA.sender;
        span2.innerHTML = DATA.deckName;

        header.append(span1, document.createTextNode(" favorited your deck, "), span2, document.createTextNode("."));

        textDiv.append(header, timeDiv);

        parentDiv = document.querySelectorAll('.desktop-notifications-list')[0];

        document.querySelectorAll('.desktop-notifications-tab-number')[0].innerHTML = (parseInt(document.querySelectorAll('.desktop-notifications-tab-number')[0].textContent) + 1).toString();
    }

    newDiv.append(unreadDiv, avatarDiv, textDiv);
    newDiv.classList.add('desktop-notification')

    parentDiv.appendChild(newDiv);
}

function toggleNotificationsModal(){
    if(document.getElementById('desktop-notifications-modal').classList.contains('inactive-modal')){
        document.getElementById('desktop-notifications-modal').classList.remove('inactive-modal');
    } else {
        document.getElementById('desktop-notifications-modal').classList.add('inactive-modal')
    }
}

function toggleNotificationTab(index){
    document.querySelector(".active-notifications-tab").classList.remove('active-notifications-tab');
    document.querySelectorAll('.desktop-notifications-tab')[index].classList.add('active-notifications-tab');

    document.querySelector('.active-notifications-list').classList.remove('active-notifications-list');

    if(document.querySelectorAll('.desktop-notifications-list')[index].hasChildNodes()){
        document.querySelectorAll('.desktop-notifications-list')[index].classList.add('active-notifications-list');
    } else {
        document.getElementById('no-notifications').classList.add('active-notifications-list');
    }
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

    for(let i = 0; i < 14; i++){
        createNotification("friend", {
            name: "Elephant Student"
        })
    }

    for(let i = 0; i < 29; i++){
        if(Math.floor(Math.random() * 2) === 0){
            createNotification("deckShared", {
                sender: "Elephant Student",
                deckName: "Random Deck"
            })
        } else {
            createNotification("deckFavorited", {
                sender: "Elephant Student",
                deckName: "Random Deck"
            })
        }
    }

    toggleTheme(preferences[0]);
    toggleSizeSetting(preferences[1]);

    toggleNotificationTab(0);

    initializeMusic();

    localStorage.setItem('preferences', JSON.stringify(preferences));
}

mainInitialize()