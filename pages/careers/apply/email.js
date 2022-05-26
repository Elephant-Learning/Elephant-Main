var form_id_js = "javascript_form";
let place;

var data_js = {
    "access_token": "wu1wjulppkrfejx1nvpp0xs0" // sent after you sign up
};

function js_onSuccess() {
    // remove this to avoid redirect
    window.location = window.location.pathname + "?message=Email+Successfully+Sent%21&isError=0";
}

function js_onError(error) {
    // remove this to avoid redirect
    window.location = window.location.pathname + "?message=Email+could+not+be+sent.&isError=1";
}

var sendButton = document.getElementById("js_send");

function js_send() {
    sendButton.value='Sending…';
    sendButton.disabled=true;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            js_onSuccess();
        } else
        if(request.readyState === 4) {
            js_onError(request.response);
        }
    };

    var subject = "Elephant Questions - " + document.querySelector("#" + form_id_js + " [name='fullname']").value;
    var message = document.querySelector("#" + form_id_js + " [name='text']").value + "\n \nEmail Address: " + document.querySelector("#" + form_id_js + " [name='email']").value + "\n \nLocation: " + place;
    data_js['subject'] = subject;
    data_js['text'] = message;
    var params = toParams(data_js);

    request.open("POST", "https://postmail.invotes.com/send", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.send(params);

    return false;
}

sendButton.onclick = js_send;

function toParams(data_js) {
    var form_data = [];
    for ( var key in data_js ) {
        form_data.push(encodeURIComponent(key) + "=" + encodeURIComponent(data_js[key]));
    }

    return form_data.join("&");
}

var js_form = document.getElementById(form_id_js);
js_form.addEventListener("submit", function (e) {
    e.preventDefault();
});

let api = 'ZmE1Y2I5N2YxYWQyNzEzZTEzNDRjM2QyNzE3NzZmODY=';

document.addEventListener('DOMContentLoaded', function(){
    api = atob(api);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            // Storing Longitude and Latitude in variables
            let long = position.coords.longitude;
            let lat = position.coords.latitude;
            const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=metric`;

            // Using fetch to get data
            fetch(base)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    place = data.name;
                });
        });
    }
})