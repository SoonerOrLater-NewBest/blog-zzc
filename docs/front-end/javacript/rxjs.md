---
customLabelArray: [3]
---

# <Label :level='3'/>RxJS

> 把 RxJS 当做一个针对事件的 Lodash(一个 JS 库)。

[学习资源](https://segmentfault.com/a/1190000011801043)
[rxjs 官方文档翻译](https://buctwbzs.gitbooks.io/rxjs/content/rookie-primer.html)
[RxJS 合集](https://www.jianshu.com/nb/34925652)
[30 精通 RxJS](https://blog.jerry-hong.com/series/rxjs/thirty-days-RxJS-00/)

### Reactive Programming 的興起

## 基础知识

RxJS 中解决异步事件管理的基本概念如下：

- Observable 可观察对象：表示一个可调用的未来值或者事件的集合。
- Observer 观察者：一个回调函数集合,它知道怎样去监听被 Observable 发送的值
- Subscription 订阅： 表示一个可观察对象的执行，主要用于取消执行。
- Operators 操作符： 纯粹的函数，使得以函数编程的方式处理集合比如:map,filter,contact,flatmap。
- Subject(主题)：等同于一个事件驱动器，是将一个值或者事件广播到多个观察者的唯一途径。
- Schedulers(调度者)： 用来控制并发，当计算发生的时候允许我们协调，比如 setTimeout,requestAnimationFrame。

RxJS 中的组件
生产者：在 RxJS 中的生产者叫做 Observables。Observables 负责推送事件，但不处理事件；

消费者：在 RxJS 中的消费者叫做 Observer。

数据只会从生产者流向消费者

管道：在 RxJS 中，管道中的一个一个函数叫做 observable operators，简称 operators。

时间：我们知道异步程序不容易处理的背后实质就是时间问题，RxJS 是面向异步编程的解决方案，因此时间遍布于 RxJS 中的每一个角落。目前为止，我们只需要了解时间在 RxJS 中不是恒定的，产生事件的快慢与否取决于我们的需求。当然，RxJS 给了我们解决方案。

### Pull 拉取 VS Push 推送

拉和推是数据生产者和数据的消费者两种不同的交流协议(方式)

- Function:只在调用时惰性的计算后同步地返回一个值
- Generator(生成器):惰性计算，在迭代时同步的返回零到无限个值(如果有可能的话)
- Promise 是一个可能(也可能不)返回一个单值的计算。
- Observable 是一个从它被调用开始，可异步或者同步的返回零到多个值的惰性执行运算。

### Observable

[Observable](https://www.jianshu.com/p/721ce6870740)

### Observer

> 下面是可观察对象执行可以发送的三种类型的值

- "Next": 发送一个数字/字符串/对象等值。
- "Error": 发送一个 JS 错误或者异常。
- "Complete" 不发送值。

> 一个可观察对象的执行期间，零个到无穷多个 next 通知被发送。如果 Error 或者 Complete 通知一旦被发送，此后将不再发送任何值。

> 订阅对象有一个 unsubscribe()方法用来释放资源或者取消可观察对象的执行。

### Subject

> Subject 就是一个可观察对象，只不过可以被多播至多个观察者。同时 Subject 也类似于 EventEmitter:维护者着众多事件监听器的注册表。

> BehaviorSubject 对于表示"随时间的值"是很有用的。举个例子，人的生日的事件流是一个 Subject,然而人的年龄的流是一个 BehaviorSubject。

> 一个 ReplaySubject 从一个可观察对象的执行中记录多个值，并且可以重新发送给新的订阅者。

静态操作符是定义在类上的函数，通常被用于从头重新创建一个可观察对象。

### Scheduler 调度者

什么是调度者？调度者控制着何时启动一个订阅和何时通知被发送。它有三个组件构成:

- 一个调度者是一个数据结构。它知道如何根据优先级或其他标准存储和排列任务。
- 一个调度者是一个执行上下文。它表示何处何时任务被执行(例如: immediately(立即), or in another callback mechanism(回调机制) such as setTimeout or process.nextTick, or the animation frame)
- 一个调度者具有虚拟的时钟。它通过调度器上的 getter 方法 now()提供了“时间”的概念。 在特定调度程序上调度的任务将仅仅遵守由该时钟表示的时间。

> 调度者使得你可以确定可观察对象在什么执行上下文中给观察者发送通知

### Operators

操作符可以说是 RxJS 中的重中之重。它就是 pipeline 中的函数。

- 操作符是纯的，高阶的函数，永远不会改变 observable 对象，而是返回一个新 observable 对象，同时也为了链式调用。

- 操作符同样也是惰性求值的。

- 操作符有两种类型，实例的和静态的。前文出现过的 from 和 of 都属于静态类型(这里是面向对象的概念)。

* 一个操作符本质上是一个将某个可观察对象作为输入然后输出另一个可观察对象的纯函数。对输出的新的可观察对象进行订阅的同时也会订阅作为输入的那个可观察对象,这种现象为"操作符的订阅链"。

### RxJS 常用的 creation operator

create
of
from
fromEvent
fromPromise
never
empty
throw
interval
take 操作符：比如 take(3)，只需要 3 个事件；

first 操作符：获取事件流中的第一个事件；

last 操作符：获取事件流中的最后一个事件；

以上三个操作符都可以归为过滤类型的操作符。
do 操作符：这是一个工具类型的操作符，它的作用是方便我们进行 debug 和跟踪数据变化。你可以用它做任何操作，一般都是有副作用的操作，比如控制台打印，写入文件，修改 DOM 节点等等，但它不改变事件流中的事件。这在函数式编程称为 K combinator，或者在一些库中叫 tap 函数。

### 时间操作符

timer

interval 操作符：每隔一秒发送一个事件，值从 0 开始；

skip 操作符：跳过 1 个事件(为了方便从 1 开始计数)；

take 操作符：因为 interval 产生无限事件序列，因此这里只取 5 个事件；

do 操作符：debug 用；

delay 操作符：延迟 2 秒。或者理解为阻塞它之前的事件序列 2 秒钟；

timeInterval 操作符：计时操作符；
switchMap：参数为函数，这个函数接收事件流中的事件作为参数，返回值为另一个事件流。

filter：输入参数为一个条件函数，也就是返回布尔值的函数。意思是对原数据流中的数据进行判断，符合条件的才传递给下面的操作符。
takeWhile：输入参数和 filter 一样， 为一条件函数，返回布尔值，当接收到的数据满足条件函数才会输出，只要不满足就马上触发上游数据流的 complete 事件。

首先，withLatestFrom 操作符是个对象方法，不像 combineLatest 是个静态方法（combineLatest 在之前 RxJS 版本中也是对象方法）。其次我们看到 withLatestFrom 的用法和 combineLatest 是一致的

其实从 withLatestFrom 是对象函数就能看出，它是需要有事件流作为基础的，combineLatest 则不然，是用来创造事件流的。也就是说，当上游事件流中没有事件产生时，withLatestFrom 是不会有输出的。符如其名，withLatestFrom 会把上游事件流中的事件和接收参数中的事件流的最后一个值一起进行处理后输出。

使用 repeat 操作符的最佳实践是放在离订阅函数最近的位置。

## 实践

利用 RxJS 能把我们以前需要写很多判断，很多逻辑的 UI 交互都简化了，通过它自带的一套 Stream 的用法，可以利用更少的代码完成以前的复杂的工作量，提供了开发效率。

RxJS 同时能应用在组件状态管理中，可以参考 [Reactive 视角审视 React 组件](https://www.zybuluo.com/bornkiller/note/840550)

在 React 中，内部通过 setState 管理状态。状态的变更可以依赖 RxJS 流,在需要的 Response 中 setState 即可。

### 小练习

> 一个输入框，一个按钮，一个展示内容区域。输入任何内容，点击按钮显示之前输入过的内容，即历史记录。提示：使用到的操作符，debounceTime，pluck，bufferWhen 或 buffer，Ramda.js 库(不是必须)。
> 请用三个鼠标事件流+concatMap 操作符+takeUntil 操作符完成拖放页面元素的功能。takeUntil 操作符接收一个 observable 为参数，含义是，接收上游事件并让它通过，直到参数 observable 开始发送事件
