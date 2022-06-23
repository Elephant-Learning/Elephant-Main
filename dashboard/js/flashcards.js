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


function loadFlashcards(keyword, viewIndex, sortIndex){
    console.log(keyword);
}

loadFlashcards();