---
customLabelArray: [3]
---

# <Label :level='3'/>Vue2.0 项目实战语法

## 一、安装配置依赖

```bash
vue init webpack-simple 项目名称
cnpm install
npm run dev
cnpm install vuex vue-router axios -D
cnpm install style-loader css-loader -D
```

需要在 webpack.config.js 中加入

```js
{
    test: /\.css$/,
    loader: 'style-loader!css-loader'
}
```

## 二、做 vue 项目流程

- 规划组件结构 （Nav.vue、Header.vue、Home.vue）
- 编写路由（vue-router）
- 编写具体每个组件的功能

## 三、项目结构

- src--项目代码文件
- assets--图片等资源文件

## 四、组件篇-comonents

- 在 src 中建立 components 存放组件的文件夹
- 在 components 中建立\*.vue 文件
- 在 App.vue 中导入\*.vue

```js
import NavView from './components/Nav.vue';
export default {
  components: {
    NavView
  }
};
```

- 在 template 中显示

```html
<div id="app">
  <NavView></NavView>
</div>
```

## 五、路由篇-router

- 在需要跳转的地方，加入`<router-link>`
  - `to`路由地址，`tab`是会自动在`a`标记的上一层生成`li`，`active-class`高亮的`class`设置

```html
<router-link to="/home" tag="li" active-class="active">
  <a href="#">首页</a>
</router-link>
```

- 在要显示的地方路由切换内容的地方放入`<router-view>`
- 在`main.js`中引入

```js
import VueRouter from 'vue-router';
import RouterConfig from './router.config.js'; //配置router的参数文件
Vue.use(VueRouter);
new Vue({
  el: '#app',
  router,
  render: (h) => h(App)
});
const router = new VueRouter({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }), //切换路由的时候，内容都从顶上开始读
  routes: RouterConfig
});
```

- 在 src 中建立一个`router.config.js`文件
- `router.config.js`完善里面的配置

```js
import Home from './components/Home.vue';
import Follow from './components/Follow.vue';
import Column from './components/Column.vue';
export default [
  {
    path: '/home',
    component: Home
  },
  {
    path: '/follow',
    component: Follow
  },
  {
    path: '/column',
    component: Column
  },
  {
    path: '/',
    redirect: '/home' //默认跳转到首页
  },
  {
    path: '*',
    redirect: '/home' //404默认页面
  }
];
```

## 六、vuex 状态管理

- 在`src`下建立`store`文件夹
- 在`store`中建立`index.js`

```js
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import mutations from './mutations';
import actions from './actions';
export default new Vuex.Store({
  modules: {
    mutations
  },
  //把actions导出去
  actions
});
```

- 在`main.js`加入`vuex`的代码

```js
import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import RouterConfig from './router.config.js';
import store from './store/'; //默认会找到store文件的index.js
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: RouterConfig
});

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
});
```

- 在`store`中新建一个`actions.js`

```js
export default {
  showHeader: ({ commit }) => {
    //需要有types.js,但是这个项目去掉了types.js
    commit('showHeader'); //commit到了mutations里面去了
  },
  hideHeader: ({ commit }) => {
    //需要有types.js,但是这个项目去掉了types.js
    commit('hideHeader'); //commit到了mutations里面去了
  }
};
```

- 在`store`中新建一个`mutations.js`

```js
import getters from './getters';
const state = {
  header: true //以上来是ture
};
const mutations = {
  showHeader(state) {
    state.header = true;
  },
  hideHeader(state) {
    state.header = false;
  }
};
export default {
  state,
  mutations,
  getters
};
```

- 在`store`中新建一个`getters.js`

```js
export default {
  headerShow: (state) => {
    return state.header;
  }
};
```

- 在要触发的地方，加入代码`App.vue`

```js
<NavView v-show="'headerShow'"></NavView>;
import { mapGetters, matpActions } from 'vuex';
computed: mapGetters(['headerShow']);
```

- 在`App.vue`中的`exprot`中加入监听路由的变化的代码

```js
watch: {
    $route(to, from){
        if (to.path == '/user-info') {
            //通知actions，状态哪个变量应该消失了为false
            //需要发起，$store是从main.js里的store来的
            //然后需要导出到index.js里
            this.$store.dispatch('hideHeader')   //发出去之后actions.js接收
        } else {
            this.$store.dispatch('showHeader')
        }
    }
}
```

## 七、数据交互篇-axios

- 在`main.js`进入`axios`

```js
import axios from 'axios';
//关于axios配置
//1.配置发送请求的信息
axios.interceptors.request.use(
  function (config) {
    store.dispatch('showLoading');
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
//2.配置请求回来
axios.interceptors.response.use(
  function (response) {
    store.dispatch('hideLoading');
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
//把axios对象挂到Vue原型上
Vue.prototype.$http = axios;
```

- 在`Home.vue`中加入数据交互代码

```js
export default {
  data() {
    return {
      arrList: []
    };
  },
  components: {
    BannerView
  },
  mounted() {
    //获取数据
    this.fetchDate();
  },
  methods: {
    fetchDate() {
      var _this = this;
      this.$http
        .get('src/data/index.data')
        .then(function (res) {
          _this.arrList.push = res.data;
        })
        .catch(function (err) {
          console.log('Home', err);
        });
    }
  }
};
```

## 八、文章的详情页制作篇

- 在`home.vue`路由跳转代码中加入

```html
<router-link :to="'/article/'+item.id">
  <h2>{{item.title}}</h2>
  <p>{{item.detail}}</p>
</router-link>
```

- 在`router.config.js`中写上相应的路由配置

```js
{
    path: '/article/:id',
    component: Article
}
```

- 在详情页`article.vue`接收参数，回显数据

```js
data(){
    return {
        articleData: []
    }
},
mounted(){
    var reg = /\/article\/(\d+)/;
    var id = this.$route.path.match(reg)[1];
    this.fetchData(id); //获取路由的id，放出数据交互函数
},
methods: {
    fetchData(id){
        var _this = this;
        this.$http.get('../src/data/article.data').then(function (res) {
            console.log(res.data[id - 1])
        }).catch(function (err) {
            console.log('文章详情页', err)
        })
    }
}
```

- 解决`data`里有`html`和样式的情况

```html
<p v-html="articleData.content"></p>
```

- 显示图片

```html
<img :src="articleData.author_face" />
```

- 如何处理时间戳
- 建立一个文件夹为`filters`过滤器，在 2.0 就只能自己写过滤器了

```js
{{ articleData.time | normalTime }}
filters: {
    normalTime: function(val) {
        var oDate = new Date();
        oDate.setTime(val);
        var y = oDate.getFullYear();
        var m = oDate.getMonth() + 1;
        var d = oDate.getDate();
        var h = oDate.getHours();
        var mm = oDate.getMinutes();
        var s = oDate.getSeconds();
        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s;
    }
}
```

- 因为会有很多的过滤器，所以在 filters 文件夹下建立`index.js`和`normalTime.js`
- index.js

```js
import { normalTime } from './normalTime';
module.exports = {
  normalTime
};
```

- normalTime.js

```js
export const normalTime = (time) => {
  if (time) {
    var oDate = new Date();
    oDate.setTime(time);
    var y = oDate.getFullYear();
    var m = oDate.getMonth() + 1;
    var d = oDate.getDate();
    var h = oDate.getHours();
    var mm = oDate.getMinutes();
    var s = oDate.getSeconds();
    return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s;
  }
};
```

- 在`main.js`中，全局引入

```js
import filters from './filters';
```

## 九、过渡动画篇

- 在`App.vue`中，修改代码

```html
<transition name="slide-down">
  <router-view></router-view>
</transition>
```

- 在`css`中加入样式

```css
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease;
  opacity: 0.7;
  transform: translate3d(0, 6rem, 0);
}
.slide-down-enter,
.slide-down-leave-active {
  opacity: 0.1;
  transform: translate3d(0, 6rem, 0);
}
```

## 十、语法篇

- 在`style`标签中导入其他`css`,_（目前同一个文件离引入两个 css 就报错了）_

```css
@import './assets/css/index.css';
```

- 解决他在是在`main.js`，用`require(‘./assets/css/base.css’)`全局引用

## 十一、项目注意与优化

- 第三方库的`js`或者是`css`，最好用`link`和`script`在`index.html`中引入，避免打包的时候太大
- `axios`是不能直接 use 的
- `index.html`引入的连接地址需要写绝对路径

```html
<script src="http://localhost:8080/src/assets/js/rem.min.js"></script>
```

- 返回按钮的处理

```html
<a href="#" onclick="window.history.go(-1)">返回</a>
```

- 如何在`vue`里使用`jquery`
- 在`main.js`中加入`import $ from ‘./jquery.min.js’`即可
  @import './assets/css/index.css'

````
- 解决他在是在`main.js`，用`require(‘./assets/css/base.css’) `全局引用
## 十一、项目注意与优化
- 第三方库的`js`或者是`css`，最好用`link`和`script`在`index.html`中引入，避免打包的时候太大
- `axios`是不能直接use的
- `index.html`引入的连接地址需要写绝对路径
``` html
<script src="http://localhost:8080/src/assets/js/rem.min.js"></script>
````

- 返回按钮的处理

```html
<a href="#" onclick="window.history.go(-1)">返回</a>
```

- 如何在`vue`里使用`jquery`
- 在`main.js`中加入`import $ from ‘./jquery.min.js’`即可@import './assets/css/index.css';

````

- 解决他在是在`main.js`，用`require(‘./assets/css/base.css’)`全局引用

## 十一、项目注意与优化

- 第三方库的`js`或者是`css`，最好用`link`和`script`在`index.html`中引入，避免打包的时候太大
- `axios`是不能直接 use 的
- `index.html`引入的连接地址需要写绝对路径

```html
<script src="http://localhost:8080/src/assets/js/rem.min.js"></script>
````

- 返回按钮的处理

```html
<a href="#" onclick="window.history.go(-1)">返回</a>
```

- 如何在`vue`里使用`jquery`
- 在`main.js`中加入`import $ from ‘./jquery.min.js’`即可
  @import './assets/css/index.css'

````
- 解决他在是在`main.js`，用`require(‘./assets/css/base.css’) `全局引用
## 十一、项目注意与优化
- 第三方库的`js`或者是`css`，最好用`link`和`script`在`index.html`中引入，避免打包的时候太大
- `axios`是不能直接use的
- `index.html`引入的连接地址需要写绝对路径
``` html
<script src="http://localhost:8080/src/assets/js/rem.min.js"></script>
````

- 返回按钮的处理

```html
<a href="#" onclick="window.history.go(-1)">返回</a>
```

- 如何在`vue`里使用`jquery`
- 在`main.js`中加入`import $ from ‘./jquery.min.js’`即可
