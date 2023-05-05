function initialize(){
    let iteration = 0;

    document.querySelectorAll("#terms-and-conditions h2").forEach(function(element){
        iteration++;
        element.innerHTML = `Section ${iteration} - ${element.textContent}`;
    });
}

initialize();