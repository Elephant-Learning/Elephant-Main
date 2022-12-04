function createUserQuestion(title, status, id){
    let statusToClass = ["unanswered", "new-updates", "resolved"];
    let statusToText = ["Pending Answer", "New Updates", "Resolved"];

    let newDiv = document.createElement('div')
    newDiv.classList.add("desktop-answers-sidebar-element");
    newDiv.classList.add(statusToClass[status]);
    newDiv.setAttribute("onclick", "location.href = '../question/?" + id + "'")

    let titleDiv = document.createElement('div');
    let titleImg = document.createElement('img');
    let titleHeader = document.createElement('h1');

    titleImg.setAttribute('src', "../icons/answers.png");
    titleHeader.innerHTML = title;
    //titleDiv.append(titleImg, titleHeader);
    titleDiv.appendChild(titleHeader);

    let statusDiv = document.createElement('div');
    statusDiv.innerHTML = statusToText[status];

    let optionsDiv = document.createElement('div');
    let editImg = document.createElement('img');
    let deleteImg = document.createElement('img');

    editImg.setAttribute('src', "../../flashcards/editor/icons/edit.png");
    deleteImg.setAttribute('src', "../../flashcards/icons/delete.png");

    optionsDiv.append(editImg, deleteImg);

    newDiv.append(titleDiv, statusDiv, optionsDiv);

    document.getElementById('desktop-answers-sidebar-list').appendChild(newDiv);
}

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