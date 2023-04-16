let sidebarAmount = 0;
let jobAmount = 0;

function createPosition(image, name, tags, introduction, description, responsibilities){
    sidebarPosition(image, name);
    jobDesc(name, tags, introduction, description, responsibilities)
}

function jobDesc(name, tags, introduction, description, responsibilities){
    let newPosition = document.createElement('div');
    let newHeader = document.createElement('h1');

    if(jobAmount === 0){
        newPosition.classList.add('job-position');
        document.getElementById('apply-now').innerHTML = "Apply to be a " + name;
    }
    else newPosition.classList.add('inactive-job-position');
    newHeader.innerHTML = name;
    newHeader.classList.add('job-name');

    newPosition.appendChild(newHeader);

    let tagList = document.createElement('div');

    for(let i = 0; i < tags.length; i++){
        let newTag = document.createElement('div');
        let newTagImg = document.createElement('img');
        let newTagP = document.createElement('p');

        newTagImg.src = "./icons/tags/" + tags[i] + ".svg";
        newTagP.innerHTML = tagNames[tags[i]];

        newTag.appendChild(newTagImg);
        newTag.appendChild(newTagP);
        tagList.appendChild(newTag);
    }

    let newDesc = document.createElement('p');
    newDesc.innerHTML = introduction;

    newPosition.appendChild(tagList)
    newPosition.appendChild(newDesc)

    let newObjectives = document.createElement('h1');
    let newObjectivesPara = document.createElement('p');

    newObjectives.innerHTML = "Job Description";
    newObjectivesPara.innerHTML = description

    newPosition.appendChild(newObjectives)
    newPosition.appendChild(newObjectivesPara)

    document.getElementById('main-container').appendChild(newPosition);

    let newResponsibilitiesHeader = document.createElement('h1');
    let newResponsibilities = document.createElement('ul')

    newResponsibilitiesHeader.innerHTML = "Job Responsibilities";
    newPosition.appendChild(newResponsibilitiesHeader);

    for(let i = 0; i < responsibilities.length; i++){
        let newResponsibility = document.createElement('li');
        newResponsibility.innerHTML = responsibilities[i];
        newResponsibilities.appendChild(newResponsibility);
    }

    newPosition.appendChild(newResponsibilities);
    jobAmount++;
}

function sidebarPosition(image, name){
    let newPosition = document.createElement('div');
    let newPositionImg = document.createElement('img');
    let newPositionHeader = document.createElement('h1');

    if(sidebarAmount !== 0) newPosition.classList.add('inactive-job-sidebar')
    else newPosition.classList.add("job-sidebar");

    newPositionImg.src = "./icons/" + image + ".svg";
    newPositionHeader.innerHTML = name;

    newPosition.appendChild(newPositionImg);
    newPosition.appendChild(newPositionHeader);
    newPosition.setAttribute("onclick", "activePosition(" + sidebarAmount + ")");

    document.getElementById('available-positions').appendChild(newPosition);
    sidebarAmount++;
}

function activePosition(index){
    const vowels = ['a', 'e', 'i', 'o', 'u'];

    document.querySelectorAll('.job-sidebar')[0].classList.add('inactive-job-sidebar');
    document.querySelectorAll('.job-sidebar')[0].classList.remove('job-sidebar');
    document.querySelectorAll('.inactive-job-sidebar')[index].classList.add("job-sidebar");
    document.querySelectorAll('.inactive-job-sidebar')[index].classList.remove("inactive-job-sidebar");

    document.querySelectorAll('.job-position')[0].classList.add('inactive-job-position');
    document.querySelectorAll('.job-position')[0].classList.remove('job-position');
    document.querySelectorAll('.inactive-job-position')[index].classList.add("job-position");
    document.querySelectorAll('.inactive-job-position')[index].classList.remove("inactive-job-position");
    if(vowels.includes(document.querySelectorAll('.job-name')[index].textContent[0].toLowerCase())) document.getElementById('apply-now').innerHTML = "Apply to be an " + document.querySelectorAll('.job-name')[index].textContent;
    else document.getElementById('apply-now').innerHTML = "Apply to be a " + document.querySelectorAll('.job-name')[index].textContent
}

const tagNames = ["Development", "Design", "Part Time", "Full Time", "Remote (Worldwide)", "In Person", "Management", "Customer Care"]

createPosition("code", "Website Developer", [0,1,2,4], "Elephant was developed mainly to become a website. Website Development is a huge part of Elephant, as having developers that are as passionate about making students' lives easier and better as I am will make Elephant the best it can be. Become a website developer today to help all students everywhere!", "An Elephant Website Developer will help with maintaining the Elephant website, by coding new features and making normal products better! Within this field, there are smaller roles including product developer, bug fixer, and more, which we will disclose upon your approval into Elephant! You will be working with the graphics designer, product ask, and more, so teamwork is essential.", ["Fixing Bugs and Errors In The Website with quick pace!", "Maintaining website maintenance, and ensuring top-notch UX", "Programming new features and products for Elephant", "Should be somewhat experienced in UI & UX design", "Ability to work within a team"]);
createPosition('design', "Graphics Designer", [1,2,4], "Graphics are an important part in both UX design, and for a streamlined-experience, and that is what we at Elephant are trying to achieve with all of our users. We want the students to be more excited about learning, and graphics are an easier way of conveying information in a smooth and legible way, which is one of the reasons why Graphics Design is incredibly important for a business.", "An Elephant Graphics Designer will design images and pictures to be used on the Elephant website and more. This will convey information of what Elephant has to offer as well as make take our website to the next level. You will be working with product managers, general managers, website developers and more, so teamwork is essential.", ["Ability to work in Photoshop or Illustrator to a fairly decent degree", "Creating images on the deadline", "Ability to work within a team"])
createPosition('backend', "Backend Developer", [0,2,4], "TBD", "TBD", ["Setup and monitor website backend/server health", "Maintain server security to keep UX streamlined (may become own position)"]);
createPosition('product-ask', "Product Manager", [2,4,6], "", "", []);
createPosition('mobile-code', "App Developer", [0,1,2,4], "", "", []);
createPosition('support', "Customer Support", [2,4, 7], "", "", []);

//createPosition('', "", [], "", "", []);