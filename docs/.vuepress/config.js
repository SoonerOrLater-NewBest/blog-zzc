/**
 * vuepress 配置文件
 */
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  base: '/',
  title: '前端野路子',
  description: 'Vue + Vuepress + Element-Ui + MarkDown + Axios',
  head: [['link', { rel: 'icon', href: `/logo.jpg` }]],
  port: 5050,
  markdown: {
    lineNumbers: true,
    toc: {
      includeLevel: [2, 3, 4, 5]
    }
  },
  themeConfig: {
    advertisement: '/hero.png',
    lastUpdated: 'Last Updated',
    smoothScroll: true,
    sidebarDepth: 0,
    logo: '/logo.jpg',
    // displayAllHeaders: true, // 打开所有header节点
    nav: [
      { link: '/', icon: '<i class="el-icon-s-home"></i>' },
      { text: '关于我', link: '/about/' },
      { text: '前端相关', link: '/front-end/', icon: '<i class="el-icon-star-on"></i>' },
      { text: '后端服务', link: '/service/' },
      { text: '提效工具', link: '/tools/' },
      { text: 'AIGC', link: '/ai/', icon: '<i class="el-icon-view"></i>' },
      {
        text: 'Contact',
        items: [
          { text: 'Segmentfault', link: 'https://segmentfault.com/u/zhouzhenchao' },
          { text: 'Github', link: 'https://github.com/SoonerOrLater-NewBest' }
        ]
      }
    ],
    sidebar: {
      // 侧边栏在 指定文件夹 上
      '/service/': [
        {
          title: '后端服务',
          collapsable: false,
          children: [['', '分类导航']]
        },
        {
          title: '云服务器',
          collapsable: false,
          children: [
            ['cloud/cloud', '云服务器自建部署流程'],
            ['cloud/nginx', 'Nginx']
          ]
        },
        {
          title: 'Git相关',
          collapsable: false,
          children: [
            ['git/git-quick-start', 'Git 快速上手'],
            ['git/git-cheat-sheet', 'Git 备忘清单'],
            ['git/github-actions', 'GitHub Actions 持续集成']
          ]
        },
        {
          title: 'NodeJs',
          collapsable: false,
          children: [
            ['nodejs/npm', 'NPM 包管理器'],
            ['nodejs/npm-dependency', 'NPM 精准控制依赖版本'],
            ['nodejs/npm-release', 'NPM 发布和使用 CLI 工具'],
            ['nodejs/oclif', 'Oclif 入门到实战'],
            ['nodejs/apidoc', 'apiDoc 生成 api 接口文档'],
            ['nodejs/type-orm', 'TypeORM 框架基本使用']
          ]
        }
      ],
      '/about/': [
        {
          title: '关于我',
          collapsable: false,
          children: [['', '简介&导航']]
        },
        {
          title: '我的作品',
          collapsable: false,
          children: [['my-creation/static-blog', '静态博客']]
        }
      ],
      '/front-end/': [
        {
          title: '前端相关',
          collapsable: false,
          children: [['', '分类导航']]
        },
        {
          title: '前端工作流',
          collapsable: false,
          children: [
            ['work-flow/eslint', '从零构建前端 Lint 工作流'],
            ['work-flow/git-commitizen', '规范 Git Commit Message'],
            ['work-flow/tools', '如何选择前端构建工具？'],
            ['work-flow/easy-mock', 'EasyMock本地部署，随时mock数据']
          ]
        },
        {
          title: 'React',
          collapsable: false,
          children: [
            ['react/practice', 'React资源整合'],
            ['react/hooks', '全面拥抱React-Hooks']
          ]
        },
        {
          title: 'JavaScript',
          collapsable: false,
          children: [
            ['javacript/ts', 'TypeScript 概念篇'],
            ['javacript/performance', 'Js性能优化'],
            ['javacript/rxjs', 'RxJS'],
            ['javacript/regular', '正则表达式']
          ]
        },
        {
          title: '微信小程序',
          collapsable: false,
          children: [
            ['wechat-applet/lifetimes', '生命周期'],
            ['wechat-applet/data', '数据通信'],
            ['wechat-applet/share', '转发分享'],
            ['wechat-applet/hover-class', 'hover-class点击态']
          ]
        },
        {
          title: 'CSS',
          collapsable: false,
          children: [
            ['css/secret', 'CSS探索on-going'],
            ['css/unpopular', 'CSS小知识'],
            ['css/css', 'CSS编码技巧'],
            ['css/effect', 'CSS效果'],
            ['css/sass', 'Sass基础'],
            ['css/shape', '45种CSS形状']
          ]
        },
        {
          title: 'Vue',
          collapsable: false,
          children: [
            ['vue/vue', 'Vue 2.0 快速导航'],
            ['vue/vue2-Grammer', 'Vue 2.0 项目实战语法'],
            ['vue/vueGrammer', 'Vue 2.0 语法整理']
          ]
        },
        {
          title: 'Browser',
          collapsable: false,
          children: [
            ['browser/cors', '跨域请求'],
            ['browser/authentication', '登录认证'],
            ['browser/chrome', 'Chrome'],
            ['browser/http', '深入理解Http']
          ]
        },
        {
          title: '一些常识介绍',
          collapsable: false,
          children: [
            ['common-sense/specification', '前端开发规范'],
            ['common-sense/document', '文档写作规范'],
            ['common-sense/design', '设计修养'],
            ['common-sense/agreement', '开源协议'],
            ['common-sense/font', '理解一下 Font 字体']
          ]
        }
      ],
      '/tools/': [
        {
          title: '提效工具',
          collapsable: false,
          children: [['', 'Vuepress静态博客搭建']]
        }
      ],
      '/ai/': [
        {
          title: 'AIGC',
          collapsable: false,
          children: [
            ['', '图片模型介绍'],
            ['stable-diffusion-webui/install', '本地部署stable-diffusion'],
            ['stable-diffusion-webui/free', 'AI 画图免费在线试玩网站'],
            ['stable-diffusion-webui/prompt', 'AI 绘画 prompt 提示词的进阶使用'],
            ['video/shorts', 'AI 制作短片，解放生产力']
          ]
        },
        {
          title: 'ComfyUI',
          collapsable: false,
          children: [
            ['comfyui/install', ' Mac (Intel 集成显卡)安装 ComfyUI'],
            ['comfyui/moda', '魔搭一键启动工作流']
          ]
        }
      ]
    }
  }
};
