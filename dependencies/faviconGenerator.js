let api = 'ZmE1Y2I5N2YxYWQyNzEzZTEzNDRjM2QyNzE3NzZmODY=';
const prefix = "./";

document.addEventListener('DOMContentLoaded', function() {
    let date = new Date();
    let month = date.getMonth();
    let day = date.getDate();
    let year = date.getFullYear();
    let time = date.getHours() + ":" + date.getMinutes();

    api = atob(api);

    let favicon = document.querySelectorAll('.icon');
    let chosenIcon;

    if(month === 5){
        const prides = ["gay-pride", "heterosexual", "lesbian-pride", "non-binary-pride", "pride", "trans-pride", "bisexual"];
        chosenIcon = prefix + "icons/elephant-400-400-" + prides[Math.floor(Math.random() * prides.length)] + ".png";
    } else if(month === 7 && day === 28){
        chosenIcon = prefix + "icons/elephant-400-400-india.png";
    } else if(month === 6 && day === 4) {
        chosenIcon = prefix + "icons/elephant-400-400-usa2.png";
    } else if(month === 4 && year === 2022){
        chosenIcon = prefix + "icons/elephant-400-400-ukraine-2.png";
    } else if(month === 10 && day === 24){
        chosenIcon = prefix + "icons/elephant-400-400-thanksgiving-1.png";
    } else if([11,0,1].includes(month) && Math.floor(Math.random() * 10) === 1){
        chosenIcon = prefix + "icons/elephant-400-400-snowy-2.png";
    } else if(date.getDay() === 5 && day === 13 && time === "3:"){
        chosenIcon = prefix + "icons/elephant-400-400-val-day-2.png";
    } else {
        chosenIcon = prefix + "icons/elephant-400-400-grayscale.png";
    }

    let long;
    let lat;
    // Accesing Geolocation of User
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            // Storing Longitude and Latitude in variables
            long = position.coords.longitude;
            lat = position.coords.latitude;
            const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=metric`;

            // Using fetch to get data
            fetch(base)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    const { temp, feels_like } = data.main;
                    const place = data.name;
                    const { description, icon } = data.weather[0];
                    const { sunrise, sunset } = data.sys;

                    const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                    const fahrenheit = (temp * 9) / 5 + 32;

                    // Converting Epoch(Unix) time to GMT
                    const sunriseGMT = new Date(sunrise * 1000);
                    const sunsetGMT = new Date(sunset * 1000);

                    if(description === "snow"){
                        chosenIcon = prefix + "icons/elephant-400-400-snowy-2.png";
                    }
                });
        });
    }

    for(let i = 0; i < favicon.length; i++){
        if(favicon[i].tagName === "LINK") favicon[i].setAttribute('href', chosenIcon);
        else if(favicon[i].tagName === "IMG") favicon[i].src = chosenIcon;
    }

}, false);
