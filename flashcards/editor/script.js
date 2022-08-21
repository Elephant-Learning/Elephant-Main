const visibilityOptions = ["PRIVATE", "SHARED", "PUBLIC"]

let controlActive = false;
let enableRedirect = true;
let selectedVisibility = 0;
let editing;

const Deck = function(){
    this.terms = {}
    this.authorId = 0;
    this.name = ""
    this.visibility = "PRIVATE";
}

function deleteCard(index){
    let exportedDeck = new Deck();
    let untitledNums = 0;

    for(let i = 0; i < document.querySelectorAll('.flashcards-card').length; i++){
        let definitions = [];

        document.querySelectorAll(".flashcards-definition-input-" + (i + 1)).forEach(function(element){
            definitions.push(element.value)
        })

        if(document.getElementById("flashcards-input-" + (i + 1)).value === "") {
            untitledNums++;
            document.getElementById("flashcards-input-" + (i + 1)).value = "Untitled-Elephant-Deck-" + untitledNums;
        }

        exportedDeck.terms[document.getElementById("flashcards-input-" + (i + 1)).value] = definitions;
    }

    document.querySelectorAll('.flashcards-card').forEach(function(element){
        element.remove();
    })

    for(let i = 0; i < Object.keys(exportedDeck.terms).length; i++){
        if(i !== index - 1) {
            if(Object.keys(exportedDeck.terms)[i].substring(0,23) === "Untitled-Elephant-Deck-") createCard(undefined, exportedDeck.terms[Object.keys(exportedDeck.terms)[i]])
            else createCard(Object.keys(exportedDeck.terms)[i], exportedDeck.terms[Object.keys(exportedDeck.terms)[i]])
        }
   }
}

async function publishDeck(){
    const response = await fetch('https://elephant-rearend.herokuapp.com/deck/visibility', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            deckId: editing,
            visibility: "PUBLIC"
        }),
        mode: 'cors'
    })

    const context = await response.json();
    toggleCardVisibility(context.context.deck.visibility)
}

async function unpublishDeck(){
    const response = await fetch('https://elephant-rearend.herokuapp.com/deck/visibility', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            deckId: editing,
            visibility: "PRIVATE"
        }),
        mode: 'cors'
    })

    const context = await response.json();
    toggleCardVisibility(context.context.deck.visibility)
}

function deleteSharedFriend(index){
    document.querySelectorAll('.sharing-friends')[index].remove();
}

async function removeSharedFriend(userId){

    console.log(editing);

    const response = await fetch('https://elephant-rearend.herokuapp.com/deck/unshareDeck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
           deckId: editing,
           sharedUserId: userId
        }),
        mode: 'cors'
    })

    let context = await response.json();
    console.log(context);
}

async function addSharedFriend(userId, init){
    let newDiv = document.createElement('div');
    let imageDiv = document.createElement('div');
    let image = document.createElement('img');
    let textDiv = document.createElement('div');
    let nameText = document.createElement('h1');
    let emailText = document.createElement('p');
    let removeText = document.createElement('p');

    if(userId === undefined) return;

    const response = await fetch('https://elephant-rearend.herokuapp.com/login/user?id=' + userId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    let context = await response.json();
    context = context.context.user;

    image.src = "../../icons/avatars/" + context.pfpId + ".png";
    imageDiv.appendChild(image);

    nameText.innerHTML = context.firstName + " " + context.lastName;
    emailText.innerHTML = context.email;

    textDiv.append(nameText, emailText);
    if(init){
        removeText.innerHTML = "Add";
        removeText.setAttribute('onclick', "addSharedFriend(" + userId + ", " + undefined + "); this.parentNode.remove()");
    } else {
        removeText.innerHTML = "Remove";
        removeText.setAttribute('onclick', "removeSharedFriend(" + userId + "); addSharedFriend(" + userId + ", " + true + "); this.parentNode.remove()");
    }

    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'))
    if(init === undefined){

        const responseDeck = await fetch('https://elephant-rearend.herokuapp.com/deck/get?id=' + editing, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            mode: 'cors'
        })

        const contextDeck = await responseDeck.json();

        if(contextDeck.context.deck.visibility !== "SHARED"){
            const response = await fetch('https://elephant-rearend.herokuapp.com/deck/visibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    deckId: editing,
                    visibility: "SHARED"
                }),
                mode: 'cors'
            })

            const context = await response.json();
            toggleCardVisibility(context.context.deck.visibility);
        }

        const response = await fetch('https://elephant-rearend.herokuapp.com/notifications/sendSharedDeck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                type: "SHARED_DECK",
                message: "Bro shared a deck with you!",
                recipientId: userId,
                deckId: editing,
                senderId: savedUserId
            }),
            mode: 'cors'
        })

        const context = await response.json();
        console.log(context);
    }

    newDiv.append(imageDiv, textDiv, removeText);
    newDiv.classList.add('sharing-friends');

    if(init) document.getElementById('sharing-input-friends-list').appendChild(newDiv);
    else document.getElementById('sharing-friends-list').appendChild(newDiv);

    if(document.getElementById('sharing-input-friends-list').children.length > 1){
        document.getElementById('no-friends').classList.add('inactive-modal');
    } else {
        document.getElementById('no-friends').className = "";
    }
}

function toggleDisplayView(index){
    document.getElementById('desktop-main-container').className = ""
    if(index === 0){
        document.getElementById('desktop-main-container').classList.add('kanban');
    } else if(index === 1){
        document.getElementById('desktop-main-container').classList.add('list');
    }

    let preferences = localStorage.getItem('preferences');
    preferences = JSON.parse(preferences);

    preferences[2] = index;
    console.log(preferences)
    localStorage.setItem('preferences', JSON.stringify(preferences));

    document.querySelectorAll('.view-button').forEach(function(element){
        element.classList.remove('active-view-button');
    })

    document.querySelectorAll('.view-button')[index].classList.add('active-view-button');
}

function toggleSharedInputList(){
    if(document.getElementById('sharing-input-friends-list').classList.contains('inactive-modal')){
        document.getElementById('sharing-input-friends-list').classList.remove('inactive-modal')
    } else {
        document.getElementById('sharing-input-friends-list').classList.add('inactive-modal')
    }
}

function addDefinition(index){
    let answersDiv = document.createElement('div');
    let definitionsInput = document.createElement('input');
    let definitionsImg = document.createElement('img');

    definitionsInput.placeholder = "Definition";
    definitionsInput.classList.add('flashcards-definition-input');
    definitionsInput.classList.add('flashcards-definition-input-' + index);
    definitionsImg.src = "./icons/delete.png";
    definitionsImg.setAttribute("onclick", "this.parentNode.remove()");

    answersDiv.append(definitionsInput, definitionsImg);
    answersDiv.classList.add('flashcards-card-answers-div');
    document.getElementById('flashcards-card-answers-' + index).insertBefore(answersDiv, document.getElementById('flashcards-definition-add-' + index));
    document.querySelectorAll('.flashcards-definition-input-' + index)[document.querySelectorAll('.flashcards-definition-input-' + index).length - 1].focus();
}

function duplicateCard(index){
    let definitions = [];

    document.querySelectorAll(".flashcards-definition-input-" + index).forEach(function(element){
        definitions.push(element.value)
    })

    createCard(document.getElementById('flashcards-input-' + index).value, definitions)
}

async function backpackCard(index){

}

function createBackpackCard(deck){
    let newDiv = document.createElement('div');
    let imgDiv = document.createElement('div');
    let textDiv = document.createElement('div');
    let optionsDiv = document.createElement('div');

    let deckImg = document.createElement('img');
    deckImg.src = "../icons/deck.png";

    imgDiv.appendChild(deckImg);

    let deckName = document.createElement('h1');
    let authorDiv = document.createElement('div');
    let authorImg = document.createElement('img');
    let authorText = document.createElement('p');

    deckName.innerHTML = deck.name;
    authorImg.src = "../../icons/avatars/46.png";
    authorText.innerHTML = "Elephant Student";

    authorDiv.append(authorImg, authorText);
    textDiv.append(deckName, authorDiv);

    let optionsUnpack = document.createElement('img');
    let optionsDelete = document.createElement('img');

    optionsUnpack.src = "./icons/unpack.png";
    optionsDelete.src = "./icons/delete.png";
    optionsDiv.append(optionsUnpack, optionsDelete);

    newDiv.append(imgDiv, textDiv, optionsDiv);
    newDiv.classList.add('backpack-cards');
    document.getElementById('backpack-card-list').appendChild(newDiv);
}

function createCard(term, definitions){
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
    copyrightImg.src = "./icons/copyright.png";
    copyrightTextDiv.append(copyrightText, copyrightImg);

    copyrightDiv.append(copyrightElephant, copyrightTextDiv);
    copyrightDiv.classList.add('flashcards-card-copyright');

    cardTitle.placeholder = "New Flashcard"

    if(term !== undefined) cardTitle.value = term;

    cardTitle.id = "flashcards-input-" + (document.querySelectorAll('.flashcards-card').length + 1).toString();

    if(definitions === undefined){
        let answersDiv = document.createElement('div');
        let definitionsInput = document.createElement('input');
        let definitionsImg = document.createElement('img');

        definitionsInput.placeholder = "Definition";
        definitionsInput.classList.add('flashcards-definition-input');
        definitionsInput.classList.add('flashcards-definition-input-' + (document.querySelectorAll('.flashcards-card').length + 1).toString());
        definitionsImg.src = "./icons/delete.png";
        definitionsImg.setAttribute("onclick", "this.parentNode.remove()");

        answersDiv.append(definitionsInput, definitionsImg);
        answersDiv.classList.add('flashcards-card-answers-div');

        definitionsDiv.appendChild(answersDiv);
    } else {
        for(let i = 0; i < definitions.length; i++){
            let answersDiv = document.createElement('div');
            let definitionsInput = document.createElement('input');
            let definitionsImg = document.createElement('img');

            definitionsInput.placeholder = "Definition";
            definitionsInput.value = definitions[i];
            definitionsInput.classList.add('flashcards-definition-input');
            definitionsInput.classList.add('flashcards-definition-input-' + (document.querySelectorAll('.flashcards-card').length + 1).toString());
            definitionsImg.src = "./icons/delete.png";
            definitionsImg.setAttribute("onclick", "this.parentNode.remove()");

            answersDiv.append(definitionsInput, definitionsImg);
            answersDiv.classList.add('flashcards-card-answers-div');

            definitionsDiv.appendChild(answersDiv);
        }
    }

    let definitionBtn = document.createElement('button');
    definitionBtn.innerHTML = "+ Add Definition";
    definitionBtn.setAttribute("onclick", "addDefinition(" + (document.querySelectorAll('.flashcards-card').length + 1).toString() + ")")
    definitionBtn.classList.add('flashcards-definition-add');
    definitionBtn.id = 'flashcards-definition-add-' + (document.querySelectorAll('.flashcards-card').length + 1).toString();
    definitionBtn.tabIndex = 0;

    definitionsDiv.appendChild(definitionBtn);
    definitionsDiv.classList.add('flashcards-card-answers')
    definitionsDiv.id = 'flashcards-card-answers-' + (document.querySelectorAll('.flashcards-card').length + 1).toString();

    let footerRight = document.createElement('div');
    let backpackImg = document.createElement('img')
    let duplicateImg = document.createElement('img');
    let deleteImg = document.createElement('img');

    backpackImg.src = "./icons/pack.png";
    duplicateImg.src = "./icons/duplicate.png";
    deleteImg.src = "./icons/delete.png";
    duplicateImg.setAttribute("onclick", "duplicateCard(" + (document.querySelectorAll('.flashcards-card').length + 1) + ")")
    deleteImg.setAttribute("onclick", "deleteCard(" + (document.querySelectorAll('.flashcards-card').length + 1) + ")");
    backpackImg.setAttribute("onclick", "backpackCard(" + (document.querySelectorAll('.flashcards-card').length + 1) + ")")

    footerRight.classList.add('flashcards-card-footer-right')
    footerRight.append(backpackImg, duplicateImg, deleteImg);

    footerDiv.appendChild(footerRight);
    footerDiv.classList.add('flashcards-card-footer');

    newDiv.append(newNumber, copyrightDiv, cardTitle, definitionsDiv, footerDiv);
    newDiv.classList.add('flashcards-card');

    document.getElementById('desktop-main-container').insertBefore(newDiv, document.getElementById('flashcards-add-card'));
    document.getElementById('flashcards-input-' + document.querySelectorAll('.flashcards-card').length).focus()
}

function displayAlert(index, content){
    let refactoredContent = "";

    console.log(index, content);

    if(index === 0){
        const errorTypes = ["Unnamed Card: Card ", "Definition Left Blank: Card "]

        for(let i = 0; i < content.length; i++){
            if(refactoredContent !== "") refactoredContent = refactoredContent + ", " + errorTypes[content[i][1]] + (content[i][0] + 1);
            else refactoredContent = errorTypes[content[i][1]] + (content[i][0] + 1)
        }

        console.log(refactoredContent);

        document.querySelectorAll('.desktop-alert-desc')[index].innerHTML = "Please Correct The Following Errors: " + refactoredContent;
    }

    document.querySelectorAll('.desktop-alert')[index].classList.remove('inactive-modal');
    setTimeout(function(){
        document.querySelectorAll('.desktop-alert')[index].classList.add('inactive-modal');
    }, 10000);
}

function toggleBackpackModal(){
    if(document.getElementById('desktop-backpack-modal').classList.contains('inactive-modal')) {
        document.getElementById('desktop-backpack-modal').classList.remove('inactive-modal');
    } else {
        document.getElementById('desktop-backpack-modal').classList.add('inactive-modal')
    }
}

function toggleSharingModal(){
    if(document.getElementById('desktop-sharing-modal').classList.contains('inactive-modal')){
        document.getElementById('desktop-sharing-modal').classList.remove('inactive-modal')
    } else {
        document.getElementById('desktop-sharing-modal').classList.add('inactive-modal')
    }
}

function toggleFolderModal(){
    if(document.getElementById('desktop-folder-modal').classList.contains('inactive-modal')){
        document.getElementById('desktop-folder-modal').classList.remove('inactive-modal')
    } else {
        document.getElementById('desktop-folder-modal').classList.add('inactive-modal')
    }
}

async function leaveEditor(link){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    let exportedDeck = new Deck();
    exportedDeck.name = document.getElementById('deck-name').textContent;

    for(let i = 0; i < document.querySelectorAll('.flashcards-card').length; i++){
        let definitions = [];

        document.querySelectorAll(".flashcards-definition-input-" + (i + 1)).forEach(function(element){
            definitions.push(element.value)
        })

        exportedDeck.terms[document.getElementById("flashcards-input-" + (i + 1)).value] = definitions;
    }

    console.log(exportedDeck.name === "New Elephant Deck", Object.keys(exportedDeck.terms).length === 1, Object.keys(exportedDeck.terms)[0] === "", exportedDeck.terms[Object.keys(exportedDeck.terms)[0]].length === 1, exportedDeck.terms[Object.keys(exportedDeck.terms)[0]][0] === "");

    enableRedirect = false;
    if(editing === undefined){
        if(exportedDeck.name === "New Elephant Deck" && Object.keys(exportedDeck.terms).length === 1 && Object.keys(exportedDeck.terms)[0] === "" && exportedDeck.terms[Object.keys(exportedDeck.terms)[0]].length === 1 && exportedDeck.terms[Object.keys(exportedDeck.terms)[0]][0] === "") enableRedirect = true;
    } else {
        const response = await fetch('https://elephant-rearend.herokuapp.com/deck/get?id=' + editing, {
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
    }


    location.href = link
}

document.getElementById('save-deck').onclick = saveDeck;

async function saveDeck(){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    let exportedDeck = new Deck();
    let errors = [];

    exportedDeck.authorId = savedUserId;
    exportedDeck.visibility = visibilityOptions[selectedVisibility]
    exportedDeck.name = document.getElementById('deck-name').textContent;

    for(let i = 0; i < document.querySelectorAll('.flashcards-card').length; i++){
        let definitions = [];

        if(document.getElementById("flashcards-input-" + (i + 1)).value === "") errors.push([i, 0])

        document.querySelectorAll(".flashcards-definition-input-" + (i + 1)).forEach(function(element){
            if(element.value === "") errors.push([i, 1])
            definitions.push(element.value)
        })

        exportedDeck.terms[document.getElementById("flashcards-input-" + (i + 1)).value] = definitions;
    }

    console.log(exportedDeck)

    if(errors.length === 0) {
        if(editing === undefined){
            const response = await fetch('https://elephant-rearend.herokuapp.com/deck/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify(exportedDeck),
                mode: 'cors'
            })

            const context = await response.json();
            console.log(context);

            const recentDeckResponse = await fetch('https://elephant-rearend.herokuapp.com/statistics/recentlyViewedDecks', {
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

            const recentDeckContext = await recentDeckResponse.json();
            console.log(recentDeckContext);

            enableRedirect = true;
            location.href = "../editor/?deck=" + context.context.deck.id;
        } else {
            const nameResponse = await fetch('https://elephant-rearend.herokuapp.com/deck/rename', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    newName: exportedDeck.name,
                    deckId: editing
                }),
                mode: 'cors'
            });

            const termsResponse = await fetch('https://elephant-rearend.herokuapp.com/deck/resetTerms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    newTerms: exportedDeck.terms,
                    deckId: editing
                }),
                mode: 'cors'
            });

            const recentDeckResponse = await fetch('https://elephant-rearend.herokuapp.com/statistics/recentlyViewedDecks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    userId: savedUserId,
                    deckId: editing
                }),
                mode: 'cors'
            });

            const recentDeckContext = await recentDeckResponse.json();
            console.log(recentDeckContext);

            enableRedirect = true;
            location.href = "../dashboard"
        }

        enableRedirect = true;
    } else displayAlert(0, errors);
}

function toggleCardVisibility(visibility){
    removeAllChildNodes(document.getElementById('publish-btn'))

    if(visibility === "PRIVATE"){
        document.getElementById('deck-privacy-div').innerHTML = "PERSONAL";
        document.getElementById('deck-privacy-div').className = 'personal';

        let publishBtnImg = document.createElement('img')
        publishBtnImg.src = "./icons/upload.png";
        document.getElementById('publish-btn').append(publishBtnImg, document.createTextNode("Publish"));
        document.getElementById('publish-btn').setAttribute("onclick", "publishDeck()");
        try{
            document.getElementById('publish-btn').classList.remove('personal')
            document.getElementById('publish-btn').classList.add('community')
        } catch{
            document.getElementById('publish-btn').classList.add('community')
        }
    } else if(visibility === "SHARED"){
        document.getElementById('deck-privacy-div').innerHTML = "SHARED";
        document.getElementById('deck-privacy-div').className = 'shared';

        let publishBtnImg = document.createElement('img')
        publishBtnImg.src = "./icons/upload.png";
        document.getElementById('publish-btn').append(publishBtnImg, document.createTextNode("Publish"))
        document.getElementById('publish-btn').setAttribute("onclick", "publishDeck()")
        try{
            document.getElementById('publish-btn').classList.remove('personal')
            document.getElementById('publish-btn').classList.add('community')
        } catch{
            document.getElementById('publish-btn').classList.add('community')
        }
    } else if(visibility === "PUBLIC"){
        document.getElementById('deck-privacy-div').innerHTML = "COMMUNITY";
        document.getElementById('deck-privacy-div').className = 'community';

        let publishBtnImg = document.createElement('img')
        publishBtnImg.src = "./icons/download.png";
        document.getElementById('publish-btn').append(publishBtnImg, document.createTextNode("Unpublish"));
        document.getElementById('publish-btn').setAttribute("onclick", "unpublishDeck()");
        try{
            document.getElementById('publish-btn').classList.remove('community')
            document.getElementById('publish-btn').classList.add('personal')
        } catch{
            document.getElementById('publish-btn').classList.add('personal')
        }
    }
}

async function checkForEditing(){
    try{
        if(document.location.href.split("?")[1].includes("deck=")) {
            const savedUserId  = JSON.parse(localStorage.getItem('savedUserId'));
            document.getElementById('add-to-folder').classList.remove('inactive-modal');
            document.getElementById('invite-btn').classList.remove('inactive-modal');
            document.getElementById('publish-btn').classList.remove('inactive-modal');

            const response = await fetch('https://elephant-rearend.herokuapp.com/deck/get?id=' + document.location.href.split("=")[1], {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                mode: 'cors'
            })

            let cards = await response.json();

            console.log(cards);
            cards = cards.context.deck;

            if(savedUserId !== cards.authorId) location.href = "../dashboard";

            toggleCardVisibility(cards.visibility)

            editing = cards.id;
            document.getElementById('deck-name').innerHTML = cards.name;

            const authorResponse = await fetch('https://elephant-rearend.herokuapp.com/login/user?id=' + cards.authorId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                mode: 'cors'
            })

            const authorContext = await authorResponse.json();

            document.getElementById('deck-author-img').src = "../../icons/avatars/" + authorContext.context.user.pfpId + ".png";
            document.getElementById('deck-author-p').innerHTML = authorContext.context.user.firstName + " " + authorContext.context.user.lastName;

            for(let i = 0; i < cards.sharedUsers; i++){
                await addSharedFriend(cards.sharedUsers[i], false);
            }

            cards = cards.cards;

            for(let i = 0; i < cards.length; i++){
                createCard(cards[i].term, cards[i].definitions)
            }
        }
    } catch(error) {
        document.getElementById('deck-privacy-div').innerHTML = "PERSONAL";
        document.getElementById('deck-privacy-div').classList.add('personal');
        document.getElementById('deck-name').innerHTML = "New Elephant Deck";
        editing = undefined;
    }
}

document.addEventListener('keydown', function(e){
    if(e.keyCode === 17) controlActive = true;
    if(e.keyCode === 68 && controlActive){
        e.preventDefault();
        if(document.activeElement.classList.contains('flashcards-definition-input')){
            addDefinition(document.activeElement.classList[1].slice(-1))
        }
    } if(e.keyCode === 13 ** !controlActive){
        e.preventDefault();
        createCard()
    } else if(e.keyCode === 13 && controlActive){
        saveDeck();
    }
})

document.addEventListener('keyup', function(e){
    if(e.keyCode === 17) controlActive = false;
})

window.addEventListener("beforeunload", function(e){
    if(!enableRedirect) e.returnValue = 'Are you sure you want to leave?';
})

async function initialize(user){

    if(user.status === "FAILURE") {
        location.href = "../../login"
    } else user = user.context.user;

    await checkForEditing();

    const noFriends = ["LOL YOU HAVE NO FRIENDS", "Imagine not having any friends", "Bruh you actually are friendless", "Well isn't this awkward", "Friend... more like end..."]
    document.getElementById('no-friends').innerHTML = noFriends[Math.floor(Math.random() * noFriends.length)];

    if(editing === undefined){
        document.getElementById('deck-author-img').src = "../../icons/avatars/" + user.pfpId + ".png";
        document.getElementById('deck-author-p').innerHTML = user.firstName + " " + user.lastName;
    }

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png";
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();

    console.log(user);
    let preferences = localStorage.getItem('preferences');
    console.log(preferences);
    preferences = JSON.parse(preferences)

    for(let i = 0; i < user.friendIds.length; i++){
        await addSharedFriend(user.friendIds[i], true);
    }

    if(editing === undefined) createCard()
    toggleDisplayView(preferences[2]);
    window.scrollTo(0,0);

    enableRedirect = false;
}

async function locateUserInfo(){
    let savedUserId;

    try{
        savedUserId = JSON.parse(localStorage.getItem('savedUserId'))
    } catch {
        location.href = "../../login";
    }

    if(!savedUserId  && savedUserId !== 0) location.href = "../../login";
    const response = await fetch('https://elephant-rearend.herokuapp.com/login/user?id=' + savedUserId, {
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

for(let i = 0; i < 20; i++){
    createBackpackCard({
        name: "Something"
    })
}

locateUserInfo()