---
customLabelArray: [1]
---

# <Label :level='1'/>Oclif 入门到实战

## 一、如何快速开发 CLI

CLI（Command Line Interface）命令行界面是在图形用户界面得到普及之前使用最为广泛的用户界面，它通常不支持鼠标，用户通过键盘输入指令，计算机接收到指令后，予以执行。也有人称之为字符用户界面（character user interface，CUI

## 二、Oclif 简介

Oclif 是由 Heroku（一个支持多种编程语言的云应用平台，在 2010 年被 Salesforce.com 收购）开发的 Node.js Open CLI 开发框架，它可以用来开发 single-command CLI 或 multi-command CLI，同时还提供了可扩展的插件机制和钩子机制。

- [官方文档](https://oclif.io/docs/commands)

## 三、CLI 类型

使用 Oclif 你可以创建两种不同类型的 CLI，即 Single CLIs 和 Multi CLIs。
Single CLIs 类似于 Linux 或 MacOS 平台中常见的 ls 或 cat 命令。
而 Multi CLIs 类似于前面提到的 Angular CLI 或 Vue CLI ，它们包含子命令，这些子命令本身也是 Single CLI。在 package.json 文件中有一个 oclif.commands 字段，该字段指向一个目录，该目录包含了当前 CLI 的所有子命令。
举个例子，假设你拥有一个名为 mycli 的 CLI，该 CLI 含有 mycli create 和 mycli destroy 两个子命令，那么你将拥有一个与下面类似的项目结构：

```js
package.json
src/
└── commands/
├── create.ts
└── destroy.ts
```

## 四、Oclif 用法

- 创建一个 single-command CLI：

```js
$ npx oclif single mynewcli
? npm package name (mynewcli): mynewcli
$ cd mynewcli
$ ./bin/run
hello world from ./src/index.js!
```

- 创建一个 multi-command CLI：

```js
$ npx oclif multi mynewcli
? npm package name (mynewcli): mynewcli
$ cd mynewcli
$ ./bin/run --version
mynewcli/0.0.0 darwin-x64 node-v9.5.0
$ ./bin/run --help
USAGE
$ mynewcli [COMMAND]
COMMANDS
hello
help   display help for mynewcli
$ ./bin/run hello
hello world from ./src/hello.js!
```

## 五、API Reference

### Command Methods

- this.log(message: string)
- this.warn(message: string | Error)
- this.error(message: string | Error, options?: {code?: string, exit?: number, ref?: string; suggestions?: string[];})
- this.exit(code: number = 0)

### Command Arguments

```ts
import Command from '@oclif/command'

export class MyCLI extends Command {
  static args = [
    {name: 'firstArg'},
    {name: 'secondArg'},
  ]

  async run() {
    // can get args as an object
    const {args} = this.parse(MyCLI)
    console.log(`running my command with args: ${args.firstArg}, ${args.secondArg}`)
    // can also get the args as an array
    const {argv} = this.parse(MyCLI)
    console.log(`running my command with args: ${argv[0]}, ${argv[1]}`)
  }
}
// Here are the options arguments can have:
static args = [
  {
    name: 'file',               // name of arg to show in help and reference with args[name]
    required: false,            // make the arg required with `required: true`
    description: 'output file', // help description
    hidden: true,               // hide this arg from help
    parse: input => 'output',   // instead of the user input, return a different value
    default: 'world',           // default value if no arg input
    options: ['a', 'b'],        // only allow the value to be from a discrete set
  }
]
```

### Command Flags

```ts
static flags = {
  name: flags.string({
    char: 'n',                    // shorter flag version
    description: 'name to print', // help description for flag
    hidden: false,                // hide from help
    multiple: false,              // 允许多次设置此标志
    env: 'MY_NAME',               // 环境变量的默认值
    options: ['a', 'b'],          // 只允许输入来自离散集
    parse: input => 'output',     // 返回不同的值，而不是用户输入
    default: 'world',             // default value if flag not passed
    required: false,              // make flag required (这并不常见，您可能应该改用参数)
    dependsOn: ['extra-flag'],    // 此标志需要另一个标志
    exclusive: ['extra-flag'],    // 此标志不能与其他某些标志一起指定
  }),

  // flag with no value (-f, --force)
  force: flags.boolean({
    char: 'f',
    default: true,
  }),
}
```

## 参考案例

- [f2elint](https://www.npmjs.com/package/f2elint)
- [Todocli](https://www.colabug.com/2020/0213/6985448/)
- [代码检测命令行工具](https://blog.csdn.net/astonishqft/article/details/103861087)
- [node-fetch 参考 fetch 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)
- [node](https://blog.csdn.net/qq_40560331/article/details/107332598)
