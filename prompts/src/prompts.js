'use strict';
const $ = exports;
const el = require('./elements/index');
const noop = v => v;

function toPrompt(type, args, opts={}) {
  return new Promise((res, rej) => {
    const p = new el[type](args);
    const onSubmit = opts.onSubmit || noop;
    // 出发submit时，返回promise
    p.on('submit', x => res(onSubmit(x)));
  });
}
$.text = args => toPrompt('TextPrompt', args);

