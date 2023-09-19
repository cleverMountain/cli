const Event = require('./node/event/index')
const readline = require('readline');


class Prompt extends Event {
  constructor(options) {
    super()
    this.options = [].concat(options)
    this.in = process.stdin;
    this.out = process.stdout;
    this.init()

  }
  init() {
    const keyPress = (key, data) => {
      console.log(key)
      if (key === 'q') {
        this.rl.close()
      }
    }
    this.rl = readline.createInterface({ input: this.in, output: this.out });
    // this.rl.question('Please enter something: ', (answer) => {
    //   console.log(`You entered: ${answer}`);

    // });
    this.options.forEach(item => {
      this.rl.question(item.message, (answer) => {
        console.log(`You entered: ${answer}`);

      });
    })
    readline.emitKeypressEvents(this.in, this.rl);

    if (this.in.isTTY) this.in.setRawMode(true);
    this.in.on('keypress', keyPress)
  }
}

const prompt = new Prompt(
[  {
    type: 'text',
    name: 'meaning',
    message: 'What is the meaning of life?'
  },
  {
    type: 'text1',
    name: 'meaning1',
    message: 'What is the meaning of life?1'
  }]
)