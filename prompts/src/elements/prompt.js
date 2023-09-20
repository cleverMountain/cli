'use strict';

const readline = require('readline');
const action  = require('./action');
const EventEmitter = require('events');
const { beep, cursor } = require('sisteransi');

/**
 * Base prompt skeleton
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
class Prompt extends EventEmitter {
  constructor(opts={}) {
    super();

    this.firstRender = true;
    this.in = process.stdin;
    this.out = process.stdout;
    this.onRender = (opts.onRender || (() => void 0)).bind(this);
    const rl = readline.createInterface({ input:this.in, escapeCodeTimeout:50 });
    readline.emitKeypressEvents(this.in, rl);

    if (this.in.isTTY) this.in.setRawMode(true);
    const isSelect = [ 'SelectPrompt', 'MultiselectPrompt' ].indexOf(this.constructor.name) > -1;
    const keypress = (str, key) => {
      let a = action(key, isSelect);
      if (a === false) {
        this.write(str, key)
      } else if (typeof this[a] === 'function') {
        this[a](key);
      }
    };

    this.close = () => {
      this.in.removeListener('keypress', keypress);
      if (this.in.isTTY) this.in.setRawMode(false);
      rl.close();
      if (!this.aborted) {
        this.emit('submit', this._value)
      }
      // this.emit(this.aborted ? 'abort' : this.exited ? 'exit' : 'submit', this._value);
      this.closed = true;
    };
    this.in.on('keypress', keypress);
  }
  write(str, key) {
    this.value = str
    this.out.write(str)
  }
}

module.exports = Prompt;
