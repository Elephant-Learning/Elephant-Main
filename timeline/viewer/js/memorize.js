let memorizeCards;
let memorizeIndexNum;
let memorizeCorrectIndex;
let startAmount, memorizeTimerFunc;

function resetTimer(){
    memorizeTimer = 0;
    clearInterval(memorizeTimerFunc);
    memorizeTimerFunc = setInterval(function(){
        memorizeTimer++;
        let minutes = (Math.floor(memorizeTimer / 60)).toString();
        let seconds = (memorizeTimer % 60).toString();

        if(minutes.length === 1) minutes = "0" + minutes;
        if(seconds.length === 1) seconds = "0" + seconds;
        document.getElementById("time-spent").innerHTML = `${minutes}:${seconds}`;
    } ,1000);
}

function initializeMemorize(timeline){
    removeAllChildNodes(document.getElementById("memorize-flashcard"));

    memorizeCards = [];

    console.log(timeline);

    for(let i = 0; i < timeline.events.length; i++){
        let eventsRandomGen = [];

        for(let j = 0; j < timeline.events.length; j++){
            eventsRandomGen.push(timeline.events[j]);
        }

        let question1 = [`When did the event "${timeline.events[i].name}" happen?`, [timeline.events[i].startDate]];
        eventsRandomGen.splice(i, 1);

        for(let j = 0; j < 3; j++){
            let randomNum = Math.floor(Math.random() * eventsRandomGen.length);
            question1[1].push(eventsRandomGen[randomNum].startDate);
            eventsRandomGen.splice(randomNum, 1);
        }

        eventsRandomGen = [];

        for(let j = 0; j < timeline.events.length; j++){
            eventsRandomGen.push(timeline.events[j]);
        }

        let description = timeline.events[i].description;

        description = description.replaceAll(timeline.events[i].name,'_______');

        let question2 = [`The description "${description}" most directly represents which event?`, [timeline.events[i].name]];
        eventsRandomGen.splice(i, 1);

        for(let j = 0; j < 3; j++){
            let randomNum = Math.floor(Math.random() * eventsRandomGen.length);
            question2[1].push(eventsRandomGen[randomNum].name);
            eventsRandomGen.splice(randomNum, 1);
        }

        memorizeCards.push(question1);
        memorizeCards.push(question2);
    }

    startAmount = memorizeCards.length;

    setupMemorizeSidebar();
    createMemorizeOption();
    resetTimer();
}

function setupMemorizeSidebar(){
    document.getElementById("desktop-memorize-panel-questions-left").innerHTML = memorizeCards.length;

    document.getElementById("desktop-memorize-panel-questions-left-progress").style.background = `linear-gradient(135deg, var(--primary-accent) 0%, var(--primary-accent-gradient) ${100 * (startAmount - memorizeCards.length) / startAmount}%, var(--bg-color-1) ${100 * (startAmount - memorizeCards.length) / startAmount}%, var(--bg-color-1) 100%)`
}

function checkAnswer(boxIndex){
    if(boxIndex === memorizeCorrectIndex){
        memorizeCards.splice(memorizeIndexNum, 1);

        if(memorizeCards.length !== 0){
            const audio2 = new Audio('../sounds/win.mp3');
            audio2.play();
        }

        setupMemorizeSidebar();

        if(memorizeCards.length !== 0) createMemorizeOption();
        else {
            clearInterval(memorizeTimerFunc);
            let randomNum = Math.floor(Math.random() * 50);

            if(randomNum === 0){
                let audio = ["complete_8bit", "complete_banjo"]

                randomNum = Math.floor(Math.random() * 2);

                setTimeout(function(){
                    const audio2 = new Audio(`../sounds/${audio[randomNum]}.mp3`);
                    audio2.play();
                }, 250)


            } else {
                setTimeout(function(){
                    const audio2 = new Audio('../sounds/complete.mp3');
                    audio2.play();
                }, 250);
            }
        }
    } else {
        const audio2 = new Audio('../sounds/lose.mp3');
        audio2.play();

        document.querySelectorAll(".memorize-box").forEach(function(elem){
            elem.style.border = "1px solid var(--primary-accent)";
        });

        document.querySelectorAll(".memorize-box")[memorizeCorrectIndex].style.border = "1px solid green";

        setTimeout(function(){
            document.querySelectorAll(".memorize-box").forEach(function(elem){
                elem.style.border = "1px solid var(--light-border-color)";
            });

            createMemorizeOption();
        }, 2500);
    }
}

function createMemorizeOption(){
    let randomNum = Math.floor(Math.random() * memorizeCards.length);

    let answers = [];

    console.log(memorizeCards[randomNum]);

    for(let i = 0; i < memorizeCards[randomNum][1].length; i++){
        answers.push(memorizeCards[randomNum][1][i]);
    }

    memorizeCorrectIndex = undefined;

    for(let i = 0; i < 4; i++){
        let randomNum2 = Math.floor(Math.random() * answers.length);

        if(randomNum2 === 0 && memorizeCorrectIndex === undefined) memorizeCorrectIndex = i;

        if(memorizeCards[randomNum][0].split(" ")[0] === "When") document.querySelectorAll(".memorize-label")[i].innerHTML = convertToText(answers[randomNum2]);
        else document.querySelectorAll(".memorize-label")[i].innerHTML = answers[randomNum2];

        answers.splice(randomNum2, 1);
    }

    memorizeIndexNum = randomNum;

    document.getElementById("memorize-flashcard").innerHTML = memorizeCards[randomNum][0];
}

window.addEventListener("keypress", function(e){
    if(activeTab === 1){
        try{
            document.querySelector(".active-box").classList.remove("active-box");
        } catch(e){}

        if(e.keyCode >= 49 && e.keyCode <= 52){
            document.querySelectorAll(".memorize-box")[e.keyCode - 49].classList.add("active-box");
        }
    }
});

window.addEventListener("keyup", function(e){
    try{
        document.querySelector(".active-box").classList.remove("active-box");
    } catch(e){}

    if(e.keyCode >= 49 && e.keyCode <= 52){
        checkAnswer(e.keyCode - 49);
    }
});