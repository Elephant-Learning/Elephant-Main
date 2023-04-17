const tags = [];
let likedAnswers;

async function search(){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    if(document.getElementById("desktop-navbar-input").value === ""){
        const response = await fetch('https://elephantsuite-rearend.herokuapp.com/answers/getAnswersForUser?userId=' + savedUserId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            mode: 'cors'
        })

        const content = await response.json();

        for(let i = 0; i < content.context.answers.length; i++){
            createQuestion(content.context.answers[i].title, content.context.answers[i].tags, content.context.answers[i].description, content.context.answers[i].authorName, content.context.answers[i].authorPfpId, computeTime(content.context.answers[i].created), content.context.answers[i].comments.length, content.context.answers[i].numberOfLikes, likedAnswers.includes(content.context.answers[i].id), content.context.answers[i].id)
        }
    } else {
        const response = await fetch('https://elephantsuite-rearend.herokuapp.com/answers/searchByName?name=' + document.getElementById("desktop-navbar-input").value, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            mode: 'cors'
        })

        const content = await response.json();
        console.log(content)

        for(let i = 0; i < content.context.answers.length; i++){
            createQuestion(content.context.answers[i].title, content.context.answers[i].tags, content.context.answers[i].description, content.context.answers[i].authorName, content.context.answers[i].authorPfpId, computeTime(content.context.answers[i].created), content.context.answers[i].comments.length, content.context.answers[i].numberOfLikes, user.elephantAnswersLiked.includes(content.context.answers[i].id), content.context.answers[i].id)
        }
    }
}

async function heartDeck(deckId, image){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    if(image.classList.contains("unliked")){
        image.src = "../../flip/icons/filled_heart.png";
        image.classList.remove("unliked");
        image.classList.add("liked");

        const response = await fetch('https://elephantsuite-rearend.herokuapp.com/answers/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                userId: savedUserId,
                answerId: deckId
            }),
            mode: 'cors'
        })

        const context = await response.json();
        document.getElementById("ask-heart-" + deckId).innerHTML = parseInt(document.getElementById("ask-heart-" + deckId).textContent) + 1;
    } else {
        image.src = "../../flip/icons/unfilled_heart.png";
        image.classList.add("unliked");
        image.classList.remove("liked");

        const response = await fetch('https://elephantsuite-rearend.herokuapp.com/answers/unlike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                userId: savedUserId,
                answerId: deckId
            }),
            mode: 'cors'
        })

        const context = await response.json();
        document.getElementById("ask-heart-" + deckId).innerHTML = parseInt(document.getElementById("ask-heart-" + deckId).textContent) - 1;
    }
}

function createQuestion(title, tagsArray, text, authorName, authorPfpId, timeAgo, commentAmount, likeAmount, liked, id){
    let newDiv = document.createElement('div');

    let heartDiv = document.createElement('div');
    let heartImg = document.createElement('img');
    let heartText = document.createElement('p');

    heartText.innerHTML = likeAmount;
    heartText.id = "ask-heart-" + id;

    if(liked) {
        heartImg.src = "../../flip/icons/filled_heart.png";
        heartImg.classList.add("liked");
    } else {
        heartImg.src = "../../flip/icons/unfilled_heart.png";
        heartImg.classList.add("unliked");
    }

    heartImg.addEventListener("click", function(e){
        e.stopPropagation();
        heartDeck(id, this);
    });
    //heartImg.setAttribute("onclick", "heartDeck(" + id + ", this)")
    heartDiv.append(heartImg, heartText);

    let mainDiv = document.createElement('div');
    let questionTitle = document.createElement('h1');
    let questionText = document.createElement('p');
    let tagsList = document.createElement('div');
    let breakDiv = document.createElement('div');
    let footerDiv = document.createElement('div');

    questionTitle.innerHTML = title;
    questionText.innerHTML = text;

    for(let i = 0; i < tagsArray.length; i++){
        let newTag = document.createElement('p');
        newTag.innerHTML = tags[tagsArray[i]];
        tagsList.appendChild(newTag);
    }

    let authorDiv = document.createElement('div');
    let authorImg = document.createElement('img');
    let authorNameP = document.createElement('p');
    let timeAgoP = document.createElement('p');

    authorImg.src = "../../icons/avatars/" + authorPfpId + ".png";
    authorNameP.innerHTML = authorName;
    timeAgo.innerHTML = timeAgo;

    authorDiv.append(authorImg, authorNameP, timeAgoP);

    let commentDiv = document.createElement('div');
    let commentImg = document.createElement('img');
    let commentText = document.createElement('p');

    commentImg.src = "./icons/comment.png";
    commentText.innerHTML = commentAmount;

    commentDiv.append(commentImg, commentText);
    footerDiv.append(authorDiv, commentDiv);

    mainDiv.append(questionTitle, questionText, tagsList, breakDiv, footerDiv);
    newDiv.append(heartDiv, mainDiv);
    newDiv.addEventListener("click", function(e){
        location.href = `../question/?id=${id}`
    })
    newDiv.setAttribute("onclick", "location.href = '../question/?id=" + id + "'")

    document.getElementById('desktop-answers-main').appendChild(newDiv);
}

async function completeEntry(){
    if(document.getElementById("tags-modal-button").classList.contains("inactive-modal-button")) return;

    let tagsArray = [];

    document.querySelectorAll(".active-tag").forEach(function(element){
        tagsArray.push(element.id.split("-")[1]);
    });

    let savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    await fetch('https://elephantsuite-rearend.herokuapp.com/answers/setUserTags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            tags: tagsArray,
            userId: savedUserId
        }),
        mode: 'cors'
    })

    document.getElementById("tags-modal-bg").classList.add("inactive-modal");
}

function selectTag(index){
    if(document.querySelectorAll(".tag-item")[index].classList.contains("active-tag")){
        document.querySelectorAll(".tag-item")[index].classList.remove("active-tag")
    } else document.querySelectorAll(".tag-item")[index].classList.add("active-tag")

    if(document.querySelectorAll(".active-tag").length >= 3) document.getElementById("tags-modal-button").classList = "";
    else document.getElementById("tags-modal-button").classList = "inactive-modal-button";
}

function parseData(tagsData){
    for(let i = 0; i < tagsData.tags.length; i++){
        let newDiv = document.createElement('div');
        newDiv.innerHTML = tagsData.tags[i];
        newDiv.setAttribute("onclick", "selectTag(" + i + ")");
        newDiv.id = "tagItem-" + i;
        newDiv.classList.add("tag-item");
        document.getElementById("tags-list").appendChild(newDiv);

        tags.push(tagsData.tags[i]);
    }
}

async function deleteQuestion(id){
    await fetch('https://elephantsuite-rearend.herokuapp.com/answers/deleteAnswer?id=' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    document.getElementById("your-answer-" + id).remove();
}

function initializeTags(){
    fetch("../answers.json").then(function(response){return response.json();}).then(function(data){parseData(data)}).catch(function(error){console.log(`Error: ${error}`)})
}

async function initialize(user){
    if(user.status === "FAILURE" || user.error === "Bad Request") {
        location.href = "../../login"
    } else user = user.context.user;
    console.log(user);

    const emojis_refactored = ["confused", "cool", "happy", "laugh", "nerd", "neutral", "unamused", "uwu", "wink"];

    if(user.type !== "EMPLOYEE"){
        document.getElementById('desktop-sidebar-employee').classList.add('inactive-modal')
    }

    if(user.elephantAnswersTags.length <= 0) {
        document.getElementById("tags-modal-bg").classList.remove("inactive-modal");
    } initializeTags();

    for(let i = 0; i < user.answers.length; i++){
        let newDiv = document.createElement("div");
        let imageDiv = document.createElement("div");
        let image = document.createElement("img");

        image.src = "../icons/ask.png";
        imageDiv.appendChild(image);

        let textDiv = document.createElement("div");
        let header = document.createElement("h1");
        let para = document.createElement("p");

        header.innerHTML = user.answers[i].title;
        if(user.answers[i].answered) para.innerHTML = "Status: Answered";
        else para.innerHTML = "Status: Unanswered";

        textDiv.append(header, para);

        let optionsDiv = document.createElement("div");
        let deleteImg = document.createElement("img");

        deleteImg.src = "./icons/trash.png";

        deleteImg.addEventListener("click", function(e){
            e.stopPropagation();

            deleteQuestion(user.answers[i].id);
        })

        optionsDiv.appendChild(deleteImg);

        newDiv.append(imageDiv, textDiv, optionsDiv);
        newDiv.setAttribute("onclick", "location.href = '../question/?id=" + user.answers[i].id + "'")
        newDiv.id = "your-answer-" + user.answers[i].id;

        document.getElementById("your-answers").appendChild(newDiv);
    }

    likedAnswers = user.elephantAnswersLiked;

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png";
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('desktop-profile-user-img').src = "../../flip/icons/emojis/" + emojis_refactored[Math.floor(Math.random() * emojis_refactored.length)] + ".png"
    document.getElementById("answers-score-header").innerHTML = user.elephantAnswersScore;

    closeLoader();
    search();

    document.getElementById('loading-div').classList.add('inactive-modal');
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
    const loadingText = ["Loading your custom feed. Sit tight!", "Your daily dose of problems coming right up!", "Man students have so many issues... it's amusing!", "Fetching your updated feed. Give me a moment.", "Do people even read this text?", "Everyone cares about the students' problems.. nobody asks about mine :("]

    document.getElementById('loading-text').innerHTML = loadingText[Math.floor(Math.random() * loadingText.length)];

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
    initialize(context)
}

locateUserInfo();