const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
const vowels = ['a', 'e', 'i', 'o', 'u'];
const hardLetters = ['c', 'j', 'k', 'q', 'v', 'w', 'x', 'y', 'z'];
const textBox = document.querySelector('#text-box');
const foundList = document.querySelector('#found-words');
const scoreBoard = document.querySelector('#score');
const progressDiv = document.querySelector('#progress');
const submit = document.querySelector('#submit');
const deleteButton = document.querySelector('#delete');
let validWords;
let foundWords = [];
let possiblePoints = 0;
let foundPoints = 0;
let progress;
let center;
let anyHard = false;

//start button
const start = document.querySelector('#start');
//hexes
const hexes = document.querySelectorAll('.hexagon');
//text content of all hexes but center
let hexVals = [];

//game start chooses letters from vowels and consonants and renders on hex grid
start.addEventListener('click', (e) => {
  //preserve copy of game letters for reference
  let gameLettersCopy = [];

  //click visualizer
  e.target.id = 'start-click';
  setTimeout(changeBackground, 100);
  function changeBackground() {
    e.target.id = 'start';
  }
  
  //clear text box on start
  textBox.innerText = "";
  //clear found list on start
  foundList.innerHTML = "";
  //clear found words array on start
  foundWords = [];
  //reset possible points
  possiblePoints = 0;
  //reset found points
  foundPoints = 0;
  //reset scoreBoard
  scoreBoard.innerText = `${foundPoints} pts`;
  //reset progress
  progress = 0;
  //reset progressDiv
  progressDiv.innerText = "";
  //reset hexVals
  hexVals = [];
  //reset anyHard
  anyHard = false;

  //pick letter function is called after response from fetching words from github text file
  function pickLetters() {
    let gameLetters = [];
    //call pickVowels function twice to add two unique vowels to gameLetters array
    for (let i = 0; i < 2; i++) {
      pickVowels();
    }
    //pickVowels function recurses until it finds a vowel that isn't already in gameLetters array
    function pickVowels() {
      let idx = Math.floor(Math.random() * 5)
      if (!gameLetters.includes(vowels[idx])) {
        gameLetters.push(vowels[idx]);
        gameLettersCopy = [...gameLetters]
      } else {
        pickVowels();
      }
    }
    //call pickConsonants five times to add five unique consonants to gameLetters array
    for (let i = 0; i < 5; i++) {
      pickConsonants();
    }
    //pickConsonants recurses until it finds a consonant that isn't already in gameLetters array
    function pickConsonants() {
      let idx = Math.floor(Math.random() * 20);
      let letter = consonants[idx];
      //if letter isn't already on the board
      if (!gameLetters.includes(letter)) {
        //if letter is a hard letter
        if (hardLetters.includes(letter)) {
          //if there is already a hard letter on the board, pick again
          if (anyHard) {
            pickConsonants();
          } 
          //otherwise set anyHard to true and put letter on the board
          else {
            anyHard = true;
            gameLetters.push(letter);
            gameLettersCopy = [...gameLetters]
          }
        } 
        //if letter isn't a hard letter and it isn't already on the board, put it on the board
        else {
          gameLetters.push(letter);
          gameLettersCopy = [...gameLetters]
        }
      } 
      //if letter is already on the board, pick again
      else {
        pickConsonants();
      }
    }

    //print game letters in hexes
    center = gameLetters.shift();
    hexes.forEach(hex => {
      if (hex.id === 'hidden1' || hex.id === 'hidden2') {
        null;
      } else if (hex.id === 'center') {
        hex.innerText = center;
      } else {
        let letter = gameLetters.pop()
        hex.innerText = letter;
        //keep track of values of all hexes except center for shuffle function
        hexVals.push(letter);
      }
    })
  } //end start game event listener
  

  //get all words from github text file of SOWPODS word list
  Promise.all([
    fetch('https://raw.githubusercontent.com/jmlewis/valett/master/scrabble/sowpods.txt').then(resp => resp.text())
  ]).then(([sampleResp]) => {
    pickLetters();
    getWords(sampleResp);
    calculatePoints();
  });

  //filter invalid words
  function getWords(words) {
    words = words.split('\n').map(word => word.trim());
    validWords = words.filter(word => {
      return word.length >= 4 && word.includes(center.toUpperCase()) && !!!word.split('').find(char => {
          return !gameLettersCopy.includes(char.toLowerCase());
      })
    })
    console.log(validWords);
  };
}) //end of start event listener

//add click event listener to hexes, clicked hexes add text to text box
hexes.forEach(hex => {
  hex.addEventListener('click', (e) => {
    textBox.innerText += `${e.target.innerText}`
    e.target.className = 'clicked';
    setTimeout(changeBackground, 100);

    function changeBackground() {
      e.target.className = 'hexagon';
    }
  })
}) //end of hex click event listener

//delete button event listener
deleteButton.addEventListener('click', (e) => {
  textBox.innerText = textBox.innerText.slice(0, -1);
  e.target.id = 'delete-click';
  setTimeout(changeBackground, 100);
  function changeBackground() {
    e.target.id = 'delete';
  }
})

//append found words list on successful word entry
submit.addEventListener('click', (e) => {
  submitWord();
  //change submit button background on click
  e.target.id = 'submit-click';
  setTimeout(changeBackground, 100);
  function changeBackground() {
    e.target.id = 'submit';
  }
}) //end word submit event listener

//calculate possible points for round
function calculatePoints() {
  validWords.forEach(word => {
    //1 point for 4 letters
    if (word.length === 4) possiblePoints += 1;
    //2 points for 5 letters
    if (word.length === 5) possiblePoints += 2;
    //3 points for 6 letters
    if (word.length === 6) possiblePoints += 3;
    //4 points for 7 letters
    if (word.length === 7) possiblePoints += 4;
    //5 points for 8 or more letters
    if (word.length >= 8) possiblePoints += (word.length - 4) + 1;
  })
  console.log("POSSIBLE POINTS", possiblePoints)
}

//add points to player score on word entry
function addPoints(word) {
  let pointValue;
  //1 point for 4 letters
  if (word.length === 4) pointValue = 1;
  //2 points for 5 letters
  if (word.length === 5) pointValue = 2;
  //3 points for 6 letters
  if (word.length === 6) pointValue = 3;
  //4 points for 7 letters
  if (word.length === 7) pointValue = 4;
  //5 points for 8 or more letters
  if (word.length >= 8) pointValue = (word.length - 4) + 1;
  foundPoints += pointValue;
  textBox.innerText = pointValue === 1 ? `${pointValue} pt!` : `${pointValue} pts!`
  scoreBoard.innerText = `${foundPoints} pts`;
}

//calculate percentage of words found and render progress
function calcPercentage() {
  let progress = foundPoints / possiblePoints;
  if (progress > .00 && progress <= .06) progressDiv.innerText = "Beginner";
  if (progress > .06 && progress <= .15) progressDiv.innerText = "Warming Up!";
  if (progress > .15 && progress <= .24) progressDiv.innerText = "Solid!";
  if (progress > .24 && progress <= .33) progressDiv.innerText = "Great!";
  if (progress > .33 && progress <= .42) progressDiv.innerText = "Outstanding!";
  if (progress > .42 && progress <= .51) progressDiv.innerText = "Masterful!";
  if (progress > .51) progressDiv.innerText = "Cheating!";
}

//shuffle hexes
function shuffle() {
  let pop = true;
  let newVals = [];
  hexes.forEach(hex => {
    if (!hex.id) {
      let letter = pop ? hexVals.pop() : hexVals.shift();
      pop = !pop;
      newVals.push(letter);
      hex.innerText = letter;
    }
  })
  hexVals = [...newVals];
}

//shuffle button and event listener
const shuffleButton = document.querySelector('#shuffle');

shuffleButton.addEventListener('click', (e) => {
  hexVals.length > 0 ? shuffle() : null;
  e.target.id = 'shuffle-click';
  setTimeout(changeBackground, 100);
  function changeBackground() {
    e.target.id = 'shuffle';
  }
})

//add event listener for typing
document.addEventListener('keydown', (e) => {
  if (consonants.includes(e.key) || vowels.includes(e.key)) textBox.innerText += e.key;
  if (e.key === "Backspace") textBox.innerText = textBox.innerText.slice(0, -1);
  if (e.key === "Enter") {
    submitWord();
  }
})

//submits word in text box and checks validity
function submitWord() {
  let enteredWord = textBox.innerText;
  //if word is valid and hasn't already been found...
  if (!foundWords.includes(enteredWord) && validWords.includes(enteredWord.toUpperCase())) {
    foundList.innerHTML += `<li>${enteredWord}</li>`;
    foundWords.push(enteredWord);
    addPoints(enteredWord);
    calcPercentage();
    setTimeout(clearText, 550);
  } else if (!enteredWord.includes(center)) {
    textBox.innerText = "Must use center letter!";
    setTimeout(clearText, 550);
  } else {
    //if word has already been entered...
    if (foundWords.includes(enteredWord)) {
      textBox.innerText = "Already found!";
      setTimeout(clearText, 550);
    }
    //if word isn't valid...
    else {
      textBox.innerText = "Invalid word!";
      setTimeout(clearText, 550);
    }
  }
  function clearText() {
    textBox.innerText = "";
  }
}



