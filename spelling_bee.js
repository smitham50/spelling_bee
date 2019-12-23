const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
const vowels = ['a', 'e', 'i', 'o', 'u'];
const textBox = document.querySelector('#text-box');
const foundList = document.querySelector('#found-words');
const scoreBoard = document.querySelector('#score');
const submit = document.querySelector('#submit');
const deleteButton = document.querySelector('#delete');
let validWords;
let foundWords = [];
let possiblePoints = 0;
let foundPoints = 0;

//start button
const start = document.querySelector('#start');
//hexes
const hexes = document.querySelectorAll('.hexagon');

//game start chooses letters from vowels and consonants and renders on hex grid
start.addEventListener('click', (e) => {
  //preserve copy of game letters for reference
  let gameLettersCopy = [];
  let center;

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
      if (!gameLetters.includes(consonants[idx])) {
        gameLetters.push(consonants[idx]);
        gameLettersCopy = [...gameLetters]
      } else {
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
        hex.innerText = gameLetters.pop();
      }
    })
  } //end start game event listener
  

  //get all words from github text file of SOWPODS word list
  Promise.all([
    fetch('https://raw.githubusercontent.com/jmlewis/valett/master/scrabble/sowpods.txt').then(x => x.text())
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
  let enteredWord = textBox.innerText;
  //if word is valid and hasn't already been found...
  if (!foundWords.includes(enteredWord) && validWords.includes(enteredWord.toUpperCase())) {
    foundList.innerHTML += `<li>${enteredWord}</li>`;
    foundWords.push(enteredWord);
    addPoints(enteredWord);
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

  //change submit button background on click
  e.target.id = 'submit-click';
  setTimeout(changeBackground, 100);
  function changeBackground() {
    e.target.id = 'submit';
  }

  //clear text box on submit
  function clearText() {
    textBox.innerText = "";
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
    if (word.length >= 8) possiblePoints += 5;
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
  if (word.length >= 8) pointValue = 5;
  foundPoints += pointValue;
  textBox.innerText = pointValue === 1 ? `${pointValue} pt!` : `${pointValue} pts!`
  scoreBoard.innerText = `${foundPoints} pts`;
}
  





