document.addEventListener('DOMContentLoaded', function() {
    let date = new Date();
    let month = date.getMonth();
    let day = date.getDate();
    let year = date.getFullYear();
    console.log(year);

    console.log(day)

    if(month === 5){
        const prides = ["gay-pride", "heterosexual", "lesbian-pride", "non-binary-pride", "pride", "trans-pride", "bisexual-pride"];
        document.getElementById('favicon').setAttribute('href', "./icons/elephant-400-400-" + prides[Math.floor(Math.random() * prides.length)] + ".png");
    } else if(month === 7 && day === 28){
        document.getElementById('favicon').setAttribute('href', "./icons/elephant-400-400-india.png");
    } else if(month === 6 && day === 4) {
        document.getElementById('favicon').setAttribute('href', "./icons/elephant-400-400-usa2.png");
    } else if(month === 4 && year === 2022){
        document.getElementById('favicon').setAttribute('href', "./icons/elephant-400-400-ukraine-2.png");
    } else {
        document.getElementById('favicon').setAttribute('href', "./icons/elephant-400-400-grayscale.png");
    }
}, false);