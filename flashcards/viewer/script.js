function togglePageFlip(index, sidebar, link){

    const pages = ["Deck Carousel", "Deck Memorize", "Deck Review", "Deck Statistics"];

    if(link){
        window.location.href = link;
        return;
    }

    document.getElementById('desktop-main-container-tab').innerHTML = pages[index];
    try{document.querySelector(".active-sidebar-category").classList.remove('active-sidebar-category')} catch{}

    if(!(sidebar === undefined)){
        if(sidebar >= document.querySelectorAll('.desktop-sidebar-category').length){
            document.querySelectorAll('.desktop-sidebar-folder')[sidebar - document.querySelectorAll('.desktop-sidebar-category').length].classList.add('active-sidebar-category')
        } else {
            document.querySelectorAll('.desktop-sidebar-category')[sidebar].classList.add('active-sidebar-category')
        }
    }

    try{document.querySelectorAll('.desktop-sidebar-category')[sidebar].classList.add('active-sidebar-category')} catch{}
    try {document.querySelector(".active-tab").classList.remove('active-tab')} catch{}
    document.querySelectorAll('.desktop-tab')[index].classList.add('active-tab')

    const removeBottomBtns = [1, 2, 3, 4, 5, 6, 7]

    if(removeBottomBtns.includes(index)){
        document.querySelectorAll('.desktop-bottom-btn').forEach(function(item){
            item.classList.add('inactive-modal')
        })
    } else {
        try {
            document.querySelectorAll('.desktop-bottom-btn').forEach(function(item){
                item.classList.remove('inactive-modal')
            })
        } catch{}
    }
}

window.onload = async function(){
    if(document.location.href.split("?")[1].includes("deck=")) {
        const response = await fetch('https://elephant-rearend.herokuapp.com/deck/get?id=' + document.location.href.split("=")[1], {
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
        console.log(context)
    }
}

function initialize(user){
    if(user.status === "FAILURE") {
        location.href = "../../login"
    } else user = user.context.user;

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png";
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
}

async function locateUserInfo(){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
    const response = await fetch('https://elephant-rearend.herokuapp.com/login/user?id=' + savedUserId, {
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
    initialize(context)
}

locateUserInfo()