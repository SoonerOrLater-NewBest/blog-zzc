---
customLabelArray: [1,3]
---
# <Label :level='1'/>前端开发规范
[[toc]]
先贴上W3C的[标准规范](https://www.w3cschool.cn/webdevelopment/drshcozt.html)，然后简化后用于平常工作。

## 1、HTML 标签　
```html
自闭合（self-closing）标签，无需闭合 ( 例如： img input br hr 等 )；
可选的闭合标签（closing tag），需闭合 ( 例如：</li> 或 </body> )；
尽量减少标签数量；
语义嵌套约束

<li> 用于 <ul> 或 <ol> 下；
<dd>, <dt> 用于 <dl> 下；
<thead>, <tbody>, <tfoot>, <tr>, <td> 用于 <table> 下；
严格嵌套约束

inline-Level 元素，仅可以包含文本或其它 inline-Level 元素;
<a>里不可以嵌套交互式元素<a>、<button>、<select>等;
<p>里不可以嵌套块级元素<div>、<h1>~<h6>、<p>、<ul>/<ol>/<li>、<dl>/<dt>/<dd>、<form>等。
```
## 2、HTML 属性
　　应该按照特定的顺序出现以保证易读性，属性的定义，统一使用双引号。

* id
* class
* name
* data-xxx
* src, for, type, href
* title, alt
* aria-xxx, role
## 3、Class 和 ID
* 使用语义化、通用的命名方式；
* class 与 id 单词字母小写，多个单词组成时，id采用下划线_分隔，class采用中划线-分隔，不要驼峰命名法；
* 避免选择器嵌套层级过多，尽量少于 3 级；
* 避免选择器和 Class、ID 叠加使用；
* 使用唯一的 id 作为 Javascript hook, 同时避免创建无样式信息的 class；
　　元素选择器和 ID、Class 混合使用也违反关注分离原则。如果HTML标签修改了，就要再去修改 CSS 代码，不利于后期维护。

## 4、CSS声明块
1. 对于属性值或颜色参数，省略小于 1 的小数前面的 0 （例如，.5 代替 0.5；-.5px 代替-0.5px）；
2. 十六进制值应该全部小写和尽量简写，例如，#fff 代替 #ffffff；
3. 避免为 0 值指定单位，例如，用 margin: 0; 代替 margin: 0px;；
4. 声明顺序，相关属性应为一组，推荐的样式编写顺序

* Positioning（定位）
* Box model（盒模型）
* Typographic（印刷）
* Visual（视觉）
* 由于定位（positioning）可以从正常的文档流中移除元素，并且还能覆盖盒模型（box model）相关的样式，因此排在首位。
* 盒模型决定了组件的尺寸和位置，因此排在第二位。
* 其他属性只是影响组件的内部（inside）或者是不影响前两组属性，因此排在后面。

## 5、媒体查询（Media query）的位置
　　将媒体查询放在尽可能相关规则的附近。不要将他们打包放在一个单一样式文件中或者放在文档底部。如果你把他们分开了，将来只会被大家遗忘。

```css
.element { ... }
.element-avatar { ... }
.element-selected { ... }

@media (max-width: 768px) {
  .element { ...}
  .element-avatar { ... }
  .element-selected { ... }
}
```
## 6、不要使用 @import
　　与 <link> 相比，@import 要慢很多，不光增加额外的请求数，还会导致不可预料的问题。

　　替代办法：

* 使用多个 元素；
* 通过 Sass 或 Less 类似的 CSS 预处理器将多个 CSS 文件编译为一个文件；
* 其他 CSS 文件合并工具；
## 7、链接的样式顺序
a:link -> a:visited -> a:hover -> a:active
## 8、无需添加浏览器厂商前缀
　　使用 [Autoprefixer](https://github.com/postcss/autoprefixer) 自动添加浏览器厂商前缀，编写 CSS 时不需要添加浏览器前缀，直接使用标准的 CSS 编写。

　　Autoprefixer 通过 [Can I use](https://caniuse.com/)，按兼容的要求，对相应的 CSS 代码添加浏览器厂商前缀。

## 9、CSS模块化　　
* 以 Components 的角度思考，以两个单词命名（.article-card文章卡片）
* Components 中的 Elements，以一个单词命名（.article-card .field），对于倘若需要两个或以上单词表达的 Elements 类名，不应使用中划线和下划线连接，应直接连接（.article-card .firstname）
* Components 和 Elements 可能都会拥有 Variants，以中划线（.article-card-small .field-red）
* Components 可以互相嵌套
* 记住，你可以通过继承让事情变得更简单

**注：1、Components（组件）, Elements（元素）, Variants（变体）类似BEM的Block、Element、Modifier（修饰符）**

**2、Components 应该在不同的上下文中都可以复用，所以应避免设置以下属性：**

* Positioning (position, top, left, right, bottom)
* Floats (float, clear)
* Margins (margin)
* Dimensions (width, height) 
**3、头像和 logos 这些元素应该设置固定尺寸**
**4、倘若你需要为组件设置定位，应将在组件的上下文（父元素）中进行处理，比如以下例子中，将 widths和 floats 应用在 list component(.article-list) 当中，而不是 component(.article-card) 自身**

```css
.article-list {
    & {
      @include clearfix;
    }

    > .article-card {
      width: 33.3%;
      float: left;
    }
  }
```
## 10、学会使用scss处理复杂样式
* 用@include和@mixin创建混合
* 用@extend扩展类
* 按类别定义变量
- $f_ 字体和webfont家族
- $c_ 颜色代码
- $z_ 在整个应用程序中使用z-索引
- $t_ 动画定时
- $b_ 响应的断点
```css
// Our common variables

// Fonts
$f_arial: Arial, Helvetica, sans-serif

// Colors
$c_red: #FF0000;
$c_black: #000;

// Z-indices
$z_index_back: -1;
$z_index_base: 1;
$z_index_max: 9999;

// Animation Timings
$t_medium_animation: 200ms;

// Breakpoints
$b_mobile: 700px;
$b_desktop: 1200px;
```
## 11、CSS性能优化的一点小要求
**1. 不滥用 Float：Float在渲染时计算量比较大，尽量减少使用。**

**2. 正确使用 Display 的属性**

* display: inline后不应该再使用 width、height、margin、padding 以及 float；
* display: inline-block 后不应该再使用 float；
* display: block 后不应该再使用 vertical-align；
* display: table-* 后不应该再使用 margin 或者 float；
* 
**3. 提升 CSS 选择器性能**

* 一定程度上严禁使用*通配符以及标签选择器（span h1 a）
* 避免使用标签或 class 选择器限制 id 选择器，避免使用多层标签选择器，避免使用子选择器,应直接使用 class 选择器，减少css查找
* 使用继承（即可继承属性，优先在父元素赋值）

　　**说明：**
```css
#header > a {font-weight:blod;}
```
　　我们中的大多数人都是从左到右的阅读习惯，会习惯性的设定浏览器也是从左到右的方式进行匹配规则，推测这条规则的开销并不高。

　　我们会假设浏览器以这样的方式工作：寻找 id 为 header 的元素，然后将样式规则应用到直系子元素中的 a 元素上。我们知道文档中只有一个 id 为 header 的元素，并且它只有几个 a 元素的子节点，所以这个 CSS 选择器应该相当高效。

　　事实上，却恰恰相反，CSS 选择器是从右到左进行规则匹配。了解这个机制后，例子中看似高效的选择器在实际中的匹配开销是很高的，浏览器必须遍历页面中所有的 a 元素并且确定其父元素的 id 是否为 header 。如果把例子的子选择器改为后代选择器则会开销更多，在遍历页面中所有 a 元素后还需向其上级遍历直到根节点。

　　理解了CSS选择器从右到左匹配的机制后，明白只要当前选择符的左边还有其他选择符，样式系统就会继续向左移动，直到找到和规则匹配的选择符，或者因为不匹配而退出。我们把最右边选择符称之为关键选择器。

　　综上所述，最好直接使用class匹配相应元素，id选择器 > class选择器 > 标签选择器 > 子代选择器 > 后代选择器 （这也正是上面诸多规范合力指向的最佳实践） 

## 12、javascript

**1. 避免不必要的 DOM 操作**

　　　　浏览器遍历 DOM 元素的代价是昂贵的。最简单优化 DOM 树查询的方案是，当一个元素出现多次时，将它保存在一个变量中，就避免多次查询 DOM 树了。　

```js
// Recommended
var myList = "";
var myListHTML = document.getElementById("myList").innerHTML;

for (var i = 0; i < 100; i++) {
  myList += "<span>" + i + "</span>";
}

myListHTML = myList;

// Not recommended
for (var i = 0; i < 100; i++) {
  document.getElementById("myList").innerHTML += "<span>" + i + "</span>";
}
```
**2. 缓存数组长度**　　　　

　　循环无疑是和 JavaScript 性能非常相关的一部分。通过存储数组的长度，可以有效避免每次循环重新计算。

　　注: 虽然现代浏览器引擎会自动优化这个过程，但是不要忘记还有旧的浏览器。

```js
var arr = new Array(1000),
    len, i;
// Recommended - size is calculated only 1 time and then stored
for (i = 0, len = arr.length; i < len; i++) {

}

// Not recommended - size needs to be recalculated 1000 times
for (i = 0; i < arr.length; i++) {

}
```
　
**3. 异步加载第三方内容**

　　当你无法保证嵌入第三方内容比如 Youtube 视频或者一个 like/tweet 按钮可以正常工作的时候，你需要考虑用异步加载这些代码，避免阻塞整个页面加载。

```js
(function() {

    var script,
        scripts = document.getElementsByTagName('script')[0];

    function load(url) {
      script = document.createElement('script');
      script.async = true;
      script.src = url;
      scripts.parentNode.insertBefore(script, scripts);
    }

    load('//apis.google.com/js/plusone.js');
    load('//platform.twitter.com/widgets.js');
    load('//s.widgetsite.com/widget.js');

}());
```
**4. 避免使用 jQuery 实现动画**　

* 禁止使用 slideUp/Down() fadeIn/fadeOut() 等方法；
* 尽量不使用 animate() 方法；
* 基于 javaScript 的动画，尽量使用 requestAnimationFrame. 避免使用 setTimeout, setInterval.
* 说明：使用 CSS 声明动画会得到更好的浏览器优化，使用 translate 取代 absolute 定位就会得到更好的 fps，动画会更顺滑。