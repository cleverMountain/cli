
const prompts = require('./prompts')

module.exports = async function (questions = []) {
  questions = [].concat(questions);
  const answers = {};
  let answer = null
  for (let question of questions) {
    const { type, name } = question
    answer = await prompts[type](question);
    answers[name] = answer
  }

  return answer
}