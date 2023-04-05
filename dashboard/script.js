async function initialize(user){
    if(user.status === "FAILURE") {
        location.href = "../login"
    } else user = user.context.user;

    if(user.type === "ADMIN"){
        document.getElementById('desktop-sidebar-employee').classList.remove('inactive-modal')
    }

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

    if(user.type === "INDIVIDUAL") document.getElementById("profile-banner").classList.add("personal-banner");
    else if(user.type === "STUDENT") document.getElementById("profile-banner").classList.add("community-banner");
    else if(user.type === "INSTRUCTOR") document.getElementById("profile-banner").classList.add("shared-banner");
    else document.getElementById("profile-banner").classList.add("other-banner");

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