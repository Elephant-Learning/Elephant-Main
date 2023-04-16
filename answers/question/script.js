let questionId;
let questionAuthorId;
let questionTitle;

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

        const response2 = await fetch('https://elephantsuite-rearend.herokuapp.com/notifications/sendAnsweredAnswer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                type: "ANSWER_ANSWER",
                senderId: savedUserId,
                recipientId: questionAuthorId,
                answerId: questionId,
                commentId: context.context.comment.id,
                message: questionTitle
            }),
            mode: 'cors'
        })

        const context2 = await response2.json();
        console.log(context2);

        context.context.comment.answerAuthorId = questionAuthorId;
        context.context.comment.answerId = questionId;

        createComment(context.context.comment);
    }
}

async function likeComment(commentId){
    if(!document.getElementById(`parent-comment-heart-${commentId}`).classList.contains("liked")){
        let savedUserId = JSON.parse(localStorage.getItem('savedUserId'))

        console.log(commentId, savedUserId);
        const response = await fetch('https://elephantsuite-rearend.herokuapp.com/answers/likeComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                userId: savedUserId,
                commentId: commentId
            }),
            mode: 'cors'
        })

        const context = await response.json();
        console.log(context);

        if(context.status === "SUCCESS"){
            document.getElementById(`parent-comment-heart-${commentId}`).src = "../../flashcards/icons/filled_heart.png"
            document.getElementById(`parent-comment-heart-${commentId}`).classList.add("liked");
            document.getElementById(`parent-comment-like-number-${commentId}`).innerHTML = (parseInt(document.getElementById(`parent-comment-like-number-${commentId}`).textContent) + 1).toString();
        }
    } else {
        let savedUserId = JSON.parse(localStorage.getItem('savedUserId'))

        console.log(commentId, savedUserId);
        const response = await fetch('https://elephantsuite-rearend.herokuapp.com/answers/unlikeComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                userId: savedUserId,
                commentId: commentId
            }),
            mode: 'cors'
        })

        const context = await response.json();
        console.log(context);

        if(context.status === "SUCCESS"){
            document.getElementById(`parent-comment-heart-${commentId}`).src = "../../flashcards/icons/unfilled_heart.png"
            document.getElementById(`parent-comment-heart-${commentId}`).classList.remove("liked");
            document.getElementById(`parent-comment-like-number-${commentId}`).innerHTML = (parseInt(document.getElementById(`parent-comment-like-number-${commentId}`).textContent) - 1).toString();
        }
    }
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

    if(context.status === "SUCCESS") location.reload();
}

async function deleteComment(commentId){
    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/answers/deleteComment?id=' + commentId, {
        method: 'DELETE',
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

    if(context.status === "SUCCESS") document.getElementById(`parent-comment-${commentId}`).remove();
}

async function answerQuestion(answerId, commentId, commenter){
    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/answers/setAnswered', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            commentId: commentId,
            answerId: answerId
        }),
        mode: 'cors'
    })

    await fetch('https://elephantsuite-rearend.herokuapp.com/answers/increaseAnswersScore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            userId: commenter,
            score: 1
        }),
        mode: 'cors'
    });

    const context = await response.json();
    console.log(context);

    location.reload();
}

async function editComment(commentId){
    if(document.getElementById(`parent-comment-edit-input-${commentId}`).value >= 10) return;

    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/answers/editComment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            commentId: commentId,
            description: document.getElementById(`parent-comment-edit-input-${commentId}`).value
        }),
        mode: 'cors'
    })

    const context = await response.json();

    if(context.status === "SUCCESS") location.reload();
}

function createComment(params){
    let newDiv = document.createElement('div');
    let savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    let imageDiv = document.createElement("div");
    let mainImage = document.createElement("img");

    mainImage.src = `../../icons/avatars/${params.commenterPfpId}.png`
    imageDiv.appendChild(mainImage);

    let contentDiv = document.createElement("div");
    let nameDiv = document.createElement("div");
    let name = document.createElement("h6");

    name.innerHTML = params.commenterName;
    nameDiv.appendChild(name);

    if(params.finalAnswer){
        let newAnswered = document.createElement("h2");
        newAnswered.innerHTML = "Selected Answer";

        nameDiv.appendChild(newAnswered);
    }

    let mainContent = document.createElement("p");
    mainContent.innerHTML = params.description

    let optionsDiv = document.createElement("div");
    let heartImg = document.createElement("img");
    let likeNumbers = document.createElement("p");

    if(params.commentLiked){
        heartImg.src = "../../flashcards/icons/filled_heart.png";
        heartImg.classList.add("liked");
    } else {
        heartImg.src = "../../flashcards/icons/unfilled_heart.png";
        heartImg.classList.add("unliked")
    }


    likeNumbers.innerHTML = params.numberOfLikes;
    likeNumbers.id = `parent-comment-like-number-${params.id}`

    heartImg.classList.add("parent-comment-heart");
    heartImg.id = `parent-comment-heart-${params.id}`;

    heartImg.addEventListener("click", function(e){
        likeComment(params.id);
    });

    if(savedUserId === params.answerAuthorId && !params.questionAnswered){
        let checkImg = document.createElement("img");
        checkImg.src = "./icons/check.png";

        checkImg.addEventListener("click", function(e){
            answerQuestion(params.answerId, params.id, params.commenterId)
        })

        optionsDiv.appendChild(checkImg);
    }

    optionsDiv.append(heartImg, likeNumbers);
    optionsDiv.classList.add("parent-comment-options-div")

    let commentImg = document.createElement("img");
    commentImg.src = "../dashboard/icons/comment.png";
    commentImg.classList.add("parent-comment-reply");

    commentImg.addEventListener("click", function(e){
        document.getElementById(`parent-comment-reply-input-div-${params.id}`).classList.toggle("inactive-modal");
    });

    optionsDiv.appendChild(commentImg);

    if(savedUserId === params.commenterId && !params.questionAnswered){
        let editImg = document.createElement("img");
        let deleteImg = document.createElement("img");

        editImg.src = "../../flashcards/editor/icons/edit.png";
        deleteImg.src = "../dashboard/icons/trash.png";

        deleteImg.addEventListener("click", function(e){
            deleteComment(params.id);
        });

        editImg.addEventListener("click", function(e){
            mainContent.remove();

            let newBodyEditDiv = document.createElement("div");
            let newBodyInput = document.createElement("input");
            let newBodyButton = document.createElement("button")

            newBodyInput.value = params.description;
            newBodyInput.id = `parent-comment-edit-input-${params.id}`
            newBodyButton.innerHTML = "Confirm Edits";

            newBodyButton.addEventListener("click", function(e){
                editComment(params.id);
            });

            newBodyEditDiv.append(newBodyInput, newBodyButton);
            newBodyEditDiv.classList.add("parent-comment-edit-div");

            contentDiv.insertBefore(newBodyEditDiv, optionsDiv);
            newBodyInput.focus();
        })

        optionsDiv.append(editImg, deleteImg);
    }

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
    newDiv.id = "parent-comment-" + params.id;
    document.getElementById("parent-comments-list").appendChild(newDiv);
}

function sortArrayDescending(array) {
    var done = false;
    while (!done) {
        done = true;
        for (var i = 1; i < array.length; i += 1) {
            if (array[i - 1].numberOfLikes > array[i].numberOfLikes) {
                done = false;
                var tmp = array[i - 1];
                array[i - 1] = array[i];
                array[i] = tmp;
            }
        }
    }

    return array;
}

function reverseArr(input) {
    var ret = new Array;
    for(var i = input.length-1; i >= 0; i--) {
        ret.push(input[i]);
    }
    return ret;
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

    questionAuthorId = context.context.answer.authorId;
    questionTitle = context.context.answer.title;

    document.getElementById("question-title").innerHTML = questionTitle;

    if(context.context.answer.answered){
        let newSpan = document.createElement("span");
        newSpan.innerHTML = "Answered";

        document.getElementById("question-title").appendChild(newSpan);
    }

    document.getElementById("question-author").innerHTML = context.context.answer.authorName;
    document.getElementById("question-body").innerHTML = context.context.answer.description;
    document.getElementById("question-author-pfp").src = `../../icons/avatars/${context.context.answer.authorPfpId}.png`
    document.getElementById("your-comment-pfp").src = `../../icons/avatars/${user.pfpId}.png`
    document.getElementById("parent-comments-amount").innerHTML = `Answers: ${context.context.answer.comments.length}`;
    document.getElementById("edit-btn").setAttribute("href", `../create/?id=${context.context.answer.id}`)

    let comments = context.context.answer.comments;

    comments = sortArrayDescending(comments);
    comments = reverseArr(comments);

    console.log(comments)

    for(let i = 0; i < comments.length; i++){
        if(comments[i].finalAnswer){
            let temp = comments[0];
            comments[0] = comments[i];
            comments[i] = temp;

            break;
        }
    }

    let commentIds = [];

    for(let i = 0; i < comments.length; i++){
        let comment = comments[i];
        comment.answerAuthorId = context.context.answer.authorId;
        comment.answerId = context.context.answer.id;
        comment.questionAnswered = context.context.answer.answered;
        comment.commentLiked = user.commentsLiked.includes(comment.id);

        createComment(comment);
        if(!commentIds.includes(comment.commenterId)){
            commentIds.push(comment.commenterId);

            let newDiv = document.createElement("div");
            let newImg = document.createElement("img");
            let newName = document.createElement("h1");

            newImg.src = `../../icons/avatars/${comment.commenterPfpId}.png`;
            newName.innerHTML = comment.commenterName;

            newDiv.append(newImg, newName);
            document.getElementById("top-contributors").appendChild(newDiv);
        }
    }

    if(context.context.answer.answered) document.getElementById("parent-comments-input-div").remove();
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