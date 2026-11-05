let data;

const START_BLUR = 14;
const REVEAL_TIME = 2500;
const STEP = 50;

let progress = 0;
let holdTimer = null;
let readTimer = null;

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

function show(id) {
  document.getElementById(id).classList.add("show");
}
function hide(id) {
  document.getElementById(id).classList.remove("show");
}

function submitQuestion() {
  let question = document.getElementById("question").value.toLowerCase().trim();

  if (question === "") {
    document.getElementById("error").textContent = "Ask something first.";
    return;
  }
  document.getElementById("error").textContent = "";

  let category = findCategory(question);
  let tone = pickRandom(["positive", "ambiguous", "negative"]);
  let answer = pickRandom(data[category][tone]);

  document.getElementById("answer").textContent = answer;
  document.getElementById("mirror").textContent = answer;
  progress = 0;
  updateBlur();

  hide("stage-question");
  show("stage-answer");
}

function startHolding() {
  if (holdTimer !== null || progress >= 1) {
    return;
  }

  holdTimer = setInterval(function () {
    progress = progress + STEP / REVEAL_TIME;

    if (progress >= 1) {
      progress = 1;
      stopHolding();
      revealComplete();
    }

    updateBlur();
  }, STEP);
}

function stopHolding() {
  clearInterval(holdTimer);
  holdTimer = null;
}

function updateBlur() {
  let blur = START_BLUR * (1 - progress);
  document.getElementById("answer").style.filter = "blur(" + blur + "px)";
  document.getElementById("mirror").style.filter = "blur(" + (blur + 2) + "px)";
}

let answerArea = document.getElementById("answer-area");
answerArea.addEventListener("pointerdown", startHolding);
answerArea.addEventListener("pointerup", stopHolding);
answerArea.addEventListener("pointerleave", stopHolding);
answerArea.addEventListener("pointercancel", stopHolding);

function revealComplete() {
  document.getElementById("answer-label").textContent = "03 — The Answer";
  document.getElementById("answer-prompt").style.display = "none";
  document.getElementById("answer-hint").style.display = "none";
  document.getElementById("reveal-button").style.display = "none";

  readTimer = setTimeout(function () {
    show("stage-reflection");
  }, 2500);
}

function reflect(answer) {
  document.getElementById("reflection-text").textContent = data.reflection[answer];
  show("ending");
}

function beginAgain() {
  stopHolding();
  clearTimeout(readTimer);
  progress = 0;

  document.getElementById("question").value = "";
  document.getElementById("answer-label").textContent = "02 — The Reflection";
  document.getElementById("answer-prompt").style.display = "";
  document.getElementById("answer-hint").style.display = "";
  document.getElementById("reveal-button").style.display = "";

  hide("ending");
  hide("stage-reflection");
  hide("stage-answer");
  show("stage-question");
}
