String.prototype.replaceAt = function (index, replacement) {
    return (
        this.substr(0, index) +
        replacement +
        this.substr(index + replacement.length)
    );
};

const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x).toLowerCase());

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const letters = document.getElementById("letters");
const blanks = document.getElementById("blanks");
const gameover = document.getElementById("gameover");
const answer = document.getElementById("answer");
const counters = document.getElementById("counters");
const hang = document.getElementById("hang");
const replay = document.getElementById("replay");
const help = document.getElementById("help");

alphabet.forEach((letter, i) => {

    const newButton = document.createElement("button");
    newButton.innerHTML = letter;
    newButton.id = letter;
    newButton.setAttribute("class", "alphaButton");
    newButton.style.margin = "0px 5px";
    newButton.style.width = "40px";
    newButton.style.height = "40px";
    letters.append(newButton);

    if (i == 12) {
        const breaking = document.createElement("br");
        const breaking2 = document.createElement("br");
        letters.append(breaking);
        letters.append(breaking2);
    }

});

fetch("https://random-word-api.herokuapp.com/word?number=1")
    .then(response => response.json())
    .then(json => {

        const word = json[0];
        for (let i = 0; i < word.length; i++) {
            blanks.innerHTML += "_ ";
        }

        let rightCount = 0;
        let falseCount = 0;
        let loser = false;
        const checkLetter = (e) => {

            const clicked = e.target.innerHTML;
            if (e.target.nodeName === "BUTTON") {

                let rightLetter = false;
                if (loser == false) {
                    if (word.includes(clicked)) {
                        rightLetter = true;
                        for (let i = 0; i < word.length * 2; i += 2) {
                            if (word[i / 2] == clicked) {
                                blanks.innerHTML = blanks.innerHTML.replaceAt(i, clicked);
                                rightCount++;
                            }
                        }
                    }
                }

                if (falseCount < 10) {
                    e.target.setAttribute("disabled", "true");
                    if (rightLetter == false) {
                        falseCount++;
                        hang.setAttribute("src", `./images/${falseCount}.png`);
                    }
                    counters.innerHTML =
                        "False: " + falseCount + " || Found Letters: " + rightCount;
                }

                if (falseCount == 10) {
                    gameover.style.display = "block";
                    answer.innerHTML += '"' + word + '"';
                    answer.style.display = "block";
                    loser = true;
                    falseCount++;
                }

                if (loser == false) {
                    if (rightCount == word.length) {
                        gameover.innerHTML = "Congratulations 🎉!";
                        gameover.style.color = "darkgreen";
                        gameover.style.display = "block";
                        answer.innerHTML += '"' + word + '"';
                        answer.style.display = "block";
                        falseCount = 11;
                        loser = true;
                    }
                }

            }

        };
        letters.addEventListener("click", checkLetter);

        replay.addEventListener("click", () => {
            location.reload();
        });

        let helpCount = 0;
        const helper = () => {

            if (falseCount < 10) {

                helpCount++;
                let clicked = word[randomInteger(0, word.length - 1)];
                while (blanks.innerHTML.includes(clicked)) {
                    clicked = word[randomInteger(0, word.length - 1)];
                }
                const buttonDisable = document.getElementById(clicked);

                if (loser == false) {
                    rightLetter = true;
                    for (let i = 0; i < word.length * 2; i += 2) {
                        if (word[i / 2] == clicked) {
                            blanks.innerHTML = blanks.innerHTML.replaceAt(i, clicked);
                            rightCount++;
                        }
                    }
                }

                falseCount++;
                hang.setAttribute("src", `./images/${falseCount}.png`);
                counters.innerHTML =
                    "Mistakes: " + falseCount + " || Found Letters: " + rightCount;

                if (falseCount < 10) buttonDisable.setAttribute("disabled", "true");

                if (falseCount == 10) {
                    gameover.style.display = "block";
                    answer.innerHTML += '"' + word + '"';
                    answer.style.display = "block";
                    loser = true;
                    falseCount++;
                }

                if (loser == false) {
                    if (rightCount == word.length) {
                        gameover.innerHTML = "Congratulations 🎉!";
                        gameover.style.color = "darkgreen";
                        gameover.style.display = "block";
                        answer.innerHTML += '"' + word + '"';
                        answer.style.display = "block";
                        falseCount = 11;
                        loser = true;
                    }
                }

                if (helpCount == 2) {
                    help.style.display = "none";
                }

            }

        };
        help.addEventListener("click", helper);

    });