const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
const vowels = ['a', 'e', 'i', 'o', 'u'];

//start button
const start = document.querySelector('button');
//hexes
const hexes = document.querySelectorAll('.hexagon');

//game start chooses letters from vowels and consonants and renders on hex grid
start.addEventListener('click', () => {
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
    } else {
      pickConsonants();
    }
  }

  let center = gameLetters.shift();
  
  hexes.forEach(hex => {
    
    console.log(gameLetters, hex)

    if (hex.id === 'hidden1' || hex.id === 'hidden2') {
      null;
    } else if (hex.id === 'center') {
      hex.innerText = center;
    } else {
      hex.innerText = gameLetters.pop();
    }
  })
})