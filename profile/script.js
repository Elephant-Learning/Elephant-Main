let selectedProfile = 0;

async function toggleAvatarModal(){
    if(document.getElementById('desktop-avatar-container').classList.contains('inactive-modal')){
        document.getElementById('desktop-avatar-container').classList.remove('inactive-modal')
    } else {
        document.getElementById('desktop-avatar-container').classList.add('inactive-modal');

        const savedUserId = JSON.parse(localStorage.getItem('savedUserId'))
        const response = await fetch('https://elephant-rearend.herokuapp.com/misc/pfpid', {
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

function selectPfp(index){
    selectedProfile = index;
    document.getElementById('desktop-avatar-current').src = "../../icons/avatars/" + index + ".png";
    try{document.querySelector('.selected-avatar-img').classList.remove('selected-avatar-img');} catch{}
    document.querySelectorAll('.avatar-img')[selectedProfile].classList.add('selected-avatar-img')
}

function initialize(user){
    if(user.status === "FAILURE") {
        location.href = "../../login"
    } else user = user.context.user;

    if(user.type !== "EMPLOYEE"){
        document.getElementById('desktop-sidebar-employee').classList.add('inactive-modal')
    }

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png"
    document.getElementById('my-profile-img').src = "../../icons/avatars/" + user.pfpId + ".png"
    document.getElementById('desktop-avatar-current').src = "../../icons/avatars/" + user.pfpId + ".png"
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('my-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('my-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('my-profile-email').innerHTML = user.email;

    selectedProfile = user.pfpId;

    let element = document.getElementById('desktop-avatar-selector-main');

    while(element.lastChild) {
        element.lastChild.remove();
    }

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
    const response = await fetch('https://elephant-rearend.herokuapp.com/registration/delete?id=' + savedUserId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    location.href = "../../login"
}

async function locateUserInfo(){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'))
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

locateUserInfo()