---
customLabelArray: [3]
---

# <Label :level='3'/>Js 正则表达式

**正则表达式的基础知识**

- [《正则表达式 30 分钟入门教程》](http://www.cnblogs.com/deerchao/archive/2006/08/24/zhengzhe30fengzhongjiaocheng.html)

**零宽断言**

- [《正则表达式之：零宽断言不『消费』》](http://fxck.it/post/50558232873)

js 中的正则表达式与 pcre(http://en.wikipedia.org/wiki/Perl_Compatible_Regular_Expressions ) 的区别

**可以所见即所得地调试测试你自己写的正则表达式**

- http://refiddle.com/

### 注意点

第一，

js 中，对于四种零宽断言，只支持 零宽度正预测先行断言 和 零宽度负预测先行断言 这两种。

第二，

js 中，正则表达式后面可以跟三个 flag，比如 /something/igm。

他们的意义分别是，

i 的意义是不区分大小写
g 的意义是，匹配多个
m 的意义是，是 ^ 和 \$ 可以匹配每一行的开头。

```js
/a/.test('A') / // => false
  a /
  i.test('A'); // => true

'hello hell hoo'.match(/h.*?\b/); // => [ 'hello', index: 0, input: 'hello hell hoo' ]
'hello hell hoo'.match(/h.*?\b/g); // => [ 'hello', 'hell', 'hoo' ]

'aaa\nbbb\nccc'.match(/^[\s\S]*?$/g); // => [ 'aaa\nbbb\nccc' ]
'aaa\nbbb\nccc'.match(/^[\s\S]*?$/gm); // => [ 'aaa', 'bbb', 'ccc' ]
```

与 m 意义相关的，还有 \A, \Z 和 \z

他们的意义分别是：

\A 字符串开头(类似^，但不受处理多行选项的影响)
\Z 字符串结尾或行尾(不受处理多行选项的影响)
\z 字符串结尾(类似\$，但不受处理多行选项的影响)

在 js 中，g flag 会影响 String.prototype.match() 和 RegExp.prototype.exec() 的行为

String.prototype.match() 中，返回数据的格式会不一样，加 g 会返回数组，不加 g 则返回比较详细的信息

```js
> 'hello hell'.match(/h(.*?)\b/g)
[ 'hello', 'hell' ]

> 'hello hell'.match(/h(.*?)\b/)
[ 'hello',
  'ello',
  index: 0,
  input: 'hello hell' ]
```

RegExp.prototype.exec() 中，加 g 之后，如果你的正则不是字面量的正则，而是存储在变量中的话，特么的这个变量就会变得有记忆！！

```js
> /h(.*?)\b/g.exec('hello hell')
[ 'hello',
  'ello',
  index: 0,
  input: 'hello hell' ]
> /h(.*?)\b/g.exec('hello hell')
[ 'hello',
  'ello',
  index: 0,
  input: 'hello hell' ]


> var re = /h(.*?)\b/g;
undefined
> re.exec('hello hell')
[ 'hello',
  'ello',
  index: 0,
  input: 'hello hell' ]
> re.exec('hello hell')
[ 'hell',
  'ell',
  index: 6,
  input: 'hello hell' ]
>
```

第三，

大家知道，. 是不可以匹配 \n 的。如果我们想匹配的数据涉及到了跨行，比如下面这样的。

````js
var multiline = require('multiline');

var text = multiline.stripIndent(function () {
  /*
    head
    ```
    code code2 .code3```
    ```
    foot
*/
});
````

如果我们想把两个 ``` 中包含的内容取出来，应该怎么办？

直接用 . 匹配不到 \n，所以我们需要找到一个原子，能匹配包括 \n 在内的所有字符。

这个原子的惯用写法就是 [\s\S]

````js
var match1 = text.match(/^```[\s\S]+?^```/gm);
console.log(match1); // => [ '```\ncode code2 code3```\n```' ]

// 这里有一种很骚的写法，[^] 与 [\s\S] 等价
var match2 = text.match(/^```[^]+?^```/gm);
console.log(match2); // => [ '```\ncode code2 .code3```\n```' ]
````

> 例子：

```js
//支持4~64位中文、英文字母、日文、数字或下划线，中文及日文算2个字符
const flag = /^[A-Za-z0-9_]{4,64}$/.test(value.replace(/[\u4e00-\u9fa5|\u0800-\u4e00]/g, 'xx'));
```

因此对于m我们要清楚它的使用，记住它只对^和$模式起作用，在这两种模式中，m的作用为：如果不加入m，则只能在第一行进行匹配，如果加入m则可以在所有的行进行匹配。只加m不加g说明，可以去多行进行匹配，但是找到一个匹配后就返回，加入g表明将多行中所有的匹配返回，当然对于match方法是如此，对于exec呢，则需要执行多次才能依次返回）