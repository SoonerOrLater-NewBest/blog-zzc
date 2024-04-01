---
customLabelArray: [2]
---

# <Label :level='2'/>element 组件库 broadcast 与 dispatch

周所周知，Vue 在 2.0 版本中去除了$broadcast方法以及$dispatch 方法，最近在学习饿了么的[Element](https://github.com/ElemeFE/element)时重新实现了这两种方法，并以 minix 的方式引入。

看一下[源代码](https://github.com/ElemeFE/element/blob/dev/src/mixins/emitter.js)

<!-- more -->

```javascript
function broadcast(componentName, eventName, params) {
  /*遍历当前节点下的所有子组件*/
  this.$children.forEach((child) => {
    /*获取子组件名称*/
    var name = child.$options.componentName;

    if (name === componentName) {
      /*如果是我们需要广播到的子组件的时候调用$emit触发所需事件，在子组件中用$on监听*/
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      /*非所需子组件则递归遍历深层次子组件*/
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    /*对多级父组件进行事件派发*/
    dispatch(componentName, eventName, params) {
      /*获取父组件，如果以及是根组件，则是$root*/
      var parent = this.$parent || this.$root;
      /*获取父节点的组件名*/
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        /*当父组件不是所需组件时继续向上寻找*/
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      /*找到所需组件后调用$emit触发当前事件*/
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    /*
        向所有子组件进行事件广播。
        这里包了一层，为了修改broadcast的this对象为当前Vue实例
    */
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};
```

其实这里的 broadcast 与 dispatch 实现了一个定向的多层级父子组件间的事件广播及事件派发功能。完成多层级分发对应事件的组件间通信功能。

broadcast 通过递归遍历子组件找到所需组件广播事件，而 dispatch 则逐级向上查找对应父组件派发事件。

broadcast 需要三个参数，componentName（组件名），eventName（事件名称）以及 params（数据）。根据 componentName 深度遍历子组件找到对应组件 emit 事件 eventName。

dispatch 同样道理，需要三个参数，componentName（组件名），eventName（事件名称）以及 params（数据）。根据 componentName 向上级一直寻找对应父组件，找到以后 emit 事件 eventName。
