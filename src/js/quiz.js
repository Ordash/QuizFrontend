const fetchQuestions = () => {
  fetch("https://opentdb.com/api.php?amount=1&encode=base64")
    .then(response => response.json())
    .then(data => {
      let allAnswer = [];
      let correctAnswer = atob(data.results[0].correct_answer);
      let incorrectAnswers = [];
      for (a of data.results[0].incorrect_answers) {
        incorrectAnswers.push(atob(a));
      }
      let correctId; //the id of the correct answer
      if (incorrectAnswers.length > 2) {
        correctId = setAnswersList(allAnswer, correctAnswer, incorrectAnswers);
      } else {
        correctId = setTrueOrFalse(allAnswer, correctAnswer);
      }

      let q = atob(data.results[0].question);
      createQuestionCardElements(correctId, q, allAnswer);
    })
    .catch(error => console.error(error));
};

function setAnswersList(allAnswer, correctAnswer, incorrectAnswers) {
  let randomCorrect = Math.floor(Math.random() * 4);
  let sw = 0;
  for (let i = 0; i < 4; i++) {
    if (i == randomCorrect) {
      allAnswer[i] = correctAnswer;
      sw = 1;
    } else {
      allAnswer[i] = incorrectAnswers[i - sw];
    }
  }
  return randomCorrect;
}

function setTrueOrFalse(allAnswer, correctAnswer) {
  allAnswer[0] = "True";
  allAnswer[1] = "False";
  let correctAnswerId;
  if (correctAnswer == "True") {
    correctAnswerId = 0;
  } else {
    correctAnswerId = 1;
  }
  return correctAnswerId;
}

function createQuestionCardElements(correctId, question, answers) {
  let listGroupTag = document.createElement("div");
  listGroupTag.setAttribute("class", "list-group pl-20");
  setAnswers(correctId, answers, listGroupTag);
  let questionTag = document.createElement("h1");
  questionTag.setAttribute("class", "display-5");
  questionTag.innerHTML = question;
  let jumboTag = document.createElement("div");
  jumboTag.setAttribute("class", "jumbotron text-center py-4");
  jumboTag.appendChild(questionTag);
  jumboTag.appendChild(listGroupTag);
  let containerTag = document.createElement("div");
  containerTag.setAttribute("class", "container col-md-7");
  containerTag.appendChild(jumboTag);
  document.body.appendChild(containerTag);
}

function setAnswers(correctId, answers, listGroup) {
  for (let i = 0; i < answers.length; i++) {
    let b = document.createElement("button");
    if (i == correctId) {
      b.setAttribute("isCorrect", "1");
    } else {
      b.setAttribute("isCorrect", "0");
    }
    b.setAttribute("type", "button");
    b.setAttribute(
      "class",
      "list-group-item list-group-item-action my-2 answerbutton btn-dark answerbutton"
    );
    b.innerHTML = answers[i];
    b.addEventListener("click", answerClicked);
    listGroup.appendChild(b);
  }
}

const answerClicked = event => {
  const answerButtons = document.querySelectorAll(".answerbutton");
  answerButtons.forEach(btn => {
    btn.removeEventListener("click", answerClicked);
  });
  const btn = event.target;

  if (btn.getAttribute("isCorrect") == 1) {
    btn.style.backgroundcolor = "#27AE60";
  } else {
    btn.style.backgroundcolor = "#31FA81";
  }
  setTimeout(() => {
    fetchQuestions();
  }, 1500);
};

fetchQuestions();
