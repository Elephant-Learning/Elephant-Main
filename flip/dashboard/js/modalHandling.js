let deckShowAmount = 10;
let contextMenu = false;
let admin = false;

let pages = ["Elephant Flashcards", "Elephant Task Manager", "Chat Group", "Search Results", "Folder Viewer"];

let history = [];

let folderAmount = 0;

const flashcardsVersion = "v1.0.0";

document.getElementById("desktop-navbar-input").addEventListener("keypress", function(e){
    if (e.key === "Enter") {
        e.preventDefault();
        let content = document.getElementById("desktop-navbar-input").value;

        content = content.replaceAll(" ", "+");
        location.href = `../../search/?query=${content}`;
    }
});

function toggleSettingsModal(){
    if(document.getElementById('desktop-settings-modal').classList.contains('inactive-modal')){
        document.getElementById('desktop-settings-modal').classList.remove('inactive-modal');
    } else {
        document.getElementById('desktop-settings-modal').classList.add('inactive-modal');
    }
}

function togglePageFlip(index){

    const pages = ["Elephant Flip", "Elephant Flip - Search"]

    try{document.querySelector(".active-sidebar-category").classList.remove('active-sidebar-category')} catch{}

    try {document.querySelector(".active-tab").classList.remove('active-tab')} catch{}
    document.querySelectorAll('.desktop-tab')[index].classList.add('active-tab')
    document.getElementById("desktop-main-container-tab").innerHTML = pages[index];

    const removeBottomBtns = [1]

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
}

async function refreshFolders(){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    const userResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/login/user?id=' + savedUserId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    const userContext = await userResponse.json();
    displayFolders(userContext.context.user);
}

async function deleteFolder(folderId){
    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/folder/delete?id=' + folderId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    refreshFolders()
}

function createFolderNode(){
    let newDiv = document.createElement('div');
    let img = document.createElement('img');
    let input = document.createElement('input');

    img.src = "../icons/folder.png";
    input.placeholder = "Folder Name";

    input.addEventListener("change", async function (e) {
        if(input.value === ""){
            newDiv.remove();
            return;
        }

        const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
        const response = await fetch('https://elephantsuite-rearend.herokuapp.com/folder/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                name: input.value,
                userId: savedUserId,
                deckIds: []
            }),
            mode: 'cors'
        })

        const context = await response.json();
        console.log(context);

        if(context.status === "SUCCESS"){
            newDiv.remove();
            refreshFolders();
        }
    })

    newDiv.append(img, input);
    document.getElementById('desktop-sidebar-folders').appendChild(newDiv);

    input.focus();
}

document.getElementById("create-folder-btn").addEventListener("click", function(e){
    e.preventDefault();
    e.stopPropagation();

    createFolderNode();
})

function sidebarFolder(title, folderId){
    let newDiv = document.createElement('div');
    let img = document.createElement('img');
    let para = document.createElement('p');

    img.src = "../icons/folder.png";
    para.innerHTML = title;

    newDiv.append(img, para);

    folderAmount++;

    newDiv.setAttribute('onclick', `location.href = \`../../folder/?id=${folderId}\``)
    newDiv.addEventListener('contextmenu', function(e){
        e.preventDefault();
        e.stopPropagation();

        while (document.getElementById('context-menu').firstChild) {
            document.getElementById('context-menu').firstChild.remove()
        }

        let options = [
            ["folder", "Open Folder", "viewFolder(" + folderId + ", " + (folderAmount + document.querySelectorAll('.desktop-sidebar-category').length - 1) + ")"],
            //["../editor/icons/edit", "Edit Folder", ""],
            ["delete", "Delete Folder", "deleteFolder(" + folderId + ")"]
        ]

        contextMenuOptions(options)
        toggleContextMenu(true, e);
    })

    document.getElementById('desktop-sidebar-folders').appendChild(newDiv);
}

document.getElementById('desktop-sidebar').addEventListener('contextmenu', function(e){
    e.preventDefault();

    while (document.getElementById('context-menu').firstChild) {
        document.getElementById('context-menu').firstChild.remove()
    }

    const options = [["add_folder", "New Folder", "createFolderNode()"]]

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

    const options = [["add_file", "New Deck", "location.href('../editor/')"], ["add_folder", "New Folder", "createFolder()"]]

    contextMenuOptions(options)

    toggleContextMenu(true, e);
})

function contextMenuOptions(options){
    for(let i = 0; i < options.length; i++){
        let newDiv = document.createElement('div');
        let newImg = document.createElement('img');
        let newPara = document.createElement('p');

        newImg.src = "../icons/" + options[i][0] + ".png";
        newPara.innerHTML = options[i][1];

        newDiv.append(newImg, newPara);
        newDiv.setAttribute('onclick', options[i][2] + "; toggleContextMenu(false);");
        document.getElementById('context-menu').appendChild(newDiv);
    }
}

async function toggleFolderModal(create){
    if(document.getElementById('desktop-folder-modal').classList.contains('inactive-modal')){
        document.getElementById('folder-input').value = ""
        document.getElementById('desktop-folder-modal').classList.remove('inactive-modal');
        document.getElementById('folder-input').focus();
        setTimeout(function(){ document.getElementById('folder-input').focus({
            preventScroll: true
        }); }, 10);
        console.log(document.getElementById('folder-input'))
    } else {
        if(create){
            const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
            const response = await fetch('https://elephantsuite-rearend.herokuapp.com/folder/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    name: document.getElementById('folder-input').value,
                    userId: savedUserId,
                    deckIds: []
                }),
                mode: 'cors'
            })

            const context = await response.json();
            console.log(context);

            const userResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/login/user?id=' + savedUserId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                mode: 'cors'
            })

            const userContext = await userResponse.json()

            displayFolders(userContext.context.user);
        }
        document.getElementById('desktop-folder-modal').classList.add('inactive-modal')
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

function min(num1, num2){
    if(num1 > num2) return num2
    else return num1
}

function displayMoreFlashcards(){
    deckShowAmount += 10;
    refreshFlashcards();
}

async function displayFlashcardsManager(user){

    let ele = document.getElementById('flashcards-list');
    let userDecks = [];

    while(ele.lastChild) {
        ele.lastChild.remove();
    }

    for(let i = 0; i < user.decks.length; i++){
        userDecks.push(user.decks[i].id);
    }

    for(let i = 0; i < min(user.elephantUserStatistics.recentlyViewedDeckIds.length, deckShowAmount + 1); i++){

        let context;
        let success = true;

        if(userDecks.includes(user.elephantUserStatistics.recentlyViewedDeckIds[i])){
            let deckIndex = userDecks.indexOf(user.elephantUserStatistics.recentlyViewedDeckIds[i]);
            context = {
                name: user.decks[deckIndex].name,
                authorId: user.decks[deckIndex].authorId,
                visibility: user.decks[deckIndex].visibility,
                id: user.decks[deckIndex].id,
                numberOfLikes: user.decks[deckIndex].numberOfLikes
            }
        } else {
            const response = await fetch('https://elephantsuite-rearend.herokuapp.com/deck/get?id=' + user.elephantUserStatistics.recentlyViewedDeckIds[i], {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                mode: 'cors'
            });

            context = await response.json();
            console.log(context);

            if(context.status === "SUCCESS"){
                context = context.context.deck;
            } else {
                success = false;
            }
        }

        console.log(success);

        if(success){
            if((context !== undefined && document.getElementById('flashcards-view-sorting').value === "1" && context.authorId === user.id) || (document.getElementById('flashcards-view-sorting').value === "2" && user.sharedDeckIds.includes(context.id) || (document.getElementById('flashcards-view-sorting').value === "0"))){
                if(context.authorId === user.id){
                    await displayFlashcard("flashcard", {
                        name: context.name,
                        author: context.authorId,
                        authorName: user.firstName + " " + user.lastName,
                        authorPfp: user.pfpId,
                        type: context.visibility,
                        deckID: context.id,
                        favorite: user.likedDecksIds.includes(context.id),
                        likesNumber: context.numberOfLikes,
                        search: false
                    });
                } else {
                    await displayFlashcard("flashcard", {
                        name: context.name,
                        author: context.authorId,
                        type: context.visibility,
                        deckID: context.id,
                        favorite: user.likedDecksIds.includes(context.id),
                        likesNumber: context.numberOfLikes,
                        search: false
                    });
                }
            }

            if(!document.getElementById('no-flashcards').classList.contains('inactive-modal')) document.getElementById('no-flashcards').classList.add('inactive-modal');
        }
    }

    if(user.elephantUserStatistics.recentlyViewedDeckIds.length > deckShowAmount){
        let newBtn = document.createElement('button');
        newBtn.innerHTML = "Show More";
        newBtn.setAttribute("onclick", "displayMoreFlashcards()");
        newBtn.id = "show-more-btn"
        ele.appendChild(newBtn);
    }
}

async function refreshFlashcards(){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/login/user?id=' + savedUserId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    const context = await response.json();
    displayFlashcardsManager(context.context.user);
}

async function displayFolders(user){
    removeAllChildNodes(document.getElementById('desktop-sidebar-folders'));
    folderAmount = 0;

    for(let i = 0; i < user.folders.length; i++){
        sidebarFolder(user.folders[i].name, user.folders[i].id)
    }
}

async function initialize(user){
    if(user.status === "FAILURE" || user.error === "Bad Request") {
        location.href = "../../../login"
    } else user = user.context.user;

    const emojis_refactored = ["confused", "cool", "happy", "laugh", "nerd", "neutral", "unamused", "uwu", "wink"];

    displayFolders(user)

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

    console.log(user);

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png";
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('desktop-profile-user-img').src = "../icons/emojis/" + emojis_refactored[Math.floor(Math.random() * emojis_refactored.length)] + ".png"

    await notificationsManager(user);
    toggleNotificationTab(0);

    await displayFlashcardsManager(user);

    togglePageFlip(0);
    closeLoader();
}

function getRightBound(element) {
    let xPosition = 0;

    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        element = element.offsetParent;
    }

    xPosition -= window.innerWidth

    return xPosition;
}

//toggle Loading Bar
let randomChatMessage = ["Rearranging Your Cards Into Decks...", "Managing Your Tasks Prematurely...", "Closing Minecraft and Beginning To Work...", "Placing 3 Day Blocks on Discord...", "Contemplating Your Life Choices...", "Do You People Even Read This???", "Please be Patient... I'm new...", "Flashing My Cards... wait...", "More Like Elephant Sweet...", "Not Asleep I Swear...", "Regretting Not Taking Job At Subway..."]

function closeLoader(){
    document.getElementById('desktop-loader-container').classList.add('inactive-modal')
}

document.addEventListener('DOMContentLoaded', function(e){
    document.getElementById('desktop-loader-text').innerHTML = randomChatMessage[Math.floor(Math.random() * randomChatMessage.length)];
})

async function locateUserInfo(){

    let savedUserId;

    try{
        savedUserId = JSON.parse(localStorage.getItem('savedUserId'))
    } catch {
        location.href = "../../../login";
    }

    if(!savedUserId  && savedUserId !== 0) location.href = "../../../login";

    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/login/user?id=' + savedUserId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    const context = await response.json();
    initialize(context);
}

locateUserInfo();


console.log(HtmlSanitizer.SanitizeHtml("<div><script>alert('xss!');</sc" + "ript>Something</div>"))


htmlTExt = "<div><script>alert('xss!');</sc" + "ript>Something</div>"
console.log(htmlTExt.replace(/(&lt;([^>]+)>)/gi, ""));