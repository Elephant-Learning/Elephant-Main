let TIMELINE;
let activeTab;

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

window.onload = async function(){
    await locateUserInfo();

    if(isNaN(parseInt(location.href.split("=")[1]))){
        TIMELINE = {
            name: "Sample Elephant Timeline",
            authorPfpId: 47,
            authorName: "Elephant - The Ultimate Student Suite",
            events: {

            },
            marker: {

            }
        }
    } else {
        const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

        const response = await fetch(`https://elephantsuite-rearend.herokuapp.com/timeline/get?userId=${savedUserId}&timelineId=${location.href.split("=")[1]}`, {
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
        TIMELINE = context.context.timeline;
        console.log(context);
    }

    Object.freeze(TIMELINE);

    if(TIMELINE.events.length >= 4){
        document.querySelectorAll(".sidebar-node")[1].classList.remove("unavailable-sidebar-node");
        document.querySelectorAll(".sidebar-node")[2].classList.remove("unavailable-sidebar-node");

        document.querySelectorAll(".sidebar-node")[1].addEventListener("click", function(e){
            togglePageFlip(1, 1);
        });

        document.querySelectorAll(".sidebar-node")[2].addEventListener("click", function(e){
            togglePageFlip(2, 2);
        })
    }

    initializeViewer(TIMELINE)
    initializeMemorize(TIMELINE);
    createChronology(TIMELINE);
}

window.jsPDF = window.jspdf.jsPDF;

function createPDF(){
    const doc = new jsPDF({
        orientation: 'landscape'
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    doc.text(20, 20, `${TIMELINE.name}`);

    let img = new Image()
    img.src = `../../icons/avatars/${TIMELINE.authorPfpId}.png`
    doc.addImage(img, 'png', 20, 30, 10, 10)

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(35, 30, `${TIMELINE.authorName}`);

// Add new page
    doc.addPage();

    doc.html(document.getElementById("desktop-parent-container"), {
        callback: function(doc) {
            // Save the PDF
            doc.save('sample-document.pdf');
        },
        x: 15,
        y: 15,
        width: 170, //target width in the PDF document
        windowWidth: 650 //window width in CSS pixels
    });

// Save the PDF
    doc.save(`${TIMELINE.name}.pdf`);
}

function togglePageFlip(index, sidebar){

    const pages = ["Timeline Viewer", "Timeline Memorize", "Timeline Chronology"];

    document.getElementById('desktop-main-container-tab').innerHTML = pages[index];
    try{document.querySelector(".active-sidebar-dropdown-category").classList.remove('active-sidebar-dropdown-category')} catch{}

    document.querySelectorAll('.sidebar-node')[sidebar].classList.add('active-sidebar-dropdown-category')

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

    activeTab = index;
}

async function initialize(user){
    if(user.status === "FAILURE" || user.error === "Bad Request") {
        location.href = "../../login"
    } else user = user.context.user;

    await createComponent("../../Components/app-navbar.html", document.getElementById("desktop-navbar-container"));

    console.log(user);

    const emojis_refactored = ["confused", "cool", "happy", "laugh", "nerd", "neutral", "unamused", "uwu", "wink"];

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png";
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();
    document.getElementById('desktop-profile-user-img').src = "../../flip/icons/emojis/" + emojis_refactored[Math.floor(Math.random() * emojis_refactored.length)] + ".png"
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

    togglePageFlip(0, 0);
}