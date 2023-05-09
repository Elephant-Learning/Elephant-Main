let deck;
let termActiveSlide = true;
let activeFlashcardCard = 0;

function togglePageFlip(index, sidebar, link){

    const pages = ["Deck Carousel", "Deck Memorize", "Deck Review", "Deck Statistics", "Deck Cards"];

    if(link){
        window.location.href = link;
        return;
    }

    document.getElementById('desktop-main-container-tab').innerHTML = pages[index];
    try{document.querySelector(".active-sidebar-category").classList.remove('active-sidebar-category')} catch{}

    if(!(sidebar === undefined)){
        if(sidebar >= document.querySelectorAll('.desktop-sidebar-category').length){
            document.querySelectorAll('.desktop-sidebar-folder')[sidebar - document.querySelectorAll('.desktop-sidebar-category').length].classList.add('active-sidebar-category')
        } else {
            document.querySelectorAll('.desktop-sidebar-category')[sidebar].classList.add('active-sidebar-category')
        }
    }

    if(index === 1 && !memorizeStarted) resetTimer();

    try{document.querySelectorAll('.desktop-sidebar-category')[sidebar].classList.add('active-sidebar-category')} catch{}
    try {document.querySelector(".active-tab").classList.remove('active-tab')} catch{}
    document.querySelectorAll('.desktop-tab')[index].classList.add('active-tab')

    const removeBottomBtns = [1, 2, 3, 4, 5, 6, 7]

    if(removeBottomBtns.includes(index)){
        document.querySelectorAll('.desktop-bottom-btn').forEach(function(item){
            item.classList.add('inactive-modal')
        })
    } else {
        try {
            document.querySelectorAll('.desktop-bottom-btn').forEach(function(item){
                item.classList.remove('inactive-modal')
            })
        } catch{}
    }
}

async function addToBackpack(cardId){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/backpack/addCard', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS, PUT',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            userId: savedUserId,
            cardId: cardId
        }),
        mode: 'cors'
    });

    const context = await response.json();
    console.log(context, cardId);
}

function createCard(term, definitions, cardId){
    let newDiv = document.createElement('div');
    let newNumber = document.createElement('p');
    let copyrightDiv = document.createElement('div');
    let cardTitle = document.createElement('input');
    let definitionsDiv = document.createElement('div');
    let footerDiv = document.createElement('div');

    newNumber.innerHTML = (document.querySelectorAll('.flashcards-card').length + 1).toString();
    newNumber.classList.add('flashcards-card-number');

    let copyrightElephant = document.createElement('img');
    let copyrightTextDiv = document.createElement('div');
    let copyrightText = document.createElement('p');
    let copyrightImg = document.createElement('img');

    copyrightElephant.src = "../../icons/elephant-400-400-black.png";
    copyrightText.innerHTML = "Elephant";
    copyrightImg.src = "../editor/icons/copyright.png";
    copyrightTextDiv.append(copyrightText, copyrightImg);

    copyrightDiv.append(copyrightElephant, copyrightTextDiv);
    copyrightDiv.classList.add('flashcards-card-copyright');

    cardTitle.placeholder = "New Flashcard";
    cardTitle.setAttribute('readonly', 'true');

    if(term !== undefined) cardTitle.value = term;

    cardTitle.id = "flashcards-input-" + (document.querySelectorAll('.flashcards-card').length + 1).toString();

    if(definitions === undefined){
        let answersDiv = document.createElement('div');
        let definitionsInput = document.createElement('input');

        definitionsInput.placeholder = "Definition";
        definitionsInput.classList.add('flashcards-definition-input');
        definitionsInput.classList.add('flashcards-definition-input-' + (document.querySelectorAll('.flashcards-card').length + 1).toString());
        definitionsInput.setAttribute('readonly', 'true');

        answersDiv.append(definitionsInput);
        answersDiv.classList.add('flashcards-card-answers-div');

        definitionsDiv.appendChild(answersDiv);
    } else {
        for(let i = 0; i < definitions.length; i++){
            let answersDiv = document.createElement('div');
            let definitionsInput = document.createElement('input');

            definitionsInput.placeholder = "Definition";
            definitionsInput.value = definitions[i];
            definitionsInput.classList.add('flashcards-definition-input');
            definitionsInput.classList.add('flashcards-definition-input-' + (document.querySelectorAll('.flashcards-card').length + 1).toString());
            definitionsInput.setAttribute('readonly', 'true');

            answersDiv.append(definitionsInput);
            answersDiv.classList.add('flashcards-card-answers-div');

            definitionsDiv.appendChild(answersDiv);
        }
    }

    definitionsDiv.classList.add('flashcards-card-answers')
    definitionsDiv.id = 'flashcards-card-answers-' + (document.querySelectorAll('.flashcards-card').length + 1).toString();

    let footerRight = document.createElement('div');
    let backpackImg = document.createElement('img');

    backpackImg.src = "../editor/icons/pack.png";
    backpackImg.setAttribute("onclick", "addToBackpack(" + cardId + ")");

    footerRight.classList.add('flashcards-card-footer-right')
    footerRight.append(backpackImg);

    footerDiv.appendChild(footerRight);
    footerDiv.classList.add('flashcards-card-footer');

    newDiv.append(newNumber, copyrightDiv, cardTitle, definitionsDiv, footerDiv);
    newDiv.classList.add('flashcards-card');

    document.getElementById('flashcards-list').appendChild(newDiv);
}

function updateCardsList(){
    console.log(deck);
    for(let i = 0; i < deck.length; i++){
        createCard(deck[i].term, deck[i].definitions, deck[i].id);
    }
}

function updateDeckStatistics(userStatistics, deck){

    const deckCardIds = [];
    const deckCardInfo = [];

    console.log(userStatistics, deck);
    removeAllChildNodes(document.getElementById("incorrect-column"));
    removeAllChildNodes(document.getElementById("lol-no-column"));
    removeAllChildNodes(document.getElementById("correct-column"));

    for(let i = 0; i < deck.length; i++){
        deckCardIds.push(deck[i].id);
        deckCardInfo.push({
            term: deck[i].term,
            definitions: deck[i].definitions
        });
    }

    for(let i = 0; i < Object.keys(userStatistics).length; i++){
        if(deckCardIds.includes(Object.values(userStatistics)[i].cardId)){
            let newDiv = document.createElement("div");
            let newHeader = document.createElement("h1");
            let newPara = document.createElement("p");
            let definitionsString = "";

            newHeader.innerHTML = deckCardInfo[deckCardIds.indexOf(Object.values(userStatistics)[i].cardId)].term

            for(let j = 0; j < deckCardInfo[deckCardIds.indexOf(Object.values(userStatistics)[i].cardId)].definitions.length; j++) definitionsString += ", " + deckCardInfo[deckCardIds.indexOf(Object.values(userStatistics)[i].cardId)].definitions[j]

            newPara.innerHTML = definitionsString.substring(2);

            newDiv.append(newHeader, newPara);

            if(Object.values(userStatistics)[i].answeredRight === 0 && Object.values(userStatistics)[i].answeredWRong === 0) document.getElementById("lol-no-column").appendChild(newDiv);
            else {
                try{
                    if(Object.values(userStatistics)[i].answeredRight / Object.values(userStatistics)[i].answeredWrong >= 1.75) document.getElementById("correct-column").appendChild(newDiv);
                    else document.getElementById("incorrect-column").appendChild(newDiv);
                } catch(e){
                    document.getElementById("correct-column").appendChild(newDiv);
                }
            }

            deckCardIds.splice(i, 1);
            deckCardInfo.splice(i, 1);
        }
    }

    for(let i = 0; i < deckCardInfo.length; i++){
        let newDiv = document.createElement("div");
        let newHeader = document.createElement("h1");
        let newPara = document.createElement("p");
        let definitionsString = "";

        newHeader.innerHTML = deckCardInfo[i].term

        for(let j = 0; j < deckCardInfo[i].definitions.length; j++) definitionsString += ", " + deckCardInfo[i].definitions[j]

        newPara.innerHTML = definitionsString.substring(2);

        newDiv.append(newHeader, newPara);

        document.getElementById("lol-no-column").appendChild(newDiv);
    }
}

window.onload = async function(){
    let deckInt = false;

    try{
        deckInt = document.location.href.split("?")[1].includes("deck=");
    } catch(e){
        location.href = "./?deck=0";
    }

    console.log(document.location.href.split("=")[1] === "0")

    if(document.location.href.split("=")[1] === "0"){
        deck = [
            {
                term: "How many colors are there in a rainbow?",
                definitions: ["7"]
            }, {
                term: "What fruit do raisins come from?",
                definitions: ["grape"]
            }, {
                term: "What does a thermometer measure?",
                definitions: ["temperature"]
            }, {
                term: "What are the primary colors?",
                definitions: ["red", "blue", "yellow"]
            }, {
                term: "How many cents are in a quarter?",
                definitions: ["25"]
            }, {
                term: "What are the names of the first 10 numbers?",
                definitions: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
            }, {
                term: "Who Painted the Mona Lisa?",
                definitions: ["leonardo da vinci"]
            }, {
                term: "What does the NBA stand for?",
                definitions: ["national basketball association"]
            }, {
                term: "What's the closest planet to the sun?",
                definitions: ["mercury"]
            }, {
                term: "What is the name of the largest youtube channel?",
                definitions: ["t-series"]
            }, {
                term: "What is the name of the oldest instrument?",
                definitions: ["flute"]
            }
        ];

        document.getElementById('discord-embed-title').setAttribute('content', "Trivia");
        document.getElementById('discord-embed-desc').setAttribute('content', "Trivia - By Elephant Devs");
        document.getElementById('title').innerHTML = "Trivia | Elephant - The Ultimate Student Suite"
        updateCardsList();
        updateFlashcard();
        initializeMemorize();
        return;
    }

    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/deck/get?id=' + document.location.href.split("=")[1], {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    });

    const context = await response.json();
    console.log(context);

    if(savedUserId !== context.context.deck.authorId && !context.context.deck.sharedUsers.includes(savedUserId) && context.context.deck.visibility !== "PUBLIC") {
        location.href = "../dashboard";
        return;
    } else if(savedUserId === context.context.deck.authorId){
        document.getElementById('edit-btn').classList.remove("inactive-modal");
        document.getElementById('edit-btn').setAttribute("href", "../editor/?deck=" + context.context.deck.id);
    }

    for(let i = 0; i < context.context.deck.name.length; i++){
        document.getElementById("desktop-sidebar-deck-name").innerHTML = context.context.deck.name.substring(0, i);
        if(document.getElementById("desktop-sidebar-deck-name").clientWidth > 160) {
            document.getElementById("desktop-sidebar-deck-name").innerHTML = context.context.deck.name.substring(0, i - 1) + "...";
            break;
        }
    }

    if(context.context.deck.visibility === "PUBLIC") document.getElementById('desktop-sidebar-deck-type').classList.add('community');
    else if(context.context.deck.visibility === "SHARED") document.getElementById('desktop-sidebar-deck-type').classList.add('shared');
    else if(context.context.deck.visibility === "PRIVATE") document.getElementById('desktop-sidebar-deck-type').classList.add('personal');

    const recentDeckResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/statistics/recentlyViewedDecks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            userId: savedUserId,
            deckId: context.context.deck.id
        }),
        mode: 'cors'
    });

    const userResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/login/user?id=' + context.context.deck.authorId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    const userContext = await userResponse.json()

    document.getElementById('discord-embed-title').setAttribute('content', context.context.deck.name);
    document.getElementById('discord-embed-desc').setAttribute('content', context.context.deck.name + " - By " + userContext.context.user.firstName + " " + userContext.context.user.lastName);
    document.getElementById('desktop-sidebar-deck-author-img').src = "../../icons/avatars/" + userContext.context.user.pfpId + ".png"
    document.getElementById('desktop-sidebar-deck-author').innerHTML = userContext.context.user.firstName + " " + userContext.context.user.lastName
    document.getElementById('title').innerHTML = context.context.deck.name + " | Elephant - The Ultimate Student Suite";
    document.getElementById('desktop-review-deck-name').innerHTML = "Test Deck: " + context.context.deck.name;

    deck = context.context.deck.cards;

    updateCardsList();
    updateFlashcard();
    updateDeckStatistics(userContext.context.user.elephantUserStatistics.cardStatistics, deck);
    initializeMemorize();
}

function initialize(user){
    console.log(user);

    if(user.status === "FAILURE" || user.error === "Bad Request") {
        location.href = "../../../login"
    } else user = user.context.user;

    let memorizeSettings = 0;

    document.querySelectorAll(".desktop-memorize-setting-checkbox").forEach(function(element){
        element.setAttribute("onclick", "memorizeSetting(" + memorizeSettings + ")");
        memorizeSettings++;
    });

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png";
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();

    togglePageFlip(0, 0);
}

async function locateUserInfo(){
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
    console.log(context);
    initialize(context)
}

locateUserInfo()