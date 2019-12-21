const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
const vowels = ['a', 'e', 'i', 'o', 'u'];

//start button
const start = document.querySelector('button');
//hexes
const hexes = document.querySelectorAll('.hexagon');

//game start chooses letters from vowels and consonants and renders on hex grid
start.addEventListener('click', () => {
  let gameLettersCopy = [];
  let validWords;
  let center;

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
        hex.innerHTML = `<div>${center}</div>`;
      } else {
        hex.innerHTML = `<div>${gameLetters.pop()}</div>`;
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
    words = words.split('\n').filter(word => word.length >= 5);
    validWords = words.filter(word => {
      return word.includes(center.toUpperCase()) && !!!word.split('').find(char => {
        if (/^[a-z]+$/i.test(char)) {
          return !gameLettersCopy.includes(char.toLowerCase());
        };
      })
    })
    console.log(validWords);
  };
  
}) //end of start event listener

//add click event listener to hexes
hexes.forEach(hex => {
  hex.addEventListener('click', (e) => {
    e.target.className = 'clicked';
    setTimeout(changeBackground, 100);

    function changeBackground() {
      e.target.className = 'hexagon';
    }
  })
}) //end of hex click event listener


