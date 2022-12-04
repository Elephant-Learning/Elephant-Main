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

    if(flashcardType === "flashcard" || flashcardType === "folder"){
        if(params.authorName !== undefined && params.authorPfp !== undefined){
            authorText.innerHTML = params.authorName;
            authorImg.src = "../../icons/avatars/" + params.authorPfp + ".png";
        } else {
            const response = await fetch('https://elephantsuite-rearend.herokuapp.com/login/user?id=' + params.author, {
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
        }

        nameText.innerHTML = params.name
        authorDiv.append(authorImg, authorText);
    } else if(flashcardType === "user") {
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
        let favoriteDiv = document.createElement('div');
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

        let favoriteNumDiv = document.createElement('div');
        favoriteNumDiv.innerHTML = params.likesNumber;
        favoriteNumDiv.id = "favorite-number-" + params.deckID;

        favoriteImg.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            favoriteDeck(this, params.deckID, params.name, params.author, params.type);
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

        if(!params.search){
            favoriteDiv.append(favoriteImg, favoriteNumDiv)
        } else {
            favoriteDiv.append(favoriteImg)
        }

        if(params.author === savedUserId){
            options.append(editImg, favoriteDiv, deleteImg);
        } else {
            options.append(favoriteDiv);
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
                    ["history", "Remove From History", "removeHistory(" + params.deckID + ")"],
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

    mainDiv.classList.add("faded-out");

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
    } document.getElementById('flashcards-display-test').innerHTML = "";

    requestAnimationFrame(() => {
        mainDiv.classList.remove("faded-out")
    })
}

async function removeHistory(id){
    
}

async function deleteDeck(id){
    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/deck/delete?id=' + id, {
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

async function favoriteDeck(elem, id, deck, author){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    if(elem.classList.contains('unloved')){
        elem.src = "../icons/filled_heart.png";
        elem.classList.remove('unloved');
        elem.classList.add('loved');

        const deckLikeResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/deck/like', {
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

        const deckLikeContext = await deckLikeResponse.json()

        console.log(deckLikeContext);

        /*const response = await fetch('https://elephantsuite-rearend.herokuapp.com/notifications/sendLikedDeck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                recipientId: author,
                deckId: id,
                type: "LIKED_DECK",
                message: "Your Deck, " + deck + ", was liked by bruh"
            }),
            mode: 'cors'
        })

        const context = await response.json();
        console.log(context);*/

        try {
            document.getElementById('favorite-number-' + id).innerHTML = (parseInt(document.getElementById('favorite-number-' + id).textContent) + 1).toString();
        } catch (e){}
    } else {
        elem.src = "../icons/unfilled_heart.png";
        elem.classList.add('unloved');
        elem.classList.remove('loved')

        const response = await fetch('https://elephantsuite-rearend.herokuapp.com/deck/unlike', {
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

        try {
            document.getElementById('favorite-number-' + id).innerHTML = (parseInt(document.getElementById('favorite-number-' + id).textContent) - 1).toString();
        } catch (e){}
    }
}

function createFolder(){
    toggleFolderModal(false)
}

function createDeck(){
    togglePageFlip(undefined, undefined, "../editor");
}