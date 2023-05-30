console.clear();
let answer = "";
let definition = "??";
let source = "";

getWordFromAPI();

const keyboard = document.querySelectorAll("button[id^=letter]");
const enter = document.getElementById("key-enter");
const backspace = document.getElementById("key-back");
const info = document.getElementById("info");
//okreslenie na ktorym boxie jestesmy ↓
let whichRow = 1;
let whichBox = 1;
let win = false;

let guessedWord = "";

//sprawdzanie słowa
function checkAndLock() {
  console.clear();
  //przypisanie slowa wpisanego prez gracza w aktualnym wierszu do zmiennej guessedWord
  guessedWord = "";
  for (let i = 0; i <= 4; i++) {
    let thisBox = document.getElementById("box" + whichRow + (i + 1));
    guessedWord = guessedWord + thisBox.value;
  }
  // dodanie zmiennych roboczych które będą modyfikowane
  let answerCheck = answer;
  let guessedCheck = guessedWord;
  //sprawdzenie liter - dokladna pozycja
  for (let i = 0; i <= 4; i++) {
    let thisBox = document.getElementById("box" + whichRow + (i + 1));
    //modyfikacja trafionych litery w zmiennych, żeby nie zostały odnaleziona ponownie
    if (answer.charAt(i) == guessedCheck.charAt(i)) {
      guessedCheck = guessedCheck.slice(0, i) + "#" + guessedCheck.slice(i + 1);
      answerCheck = answerCheck.slice(0, i) + "*" + answerCheck.slice(i + 1);
      thisBox.classList.add("boxCorrect");
    }
  }
  if (guessedWord == answer) {
    win = true;
    return gameOver();
  }
  //sprawdzanie liter - dowolna pozycja
  for (let i = 0; i <= 4; i++) {
    if (guessedCheck.includes(answerCheck.charAt(i))) {
      let diffNo = guessedCheck.indexOf(answerCheck.charAt(i));
      //modyfikacja trafionych litery w zmiennych, żeby nie zostały odnaleziona ponownie
      answerCheck = answerCheck.slice(0, i) + "*" + answerCheck.slice(i + 1);
      let thisBox = document.getElementById("box" + whichRow + (diffNo + 1));
      thisBox.classList.add("boxDifferent");
    }

    for (let i = 0; i <= 4; i++) {
      let thisBox = document.getElementById("box" + whichRow + (i + 1));
      if (guessedCheck.charAt(i) != "#" && guessedCheck.charAt(i) != "*") {
        thisBox.classList.add("boxWrong");
      }
    }
  }
  usedLetters();
  whichRow++;
  if (whichRow == 7) {
    return gameOver();
  }
  whichBox = 1;
  enter.disabled = true;
}

//kasowanie liter po jednej
function erase() {
  currentBox = document.getElementById("box" + whichRow + whichBox);
  if (whichBox == 1) {
    currentBox.value = "";
  } else {
    whichBox--;
    currentBox = document.getElementById("box" + whichRow + whichBox);
    currentBox.value = "";
  }
}

function gameOver() {
  document.getElementById("definitionText").innerHTML = definition;
  console.log(definition);
  document.getElementById("info").classList.add("visible");
  for (let i = 0; i <= 4; i++) {
    let thisBox = document.getElementById("resultBox" + (i + 1));
    thisBox.classList.add("boxCorrect");
    thisBox.value = answer.charAt(i);
  }

  document.getElementById("definitionText").innerHTML = definition;

  let result = document.getElementById("resultText");
  if (win) {
    result.innerHTML = "You won!";
    console.log("won!");
  } else {
    console.log("lost!");
    result.innerHTML = "You lost!";
  }
}

//wpisywanie liter klawiaturą; tylko litery, backspace i enter
function keyPressed(event) {
  let key = event.key;
  if (/^[A-Za-z]$/.test(event.key)) {
    key = key.toLowerCase();
    document.getElementById("letter-" + key).click();
  }
  if (key == "Backspace") {
    erase();
  }
  if (key == "Enter" && whichBox == 6) {
    checkAndLock();
  }
}

function usedLetters() {
  for (let i = 0; i <= 4; i++) {
    let usedKey = document.getElementById("letter-" + guessedWord.charAt(i));
    usedKey.classList.add("usedKey");
  }
}

//wpisywanie liter myszką
keyboard.forEach((letter) => {
  letter.addEventListener("click", (event) => {
    if (whichBox <= 5) {
      let currentBox = document.getElementById("box" + whichRow + whichBox);
      currentBox.value = event.target.innerHTML;
      whichBox++;
      if (whichBox == 6) {
        enter.disabled = false;
      }
    }
  });
});

enter.addEventListener("click", checkAndLock);
backspace.addEventListener("click", erase);
document.addEventListener("keydown", keyPressed);

//reload
document.getElementById("reload").addEventListener("click", playAgain);

function playAgain() {
  info.classList.remove("visible");
  info.classList.add("hidden");
  whichRow = 1;
  whichBox = 1;
  win = false;
  const allBoxes = document.querySelectorAll("input");
  allBoxes.forEach((box) => {
    box.classList.remove("boxCorrect");
    box.classList.remove("boxDifferent");
    box.classList.remove("boxWrong");
    box.value = "";
  });
  const allKeys = document.querySelectorAll("#keyboard button");
  allKeys.forEach((key) => {
    key.classList.remove("usedKey");
  });
  getWordFromAPI();
}

function getWordFromAPI() {
  //pobranie losowego słowa z "wordnik.com"
  fetch(
    "https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=noun&excludePartOfSpeech=adjective%2Cnoun-plural%2Cprefix%2Csuffix%2Cverb%2Cadverb%2Cproper-noun%2Cgiven-name&maxCorpusCount=-1&minDictionaryCount=3&maxDictionaryCount=-1&minLength=5&maxLength=5&limit=1&api_key=ofkz09vc3mks7uqn6xftsushc30gutpsh3a12elf3nys9y5ww"
  )
    .then((response) => response.json()) // Parsowanie odpowiedzi jako JSON
    .then((data) => {
      answer = data[0].word;
      console.log(answer);

      //pobranie definicji do losowego słowa
      fetch(
        `https://api.wordnik.com/v4/word.json/${answer}/definitions?limit=400&includeRelated=false&useCanonical=false&includeTags=false&api_key=ofkz09vc3mks7uqn6xftsushc30gutpsh3a12elf3nys9y5ww`
      )
        .then((response) => response.json()) // Parsowanie odpowiedzi jako JSON
        .then((data) => {
          definition = data[0].text;
          console.log(definition);
          if (definition == "undefined") {
            definition = data[1].text;
            if (definition == "undefined") {
              definition = "";
            }
          }
        })
        .catch((error) => {
          // Obsługa błędu pobierania danych

          answer = "error";
          definition =
            "An act, assertion, or belief that unintentionally deviates from what is correct, right, or true.";
          console.error("Błąd pobierania danych: 1 /", error);
        });
    })
    .catch((error) => {
      // Obsługa błędu pobierania danych
      answer = "error";
      definition =
        "An act, assertion, or belief that unintentionally deviates from what is correct, right, or true.";
      console.error("Błąd pobierania danych: 2 /", error);
    });
  answer = answer.toLowerCase();
}

function doesWordExist() {
  // https://api.wordnik.com/v4/word.json/gtrgt/definitions?limit=200&includeRelated=false&useCanonical=false&includeTags=false&api_key=YOURAPIKEY
}
