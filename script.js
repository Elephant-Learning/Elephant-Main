function initialize(){
    try{
        if(JSON.parse(localStorage.getItem('autoLogin'))) location.href = "../flashcards/dashboard";
    } catch {
        console.log("I still hate fleet");
        console.log(JSON.parse(localStorage.getItem('autoLogin')))
    }
}

initialize()