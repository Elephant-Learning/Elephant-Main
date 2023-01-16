async function initializeNavbar(prefix){
    try{
        if(JSON.parse(localStorage.getItem('autoLogin'))) {
            let savedUserId = JSON.parse(localStorage.getItem('savedUserId'))
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

            document.getElementById("login-link").innerHTML = "Login as " + context.context.user.firstName;
            document.getElementById("login-link").setAttribute("href", prefix + "flashcards/dashboard/");
        }
    } catch {
        console.log("I still hate fleet");
        console.log(JSON.parse(localStorage.getItem('autoLogin')))
    }
}

initializeNavbar(document.getElementById('navbar-prefix').innerHTML);