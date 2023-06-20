function createTimelineEvent(params){
    /**
     * params = {
     *     name:string
     *     description:string
     *     start:double
     *     end:double
     * }
     */
}

function createTimelineMarker(){

}

function createItem(){

}

function openCreateModal(window){
    if(document.getElementById("edit-modal").classList.contains("inactive-modal")){
        document.getElementById("edit-modal").classList.remove("inactive-modal")
    }

    if(window === 0){
        if(document.getElementById("new-event-window").classList.contains("inactive-modal")) document.getElementById("new-event-window").classList.remove("inactive-modal");
        if(!document.getElementById("new-marker-window").classList.contains("inactive-modal")) document.getElementById("new-marker-window").classList.add("inactive-modal");
    } else if(window === 1){
        if(document.getElementById("new-marker-window").classList.contains("inactive-modal")) document.getElementById("new-marker-window").classList.remove("inactive-modal");
        if(!document.getElementById("new-event-window").classList.contains("inactive-modal")) document.getElementById("new-event-window").classList.add("inactive-modal");
    }
}

function closeCreateModal(){
    let eventNodes = document.getElementById("new-event-window").children;

    for(let i = 0; i < eventNodes.length; i++){
        if(eventNodes[i].nodeName === "INPUT" || eventNodes[i].nodeName === "TEXTAREA"){
            eventNodes[i].value = "";
        }
    }

    eventNodes = document.getElementById("new-marker-window").children;

    for(let i = 0; i < eventNodes.length; i++){
        if(eventNodes[i].nodeName === "INPUT" || eventNodes[i].nodeName === "TEXTAREA"){
            eventNodes[i].value = "";
        }
    }

    if(!document.getElementById("edit-modal").classList.contains("inactive-modal")){
        document.getElementById("edit-modal").classList.add("inactive-modal")
    }
}

async function initialize(user){
    if(user.status === "FAILURE" || user.error === "Bad Request") {
        location.href = "../../login"
    } else user = user.context.user;
    console.log(user);

    const emojis_refactored = ["confused", "cool", "happy", "laugh", "nerd", "neutral", "unamused", "uwu", "wink"];

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png";
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('desktop-profile-user-img').src = "../../flip/icons/emojis/" + emojis_refactored[Math.floor(Math.random() * emojis_refactored.length)] + ".png"
}

async function locateUserInfo(){
    let savedUserId;

    try{
        savedUserId = JSON.parse(localStorage.getItem('savedUserId'))
    } catch {
        location.href = "../../login";
    }

    if(!savedUserId  && savedUserId !== 0) location.href = "../../login";

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
    await initialize(context)
}

locateUserInfo();