const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
const vowels = ['a', 'e', 'i', 'o', 'u'];
const textBox = document.querySelector('#text-box');
let validWords;

//start button
const start = document.querySelector('#start');
//hexes
const hexes = document.querySelectorAll('.hexagon');

//game start chooses letters from vowels and consonants and renders on hex grid
start.addEventListener('click', (e) => {
  let gameLettersCopy = [];
  let center;

  //click visualizer
  e.target.id = 'start-click';
  setTimeout(changeBackground, 100);

  function changeBackground() {
    e.target.id = 'start';
  }
  
  //clear text box
  textBox.innerText = "";

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
  }
  

  //get all words
  Promise.all([
    fetch('https://raw.githubusercontent.com/jmlewis/valett/master/scrabble/sowpods.txt').then(x => x.text())
  ]).then(([sampleResp]) => {
    pickLetters();
    getWords(sampleResp);
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

//append found words list on successful word entry
const foundList = document.querySelector('#found-words');
const submit = document.querySelector('#submit');

submit.addEventListener('click', (e) => {
  if (validWords.includes(textBox.innerText.toUpperCase())) {
    foundList.innerHTML += `<li>${textBox.innerText}</li>`;
  }
  e.target.id = 'submit-click';
  setTimeout(changeBackground, 100);

  function changeBackground() {
    e.target.id = 'submit';
  }

  textBox.innerText = "";
})
  





