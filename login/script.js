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

    if(Math.floor(Math.random() * 2) === 1) document.getElementById('student-account-pic').src = "./icons/student_nerd.png"

    togglePageFlip(0);
}

document.getElementById('login').onclick = function(){
    //login code goes here
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