let contextMenu = false;

let pages = ["Elephant Flashcards", "Elephant Task Manager", "Chat Group", "Flashcards Editor", "Flashcard Viewing Platform", "Search Results", "Folder Editor", "Folder Viewer", "My Profile", "Administrator Portal"];
let randomChatMessage = ["Rearranging Your Cards Into Decks...", "Managing Your Tasks Prematurely...", "Closing Minecraft and Beginning To Work...", "Placing 3 Day Blocks on Discord...", "Contemplating Your Life Choices...", "Do You People Even Read This???", "Please be Patient... I'm new..."]

let history = [];

function search(){
    document.getElementById('desktop-navbar-input').blur();
    togglePageFlip(5, undefined);
}

function toggleSettingsModal(){
    if(document.getElementById('desktop-settings-modal').classList.contains('inactive-modal')){
        document.getElementById('desktop-settings-modal').classList.remove('inactive-modal');
    } else {
        document.getElementById('desktop-settings-modal').classList.add('inactive-modal');
    }
}

function toggleMusicModal(){
    if(document.getElementById('desktop-music-container').classList.contains('inactive-modal')){
        document.getElementById('desktop-music-container').classList.remove('inactive-modal');
    } else {
        document.getElementById('desktop-music-container').classList.add('inactive-modal');
    }
}

function togglePageFlip(index, sidebar){
    document.getElementById('desktop-main-container-tab').innerHTML = pages[index];
    try{document.querySelector(".active-sidebar-category").classList.remove('active-sidebar-category')} catch{}
    try{document.querySelectorAll('.desktop-sidebar-category')[sidebar].classList.add('active-sidebar-category')} catch{}
    try {document.querySelector(".active-tab").classList.remove('active-tab')} catch{}
    document.querySelectorAll('.desktop-tab')[index].classList.add('active-tab')

    const removeBottomBtns = [1, 2, 3, 4, 5, 6, 7]

    if(removeBottomBtns.includes(index)){
        document.querySelectorAll('.desktop-bottom-btn').forEach(function(item){
            item.classList.add('inactive-modal')
        })
    } else {
        try {
            document.querySelectorAll('.desktop-bottom-btn').forEach(function(item){
                item.classList.remove('inactive-modal')
            })
        } catch{}
    }

    history.push([index, sidebar]);
}

function toggleSizeSetting(value){
    const sizes = [0.75, 1, 1.25, 1.5];
    let preferences = JSON.parse(localStorage.getItem('preferences'));

    document.querySelector(':root').style.setProperty('--size', sizes[value].toString());

    preferences[1] = value;
    localStorage.setItem('preferences', JSON.stringify(preferences));
}

document.getElementById('desktop-sidebar').addEventListener('contextmenu', function(e){
    e.preventDefault();

    while (document.getElementById('context-menu').firstChild) {
        document.getElementById('context-menu').firstChild.remove()
    }

    const options = [["add_folder", "New Folder", "createFolder()"]]

    contextMenuOptions(options)

    toggleContextMenu(true, e);
})

document.addEventListener('click', function(e){
    toggleContextMenu(false);
})

document.getElementById('desktop-navbar-profile').addEventListener('click', function(e){

})

document.getElementById('desktop-main-container').addEventListener('contextmenu', function(e){
    e.preventDefault()

    while (document.getElementById('context-menu').firstChild) {
        document.getElementById('context-menu').firstChild.remove()
    }

    const options = [["add_file", "New Deck", "createDeck()"], ["add_folder", "New Folder", "createFolder()"]]

    contextMenuOptions(options)

    toggleContextMenu(true, e);
})

function contextMenuOptions(options){
    for(let i = 0; i < options.length; i++){
        let newDiv = document.createElement('div');
        let newImg = document.createElement('img');
        let newPara = document.createElement('p');

        newImg.src = "./icons/" + options[i][0] + ".png";
        newPara.innerHTML = options[i][1];

        newDiv.append(newImg, newPara);
        newDiv.setAttribute('onclick', options[i][2] + "; toggleContextMenu(false);");
        document.getElementById('context-menu').appendChild(newDiv);
    }
}

function toggleContextMenu(display, e, fixedPosition){
    contextMenu = !contextMenu;

    if(display) {

        let refactoredClientX, refactoredClientY;

        if(fixedPosition !== undefined){
            refactoredClientX = fixedPosition[0];
            refactoredClientY = fixedPosition[1];

            console.log(refactoredClientX, refactoredClientY)
        } else{
            refactoredClientX = e.clientX
            if(e.clientX > window.innerWidth - 128) refactoredClientX -= 128

            refactoredClientY = e.clientY;
            if(e.clientY > window.innerHeight - 50) refactoredClientY -= 50;
        }

        document.getElementById('context-menu').style.left = refactoredClientX + "px";
        document.getElementById('context-menu').style.top = refactoredClientY + "px";
        document.getElementById('context-menu').classList.remove('inactive-modal');
    } else {
        document.getElementById('context-menu').classList.add('inactive-modal');
    }
}

function closeNews(){
    document.getElementById('desktop-main-news').style.visibility = "hidden";
    document.querySelectorAll('.desktop-tab').forEach(function(item){
        item.style.top = "calc(var(--size) * 44px)";
        item.style.height = "calc(100vh - var(--size) * 92px)";
    })
    document.getElementById('desktop-main-container-tab').style.top = "0";
    document.getElementById('desktop-music-container').style.height = "calc(100vh - var(--size) * 48px)";
}

function initialize(){

    let preferences = localStorage.getItem('preferences');

    if(!preferences) {
        preferences = JSON.stringify([2, 1]);
        localStorage.setItem('preferences', JSON.stringify(preferences));
        preferences = localStorage.getItem('preferences');
    }

    preferences = JSON.parse(preferences);

    toggleTheme(preferences[0]);
    toggleSizeSetting(preferences[1])

    localStorage.setItem('preferences', JSON.stringify(preferences));

    if(document.getElementById('desktop-main-news').hasChildNodes()){
        document.getElementById('desktop-main-news').style.visibility = "visible";
        document.querySelectorAll('.desktop-tab').forEach(function(item){
            item.style.top = "calc(var(--size) * 68px)";
            item.style.height = "calc(100vh - var(--size) * 116px)";
        })

        let element = document.getElementById('notifications-btn');
        document.getElementById('desktop-main-container-tab').style.top = "calc(var(--size) * 24px)";
        document.getElementById('desktop-music-container').style.height = "calc(100vh - var(--size) * 72px)";
    }

    loadFlashcards();

    if(document.getElementById('flashcards-list').hasChildNodes()){
        document.getElementById('no-flashcards').classList.add('inactive-modal');
    }

    initializeMusic();
    togglePageFlip(0,0, false)
}

function getRightBound(element) {
    var xPosition = 0;

    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        element = element.offsetParent;
    }

    xPosition -= window.innerWidth

    return xPosition;
}

function toggleTheme(themeIndex){
    let root = document.querySelector(":root");

    if(themeIndex === 1){
        root.style.setProperty('--text-color', 'white');
        root.style.setProperty("--bg-color-1", "#1a1a1a");
        root.style.setProperty("--bg-color-2", "#0f0f0f")
        root.style.setProperty("--light-border-color", "#202224");
        root.style.setProperty("--dark-gray", "#26282a");
        root.style.setProperty("--light-gray", "#454749");
        root.style.setProperty("--hover-dark", "#454749");
        root.style.setProperty("--hover-light", "black");
        root.style.setProperty("--image-invert", "0.75");
        root.style.setProperty("--light-accent", "#2f1e2e");
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

    let preferences = JSON.parse(localStorage.getItem('preferences'));
    preferences[0] = themeIndex;
    localStorage.setItem('preferences', JSON.stringify(preferences));
}

//toggle Loading Bar
window.onload = function(){
    document.getElementById('desktop-loader-container').classList.add('inactive-modal')
}

document.addEventListener('DOMContentLoaded', function(e){
    document.getElementById('desktop-loader-text').innerHTML = randomChatMessage[Math.floor(Math.random() * randomChatMessage.length)];
})

initialize();