const tags = ["personal", "community", "shared"];

const Deck = function(name, author){
    this.name = name;
    this.author = "Unauthored";
    this.favoritesNumber = 0;
    this.lastModified = new Date();
}

//sortIndex
//0 = Recently Viewed
//1 = Favorited + Alphabetical
//2 = Alphabetical

//viewIndex
//0 = All Decks
//1 = Your Decks
function displayFlashcard(name, author, type){
    let mainDiv = document.createElement('div');

    let iconDiv = document.createElement('div');
    let icon = document.createElement('img');

    icon.src = "./icons/file.png";
    iconDiv.appendChild(icon);
    iconDiv.classList.add(tags[type] + "-flashcard");

    let textDiv = document.createElement('div');
    let nameText = document.createElement('h1');
    let authorDiv = document.createElement('div');
    let authorImg = document.createElement('img');
    let authorText = document.createElement('p');

    if(name.length > 13){
        name = name.substring(0,12) + "..."
    }

    nameText.innerHTML = name.substring(0,15);
    authorText.innerHTML = author;
    authorImg.src = "../icons/avatars/" + Math.floor(Math.random() * 47) + ".png";
    authorDiv.append(authorImg, authorText);
    textDiv.append(nameText, authorDiv);

    let tag = document.createElement('p');
    tag.innerHTML = tags[type];
    tag.classList.add(tags[type] + "-flashcard");

    let options = document.createElement('div');
    let favoriteImg = document.createElement('img');
    let menuImg = document.createElement('img');

    favoriteImg.src = "./icons/favorite.png";
    menuImg.src = "./icons/menu_vertical.png";
    options.append(favoriteImg, menuImg);

    mainDiv.append(iconDiv, textDiv, tag, options);
    mainDiv.classList.add('flashcard-deck');
    mainDiv.classList.add(tags[type] + "-flashcard-border");
    mainDiv.setAttribute('onclick', "viewFlashcard(undefined, " + type + ")");
    document.getElementById('flashcards-list').appendChild(mainDiv);
}

function viewFlashcard(card, type){
    console.log("Something")
    document.getElementById('flashcard-stripe').className = "";
    document.getElementById('flashcard-stripe').classList.add(tags[type] + "-flashcard");
    document.getElementById('flashcard-stripe-text').innerHTML = tags[type];

    document.querySelectorAll(".flashcard-action").forEach(function(element){
        element.className = "";
        element.classList.add('flashcard-action')
        element.classList.add(tags[type] + "-flashcard-border");
    })

    togglePageFlip(4)
}

function loadFlashcards(keyword, viewIndex, sortIndex){
    for(let i = 0; i < 105; i++){
        displayFlashcard("Test Elephant Deck", "Random User", Math.floor(Math.random() * 3));
    }
}

function createDeck(){
    togglePageFlip(3);
}