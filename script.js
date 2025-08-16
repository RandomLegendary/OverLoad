const levelContainer = document.getElementById('level-container')
const startButton = document.getElementById("start-button")
const resetButton = document.getElementById('reset-button')
const inputDifficultyBox = document.getElementById('difficulty-input')
const inputAmountOfCollumns = document.getElementById('amount-of-columns')
const inputAmountOfRows = document.getElementById('amount-of-rows')

let moves = 0

let amountOfNumbersAdded = 0
let maxMovesNumber = 0

let amountOfColumns = 0
let amountOfRows = 0

let fieldGeneral = []

const movesDone = document.createElement('p')
const maxMoves = document.createElement('p')

levelContainer.style.display = 'none'


function renderGame() { 

    amountOfColumns = parseInt(inputAmountOfCollumns.value);
    amountOfRows = parseInt(inputAmountOfRows.value);

    maxMovesNumber = parseInt(inputDifficultyBox.value);
    
    amountOfNumbersAdded =  inputDifficultyBox.value

    fieldGeneral = new Array(amountOfColumns * amountOfRows).fill(0);

    genLevel()

    moves = 0

    levelContainer.innerHTML = ''

    const nameOfLevelContainer = document.createElement('p')
    nameOfLevelContainer.innerHTML = `Overload`
    levelContainer.appendChild(nameOfLevelContainer)

    startButton.style.display = 'none'
    inputDifficultyBox.style.display = 'none'
    inputAmountOfCollumns.style.display = 'none'
    inputAmountOfRows.style.display = 'none'

    maxMoves.innerHTML = `Max Moves: ${maxMovesNumber}`
    levelContainer.appendChild(maxMoves)

    movesDone.innerHTML = `Moves Done: ${moves}`
    levelContainer.appendChild(movesDone)

    fieldGeneral.forEach((value, index) => {
        renderButton(value, index)
    })
}

startButton.addEventListener('click', () => {
    renderGame()
});


function renderButton(number, index) {
    const buttonFieldContainer = document.createElement('div');
    buttonFieldContainer.style.display = 'inline-block';
    buttonFieldContainer.style.margin = '5px';
    
    const reactorbutton = document.createElement('button');
    reactorbutton.innerHTML = `${number}`;
    reactorbutton.className = `${number}`;
    reactorbutton.classList.add('reactorfunction')

    reactorbutton.dataset.index = index;

    buttonFieldContainer.appendChild(reactorbutton);
    levelContainer.appendChild(buttonFieldContainer);

    if ((index + 1) % amountOfColumns === 0) {
        levelContainer.appendChild(document.createElement('br'));
    }

    levelContainer.style.display = 'inline-block';
}

levelContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('reactorfunction')) {
        calculateSurroundingReactors( e.target, e.target.dataset.index)
        moves ++
        checkCompleted()
        checkMoves()
        movesDone.innerHTML = `Moves Done: ${moves}`
    }
});

function calculateSurroundingReactors(button, buttonNumber) {
    buttonNumber = parseInt(buttonNumber)

    let buttonLeft = null
    let buttonRight = null
    let buttonAbove = null
    let buttonBelow = null

    if (buttonNumber === 0 || buttonNumber % amountOfColumns === 0) {
        buttonLeft = null
    } else {
        buttonLeft = document.querySelector(`.reactorfunction[data-index="${buttonNumber - 1}"]`);
    }
    
    if (buttonNumber === amountOfColumns * amountOfRows - 1 || (buttonNumber + 1) % amountOfColumns === 0) {
        buttonRight = null;
    } else {
        buttonRight = document.querySelector(`.reactorfunction[data-index="${buttonNumber + 1}"]`);
    }

    if (buttonNumber < amountOfColumns) {
        buttonAbove = null
    } else {
        buttonAbove = document.querySelector(`.reactorfunction[data-index="${buttonNumber - amountOfColumns}"]`);
    }

    if (buttonNumber >= amountOfColumns * (amountOfRows - 1)) {
        buttonBelow = null
    } else {
        buttonBelow = document.querySelector(`.reactorfunction[data-index="${buttonNumber + amountOfColumns}"]`);
    }


    if (button.classList.contains('0') === false) {
        if (button.innerHTML > 0) {
            button.innerHTML = `${button.innerHTML - 1}`
        }
        if (buttonAbove && buttonAbove.innerHTML > 0) {
            buttonAbove.innerHTML = `${buttonAbove.innerHTML - 1}`
        }
        if (buttonBelow && buttonBelow.innerHTML >  0) {
            buttonBelow.innerHTML = `${buttonBelow.innerHTML - 1}`
        }
        if (buttonLeft && buttonLeft.innerHTML >  0) {
            buttonLeft.innerHTML = `${buttonLeft.innerHTML - 1}`
        }
        if (buttonRight && buttonRight.innerHTML >  0) {
            buttonRight.innerHTML = `${buttonRight.innerHTML - 1}`
        }

        if (button.innerHTML === '0') {
            button.classList.add('0')


        }
    } else {
        button.innerHTML = '0'
    } 
}

function checkCompleted() {
    const buttonsInField = levelContainer.getElementsByTagName('button')
    let allZero = true;
    for (let i = 0; i < buttonsInField.length; i++) {
    if (buttonsInField[i].innerHTML !== "0") {
        allZero = false;
        break;
        }
    }
    if (allZero) {
        completedLevel()
    }
}

function completedLevel() {
    levelContainer.innerHTML = 'You solved the puzzle!' 
}

resetButton.addEventListener('click', reset)

function reset() {
    window.location.reload()
}

function checkMoves() {
    if (maxMovesNumber +1 === moves) {
        levelContainer.innerHTML = 'You did too much moves, try again!'
            tryAgainButton.style.display = 'block'
    }
}


function genLevel() {
    let operationsPerformed = 0;
    const maxOperations = maxMovesNumber;

    while (operationsPerformed < maxOperations) {
        let randomNumber = Math.floor(Math.random() * fieldGeneral.length);

        // Skip if center is already at max (9)
        if (fieldGeneral[randomNumber] >= 9) continue;

        // Check neighbors (skip if any neighbor is at max)
        if ((randomNumber % amountOfColumns !== 0 && fieldGeneral[randomNumber - 1] >= 9) || // left
            ((randomNumber + 1) % amountOfColumns !== 0 && fieldGeneral[randomNumber + 1] >= 9) || // right
            (randomNumber >= amountOfColumns && fieldGeneral[randomNumber - amountOfColumns] >= 9) || // above
            (randomNumber < fieldGeneral.length - amountOfColumns && fieldGeneral[randomNumber + amountOfColumns] >= 9) // below
        ) {
            continue;
        }

        // Increment center and valid neighbors
        fieldGeneral[randomNumber] += 1;
        if (randomNumber % amountOfColumns !== 0) fieldGeneral[randomNumber - 1] += 1; // left
        if ((randomNumber + 1) % amountOfColumns !== 0) fieldGeneral[randomNumber + 1] += 1; // right
        if (randomNumber >= amountOfColumns) fieldGeneral[randomNumber - amountOfColumns] += 1; // above
        if (randomNumber < fieldGeneral.length - amountOfColumns) fieldGeneral[randomNumber + amountOfColumns] += 1; // below

        operationsPerformed++;
    }
}

document.querySelector('.rules-button').addEventListener('click', function() {
    document.getElementById('rules-modal').style.display = 'block';
    document.getElementById('rules-overlay').style.display = 'block';
});

document.querySelector('.close-rules').addEventListener('click', function() {
    document.getElementById('rules-modal').style.display = 'none';
    document.getElementById('rules-overlay').style.display = 'none';
});

document.getElementById('rules-overlay').addEventListener('click', function() {
    document.getElementById('rules-modal').style.display = 'none';
    this.style.display = 'none';
});


// ------------ STYLE CHECKER ------------

// Function to check and style buttons based on their value
function styleNumberButtons() {
    const buttons = document.querySelectorAll('.reactorfunction');
    buttons.forEach(button => {
        // Remove all number classes first
        for (let i = 0; i <= 10; i++) {
            button.classList.remove(i.toString());
        }
        
        // Get the numeric value (handles cases where there might be whitespace)
        const value = parseInt(button.textContent.trim());
        
        // Add the appropriate class if the value is between 0-10
        if (!isNaN(value) && value >= 0 && value <= 10) {
            button.classList.add(value.toString());
        }
    });
}

// Run the check initially
styleNumberButtons();

// Set up periodic checking (every 500ms)
setInterval(styleNumberButtons, 500);

// Optional: Also check whenever a button is clicked
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('reactorfunction')) {
        // Small delay to allow the innerHTML to update first
        setTimeout(styleNumberButtons, 50);
    }
});