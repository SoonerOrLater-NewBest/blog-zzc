---
customLabelArray: [1, 2, 3]
---

# <Label :level='1'/>前端工程化

[入门前端工程化](https://github.com/woai3c/Front-end-articles/issues/14)

## 规范

代码规范（检查代码规范）
项目规范（UI 规范）
git 规范（git commit 规范）

## 单元测试

## 部署

## 监控

监控，又分性能监控和错误监控，它的作用是预警和追踪定位问题。

[前端性能和错误监控](https://github.com/woai3c/Front-end-articles/blob/master/monitor.md)

### 性能监控

> 性能监控一般利用 window.performance 来进行数据采集
> 写几行代码来收集这些数据。

```js
// 收集性能信息
const getPerformance = () => {
  if (!window.performance) return;
  const timing = window.performance.timing;
  const performance = {
    // 重定向耗时
    redirect: timing.redirectEnd - timing.redirectStart,
    // 白屏时间
    whiteScreen: whiteScreen,
    // DOM 渲染耗时
    dom: timing.domComplete - timing.domLoading,
    // 页面加载耗时
    load: timing.loadEventEnd - timing.navigationStart,
    // 页面卸载耗时
    unload: timing.unloadEventEnd - timing.unloadEventStart,
    // 请求耗时
    request: timing.responseEnd - timing.requestStart,
    // 获取性能信息时当前时间
    time: new Date().getTime()
  };

  return performance;
};

// 获取资源信息
const getResources = () => {
  if (!window.performance) return;
  const data = window.performance.getEntriesByType('resource');
  const resource = {
    xmlhttprequest: [],
    css: [],
    other: [],
    script: [],
    img: [],
    link: [],
    fetch: [],
    // 获取资源信息时当前时间
    time: new Date().getTime()
  };

  data.forEach((item) => {
    const arry = resource[item.initiatorType];
    arry &&
      arry.push({
        // 资源的名称
        name: item.name,
        // 资源加载耗时
        duration: item.duration.toFixed(2),
        // 资源大小
        size: item.transferSize,
        // 资源所用协议
        protocol: item.nextHopProtocol
      });
  });

  return resource;
};
```

### 错误监控

现在能捕捉的错误有三种。

1. 资源加载错误，通过 addEventListener('error', callback, true) 在捕获阶段捕捉资源加载失败错误。
2. js 执行错误，通过 window.onerror 捕捉 js 错误。
3. promise 错误，通过 addEventListener('unhandledrejection', callback)捕捉 promise 错误，但是没有发生错误的行数，列数等信息，只能手动抛出相关错误信息。

```js
// 捕获资源加载失败错误 js css img...
addEventListener(
  'error',
  (e) => {
    const target = e.target;
    if (target != window) {
      monitor.errors.push({
        type: target.localName,
        url: target.src || target.href,
        msg: (target.src || target.href) + ' is load error',
        // 错误发生的时间
        time: new Date().getTime()
      });
    }
  },
  true
);

// 监听 js 错误
window.onerror = function (msg, url, row, col, error) {
  monitor.errors.push({
    type: 'javascript',
    row: row,
    col: col,
    msg: error && error.stack ? error.stack : msg,
    url: url,
    // 错误发生的时间
    time: new Date().getTime()
  });
};

// 监听 promise 错误 缺点是获取不到行数数据
addEventListener('unhandledrejection', (e) => {
  monitor.errors.push({
    type: 'promise',
    msg: (e.reason && e.reason.msg) || e.reason || '',
    // 错误发生的时间
    time: new Date().getTime()
  });
});
```

### 前端监控流程

`数据采集 --> 数据上报 --> 服务端处理 --> 数据库存储 --> 数据监控可视化平台`

### 性能数据上报

性能数据可以在页面加载完之后上报，尽量不要对页面性能造成影响。

```js
window.onload = () => {
  // 在浏览器空闲时间获取性能及资源信息
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      monitor.performance = getPerformance();
      monitor.resources = getResources();
    });
  } else {
    setTimeout(() => {
      monitor.performance = getPerformance();
      monitor.resources = getResources();
    }, 0);
  }
};
```

### 错误数据上报

我在 DEMO 里提供的代码，是用一个 errors 数组收集所有的错误，再在某一阶段统一上报（延时上报）。 其实，也可以改成在错误发生时上报（即时上报）。这样可以避免在收集完错误延时上报还没触发，用户却已经关掉网页导致错误数据丢失的问题。

```js
// 监听 js 错误
window.onerror = function (msg, url, row, col, error) {
  const data = {
    type: 'javascript',
    row: row,
    col: col,
    msg: error && error.stack ? error.stack : msg,
    url: url,
    // 错误发生的时间
    time: new Date().getTime()
  };

  // 即时上报
  axios.post({ url: 'xxx', data });
};
```

### 前端监控部署教程

sentry 是一个用 python 写的性能和错误监控工具，你可以使用 sentry 提供的服务（免费功能少），也可以自己部署服务。现在来看一下如何使用 sentry 提供的服务实现监控。

### 阿里云 SLS 日志服务

## 性能优化

[前端性能优化 24 条建议(2020)](https://zhuanlan.zhihu.com/p/121056616)

## 重构
