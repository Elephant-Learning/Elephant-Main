let questionId;

async function postAnswer(){
    if(document.getElementById('parent-comments-input').value.length < 10){
        //throw small error here
        return;
    }

    let savedUserId = JSON.parse(localStorage.getItem('savedUserId'))

    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/answers/createComment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            userId: savedUserId,
            answerId: questionId,
            description: document.getElementById('parent-comments-input').value
        }),
        mode: 'cors'
    })

    const context = await response.json();
    console.log(context);

    if(context.status === "SUCCESS") {
        document.getElementById('parent-comments-input').value = "";
        createComment(context.context.comment);
    }
}

async function likeComment(commentId){
    let savedUserId = JSON.parse(localStorage.getItem('savedUserId'))

    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/answers/likeComment?id=' + commentId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            userId: savedUserId
        }),
        mode: 'cors'
    })

    const context = await response.json();
    console.log(context);
}

async function reply(commentId){
    if(document.getElementById(`parent-comment-reply-input-${commentId}`).value.length < 10){
        //throw small error here
        return;
    }

    let savedUserId = JSON.parse(localStorage.getItem('savedUserId'))

    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/answers/createReply', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            userId: savedUserId,
            commentId: commentId,
            text: document.getElementById(`parent-comment-reply-input-${commentId}`).value
        }),
        mode: 'cors'
    })

    const context = await response.json();
    console.log(context);

    if(context.status === "SUCCESS") document.getElementById(`parent-comment-reply-input-${commentId}`).value = "";
}

function createComment(params){
    let newDiv = document.createElement('div');

    let imageDiv = document.createElement("div");
    let mainImage = document.createElement("img");

    mainImage.src = `../../icons/avatars/${params.commenterPfpId}.png`
    imageDiv.appendChild(mainImage);

    let contentDiv = document.createElement("div");
    let nameDiv = document.createElement("div");
    let name = document.createElement("h6")

    name.innerHTML = params.commenterName;
    nameDiv.appendChild(name);

    let mainContent = document.createElement("p");
    mainContent.innerHTML = params.description;

    let optionsDiv = document.createElement("div");
    let heartImg = document.createElement("img");
    let likeNumbers = document.createElement("p");
    let commentImg = document.createElement("img");

    heartImg.src = "../../flashcards/icons/unfilled_heart.png";
    commentImg.src = "../dashboard/icons/comment.png";
    likeNumbers.innerHTML = params.numberOfLikes;

    heartImg.classList.add("parent-comment-heart");
    commentImg.classList.add("parent-comment-reply");

    heartImg.addEventListener("click", function(e){
        likeComment(params.id);
    });

    commentImg.addEventListener("click", function(e){
        document.getElementById(`parent-comment-reply-input-div-${params.id}`).classList.toggle("inactive-modal");
    });

    optionsDiv.append(heartImg, likeNumbers, commentImg);

    let inputDiv = document.createElement("div");
    let replyInput = document.createElement("input");
    let replyBtn = document.createElement("button");

    replyInput.id = `parent-comment-reply-input-${params.id}`;

    replyBtn.innerHTML = "Reply"
    replyBtn.addEventListener("click", function(e){
        reply(params.id);
    })

    inputDiv.append(replyInput, replyBtn);
    inputDiv.classList.add("parent-comment-reply-input");
    inputDiv.classList.add("inactive-modal");
    inputDiv.id = `parent-comment-reply-input-div-${params.id}`

    let repliesDiv = document.createElement("div");
    repliesDiv.classList.add("parent-comment-replies");

    for(let i = 0; i < params.replies.length; i++){
        let newCommentDiv = document.createElement("div");
        let replyAvatarDiv = document.createElement("div");
        let replyAvatar = document.createElement("img");

        replyAvatar.src = `../../icons/avatars/${params.replies[i].authorPfpId}.png`
        replyAvatarDiv.appendChild(replyAvatar);

        let replyDiv = document.createElement("div");
        let replyInfoDiv = document.createElement("div");
        let replyName = document.createElement("h6");

        replyName.innerHTML = params.replies[i].authorName;
        replyInfoDiv.append(replyName);

        let reply = document.createElement("p");
        reply.innerHTML = params.replies[i].text;

        replyDiv.append(replyInfoDiv, reply);

        newCommentDiv.append(replyAvatarDiv, replyDiv);
        repliesDiv.appendChild(newCommentDiv);
    }

    contentDiv.append(nameDiv, mainContent, optionsDiv, inputDiv, repliesDiv);
    newDiv.append(imageDiv, contentDiv);

    newDiv.classList.add("parent-comment")
    document.getElementById("parent-comments-list").appendChild(newDiv);
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
    document.getElementById('desktop-profile-user-img').src = "../../flashcards/icons/emojis/" + emojis_refactored[Math.floor(Math.random() * emojis_refactored.length)] + ".png"

    questionId = document.location.href.split("=")[1];

    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/answers/getById?id=' + questionId, {
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
    console.log(context);

    document.getElementById("question-title").innerHTML = context.context.answer.title;
    document.getElementById("question-body").innerHTML = context.context.answer.description;
    document.getElementById("question-author-pfp").src = `../../icons/avatars/${context.context.answer.authorPfpId}.png`
    document.getElementById("your-comment-pfp").src = `../../icons/avatars/${user.pfpId}.png`
    document.getElementById("parent-comments-amount").innerHTML = `Answers: ${context.context.answer.comments.length}`;

    for(let i = 0; i < context.context.answer.comments.length; i++){
        createComment(context.context.answer.comments[i])
    }
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