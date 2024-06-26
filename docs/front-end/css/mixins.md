---
customLabelArray: [3]
---
# Scss常用mixins
收集一些常用的mixins.scss
<!-- more -->

```scss
/**
* 溢出省略号
* @param {Number} 行数
*/
@mixin ellipsis($rowCount: 1) {
  @if $rowCount <=1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: $rowCount;
    -webkit-box-orient: vertical;
  }
}
/**
* 等边三角形
* @param {String} 尺寸
* @param {Color} 颜色
* @param {String} 方向
*/
@mixin triangle($size: 5px, $color: rgba(0, 0, 0, 0.6), $dir: bottom) {
  width: 0;
  height: 0;
  border-style: solid;

  @if (bottom==$dir) {
    border-width: $size $size 0 $size;
    border-color: $color transparent transparent transparent;
  } @else if (top==$dir) {
    border-width: 0 $size $size $size;
    border-color: transparent transparent $color transparent;
  } @else if (right==$dir) {
    border-width: $size 0 $size $size;
    border-color: transparent transparent transparent $color;
  } @else if (left==$dir) {
    border-width: $size $size $size 0;
    border-color: transparent $color transparent transparent;
  }
}

/**
* 真.1px边框
* {List}: 多个方向边框, 默认值为bottom, 你可以根据需要传入(top, left, bottom, right) 4个方向;
* {Color} 边框的颜色, 默认#ccc;
* {List} 4个圆角半径, 默认0;
* {String} 一个高级设置, 一般都不需要改动, 由于细边框的实现使用了css的伪类, 所以为了规避可能出现的样式冲突, 我们可以自己指定使用:after还是:before, 默认after;
*/
@mixin thinBorder(
  $directionMaps: bottom,
  $color: #ccc,
  $radius: (
    0,
    0,
    0,
    0
  ),
  $position: after
) {
  // 是否只有一个方向
  $isOnlyOneDir: string==type-of($directionMaps);

  @if ($isOnlyOneDir) {
    $directionMaps: ($directionMaps);
  }

  @each $directionMap in $directionMaps {
    border-#{$directionMap}: 1px solid $color;
  }

  // 判断圆角是list还是number
  @if (list==type-of($radius)) {
    border-radius: nth($radius, 1)
      nth($radius, 2)
      nth($radius, 3)
      nth($radius, 4);
  } @else {
    border-radius: $radius;
  }

  @media only screen and (-webkit-min-device-pixel-ratio: 2) {
    & {
      position: relative;

      // 删除1像素密度比下的边框
      @each $directionMap in $directionMaps {
        border-#{$directionMap}: none;
      }
    }

    &:#{$position} {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 200%;
      height: 200%;
      transform: scale(0.5);
      box-sizing: border-box;
      padding: 1px;
      transform-origin: 0 0;
      pointer-events: none;
      border: 0 solid $color;

      @each $directionMap in $directionMaps {
        border-#{$directionMap}-width: 1px;
      }

      // 判断圆角是list还是number
      @if (list==type-of($radius)) {
        border-radius: nth($radius, 1) *
          2
          nth($radius, 2) *
          2
          nth($radius, 3) *
          2
          nth($radius, 4) *
          2;
      } @else {
        border-radius: $radius * 2;
      }
    }
  }

  @media only screen and (-webkit-min-device-pixel-ratio: 3) {
    &:#{$position} {
      // 判断圆角是list还是number
      @if (list==type-of($radius)) {
        border-radius: nth($radius, 1) *
          3
          nth($radius, 2) *
          3
          nth($radius, 3) *
          3
          nth($radius, 4) *
          3;
      } @else {
        border-radius: $radius * 3;
      }

      width: 300%;
      height: 300%;
      transform: scale(0.3333);
    }
  }
}

/**
* 棋盘背景
* @param {Color} 背景色
*/
@mixin bgChessboard($color: #aaa) {
  background-image: linear-gradient(
      45deg,
      $color 25%,
      transparent 25%,
      transparent 75%,
      $color 75%,
      $color
    ),
    linear-gradient(
      45deg,
      $color 26%,
      transparent 26%,
      transparent 74%,
      $color 74%,
      $color
    );
  background-size: 10vw 10vw;
  background-position: 0 0, 5vw 5vw;
}

@mixin loading-half-circle($width: 1em) {
  display: inline-block;
  height: $width;
  width: $width;
  border-radius: $width;
  border-style: solid;
  border-width: $width/10;
  border-color: transparent currentColor transparent transparent;
  animation: rotate 0.6s linear infinite;
  vertical-align: middle;
}

@mixin tooltip(
  $directions: (
    top,
    right,
    bottom,
    left
  )
) {
  // 内容的宽度收到相对位置关系的父元素的宽度影响, 所以使用的时候最好值把tip放在body的第一级子元素
  position: absolute;
  color: $white;
  padding: $space;
  font-size: $font-size-5;
  vertical-align: middle;
  box-shadow: $shadow-down;
  border-radius: $radius;
  align-items: center;
  z-index: $z-index-tooltip;
  background-color: $tooltip-color;
  max-width: 200px;
  white-space: pre-wrap;

  &:before {
    display: block;
    position: absolute;
    content: "";
    z-index: 1;
  }

  &--top {
    top: -$space;
    left: 50%;
    transform: translate(-50%, -100%);

    &:before {
      @include triangle(5px, $tooltip-color, bottom);
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 100%);
    }
  }

  &--bottom {
    bottom: -$space;
    left: 50%;
    transform: translate(-50%, 100%);

    &:before {
      @include triangle(5px, $tooltip-color, top);
      top: 0;
      left: 50%;
      transform: translate(-50%, -100%);
    }
  }

  &--left {
    left: -$space;
    top: 50%;
    transform: translate(-100%, -50%);

    &:before {
      @include triangle(5px, $tooltip-color, right);
      top: 50%;
      right: 0;
      transform: translate(100%, -50%);
    }
  }

  &--right {
    right: -$space;
    top: 50%;
    transform: translate(100%, -50%);

    &:before {
      @include triangle(5px, $tooltip-color, left);
      top: 50%;
      left: 0;
      transform: translate(-100%, -50%);
    }
  }
}

@mixin badge {
    position: absolute;
    font-size:$font-size-6;
    font-style: normal;
    color:$white;
    background-color: $danger;
    z-index: 2;
    padding: 0 $badge-padding-y;
    // 为了内容为空的时候形成圆形
    min-height: $badge-padding-y*2;
    box-sizing: content-box;
    border-radius: 9999px;
    right: 0;
    top: 0;
    line-height: $badge-height;
    text-align: center;
    white-space: nowrap;
    transform: translate(50%, -50%);
}
```