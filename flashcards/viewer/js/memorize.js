let correntAnswerNumber = 0;
let indexesIncomplete, indexesReviewed, indexesComplete, memorizeWriteCorrectAnswers;
let deckMaxDefinitions = 0;

function memorizeCheckAnswer(index){
    document.querySelectorAll('.desktop-memorize-definition')[index].classList.add('desktop-memorize-definition-selected');
}

function shuffleArray(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function createMemorizeOption(text, correct, deckId){
    let newDiv = document.createElement('div');
    let newPara = document.createElement('p');
    let newDivIndex = document.querySelectorAll('.desktop-memorize-definition').length;

    newPara.innerHTML = toTitleCase(text);

    let selectImgContainer = document.createElement('div');
    let selectImg = document.createElement('img');

    if(correct) {
        selectImg.src = "./icons/correct.png";
        correntAnswerNumber++;
    } else selectImg.src = "./icons/wrong.png";

    selectImgContainer.appendChild(selectImg);
    selectImgContainer.classList.add('desktop-memorize-select-img');

    let memorizeOptions = document.createElement('div');
    /*let strikethrough = document.createElement('img');

    strikethrough.src = "./icons/cancel.png";*/

    memorizeOptions.classList.add("desktop-memorize-options");
    //memorizeOptions.appendChild(strikethrough);

    newDiv.append(newPara, selectImgContainer, memorizeOptions);
    newDiv.classList.add('desktop-memorize-definition');

    newDiv.addEventListener('click', function(e){
        memorizeCheckAnswer(newDivIndex);
        if(correct){
            correntAnswerNumber--;
            if(correntAnswerNumber === 0){
                indexesIncomplete.splice(indexesIncomplete.indexOf(deckId), 1);
                indexesReviewed.push(deckId);

                if(indexesReviewed.length === 0 && indexesIncomplete.length === 0) console.log("Fully Finished");
                let nextRandomCard = Math.floor(Math.random() * (indexesIncomplete.length + indexesReviewed.length));

                document.getElementById('desktop-memorize-panel-questions-left').innerHTML = indexesIncomplete.length * 2 + indexesReviewed.length;
                document.getElementById('desktop-memorize-panel-questions-left-progress').style.background = "linear-gradient(135deg, var(--primary-accent) 0%, var(--primary-accent-gradient) " + (100 * indexesComplete.length / deck.length) + "%, var(--secondary-accent) " + (100 * indexesComplete.length / deck.length) + "%, var(--secondary-accent-gradient) " + (100 * (indexesReviewed.length + indexesComplete.length) / deck.length) + "%, var(--bg-color-1) " + (100 * (indexesReviewed.length + indexesComplete.length) / deck.length) + "%, var(--bg-color-1) 100%)";

                if(nextRandomCard >= indexesIncomplete.length){
                    setupWrite(indexesReviewed[nextRandomCard - indexesIncomplete.length]);
                } else {
                    setupCard(indexesIncomplete[nextRandomCard]);
                }
            }
        }
    })

    document.getElementById('desktop-memorize-definitions-list').appendChild(newDiv);
}

document.getElementById('desktop-memorize-skip').onclick = skipQuestion;

function skipQuestion(){
    correntAnswerNumber = 0;
    let nextRandomCard = Math.floor(Math.random() * (indexesIncomplete.length + indexesReviewed.length));

    if(nextRandomCard >= indexesIncomplete.length){
        setupWrite(indexesReviewed[nextRandomCard - indexesIncomplete.length]);
    } else {
        setupCard(indexesIncomplete[nextRandomCard]);
    }
    document.getElementById('desktop-memorize-panel-questions-left').innerHTML = indexesIncomplete.length * 2 + indexesReviewed.length;
}

function setupWrite(deckIndex){
    removeAllChildNodes(document.getElementById('desktop-memorize-definitions-list'));
    document.getElementById('desktop-memorize-term').innerHTML = deck[deckIndex].term;

    memorizeWriteCorrectAnswers = [];

    console.log(deck[deckIndex].definitions.length, deck[deckIndex].definitions);

    for(let i = 0; i < deck[deckIndex].definitions.length; i++){
        memorizeWriteCorrectAnswers.push(deck[deckIndex].definitions[i].toLowerCase());
        correntAnswerNumber++;

        let newDiv = document.createElement('div');
        let newImgDiv = document.createElement('div');
        let newImg = document.createElement('img');
        let newInput = document.createElement('input');

        newImgDiv.classList.add('shared');
        newImg.src = "./icons/minus.png"
        newImg.id = "desktop-memorize-write-img-" + i.toString();
        newImgDiv.id = "desktop-memorize-write-img-div-" + i.toString();
        newInput.id = "desktop-memorize-write-input-" + i.toString();
        newInput.classList.add("desktop-memorize-write-input");

        newInput.addEventListener('keypress', function(e){
            if(e.key !== "Enter" && e.key !== "Tab") return;
            let inputValue = this.value.toLowerCase();

            if(memorizeWriteCorrectAnswers.includes(inputValue)){
                let correct = true;

                document.querySelectorAll('.desktop-memorize-write-input').forEach(function(element){
                    if(inputValue === element.value.toLowerCase()){
                        let id = element.id.split('')
                        id = id[id.length - 1];
                        console.log(id);

                        if(id != i) correct = false;
                    }
                })

                if(correct){
                    document.getElementById("desktop-memorize-write-img-div-" + i.toString()).className = "personal";
                    document.getElementById("desktop-memorize-write-img-" + i.toString()).src = "./icons/correct.png";
                    this.setAttribute('readonly', 'true');

                    correntAnswerNumber--;
                    if(correntAnswerNumber === 0){
                        indexesReviewed.splice(indexesReviewed.indexOf(deckIndex), 1);
                        indexesComplete.push(deckIndex);

                        if(indexesReviewed.length === 0 && indexesIncomplete.length === 0) console.log("Fully Finished");
                        let nextRandomCard = Math.floor(Math.random() * (indexesIncomplete.length + indexesReviewed.length));

                        document.getElementById('desktop-memorize-panel-questions-left').innerHTML = indexesIncomplete.length * 2 + indexesReviewed.length;
                        document.getElementById('desktop-memorize-panel-questions-left-progress').style.background = "linear-gradient(135deg, var(--primary-accent) 0%, var(--primary-accent-gradient) " + (100 * indexesComplete.length / deck.length) + "%, var(--secondary-accent) " + (100 * indexesComplete.length / deck.length) + "%, var(--secondary-accent-gradient) " + (100 * (indexesReviewed.length + indexesComplete.length) / deck.length) + "%, var(--bg-color-1) " + (100 * (indexesReviewed.length + indexesComplete.length) / deck.length) + "%, var(--bg-color-1) 100%)";

                        if(nextRandomCard >= indexesIncomplete.length){
                            setupWrite(indexesReviewed[nextRandomCard - indexesIncomplete.length]);
                        } else {
                            setupCard(indexesIncomplete[nextRandomCard]);
                        }
                    }
                } else {
                    document.getElementById("desktop-memorize-write-img-div-" + i.toString()).className = "shared";
                    document.getElementById("desktop-memorize-write-img-" + i.toString()).src = "./icons/minus.png";
                }
            } else {
                document.getElementById("desktop-memorize-write-img-div-" + i.toString()).className = "community";
                document.getElementById("desktop-memorize-write-img-" + i.toString()).src = "./icons/wrong.png";
            }
        })

        newImgDiv.appendChild(newImg);

        newDiv.append(newImgDiv, newInput);
        newDiv.classList.add('desktop-memorize-write');

        document.getElementById('desktop-memorize-definitions-list').appendChild(newDiv);
    }
}

function setupCard(deckIndex){
    removeAllChildNodes(document.getElementById('desktop-memorize-definitions-list'));

    let randomizedAnswers = [], incorrectAnswerLength;
    document.getElementById('desktop-memorize-term').innerHTML = deck[deckIndex].term;

    for(let i = 0; i < deck[deckIndex].definitions.length; i++){
        randomizedAnswers.push([deck[deckIndex].definitions[i], true]);
    }

    if(randomizedAnswers.length > 3) incorrectAnswerLength = randomizedAnswers.length * 2 + Math.floor(Math.random() * 2) - 1;
    else incorrectAnswerLength = randomizedAnswers.length * 2 + Math.floor(Math.random() * 2);

    console.log(incorrectAnswerLength, deckMaxDefinitions);
    if(incorrectAnswerLength > deckMaxDefinitions) incorrectAnswerLength = deckMaxDefinitions;

    while(randomizedAnswers.length < incorrectAnswerLength){
        let randomAnswer = deck[Math.floor(Math.random() * deck.length)];
        randomAnswer = randomAnswer.definitions[Math.floor(Math.random() * randomAnswer.definitions.length)];

        let answerAlreadyThere = false;

        for(let i = 0; i < randomizedAnswers.length; i++){
            if(randomAnswer === randomizedAnswers[i][0]) answerAlreadyThere = true;
        }

        if(!answerAlreadyThere){
            randomizedAnswers.push([randomAnswer, false])
        }
    }

    randomizedAnswers = shuffleArray(randomizedAnswers);

    for(let i = 0; i < randomizedAnswers.length; i++){
        createMemorizeOption(randomizedAnswers[i][0], randomizedAnswers[i][1], deckIndex);
    }
}

function initializeMemorize(){
    indexesIncomplete = [];
    indexesReviewed = [];
    indexesComplete = [];

    for(let i = 0; i < deck.length; i++){
        indexesIncomplete.push(i)
        for(let j = 0; j < deck[i].definitions.length; j++){
            deckMaxDefinitions++;
        }
    } document.getElementById('desktop-memorize-panel-questions-left').innerHTML = indexesIncomplete.length * 2 + indexesReviewed.length;
    setupCard(Math.floor(Math.random() * indexesIncomplete.length + indexesReviewed.length));
}