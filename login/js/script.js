let selectedSignUpOption;
let selectedLocation;

const UserTypes = {
    INDIVIDUAL: "INDIVIDUAL",
    STUDENT: "STUDENT",
    INSTRUCTOR: "TEACHER"
}

const User = function(){
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.countryCode = 0;
    this.type = "";

    this.updateName = function(fullname){
        fullname = fullname.split(' ');
        this.firstName = fullname[0];
        this.lastName = fullname[fullname.length - 1]
    }
}

function selectCountries(index){
    document.getElementById('desktop-location-modal').classList.add('inactive-modal');
    selectedLocation = index;
    document.querySelectorAll('.desktop-location-add')[selectedSignUpOption].innerHTML = "Currently Selected: " + COUNTRY_LIST[index];
}

function updateLocationResults(){
    let filteredCountries = []

    removeAllChildNodes(document.getElementById('desktop-location-results'))

    for(let i = 0; i < COUNTRY_LIST.length; i++){
        if(COUNTRY_LIST[i].includes(toTitleCase(document.getElementById('desktop-location-input').value))) filteredCountries.push(i)
    }

    for(let i = 0; i < filteredCountries.length; i++){
        let newDiv = document.createElement('div');
        let newImg = document.createElement('img');
        let newPara = document.createElement('p');

        newImg.src = "./icons/country.png";
        newPara.innerHTML = COUNTRY_LIST[filteredCountries[i]];

        newDiv.append(newImg, newPara);

        newDiv.addEventListener('click', function(e){
            this.remove();
            selectCountries(filteredCountries[i])
        })

        document.getElementById('desktop-location-results').appendChild(newDiv);
    }
}

function toTitleCase(str) {
    return str.toLowerCase().split(/[- .]+/).map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function toggleCountryModal(){
    if(document.getElementById('desktop-location-modal').classList.contains('inactive-modal')){
        document.getElementById('desktop-location-modal').classList.remove('inactive-modal')
        document.getElementById('desktop-location-input').value = "";
        removeAllChildNodes(document.getElementById('desktop-location-results'));
    } else {
        document.getElementById('desktop-location-modal').classList.add('inactive-modal')
    }
}

function toggleTextVisibility(index){
    if(document.querySelectorAll('.visibility-toggleable')[index].getAttribute('type') === "password"){
        document.querySelectorAll('.visibility-toggleable')[index].setAttribute('type', "text");
        document.querySelectorAll('.visibility-toggler')[index].src = "./icons/visible.png";
    } else {
        document.querySelectorAll('.visibility-toggleable')[index].setAttribute('type', "password")
        document.querySelectorAll('.visibility-toggler')[index].src = "./icons/invisible.png";
    }
    document.querySelectorAll('.visibility-toggleable')[index].focus();
}

function togglePageFlip(index){
    const colors = ["primary", "secondary", "secondary", "secondary", "secondary", "tertiary"];

    document.querySelectorAll(".desktop-tab").forEach(function(element){
        if(!element.classList.contains("inactive-tab")) element.classList.add("inactive-tab");
    })
    document.querySelectorAll(".desktop-tab")[index].classList.remove("inactive-tab");
    document.getElementById('desktop-color-container').style.background = "linear-gradient(135deg, var(--" + colors[index] + "-accent), var(--" + colors[index] + "-accent-gradient))";
}

function selectSignUpOption(index){
    const colors = ["primary", "secondary", "tertiary"];
    document.querySelectorAll('.account-option-div').forEach(function(element){
        try{element.classList.remove('non-selected-option')} catch{}
        try{element.classList.remove('selected-option')} catch{}
    })
    document.querySelectorAll('.account-option-checkbox').forEach(function(element){
        element.style.background = "var(--hover-light)";
    })

    let i = 0;
    document.querySelectorAll('.account-option-div').forEach(function(element){
        if(i === index){
            element.classList.add('selected-option');
            element.style.border = "1px solid var(--" + colors[i] + "-accent)";
            document.querySelectorAll(".account-option-checkbox")[i].style.background = "linear-gradient(135deg, var(--" + colors[i] + "-accent), var(--" + colors[i] + "-accent-gradient))";
            document.querySelectorAll(".account-option-img")[i].src = "./icons/check.png";
        } else{
            element.classList.add('non-selected-option');
            element.style.border = "1px solid var(--light-border-color)";
            document.querySelectorAll(".account-option-img")[i].src = "./icons/x.png";
        }
        i++
    })
    if(document.getElementById('sign-up-btn-1').classList.contains('inactive-button')){

        document.getElementById('sign-up-btn-1').style.background = "linear-gradient(135deg, var(--secondary-accent), var(--secondary-accent-gradient))";
        document.getElementById('sign-up-btn-1').classList.remove('inactive-button');
    }
    selectedSignUpOption = index;
}

document.getElementById('sign-up-btn-1').onclick = function(){
    if(!document.getElementById('sign-up-btn-1').classList.contains('inactive-button')){
        togglePageFlip(selectedSignUpOption + 2)
    }
}

function setCountryCode(codeIndex, inputIndex){
    document.querySelectorAll('.country-flag-code-para')[inputIndex].innerHTML = "+" + countryCodes[codeIndex][2];
    document.querySelectorAll('.country-flag-img')[inputIndex].src = "https://countryflagsapi.com/svg/" + countryCodes[codeIndex][0];
}

function initialize(){
    const colors = ["primary", "secondary", "tertiary"];
    let i = 0;
    document.querySelectorAll(".account-option-pic").forEach(function(element){
        element.style.background = "linear-gradient(135deg, var(--" + colors[i] + "-accent), var(--" + colors[i] + "-accent-gradient))";
        i++;
    });
    document.querySelectorAll(".blue-btn").forEach(function(element){
        element.style.background = "linear-gradient(135deg, var(--" + colors[1] + "-accent), var(--" + colors[1] + "-accent-gradient))";
    });
    document.querySelectorAll(".orange-btn").forEach(function(element){
        element.style.background = "linear-gradient(135deg, var(--" + colors[2] + "-accent), var(--" + colors[2] + "-accent-gradient))";
    });

    if(Math.floor(Math.random() * 5) === 1) document.getElementById('student-account-pic').src = "./icons/student_nerd.png"

    togglePageFlip(0);
}

document.getElementById('login').onclick = login;

document.getElementById('individual-sign-up').onclick = function(){
    const user = new User();

    user.updateName(document.getElementById('individual-name').value);
    user.email = document.getElementById('individual-email').value;
    user.password = document.getElementById('individual-password').value;
    user.type = UserTypes.INDIVIDUAL;
    user.countryCode = selectedLocation;

    signup(user);
}

document.getElementById('student-sign-up').onclick = function(){
    const user = new User();

    user.updateName(document.getElementById('student-name').value);
    user.email = document.getElementById('student-email').value;
    user.password = document.getElementById('student-password').value;
    user.type = UserTypes.STUDENT;
    user.countryCode = selectedLocation;

    signup(user);
}

document.getElementById('instructor-sign-up').onclick = function(){
    const user = new User();

    user.updateName(document.getElementById('instructor-name').value);
    user.email = document.getElementById('instructor-email').value;
    user.password = document.getElementById('instructor-password').value;
    user.type = UserTypes.INSTRUCTOR;
    user.countryCode = selectedLocation;

    signup(user)
}

document.querySelectorAll('button').forEach(function(element){
    element.addEventListener('click', function(e){
        let click = new Audio('./sounds/click.mp3')
        click.play();
    })
})

document.querySelectorAll('.account-option-div').forEach(function(element){
    element.addEventListener('click', function(e){
        let click = new Audio('./sounds/click.mp3')
        click.play();
    })
})

window.onload = function(){
    if(document.location.href.split("?")[1] === "signup") togglePageFlip(1);
}

async function signup(data){
    document.getElementById('desktop-loading-modal').classList.remove('inactive-modal');
    document.getElementById('desktop-alert-modal').className = "desktop-modal inactive-modal";

    console.log(data);

    const response = await fetch('https://elephant-rearend.herokuapp.com/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify(data),
        mode: 'cors'
    });

    const content = await response.json();
    console.log(content, data);

    if(content.status === "FAILURE"){
        document.getElementById('desktop-loading-modal').classList.add('inactive-modal');
        document.getElementById('desktop-alert-header').innerHTML = "Unable to Login"
        document.getElementById('desktop-alert-para').innerHTML = content.message;

        document.getElementById('desktop-alert-modal').classList.remove('inactive-modal')
        setTimeout(function(){
            document.getElementById('desktop-alert-modal').classList.add('inactive-modal')
        }, 5000)
    } else {
        const confirmResponse = await fetch('https://elephant-rearend.herokuapp.com/registration/confirm?token=' + content.context.user.token.token, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            mode: 'cors'
        });

        const confirmContent = await confirmResponse.json();
        console.log(confirmContent);

        document.getElementById('login-username').value = data.email;
        document.getElementById('login-password').value = data.password;
        login();
    }
}

document.getElementById('login').onclick = login;

async function login(){
    document.getElementById('desktop-loading-modal').classList.remove('inactive-modal');
    document.getElementById('desktop-alert-modal').className = "desktop-modal inactive-modal";

    let email = document.getElementById('login-username').value;
    let password = document.getElementById('login-password').value;

    console.log(JSON.stringify({
        "email": email,
        "password": password
    }));

    const response = await fetch('https://elephant-rearend.herokuapp.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        }),
        mode: 'cors'
    });
    const content = await response.json();
    console.log(content)

    document.getElementById('desktop-loading-modal').classList.add('inactive-modal');

    if(content.status === "FAILURE"){
        document.getElementById('desktop-alert-header').innerHTML = "Unable to Login"
        document.getElementById('desktop-alert-para').innerHTML = content.message;

        document.getElementById('desktop-alert-modal').classList.remove('inactive-modal')
        setTimeout(function(){
            document.getElementById('desktop-alert-modal').classList.add('inactive-modal')
        }, 5000)
    } else {
        localStorage.setItem('savedUserId', JSON.stringify(content.context.user.id));
        location.href = "../flashcards/dashboard";
    }
}

initialize();