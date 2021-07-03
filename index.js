const inquirer = require('inquirer')
const db = require('./db.js')

module.exports.add = async (title) => {
    // 读取之前的任务
    const list = await db.read()
    // 添加一个title任务
    list.push({ title, done: false })
    // 存储任务到文件
    await db.write(list)
}

module.exports.clear = async () => {
    //写个空数组覆盖即可
    await db.write([])
}

function askForAction(list, index) {
    inquirer.prompt({
        type: 'list',
        name: 'action',// 用户选中后返回的value的名称
        message: '请选择操作',
        choices: [
            { name: '退出', value: 'quit' },
            { name: '已完成', value: 'markAsDone' },
            { name: '未完成', value: 'markAsUnDone' },
            { name: '修改标题', value: 'updateTitle' },
            { name: '删除任务', value: 'remove' },
        ],
    }).then(answer2 => {
        switch (answer2.action) {
            case 'markAsDone':
                list[index].done = true
                db.write(list)
                break;
            case 'markAsUnDone':
                list[index].done = false
                db.write(list)
                break;
            case 'updateTitle':
                // 更新标题需要一个输入框
                inquirer.prompt({
                    type: 'input',
                    name: 'title',
                    message: '设置新标题：',
                    default: list[index].title// 默认值为原标题
                }).then(answer => {
                    list[index].title = answer.title
                    db.write(list)
                })
                break;
            case 'remove':
                list.splice(index, 1)
                db.write(list)
                console.log('删除成功！')
                break;
        }
    })
}

function askForCreate(list) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '输入任务标题：'
    }).then(answer => {
        list.push({ title: answer.title, done: false })
        db.write(list)
    })
}

function printTasks(list) {
    inquirer// 制作控制台交互功能的库
        .prompt({
            type: 'list',
            name: 'index',// 
            message: '请选择你想操作的任务：',
            choices: [
                { name: '退出', value: '-1' },
                ...list.map((task, index) => { return { name: `${task.done ? '[x]' : '[_]'}-${index + 1}-${task.title}`, value: index.toString() } }),
                { name: '+创建任务', value: '-2' }
            ]
        }).then(answer => {
            const index = parseInt(answer.index)// 把选中的index转换成数字
            if (index >= 0) {
                // 说明选中了一个任务，继续进入操作列表
                // askForAction
                askForAction(list, index)
            } else if (index === -2) {
                // 说明选择的是创建任务
                // askForCreate
                askForCreate(list, index)
            }
        })
}

module.exports.showAll = async () => {
    // 读取之前的任务
    const list = await db.read()
    // 打印之前的任务，并变为可操作列表
    // printTasks
    printTasks(list)
}