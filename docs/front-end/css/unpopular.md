---
customLabelArray: [1]
---

# <Label :level='1' />CSS 小知识

### 1、简易夜间模式

**filter: invert(%)：**
反转输入图像。值定义转换的比例。100%的价值是完全反转。值为 0%则图像无变化。值在 0%和 100%之间，则是效果的线性乘子。 若值未设置，值默认是 0。

<ImgPreview filePath='/css/unpopular/filter1.png' fileName='直接给谷歌的body一条filter: invert(1);里面所有元素都将变化'/>

**可以调整 invert 的比例查看效果**

<!-- more -->

[更多 filter 属性](https://www.runoob.com/cssref/css3-pr-filter.html/)
[filter-demo](https://www.cnblogs.com/wangxiaosan/p/5933670.html/)

### 2、cssModules 中使用@keyframes

**全局样式:global，局部样式:local（默认）**

- @keyframes 不管放在哪里都会被编译成局部样式
- 全局动画使用:global 包裹加:local 后缀，不然内部动画名不会指向编译后的名字

```css
:global {
  .animation:local {
    animation: pulse 5s linear infinite;
    background: #f2e079;
  }
}
@keyframes pulse {
  from {
    filter: hue-rotate(0);
  }
  to {
    filter: hue-rotate(360deg);
  }
}
```

- 局部动画就默认好了

```css
.animation {
  animation: pulse 5s linear infinite;
  background: #f2e079;
}
@keyframes pulse {
  from {
    filter: hue-rotate(0);
  }
  to {
    filter: hue-rotate(360deg);
  }
}
```

### 4、will-change ::selection user-select attr()

### 5、滚动条 scrollbar 出现造成的页面宽度被挤压的问题

- [方案](https://blog.csdn.net/weixin_34112208/article/details/88731678)

### 6、image-rendering

他的作用是在浏览器对图片进行比例缩放时，设置其缩放使用的算法，从而来得到我们最终想要的图片结果。而且这个属性可以应用于`img，canvas和background-image`中。

```css
.image {
  /* 使用像素图保持锐利 */
  image-rendering: pixelated;
}
```

### 7、可变字体 font-variation

> 字体粗细：‘font-weight’属性 名称： font-weight 取值： normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 初始： normal 适用于： 所有元素 继承： 是 百分比： （不适用） 媒介： 视觉 计算值： 详见描述 动画： - ‘font-weight’属性执行字体中字形的重量，这取决于黑度等级或笔划粗细。 其值的意义如下： 100 至 900 这些有序排列中的每个值，表示至少与其起身拥有相同黑度的重量。其大致符合下列通用重量名称： 100 - Thin 200 - Extra Light (Ultra Light) 300 - Light 400 - Regular (Normal、Book、Roman) 500 - Medium 600 - Semi Bold (Demi Bold) 700 - Bold 800 - Extra Bold (Ultra Bold) 900 - Black (Heavy) normal、regular 与'400'相同。 bold 与'700'相同。 bolder 指定外观的重量大于继承的值。 lighter 指定外观的重量小于继承的值。

- [详解](https://github.com/chokcoco/iCSS/issues/164)

### 8、自定义鼠标光标

> 由于还不能设置自定义图片大小，推荐使用 `32*32` 以下的 `.ico` 图片

```css
cursor: 'url(/images/move.ico), pointer';
```

<el-button :style="{cursor: 'url(/images/move.ico), pointer'}">看我光标</el-button>

### 9、自定义
