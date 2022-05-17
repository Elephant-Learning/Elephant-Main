let firstQuestion = true;
const randomCongrats = [
    "Nice, Now Get The Next One",
    "I Thought That Would Stump You",
    "You'll never get this next one!",
    "Quite Possibly The Greatest Thing I've Ever Seen",
    "You Got Lucky There",
    "That was an Easy Question!"
]

function initialize(){
    console.log("b")
    getData().then(r => console.log("%cTrivia Question Request Successful", "color:lightgreen;"));
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

async function getData() {
    const parentDiv = document.querySelector('#flashcard-answers');

    let response;

    try{ response = await fetch('https://api.trivia.willfry.co.uk/questions?limit=5')}
    catch{
        throw new Error("Internet Connectivity Error - Failed to Connect to Trivia API");
        return;
    }

    let child = parentDiv.lastElementChild;

    while (child) {
        parentDiv.removeChild(child);
        child = parentDiv.lastElementChild;
    }

    if(firstQuestion) document.getElementById('flashcard-header').innerHTML = "Loading Sample Question"
    else document.getElementById('flashcard-header').innerHTML = randomCongrats[Math.floor(Math.random() * randomCongrats.length)];

    let data = await response.json();
    let questionAsked;

    if(data["0"].incorrectAnswers.length > 8 || data["0"].question.length > 30) {
        if(data["1"].incorrectAnswers.length > 8 || data["1"].question.length > 30) {
            if(data["2"].incorrectAnswers.length > 8 || data["2"].question.length > 30) {
                if(data["3"].incorrectAnswers.length > 8 || data["3"].question.length > 30) {
                    if(data["4"].incorrectAnswers.length > 8 || data["4"].question.length > 30) {
                        document.getElementById('flashcard-header').innerHTML = "Giving You An Easier Question";
                        getData();
                        return;
                    } else questionAsked = data["4"];
                } else questionAsked = data["3"];
            } else questionAsked = data["2"];
        } else questionAsked = data["1"];
    } else questionAsked = data["0"];

    document.getElementById('flashcard-header').innerHTML = questionAsked.question;

    console.log("%cYou won't find the answer in here", "color:blue;");

    let answersArray = [];

    for(let i = 0; i < questionAsked.incorrectAnswers.length; i++){
        let incorrectAnswer = document.createElement('h6');
        incorrectAnswer.innerHTML = questionAsked.incorrectAnswers[i];
        answersArray.push(incorrectAnswer);
    }

    let correctAnswer = document.createElement('h6');
    correctAnswer.setAttribute('onclick', 'getData()');
    correctAnswer.innerHTML = questionAsked.correctAnswer;
    answersArray.push(correctAnswer);

    answersArray = shuffleArray(answersArray);

    for(let i = 0; i < answersArray.length; i++){
        parentDiv.appendChild(answersArray[i])
    }

    let skipBtn = document.createElement('h6');
    skipBtn.classList.add('skip-btn');
    skipBtn.innerHTML = "Skip Question";

    parentDiv.appendChild(skipBtn)
    firstQuestion = false;
}

initialize();
