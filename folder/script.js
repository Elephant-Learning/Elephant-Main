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
    if(folderId === parseInt(location.href.split("=")[1])){
        newDiv.classList.add("active-sidebar-dropdown-category")
        document.getElementById("desktop-main-container-tab").innerHTML = title;
    }

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
    } catch(e){ location.href = "../login"}

    //if(user.type === "ADMIN") document.getElementById('desktop-sidebar-employee').classList.remove('inactive-modal')


    //console.log(user);

    let streakSuffix = " days";

    if(user.elephantUserStatistics.daysStreak === 1) streakSuffix = " day"

    console.log(user);

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png"
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();

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

window.onload = async function(){
    if(!location.href.split("=")[1]) location.href = "../dashboard/"

    locateUserInfo();
}