<template>
  <div class="accordion" v-if="accordion.length > 0">
    <ul>
      <li :class="['group-bd', { active: item.show }]" v-for="(item, index) in accordion">
        <a
          href="javascript:;"
          :class="['group-txt', `group-txt-${index}`]"
          @click="changeli(index)"
        >
          <i class="group-icon"></i>
          <i class="group-circle"></i>
          <span>{{ item.name }}</span>
          <i class="i-triangle"></i>
        </a>
        <div class="group-item">
          <ul class="child-ul">
            <!-- 循环二级菜单数据 -->
            <li
              v-for="(child, ind) in item.list"
              :class="['group-bd-child', { active: child.show }]"
            >
              <div
                class="role-item"
                :style="{
                  'background-image': `${child.backgd ? 'url(/accordion/' + child.backgd + ')' : ''}`
                }"
              >
                <h3>{{ child.name }}</h3>
                <p v-html="child.content"></p>
                <p v-html="child.more"></p>
              </div>
              <a href="javascript:;" @click="childChange(index, ind)" class="role-txt">
                <b class="role-name">{{ child.title }}</b>
                <!-- <i
                  class="role-img Jgroup_img"
                  data-bgurl="/data/role/mo_02.png"
                  style="background-image: url(https://xyq.res.netease.com/pc/gw/20170118103441/data/role/mo_02.png)"
                ></i>-->
                <i class="role-line"></i>
              </a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    accordion: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  methods: {
    changeli(index) {
      this.accordion.forEach((i, x) => {
        if (x === index) {
          i.show = true;
        } else {
          i.show = false;
        }
      });
    },
    childChange(index, ind) {
      this.accordion[index].list.forEach((i, x) => {
        if (x === ind) {
          i.show = true;
        } else {
          i.show = false;
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
/* stylelint-disable */
.accordion {
  height: 230px;
  overflow: hidden;
  @media (min-width: 960px) {
    margin: 0 -100px;
  }
  @media (max-width: 640px) {
    display: none;
  }
  ul {
    display: flex;
    list-style: none;
    margin: 0;
    overflow: hidden;
    padding: 0;
    .group-bd {
      background-color: #ff9800;
      flex: none;
      height: 230px;
      overflow: hidden;
      position: relative;
      transition: all 0.3s;
      width: 70px;

      // &:hover {
      //   background-color: #ff9800;
      // }
      .group-txt {
        background: #3b8bed;
        display: block;
        height: 230px;
        position: relative;
        width: 70px;
        > span {
          color: #fff;
          font-size: 20px;
          left: 50%;
          letter-spacing: 2px;
          line-height: 24px;
          margin-left: -11px;
          position: absolute;
          top: 90px;
          width: 22px;
        }
        .i-triangle {
          border-color: transparent;
          border-style: solid;
          border-width: 8px;
          height: 0;
          margin-top: -8px;
          position: absolute;
          right: -16px;
          top: 50%;
          width: 0;
          z-index: 1;
        }
      }
      .group-txt-0 {
        background: #3b8bed;
      }
      .group-txt-1 {
        background: #499df5;
      }
      .group-txt-2 {
        background: #5eaaf9;
      }
      .group-item {
        bottom: 0;
        left: 70px;
        position: absolute;
        right: 0;
        top: 0;
        .group-bd-child {
          flex: none;
          height: 230px;
          overflow: hidden;
          position: relative;
          transition: all 0.3s;
          width: 60px;
          .role-txt {
            background: #eaf1fa;
            border: solid 1px #fff;
            float: right;
            height: 228px;
            margin-left: -1px;
            position: relative;
            width: 58px;
            .role-name {
              color: #3c3c3c;
              font-size: 16px;
              left: 50%;
              letter-spacing: 2px;
              line-height: 18px;
              margin-left: -8px;
              position: absolute;
              top: 20px;
              width: 16px;
              writing-mode: tb-rl;
            }
          }
          .role-item {
            background-color: #f5f9ff;
            background-position: right bottom;
            background-repeat: no-repeat;
            background-size: contain;
            bottom: 0;
            left: 0;
            padding: 0 20px;
            position: absolute;
            right: 59px;
            top: 0;
          }
        }
        .active {
          flex: 1;
          .role-txt {
            background: #f5f9ff;
            border-color: transparent;
          }
          .role-line {
            display: block;
          }
        }
      }
    }
    .active {
      flex: 1;
      .group-txt {
        background: #f24854;
      }
      .group-txt .i-triangle {
        border-color: transparent transparent transparent #f24854;
      }
    }
  }
  .child-ul {
    justify-content: flex-end;
  }
  .role-line {
    background: #bfd0e5;
    display: none;
    height: 49px;
    left: -1px;
    position: absolute;
    top: 20px;
    width: 1px;
  }
}
</style>
