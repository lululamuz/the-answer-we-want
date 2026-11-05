let data;

fetch("data.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    data = json;
  });

function containsAny(question, words) {
  for (let i = 0; i < words.length; i++) {
    if (question.includes(words[i])) {
      return true;
    }
  }
  return false;
}

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

function pickRandom(array) {
  let index = Math.floor(Math.random() * array.length);
  return array[index];
}

function askOracle() {
  let question = document.getElementById("question").value.toLowerCase();

  if (question === "") {
    alert("Please type a question first.");
    return;
  }

  let category = findCategory(question);

  let tone = pickRandom(["positive", "ambiguous", "negative"]);
  let answer = pickRandom(data[category][tone]);

  document.getElementById("ask-section").style.display = "none";
  document.getElementById("reading-section").style.display = "block";

  setTimeout(function () {
    document.getElementById("reading-section").style.display = "none";
    document.getElementById("answer").textContent = answer;
    document.getElementById("result-section").style.display = "block";

    document.getElementById("wb-category").textContent = data[category].label;
    document.getElementById("wb-answer").textContent = answer;
  }, 1500);
}

function reflect(answer) {
  document.getElementById("follow-up").textContent = data.reflection[answer];
  document.getElementById("reflection-section").style.display = "block";
}

function askAgain() {
  document.getElementById("question").value = "";
  document.getElementById("result-section").style.display = "none";
  document.getElementById("reflection-section").style.display = "none";
  document.getElementById("ask-section").style.display = "block";
}
