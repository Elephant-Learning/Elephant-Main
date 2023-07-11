function createTimeline(){
    location.href = '../editor/';
}

async function favoriteDeck(elem, id){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    if(elem.classList.contains('unloved')){
        elem.src = "./icons/filled_heart.png";
        elem.classList.remove('unloved');
        elem.classList.add('loved');

        const deckLikeResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/timeline/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                userId: savedUserId,
                timelineId: id
            }),
            mode: 'cors'
        })

        const deckLikeContext = await deckLikeResponse.json()

        console.log(deckLikeContext);

        try {
            document.getElementById('favorite-number-' + id).innerHTML = (parseInt(document.getElementById('favorite-number-' + id).textContent) + 1).toString();
        } catch (e){}
    } else {
        elem.src = "./icons/unfilled_heart.png";
        elem.classList.add('unloved');
        elem.classList.remove('loved')

        const response = await fetch('https://elephantsuite-rearend.herokuapp.com/timeline/unlike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                userId: savedUserId,
                timelineId: id
            }),
            mode: 'cors'
        })

        try {
            document.getElementById('favorite-number-' + id).innerHTML = (parseInt(document.getElementById('favorite-number-' + id).textContent) - 1).toString();
        } catch (e){}
    }
}

function editTimeline(id){
    location.href = "../editor/?timeline=" + id;
}

async function deleteDeck(id){
    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/timeline/delete?id=' + id, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'Content-Length, X-JSON',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        },
        method: 'DELETE',
        mode: 'cors'
    })

    const context = await response.json();
    console.log(context);

    refreshTimelines(null);
}

async function createNode(params){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
    let mainDiv = document.createElement('div');

    let iconDiv = document.createElement('div');
    let icon = document.createElement('img');

    if(params.timelineVisibility === "PRIVATE") params.timelineVisibility = "PERSONAL";
    else if(params.timelineVisibility === "PUBLIC") params.timelineVisibility = "COMMUNITY";

    icon.src = "../icons/timeline.png";
    iconDiv.classList.add(params.timelineVisibility.toLowerCase() + "-timeline");

    iconDiv.appendChild(icon);

    let textDiv = document.createElement('div');
    let nameText = document.createElement('h1');
    let authorDiv = document.createElement('div');
    let authorImg = document.createElement('img');
    let authorText = document.createElement('p');

    if(params.authorName !== undefined && params.authorPfpId !== undefined){
        authorText.innerHTML = params.authorName;
        authorImg.src = "../../icons/avatars/" + params.authorPfpId + ".png";
    } else {
        try{
            const response = await fetch('https://elephantsuite-rearend.herokuapp.com/login/user?id=' + params.authorId, {
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

            authorText.innerHTML = content.context.user.firstName + " " + content.context.user.lastName;
            authorImg.src = "../../icons/avatars/" + content.context.user.pfpId + ".png";
        } catch (e) {
            authorText.innerHTML = "Anonymous Author";
            authorImg.src = "../../icons/avatars/47.png"
        }
    }

    nameText.innerHTML = params.name
    authorDiv.append(authorImg, authorText);

    textDiv.append(nameText, authorDiv);

    let tag = document.createElement('p');
    tag.innerHTML = params.timelineVisibility;
    tag.classList.add(params.timelineVisibility.toLowerCase() + "-timeline");

    let options = document.createElement('div');
    let favoriteDiv = document.createElement('div');
    let favoriteImg = document.createElement('img');
    let editImg = document.createElement('img');
    let deleteImg = document.createElement('img')

    if(params.favorite){
        favoriteImg.src = "./icons/filled_heart.png";
        favoriteImg.classList.add('loved');
    } else {
        favoriteImg.src = "./icons/unfilled_heart.png";
        favoriteImg.classList.add('unloved');
    }

    editImg.src = "../editor/icons/edit.png";
    deleteImg.src = "./icons/delete.png";

    let favoriteNumDiv = document.createElement('div');
    favoriteNumDiv.innerHTML = params.likes;
    favoriteNumDiv.id = "favorite-number-" + params.id;

    favoriteImg.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        favoriteDeck(this, params.id);
    })

    editImg.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        editTimeline(params.id);
    })

    deleteImg.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        deleteDeck(params.id);
    });

    favoriteDiv.append(favoriteImg, favoriteNumDiv);

    if(params.authorId === savedUserId){
        options.append(editImg, favoriteDiv, deleteImg);
    } else {
        options.append(favoriteDiv);
    }

    mainDiv.append(iconDiv, textDiv, tag, options);
    mainDiv.classList.add('timeline');

    mainDiv.classList.add(params.timelineVisibility.toLowerCase() + "-timeline-border");
    mainDiv.classList.add("faded-out");
    mainDiv.setAttribute('onclick', "location.href = '../viewer/?timeline=" + params.id + "'");

    document.getElementById("my-timelines").appendChild(mainDiv);

    requestAnimationFrame(() => {
        mainDiv.classList.remove("faded-out");
    });
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

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png";
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('desktop-profile-user-img').src = "../../flip/icons/emojis/" + emojis_refactored[Math.floor(Math.random() * emojis_refactored.length)] + ".png"

    await refreshTimelines(user.timelines);

    closeLoader();
}

//toggle Loading Bar
let randomChatMessage = ["Rearranging Your Cards Into Decks...", "Managing Your Tasks Prematurely...", "Closing Minecraft and Beginning To Work...", "Placing 3 Day Blocks on Discord...", "Contemplating Your Life Choices...", "Do You People Even Read This???", "Please be Patient... I'm new...", "Flashing My Cards... wait...", "More Like Elephant Sweet...", "Not Asleep I Swear...", "Regretting Not Taking Job At Subway..."]

function closeLoader(){
    document.getElementById('desktop-loader-container').classList.add('inactive-modal')
}

document.addEventListener('DOMContentLoaded', function(e){
    document.getElementById('desktop-loader-text').innerHTML = randomChatMessage[Math.floor(Math.random() * randomChatMessage.length)];
});

async function refreshTimelines(timelines){
    removeAllChildNodes(document.getElementById("my-timelines"));
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

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

    if(timelines === null){
        timelines = context.context.user.timelines;
    }

    console.log(timelines);

    if(timelines.length > 0) {
        document.getElementById("no-timelines").classList.add("inactive-modal");

        for(let i = 0; i < timelines.length; i++){
            let object = timelines[i];

            if(context.context.user.likedTimelineIds.includes(object.id)) object.favorite = true;
            else object.favorite = false;

            await createNode(timelines[i]);
        }
    } else {
        document.getElementById("no-timelines").classList.remove("inactive-modal");
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
    console.log(context);
    await initialize(context)
}

locateUserInfo();