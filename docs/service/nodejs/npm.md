---
customLabelArray: [1, 3]
---

# <Label :level='1'/>NPM 包管理器

NPM 包管理器允许用户将自己编写的通用包或 CLI 工具上传到 NPM 服务器，其他开发人员只需要下载并安装该 CLI 工具到本地即可使用。

需要注意的是 NPM 包的安装可以分为本地和全局两种方式。采用本地安装可以将发布的 CLI 工具加入到项目的开发态依赖列表。采用全局方式进行安装会将 NPM CLI 工具的命令链接到全局执行环境。

> 温馨提示：采用本地安装更多的可能是在项目中配合 NPM 脚本使用，并且可固化工具的功能版本。采用全局安装更多的是进行类似初始化的功能，例如 vue-cli、create-react-app、express-generator 等，此时 Node 脚本不会植入到项目中，而是存放在操作系统的用户文件夹中。

## 学习资源

通过学习 npm 包，取长补短，进阶 nodeJS

[小而美的 NPM 包](https://github.com/parro-it/awesome-micro-npm-packages)

<!-- more -->

## 分类

### 1.now

- [官方文档](https://zeit.co/home/)
- 全局安装 npm i -g now <CopyBoard text="npm i -g now"/>

### 2.cross-env

- yarn add cross-env --dev <CopyBoard text="yarn add cross-env --dev"/>

### 3.moment

日期时间处理

- [官方文档](http://momentjs.cn/docs/#/use-it/)
- [快速上手](https://www.jianshu.com/p/e5b7c0606a3f/)

### 4.lodash

js 工具库

- [中文文档](https://www.lodashjs.com/docs/latest#_chunkarray-size1/)

### 5.pm2

- 全局安装 npm i -g pm2 <CopyBoard text="npm i -g pm2"/>
- 守护进程运行 cross-env NODE_ENV=production pm2 start app.js<CopyBoard text="cross-env NODE_ENV=production pm2 start app.js"/>

```js
pm2 list // 查看管理的进程
pm2 stop all // 停止所有进程
pm2 delete all // 删除所有进程
```

### 6、superagent

是个 http 方面的库，可以发起 get 或 post 请求

- [superagent](http://visionmedia.github.io/superagent/)

### 7、cheerio

大家可以理解成一个 Node.js 版的 jquery，用来从网页中以 css selector 取数据，使用方式跟 jquery 一样一样的。

- [cheerio](https://github.com/cheeriojs/cheerio)

### 8、eventproxy

- 用 js 写过异步的同学应该都知道，如果你要并发异步获取两三个地址的数据，并且要在获取到数据之后，对这些数据一起进行利用的话，常规的写法是自己维护一个计数器。

- 先定义一个 var count = 0，然后每次抓取成功以后，就 count++。如果你是要抓取三个源的数据，由于你根本不知道这些异步操作到底谁先完成，那么每次当抓取成功的时候，就判断一下 count === 3。当值为真时，使用另一个函数继续完成操作。

- 而 eventproxy 就起到了这个计数器的作用，它来帮你管理到底这些异步操作是否完成，完成之后，它会自动调用你提供的处理函数，并将抓取到的数据当参数传过来。
- [eventproxy](https://github.com/JacksonTian/eventproxy)

### 9、async

- [async](https://github.com/caolan/async)
- [async demo 演示](https://github.com/alsotang/async_demo)

### 10、coordtransform

一个提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和 WGS84 坐标系之间的转换的工具模块。

- [README](https://www.npmjs.com/package/coordtransform)

```js
import coordtransform from 'coordtransform';
// 转高德坐标系
function transformPosition(coordinateSystem, longitude, latitude) {
  switch (coordinateSystem) {
    case 'WGS_84': {
      return coordtransform.wgs84togcj02(longitude, latitude);
    }
    case 'BD_09': {
      return coordtransform.bd09togcj02(longitude, latitude);
    }
    default: {
      return [longitude, latitude];
    }
  }
}
```

### 11、font-spider（字蛛）

字蛛是一个智能 WebFont 压缩工具，它能自动分析出页面使用的 WebFont 并进行按需压缩。

- [README](https://github.com/aui/font-spider/blob/master/README-ZH-CN.md)

1. 压缩字体：智能删除没有被使用的字形数据，大幅度减少字体体积
2. 生成字体：支持 woff2、woff、eot、svg 字体格式生成

### 12、glob

用来同步获取文件

```ts
import * as glob from 'glob';
const files = glob.sync('*/', { cwd: absDir });
```

- [github](https://github.com/isaacs/node-glob)

### 13、Inquirer

NodeJs 交互式命令行工具 Inquirer.js

- [开箱指南-简书](https://www.jianshu.com/p/db8294cfa2f7)
- [github](https://github.com/SBoudrias/Inquirer.js)

### 14、React-ace

Ace 是一个用 JavaScript 编写的可嵌入代码编辑器。它与 Sublime，Vim 和 TextMate 等本机编辑器的功能和性能相匹配。它可以轻松地嵌入任何网页和 JavaScript 应用程序中，React-Ace 是 Ace 的 react 封装版本，使用简单，方便配合 form 表单使用。

- [github](https://github.com/securingsincity/react-ace)
