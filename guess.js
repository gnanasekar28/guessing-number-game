const gameContainer = document.getElementById('gameContainer');
const playerNameInput = document.getElementById('playerName');
const guessResult = document.getElementById('guessResult');
const userGuessInput = document.getElementById('userGuess');

let playerName = '';
let computerNumber = '';
let attempts = 0;
let startTime;

function generateRandomNumber() {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let number = '';

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    number += digits.splice(randomIndex, 1)[0];
  }

  return number;
}

function startNewGame() {
  playerName = playerNameInput.value.trim();

  if (playerName === '') {
    alert('Please enter your name.');
    return;
  }

  computerNumber = generateRandomNumber();
  attempts = 0;
  startTime = new Date().getTime();

  gameContainer.style.display = 'block';
  document.getElementById('startGame').style.display = 'none';
  guessResult.textContent = '';
  userGuessInput.value = '';
  userGuessInput.focus();
}

function checkGuess(userGuess) {
  let result = '';

  for (let i = 0; i < 4; i++) {
    if (userGuess[i] === computerNumber[i]) {
      result += '+';
    } else if (computerNumber.includes(userGuess[i])) {
      result += '-';
    }
  }

  return result;
}

function makeGuess() {
  attempts++;
  const userGuess = userGuessInput.value.trim();

  if (userGuess.length !== 4 || !/^\d{4}$/.test(userGuess)) {
    alert('Please enter a valid four-digit number.');
    return;
  }

  const result = checkGuess(userGuess);

  if (result === '++++') {
    const endTime = new Date().getTime();
    const timeTaken = (endTime - startTime) / 1000.0;

    guessResult.textContent = `Congratulations, you guessed the number! 
      Number of attempts: ${attempts} 
      Time taken: ${timeTaken} seconds`;

    saveScore(playerName, attempts, timeTaken);
    showBestScore();
    gameContainer.style.display = 'none';
    document.getElementById('startGame').style.display = 'block';
  } else {
    guessResult.textContent = 'Result: ' + result;
    userGuessInput.value = '';
    userGuessInput.focus();
  }
}

async function saveScore(name, attempts, timeTaken) {
  const response = await fetch('/save-score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, attempts, timeTaken }),
  });

  if (!response.ok) {
    alert('Error saving score. Please try again later.');
  }
}

async function showBestScore() {
  const response = await fetch('/best-score');
  const data = await response.json();

  if (data) {
    const bestScoreValue = calculateBestScore(data);
    alert(`Best score: ${data.name} - Score: ${bestScoreValue}`);
  }
}

function calculateBestScore(data) {
  return data.attempts * 0.6 + data.timeTaken * 0.4;
}

document
  .getElementById('playerName')
  .addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      startNewGame();
    }
  });

document
  .getElementById('userGuess')
  .addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      makeGuess();
    }
  });
