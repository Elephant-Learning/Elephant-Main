let pfpId, fullName, favoriteDecks, favoriteAsk, favoriteTimelines, friends;

async function displayFlashcard(flashcardType, params){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
    let mainDiv = document.createElement('div');

    let iconDiv = document.createElement('div');
    let icon = document.createElement('img');

    if(flashcardType === "flashcard"){
        if(params.visibility === "PRIVATE") params.visibility = "PERSONAL";
        else if(params.visibility === "PUBLIC") params.visibility = "COMMUNITY";

        icon.src = "../flip/icons/file.png";
        iconDiv.classList.add(params.visibility.toLowerCase() + "-flashcard");
    } else if(flashcardType === "ask"){
        if(params.answered === true) params.visibility = "PERSONAL";
        else if(params.answered === false) params.visibility = "COMMUNITY";

        icon.src = "../ask/icons/ask.png";
        iconDiv.classList.add(params.visibility.toLowerCase() + "-flashcard");
    } else if(flashcardType === "timeline"){
        if(params.timelineVisibility === "PRIVATE") params.timelineVisibility = "PERSONAL";
        else if(params.timelineVisibility === "PUBLIC") params.timelineVisibility = "COMMUNITY";

        icon.src = "../timeline/icons/timeline.png";
        iconDiv.classList.add(params.timelineVisibility.toLowerCase() + "-flashcard");
    } else if(flashcardType === "user"){
        params.oldType = params.type;

        if(params.type === "INDIVIDUAL") params.type = "PERSONAL";
        else if(params.type === "STUDENT") params.type = "COMMUNITY";
        else if(params.type === "INSTRUCTOR") params.type = "SHARED";
        else if(params.type === "ADMIN") params.type = "OTHER";

        icon.src = "../flip/icons/user.png";
        iconDiv.classList.add(params.type.toLowerCase() + "-flashcard");
    }

    iconDiv.appendChild(icon);

    let textDiv = document.createElement('div');
    let nameText = document.createElement('h1');
    let authorDiv = document.createElement('div');
    let authorImg = document.createElement('img');
    let authorText = document.createElement('p');

    if(flashcardType === "flashcard"){
        authorText.innerHTML = computeTime(params.created)

        nameText.innerHTML = params.name
        authorDiv.appendChild(authorText);
    } else if(flashcardType === "ask"){
        authorText.innerHTML = params.authorName;
        authorImg.src = `../icons/avatars/${params.authorPfpId}.png`;

        nameText.innerHTML = params.title
        authorDiv.append(authorImg, authorText);
    } else if(flashcardType === "timeline"){
        authorText.innerHTML = params.authorName;
        authorImg.src = `../icons/avatars/${params.authorPfpId}.png`;

        nameText.innerHTML = params.name
        authorDiv.append(authorImg, authorText);
    } else if(flashcardType === "user"){
        authorText.innerHTML = `Elephant ${params.oldType.charAt(0) + params.oldType.toLowerCase().substring(1)}`;

        nameText.innerHTML = params.fullName;
        authorDiv.appendChild(authorText);
    }

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
                    document.getElementById('favorite-number-' + params.id).innerHTML = (parseInt(document.getElementById('favorite-number-' + params.id).textContent) + 1).toString();
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
                    document.getElementById('favorite-number-' + params.id).innerHTML = (parseInt(document.getElementById('favorite-number-' + params.id).textContent) - 1).toString();
                } catch (e){}
            }
        });

        favoriteDiv.append(favoriteImg, favoriteNumDiv);
        options.append(favoriteDiv);
    } else if(flashcardType === "ask"){
        if(params.answered) tag.innerHTML = "ANSWERED";
        else tag.innerHTML = "UNANSWERED";

        tag.classList.add(params.visibility.toLowerCase() + "-flashcard");

        let favoriteDiv = document.createElement('div');
        let favoriteImg = document.createElement('img');

        if(favoriteAsk.includes(params.id)){
            favoriteImg.src = "../flip/icons/filled_heart.png";
            favoriteImg.classList.add('loved');
        } else {
            favoriteImg.src = "../flip/icons/unfilled_heart.png";
            favoriteImg.classList.add('unloved');
        }

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

                const deckLikeResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/answers/like', {
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
                });

                const something = await deckLikeResponse.json();
                console.log(something);

                try {
                    document.getElementById('favorite-number-' + params.id).innerHTML = (parseInt(document.getElementById('favorite-number-' + params.id).textContent) + 1).toString();
                } catch (e){}
            } else {
                favoriteImg.src = "../flip/icons/unfilled_heart.png";
                favoriteImg.classList.add('unloved');
                favoriteImg.classList.remove('loved')

                const response = await fetch('https://elephantsuite-rearend.herokuapp.com/answers/unlike', {
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
                    document.getElementById('favorite-number-' + params.id).innerHTML = (parseInt(document.getElementById('favorite-number-' + params.id).textContent) - 1).toString();
                } catch (e){}
            }
        })

        favoriteDiv.append(favoriteImg, favoriteNumDiv);
        options.append(favoriteDiv);
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
                });

                const something = await deckLikeResponse.json();
                console.log(something);

                try {
                    document.getElementById('favorite-number-' + params.id).innerHTML = (parseInt(document.getElementById('favorite-number-' + params.id).textContent) + 1).toString();
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
                    document.getElementById('favorite-number-' + params.id).innerHTML = (parseInt(document.getElementById('favorite-number-' + params.id).textContent) - 1).toString();
                } catch (e){}
            }
        })

        favoriteDiv.append(favoriteImg, favoriteNumDiv);
        options.append(favoriteDiv);
    } else if(flashcardType === "user"){
        tag.innerHTML = params.oldType;
        tag.classList.add(params.type.toLowerCase() + "-flashcard");

        let friendImg = document.createElement('img');

        if(friends.includes(params.id)){
            friendImg.src = "../flip/icons/remove_friend.png";
        } else {
            friendImg.src = "../flip/icons/add_friend.png";
        }

        friendImg.addEventListener('click', async function(e){
            e.preventDefault();
            e.stopPropagation();

            const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

            if(friends.includes(params.id)){
                const friendingResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/friends/remove', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'PUT, DELETE, POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({
                        userId: savedUserId,
                        friendId: params.id
                    }),
                    mode: 'cors'
                })

                const friendingContext = await friendingResponse.json();
                console.log(friendingContext);

                friends.splice(friends.indexOf(params.id), 1);

                friendImg.src = "../flip/icons/add_friend.png";
            } else {
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

                const notificationResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/notifications/sendFriendRequest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({
                        type: "FRIEND_REQUEST",
                        message: userContext.context.user.firstName + " " + userContext.context.user.lastName + " sent you a friend request!",
                        senderId: userContext.context.user.id,
                        recipientId: params.id
                    }),
                    mode: 'cors'
                })

                const notificationContext = await notificationResponse.json();
                console.log(notificationContext);

                friendImg.src = "./icons/wait.gif";
            }
        });

        options.append(friendImg);
    }

    mainDiv.append(iconDiv, textDiv, tag, options);
    mainDiv.classList.add('flashcard-deck');

    if(flashcardType === "flashcard"){
        mainDiv.classList.add(params.visibility.toLowerCase() + "-flashcard-border");
        mainDiv.setAttribute('onclick', "location.href = '../flip/viewer/?deck=" + params.id + "'");
    } else if(flashcardType === "ask"){
        mainDiv.classList.add(params.visibility.toLowerCase() + "-flashcard-border");
        mainDiv.setAttribute('onclick', "location.href = '../ask/question/?id=" + params.id + "'");
    } else if(flashcardType === "timeline"){
        mainDiv.classList.add(params.timelineVisibility.toLowerCase() + "-flashcard-border");
        mainDiv.setAttribute('onclick', "location.href = '../timeline/viewer/?timeline=" + params.id + "'");
    } else if(flashcardType === "user"){
        mainDiv.classList.add(params.type.toLowerCase() + "-flashcard-border");
        mainDiv.addEventListener("click", async function(e){
            document.getElementById("profile-name").innerHTML = "";
            document.getElementById("profile-image").src = `../icons/elephant-400-400-pink-02.png`;
            document.getElementById("profile-desc").innerHTML = "";

            document.querySelectorAll(".profile-public-display-tag").forEach(function(e){
                e.innerHTML = "";
            });

            document.getElementById("profile-public-display-container").classList.remove("inactive-modal");

            //SET PROFILE THING

            const userResponse = await fetch(`https://elephantsuite-rearend.herokuapp.com/login/user?id=${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                mode: 'cors'
            });

            let userContext = await userResponse.json();
            userContext = userContext.context.user;

            console.log(userContext);

            document.getElementById("profile-name").innerHTML = userContext.firstName + " " + userContext.lastName;
            document.getElementById("profile-image").src = `../icons/avatars/${userContext.pfpId}.png`;
            document.getElementById("profile-desc").innerHTML = "Elephant " + toTitleCase(userContext.type);

            document.querySelectorAll(".profile-public-display-tag")[0].innerHTML = userContext.elephantUserStatistics.daysStreak + " Day Streak";
            document.querySelectorAll(".profile-public-display-tag")[1].innerHTML = userContext.decks.length + " Flip Decks";
            document.querySelectorAll(".profile-public-display-tag")[2].innerHTML = userContext.answers.length + " Questions Asked";
            document.querySelectorAll(".profile-public-display-tag")[3].innerHTML = userContext.timelines.length + " Timelines";
            document.querySelectorAll(".profile-public-display-tag")[4].innerHTML = userContext.email;
        })
    }

    mainDiv.classList.add("faded-out");

    if(flashcardType === "flashcard") {
        document.querySelectorAll(".search-result-container")[0].appendChild(mainDiv);
    } else if(flashcardType === "ask"){
        document.querySelectorAll(".search-result-container")[1].appendChild(mainDiv);
    } else if(flashcardType === "timeline"){
        document.querySelectorAll(".search-result-container")[2].appendChild(mainDiv);
    } else if(flashcardType === "user"){
        document.querySelectorAll(".search-result-container")[3].appendChild(mainDiv);
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

    await createComponent("../Components/app-navbar.html", document.getElementById("desktop-navbar-container"));

    console.log(user);

    document.getElementById('desktop-navbar-profile-image').src = "../icons/avatars/" + user.pfpId + ".png"
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();

    pfpId = "../icons/avatars/" + user.pfpId + ".png";
    fullName = user.firstName + " " + user.lastName;
    favoriteDecks = user.likedDecksIds;
    favoriteAsk = user.elephantAnswersLiked;
    favoriteTimelines = user.likedTimelineIds;
    friends = user.friendIds

    await displayFolders(user);

    await notificationsManager(user);
    toggleNotificationTab(0);
}

//toggle Loading Bar
let randomChatMessage = ["Searching through the Searches", "You don't care about this text...", "Compiling List of Matches", "Quick, what is 9 + 10?", "Regretting not taking that job at Subway", "I love studying. Do you?"]

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
    });

    const context = await response.json();
    await initialize(context)
}

document.getElementById("profile-public-display-bg").onclick = function(){
    document.getElementById("profile-public-display-container").classList.add("inactive-modal");
}

function toggleModal(modal){
    if(modal.classList.contains('inactive-modal')){
        modal.classList.remove('inactive-modal');
    } else {
        modal.classList.add('inactive-modal');
    }
}

window.onload = async function(){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
    let query = location.href.split("?query")[1];
    let number = 0;

    if(!query) location.href = "./?query=";

    query = query.replaceAll("+", " ").slice(1);

    await locateUserInfo();

    const deckResponse = await fetch(`https://elephantsuite-rearend.herokuapp.com/deck/getByName?name=${query}&userId=${savedUserId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    });

    const deckContext = await deckResponse.json();

    const askResponse = await fetch(`https://elephantsuite-rearend.herokuapp.com/answers/searchByName?name=${query}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    });

    const askContext = await askResponse.json();
    console.log(askContext);

    const timelineResponse = await fetch(`https://elephantsuite-rearend.herokuapp.com/timeline/search?query=${query}&userId=${savedUserId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    });

    const timelineContext = await timelineResponse.json();

    const userResponse = await fetch(`https://elephantsuite-rearend.herokuapp.com/login/userByName?name=${query}&userId=${savedUserId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    });

    const userContext = await userResponse.json();

    console.log(userContext);
    number += deckContext.context.decks.length;
    number += askContext.context.answers.length;
    number += timelineContext.context.timelines.length;
    number += userContext.context.users.length;

    if(deckContext.context.decks.length === 0){

    } else {
        for(let i = 0; i < deckContext.context.decks.length; i++){
            await displayFlashcard("flashcard", deckContext.context.decks[i]);
        }
    }

    if(askContext.context.answers.length === 0){

    } else {
        for(let i = 0; i < askContext.context.answers.length; i++){
            await displayFlashcard("ask", askContext.context.answers[i]);
        }
    }

    if(timelineContext.context.timelines.length === 0){

    } else {
        for(let i = 0; i < timelineContext.context.timelines.length; i++){
            await displayFlashcard("timeline", timelineContext.context.timelines[i]);
        }
    }

    if(userContext.context.users.length === 0){

    } else {
        for(let i = 0; i < userContext.context.users.length; i++){
            await displayFlashcard("user", userContext.context.users[i]);
        }
    }

    document.getElementById("desktop-main-container-tab").innerHTML = `Search Results for "${query}" - ${number.toString()} Results`;
    closeLoader();
}