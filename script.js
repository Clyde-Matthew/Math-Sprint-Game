// Pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
const btnRight = document.querySelector(".btn-right");
const btnWrong = document.querySelector(".btn-wrong");
// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");
const selectedItem = document.querySelector(".selected-item");
// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoresArray = [];
// let countdownNumbers = ["3","2","1","Go!"]; - my thinking for .6 solution
// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];
let equationValue = 0;

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0";

// Scroll
let valueY = 0;

// 18.refresh splash page and best scores
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    const betScoreEl = bestScore;
    betScoreEl.textContent = ` ${bestScoresArray[index].bestScore}`;
  });
}
// 17.check local storage for best scores, set our best scores array values
function getSavedBestScores() {
  if (localStorage.getItem("bestScores")) {
    bestScoresArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoresArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem("bestScores", JSON.stringify(bestScoresArray));
  }
  bestScoresToDOM();
}

// 19.function to update the best scores array
function updateBestScores() {
  bestScoresArray.forEach((score, index) => {
    // select correct best score to update
    if (questionAmount == score.questions) {
      // return best score as a number with one decimal place
      const saveBestScore = parseInt(bestScoresArray[index].bestScore);
      console.log(saveBestScore);
      // update if the new final score is less or replacing zero
      if (saveBestScore == 0 || saveBestScore > finalTime) {
        bestScoresArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // update splash page
  bestScoresToDOM();
  // save to local storage
  localStorage.setItem("bestScores", JSON.stringify(bestScoresArray));
}
// 16. play again button
function playAgain() {
  gamePage.addEventListener("click", startTimer);
  scorePage.setAttribute("hidden", true);
  splashPage.removeAttribute("hidden");
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  // itemContainer.textContent = '';
  // timePlayed = 0;
  // baseTime = 0;
  // penaltyTime = 0;
  // finalTime = 0;
  // finalTimeDisplayed = '0.0s'
  playAgainBtn.setAttribute("hidden", true);
}

// 15. function to display the score page
function showScorePage() {
  gamePage.setAttribute("hidden", true);
  scorePage.removeAttribute("hidden");
  setTimeout(() => {
    playAgainBtn.removeAttribute("hidden");
  }, 1000);
}

// 14. format and display time in DOM
function scoresToDOM() {
  finalTimeDisplay = `${finalTime.toFixed(1)}s`;
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty Time: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}`;
  updateBestScores();
  // scroll to top , go to score page
  itemContainer.scrollTo({ top: 0, behavior: "instant" });
  showScorePage();
}
// 13. stop time and process the results, go to score page
function checkTime() {
  if (playerGuessArray.length == questionAmount) {
    // console.log(playerGuessArray);
    clearInterval(timer);
    //check for wrong guesses and add penalty time
    // instructors method
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // correct guess, no penalty
      } else {
        // incorrect guess, add penalty time
        penaltyTime += 0.5;
      }
    });

    finalTime = timePlayed + penaltyTime;
    console.log("time", timePlayed, "penalty", penaltyTime, "final", finalTime);
    scoresToDOM();
    // my idea
    // playerGuessArray.forEach((guess,i) => {
    //   if(guess != equationsArray[i].evaluated){
    //     penaltyTime += 0.5;
    //   }
    // });
  }
}

// 12.add a tenth of a second to timePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// 11.start timer when game page is clicked
function startTimer() {
  // reset times  - this is a new game
  timePlayed = 0;
  baseTime = 0;
  penaltyTime = 0;
  finalTime = 0;
  finalTimeDisplayed = "0.0";

  // start timer
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
}

// 10.scroll, store user selection in playerGuessArray
function select(guessedTrue) {
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // add player guess to array
  return guessedTrue
    ? playerGuessArray.push("true")
    : playerGuessArray.push("false");
}

// 9. function to display the game page
function showGamePage() {
  countdownPage.setAttribute("hidden", true);
  gamePage.removeAttribute("hidden");
}

// 7.get random number up to a max number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: "true" };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }
  // // Shuffle the array - my way of shuffling the array (not correct - flawed/ only good for small arrays)
  // equationsArray.sort(() => Math.random() - 0.5);

  // // Shuffle the array - instructors way of shuffling the array - proper way fisher/yates method
  shuffle(equationsArray);
}
// 8. equations to DOM
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    //  item
    const item = document.createElement("div");
    item.classList.add("item");
    // Equation text
    const equationText = document.createElement("h1");
    equationText.textContent = equation.value;
    // append
    item.appendChild(equationText);
    // append to container
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = "";
  // Spacer
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("height-240");
  // Selected Item
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();
  // Set Blank Space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}

// 6.create a function to change countdown from 3,2,1,0 to GO!

// refactoring below countdown function - best way - use set interval

function countdownStart() {
  // set countdown to 3
  let count = 3;
 countdown.textContent = count;
  // set interval to countdown
  const timeCountDown = setInterval(() => {
    count--;
   if(count === 0){
     countdown.textContent = "GO!";
   }else if (count === -1) {
     showGamePage();
      clearInterval(timeCountDown);
    } else {
      countdown.textContent = count;
    }

   }, 1000);
}


// instructors method
// function countdownStart() {
//   countdown.textContent = "3";
//   setTimeout(() => {
//     countdown.textContent = "2";
//   }, 1000);
//   setTimeout(() => {
//     countdown.textContent = "1";
//   }, 2000);
//   setTimeout(() => {
//     countdown.textContent = "GO!";
//   }, 3000);
// }

// another method
// function countdownStart(){
//   countdown.textContent = "3";
//   setTimeout(() => {
//     countdown.textContent = "2";
//     setTimeout(() => {
//       countdown.textContent = "1";
//       setTimeout(() => {
//         countdown.textContent = "GO!";
//         setTimeout(() => {
//           showGamePage();
//         }, 1000);
//       }, 1000);
//     }, 1000);
//   }, 1000);

// }

// my thinking
// function countdownStart(){
//   countdownNumbers.forEach((number, index) => {
//     setTimeout(() => {
//       countdown.textContent = number;
//     }, 1000 * index + 1);
//   });

// }

// 5.Navigate from splash page to countdown page
// instructors method
function showCountdown() {
  splashPage.hidden = true;
  countdownPage.hidden = false;
  countdownStart();

  setTimeout(populateGamePage, 4000);
  
}

// my thinking -i just added the condition to make sure the user selects a question amount in the showCountdown function whereas the instructor put the condition in the showQuestion function
// function showCountdown(){
//     if(questionAmount){
// splashPage.setAttribute('hidden', true);
//   countdownPage.removeAttribute('hidden');
// }else return;
// }

// 4.get the value from selected radio button
function getRadioValue() {
  let radioValue = "";
  radioInputs.forEach((input) => {
    if (input.checked) {
      radioValue = input.value;
    }
  });
  return radioValue;
}

// 3.instructors method
function selectQuestionAmount(e) {
  e.preventDefault();
  // Get value of radio button
  questionAmount = getRadioValue();
  if (questionAmount) {
    showCountdown();
  }
}

// my way of doing it - i dont create a function to to get the amount of questions submitted - i run a querySelector on the targeted input and get the value
// 3. form that decides amount of questions
// function selectQuestionAmount(e){
//   e.preventDefault();
//   // Get value of radio button
//   const selectedValue = this.querySelector('input:checked').value;
//   // Set amount of questions
//   questionAmount = selectedValue;
//   console.log(questionAmount);

// }

// 1. Event Listeners
startForm.addEventListener("click", (e) => {
  // console.log(e.target);
  radioContainers.forEach((radioEl) => {
    // remove selected label styling
    radioEl.classList.remove("selected-label");
    // add selected label styling back if clicked

    // my thinking:
    // if (e.target.value === radioEl.querySelector('input').value) {
    //   radioEl.classList.add('selected-label');
    // }
    // });

    // another method:
    // if (radioEl.contains(e.target)) {
    //   radioEl.classList.add('selected-label');
    // }
    // });

    // instructors method:
    if (radioEl.children[1].checked) {
      radioEl.classList.add("selected-label");
    }
  });
});

// 2. to select the correct Question Amount (which radio button is selected)
startForm.addEventListener("submit", selectQuestionAmount);
gamePage.addEventListener("click", startTimer);

// on load
getSavedBestScores();
