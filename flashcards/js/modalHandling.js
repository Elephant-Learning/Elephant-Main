let contextMenu = false;

let pages = ["Elephant Flashcards", "Elephant Task Manager", "Chat Group", "Flashcards Editor", "Flashcard Viewing Platform", "Search Results", "Folder Editor", "Folder Viewer", "My Profile", "Administrator Portal"];
let randomChatMessage = ["Rearranging Your Cards Into Decks...", "Managing Your Tasks Prematurely...", "Closing Minecraft and Beginning To Work...", "Placing 3 Day Blocks on Discord...", "Contemplating Your Life Choices...", "Do You People Even Read This???", "Please be Patient... I'm new..."]

let history = [];

let folderAmount = 0;

const flashcardsVersion = "v1.0.0"

function search(){
    document.getElementById('desktop-navbar-input').blur();
    togglePageFlip(5, undefined);
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

    avatar.src = "../icons/avatars/" + Math.floor(Math.random() * 47) + ".png";
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

function toggleSettingsModal(){
    if(document.getElementById('desktop-settings-modal').classList.contains('inactive-modal')){
        document.getElementById('desktop-settings-modal').classList.remove('inactive-modal');
    } else {
        document.getElementById('desktop-settings-modal').classList.add('inactive-modal');
    }
}

function togglePageFlip(index, sidebar){
    document.getElementById('desktop-main-container-tab').innerHTML = pages[index];
    try{document.querySelector(".active-sidebar-category").classList.remove('active-sidebar-category')} catch{}

    if(!(sidebar === undefined)){
        if(sidebar >= document.querySelectorAll('.desktop-sidebar-category').length){
            document.querySelectorAll('.desktop-sidebar-folder')[sidebar - document.querySelectorAll('.desktop-sidebar-category').length].classList.add('active-sidebar-category')
        } else {
            document.querySelectorAll('.desktop-sidebar-category')[sidebar].classList.add('active-sidebar-category')
        }
    }

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

function sidebarFolder(title){
    let newDiv = document.createElement('div');
    let imgDiv = document.createElement('div');
    let img = document.createElement('img');
    let para = document.createElement('p');

    img.src = "./icons/folder.png";
    imgDiv.appendChild(img);

    para.innerHTML = title;

    newDiv.append(imgDiv, para);
    newDiv.classList.add('desktop-sidebar-folder');

    folderAmount++;

    newDiv.setAttribute('onclick', 'togglePageFlip(7, ' + (folderAmount + document.querySelectorAll('.desktop-sidebar-category').length - 1) + ")")

    document.getElementById('desktop-sidebar-folders').appendChild(newDiv);
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

    const emojis_refactored = ["confused", "cool", "happy", "laugh", "nerd", "neutral", "unamused", "uwu", "wink"];

    sidebarFolder("Spanish 3");
    sidebarFolder("Honors World History");
    sidebarFolder("Honors Language Arts");
    sidebarFolder("Pre-Calculus");
    sidebarFolder("Physics");

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

    closeNews()

    document.getElementById('desktop-profile-user-img').src = "./icons/emojis/" + emojis_refactored[Math.floor(Math.random() * emojis_refactored.length)] + ".png"

    loadFlashcards();

    if(document.getElementById('flashcards-list').hasChildNodes()){
        document.getElementById('no-flashcards').classList.add('inactive-modal');
    }

    toggleNotificationTab(0)
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

//toggle Loading Bar
window.onload = function(){
    document.getElementById('desktop-loader-container').classList.add('inactive-modal')
}

document.addEventListener('DOMContentLoaded', function(e){
    document.getElementById('desktop-loader-text').innerHTML = randomChatMessage[Math.floor(Math.random() * randomChatMessage.length)];
})

initialize();