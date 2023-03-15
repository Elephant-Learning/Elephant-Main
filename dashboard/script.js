async function initialize(user){
    if(user.status === "FAILURE") {
        location.href = "../login"
    } else user = user.context.user;

    if(user.type === "ADMIN"){
        document.getElementById('desktop-sidebar-employee').classList.remove('inactive-modal')
    }

    //console.log(user);

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png"
    document.getElementById('profile-image').src = "../../icons/avatars/" + user.pfpId + ".png"
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('profile-desc').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();

    if(user.type == "INDIVIDUAL") document.getElementById("profile-banner").classList.add("personal-banner");
    else if(user.type == "STUDENT") document.getElementById("profile-banner").classList.add("community-banner");
    else if(user.type == "INSTRUCTOR") document.getElementById("profile-banner").classList.add("shared-banner");
    else document.getElementById("profile-banner").classList.add("other-banner");

    await notificationsManager(user);
    toggleNotificationTab(0);
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