---
sidebarright: false
---
<template>
  <!-- 个人介绍 -->
  <div class="about">
    <Accordion :accordion='aboutAccordion'/>
    <div class="tips">还没想好，日后再说</div>

  </div>
</template>

<script>
import { aboutAccordion } from "../../src/api/staticData";

export default {
  components: {},
  data() {
    return {
      aboutAccordion
    };
  },
  watch: {
    // $route: {
    //   handler: function(route) {
    //     this.redirect = route.query && route.query.redirect
    //   },
    //   immediate: true
    // }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {},

  methods: {
    // 折叠面板变化事件
    collapseChange(val) {
      console.log(val);
    }
  }
};
</script>
<style scoped>
.tips {
  color: #999;
  text-align: center;
  font-size: 16px;
  line-height: 3;
}
</style>