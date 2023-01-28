async function initialize(){
    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/misc/totalUsersAndCards', {
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

    document.querySelectorAll(".numbers-label")[0].innerHTML = context.context.users;
    document.querySelectorAll(".numbers-label")[1].innerHTML = context.context.cards;
}

initialize();