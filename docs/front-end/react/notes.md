---
customLabelArray: [3]
---

# React 学习笔记

## 一、安装配置依赖

```bash
npm install -g create-react-app

create-react-app hello-react

npm config set registry https://registry.npm.taobao.org
```

## 二、JSX 原理

**所谓的 JSX 其实就是 JavaScript 对象**

### 如何用 JavaScript 对象来表现一个 DOM 元素的结构

```js
<div class='box' id='content'>
  <div class='title'>Hello</div>
  <button>Click</button>
</div>

// 其实上面这个 HTML 所有的信息我们都可以用合法的 JavaScript 对象来表示：

{
  tag: 'div',
  attrs: { className: 'box', id: 'content'},
  children: [
    {
      tag: 'div',
      arrts: { className: 'title' },
      children: ['Hello']
    },
    {
      tag: 'button',
      attrs: null,
      children: ['Click']
    }
  ]
}
```

### 编译的过程

```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Header extends Component {
  render() {
    return (
      <div>
        <h1 className="title">React 小书</h1>
      </div>
    );
  }
}

ReactDOM.render(<Header />, document.getElementById('root'));

// 经过编译以后会变成：

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Header extends Component {
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement('h1', { className: 'title' }, 'React 小书')
    );
  }
}

ReactDOM.render(React.createElement(Header, null), document.getElementById('root'));
```

### 总结几个点：

1. JSX 是 JavaScript 语言的一种语法扩展，长得像 HTML，但并不是 HTML。
2. React.js 可以用 JSX 来描述你的组件长什么样的。
3. JSX 在编译的时候会变成相应的 JavaScript 对象描述。
4. react-dom 负责把这个用来描述 UI 信息的 JavaScript 对象变成 DOM 元素，并且渲染到页面上。

## 三、组件的 render 方法

::: tip
React.js 中一切皆组件，用 React.js 写的其实就是 React.js 组件。我们在编写 React.js 组件的时候，一般都需要继承 React.js 的 Component（还有别的编写组件的方式我们后续会提到）。一个组件类必须要实现一个 render 方法，这个 render 方法必须要返回一个 JSX 元素。
:::

- 返回并列多个 JSX 元素是不合法的

```js
render () {
  return (
    <div>第一个</div>
    <div>第二个</div>
  )
}
```

- 必须要用一个外层元素把内容进行包裹

```js
render () {
  return (
    <div>
      <div>第一个</div>
      <div>第二个</div>
    </div>
  )
}
```

- 在 JSX 当中你可以插入 JavaScript 的表达式

```js
render () {
  const word = 'is good'
  return (
    <div>
      <h1>React 小书 {word}</h1>
    </div>
  )
}

render () {
  return (
    <div>
      <h1>React 小书 {(function () { return 'is good'})()}</h1>
    </div>
  )
}

render () {
  const className = 'header'
  return (
    <div className={className}>
      <h1>React 小书</h1>
    </div>
  )
}

// 条件返回

render () {
  const isGoodWord = true
  return (
    <div>
      <h1>
        React 小书
        {isGoodWord
          ? <strong> is good</strong>
          : <span> is not good</span>
        }
      </h1>
    </div>
  )
}

render () {
  const isGoodWord = true
  return (
    <div>
      <h1>
        React 小书
        {isGoodWord
          ? <strong> is good</strong>
          : null // 表示不渲染
        }
      </h1>
    </div>
  )
}

// JSX 元素变量

render () {
  const isGoodWord = true
  const goodWord = <strong> is good</strong>
  const badWord = <span> is not good</span>
  return (
    <div>
      <h1>
        React 小书
        {isGoodWord ? goodWord : badWord}
      </h1>
    </div>
  )
}
```

## 四、组件的组合、嵌套和组件树

**自定义的组件都必须要用大写字母开头，普通的 HTML 标签都用小写字母开头**

## 五、事件监听

::: tip
在 React.js 里面监听事件是很容易的事情，你只需要给需要监听事件的元素加上属性类似于 onClick、onKeyDown 这样的属性,React.js 封装了不同类型的事件，可以参考官网文档
:::
[SyntheticEvent - React](https://reactjs.org/docs/events.html#supported-events)

**没有经过特殊处理的话，这些 on 的事件监听只能用在普通的 HTML 的标签上，而不能用在组件标签上**

**另外要注意的是，这些事件属性名都必须要用驼峰命名法**

### event 对象

和普通浏览器一样，事件监听函数会被自动传入一个 event 对象，这个对象和普通的浏览器 event 对象所包含的方法和属性都基本一致。不同的是 React.js 中的 event 对象并不是浏览器提供的，而是它自己内部所构建的。React.js 将浏览器原生的 event 对象封装了一下，对外提供统一的 API 和属性，这样你就不用考虑不同浏览器的兼容性问题

### 关于事件中的 this

一般在某个类的实例方法里面的 this 指的是这个实例本身。但是你在上面的 handleClickOnTitle 中把 this 打印出来，你会看到 this 是 null 或者 undefined

```js
 handleClickOnTitle (e) {
    console.log(this) // => null or undefined
  }
```

这是因为 React.js 调用你所传给它的方法的时候，并不是通过对象方法的方式调用（this.handleClickOnTitle），而是直接通过函数调用 （handleClickOnTitle），所以事件监听函数内并不能通过 this 获取到实例。

如果你想在事件函数当中使用当前的实例，你需要手动地将实例方法 bind 到当前实例上再传入给 React.js。

```js
class Title extends Component {
  handleClickOnTitle (e) {
    console.log(this)
  }

  render () {
    return (
      <h1 onClick={this.handleClickOnTitle.bind(this)}>React 小书</h1>
    )
  }

}

// 你也可以在 bind 的时候给事件监听函数传入一些参数
  render () {
    return (
      <h1 onClick={this.handleClickOnTitle.bind(this, 'Hello')}>React 小书</h1>
    )
  }
```

## 六、组件的 state 和 setState

**分别对应小程序的 data 和 setData**

- setState 接受对象参数

- setState 接受函数参数而不是回调

```js
  handleClickOnLikeButton () {
    this.setState((prevState) => {
      return { count: 0 }
    })
    this.setState((prevState) => {
      return { count: prevState.count + 1 } // 上一个 setState 的返回是 count 为 0，当前返回 1
    })
    this.setState((prevState) => {
      return { count: prevState.count + 2 } // 上一个 setState 的返回是 count 为 1，当前返回 3
    })
    // 最后的结果是 this.state.count 为 3
  }
```

- setState 合并

当你调用 setState 的时候，React.js 并不会马上修改 state。而是把这个对象放到一个更新队列里面，稍后才会从队列当中把新的状态提取出来合并到 state 当中，然后再触发组件更新。

上面我们进行了三次 setState，但是实际上组件只会重新渲染一次，而不是三次；这是因为在 React.js 内部会把 JavaScript 事件循环中的消息队列的同一个消息中的 setState 都进行合并以后再重新渲染组件。

深层的原理并不需要过多纠结，你只需要记住的是：在使用 React.js 的时候，并不需要担心多次进行 setState 会带来性能问题。

## 七、配置组件的 props

**在使用一个组件的时候，可以把参数放在标签的属性当中，所有的属性都会作为 props 对象的键值，可以把任何类型的数据作为组件的参数，包括字符串、数字、对象、数组、甚至是函数等等**

### 默认配置 defaultProps

```js
class LikeButton extends Component {
  static defaultProps = {
    likedText: '取消',
    unlikedText: '点赞'
  };

  constructor() {
    super();
    this.state = { isLiked: false };
  }

  handleClickOnLikeButton() {
    this.setState({
      isLiked: !this.state.isLiked
    });
  }

  render() {
    return (
      <button onClick={this.handleClickOnLikeButton.bind(this)}>
        {this.state.isLiked ? this.props.likedText : this.props.unlikedText} 👍
      </button>
    );
  }
}
```

### props 不可变

- props 一旦传入进来就不能改变

你不能改变一个组件被渲染的时候传进来的 props。React.js 希望一个组件在输入确定的 props 的时候，能够输出确定的 UI 显示形态。如果 props 渲染过程中可以被修改，那么就会导致这个组件显示形态和行为变得不可预测，这样会可能会给组件使用者带来困惑

- 在父组件修改 props 值，相当于重新传入
  但这并不意味着由 props 决定的显示形态不能被修改。组件的使用者可以主动地通过重新渲染的方式把新的 props 传入组件当中，这样这个组件中由 props 决定的显示形态也会得到相应的改变。

### 总结

1. 为了使得组件的可定制性更强，在使用组件的时候，可以在标签上加属性来传入配置参数
2. 组件可以在内部通过 this.props 获取到配置参数，组件可以根据 props 的不同来确定自己的显示形态，达到可配置的效果
3. 可以通过给组件添加类属性 defaultProps 来配置默认参数
4. props 一旦传入，你就不可以在组件内部对它进行修改。但是你可以通过父组件主动重新渲染的方式来传入新的 props，从而达到更新的效果

```js
export default {
  data() {
    return {
      arrList: []
    };
  },
  components: {
    BannerView
  },
  mounted() {
    //获取数据
    this.fetchDate();
  },
  methods: {
    fetchDate() {
      var _this = this;
      this.$http
        .get('src/data/index.data')
        .then(function (res) {
          _this.arrList.push = res.data;
        })
        .catch(function (err) {
          console.log('Home', err);
        });
    }
  }
};
```

## 八、渲染存放 JSX 元素的数组

**如果你往 {} 放一个数组，React.js 会帮你把数组里面一个个元素罗列并且渲染出来**

### 使用 map 渲染列表数据

- 在`home.vue`路由跳转代码中加入

```js
const users = [
  { username: 'Jerry', age: 21, gender: 'male' },
  { username: 'Tomy', age: 22, gender: 'male' },
  { username: 'Lily', age: 19, gender: 'female' },
  { username: 'Lucy', age: 20, gender: 'female' }
];

class User extends Component {
  render() {
    const { user } = this.props;
    return (
      <div>
        <div>姓名：{user.username}</div>
        <div>年龄：{user.age}</div>
        <div>性别：{user.gender}</div>
        <hr />
      </div>
    );
  }
}

class Index extends Component {
  render() {
    return (
      <div>
        {users.map((user) => (
          <User user={user} />
        ))}
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));
```

### key! key! key!

React.js 的是非常高效的，它高效依赖于所谓的 Virtual-DOM 策略。简单来说，能复用的话 React.js 就会尽量复用，没有必要的话绝对不碰 DOM。对于列表元素来说也是这样，但是处理列表元素的复用性会有一个问题：元素可能会在一个列表中改变位置

- 对于用表达式套数组罗列到页面上的元素，都要为每个元素加上 key 属性，这个 key 必须是每个元素唯一的标识

- 当 data 没有 id 可以用，可以直接用循环计数器 i 作为 key，控制台已经没有错误信息了
- 但这是不好的做法，这只是掩耳盗铃
- 在实际项目当中，如果你的数据顺序可能发生变化，标准做法是最好是后台数据返回的 id 作为列表元素的 key
