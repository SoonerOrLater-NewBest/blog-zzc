# 无界微前端是如何渲染子应用的？

经过我们团队的调研，我们选择了**无界**作为微前端的技术栈。目前的使用效果非常好，不仅性能表现出色，而且使用体验也不错。

尽管在使用的过程中，我们也遇到了一些问题，但这些**问题往往源于我们对框架实现的不熟悉**。我们深入研究了无界技术的源码，并将在本文中与大家分享。本文将重点探讨**无界微前端如何渲染子应用的**。

---

## 无界渲染子应用的步骤

无界与其他微前端框架（例如 qiankun）的主要区别在于其独特的 JS 沙箱机制。**无界使用 iframe 来实现 JS 沙箱**，由于这个设计，无界在以下方面表现得更加出色：

- 应用切换没有清理成本
- 允许一个页面同时激活多个子应用
- 性能相对更优

无界渲染子应用，主要分为以下几个步骤：

1. 创建子应用 iframe
2. 解析入口 HTML
3. 创建 webComponent，并挂载 HTML
4. 运行 JS 渲染 UI

---

### 创建子应用 iframe

要在 iframe 中运行 JS，首先得有一个 iframe。

```javascript
export function iframeGenerator(
  sandbox: WuJie,
  attrs: { [key: string]: any },
  mainHostPath: string,
  appHostPath: string,
  appRoutePath: string
): HTMLIFrameElement {
  // 创建 iframe 的 DOM
  const iframe = window.document.createElement("iframe");
  // 设置 iframe 的 attr
  setAttrsToElement(iframe, {
      // iframe 的 url 设置为主应用的域名
      src: mainHostPath,
      style: "display: none",
      ...attrs,
      name: sandbox.id,
      [WUJIE_DATA_FLAG]: ""
  });
  // 将 iframe 插入到 document 中
  window.document.body.appendChild(iframe);

  const iframeWindow = iframe.contentWindow;

  // 停止 iframe 的加载
  sandbox.iframeReady = stopIframeLoading(iframeWindow).then(() => {
      // 省略其他内容
  }

  // 注入无界的变量到 iframeWindow，例如 __WUJIE
  patchIframeVariable(iframeWindow, sandbox, appHostPath);
  // 省略其他内容

  return iframe;
}
```

#### 创建 iframe 的主要流程：

1. 创建 iframe 的 DOM，并设置属性
2. 将 iframe 插入到 document 中（此时 iframe 会立即访问 src）
3. 停止 iframe 的加载（stopIframeLoading）

---

#### 为什么要停止 iframe 的加载？

因为要**创建一个纯净的 iframe，防止 iframe 被污染**，假如该 url 的 JS 代码声明了一些全局变量、函数，就可能影响到子应用的运行（假如子应用也有同名的变量、函数）。

---

#### 为什么 iframe 的 src 要设置为主应用的域名？

为了实现**应用间（iframe 间）通讯**，无界子应用**iframe 的 url 会设置为主应用的域名**（同域）。

- 主应用域名为 `a.com`
- 子应用域名为 `b.com`，但它对应的 iframe 域名为 `a.com`，所以要设置 `b.com` 的资源能够**允许跨域访问**

因此 iframe 的 `location.href` 并不是子应用的 url。

---

### 解析入口 HTML

**iframe 中运行 JS，首先要知道要运行哪些 JS**

我们可以通过**解析入口 HTML**来确定需要运行的 JS 内容。

假设有以下 HTML：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script defer="defer" src="./static/js/main.4000cadb.js"></script>
    <link href="./static/css/main.7d8ad73e.css" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

经过 `importHTML` 处理后，结果如下：

#### template 模板部分（去掉了所有的 script 和 style）：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- defer script https://wujie-micro.github.io/demo-react16/static/js/main.4000cadb.js replaced by wujie -->
    <!--  link https://wujie-micro.github.io/demo-react16/static/css/main.7d8ad73e.css replaced by wujie -->
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

#### getExternalScripts（获取所有内联和外部的 script）：

```javascript
[
    {
      async: false,
      defer: true,
      src: 'https://wujie-micro.github.io/demo-react16/static/js/main.4000cadb.js',
      module: false,
      crossorigin: false,
      crossoriginType: '',
      ignore: false,
      contentPromise: // 获取 script 内容字符串的 Promise
	}
]
```

#### getExternalStyleSheets（获取所有内联和外部的 style）：

```javascript
[
    {
        src: "https://wujie-micro.github.io/demo-react16/static/css/main.7d8ad73e.css",
        ignore: false,
        contentPromise: // 获取 style 内容字符串的 Promise
    }
]
```

---

#### 为什么要将 script 和 style 从 HTML 中分离？

- HTML 要作为 webComponent 的内容，挂载到微前端挂载点上
- 因为无界有插件机制，需要**单独对 js/style 进行处理**，再插入到 webComponent 中
- script 除了需要经过插件处理外，还需要**放到 iframe 沙箱中执行**，因此也要单独分离出来

---

### 创建 webComponent 并挂载 HTML

在执行 JS 前，需要先把 HTML 的内容渲染出来。

无界子应用是挂载在 `webComponent` 中的，其定义如下：

```javascript
class WujieApp extends HTMLElement {
  connectedCallback(): void {
    if (this.shadowRoot) return;
    const shadowRoot = this.attachShadow({ mode: "open" });
    const sandbox = getWujieById(this.getAttribute(WUJIE_DATA_ID));
    sandbox.shadowRoot = shadowRoot;
  }
  disconnectedCallback(): void {
    const sandbox = getWujieById(this.getAttribute(WUJIE_DATA_ID));
    sandbox?.unmount();
  }
}
customElements?.define("wujie-app", WujieApp);
```

然后创建 webComponent：

```javascript
export function createWujieWebComponent(id: string): HTMLElement {
  const contentElement = window.document.createElement("wujie-app");
  contentElement.setAttribute(WUJIE_DATA_ID, id);
  return contentElement;
}
```

为 HTML 创建 DOM：

```javascript
let html = document.createElement('html');
html.innerHTML = template; // template 为解析处理后的 HTML
```

插入 CSS：

```javascript
const processedHtml = await processCssLoaderForTemplate(iframeWindow.__WUJIE, html);
```

挂载到 shadowDOM：

```javascript
shadowRoot.appendChild(processedHtml);
```

---

### JS 的执行细节

#### 简单实现：

```javascript
export function insertScriptToIframe(
  scriptResult: ScriptObject | ScriptObjectLoader,
  iframeWindow: Window,
) {
  const { content } = scriptResult;

  const scriptElement = iframeWindow.document.createElement("script");
  scriptElement.textContent = content || "";

  const container = rawDocumentQuerySelector.call(iframeWindow.document, "head");
  container.appendChild(scriptElement);
}
```

---

#### 将 UI 渲染到 shadowRoot

现代前端框架（如 Vue）需要指定 DOM 作为挂载点：

```javascript
const app = createApp(Comp);
app.mount('#app');
```

但在无界中，iframe 中运行 `document.querySelector('#app')` 会查找不到 DOM，因为 UI 渲染在外部的 shadowRoot 中。

因此需要**代理 document 的 querySelector 方法**，使其从 shadowRoot 中查找：

```javascript
const proxyDocument = new Proxy(
  {},
  {
    get: function (_, propKey) {
      if (propKey === 'querySelector' || propKey === 'querySelectorAll') {
        return new Proxy(shadowRoot[propKey], {
          apply(target, ctx, args) {
            return target.apply(shadowRoot, args);
          }
        });
      }
    }
  }
);
```

---

#### 挟持 document 的属性/方法

通过 `Object.defineProperty` 重写 `querySelector` 等方法：

```javascript
Object.defineProperty(iframeWindow.Document.prototype, 'querySelector', {
  get: () => sandbox.proxyDocument['querySelector'],
  set: undefined
});
```

---

## 副作用的处理

无界通过创建代理对象、覆盖属性和函数等方式对原有的 JavaScript 对象进行挟持。所有处理必须在子应用 JS 运行之前执行。

### DOM 相关的副作用处理

- 修正相对 URL（如 `<img src="./images/test.png">`）
- 修正 shadowRoot 中的 head、body

### iframe 的副作用处理

- History API（如 `history.pushState`）
- window/document 属性/事件
- location 对象（使用 Proxy 代理）

---

## 总结

本文介绍了无界渲染子应用的步骤：

1. 创建子应用 iframe
2. 解析入口 HTML
3. 创建 webComponent，并挂载 HTML
4. 运行 JS 渲染 UI

并介绍了无界如何处理副作用的一些细节。

---

> ⚠️ 注意：  
> 目前主流的微前端框架多多少少都会有些问题，**还没有一种非常完美的方法实现微前端**。  
> 无界虽然设计思想更优秀，但也有局限性，例如必须允许跨域、location 对象无法挟持等。  
> 只有理解了无界的设计，才能更好地理解这些问题的本质原因，并知道如何去避免它们。
