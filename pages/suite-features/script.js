const gradients = [
    "linear-gradient(135deg, #2472fc 0%, #8711c1 100%)",
    "linear-gradient(135deg, #FA0874 0%, #e91fa8 100%)",
    "linear-gradient(135deg, #FF7D58 0%, #FFCC4B 100%)",
    "linear-gradient(135deg, #49DEB2 0%, #23E256 100%)"
]

function addProduct(image, name, description, creator, link, color){
    let newDiv = document.createElement('div');
    let newImgDiv = document.createElement('div');
    let newImg = document.createElement('img');
    let newHeader = document.createElement('h1');
    let newPara = document.createElement('p')
    let mainCreatorDiv = document.createElement('div')
    let newButton = document.createElement('button')

    newHeader.innerHTML = name;
    newPara.innerHTML = description;
    newImg.src = "../pricing/icons/" + image + ".svg";

    if(!color && color !== 0) newImgDiv.style.background = gradients[Math.floor(Math.random() * gradients.length)];
    else newImgDiv.style.background = gradients[color];

    newImgDiv.appendChild(newImg);

    for(let i = 0; i < creator.length; i++){
        let creatorDiv = document.createElement('div');
        let creatorImg = document.createElement('img');
        let creatorName = document.createElement('p')

        creatorImg.src = "icons/" + (creator[i].replace(/\s/g, '')).toLowerCase() + ".png";
        creatorName.innerHTML = creator[i];

        creatorDiv.appendChild(creatorImg);
        creatorDiv.appendChild(creatorName);
        mainCreatorDiv.appendChild(creatorDiv);
    }

    newDiv.appendChild(newImgDiv);
    newDiv.appendChild(newHeader);
    newDiv.appendChild(newPara);
    newDiv.appendChild(mainCreatorDiv);

    if(link !== undefined){
        newButton.innerHTML = "Proceed To Application"
        newButton.setAttribute("onclick", "location.href = '" + link + "'")
    } else {
        newButton.innerHTML = "Coming Out Soon"
        newButton.classList.add('undefined-btn');
    }

    newDiv.appendChild(newButton)

    document.getElementById('products-showcase').appendChild(newDiv);
}

addProduct('brain', "Flashcards", "Memorization made easier than ever!", ["Ronak Kothari", "Abhiram Boddu"], '../../flashcards', 0);
addProduct('timeline', "Task Manager", "Track your tasks fast and efficiently!", ["Ronak Kothari", "Neal Parekh"], undefined, 2);