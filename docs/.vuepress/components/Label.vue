<script>
export default {
  render(createElement) {
    var tag = 'span';
    var mixedObject = {};
    if (this.href) {
      mixedObject = {
        href: this.href,
        target: '_blank'
      };
      tag = 'a';
    }
    return createElement(
      tag, // 标签名称
      {
        attrs: {
          'data-content': this.text[this.level - 1] + this.href,
          class: 'blog-type-common blog-type-' + this.level,
          ...mixedObject
        }
      }
      // 子节点数组this.$slots.default
    );
  },
  props: {
    level: {
      type: Number,
      required: true
    },
    text: {
      type: Array,
      default: function () {
        return ['原创', '转载', '笔记'];
      }
    },
    href: {
      type: String,
      default: ''
    }
  }
};
</script>
<style scoped>
.blog-type-common::before {
  border-radius: 3px;
  display: inline-block;
  font-size: 13px;
  font-weight: normal;
  height: 22px;
  line-height: 22px;
  margin: 0 10px;
  max-width: 146px;
  overflow: hidden;
  padding: 0 6px;
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;
}
.blog-type-1::before {
  background-color: rgba(242, 174, 67, 0.25);
  color: #f2ae43;
  content: attr(data-content);
}
.blog-type-2::before {
  background-color: rgba(1, 126, 102, 0.08);
  color: #017e66;
  content: attr(data-content);
}
.blog-type-3::before {
  background-color: rgba(242, 67, 67, 0.08);
  color: #f56c6c;
  content: attr(data-content);
}
</style>
