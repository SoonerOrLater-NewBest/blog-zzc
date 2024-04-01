---
customLabelArray: [2]
---

# <Label :level='2'/>Vue.js 异步更新 DOM 策略及 nextTick

## 操作 DOM

在使用 vue.js 的时候，有时候因为一些特定的业务场景，不得不去操作 DOM，比如这样：

```html
<template>
  <div>
    <div ref="test">{{test}}</div>
    <button @click="handleClick">tet</button>
  </div>
</template>
```

```javascript
export default {
    data () {
        return {
            test: 'begin'
        };
    },
    methods () {
        handleClick () {
            this.test = 'end';
            console.log(this.$refs.test.innerText);//打印“begin”
        }
    }
}
```

打印的结果是 begin，为什么我们明明已经将 test 设置成了“end”，获取真实 DOM 节点的 innerText 却没有得到我们预期中的“end”，而是得到之前的值“begin”呢？

## Watcher 队列

带着疑问，我们找到了 Vue.js 源码的 Watch 实现。当某个响应式数据发生变化的时候，它的 setter 函数会通知闭包中的 Dep，Dep 则会调用它管理的所有 Watch 对象。触发 Watch 对象的 update 实现。我们来看一下 update 的实现。

```javascript
update () {
    /* istanbul ignore else */
    if (this.lazy) {
        this.dirty = true
    } else if (this.sync) {
        /*同步则执行run直接渲染视图*/
        this.run()
    } else {
        /*异步推送到观察者队列中，下一个tick时调用。*/
        queueWatcher(this)
    }
}
```

我们发现 Vue.js 默认是使用[异步执行 DOM 更新](https://cn.vuejs.org/v2/guide/reactivity.html#异步更新队列)。
当异步执行 update 的时候，会调用 queueWatcher 函数。

```javascript
/*将一个观察者对象push进观察者队列，在队列中已经存在相同的id则该观察者对象将被跳过，除非它是在队列被刷新时推送*/
export function queueWatcher(watcher: Watcher) {
  /*获取watcher的id*/
  const id = watcher.id;
  /*检验id是否存在，已经存在则直接跳过，不存在则标记哈希表has，用于下次检验*/
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      /*如果没有flush掉，直接push到队列中即可*/
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1;
      while (i >= 0 && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}
```

查看 queueWatcher 的源码我们发现，Watch 对象并不是立即更新视图，而是被 push 进了一个队列 queue，此时状态处于 waiting 的状态，这时候会继续会有 Watch 对象被 push 进这个队列 queue，等到下一个 tick 运行时，这些 Watch 对象才会被遍历取出，更新视图。同时，id 重复的 Watcher 不会被多次加入到 queue 中去，因为在最终渲染时，我们只需要关心数据的最终结果。

那么，什么是下一个 tick？

## nextTick

vue.js 提供了一个[nextTick](https://cn.vuejs.org/v2/api/#Vue-nextTick)函数，其实也就是上面调用的 nextTick。

nextTick 的实现比较简单，执行的目的是在 microtask 或者 task 中推入一个 function，在当前栈执行完毕（也许还会有一些排在前面的需要执行的任务）以后执行 nextTick 传入的 function，看一下源码：

```javascript
/**
 * Defer a task to execute it asynchronously.
 */
/*
    延迟一个任务使其异步执行，在下一个tick时执行，一个立即执行函数，返回一个function
    这个函数的作用是在task或者microtask中推入一个timerFunc，在当前调用栈执行完以后以此执行直到执行到timerFunc
    目的是延迟到当前调用栈执行完以后执行
*/
export const nextTick = (function () {
  /*存放异步执行的回调*/
  const callbacks = [];
  /*一个标记位，如果已经有timerFunc被推送到任务队列中去则不需要重复推送*/
  let pending = false;
  /*一个函数指针，指向函数将被推送到任务队列中，等到主线程任务执行完时，任务队列中的timerFunc被调用*/
  let timerFunc;

  /*下一个tick时的回调*/
  function nextTickHandler() {
    /*一个标记位，标记等待状态（即函数已经被推入任务队列或者主线程，已经在等待当前栈执行完毕去执行），这样就不需要在push多个回调到callbacks时将timerFunc多次推入任务队列或者主线程*/
    pending = false;
    /*执行所有callback*/
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */

  /*
    这里解释一下，一共有Promise、MutationObserver以及setTimeout三种尝试得到timerFunc的方法
    优先使用Promise，在Promise不存在的情况下使用MutationObserver，这两个方法都会在microtask中执行，会比setTimeout更早执行，所以优先使用。
    如果上述两种方法都不支持的环境则会使用setTimeout，在task尾部推入这个函数，等待调用执行。
    参考：https://www.zhihu.com/question/55364497
  */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    /*使用Promise*/
    var p = Promise.resolve();
    var logError = (err) => {
      console.error(err);
    };
    timerFunc = () => {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) setTimeout(noop);
    };
  } else if (
    typeof MutationObserver !== 'undefined' &&
    (isNative(MutationObserver) ||
      // PhantomJS and iOS 7.x
      MutationObserver.toString() === '[object MutationObserverConstructor]')
  ) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    /*新建一个textNode的DOM对象，用MutationObserver绑定该DOM并指定回调函数，在DOM变化的时候则会触发回调,该回调会进入主线程（比任务队列优先执行），即textNode.data = String(counter)时便会触发回调*/
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = () => {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    /*使用setTimeout将回调推入任务队列尾部*/
    timerFunc = () => {
      setTimeout(nextTickHandler, 0);
    };
  }

  /*
    推送到队列中下一个tick时执行
    cb 回调函数
    ctx 上下文
  */
  return function queueNextTick(cb?: Function, ctx?: Object) {
    let _resolve;
    /*cb存到callbacks中*/
    callbacks.push(() => {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => {
        _resolve = resolve;
      });
    }
  };
})();
```

它是一个立即执行函数,返回一个 queueNextTick 接口。

传入的 cb 会被 push 进 callbacks 中存放起来，然后执行 timerFunc（pending 是一个状态标记，保证 timerFunc 在下一个 tick 之前只执行一次）。

timerFunc 是什么？

看了源码发现 timerFunc 会检测当前环境而不同实现，其实就是按照 Promise，MutationObserver，setTimeout 优先级，哪个存在使用哪个，最不济的环境下使用 setTimeout。

这里解释一下，一共有 Promise、MutationObserver 以及 setTimeout 三种尝试得到 timerFunc 的方法。
优先使用 Promise，在 Promise 不存在的情况下使用 MutationObserver，这两个方法的回调函数都会在 microtask 中执行，它们会比 setTimeout 更早执行，所以优先使用。
如果上述两种方法都不支持的环境则会使用 setTimeout，在 task 尾部推入这个函数，等待调用执行。

为什么要优先使用 microtask？我在顾轶灵在知乎的回答中学习到：

```
JS 的 event loop 执行时会区分 task 和 microtask，引擎在每个 task 执行完毕，从队列中取下一个 task 来执行之前，会先执行完所有 microtask 队列中的 microtask。
setTimeout 回调会被分配到一个新的 task 中执行，而 Promise 的 resolver、MutationObserver 的回调都会被安排到一个新的 microtask 中执行，会比 setTimeout 产生的 task 先执行。
要创建一个新的 microtask，优先使用 Promise，如果浏览器不支持，再尝试 MutationObserver。
实在不行，只能用 setTimeout 创建 task 了。
为啥要用 microtask？
根据 HTML Standard，在每个 task 运行完以后，UI 都会重渲染，那么在 microtask 中就完成数据更新，当前 task 结束就可以得到最新的 UI 了。
反之如果新建一个 task 来做数据更新，那么渲染就会进行两次。

参考顾轶灵知乎的回答：https://www.zhihu.com/question/55364497/answer/144215284
```

首先是 Promise，Promise.resolve().then()可以在 microtask 中加入它的回调，

MutationObserver 新建一个 textNode 的 DOM 对象，用 MutationObserver 绑定该 DOM 并指定回调函数，在 DOM 变化的时候则会触发回调,该回调会进入 microtask，即 textNode.data = String(counter)时便会加入该回调。

setTimeout 是最后的一种备选方案，它会将回调函数加入 task 中，等到执行。

综上，nextTick 的目的就是产生一个回调函数加入 task 或者 microtask 中，当前栈执行完以后（可能中间还有别的排在前面的函数）调用该回调函数，起到了异步触发（即下一个 tick 时触发）的目的。

## flushSchedulerQueue

```javascript
/**
 * Flush both queues and run the watchers.
 */
/*nextTick的回调函数，在下一个tick时flush掉两个队列同时运行watchers*/
function flushSchedulerQueue() {
  flushing = true;
  let watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  /*
    给queue排序，这样做可以保证：
    1.组件更新的顺序是从父组件到子组件的顺序，因为父组件总是比子组件先创建。
    2.一个组件的user watchers比render watcher先运行，因为user watchers往往比render watcher更早创建
    3.如果一个组件在父组件watcher运行期间被销毁，它的watcher执行将被跳过。
  */
  queue.sort((a, b) => a.id - b.id);

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  /*这里不用index = queue.length;index > 0; index--的方式写是因为不要将length进行缓存，因为在执行处理现有watcher对象期间，更多的watcher对象可能会被push进queue*/
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    /*将has的标记删除*/
    has[id] = null;
    /*执行watcher*/
    watcher.run();
    // in dev build, check and stop circular updates.
    /*
      在测试环境中，检测watch是否在死循环中
      比如这样一种情况
      watch: {
        test () {
          this.test++;
        }
      }
      持续执行了一百次watch代表可能存在死循环
    */
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' +
            (watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`),
          watcher.vm
        );
        break;
      }
    }
  }

  // keep copies of post queues before resetting state
  /**/
  /*得到队列的拷贝*/
  const activatedQueue = activatedChildren.slice();
  const updatedQueue = queue.slice();

  /*重置调度者的状态*/
  resetSchedulerState();

  // call component updated and activated hooks
  /*使子组件状态都改编成active同时调用activated钩子*/
  callActivatedHooks(activatedQueue);
  /*调用updated钩子*/
  callUpdateHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}
```

flushSchedulerQueue 是下一个 tick 时的回调函数，主要目的是执行 Watcher 的 run 函数，用来更新视图

## 为什么要异步更新视图

来看一下下面这一段代码

```html
<template>
  <div>
    <div>{{test}}</div>
  </div>
</template>
```

```javascript
export default {
  data() {
    return {
      test: 0
    };
  },
  mounted() {
    for (let i = 0; i < 1000; i++) {
      this.test++;
    }
  }
};
```

现在有这样的一种情况，mounted 的时候 test 的值会被++循环执行 1000 次。
每次++时，都会根据响应式触发 setter->Dep->Watcher->update->patch。
如果这时候没有异步更新视图，那么每次++都会直接操作 DOM 更新视图，这是非常消耗性能的。
所以 Vue.js 实现了一个 queue 队列，在下一个 tick 的时候会统一执行 queue 中 Watcher 的 run。同时，拥有相同 id 的 Watcher 不会被重复加入到该 queue 中去，所以不会执行 1000 次 Watcher 的 run。最终更新视图只会直接将 test 对应的 DOM 的 0 变成 1000。
保证更新视图操作 DOM 的动作是在当前栈执行完以后下一个 tick 的时候调用，大大优化了性能。

## 访问真实 DOM 节点更新后的数据

所以我们需要在修改 data 中的数据后访问真实的 DOM 节点更新后的数据，只需要这样，我们把文章第一个例子进行修改。

```html
<template>
  <div>
    <div ref="test">{{test}}</div>
    <button @click="handleClick">tet</button>
  </div>
</template>
```

```javascript
export default {
    data () {
        return {
            test: 'begin'
        };
    },
    methods () {
        handleClick () {
            this.test = 'end';
            this.$nextTick(() => {
                console.log(this.$refs.test.innerText);//打印"end"
            });
            console.log(this.$refs.test.innerText);//打印“begin”
        }
    }
}
```

使用 Vue.js 的 global API 的\$nextTick 方法，即可在回调中获取已经更新好的 DOM 实例了。
