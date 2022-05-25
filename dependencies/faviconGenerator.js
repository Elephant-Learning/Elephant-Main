document.addEventListener('DOMContentLoaded', function() {
    let date = new Date();
    let month = date.getMonth();
    let day = date.getDate();
    let year = date.getFullYear();
    let time = date.getHours() + ":" + date.getMinutes();

    console.log(date.getDay());

    let favicon = document.getElementById('favicon');

    if(month === 5){
        const prides = ["gay-pride", "heterosexual", "lesbian-pride", "non-binary-pride", "pride", "trans-pride", "bisexual-pride"];
        favicon.setAttribute('href', "./icons/elephant-400-400-" + prides[Math.floor(Math.random() * prides.length)] + ".png");
    } else if(month === 7 && day === 28){
        favicon.setAttribute('href', "./icons/elephant-400-400-india.png");
    } else if(month === 6 && day === 4) {
        favicon.setAttribute('href', "./icons/elephant-400-400-usa2.png");
    } else if(month === 4 && year === 2022){
        favicon.setAttribute('href', "./icons/elephant-400-400-ukraine-2.png");
    } else if(month === 10 && day === 24){
        favicon.setAttribute('href', "./icons/elephant-400-400-thanksgiving-1.png");
    } else if([11,0,1].includes(month) && Math.floor(Math.random() * 10) === 1){
        favicon.setAttribute('href', "./icons/elephant-400-400-snowy-2.png");
    } else if(date.getDay() === 5 && day === 13 && time === "3:"){
        favicon.setAttribute('href', "./icons/elephant-400-400-val-day-2.png");
    } else {
        favicon.setAttribute('href', "./icons/elephant-400-400-grayscale.png");
    }

}, false);
