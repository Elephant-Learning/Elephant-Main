let timeline;

window.onload = async function(){
    locateUserInfo();

    if(isNaN(parseInt(location.href.split("=")[1]))){
        timeline = {
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
        timeline = context.context.timeline;
        console.log(context);
    }

    Object.freeze(timeline)
}

window.jsPDF = window.jspdf.jsPDF;

function createPDF(){
    const doc = new jsPDF({
        orientation: 'landscape'
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    doc.text(20, 20, `${timeline.name}`);

    let img = new Image()
    img.src = `../../icons/avatars/${timeline.authorPfpId}.png`
    doc.addImage(img, 'png', 20, 30, 10, 10)

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(35, 30, `${timeline.authorName}`);

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
    doc.save(`${timeline.name}.pdf`);
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
}