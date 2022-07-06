let answer;


const mathSymbols = {
    SQUARED: "\t\xB2",
    CUBED: "\t\xB3",
    DEGREE: "\t\xB0",
    QUARTER: "\t\xBC",
    HALF: "\t\xBD",
    THREE_QUARTERS: "\xBE",
    MULTIPLY: "\t\xD7",
    DIVIDE: "\t\xF7",
    IMAGINARY: "\u2111",
    REAL: "\u211C",
    ELEMENT_OF: "\t\u2208",
    ROOT: "\t\u221A",
    APPROXIMATELY: "\t\u2248",
    LESS_EQUAL: "\u2264",
    GREATER_EQUAL: "\u2265",
    FUNCTION: "&#x192",
    PI: "&#x3A0"
}

const operatorList = ["+", "-", mathSymbols.MULTIPLY, mathSymbols.DIVIDE]

const miscSymbols = {
    SPADES: "\u2660",
    CLUBS: "\u2663"
}

function operation(term1, term2, operator){
    if(operator === 0) return term1 + term2;
    if(operator === 1) return term1 - term2;
    if(operator === 2) return term1 * term2;
    if(operator === 3) return term1 / term2;
}

function systemsOfEquations(difficulty){
    let newDiv = document.createElement('div');
    let problemPara = document.createElement('p');

    if(difficulty === 1){

        answer = [["X-Value", Math.floor(Math.random() * 10)], ["Y-Value", Math.floor(Math.random() * 10)]];

        problemPara.innerHTML = "Please solve the following systems of equations to find the unknown variables. Please note that all variables are integers.";
        newDiv.appendChild(problemPara);

        for(let i = 0; i < 2; i++){
            let firstTerm;
            let secondTerm;
            let operator;

            let termsSelected = false;

            while(!termsSelected){
                firstTerm = Math.floor(Math.random() * 10);
                secondTerm = Math.floor(Math.random() * 10);
                operator = Math.floor(Math.random() * 4);

                if((operator === 3 && (firstTerm * answer[0][1]) % (secondTerm * answer[1][1]) !== 0) || (operator === 2 && (firstTerm === 0 || secondTerm === 0)) || (operator === 3 && (secondTerm === 0 || answer[1][1] === 0 || firstTerm === 0))){}
                else termsSelected = true;
            }

            let newPara = document.createElement('p');

            let firstCompleteTerm;
            let secondCompleteTerm;

            if(firstTerm === 0) firstCompleteTerm = "0";
            else if (firstTerm === 1) firstCompleteTerm = "x";
            else firstCompleteTerm = firstTerm + "x";

            if(secondTerm === 0) secondCompleteTerm = "";
            else if (secondTerm === 1) secondCompleteTerm = " " + operatorList[operator] + " " + " y";
            else secondCompleteTerm = " " + operatorList[operator] + " " + secondTerm + "y"

            newPara.innerHTML = firstCompleteTerm + secondCompleteTerm + " = " + operation(firstTerm * answer[0][1], secondTerm * answer[1][1], operator);
            newDiv.appendChild(newPara)
        }
    } else if(difficulty === 2){

        let wordProblem = "";

        if(Math.floor(Math.random() * 2) === 0){
            answer = [["X-Value", Math.floor(Math.random() * 15)], ["Y-Value", Math.floor(Math.random() * 15)]];

            problemPara.innerHTML = "Please carefully read the following word problem, and solve accordingly";
            newDiv.appendChild(problemPara);

            let person1, person2, placeIndex, item1, item2;

            for(let i = 0; i < 2; i++) {
                let firstTerm;
                let secondTerm;
                let operator;

                let termsSelected = false;

                while (!termsSelected) {
                    firstTerm = Math.floor(Math.random() * 15);
                    secondTerm = Math.floor(Math.random() * 15);
                    operator = Math.floor(Math.random());

                    if ((operator === 3 && (firstTerm * answer[0][1]) % (secondTerm * answer[1][1]) !== 0) || (operator === 2 && (firstTerm === 0 || secondTerm === 0)) || (operator === 3 && (secondTerm === 0 || answer[1][1] === 0 || firstTerm === 0))) {
                    } else termsSelected = true;
                }

                let newPara = document.createElement('p');

                if(operator === 0){

                    const people = ["You", "Elie", "Jacob", "Carlos", "Ethan", "Harry", "Harriet", "Josh", "Joshua", "John", "Jonathan", "Emily", "Joanna", "Rachel", "Ray", "Neil", "Sandy"];
                    const places = [["Factory", ["Panel Board", "Circuit Breaker", "Transformer", "PVC Conduit", "Lug"]], ["Pizzeria", ["Cheese Pizza", "Veggie Pizza", "Pepperoni Pizza", "BBQ Chicken Pizza", "Hawaiian Pizza", "New York Style Pizza", "Deep-Dish Pizza"]], ["Groceries", ["Apple", "Orange", "Cereal Container", "Banana", "Milk Carton", "Carrot", "Onion", "Popsicle"]], ["Music Store", ["Rap CD", "Rock CD", "Country Music CD", "Electronic Dance Music CD", "Pop CD"]], ["Video Game Store", ["Minecraft Disc", "Pong Disc", "Tetris Disc", "Super Mario Bros Disc", "Super Smash Bros Disc", "Mario Kart Disc", "Stardew Valley Disc", "Undertale Disc", "GTA V Disc"]]]

                    if(i === 0){
                        person1 = people[Math.floor(Math.random() * people.length)];
                        person2 = people[Math.floor(Math.random() * people.length)];
                        placeIndex = Math.floor(Math.random() * places.length);
                        item1 = places[placeIndex][1][Math.floor(Math.random() * places[placeIndex][1].length)];
                        item2 = places[placeIndex][1][Math.floor(Math.random() * places[placeIndex][1].length)];

                        newPara.innerHTML = person1 + " and " + person2 + " traveled to " + people[Math.floor(Math.random() * people.length)] + "'s " + places[placeIndex][0] + " and proceeded to purchase some items. " + person1 + " decided to buy " + firstTerm + " " + item1 + "s and " + secondTerm + " " + item2 + "s for a total of $" + operation(firstTerm * answer[0][1], secondTerm * answer[1][1], operator);
                    } else {
                        newPara.innerHTML = person2 + ", however, decided to purchase " + + firstTerm + " " + item1 + "s and " + secondTerm + " " + item2 + "s for a total of $" + operation(firstTerm * answer[0][1], secondTerm * answer[1][1], operator) + ". How much did the items cost?";
                    }

                } else {
                    let firstCompleteTerm;
                    let secondCompleteTerm;

                    if(firstTerm === 0) firstCompleteTerm = "0";
                    else if (firstTerm === 1) firstCompleteTerm = "x";
                    else firstCompleteTerm = firstTerm + "x";

                    if(secondTerm === 0) secondCompleteTerm = "";
                    else if (secondTerm === 1) secondCompleteTerm = " " + operatorList[operator] + " " + " y";
                    else secondCompleteTerm = " " + operatorList[operator] + " " + secondTerm + "y"

                    newPara.innerHTML = firstCompleteTerm + secondCompleteTerm + " = " + operation(firstTerm * answer[0][1], secondTerm * answer[1][1], operator);

                }

                newDiv.appendChild(newPara)
            }

            answer[0][0] = item1 + "'s Price";
            answer[1][0] = item2 + "'s Price"

        } else {
            answer = [["X-Value", Math.floor(Math.random() * 20)], ["Y-Value", Math.floor(Math.random() * 20)]];

            problemPara.innerHTML = "Please solve the following systems of equations to find the unknown variables. Please note that all variables are integers.";
            newDiv.appendChild(problemPara);

            for(let i = 0; i < 2; i++) {
                let firstTerm;
                let secondTerm;
                let operator;

                let termsSelected = false;

                while (!termsSelected) {
                    firstTerm = Math.floor(Math.random() * 20);
                    secondTerm = Math.floor(Math.random() * 20);
                    operator = Math.floor(Math.random() * 4);

                    if ((operator === 3 && (firstTerm * answer[0][1]) % (secondTerm * answer[1][1]) !== 0) || (operator === 2 && (firstTerm === 0 || secondTerm === 0)) || (operator === 3 && (secondTerm === 0 || answer[1][1] === 0 || firstTerm === 0))) {
                    } else termsSelected = true;
                }

                let newPara = document.createElement('p');

                let firstCompleteTerm;
                let secondCompleteTerm;

                if (firstTerm === 0) firstCompleteTerm = "0";
                else if (firstTerm === 1) firstCompleteTerm = "x";
                else firstCompleteTerm = firstTerm + "x";

                if (secondTerm === 0) secondCompleteTerm = "";
                else if (secondTerm === 1) secondCompleteTerm = " " + operatorList[operator] + " " + " y";
                else secondCompleteTerm = " " + operatorList[operator] + " " + secondTerm + "y"

                newPara.innerHTML = firstCompleteTerm + secondCompleteTerm + " = " + operation(firstTerm * answer[0][1], secondTerm * answer[1][1], operator);
                newDiv.appendChild(newPara)
            }
        }
    }

    return newDiv;
}

function submitAnswer(){
    let i = 0;
    let correct = true;

    document.querySelectorAll('.answer-input').forEach(function(element){
        if(element.value !== answer[i][1].toString()) correct = false;
        i++;
    })

    if(correct) {
        document.getElementById('correct').innerHTML = "Nice you got that right";
        randomProblem();
    }
    else document.getElementById('correct').innerHTML = "LOL BAD";

}

function randomProblem(){
    let parentContainer = document.getElementById('problem-container');

    while(parentContainer.firstChild){
        parentContainer.removeChild(parentContainer.firstChild);
    }

    parentContainer.appendChild(systemsOfEquations(2));

    for(let i = 0; i < answer.length; i++){
        let newInput = document.createElement('input');
        newInput.placeholder = answer[i][0];
        newInput.classList.add('answer-input');
        parentContainer.appendChild(newInput);
    }
}