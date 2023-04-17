function initalize(){
    const interval = setInterval(function(){
        const date = new Date();

        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let AMPM = "AM";

        if(hours > 12){
            AMPM = "PM";
            hours -= 12;
        } if(hours == 0) hours += 12;

        if(minutes < 10) minutes = "0" + minutes;
        if(seconds < 10) seconds = "0" + seconds;

        document.getElementById("clock").innerHTML = hours + ":" + minutes + ":" + seconds + " " + AMPM;
    }, 1000);
}

initalize();