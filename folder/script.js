let pass = false;
let pfpId, fullName, favoriteDecks, favoriteTimelines;

async function displayFlashcard(flashcardType, id){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
    let mainDiv = document.createElement('div');

    let iconDiv = document.createElement('div');
    let icon = document.createElement('img');

    let params;

    if(flashcardType === "flashcard"){
        const response = await fetch('https://elephantsuite-rearend.herokuapp.com/deck/get?id=' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            mode: 'cors'
        })

        params = await response.json();
        params = params.context.deck;

        if(params.visibility === "PRIVATE") params.visibility = "PERSONAL";
        else if(params.visibility === "PUBLIC") params.visibility = "COMMUNITY";

        icon.src = "../flip/icons/file.png";
        iconDiv.classList.add(params.visibility.toLowerCase() + "-flashcard");
    } else if(flashcardType === "timeline"){
        const response = await fetch(`https://elephantsuite-rearend.herokuapp.com/timeline/get?userId=${savedUserId}&timelineId=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            mode: 'cors'
        })

        params = await response.json();
        params = params.context.timeline;

        if(params.timelineVisibility === "PRIVATE") params.timelineVisibility = "PERSONAL";
        else if(params.timelineVisibility === "PUBLIC") params.timelineVisibility = "COMMUNITY";

        icon.src = "../timeline/icons/timeline.png";
        iconDiv.classList.add(params.timelineVisibility.toLowerCase() + "-flashcard");
    }

    //console.log(params)

    iconDiv.appendChild(icon);

    let textDiv = document.createElement('div');
    let nameText = document.createElement('h1');
    let authorDiv = document.createElement('div');
    let authorImg = document.createElement('img');
    let authorText = document.createElement('p');

    authorText.innerHTML = fullName;
    authorImg.src = pfpId;

    nameText.innerHTML = params.name
    authorDiv.append(authorImg, authorText);

    textDiv.append(nameText, authorDiv);

    let tag = document.createElement('p');
    let options = document.createElement('div');

    if(flashcardType === "flashcard"){
        tag.innerHTML = params.visibility;
        tag.classList.add(params.visibility.toLowerCase() + "-flashcard");

        let favoriteDiv = document.createElement('div');
        let favoriteImg = document.createElement('img');
        let editImg = document.createElement('img');
        let deleteImg = document.createElement('img')

        if(favoriteDecks.includes(params.id)){
            favoriteImg.src = "../flip/icons/filled_heart.png";
            favoriteImg.classList.add('loved');
        } else {
            favoriteImg.src = "../flip/icons/unfilled_heart.png";
            favoriteImg.classList.add('unloved');
        }

        editImg.src = "../flip/editor/icons/edit.png";
        deleteImg.src = "../flip/icons/delete_folder.png";

        let favoriteNumDiv = document.createElement('div');
        favoriteNumDiv.innerHTML = params.numberOfLikes;
        favoriteNumDiv.id = "favorite-number-" + params.id;

        favoriteImg.addEventListener('click', async function(e){
            e.preventDefault();
            e.stopPropagation();

            if(favoriteImg.classList.contains('unloved')){
                favoriteImg.src = "../flip/icons/filled_heart.png";
                favoriteImg.classList.remove('unloved');
                favoriteImg.classList.add('loved');

                const deckLikeResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/deck/like', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({
                        userId: savedUserId,
                        deckId: params.id
                    }),
                    mode: 'cors'
                })

                const deckLikeContext = await deckLikeResponse.json();

                try {
                    document.getElementById('favorite-number-' + id).innerHTML = (parseInt(document.getElementById('favorite-number-' + id).textContent) + 1).toString();
                } catch (e){}
            } else {
                favoriteImg.src = "../flip/icons/unfilled_heart.png";
                favoriteImg.classList.add('unloved');
                favoriteImg.classList.remove('loved')

                const response = await fetch('https://elephantsuite-rearend.herokuapp.com/deck/unlike', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({
                        userId: savedUserId,
                        deckId: params.id
                    }),
                    mode: 'cors'
                })

                try {
                    document.getElementById('favorite-number-' + id).innerHTML = (parseInt(document.getElementById('favorite-number-' + id).textContent) - 1).toString();
                } catch (e){}
            }
        })

        editImg.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            location.href = "../flip/editor/?deck=" + params.id;
        })

        deleteImg.addEventListener('click', async function(e){
            e.preventDefault();
            e.stopPropagation();
            const response = await fetch('https://elephantsuite-rearend.herokuapp.com/folder/removeDeck', {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Expose-Headers': 'Content-Length, X-JSON',
                    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                body: JSON.stringify({
                    folderId: parseInt(location.href.split("=")[1]),
                    deckId: params.id
                }),
                method: 'DELETE',
                mode: 'cors'
            });

            const context = await response.json();

            if(context.status === "SUCCESS") mainDiv.remove();
        });

        favoriteDiv.append(favoriteImg, favoriteNumDiv);
        options.append(editImg, favoriteDiv, deleteImg);
    } else if(flashcardType === "timeline"){
        tag.innerHTML = params.timelineVisibility;
        tag.classList.add(params.timelineVisibility.toLowerCase() + "-flashcard");

        let favoriteDiv = document.createElement('div');
        let favoriteImg = document.createElement('img');
        let editImg = document.createElement('img');
        let deleteImg = document.createElement('img')

        if(favoriteTimelines.includes(params.id)){
            favoriteImg.src = "../flip/icons/filled_heart.png";
            favoriteImg.classList.add('loved');
        } else {
            favoriteImg.src = "../flip/icons/unfilled_heart.png";
            favoriteImg.classList.add('unloved');
        }

        editImg.src = "../flip/editor/icons/edit.png";
        deleteImg.src = "../flip/icons/delete_folder.png";

        let favoriteNumDiv = document.createElement('div');
        favoriteNumDiv.innerHTML = params.likes;
        favoriteNumDiv.id = "favorite-number-" + params.id;

        favoriteImg.addEventListener('click', async function(e){
            e.preventDefault();
            e.stopPropagation();

            if(favoriteImg.classList.contains('unloved')){
                favoriteImg.src = "../flip/icons/filled_heart.png";
                favoriteImg.classList.remove('unloved');
                favoriteImg.classList.add('loved');

                const deckLikeResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/timeline/like', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({
                        userId: savedUserId,
                        timelineId: params.id
                    }),
                    mode: 'cors'
                })

                try {
                    document.getElementById('favorite-number-' + id).innerHTML = (parseInt(document.getElementById('favorite-number-' + id).textContent) + 1).toString();
                } catch (e){}
            } else {
                favoriteImg.src = "../flip/icons/unfilled_heart.png";
                favoriteImg.classList.add('unloved');
                favoriteImg.classList.remove('loved')

                const response = await fetch('https://elephantsuite-rearend.herokuapp.com/timeline/unlike', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({
                        userId: savedUserId,
                        deckId: params.id
                    }),
                    mode: 'cors'
                });

                try {
                    document.getElementById('favorite-number-' + id).innerHTML = (parseInt(document.getElementById('favorite-number-' + id).textContent) - 1).toString();
                } catch (e){}
            }
        })

        editImg.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            location.href = "../timeline/editor/?timeline=" + params.id;
        })

        deleteImg.addEventListener('click', async function(e){
            e.preventDefault();
            e.stopPropagation();
            const response = await fetch('https://elephantsuite-rearend.herokuapp.com/folder/removeTimeline', {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Expose-Headers': 'Content-Length, X-JSON',
                    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                body: JSON.stringify({
                    folderId: parseInt(location.href.split("=")[1]),
                    timelineId: params.id
                }),
                method: 'DELETE',
                mode: 'cors'
            });

            const context = await response.json();

            if(context.status === "SUCCESS") mainDiv.remove();
        });

        favoriteDiv.append(favoriteImg, favoriteNumDiv);
        options.append(editImg, favoriteDiv, deleteImg);
    }

    mainDiv.append(iconDiv, textDiv, tag, options);
    mainDiv.classList.add('flashcard-deck');

    if(flashcardType === "flashcard"){
        mainDiv.classList.add(params.visibility.toLowerCase() + "-flashcard-border");
        mainDiv.setAttribute('onclick', "location.href = '../flip/viewer/?deck=" + params.deckID + "'");
    } else if(flashcardType === "timeline"){
        mainDiv.classList.add(params.timelineVisibility.toLowerCase() + "-flashcard-border");
        mainDiv.setAttribute('onclick', "location.href = '../timeline/viewer/?timeline=" + params.deckID + "'");
    }

    mainDiv.classList.add("faded-out");

    if(flashcardType === "flashcard") {
        document.querySelectorAll(".folder-list")[0].appendChild(mainDiv);
    } else if(flashcardType === "timeline"){
        document.querySelectorAll(".folder-list")[1].appendChild(mainDiv);
    }

    requestAnimationFrame(() => {
        mainDiv.classList.remove("faded-out")
    })
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
    if(folderId === parseInt(location.href.split("=")[1])){
        newDiv.classList.add("active-sidebar-dropdown-category")
        document.getElementById("desktop-main-container-tab").innerHTML = title;
    }

    if(parseInt(location.href.split("=")[1]) === folderId) pass = true;

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

    console.log(user);

    document.getElementById('desktop-navbar-profile-image').src = "../icons/avatars/" + user.pfpId + ".png"
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();

    pfpId = "../icons/avatars/" + user.pfpId + ".png";
    fullName = user.firstName + " " + user.lastName;
    favoriteDecks = user.likedDecksIds;
    favoriteTimelines = user.likedTimelineIds;

    await displayFolders(user);

    if(!pass) location.href = "../dashboard/";

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

function toggleModal(modal){
    if(modal.classList.contains('inactive-modal')){
        modal.classList.remove('inactive-modal');
    } else {
        modal.classList.add('inactive-modal');
    }
}

async function toggleFolderModal(deleting){
    toggleModal(document.getElementById("delete-folder-modal"));

    if(deleting && document.getElementById("folder-delete-input").value === document.getElementById("folder-delete-input").getAttribute("data")){
        const response = await fetch('https://elephantsuite-rearend.herokuapp.com/folder/delete?id=' + location.href.split("=")[1], {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            mode: 'cors'
        });

        const context = await response.json();

        if(context.status === "SUCCESS") location.href = "../dashboard/";
    }
}

document.getElementById("folder-delete-input").addEventListener("input", function(e){
    if(document.getElementById("folder-delete-input").value === document.getElementById("folder-delete-input").getAttribute("data")){
        document.getElementById("folder-delete-input-container").style.border = "1px solid var(--primary-accent)";
    } else {
        document.getElementById("folder-delete-input-container").style.border = "1px solid var(--light-border-color)";
    }
});

window.onload = async function(){
    if(!location.href.split("=")[1]) location.href = "../dashboard/";

    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/folder/get?id=' + location.href.split("=")[1], {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    });

    const context = await response.json();
    console.log(context);

    const total = context.context.folder.deckIds.length + context.context.folder.timelineIds.length;

    document.getElementById("folder-item-numbers").innerHTML = total;
    document.querySelectorAll(".folder-numbers")[0].innerHTML = context.context.folder.deckIds.length + " Flip Decks";
    document.querySelectorAll(".folder-numbers")[1].innerHTML = context.context.folder.timelineIds.length + " Timelines";
    document.getElementById("delete-folder-header").innerHTML = `Type "${context.context.folder.name}" to Confirm`;
    document.getElementById("folder-delete-input").setAttribute("data", context.context.folder.name);

    if(total != 0) document.getElementById("pie-chart-container").style.background = `conic-gradient(var(--primary-accent) 0deg, var(--primary-accent-gradient) ${Math.floor(context.context.folder.deckIds.length / total * 360)}deg, var(--secondary-accent) ${Math.floor(context.context.folder.deckIds.length / total * 360)}deg, var(--secondary-accent-gradient) 360deg, var(--light-border-color) 360deg)`;
    else document.getElementById("pie-chart-container").style.background = `var(--light-border-color)`;

    await locateUserInfo();

    for(let i = 0; i < context.context.folder.deckIds.length; i++){
        await displayFlashcard("flashcard", context.context.folder.deckIds[i]);
    }

    for(let i = 0; i < context.context.folder.timelineIds.length; i++){
        await displayFlashcard("timeline", context.context.folder.timelineIds[i]);
    }
}