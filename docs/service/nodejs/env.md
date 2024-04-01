---
customLabelArray: [1]
---

# <Label :level='1'/>Node 如何方便切换环境——环境变量（NODE_ENV）设置

```js
__dirname：表示当前执行脚本所在的目录
__filename：输出当前正在执行文件所在位置的绝对路径及文件名（包括后缀）
```

Node 如何方便切换环境——环境变量（NODE_ENV）设置
在公司，一个项目一般会有开发版本、测试版本、线上版本，每个版本可能都会对应不同的相关参数，或许数据库的连接地址不同，或许请求的 API 地址不同等等。为了方便管理，我们通常做成配置文件的形式，根据不同的环境，加载不同的文件。如果手动修改代码中加载配置文件的路径，这样会给人一种很 low 的感觉，下面我们将一下看起来逼格较为方便的做法。

启动 node 项目
首先，我们说一些基础性的知识。一个简单的 node 项目，会有一个 package.json 文件，用来保存项目的依赖包和一些项目描述的信息；会有一个入口主文件，用来启动项目。这边假设入口主文件为 app.js，启动项目的方法如下：

// 方法一
node app.js。
我们还有另外一种方式，通过 package.json 文件启动项目，下面我们看一下如何操作。

1、修改 package.json 文件
// 在 scripts 中添加 start 项，后面的值为启动 app.js 的命令
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1",
"start": "node app.js"
},
2、通过 npm 命令运行 node 项目
在控制台运行 npm run start，这样项目就可以启动了。这里的 start 就是上面 package.json 中的 start。

明明第一种方式很简单，为什么会有第二种这么繁琐的方式呢？存在即合理，因为第二种方式我们还可以做其他的操作。（下面开始进入正题了）

之前我们说要设置环境变量 NODE_ENV，第二种方法给我们带来了方案。例如，我们想把 NODE_ENV 设置成 development，我们可以修改上面的配置。

// 在 scripts 中添加 start 项，后面的值为启动 app.js 的命令
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1",
"start": "export NODE_ENV='development' && node app.js" // 在 Mac 和 Linux 上使用 export， 在 windows 上 export 要换成 set
},
这样我们在运行 npm run start 的时候，就会自动设置 NODE_ENV 的值为 development。设置了之后，我们如何获取呢？别急，接下来我们就说一下如何获取环境 NODE_ENV。

通过下面的方式，我们可以在 node 中打印出上面设置的 NODE_ENV 的值了

console.log(process.env.NODE_ENV); // development
现在，我们可以通过配置 package.json 来设置环境变量，又可以在代码中获取到 NODE_ENV 的值，所以可以我们可以轻松的切换环境啦。

package.json 配置

"scripts": {
"test": "echo \"Error: no test specified\" && exit 1",
"start": "export NODE_ENV='development' && node app.js",
"build": "export NODE_ENV='production' && node app.js"
}
npm run start 就是开发环境

npm run build 就是线上环境
