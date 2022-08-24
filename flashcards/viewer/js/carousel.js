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
    if(direction === "left" && activeFlashcardCard > 0){
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
        newPara.innerHTML = toTitleCase(deck[activeFlashcardCard].definitions[i]);
        document.getElementById('desktop-flashcard-answers').appendChild(newPara);
    }

    document.getElementById('desktop-flashcard-number').innerHTML = (activeFlashcardCard + 1) + " / " + deck.length;
    document.getElementById('desktop-flashcard-main-header').className = "";
    document.getElementById('desktop-flashcard-answers').className = "inactive-flashcard"
}