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

    try{ response = await fetch('https://opentdb.com/api.php?amount=10')}
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
    else if(!randomCongrats.includes(document.getElementById('flashcard-header').textContent)) document.getElementById('flashcard-header').innerHTML = randomCongrats[Math.floor(Math.random() * randomCongrats.length)];

    let data = await response.json();
    data = data.results;

    let questionAsked;
    let incorrectAnswer;
    let foundQuestion = false;
    let questionIndex = 0;


    while(!foundQuestion){
        try{
            incorrectAnswer = data[questionIndex].incorrect_answers;

            if(incorrectAnswer.length > 3 || data[questionIndex].question.length > 30) {
                console.log(questionIndex)
                questionIndex++;
            } else foundQuestion = true;
        } catch{
            foundQuestion = true;
            getData().then(r => console.log("%cTrivia Question Request Successful", "color:lightgreen;"));
        }
    }

    data = data[questionIndex]

    document.getElementById('flashcard-header').innerHTML = data.question;

    console.log("%cYou won't find the answer in here", "color:blue;");

    let answersArray = [];
    incorrectAnswer = data.incorrect_answers

    for(let i = 0; i < data.incorrect_answers.length; i++){
        let incorrectAnswer = document.createElement('p');
        incorrectAnswer.innerHTML = data.incorrect_answers[i];
        answersArray.push(incorrectAnswer);
    }

    let correctAnswer = document.createElement('p');
    correctAnswer.setAttribute('onclick', 'getData()');
    correctAnswer.innerHTML = data.correct_answer;
    answersArray.push(correctAnswer);

    answersArray = shuffleArray(answersArray);

    for(let i = 0; i < answersArray.length; i++){
        parentDiv.appendChild(answersArray[i])
    }

    let skipBtn = document.createElement('p');
    skipBtn.classList.add('skip-btn');
    skipBtn.innerHTML = "Skip Question";
    skipBtn.setAttribute("onclick", "getData().then(r => console.log('%cTrivia Question Request Successful', 'color:lightgreen;'))")

    parentDiv.appendChild(skipBtn)
    firstQuestion = false;
}

initialize();
