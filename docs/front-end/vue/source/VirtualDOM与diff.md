---
customLabelArray: [2]
---

# <Label :level='2'/>Virtual DOM 与 diff(Vue.js 实现)

## VNode

在刀耕火种的年代，我们需要在各个事件方法中直接操作 DOM 来达到修改视图的目的。但是当应用一大就会变得难以维护。

那我们是不是可以把真实 DOM 树抽象成一棵以 JavaScript 对象构成的抽象树，在修改抽象树数据后将抽象树转化成真实 DOM 重绘到页面上呢？于是虚拟 DOM 出现了，它是真实 DOM 的一层抽象，用属性描述真实 DOM 的各个特性。当它发生变化的时候，就会去修改视图。

可以想象，最简单粗暴的方法就是将整个 DOM 结构用 innerHTML 修改到页面上，但是这样进行重绘整个视图层是相当消耗性能的，我们是不是可以每次只更新它的修改呢？所以 Vue.js 将 DOM 抽象成一个以 JavaScript 对象为节点的虚拟 DOM 树，以 VNode 节点模拟真实 DOM，可以对这颗抽象树进行创建节点、删除节点以及修改节点等操作，在这过程中都不需要操作真实 DOM，只需要操作 JavaScript 对象后只对差异修改，相对于整块的 innerHTML 的粗暴式修改，大大提升了性能。修改以后经过 diff 算法得出一些需要修改的最小单位，再将这些小单位的视图进行更新。这样做减少了很多不需要的 DOM 操作，大大提高了性能。

Vue 就使用了这样的抽象节点 VNode，它是对真实 DOM 的一层抽象，而不依赖某个平台，它可以是浏览器平台，也可以是 weex，甚至是 node 平台也可以对这样一棵抽象 DOM 树进行创建删除修改等操作，这也为前后端同构提供了可能。

具体 VNode 的细节可以看[VNode 节点](./VNode节点.html)。

## 修改视图

众所周知，Vue 通过数据绑定来修改视图，当某个数据被修改的时候，set 方法会让闭包中的 Dep 调用 notify 通知所有订阅者 Watcher，Watcher 通过 get 方法执行 vm.\_update(vm.\_render(), hydrating)。

这里看一下\_update 方法

```JavaScript
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    /*如果已经该组件已经挂载过了则代表进入这个步骤是个更新的过程，触发beforeUpdate钩子*/
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate')
    }
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const prevActiveInstance = activeInstance
    activeInstance = vm
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    /*基于后端渲染Vue.prototype.__patch__被用来作为一个入口*/
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      )
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    activeInstance = prevActiveInstance
    // update __vue__ reference
    /*更新新的实例对象的__vue__*/
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }
```

\_update 方法的第一个参数是一个 VNode 对象，在内部会将该 VNode 对象与之前旧的 VNode 对象进行**patch**。

什么是**patch**呢？

## **patch**

patch 将新老 VNode 节点进行比对，然后将根据两者的比较结果进行最小单位地修改视图，而不是将整个视图根据新的 VNode 重绘。patch 的核心在于 diff 算法，这套算法可以高效地比较 virtual DOM 的变更，得出变化以修改视图。

那么 patch 如何工作的呢？

首先说一下 patch 的核心 diff 算法，diff 算法是通过同层的树节点进行比较而非对树进行逐层搜索遍历的方式，所以时间复杂度只有 O(n)，是一种相当高效的算法。

![img](https://i.loli.net/2017/08/27/59a23cfca50f3.png)

![img](https://i.loli.net/2017/08/27/59a2419a3c617.png)

这两张图代表旧的 VNode 与新 VNode 进行 patch 的过程，他们只是在同层级的 VNode 之间进行比较得到变化（第二张图中相同颜色的方块代表互相进行比较的 VNode 节点），然后修改变化的视图，所以十分高效。

让我们看一下 patch 的代码。

```JavaScript
  /*createPatchFunction的返回值，一个patch函数*/
  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    /*vnode不存在则直接调用销毁钩子*/
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false
    const insertedVnodeQueue = []

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      /*oldVnode未定义的时候，其实也就是root节点，创建一个新的节点*/
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue, parentElm, refElm)
    } else {
      /*标记旧的VNode是否有nodeType*/

      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        /*是同一个节点的时候直接修改现有的节点*/
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            /*当旧的VNode是服务端渲染的元素，hydrating记为true*/
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          if (isTrue(hydrating)) {
            /*需要合并到真实DOM上*/
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              /*调用insert钩子*/
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              )
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          /*如果不是服务端渲染或者合并到真实DOM失败，则创建一个空的VNode节点替换它*/
          oldVnode = emptyNodeAt(oldVnode)
        }
        // replacing existing element
        /*取代现有元素*/
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )

        if (isDef(vnode.parent)) {
          // component root element replaced.
          // update parent placeholder node element, recursively
          /*组件根节点被替换，遍历更新父节点element*/
          let ancestor = vnode.parent
          while (ancestor) {
            ancestor.elm = vnode.elm
            ancestor = ancestor.parent
          }
          if (isPatchable(vnode)) {
            /*调用create回调*/
            for (let i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent)
            }
          }
        }

        if (isDef(parentElm)) {
          /*移除老节点*/
          removeVnodes(parentElm, [oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {

          /*调用destroy钩子*/
          invokeDestroyHook(oldVnode)
        }
      }
    }

    /*调用insert钩子*/
    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
```

从代码中不难发现，当 oldVnode 与 vnode 在 sameVnode 的时候才会进行 patchVnode，也就是新旧 VNode 节点判定为同一节点的时候才会进行 patchVnode 这个过程，否则就是创建新的 DOM，移除旧的 DOM。

怎么样的节点算 sameVnode 呢？

## sameVnode

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
  某些浏览器不支持动态修改<input>类型，所以他们被视为不同节点
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

## patchVnode

还是先来看一下 patchVnode 的代码。

```JavaScript
  /*patch VNode节点*/
  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    /*两个VNode节点相同则直接返回*/
    if (oldVnode === vnode) {
      return
    }
    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    /*
      如果新旧VNode都是静态的，同时它们的key相同（代表同一节点），
      并且新的VNode是clone或者是标记了once（标记v-once属性，只渲染一次），
      那么只需要替换elm以及componentInstance即可。
    */
    if (isTrue(vnode.isStatic) &&
        isTrue(oldVnode.isStatic) &&
        vnode.key === oldVnode.key &&
        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
      vnode.elm = oldVnode.elm
      vnode.componentInstance = oldVnode.componentInstance
      return
    }
    let i
    const data = vnode.data
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      /*i = data.hook.prepatch，如果存在的话，见"./create-component componentVNodeHooks"。*/
      i(oldVnode, vnode)
    }
    const elm = vnode.elm = oldVnode.elm
    const oldCh = oldVnode.children
    const ch = vnode.children
    if (isDef(data) && isPatchable(vnode)) {
      /*调用update回调以及update钩子*/
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }
    /*如果这个VNode节点没有text文本时*/
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        /*新老节点均有children子节点，则对子节点进行diff操作，调用updateChildren*/
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) {
        /*如果老节点没有子节点而新节点存在子节点，先清空elm的文本内容，然后为当前节点加入子节点*/
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        /*当新节点没有子节点而老节点有子节点的时候，则移除所有ele的子节点*/
        removeVnodes(elm, oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        /*当新老节点都无子节点的时候，只是文本的替换，因为这个逻辑中新节点text不存在，所以直接去除ele的文本*/
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      /*当新老节点text不一样时，直接替换这段文本*/
      nodeOps.setTextContent(elm, vnode.text)
    }
    /*调用postpatch钩子*/
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
    }
  }
```

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

## DOM 操作

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
