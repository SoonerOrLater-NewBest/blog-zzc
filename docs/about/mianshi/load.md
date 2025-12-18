**React.StrictMode 和无界（Wujie）微前端框架之间存在兼容性问题**

## 🔍 为什么无界不支持 React.StrictMode？

### 1. StrictMode 的双重渲染机制

React.StrictMode 会在开发环境下**故意渲染两次组件**，目的是：

- 检测不安全的生命周期方法
- 发现意外的副作用
- 检查过时的 API 使用

这对于无界来说是个问题，因为：

```jsx
// StrictMode 会导致这样的渲染行为
<React.StrictMode>
  <App>
    <WujieComponent /> // 第一次渲染和挂载
    <WujieComponent /> // 第二次渲染和卸载/重新挂载
  </App>
</React.StrictMode>
```

### 2. 无界的生命周期冲突

无界微前端框架依赖于精确的生命周期控制：

```javascript
// 无界的预期生命周期
beforeLoad → beforeMount → afterMount → (用户交互) → beforeUnmount → afterUnmount
```

但在 StrictMode 下，变成了：

```javascript
// StrictMode 下的异常生命周期
beforeLoad → beforeMount → afterMount → beforeUnmount → afterUnmount → beforeLoad → beforeMount → afterMount
```

### 3. DOM 操作的冲突

无界需要创建和管理 iframe/WebComponent，而 StrictMode 的双重渲染会导致：

- DOM 节点被重复创建和销毁
- 事件监听器被重复绑定和移除
- 微前端沙箱环境被意外破坏

## 📋 无界对 React 版本的要求

根据无界官方文档和实际使用经验：

### 支持的 React 版本

- **React 16.8+** (需要支持 Hooks)
- **React 17.x** (完全兼容)
- **React 18.x** (完全兼容，但需要处理 StrictMode)

### 关键依赖版本要求

```bash
# 推荐的无界和 React 版本组合
npm install wujie-react@^1.0.0 --save
npm install react@^17.0.0 --save
npm install react-dom@^17.0.0 --save

# 或者对于 React 18
npm install wujie-react@latest --save
npm install react@^18.0.0 --save
npm install react-dom@^18.0.0 --save
```

## 🛠️ 解决方案

### 方案1: 禁用 StrictMode（推荐）

```jsx
// src/index.js 或 src/main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 移除 React.StrictMode
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); // 直接渲染 App，不加 StrictMode
```

### 方案2: 在特定环境中禁用

```jsx
// 根据环境变量决定是否使用 StrictMode
const RootApp =
  process.env.NODE_ENV === 'production'
    ? App
    : () => (
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RootApp />);
```

### 方案3: 使用自定义 StrictMode

```jsx
// 创建一个不影响无界的自定义 StrictMode
const SafeStrictMode = ({ children }) => {
  const [shouldStrict, setShouldStrict] = useState(false);

  useEffect(() => {
    // 检测是否在无界环境中
    const isInMicroFrontend = window.__POWERED_BY_WUJIE__;
    setShouldStrict(!isInMicroFrontend);
  }, []);

  return shouldStrict ? <React.StrictMode>{children}</React.StrictMode> : children;
};

// 使用
root.render(
  <SafeStrictMode>
    <App />
  </SafeStrictMode>
);
```

## 📊 兼容性检查清单

| 项目         | 状态        | 说明                |
| ------------ | ----------- | ------------------- |
| React 16.8+  | ✅ 支持     | 需要 Hooks 支持     |
| React 17.x   | ✅ 完全兼容 | 推荐版本            |
| React 18.x   | ⚠️ 条件兼容 | 需要处理 StrictMode |
| StrictMode   | ❌ 不兼容   | 需要禁用            |
| React Router | ✅ 支持     | 需要正确配置        |
