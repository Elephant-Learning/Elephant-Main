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
function displayFlashcard(name, author, type, deckID){
    let mainDiv = document.createElement('div');

    let iconDiv = document.createElement('div');
    let icon = document.createElement('img');

    icon.src = "../icons/file.png";
    iconDiv.appendChild(icon);
    iconDiv.classList.add(tags[type] + "-flashcard");

    let textDiv = document.createElement('div');
    let nameText = document.createElement('h1');
    let authorDiv = document.createElement('div');
    let authorImg = document.createElement('img');
    let authorText = document.createElement('p');

    let testSpace = document.getElementById('flashcards-display-test');
    for(let i = 0; i < name.length; i++){
        testSpace.innerHTML = name.substring(0, i);
        if(testSpace.clientWidth > 200) {
            name = name.substring(0, i - 1) + "...";
            break;
        }
    }

    nameText.innerHTML = name
    authorText.innerHTML = author;
    authorImg.src = "../../icons/avatars/" + Math.floor(Math.random() * 47) + ".png";
    authorDiv.append(authorImg, authorText);
    textDiv.append(nameText, authorDiv);

    let tag = document.createElement('p');
    tag.innerHTML = tags[type];
    tag.classList.add(tags[type] + "-flashcard");

    let options = document.createElement('div');
    let favoriteImg = document.createElement('img');
    let menuImg = document.createElement('img');

    favoriteImg.src = "../icons/favorite.png";
    menuImg.src = "../icons/menu_vertical.png";
    options.append(favoriteImg, menuImg);

    mainDiv.append(iconDiv, textDiv, tag, options);
    mainDiv.classList.add('flashcard-deck');
    mainDiv.classList.add(tags[type] + "-flashcard-border");
    mainDiv.setAttribute('onclick', "togglePageFlip(undefined, undefined, '../viewer?ID=" + deckID + "')");
    document.getElementById('flashcards-list').appendChild(mainDiv);
}

function loadFlashcards(keyword, viewIndex, sortIndex){
    for(let i = 0; i < 105; i++){
        displayFlashcard("Elephant Flashcards Test", "Random User", Math.floor(Math.random() * 3), 0);
    } document.getElementById('flashcards-display-test').innerHTML = "";
}

function createFolder(){
    togglePageFlip(6, undefined);
}

function createDeck(){
    togglePageFlip(undefined, undefined, "../editor");
}