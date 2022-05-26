const cardDiv = document.querySelector("#main-create");
const colorRange = [["#2472fc", "#8711c1", "#354382"], ["#FA0874", "#e91fa8", "#9c2158"], ["#FF7D58", "#FFCC4B", "#ad5c45"], ["#49DEB2", "#23E256", "#338778"]];
const bgRange = [["#ffffff", "#f6f7fb", "#ffffff"], ["#0d1117", "#21262b", "#161b22"]];

let inputDistribution = [];
let reviewTerms = [];
let reviewDefinitions = [];
let cardIndex = 0;
let createModalActive = false;
let reviewModalActive = false;
let editingDeck = false;
let activeInput = 0;

let selectedCreateColor;
let currentOpenDeck;
let currentVersion = "v0.1.0-beta-3";

let controlActive = false;

const Notifications = function(){
    this.images = [];
    this.notifs = [];
    this.dates = [];

    this.push = function(images, notifs, dates){
        this.images.push(images);
        this.notifs.push(notifs);
        this.dates.push(dates);
    }

    this.deleteOld = function(){
        let today = new Date();

        for(let i = 0; i < this.dates.length; i++){
            let difference = (today.getTime - this.dates[i]) / 1000;
            difference = difference / 2592000;

            if(Math.abs(Math.round(difference)) > 1){
                delete this.images[i];
                delete this.notifs[i];
                delete this.dates[i];
            }
        }
    }
}

const Deck = function(){
    this.desc = "A New Elephant Deck";
    this.image = 0;
    this.cards = [];
    this.version = currentVersion;
    this.lastOpened = new Date();
    this.subject = "other"

    this.push = function(term, definitionArray){
        this.cards.push([term, definitionArray]);
    }

    this.pop = function(index){
        delete this.cards[index]
    }

    this.multipleChoice = function(index){
        let randomizedArray = [];
        let correctAnswersIndex = [];

        let indexLength = this.cards[index][1].length;

        for(let i = 0; i < indexLength; i++){
            randomizedArray.push(this.cards[index][1][i])
            correctAnswersIndex.push(this.cards[index][1][i])
        }

        if(this.cards.length !== 1){
            for(let i = 0; i < indexLength + Math.floor(Math.random() * (indexLength + 2)); i++){
                let randomInt = Math.floor(Math.random() * this.cards.length)
                if(randomInt === index) i--
                else {
                    let item = this.cards[randomInt][1][Math.floor(Math.random() * this.cards[randomInt][1].length)];
                    if(!randomizedArray.includes(item)) randomizedArray.push(item);
                }
            }
        }

        for (let i = randomizedArray.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = randomizedArray[i];
            randomizedArray[i] = randomizedArray[j];
            randomizedArray[j] = temp;
        }

        for(let i = 0; i < randomizedArray.length; i++){
            if(correctAnswersIndex.includes(randomizedArray[i])){
                let tempIndex = correctAnswersIndex.indexOf(randomizedArray[i]);
                correctAnswersIndex[tempIndex] = i;
            }
        }

        return [randomizedArray, correctAnswersIndex];
    }

    this.writtenAnswers = function(index){
        let correctAnswers = []

        for(let i = 0; i < this.cards[index][1].length; i++){
            correctAnswers.push(this.cards[index][1][i])
        }

        return correctAnswers;
    }
}

function addLevel(amount){
    let userLevel = localStorage.getItem('level-index');
    userLevel = parseInt(userLevel);

    userLevel += amount;
    localStorage.setItem('level-index', userLevel.toString());
    setupLevel();
}

function setupLevel(){
    let userLevel = localStorage.getItem('level-index');
    let index = 0;

    const progressBar = document.getElementById('progress-bar')

    userLevel = parseInt(userLevel);

    while(2**index <= userLevel){
        index++;
    }

    index--;
    progressBar.innerHTML = "Level " + index;
    progressBar.style.background = "linear-gradient(135deg, var(--theme-color-1) 0%, var(--theme-color-2)" + (100 * (userLevel - 2**index)/2**index) + "%, var(--bg-color-2)" + (100 * (userLevel - 2**index)/2**index) + "%)"
}

function setupNotifications(){
    let child = document.getElementById('notifications-modal').lastElementChild;

    while (child) {
        document.getElementById('notifications-modal').removeChild(child);
        child = document.getElementById('notifications-modal').lastElementChild;
    }

    let notifStorage = localStorage.getItem('notifications-storage');
    notifStorage = JSON.parse(notifStorage);

    let newNotif = new Notifications();
    newNotif.images = notifStorage.images;
    newNotif.notifs = notifStorage.notifs;
    newNotif.dates = notifStorage.dates;

    for(let i = newNotif.notifs.length - 1; i > -1; i--){
        let notifDiv = document.createElement('div');
        let notifImg = document.createElement('img');
        let notifBody = document.createElement('div');
        let para = document.createElement('p');
        let dateH6 = document.createElement('h6');

        notifImg.src = "./icons/" + newNotif.images[i] + ".svg";
        para.innerHTML = newNotif.notifs[i];

        let newDate = new Date(newNotif.dates[i])
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        dateH6.innerHTML = months[newDate.getMonth()] + " " + newDate.getDate() + ", " + newDate.getFullYear();

        notifBody.appendChild(para);
        notifBody.appendChild(dateH6);

        notifDiv.appendChild(notifImg);
        notifDiv.appendChild(notifBody);
        document.getElementById('notifications-modal').appendChild(notifDiv)
    }
}

document.getElementById('import-file-trigger').onclick = function(){
    document.getElementById('import-file-upload').click();
}

document.getElementById('import-file-upload').addEventListener('change', function(e){
    const fileList = document.getElementById('import-file-upload').files;
    document.getElementById('import-deck-modal-file').innerHTML = fileList[Object.keys(fileList)[0]].name;
});

function uploadDeck(){
    importDeck()

    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(document.getElementById('import-file-upload').files[0])
}

function addNotification(image, notif){
    let today = new Date();
    let notifStorage = localStorage.getItem('notifications-storage');
    notifStorage = JSON.parse(notifStorage);

    let newNotif = new Notifications();
    newNotif.images = notifStorage.images;
    newNotif.notifs = notifStorage.notifs;
    newNotif.dates = notifStorage.dates;

    newNotif.push(image, notif, today.getTime());

    localStorage.setItem('notifications-storage', JSON.stringify(newNotif));

    setupNotifications()
}

function handleFileLoad(event) {
    uploadedDeck = event.target.result;

    const fileList = document.getElementById('import-file-upload').files;
    let fileName = fileList[Object.keys(fileList)[0]].name;
    fileName = fileName.replaceAll('_', ' ')
    fileName = fileName.substring(0, fileName.length - 6)

    addLevel(2);
    addNotification("add_deck", "Imported New Deck: " + fileName);

    localStorage.setItem(fileName, uploadedDeck)

    loadDecks(undefined, undefined);
}

function addDefinition(index, value){
    let inputDiv = document.createElement('div');
    let newInput = document.createElement('input');
    let deleteInput = document.createElement('img')

    inputDistribution[index - 1]++;

    deleteInput.src = "./icons/delete.svg";
    deleteInput.setAttribute('onclick', 'deleteDefinition(' + index + ',' + inputDistribution[index - 1] + ')');

    newInput.placeholder = "Definition " + inputDistribution[index - 1];
    newInput.id = 'dinput-' + index + "-" + inputDistribution[index - 1];
    newInput.setAttribute("onfocus", "activeInput = " + index);

    inputDiv.classList.add('definition-div');

    if(value !== undefined){
        newInput.value = value;
    }

    inputDiv.appendChild(newInput);
    inputDiv.appendChild(deleteInput);

    document.querySelector(".ddiv-" + index).insertBefore(inputDiv, document.querySelector(".dbtn-" + index));
    document.querySelector("#dinput-" + index + "-" + inputDistribution[index - 1]).focus();
    document.querySelector("#dinput-" + index + "-" + inputDistribution[index - 1]).scrollIntoView();
}

function deleteCard(index){
    const terms = document.querySelectorAll(".term-input");
    let title = document.querySelector("#create-deck-name").value;
    const description = document.querySelector("#create-deck-desc");
    const subjectElem = document.getElementById('subject-input');

    const prohibitedTitles = ["theme-index", "notifications-storage", "level-index", "image-indexes"]

    if(editingDeck === false) if(localStorage.getItem(title) !== null || prohibitedTitles.includes(title) || !title) {
        let newTitleIndex = 0;
        let titleTaken = true;

        while(titleTaken){
            newTitleIndex++;
            if(!localStorage.getItem("Untitled-" + newTitleIndex)) titleTaken = false;
        }

        title = "Untitled-" + newTitleIndex;
    }

    let newDeck = new Deck();

    if(description.value === "") description.value = "A New Elephant Deck!"

    newDeck.desc = description.value;
    newDeck.image = selectedCreateColor;
    newDeck.subject = subjectElem.options[subjectElem.selectedIndex].value;


    let definitionList = [];

    console.log(inputDistribution);

    for(let i = 0; i < terms.length; i++){
        for(let j = 0; j < inputDistribution[i]; j++){
            definitionList.push(document.getElementById("dinput-" + (i + 1) + "-" + (j + 1)).value);
        }
        newDeck.push(terms[i].value, definitionList);
        definitionList = [];
    }

    newDeck.pop(index - 1);
    console.log(newDeck, index);

    let child = document.getElementById('main-create').lastElementChild;

    while (child) {
        document.getElementById('main-create').removeChild(child);
        child = document.getElementById('main-create').lastElementChild;
    }

    inputDistribution = [];
    cardIndex = 0;

    let newBtn = document.createElement('button');
    newBtn.id = "new-card-btn";
    newBtn.innerHTML = "+ Add New Card"
    newBtn.setAttribute('onclick', "createNewCard(undefined, undefined)");

    document.getElementById('main-create').appendChild(newBtn);

    for(let i = 0; i < newDeck.cards.length; i++){
        createNewCard(newDeck.cards[i][0], newDeck.cards[i][1])
    }

    try{setCreateColor(newDeck.image)}
    catch{setCreateColor(0)}
}

function createNewCard(term, descriptionList){
    let newDiv = document.createElement('div');
    let indexPara = document.createElement('p')
    let childDiv = document.createElement('div');
    let termInput = document.createElement('input');
    let definitionDiv = document.createElement('div');
    let definitionBtn = document.createElement('button');

    inputDistribution.push(0);

    cardIndex++;
    indexPara.innerHTML = cardIndex;
    indexPara.id = "card-index-para-" + cardIndex;

    let deleteCardImg = document.createElement('img');

    deleteCardImg.src = "./icons/delete.svg";
    deleteCardImg.setAttribute('onclick', 'deleteCard(' + cardIndex + ')')
    indexPara.appendChild(deleteCardImg);

    termInput.placeholder = "Term"
    termInput.setAttribute('onfocus', "activeInput = " + cardIndex);

    definitionBtn.innerHTML = "+ Add Answer"
    definitionBtn.setAttribute('onclick', 'addDefinition(' + cardIndex + ')');
    definitionDiv.classList.add("ddiv-" + cardIndex);
    definitionBtn.classList.add("dbtn-" + cardIndex);
    termInput.classList.add("term-input")

    if(term !== undefined) termInput.value = term;

    definitionDiv.appendChild(definitionBtn);

    childDiv.appendChild(termInput);
    childDiv.appendChild(definitionDiv);

    newDiv.appendChild(indexPara);
    newDiv.appendChild(childDiv);
    newDiv.classList.add('card-div');
    cardDiv.insertBefore(newDiv, document.querySelector("#new-card-btn"));

    if(descriptionList === undefined || descriptionList.length === 0){
        addDefinition(cardIndex, "");
    } else {
        for(let i = 0; i < descriptionList.length; i++){
            addDefinition(cardIndex, descriptionList[i]);
        }
    }

    termInput.focus();
    if(document.querySelectorAll(".term-input")[cardIndex - 1] !== undefined) document.querySelectorAll(".term-input")[cardIndex - 1].scrollIntoView();
}

function saveChanges(edit){
    const terms = document.querySelectorAll(".term-input");
    let title = document.querySelector("#create-deck-name").value;
    const description = document.querySelector("#create-deck-desc");
    const subjectElem = document.getElementById('subject-input');

    const prohibitedTitles = ["theme-index", "notifications-storage", "level-index", "image-indexes"]

    if(editingDeck === false) if(localStorage.getItem(title) !== null || prohibitedTitles.includes(title) || !title) {
        let newTitleIndex = 0;
        let titleTaken = true;

        while(titleTaken){
            newTitleIndex++;
            if(!localStorage.getItem("Untitled-" + newTitleIndex)) titleTaken = false;
        }

        title = "Untitled-" + newTitleIndex;
    }

    let newDeck = new Deck();

    if(description.value === "") description.value = "A New Elephant Deck!"

    newDeck.desc = description.value;
    newDeck.image = selectedCreateColor;
    newDeck.subject = subjectElem.options[subjectElem.selectedIndex].value;


    let definitionList = [];

    for(let i = 0; i < terms.length; i++){
        for(let j = 0; j < inputDistribution[i]; j++){
            definitionList.push(document.getElementById("dinput-" + (i + 1) + "-" + (j + 1)).value);
        }
        newDeck.push(terms[i].value, definitionList);
        definitionList = [];
    }

    localStorage.setItem(title, JSON.stringify(newDeck));

    let sound = new Audio('./sounds/right.wav')
    sound.play();

    addLevel(1)
    addNotification("create", "Deck Created/Edited: " + title);

    document.getElementById('create-modal').classList.add('inactive-modal');
    document.getElementById('create-modal').classList.remove('active-modal');
    createModalActive = false;
    loadDecks(undefined, undefined);
}

function exportData() {
    saveChanges()
    let blob = new Blob([localStorage.getItem(document.getElementById('create-deck-name').value)],
        { type: ".edeck;charset=utf-8" });
    saveAs(blob, document.getElementById('create-deck-name').value + ".edeck");
}

function exportDeck(i) {
    saveChanges()
    let blob = new Blob([localStorage.getItem(localStorage.key(i))],
        { type: ".edeck;charset=utf-8" });
    saveAs(blob, document.getElementById('create-deck-name').value + ".edeck");
}

function createDeck(){
    cardIndex = 0;
    inputDistribution = [];
    editingDeck = false;
    document.getElementById('sort-div').classList.add('inactive-sort')
    imageInput = document.createElement('input');

    let child = document.getElementById('main-create').lastElementChild;

    while (child) {
        document.getElementById('main-create').removeChild(child);
        child = document.getElementById('main-create').lastElementChild;
    }

    document.getElementById('create-deck-name').value = "";
    document.getElementById('create-deck-desc').value = "";
    document.getElementById('create-deck-img').value = "";

    createNewCard(undefined, undefined);

    let newBtn = document.createElement('button');
    newBtn.id = "new-card-btn";
    newBtn.innerHTML = "+ Add New Card"
    newBtn.setAttribute('onclick', "createNewCard(undefined, undefined)");

    document.getElementById('main-create').appendChild(newBtn);

    //System.out.print("Something")

    document.getElementById('create-header').innerHTML = "Create A New Deck";
    document.getElementById('create-description').innerHTML = "You will now create a new Elephant Study Deck that you can access on your computer at any time. Good luck studying!"
    document.getElementById('create-modal').classList.remove('inactive-modal');
    document.getElementById('create-modal').classList.add('active-modal');
    createModalActive = true;
}

function deleteDeck(index){
    let notifStorage = localStorage.getItem('notifications-storage');

    addNotification("delete", "Deleted Deck: " + localStorage.key(index));

    localStorage.removeItem(localStorage.key(index))

    let sound = new Audio('./sounds/wrong.wav')
    sound.play();

    loadDecks(undefined, undefined);
}

function editDeck(index){
    let object = JSON.parse(localStorage.getItem(localStorage.key(index)));
    editingDeck = true;
    currentOpenDeck = index;
    //localStorage.removeItem(localStorage.key(index))
    inputDistribution = [];
    cardIndex = 0;

    let child = document.getElementById('main-create').lastElementChild;

    while (child) {
        document.getElementById('main-create').removeChild(child);
        child = document.getElementById('main-create').lastElementChild;
    }

    if(localStorage.key(index).includes("Untitled-")) document.getElementById('create-deck-name').value = "";
    else document.getElementById('create-deck-name').value = localStorage.key(index);

    if(object.desc === "A New Elephant Deck!") object.desc = ""

    document.getElementById('create-deck-desc').value = object.desc;
    document.getElementById('create-deck-img').value = object.image;
    document.getElementById('subject-input').value = object.subject;

    let newBtn = document.createElement('button');
    newBtn.id = "new-card-btn";
    newBtn.innerHTML = "+ Add New Card"
    newBtn.setAttribute('onclick', "createNewCard(undefined, undefined)");

    document.getElementById('main-create').appendChild(newBtn);

    for(let i = 0; i < object.cards.length; i++){
        createNewCard(object.cards[i][0], object.cards[i][1])
    }

    try{setCreateColor(object.image)}
    catch{setCreateColor(0)}

    document.getElementById('create-header').innerHTML = "Edit An Existing Deck";
    document.getElementById('create-description').innerHTML = "You will now edit an existing Elephant Study Deck that you can access on your computer at any time. Good luck studying!"
    document.getElementById('create-modal').classList.remove('inactive-modal');
    document.getElementById('create-modal').classList.add('active-modal');
    createModalActive = true;
}

function checkSort(clear){
    let titleSort = document.getElementById('sort-title-input').value;
    let subjectSort = document.getElementById('sort-subject-input').value;
    let clearSorts = document.getElementById("clear-sorts-btn");

    if(clear){
        clearSorts.classList.remove("active-button");
        clearSorts.classList.add("inactive-button");

        titleSort = undefined;
        subjectSort = undefined;
    } else {
        if(titleSort === "") titleSort = undefined;
        else titleSort = titleSort.toLowerCase()


        if(subjectSort === "disabled") subjectSort = undefined;
        clearSorts.classList.add("active-button");
        clearSorts.classList.remove("inactive-button");
    }

    loadDecks(subjectSort, titleSort);
}

function loadDecks(sort, title){
    let child = document.getElementById('main-container').lastElementChild;
    const prohibitedTitles = ["theme-index", "notifications-storage", "level-index", "image-indexes", "favorite-music"]

    while (child) {
        document.getElementById('main-container').removeChild(child);
        child = document.getElementById('main-container').lastElementChild;
    }

    if(!title) document.getElementById('sort-title-input').value = "";
    if(!sort) document.getElementById('sort-subject-input').value = "disabled"

    for(let i = 0; i < localStorage.length; i++){
        let newDiv = document.createElement('div');
        let imageDiv = document.createElement('div');
        let textDiv = document.createElement('div');
        let header = document.createElement('h1');
        let subjectDiv = document.createElement('div');
        let subject = document.createElement('img')
        let para = document.createElement('p');
        let button = document.createElement('button');
        let edit = document.createElement('img');
        let deleteItem = document.createElement('img');
        let printItem = document.createElement('img');
        let exportDeck = document.createElement('img');
        let outdated;

        let deck = JSON.parse(localStorage.getItem(localStorage.key(i)));

        if(!prohibitedTitles.includes(localStorage.key(i)) && (deck.subject === sort || sort === undefined) && (localStorage.key(i).toLowerCase().includes(title) || title === undefined)) {

            if (deck.version !== currentVersion) {
                outdated = document.createElement('div');
                outdated.classList.add('outdated-div');
                outdated.innerHTML = "OUTDATED DECK";
            }

            header.innerHTML = localStorage.key(i)
            subject.src = "./icons/subjects/" + deck.subject + ".svg";
            para.innerHTML = deck.desc;

            try{deck.image = JSON.parse(deck.image)}
            catch{console.log("Error: Please report to developers through discord if it affects your learning experience!")}

            try{imageDiv.style.background = "linear-gradient(135deg, " + colorRange[deck.image][0] + ", " + colorRange[deck.image][1] + ")";}
            catch{imageDiv.style.background = "linear-gradient(135deg, " + colorRange[0][0] + ", " + colorRange[0][1] + ")"}

            button.innerHTML = "Study Deck"
            edit.src = "icons/edit.svg";
            button.setAttribute('onclick', "openDeck(" + i + ")");
            edit.setAttribute('onclick', "editDeck(" + i + ")");
            deleteItem.src = "icons/delete.svg";
            deleteItem.setAttribute("onclick", "deleteDeck(" + i + ")")
            printItem.src = "icons/print.svg";
            printItem.setAttribute("onclick", "printDeck(" + i + ")")
            exportDeck.src = "icons/download.svg";
            exportDeck.setAttribute("onclick", "exportDeck(" + i + ")")

            subjectDiv.appendChild(subject);

            textDiv.appendChild(header);
            textDiv.appendChild(subjectDiv)
            textDiv.appendChild(para);
            textDiv.appendChild(button);

            newDiv.appendChild(imageDiv);
            if (deck.version !== currentVersion) newDiv.appendChild(outdated);
            newDiv.appendChild(textDiv);

            newDiv.appendChild(deleteItem);
            newDiv.appendChild(edit);
            newDiv.appendChild(exportDeck)
            //newDiv.appendChild(printItem);

            document.getElementById('main-container').appendChild(newDiv);
        }
    }
}

function setCreateColor(index){
    try{document.querySelectorAll('.active-create-color-div')[0].classList.remove('active-create-color-div');}
    catch{}
    document.querySelectorAll(".create-color-div")[index].classList.add('active-create-color-div')
    document.getElementById('deck-preview-color').style.background = "linear-gradient(150deg, " + colorRange[index][0] + ", " + colorRange[index][1] + ")"
    selectedCreateColor = index;
}

function addReviewBtn(text){
    let newBtn = document.createElement('button');
    newBtn.innerHTML = text;

    document.getElementById('flashcard-answers').appendChild(newBtn);
}

document.addEventListener('keydown', function(e){
    if(createModalActive){
        if(e.keyCode === 27){
            closeCreateModal();
        } else if(e.keyCode === 13){
            if(controlActive) saveChanges();
            else createNewCard(undefined, undefined);
        } else if(e.keyCode === 68 && controlActive){
            e.preventDefault();
            e.stopPropagation();
            addDefinition(activeInput);
        }
    } else if(e.keyCode === 78 && !reviewModalActive){
        createDeck();
    } else if(reviewModalActive){
        if(e.keyCode === 27) closeDeck();
        if(e.keyCode === 49 || e.keyCode === 35) checkAnswer(0);
        if(e.keyCode === 50 || e.keyCode === 40) checkAnswer(1);
        if(e.keyCode === 51 || e.keyCode === 34) checkAnswer(2);
        if(e.keyCode === 52 || e.keyCode === 37) checkAnswer(3);
        if(e.keyCode === 53 || e.keyCode === 12) checkAnswer(4);
        if(e.keyCode === 54 || e.keyCode === 39) checkAnswer(5);
        if(e.keyCode === 55 || e.keyCode === 36) checkAnswer(6);
        if(e.keyCode === 56 || e.keyCode === 38) checkAnswer(7);
        if(e.keyCode === 57 || e.keyCode === 33) checkAnswer(8);
    } else if(e.keyCode === 32 && !document.getElementById('music-player').classList.contains('hidden-music-player')) pausePlay();

    if(e.keyCode === 17) controlActive = true;

})

document.addEventListener('keyup', function(e){
    if(e.keyCode === 17){
        controlActive = false;
    }
})

window.onload = function(){
    let mainTheme = localStorage.getItem('theme-index');
    let notifStorage = localStorage.getItem('notifications-storage');
    let userLevel = localStorage.getItem('level-index');
    let userImages = localStorage.getItem('image-indexes')
    let favoriteMusic = localStorage.getItem('favorite-music')

    try{
        mainTheme = JSON.parse(mainTheme)
    } catch {
        mainTheme = [0, true, 4]
    }

    try { notifStorage = JSON.parse(notifStorage)}
    catch {notifStorage = new Notifications()}

    try { userLevel = parseInt(userLevel)}
    catch {userLevel = 0}

    try {favoriteMusic = JSON.parse(favoriteMusic)}
    catch {favoriteMusic = []}

    if(!userImages){userImages = []}

    if(notifStorage == null) notifStorage = new Notifications()
    if(!userLevel) userLevel = 1;

    if(mainTheme !== null){
        if(mainTheme[1] === true){
            document.getElementById('dark-mode-input').checked = true;
        }
    } else mainTheme = [0, true, 4];

    if(favoriteMusic === null){
        favoriteMusic = [];
    }

    localStorage.setItem('theme-index', JSON.stringify(mainTheme));
    localStorage.setItem('notifications-storage', JSON.stringify(notifStorage))
    localStorage.setItem('level-index', userLevel.toString());
    localStorage.setItem('favorite-music', JSON.stringify(favoriteMusic));

    setupThemes();
    setTheme(mainTheme[0], mainTheme[2]);
    setupNotifications()
    setupLevel();
}

function printDeck(index){
    let targetDeck = localStorage.getItem(localStorage.key(index));
    let doc = new jsPDF();

    targetDeck = JSON.parse(targetDeck);

    doc.setFont('Merriweather', "normal" , 900)
    doc.setFontSize(100);
    doc.text(doc.splitTextToSize(localStorage.key(index).toUpperCase(), 200), 10, 150);
    doc.setFont('Helvetica', "normal", 500);
    doc.setFontSize(20);
    doc.text(doc.splitTextToSize(targetDeck.desc, 200), 10, 175)
    doc.addPage();

    for(let i = 0; i < targetDeck.cards.length; i++){
        doc.text("RAtio L BOZO", 10, 25*i);
    }

    doc.save(localStorage.key(index) + '.pdf');
}

function setupThemes(){
    const list = document.getElementById('themes-list');
    for(let i = 0; i < colorRange.length; i++){
        let newDiv = document.createElement('div')
        let createDiv = document.createElement('div');
        let createImg = document.createElement('img')

        newDiv.style.background = "linear-gradient(150deg, " + colorRange[i][0] + ", " + colorRange[i][1] + ")"
        createDiv.style.background = "linear-gradient(150deg, " + colorRange[i][0] + ", " + colorRange[i][1] + ")"
        newDiv.setAttribute('onclick', "setTheme(" + i + ", " + currentBackground + ")");
        createDiv.setAttribute('onclick', "setCreateColor(" + i + ")")
        createDiv.classList.add('create-color-div');
        createImg.src = "./icons/correct.svg"

        list.appendChild(newDiv);
        createDiv.appendChild(createImg);
        document.getElementById('create-deck-img').appendChild(createDiv);
    }
}

function getDataUrl(img) {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Set width and height
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw the image
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
}

checkSort(true);
console.log("Thank you for choosing %cElephant%c... also why are you looking in the console??", "color:#405DE6")
