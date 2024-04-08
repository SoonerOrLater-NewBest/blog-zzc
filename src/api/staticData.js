/**
 * 静态数据
 */
// About 顶部导航 <Accordion />
export const aboutAccordion = [
  {
    name: '联系我',
    list: [
      {
        title: '我的公众号',
        name: '我的公众号',
        content: '欢迎大家扫描右方二维码关注我《前端野路子》',
        show: true,
        more: `<a href="https://github.com/SoonerOrLater-NewBest" style="margin-right:10px">
                Github</a>
                <a href="https://segmentfault.com/u/zhouzhenchao">
                Segmentfault</a>`,
        backgd: 'qrcode.jpg'
      },
      {
        title: '我的小程序',
        name: '我的小程序',
        content: `<div>欢迎大家扫描右方二维码使用
        <div style="font-size: 12px;color: #999;">主要制作一些便民小工具或服务，解压小游戏，开发中......<div/>
        <div/>`,
        show: false,
        backgd: 'fushou344.jpg'
      }
    ],
    show: true
  },
  {
    name: '我是谁',
    list: [
      {
        title: '人物介绍',
        name: '周振超',
        show: true,
        content: '天下无敌大帅比',
        more: `<a href="">
                我的简历(暂不开放)</a>`
        // backgd:'ren1.png'
      },
      {
        title: '好人好事',
        name: '我是好人',
        content: '扶了998个老人',
        show: false
      },
      {
        title: '尽情膜拜',
        name: '男神归来',
        content: '众卿跪安',
        show: false
      }
    ],
    show: false
  },
  {
    name: '我在哪',
    list: [
      {
        title: '还没想好',
        name: '门票998',
        show: true
      },
      {
        title: '还没想好',
        name: '。。。',
        show: false
      },
      {
        title: '还没想好',
        name: '666',
        show: false
      }
    ],
    show: false
  }
];

// 文章分类导航组件 <Navigation /> { service: 0, front-end: 1 }

export const tagSource = [
  [
    {
      label: '云服务器',
      path: 'service/cloud'
    },
    {
      label: 'NodeJs',
      path: 'service/nodejs'
    },
    {
      label: 'Git相关',
      path: 'service/git'
    }
  ],
  [
    {
      label: '前端工作流',
      path: 'front-end/work-flow'
    },
    {
      label: '小程序',
      path: 'front-end/wechat-applet'
    },
    {
      label: 'JavaScript',
      path: 'front-end/javacript'
    },
    {
      label: 'React',
      path: 'front-end/react'
    },
    {
      label: 'Vue',
      path: 'front-end/vue'
    },

    {
      label: 'CSS',
      path: 'front-end/css'
    },
    {
      label: '浏览器',
      path: 'front-end/browser'
    },
    {
      label: '前端常识',
      path: 'front-end/common-sense'
    }
  ]
];
