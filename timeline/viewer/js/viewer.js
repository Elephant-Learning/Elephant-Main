const slider = document.querySelector("#slider-viewport");
const innerSlider = document.querySelector("#slider-inner");

slider.addEventListener("mousedown", function(e){
    pressed = true;
    startX = e.offsetX - innerSlider.offsetLeft;
    slider.style.cursor = "grabbing";
});

slider.addEventListener("mouseenter", function(){
    slider.style.cursor = "grab";
});

slider.addEventListener("mouseup", function(){
    slider.style.cursor = "grab";
});

slider.addEventListener("mousemove", function(e){
    if(!pressed) return;

    e.preventDefault();

    x = e.offsetX;

    innerSlider.style.left = `${x - startX}px`

    checkBoundary();
});

function checkBoundary(){
    let outer = slider.getBoundingClientRect();
    let inner = innerSlider.getBoundingClientRect();

    //console.log(inner.width);

    if(parseInt(innerSlider.style.left) > 0){
        innerSlider.style.left = "0px";
    } else if(inner.right < outer.right){
        innerSlider.style.left = `-${inner.width - outer.width}px`
    }

    console.log(100 * Math.abs(parseInt(innerSlider.style.left) / (inner.width - outer.width)))
    document.getElementById("slider-progress").style.background = `linear-gradient(135deg, var(--primary-accent) 0%, var(--primary-accent-gradient) ${100 * Math.abs(parseInt(innerSlider.style.left) / (inner.width - outer.width))}%, var(--bg-color-1) ${100 * Math.abs(parseInt(innerSlider.style.left) / (inner.width - outer.width))}%, var(--bg-color-1) 100%)`;
}

function getShortestTimeBetweenEvents(viewerEvents) {
    let shortestTime = Infinity;
  
    for (let i = 0; i < viewerEvents.length - 1; i++) {
        const startDateA = new Date(viewerEvents[i].startDate);
        const startDateB = new Date(viewerEvents[i + 1].startDate);
        const timeBetween = Math.abs(startDateB - startDateA) / (1000 * 60 * 60 * 24);

        if (timeBetween < shortestTime) {
        shortestTime = timeBetween;
        }
    }
  
    return shortestTime;
}

function trimFirstWord(text, amount) {
    var wordArray = text.split(" ");
    wordArray[0] = wordArray[0].substring(0, amount);
    wordArray = wordArray.join(" ");
    return wordArray;
}

function getDaysBetweenEvents(eventA, eventB) {
    const startDateA = new Date(eventA.startDate);
    const startDateB = new Date(eventB.startDate);
    const timeBetween = Math.abs(startDateB - startDateA);
    return Math.ceil(timeBetween / (1000 * 60 * 60 * 24));
}

function createViewerText(text){
    let newText = document.createElement("p");
    newText.innerHTML = text;

    document.getElementById("slider-inner").appendChild(newText);
}

function createViewerPipe(width, shortestDays){
    let newPipe = document.createElement("div");

    console.log(shortestDays);

    if(width > 512) {
        let fastForward = document.createElement("div");
        fastForward.innerHTML = `Fast Forward ${Math.floor((width) / 256 * shortestDays)} Days`;

        newPipe.append(fastForward);
        width = 512;
    }

    newPipe.classList.add("viewer-pipe");
    newPipe.style.width = `calc(var(--size) * ${width}px)`;

    document.getElementById("slider-inner").appendChild(newPipe);
}

function createViewerEvent(event){
    let newEvent = document.createElement("div");
    let newEventHeaderDiv = document.createElement("div");
    let newEventDateDiv = document.createElement("div");

    let newEventImage = document.createElement("img");
    let newEventHeader = document.createElement("h1");
    let newEventPara = document.createElement("p");
    let newEventDate = document.createElement("p");

    newEventHeader.innerHTML = event.name;
    newEventPara.innerHTML = event.description;
    newEventDate.innerHTML = trimFirstWord(convertToText(event.startDate), 3);
    newEventImage.src = event.image;

    if(event.image) newEventHeaderDiv.appendChild(newEventImage);

    newEventHeaderDiv.append(newEventHeader, newEventPara);
    newEventDateDiv.appendChild(newEventDate);

    newEvent.append(newEventHeaderDiv, newEventDateDiv);
    newEvent.classList.add("viewer-event");
    document.getElementById("slider-inner").appendChild(newEvent);
}

function initializeViewer(timeline){
    removeAllChildNodes(document.getElementById("slider-inner"));

    const viewerEvents = [];

    for(let i = 0; i < timeline.events.length; i++){
        viewerEvents.push(timeline.events[i]);
    }

    viewerEvents.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA - dateB;
    });

    const shortestTime = getShortestTimeBetweenEvents(viewerEvents);

    createViewerText(viewerEvents[0].startDate.split("-")[0])
    createViewerPipe(getDaysBetweenEvents({
        startDate: `${viewerEvents[0].startDate.split("-")[0]}-01-01`
    }, viewerEvents[0]) * 256 / shortestTime - 256, shortestTime);

    for(let i = 0; i < viewerEvents.length - 1; i++){
        createViewerEvent(viewerEvents[i]);
        createViewerPipe(getDaysBetweenEvents(viewerEvents[i + 1], viewerEvents[i]) * 256 / shortestTime - 256, shortestTime);
    }

    createViewerEvent(viewerEvents[viewerEvents.length - 1]);
    createViewerPipe(getDaysBetweenEvents(viewerEvents[viewerEvents.length - 1], {
        startDate: `${viewerEvents[viewerEvents.length - 1].startDate.split("-")[0]}-12-31`
    }) * 256 / shortestTime - 256, shortestTime);
    createViewerText(viewerEvents[viewerEvents.length - 1].startDate.split("-")[0])
}