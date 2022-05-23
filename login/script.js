document.getElementById('sign-up-link').onclick = function(){
    document.getElementById('log-in-container').classList.add('inactive-container');
    document.getElementById('sign-up-container').classList.remove('inactive-container')
}

document.getElementById('log-in-link').onclick = function(){
    document.getElementById('log-in-container').classList.remove('inactive-container');
    document.getElementById('sign-up-container').classList.add('inactive-container')
}