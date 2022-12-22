async function initialize(user){
    if(user.status === "FAILURE" || user.error === "Bad Request") {
        location.href = "../../../login"
    } else user = user.context.user;
    console.log(user);

    const emojis_refactored = ["confused", "cool", "happy", "laugh", "nerd", "neutral", "unamused", "uwu", "wink"];

    if(user.type !== "EMPLOYEE"){
        document.getElementById('desktop-sidebar-employee').classList.add('inactive-modal')
    }

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png";
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('desktop-profile-user-img').src = "../../flashcards/icons/emojis/" + emojis_refactored[Math.floor(Math.random() * emojis_refactored.length)] + ".png"

    createUserQuestion("Why is Napoleon respected in French History", 0, 0);
    createUserQuestion("How to calculate the derivative of an equation?", 1, 1);
    createUserQuestion("How to program using DrawingPanel", 2, 2);

    createQuestion("Why did the chicken cross the road?", [2,3,5,6], "2 Weeks Ago");
    createQuestion("Why did your mother sleep with my dad?", [2,5,6], "2 Weeks Ago");
    createQuestion("How to add two letters?", [2,4,6], "2 Weeks Ago");
    createQuestion("How to write a good question title?", [1,3,4,5], "2 Weeks Ago");
    createQuestion("Will making marijuana illegal solve the drug issues America is facing?", [1,3,4], "2 Weeks Ago");

}

async function locateUserInfo(){

    let savedUserId;

    try{
        savedUserId = JSON.parse(localStorage.getItem('savedUserId'))
    } catch {
        location.href = "../../../login";
    }

    if(!savedUserId  && savedUserId !== 0) location.href = "../../../login";

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