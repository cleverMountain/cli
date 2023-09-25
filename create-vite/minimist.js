// 导入 minimist 模块
import minimist from 'minimist'
// 解析命令行参数
const args = minimist(process.argv.slice(2));

// 访问解析后的参数
console.log('Arguments:', args);
console.log('Input File:', args.input);
console.log('Output File:', args.output);
console.log('Verbose Mode:', args.verbose);
