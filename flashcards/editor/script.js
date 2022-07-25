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

    if(term === undefined){
        cardTitle.placeholder = "New Flashcard"
    } else {
        cardTitle.value = term;
    }

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

            definitionsInput.value = definitions[i];
            definitionsInput.classList.add('flashcards-definition-input');
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
    //Save Deck
}

createCard("Napoleon", ["Cringe worthy", "Died alone"])