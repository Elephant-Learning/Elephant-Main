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

function elemClicked(index){
    if(document.querySelectorAll('.answers-elem')[index].classList.contains('active-answers-elem')){
        console.log("wow")
    } else {
        try{document.querySelector('.active-answers-elem').classList.remove('active-answers-elem')} catch(e){console.log(e)}
        document.querySelectorAll('.answers-elem')[index].classList.add("active-answers-elem");
    }
}

function createQuestion(name, tagsList, dateModified){
    let newDiv = document.createElement('div');
    newDiv.classList.add("answers-elem");
    newDiv.setAttribute("onclick", "elemClicked(" + document.querySelectorAll('.answers-elem').length + ")")

    let newImg = document.createElement('img');
    let newHeader = document.createElement('h1');

    newImg.setAttribute('src', "../icons/answers.png");
    newHeader.innerHTML = name;

    let newTagsDiv = document.createElement('div');

    for(let i = 0; i < tagsList.length; i++){
        let newPara = document.createElement('p');
        newPara.innerHTML = tags[tagsList[i]];
        newTagsDiv.appendChild(newPara);
    }

    let datePara = document.createElement('p');
    datePara.innerHTML = dateModified

    newDiv.append(newImg, newHeader, newTagsDiv, datePara);
    document.getElementById('answers-list').appendChild(newDiv);
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