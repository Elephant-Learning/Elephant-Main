const tags = ["personal", "community", "shared"];

const Card = function(term){
    this.term = term;
    this.definitions = [];

    this.addDefinition = function(definition){
        this.definitions.push(definition)
    }
}

const Deck = function(name){
    this.name = name;
    this.cards = [];
    this.author = "Unauthored";
    this.favoritesNumber = 0;
    this.lastModified = new Date();
    this.creationDate;

    this.addCard = function(card){
        this.cards.push(card);
    }
}

//sortIndex
//0 = Recently Viewed
//1 = Favorited + Alphabetical
//2 = Alphabetical

//viewIndex
//0 = All Decks
//1 = Your Decks
async function displayFlashcard(flashcardType, params){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
    let mainDiv = document.createElement('div');

    let iconDiv = document.createElement('div');
    let icon = document.createElement('img');

    if(flashcardType === "flashcard" || flashcardType === "folder"){
        if(params.type === "PRIVATE") params.type = "PERSONAL";
        else if(params.type === "PUBLIC") params.type = "COMMUNITY";

        icon.src = "../icons/file.png";
        iconDiv.classList.add(params.type.toLowerCase() + "-flashcard");
    } else if(flashcardType === "user"){
        icon.src = "../../icons/avatars/" + params.pfpId + ".png";
        iconDiv.classList.add("personal-flashcard");
    }

    iconDiv.appendChild(icon);

    let textDiv = document.createElement('div');
    let nameText = document.createElement('h1');
    let authorDiv = document.createElement('div');
    let authorImg = document.createElement('img');
    let authorText = document.createElement('p');

    let testSpace = document.getElementById('flashcards-display-test');
    if(flashcardType === "flashcard" || flashcardType === "folder"){
        for(let i = 0; i < params.name.length; i++){
            testSpace.innerHTML = params.name.substring(0, i);
            if(testSpace.clientWidth > 180) {
                params.name = params.name.substring(0, i - 1) + "...";
                break;
            }
        }

        const response = await fetch('https://elephant-rearend.herokuapp.com/login/user?id=' + params.author, {
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

        nameText.innerHTML = params.name
        authorText.innerHTML = content.context.user.firstName + " " + content.context.user.lastName;
        authorImg.src = "../../icons/avatars/" + content.context.user.pfpId + ".png";
        authorDiv.append(authorImg, authorText);
    } else if(flashcardType === "user") {
        for(let i = 0; i < params.name.length; i++){
            testSpace.innerHTML = params.name.substring(0, i);
            if(testSpace.clientWidth > 180) {
                params.name = params.name.substring(0, i - 1) + "...";
                break;
            }
        }

        nameText.innerHTML = params.name;
        authorText.innerHTML = params.email;
        authorDiv.appendChild(authorText);
    }


    textDiv.append(nameText, authorDiv);

    let tag = document.createElement('p');

    if(flashcardType === "flashcard" || flashcardType === "folder"){
        tag.innerHTML = params.type;
        tag.classList.add(params.type.toLowerCase() + "-flashcard");
    } else if(flashcardType === "user"){
        tag.innerHTML = params.type;
        tag.classList.add("personal-flashcard");
    }

    let options = document.createElement('div');

    if(flashcardType === "flashcard" || flashcardType === "folder"){
        let favoriteImg = document.createElement('img');
        let editImg = document.createElement('img');
        let deleteImg = document.createElement('img')

        if(params.favorite){
            favoriteImg.src = "../icons/filled_heart.png";
            favoriteImg.classList.add('loved');
        } else {
            favoriteImg.src = "../icons/unfilled_heart.png";
            favoriteImg.classList.add('unloved');
        }

        editImg.src = "../editor/icons/edit.png";
        deleteImg.src = "../icons/delete.png";

        favoriteImg.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            favoriteDeck(this, params.deckID)
        })

        editImg.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            editFlashcard(params.deckID);
        })

        deleteImg.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            deleteDeck(params.deckID);
        });

        if(params.author === savedUserId){
            options.append(editImg, favoriteImg, deleteImg);
        } else {
            options.append(favoriteImg);
        }
    } else if(flashcardType === "user"){
        let friendImg = document.createElement('img');

        if(params.friend){
            friendImg.src = "../icons/remove_friend.png";
        } else {
            friendImg.src = "../icons/add_friend.png";
            friendImg.addEventListener('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                document.getElementById('friending-input').value = params.email;

                if(document.getElementById('desktop-friending-modal').classList.contains('inactive-modal')){
                    document.getElementById('desktop-friending-modal').classList.remove('inactive-modal');
                }

                toggleFriendingModal(true);
            })
        }

        options.append(friendImg);
    }

    mainDiv.append(iconDiv, textDiv, tag, options);
    mainDiv.classList.add('flashcard-deck');
    if(flashcardType === "flashcard" || flashcardType === "folder"){
        mainDiv.classList.add(params.type.toLowerCase() + "-flashcard-border");
        mainDiv.setAttribute('onclick', "location.href = '../viewer/?deck=" + params.deckID + "'");
        mainDiv.addEventListener('contextmenu', function(e){
            e.preventDefault();
            e.stopPropagation();

            while (document.getElementById('context-menu').firstChild) {
                document.getElementById('context-menu').firstChild.remove()
            }

            let cmOptions = []

            if(params.author === savedUserId){
                cmOptions = [
                    ["view", "View Deck", "location.href = '../viewer/?deck=" + params.deckID + "'"],
                    ["../editor/icons/edit", "Edit Deck", "editFlashcard(" + params.deckID + ")"],
                    ["delete", "Delete Deck", "deleteDeck(" + params.deckID + ")"]
                ]
            } else {
                cmOptions = [
                    ["view", "View Deck", "location.href = '../viewer/?deck=" + params.deckID + "'"]
                ]
            }

            contextMenuOptions(cmOptions)
            toggleContextMenu(true, e);
        })
    } else if(flashcardType === "user"){
        mainDiv.classList.add("personal-flashcard-border");
        mainDiv.classList.add("user-flashcard");
    }

    if(params.search){
        if(flashcardType === "flashcard"){
            document.getElementById('search-results-flashcards').appendChild(mainDiv);
        } else if(flashcardType === "user"){
            document.getElementById('search-results-users').appendChild(mainDiv);
        }
    } else if(flashcardType === "flashcard") {
        document.getElementById('flashcards-list').appendChild(mainDiv);
    } else if(flashcardType === "folder"){
        document.getElementById('folder-flashcard-display').appendChild(mainDiv);
    }
}

async function deleteDeck(id){
    const response = await fetch('https://elephant-rearend.herokuapp.com/deck/delete?id=' + id, {
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

    locateUserInfo();
}

function editFlashcard(id){
    location.href = "../editor/?deck=" + id;
}

async function favoriteDeck(elem, id){
    if(elem.classList.contains('unloved')){
        elem.src = "../icons/filled_heart.png";
        elem.classList.remove('unloved');
        elem.classList.add('loved')

        const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
        const response = await fetch('https://elephant-rearend.herokuapp.com/deck/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                userId: savedUserId,
                deckId: id
            }),
            mode: 'cors'
        })

    } else {
        elem.src = "../icons/unfilled_heart.png";
        elem.classList.add('unloved');
        elem.classList.remove('loved')

        const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
        const response = await fetch('https://elephant-rearend.herokuapp.com/deck/unlike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                userId: savedUserId,
                deckId: id
            }),
            mode: 'cors'
        })
    }
}

function createFolder(){
    toggleFolderModal(false)
}

function createDeck(){
    togglePageFlip(undefined, undefined, "../editor");
}