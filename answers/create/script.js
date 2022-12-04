function functionNameCuzIMTOOLAZY(elementSearch){
    let elements = ['p', 'h1', 'h2', 'h3'];

    console.log(elementSearch);

    document.querySelectorAll('.text-element-btn').forEach(function(element){
        if(element.classList.contains("active")) element.classList.remove('active');
    })

    document.querySelectorAll('.text-element-btn')[elements.indexOf(elementSearch)].classList.add('active');
}

function addElementToEditor(elementType){
    let newElement = document.createElement(elementType);
    newElement.innerHTML = "Su madre";

    newElement.setAttribute("onclick", "functionNameCuzIMTOOLAZY('" + elementType + "')")

    document.getElementById('question-text-editor').appendChild(newElement);
}

function leaveEditor(){
    location.href = "../dashboard";
}

function askQuestion(){

}

async function initialize(user){
    if(user.status === "FAILURE" || user.error === "Bad Request") {
        location.href = "../../../login"
    } else user = user.context.user;
    console.log(user);

    const emojis_refactored = ["confused", "cool", "happy", "laugh", "nerd", "neutral", "unamused", "uwu", "wink"];

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png";
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('desktop-profile-user-img').src = "../../flashcards/icons/emojis/" + emojis_refactored[Math.floor(Math.random() * emojis_refactored.length)] + ".png"
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
    await initialize(context)
}

locateUserInfo();