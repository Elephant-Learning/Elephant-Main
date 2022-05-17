let reviewCards = [];
let correctAnswers = [];
let progress = 0;
let reviewDeck;

let hardMode = true;

function setupReview(index){
    reviewCards = [];
    progress = 0;

    const object = JSON.parse(localStorage.getItem(localStorage.key(index)));
    reviewDeck = new Deck();

    let sound = new Audio('./sounds/intro.wav')

    if(object.version !== currentVersion) {
        closeDeck();
        sound = new Audio('./sounds/wrong.wav')
        sound.play();
        addNotification("warning", "Error Opening Deck: " + localStorage.key(index));
        return;
    }

    sound.play()

    reviewDeck.cards = object.cards;

    localStorage.setItem(localStorage.key(index), JSON.stringify(reviewDeck));

    for(let i = 0; i < object.cards.length; i++){
        reviewCards.push(false);
        if(i > 1000000) return;
    }

    setupAnswers();
}

function checkAnswer(index){

    let answerDiv = document.createElement('div');
    const parentElem = document.querySelectorAll('.flashcard-def-btn')[index];

    if(parentElem.childElementCount > 1) return;

    if(correctAnswers.includes(index)){
        correctAnswers[correctAnswers.indexOf(index)] = true;
        answerDiv.classList.add('right');
        let sound = new Audio('./sounds/right.wav')
        sound.play();
    } else {
        answerDiv.classList.add('wrong');
        let sound = new Audio('./sounds/wrong.wav')
        sound.play();
    }

    let complete = true;
    let i = 0;

    while(complete){
        if(correctAnswers[i] !== true) {
            complete = false;
            break;
        } else if(i + 1 === correctAnswers.length) break;
        i++
    }

    if(complete){
        setupAnswers();
    }

    parentElem.appendChild(answerDiv);
}

function skipQuestion(index){
    progress--;
    setupAnswers();
    if(!hardMode){
        if(reviewCards[index] === 2){
            reviewCards[index] = false;
        } else {
            reviewCards[index] = 2;
        }
    } else {
        if(reviewCards[index] === true) progress--;
        reviewCards[index] = false;
    }
}

function writtenQuestionCheck(index){
    let answersGiven = document.querySelectorAll('.flashcard-main-input');
    let correctAnswersIndex = reviewDeck.writtenAnswers(index);
    let answersIndexStorage = [];

    let prohibitedChars = ['-', '(', ')', ' '];

    for(let i = 0; i < correctAnswersIndex.length; i++){
        answersIndexStorage.push(0);
    }

    for(let i = 0; i < correctAnswersIndex.length; i++){
        correctAnswersIndex[i] = correctAnswersIndex[i].toLowerCase();
        for(let i = 0; i < prohibitedChars; i++){
            correctAnswersIndex[i].replace(prohibitedChars[i], '');
        }
    }

    for(let i = 0; i < answersGiven.length; i++){
        let answerValue = answersGiven[i].value;
        answerValue = answerValue.toLowerCase();

        for(let i = 0; i < prohibitedChars; i++){
            answerValue.replace(prohibitedChars[i], '');
        }

        let indexOfValue = correctAnswersIndex.indexOf(answerValue);

        console.log(indexOfValue, correctAnswersIndex, answersGiven[i].value, answersIndexStorage)

        if(indexOfValue !== -1 && answersIndexStorage[indexOfValue] === 0){
            answersIndexStorage[indexOfValue] = 1;
            let targetDiv = document.querySelectorAll('.flashcard-answer-light')[i];
            targetDiv.classList.remove('right');
            targetDiv.classList.remove('wrong');
            targetDiv.classList.add('right');
        } else if(answersGiven[i].value !== ""){
            let targetDiv = document.querySelectorAll('.flashcard-answer-light')[i];
            targetDiv.classList.remove('right');
            targetDiv.classList.remove('wrong');
            targetDiv.classList.add('wrong');
        }

        let complete = true;

        for(let i = 0; i < answersIndexStorage.length; i++){
            if(answersIndexStorage[i] === 0) complete = false;
        }

        if(complete) {
            setupAnswers();
            let sound = new Audio('./sounds/right.wav')
            sound.play();
            return;
        }
    }

}

function setupAnswers(){
    let randomCard = undefined;
    progress++

    let child = document.getElementById('flashcard-answers').lastElementChild;

    while (child) {
        document.getElementById('flashcard-answers').removeChild(child);
        child = document.getElementById('flashcard-answers').lastElementChild;
    }

    let complete = true;

    for(let i = 0; i < reviewCards.length; i++){
        if(reviewCards[i] !== true){
            complete = false;
            break;
        }
    }

    if(complete){
        addLevel(1);
        closeDeck();
        popupModal(0)
        return;
    }

    const progressBar = document.getElementById('review-progress');
    progressBar.innerHTML = progress + "/" + reviewCards.length * 2 + " Flashcards";
    progressBar.style.background = "linear-gradient(135deg, var(--theme-color-1) 0%, var(--theme-color-2) " + 100 * progress / (reviewCards.length * 2) + "%, var(--bg-color-1) " + 100 * progress / (reviewCards.length * 2) + "%)";

    while(randomCard === undefined){
        randomCard = Math.floor(Math.random() * reviewCards.length);
        if(reviewCards[randomCard] === true) randomCard = undefined;
    }

    if(reviewCards[randomCard] === false) reviewCards[randomCard] = 2;
    else reviewCards[randomCard] = true;

    if(reviewCards[randomCard] === 2){
        let questionsRandomized = reviewDeck.multipleChoice(randomCard)
        let definitionsArray = questionsRandomized[0];
        correctAnswers = questionsRandomized[1];

        document.getElementById('flashcard-header-text').innerHTML = reviewDeck.cards[randomCard][0];

        for(let i = 0; i < definitionsArray.length; i++){
            let newDiv = document.createElement('div');
            let newBtn = document.createElement('button');

            newBtn.setAttribute('onclick', "checkAnswer(" + i + ")")
            newBtn.classList.add("flashcard-btn-" + i);
            newBtn.innerHTML = definitionsArray[i];
            newDiv.appendChild(newBtn);
            newDiv.classList.add('flashcard-def-btn')
            document.getElementById('flashcard-answers').appendChild(newDiv);
        }

        let skipBtn = document.createElement('button');
        skipBtn.innerHTML = "Skip Question";
        skipBtn.id = "skip-question-btn";
        skipBtn.setAttribute('onclick', "skipQuestion(" + randomCard + ")");

        document.getElementById('flashcard-answers').appendChild(skipBtn);
    } else {
        let correctAnswersIndex = reviewDeck.writtenAnswers(randomCard);

        document.getElementById('flashcard-header-text').innerHTML = reviewDeck.cards[randomCard][0];

        for(let i = 0; i < correctAnswersIndex.length; i++){
            let newDiv = document.createElement('div');
            let newInput = document.createElement('input');
            let answerDiv = document.createElement('div');

            newInput.setAttribute('onchange', "writtenQuestionCheck(" + randomCard + ")")
            newInput.placeholder = "Type Answer Here";
            newInput.classList.add('flashcard-main-input');
            answerDiv.classList.add('flashcard-answer-light');

            if(i === 0) newInput.classList.add("flashcard-input-first");

            newDiv.appendChild(newInput);
            newDiv.appendChild(answerDiv);
            document.getElementById('flashcard-answers').appendChild(newDiv);

            document.querySelector('.flashcard-input-first').focus();
        }

        let skipBtn = document.createElement('button');
        skipBtn.innerHTML = "Skip Question";
        skipBtn.id = "skip-question-btn";
        skipBtn.setAttribute('onclick', "skipQuestion(" + randomCard + ")");

        document.getElementById('flashcard-answers').appendChild(skipBtn);
    }
}
