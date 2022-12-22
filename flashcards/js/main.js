function setupMusic(){
    removeAllChildNodes(document.getElementById('track'));

    for(let i = 0; i < 18; i++){
        let newDiv = document.createElement('div');
        newDiv.style.height = "calc(var(--size) * " + Math.floor(Math.random() * 20 + 4) + "px)";
        newDiv.classList.add('track-item');

        newDiv.addEventListener('click', function(e){
            this.classList.add('passed-track-item');
        })

        document.getElementById('track').appendChild(newDiv);
    }
}

//setupMusic()

function toggleTheme(themeIndex){
    let root = document.querySelector(":root");

    if(themeIndex === 1){
        /*root.style.setProperty('--text-color', 'white');
        root.style.setProperty("--bg-color-1", "#25282d");
        root.style.setProperty("--bg-color-2", "#1a1b1e")
        root.style.setProperty("--light-border-color", "#2e3138");
        root.style.setProperty("--dark-border-color", "#1a1b1e");
        root.style.setProperty("--dark-gray", "#101213");
        root.style.setProperty("--light-gray", "#16171a");
        root.style.setProperty("--hover-dark", "#16171a");
        root.style.setProperty("--hover-light", "#171717");
        root.style.setProperty("--image-invert", "0.75");
        root.style.setProperty("--light-accent", "#383a42");
        root.style.setProperty("--primary-accent", "#e32b78");
        root.style.setProperty("--primary-accent-gradient", "#b11074");
        root.style.setProperty("--secondary-accent", "#0d87c5");
        root.style.setProperty("--secondary-accent-gradient", "#27b4b9");
        root.style.setProperty("--tertiary-accent", "#db7735");
        root.style.setProperty("--tertiary-accent-gradient", "#d47d39");*/

        root.style.setProperty('--text-color', 'white');
        root.style.setProperty("--bg-color-1", "#161b22");
        root.style.setProperty("--bg-color-2", "#0d1117")
        root.style.setProperty("--light-border-color", "#21262d");
        root.style.setProperty("--dark-border-color", "#21262d");
        root.style.setProperty("--dark-gray", "black");
        root.style.setProperty("--light-gray", "#010409");
        root.style.setProperty("--hover-dark", "#16171a");
        root.style.setProperty("--hover-light", "#171717");
        root.style.setProperty("--image-invert", "0.75");
        root.style.setProperty("--light-accent", "#30363d");
        root.style.setProperty("--primary-accent", "#e32b78");
        root.style.setProperty("--primary-accent-gradient", "#b11074");
        root.style.setProperty("--secondary-accent", "#0d87c5");
        root.style.setProperty("--secondary-accent-gradient", "#27b4b9");
        root.style.setProperty("--tertiary-accent", "#db7735");
        root.style.setProperty("--tertiary-accent-gradient", "#d47d39");
    } else if(themeIndex === 0){
        root.style.setProperty('--text-color', 'black');
        root.style.setProperty("--bg-color-1", "#ffffff");
        root.style.setProperty("--bg-color-2", "#f6f7fb")
        root.style.setProperty("--light-border-color", "#ebebeb");
        root.style.setProperty("--dark-border-color", "#21262d");
        root.style.setProperty("--dark-gray", "black");
        root.style.setProperty("--light-gray", "#010409");
        root.style.setProperty("--hover-dark", "#16171a");
        root.style.setProperty("--hover-light", "#171717");
        root.style.setProperty("--image-invert", "0");
        root.style.setProperty("--light-accent", "#ffedf6");
        root.style.setProperty("--primary-accent", "#fe599d");
        root.style.setProperty("--primary-accent-gradient", "#f30096");
        root.style.setProperty("--secondary-accent", "#00a8ff");
        root.style.setProperty("--secondary-accent-gradient", "#31d6dc");
        root.style.setProperty("--tertiary-accent", "#f8680a");
        root.style.setProperty("--tertiary-accent-gradient", "#fa8d37");
    } else if(themeIndex === 2){
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) toggleTheme(1);
        else toggleTheme(0)
    }

    document.querySelectorAll('.profile-theme-check-img').forEach(function(element){
        element.classList.add('inactive-modal');
    })

    document.querySelectorAll('.profile-theme-check-img')[themeIndex].classList.remove('inactive-modal');

    let preferences = JSON.parse(localStorage.getItem('preferences'));
    preferences[0] = themeIndex;
    localStorage.setItem('preferences', JSON.stringify(preferences));
}

function toTitleCase(str) {
    return str.toLowerCase().split(/[- .]+/).map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

function toggleSizeSetting(value){
    const sizes = [0.75, 1, 1.25, 1.5];
    let preferences = JSON.parse(localStorage.getItem('preferences'));

    document.querySelector(':root').style.setProperty('--size', sizes[value].toString());

    document.querySelectorAll('.profile-zoom-check-img').forEach(function(element){
        element.classList.add('inactive-modal');
    })

    document.querySelectorAll('.profile-zoom-check-img')[value].classList.remove('inactive-modal');

    preferences[1] = value;
    localStorage.setItem('preferences', JSON.stringify(preferences));
}

function dateToObject(DATE){
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    let endingDate = "th";
    let endingTime = "AM"

    if(DATE.getHours() > 11) {
        endingTime = "PM";
        if(DATE.getHours() > 12) DATE.setHours(DATE.getHours() - 12);
    }
    if(DATE.getHours() === 0) DATE.setHours(12);

    let refactoredMinutes;

    if(DATE.getMinutes().toString().length === 1) refactoredMinutes = "0" + DATE.getMinutes().toString();
    else refactoredMinutes = DATE.getMinutes().toString();

    if(DATE.getDate() > 20 || DATE.getDate < 4){
        if(DATE.getDate() & 10 === 1) endingDate = "st";
        if(DATE.getDate() & 10 === 2) endingDate = "nd";
        if(DATE.getDate() & 10 === 3) endingDate = "rd";
    }

    return {
        month: months[DATE.getMonth()],
        date: DATE.getDate(),
        dateEnding: endingDate,
        year: DATE.getFullYear(),
        hour: DATE.getHours(),
        minutes: refactoredMinutes,
        timeEnding: endingTime
    }
}


async function friendUser(friending, friendId, notificationId){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    if(friending){
        const friendingResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/friends/add', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT, DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                userId: savedUserId,
                friendId: friendId
            }),
            mode: 'cors'
        })

        const friendingContext = await friendingResponse.json();
        console.log(friendingContext);
    }

    const notificationDeletionResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/notifications/delete?id=' + notificationId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    const notificationDeletionContext = await notificationDeletionResponse.json();
    console.log(notificationDeletionContext);

    const userResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/login/user?id=' + savedUserId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    const userContext = await userResponse.json()

    await notificationsManager(userContext.context.user);
}

async function toggleFriendingModal(send){
    if(document.getElementById('desktop-friending-modal').classList.contains('inactive-modal')){
        document.getElementById('friending-input').value = "";
        document.getElementById('desktop-friending-modal').classList.remove('inactive-modal')
    } else {
        if(send){
            const response = await fetch('https://elephantsuite-rearend.herokuapp.com/login/userByEmail?email=' + document.getElementById('friending-input').value, {
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
            console.log(context);

            if(context.status === "SUCCESS"){
                const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
                const userResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/login/user?id=' + savedUserId, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    mode: 'cors'
                })

                const userContext = await userResponse.json();

                const notificationResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/notifications/sendFriendRequest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({
                        type: "FRIEND_REQUEST",
                        message: userContext.context.user.firstName + " " + userContext.context.user.lastName + " sent you a friend request!",
                        senderId: userContext.context.user.id,
                        recipientId: context.context.user.id
                    }),
                    mode: 'cors'
                })

                const notificationContext = await notificationResponse.json();
                console.log(notificationContext);
            }
        } document.getElementById('desktop-friending-modal').classList.add('inactive-modal');
    }
}

function removeAllChildNodes(parent) {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

async function refreshNotifications(){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
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
    await notificationsManager(context.context.user);

    let activeNotificationsTab = 0;
    let notificationsTabIncrement = 0;

    document.querySelectorAll('.desktop-notifications-tab').forEach(function(element){
        console.log(element.classList, notificationsTabIncrement);
        if(element.classList.contains('active-notifications-tab')) {
            activeNotificationsTab = notificationsTabIncrement;
        }
        notificationsTabIncrement++;
    });

    console.log(activeNotificationsTab);
    toggleNotificationTab(activeNotificationsTab);
}

async function notificationsManager(user){

    document.querySelectorAll('.desktop-notifications-list').forEach(function(element){
        removeAllChildNodes(element);
    })

    document.querySelectorAll('.desktop-notifications-tab-number').forEach(function(element){
        element.innerHTML = "0";
    })

    try{
        document.getElementById("desktop-notification-icon").remove();
    } catch{

    }

    for(let i = 0; i < user.notifications.length; i++){
        if(user.notifications[i].type === "FRIEND_REQUEST"){
            try{
                const response = await fetch('https://elephantsuite-rearend.herokuapp.com/login/user?id=' + user.notifications[i].senderId, {
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

                createNotification("friend", {
                    name: context.context.user.firstName + " " + context.context.user.lastName,
                    pfpId: context.context.user.pfpId,
                    senderId: user.notifications[i].senderId,
                    time: user.notifications[i].time,
                    notificationId: user.notifications[i].id
                })
            } catch(e){

            }
        } else if(user.notifications[i].type === "SHARED_DECK"){
            try{
                const responseCreator = await fetch('https://elephantsuite-rearend.herokuapp.com/login/user?id=' + user.notifications[i].senderId, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    mode: 'cors'
                })

                const contextCreator = await responseCreator.json();

                const responseDeck = await fetch('https://elephantsuite-rearend.herokuapp.com/deck/get?id=' + user.notifications[i].deckId, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    mode: 'cors'
                })

                const contextDeck = await responseDeck.json();

                createNotification("deckShared", {
                    sender: contextCreator.context.user.firstName + " " + contextCreator.context.user.lastName,
                    deckName: contextDeck.context.deck.name,
                    deckId: user.notifications[i].deckId,
                    time: user.notifications[i].time,
                    pfpId: contextCreator.context.user.pfpId,
                    notificationId: user.notifications[i].id
                })
            } catch(e){}
        }
    }

    if(user.notifications.length > 0){
        let newDiv = document.createElement('div');
        newDiv.id = "desktop-notification-icon"
        document.getElementById('desktop-navbar-notifications-container').appendChild(newDiv);
    }
}

function timeToText(date){
    let month = ["January","February","March","April","May","June","July", "August","September","October","November","December"];
    let AMPM = "A.M.";
    let dateHours = date.getHours();
    let dateMinutes = date.getMinutes();
    let dateDay = date.getDate();

    if(dateHours === 0) dateHours += 12;
    else if(dateHours >= 12){
        AMPM = "P.M."
        if(dateHours > 12){
            dateHours -= 12;
        }
    }

    if(dateMinutes < 10){
        dateMinutes = "0" + dateMinutes;
    } if(dateDay < 10){
        dateDay = "0" + dateDay;
    }

    return month[date.getMonth()] + " " + dateDay + ", " + date.getFullYear() + " at " + dateHours + ":" + dateMinutes + " " + AMPM;
}

function computeTime(time){
    let splitTime = time.split('-');
    let timing = splitTime[2].split(':');
    let originalDate = new Date(Date.UTC(splitTime[0], splitTime[1] - 1, timing[0].substring(0, 2), timing[0].slice(-2), timing[1]));

    return timeToText(originalDate);
}

async function addDeckShared(deckID, adding, notificationId){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    if(adding){
        const response = await fetch('https://elephantsuite-rearend.herokuapp.com/deck/shareDeck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                deckId: deckID,
                sharedUserId: savedUserId
            }),
            mode: 'cors'
        })

        const context = await response.json();
        console.log(context);
    }

    const notificationDeletionResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/notifications/delete?id=' + notificationId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    const notificationDeletionContext = await notificationDeletionResponse.json();
    console.log(notificationDeletionContext);

    if(adding){
        location.href = "../viewer/?deck=" + deckID;
    } else {
        const userResponse = await fetch('https://elephantsuite-rearend.herokuapp.com/login/user?id=' + savedUserId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            mode: 'cors'
        })

        const userContext = await userResponse.json()

        notificationsManager(userContext.context.user);
    }
}

function createNotification(TYPE, DATA){
    let newDiv = document.createElement('div');
    let unreadDiv = document.createElement('div');
    let avatarDiv = document.createElement('div');
    let avatar = document.createElement('img');
    let textDiv = document.createElement('div');
    let timeDiv = document.createElement('p');
    let optionsDiv = document.createElement('div');

    let parentDiv;

    avatar.src = "../../icons/avatars/" + DATA.pfpId + ".png";
    avatarDiv.appendChild(avatar);

    timeDiv.innerHTML = computeTime(DATA.time);

    if(TYPE === "friend"){
        let header = document.createElement('h1');
        let span1 = document.createElement('span');
        let btn1 = document.createElement('button');
        let btn2 = document.createElement('button');

        span1.classList.add('bolded');
        span1.innerHTML = DATA.name;

        header.append(span1, document.createTextNode(" would like to be your friend."));

        btn1.innerHTML = "Accept";
        btn2.innerHTML = "Decline";
        btn1.classList.add('desktop-notification-btn-1');
        btn2.classList.add('desktop-notification-btn-2');
        btn1.setAttribute("onclick", "friendUser(true, " + DATA.senderId + ", " + DATA.notificationId + ")")
        btn2.setAttribute("onclick", "friendUser(false, undefined, " + DATA.notificationId + ")")

        optionsDiv.append(btn1, btn2);
        optionsDiv.classList.add('desktop-notification-options');

        textDiv.append(header, timeDiv, optionsDiv);

        parentDiv = document.querySelectorAll('.desktop-notifications-list')[1];

        document.querySelectorAll('.desktop-notifications-tab-number')[1].innerHTML = (parseInt(document.querySelectorAll('.desktop-notifications-tab-number')[1].textContent) + 1).toString();

    } else if(TYPE === "deckShared"){
        let header = document.createElement('h1');
        let span1 = document.createElement('span');
        let span2 = document.createElement('span');
        let btn1 = document.createElement('button');
        let btn2 = document.createElement('button');

        span1.classList.add('bolded')
        span2.classList.add('bolded')
        span1.innerHTML = DATA.sender;
        span2.innerHTML = DATA.deckName;

        header.append(span1, document.createTextNode(" wants to share "), span2, document.createTextNode(" with you."));

        btn1.innerHTML = "Accept";
        btn2.innerHTML = "Decline";
        btn1.classList.add('desktop-notification-btn-1');
        btn2.classList.add('desktop-notification-btn-2');
        btn1.setAttribute("onclick", "addDeckShared(" + DATA.deckId + ", true, " + DATA.notificationId + ")")
        btn2.setAttribute("onclick", "addDeckShared(" + DATA.deckId + ", false, " + DATA.notificationId + ")")

        optionsDiv.append(btn1, btn2);
        optionsDiv.classList.add('desktop-notification-options');

        textDiv.append(header, timeDiv, optionsDiv);

        parentDiv = document.querySelectorAll('.desktop-notifications-list')[0];

        document.querySelectorAll('.desktop-notifications-tab-number')[0].innerHTML = (parseInt(document.querySelectorAll('.desktop-notifications-tab-number')[0].textContent) + 1).toString();
    } else if(TYPE === "deckFavorited"){
        let header = document.createElement('h1');
        let span1 = document.createElement('span');
        let span2 = document.createElement('span');

        span1.classList.add('bolded')
        span2.classList.add('bolded')
        span1.innerHTML = DATA.sender;
        span2.innerHTML = DATA.deckName;

        header.append(span1, document.createTextNode(" favorited your deck, "), span2, document.createTextNode("."));

        textDiv.append(header, timeDiv);

        parentDiv = document.querySelectorAll('.desktop-notifications-list')[0];

        document.querySelectorAll('.desktop-notifications-tab-number')[0].innerHTML = (parseInt(document.querySelectorAll('.desktop-notifications-tab-number')[0].textContent) + 1).toString();
    }

    newDiv.append(unreadDiv, avatarDiv, textDiv);
    newDiv.classList.add('desktop-notification')

    parentDiv.appendChild(newDiv);
}

function toggleNotificationsModal(){
    if(document.getElementById('desktop-notifications-modal').classList.contains('inactive-modal')){
        document.getElementById('desktop-notifications-modal').classList.remove('inactive-modal');
    } else {
        document.getElementById('desktop-notifications-modal').classList.add('inactive-modal')
    }
}

function toggleNotificationTab(index){
    document.querySelector(".active-notifications-tab").classList.remove('active-notifications-tab');
    document.querySelectorAll('.desktop-notifications-tab')[index].classList.add('active-notifications-tab');

    document.querySelector('.active-notifications-list').classList.remove('active-notifications-list');

    if(document.querySelectorAll('.desktop-notifications-list')[index].hasChildNodes()){
        document.querySelectorAll('.desktop-notifications-list')[index].classList.add('active-notifications-list');
    } else {
        document.getElementById('no-notifications').classList.add('active-notifications-list');
    }
}

function mainInitialize(){
    let preferences = localStorage.getItem('preferences');

    if(!preferences) {
        localStorage.setItem('preferences', JSON.stringify([2, 1, 0]));
        preferences = localStorage.getItem('preferences');
    }

    preferences = JSON.parse(preferences);

    if(!(preferences[0] < 3)) {
        preferences = [2, preferences[1], preferences[2]];
    }

    if(!(preferences[1] < 4)) {
        preferences = [preferences[0], 1, preferences[2]];
    }

    if(!(preferences[2] < 2)){
        preferences = [preferences[0], preferences[1], 0];
    }

    toggleTheme(preferences[0]);
    toggleSizeSetting(preferences[1]);

    //initializeMusic();

    localStorage.setItem('preferences', JSON.stringify(preferences));
}

mainInitialize()