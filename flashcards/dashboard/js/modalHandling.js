let deckShowAmount = 10;
let contextMenu = false;

let pages = ["Elephant Flashcards", "Elephant Task Manager", "Chat Group", "Search Results", "Folder Viewer"];
let randomChatMessage = ["Rearranging Your Cards Into Decks...", "Managing Your Tasks Prematurely...", "Closing Minecraft and Beginning To Work...", "Placing 3 Day Blocks on Discord...", "Contemplating Your Life Choices...", "Do You People Even Read This???", "Please be Patient... I'm new...", "Flashing My Cards... wait...", "More Like Elephant Sweet...", "Not Asleep I Swear...", "Regretting Not Taking Job At Subway..."]

let history = [];

let folderAmount = 0;

const flashcardsVersion = "v1.0.0";

async function search(){
    document.getElementById('desktop-navbar-input').blur();
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    document.getElementById("search-decks-para").innerHTML = "Decks"
    document.getElementById("search-users-para").innerHTML = "Users"

    const deckResponse = await fetch('https://elephant-rearend.herokuapp.com/deck/getByName?name=' + document.getElementById('desktop-navbar-input').value + '&userId=' + savedUserId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    const deckContext = await deckResponse.json();
    console.log(deckContext);

    const userResponse = await fetch('https://elephant-rearend.herokuapp.com/login/user?id=' + savedUserId, {
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

    let userLikedDecks = userContext.context.user.likedDecksIds;
    let userSharedDecks = userContext.context.user.sharedDeckIds;
    let userFriends = userContext.context.user.friendIds;
    let decks = deckContext.context.decks;

    removeAllChildNodes(document.getElementById('search-results-flashcards'));
    removeAllChildNodes(document.getElementById('search-results-users'));

    togglePageFlip(3, undefined);

    //console.log(decks);

    const elephantUsersResponse = await fetch('https://elephant-rearend.herokuapp.com/login/userByName?name=' + document.getElementById('desktop-navbar-input').value + '&userId=' + savedUserId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    });

    const elephantUsersContext = await elephantUsersResponse.json();
    //console.log(elephantUsersContext);

    document.getElementById("search-decks-para").innerHTML = "Decks - " + decks.length;
    document.getElementById("search-users-para").innerHTML = "Users - " + elephantUsersContext.context.users.length;

    for(let i = 0; i < decks.length; i++){
        //if(decks[i].visibility === "PUBLIC" || userSharedDecks.includes(decks[i].id) || decks[i].authorId === savedUserId)

        await displayFlashcard("flashcard", {
            name: decks[i].name,
            author: decks[i].authorId,
            type: decks[i].visibility,
            deckID: decks[i].id,
            favorite: userLikedDecks.includes(decks[i].id),
            likesNumber: decks[i].numberOfLikes,
            search: true
        });
    }

    for(let i = 0; i < elephantUsersContext.context.users.length; i++){
        if(!(elephantUsersContext.context.users[i].id === savedUserId)){
            await displayFlashcard("user", {
                name: elephantUsersContext.context.users[i].firstName + " " + elephantUsersContext.context.users[i].lastName,
                type: elephantUsersContext.context.users[i].type,
                email: elephantUsersContext.context.users[i].email,
                pfpId: elephantUsersContext.context.users[i].pfpId,
                friend: userFriends.includes(elephantUsersContext.context.users[i].id),
                search: true
            })
        }

        console.log(!(elephantUsersContext.context.users[i].id === savedUserId));
    }
}

function toggleSettingsModal(){
    if(document.getElementById('desktop-settings-modal').classList.contains('inactive-modal')){
        document.getElementById('desktop-settings-modal').classList.remove('inactive-modal');
    } else {
        document.getElementById('desktop-settings-modal').classList.add('inactive-modal');
    }
}

function togglePageFlip(index, sidebar, link){

    if(link){
        window.location.href = link;
        return;
    }

    if(index === 4) document.getElementById('desktop-main-container-tab').innerHTML = document.querySelectorAll('.desktop-sidebar-folder')[sidebar - document.querySelectorAll('.desktop-sidebar-category').length].children[1].textContent;
    else document.getElementById('desktop-main-container-tab').innerHTML = pages[index];

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

async function viewFolder(folderId, sidebarNum){
    togglePageFlip(4, sidebarNum);
    removeAllChildNodes(document.getElementById('folder-flashcard-display'));

    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
    const response = await fetch('https://elephant-rearend.herokuapp.com/folder/get?id=' + folderId, {
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
    console.log(context);

    const userResponse = await fetch('https://elephant-rearend.herokuapp.com/login/user?id=' + savedUserId, {
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

    let userLikedDecks = userContext.context.user.likedDecksIds;

    for(let i = 0; i < context.context.folder.deckIds.length; i++){

        const flashcard = await fetch('https://elephant-rearend.herokuapp.com/deck/get?id=' + context.context.folder.deckIds[i], {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            mode: 'cors'
        });

        let flashcardContext = await flashcard.json();
        flashcardContext = flashcardContext.context.deck
        console.log(flashcardContext);

        displayFlashcard("folder", {
            name: flashcardContext.name,
            author: flashcardContext.authorId,
            type: flashcardContext.visibility,
            deckID: flashcardContext.id,
            favorite: userLikedDecks.includes(flashcardContext.id),
            likesNumber: flashcardContext.numberOfLikes,
            search: false
        })
    }
}

async function refreshFolders(){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    const userResponse = await fetch('https://elephant-rearend.herokuapp.com/login/user?id=' + savedUserId, {
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
    const response = await fetch('https://elephant-rearend.herokuapp.com/folder/delete?id=' + folderId, {
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

function sidebarFolder(title, folderId){
    let newDiv = document.createElement('div');
    let imgDiv = document.createElement('div');
    let img = document.createElement('img');
    let para = document.createElement('p');

    img.src = "../icons/folder.png";
    imgDiv.appendChild(img);

    para.innerHTML = title;

    newDiv.append(imgDiv, para);
    newDiv.classList.add('desktop-sidebar-folder');

    folderAmount++;

    newDiv.setAttribute('onclick', "viewFolder(" + folderId + ", " + (folderAmount + document.querySelectorAll('.desktop-sidebar-category').length - 1) + ")")
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
            const response = await fetch('https://elephant-rearend.herokuapp.com/folder/create', {
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

            const userResponse = await fetch('https://elephant-rearend.herokuapp.com/login/user?id=' + savedUserId, {
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

async function displayFlashcardsManager(user){

    let ele = document.getElementById('flashcards-list');
    let userDecks = [];

    while(ele.lastChild) {
        ele.lastChild.remove();
    }

    for(let i = 0; i < user.decks.length; i++){
        userDecks.push(user.decks[i].id);
    }

    for(let i = 0; i < user.elephantUserStatistics.recentlyViewedDeckIds.length; i++){

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
            const response = await fetch('https://elephant-rearend.herokuapp.com/deck/get?id=' + user.elephantUserStatistics.recentlyViewedDeckIds[i], {
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

    if(user.decks.length > deckShowAmount){
        let newBtn = document.createElement('button');
        newBtn.innerHTML = "Show More";
        newBtn.setAttribute("onclick", "displayMoreFlashcards()");
        newBtn.id = "show-more-btn"
        ele.appendChild(newBtn);
    }
}

async function refreshFlashcards(){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
    const response = await fetch('https://elephant-rearend.herokuapp.com/login/user?id=' + savedUserId, {
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

    if(user.type !== "EMPLOYEE"){
        document.getElementById('desktop-sidebar-employee').classList.add('inactive-modal')
    }

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

    togglePageFlip(0,0, false);
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

    const response = await fetch('https://elephant-rearend.herokuapp.com/login/user?id=' + savedUserId, {
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
    initialize(context)
}

locateUserInfo();


console.log(HtmlSanitizer.SanitizeHtml("<div><script>alert('xss!');</sc" + "ript>Something</div>"))


htmlTExt = "<div><script>alert('xss!');</sc" + "ript>Something</div>"
console.log(htmlTExt.replace(/(&lt;([^>]+)>)/gi, ""));