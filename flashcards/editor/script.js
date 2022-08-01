let controlActive = false;
let enableRedirect = false;
let sharedFriendNumbers = 0;

const Deck = function(){
    this.terms = {}
    this.authorID = 0;
    this.name = ""
}

function deleteCard(index){
    let exportedDeck = new Deck();
    let untitledNums = 0;

    for(let i = 0; i < document.querySelectorAll('.flashcards-card').length; i++){
        let definitions = [];

        document.querySelectorAll(".flashcards-definition-input-" + (i + 1)).forEach(function(element){
            definitions.push(element.value)
        })

        if(document.getElementById("flashcards-input-" + (i + 1)).value === "") {
            untitledNums++;
            document.getElementById("flashcards-input-" + (i + 1)).value = "Untitled-Elephant-Deck-" + untitledNums;
        }

        exportedDeck.terms[document.getElementById("flashcards-input-" + (i + 1)).value] = definitions;
    }

    document.querySelectorAll('.flashcards-card').forEach(function(element){
        element.remove();
    })

    for(let i = 0; i < Object.keys(exportedDeck.terms).length; i++){
        if(i !== index - 1) {
            if(Object.keys(exportedDeck.terms)[i].substring(0,23) === "Untitled-Elephant-Deck-") createCard(undefined, exportedDeck.terms[Object.keys(exportedDeck.terms)[i]])
            else createCard(Object.keys(exportedDeck.terms)[i], exportedDeck.terms[Object.keys(exportedDeck.terms)[i]])
        }
   }
}

function deleteSharedFriend(index){
    document.querySelectorAll('.sharing-friends')[index].remove();
}

function addSharedFriend(pfpId, name, email){
    let newDiv = document.createElement('div');
    let imageDiv = document.createElement('div');
    let image = document.createElement('img');
    let textDiv = document.createElement('div');
    let nameText = document.createElement('h1');
    let emailText = document.createElement('p');
    let removeText = document.createElement('p');

    image.src = "../../icons/avatars/" + pfpId + ".png";
    imageDiv.appendChild(image);

    nameText.innerHTML = name;
    emailText.innerHTML = email;

    textDiv.append(nameText, emailText);
    removeText.innerHTML = "Remove";
    removeText.setAttribute('onclick', "this.parentNode.remove()");

    newDiv.append(imageDiv, textDiv, removeText);
    newDiv.classList.add('sharing-friends');

    document.getElementById('sharing-friends-list').appendChild(newDiv);
    sharedFriendNumbers++;
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
    definitionBtn.tabIndex = 0;

    definitionsDiv.appendChild(definitionBtn);
    definitionsDiv.classList.add('flashcards-card-answers')
    definitionsDiv.id = 'flashcards-card-answers-' + (document.querySelectorAll('.flashcards-card').length + 1).toString();

    let footerRight = document.createElement('div');
    let backpackImg = document.createElement('img')
    let duplicateImg = document.createElement('img');
    let deleteImg = document.createElement('img');

    backpackImg.src = "./icons/pack.png";
    duplicateImg.src = "./icons/duplicate.png";
    deleteImg.src = "./icons/delete.png";
    duplicateImg.setAttribute("onclick", "duplicateCard(" + (document.querySelectorAll('.flashcards-card').length + 1) + ")")
    deleteImg.setAttribute("onclick", "deleteCard(" + (document.querySelectorAll('.flashcards-card').length + 1) + ")");

    footerRight.classList.add('flashcards-card-footer-right')
    footerRight.append(backpackImg, duplicateImg, deleteImg);

    footerDiv.appendChild(footerRight);
    footerDiv.classList.add('flashcards-card-footer');

    newDiv.append(newNumber, copyrightDiv, cardTitle, definitionsDiv, footerDiv);
    newDiv.classList.add('flashcards-card');

    document.getElementById('desktop-main-container').insertBefore(newDiv, document.getElementById('flashcards-add-card'));
    document.getElementById('flashcards-input-' + document.querySelectorAll('.flashcards-card').length).focus()
}

function displayAlert(index, content){
    let refactoredContent = "";

    console.log(index, content);

    if(index === 0){
        const errorTypes = ["Unnamed Card: Card ", "Definition Left Blank: Card "]

        for(let i = 0; i < content.length; i++){
            if(refactoredContent !== "") refactoredContent = refactoredContent + ", " + errorTypes[content[i][1]] + (content[i][0] + 1);
            else refactoredContent = errorTypes[content[i][1]] + (content[i][0] + 1)
        }

        console.log(refactoredContent);

        document.querySelectorAll('.desktop-alert-desc')[index].innerHTML = "Please Correct The Following Errors: " + refactoredContent;
    }

    document.querySelectorAll('.desktop-alert')[index].classList.remove('inactive-modal');
    setTimeout(function(){
        document.querySelectorAll('.desktop-alert')[index].classList.add('inactive-modal');
    }, 10000);
}

function toggleBackpackModal(){
    if(document.getElementById('backpack-modal').classList.contains('inactive-modal')) {
        document.getElementById('backpack-tag-text').innerHTML = "Close Backpack";
        document.getElementById('backpack-modal').classList.remove('inactive-modal');
    } else {
        document.getElementById('backpack-tag-text').innerHTML = "Open Backpack";
        document.getElementById('backpack-modal').classList.add('inactive-modal')
    }
}

function toggleSharingModal(){
    if(document.getElementById('desktop-sharing-modal').classList.contains('inactive-modal')){
        document.getElementById('desktop-sharing-modal').classList.remove('inactive-modal')
    } else {
        document.getElementById('desktop-sharing-modal').classList.add('inactive-modal')
    }
}

document.getElementById('save-deck').onclick = function(){
    let exportedDeck = new Deck();
    let errors = [];

    exportedDeck.name = document.getElementById('deck-name').textContent;

    for(let i = 0; i < document.querySelectorAll('.flashcards-card').length; i++){
        let definitions = [];

        if(document.getElementById("flashcards-input-" + (i + 1)).value === "") errors.push([i, 0])

        document.querySelectorAll(".flashcards-definition-input-" + (i + 1)).forEach(function(element){
            if(element.value === "") errors.push([i, 1])
            definitions.push(element.value)
        })

        exportedDeck.terms[document.getElementById("flashcards-input-" + (i + 1)).value] = definitions;
    }

    if(errors.length === 0) console.log(exportedDeck);
    else displayAlert(0, errors);
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

function initialize(){
    createCard()
    toggleDisplayView(0)
    window.scrollTo(0,0);

    for(let i = 0; i < 23; i++){
        addSharedFriend(Math.floor(Math.random() * 47), "Elephant Student", "student@elephantsuite.me")
    }
}

initialize();