
const Prompt = require('./prompt');

class TextPrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.value = '';
    this.render();
  }

  set value(v) {
    this._value = v
  }
  get value() {
    return this._value
  }
  exit() {
    this.abort();
  }
  abort() {
    this.value = this.value
    this.done = this.aborted = true;
    this.error = false;
    this.red = false;
    this.render();
    this.out.write('\n');
    this.close();
  }

  async submit() {
    this.done = true;
    this.aborted = false;
    // this.render();
    this.out.write('\n');
    this.close();
  }

  render() {
    this.out.write(this.msg);
  }
}

module.exports = TextPrompt;