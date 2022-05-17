let marqueeIndex = 0;
let maxMarquee = 2;

const gradients = [
    "linear-gradient(135deg, #2472fc 0%, #8711c1 100%)",
    "linear-gradient(135deg, #FA0874 0%, #e91fa8 100%)",
    "linear-gradient(135deg, #FF7D58 0%, #FFCC4B 100%)",
    "linear-gradient(135deg, #49DEB2 0%, #23E256 100%)"
]

function addContributor(name, type){
    let newDiv = document.createElement('div');
    let newName = document.createElement('h1');
    let subDiv = document.createElement('div');
    let fullName = document.createElement('h2');
    let typePara = document.createElement('p');

    newName.innerHTML = name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'');
    fullName.innerHTML = name;
    typePara.innerHTML = type;

    newName.style.background = gradients[Math.floor(Math.random() * gradients.length)]

    subDiv.appendChild(fullName);
    subDiv.appendChild(typePara);
    newDiv.appendChild(newName);
    newDiv.appendChild(subDiv);

    document.querySelectorAll('.marquee-container')[marqueeIndex].appendChild(newDiv);
    marqueeIndex++
    if(marqueeIndex > maxMarquee - 1) marqueeIndex = 0;
}

addContributor("Ronak Kothari", "Chief Executive Officer")
addContributor('Abhiram Boddu', 'Senior Product Officer');
addContributor("Shubham Garg", "Contributor");
addContributor("Dhruv Arora", "Contributor");
addContributor("Jyot Kumar", "Contributor");
addContributor("Rupali Khot", "Contributor");
addContributor("Sandilya Parimi", "Contributor");
addContributor("Shrihun Sankepally", "Contributor");
addContributor("Neal Parekh", "Senior UX/UI Designer")
