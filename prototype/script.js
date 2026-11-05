// The Answer People Wanted - white-boxed prototype
// Project #5 Digital Divination

// This will hold everything from data.json once it loads
let data;

// 1. LOAD THE JSON FILE
fetch("data.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    data = json;
  });


// 2. CHECK IF THE QUESTION CONTAINS ANY WORD FROM A LIST
// returns true if at least one word is found, otherwise false
function containsAny(question, words) {
  for (let i = 0; i < words.length; i++) {
    if (question.includes(words[i])) {
      return true;
    }
  }
  return false;
}


// 3. DECIDE THE CATEGORY WITH IF / ELSE
// checks the categories in order; if nothing matches, use "general"
function findCategory(question) {
  if (containsAny(question, data.love.keywords)) {
    return "love";
  } else if (containsAny(question, data.career.keywords)) {
    return "career";
  } else if (containsAny(question, data.decision.keywords)) {
    return "decision";
  } else {
    return "general";
  }
}


// 4. PICK A RANDOM ITEM FROM AN ARRAY
function pickRandom(array) {
  let index = Math.floor(Math.random() * array.length);
  return array[index];
}


// 5. WHEN THE USER CLICKS "ASK THE ORACLE"
function askOracle() {
  let question = document.getElementById("question").value.toLowerCase();

  if (question === "") {
    alert("Please type a question first.");
    return;
  }

  // the question decides the category...
  let category = findCategory(question);

  // ...and chance decides the tone and the sentence
  let tone = pickRandom(["positive", "ambiguous", "negative"]);
  let answer = pickRandom(data[category][tone]);

  // show a short "reading" moment before the answer
  document.getElementById("ask-section").style.display = "none";
  document.getElementById("reading-section").style.display = "block";

  setTimeout(function () {
    document.getElementById("reading-section").style.display = "none";
    document.getElementById("answer").textContent = answer;
    document.getElementById("result-section").style.display = "block";

    // white-box view: show how the answer was chosen
    document.getElementById("wb-category").textContent = data[category].label;
    document.getElementById("wb-answer").textContent = answer;
  }, 1500);
}


// 6. WHEN THE USER ANSWERS THE REFLECTION QUESTION
// answer is "yes", "no" or "unsure"
function reflect(answer) {
  document.getElementById("follow-up").textContent = data.reflection[answer];
  document.getElementById("reflection-section").style.display = "block";
}


// 7. START OVER
function askAgain() {
  document.getElementById("question").value = "";
  document.getElementById("result-section").style.display = "none";
  document.getElementById("reflection-section").style.display = "none";
  document.getElementById("ask-section").style.display = "block";
}
