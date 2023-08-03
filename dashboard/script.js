let mainColor;

function min(int1, int2){
    if(int1 < int2) return int1;
    else return int2;
}

function pushIndexToFront(array, index){
    let newArray = [];

    newArray.push(array[index]);

    for(let i = 0; i < array.length; i++) if(i !== index) newArray.push(array[i]);

    return newArray;
}

function playVideo(){
    document.querySelectorAll(".video-container-child")[0].classList.remove("active-video-container-child");
    document.querySelectorAll(".video-container-child")[1].classList.add("active-video-container-child");
    document.getElementById("entry-video").src += "&autoplay=1";
}

async function completeEntry(){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/misc/newUserFalse?id=' + savedUserId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    document.getElementById("new-user-modal-bg").classList.add("inactive-modal");
}

function addCard(params, type){
    const images = ["../flip/icons/deck.png", "../ask/icons/ask.png"];

    let newLink = document.createElement("a");
    let imageDiv = document.createElement('div');
    let textDiv = document.createElement('div');

    let newImage = document.createElement('img');
    newImage.src = images[type];

    let newHeader = document.createElement('h1');
    let newPara = document.createElement('p');

    if(type === 0){
        newHeader.innerHTML = params.name;
        newPara.innerHTML = computeTime(params.created);
    } else if(type === 1){
        newHeader.innerHTML = params.title;
        newPara.innerHTML = params.description;
    }

    imageDiv.appendChild(newImage);
    imageDiv.classList.add(mainColor);
    textDiv.append(newHeader, newPara);

    newLink.append(imageDiv, textDiv);
    if(type === 0) newLink.setAttribute("href", "../flip/viewer/?deck=" + params.id);
    else if(type === 1) newLink.setAttribute("href", "../ask/question/?id=" + params.id)
    document.querySelectorAll('.recent-activity-div')[type].appendChild(newLink);
}

document.getElementById("create-folder-btn").addEventListener("click", function(e){
    e.preventDefault();
    e.stopPropagation();

    let newDiv = document.createElement('div');
    let img = document.createElement('img');
    let input = document.createElement('input');

    img.src = "../flip/icons/folder.png";
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
            await refreshFolders();
        }
    })

    newDiv.append(img, input);
    document.getElementById('desktop-sidebar-folders').appendChild(newDiv);

    input.focus();
})

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
    await displayFolders(userContext.context.user);
}

async function displayFolders(user){
    removeAllChildNodes(document.getElementById('desktop-sidebar-folders'));

    for(let i = 0; i < user.folders.length; i++){
        sidebarFolder(user.folders[i].name, user.folders[i].id)
    }
}

function sidebarFolder(title, folderId){
    let newDiv = document.createElement('div');
    let img = document.createElement('img');
    let para = document.createElement('p');

    img.src = "../flip/icons/folder.png";
    para.innerHTML = title;

    newDiv.append(img, para);

    newDiv.setAttribute('onclick', `location.href = \`../folder/?id=${folderId}\``)
    /*newDiv.addEventListener('contextmenu', function(e){
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
    })*/

    document.getElementById('desktop-sidebar-folders').appendChild(newDiv);
}

async function initialize(user){
    if(user.status === "FAILURE") {
        location.href = "../login"
    } else try{
        user = user.context.user;
    } catch(e){ location.href = "../login"};

    if(user.newUser) document.getElementById('new-user-modal-bg').classList.remove('inactive-modal');

    //if(user.type === "ADMIN") document.getElementById('desktop-sidebar-employee').classList.remove('inactive-modal')


    //console.log(user);

    let streakSuffix = " days";

    if(user.elephantUserStatistics.daysStreak === 1) streakSuffix = " day"

    console.log(user);

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png"
    document.getElementById('profile-image').src = "../../icons/avatars/" + user.pfpId + ".png"
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('profile-desc').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('profile-email').innerHTML = user.email;
    document.getElementById('profile-streak').innerHTML = user.elephantUserStatistics.daysStreak + streakSuffix;
    document.getElementById('profile-decks').innerHTML = user.decks.length + " decks";
    document.getElementById('profile-answers').innerHTML = user.answers.length + " questions";

    if(user.type === "INDIVIDUAL") mainColor = "personal-banner";
    else if(user.type === "STUDENT") mainColor = "community-banner";
    else if(user.type === "INSTRUCTOR") mainColor = "shared-banner";
    else mainColor = "other-banner";

    /*let userDecks = user.decks;
    let userDeckIds = [];

    for(let i = 0; i < userDecks.length; i++) userDeckIds.push(userDecks[i].id);

    for(let i = user.elephantUserStatistics.recentlyViewedDeckIds.length - 1; i >= 0; i--){
        if(userDeckIds.includes(user.elephantUserStatistics.recentlyViewedDeckIds[i])){
            userDecks = pushIndexToFront(userDecks, userDeckIds.indexOf(user.elephantUserStatistics.recentlyViewedDeckIds[i]));
        }
    }

    for(let i = 0; i < min(userDecks.length, 10); i++){
        addCard(userDecks[i], 0);
    }

    for(let i = 0; i < min(user.answers.length, 10); i++){
        addCard(user.answers[i], 1);
    }

    if(user.decks.length > 0) document.querySelectorAll(".recent-activity-no")[0].classList.add("inactive-modal");
    if(user.answers.length > 0) document.querySelectorAll(".recent-activity-no")[1].classList.add("inactive-modal");*/

    document.getElementById("profile-banner").classList.add(mainColor)

    await displayFolders(user);
    await notificationsManager(user);
    toggleNotificationTab(0);

    closeLoader();
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
    window.scrollTo(0, 0);
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
    initialize(context)
}

locateUserInfo();