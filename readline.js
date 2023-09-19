const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function processAnswers(answers) {
  // 在这里处理回答，执行相应的操作
  console.log('Received answers:');
  console.log(answers);
}

function promptQuestions(questions, answers = []) {
  if (questions.length === 0) {
    rl.close();
    processAnswers(answers);
    return;
  }

  const question = questions.shift();
  rl.question(question, (answer) => {
    answers.push(answer);
    promptQuestions(questions, answers);
  });
}

const questions = [
  'What is your name? ',
  'Where are you from? ',
  'What is your favorite color? '
];

promptQuestions(questions);
