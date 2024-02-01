async function initialize(){
    await createComponent("../../Components/navbar.html", document.getElementById("navbar-container"));
    await createComponent("../../Components/footer.html", document.getElementById("footer-container"));

    fetch('user-agreement.dat')
        .then(response => response.text())
        .then(data => {
            // Do something with your data

            data = data.split('\n');

            let iteration = 1;

            for(let i = 0; i < data.length; i++){
                let newNode;

                if(data[i].substring(0, 2) === '# '){
                    newNode = document.createElement("h2");
                    data[i] = `Section ${iteration} - ${data[i].substring(2)}`;
                    iteration++;
                } else {
                    newNode = document.createElement("p");
                }

                newNode.innerHTML = data[i];

                document.getElementById("user-agreement-break").appendChild(newNode);
            }
        });
}

initialize();