---
customLabelArray: [1]
---

# <Label :level='1'/>Vue 2.0 快速导航

## 官方文档

<div class="href-wrap">

[Vue 风格指南](https://cn.vuejs.org/v2/style-guide/)

[Vue-CLI](https://cli.vuejs.org/zh/guide/)

[Vuex](https://vuex.vuejs.org/zh/)

[Vue-Router](https://router.vuejs.org/zh/)

[Vue-Loader](https://vue-loader.vuejs.org/zh/)

[Vue-SSR](https://ssr.vuejs.org/zh/)

[Vue-API](https://cn.vuejs.org/v2/api/)

</div>

## Vue 2.0 源码相关

> 该部分转载于[https://github.com/answershuto/learnVue/](https://github.com/answershuto/learnVue/)

[Vue.js 响应式原理](./source/响应式原理.html)

[Vue.js 依赖收集](./source/依赖收集.html)

[从 Vue.js 源码角度再看数据绑定](./source/从源码角度再看数据绑定.html)

[Vue.js 事件机制](./source/Vue事件机制.html)

[VNode 节点(Vue.js 实现)](./source/VNode节点.html)

[Virtual DOM 与 diff(Vue.js 实现)](./source/VirtualDOM与diff.html)

[Vue.js 的 template 编译](./source/Vue的template编译.html)

[Vue.js 异步更新 DOM 策略及 nextTick](./source/Vue.js异步更新DOM策略及nextTick.html)

[Vue.js 源码角度看内部运行机制（从 template 到 DOM）](./source/Vue.js源码角度看内部运行机制.html)

[keep-alive 组件的使用及其实现原理](./source/keep-alive组件的使用及其实现原理.html)

## Vue 2.0 拓展阅读

<div class="href-wrap">

[Vue-小技巧](https://juejin.im/post/5ae02f39518825672f198ac2/)

[Vue-知识点](https://juejin.im/post/5d153267e51d4510624f9809/)

</div>

## Vue 3.0 + Vite 2.0

[vue3+vite2](https://segmentfault.com/a/1190000039304278)


* Vue2和Vue3的区别如下：

性能提升：Vue3在性能方面进行了优化，使用了Proxy代理，使得响应式系统更高效，可以更好地追踪并更新组件状态。

体积减小：Vue3对整体的体积进行了优化，将不常用的API进行了拆分，使得最终打包的文件更小。

Composition API：Vue3引入了Composition API，它允许开发者按照逻辑功能而非组件结构组织代码，更方便地复用代码逻辑。

Teleport：Vue3新增了Teleport组件，可以将组件的渲染结果挂载到DOM树中的任何位置，而不仅仅是组件所在的DOM节点。

Fragments：Vue3支持使用Fragments来返回多个根节点，而不需要在包裹一个额外的父节点。

更好的TypeScript支持：Vue3对TypeScript的支持更加友好，提供了更准确的类型推断和提示。

其他优化：Vue3在其它方面也进行了一些优化，例如编译优化、渲染优化和响应式系统优化等。
