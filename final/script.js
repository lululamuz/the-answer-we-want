// The Answer People Wanted - final version
// Project #5 Digital Divination
//
// Same core logic as the prototype (keywords + JSON + Math.random).
// New in the final: the answer starts blurred, and the participant
// presses and holds it to make it clear ("Clear the Reflection").


// This will hold everything from data.json once it loads
let data;

// Reveal settings
const START_BLUR = 14;      // how blurry the answer is at the start (in px)
const REVEAL_TIME = 2500;   // how long you need to hold in total (in ms)
const STEP = 50;            // how often the blur updates while holding (in ms)

let progress = 0;           // 0 = fully blurred, 1 = fully clear
let holdTimer = null;       // the running timer while holding
let readTimer = null;       // the pause before the reflection question


// 1. LOAD THE JSON FILE
fetch("data.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    data = json;
  });


// 2. CHECK IF THE QUESTION CONTAINS ANY WORD FROM A LIST
function containsAny(question, words) {
  for (let i = 0; i < words.length; i++) {
    if (question.includes(words[i])) {
      return true;
    }
  }
  return false;
}


// 3. DECIDE THE CATEGORY WITH IF / ELSE
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


// Small helpers to show and hide a stage
function show(id) {
  document.getElementById(id).classList.add("show");
}
function hide(id) {
  document.getElementById(id).classList.remove("show");
}


// 5. STAGE 1 -> 2: SUBMIT THE QUESTION
// The answer is chosen HERE, before the ritual starts.
// Holding the answer later only makes it visible; it never changes it.
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

  // put the answer (and its mirrored copy) on the page, fully blurred
  document.getElementById("answer").textContent = answer;
  document.getElementById("mirror").textContent = answer;
  progress = 0;
  updateBlur();

  hide("stage-question");
  show("stage-answer");
}


// 6. STAGE 2: CLEAR THE REFLECTION
// While holding, a timer runs every 50ms and adds a little progress.
// Letting go stops the timer, but the progress is kept.
function startHolding() {
  if (holdTimer !== null || progress >= 1) {
    return; // already holding, or already finished
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

// progress 0 -> blur 14px, progress 0.5 -> blur 7px, progress 1 -> blur 0px
function updateBlur() {
  let blur = START_BLUR * (1 - progress);
  document.getElementById("answer").style.filter = "blur(" + blur + "px)";
  document.getElementById("mirror").style.filter = "blur(" + (blur + 2) + "px)";
}

// connect the hold to the answer area
// (pointer events work for both mouse and touch)
let answerArea = document.getElementById("answer-area");
answerArea.addEventListener("pointerdown", startHolding);
answerArea.addEventListener("pointerup", stopHolding);
answerArea.addEventListener("pointerleave", stopHolding);
answerArea.addEventListener("pointercancel", stopHolding);


// 7. STAGE 3: THE ANSWER IS CLEAR
function revealComplete() {
  document.getElementById("answer-label").textContent = "03 — The Answer";
  document.getElementById("answer-prompt").style.display = "none";
  document.getElementById("answer-hint").style.display = "none";
  document.getElementById("reveal-button").style.display = "none";

  // give the participant a moment to read before asking the question
  readTimer = setTimeout(function () {
    show("stage-reflection");
  }, 2500);
}


// 8. STAGE 4: THE REAL REFLECTION
// answer is "yes", "no" or "unsure"
function reflect(answer) {
  document.getElementById("reflection-text").textContent = data.reflection[answer];
  show("ending");
}


// 9. START OVER
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
