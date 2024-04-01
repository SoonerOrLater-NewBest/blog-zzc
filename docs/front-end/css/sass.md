---
customLabelArray: [2]
---
# <Label :level='2' href='https://www.jianshu.com/p/a99764ff3c41'/>Sass 基础

Sass是成熟、稳定、强大的CSS预处理器，而SCSS是Sass3版本当中引入的新语法特性，完全兼容CSS3的同时继承了Sass强大的动态功能

[[toc]]

**特性概览**

CSS书写代码规模较大的Web应用时，容易造成选择器、层叠的复杂度过高，因此推荐通过SASS预处理器进行CSS的开发，SASS提供的变量、嵌套、混合、继承等特性，让CSS的书写更加有趣与程式化

## 变量

变量用来存储需要在CSS中复用的信息，例如颜色和字体。SASS通过$符号去声明一个变量

```css
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```
上面例子中变量$font-stack和$primary-color的值将会替换所有引用他们的位置

```css
body {
  font: 100% Helvetica, sans-serif;
  color: #333; 
}
```

## 嵌套

SASS允许开发人员以嵌套的方式使用CSS，但是过度的使用嵌套会让产生的CSS难以维护，因此是一种不好的实践，下面的例子表达了一个典型的网站导航样式：

```css
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li { display: inline-block; }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```
大家注意上面代码中的ul、li、a选择器都被嵌套在nav选择器当中使用，这是一种书写更高可读性CSS的良好方式，编译后产生的CSS代码如下：

```css
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
nav li {
  display: inline-block; 
}
nav a {
  display: block;
  padding: 6px 12px;
  text-decoration: none; 
}
```

## 引入

SASS能够将代码分割为多个片段，并以underscore风格的下划线作为其命名前缀（_partial.scss），SASS会通过这些下划线来辨别哪些文件是SASS片段，并且不让片段内容直接生成为CSS文件，从而只是在使用@import指令的位置被导入。CSS原生的@import会通过额外的HTTP请求获取引入的样式片段，而SASS的@import则会直接将这些引入的片段合并至当前CSS文件，并且不会产生新的HTTP请求。下面例子中的代码，将会在base.scss文件当中引入_reset.scss片断。

```css
// _reset.scss
html, body, ul, ol {
  margin:  0;
  padding: 0;
}

// base.scss
@import 'reset';
body {
  font: 100% Helvetica, sans-serif;
  background-color: #efefef;
}
```

SASS中引入片断时，可以缺省使用文件扩展名，因此上面代码中直接通过@import 'reset'引入，编译后生成的代码如下：

```css
html, body, ul, ol {
  margin: 0;
  padding: 0; 
}

body {
  font: 100% Helvetica, sans-serif;
  background-color: #efefef; 
}
```

## 混合

混合（Mixin）用来分组那些需要在页面中复用的CSS声明，开发人员可以通过向Mixin传递变量参数来让代码更加灵活，该特性在添加浏览器兼容性前缀的时候非常有用，SASS目前使用@mixin name指令来进行混合操作

```css 
@mixin border-radius($radius) {
          border-radius: $radius;
      -ms-border-radius: $radius;
     -moz-border-radius: $radius;
  -webkit-border-radius: $radius;
}

.box {
  @include border-radius(10px);
}
```

上面的代码建立了一个名为border-radius的Mixin，并传递了一个变量$radius作为参数，然后在后续代码中通过@include border-radius(10px)使用该Mixin，最终编译的结果如下：
```css
.box {
  border-radius: 10px;
  -ms-border-radius: 10px;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
}
```

## 继承
继承是SASS中非常重要的一个特性，可以通过@extend指令在选择器之间复用CSS属性，并且不会产生冗余的代码，下面例子将会通过SASS提供的继承机制建立一系列样式：

```css
// 这段代码不会被输出到最终生成的CSS文件，因为它没有被任何代码所继承。
%other-styles {
  display: flex;
  flex-wrap: wrap;
}

// 下面代码会正常输出到生成的CSS文件，因为它被其接下来的代码所继承。
%message-common {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.message {
  @extend %message-common;
}

.success {
  @extend %message-common;
  border-color: green;
}

.error {
  @extend %message-common;
  border-color: red;
}

.warning {
  @extend %message-common;
  border-color: yellow;
}
```

上面代码将.message中的CSS属性应用到了.success、.error、.warning上面，魔法将会发生在最终生成的CSS当中。这种方式能够避免在HTML元素上书写多个class选择器，最终生成的CSS样式是下面这样的：

```css
.message, .success, .error, .warning {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333; 
}

.success {
  border-color: green; 
}

.error {
  border-color: red; 
}

.warning {
  border-color: yellow; 
}
```

## 操作符

SASS提供了标准的算术运算符，例如+、-、*、/、%。在接下来的例子里，我们尝试在aside和article选择器当中对宽度进行简单的计算

```css
.container { width: 100%; }

article[role="main"] {
  float: left;
  width: 600px / 960px * 100%;
}

aside[role="complementary"] {
  float: right;
  width: 300px / 960px * 100%;
}
```

上面代码以960px为基准建立了简单的流式网格布局，SASS提供的算术运算符让开发人员可以更容易的将像素值转换为百分比，最终生成的CSS样式如下所示：

```css
.container {
  width: 100%; 
}

article[role="main"] {
  float: left;
  width: 62.5%; 
}

aside[role="complementary"] {
  float: right;
  width: 31.25%; 
}
```

## CSS扩展

* 引用父级选择器"&"

Scss使用"&"关键字在CSS规则中引用父级选择器，例如在嵌套使用伪类选择器的场景下：

```css
/*===== SCSS =====*/
a {
  font-weight: bold;
  text-decoration: none;
  &:hover { text-decoration: underline; }
  body.firefox & { font-weight: normal; }
}

/*===== CSS =====*/
a {
  font-weight: bold;
  text-decoration: none; }
  a:hover {
    text-decoration: underline; 
  }
  body.firefox a {
    font-weight: normal; 
  }
```

无论CSS规则嵌套的深度怎样，关键字"&"都会使用父级选择器级联替换全部其出现的位置：

```css
/*===== SCSS =====*/
#main {
  color: black;
  a {
    font-weight: bold;
    &:hover { color: red; }
  }
}

/*===== CSS =====*/
#main {
  color: black; }
  #main a {
    font-weight: bold; }
    #main a:hover {
      color: red; 
    }
```

"&"必须出现在复合选择器开头的位置，后面再连接自定义的后缀，例如：
```css
/*===== SCSS =====*/
#main {
  color: black;
  &-sidebar { border: 1px solid; }
}

/*===== CSS =====*/
#main {
  color: black; }
  #main-sidebar {
    border: 1px solid; 
  }
```

如果在父级选择器不存在的场景使用&，Scss预处理器会报出错误信息。

## 嵌套属性

CSS许多属性都位于相同的命名空间（例如font-family、font-size、font-weight都位于font命名空间下），Scss当中只需要编写命名空间一次，后续嵌套的子属性都将会位于该命名空间之下，请看下面的代码：

```css
/*===== SCSS =====*/
.demo {
  // 命令空间后带有冒号:
  font: {
    family: fantasy;
    size: 30em;
    weight: bold;
  }
}

/*===== CSS =====*/
.demo {
  font-family: fantasy;
  font-size: 30em;
  font-weight: bold; 
}
```

命令空间上可以直接书写CSS简写属性，但是日常开发中建议直接书写CSS简写属性，尽量保持CSS语法的一致性。

```css
.demo {
  font: 20px/24px fantasy {
    weight: bold;
  }
}

.demo {
  font: 20px/24px fantasy;
    font-weight: bold;
}
```
