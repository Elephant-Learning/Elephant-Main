let correntAnswerNumber = 0;
let indexesIncomplete, indexesReviewed, indexesComplete, memorizeWriteCorrectAnswers, deckMaxDefinitions, answeredQuestions, answeredCorrectly, currentQuestionIndex, memorizeSettings;

let unableToAnswer = false;

function memorizeCheckAnswer(index){
    document.querySelectorAll('.desktop-memorize-definition')[index].classList.add('desktop-memorize-definition-selected');
}

function memorizeSetting(setting){
    if(document.querySelectorAll('.desktop-memorize-setting-checkbox')[setting].classList.contains("unchecked")){
        document.querySelectorAll('.desktop-memorize-setting-checkbox')[setting].classList.remove("unchecked")
        document.querySelectorAll('.desktop-memorize-setting-checkbox')[setting].classList.add("checked")
    } else {
        document.querySelectorAll('.desktop-memorize-setting-checkbox')[setting].classList.add("unchecked")
        document.querySelectorAll('.desktop-memorize-setting-checkbox')[setting].classList.remove("checked")
    }
}

function toggleMemorizeSettingsModal(){
    if(document.getElementById('desktop-memorize-settings').classList.contains("expanded")){
        document.getElementById('desktop-memorize-settings').classList.remove("expanded");
        document.getElementById('desktop-memorize-settings').classList.add("shrunk");
    } else {
        document.getElementById('desktop-memorize-settings').classList.add("expanded");
        document.getElementById('desktop-memorize-settings').classList.remove("shrunk");
    }
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

function refreshMemorizePanel(){
    document.getElementById('desktop-memorize-panel-questions-left').innerHTML = indexesIncomplete.length * 2 + indexesReviewed.length;
    document.getElementById('desktop-memorize-panel-questions-left-progress').style.background = "linear-gradient(135deg, var(--primary-accent) 0%, var(--primary-accent-gradient) " + (100 * indexesComplete.length / deck.length) + "%, var(--secondary-accent) " + (100 * indexesComplete.length / deck.length) + "%, var(--secondary-accent-gradient) " + (100 * (indexesReviewed.length + indexesComplete.length) / deck.length) + "%, var(--bg-color-1) " + (100 * (indexesReviewed.length + indexesComplete.length) / deck.length) + "%, var(--bg-color-1) 100%)";
}

function incorrectBtn(){
    document.querySelector('.active-memorize-item').classList.remove('active-memorize-item');
    document.getElementById('desktop-memorize-main-list').classList.add('active-memorize-item');
    unableToAnswer = false;
    skipQuestion();
}

function askMemorizeQuestion(){
    currentQuestionIndex = Math.floor(Math.random() * (indexesIncomplete.length + indexesReviewed.length));
    console.log(currentQuestionIndex, indexesIncomplete.length);

    refreshMemorizePanel()

    if(currentQuestionIndex >= indexesIncomplete.length){
        setupWrite(indexesReviewed[currentQuestionIndex - indexesIncomplete.length]);
    } else {
        setupCard(indexesIncomplete[currentQuestionIndex]);
    }
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
        if(newDiv.classList.contains('desktop-memorize-definition-selected') || unableToAnswer) return;

        memorizeCheckAnswer(newDivIndex);
        if(correct){
            correntAnswerNumber--;
            if(correntAnswerNumber === 0){
                answeredQuestions++;
                answeredCorrectly++;

                setTimeout(function(){
                    indexesIncomplete.splice(indexesIncomplete.indexOf(deckId), 1);
                    indexesReviewed.push(deckId);

                    askMemorizeQuestion()
                }, 0);
            }
        } else {
            document.querySelectorAll('.desktop-memorize-select-img')[newDivIndex].style.background = "linear-gradient(135deg, var(--secondary-accent), var(--secondary-accent-gradient))";
            document.querySelectorAll('.desktop-memorize-select-img')[newDivIndex].style.border = "1px solid var(--secondary-accent)";
            document.querySelectorAll('.desktop-memorize-definition')[newDivIndex].style.border = "1px solid var(--secondary-accent)";
            unableToAnswer = true;
            answeredQuestions++;

            if(deck[deckId].definitions.length > 1){
                document.getElementById('desktop-memorize-incorrect-para').innerHTML = "The answers to the term '" + deck[deckId].term + "' are:"
            } else {
                document.getElementById('desktop-memorize-incorrect-para').innerHTML = "The answer to the term '" + deck[deckId].term + "' is:"
            }

            removeAllChildNodes(document.getElementById("desktop-memorize-incorrect-list"))

            for(let i = 0; i < deck[deckId].definitions.length; i++){
                let newDefinition = document.createElement('div');
                let newDefPara = document.createElement('p');

                newDefPara.innerHTML = deck[deckId].definitions[i];

                newDefinition.appendChild(newDefPara);
                document.getElementById("desktop-memorize-incorrect-list").appendChild(newDefinition);
            }

            setTimeout(function(e){
                document.querySelector('.active-memorize-item').classList.remove('active-memorize-item');
                document.getElementById('desktop-memorize-incorrect').classList.add('active-memorize-item');
            }, 500)
        }
    })

    document.getElementById('desktop-memorize-definitions-list').appendChild(newDiv);
}

document.getElementById('desktop-memorize-skip').onclick = skipQuestion;

function skipQuestion(){
    correntAnswerNumber = 0;
    answeredQuestions++;

    if(currentQuestionIndex >= indexesIncomplete.length){
        let deckId = indexesReviewed[currentQuestionIndex - indexesIncomplete.length];
        indexesReviewed.splice(indexesReviewed.indexOf(deckId), 1);
        indexesIncomplete.push(deckId);
    }

    askMemorizeQuestion();
    document.getElementById('desktop-memorize-panel-questions-left').innerHTML = indexesIncomplete.length * 2 + indexesReviewed.length;
}

function setupWrite(deckIndex){
    removeAllChildNodes(document.getElementById('desktop-memorize-definitions-list'));
    document.getElementById('desktop-memorize-term').innerHTML = deck[deckIndex].term;

    memorizeWriteCorrectAnswers = [];

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
            if(e.key !== "Enter") return;
            let inputValue = this.value.toLowerCase();

            if(memorizeWriteCorrectAnswers.includes(inputValue)){
                let correct = true;

                document.querySelectorAll('.desktop-memorize-write-input').forEach(function(element){
                    if(inputValue === element.value.toLowerCase()){
                        let id = element.id.split('')
                        id = id[id.length - 1];

                        if(id != i) correct = false;
                    }
                })

                if(correct){
                    document.getElementById("desktop-memorize-write-img-div-" + i.toString()).className = "personal";
                    document.getElementById("desktop-memorize-write-img-" + i.toString()).src = "./icons/correct.png";
                    this.setAttribute('readonly', 'true');

                    correntAnswerNumber--;
                    if(correntAnswerNumber === 0){
                        answeredQuestions++;
                        answeredCorrectly++;

                        setTimeout(function(){
                            indexesReviewed.splice(indexesReviewed.indexOf(deckIndex), 1);
                            indexesComplete.push(deckIndex);

                            if(indexesReviewed.length === 0 && indexesIncomplete.length === 0){
                                refreshMemorizePanel();

                                setTimeout(function(){
                                    const appreciations = ["Nice Work", "Great Work", "Great Job", "Awesome Stuff", "Congratulations", "Nice Job", "Good Stuff"];
                                    //Badges index 0: level (1-3), name, condition

                                    const badges = [
                                        [3, "Scored over 50%", answeredCorrectly / answeredQuestions >= 0.5],
                                        [2, "Scored over 80%", answeredCorrectly / answeredQuestions >= 0.8],
                                        [1, "Scored 100%", answeredCorrectly / answeredQuestions === 1],
                                    ]

                                    for(let i = 0; i < badges.length; i++){
                                        if(badges[i][2]) createBadge(badges[i][0], badges[i][1]);
                                    }

                                    document.getElementById('desktop-memorize-complete-header').innerHTML = appreciations[Math.floor(Math.random() * appreciations.length)]
                                    document.getElementById('desktop-memorize-complete-text').innerHTML = "You answered " + answeredCorrectly + " questions correctly out of " + answeredQuestions + " questions!"
                                    document.querySelector('.active-memorize-item').classList.remove('active-memorize-item');
                                    document.getElementById('desktop-memorize-complete').classList.add('active-memorize-item');
                                }, 500)

                                return;
                            }

                            askMemorizeQuestion();
                        }, 0);
                    }
                } else {
                    document.getElementById("desktop-memorize-write-img-div-" + i.toString()).className = "shared";
                    document.getElementById("desktop-memorize-write-img-" + i.toString()).src = "./icons/minus.png";
                }
            } else {
                document.getElementById("desktop-memorize-write-img-div-" + i.toString()).className = "community";
                document.getElementById("desktop-memorize-write-img-" + i.toString()).src = "./icons/wrong.png";
            }

            try{
                document.getElementById('desktop-memorize-write-input-' + (i + 1)).focus();
            } catch (e){}
        })

        newImgDiv.appendChild(newImg);

        newDiv.append(newImgDiv, newInput);
        newDiv.classList.add('desktop-memorize-write');

        document.getElementById('desktop-memorize-definitions-list').appendChild(newDiv);
    }

    document.getElementById('desktop-memorize-write-input-0').focus();
}

function createBadge(level, name){
    let newDiv = document.createElement('div');
    let imgDiv = document.createElement('div');
    let img = document.createElement('img');
    let para = document.createElement('p');

    if(level === 1) imgDiv.style.background = "linear-gradient(135deg, var(--primary-accent), var(--primary-accent-gradient))";
    else if(level === 2) imgDiv.style.background = "linear-gradient(135deg, var(--secondary-accent), var(--secondary-accent-gradient))";
    else if(level === 3) imgDiv.style.background = "linear-gradient(135deg, var(--tertiary-accent), var(--tertiary-accent-gradient))";

    img.src = "./icons/trophy.png";
    para.innerHTML = name;

    imgDiv.appendChild(img);
    newDiv.append(imgDiv, para);
    newDiv.classList.add('desktop-memorize-badge');

    document.getElementById('desktop-memorize-badges').appendChild(newDiv);
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

    if(incorrectAnswerLength > deckMaxDefinitions.length) incorrectAnswerLength = deckMaxDefinitions.length;

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
    deckMaxDefinitions = [];
    memorizeSettings = [];
    answeredQuestions = 0;
    answeredCorrectly = 0;
    currentQuestionIndex = 0;

    document.querySelectorAll('.active-memorize-item').forEach(function(element){
        element.classList.remove('active-memorize-item');
    })

    removeAllChildNodes(document.getElementById('desktop-memorize-badges'));

    document.querySelectorAll(".desktop-memorize-setting-checkbox").forEach(function(element){
        if(element.classList.contains("unchecked")) memorizeSettings.push(0);
        else memorizeSettings.push(1);
    });

    for(let i = 0; i < deck.length; i++){
        indexesIncomplete.push(i)
        for(let j = 0; j < deck[i].definitions.length; j++){
            if(!deckMaxDefinitions.includes(deck[i].definitions[j])) deckMaxDefinitions.push(deck[i].definitions[j]);
        }
    } document.getElementById('desktop-memorize-panel-questions-left').innerHTML = indexesIncomplete.length * 2 + indexesReviewed.length;
    document.getElementById('desktop-memorize-main-list').classList.add('active-memorize-item')

    refreshMemorizePanel();

    setupCard(Math.floor(Math.random() * indexesIncomplete.length + indexesReviewed.length));
}