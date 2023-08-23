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

            console.log("Login as " + context.context.user.firstName);

            document.getElementById("login-link-name").innerHTML = "Login as " + context.context.user.firstName;
            console.log(context.context.user.firstName)
            document.getElementById("login-link-name").previousElementSibling.setAttribute("href", prefix + "dashboard/");
            document.getElementById("login-link-name").parentElement.appendChild(document.createElement("div"));
        } else {
            console.log(JSON.parse(localStorage.getItem('autoLogin')))
        }
    } catch (e){
        console.log("Welcome to Elephant")
    }
  
    console.log("sdf")
}

function showCookiesModal(){
    document.getElementById("cookies-modal").classList.remove("inactive-modal");
}

function acceptCookies(){
    document.getElementById("cookies-modal").classList.add("inactive-modal");
    localStorage.setItem("cookiesAccepted", JSON.stringify(true));
}

initializeNavbar(document.getElementById('navbar-prefix').innerHTML).then(r => {
    try{
        if(!JSON.parse(localStorage.getItem("cookiesAccepted"))) showCookiesModal();
    } catch (e){
        localStorage.setItem("cookiesAccepted", JSON.stringify(false));
        showCookiesModal();
    }
});