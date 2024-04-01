---
customLabelArray: [2]
---

# <Label :level='2'/>VNode 节点(Vue.js 实现)

## 抽象 DOM 树

在刀耕火种的年代，我们需要在各个事件方法中直接操作 DOM 来达到修改视图的目的。但是当应用一大就会变得难以维护。

那我们是不是可以把真实 DOM 树抽象成一棵以 JavaScript 对象构成的抽象树，在修改抽象树数据后将抽象树转化成真实 DOM 重绘到页面上呢？于是虚拟 DOM 出现了，它是真实 DOM 的一层抽象，用属性描述真实 DOM 的各个特性。当它发生变化的时候，就会去修改视图。

可以想象，最简单粗暴的方法就是将整个 DOM 结构用 innerHTML 修改到页面上，但是这样进行重绘整个视图层是相当消耗性能的，我们是不是可以每次只更新它的修改呢？所以 Vue.js 将 DOM 抽象成一个以 JavaScript 对象为节点的虚拟 DOM 树，以 VNode 节点模拟真实 DOM，可以对这颗抽象树进行创建节点、删除节点以及修改节点等操作，在这过程中都不需要操作真实 DOM，只需要操作 JavaScript 对象后只对差异修改，相对于整块的 innerHTML 的粗暴式修改，大大提升了性能。修改以后经过 diff 算法得出一些需要修改的最小单位，再将这些小单位的视图进行更新。这样做减少了很多不需要的 DOM 操作，大大提高了性能。

Vue 就使用了这样的抽象节点 VNode，它是对真实 DOM 的一层抽象，而不依赖某个平台，它可以是浏览器平台，也可以是 weex，甚至是 node 平台也可以对这样一棵抽象 DOM 树进行创建删除修改等操作，这也为前后端同构提供了可能。

## VNode 基类

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
    /*是否作为根节点插入*/
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

## 生成一个新的 VNode 的方法

下面这些方法都是一些常用的构造 VNode 的方法。

### createEmptyVNode 创建一个空 VNode 节点

```javascript
/*创建一个空VNode节点*/
export const createEmptyVNode = () => {
  const node = new VNode();
  node.text = '';
  node.isComment = true;
  return node;
};
```

### createTextVNode 创建一个文本节点

```javascript
/*创建一个文本节点*/
export function createTextVNode(val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val));
}
```

### createComponent 创建一个组件节点

```javascript
 // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.

  /*如果在该阶段Ctor依然不是一个构造函数或者是一个异步组件工厂则直接返回*/
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(`Invalid Component definition: ${String(Ctor)}`, context)
    }
    return
  }

  // async component
  /*处理异步组件*/
  if (isUndef(Ctor.cid)) {
    Ctor = resolveAsyncComponent(Ctor, baseCtor, context)
    if (Ctor === undefined) {
      // return nothing if this is indeed an async component
      // wait for the callback to trigger parent update.
      /*如果这是一个异步组件则会不会返回任何东西（undifiened），直接return掉，等待回调函数去触发父组件更新。s*/
      return
    }
  }

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor)

  data = data || {}

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }

  // extract props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag)

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on
  // replace with listeners with .native modifier
  data.on = data.nativeOn

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners
    data = {}
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data)

  // return a placeholder vnode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children }
  )
  return vnode
}

```

### cloneVNode 克隆一个 VNode 节点

```javascript
export function cloneVNode(vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isCloned = true;
  return cloned;
}
```

## createElement

```javascript
// wrapper function for providing a more flexible interface
// without getting yelled at by flow
export function createElement(
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode {
  /*兼容不传data的情况*/
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  /*如果alwaysNormalize为true，则normalizationType标记为ALWAYS_NORMALIZE*/
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }

  /*创建虚拟节点*/
  return _createElement(context, tag, data, children, normalizationType);
}

/*创建虚拟节点*/
export function _createElement(
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode {
  /*
    如果传递data参数且data的__ob__已经定义（代表已经被observed，上面绑定了Oberver对象），
    https://cn.vuejs.org/v2/guide/render-function.html#约束
    那么创建一个空节点
  */
  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NODE_ENV !== 'production' &&
      warn(
        `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
          'Always create fresh vnode data objects in each render!',
        context
      );
    return createEmptyVNode();
  }
  /*如果tag不存在也是创建一个空节点*/
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode();
  }
  // support single function children as default scoped slot
  /*默认默认作用域插槽*/
  if (Array.isArray(children) && typeof children[0] === 'function') {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  let vnode, ns;
  if (typeof tag === 'string') {
    let Ctor;
    /*获取tag的名字空间*/
    ns = config.getTagNamespace(tag);
    /*判断是否是保留的标签*/
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      /*如果是保留的标签则创建一个相应节点*/
      vnode = new VNode(
        config.parsePlatformTagName(tag),
        data,
        children,
        undefined,
        undefined,
        context
      );
    } else if (isDef((Ctor = resolveAsset(context.$options, 'components', tag)))) {
      // component
      /*从vm实例的option的components中寻找该tag，存在则就是一个组件，创建相应节点，Ctor为组件的构造类*/
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      /*未知的元素，在运行时检查，因为父组件可能在序列化子组件的时候分配一个名字空间*/
      vnode = new VNode(tag, data, children, undefined, undefined, context);
    }
  } else {
    // direct component options / constructor
    /*tag不是字符串的时候则是组件的构造类*/
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    /*如果有名字空间，则递归所有子节点应用该名字空间*/
    if (ns) applyNS(vnode, ns);
    return vnode;
  } else {
    /*如果vnode没有成功创建则创建空节点*/
    return createEmptyVNode();
  }
}
```

createElement 用来创建一个虚拟节点。当 data 上已经绑定**ob**的时候，代表该对象已经被 Oberver 过了，所以创建一个空节点。tag 不存在的时候同样创建一个空节点。当 tag 不是一个 String 类型的时候代表 tag 是一个组件的构造类，直接用 new VNode 创建。当 tag 是 String 类型的时候，如果是保留标签，则用 new VNode 创建一个 VNode 实例，如果在 vm 的 option 的 components 找得到该 tag，代表这是一个组件，否则统一用 new VNode 创建。
