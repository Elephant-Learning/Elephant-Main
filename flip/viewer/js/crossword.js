function fixTermArray(arr) {
    // Characters to be removed
    const charactersToRemove = ['-',' ', '+', ",","."]; // List can be replaced

    // Iterate through the array of objects
    for(let i = 0; i < arr.length; i++) {
        let term = arr[i].term;

        // Iterate through the characters to be removed
        for(let j = 0; j < charactersToRemove.length; j++) {
            const char = charactersToRemove[j];

            // Replace all occurrences of the character
            term = term.split(char).join('');
        }

        // Update term in the original object
        arr[i].term = term;
    }

    // Returns the array with updated terms
    return arr;
}

function findCoordinates(arr) {
    let eligibleElements = [];

    // Iterate through the array to find elements with .letter not equal to false
    for(let i = 0; i < arr.length; i++) {
        for(let j = 0; j < arr[i].length; j++) {
            if(arr[i][j].letter !== false) {
                eligibleElements.push([i, j]);
            }
        }
    }

    // If there are no eligible elements, return null
    if (eligibleElements.length === 0) {
        return null;
    }

    // Return random element from eligibleElements
    let randomElementIndex = Math.floor(Math.random() * eligibleElements.length);
    return eligibleElements[randomElementIndex];
}

function createCrossword(){

    let crosswordDeck = [];

    for(let i = 0; i < deck.length; i++){
        crosswordDeck.push({
            term:deck[i].term,
            definitions:deck[i].definitions
        });
    }

    crosswordDeck = sortArrayByTermLength(crosswordDeck);
    console.log(crosswordDeck);
    crosswordDeck = fixTermArray(crosswordDeck);
    console.log(crosswordDeck);

    let crosswordArray = [];

    removeAllChildNodes(document.getElementById("crossword-container"))
    removeAllChildNodes(document.querySelectorAll(".crossword-clues-container")[0])
    removeAllChildNodes(document.querySelectorAll(".crossword-clues-container")[1])

    for(let i = 0; i < crosswordDeck[crosswordDeck.length - 1].term.length; i++){
        let row = [];
        let newRow = document.createElement("tr");

        for(let j = 0; j < crosswordDeck[crosswordDeck.length - 1].term.length; j++){
            row.push({
                letter:false,
                direction:false,
            });

            let newNode = document.createElement("td");

            newNode.id = `crossword-node-${i * crosswordDeck[crosswordDeck.length - 1].term.length + j}`;

            newRow.appendChild(newNode);
        }

        crosswordArray.push(row);
        document.getElementById("crossword-container").appendChild(newRow);
    }

    let randomYValue = Math.floor(Math.random() * crosswordArray.length);
    let number = 1;

    for(let i = 0; i < crosswordArray.length; i++){
        if(i === 0){
            let header = document.createElement("h1");
            let para = document.createElement("p");

            para.innerHTML = `${number}. ${crosswordDeck[crosswordDeck.length - 1].definitions.join(', ')}`
            header.innerHTML = `${number}.`;

            document.getElementById(`crossword-node-${randomYValue * crosswordArray.length}`).appendChild(header);
            document.querySelectorAll(".crossword-clues-container")[0].appendChild(para);
        }

        let nodeInput = document.createElement("input");

        nodeInput.maxLength = 1;
        nodeInput.id = `crossword-input-${randomYValue * crosswordDeck[crosswordDeck.length - 1].term.length + i}`;

        nodeInput.addEventListener("keydown", function(e){
            if(nodeInput.value.length > 0 && e.keyCode >= 33 && e.keyCode <= 126) document.getElementById(`crossword-input-${(parseInt(nodeInput.id.split("-")[2]) + 1).toString()}`).focus();
        })

        document.getElementById(`crossword-node-${randomYValue * crosswordDeck[crosswordDeck.length - 1].term.length + i}`).appendChild(nodeInput);

        crosswordArray[randomYValue][i].letter = crosswordDeck[crosswordDeck.length - 1].term[i];
        crosswordArray[randomYValue][i].direction = 0;

        //0 = left to right
        //1 = up and down
        //2 = intersection
    }

    number++;
    crosswordDeck.splice(crosswordDeck.length - 1, 1);
    crosswordDeck = shuffleArray(crosswordDeck);

    let crosswordArrayComplete = false;
    let iterations = 0;

    while(!crosswordArrayComplete){
        const randomValue = findCoordinates(crosswordArray)

        let randomX = randomValue[1];
        let randomY = randomValue[0];

        if(crosswordArray[randomY][randomX].letter !== false){
            let word;
            let index;

            for(let i = 0; i < crosswordDeck.length; i++){
                if(crosswordDeck[i].term.indexOf(crosswordArray[randomY][randomX].letter) !== -1){
                    word = crosswordDeck[i].term;
                    index = i;
                    break;
                }
            }

            let testsPassed = true;

            if(word !== undefined){
                //Time to test direction
                if(crosswordArray[randomY][randomX].direction === 0){
                    for(let i = 0; i < word.length; i++){
                        if(i !== word.indexOf(crosswordArray[randomY][randomX].letter)){
                            try{
                                if(crosswordArray[randomY + i - word.indexOf(crosswordArray[randomY][randomX].letter)][randomX].letter !== false && crosswordArray[randomY + i - word.indexOf(crosswordArray[randomY][randomX].letter)][randomX].letter !== word.charAt(i)) testsPassed = false;
                            } catch(e){
                                testsPassed = false;
                            }
                        }
                    }
                } else if(crosswordArray[randomY][randomX].direction === 1){
                    for(let i = 0; i < word.length; i++){
                        if(i !== word.indexOf(crosswordArray[randomY][randomX].letter)){
                            try{
                                if(crosswordArray[randomY][randomX + i - word.indexOf(crosswordArray[randomY][randomX].letter)].letter !== false && crosswordArray[randomY][randomX + i - word.indexOf(crosswordArray[randomY][randomX].letter)].letter !== word.charAt(i)) testsPassed = false;
                            } catch(e){
                                testsPassed = false;
                            }
                        }
                    }
                } else testsPassed = false;
            } else testsPassed = false;

            if(testsPassed){
                if(crosswordArray[randomY][randomX].direction === 0){
                    for(let i = 0; i < word.length; i++){
                        if(i === 0){
                            let header = document.createElement("h1");
                            let para = document.createElement("p");

                            para.innerHTML = `${number}. ${crosswordDeck[index].definitions.join(', ')}`
                            header.innerHTML = `${number}.`;

                            document.getElementById(`crossword-node-${(randomY + i - word.indexOf(crosswordArray[randomY][randomX].letter)) * crosswordArray.length + randomX}`).appendChild(header);
                            document.querySelectorAll(".crossword-clues-container")[1].appendChild(para);
                        }

                        if(i !== word.indexOf(crosswordArray[randomY][randomX].letter)){
                            let nodeInput = document.createElement("input");

                            nodeInput.maxLength = 1;
                            nodeInput.id = `crossword-input-${(randomY + i - word.indexOf(crosswordArray[randomY][randomX].letter)) * crosswordArray.length + randomX}`;

                            nodeInput.addEventListener("keydown", function(e){
                                if(nodeInput.value.length > 0 && e.keyCode >= 33 && e.keyCode <= 126) document.getElementById(`crossword-input-${(parseInt(nodeInput.id.split("-")[2]) + crosswordArray.length).toString()}`).focus();
                            })

                            document.getElementById(`crossword-node-${(randomY + i - word.indexOf(crosswordArray[randomY][randomX].letter)) * crosswordArray.length + randomX}`).appendChild(nodeInput);
                            crosswordArray[randomY + i - word.indexOf(crosswordArray[randomY][randomX].letter)][randomX].letter = word.charAt(i);
                            crosswordArray[randomY + i - word.indexOf(crosswordArray[randomY][randomX].letter)][randomX].direction = 1;
                        } else crosswordArray[randomY][randomX].direction = 2;
                    }
                } else if(crosswordArray[randomY][randomX].direction === 1){
                    for(let i = 0; i < word.length; i++){
                        if(i === 0){
                            let header = document.createElement("h1");
                            let para = document.createElement("p");

                            para.innerHTML = `${number}. ${crosswordDeck[index].definitions.join(', ')}`
                            header.innerHTML = `${number}.`;

                            document.getElementById(`crossword-node-${randomY * crosswordArray.length + randomX + i - word.indexOf(crosswordArray[randomY][randomX].letter)}`).appendChild(header);
                            document.querySelectorAll(".crossword-clues-container")[0].appendChild(para);
                        }

                        if(i !== word.indexOf(crosswordArray[randomY][randomX].letter)){
                            let nodeInput = document.createElement("input");

                            nodeInput.maxLength = 1;
                            nodeInput.id = `crossword-input-${randomY * crosswordArray.length + randomX + i - word.indexOf(crosswordArray[randomY][randomX].letter)}`;

                            nodeInput.addEventListener("keydown", function(e){
                                if(nodeInput.value.length > 0 && e.keyCode >= 33 && e.keyCode <= 126) document.getElementById(`crossword-input-${(parseInt(nodeInput.id.split("-")[2]) + 1).toString()}`).focus();
                            })

                            document.getElementById(`crossword-node-${randomY * crosswordArray.length + randomX + i - word.indexOf(crosswordArray[randomY][randomX].letter)}`).appendChild(nodeInput);
                            crosswordArray[randomY][randomX + i - word.indexOf(crosswordArray[randomY][randomX].letter)].letter = word.charAt(i);
                            crosswordArray[randomY][randomX + i - word.indexOf(crosswordArray[randomY][randomX].letter)].direction = 0;
                        } else crosswordArray[randomY][randomX].direction = 2;
                    }
                }

                crosswordDeck.splice(index, 1);
                number++;
            }
        }

        iterations++;
        if(crosswordDeck.length === 0 || iterations > 250) crosswordArrayComplete = true;
    }
}

function sortArrayByTermLength(arr) {
    return arr.sort((a, b) => a.term.length - b.term.length);
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}