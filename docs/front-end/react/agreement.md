---
customLabelArray: [1, 3]
---

# <Label :level='1'/>React 编码约定(我的)

## 组件的内容编写顺序

1. static 开头的类属性，如 defaultProps、propTypes
2. 构造函数，constructor
3. getter/setter
4. 组件生命周期
5. \_ 开头的私有方法
6. 事件监听方法，handle\*
7. render* 开头的方法，有时候 render() 方法里面的内容会分开到不同函数里面进行，这些函数都以 render* 开头
8. render() 方法

## 编码流程

**1. 将设计好的 UI 划分为组件层级**

**2. 用 React 创建一个静态版本**

- 最好将渲染 UI 和添加交互这两个过程分开。这是因为，编写一个应用的静态版本时，往往要编写大量代码，而不需要考虑太多交互细节；添加交互功能时则要考虑大量细节，而不需要编写太多代码
- 当应用比较简单时，使用自上而下的方式更方便；对于较为大型的项目来说，自下而上地构建，并同时为低层组件编写测试是更加简单的方式

**3. 确定 UI state 的最小（且完整）表示**

- 只保留应用所需的可变 state 的最小集合，其他数据均由它们计算产生

```md
通过问自己以下三个问题，你可以逐个检查相应数据是否属于 state：

1. 该数据是否是由父组件通过 props 传递而来的？如果是，那它应该不是 state。
2. 该数据是否随时间的推移而保持不变？如果是，那它应该也不是 state。
3. 你能否根据其他 state 或 props 计算出该数据的值？如果是，那它也不是 state。
```

**4. 确定 state 放置的位置**

- React 中的数据流是单向的，并顺着组件层级从上往下传递
- 放在组件层级上高于所有需要该 state 的组件

**5. 添加反向数据流**

- 由于 state 只能由拥有它们的组件进行更改，父组件必须将一个能够触发 state 改变的回调函数（callback）传递给子组件

## 事件处理

你必须谨慎对待 JSX 回调函数中的 this，在 JavaScript 中，class 的方法默认不会绑定 this

1. 绑定 this，推荐使用 bind 或 class fields 正确的绑定回调函数：

```js
class LoggingButton extends React.Component {
  handleClick = () => {
    console.log('this is:', this);
  };

  render() {
    return <button onClick={this.handleClick}>Click me</button>;
  }
}
```

2. 向事件处理程序传递参数，推荐通过 bind 的方式，事件对象以及更多的参数将会被隐式的进行传递

```html
<button onClick="{this.deleteRow.bind(this," id)}>Delete Row</button>
```

## 列表 & Key

**元素的 key 只有放在就近的数组上下文中才有意义**

- 一个好的经验法则是：在 map() 方法中的元素需要设置 key 属性
- key 只是在兄弟节点之间必须唯一
- [深入解析为什么 key 是必须的](https://zh-hans.reactjs.org/docs/reconciliation.html)
- [深度解析使用索引作为 key 的负面影响](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318)

## 注意事项

:::warning 警告
因为 JSX 语法上更接近 JavaScript 而不是 HTML，所以 React DOM 使用 camelCase（小驼峰命名）来定义属性的名称，而不使用 HTML 属性名称的命名约定

例如，JSX 里的 class 变成了 className，而 tabindex 则变为 tabIndex
:::

:::warning
**注意： 组件名称必须以大写字母开头**

React 会将以小写字母开头的组件视为原生 DOM 标签。例如，`<div />` 代表 HTML 的 div 标签，而 `<Welcome />` 则代表一个组件，并且需在作用域内使用 Welcome
:::

-------------------草稿--------------------
组件导出用 export，路由用
export default
