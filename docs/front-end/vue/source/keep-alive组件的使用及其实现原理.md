---
customLabelArray: [2]
---

# <Label :level='2'/>keep-alive 组件的使用及其实现原理

## keep-alive

keep-alive 是 Vue.js 的一个内置组件。它能够不活动的组件实例保存在内存中，而不是直接将其销毁，它是一个抽象组件，不会被渲染到真实 DOM 中，也不会出现在父组件链中。

它提供了 include 与 exclude 两个属性，允许组件有条件地进行缓存。

具体内容可以参考[官网](https://cn.vuejs.org/v2/api/#keep-alive)。

## 使用

### 用法

```html
<keep-alive>
  <component></component>
</keep-alive>
```

这里的 component 组件会被缓存起来。

### 举个栗子

```html
<keep-alive>
  <coma v-if="test"></coma>
  <comb v-else></comb>
</keep-alive>
<button @click="test=handleClick">请点击</button>
```

```javascript
export default {
  data() {
    return {
      test: true
    };
  },
  methods: {
    handleClick() {
      this.test = !this.test;
    }
  }
};
```

在点击 button 时候，coma 与 comb 两个组件会发生切换，但是这时候这两个组件的状态会被缓存起来，比如说 coma 与 comb 组件中都有一个 input 标签，那么 input 标签中的内容不会因为组件的切换而消失。

### props

keep-alive 组件提供了 include 与 exclude 两个属性来允许组件有条件地进行缓存，二者都可以用逗号分隔字符串、正则表达式或一个数组来表示。

```html
<keep-alive include="a">
  <component></component>
</keep-alive>
```

将缓存 name 为 a 的组件。

```html
<keep-alive exclude="a">
  <component></component>
</keep-alive>
```

name 为 a 的组件将不会被缓存。

### 生命钩子

keep-alive 提供了两个生命钩子，分别是 activated 与 deactivated。

因为 keep-alive 会将组件保存在内存中，并不会销毁以及重新创建，所以不会重新调用组件的 created 等方法，需要用 activated 与 deactivated 这两个生命钩子来得知当前组件是否处于活动状态。

---

## 深入 keep-alive 组件实现

说完了 keep-alive 组件的使用，我们从源码角度看一下 keep-alive 组件究竟是如何实现组件的缓存的呢？

### created 与 destroyed 钩子

created 钩子会创建一个 cache 对象，用来作为缓存容器，保存 vnode 节点。

```javascript
created () {
    /* 缓存对象 */
    this.cache = Object.create(null)
},
```

destroyed 钩子则在组件被销毁的时候清除 cache 缓存中的所有组件实例。

```javascript
/* destroyed钩子中销毁所有cache中的组件实例 */
destroyed () {
    for (const key in this.cache) {
        pruneCacheEntry(this.cache[key])
    }
},
```

### render

接下来是 render 函数。

```javascript
render () {
    /* 得到slot插槽中的第一个组件 */
    const vnode: VNode = getFirstComponentChild(this.$slots.default)

    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
        // check pattern
        /* 获取组件名称，优先获取组件的name字段，否则是组件的tag */
        const name: ?string = getComponentName(componentOptions)
        /* name不在inlcude中或者在exlude中则直接返回vnode（没有取缓存） */
        if (name && (
        (this.include && !matches(this.include, name)) ||
        (this.exclude && matches(this.exclude, name))
        )) {
            return vnode
        }
        const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
        /* 如果已经做过缓存了则直接从缓存中获取组件实例给vnode，还未缓存过则进行缓存 */
        if (this.cache[key]) {
            vnode.componentInstance = this.cache[key].componentInstance
        } else {
            this.cache[key] = vnode
        }
        /* keepAlive标记位 */
        vnode.data.keepAlive = true
    }
    return vnode
}
```

首先通过 getFirstComponentChild 获取第一个子组件，获取该组件的 name（存在组件名则直接使用组件名，否则会使用 tag）。接下来会将这个 name 通过 include 与 exclude 属性进行匹配，匹配不成功（说明不需要进行缓存）则不进行任何操作直接返回 vnode，vnode 是一个 VNode 类型的对象，不了解 VNode 的同学可以参考笔者的另一篇文章[《VNode 节点》](https://github.com/answershuto/learnVue/blob/master/docs/VNode%E8%8A%82%E7%82%B9.MarkDown) .

```javascript
/* 检测name是否匹配 */
function matches(pattern: string | RegExp, name: string): boolean {
  if (typeof pattern === 'string') {
    /* 字符串情况，如a,b,c */
    return pattern.split(',').indexOf(name) > -1;
  } else if (isRegExp(pattern)) {
    /* 正则 */
    return pattern.test(name);
  }
  /* istanbul ignore next */
  return false;
}
```

检测 include 与 exclude 属性匹配的函数很简单，include 与 exclude 属性支持字符串如"a,b,c"这样组件名以逗号隔开的情况以及正则表达式。matches 通过这两种方式分别检测是否匹配当前组件。

```javascript
if (this.cache[key]) {
  vnode.componentInstance = this.cache[key].componentInstance;
} else {
  this.cache[key] = vnode;
}
```

接下来的事情很简单，根据 key 在 this.cache 中查找，如果存在则说明之前已经缓存过了，直接将缓存的 vnode 的 componentInstance（组件实例）覆盖到目前的 vnode 上面。否则将 vnode 存储在 cache 中。

最后返回 vnode（有缓存时该 vnode 的 componentInstance 已经被替换成缓存中的了）。

### watch

用 watch 来监听 pruneCache 与 pruneCache 这两个属性的改变，在改变的时候修改 cache 缓存中的缓存数据。

```javascript
watch: {
    /* 监视include以及exclude，在被修改的时候对cache进行修正 */
    include (val: string | RegExp) {
        pruneCache(this.cache, this._vnode, name => matches(val, name))
    },
    exclude (val: string | RegExp) {
        pruneCache(this.cache, this._vnode, name => !matches(val, name))
    }
},
```

来看一下 pruneCache 的实现。

```javascript
/* 修正cache */
function pruneCache(cache: VNodeCache, current: VNode, filter: Function) {
  for (const key in cache) {
    /* 取出cache中的vnode */
    const cachedNode: ?VNode = cache[key];
    if (cachedNode) {
      const name: ?string = getComponentName(cachedNode.componentOptions);
      /* name不符合filter条件的，同时不是目前渲染的vnode时，销毁vnode对应的组件实例（Vue实例），并从cache中移除 */
      if (name && !filter(name)) {
        if (cachedNode !== current) {
          pruneCacheEntry(cachedNode);
        }
        cache[key] = null;
      }
    }
  }
}

/* 销毁vnode对应的组件实例（Vue实例） */
function pruneCacheEntry(vnode: ?VNode) {
  if (vnode) {
    vnode.componentInstance.$destroy();
  }
}
```

遍历 cache 中的所有项，如果不符合 filter 指定的规则的话，则会执行 pruneCacheEntry。pruneCacheEntry 则会调用组件实例的\$destroy 方法来将组件销毁。

## 最后

Vue.js 内部将 DOM 节点抽象成了一个个的[VNode 节点](https://github.com/answershuto/learnVue/blob/master/docs/VNode%E8%8A%82%E7%82%B9.MarkDown)，keep-alive 组件的缓存也是基于 VNode 节点的而不是直接存储 DOM 结构。它将满足条件（pruneCache 与 pruneCache）的组件在 cache 对象中缓存起来，在需要重新渲染的时候再将 vnode 节点从 cache 对象中取出并渲染。
