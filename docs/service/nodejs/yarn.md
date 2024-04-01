# Yarn

## Yarn 使用方法
* yarn global list <CopyBoard text="yarn global list"/> // 查看yarn全局安装过的包
* 初始化一个新项目

```sh
yarn init
```

* 添加依赖包

```sh
yarn add [package]
yarn add [package]@[version]
yarn add [package]@[tag]
```

* 将依赖项添加到不同依赖项类别中
* 分别添加到 devDependencies、peerDependencies 和 optionalDependencies 类别中：

```sh
yarn add [package] --dev
yarn add [package] --peer
yarn add [package] --optional
```

* 升级依赖包

```sh
yarn upgrade [package]
yarn upgrade [package]@[version]
yarn upgrade [package]@[tag]
```

* 移除依赖包

```sh
yarn remove [package]
```

* 安装项目的全部依赖

```sh
yarn
或者
yarn install
```

## Yarn的优点

* 速度快
速度快主要来自以下两个方面：

1. 并行安装：无论 npm 还是 Yarn 在执行包的安装时，都会执行一系列任务。npm 是按照队列执行每个 package，也就是说必须要等到当前 package 安装完成之后，才能继续后面的安装。而 Yarn 是同步执行所有任务，提高了性能。
2. 离线模式：如果之前已经安装过一个软件包，用Yarn再次安装时直接从缓存中获取，就不用像npm那样再从网络下载了。


* 安装版本统一

为了防止拉取到不同的版本，Yarn 有一个锁定文件 (lock file) 记录了被确切安装上的模块的版本号。每次只要新增了一个模块，Yarn 就会创建（或更新）yarn.lock 这个文件。这么做就保证了，每一次拉取同一个项目依赖时，使用的都是一样的模块版本。npm 其实也有办法实现处处使用相同版本的 packages，但需要开发者执行 npm shrinkwrap 命令。这个命令将会生成一个锁定文件，在执行 npm install 的时候，该锁定文件会先被读取，和 Yarn 读取 yarn.lock 文件一个道理。npm 和 Yarn 两者的不同之处在于，Yarn 默认会生成这样的锁定文件，而 npm 要通过 shrinkwrap 命令生成 npm-shrinkwrap.json 文件，只有当这个文件存在的时候，packages 版本信息才会被记录和更新。

* 更简洁的输出

npm 的输出信息比较冗长。在执行 npm install package 的时候，命令行里会不断地打印出所有被安装上的依赖。相比之下，Yarn 简洁太多：默认情况下，结合了 emoji直观且直接地打印出必要的信息，也提供了一些命令供开发者查询额外的安装信息。

* 多注册来源处理

所有的依赖包，不管他被不同的库间接关联引用多少次，安装这个包时，只会从一个注册来源去装，要么是 npm 要么是 bower, 防止出现混乱不一致。

* 更好的语义化
yarn改变了一些npm命令的名称，比如 yarn add/remove，感觉上比 npm 原本的 install/uninstall 要更清晰。

## Yarn和npm命令对比

<!-- | npm           | yarn          |
| :------------- |:------------- |
| npm install   | yarn |
| npm install react --save   | yarn add react     |
| npm uninstall react --save | yarn remove react  |
| npm install react --save-dev | yarn add react --dev  |
| npm update --save | yarn upgrade | -->

<ImgPreview filePath='/tool/yarn.png'/>

## npm5.0

1. 默认新增了类似yarn.lock的 package-lock.json
2. git 依赖支持优化：这个特性在需要安装大量内部项目（例如在没有自建源的内网开发），或需要使用某些依赖的未发布版本时很有用。在这之前可能需要使用指定 commit_id 的方式来控制版本。
3. 文件依赖优化：在之前的版本，如果将本地目录作为依赖来安装，将会把文件目录作为副本拷贝到 node_modules 中。而在 npm5 中，将改为使用创建 symlinks 的方式来实现（使用本地 tarball 包除外），而不再执行文件拷贝,这将会提升安装速度

