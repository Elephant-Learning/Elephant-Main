let selectedProfile = 0;
let savedTags;

async function toggleAvatarModal(){
    if(document.getElementById('desktop-avatar-container').classList.contains('inactive-modal')){
        document.getElementById('desktop-avatar-container').classList.remove('inactive-modal')
    } else {
        document.getElementById('desktop-avatar-container').classList.add('inactive-modal');

        const savedUserId = JSON.parse(localStorage.getItem('savedUserId'))
        const response = await fetch('https://elephantsuite-rearend.herokuapp.com/misc/pfpid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                userId: savedUserId,
                pfpId: selectedProfile
            }),
            mode: 'cors'
        })

        locateUserInfo();
    }
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

function toggleTagsModal(){
    document.getElementById("tags-modal-bg").classList.remove("inactive-modal");
}

function parseData(tags){
    for(let i = 0; i < tags.tags.length; i++){
        let newDiv = document.createElement('div');
        newDiv.innerHTML = tags.tags[i];
        newDiv.setAttribute("onclick", "selectTag(" + i + ")");
        newDiv.id = "tagItem-" + i;
        newDiv.classList.add("tag-item");
        document.getElementById("tags-list").appendChild(newDiv);
    }
}

function toggleDeleteModal(){
    if(document.getElementById('delete-login-modal-bg').classList.contains("inactive-modal")){
        document.getElementById('confirm-password-delete-input').value = "";
        document.getElementById('delete-login-modal-bg').classList.remove("inactive-modal")
    } else {
        document.getElementById('delete-login-modal-bg').classList.add("inactive-modal")
    }
}

document.getElementById("edit-profile-btn").onclick = toggleAccountSettingsModal;

function toggleAccountSettingsModal(){
    if(document.getElementById('account-settings-modal-container').classList.contains("inactive-modal")){
        document.getElementById('account-settings-modal-container').classList.remove("inactive-modal")
    } else {
        document.getElementById('account-settings-modal-container').classList.add("inactive-modal")
    }
}

function selectPfp(index){
    selectedProfile = index;
    document.getElementById('desktop-avatar-current').src = "../../icons/avatars/" + index + ".png";
    try{document.querySelector('.selected-avatar-img').classList.remove('selected-avatar-img');} catch{}
    document.querySelectorAll('.avatar-img')[selectedProfile].classList.add('selected-avatar-img')
}

async function cancelEntry(){
    document.getElementById("tags-modal-bg").classList.add("inactive-modal")

    removeAllChildNodes(document.getElementById("tags-list"));

    let tagsList;

    await fetch("../answers/answers.json").then(function(response){return response.json();}).then(function(data){tagsList = data.tags}).catch(function(error){console.log(`Error: ${error}`)})

    for(let i = 0; i < tagsList.length; i++){
        let newDiv = document.createElement('div');
        newDiv.innerHTML = tagsList[i];
        newDiv.setAttribute("onclick", "selectTag(" + i + ")");
        newDiv.id = "tagItem-" + i;
        newDiv.classList.add("tag-item");

        if(savedTags.includes(i)) newDiv.classList.add("active-tag");
        document.getElementById("tags-list").appendChild(newDiv);
    }

    if(document.querySelectorAll(".active-tag").length >= 3) document.getElementById("tags-modal-button").classList = "";
    else document.getElementById("tags-modal-button").classList = "inactive-modal-button";
}

async function completeEntry(){
    if(document.getElementById("tags-modal-button").classList.contains("inactive-modal-button")) return;

    let tagsArray = [];

    document.querySelectorAll(".active-tag").forEach(function(element){
        tagsArray.push(element.id.split("-")[1]);
    });

    let savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    await fetch('https://elephantsuite-rearend.herokuapp.com/answers/setUserTags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            tags: tagsArray,
            userId: savedUserId
        }),
        mode: 'cors'
    })

    document.getElementById("tags-modal-bg").classList.add("inactive-modal");

    let tags = "";
    let tagsList;

    await fetch("../answers/answers.json").then(function(response){return response.json();}).then(function(data){tagsList = data.tags}).catch(function(error){console.log(`Error: ${error}`)})

    for(let i = 0; i < tagsArray.length; i++){
        tags += tagsList[tagsArray[i]] + ", ";
    } document.getElementById("my-profile-tags").innerHTML = tags;

    console.log(tags);
}

function selectTag(index){
    if(document.querySelectorAll(".tag-item")[index].classList.contains("active-tag")){
        document.querySelectorAll(".tag-item")[index].classList.remove("active-tag")
    } else document.querySelectorAll(".tag-item")[index].classList.add("active-tag")

    if(document.querySelectorAll(".active-tag").length >= 3) document.getElementById("tags-modal-button").classList = "";
    else document.getElementById("tags-modal-button").classList = "inactive-modal-button";
}

function convertGMTtoLocalTime(gmtTime) {
    const dateObj = new Date(gmtTime);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const localTime = dateObj.toLocaleDateString('en-US', options);
    return localTime.replace(/(\d)(st|nd|rd|th)/, '$1<sup>$2</sup>');
}

function createBadge(params){
    const badges = [
        ["goat", "has created 2 timelines", "has created 8 timelines", "has created 16 timelines", "has created 64 timelines", "Create 2 timelines", "Create 8 timelines", "Create 16 timelines", "Create 64 timelines"],
        ["squirrel", "has made 2 friends", "has made 8 friends", "has made 16 friends", "has made 32 friends", "Make 2 Friends", "Make 8 friends", "Make 16 friends", "Make 32 friends"],
        ["wolf", "has created 2 flip decks", "has created 8 flip decks", "has created 16 flip decks", "has created 64 flip decks", "Create 2 flip decks", "Create 8 flip decks", "Create 16 flip decks", "Create 64 flip decks"],
        ["dolphin", "has answered 2 questions", "has answered 8 questions", "has answered 16 questions", "has answered 64 questions", "Answer 2 questions", "Answer 8 questions", "Answer 16 questions", "Answer 64 questions"],
        ["lion", "has achieved a 7 day streak on Elephant", "has achieved a 14 day streak on Elephant", "has achieved a 1 month streak on Elephant", "has achieved a 2 month streak on Elephant", "Achieve a 7 day streak on Elephant", "Achieve a 14 day streak on Elephant", "Achieve a 1 month streak on Elephant", "Achieve a 2 month streak on Elephant"],
        ["elephant", "has earned every single badge of normal level", "has earned every single badge of bronze level", "has earned every single badge of silver level", "has earned every single badge of gold level", "Earn every single badge", "Earn every single badge of bronze level", "Earn every single badge of silver level", "Earn every single badge of gold level"],
    ];

    const badgeTypes = ["TIME_MASTER", "FRIEND_MASTER", "FLIP_MASTER", "GALAXY_BRAIN", "MASTER_STREAKER", "BADGE_MASTER"];
    const levels = [["Badge", "gray"], ["Bronze", "#CD7F32"], ["Silver", "#C0C0C0"], ["Gold", "#ffbf00"]];

    console.log(params)

    const newDiv = document.createElement("div");

    const newImg = document.createElement("img");
    newImg.src = `../icons/badges/${badges[badgeTypes.indexOf(params.type)][0]}_128.jpg`

    const alertDiv = document.createElement("div");

    const backgroundDivContainer = document.createElement("div");
    const backgroundDiv = document.createElement("div");
    backgroundDiv.style.backgroundImage = `url("../icons/badges/${badges[badgeTypes.indexOf(params.type)][0]}.jpg")`

    const badgeImg = document.createElement("img");
    badgeImg.src = `../icons/badges/${badges[badgeTypes.indexOf(params.type)][0]}_128.jpg`;

    const textDiv = document.createElement("div");
    const headerText = document.createElement("h1");
    const paraText = document.createElement("p");

    headerText.innerHTML = `${badges[badgeTypes.indexOf(params.type)][0].charAt(0).toUpperCase() + badges[badgeTypes.indexOf(params.type)][0].slice(1)} Badge`;
    paraText.innerHTML = `${params.name} ${badges[badgeTypes.indexOf(params.type)][params.level]}`;

    if(params.level === 0){
        newImg.style.filter = "grayscale(1)";
        backgroundDivContainer.style.filter = "grayscale(1)";
        badgeImg.style.filter = "grayscale(1)";

        paraText.innerHTML = "Badge to Explore"

        textDiv.append(headerText, paraText);

        const goForNext = document.createElement("h2");
        const goForNextSpan = document.createElement("span");
        const goForNextText = document.createTextNode(` ${badges[badgeTypes.indexOf(params.type)][5]}`);
        goForNextSpan.style.color = levels[params.level][1];
        goForNextSpan.style.border = `1px solid ${levels[params.level][1]}`;
        goForNextSpan.innerHTML = `Go For ${levels[params.level][0]}`;

        goForNext.append(goForNextSpan, goForNextText);
        textDiv.appendChild(goForNext);

        backgroundDivContainer.appendChild(backgroundDiv);

        alertDiv.append(backgroundDivContainer, badgeImg, textDiv)
        newDiv.append(newImg, alertDiv);

        document.getElementById("my-profile-badges").appendChild(newDiv);

        return;
    }

    if(params.level > 1){
        const newSpan = document.createElement("span");
        newSpan.innerHTML = levels[params.level - 1][0];
        newSpan.style.color = levels[params.level - 1][1];
        newSpan.style.border = `1px solid ${levels[params.level - 1][1]}`;
        headerText.appendChild(newSpan);
    }

    textDiv.append(headerText, paraText);
    backgroundDivContainer.appendChild(backgroundDiv);

    for(let i = params.earnedTimes.length - 1; i > 0; i--){
        const newHeader2 = document.createElement("h6");
        const newSpan2 = document.createElement("span");

        newSpan2.innerHTML = levels[i - 1][0];
        newSpan2.style.color = levels[i - 1][1];
        newSpan2.style.border = `1px solid ${levels[i - 1][1]}`;

        const newText = document.createTextNode(` was earned on ${convertGMTtoLocalTime(params.earnedTimes[i])}`);
        newHeader2.append(newSpan2, newText);
        textDiv.appendChild(newHeader2);
    }

    const goForNext = document.createElement("h2");
    const goForNextSpan = document.createElement("span");
    const goForNextText = document.createTextNode(` ${badges[badgeTypes.indexOf(params.type)][params.level + 5]}`);
    goForNextSpan.style.color = levels[params.level][1];
    goForNextSpan.style.border = `1px solid ${levels[params.level][1]}`;
    goForNextSpan.innerHTML = `Go For ${levels[params.level][0]}`;

    goForNext.append(goForNextSpan, goForNextText);
    textDiv.appendChild(goForNext);

    alertDiv.append(backgroundDivContainer, badgeImg, textDiv)
    newDiv.append(newImg, alertDiv);
    document.getElementById("my-profile-badges").appendChild(newDiv);
}

async function initialize(user){
    if(user.status === "FAILURE") {
        location.href = "../login"
    } else user = user.context.user;

    if(user.type === "EMPLOYEE"){
        document.getElementById('desktop-sidebar-employee').classList.remove('inactive-modal')
    }

    console.log(user);

    await createComponent("../Components/app-navbar.html", document.getElementById("desktop-navbar-container"));

    /*removeAllChildNodes(document.getElementById('my-profile-friends'));
    removeAllChildNodes(document.getElementById('my-profile-decks'));
    removeAllChildNodes(document.getElementById('my-profile-answers'));

    let newHeader = document.createElement('h1');
    let newDeckHeader = document.createElement('h1')
    let newAnswersHeader = document.createElement('h1');
    newAnswersHeader.innerHTML = "Elephant Questions"
    newDeckHeader.innerHTML = "Elephant Decks"
    newHeader.innerHTML = "Friends"

    document.getElementById('my-profile-friends').appendChild(newHeader);
    document.getElementById('my-profile-decks').appendChild(newDeckHeader);
    document.getElementById('my-profile-answers').append(newAnswersHeader);*/

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png"
    document.getElementById('my-profile-img').src = "../../icons/avatars/" + user.pfpId + ".png"
    //document.getElementById("account-settings-modal-image").src = "../../icons/avatars/" + user.pfpId + ".png"
    document.getElementById('desktop-avatar-current').src = "../../icons/avatars/" + user.pfpId + ".png"
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('my-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('my-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('my-profile-email').innerHTML = user.email;
    document.getElementById('my-profile-location').innerHTML = COUNTRY_LIST[user.countryCode];

    if(user.type === "INDIVIDUAL"){
        document.getElementById("desktop-profile-banner").className = "personal";
    } else if(user.type === "STUDENT"){
        document.getElementById("desktop-profile-banner").className = "community";
    } else if(user.type === "INSTRUCTOR"){
        document.getElementById("desktop-profile-banner").className = "shared";
    } else if(user.type === "ADMIN"){
        document.getElementById("desktop-profile-banner").className = "admin";
    }

    displayFolders(user);

    if(user.decks.length === 1) document.getElementById('my-profile-decks-num').innerHTML = user.decks.length + " deck";
    else document.getElementById('my-profile-decks-num').innerHTML = user.decks.length + " decks";

    if(user.answers.length === 1) document.getElementById('my-profile-ask-num').innerHTML = user.answers.length + " question";
    else document.getElementById('my-profile-ask-num').innerHTML = user.answers.length + " questions";

    if(user.timelines.length === 1) document.getElementById('my-profile-timeline-num').innerHTML = user.timelines.length + " timeline";
    else document.getElementById('my-profile-timeline-num').innerHTML = user.timelines.length + " timelines";

    let tags = "";
    let tagsList;

    savedTags = user.elephantAnswersTags;

    removeAllChildNodes(document.getElementById("tags-list"));

    for(let i = 0; i < user.elephantUserStatistics.medals.length; i++){
        let badge = user.elephantUserStatistics.medals[i];
        badge.name = user.fullName;

        createBadge(badge);
    }

    if(user.elephantUserStatistics.medals.length === 0){
        const newPara = document.createElement("p");
        newPara.innerHTML = "No Badges";

        document.getElementById("my-profile-badges").appendChild(newPara);
    }

    await fetch("../ask/answers.json").then(function(response){return response.json();}).then(function(data){tagsList = data.tags}).catch(function(error){console.log(`Error: ${error}`)})

    for(let i = 0; i < tagsList.length; i++){
        let newDiv = document.createElement('div');
        newDiv.innerHTML = tagsList[i];
        newDiv.setAttribute("onclick", "selectTag(" + i + ")");
        newDiv.id = "tagItem-" + i;
        newDiv.classList.add("tag-item");

        if(savedTags.includes(i)) newDiv.classList.add("active-tag");
        document.getElementById("tags-list").appendChild(newDiv);
    }

    if(document.querySelectorAll(".active-tag").length >= 3) document.getElementById("tags-modal-button").classList = "";
    else document.getElementById("tags-modal-button").classList = "inactive-modal-button";

    for(let i = 0; i < user.elephantAnswersTags.length; i++){
        tags += tagsList[user.elephantAnswersTags[i]] + ", ";
    } document.getElementById("my-profile-tags").innerHTML = tags;

    if(user.elephantUserStatistics.daysStreak === 1) document.getElementById('my-profile-streak').innerHTML = user.elephantUserStatistics.daysStreak + " Day Streak";
    else document.getElementById('my-profile-streak').innerHTML = user.elephantUserStatistics.daysStreak + " Days Streak";

    document.getElementById('delete-acc-text').innerHTML = "You cannot undo this. By continuing, you'll lose " + user.friendIds.length + " friends and " + user.decks.length + " decks."

    for(let i = 0; i < user.friendIds.length; i++){
        const response = await fetch('https://elephantsuite-rearend.herokuapp.com/login/user?id=' + user.friendIds[i], {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            mode: 'cors'
        })

        let context = await response.json();
        context = context.context.user;

        let newDiv = document.createElement('div');
        let newImg = document.createElement('img');
        let newTxtDiv = document.createElement('div');
        let newName = document.createElement('h1');
        let newEmail = document.createElement('p');

        newImg.src = "../icons/avatars/" + context.pfpId + ".png";
        newName.innerHTML = context.firstName + " " + context.lastName;
        newEmail.innerHTML = context.email;

        newTxtDiv.append(newName, newEmail);
        newDiv.append(newImg, newTxtDiv);

        document.getElementById('profile-friends-list').appendChild(newDiv);
    }

    for(let i = 0; i < user.decks.length; i++){
        let newDiv = document.createElement('div');
        let newImg = document.createElement('img');
        let newTxtDiv = document.createElement('div');
        let newName = document.createElement('h1');
        let newEmail = document.createElement('p');

        newImg.src = "../flip/icons/deck.png";
        newName.innerHTML = user.decks[i].name;
        newEmail.innerHTML =  "Created: " + computeTime(user.decks[i].created);

        newTxtDiv.append(newName, newEmail);
        newDiv.append(newImg, newTxtDiv);

        document.getElementById('profile-decks-list').appendChild(newDiv);
    }

    for(let i = 0; i < user.answers.length; i++){
        let newDiv = document.createElement('div');
        let newImg = document.createElement('img');
        let newTxtDiv = document.createElement('div');
        let newName = document.createElement('h1');
        let newEmail = document.createElement('p');

        newImg.src = "../ask/icons/ask.png";
        newName.innerHTML = user.answers[i].title;
        newEmail.innerHTML =  "Created: " + computeTime(user.answers[i].created);

        newTxtDiv.append(newName, newEmail);
        newDiv.append(newImg, newTxtDiv);

        document.getElementById('profile-questions-list').appendChild(newDiv);
    }

    for(let i = 0; i < user.timelines.length; i++){
        let newDiv = document.createElement('div');
        let newImg = document.createElement('img');
        let newTxtDiv = document.createElement('div');
        let newName = document.createElement('h1');
        let newEmail = document.createElement('p');

        newImg.src = "../timeline/icons/timeline.png";
        newName.innerHTML = user.timelines[i].name;
        newEmail.innerHTML =  `Timelines Visibility: ${user.timelines[i].timelineVisibility}`;

        newTxtDiv.append(newName, newEmail);
        newDiv.append(newImg, newTxtDiv);

        document.getElementById('profile-timelines-list').appendChild(newDiv);
    }

    selectedProfile = user.pfpId;

    removeAllChildNodes(document.getElementById('desktop-avatar-selector-main'));

    await notificationsManager(user);
    toggleNotificationTab(0);

    for(let i = 0; i < 47; i++){
        let newImg = document.createElement('img');
        newImg.src = "../../icons/avatars/" + i + ".png";
        newImg.setAttribute("onclick", "selectPfp(" + i + ")")
        newImg.classList.add('avatar-img')
        document.getElementById('desktop-avatar-selector-main').appendChild(newImg);
    }

    selectPfp(selectedProfile);
}

async function deleteAccount(){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'))
    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/registration/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            id: savedUserId,
            password: document.getElementById('confirm-password-delete-input').value
        }),
        mode: 'cors'
    })

    const content = await response.json();
    console.log(content);

    if(content.status === "SUCCESS"){
        location.href = "../login"
    } else {
        document.getElementById('confirm-password-delete-input').style.border = "1px solid var(--primary-accent)";
    }

    //location.href = "../login"
}

async function locateUserInfo(){
    window.scrollTo(0, 0);
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'))
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

locateUserInfo()