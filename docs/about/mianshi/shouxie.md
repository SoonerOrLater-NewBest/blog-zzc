```js
// 完整手写 Promise 实现
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function MyPromise(executor) {
  this.state = PENDING; // Promise 的初始状态为 pending
  this.value = undefined; // 成功时的返回值
  this.reason = undefined; // 失败时的原因
  this.onFulfilledCallbacks = []; // 存储成功回调，解决异步注册问题
  this.onRejectedCallbacks = []; // 存储失败回调

  // resolve 函数：将状态改为 fulfilled，执行所有成功回调
  const resolve = (value) => {
    if (this.state === PENDING) {
      this.state = FULFILLED;
      this.value = value;
      this.onFulfilledCallbacks.forEach((fn) => fn());
    }
  };

  // reject 函数：将状态改为 rejected，执行所有失败回调
  const reject = (reason) => {
    if (this.state === PENDING) {
      this.state = REJECTED;
      this.reason = reason;
      this.onRejectedCallbacks.forEach((fn) => fn());
    }
  };

  // 立即执行 executor，捕获同步错误并 reject
  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

// resolvePromise：处理 then 的返回值 x，实现值穿透和循环引用检测
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    // 防止循环引用（p.then(() => p)）
    return reject(new TypeError('Chaining cycle detected for promise'));
  }

  let called = false; // 标记，确保 then 方法只被调用一次

  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      const then = x.then;
      if (typeof then === 'function') {
        // x 是 thenable（Promise）
        then.call(
          x,
          (y) => {
            // 用 call 绑定 this
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject); // 递归解析
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x); // x 有 then 属性但不是函数
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x); // x 是基础类型
  }
}

// then 方法：链式调用核心，返回新 Promise
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // 参数透传
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : (reason) => {
          throw reason;
        };

  const promise2 = new MyPromise((resolve, reject) => {
    if (this.state === FULFILLED) {
      setTimeout(() => {
        // 强制异步，模拟微任务队列
        try {
          const x = onFulfilled(this.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }

    if (this.state === REJECTED) {
      setTimeout(() => {
        try {
          const x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }

    if (this.state === PENDING) {
      // 把回调存到队列，等 resolve/reject 后执行
      this.onFulfilledCallbacks.push(() => {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });

      this.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
    }
  });

  return promise2; // 链式调用关键
};

// catch 方法：语法糖，等价于 then(null, onRejected)
MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};

// finally 方法：无论成功失败都执行
MyPromise.prototype.finally = function (onFinally) {
  return this.then(
    (value) => MyPromise.resolve(onFinally()).then(() => value),
    (reason) =>
      MyPromise.resolve(onFinally()).then(() => {
        throw reason;
      })
  );
};

// MyPromise.resolve：快速创建已 fulfilled 的 Promise
MyPromise.resolve = function (value) {
  if (value instanceof MyPromise) return value; // 避免重复包装
  return new MyPromise((resolve) => resolve(value));
};

// MyPromise.reject：快速创建已 rejected 的 Promise
MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => reject(reason));
};

// MyPromise.all：并行执行多个 Promise，全部成功才 resolve
MyPromise.all = function (promises) {
  return new MyPromise((resolve, reject) => {
    const result = [];
    let count = 0;
    if (promises.length === 0) return resolve([]); // 空数组直接 resolve

    promises.forEach((p, i) => {
      MyPromise.resolve(p).then((value) => {
        result[i] = value; // 按顺序存结果
        if (++count === promises.length) resolve(result); // 全部完成
      }, reject); // 有一个失败就整体 reject
    });
  });
};

// MyPromise.race：竞速，谁先完成用谁的结果
MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    promises.forEach((p) => MyPromise.resolve(p).then(resolve, reject));
  });
};
```
