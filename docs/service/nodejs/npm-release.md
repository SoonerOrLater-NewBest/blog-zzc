---
customLabelArray: [2, 3]
---

# <Label :level='3'/>NPM 发布和使用 CLI 工具

## 为什么要做 CLI 工具

设计 CLI 工具的真正强大之处在于可使用 Node 支持的一切能力（例如常用的文件系统、http 服务等），从而使得开发者有各种可发挥的空间：

- 例如一键生成脚手架项目
- 例如一键生成 / 更改源码文件
- 例如配套各种提供开放 API 的管理平台（例如 Mock、I18N、主题包管理等）实现本地项目和平台之间的信息同步能力
- 例如一键生成 Webpack / Babel / Git Hook 等配置文件信息
- ...

## 构建

首先新建 NPM CLI 工具的项目文件，执行 npm init 命令创建 package.json 描述文件，需要输入项目名称、版本、描述、项目入口文件（发布 CLI 工具并不需要 main 字段信息，该信息主要用于发布库包）、作者信息等：

其次需要配置 PATH 路径的可执行文件，在 package.json 里配置 bin 属性，该属性对应的是可执行文件的路径。例如将 bin 对应的可执行文件路径配置为当前项目下的 src/index.js：

```js
"bin": {
   // npm-cli-package 是一个可执行的命令，该命令指向了 src/index.js 脚本
   // 这里暂时还不清楚该脚本的环境解释器
   "npm-cli-package": "src/index.js"
},
```

> 温馨提示：当执行 npm link 或者安装 CLI 工具时，NPM 会为 bin 配置的文件创建一个软链接。 对于 Windows 系统，全局安装默认会在 C:\Users\{username}\AppData\Roaming\npm 目录下，局部安装则会在项目的 ./node_modules/.bin 目录下。

配置 bin 属性的模块路径后，可以开始设计可执行文件。为了使入口文件使用 Node 作为解释程序，需要在文件头部写入 #! /usr/bin/env node，目的是使用 env 来寻找操作系统中的 Node 启动路径，并将 Node 作为可执行文件的环境解释器。例如在 src/index.js 入口文件写入一个打印信息的 Node 脚本：

```js
#! /usr/bin/env node
console.info('npm-cli-package：', '1.0.0');
```

> 温馨提示：在 env 中包含了一些环境变量，包括我们安装的一些软件执行路径等，因此可以使用 env 来找到不同操作系统上的 Node 执行路径，从而让文件可被正常的解释和执行。

## 软链接

CLI 工具设计完成后，接下来是测试它能否被正常使用，此时可以通过 npm link 命令将其链接到全局执行环境，从而在系统的任意路径下可以使用该 CLI 工具。执行 npm link：

当执行 `npm link` 后，可以看到在 Mac 下该命令主要做了两件事：

为可执行文件 `src/index.js` 创建一个软链接，将其链接到 `/usr/local/bin/<package>`（ Windows 下是 `C:\Users\{username}\AppData\Roaming\npm\<package>` ）
为当前项目创建一个软链接，将其链接到 `/usr/local/lib/node_modules/<package>`（ Windows 下是 `C:\Users\{username}\AppData\Roaming\npm\node_modules\<package>` )

因此在全局环境执行 bin 配置的命令时，会启用 Node 去执行对应的可执行文件。

> 温馨提示：如果 bin 不配置执行的命令名称，默认将使用 pageage.json 中的 `<name>` 字段作为命令。

此时在任意位置执行 npm-cli-package 命令：

```js
$ npm-cli-package
npm-cli-package： 1.0.0
```

可以发现在当前项目外的任意路径都可以使用该命令成功打印信息，说明 Node 解释器和软链接都设置成功。

> 温馨提示：Windows 系统可以在用户目录 C:\Users\{username}\AppData\Roaming\npm\node_modules 下查看 npm-cli-package 包的软链接，并且可以在 C:\Users\{username}\AppData\Roaming\npm 中找到 npm-cli-package （Shell）和 npm-cli-package.cmd （Cmd）两个可执行文件。

## 发布

通过 `npm link` 以及命令行的使用测试，发现工具的设计没有任何问题，此时想将该其分享给他人使用，此时可以利用 NPM 包管理器的发布机制。在发布工具之前，需要在 NPM 官网 注册账号。注册成功后，在命令终端中使用 `npm login` 链接你注册的账号（ npm login 会将账号登录的证书信息保存在本地电脑，从而不需要再次登录账号），同时会在 NPM 的网站中生成你当前登录的 `token` 信息，登录后可以通过 `npm whoami` 命令查看当前登录账号名。

> 温馨提示：登录的时候不要使用 NPM 淘宝镜像地址，需要使用 NPM 官方地址，可以通过 npm config set registry https://registry.npmjs.org/ 命令设置成 NPM 官方的包发布地址。

`npm login` 后会在 NPM 官网产生 `token` 信息，接下来使用 `npm publish` 命令发布 CLI 工具:

此时查看 NPM 官网中的个人账号信息，可以发现发布了该工具的 1.0.0 版本。如果需要发布[Scope 包](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)，需要在 NPM 官网中创建一个组织

### 第一次发布流程

- 如果是第一次发布，运行 npm adduser，如果不是第一次发包，运行 npm login
- 进入项目文件夹下，运行 npm publish 发布（以下称为 publish_demo）

### 升级流程

- `npm view publish_demo versions` 查看远端已经发布的 publish_demo 包的版本
- 修改版本号：使用 `npm version <update_type>` 进行修改
- 使用 npm publish 上传到远端 npm
- 假设目前版本为 1.0.0，具体操作如下：

```js
/*
update_type 有三个参数
patch：补丁
minor：小版本
major：大版本
*/
npm version patch //1.0.1
npm version minor //1.1.0
npm version major //2.0.0
```

## 安装和使用

开发者通过 `npm install` 命令对工具进行全局安装

这只是一个简单的教程示例，真正设计的 CLI 工具可能需要考虑以下一些功能：

- 帮助信息：用于打印支持的命令、选项参数等
- 版本信息：用于告知使用者当前的 CLI 版本
- 环境检测：用于检测当前支持的解释器（Node）版本等
- 交互面板：提供当前命令的可选项
- 信息打印：提供各种语义颜色的打印信息
- ...

## CLI 实践案例

- [null-cli](https://webfansplz.github.io/null-cli/guide/introduce.html)

## 构建属于自己的 CLI 工具（计划）

[参考](https://www.jianshu.com/p/5d0eef9724e0)
