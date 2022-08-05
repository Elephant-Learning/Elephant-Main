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

function deleteSharedFriend(index){
    document.querySelectorAll('.sharing-friends')[index].remove();
}

async function addSharedFriend(userId, init){
    let newDiv = document.createElement('div');
    let imageDiv = document.createElement('div');
    let image = document.createElement('img');
    let textDiv = document.createElement('div');
    let nameText = document.createElement('h1');
    let emailText = document.createElement('p');
    let removeText = document.createElement('p');

    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
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
        removeText.setAttribute('onclick', "addSharedFriend(" + userId + ", " + true + "); this.parentNode.remove()");
    }

    if(init === undefined){
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
}

function toggleDisplayView(index){
    document.getElementById('desktop-main-container').className = ""
    if(index === 0){
        document.getElementById('desktop-main-container').classList.add('kanban');
    } else if(index === 1){
        document.getElementById('desktop-main-container').classList.add('list');
    }

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
            })

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
        }

        enableRedirect = true;
        location.href = "../dashboard"
    } else displayAlert(0, errors);
}

async function checkForEditing(){
    try{
        if(document.location.href.split("?")[1].includes("deck=")) {
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

            cards = cards.context.deck
            editing = cards.id;
            document.getElementById('deck-name').innerHTML = cards.name;

            for(let i = 0; i < cards.sharedUsers; i++){
                addSharedFriend(Math.floor(Math.random() * 47), "Elephant Student", "student@elephantsuite.me")
            }

            cards = cards.cards;

            for(let i = 0; i < cards.length; i++){
                createCard(cards[i].term, cards[i].definitions)
            }
        }
    } catch {
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

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png";
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('deck-author-img').src = "../../icons/avatars/" + user.pfpId + ".png";
    document.getElementById('deck-author-p').innerHTML = user.firstName + " " + user.lastName;

    console.log(user);

    for(let i = 0; i < user.friendIds.length; i++){
        addSharedFriend(user.friendIds[i], true);
    }

    if(editing === undefined) createCard()
    toggleDisplayView(0)
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