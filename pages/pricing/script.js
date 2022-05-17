const gradients = [
    "linear-gradient(135deg, #2472fc 0%, #8711c1 100%)",
    "linear-gradient(135deg, #FA0874 0%, #e91fa8 100%)",
    "linear-gradient(135deg, #FF7D58 0%, #FFCC4B 100%)",
    "linear-gradient(135deg, #49DEB2 0%, #23E256 100%)"
]

function addTableRow(image, name, regular, premium){
    let newTR = document.createElement('tr');

    let headerTD = document.createElement('td');
    let headerDiv = document.createElement('div');
    let headerImg = document.createElement('img');
    let header = document.createElement('p');

    headerTD.classList.add('feature-row')

    header.innerHTML = name;
    headerDiv.style.background = gradients[Math.floor(Math.random() * gradients.length)];
    headerImg.src = "icons/" + image + ".svg";

    headerDiv.appendChild(headerImg);
    headerTD.appendChild(headerDiv);
    headerTD.appendChild(header)
    newTR.appendChild(headerTD);

    for(let i = 0; i < 2; i++){
        let productTD = document.createElement('td');
        let productImg = document.createElement('img')

        if(i === 0 && regular){
            productImg.src = "icons/check.svg"
            productTD.appendChild(productImg)
            productTD.classList.add('feature-row')
        } else if(i === 1 && premium){
            productImg.src = "icons/check.svg"
            productTD.appendChild(productImg)
            productTD.classList.add('feature-row')
        }

        newTR.appendChild(productTD);
    }

    document.getElementById('table-container').appendChild(newTR)
}

addTableRow('brain', 'Elephant Flashcards', true, true);
addTableRow('test', 'Elephant Flashcards Test', false, true);
addTableRow('sync', "Elephant Flashcards Sync", false, true);
addTableRow('update', 'Experimental Access', false, true);
addTableRow('timeline', 'Elephant Timetable', true, true);
addTableRow('test', "Elephant Essay", true, true);
addTableRow('games', "Elephant Quickies", true, true);
addTableRow('account', "Elephant Account", false, true);