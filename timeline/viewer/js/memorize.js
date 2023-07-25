function initializeMemorize(){

}

window.addEventListener("keypress", function(e){
    try{
        document.querySelector(".active-box").classList.remove("active-box");
    } catch(e){}

    if(e.keyCode >= 49 && e.keyCode <= 52){
        document.querySelectorAll(".memorize-box")[e.keyCode - 49].classList.add("active-box")
    }
});

window.addEventListener("keyup", function(e){
    try{
        document.querySelector(".active-box").classList.remove("active-box");
    } catch(e){}
});

initializeMemorize()