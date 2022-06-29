let selectedSignUpOption;

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


initialize();