---
customLabelArray: [1,3]
---
# <Label :level='3'/>CSS

> 所谓境界，像宇宙般虚无缥缈，却又像宇宙般在岁月的长河中积累、沉淀，无声无息地壮大自己。有些事非一朝而能明了，有些理非一夕而能透彻。带着自信坚持下去，书读百遍，其义自见，境界到了，万物皆虚，万事皆允！

## 尽量减少代码重复
　　在软件开发中，保持代码的 DRY 和可维护性是最大的挑战之一，而这句话对 CSS 也是适用的。在实践中，代码可维护性的最大要素是尽量减少改动时要编辑的地方。灵活的 CSS 通常更容易扩展： 在写出基础样式之后，只用极少的代码就可以扩展出不同的变体，因为只需覆盖一些变量就可以了。

下面这段 CSS，它给按钮添加了一些效果，这里的属性值都采用了绝对值！

```css
padding: 6px 16px;
border: 1px solid #446d88;
background: #58a linear-gradient(#77a0bb, #58a);
border-radius: 4px;
box-shadow: 0 1px 5px gray;
color: white;
text-shadow: 0 -1px 1px #335166;
font-size: 20px;
line-height: 30px;
```
　　如果我们决定把父级的字号加大，就不得不修改每一处使用绝对值作为字体尺寸的样式。如果改用百分比或 em 单位就好多了。

　　当某些值相互依赖时，应该把它们的相互关系用代码表达出来，修改后：

```css
padding: .3em .8em;
border: 1px solid #446d88;
background: #58a linear-gradient(#77a0bb, #58a);
border-radius: .2em;
box-shadow: 0 .05em .25em gray;
color: white;
text-shadow: 0 -.05em .05em #335166;
font-size: 125%;
line-height: 1.5;
```
　　此时这个按钮的大小基本上是根据字号大小等比例缩放了，请注意还有一些长度值是绝对值。此时就需要重新审视到底哪 些效果应该跟着按钮一起放大，而哪些效果是保持不变的。比如，这里我们希望按钮的边框粗细保持在 1px，不受按钮尺寸的影响。

　　不过，让按钮变大或变小并不是我们唯一想要改动的地方。颜色是另 一个重要的变数。比如，假设我们要创建一个红色的取消按钮，或者一个绿色的确定按钮，可能需要覆盖四条声明（bordercolor、background、box-shadow 和 text-shadow），而且还有另一大难题： 要根据按钮的亮面和暗面相对于主色调 #58a 变亮和变暗的程度来分别推导出其他颜色各自的亮色和暗色版本。此外，若我们想把按钮放在一个非白色的背景之上呢？显然使用灰色（ gray）作投影只适用于纯白背景的情况。

其实只要把半透明的黑色或白色叠加在主色调上，即可产生主色调的亮色和暗色变体，这样就能简单地化解这个难题了：

```css
padding: .3em .8em;
border: 1px solid rgba(0,0,0,.1);
background: #58a linear-gradient(hsla(0,0%,100%,.2),
 transparent);
border-radius: .2em;
box-shadow: 0 .05em .25em rgba(0,0,0,.5);
color: white;
text-shadow: 0 -.05em .05em rgba(0,0,0,.5);
```
　　现在我们只要覆盖 background-color 属性，就可以得到不同颜色版本了。

**1. 代码易维护 vs. 代码量少**
有时候，代码易维护和代码量少不可兼得。比如在上面的例子中，我们 最终采用的代码甚至比一开始的版本略长。来看看下面的代码片断，我们要 为一个元素添加一道 10px 宽的边框，但左侧不加边框。
```css
border-width: 10px 10px 10px 0;
```
　　只要这一条声明就可以搞定了，但如果日后要改动边框的宽度，你需要 同时改三个地方。如果把它拆成两条声明的话，改起来就容易多了，而且可读性或许更好一些：
```css
border-width: 10px;
border-left-width: 0;
```
**2. currentColor**

　　在 CSS 颜色（第三版）（http://w3.org/TR/css3-color）规范中，增加了一个特殊的颜色关键字 currentColor，它是从 SVG 那里借鉴来的。这个关键字并没有绑定到一个固定的颜色值，而是一 直被解析为 color。实际上，这个特性让它成为了 CSS 中有史以来的第一 个变量。虽然功能很有限，但它真的是个变量。 举个例子，假设我们想让所有的水平分割线（所有元素）自动与 文本的颜色保持一致。有了 currentColor 之后，我们只需要这样写：
```css
hr {
 height: .5em;
 background: currentColor;
}
```

　　你可能已经注意到了，很多已有的属性也具有类似的行为。如果你没有给边框指定颜色，它就会自动地从文本颜色那里得到颜 色。这是因为 currentColor 本身就是很多 CSS 颜色属性的初始值，比如 border-color 和 outline-color，以及 text-shadow 和 box-shadow 的颜色值，等等。

**3. 继承**

　　尽管绝大多数开发者都知道有 inherit 这个关键字，但还是很容易遗忘它。inherit 可以用在任何 CSS 属性中，而且它总是绑定到父元素的计算值（对伪元素来说，则会取生成该伪元素的宿主元素）。举例来说，要把表单元素的字体设定为与页面的其他部分相同，你并不需要重复指定字体属性，只需利用 inherit 的特性即可：
```css
input, select, button { font: inherit; }
```

　　与此类似，要把超链接的颜色设定为与页面中其他文本相同，还是要用 inherit：
```css
a { color: inherit; }
```
　　这个 inherit 关键字对于背景色同样非常有用。举个例子，在创建提 示框的时候，你可能希望它的小箭头能够自动继承背景和边框的样式。

```css
.callout { position: relative; }
.callout::before {
 content: "";
 position: absolute;
 top: -.4em; left: 1em;
 padding: .35em;
 background: inherit;
 border: inherit;
 border-right: 0;
 border-bottom: 0;
 transform: rotate(45deg);
}
```
## 合理使用简写
你可能知道，以下两行 CSS 代码并不是等价的：
```css
background: rebeccapurple;
background-color: rebeccapurple;
```
　　前者是简写，它可以确保你得到 rebeccapurple 纯色背景；但如果 你用的是展开式的单个属性（background-color），那这个元素的背景最终 有可能会显示为一个粉色的渐变图案、一张猫的图片或其他任何东西，因为 同时可能会有一条 background-image 声明在起作用。在使用展开式属性的 写法时，通常会遇到这样的问题：展开式写法并不会帮助你清空所有相关的 其他属性，从而可能会干扰你想要达到的效果。
当然，你可以把所有的展开式属性全都设置一遍，然后收工，但你可能 会漏掉几个；又或者，CSS 工作组可能会在未来引入更多的展开式属性，那 时你的代码就无法完全覆盖它们了。不要害怕使用简写属性。合理使用简写 是一种良好的防卫性编码方式，可以抵御未来的风险。当然，如果我们要明 确地去覆盖某个具体的展开式属性并保留其他相关样式，那就需要用展开式 属性，就像我们在“尽量减少代码重复”一节中为了得到按钮的其他颜色版 本所做的那样。
　　展开式属性与简写属性的配合使用也是非常有用的，可以让代码更加 DRY。对于那些接受一个用逗号分隔的列表的属性（比如 background），尤 其如此。下面的例子可以很好地解释这一点：
```css
background: url(tr.png) no-repeat top right / 2em 2em, 
url(br.png) no-repeat bottom right / 2em 2em, 
url(bl.png) no-repeat bottom left / 2em 2em;
```
　　请注意 background-size 和 background-repeat 的值被重复了三遍， 尽管每层背景的这两个值确实是相同的。其实我们可以从 CSS 的“列表扩 散规则”那里得到好处。它的意思是说，如果只为某个属性提供一个值，那 它就会扩散并应用到列表中的每一项。因此，我们可以把这些重复的值从简 写属性中抽出来写成一个展开式属性：
```css
background: url(tr.png) top right, 
url(br.png) bottom right, 
url(bl.png) bottom left; 
background-size: 2em 2em; 
background-repeat: no-repeat;
```
　　现在，我们只需要在一处修改，就可以改变所有的 background-size 和 background-repeat 了。

## 关于响应式网页设计
　　比较常见的实践是用多种分辨率来测试一个网站，然后添加越来越多的 媒体查询（Media Query）规则来修补网站在这些分辨率下出现的问题。然 而对于今后的 CSS 改动来说，每个媒体查询都会增加成本，而这种成本是 不应轻易上升的。未来每次对 CSS 代码的修改都要求我们逐一核对这些媒 体查询是否需要配合修改，甚至可能要求我们反过来修改这些媒体查询的设 置。这一点常常被我们忽略，后患无穷。你添加的媒体查询越多，你的 CSS 代码就会变得越来越经不起折腾。

媒体查询的断点不应该由具体的设备来 决定，而应该根据设计自身来决定。

下面还有一些建议，可能会帮你避免不必要的媒体查询。

* 使用百分比长度来取代固定长度。如果实在做不到这一点，也应该
* 尝试使用与视口相关的单位（vw、vh、vmin 和 vmax），它们的值解 析为视口宽度或高度的百分比。
* 当你需要在较大分辨率下得到固定宽度时，使用 max-width 而不是 width，因为它可以适应较小的分辨率，而无需使用媒体查询。
* 不要忘记为替换元素（比如 img、object、video、iframe 等）设 置一个 max-width，值为 100%。
* 假如背景图片需要完整地铺满一个容器，不管容器的尺寸如何变化， background-size: cover 这个属性都可以做到。但是，我们也要时
刻牢记——带宽并不是无限的，因此在移动网页中通过 CSS 把一张 大图缩小显示往往是不太明智的。
* 当图片（或其他元素）以行列式进行布局时，让视口的宽度来决定 列的数量。弹性盒布局（即 Flexbox）或者 display: inline-block 加上常规的文本折行行为，都可以实现这一点。
* 在 使 用 多 列 文 本 时， 指 定 column-width（ 列 宽 ） 而 不 是 指 定 column-count（列数），这样它就可以在较小的屏幕上自动显示为单 列布局。
　总的来说，我们的思路是尽最大努力实现弹性可伸缩的布局，并在媒体 查询的各个断点区间内指定相应的尺寸。当网页本身的设计足够灵活时，让 它变成响应式应该只需要　用到一些简短的媒体查询代码。 