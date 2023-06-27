const nodes = [];
let start;
let end;

function convertToText(date){
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    let returnString = "";

    returnString += months[parseInt(date.split("-")[1]) - 1] + " " + parseInt(date.split("-")[2]);

    if(parseInt(date.split("-")[2]) % 10 === 1){
        returnString += "st, ";
    } else if(parseInt(date.split("-")[2]) % 10 === 2){
        returnString += "nd, ";
    } else if(parseInt(date.split("-")[2]) % 10 === 3){
        returnString += "rd, ";
    } else {
        returnString += "th, ";
    }

    returnString += date.split("-")[0];

    return returnString;
}

async function saveChanges(){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/timeline/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            name:document.getElementById("timeline-name").textContent,
            description:"New Timeline",
            userId: savedUserId,
            timelineVisibility: "PRIVATE"
        }),
        mode: 'cors'
    });

    const context = await response.json();
    console.log(context);

    for(let i = 0; i < nodes.length; i++){
        if(nodes[i].type === "EVENT"){
            const response2 = await fetch('https://elephantsuite-rearend.herokuapp.com/timeline/createEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    timelineId:context.context.timeline.id,
                    name: nodes[i].name,
                    date: nodes[i].start,
                    endDate: nodes[i].end,
                    description: nodes[i].description,
                    importance:1
                }),
                mode: 'cors'
            });

            console.log({
                timelineId:context.context.timeline.id,
                name: nodes[i].name,
                date: nodes[i].start,
                endDate: nodes[i].end,
                description: nodes[i].description,
                importance:1
            })

            const context2 = response2.json();
            console.log(context2);

        } else if(nodes[i].type === "MARKER"){
            const response2 = await fetch('https://elephantsuite-rearend.herokuapp.com/timeline/createMarker', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    timelineId:context.context.timeline.id,
                    name: nodes[i].name,
                    date: nodes[i].date,
                }),
                mode: 'cors'
            });

            const context2 = response2.json();
            console.log(context2);
        }
    }
}

function leaveEditor(link){
    location.href = link;
}

function daysBetweenYears(year1, year2) {
    let days = 0;
    for (let year = year1; year <= year2; year++) {
        if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
            days += 366;
        } else {
            days += 365;
        }
    }
    return days;
}

function daysBetweenYearStartAndDate(year, date) {
    const yearStart = new Date(year, 0, 1);
    const dateObj = new Date(date);
    const timeDiff = dateObj.getTime() - yearStart.getTime();
    return timeDiff / (1000 * 3600 * 24);
}

function createTimelineEvent(params){
    /**
     * params = {
     *     name:string
     *     description:string
     *     start:double
     *     end:double
     *     type:string
     *     top:boolean
     *     id:integer
     * }
     */

    let newDiv = document.createElement("div");

    let optionsDiv = document.createElement("div");
    let editOption = document.createElement("img");
    let deleteOption = document.createElement("img");

    editOption.src = "./icons/edit.png";
    deleteOption.src = "./icons/delete.png";

    deleteOption.addEventListener("click", function(e){
        newDiv.remove();
        nodes.splice(params.id, 1);

        refreshNodes();
    })

    optionsDiv.append(editOption, deleteOption);

    let date = document.createElement("h3");
    let title = document.createElement("h1");
    let desc = document.createElement("p");

    title.innerHTML = params.name;
    desc.innerHTML = params.description;

    if(params.end === ""){
        date.innerHTML = convertToText(params.start);
    } else {
        date.innerHTML = `${convertToText(params.start)} - ${convertToText(params.end)}`;
    }

    newDiv.append(optionsDiv, date, title, desc);
    if(params.top){
        newDiv.classList.add("event-container-top");
    } else {
        newDiv.classList.add("event-container-bottom");
    }

    newDiv.style.left = `${(daysBetweenYearStartAndDate(start,params.start)/(daysBetweenYears(start,end) - 1)) * document.getElementById('desktop-main-event-containers').clientWidth - 128}px`;

    document.getElementById("desktop-main-event-containers").appendChild(newDiv);
}

function createTimelineMarker(params){
    /**
     * {
     *     name:string,
     *     date:string,
     *     id:integer
     * }
     */

    let newDiv = document.createElement("div");
    let date = document.createElement("h3")
    let title = document.createElement("h1");

    let optionsDiv = document.createElement("div");
    let editOption = document.createElement("img");
    let deleteOption = document.createElement("img");

    editOption.src = "./icons/edit.png";
    deleteOption.src = "./icons/delete.png";

    deleteOption.addEventListener("click", function(e){
        newDiv.remove();
        nodes.splice(params.id, 1);

        refreshNodes();
    })

    optionsDiv.append(editOption, deleteOption);

    date.innerHTML = convertToText(params.date);
    title.innerHTML = params.name;

    newDiv.append(optionsDiv, date, title);

    newDiv.style.left = `${(daysBetweenYearStartAndDate(start,params.date)/(daysBetweenYears(start,end) - 1)) * document.getElementById('desktop-main-event-containers').clientWidth - 101}px`;

    console.log((daysBetweenYearStartAndDate(start,params.date)/(daysBetweenYears(start,end) - 1)) * document.getElementById('desktop-main-event-containers').clientWidth);

    document.getElementById("desktop-main-marker-container").appendChild(newDiv);
}

function refreshNodes(){
    removeAllChildNodes(document.getElementById("desktop-main-event-containers"));
    removeAllChildNodes(document.getElementById("desktop-main-marker-container"));

    console.log(nodes);

    if(nodes.length === 0) return;
    let eventCount = 1;

    if(nodes[0].type === "EVENT"){
        start = parseInt(nodes[0].start.split("-")[0]);

        if(nodes[0].end === ""){
            end = parseInt(nodes[0].start.split("-")[0]);
        } else {
            end = parseInt(nodes[0].end.split("-")[0]);
        }

        nodes[0].top = true;
    } else if(nodes[0].type === "MARKER"){
        start = parseInt(nodes[0].date.split("-")[0]);
        end = parseInt(nodes[0].date.split("-")[0]);
    }

    nodes[0].id = 0;

    for(let i = 1; i < nodes.length; i++){
        if(nodes[i].type === "EVENT"){
            if(parseInt(nodes[i].start.split("-")[0]) < start){
                start = parseInt(nodes[i].start.split("-")[0])
            } if(nodes[i].end !== ""){
                if(parseInt(nodes[i].end.split("-")[0]) > end){
                    end = parseInt(nodes[i].end.split("-")[0])
                }
            } else {
                if(parseInt(nodes[i].start.split("-")[0]) > end){
                    end = parseInt(nodes[i].start.split("-")[0])
                }
            } nodes[i].top = eventCount % 2 === 0; eventCount++;
        } else if(nodes[i].type === "MARKER"){
            if(parseInt(nodes[i].date.split("-")[0]) < start) {
                start = parseInt(nodes[i].date.split("-")[0]);
            } else if(parseInt(nodes[i].date.split("-")[0]) > end){
                end = parseInt(nodes[i].date.split("-")[0]);
            }
        }

        nodes[i].id = i;
    }

    document.getElementById("start-date").innerHTML = `Jan 1st, ${start.toString()}`;
    document.getElementById("end-date").innerHTML = `Dec 31st, ${end.toString()}`;

    for(let i = 0; i < nodes.length; i++){
        if(nodes[i].type === "EVENT"){
            createTimelineEvent(nodes[i]);
        } else if(nodes[i].type === "MARKER"){
            createTimelineMarker(nodes[i]);
        }
    }
}

function createItem(){
    if(document.getElementById("new-event-window").classList.contains("inactive-modal")){
        if(document.getElementById("new-marker-window").children[3].value === "") return;

        nodes.push({
            name: document.getElementById("new-marker-window").children[1].value,
            date: document.getElementById("new-marker-window").children[3].value,
            type: "MARKER",
        })
    } else if(document.getElementById("new-marker-window").classList.contains("inactive-modal")){
        if(document.getElementById("new-event-window").children[3].value === "") return;

        nodes.push({
            name: document.getElementById("new-event-window").children[1].value,
            start: document.getElementById("new-event-window").children[3].value,
            end: document.getElementById("new-event-window").children[5].value,
            description: document.getElementById("new-event-window").children[7].value,
            type: "EVENT"
        })
    } else console.log("Something strange occurred");

    refreshNodes();
    closeCreateModal();
}

function openCreateModal(window){
    if(document.getElementById("edit-modal").classList.contains("inactive-modal")){
        document.getElementById("edit-modal").classList.remove("inactive-modal")
    }

    if(window === 0){
        if(document.getElementById("new-event-window").classList.contains("inactive-modal")) document.getElementById("new-event-window").classList.remove("inactive-modal");
        if(!document.getElementById("new-marker-window").classList.contains("inactive-modal")) document.getElementById("new-marker-window").classList.add("inactive-modal");

        document.getElementById("new-event-window").children[1].focus();
        document.getElementById("new-event-window").children[1].select();
    } else if(window === 1){
        if(document.getElementById("new-marker-window").classList.contains("inactive-modal")) document.getElementById("new-marker-window").classList.remove("inactive-modal");
        if(!document.getElementById("new-event-window").classList.contains("inactive-modal")) document.getElementById("new-event-window").classList.add("inactive-modal");

        document.getElementById("new-marker-window").children[1].focus();
        document.getElementById("new-marker-window").children[1].select();
    }
}

function closeCreateModal(){
    let eventNodes = document.getElementById("new-event-window").children;

    for(let i = 0; i < eventNodes.length; i++){
        if(eventNodes[i].nodeName === "INPUT" || eventNodes[i].nodeName === "TEXTAREA"){
            eventNodes[i].value = "";
        }
    }

    eventNodes = document.getElementById("new-marker-window").children;

    for(let i = 0; i < eventNodes.length; i++){
        if(eventNodes[i].nodeName === "INPUT" || eventNodes[i].nodeName === "TEXTAREA"){
            eventNodes[i].value = "";
        }
    }

    if(!document.getElementById("edit-modal").classList.contains("inactive-modal")){
        document.getElementById("edit-modal").classList.add("inactive-modal")
    }
}

async function initialize(user){
    if(user.status === "FAILURE" || user.error === "Bad Request") {
        location.href = "../../login"
    } else user = user.context.user;
    console.log(user);

    const emojis_refactored = ["confused", "cool", "happy", "laugh", "nerd", "neutral", "unamused", "uwu", "wink"];

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png";
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('desktop-profile-user-img').src = "../../flip/icons/emojis/" + emojis_refactored[Math.floor(Math.random() * emojis_refactored.length)] + ".png";

    refreshNodes();
}

async function locateUserInfo(){
    let savedUserId;

    try{
        savedUserId = JSON.parse(localStorage.getItem('savedUserId'))
    } catch {
        location.href = "../../login";
    }

    if(!savedUserId  && savedUserId !== 0) location.href = "../../login";

    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/login/user?id=' + savedUserId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    const context = await response.json();
    await initialize(context)
}

locateUserInfo();