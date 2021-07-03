#!/usr/bin/env node
//添加蛇棒，告诉命令行使用什么运行
const program = require('commander')
const api = require('./index.js')
const pkg = require('./package.json')

program
    .version(pkg.version)
program
    .command('add')// add子命令
    .description('add a task')
    .action((...args) => {
        // 处理参数，去掉最后一个无用参数
        const words = args.slice(0, -1).join(' ')
        api.add(words).then(() => { console.log('添加成功') }, () => { console.log('添加失败') })
    });
program
    .command('clear')// clear子命令
    .description('clear all tasks')
    .action(() => {
        api.clear().then(() => { console.log('清除完毕') }, () => { console.log('清楚失败') })
    });

program.parse(process.argv)

// process.argv表示用户输入的参数（包括node、cli）
// console.log(process.argv)

if (process.argv.length === 2) {
    //说明用户只输入了 node cli
    api.showAll()
}