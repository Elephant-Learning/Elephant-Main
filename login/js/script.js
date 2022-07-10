let selectedSignUpOption;

const UserTypes = {
    INDIVIDUAL: "INDIVIDUAL",
    STUDENT: "STUDENT",
    INSTRUCTOR: "INSTRUCTOR"
}

const User = function(){
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.type = "";
    this.profilePic = Math.floor(Math.random() * 47);

    this.updateName = function(fullname){
        fullname = fullname.split(' ');
        this.firstName = fullname[0];
        this.lastName = fullname[fullname.length - 1]
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

function login(){
    // fetch userID based on information
}

function closeModals(){
    document.querySelectorAll('.country-code-search').forEach(function(element){
        if(!element.classList.contains('inactive-modal')) element.classList.add('inactive-modal')
    })
}

function togglePageFlip(index){
    const colors = ["primary", "secondary", "secondary", "secondary", "secondary", "tertiary"];

    closeModals();

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

function countryCodeInput(index){
    let searchedList = []

    const inputValue = document.querySelectorAll('.country-code-input')[index].value;

    for(let i = 0; i < countryCodes.length; i++){

        if(countryCodes[i][1].includes(inputValue.charAt(0).toUpperCase() + inputValue.slice(1))){
            searchedList.push(countryCodes[i]);
        }
    }

    for(let i = 0; i < document.querySelectorAll('.country-code-results-img-' + (index + 1)).length; i++){
        let randomCountry = searchedList[i];

        if(i >= searchedList.length){
            document.querySelectorAll('.country-code-results-img-' + (index + 1))[i].src = "./icons/white.png";

            document.querySelectorAll('.country-code-results-p-' + (index + 1))[i].innerHTML = ""
            document.querySelectorAll('.country-code-results-p-' + (index + 1))[i].parentElement.style.cursor = "default"
        } else {
            document.querySelectorAll('.country-code-results-img-' + (index + 1))[i].src = "https://countryflagsapi.com/svg/" + randomCountry[0];

            if(!randomCountry[3]) document.querySelectorAll('.country-code-results-p-' + (index + 1))[i].innerHTML = randomCountry[1] + " (+" + randomCountry[2] + ")";
            else document.querySelectorAll('.country-code-results-p-' + (index + 1))[i].innerHTML = randomCountry[3] + " (+" + randomCountry[2] + ")";
            document.querySelectorAll('.country-code-results-p-' + (index + 1))[i].parentElement.setAttribute("onclick", "setCountryCode(" + countryCodes.indexOf(searchedList[i]) + ", " + index + ")");
            document.querySelectorAll('.country-code-results-p-' + (index + 1))[i].parentElement.style.cursor = "pointer"
        }
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

    for(let i = 0; i < document.querySelectorAll('.country-code-search').length; i++){
        for(let j = 0; j < document.querySelectorAll('.country-code-results-img-' + (i + 1)).length; j++){
            let randomCountry = countryCodes[Math.floor(Math.random() * countryCodes.length)];

            document.querySelectorAll('.country-code-results-img-' + (i + 1))[j].src = "https://countryflagsapi.com/svg/" + randomCountry[0];

            if(!randomCountry[3]) document.querySelectorAll('.country-code-results-p-' + (i + 1))[j].innerHTML = randomCountry[1] + " (+" + randomCountry[2] + ")";
            else document.querySelectorAll('.country-code-results-p-' + (i + 1))[j].innerHTML = randomCountry[3] + " (+" + randomCountry[2] + ")";

            document.querySelectorAll('.country-code-results-p-' + (i + 1))[j].parentElement.style.cursor = "pointer"
            document.querySelectorAll('.country-code-results-p-' + (i + 1))[i].parentElement.setAttribute("onclick", "setCountryCode(" + countryCodes.indexOf(randomCountry) + ", " + i + ")");
        }
    }

    if(Math.floor(Math.random() * 2) === 1) document.getElementById('student-account-pic').src = "./icons/student_nerd.png"

    togglePageFlip(0);
}

document.getElementById('login').onclick = function(){
    //login code goes here
}

function toggleCountryCode(index){
    if(document.querySelectorAll('.country-code-search')[index].classList.contains('inactive-modal')){
        document.querySelectorAll('.country-code-search')[index].classList.remove('inactive-modal')
    } else {
        document.querySelectorAll('.country-code-search')[index].classList.add('inactive-modal')
    }
}

function sendForm(email, fullName, type){

    let form = document.createElement('form');
    form.setAttribute('name', 'google-form');

    let emailInput = document.createElement('input');
    emailInput.value = email;
    emailInput.setAttribute('name', "Emails");

    let fullNameInput = document.createElement('input');
    fullNameInput.value = fullName;
    fullNameInput.setAttribute('name', "Names");

    let typeInput = document.createElement('input');
    typeInput.value = type;
    typeInput.setAttribute('name', "User Type");

    form.append(emailInput, fullNameInput, typeInput)

    fetch("https://script.google.com/macros/s/AKfycbxIWkXEO4ez9tgCluX4Fo2oOLN9KJwENjaF47ue53aKjFA-dGGiCU0wHuQPtZ0gZnXqpg/exec", { method: 'POST', body: new FormData(form)})
        .then(response => console.log('Success!', response))
        .catch(error => console.error('Error!', error.message))
}

document.getElementById('individual-sign-up').onclick = function(){
    const user = new User();

    user.updateName(document.getElementById('individual-name').value);
    user.email = document.getElementById('individual-email').value;
    user.password = document.getElementById('individual-password').value;
    user.type = UserTypes.INDIVIDUAL;

    sendForm(document.getElementById('individual-name').value, user.email, user.type);

    createUser(user)
}

document.getElementById('student-sign-up').onclick = function(){
    const user = new User();

    user.updateName(document.getElementById('student-name').value);
    user.email = document.getElementById('student-email').value;
    user.password = document.getElementById('student-password').value;
    user.type = UserTypes.STUDENT;

    sendForm(document.getElementById('student-name').value, user.email, user.type);

    createUser(user);
}

document.getElementById('instructor-sign-up').onclick = function(){
    const user = new User();

    user.updateName(document.getElementById('instructor-name').value);
    user.email = document.getElementById('instructor-email').value;
    user.password = document.getElementById('instructor-password').value;
    user.type = UserTypes.INSTRUCTOR;

    sendForm(document.getElementById('instructor-name').value, user.email, user.type);


    createUser(user)
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

function createUser(data){

}

initialize();