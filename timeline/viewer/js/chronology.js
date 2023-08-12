const boxes = document.querySelectorAll(".chronology-box");
const BreakException = {};

let organizedEvents = [];
let pressed = false;
let startX, startY, target, targetContainer;

function min(a, b) {
    if (a < b) {
        return a;
    } else {
        return b;
    }
}

function createChronology(t){
    const events = [];

    removeAllChildNodes(document.getElementById("chronology-event-container"));
    organizedEvents = [];
    target = undefined;
    targetContainer = undefined;

    boxes.forEach(function(elem){
        removeAllChildNodes(elem);
    })

    for(let i = 0; i < t.events.length; i++) events.push(t.events[i]);

    for(let i = 0; i < 4; i++){
        const randomNum = Math.floor(Math.random() * events.length);

        let newDiv = document.createElement("div");
        newDiv.innerHTML = events[randomNum].name;

        newDiv.classList.add("chronology-node");
        newDiv.style.left = `calc(var(--size) * ${Math.floor(Math.random() * (document.getElementById("chronology-event-container").clientWidth - 242))}px)`
        newDiv.style.top = `calc(var(--size) * ${Math.floor(Math.random() * (document.getElementById("chronology-event-container").clientHeight - 64))}px)`

        document.getElementById("chronology-event-container").appendChild(newDiv);

        const indexToInsert = organizedEvents.findIndex(event => event.startDate > events[randomNum].startDate);

        if (indexToInsert === -1) {
            organizedEvents.push(events[randomNum]);
        } else {
            organizedEvents.splice(indexToInsert, 0, events[randomNum]);
        }

        events.splice(randomNum, 1);
    }

    syncNodes();
}

function syncNodes(){
    document.querySelectorAll(".chronology-node").forEach(function(elem){
        elem.addEventListener("mousedown", function(e){
            pressed = true;
            target = elem;
            startX = e.x - elem.offsetLeft;
            startY = e.y - elem.offsetTop;

            elem.style.cursor = "grabbing";
        });

        elem.addEventListener("mouseenter", function(){
            elem.style.cursor = "grab";
        });

        elem.addEventListener("mouseup", function(){
            elem.style.cursor = "grab";
        });
    });
}

window.addEventListener("mousemove", function(e){
    if(!pressed) return;

    if(activeTab === 2){
        target.style.left = `${e.x - startX}px`;
        target.style.top = `${e.y - startY}px`;

        try{
            boxes.forEach(function(elem){
                if(elem.offsetLeft + 256 < e.x && elem.offsetLeft + elem.clientWidth + 256 > e.x && elem.offsetTop + 96 < e.y && elem.offsetTop + elem.clientHeight + 96 > e.y){
                    elem.style.border = "1px solid var(--primary-accent)";
                    targetContainer = elem;
                    throw BreakException;
                } else {
                    elem.style.border = "1px dashed var(--dark-border-color)";
                    targetContainer = undefined;
                }
            })
        } catch(e){
            if (e !== BreakException) throw e;
        }
    }
});

window.addEventListener("mouseup", function(){
    pressed = false;

    if(targetContainer && activeTab === 2){
        if(targetContainer.children.length !== 0){
            target.style.left = `${startX + target.offsetLeft}px`;
            target.style.top = `${startY + target.offsetTop}px`;

            console.log("Tough Luck")

            return;
        }

        let newDiv = document.createElement("div");
        newDiv.innerHTML = target.innerHTML;

        const audio = new Audio('../../login/sounds/click.mp3');
        audio.play();

        targetContainer.appendChild(newDiv);
        target.remove();

        targetContainer.style.border = "1px dashed var(--dark-border-color)";
        target = undefined;
        targetContainer = undefined;

        let completed = true;
        const correct = [];

        try{
            for(let i = 0; i < boxes.length; i++){
                if(boxes[i].children.length === 0) completed = false;

                if(boxes[i].children[0].innerHTML === organizedEvents[i].name) correct.push(true);
                else correct.push(false);
            }
        } catch(e){completed = false;}

        if(completed){
            let allCorrect = true;

            for(let i = 0; i < correct.length; i++){
                if(!correct[i]) allCorrect = false;
            }

            if(allCorrect){
                const audio2 = new Audio('../sounds/win.mp3');
                audio2.play();

                createChronology(TIMELINE);
            } else {
                const audio2 = new Audio('../sounds/lose.mp3');
                audio2.play();

                for(let i = 0; i < correct.length; i++){
                    let img = document.createElement("img");

                    if(correct[i]){
                        img.src = "../../flip/viewer/icons/correct.png";
                    } else {
                        img.src = "../../flip/viewer/icons/wrong.png";
                    }

                    boxes[i].appendChild(img);
                }

                setTimeout(function(){
                    boxes.forEach(function(elem){
                        removeAllChildNodes(elem);
                    });

                    const events = [];

                    for(let i = 0; i < organizedEvents.length; i++) events.push(organizedEvents[i]);

                    for(let i = 0; i < 4; i++){
                        const randomNum = Math.floor(Math.random() * events.length);

                        let newDiv = document.createElement("div");
                        newDiv.innerHTML = events[randomNum].name;

                        newDiv.classList.add("chronology-node");
                        newDiv.style.left = `calc(var(--size) * ${Math.floor(Math.random() * (document.getElementById("chronology-event-container").clientWidth - 242))}px)`
                        newDiv.style.top = `calc(var(--size) * ${Math.floor(Math.random() * (document.getElementById("chronology-event-container").clientHeight - 64))}px)`

                        document.getElementById("chronology-event-container").appendChild(newDiv);

                        events.splice(randomNum, 1);
                    }

                    syncNodes();
                }, 1500);
            }
        }
    }
})