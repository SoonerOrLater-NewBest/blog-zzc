// .vuepress/enhanceApp.js
// 全局注册 Element 组件库
import Vue from 'vue';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'hover.css';
import './index.css';
import VueClipboard from 'vue-clipboard2';
import moment from 'moment';

export default ({ Vue, options, router }) => {
  Vue.use(Element);
  Vue.use(VueClipboard);
  Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
    return moment(dataStr).format(pattern);
  });
};
