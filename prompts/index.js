const prompts = require('./src/index');

const questions = [
  {
    type: 'text',
    name: 'name',
    message: '请输入您的名字:'
  },
  {
    type: 'text',
    name: 'age',
    message: '请输入您的年龄:'
  }
];

(async () => {
  const response = await prompts(questions);

  // console.log(`您的名字是：${response.name}`);
  // console.log(`您的年龄是：${response.age}`);
  console.log(response)
})();