<template>
  <div class="download-wrap">
    <el-tooltip class="item" effect="dark" content="下载原图" placement="right">
      <a class="download" :href="$withBase(filePath)" download>{{ fileName }}</a>
    </el-tooltip>
    <img :src="$withBase(filePath)" :alt="alt" />
  </div>
</template>
<script>
export default {
  props: {
    filePath: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: '下载原图'
    },
    alt: {
      type: String,
      default: '示例图片'
    }
  },
  methods: {
    onCopy(e) {
      // console.log(e.text);
      this.$message({
        showClose: true,
        message: '复制成功！',
        type: 'success'
      });
    },
    onError(e) {
      console.log('Failed');
      this.$message({
        showClose: true,
        message: '复制失败',
        type: 'error'
      });
    }
  }
};
</script>
<style scoped>
.download-wrap a.download {
  display: inline-block;
  margin-bottom: 10px;
}
.download-wrap img {
  display: block;
}
</style>
