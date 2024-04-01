---
customLabelArray: [1]
---

# <Label :level='1'/> Git 快速上手

## 一、安装 Git

- [官网直接下载](https://git-scm.com/downloads)
- git --version <CopyBoard text="git --version"/> // 查看版本号

## 二、设置 Git

### 生成密钥

- 查看是否已经有了 ssh 密钥：cd ~/.ssh
- 如果没有密钥则不会有此文件夹，有则备份删除。
- ssh-keygen -t rsa -C "xxx@xxx.com"

### 上传密钥

- 以 github 为例，依次点击 Setting->SSH and GPB keys->New SSH Key，复制粘贴生成的.pub 文件中的秘钥
- 然后就可以用 ssh 协议，拉取推送代码了

### 设置全局基础配置

- git config --global user.name "xxx" // 请换成你自己的名字
- git config --global user.email "xxx@xx.com" // 请换成你自己的邮箱
- git config --global push.default simple <CopyBoard text="git config --global push.default simple"/> // 要求 Git 版本 1.9.5 以上
- git config --global core.autocrlf false <CopyBoard text="git config --global core.autocrlf false"/> // 让 Git 不要管 Windows/Unix 换行符转换的事
- git config --global core.ignorecase false <CopyBoard text="git config --global core.ignorecase false"/> // windows 设置大小写敏感

## 三、基本工作流程

> 先附上 [Git 备忘清单](/technology-stack/tools/git-cheat-sheet.html)
> 记着先 pull 再 push，冲突都在本地解决

### 开始一个工作区

- init 创建一个空的 Git 仓库或重新初始化一个已存在的仓库
- clone 使用 SSH（推荐） 或 HTTP 协议，克隆仓库到一个新目录（推荐）
- git config --global credential.helper store <CopyBoard text="git config --global credential.helper store"/> // 记住 git 帐号密码(http 时避免每次提交都要输入)

### 在当前变更上工作

- add 添加文件内容至索引
- mv 移动或重命名一个文件、目录或符号链接
- restore 恢复工作区文件
- rm 从工作区和索引中删除文件

### 检查历史和状态

- bisect 通过二分查找定位引入 bug 的提交
- diff 显示提交之间、提交和工作区之间等的差异
- grep 输出和模式匹配的行
- log 显示提交日志
- show 显示各种类型的对象
- status 显示工作区状态

### 扩展、标记和调校您的历史记录

- branch 列出、创建或删除分支
- commit 记录变更到仓库
- merge 合并两个或更多开发历史
- rebase 在另一个分支上重新应用提交
- reset 重置当前 HEAD 到指定状态
- switch 切换分支
- tag 创建、列出、删除或校验一个 GPG 签名的标签对象

### 协同

- fetch 从另外一个仓库下载对象和引用
- pull 获取并整合另外的仓库或一个本地分支
- push 更新远程引用和相关的对象

## 四、Git 工具

### 桌面工具

**Git 官方的图形化界面**

- Git GUI （优势：commit 前代码改动的浏览和挑选）

1. 命令行敲 git gui <CopyBoard text="git gui"/>
2. Windows Explorer，适当目录下，右键菜单，Git GUI Here

- Gitk （优势：显示版本树、历史信息）

1. 命令行敲 gitk --all & <CopyBoard text="gitk --all &"/>
2. Git GUI -> 菜单 -> 版本库 -> 图示所有分支的历史

**其他备选**

- TortoiseGit (Windows)
- SourceTree (OS X 和 Windows)

### Git flow 工具

#### 安装

```js
OS X
brew install git-flow

Linux
apt-get install git-flow

Windows
wget -q -O - --no-check-certificate https://github.com/nvie/gitflow/raw/develop/contrib/gitflow-installer.sh | bash
```

## 五、Git flow 工作流

### 约定

| 分支名称    | 分支作用                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| master      | 稳定分支，用于生产环境，与线上版本同步                                                                       |
| develop     | 开发分支，用于测试环境，用于构建测试版本，来源于 master                                                      |
| feature/xxx | 功能分支，用于功能开发，来源于 dev，开发完成并自测通过后合并到 dev                                           |
| hotfix/xxx  | 修复分支，线上功能修复，来源于 master，修复后双向 merge 到 dev 和 master                                     |
| release/xxx | 发布分支，版本发布使用，来源于 dev 测试后的稳定代码，不应再发功能开发，发布后，要双向 merge 到 dev 和 master |

### 使用

- 初始化: git flow init

- 开始新 Feature: git flow feature start MYFEATURE

- Publish 一个 Feature(也就是 push 到远程): git flow feature publish MYFEATURE

- 获取 Publish 的 Feature: git flow feature pull origin MYFEATURE

- 完成一个 Feature: git flow feature finish MYFEATURE

- 开始一个 Release: git flow release start RELEASE [BASE]

- Publish 一个 Release: git flow release publish RELEASE

- 发布 Release: git flow release finish RELEASE

- 别忘了 git push --tags

- 开始一个 Hotfix: git flow hotfix start VERSION [BASENAME]

- 发布一个 Hotfix: git flow hotfix finish VERSION

## 六、常见问题

### 1、Git stash 暂存修改

当我们在开发项目的时候，突然来一个变更需要修改，我们除了将当前项目提交（commit）后切换（checkout） 到其他分支外，我们还可以先将当前的修改暂存（stash）起来，然后再切换（checkout）到其他分支，而不需要提交（commit），这样就可以减少一个 commit （虽然可以使用 git commit --amend 来修改最后一次提交 ）

**暂存修改**

- git stash 或 git stash save "注释" 来暂存修改，已经被 git 跟踪，只是修改了代码（而不是新增）文件
- 如果有新添加的文件，那么就需要添加 -a 参数（如，git stash -a 或 git stash save -a "注释"），或先 git add . 然后再使用 git stash 或 git stash save "注释" 来暂存修改

**取出修改**

- git stash pop 取出最近的一个暂存，并从 stash list 中删除该暂存记录
- git stash apply stash@{id} 取出某个暂存记录，但不会删除记录，stash@{id}里面的 id 默认从 0 开始，最近的暂存为 0

**暂存列表**

- git stash list 查看 stash 列表
- git stash drop stash@{id} 删除某一个修改暂存
- git stash clear 清空所有的修改暂存

---

### 2、查看 Git 日志

#### git log

- 显示所有提交过的版本信息
- 加上参数 --pretty=oneline，过滤显示版本号和提交时的备注信息

#### git reflog

- 查看所有分支的所有操作记录（包括已经被删除的 commit 记录和 reset 的操作）

#### 自由穿梭 Git 版本

- git reset --hard HEAD~1 退回到上一个版本
- 通过 git reflog 找到被删除的 commitid
- git reset --hard commitid 就可以回到指定版本

---

### 3、git cherry-pick 挑拣提交

获取某一个分支的单笔提交，并作为一个新的提交引入到你当前分支上。当我们需要在本地合入其他分支的提交时，如果我们不想对整个分支进行合并，而是只想将某一次提交合入到本地当前分支上，那么就可以使用 git cherry-pick

- 1、首先，切换到 develop 分支，敲 git log 命令，查找需要合并的 commit 记录，比如 commitID：7fcb3defff；

- 2、然后，切换到 master 分支，使用 git cherry-pick 7fcb3defff  命令，就把该条 commit 记录合并到了 master 分支，这只是在本地合并到了 master 分支；

- 3、最后，git push 提交到 master 远程，至此，就把 develop 分支的这条 commit 所涉及的更改合并到了 master 分支。

#### 常用 options:

- --continue 继续当前的 chery-pick 序列
- --quit 退出当前的 chery-pick 序列
- --abort 取消当前的 chery-pick 序列，恢复当前分支
- -n, --no-commit 不自动提交
- -e, --edit 编辑提交信息

### 4、tag 和 branch 的区别

- tag 对应某次 commit, 是一个点，是不可移动的。
- branch 对应一系列 commit，是很多点连成的一根线，有一个 HEAD 指针，是可以依靠 HEAD 指针移动的。
- 创建 tag 是基于本地分支的 commit，而且与分支的推送是两回事，就是说分支已经推送到远程了，但是你的 tag 并没有，如果把 tag 推送到远程分支上，需要另外执行 tag 的推送命令。

### 5、如何切换链接 git 服务器的方式是 ssh 还是 http

```js
git remote set-url origin <要修改的url>
```

### 6、删除暂存区文件

> 提交后就只能回退指针了，取消暂存用于我们还未提交，但是把错误的文件添加到暂存区的时候

```js
// 取消暂存
git restore --staged <文件>
// 删除暂存，加上--cache同上，没有--cache会将工作区文件也删除
git rm --cache <文件>
```

## 七、Git 命令别名

### 1、使用别名简化命令

```js
git config --global alias.co checkout
git config --global alias.ci commit
git config --global alias.br branch
git config --global alias.st status
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'"
```

## 系统学习

> [《 Pro Git 》](https://git-scm.com/book/zh/v2) > [《 Git Magic 》](http://www-cs-students.stanford.edu/~blynn/gitmagic/intl/zh_cn/ch01.html) > [《 GitHub 秘籍 》](https://snowdream86.gitbooks.io/github-cheat-sheet/content/zh/index.html)
