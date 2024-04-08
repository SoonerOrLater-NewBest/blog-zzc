# blog-zzc

个人博客，记录和分享自己学习总结的内容，和一些好玩的东西

## 安装依赖

> COMPATIBILITY NOTE
> VuePress requires 8 >= Node.js <= 14.

### 安装环境及项目依赖

1. 安装环境 NodeJs(https://nodejs.org/en/)
2. 下载项目后进入目录安装依赖：

```bash
npm ci // 优先使用锁定版本的安装
npm install // 不锁定版本安装，可能有兼容问题
```

## 运行程序

- 在本目录下运行

```bash
npm run dev
```

- 访问`http://localhost:5050/`即可本地查看

## 自己开发提交代码

- 全局安装 cz

```bash
npm install -g commitizen
```

- 因为本项目装了`Commitizen`插件，想使用`git cz`命令必须全局安装，不安装也可以提交，但是必须符合规范，而`git cz`可以代替`git commit`命令并保证你的提交信息符合规范

## 发布网站

- 第一步，打包文件

```bash
npm run build
```

- 第二步，官方文档讲得很清楚，详见[部署文档](https://vuepress.vuejs.org/zh/guide/deploy.html#github-pages)

- 在本项目中执行`release`是发布到我的 github 主页

```bash
# 如果看了上述文档决定和我一样，就修改package.json/scripts/release指令后面的内容
npm run release
```

## 如何改造成自己的博客

- 如果想要用我这个项目，自己写文章的话，只要修改`docs`和`src/api`文件即可

```bash
docs/README.md #主页配置信息，改成自己的信息即可
docs/.vuepress/theme #这个可以不改，这是我用来修改和覆盖默认主题的
docs/.vuepress/public #这个是存静态资源的，可以删除然后添加你自己需要的，官方文档有讲解
docs/.vuepress/config.js #这个是配置信息，当然要改成你自己的，配合你的文章信息
docs/.vuepress/enhanceApp.js #应用级别的配置，自行添加
src/api #其实个人博客写了好几年了，一直是私有仓库（夹杂了很多未完待续的笔记和个人信息相关），这里之前放的是一些后端接口，以此获取一些动态数据和开关配置；公开后，删除了这些乱七八糟的东西，以静态数据提供支持，想实现接口的可以自行改造
```

- 欢迎 star 和使用，点个赞就是对我最大的支持，🙏🙏🙏

## 自定义组件及配置介绍

### 自定义 frontmatter

- customLabelArray:number[];[1,2,3] => 渲染文章列表 tags
- sidebarright:boolen; => 是否显示右边栏

**示例**

```md
---
customLabelArray: [3]
sidebarright: false
---
```

### 在 md 文件中使用自定义样式

比如 md 中链接格式是`[xxxx](.....)`默认样式是会换行的，但我想要他不换行

```html
<!-- xxxxxx.md -->
<div class="href-wrap">
  [xxxx](.....) [xxx](.....) [xx](.....)
</div>
```

```css
/* 外链自定义容器样式 */
.href-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.href-wrap p {
  margin: 2em 2em 0 0;
}
```
