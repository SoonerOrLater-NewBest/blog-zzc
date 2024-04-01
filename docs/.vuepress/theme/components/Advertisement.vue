<template>
  <div class="advertisement">
    <img :src="$withBase($site.themeConfig.advertisement)" alt="banner">
  </div>
</template>
<script>

export default {
  name: 'advertisement',

//   components: {},

//   props: []
}
</script>

<style scoped>
.advertisement{
    margin: 0 10px 0 0;
    height: 200px;
    background: #eee;
    overflow: hidden;
}
.advertisement img{
  width: 120%;
}
</style>
