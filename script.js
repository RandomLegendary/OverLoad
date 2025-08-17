const levelContainer = document.getElementById('level-container')
const startButton = document.getElementById("start-button")
const resetButton = document.getElementById('reset-button')
const inputDifficultyBox = document.getElementById('difficulty-input')
const inputAmountOfCollumns = document.getElementById('amount-of-columns')
const inputAmountOfRows = document.getElementById('amount-of-rows')

let stat_clicksMade = parseInt(localStorage.getItem('stat_clicksMade')) || 0;
let stat_gamesWon = parseInt(localStorage.getItem('stat_gamesWon')) || 0;
let stat_gamesLost = parseInt(localStorage.getItem('stat_gamesLost')) || 0;
let stat_totalTimeSpentMn = parseInt(localStorage.getItem('stat_totalTimeSpentMn')) || 0;
let stat_totalTimeSpentMnAfterComma = parseInt(localStorage.getItem('stat_totalTimeSpentMnAfterComma')) || 0;

if (!localStorage.getItem('stat_clicksMade')) {
    localStorage.setItem('stat_clicksMade', stat_clicksMade);
}
if (!localStorage.getItem('stat_gamesWon')) {
    localStorage.setItem('stat_gamesWon', stat_gamesWon);
}
if (!localStorage.getItem('stat_gamesLost')) {
    localStorage.setItem('stat_gamesLost', stat_gamesLost);
}
if (!localStorage.getItem('stat_totalTimeSpentMn')) {
    localStorage.setItem('stat_totalTimeSpentMn', stat_totalTimeSpentMn);
}
if (!localStorage.getItem('stat_totalTimeSpentMnAfterComma')) {
    localStorage.setItem('stat_totalTimeSpentMnAfterComma', stat_totalTimeSpentMnAfterComma)
}

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
    startTimer()
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
        stat_clicksMade ++ 
        localStorage.setItem("stat_clicksMade", stat_clicksMade)
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
    pauseTimer()
    stat_gamesWon ++
    localStorage.setItem('stat_gamesWon', stat_gamesWon)
}

resetButton.addEventListener('click', reset)

function reset() {
    resetTimer()
    window.location.reload()
}

function checkMoves() {
    if (maxMovesNumber +1 === moves) {
        levelContainer.innerHTML = 'You did too much moves, try again!'
        localStorage.setItem('stat_gamesLost', stat_gamesLost)
        stat_gamesLost ++
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

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.rules-button').addEventListener('click', function() {
        document.getElementById('rules-modal').style.display = 'block';
        document.getElementById('rules-overlay').style.display = 'block';
    });

    document.getElementById('close-rules').addEventListener('click', function() {
        document.getElementById('rules-modal').style.display = 'none';
        document.getElementById('rules-overlay').style.display = 'none';
    });

    document.getElementById('rules-overlay').addEventListener('click', function() {
        document.getElementById('rules-modal').style.display = 'none';
        this.style.display = 'none';
    });


    document.querySelector('.stats-button').addEventListener('click', function() {

        let wholeMinutes = parseInt(localStorage.getItem('stat_totalTimeSpentMn') || 0);
        let fraction = parseFloat(localStorage.getItem('stat_totalTimeSpentMnAfterComma') || 0);
        let totalMinutes = wholeMinutes + fraction;

        document.getElementById('stats-modal').style.display = 'block';
        document.getElementById('stats-overlay').style.display = 'block';
        document.getElementById('stat-text').innerHTML = `
            <h3>Statistics:</h3>
            <p>Clicks Made: ${localStorage.getItem('stat_clicksMade')}</p>
            <p>Games Won: ${localStorage.getItem('stat_gamesWon')}</p>
            <p>Games Lost: ${localStorage.getItem('stat_gamesLost')}</p>
            <p>Total Time Spent Ingame: ${totalMinutes.toFixed(1)}</p>
        `
    });

    document.getElementById('close-stats').addEventListener('click', function() {
        document.getElementById('stats-modal').style.display = 'none';
        document.getElementById('stats-overlay').style.display = 'none';
    });

    document.getElementById('stats-overlay').addEventListener('click', function() {
        document.getElementById('stats-modal').style.display = 'none';
        this.style.display = 'none';
    });
});


// ------------ STOPWATCH ------------
let hour = 0;
let minute = 0;
let second = 0;
let count = 0;
let fractionalPart = 0;
let timer = false

function startTimer() {
    timer = true;
    stopWatch();
}

function pauseTimer() {
    timer = false
    localStorage.setItem("stat_totalTimeSpentMn", minute)
    localStorage.setItem('stat_totalTimeSpentMnAfterComma', fractionalPart)
}

function resetTimer() {
    timer = false;
    localStorage.setItem("stat_totalTimeSpentMn", minute)
    localStorage.setItem('stat_totalTimeSpentMnAfterComma', fractionalPart)
    hour = 0;
    minute = 0;
    second = 0;
    count = 0;
    document.getElementById('hr').innerHTML = "00";
    document.getElementById('min').innerHTML = "00";
    document.getElementById('sec').innerHTML = "00";
    document.getElementById('count').innerHTML = "00";
}
   

function stopWatch() {
    if (timer) {
        count++;

        if (count == 100) {
            second++;
            count = 0;
        }

        if (second == 60) {
            minute++;
            second = 0;
        }

        if (minute == 60) {
            hour++;
            minute = 0;
            second = 0;
        }

        fractionalPart = second / 60;

        let hrString = hour;
        let minString = minute;
        let secString = second;
        let countString = count;

        if (hour < 10) {
            hrString = "0" + hrString;
        }

        if (minute < 10) {
            minString = "0" + minString;
        }

        if (second < 10) {
            secString = "0" + secString;
        }

        if (count < 10) {
            countString = "0" + countString;
        }

        document.getElementById('hr').innerHTML = hrString;
        document.getElementById('min').innerHTML = minString;
        document.getElementById('sec').innerHTML = secString;
        document.getElementById('count').innerHTML = countString;
        setTimeout(stopWatch, 10);
    }
}




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

// Run the check ini
// tially
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