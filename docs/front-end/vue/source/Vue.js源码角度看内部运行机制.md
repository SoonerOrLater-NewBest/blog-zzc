---
customLabelArray: [2]
---

# <Label :level='2'/>Vue.js 源码角度看内部运行机制（从 template 到 DOM）

## 从 new 一个 Vue 对象开始

```javascript
let vm = new Vue({
  el: '#app'
  /*some options*/
});
```

很多同学好奇，在 new 一个 Vue 对象的时候，内部究竟发生了什么？

究竟 Vue.js 是如何将 data 中的数据渲染到真实的宿主环境中的？

又是如何通过“响应式”修改数据的？

template 是如何被编译成真实环境中可用的 HTML 的？

Vue 指令又是如何执行的？

带着这些疑问，我们从 Vue 的构造类开始看起。

## Vue 构造类

```javascript
function Vue(options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  /*初始化*/
  this._init(options);
}
```

Vue 的构造类只做了一件事情，就是调用\_init 函数进行初始化

来看一下 init 的代码

```javascript
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this;
  // a uid
  vm._uid = uid++;

  let startTag, endTag;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    startTag = `vue-perf-init:${vm._uid}`;
    endTag = `vue-perf-end:${vm._uid}`;
    mark(startTag);
  }

  // a flag to avoid this being observed
  /*一个防止vm实例自身被观察的标志位*/
  vm._isVue = true;
  // merge options
  if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options);
  } else {
    vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
  }
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    initProxy(vm);
  } else {
    vm._renderProxy = vm;
  }
  // expose real self
  vm._self = vm;
  /*初始化生命周期*/
  initLifecycle(vm);
  /*初始化事件*/
  initEvents(vm);
  /*初始化render*/
  initRender(vm);
  /*调用beforeCreate钩子函数并且触发beforeCreate钩子事件*/
  callHook(vm, 'beforeCreate');
  initInjections(vm); // resolve injections before data/props
  /*初始化props、methods、data、computed与watch*/
  initState(vm);
  initProvide(vm); // resolve provide after data/props
  /*调用created钩子函数并且触发created钩子事件*/
  callHook(vm, 'created');

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    /*格式化组件名*/
    vm._name = formatComponentName(vm, false);
    mark(endTag);
    measure(`${vm._name} init`, startTag, endTag);
  }

  if (vm.$options.el) {
    /*挂载组件*/
    vm.$mount(vm.$options.el);
  }
};
```

\_init 主要做了这两件事：

1.初始化（包括生命周期、事件、render 函数、state 等）。

2.\$mount 组件。

在生命钩子 beforeCreate 与 created 之间会初始化 state，在此过程中，会依次初始化 props、methods、data、computed 与 watch，这也就是 Vue.js 对 options 中的数据进行“响应式化”（即双向绑定）的过程。对于 Vue.js 响应式原理不了解的同学可以先看一下笔者的另一片文章[《Vue.js 响应式原理》](https://github.com/answershuto/learnVue/blob/master/docs/%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86.MarkDown)。

```javascript
/*初始化props、methods、data、computed与watch*/
export function initState(vm: Component) {
  vm._watchers = [];
  const opts = vm.$options;
  /*初始化props*/
  if (opts.props) initProps(vm, opts.props);
  /*初始化方法*/
  if (opts.methods) initMethods(vm, opts.methods);
  /*初始化data*/
  if (opts.data) {
    initData(vm);
  } else {
    /*该组件没有data的时候绑定一个空对象*/
    observe((vm._data = {}), true /* asRootData */);
  }
  /*初始化computed*/
  if (opts.computed) initComputed(vm, opts.computed);
  /*初始化watchers*/
  if (opts.watch) initWatch(vm, opts.watch);
}
```

## 双向绑定

以 initData 为例，对 option 的 data 的数据进行双向绑定 Oberver，其他 option 参数双向绑定的核心原理是一致的。

```javascript
function initData(vm: Component) {
  /*得到data数据*/
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};

  /*判断是否是对象*/
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== 'production' &&
      warn(
        'data functions should return an object:\n' +
          'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
        vm
      );
  }

  // proxy data on instance
  /*遍历data对象*/
  const keys = Object.keys(data);
  const props = vm.$options.props;
  let i = keys.length;

  //遍历data中的数据
  while (i--) {
    /*保证data中的key不与props中的key重复，props优先，如果有冲突会产生warning*/
    if (props && hasOwn(props, keys[i])) {
      process.env.NODE_ENV !== 'production' &&
        warn(
          `The data property "${keys[i]}" is already declared as a prop. ` +
            `Use prop default value instead.`,
          vm
        );
    } else if (!isReserved(keys[i])) {
      /*判断是否是保留字段*/

      /*这里是我们前面讲过的代理，将data上面的属性代理到了vm实例上*/
      proxy(vm, `_data`, keys[i]);
    }
  }

  // observe data
  /*从这里开始我们要observe了，开始对数据进行绑定，这里有尤大大的注释asRootData，这步作为根数据，下面会进行递归observe进行对深层对象的绑定。*/
  observe(data, true /* asRootData */);
}
```

observe 会通过 defineReactive 对 data 中的对象进行双向绑定，最终通过 Object.defineProperty 对对象设置 setter 以及 getter 的方法。getter 的方法主要用来进行依赖收集，对于依赖收集不了解的同学可以参考笔者的另一篇文章[《依赖收集》](https://github.com/answershuto/learnVue/blob/master/docs/%E4%BE%9D%E8%B5%96%E6%94%B6%E9%9B%86.MarkDown)。setter 方法会在对象被修改的时候触发（不存在添加属性的情况，添加属性请用 Vue.set），这时候 setter 会通知闭包中的 Dep，Dep 中有一些订阅了这个对象改变的 Watcher 观察者对象，Dep 会通知 Watcher 对象更新视图。

如果是修改一个数组的成员，该成员是一个对象，那只需要递归对数组的成员进行双向绑定即可。但这时候出现了一个问题，如果我们进行 pop、push 等操作的时候，push 进去的对象根本没有进行过双向绑定，更别说 pop 了，那么我们如何监听数组的这些变化呢？
Vue.js 提供的方法是重写 push、pop、shift、unshift、splice、sort、reverse 这七个[数组方法](http://v1-cn.vuejs.org/guide/list.html#变异方法)。修改数组原型方法的代码可以参考[observer/array.js](https://github.com/vuejs/vue/blob/dev/src/core/observer/array.js)以及[observer/index.js](https://github.com/vuejs/vue/blob/dev/src/core/observer/index.js#L45)。

```javascript
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor(value: any) {
    //.......

    if (Array.isArray(value)) {
      /*
          如果是数组，将修改后可以截获响应的数组方法替换掉该数组的原型中的原生方法，达到监听数组数据变化响应的效果。
          这里如果当前浏览器支持__proto__属性，则直接覆盖当前数组对象原型上的原生数组方法，如果不支持该属性，则直接覆盖数组对象的原型。
      */
      const augment = hasProto
        ? protoAugment /*直接覆盖原型的方法来修改目标对象*/
        : copyAugment; /*定义（覆盖）目标对象或数组的某一个方法*/
      augment(value, arrayMethods, arrayKeys);

      /*如果是数组则需要遍历数组的每一个成员进行observe*/
      this.observeArray(value);
    } else {
      /*如果是对象则直接walk进行绑定*/
      this.walk(value);
    }
  }
}

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
/*直接覆盖原型的方法来修改目标对象或数组*/
function protoAugment(target, src: Object) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
/*定义（覆盖）目标对象或数组的某一个方法*/
function copyAugment(target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    def(target, key, src[key]);
  }
}
```

```javascript
/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index';

/*取得原生数组的原型*/
const arrayProto = Array.prototype;
/*创建一个新的数组对象，修改该对象上的数组的七个方法，防止污染原生数组方法*/
export const arrayMethods = Object.create(arrayProto)[
  /**
   * Intercept mutating methods and emit events
   */
  /*这里重写了数组的这些方法，在保证不污染原生数组原型的情况下重写数组的这些方法，截获数组的成员发生的变化，执行原生数组操作的同时dep通知关联的所有观察者进行响应式处理*/
  ('push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse')
].forEach(function (method) {
  // cache original method
  /*将数组的原生方法缓存起来，后面要调用*/
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator() {
    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    let i = arguments.length;
    const args = new Array(i);
    while (i--) {
      args[i] = arguments[i];
    }
    /*调用原生的数组方法*/
    const result = original.apply(this, args);

    /*数组新插入的元素需要重新进行observe才能响应式*/
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case 'push':
        inserted = args;
        break;
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observeArray(inserted);

    // notify change
    /*dep通知所有注册的观察者进行响应式处理*/
    ob.dep.notify();
    return result;
  });
});
```

从数组的原型新建一个 Object.create(arrayProto)对象，通过修改此原型可以保证原生数组方法不被污染。如果当前浏览器支持**proto**这个属性的话就可以直接覆盖该属性使数组对象具有了重写后的数组方法。如果浏览器没有该属性，则必须通过遍历 def 所有需要重写的数组方法，这种方法效率较低，所以优先使用第一种。

在保证不污染不覆盖数组原生方法添加监听，主要做了两个操作，第一是通知所有注册的观察者进行响应式处理，第二是如果是添加成员的操作，需要对新成员进行 observe。

但是修改了数组的原生方法以后我们还是没法像原生数组一样直接通过数组的下标或者设置 length 来修改数组，可以通过[Vue.set 以及 splice 方法](https://cn.vuejs.org/v2/guide/list.html#%E6%9B%BF%E6%8D%A2%E6%95%B0%E7%BB%84)。

对于更具体的讲解数据双向绑定以及 Dep、Watcher 的实现可以参考笔者的文章[《从源码角度再看数据绑定》](https://github.com/answershuto/learnVue/blob/master/docs/%E4%BB%8E%E6%BA%90%E7%A0%81%E8%A7%92%E5%BA%A6%E5%86%8D%E7%9C%8B%E6%95%B0%E6%8D%AE%E7%BB%91%E5%AE%9A.MarkDown)。

## template 编译

在\$mount 过程中，如果是使用独立构建，则会在此过程中将 template 编译成 render function。当然，你也可以采用运行时构建。具体参考[运行时-编译器-vs-只包含运行时](https://cn.vuejs.org/v2/guide/installation.html#运行时-编译器-vs-只包含运行时)。

template 是如何被编译成 render function 的呢？

```javascript
function baseCompile(template: string, options: CompilerOptions): CompiledResult {
  /*parse解析得到ast树*/
  const ast = parse(template.trim(), options);
  /*
    将AST树进行优化
    优化的目标：生成模板AST树，检测不需要进行DOM改变的静态子树。
    一旦检测到这些静态树，我们就能做以下这些事情：
    1.把它们变成常数，这样我们就再也不需要每次重新渲染时创建新的节点了。
    2.在patch的过程中直接跳过。
 */
  optimize(ast, options);
  /*根据ast树生成所需的code（内部包含render与staticRenderFns）*/
  const code = generate(ast, options);
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  };
}
```

baseCompile 首先会将模板 template 进行 parse 得到一个 AST 语法树，再通过 optimize 做一些优化，最后通过 generate 得到 render 以及 staticRenderFns。

### parse

parse 的源码可以参见[https://github.com/answershuto/learnVue/blob/master/vue-src/compiler/parser/index.js#L53](https://github.com/answershuto/learnVue/blob/master/vue-src/compiler/parser/index.js#L53)。

parse 会用正则等方式解析 template 模板中的指令、class、style 等数据，形成 AST 语法树。

### optimize

optimize 的主要作用是标记 static 静态节点，这是 Vue 在编译过程中的一处优化，后面当 update 更新界面时，会有一个 patch 的过程，diff 算法会直接跳过静态节点，从而减少了比较的过程，优化了 patch 的性能。

### generate

generate 是将 AST 语法树转化成 render funtion 字符串的过程，得到结果是 render 的字符串以及 staticRenderFns 字符串。

具体的 template 编译实现请参考[《聊聊 Vue.js 的 template 编译》](https://github.com/answershuto/learnVue/blob/master/docs/%E8%81%8A%E8%81%8AVue%E7%9A%84template%E7%BC%96%E8%AF%91.MarkDown)。

## Watcher 到视图

Watcher 对象会通过调用 updateComponent 方法来达到更新视图的目的。这里提一下，其实 Watcher 并不是实时更新视图的，Vue.js 默认会将 Watcher 对象存在一个队列中，在下一个 tick 时更新异步更新视图，完成了性能优化。关于 nextTick 感兴趣的小伙伴可以参考[《Vue.js 异步更新 DOM 策略及 nextTick》](https://github.com/answershuto/learnVue/blob/master/docs/Vue.js%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0DOM%E7%AD%96%E7%95%A5%E5%8F%8AnextTick.MarkDown)。

```javascript
updateComponent = () => {
  vm._update(vm._render(), hydrating);
};
```

updateComponent 就执行一句话，\_render 函数会返回一个新的 Vnode 节点，传入\_update 中与旧的 VNode 对象进行对比，经过一个 patch 的过程得到两个 VNode 节点的差异，最后将这些差异渲染到真实环境形成视图。

什么是 VNode？

## VNode

在刀耕火种的年代，我们需要在各个事件方法中直接操作 DOM 来达到修改视图的目的。但是当应用一大就会变得难以维护。

那我们是不是可以把真实 DOM 树抽象成一棵以 JavaScript 对象构成的抽象树，在修改抽象树数据后将抽象树转化成真实 DOM 重绘到页面上呢？于是虚拟 DOM 出现了，它是真实 DOM 的一层抽象，用属性描述真实 DOM 的各个特性。当它发生变化的时候，就会去修改视图。

可以想象，最简单粗暴的方法就是将整个 DOM 结构用 innerHTML 修改到页面上，但是这样进行重绘整个视图层是相当消耗性能的，我们是不是可以每次只更新它的修改呢？所以 Vue.js 将 DOM 抽象成一个以 JavaScript 对象为节点的虚拟 DOM 树，以 VNode 节点模拟真实 DOM，可以对这颗抽象树进行创建节点、删除节点以及修改节点等操作，在这过程中都不需要操作真实 DOM，只需要操作 JavaScript 对象后只对差异修改，相对于整块的 innerHTML 的粗暴式修改，大大提升了性能。修改以后经过 diff 算法得出一些需要修改的最小单位，再将这些小单位的视图进行更新。这样做减少了很多不需要的 DOM 操作，大大提高了性能。

Vue 就使用了这样的抽象节点 VNode，它是对真实 DOM 的一层抽象，而不依赖某个平台，它可以是浏览器平台，也可以是 weex，甚至是 node 平台也可以对这样一棵抽象 DOM 树进行创建删除修改等操作，这也为前后端同构提供了可能。

先来看一下 Vue.js 源码中对 VNode 类的定义。

```javascript
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  functionalContext: Component | void; // only for functional component root nodes
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?

  constructor(
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions
  ) {
    /*当前节点的标签名*/
    this.tag = tag;
    /*当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息*/
    this.data = data;
    /*当前节点的子节点，是一个数组*/
    this.children = children;
    /*当前节点的文本*/
    this.text = text;
    /*当前虚拟节点对应的真实dom节点*/
    this.elm = elm;
    /*当前节点的名字空间*/
    this.ns = undefined;
    /*编译作用域*/
    this.context = context;
    /*函数化组件作用域*/
    this.functionalContext = undefined;
    /*节点的key属性，被当作节点的标志，用以优化*/
    this.key = data && data.key;
    /*组件的option选项*/
    this.componentOptions = componentOptions;
    /*当前节点对应的组件的实例*/
    this.componentInstance = undefined;
    /*当前节点的父节点*/
    this.parent = undefined;
    /*简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false*/
    this.raw = false;
    /*静态节点标志*/
    this.isStatic = false;
    /*是否作为跟节点插入*/
    this.isRootInsert = true;
    /*是否为注释节点*/
    this.isComment = false;
    /*是否为克隆节点*/
    this.isCloned = false;
    /*是否有v-once指令*/
    this.isOnce = false;
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child(): Component | void {
    return this.componentInstance;
  }
}
```

这是一个最基础的 VNode 节点，作为其他派生 VNode 类的基类，里面定义了下面这些数据。

tag: 当前节点的标签名

data: 当前节点对应的对象，包含了具体的一些数据信息，是一个 VNodeData 类型，可以参考 VNodeData 类型中的数据信息

children: 当前节点的子节点，是一个数组

text: 当前节点的文本

elm: 当前虚拟节点对应的真实 dom 节点

ns: 当前节点的名字空间

context: 当前节点的编译作用域

functionalContext: 函数化组件作用域

key: 节点的 key 属性，被当作节点的标志，用以优化

componentOptions: 组件的 option 选项

componentInstance: 当前节点对应的组件的实例

parent: 当前节点的父节点

raw: 简而言之就是是否为原生 HTML 或只是普通文本，innerHTML 的时候为 true，textContent 的时候为 false

isStatic: 是否为静态节点

isRootInsert: 是否作为跟节点插入

isComment: 是否为注释节点

isCloned: 是否为克隆节点

isOnce: 是否有 v-once 指令

---

打个比方，比如说我现在有这么一个 VNode 树

```JavaScript
{
    tag: 'div'
    data: {
        class: 'test'
    },
    children: [
        {
            tag: 'span',
            data: {
                class: 'demo'
            }
            text: 'hello,VNode'
        }
    ]
}
```

渲染之后的结果就是这样的

```html
<div class="test">
  <span class="demo">hello,VNode</span>
</div>
```

更多操作 VNode 的方法，请参考[《VNode 节点》](https://github.com/answershuto/learnVue/blob/master/docs/VNode%E8%8A%82%E7%82%B9.MarkDown)。

## patch

最后\_update 会将新旧两个 VNode 进行一次 patch 的过程，得出两个 VNode 最小的差异，然后将这些差异渲染到视图上。

首先说一下 patch 的核心 diff 算法，diff 算法是通过同层的树节点进行比较而非对树进行逐层搜索遍历的方式，所以时间复杂度只有 O(n)，是一种相当高效的算法。

![img](https://i.loli.net/2017/08/27/59a23cfca50f3.png)

![img](https://i.loli.net/2017/08/27/59a2419a3c617.png)

这两张图代表旧的 VNode 与新 VNode 进行 patch 的过程，他们只是在同层级的 VNode 之间进行比较得到变化（第二张图中相同颜色的方块代表互相进行比较的 VNode 节点），然后修改变化的视图，所以十分高效。

在 patch 的过程中，如果两个 VNode 被认为是同一个 VNode（sameVnode），则会进行深度的比较，得出最小差异，否则直接删除旧有 DOM 节点，创建新的 DOM 节点。

什么是 sameVnode？

我们来看一下 sameVnode 的实现。

```JavaScript
/*
  判断两个VNode节点是否是同一个节点，需要满足以下条件
  key相同
  tag（当前节点的标签名）相同
  isComment（是否为注释节点）相同
  是否data（当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息）都有定义
  当标签是<input>的时候，type必须相同
*/
function sameVnode (a, b) {
  return (
    a.key === b.key &&
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    isDef(a.data) === isDef(b.data) &&
    sameInputType(a, b)
  )
}

// Some browsers do not support dynamically changing type for <input>
// so they need to be treated as different nodes
/*
  判断当标签是<input>的时候，type是否相同
  某些浏览器不支持动态修改<input>类型，所以他们被视为不同类型
*/
function sameInputType (a, b) {
  if (a.tag !== 'input') return true
  let i
  const typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type
  const typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type
  return typeA === typeB
}
```

当两个 VNode 的 tag、key、isComment 都相同，并且同时定义或未定义 data 的时候，且如果标签为 input 则 type 必须相同。这时候这两个 VNode 则算 sameVnode，可以直接进行 patchVnode 操作。

patchVnode 的规则是这样的：

1.如果新旧 VNode 都是静态的，同时它们的 key 相同（代表同一节点），并且新的 VNode 是 clone 或者是标记了 once（标记 v-once 属性，只渲染一次），那么只需要替换 elm 以及 componentInstance 即可。

2.新老节点均有 children 子节点，则对子节点进行 diff 操作，调用 updateChildren，这个 updateChildren 也是 diff 的核心。

3.如果老节点没有子节点而新节点存在子节点，先清空老节点 DOM 的文本内容，然后为当前 DOM 节点加入子节点。

4.当新节点没有子节点而老节点有子节点的时候，则移除该 DOM 节点的所有子节点。

5.当新老节点都无子节点的时候，只是文本的替换。

## updateChildren

```JavaScript
  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, elmToMove, refElm

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        /*前四种情况其实是指定key的时候，判定为同一个VNode，则直接patchVnode即可，分别比较oldCh以及newCh的两头节点2*2=4种情况*/
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        /*
          生成一个key与旧VNode的key对应的哈希表（只有第一次进来undefined的时候会生成，也为后面检测重复的key值做铺垫）
          比如childre是这样的 [{xx: xx, key: 'key0'}, {xx: xx, key: 'key1'}, {xx: xx, key: 'key2'}]  beginIdx = 0   endIdx = 2
          结果生成{key0: 0, key1: 1, key2: 2}
        */
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        /*如果newStartVnode新的VNode节点存在key并且这个key在oldVnode中能找到则返回这个节点的idxInOld（即第几个节点，下标）*/
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null
        if (isUndef(idxInOld)) { // New element
          /*newStartVnode没有key或者是该key没有在老节点中找到则创建一个新的节点*/
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
          newStartVnode = newCh[++newStartIdx]
        } else {
          /*获取同key的老节点*/
          elmToMove = oldCh[idxInOld]
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !elmToMove) {
            /*如果elmToMove不存在说明之前已经有新节点放入过这个key的DOM中，提示可能存在重复的key，确保v-for的时候item有唯一的key值*/
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            )
          }
          if (sameVnode(elmToMove, newStartVnode)) {

            /*如果新VNode与得到的有相同key的节点是同一个VNode则进行patchVnode*/
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
            /*因为已经patchVnode进去了，所以将这个老节点赋值undefined，之后如果还有新节点与该节点key相同可以检测出来提示已有重复的key*/
            oldCh[idxInOld] = undefined
            /*当有标识位canMove实可以直接插入oldStartVnode对应的真实DOM节点前面*/
            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm)
            newStartVnode = newCh[++newStartIdx]
          } else {
            // same key but different element. treat as new element
            /*当新的VNode与找到的同样key的VNode不是sameVNode的时候（比如说tag不一样或者是有不一样type的input标签），创建一个新的节点*/
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
            newStartVnode = newCh[++newStartIdx]
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      /*全部比较完成以后，发现oldStartIdx > oldEndIdx的话，说明老节点已经遍历完了，新节点比老节点多，所以这时候多出来的新节点需要一个一个创建出来加入到真实DOM中*/
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      /*如果全部比较完成以后发现newStartIdx > newEndIdx，则说明新节点已经遍历完了，老节点多余新节点，这个时候需要将多余的老节点从真实DOM中移除*/
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
  }
```

直接看源码可能比较难以捋清其中的关系，我们通过图来看一下。

![img](https://i.loli.net/2017/08/28/59a4015bb2765.png)

首先，在新老两个 VNode 节点的左右头尾两侧都有一个变量标记，在遍历过程中这几个变量都会向中间靠拢。当 oldStartIdx > oldEndIdx 或者 newStartIdx > newEndIdx 时结束循环。

索引与 VNode 节点的对应关系：
oldStartIdx => oldStartVnode
oldEndIdx => oldEndVnode
newStartIdx => newStartVnode
newEndIdx => newEndVnode

在遍历中，如果存在 key，并且满足 sameVnode，会将该 DOM 节点进行复用，否则则会创建一个新的 DOM 节点。

首先，oldStartVnode、oldEndVnode 与 newStartVnode、newEndVnode 两两比较一共有 2\*2=4 种比较方法。

当新老 VNode 节点的 start 或者 end 满足 sameVnode 时，也就是 sameVnode(oldStartVnode, newStartVnode)或者 sameVnode(oldEndVnode, newEndVnode)，直接将该 VNode 节点进行 patchVnode 即可。

![img](https://i.loli.net/2017/08/28/59a40c12c1655.png)

如果 oldStartVnode 与 newEndVnode 满足 sameVnode，即 sameVnode(oldStartVnode, newEndVnode)。

这时候说明 oldStartVnode 已经跑到了 oldEndVnode 后面去了，进行 patchVnode 的同时还需要将真实 DOM 节点移动到 oldEndVnode 的后面。

![img](https://ooo.0o0.ooo/2017/08/28/59a4214784979.png)

如果 oldEndVnode 与 newStartVnode 满足 sameVnode，即 sameVnode(oldEndVnode, newStartVnode)。

这说明 oldEndVnode 跑到了 oldStartVnode 的前面，进行 patchVnode 的同时真实的 DOM 节点移动到了 oldStartVnode 的前面。

![img](https://i.loli.net/2017/08/29/59a4c70685d12.png)

如果以上情况均不符合，则通过 createKeyToOldIdx 会得到一个 oldKeyToIdx，里面存放了一个 key 为旧的 VNode，value 为对应 index 序列的哈希表。从这个哈希表中可以找到是否有与 newStartVnode 一致 key 的旧的 VNode 节点，如果同时满足 sameVnode，patchVnode 的同时会将这个真实 DOM（elmToMove）移动到 oldStartVnode 对应的真实 DOM 的前面。

![img](https://i.loli.net/2017/08/29/59a4d7552d299.png)

当然也有可能 newStartVnode 在旧的 VNode 节点找不到一致的 key，或者是即便 key 相同却不是 sameVnode，这个时候会调用 createElm 创建一个新的 DOM 节点。

![img](https://i.loli.net/2017/08/29/59a4de0fa4dba.png)

到这里循环已经结束了，那么剩下我们还需要处理多余或者不够的真实 DOM 节点。

1.当结束时 oldStartIdx > oldEndIdx，这个时候老的 VNode 节点已经遍历完了，但是新的节点还没有。说明了新的 VNode 节点实际上比老的 VNode 节点多，也就是比真实 DOM 多，需要将剩下的（也就是新增的）VNode 节点插入到真实 DOM 节点中去，此时调用 addVnodes（批量调用 createElm 的接口将这些节点加入到真实 DOM 中去）。

![img](https://i.loli.net/2017/08/29/59a509f0d1788.png)

2。同理，当 newStartIdx > newEndIdx 时，新的 VNode 节点已经遍历完了，但是老的节点还有剩余，说明真实 DOM 节点多余了，需要从文档中删除，这时候调用 removeVnodes 将这些多余的真实 DOM 删除。

![img](https://i.loli.net/2017/08/29/59a4f389b98cb.png)

更详细的 diff 实现参考笔者的文章[VirtualDOM 与 diff(Vue.js 实现)](<https://github.com/answershuto/learnVue/blob/master/docs/VirtualDOM%E4%B8%8Ediff(Vue%E5%AE%9E%E7%8E%B0).MarkDown>)。

## 映射到真实 DOM

由于 Vue 使用了虚拟 DOM，所以虚拟 DOM 可以在任何支持 JavaScript 语言的平台上操作，譬如说目前 Vue 支持的浏览器平台或是 weex，在虚拟 DOM 的实现上是一致的。那么最后虚拟 DOM 如何映射到真实的 DOM 节点上呢？

Vue 为平台做了一层适配层，浏览器平台见[/platforms/web/runtime/node-ops.js](https://github.com/answershuto/learnVue/blob/master/vue-src/platforms/web/runtime/node-ops.js)以及 weex 平台见[/platforms/weex/runtime/node-ops.js](https://github.com/answershuto/learnVue/blob/master/vue-src/platforms/weex/runtime/node-ops.js)。不同平台之间通过适配层对外提供相同的接口，虚拟 DOM 进行操作真实 DOM 节点的时候，只需要调用这些适配层的接口即可，而内部实现则不需要关心，它会根据平台的改变而改变。

现在又出现了一个问题，我们只是将虚拟 DOM 映射成了真实的 DOM。那如何给这些 DOM 加入 attr、class、style 等 DOM 属性呢？

这要依赖于虚拟 DOM 的生命钩子。虚拟 DOM 提供了如下的钩子函数，分别在不同的时期会进行调用。

```JavaScript
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']

/*构建cbs回调函数，web平台上见/platforms/web/runtime/modules*/
  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }
```

同理，也会根据不同平台有自己不同的实现，我们这里以 Web 平台为例。Web 平台的钩子函数见[/platforms/web/runtime/modules](https://github.com/answershuto/learnVue/tree/master/vue-src/platforms/web/runtime/modules)。里面有对 attr、class、props、events、style 以及 transition（过渡状态）的 DOM 属性进行操作。

以 attr 为例，代码很简单。

```JavaScript
/* @flow */

import { isIE9 } from 'core/util/env'

import {
  extend,
  isDef,
  isUndef
} from 'shared/util'

import {
  isXlink,
  xlinkNS,
  getXlinkProp,
  isBooleanAttr,
  isEnumeratedAttr,
  isFalsyAttrValue
} from 'web/util/index'

/*更新attr*/
function updateAttrs (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  /*如果旧的以及新的VNode节点均没有attr属性，则直接返回*/
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  let key, cur, old
  /*VNode节点对应的Dom实例*/
  const elm = vnode.elm
  /*旧VNode节点的attr*/
  const oldAttrs = oldVnode.data.attrs || {}
  /*新VNode节点的attr*/
  let attrs: any = vnode.data.attrs || {}
  // clone observed objects, as the user probably wants to mutate it
  /*如果新的VNode的attr已经有__ob__（代表已经被Observe处理过了）， 进行深拷贝*/
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs)
  }

  /*遍历attr，不一致则替换*/
  for (key in attrs) {
    cur = attrs[key]
    old = oldAttrs[key]
    if (old !== cur) {
      setAttr(elm, key, cur)
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  /* istanbul ignore if */
  if (isIE9 && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value)
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key))
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key)
      }
    }
  }
}

/*设置attr*/
function setAttr (el: Element, key: string, value: any) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, key)
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true')
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key))
    } else {
      el.setAttributeNS(xlinkNS, key, value)
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, value)
    }
  }
}

export default {
  create: updateAttrs,
  update: updateAttrs
}

```

attr 只需要在 create 以及 update 钩子被调用时更新 DOM 的 attr 属性即可。

## 最后

至此，我们已经从 template 到真实 DOM 的整个过程梳理完了。现在再去看这张图，是不是更清晰了呢？

![](https://cn.vuejs.org/images/data.png)
