const emojis = ["angry", "confused", "cool", "cry", "happy", "laugh", "nerd", "neutral", "sad", "unamused", "uwu", "wink"];
const names = ["Random Student"];

function addStudents(name, accType){
    let mainDiv = document.createElement('div');
    let profileImg = document.createElement('img');
    let textDiv = document.createElement('div');
    let nameText = document.createElement('h1');
    let accTypeText = document.createElement('p');
    let plusImg = document.createElement('img');

    mainDiv.classList.add('chat-member-div');
    profileImg.src = "../icons/avatars/" + Math.floor(Math.random() * 47) + ".png";
    nameText.innerHTML = name;
    accTypeText.innerHTML = accType;
    textDiv.append(nameText, accTypeText);
    plusImg.src = "./icons/plus.png";
    mainDiv.append(profileImg, textDiv, plusImg);
    document.getElementById('chat-members').appendChild(mainDiv);
}

function createMessage(outgoing, image, name, time, message){
    let parentDiv = document.createElement('div');
    let mainDiv = document.createElement('div');
    let profileImg = document.createElement('img');
    let textDiv = document.createElement('div');
    let nameText = document.createElement('h1');
    let timeSpan = document.createElement('span')
    let messageText = document.createElement('p');

    nameText.innerHTML = name;
    timeSpan.innerHTML = time;
    nameText.appendChild(timeSpan);

    messageText.innerHTML = message;
    textDiv.append(nameText, messageText);

    profileImg.src = "../icons/avatars/" + image + ".png";
    mainDiv.append(profileImg, textDiv);
    parentDiv.appendChild(mainDiv);

    if(outgoing) parentDiv.classList.add('outgoing_message');
    else parentDiv.classList.add('incoming_message');
    parentDiv.classList.add('text-message');

    document.getElementById('chat-window').appendChild(parentDiv);
}

function initialize(){
    for(let i = 0; i < 73; i++){
        addStudents(names[Math.floor(Math.random() * names.length)], "Elephant Student");
    }

    for(let i = 0; i < 100; i++){
        createMessage(Boolean(Math.round(Math.random())), Math.floor(Math.random() * 47), names[Math.floor(Math.random() * names.length)], "10:02 A.M.", "Some Random Message")
    }
    document.getElementById('emojis-btn').src = "./icons/emojis/" + emojis[Math.floor(Math.random() * emojis.length)] + ".png"
}


function textAreaAdjust(element) {
    element.style.height = "1px";
    element.style.height = "calc(var(--size) * " + (element.scrollHeight) +"px)";
}

initialize()