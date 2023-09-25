# create vieite
## 进入主函数Init前
```JS
// 获取传入参数
const argv = minimist(process.argv.slice(2), { string: ['_'] })
// 获取当前工作目录
const cwd = process.cwd()
// 创建项目的选项及颜色配置
const FRAMEWORKS = []
```

## init主函数
```js
// 获取默认项目模板
let targetDir = formatTargetDir(argv._[0])
let template = argv.template || argv.t
const defaultTargetDir = 'vite-project'
const getProjectName = () =>
  targetDir === '.' ? path.basename(path.resolve()) : targetDir
// 通过propmpts获取项目信息
const { framework, overwrite, packageName, variant } = await prompts
// 获取模板中的文件名(包括文件及文件名)
template = variant || framework || template
const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '..',
    `template-${template}`
  )
const files = fs.readdirSync(templateDir)
// 写入文件或文件夹
for (const file of files.filter((f) => f !== 'package.json')) {
  write(file)
}
// 先读取模板的package.json在给项目写入，主要是为了修改名字
const pkg = JSON.parse(
  fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8')
)
pkg.name = packageName || getProjectName()
write('package.json', JSON.stringify(pkg, null, 2))
// 添加开启项目的说明 进入项目 安装依赖 启动项目
const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
const pkgManager = pkgInfo ? pkgInfo.name : 'npm'
console.log(`\nDone. Now run:\n`)
if (root !== cwd) {
  console.log(`  cd ${path.relative(cwd, root)}`)
}
switch (pkgManager) {
  case 'yarn':
    console.log('  yarn')
    console.log('  yarn dev')
    break
  default:
    console.log(`  ${pkgManager} install`)
    console.log(`  ${pkgManager} run dev`)
    break
}
```
##  event对象

```js
// 简单重写发布订阅模式
class Event {
  constructor() {
    this.cbs = new Map()
  }
  // 注册
  on(type, cb) {
    this.add(type, cb)
    console.log(this.cbs)
  }
  // once注册,返回一个实例,可链式调用
  once(type, cb) {
    this.cbs.set(type, cb)
    return this
  }
  // 触发
  emit(...argues) {
    const type = argues[0]
    const args = argues.slice(1)
    const cbs = this.cbs.get(type)
    if (cbs && Array.isArray(cbs)) {
      // 绑定this及参数
      cbs.forEach(cb => cb.apply(this, args))
    } else if (cbs && !Array.isArray(cbs)) {
      cbs.apply(this, args)
      this.removeListener(type)
    }
  }
  // 删除单一
  removeListener(type) {
    this.cbs.delete(type)
  }
  // 删除所有
  removeAllListeners() {
    for (let [key] of this.cbs) {
      this.removeListener(key)
    }
  }
  add(type, cb) {
    let res = this.cbs.get(type)
    if (!res) {
      this.cbs.set(type, [cb])
    } else {
      res.push(cb)
    }
  }
}

```


## prompts源码解析

### isNodeLT
```js
// 版本判断
function isNodeLT(tar) {
  tar = (Array.isArray(tar) ? tar : tar.split('.')).map(Number);
  let i=0, src=process.versions.node.split('.').map(Number);
  for (; i < tar.length; i++) {
    if (src[i] > tar[i]) return false;
    if (tar[i] > src[i]) return true;
  }
  return false;
}
module.exports =
  isNodeLT('8.6.0')
    ? require('./dist/index.js')
    : require('./lib/index.js');
```

### prompt
```js
async function prompt(questions=[]) {
  const answers = {};
  const override = prompt._override || {};
  // 合并问题为数组
  questions = [].concat(questions);
  let answer, question, quit, name, type, lastPrompt;

  const getFormattedAnswer = async (question, answer, skipValidation = false) => {
    if (!skipValidation && question.validate && question.validate(answer) !== true) {
      return;
    }
    return question.format ? await question.format(answer, answers) : answer
  };

  // 条件判断过程省略
  // 获取输入问题的答案prompts，并返回answer
  answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : await prompts[type](question);
  answers[name] = answer = await getFormattedAnswer(question, answer, true);
  return answers;
}
```

### prompts
```js
// prompts是一个对象根据输入的类型确定
const $ = exports = prompts = {
  text: args => toPrompt('TextPrompt', args),
  password: args => {
    args.style = 'password';
    return $.text(args);
  },
  number: args => toPrompt('NumberPrompt', args),
  ....
};
/**
 * 根据所传为text 
 *  {
      type: 'text',
      name: 'name',
      message: '请输入您的名字:'
    }
*/
const prompts = function toPrompt(type, args, opts={}) {
  return new Promise((res, rej) => {
    const p = new el[type](args);
    const onAbort = opts.onAbort || noop;
    const onSubmit = opts.onSubmit || noop;
    const onExit = opts.onExit || noop;
    // 注册事件
    p.on('state', args.onState || noop);
    p.on('submit', x => res(onSubmit(x)));
    p.on('exit', x => res(onExit(x)));
    p.on('abort', x => rej(onAbort(x)));
  });
}

// el 为一个对象，根据传入的type决定解析使用的模块
const el  = {
  TextPrompt: require('./text'),
  SelectPrompt: require('./select'),
  TogglePrompt: require('./toggle'),
  DatePrompt: require('./date'),
  NumberPrompt: require('./number'),
  MultiselectPrompt: require('./multiselect'),
  AutocompletePrompt: require('./autocomplete'),
  AutocompleteMultiselectPrompt: require('./autocompleteMultiselect'),
  ConfirmPrompt: require('./confirm')
}
```

### TextPrompt解析text

```js
action = (key, isSelect) => {
  if (key.meta && key.name !== 'escape') return;
  
  if (key.ctrl) {
    if (key.name === 'a') return 'first';
    if (key.name === 'c') return 'abort';
    if (key.name === 'd') return 'abort';
    if (key.name === 'e') return 'last';
    if (key.name === 'g') return 'reset';
  }
  
  if (isSelect) {
    if (key.name === 'j') return 'down';
    if (key.name === 'k') return 'up';
  }

  if (key.name === 'return') return 'submit';
  if (key.name === 'enter') return 'submit'; // ctrl + J
  if (key.name === 'backspace') return 'delete';
  if (key.name === 'delete') return 'deleteForward';
  if (key.name === 'abort') return 'abort';
  if (key.name === 'escape') return 'exit';
  if (key.name === 'tab') return 'next';
  if (key.name === 'pagedown') return 'nextPage';
  if (key.name === 'pageup') return 'prevPage';
  // TODO create home() in prompt types (e.g. TextPrompt)
  if (key.name === 'home') return 'home';
  // TODO create end() in prompt types (e.g. TextPrompt)
  if (key.name === 'end') return 'end';

  if (key.name === 'up') return 'up';
  if (key.name === 'down') return 'down';
  if (key.name === 'right') return 'right';
  if (key.name === 'left') return 'left';

  return false;
};

```
```js

// 继承
class TextPrompt extends Prompt {
  super(opts);
  // 开始执行
  this.render();
  this.value = ``
  render() {
    this.out.write(...)
  }
  // 结束
  abort() {
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }
}
// 继承事件函数event
class Prompt extends EventEmitter {
    super();
    // 输入输出
    this.in = process.stdin;
    this.out = process.stdout;
    const rl = readline.createInterface({ input:this.in, escapeCodeTimeout:50 });
    readline.emitKeypressEvents(this.in, rl);
    // 键盘事件
    const keypress = (str, key) => {
      // 根据action表判断输出
      let a = action(key, isSelect);
      if (a === false) {
        this._ && this._(str, key);
      } else if (typeof this[a] === 'function') {
        // 移动光标
        this[a](key);
      } else {
        // 输出
        this.bell();
      }
    };

    this.close = () => {
      this.out.write(cursor.show);
      this.in.removeListener('keypress', keypress);
      if (this.in.isTTY) this.in.setRawMode(false);
      rl.close();
      this.emit(this.aborted ? 'abort' : this.exited ? 'exit' : 'submit', this.value);
      this.closed = true;
    };
    // 监听键盘事件
    this.in.on('keypress', keypress);
    // 输入
    bell() {
      this.out.write(beep);
    }

}
```

### 简单实现prompts
```
url: './prompts'
```

### 递归方式
```js
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
```
