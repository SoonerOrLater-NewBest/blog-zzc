<template>
  <div class="table-of-contents" v-if="headers.length > 0">
    <h4>目录</h4>
    <ul>
      <li v-for="item in headers" :key="item.title" :style="item.level===3?'padding-left:1em;':''">
        <a :href="'#'+item.slug" :class="{active:(hash===item.slug)}">{{item.title}}</a>
      </li>
    </ul>
  </div>
  <div class="table-of-contents" v-else>
    <h4>约定</h4>
    <p>标签：学习 + 记录 => "转载" + 收集整理 + 总结 => "笔记" + 实践心得 => "原创"</p>
    <p>目录：左侧只显示重点内容，分类导航全量显示，也可通过顶部全局搜索</p>
  </div>
</template>
<script>
export default {
  name: "toc",
  props: ["headers"],
  data() {
    return {
      hash: ""
    };
  },
  created() {
    this.initHash();
  },
  watch: {
    $route() {
      this.refreshHash();
    },
    headers() {
      this.initHash();
    }
  },
  methods: {
    refreshHash() {
      this.hash = this.$route.hash;
      if (this.hash) {
        this.hash = decodeURI(this.hash.replace("#", ""));
      }
    },
    initHash() {
      if (this.headers.length > 0) {
        this.hash = this.headers[0].slug;
      }
    }
  }
};
</script>

<style scoped>
/* 自定义toc样式 */
.table-of-contents {
  padding: 0 15px;
  border-radius: 4px;
  background-color: #fff;
}
.table-of-contents h4 {
  margin: 20px 0 10px 0;
  line-height: 30px;
}

.table-of-contents ul {
  width: 200px;
  padding-right: 10px;
  margin: auto;
  overflow: auto;
  max-height: calc(100vh - 330px);
  list-style: none;
  padding: 0;
}
.table-of-contents a {
  width: 90%;
  font-size: 14px;
  color: #6c757d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.table-of-contents a.active {
  color: #00965e;
}
.table-of-contents a:hover {
  text-decoration: none !important;
}
</style>
