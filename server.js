
// const readline = require('readline');
// const questions = [
//   {
//     type: 'eat',
//     message: '你吃的什么'
//   },
//   {
//     type: 'age',
//     message: '你多大'
//   }
// ]
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });


// function propts(questions, answers = {}) {
//   let length = questions.length

//   if (length > 0) {
//     const cur = questions[length - 1]
//     rl.question(cur.message, (answer) => {
//       let key = cur.type
//       answers[key] = answer
//       questions.pop()
//       propts(questions, answers)
//     });
//   } else {
//     rl.close();
//   }
//   return answers
// }
// const answers = propts(questions)
// console.log(answers)


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

