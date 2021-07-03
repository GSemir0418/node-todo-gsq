// 获取用户home目录
const homedir = require('os').homedir()
// 获取home的环境变量(如果没有再去系统默认的home目录)
const home = process.env.HOME || homedir
// 引入读文件的api
const fs = require('fs')
// 路径的拼接，以适配不同系统的路径格式
const p = require('path')
const dbPath = p.join(home, '.todo')

const db = {
    read(path = dbPath) {// 默认参数
        return new Promise((resolve, reject) => {
            // 读取之前的任务
            fs.readFile(path, { flag: 'a+' }, (error, data) => {// 'a+'表示读文件追加文件内容以及创建文件的读取模式
                if (error) return reject(error)
                // 如果文件是空的，则创建一个数组来存数据
                let list
                try {
                    // 尝试让list等于data中的数组
                    list = JSON.parse(data.toString())

                } catch (error) {
                    // 如果出现错误，则让list成为空数组
                    list = []// 这是个异步函数，list不能直接返回，因为这是存在于回调函数中的
                }
                resolve(list)// 如果成功了，则解析并返回list在外面
            }
            )

        })
    },

    write(list, path = dbPath) {
        new Promise((resolve, reject) => {
            // 需要将list解析为字符串，因为不支持写入数组
            const string = JSON.stringify(list)
            // 把string写到文件中
            fs.writeFile(path, string + '\n', (error) => {
                if (error)  return reject(error) // return表示如果到这个if里面的话就终止，不用往后面走了
                resolve()
            })
        })
    }
}
module.exports = db