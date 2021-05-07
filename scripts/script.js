// Namespace
const hangman = {}

// Array to hold user guess
hangman.userGuess = [];

// Start game
hangman.start = function () {
  const play = document.querySelector('.play');
  const onePlayerGuessForm = document.getElementById('onePlayerGuessForm');
  play.addEventListener('click', function () {
    this.classList.add('hidden');
    onePlayerGuessForm.classList.add('active');
    hangman.displayOnePlayerQuestion();
  })
}

// Display random category and number of letters for the word (one player game)
hangman.displayOnePlayerQuestion = function () {

  const blanks = document.querySelector('.blank');

  // Get a random word from the API
  fetch(`https://random-word-api.herokuapp.com/word?number=1`)
    .then(res => res.json())
    .then(data => {
      let randomWord = data[0];
      console.log(randomWord);

      let letters = randomWord.split([,]);
      console.log(letters);

      const displayedLetter = letters.map((letter, index) => `<span class="letterSpace">letter ${index + 1}<span aria-hidden="true" class="correct">${letter}</span></span>`).join(' ');
      blanks.innerHTML = displayedLetter;

      // Check one player guesses
      onePlayerGuessForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let guessValue = document.getElementById('onePlayerGuessInput').value;
        let correct = document.querySelectorAll('.correct');
        const wrong = document.querySelector('.wrong');
        let numberWrong = wrong.getElementsByTagName('P');
        const body = document.querySelector('.body');
        const head = document.querySelector('.head');
        const torso = document.querySelector('.torso');
        const leftArm = document.querySelector('.leftArm');
        const rightArm = document.querySelector('.rightArm');
        const leftLeg = document.querySelector('.leftLeg');
        const rightLeg = document.querySelector('.rightLeg');

        //if user guesses a wrong word 
        if ((guessValue.match(hangman.validGuess)) && (!hangman.userGuess.includes(guessValue))) {
          hangman.userGuess.push(guessValue);
          displayBodyParts();}

          // Alert if letter has already been guessed
         else if ((guessValue.match(hangman.validGuess)) && (hangman.userGuess.includes(guessValue))) {
          alert("You already guessed that letter!")
        }

        // replace blanks with the guessed letter
        for (let i = 0; i < letters.length; i++) {
          if (letters.includes(guessValue)) {
            if (correct[i].innerHTML === guessValue) {
              correct[i].classList.add('visible');
              correct[i].setAttribute("aria-hidden", "false");
            }
          }
        }

        // drawing the hang man
        function displayBodyParts() {
          if (!letters.includes(guessValue)) {
            wrong.innerHTML += `<p>${guessValue}</p>`;
            if (numberWrong.length === 1) {
              head.classList.remove('hidden')
              body.setAttribute("aria-label", "one of six body parts visible")
            }
            if (numberWrong.length === 2) {
              torso.classList.remove('hidden')
              body.setAttribute("aria-label", "two of six body parts visible")
            }
            if (numberWrong.length === 3) {
              leftArm.classList.remove('hidden')
              body.setAttribute("aria-label", "three of six body parts visible")
            }
            if (numberWrong.length === 4) {
              rightArm.classList.remove('hidden')
              body.setAttribute("aria-label", "four of six body parts visible")
            }
            if (numberWrong.length === 5) {
              leftLeg.classList.remove('hidden')
              body.setAttribute("aria-label", "five of six body parts visible")
            }
            if (numberWrong.length === 6) {
              rightLeg.classList.remove('hidden')
              body.setAttribute("aria-label", "all body parts visible, you have been hanged!")
            }
          }
        }

        // If all letters have been guessed correctly, player wins
        if (document.querySelectorAll('.correct.visible').length === letters.length) {
          alert("you won")
           //show the play again button
          hangman.playAgain.classList.remove('hidden');
          onePlayerGuessForm.classList.remove('active');
        }

        // If player guesses 6 wrong letters (number of body parts), player loses
        if (numberWrong.length === 6) {
         alert("you lose!")
          hangman.playAgain.classList.remove('hidden');
          onePlayerGuessForm.classList.remove('active');
          // Show the correct word
          for (let i = 0; i < letters.length; i++) {
            correct[i].classList.add('visible')
          }
        }

        // Clear the form input after submit
        onePlayerGuessForm.reset();
      })
    })
}


// Function to refresh page when Play Again button is clicked
hangman.playAgain = document.querySelector('.playAgain');
hangman.playAgain.addEventListener('click', function () {
  location.reload();
});


hangman.start();
