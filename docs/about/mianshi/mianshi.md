### 浏览器从发起请求到渲染完成的全过程（前端面试精讲版）

> **面试题**：  
> “从你在地址栏输入一个 URL 到页面完全展示，中间发生了什么？请尽量详细，并解释白屏是什么、为什么会白屏、如何优化。”

---

## 🎯 总体流程图（先给面试官画个图）

```
输入URL
   ↓
DNS解析 → TCP三次握手 → TLS握手 → HTTP请求 → 下载HTML
   ↓
解析HTML → 构建DOM → 遇到CSS/JS资源 → 下载&解析 → 构建CSSOM → 渲染树 → 布局 → 绘制 → 合成
   ↓
页面展示
```

---

## 🔍 详细拆解 + 考点标注

---

### 1. 用户输入 URL & 回车

**考点**：

- **URL 解析**：协议、域名、端口、路径、hash、query。
- **缓存检查**：浏览器会先检查 **强缓存**（Cache-Control/Expires），命中则直接返回，**不发送请求**。

> **难点追问**：  
> “强缓存 vs 协商缓存的区别？优先级？”  
> “Cache-Control: no-cache 和 no-store 的区别？”

---

### 2. DNS 解析

**考点**：

- 浏览器缓存 → OS 缓存 → 本地 hosts → 递归查询 → 根域名 → 顶级域 → 权威 DNS。
- **DNS 预解析**：`<link rel="dns-prefetch" href="//example.com">`

> **难点追问**：  
> “DNS 查询用了什么协议？”（UDP，端口 53）  
> “DNS 解析耗时如何优化？”（预解析、HTTPDNS、DNS缓存）

---

### 3. TCP 三次握手 & TLS 握手（HTTPS）

**考点**：

- TCP：SYN → SYN-ACK → ACK
- TLS 1.2：ClientHello → ServerHello → Certificate → ServerKeyExchange → ClientKeyExchange → Finished
- TLS 1.3：简化到 1-RTT / 0-RTT（会话恢复）

> **难点追问**：  
> “TLS 握手为什么需要证书？”（非对称加密验证身份）  
> “TLS 1.3 为什么更快？”（减少 RTT，压缩算法，0-RTT）

---

### 4. HTTP 请求 & 响应

**考点**：

- 请求行、请求头、请求体
- 响应码：200、304、301、302、404、502
- **HTTP/2**：多路复用、头部压缩、服务器推送
- **HTTP/3**：基于 QUIC（UDP），解决队头阻塞

> **难点追问**：  
> “HTTP/2 的多路复用解决了什么问题？”（HTTP/1.1 的队头阻塞）  
> “HTTP/2 的优先级机制？”（stream dependency & weight）

---

### 5. 下载 HTML & 解析 DOM

**考点**：

- **流式解析**：边下载边解析，不必等完整 HTML。
- **预加载扫描器（Preload Scanner）**：提前发现 `<img>`、`<link>`、`<script>` 资源并发起请求。
- **DOM 构建**：Token → Node → DOM Tree

> **难点追问**：  
> “DOM 构建是深度优先还是广度优先？”（深度优先）  
> “如果 HTML 有 1MB 的 inline JS，会阻塞 DOM 构建吗？”（会，JS 执行会阻塞）

---

### 6. 遇到 CSS & JS 资源

**考点**：

- **CSS**：
  - 不阻塞 DOM 构建，但阻塞 **渲染**（CSSOM 必须构建完才能合成渲染树）。
  - 放在 `<head>` 是为了尽早构建 CSSOM。
- **JS**：
  - 默认阻塞 DOM 构建（因为可能修改 DOM）。
  - `async`：下载完立即执行，**不保证顺序**。
  - `defer`：DOM 构建完后执行，**保证顺序**。

> **难点追问**：  
> “为什么 CSS 会阻塞 JS 执行？”（因为 JS 可能读取样式，如 `getComputedStyle`）  
> “async 和 defer 的区别？画图说明。”

---

### 7. 构建 CSSOM

**考点**：

- CSS 也是树形结构，与 DOM 合并成 **渲染树（Render Tree）**。
- **样式计算**：匹配选择器、层叠、继承、计算最终值（computed style）。

> **难点追问**：  
> “选择器匹配是从右向左还是从左向右？”（从右向左，效率更高）  
> “为什么 CSSOM 构建慢？”（可能需要下载所有 CSS 文件，且样式计算复杂）

---

### 8. 构建渲染树（Render Tree）

**考点**：

- 只包含 **可见节点**（`display: none` 的节点不在渲染树中）。
- 每个节点包含 **样式信息** 和 **几何信息**（位置、大小）。

---

### 9. 布局（Layout / Reflow）

**考点**：

- 计算每个节点的 **精确位置** 和 **大小**。
- **回流（Reflow）**：元素几何信息改变，需重新布局。
- **重绘（Repaint）**：外观改变（如颜色），不需重新布局。

> **难点追问**：  
> “哪些操作会触发回流？”（改变宽高、字体、内容、窗口大小、获取某些属性如 `offsetTop`）  
> “如何减少回流？”（批量修改、使用 `transform` 代替 `top/left`、使用 `will-change`）

---

### 10. 绘制（Paint）

**考点**：

- 将渲染树节点拆分成 **绘制指令**（如 drawRect、drawText）。
- 绘制顺序：背景 → 边框 → 内容 → 轮廓（outline）。

---

### 11. 合成（Composite）

**考点**：

- 现代浏览器将页面拆成多个 **图层（Layer）**，独立绘制后合成。
- **合成线程（Compositor Thread）** 负责将图层合成为最终图像。
- **GPU 加速**：`transform`、`opacity`、`will-change` 会提升为独立图层，由 GPU 合成。

> **难点追问**：  
> “如何查看图层？”（Chrome DevTools → Layers 面板）  
> “为什么 `transform: translateZ(0)` 可以开启硬件加速？”（强制提升为独立图层）

---

## ⚠️ 白屏（Blank Screen）详解

### ✅ 白屏是什么？

从用户回车到 **首次绘制（FP, First Paint）** 之间，页面完全空白的时间段。

---

### ✅ 白屏发生的原因（按阶段）

| 阶段       | 原因                            | 优化手段                     |
| ---------- | ------------------------------- | ---------------------------- |
| DNS        | DNS 解析慢                      | DNS 预解析、HTTPDNS          |
| TCP/TLS    | 握手慢                          | 启用 TLS 1.3、会话复用       |
| 下载 HTML  | 服务器响应慢                    | CDN、SSR、缓存               |
| 下载 CSS   | CSS 文件大、阻塞渲染            | 内联关键 CSS、压缩、preload  |
| 下载 JS    | JS 阻塞 DOM                     | `defer`、代码拆分、SSR       |
| 构建 CSSOM | CSS 复杂                        | 减少选择器嵌套、压缩         |
| 字体加载   | FOIT（Flash of Invisible Text） | `font-display: swap`、预加载 |

---

### ✅ 白屏指标

- **FP（First Paint）**：首次绘制任何像素。
- **FCP（First Contentful Paint）**：首次绘制内容（如文字、图片）。
- **FMP（First Meaningful Paint）**：首次绘制有意义内容（如主要内容）。
- **LCP（Largest Contentful Paint）**：最大内容绘制时间（Core Web Vital）。

---

### ✅ 如何测量白屏？

- **Performance API**：
  ```javascript
  performance.getEntriesByType('paint')[0].startTime; // FP
  ```
- **Lighthouse / WebPageTest / Chrome DevTools**

---

### ✅ 白屏优化实战（面试必答）

| 优化手段                      | 说明                                              |
| ----------------------------- | ------------------------------------------------- |
| **SSR**                       | 服务端渲染，直接返回 HTML，减少 JS 执行时间。     |
| **预加载**                    | `<link rel="preload" href="main.css" as="style">` |
| **内联关键 CSS**              | 首屏样式内联，减少阻塞。                          |
| **代码拆分**                  | 按路由拆分 JS，减少首屏 JS 体积。                 |
| **使用 CDN**                  | 静态资源就近访问。                                |
| **减少 HTTP 请求**            | 合并文件、使用 HTTP/2。                           |
| **使用 `font-display: swap`** | 避免字体加载导致的白屏。                          |
| **骨架屏**                    | 用占位图提升感知性能。                            |

---

## 🧠 面试高频追问（压轴）

> **面试官**：  
> “你说 CSS 阻塞渲染，那我把 CSS 放在 `</body>` 前行不行？”  
> **你**：  
> “不行，这样会导致 **无样式内容闪烁（FOUC）**，浏览器会先渲染 HTML，等 CSS 下载完再重新绘制，用户体验差。”

---

> **面试官**：  
> “你说 `async` 不保证顺序，那如果我有 jQuery 和依赖它的插件，怎么办？”  
> **你**：  
> “用 `defer`，或者把脚本合并，或者用模块加载器（如 Webpack 的 `splitChunks` + `runtimeChunk`）。”

---

> **面试官**：  
> “你说 `transform` 不会触发回流，那它会触发什么？”  
> **你**：  
> “只会触发 **合成**，因为 `transform` 和 `opacity` 属于 **合成属性**，它们的变化只影响图层合成，不影响布局。”

---

## ✅ 总结一句话（面试收尾）

> “白屏的本质是 **浏览器在构建渲染树之前无法绘制任何内容**，优化白屏的核心是 **减少关键渲染路径的阻塞和延迟**。”
