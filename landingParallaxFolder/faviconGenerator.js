let api = 'ZmE1Y2I5N2YxYWQyNzEzZTEzNDRjM2QyNzE3NzZmODY=';

document.addEventListener('DOMContentLoaded', function() {
    let date = new Date();
    let month = date.getMonth();
    let day = date.getDate();
    let year = date.getFullYear();
    let time = date.getHours() + ":" + date.getMinutes();

    api = atob(api);

    let favicon = document.getElementById('icon');
    let logo = document.getElementById('logo');

    console.log(favicon);
    console.log(logo);

    if (month === 0) {
        if (day === 0) {
            favicon.setAttribute('href', "../../icons/elephant-400-400-new-year-1-perfect-template.png");
            logo.setAttribute('src', "../icons/elephant-400-400-new-year-1-perfect-template.png");
        }
        else if (day === 25) {
            favicon.setAttribute('href', "../icons/elephant-400-400-india.png");
            logo.setAttribute('src', "../icons/elephant-400-400-india.png");
        }
    }
    else if (month === 1) {
        favicon.setAttribute('href', "../icons/elephant-400-400-val-day-1.png");
        logo.setAttribute('src', "../icons/elephant-400-400-val-day-1.png");
    }
    else if(month === 5){
        if (day >= 0 && day <= 4) {
            favicon.setAttribute('href', "../icons/elephant-400-400-pride.png");
            logo.setAttribute('src', "../icons/elephant-400-400-pride.png");
        }
        else if (day >= 5 && day <= 8) {
            favicon.setAttribute('href', "../icons/elephant-400-400-gay-pride.png");
            logo.setAttribute('src', "../icons/elephant-400-400-gay-pride.png");
        }
        if (day >= 9 && day <= 13) {
            favicon.setAttribute('href', "../icons/elephant-400-400-lesbian-pride.png");
            logo.setAttribute('src', "../icons/elephant-400-400-lesbian-pride.png");
        }
        else if (day >= 14 && day <= 18) {
            favicon.setAttribute('href', "../icons/elephant-400-400-non-binary-pride.png");
            logo.setAttribute('src', "../icons/elephant-400-400-non-binary-pride.png");
        }
        else if (day >= 19 && day <= 22) {
            favicon.setAttribute('href', "../icons/elephant-400-400-heterosexual.png");
            logo.setAttribute('src', "../icons/elephant-400-400-heterosexual.png");
        }
        else if (day >= 23 && day <= 26) {
            favicon.setAttribute('href', "../icons/elephant-400-400-trans-pride.png");
            logo.setAttribute('src', "../icons/elephant-400-400-trans-pride.png");
        }
        else if (day >= 27 && day >= 32) {
            favicon.setAttribute('href', "../icons/elephant-400-400-bisexual.png");
            logo.setAttribute('src', "../icons/elephant-400-400-bisexual.png");
        }
    }
    else if (month === 6) {
        if (day === 3) {
            favicon.setAttribute('href', "../icons/elephant-400-400-usa-2.png");
            logo.setAttribute('src', "../icons/elephant-400-400-usa-2.png");
        }
        else {
            favicon.setAttribute('href', "../icons/elephant-400-400-summer-1.png");
            logo.setAttribute('src', "../icons/elephant-400-400-summer-1.png");
        }   
    }
    else if (month === 7) {
        if (day === 14) {
            favicon.setAttribute('href', "../icons/elephant-400-400-india.png");
            logo.setAttribute('src', "../icons/elephant-400-400-india.png");
        }
        else {
            favicon.setAttribute('href', "../icons/elephant-400-400-summer-2.png");
            logo.setAttribute('src', "../icons/elephant-400-400-summer-2.png");
        }
    }
    else if (month === 9) {
        if (day >= 24 && day <= 30) {
            favicon.setAttribute('href', "../icons/elephant-400-400-halloween-1.png");
            logo.setAttribute('src', "../icons/elephant-400-400-halloween-1.png");
        }
        else if (day === 31) {
            favicon.setAttribute('href', "../icons/elephant-400-400-halloween-2.png");
            logo.setAttribute('src', "../icons/elephant-400-400-halloween-2.png");
        }
    }
    else if (month === 10) {
        if (day >= 24 && day <= 30) {
            favicon.setAttribute('href', "../icons/elephant-400-400-thanksgiving-1.png");
            logo.setAttribute('src', "../icons/elephant-400-400-thanksgiving-1.png");
        }
    }
    else if (month === 11) {
        if (day >= 15 && day <= 24) {
            favicon.setAttribute('href', "../icons/elephant-400-400-christmas-1-elf.png");
            logo.setAttribute('src', "../icons/elephant-400-400-christmas-1-elf.png");
        }
        else if (day >= 25 && day <= 29) {
            favicon.setAttribute('href', "../icons/elephant-400-400-christmas-2-santa.png");
            logo.setAttribute('src', "../icons/elephant-400-400-christmas-2-santa.png");
        }
        else if (day >= 30) {
            favicon.setAttribute('href', "../icons/elephant-400-400-new-year-2-perfect-template.png");
            logo.setAttribute('src', "../icons/elephant-400-400-new-year-2-perfect-template.png");
        }
    }
    else {
        favicon.setAttribute('href', "../icons/elephant-400-400-gray-blue.png");
        logo.setAttribute('src', "../icons/elephant-400-400-gray-blue.png");
    }
});

let long;
    let lat;
    // Accessing Geolocation of User
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
                        favicon.setAttribute('href', "./icons/elephant-400-400-snowy-2.png");
                        logo.setAttribute('src', "./icons/elephant-400-400-snowy-2.png");
                    }
                });
        });
    }

