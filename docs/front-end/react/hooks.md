---
customLabelArray: [1]
---

# <Label :level='1'/>全面拥抱 React-Hooks

- 强烈建议至少刷一遍[《官方文档》](https://zh-hans.reactjs.org/docs/hooks-intro.html)，反复研读[《Hooks FAQ》](https://zh-hans.reactjs.org/docs/hooks-faq.html)
- 这里主要以本人关注点聚合，方便理解用于实践

## 一、React-Hooks 要解决什么？

**以下是上一代标准写法类组件的缺点，也正是 hook 要解决的问题**

- 大型组件很难拆分和重构，也很难测试。
- 业务逻辑分散在组件的各个方法之中，导致重复逻辑或关联逻辑。
- 组件类引入了复杂的编程模式，比如 Render props 和高阶组件

**设计目的**

- 加强版函数组件，完全不使用"类"，就能写出一个全功能的组件
- 组件尽量写成纯函数，如果需要外部功能和副作用，就用钩子把外部代码"钩"进来

## 二、如何用好 React-Hooks？

#### 明确几点概念

- 所有的 hook，在默认没有依赖项数组每次渲染都会更新
- 每次 Render 时 Props、State、事件处理、Effect 等 hooks 都遵循 Capture Value 的特性
- Render 时会注册各种变量，函数包括 hooks，N 次 Render 就会有 N 个互相隔离的状态作用域
- 如果你的 useEffect 依赖数组为[]，那么它初始化一次，且使用的 state，props 等永远是他初始化时那一次 Render 保存下来的值
- React 会确保 setState,dispatch,context 函数的标识是稳定的，可以安全地从 hooks 的依赖列表中省略

**Function Component 中每次 Render 都会形成一个快照并保留下来，这样就确保了状态可控，hook 默认每次都更新，会导致重复请求等一系列问题，如果给[]就会一尘不变，因此用好 hooks 最重要就是学会控制它的变化**

## 三、一句话概括 Hook API

- useState 异步设置更新 state
- useEffect 处理副作用（请求，事件监听，操作 DOM 等）
- useContext 接收一个 context 对象并返回该 context 的当前值
- useReducer 同步处理复杂 state，减少了对深层传递回调的依赖
- useCallback 返回一个 memoized 回调函数，避免非必要渲染
- useMemo 返回一个 memoized 值，使得控制具体子节点何时更新变得更容易，减少了对纯组件的需要，可替代 shouldComponentUpdate
- useRef 返回一个在组件的整个生命周期内保持不变 ref 对象，其 .current 属性是可变的，可以绕过 Capture Value 特性
- useLayoutEffect 其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect
- useImperativeHandle 应当与 forwardRef 一起使用，将 ref 自定义暴露给父组件的实例值
- useDebugValue 可用于在 React 开发者工具中显示自定义 hook 的标签

## 四、关注异同点

#### useState 与 this.setState

- 相同点：都是异步的，例如在 onClick 事件中，调用两次 setState，数据只改变一次。
- 不同点：类中的 setState 是合并，而 useState 中的 setState 是替换。

#### useState 与 useReducer

- 相同点：都是操作 state
- 不同点：使用 useState 获取的 setState 方法更新数据时是异步的；而使用 useReducer 获取的 dispatch 方法更新数据是同步的。
- 推荐：当 state 状态值结构比较复杂时，使用 useReducer

#### useLayoutEffect 与 useEffect

- 相同点：都是在浏览器完成布局与绘制之后执行副作用操作
- 不同点：useEffect 会延迟调用，useLayoutEffect 会同步调用阻塞视觉更新，可以使用它来读取 DOM 布局并同步触发重渲染
- 推荐：一开始先用 useEffect，只有当它出问题的时候再尝试使用 useLayoutEffect

#### useCallback 与 useMemo

- 相同点：都是返回 memoized，useCallback( fn, deps) 相当于 useMemo( ( ) => fn, deps)
- 不同点：useMemo 返回缓存的变量，useCallback 返回缓存的函数
- 推荐：不要过早的性能优化，搭配食用口味更佳（详见下文性能优化）

## 五、性能优化

**在大部分情况下我们只要遵循 React 的默认行为，因为 React 只更新改变了的 DOM 节点，不过重新渲染仍然花费了一些时间，除非它已经慢到让人注意了**

#### react 中性能的优化点在于：

- 1、调用 setState，就会触发组件的重新渲染，无论前后的 state 是否不同
- 2、父组件更新，子组件也会自动的更新

#### 之前的解决方案

基于上面的两点，我们通常的解决方案是：

- 使用 immutable 进行比较，在不相等的时候调用 setState；
- 在 shouldComponentUpdate 中判断前后的 props 和 state，如果没有变化，则返回 false 来阻止更新。
- 使用 React.PureComponent

#### 使用 hooks function 之后的解决方案

传统上认为，在 React 中使用内联函数对性能的影响，与每次渲染都传递新的回调会如何破坏子组件的 shouldComponentUpdate 优化有关， 使用 useCallback 缓存函数引用，再传递给经过优化的并使用引用相等性去避免非必要渲染的子组件时，它将非常有用

- 1、使用 React.memo 等效于 PureComponent，但它只比较 props，且返回值相反，true 才会跳过更新

```js
const Button = React.memo((props) => {
  // 你的组件
}, fn); // 也可以自定义比较函数
```

- 2、用 useMemo 优化每一个具体的子节点（详见实践 3）
- 3、useCallback Hook 允许你在重新渲染之间保持对相同的回调引用以使得 shouldComponentUpdate 继续工作（详见实践 3）
- 4、useReducer Hook 减少了对深层传递回调的依赖（详见实践 2）

#### 如何惰性创建昂贵的对象？

- 当创建初始 state 很昂贵时，我们可以传一个 函数 给 useState 避免重新创建被忽略的初始 state

```js
function Table(props) {
  // ⚠️ createRows() 每次渲染都会被调用
  const [rows, setRows] = useState(createRows(props.count));
  // ...
  // ✅ createRows() 只会被调用一次
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

- 避免重新创建 useRef() 的初始值，确保某些命令式的 class 实例只被创建一次：

```js
function Image(props) {
  // ⚠️ IntersectionObserver 在每次渲染都会被创建
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
function Image(props) {
  const ref = useRef(null);
  // ✅ IntersectionObserver 只会被惰性创建一次
  function getObserver() {
    if (ref.current === null) {
      ref.current = new IntersectionObserver(onIntersect);
    }
    return ref.current;
  }
  // 当你需要时，调用 getObserver()
  // ...
}
```

## 六、注意事项

#### Hook 规则

- 在最顶层使用 Hook
- 只在 React 函数中调用 Hook，不要在普通的 JavaScript 函数中调用
- 将条件判断放置在 hook 内部
- 所有 Hooks 必须使用 use 开头，这是一种约定，便于使用 ESLint 插件 来强制 Hook 规范 以避免 Bug;

```js
useEffect(function persistForm() {
  if (name !== '') {
    localStorage.setItem('formData', name);
  }
});
```

#### 告诉 React 用到了哪些外部变量，如何对比依赖

```js
useEffect(() => {
  document.title = 'Hello, ' + name;
}, [name]); // 以useEffect为示例，适用于所有hook
```

直到 name 改变时的 Rerender，useEffect 才会再次执行，保证了性能且状态可控

#### 不要在 hook 内部 set 依赖变量，否则你的代码就像旋转的菊花一样停不下来

```js
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id);
}, [count]); // 以useEffect为示例，适用于所有hook
```

#### 不要在 useMemo 内部执行与渲染无关的操作

- useMemo 返回一个 memoized 值,把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值，避免在每次渲染时都进行高开销的计算。
- 传入 useMemo 的函数会在渲染期间执行，请不要在这个函数内部执行与渲染无关的操作。

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

## 七、实践场景示例

实际应用场景往往不是一个 hook 能搞定的，长篇大论未必说的清楚，直接上例子（来源于官网摘抄，网络收集，自我总结）

#### 1、只想执行一次的 Effect 里需要依赖外部变量

**【将更新与动作解耦】-【useEffect，useReducer，useState】**

- 1-1、使用 setState 的函数式更新解决依赖一个变量

该函数将接收先前的 state，并返回一个更新后的值

```js
useEffect(() => {
  const id = setInterval(() => {
    setCount((c) => c + 1);
  }, 1000);
  return () => clearInterval(id);
}, []);
```

- 1-2、使用 useReducer 解决依赖多个变量

```js
import React, { useReducer, useEffect } from 'react';

const initialState = {
  count: 0,
  step: 1
};

function reducer(state, action) {
  const { count, step } = state;
  if (action.type === 'tick') {
    return { count: count + step, step };
  } else if (action.type === 'step') {
    return { count, step: action.step };
  } else {
    throw new Error();
  }
}
export default function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { count, step } = state;
  console.log(count);
  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <>
      <h1>{count}</h1>
      <input
        value={step}
        onChange={(e) => {
          dispatch({
            type: 'step',
            step: Number(e.target.value)
          });
        }}
      />
    </>
  );
}
```

#### 2、大型的组件树中深层传递回调

**【通过 context 往下传一个 dispatch 函数】-【createContext，useReducer，useContext】**

```js
/**index.js**/
import React, { useReducer } from 'react';
import Count from './Count';
export const StoreDispatch = React.createContext(null);
const initialState = {
  count: 0,
  step: 1
};

function reducer(state, action) {
  const { count, step } = state;
  switch (action.type) {
    case 'tick':
      return { count: count + step, step };
    case 'step':
      return { count, step: action.step };
    default:
      throw new Error();
  }
}
export default function Counter() {
  // 提示：`dispatch` 不会在重新渲染之间变化
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreDispatch.Provider value={dispatch}>
      <Count state={state} />
    </StoreDispatch.Provider>
  );
}

/**Count.js**/
import React, { useEffect, useContext } from 'react';
import { StoreDispatch } from '../index';
import styles from './index.css';

export default function (props) {
  const { count, step } = props.state;
  const dispatch = useContext(StoreDispatch);
  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]);
  return (
    <div className={styles.normal}>
      <h1>{count}</h1>
      <input
        value={step}
        onChange={(e) => {
          dispatch({
            type: 'step',
            step: Number(e.target.value)
          });
        }}
      />
    </div>
  );
}
```

#### 3、代码内聚，更新可控

**【层层依赖，各自管理】-【useEffect，useCallback，useContext】**

```js
function App() {
  const [count, setCount] = useState(1);
  const countRef = useRef(); // 在组件生命周期内保持唯一实例，可穿透闭包传值

  useEffect(() => {
    countRef.current = count; // 将 count 写入到 ref
  });
  // 只有countRef变化时，才会重新创建函数
  const callback = useCallback(() => {
    const currentCount = countRef.current; //保持最新的值
    console.log(currentCount);
  }, [countRef]);
  return <Parent callback={callback} count={count} />;
}
function Parent({ count, callback }) {
  // count变化才会重新渲染
  const child1 = useMemo(() => <Child1 count={count} />, [count]);
  // callback变化才会重新渲染，count变化不会 Rerender
  const child2 = useMemo(() => <Child2 callback={callback} />, [callback]);
  return (
    <>
      {child1}
      {child2}
    </>
  );
}
```

## 八、自定义 HOOK

#### 实现 this.setState 的 callback

```js
function useStateCallback(init) {
  const [state, setState] = useState(init);
  const ref = useRef(init);

  const handler = useCallback(
    (value, cb) => {
      setState(value);
      if (cb) {
        ref.current = value;
        cb(ref.current);
      }
    },
    [setState]
  );

  return [state, handler];
}
```

#### 获取上一轮的 props 或 state

```js
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

#### 只在更新时运行 effect

```js
function useUpdate(fn) {
  const mounting = useRef(true);
  useEffect(() => {
    if (mounting.current) {
      mounting.current = false;
    } else {
      fn();
    }
  });
}
```

#### 组件是否销毁

```js
function useIsMounted(fn) {
  const [isMount, setIsMount] = useState(false);
  useEffect(() => {
    if (!isMount) {
      setIsMount(true);
    }
    return () => setIsMount(false);
  }, []);
  return isMount;
}
```

#### 惰性初始化 useRef

```js
function useInertRef(obj) {
  // 传入一个实例 new IntersectionObserver(onIntersect)
  const ref = useRef(null);
  if (ref.current === null) {
    // ✅ IntersectionObserver 只会被惰性创建一次
    ref.current = obj;
  }
  return ref.current;
}
```

### hooks library

- [ahooks](https://ahooks.js.org/zh-CN)
- [react-use](https://github.com/streamich/react-use)

> 参考文章
>
> 1.  [精读《useEffect 完全指南》](https://segmentfault.com/a/1190000018639033#articleHeader20)
> 2.  [精读《Function VS Class 组件》](https://github.com/dt-fe/weekly/blob/master/95.%E7%B2%BE%E8%AF%BB%E3%80%8AFunction%20VS%20Class%20%E7%BB%84%E4%BB%B6%E3%80%8B.md)
> 3.  [精读《怎么用 React Hooks 造轮子》](https://github.com/dt-fe/weekly/blob/master/80.%E7%B2%BE%E8%AF%BB%E3%80%8A%E6%80%8E%E4%B9%88%E7%94%A8%20React%20Hooks%20%E9%80%A0%E8%BD%AE%E5%AD%90%E3%80%8B.md)
> 4.  [《React Hooks 使用详解》](https://juejin.im/post/5caaa8ffe51d452b2b027f8a#heading-20)
> 5.  [《useMemo 与 useCallback 使用指南》](https://zhuanlan.zhihu.com/p/66166173)
