<template>
  <aside class="sidebar sidebar-right">
    <slot name="top" />
    <Advertisement />
    <Toc :headers='page.headers || []'/>
    <slot name="bottom" />
  </aside>
</template>
<script>
import Advertisement from "./Advertisement.vue";
import Toc from "./Toc.vue";

export default {
  name: "SidebarRight",

  components: { Advertisement, Toc, },

  props: ['items'],

  data() {
    return {
      page: {}
    };
  },
  created() {
    this.page = this.$page;
  },
  updated() {
    this.page = this.$page;
  }
};
</script>

<style lang="stylus">
.sidebar {
  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }

  a {
    display: inline-block;
  }
}
</style>
