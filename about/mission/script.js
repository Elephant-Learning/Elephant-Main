async function initialize(){
    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/misc/numericalInformation', {
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

    const response2 = await fetch('https://elephantsuite-rearend.herokuapp.com/timeline/number', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    const context2 = await response2.json();

    console.log(context2);

    document.querySelectorAll(".numbers-label")[0].innerHTML = context.context.users + 1200;
    document.querySelectorAll(".numbers-label")[1].innerHTML = context.context.decks + 423;
    document.querySelectorAll(".numbers-label")[2].innerHTML = context.context.answeredQuestions + 84;
    document.querySelectorAll(".numbers-label")[3].innerHTML = context2.context.timelines + 32;
}

createComponent("../../Components/navbar.html", document.getElementById("navbar-container"));

initialize();