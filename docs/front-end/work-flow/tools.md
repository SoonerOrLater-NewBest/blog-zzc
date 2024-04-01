---
customLabelArray: [1]
---

# <Label :level='1'/>如何选择前端构建工具？

> 如何选择 Babel？Browserify？Webpack？Grunt？Gulp？，快速搭建一个前端编译环境

## 按功能分类

> 主要分为编译器、模块打包器、任务运行器，对应的工具推荐：

- 编译器：Babel 可以编译适配 ES6 代码
- 模块打包器：Webpack 能够打包 JavaScript 文件以及其相关的依赖
- 任务运行器：Gulp 能够自动化地将文件批量重命名，从而刷新静态资源文件的缓存

## 结合需求选择合适的构建工具

- 如果是小项目的话，直接上`Babel` ES6 编译器即可
- 如果是`TypeScript`项目的话，本身 tsc 可以编译 ES6，7，8，9...
- 如果是单页应用的话，还需要一个模块打包器
- 如果你的项目，部署在了生产环境之中，还需要一个能够自动执行的任务运行器

## 编译器

> ES5 版的 JavaScript 并不是那么优雅。尽管 ES6 与 ES7 有了非常大的提升，但是目前的浏览器并不支持 ES6 与 ES7。
> 将新的 JavaScript 代码转换成浏览器支持的 JavaScript 代码的工具就是编译器

- `Babel`最接近 JavaScript 官方代码风格
- `TypeScript` 编译后的代码是更符合习惯、简洁易读一些

## 模块打包器

日常开发中，我们将代码拆分到多个文件之中。尽管你可以使用 script 标签，来一个个地引入这些单独的 js 文件，同时根据依赖关系来决定它们引入的先后顺序。模块打包器就是将一些文件自动化地打包进一个单独的文件，而且比你做得更好

### Browserify

- Browserify 可以使得 Node packages 获得浏览器的支持，主要应用于 Node 项目
- 需要配合插件打包 CSS 、图片以及字体

### Webpack

- Webpack 是一个现代 JavaScript 应用程序的静态模块打包器，可以通过各种 loaders 来将各种资源文件都转换成 JavaScript 模块的神器。
- Webpack 处理应用程序时，它会在内部创建一个依赖图，并映射到项目需要的每个模块，然后将所有这些依赖生成到一个或多个 `bundle`

[26-lines](http://jamesknelson.com/webpack-made-simple-build-es6-less-with-autorefresh-in-26-lines/)

### Parcel

Parcel 是 Web 应用打包工具，适用于经验不同的开发者。它利用多核处理提供了极快的速度，并且不需要任何配置
[parcel 中文网](https://parceljs.org/getting_started.html)

## 任务运行器

> 任务运行器是用来定义并运行任务的工具

### Grunt

- Grunt 是最早的前端构建和原生构建工具之一，它拥有大量的插件，而且配置简单。
- 只需要找到适当的插件，加上适当的配置，就可以完成构建

### Gulp

- Gulp 是一个基于流的构建工具
- 适当的插件加上适量的流操作代码，可以管理复杂的任务

### Grunt 和 Gulp 的区别

- Grunt 通过 Gruntfile 进行配置，Gulp 通过 Gulpfile 进行编程
- 当通过 Grunt 配置的构建脚本无法胜任复杂且灵活的自定义任务时，使用 Gulp

## 相关知识点

### Bundless 及 Bundle 两种构建模式

- Bundless 即文件到文件的构建模式，它不会处理依赖，只对源码做平行编译输出。目前社区里的 tsc、unbuild 就是这样做的。Bundless 模式下的产物可以被项目选择性引入，同时也具备更好的可调试性，用户可以比较方便地了解项目结构。
- Bundle 即将源码打包的构建模式，它以入口文件作为起点、递归处理全部的依赖，然后将它们合并输出成统一的构建产物。目前社区里的 Webpack、Rollup 就是这样做的。Bundle 模式下的产物具备更好的一体性与稳定性，通常比较适合打包 umd 模块。

### CommonJS & UMD & ES Module

- CommonJS
  Node 应用采用的模块规范
  每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。
  值得一提的是，CommonJS 规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。AMD（Asynchronous Module Definition） 规范则是非同步加载模块，允许指定回调函数。由于 Node.js 主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以 CommonJS 规范比较适合。但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用 AMD 规范

  > CommonJS 特点：
  > 所有代码都运行在模块作用域，不会污染全局作用域。
  > 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
  > 模块加载的顺序，按照其在代码中出现的顺序。

* UMD

UMD（Universal Module Definition）提供了支持多种风格的“通用”模式，在兼容 CommonJS 和 AMD 规范的同时，还兼容全局引用的方式
UMD 实现原理很简单：

1. 先判断是否支持 AMD（define 是否存在），存在则使用 AMD 方式加载模块；
2. 再判断是否支持 Node.js 模块格式（exports 是否存在），存在则使用 Node.js 模块格式；
3. 前两个都不存在，则将模块公开到全局（window 或 global）

UMD 使得你可以直接使用 `<script>` 标签引用

- ES Module

ECMAScript 6 的一个目标是解决作用域的问题，也为了使 JS 应用程序显得有序，于是引进了模块。目前部分主流浏览器已原生支持 ES Module，使用 type = module 指定为模块引入即可
注意：使用该方式执行 JS 时自动应用 defer 属性

## 总结

- 本文只是简单介绍了一下前端构建工具，并不是要抛弃 Vue、React、Angular 等脚手架
- 尽管应用的构建相当重要，但从头编写构建代码，需要花费大量时间
- 我们在构建应用时，应优先使用框架自带的脚手架
- 需要编写某些特定功能时，应先找现成插件来实现
- 一般前端项目用 Webpack 配置化编译打包代码即可，复杂构建还是推荐 Gulp

### 参考文章

- [前端构建：3 类 13 种热门工具的选型参考](https://segmentfault.com/a/1190000017183743)

* [NPM 发包那些事](https://www.pipipi.net/29359.html)
* [father](https://github.com/umijs/father)
