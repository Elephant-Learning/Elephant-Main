let selectedProfile = 0;

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

function toggleTagsModal(){

}

function toggleDeleteModal(){
    if(document.getElementById('delete-login-modal-bg').classList.contains("inactive-modal")){
        document.getElementById('confirm-password-delete-input').value = "";
        document.getElementById('delete-login-modal-bg').classList.remove("inactive-modal")
    } else {
        document.getElementById('delete-login-modal-bg').classList.add("inactive-modal")
    }
}

function selectPfp(index){
    selectedProfile = index;
    document.getElementById('desktop-avatar-current').src = "../../icons/avatars/" + index + ".png";
    try{document.querySelector('.selected-avatar-img').classList.remove('selected-avatar-img');} catch{}
    document.querySelectorAll('.avatar-img')[selectedProfile].classList.add('selected-avatar-img')
}

async function initialize(user){
    if(user.status === "FAILURE") {
        location.href = "../login"
    } else user = user.context.user;

    if(user.type === "EMPLOYEE"){
        document.getElementById('desktop-sidebar-employee').classList.remove('inactive-modal')
    }

    //console.log(user);

    removeAllChildNodes(document.getElementById('my-profile-friends'));
    removeAllChildNodes(document.getElementById('my-profile-decks'));

    let newHeader = document.createElement('h1');
    let newDeckHeader = document.createElement('h1')
    newDeckHeader.innerHTML = "Elephant Decks"
    newHeader.innerHTML = "Friends"

    document.getElementById('my-profile-friends').appendChild(newHeader);
    document.getElementById('my-profile-decks').appendChild(newDeckHeader);

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png"
    document.getElementById('my-profile-img').src = "../../icons/avatars/" + user.pfpId + ".png"
    document.getElementById('desktop-avatar-current').src = "../../icons/avatars/" + user.pfpId + ".png"
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('my-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('my-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('my-profile-email').innerHTML = user.email;
    document.getElementById('my-profile-location').innerHTML = COUNTRY_LIST[user.countryCode];
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

        document.getElementById('my-profile-friends').appendChild(newDiv);
    }

    for(let i = 0; i < user.decks.length; i++){
        let newDiv = document.createElement('div');
        let newImg = document.createElement('img');
        let newTxtDiv = document.createElement('div');
        let newName = document.createElement('h1');
        let newEmail = document.createElement('p');

        newImg.src = "../flashcards/icons/deck.png";
        newName.innerHTML = user.decks[i].name;
        newEmail.innerHTML =  "Created: " + computeTime(user.decks[i].created);

        newTxtDiv.append(newName, newEmail);
        newDiv.append(newImg, newTxtDiv);

        document.getElementById('my-profile-decks').appendChild(newDiv);
    }

    selectedProfile = user.pfpId;

    let element = document.getElementById('desktop-avatar-selector-main');

    while(element.lastChild) {
        element.lastChild.remove();
    }

    await notificationsManager(user);
    toggleNotificationTab(0);

    for(let i = 0; i < 47; i++){
        let newImg = document.createElement('img');
        newImg.src = "../../icons/avatars/" + i + ".png";
        newImg.setAttribute("onclick", "selectPfp(" + i + ")")
        newImg.classList.add('avatar-img')
        element.appendChild(newImg);
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