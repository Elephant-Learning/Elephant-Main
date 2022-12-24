function heartDeck(deckId, image){
    if(image.classList.contains("unliked")){
        image.src = "../../flashcards/icons/filled_heart.png";
        image.classList.remove("unliked");
        image.classList.add("liked");
    } else {
        image.src = "../../flashcards/icons/unfilled_heart.png";
        image.classList.add("unliked");
        image.classList.remove("liked");
    }
}

function createQuestion(title, tagsArray, text, authorName, authorPfpId, timeAgo, commentAmount, likeAmount, liked){
    let newDiv = document.createElement('div');

    let heartDiv = document.createElement('div');
    let heartImg = document.createElement('img');
    let heartText = document.createElement('p');

    heartImg.src = "../../flashcards/icons/unfilled_heart.png";
    heartText.innerHTML = likeAmount;

    if(liked) heartImg.classList.add("liked");
    else heartImg.classList.add("unliked");

    heartImg.setAttribute("onclick", "heartDeck(0, this)")

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

    document.getElementById('desktop-answers-main').appendChild(newDiv);
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

    createQuestion("Why did the chicken cross the road?", [2,3,5,6], "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex iusto molestias suscipit. Amet magni non recusandae. Ab ad aliquid commodi consequatur corporis doloremque ea eos error est et eum ex facere harum impedit incidunt itaque iusto, labore laborum magni maiores minus nemo nobis nostrum odio optio perspiciatis provident quas quibusdam rem sunt tempora tenetur totam velit. Atque, cupiditate ratione. Nemo odit quam quis reprehenderit. Alias consequatur magni neque praesentium totam. Animi consequatur ipsam perferendis perspiciatis quisquam voluptas, voluptatem. Eligendi, expedita!", "Ronak Kothari", 45, "Posted 12+ Hours Ago", 50, 123, false);
    createQuestion("Why did your mother sleep with my dad?", [2,5,6], "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex iusto molestias suscipit. Amet magni non recusandae. Ab ad aliquid commodi consequatur corporis doloremque ea eos error est et eum ex facere harum impedit incidunt itaque iusto, labore laborum magni maiores minus nemo nobis nostrum odio optio perspiciatis provident quas quibusdam rem sunt tempora tenetur totam velit. Atque, cupiditate ratione. Nemo odit quam quis reprehenderit. Alias consequatur magni neque praesentium totam. Animi consequatur ipsam perferendis perspiciatis quisquam voluptas, voluptatem. Eligendi, expedita!", "Ronak Kothari", 45, "Posted 1 Week Ago", 50, 123, false);
    createQuestion("How to add two letters?", [2,4,6], "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex iusto molestias suscipit. Amet magni non recusandae. Ab ad aliquid commodi consequatur corporis doloremque ea eos error est et eum ex facere harum impedit incidunt itaque iusto, labore laborum magni maiores minus nemo nobis nostrum odio optio perspiciatis provident quas quibusdam rem sunt tempora tenetur totam velit. Atque, cupiditate ratione. Nemo odit quam quis reprehenderit. Alias consequatur magni neque praesentium totam. Animi consequatur ipsam perferendis perspiciatis quisquam voluptas, voluptatem. Eligendi, expedita!", "Shrihun Sankepally", 41, "Posted 2 Weeks Ago", 50, 123, false);
    createQuestion("How to write a good question title?", [1,3,4,5], "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex iusto molestias suscipit. Amet magni non recusandae. Ab ad aliquid commodi consequatur corporis doloremque ea eos error est et eum ex facere harum impedit incidunt itaque iusto, labore laborum magni maiores minus nemo nobis nostrum odio optio perspiciatis provident quas quibusdam rem sunt tempora tenetur totam velit. Atque, cupiditate ratione. Nemo odit quam quis reprehenderit. Alias consequatur magni neque praesentium totam. Animi consequatur ipsam perferendis perspiciatis quisquam voluptas, voluptatem. Eligendi, expedita!", "Shrihun Sankepally", 41, "Posted 3+ Hours Ago", 50, 123, false);
    createQuestion("Will making marijuana illegal solve the drug issues America is facing?", [1,3,4], "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex iusto molestias suscipit. Amet magni non recusandae. Ab ad aliquid commodi consequatur corporis doloremque ea eos error est et eum ex facere harum impedit incidunt itaque iusto, labore laborum magni maiores minus nemo nobis nostrum odio optio perspiciatis provident quas quibusdam rem sunt tempora tenetur totam velit. Atque, cupiditate ratione. Nemo odit quam quis reprehenderit. Alias consequatur magni neque praesentium totam. Animi consequatur ipsam perferendis perspiciatis quisquam voluptas, voluptatem. Eligendi, expedita!", "Ronak Kothari", 45, "Posted 3 Weeks Ago", 50, 123, false);

    document.getElementById('loading-div').classList.add('inactive-modal');
}

async function locateUserInfo(){
    const loadingText = ["Loading your custom feed. Sit tight!", "Your daily dose of problems coming right up!", "Man students have so many issues... it's amusing!", "Fetching your updated feed. Give me a moment.", "Do people even read this text?", "Everyone cares about the students' problems.. nobody asks about mine :("]

    document.getElementById('loading-text').innerHTML = loadingText[Math.floor(Math.random() * loadingText.length)];

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