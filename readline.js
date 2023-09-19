

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Please enter something: ', (answer) => {
  console.log(`You entered: ${answer}`);
  rl.close();
});






// const readline = require('readline');

// // 配置 readline.emitKeypressEvents 为 true
// readline.emitKeypressEvents(process.stdin);

// // 创建 readline.Interface 实例
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// // 监听按键事件
// process.stdin.on('keypress', (key, data) => {
//   if (key === 'q') {
//     console.log('Quitting the program...');
//     rl.close();
//   }
// });

// // 监听线路事件
// rl.on('line', (input) => {
//   console.log(`Received input: ${input}`);
// });


// const readline = require('readline');

// readline.emitKeypressEvents(process.stdin);

// process.stdin.on('keypress', (key, data) => {
//   if (key === 'q' && data.ctrl) {
//     console.log('Exiting...');
//     process.exit();
//   } else {
//     console.log(`Key pressed: ${key}`);
//   }
// });

// process.stdin.setRawMode(true);
// process.stdin.resume();




