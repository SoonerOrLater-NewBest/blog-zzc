---
customLabelArray: [1, 2]
---

# <Label :level='1' />CSS 效果

### 1、色彩变换

<Demo :number='2' style='margin:20px 0;'/>

```html
<div class="study-box">
  <h1>CSS色彩变换效果展示</h1>
</div>
```

```css
/* 色彩变换 */
.study-box {
  isolation: isolate;
  overflow: hidden;
  position: relative;
  text-align: center;
}
.study-box h1 {
  color: #fff;
  margin: 0;
  mix-blend-mode: difference;
  position: relative;
  z-index: 1;
}
.study-box::before {
  animation: spin 5s linear infinite;
  background: linear-gradient(#ecf5ff 50%, #000 50%);
  content: '';
  height: 100vw;
  left: calc(50% - 50vw);
  margin: auto;
  position: absolute;
  top: calc(50% - 50vw);
  width: 100vw;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

### 2、按钮粒子动画

- <Demo :number='1' className='hover' style='margin-left:100px;'/><Demo :number='1' className='active' style='margin-left:100px;'/>

```css
.button {
  background-color: #ff0081;
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 25px rgba(233, 30, 99, 0.5);
  color: #fff;
  cursor: pointer;
  display: inline-block;
  outline: 0;
  padding: 1em 2em;
  position: relative;
  transition: transform ease-in 0.1s, background-color ease-in 0.1s, box-shadow ease-in 0.25s;
}

/* hover效果 */
.button::before {
  background-image: radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent
        20%);
  background-position: 18% 40%, 20% 31%, 30% 30%, 40% 30%, 50% 30%, 57% 30%, 65% 30%, 80% 32%,
    15% 60%, 83% 60%, 18% 70%, 25% 70%, 41% 70%, 50% 70%, 64% 70%, 80% 71%;
  background-repeat: no-repeat;
  background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 10% 10%, 18% 18%, 15%
      15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;
  bottom: -2em;
  content: '';
  left: -2em;
  pointer-events: none;
  position: absolute;
  right: -2em;
  top: -2em;
}
.button:hover::before {
  background-position: 5% 44%, -5% 20%, 7% 5%, 23% 0%, 37% 0, 58% -2%, 80% 0%, 100% -2%, -5% 80%, 100%
      55%, 2% 100%, 23% 100%, 42% 100%, 60% 95%, 70% 96%, 100% 100%;
  background-size: 0% 0%;
  transition: background-position 0.5s ease-in-out, background-size 0.75s ease-in-out;
}

/* active效果 */
.button::before {
  background-image: radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent
        20%);
  background-position: 5% 44%, -5% 20%, 7% 5%, 23% 0%, 37% 0, 58% -2%, 80% 0%, 100% -2%, -5% 80%, 100%
      55%, 2% 100%, 23% 100%, 42% 100%, 60% 95%, 70% 96%, 100% 100%;
  background-repeat: no-repeat;
  background-size: 0% 0%;
  bottom: -2em;
  content: '';
  left: -2em;
  pointer-events: none;
  position: absolute;
  right: -2em;
  top: -2em;
  transition: background-position 0.5s ease-in-out, background-size 0.75s ease-in-out;
}
.button:active::before {
  background-position: 18% 40%, 20% 31%, 30% 30%, 40% 30%, 50% 30%, 57% 30%, 65% 30%, 80% 32%,
    15% 60%, 83% 60%, 18% 70%, 25% 70%, 41% 70%, 50% 70%, 64% 70%, 80% 71%;
  background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 10% 10%, 18% 18%, 15%
      15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;
  transition: 0s;
}
```
