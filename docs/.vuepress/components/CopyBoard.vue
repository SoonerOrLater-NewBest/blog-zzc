<template>
  <el-tooltip class="item" effect="dark" content="点击复制" placement="right">
    <i
      class="el-icon-copy-document copy-board"
      v-clipboard:copy="text"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError"
    />
  </el-tooltip>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
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
.copy-board {
  cursor: pointer;
  margin-left: 5px;
}
</style>
