function alterEditor(alterIndex){
    if(alterIndex === 0){
        textField.document.execCommand("bold", false, null);
        document.querySelectorAll(".sidebar-elem-btn")[alterIndex].classList.toggle("active");
    } else if(alterIndex === 1){
        textField.document.execCommand("italic", false, null);
        document.querySelectorAll(".sidebar-elem-btn")[alterIndex].classList.toggle("active");
    } else if(alterIndex === 2){
        textField.document.execCommand("underline", false, null);
        document.querySelectorAll(".sidebar-elem-btn")[alterIndex].classList.toggle("active");
    } else if(alterIndex === 3){
        textField.document.execCommand("insertUnorderedList", false, null);
        document.querySelectorAll(".sidebar-elem-btn")[alterIndex].classList.toggle("active");

        if(document.querySelectorAll(".sidebar-elem-btn")[4].classList.contains("active")) document.querySelectorAll(".sidebar-elem-btn")[4].classList.remove("active");
    } else if(alterIndex === 4){
        textField.document.execCommand("insertOrderedList", false, null);
        document.querySelectorAll(".sidebar-elem-btn")[alterIndex].classList.toggle("active");

        if(document.querySelectorAll(".sidebar-elem-btn")[3].classList.contains("active")) document.querySelectorAll(".sidebar-elem-btn")[3].classList.remove("active");
    }

    console.log(alterIndex);
}

function recalculateTextfieldSize(){
    textField.document.body.style.fontSize = getComputedStyle(document.querySelector(':root')).getPropertyValue("--size") * 12 + "px";
}

function leaveEditor(){
    location.href = "../dashboard";
}

async function askQuestion(){
    let savedUserId = JSON.parse(localStorage.getItem('savedUserId'))

    const content = document.getElementById("question-text-editor").contentDocument.body.innerHTML;
    console.log(content);

    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/answers/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            title: document.getElementById('question-header').value,
            description: content,
            userId: savedUserId
        }),
        mode: 'cors'
    })

    const context = await response.json();
    console.log(context);
}

async function initialize(user){
    if(user.status === "FAILURE" || user.error === "Bad Request") {
        location.href = "../../login"
    } else user = user.context.user;
    console.log(user);

    textField.document.designMode = "On";
    textField.document.body.style.fontFamily = '"Montserrat", sans-serif';
    recalculateTextfieldSize();
    textField.document.body.style.color = "gray";

    for(let i = 0; i < document.querySelectorAll('.sidebar-elem-btn').length; i++){
        document.querySelectorAll('.sidebar-elem-btn')[i].addEventListener("click", function(e){
            e.preventDefault();
            e.stopPropagation();
            alterEditor(i);
        })
    }

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