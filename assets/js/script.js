const playButton = document.querySelector('#play-btn');
const submitButton = document.querySelector('#submit-btn');

const h1El = document.querySelector("h1");
const bodyEl = document.querySelector('body',);
const olEl = document.querySelector('ol');
const quizAnswers = document.querySelector('#quiz-answers');
const questionsEl = document.querySelector('#questions');
const nameInput = document.querySelector("#name");
const scoresEl = document.querySelector('#score');
const progressEl = document.querySelector("#progress");

let questionsIndex, randomQuestions, timeLeft, timeInterval;
let userScores = JSON.parse(localStorage.getItem("userScore")) || [];


// Javascript questions
const questionBank = [
  {
    question: 'Commonly used data types DO NOT include',
    answers: [
      { text: 'Strings', correct: false },
      { text: 'Booleans', correct: false },
      { text: 'Alerts', correct: true },
      { text: 'numbers', correct: false }
    ]
  },
  {
    question: 'The Condition in an if/else statement is enclosed with______',
    answers: [
      { text: 'Quotes', correct: false },
      { text: 'Curly Brackets', correct: false },
      { text: 'Parenthesis', correct: true },
      { text: 'Square Brackets', correct: false }
    ]
  },
  {
    question: 'Arrays in JavaScript can be used to store_______',
    answers: [
      { text: 'Numbers and Strings', correct: false },
      { text: 'Other Arrays', correct: false },
      { text: 'Booleans', correct: false },
      { text: 'All of the Above', correct: true }
    ]
  },
  {
    question: 'String values must be enclosed within _____ when being assigned to variables',
    answers: [
      { text: 'Commas', correct: false },
      { text: 'Curly Brackets', correct: false },
      { text: 'Quotes', correct: true },
      { text: 'Paranthesis', correct: false }
    ]
  },
  {
    question: 'A very useful tool used during development and debugging for printing content to the debugger is:',
    answers: [
      { text: 'Javascript', correct: false },
      { text: 'Terminal/Bash', correct: false },
      { text: 'For Loops', correct: false },
      { text: 'console.log', correct: true }
    ]
  },
];

// Quiz App Code
const startQuiz = () => {
  timeLeft = 25;
  questionIndex = 0;
  randomQuestions = questionBank.sort(() => Math.random() - 0.5);

  progressEl.textContent = `Time remaining: ${timeLeft || 25}`;
  h1El.textContent = "Javascript Quiz";
  nameInput.value = '';
  playButton.classList.add('hidden');
  scoresEl.classList.add('hidden');
  bodyEl.classList.remove('correct', 'wrong');
  quizAnswers.classList.remove('hidden');
  document.querySelector("#quiz-info").classList.remove('hidden');

  countdown();
  nextQuestion();
}

const countdown = () => {
  timeInterval = setInterval(() => {
    timeLeft--;
    progressEl.textContent = `Time remaining: ${timeLeft}`;

    if (timeLeft === 0) {
      bodyEl.classList.add('wrong');
      displayScore();
      clearInterval(timeInterval);
      progressEl.textContent = `Time's up!`;
    };
  }, 1000);
}

const nextQuestion = () => {

  quizAnswers.innerHTML = '';
  renderQuestion(randomQuestions[questionIndex]);
}


const renderQuestion = (question) => {
  if (randomQuestions.length >= questionIndex + 1) {
    questionsEl.textContent = question.question;

    question.answers.forEach(answer => {
      const button = document.createElement('button');

      button.textContent = answer.text;
      button.classList.add('btn');

      answer.correct && (button.dataset.correct = answer.correct);

      button.addEventListener('click', selectAnswer);
      quizAnswers.appendChild(button);
    });
  }
}

const selectAnswer = (e) => {
  let selectedAnswer = e.target;
  let correct = selectedAnswer.dataset.correct;

  !correct && (timeLeft -= 5);

  feedback(document.body, correct);
  Array.from(quizAnswers.children).forEach(button => {
    feedback(button, button.dataset.correct)
  })

  if (randomQuestions.length <= questionIndex + 1) {
    clearInterval(timeInterval);
    displayScore();
  }

  questionIndex++;
  nextQuestion();
}

const feedback = (ele, correct) => {
  ele.classList.remove('correct', 'wrong');
  ele.classList.add(correct ? 'correct' : 'wrong');
}

const displayScore = () => {
  h1El.textContent = "Result";
  playButton.textContent = 'Restart';
  quizAnswers.classList.add('hidden');
  playButton.classList.remove('hidden');
  scoresEl.classList.remove('hidden');
  questionsEl.textContent = `Your score: ${timeLeft}`;
};

const submit = (e) => {
  e.preventDefault();

  userScores = [...userScores, {
    name: nameInput.value.trim(),
    score: timeLeft
  }];

  if (nameInput.value.trim().length !== 0) {
    alert("You saved your score! Do you think you did a good job?");
    localStorage.setItem("userScore", JSON.stringify(userScores));
  } else {
    alert("Name cannot be blank.");
  }
}

// HighScores
const displayHighScore = () => {

  let sortedScore = userScores.sort((a, b) => b.score - a.score)
    .filter(item => item.name.length !== 0);

  sortedScore.forEach(item => {
    const liEle = document.createElement("li");

    liEle.textContent = `${item.name}: ${item.score}`;
    olEl.appendChild(liEle);
  });
}

const clearHighScore = () => {
  olEl.innerHTML = "";
  localStorage.removeItem("userScore");
}

if (playButton && submitButton) {
  playButton.addEventListener('click', startQuiz);
  submitButton.addEventListener('click', submit);
}