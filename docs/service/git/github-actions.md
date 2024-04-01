---
customLabelArray: [1]
---

# <Label :level='1'/>GitHub Actions 持续集成

> [了解 GitHub Actions](https://docs.github.com/zh/actions/learn-github-actions/understanding-github-actions)

> [GitHub Actions 文档](https://docs.github.com/zh/actions)
## 自动更新静态资源简单流程

- 拉取当前 Github 仓库代码并切换到相应的分支
- 安装 Node 和 Npm 环境
- 安装项目的依赖
- 构建库包和演示文档的静态资源
- 发布演示文档的静态资源

通过查看 [官方 Actions](https://github.com/marketplace?type=actions) 和 [awesome-actions](https://github.com/sdras/awesome-actions)，找到所需的 Actions:

- [Checkout](https://github.com/actions/checkout): 从 Github 拉取仓库代码到 Github 服务器的 \$GITHUB_WORKSPACE 目录下
- [cache](https://github.com/actions/cache): 缓存 npm
- [setup-node](https://github.com/actions/setup-node): 安装 Node 和 Npm 环境
- [actions-gh-pages](https://github.com/peaceiris/actions-gh-pages): 在 Github 上发布静态资源

在 .github/workflows 下新增 mian.yml 配置文件：

```yml
# 以下都是官方文档的简单翻译
# 当前的 yml（.yaml） 文件是一个 workflow，是持续集成一次运行的一个过程，必须放置在项目的 .github/workflow 目录下
# 如果不清楚 .yml 文件格式语法，可以查看 https://www.codeproject.com/Articles/1214409/Learn-YAML-in-five-minutes
# 初次编写难免会产生格式问题，可以使用 VS Code 插件进行格式检测，https://marketplace.visualstudio.com/items?itemName=OmarTawfik.github-actions-vscode

# 具体各个配置属性可查看 https: //docs.github.com/en/actions/reference/workflow-syntax-for-github-actions

# workflow 的执行仍然会受到一些限制，例如
#  - 每个 job 最多执行 6 小时（本地机器不受限制）
#  - 每个 workflow 最多执行 72 小时
#  - 并发 job 的数量会受到限制
#  - 更多查看 https: //docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#usage-limits

# name: 当前 workflow 的名称
name: my-actions

# on:  指定 workflow 触发的 event
#
#      event 有以下几种类型
#         - webhook
#         - scheduled
#         - manual
on:
  # push: 一个 webhook event，用于提交代码时触发 workflow，也可以是触发列表，例如 [push, pull_request]

  #        workflows 触发的 event 大部分是基于 webhook 配置，以下列举几个常见的 webhook:
  #           - delete:  删除一个 branch 或 tag 时触发
  #           - fork / watch:  某人 fork / watch 项目时触发（你问有什么用，发送邮件通知不香吗？）
  #           - pull_request:  提交 PR 时触发
  #           - page_build:  提交 Github Pages-enabled 分支代码时触发
  #           - push:  提交代码到特定分支时触发
  #           - registry_package:  发布或跟新 package 时触发
  #           更多 webhook 可查看 https: //docs.github.com/en/actions/reference/events-that-trigger-workflows
  #           从这里可以看出 Git Actions 的一大特点就是 Gihub 官方提供的一系列 webhook
  push:
    # branches: 指定 push 触发的特定分支，这里你可以通过列表的形式指定多个分支
    branches:
      - master
    #
    # branches 的指定可以是通配符类型，例如以下配置可以匹配 refs/heads/releases/10
    # - 'releases/**'
    #
    # branches 也可以使用反向匹配，例如以下不会匹配 refs/heads/releases/10
    # - '!releases/**'
    #
    # branches-ignore:  只对 [push, pull_request] 两个 webhook 起作用，用于指定当前 webhook 不触发的分支
    # 需要注意在同一个 webhook 中不能和 branches 同时使用
    #
    # tags:  只对 [push, pull_request] 两个 webhook 起作用，用于指定当前 webhook 触发的 tag
    #
    # tags:
    #   - v1             # Push events to v1 tag
    #   - v1.*           # Push events to v1.0, v1.1, and v1.9 tags
    #
    # tags-ignore:  类似于 branches-ignore
    #
    # paths、paths-ignore...
    #
    # 更多关于特定过滤模式可查看 https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#filter-pattern-cheat-sheet
    #
    # 其他的 webhook 控制项还包括 types（不是所有的 webhook 都有 types），例如已 issues 为例，可以在 issues 被 open、reopened、closed 等情况下触发 workflow
    # 更多 webhook 的 types 可查看 https: //docs.github.com/en/actions/reference/events-that-trigger-workflows#webhook-events
    #
    # on:
    #   issues:
    #     types:  [opened, edited, closed]

  # 除此之外如果对于每个分支有不同的 webhook 触发，则可以通过以下形式进行多个 webhook 配置
  #
  # push:
  #   branches:
  #     - master
  # pull_request:
  #   branches:
  #     - dev
  #
  # 除了以上所说的 webhook event，还有 scheduled event 和 manual event
  # scheduled event:  用于定时构建，例如最小的时间间隔是 5 min 构建一次
  # 具体可查看 https: //docs.github.com/en/actions/reference/events-that-trigger-workflows#scheduled-events

# env:  指定环境变量（所有的 job 生效，每一个 job 可以独立通过 jobs.<job_id>.env、jobs.<job_id>.steps.env 配置）
# defaults / defaults.run: 所有的 job 生效，每一个 job 可以独立通过 jobs.<job_id>.defaults 配置
# deafults
# defaults.run

# jobs: 一个 workflow 由一个或多个 job 组成
jobs:
  # job id: 是 job 的唯一标识，可以通过 _ 进行连接，例如:  my_first_job，例如这里的 build 就是一个 job id
  build_and_deploy:
    # name: 在 Github 中显示的 job 名称
    name: Build And Deploy
    #
    # needs: 用于继发执行 job，例如当前 job build 必须在 job1 和 job2 都执行成功的基础上执行
    # needs: [job1, job2]
    #
    # runs-on: job 运行的环境配置，包括:
    #   - windows-latest
    #   - windows-2019
    #   - ubuntu-20.04
    #   - ubuntu-latest
    #   - ubuntu-18.04
    #   - ubuntu-16.04
    #   - macos-latest
    #   - macos-10.15
    #   - self-hosted（本地机器，具体可查看 https: //docs.github.com/en/actions/hosting-your-own-runners/using-self-hosted-runners-in-a-workflow）
    runs-on: ubuntu-latest
    #
    # outputs:  用于输出信息
    #
    # env:  用于设置环境变量
    #
    # defaults:  当前所有 step 的默认配置
    #
    # defaults.run

    # if: 满足条件执行当前 job

    # steps:  一个 job 由多个 step 组成，step 可以
    #   - 执行一系列 tasks
    #   - 执行命令
    #   - 执行 action
    #   - 执行公共的 repository
    #   - 在 Docker registry 中的 action
    steps:
      #
      # id: 类似于 job id
      #
      # if:  类似于 job if
      #
      # name:  当前 step 的名字
      - name: Checkout
        #
        # uses: 用于执行 action
        #
        #       action: 可以重复使用的单元代码
        #          - 为了 workflow 的安全和稳定建议指定 action 的发布版本或 commit SHA
        #          - 使用指定 action 的 major 版本，这样可以允许你接收 fixs 以及 安全补丁并同时保持兼容性
        #          - 尽量不建议使用 master 版本，因为 master 很有可能会被发布新的 major 版本从而破坏了 action 的兼容性
        #          - action 可能是 JavaScript 文件或 Docker 容器，如果是 Docker 容器，那么 runs-on 必须指定 Linux 环境
        #
        #         指定固定 commit SHA
        #         uses:  actions/setup-node@74bc508
        #         指定一个 major 发布版本
        #         uses:  actions/setup-node@v1
        #         指定一个 minor 发布版本
        #         uses:  actions/setup-node@v1.2
        #         指定一个分支
        #         uses:  actions/setup-node@master
        #         指定一个 Github 仓库子目录的特定分支、ref 或 SHA
        #         uses:  actions/aws/ec2@master
        #         指定当前仓库所在 workflows 的目录地址
        #         uses:  ./.github/actions/my-action
        #         指定在 Dock Hub 发布的 Docker 镜像地址
        #         uses:  docker: //alpine: 3.8
        #         A Docker image in a public registry
        #         uses:  docker: //gcr.io/cloud-builders/gradle

        # checkout action 主要用于向 github 仓库拉取源代码（需要注意 workflow 是运行在服务器上，因此需要向当前 github 拉取仓库源代码）
        # 它的功能包括但不限于
        #   - Fetch all history for all tags and branches
        #   - Checkout a different branch
        #   - Checkout HEAD^
        #   - Checkout multiple repos (side by side)
        #   - Checkout multiple repos (nested)
        #   - Checkout multiple repos (private)
        #   - Checkout pull request HEAD commit instead of merge commit
        #   - Checkout pull request on closed event
        #   - Push a commit using the built-in token

        # checkout action:  https: //github.com/actions/checkout
        uses: actions/checkout@v2
        # with: action 提供的输入参数
        with:
          # 指定 checkout 的分支、tag 或 SHA
          # 更多 checkout action 的配置可查看 https: //github.com/actions/checkout#usage
          ref: feat/ci
        # args: 用于 Docker 容器的 CMD 指令参数
        # entrypoint: Docker 容器 action（覆盖 Dockerfile 的 ENTRYPOINT） 和 JavaScript action 都可以使用
      #
      # run: 使用当前的操作系统的默认的 non-login shell 执行命令行程序
      # 运行单个脚本
      # run: npm install
      # 运行多个脚本
      # run: |
      #   npm ci
      #   npm run build
      #
      # working-directory: 用于指定当前脚本运行的目录
      # working-directory: ./temp
      #
      # shell: 可以指定 shell 类型进行执行，例如 bash、pwsh、python、sh、cmd、powershell
      # shell: bash
      #
      # env: 除了可以设置 workflow 以及 job 的 env，也可以设置 step 的 env（可以理解为作用域不同，局部作用域的优先级更高）
      #
      # comtinue-on-error: 默认当前 step 失败则会阻止当前 job 继续执行，设置 true 时当前 step 失败则可以跳过当前 job 的执行

      - name: Cache
        # cache action: https://github.com/actions/cache
        # cache 在这里主要用于缓存 npm，提升构建速率
        uses: actions/cache@v2
        # npm 缓存的路径可查看 https://docs.npmjs.com/cli/cache#cache
        # 由于这里 runs-on 是 ubuntu-latest，因此配置 ~/.npm
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
      # github-script action: https://github.com/actions/github-script
      # 在 workflow 中使用 Script 语法调用 Github API 或引用 workflow context

      # setup-node action: https://github.com/actions/setup-node
      # 配置 Node 执行环境（当前构建的服务器默认没有 Node 环境，可以通过 Action 安装 Node）
      # 需要注意安装 Node 的同时会捆绑安装 npm，如果想了解为什么会捆绑，可以 Google 一下有趣的故事哦
      # 因此使用了该 action 后就可以使用 npm 的脚本在服务器进行执行啦
      # 这里也可以尝试 v2-beta 版本哦
      - name: Set Node
        uses: actions/setup-node@v1
        with:
          # 也可以通过 strategy.matrix.node 进行灵活配置
          # 这里本地使用 node 的 12 版本构建，因此这里就进行版本固定啦
          node-version: '12'

      - run: npm install
      - run: npm run build
      - run: npm run docs:build

      - name: Deploy
        # 用于发布静态站点资源
        # actions-gh-pages action: https://github.com/peaceiris/actions-gh-pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          # GTIHUB_TOKEN：https://docs.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token
          # Github 会在 workflow 中自动生成 GIHUBT_TOKEN，用于认证 workflow 的运行
          github_token: ${{ secrets.GITHUB_TOKEN }}
          # 静态资源目录设置
          publish_dir: ./docs/.vuepress/dist
          # 默认发布到 gh-pages 分支上，可以指定特定的发布分支
          publish_branch: gh-pages1 # default: gh-pages
          full_commit_message: ${{ github.event.head_commit.message }}
    #
    # timeout-minutes: 一个 job 执行的最大时间，默认是 6h，如果超过时间则取消执行
    #
    # strategy.matrix: 例如指定当前 job 的 node 版本列表、操作系统类型列表等
    # strategy.fail-fast
    # strategy.max-parallel
    # continue-on-error:  一旦当前 job 执行失败，那么 workflow 停止执行。设置为 true 可以跳过当前 job 执行
    # container: Docker 容器配置，包括 image、env、ports、volumes、options 等配置
    #
    # services: 使用 Docker 容器 Action 或者 服务 Action 必须使用 Linux 环境运行
```
