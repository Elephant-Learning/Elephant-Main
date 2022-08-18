let deck;
let termActiveSlide = true;
let activeFlashcardCard = 0;

function togglePageFlip(index, sidebar, link){

    const pages = ["Deck Carousel", "Deck Memorize", "Deck Review", "Deck Statistics"];

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

        updateFlashcard();
        initializeMemorize();
        return;
    }

    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    const response = await fetch('https://elephant-rearend.herokuapp.com/deck/get?id=' + document.location.href.split("=")[1], {
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

    if(savedUserId !== context.context.deck.authorId && !context.context.deck.sharedUsers.includes(savedUserId)) {
        location.href = "../dashboard";
        return;
    }

    if(context.context.deck.visibility === "PUBLIC") document.getElementById('desktop-sidebar-deck-type').classList.add('community');
    else if(context.context.deck.visibility === "SHARED") document.getElementById('desktop-sidebar-deck-type').classList.add('shared');
    else if(context.context.deck.visibility === "PRIVATE") document.getElementById('desktop-sidebar-deck-type').classList.add('personal');

    document.getElementById('desktop-sidebar-deck-name').innerHTML = context.context.deck.name;

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

    const userResponse = await fetch('https://elephant-rearend.herokuapp.com/login/user?id=' + context.context.deck.authorId, {
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

    document.getElementById('desktop-sidebar-deck-author-img').src = "../../icons/avatars/" + userContext.context.user.pfpId + ".png"
    document.getElementById('desktop-sidebar-deck-author').innerHTML = userContext.context.user.firstName + " " + userContext.context.user.lastName

    deck = context.context.deck.cards;

    updateFlashcard();
    initializeMemorize();
}

function initialize(user){
    if(user.status === "FAILURE") {
        location.href = "../../../login"
    } else user = user.context.user;

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png";
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();

    togglePageFlip(0, 0);
}

async function locateUserInfo(){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
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

locateUserInfo()