<template>
  <div class="stack-list">
    <div class="btn-wrap">
      <el-button
        plain
        size="small"
        v-for="(tag, index) in tags"
        :key="tag.label"
        :type="tag.type"
        :style="tag.style"
        @click="switchTag(index)"
        class="button"
        :disabled="current === index"
        >{{ tag.label }}</el-button
      >
    </div>
    <div class="page-list">
      <ul>
        <li v-for="page in pageList" class="page-item hvr-outline-in" :key="page.path">
          <router-link :to="page.path">
            <h4>
              {{ page.title }}
              <span class="date">
                <Label
                  style="margin: 0 -6px;"
                  v-if="page.frontmatter.customLabelArray"
                  :level="label"
                  v-for="label in page.frontmatter.customLabelArray"
                />
                <!-- <i class="el-icon-edit"></i> -->
                <!-- {{page.lastUpdated | dateformat('YYYY-MM-DD')}} -->
              </span>
            </h4>
            <div
              class="abstract"
              v-html="
                page.excerpt
                  ? page.excerpt.replace(/<\/?.+?\/?>/g, '')
                  : page.headers
                  ? page.headers.map((i) => i.title).join('，')
                  : ''
              "
            ></div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { tagSource } from '../../../src/api/staticData';

export default {
  props: {
    tagType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      tags: [],
      pageList: [],
      current: 0
    };
  },
  created() {
    this.tags = tagSource[this.tagType].map((tag) => {
      const pageList = [];
      this.$site.pages.forEach((page) => {
        if (page.path.indexOf(tag.path) !== -1) {
          pageList.push(page);
          // console.log(page);
        }
      });
      const type = Math.floor(Math.random() * 10) > 2 ? 'primary' : '';
      const style = `filter: hue-rotate(${45 * Math.floor(Math.random() * 8)}deg)`;
      return {
        ...tag,
        pageList,
        type,
        style
      };
    });
    this.pageList = this.tags[0].pageList;
  },
  methods: {
    switchTag(index) {
      this.pageList = this.tags[index].pageList;
      this.current = index;
    }
  },
  mounted() {}
};
</script>
<style scoped>
.btn-wrap {
  margin: 20px 0 30px;
}
.el-button {
  margin-left: 10px;
  margin-top: 10px;
}
.page-list ul {
  list-style: none;
  padding: 0;
}
.page-item {
  display: block !important;
  margin: 8px 0;
  padding: 12px 20px;
}
.page-item a {
  color: #333;
}
.page-item a:hover {
  text-decoration: none !important;
}
.page-item h4 {
  display: flex;
  margin: 0 0 4px;
}
.page-item h4 .date {
  font-size: 12px;
  margin-left: 4px;

  /* float: right; */

  /* color: #40f5ff; */

  /* text-shadow: 1px 1px 1px #303133; */
}
.page-item .abstract {
  -webkit-box-orient: vertical;
  color: #999;
  display: -webkit-box;
  font-size: 14px;
  -webkit-line-clamp: 2;
  max-height: 3.4em;
  overflow: hidden;
  text-overflow: ellipsis;
}
.button {
  position: relative;
}
.button::before {
  background-image: radial-gradient(circle, #409eff 20%, transparent 20%),
    radial-gradient(circle, #409eff 20%, transparent 20%),
    radial-gradient(circle, #409eff 20%, transparent 20%),
    radial-gradient(circle, #409eff 20%, transparent 20%),
    radial-gradient(circle, #409eff 20%, transparent 20%),
    radial-gradient(circle, #409eff 20%, transparent 20%),
    radial-gradient(circle, #409eff 20%, transparent 20%),
    radial-gradient(circle, #409eff 20%, transparent 20%),
    radial-gradient(circle, #409eff 20%, transparent 20%),
    radial-gradient(circle, #409eff 20%, transparent 20%),
    radial-gradient(circle, #409eff 20%, transparent 20%),
    radial-gradient(circle, #409eff 20%, transparent 20%),
    radial-gradient(circle, #409eff 20%, transparent 20%),
    radial-gradient(circle, #409eff 20%, transparent 20%),
    radial-gradient(circle, #409eff 20%, transparent 20%),
    radial-gradient(circle, #409eff 20%, transparent 20%);
  background-position: 5% 44%, -5% 20%, 7% 5%, 23% 0%, 37% 0, 58% -2%, 80% 0%, 100% -2%, -5% 80%,
    100% 55%, 2% 100%, 23% 100%, 42% 100%, 60% 95%, 70% 96%, 100% 100%;
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
  background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 10% 10%, 18% 18%,
    15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;
  transition: 0s;
}
</style>
