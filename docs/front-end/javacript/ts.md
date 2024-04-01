---
customLabelArray: [1, 3]
---

# <Label :level='1'/>TypeScript 概念篇

> 大量摘抄于各类文章 ———— 站在巨人的肩膀上搬砖

[TypeScript 官方文档](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
[（中文版）](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/tsconfig.json.html)
是最好的学习材料

## TS 是什么

TypeScript = Type + Script（标准 JS）。我们从 TS 的官方网站上就能看到定义：TypeScript is a typed superset of JavaScript that compiles to plain JavaScript。TypeScript 是一个编译到纯 JS 的有类型定义的 JS 超集。

## 为什么要用 TS

- 类型安全，可以类比 Java。
- TS 面向对象理念，支持面向对象的封装、继承、多态三大特性
- 类似 babel，ES6 ES7 新语法都可以写，最终 TS 会进行编译。
- 生产力工具的提升，VS Code + TS 使 IDE 更容易理解你的代码
- 给应用配置、应用状态、前后端接口及各种模块定义类型，使协作更为方便、高效和安全，整个应用就是类型定义文档
- 类型系统+静态分析检查+智能感知/提示，使大规模的应用代码质量更高，运行时 bug 更少，更方便维护和重构

### 静态类型、动态类型和弱类型、强类型

- 静态类型：编译期就知道每一个变量的类型。类型错误编译失败是语法问题。如 Java、C++。
- 动态类型：编译期不知道类型，运行时才知道。类型错误抛出异常发生在运行时。如 JS、Python。
- 弱类型：容忍隐式类型转换。如 JS，1+'1'='11'，数字型转成了字符型。
- 强类型：不容忍隐式类型转换。如 Python，1+'1'会抛出 TypeError。

### 权衡

如何更好的利用 JS 的动态性和 TS 的静态特质，我们需要结合项目的实际情况来进行综合判断。一些建议：

- 如果是中小型项目，且生命周期不是很长，那就直接用 JS 吧，不要被 TS 束缚住了手脚。
- 如果是大型应用，且生命周期比较长，那建议试试 TS。开源项目如[VS Code](https://github.com/Microsoft/vscode)、[GitHub 桌面端](https://github.com/desktop/desktop)。
- 如果是框架、库之类的公共模块，那更建议用 TS 了。

至于到底用不用 TS，还是要看实际项目规模、项目生命周期、团队规模、团队成员情况等实际情况综合考虑。

## TS 能干什么

### 静态检查

> 低级错误、非空判断、类型推断，这类问题是 ESLint 等工具检测不出来的。

- 基础类型

```ts
let isDone: boolean = false;

let decimal: number = 6;

let color: string = 'blue';

// 数组，有两种写法
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];

// 元组(Tuple)
let x: [string, number] = ['hello', 10];

// 枚举
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4
}
let c: Color = Color.Green;

// 不确定的可以先声明为any
let notSure: any = 4;

// 声明没有返回值
function warnUser(): void {
  alert('This is my warning message');
}

let u: undefined = undefined;

let n: null = null;

// 类型永远没返回
function error(message: string): never {
  throw new Error(message);
}

// 类型主张，就是知道的比编译器多，主动告诉编译器更多信息，有两种写法
let someValue: any = 'this is a string';
let strLength: number = (<string>someValue).length;
let strLength: number = (someValue as string).length;
```

### 面向对象编程增强

- 访问权限控制

信息隐藏有助于更好的管理系统的复杂度，这在软件工程中显得尤为重要。

```ts
class Person {
  protected name: string;
  public age: number;
  constructor(name: string) {
    this.name = name;
  }
}

class Employee extends Person {
  static someAttr = 1;
  private department: string;

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }
}
let howard = new Employee('Howard', 'Sales');
console.log(howard.name);
// 报错：Person中name属性是protected类型，只能在自己类中或者子类中使用
```

- 接口 interface

Robot 类可以继承 Base 类，并实现 Machine 和 Human 接口，
这种可以组合继承类和实现接口的方式使面向对象编程更为灵活、可扩展性更好。

```ts
interface Machine {
  move(): void;
}

interface Human {
  run(): void;
}

class Base {}

class Robot extends Base implements Machine, Human {
  run() {
    console.log('run');
  }
  move() {
    console.log('move');
  }
}
```

- 泛型

定义了一个模板类型 T，实例化 GenericNumber 类时可以传入内置类型或者自定义类型。泛型（模板）在传统面向对象编程语言中是很常见的概念了，在代码逻辑是通用模式化的，参数可以是动态类型的场景下比较有用。

```ts
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

- 类型系统

定义了一个系统配置类型 SystemConfig 和一个模块类型 ModuleType，我们在使用这些类型时就不能随便修改 config 和 mod 的数据了,这对于多人协作的团队项目非常有帮助。

```ts
interface SystemConfig {
  attr1: number;
  attr2: string;
  func1(): string;
}

interface ModuleType {
  data: {
    attr1?: string;
    attr2?: number;
  };
  visible: boolean;
}

const config: SystemConfig = {
  attr1: 1,
  attr2: 'str',
  func1: () => ''
};

const mod: ModuleType = {
  data: {
    attr1: '1'
  },
  visible: true
};
```

- 模块系统增强 module/namespace
  TS 除了支持 ES6 的模块系统之外，还支持命名空间。这在管理复杂模块的内部时比较有用。

```ts
namespace N {
  export namespace NN {
    export function a() {
      console.log('N.a');
    }
  }
}

N.NN.a();
```

[面向对象相关概念详见](https://ts.xcatliu.com/advanced/class)

### vs Babel

- Web 和 Node 平台的 JS 始终与 JS 最新规范有一段距离，Web 平台的距离更远，TS 可以填充这个间隙，让使用者在 Web 和 Node 平台都能用上最新的 Feature，用上优雅的 JS，提高生产力。
- Babel 也是很不错的 ES6 to 5 编译工具，有不错的插件机制，社区发展也不错，但在同样一段代码编译出的 JS 代码里可以看到，TS 编译后的代码是更符合习惯、简洁易读一些（都用的是官方网站的 Playground 工具）。

## 使用 TS 的成本

### 老项目

对于老项目，由于 TS 兼容 ES 规范，所以可以比较方便的升级现有的 JS（这里指 ES6 及以上）代码，逐渐的加类型注解，渐进式增强代码健壮性。迁移过程：

1. npm 全局安装 typescript 包，并在工程根目录运行 tsc --init，自动产生 tsconfig.json 文件。 默认的 3 个配置项：[更多配置项说明](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

- `"target":"es5"`：编译后代码的 ES 版本，还有 es3，es2105 等选项。
- `"module":"commonjs"`：编译后代码的模块化组织方式，还有 amd，umd，es2015 等选项。
- `"strict":true`：严格校验，包含不能有没意义的 any，null 校验等选项。

2. 初始化得到的`tsconfig.json`无需修改，增加`"allowJs": true`选项。

3. 配置 webpack 配置，增加 ts 的 loader，如 awesome-typescript-loader。

```json
loaders: [
	// All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
	{ test: /\.tsx?$/, loader: "awesome-typescript-loader" }
]
```

4. 此时你可以写文件名为 ts 和 tsx 后缀的代码了，它可以和现有的 ES6 代码共存，重构以前的 ES6 代码为 TS 代码，只需将文件后缀改成 ts(x)就行，就可以享受 TS 及 IDE 智能感知/纠错带来的好处。

[tsconfig.json 配置参阅](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/tsconfig.json.html)

### 新项目

对于新项目，微软提供了非常棒的一些 Starter 项目，详细介绍了如何用 TS 和其他框架、库配合使用。如果是 React 项目，可以参考这个 Starter：[TypeScript-React-Starter](https://github.com/Microsoft/TypeScript-React-Starter)

## 周边生态

### 类型声明包

React、及其他各种著名框架、库都有 TS 类型声明，我们可以在项目中通过 npm install @types/react 方式安装，可以在[这个网站](http://microsoft.github.io/TypeSearch/)搜索你想要安装的库声明包。安装后，写和那些框架、库相关的代码将会是一种非常爽的体验，函数的定义和注释将会自动提示出来，开发效率将会得到提升。

## TS 进阶

### 类型别名 type

- 相当于自定义一个类型

```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
  if (typeof n === 'string') {
    return n;
  } else {
    return n();
  }
}
```

### 交叉类型 ( & )

- 交叉类型 intersection types 是将多个类型合并成一个类型

```ts
type Person = Huaren & Bairen & Heiren;
```

### 联合类型 ( | )

- 联合类型（Union Types）表示取值可以为多种类型中的一种
- 当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法：

```ts
function getLength(something: string | number): number {
    return something.length;❌
}
// index.ts(2,22): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.

function getString(something: string | number): string {
    return something.toString();✅
}
```

### 字符串字面量类型

- 字符串字面量类型用来约束取值只能是某几个字符串中的一个

```ts
type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames) {
  // do something
}

handleEvent(document.getElementById('hello'), 'scroll'); // 没问题
handleEvent(document.getElementById('world'), 'dblclick'); // 报错，event 不能为 'dblclick'

// index.ts(7,47): error TS2345: Argument of type '"dblclick"' is not assignable to parameter of type 'EventNames'.
```

### 类型保护

- 当我们需要在还不确定类型的时候就访问其中一个类型特有的属性或方法，就要用到类型保护

#### 使用类型断言

```ts
interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}
function isFish(animal: Cat | Fish) {
    if (typeof animal.swim === 'function'❌) {
        return true;
    }
    return false;
}
// index.ts:11:23 - error TS2339: Property 'swim' does not exist on type 'Cat | Fish'.
//   Property 'swim' does not exist on type 'Cat'.

function isFish(animal: Cat | Fish) {
    if (typeof (animal as Fish✅).swim === 'function') {
        return true;
    }
    return false;
}
```

#### 使用类型守卫

**类型谓词守卫自定义类型**

- 返回值 animal is Fish 就是类型谓词
- 谓词形式为 parameterName is Type，parameterName 必须是来自于当前函数签名里的参数名

```ts
function isFish(animal: Fish | Bird): animal is Fish {
  return (animal as Fish).swim !== undefined;
}
```

**typeof 类型守卫**

- 只有`typeof v === "typename"`和`typeof v !== "typename"`两种形式能被识别
- typeof 只能用于 `"number"`, `"string"`, `"boolean"`, `"symbol"`
- TypeScript 并不会阻止你与其它字符串比较，语言不会把那些表达式识别为类型守卫

**instanceof 类型守卫**

- `instanceof`用于守护类

```ts
function getRandomPadder() {
  return Math.random() < 0.5 ? new SpaceRepeatingPadder(4) : new StringPadder('  ');
}

// 类型为SpaceRepeatingPadder | StringPadder
let padder: Padder = getRandomPadder();

if (padder instanceof SpaceRepeatingPadder) {
  padder; // 类型细化为'SpaceRepeatingPadder'
}
if (padder instanceof StringPadder) {
  padder; // 类型细化为'StringPadder'
}
```

### 泛型约束

- 使用 extends 约束泛型 T 必须符合接口 Lengthwise 的形状，也就是必须包含 length 属性

```ts
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

### 索引类型

- 索引类型查询操作符 ( keyof )
- 索引访问操作符 ( T[K] )
- 对于任何类型 T， keyof T 的结果为 T 上已知的公共属性名联合的字符串字面量类型

**举个例子：**

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
interface IObj {
  name: string;
  age: number;
  male: boolean;
}
const obj: IObj = {
  name: 'zhangsan',
  age: 18,
  male: true
};
let x1 = getProperty(obj, 'name'); // 允许，x1的类型为string
let x2 = getProperty(obj, 'age'); // 允许，x2的类型为number
let x3 = getProperty(obj, 'male'); // 允许，x3的类型为boolean
let x4 = getProperty(obj, 'sex'); // 报错：Argument of type '"sex"' is not
// assignable to parameter of type '"name" | "age" | "male"'.
```

1. 上述例子，定义了一个`getProperty`函数，来获取指定对象的指定属性
2. 首先，使用`keyof`关键字，获得泛型`T`上已知的公共属性名联合的字符串字面量类型`'name' | 'age' | 'male'`
3. 然后，使用泛型约束`K extends keyof T`限制`K`只能是`'name' | 'age' | 'male'`中的一个值
4. 而`T[K]`则代表对象里对应 key 的元素的类型

**更好的理解索引类型**

```ts
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
  return names.map((n) => o[n]);
}
// T[K][]也可以写成 Array<T[K]>
interface Person {
  name: string;
  age: number;
  sex: string;
}
let person: Person = {
  name: 'Jarid',
  age: 35,
  sex: '男'
};
let strings: string[] = pluck(person, ['name', 'sex']); // ok, string[], [ 'Jarid', '男' ]
let numbers: number[] = pluck(person, ['age']); // ok, number[], [ 35 ]
let persons: (string | number)[] = pluck(person, ['name', 'sex', 'age']); // [ 'Jarid', '男', 35 ]
```

### 动态声明字符串字面量类型

- 结合` type``keyof `我们就可以获取跟随`interface Person`变化的字符串字面量类型

```ts
interface Person {
  name: string;
  age: number;
  location: string;
}

type K1 = keyof Person; // "name" | "age" | "location"
type K2 = keyof Person[]; // "length" | "push" | "pop" | "concat" | ...
type K3 = keyof { [x: string]: Person }; // string
```

### 映射类型 - 从旧类型中创建新类型

```ts
interface Person {
    name: string;
    age: number;
}
type Partial<T> = {
    [P in keyof T]?: T[P];
}
type PersonPartial = Partial<Person>;
---------------------------------------
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
}
type ReadonlyPerson = Readonly<Person>;
// 相当于
type ReadonlyPerson = {
  readonly name: string;
  readonly age: number;
}
```

### 实用工具类型

- TypeScript 提供一些工具类型来帮助常见的类型转换
- [详见](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Utility%20Types.html)

```ts
​Omit<T, K>​ TypeScript 3.5 //让我们可以从一个对象类型中剔除某些属性，并创建一个新的对象类型
Partial<T>，TypeScript 2.1 // 将构造类型T所有的属性设置为可选的
Readonly<T>，TypeScript 2.1 // 将构造类型T所有的属性设置为只读的
Record<K,T>，TypeScript 2.1 // 可用来将某个类型的属性映射到另一个类型上
Pick<T,K>，TypeScript 2.1 // 从类型T中挑选部分属性K来构造类型
Exclude<T,U>，TypeScript 2.8 // 从类型T中剔除所有可以赋值给U的属性，然后构造一个类型
Extract<T,U>，TypeScript 2.8 // 从类型T中提取所有可以赋值给U的类型，然后构造一个类型
NonNullable<T>，TypeScript 2.8 // 从类型T中剔除null和undefined，然后构造一个类型
ReturnType<T>，TypeScript 2.8 // 由函数类型T的返回值类型构造一个类型
InstanceType<T>，TypeScript 2.8 // 由构造函数类型T的实例类型构造一个类型
Required<T>，TypeScript 2.8 // 构造一个类型，使类型T的所有属性为required必选
ThisType<T>，TypeScript 2.8 // 这个工具不会返回一个转换后的类型。它做为上下文的this类型的一个标记。注意，若想使用此类型，必须启用--noImplicitThis
```

## react 中使用 TypeScript

### 在 react 中使用 ts 的几点原则和变化

- 所有用到`jsx`语法的文件都需要以`tsx`后缀命名
- 使用组件声明时的`Component<P, S>`泛型参数声明，来代替`PropTypes`！
- 全局变量或者自定义的`window`对象属性，统一在项目根下的`global.d.ts`中进行声明定义
- 对于项目中常用到的接口数据对象，在`types/`目录下定义好其结构化类型声明

### 类组件的声明

```js
class App extends Component<IProps, IState> {
    static defaultProps = {
        // ...
    }

    readonly state = {
        // ...
    };
    // 小技巧：如果state很复杂不想一个个都初始化，
    // 可以结合类型断言初始化state为空对象或者只包含少数必须的值的对象:
    // readonly state = {} as IState;
}
```

[ts 断言参考资料](https://ts.xcatliu.com/basics/type-assertion)

需要特别强调的是，如果用到了`state`，除了在声明组件时通过泛型参数传递其`state`结构，还需要在初始化`state`时声明为 `readonly` 这是因为我们使用 class properties 语法对 state 做初始化时，会覆盖掉`Component<P, S>`中对`state`的`readonly`标识。

### 函数式组件的声明

```js
// SFC: stateless function components
// v16.7起，由于hooks的加入，函数式组件也可以使用state，所以这个命名不准确。
// 新的react声明文件里，也定义了React.FC类型
const List: React.SFC<IProps> = (props) => null;
```

### TypeScript 中使用 React Hook

#### useState

- 大多数情况下，useState 的类型可以从初始化值推断出来。但当我们初始化值为 null、undefined 或者对象以及数组的时候，我们需要制定 useState 的类型

```ts
// 可以推断 age 是 number类型
const [age, setAge] = useState(20);

// 初始化值为 null 或者 undefined时，需要显示指定 name 的类型
const [name, setName] = useState<string>();

// 初始化值为一个对象时
interface People {
    name: string;
    age: number;
    country?: string;
}
const [owner, setOwner] = useState<People>({name: 'rrd_fe', age: 5});

// 初始化值是一个数组时
const [members, setMembers] = useState<People[]([]);
```

- 其他钩子函数详见[TypeScript 中使用 React Hook](https://blog.csdn.net/stone805/article/details/92787346)

### class 组件都要指明 props 和 state 类型吗？

- 只要在组件内部使用了 props 和 state，就需要在声明组件时指明其类型。
- 但是，只要我们初始化了 state，貌似即使没有声明 state 的类型，也可以正常调用以及 setState。不过，这么做会让组件丢失对 state 的访问和类型检查！

```js
// bad one
class App extends Component {
    state = {
        a: 1,
        b: 2
    }

    componentDidMount() {
        this.state.a // ok: 1

        // 假如通过setState设置并不存在的c，TS无法检查到。
        this.setState({
            c: 3
        })；

        this.setState(true)； // ???
    }
    // ...
}

// React Component
class Component<P, S> {
        constructor(props: Readonly<P>);
        setState<K extends keyof S>(
            state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
            callback?: () => void
        ): void;
        forceUpdate(callBack?: () => void): void;
        render(): ReactNode;
        readonly props: Readonly<{ children?: ReactNode }> & Readonly<P>;
        state: Readonly<S>;
        context: any;
        refs: {
            [key: string]: ReactInstance
        };
    }


// interface IState{
//    a: number,
//    b: number
// }

// good one
class App extends Component<{}, { a: number, b: number }> {

    readonly state = {
        a: 1,
        b: 2
    }

    //readonly state = {} as IState,断言全部为一个值

    componentDidMount() {
        this.state.a // ok: 1

        //正确的使用了 ts 泛型指示了 state 以后就会有正确的提示
        // error: '{ c: number }' is not assignable to parameter of type '{ a: number, b: number }'
        this.setState({
            c: 3
        })；
    }
    // ...
}
```

### 使用 react 高阶组件

> 什么是 react 高阶组件？[装饰器](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Decorators.html)？

- 因为 react 中的高阶组件本质上是个高阶函数的调用，所以高阶组件的使用，我们既可以使用函数式方法调用，也可以使用装饰器。但是在 TS 中，编译器会对装饰器作用的值做签名一致性检查，而我们在高阶组件中一般都会返回新的组件，并且对被作用的组件的 props 进行修改（添加、删除）等。这些会导致签名一致性校验失败，TS 会给出错误提示。这带来两个问题：

**第一，是否还能使用装饰器语法调用高阶组件？**

- 如果这个高阶组件正确声明了其函数签名，那么应该使用函数式调用，比如 withRouter：

```js
import { RouteComponentProps } from 'react-router-dom';

const App = withRouter(
  class extends Component<RouteComponentProps> {
    // ...
  }
);

// 以下调用是ok的
<App />;
```

如上例子，我们在声明组件时，注解了组件的 props 是路由的 RouteComponentProps 结构类型，但是我们在调用 App 组件时，并不需要告知 RouteComponentProps 里具有的 location、history 等值，这是因为 withRouter 这个函数自身对其做了正确的类型声明。

**第二，使用装饰器语法或者没有函数类型签名的高阶组件怎么办？**

就是将高阶组件注入的属性都声明可选（通过 Partial 这个映射类型），或者将其声明到额外的 injected 组件实例属性上。

```js
import { RouteComponentProps } from 'react-router-dom';

// 方法一
@withRouter
class App extends Component<Partial<RouteComponentProps>> {
    public componentDidMount() {
        // 这里就需要使用非空类型断言了
        this.props.history!.push('/');
    }
    // ...
});

// 方法二
@withRouter
class App extends Component<{}> {
    get injected() {
        return this.props as RouteComponentProps
    }

    public componentDidMount() {
        this.injected.history.push('/');
    }
    // ...
```

### 如何正确的声明高阶组件？

- 声明 withVisible 这个高阶组件时，利用泛型和类型推导，对高阶组件返回的新的组件以及接收的参数组件的 props 都做出类型声明。

```js
interface IVisible {
  visible: boolean;
}

//排除 IVisible
function withVisible<Self>(
  WrappedComponent: React.ComponentType<Self & IVisible>
): React.ComponentType<Omit<Self, 'visible'>> {
  return class extends Component<Self> {
    render() {
      return <WrappedComponent {...this.props} visible={true} />;
    }
  };
}
```

---

## 拓展阅读

- [TypeScript 资源集](https://segmentfault.com/a/1190000010130073)[（github 地址）](https://github.com/semlinker/awesome-typescript)

:::tip 参考文章

[TypeScript 入门教程](https://ts.xcatliu.com/introduction/what-is-typescript)

[使用 TypeScript 装饰器装饰你的代码](https://mp.weixin.qq.com/s?__biz=MzA4Nzg0MDM5Nw==&mid=2247484428&idx=1&sn=ee364d6d4ea5bc97c5d391daa1088e98&=41#wechat_redirect)

[优雅的在 react 中使用 TypeScript](https://juejin.im/post/5bed5f03e51d453c9515e69b)

[TypeScript 中使用 React Hook](https://blog.csdn.net/stone805/article/details/92787346)

[TypeScript 体系调研报告](https://juejin.im/post/59c46bc86fb9a00a4636f939)
:::
