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

const names = ["Random Student"]

for(let i = 0; i < 73; i++){
    addStudents(names[Math.floor(Math.random() * names.length)], "Elephant Student");
}