> 以下是一份「由浅入深」专为**React 资深前端面试**准备的「React 底层机制 + 源码导读」大纲。  
> 全部用**问答体**呈现，方便你直接拿来做 mock-interview；每段都标注了**面试官追问点**与**源码入口**，既能背“八股”，也能真正读代码。

---

## 🔧 热身：JSX → 真实 UI 到底跑了几步？

**Q1：写下一行 `<Button color="red">Click</Button>`，浏览器里发生了什么？**

1. 被 `@babel/preset-react` 编译成
   ```js
   React.createElement(Button, { color: 'red' }, 'Click');
   ```
2. `createElement` 返回**虚拟 DOM 对象**（`$$typeof: Symbol(react.element)`）
3. 在 `ReactDOM.render(<App />, container)` 里进入**Reconciler**
4. Reconciler 生成**Fiber 树**，Diff 后把「副作用队列」交给 **Renderer**
5. Renderer（`react-dom`）执行 DOM 增删改，最终 Paint

> 追问点：`$$typeof` 干嘛的？→ 防止 XSS，JSON 里插不进 Symbol

---

## ⚙️ 第一层：Fiber 架构总览（16+ 以后的核心）

**Q2：为什么重写 Stack Reconciler？Fiber 到底是什么？**

- **目标**：可中断 / 可恢复 / 优先级调度
- **数据结构**：每个节点对应一个 Fiber 对象，字段关键有
  ```ts
  type Fiber = {
    tag: WorkTag,         // 组件类型（Function/Class/HostRoot…）
    type: any,            // 真实构造函数
    return: Fiber | null, // 父节点
    child: Fiber | null,  // 第一个子节点
    sibling: Fiber | null,// 下一个兄弟
    alternate: Fiber | null, // 双缓冲，指向旧 fiber
    memoizedState: any,   // 已渲染状态（Hooks 时存链表）
    updateQueue: mixed,   // 待处理的 setState/useReducer 队列
    flags: Flags,         // 副作用标记（Placement|Update|Deletion…）
    lanes: Lanes,         // 优先级车道
    …
  }
  ```
- **双缓冲机制**：  
  正在渲染的 **workInProgress** ↔ 上一次提交的 **current**；`alternate` 把两棵树连起来，提交后原子切换 `root.current = workInProgress`，实现**无锁并发**。

> 源码入口：`packages/react-reconciler/src/ReactInternalTypes.js`

---

## 🧵 第二层：调度器 Scheduler——如何让动画不掉帧？

**Q3：「时间切片」怎么做到的？**

- 浏览器每一帧 16.6 ms，React 只拿 5 ms 做计算，到期让出主线程
- 实现靠 `MessageChannel` / `setTimeout` 模拟「宏任务」切片
- 优先级用 **Lanes**（31 位 bitmap）表示：  
  例如 `SyncLane = 0b00001`, `DefaultLane=0b01000`, `IdleLane=0b10000`
- 核心函数
  ```js
  function workLoopConcurrent() {
    while (workInProgress !== null && !shouldYield()) {
      performUnitOfWork(workInProgress);
    }
  }
  ```
  `shouldYield()` → 检查 `navigator.scheduling.timeRemaining() < 1`

> 追问点：React18 `startTransition` 把更新放进哪个 Lane？→ `TransitionLane`

---

## 🌳 第三层：Reconcile 阶段（可中断）

**Q4：beginWork / completeWork 干了啥？**

- **beginWork**（向下）  
  根据 `tag` 分发到对应 `updateXXXComponent`，生成子 Fiber，调用 `reconcileChildren`
- **completeWork**（向上冒泡）  
  创建对应 DOM 节点、打副作用标记（`flags |= Placement`），收集到 `subtreeFlags`

> 源码文件  
> `packages/react-reconciler/src/ReactFiberBeginWork.js`  
> `packages/react-reconciler/src/ReactFiberCompleteWork.js`

---

## 🧮 第四层：Diff 算法（三种“假设”保 O(n)）

**Q5：经典三问——同级、跨层、列表？**

1. **Tree Diff** 只比较同级，不跨层 → 复杂度从 O(n³) → O(n)
2. **Component Diff** 类型不同直接整棵砍掉重建
3. **Element Diff** 列表必须写 `key`，React 用**旧索引 → 新索引**映射，尽可能复用

> 源码函数：`reconcileChildrenArray()` 在 `ReactChildFiber.js`  
> 追问点：为什么 index 做 key 会翻车？→ 插入一条后所有 index 后移，导致误复用

---

## 🪝 第五层：Hooks 实现——useState 到底存在哪？

**Q6：Function Component 没有实例，状态挂在哪里？**

- 每个 Function 组件对应 Fiber，**`fiber.memoizedState` 指向一条单向链表**
  ```ts
  type Hook = {
    memoizedState: any; // 当前 state
    baseState: any; // 起始 state（用于 lanes 插队）
    queue: UpdateQueue<any>; // 待合并的 setState 循环链表
    next: Hook | null; // 下一个 hook
  };
  ```
- 调用顺序必须一致 → 为什么「条件语句中写 Hooks」会炸：链表顺序对不上
- `useEffect` 等副作用存在 `fiber.updateQueue` 中，commit 阶段统一执行

> 源码：`packages/react-reconciler/src/ReactFiberHooks.js`

---

## 📦 第六层：Commit 阶段（同步执行，不可打断）

**Q7：DOM 真正什么时候被插入？**

- **beforeMutation** → `getSnapshotBeforeUpdate`
- **mutation** → 遍历 `effectList` 执行 DOM 增删改
- **layout** → `useLayoutEffect`, `componentDidMount/Update`

> 文件  
> `ReactFiberCommitWork.js`  
> `ReactFiberWorkLoop.js` → `commitRootImpl()`

---

## 🧪 第七层：Concurrent Features（React 18）

**Q8：Suspense + Server Components 怎么把“水合”做成渐进式？**

- `createRoot` 开启 concurrent 模式，渲染可中断
- Suspense 边界让 React **等待子树异步资源**（fetch, lazy）时先渲染 fallback
- **Selective Hydration**：服务端流式输出 HTML，客户端按交互优先级** hydrate 对应组件**，未 hydrate 前事件代理到父级
- 源码新增 `ReactFizzServer.js`（服务端流式渲染）  
  `ReactFiberHydration.js`（水合对比）

---

## 🚑 第八层：调试源码技巧（给面试官秀肌肉）

- 本地 clone tag 对应版本
  ```bash
  git clone https://github.com/facebook/react
  cd react && yarn install
  yarn build-for-dev
  ```
- 用 `__DEV__` 开关 & `console.log` 追 `beginWork`
- Chrome 插件 **React DevTools Profiler** 可看 Lane、组件耗时
- VSCode 调试：把 `packages/react` 映射到 `sourceMap`，直接打断点进 `react-reconciler`

---

## 🎯 高频压轴追问 & 标准答

> **追问 1**：`setState` 是同步还是异步？  
> **答**：**“语义上是异步”**，React 会把多次调用合并成一次批量更新；但在 `setTimeout`、原生事件、async 里会退化成同步（不在同一事件循环）。源码里看 `ensureRootIsScheduled` → 是否走 `batchedUpdates`

> **追问 2**：为什么 useCallback 依赖变了返回新函数，却不会让子组件一定重渲染？  
> **答**：因为子组件**默认 props 浅比较**；如果子组件用 `React.memo` 包一层，且依赖不变，则 React 跳过该子树（`bailout` 逻辑在 `beginWork` 的 `checkScheduledUpdateOrContext`）

> **追问 3**：Fiber 树和 Virtual DOM 树是同一棵树吗？  
> **答**：不是。Virtual DOM = `React.createElement` 产出的**普通对象**，每次 render 会重新创建；Fiber 是**持久化数据结构**，跨渲染复用，用于存状态、副作用、队列等

---

## 📄 一句话收个尾（面试万能金句）

> “从 JSX 到像素，React 用**虚拟 DOM + 双缓冲 Fiber**把‘声明式’变成‘可中断指令’，再用**Scheduler**把指令切片喂给浏览器，**Commit** 阶段一次性同步刷到 DOM；  
> 理解这套流程，就能解释所有性能陷阱、Hook 规则、Concurrent 特性，甚至读源码不再迷路。”

祝你面试一刀清屏！
