let controlActive = false;
let enableRedirect = false;

const Deck = function(){
    this.terms = {}
    this.authorID = 0;
    this.name = ""
}

function deleteCard(index){
    let exportedDeck = new Deck();

    for(let i = 0; i < document.querySelectorAll('.flashcards-card').length; i++){
        let definitions = [];

        document.querySelectorAll(".flashcards-definition-input-" + (i + 1)).forEach(function(element){
            definitions.push(element.value)
        })

        exportedDeck.terms[document.getElementById("flashcards-input-" + (i + 1)).value] = definitions;
    }

    document.querySelectorAll('.flashcards-card').forEach(function(element){
        element.remove();
    })

    for(let i = 0; i < Object.keys(exportedDeck.terms).length; i++){
        if(i !== index - 1) createCard(Object.keys(exportedDeck.terms)[i], exportedDeck.terms[Object.keys(exportedDeck.terms)[i]])
   }
}

function toggleDisplayView(index){
    document.getElementById('desktop-main-container').className = ""
    if(index === 0){
        document.getElementById('desktop-main-container').classList.add('kanban');
    } else if(index === 1){
        document.getElementById('desktop-main-container').classList.add('list');
    }

    document.querySelectorAll('.view-button').forEach(function(element){
        element.classList.remove('active-view-button');
    })

    document.querySelectorAll('.view-button')[index].classList.add('active-view-button');
}

function addDefinition(index){
    let answersDiv = document.createElement('div');
    let definitionsInput = document.createElement('input');
    let definitionsImg = document.createElement('img');

    definitionsInput.placeholder = "Definition";
    definitionsInput.classList.add('flashcards-definition-input');
    definitionsInput.classList.add('flashcards-definition-input-' + index);
    definitionsImg.src = "./icons/delete.png";
    definitionsImg.setAttribute("onclick", "this.parentNode.remove()");

    answersDiv.append(definitionsInput, definitionsImg);
    answersDiv.classList.add('flashcards-card-answers-div');
    document.getElementById('flashcards-card-answers-' + index).insertBefore(answersDiv, document.getElementById('flashcards-definition-add-' + index));
    document.querySelectorAll('.flashcards-definition-input-' + index)[document.querySelectorAll('.flashcards-definition-input-' + index).length - 1].focus();
}

function duplicateCard(index){
    let definitions = [];

    document.querySelectorAll(".flashcards-definition-input-" + index).forEach(function(element){
        definitions.push(element.value)
    })

    createCard(document.getElementById('flashcards-input-' + index).value, definitions)
}

function createCard(term, definitions){
    let newDiv = document.createElement('div');
    let newNumber = document.createElement('p');
    let copyrightDiv = document.createElement('div');
    let cardTitle = document.createElement('input');
    let definitionsDiv = document.createElement('div');
    let footerDiv = document.createElement('div');

    newNumber.innerHTML = (document.querySelectorAll('.flashcards-card').length + 1).toString();
    newNumber.classList.add('flashcards-card-number');

    let copyrightElephant = document.createElement('img');
    let copyrightTextDiv = document.createElement('div');
    let copyrightText = document.createElement('p');
    let copyrightImg = document.createElement('img');

    copyrightElephant.src = "../../icons/elephant-400-400-black.png";
    copyrightText.innerHTML = "Elephant";
    copyrightImg.src = "./icons/copyright.png";
    copyrightTextDiv.append(copyrightText, copyrightImg);

    copyrightDiv.append(copyrightElephant, copyrightTextDiv);
    copyrightDiv.classList.add('flashcards-card-copyright');

    cardTitle.placeholder = "New Flashcard"

    if(term !== undefined) cardTitle.value = term;

    cardTitle.id = "flashcards-input-" + (document.querySelectorAll('.flashcards-card').length + 1).toString();

    if(definitions === undefined){
        let answersDiv = document.createElement('div');
        let definitionsInput = document.createElement('input');
        let definitionsImg = document.createElement('img');

        definitionsInput.placeholder = "Definition";
        definitionsInput.classList.add('flashcards-definition-input');
        definitionsInput.classList.add('flashcards-definition-input-' + (document.querySelectorAll('.flashcards-card').length + 1).toString());
        definitionsImg.src = "./icons/delete.png";
        definitionsImg.setAttribute("onclick", "this.parentNode.remove()");

        answersDiv.append(definitionsInput, definitionsImg);
        answersDiv.classList.add('flashcards-card-answers-div');

        definitionsDiv.appendChild(answersDiv);
    } else {
        for(let i = 0; i < definitions.length; i++){
            let answersDiv = document.createElement('div');
            let definitionsInput = document.createElement('input');
            let definitionsImg = document.createElement('img');

            definitionsInput.placeholder = "Definition";
            definitionsInput.value = definitions[i];
            definitionsInput.classList.add('flashcards-definition-input');
            definitionsInput.classList.add('flashcards-definition-input-' + (document.querySelectorAll('.flashcards-card').length + 1).toString());
            definitionsImg.src = "./icons/delete.png";
            definitionsImg.setAttribute("onclick", "this.parentNode.remove()");

            answersDiv.append(definitionsInput, definitionsImg);
            answersDiv.classList.add('flashcards-card-answers-div');

            definitionsDiv.appendChild(answersDiv);
        }
    }

    let definitionBtn = document.createElement('button');
    definitionBtn.innerHTML = "+ Add Definition";
    definitionBtn.setAttribute("onclick", "addDefinition(" + (document.querySelectorAll('.flashcards-card').length + 1).toString() + ")")
    definitionBtn.classList.add('flashcards-definition-add');
    definitionBtn.id = 'flashcards-definition-add-' + (document.querySelectorAll('.flashcards-card').length + 1).toString();

    definitionsDiv.appendChild(definitionBtn);
    definitionsDiv.classList.add('flashcards-card-answers')
    definitionsDiv.id = 'flashcards-card-answers-' + (document.querySelectorAll('.flashcards-card').length + 1).toString();

    let footerRight = document.createElement('div');
    let duplicateImg = document.createElement('img');
    let deleteImg = document.createElement('img');

    duplicateImg.src = "./icons/duplicate.png";
    deleteImg.src = "./icons/delete.png";
    duplicateImg.setAttribute("onclick", "duplicateCard(" + (document.querySelectorAll('.flashcards-card').length + 1) + ")")
    deleteImg.setAttribute("onclick", "deleteCard(" + (document.querySelectorAll('.flashcards-card').length + 1) + ")");

    footerRight.classList.add('flashcards-card-footer-right')
    footerRight.append(duplicateImg, deleteImg);

    footerDiv.appendChild(footerRight);
    footerDiv.classList.add('flashcards-card-footer');

    newDiv.append(newNumber, copyrightDiv, cardTitle, definitionsDiv, footerDiv);
    newDiv.classList.add('flashcards-card');

    document.getElementById('desktop-main-container').insertBefore(newDiv, document.getElementById('flashcards-add-card'));
    document.getElementById('flashcards-input-' + document.querySelectorAll('.flashcards-card').length).focus()
}

document.getElementById('save-deck').onclick = function(){
    let exportedDeck = new Deck();

    exportedDeck.name = document.getElementById('deck-name').textContent;

    for(let i = 0; i < document.querySelectorAll('.flashcards-card').length; i++){
        let definitions = [];

        document.querySelectorAll(".flashcards-definition-input-" + (i + 1)).forEach(function(element){
            definitions.push(element.value)
        })

        exportedDeck.terms[document.getElementById("flashcards-input-" + (i + 1)).value] = definitions;
    }

    console.log(exportedDeck);
}

document.addEventListener('keydown', function(e){
    if(e.keyCode === 17) controlActive = true;
    if(e.keyCode === 68 && controlActive){
        e.preventDefault();
        if(document.activeElement.classList.contains('flashcards-definition-input')){
            addDefinition(document.activeElement.classList[1].slice(-1))
        }
    } if(e.keyCode === 13){
        e.preventDefault();
        createCard()
    }
})

document.addEventListener('keyup', function(e){
    if(e.keyCode === 17) controlActive = false;
})

window.addEventListener("beforeunload", function(e){
    if(!enableRedirect) e.returnValue = 'Are you sure you want to leave?';
})

createCard();
toggleDisplayView(0)