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

function toggleFlashcardFlip(){
    document.getElementById('desktop-flashcard-container').classList.remove('unflipped');
    document.getElementById('desktop-flashcard-container').classList.add('flipped');
    setTimeout(function(){
        if(document.getElementById('desktop-flashcard-main-header').classList.contains('inactive-flashcard')){
            document.getElementById('desktop-flashcard-main-header').classList.remove('inactive-flashcard')
            document.getElementById('desktop-flashcard-answers').classList.add('inactive-flashcard')
        } else {
            document.getElementById('desktop-flashcard-answers').classList.remove('inactive-flashcard')
            document.getElementById('desktop-flashcard-main-header').classList.add('inactive-flashcard')
        }

        document.getElementById('desktop-flashcard-container').classList.add('unflipped');
        document.getElementById('desktop-flashcard-container').classList.remove('flipped');
    }, 250);
}

document.getElementById('desktop-flashcard-container').onclick = toggleFlashcardFlip;

function changeFlashcard(direction){
    if(direction === "left" && activeFlashcardCard >= 0){
        activeFlashcardCard -= 1;
    } else if(direction === "right" && activeFlashcardCard < deck.length - 1){
        activeFlashcardCard += 1;
    }

    updateFlashcard()
}

function updateFlashcard(){
    document.getElementById('desktop-flashcard-main-header').innerHTML = deck[activeFlashcardCard].term;
    removeAllChildNodes(document.getElementById('desktop-flashcard-answers'));
    for(let i = 0; i < deck[activeFlashcardCard].definitions.length; i++){
        let newPara = document.createElement('p');
        newPara.innerHTML = deck[activeFlashcardCard].definitions[i];
        document.getElementById('desktop-flashcard-answers').appendChild(newPara);
    }

    document.getElementById('desktop-flashcard-number').innerHTML = (activeFlashcardCard + 1) + " / " + deck.length;
    document.getElementById('desktop-flashcard-main-header').className = "";
    document.getElementById('desktop-flashcard-answers').className = "inactive-flashcard"
}

window.onload = async function(){
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

        const context = await response.json();
        deck = context.context.deck.cards;

        updateFlashcard();
    }
}

function initialize(user){
    if(user.status === "FAILURE") {
        location.href = "../../login"
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