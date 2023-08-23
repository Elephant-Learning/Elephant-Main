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

function showAnnouncementsModal(index){
    const announcements = [
        "📢New Timeline Feature Released on Elephant - The Ultimate Student Suite",
    ]

    try{
        let userAnnouncements = JSON.parse(localStorage.getItem('announcementsChecked'));

        if(!userAnnouncements.includes(index)){
            document.getElementById("announcements-para").innerHTML = announcements[index];
            document.getElementById("announcements-button").addEventListener("click", function(e){
                userAnnouncements.push(index);
                localStorage.setItem('announcementsChecked', JSON.stringify(userAnnouncements));

                document.getElementById("announcements").classList.add("inactive-modal");
            })

            document.getElementById("announcements").classList.remove("inactive-modal");
        }
    } catch(e){
        localStorage.setItem('announcementsChecked', JSON.stringify([]));
    }
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

    showAnnouncementsModal(0);
});