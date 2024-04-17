---
customLabelArray: [1]
---

# <Label :level='1'/> AI 学习中需要用到的各种镜像源

> 因为特殊原因，导致很多资源，我们下载不了，只能找平替方案，于是总结一下镜像源，方便后续使用

## AI 大模型下载

1. 优先还是推荐 [HuggingFace Hub](https://huggingface.co/)
2. 在[魔搭社区下载](https://www.modelscope.cn/models)

- 补充魔搭有两种下载方式，一种 git 下载，一种代码下载，如果用 git 需要安装 git-lfs，因为大模型都是大文件

3. 使用 HF Mirror，包含较全的 HuggingFace 模型。 [HF-Mirror - Huggingface 镜像站](https://hf-mirror.com/)

##

- git-lfs 是 Git Large File Storage 的缩写，是 Git 的一个扩展，用于处理大文件的版本控制。
  --｜--
  git lfs install 安装 Git LFS 扩展。运行此命令后，Git LFS 将被激活并配置为在你的仓库中跟踪大文件。
  git lfs track 将指定的文件或文件类型配置为由 Git LFS 跟踪。例如，如果你想要对所有的 .mp4 文件使用 Git LFS，你可以运行 git lfs track “\*.mp4”。
  git lfs untrack 取消对某个文件或文件类型的 Git LFS 跟踪。
  git lfs ls-files 列出由 Git LFS 跟踪的文件。
  git lfs pull 从远程仓库拉取 Git LFS 对象。
  git lfs push 将本地的 Git LFS 对象推送到远程仓库。
  git lfs fetch 从远程仓库获取 Git LFS 对象，但不将它们检出到工作目录。
  git lfs status 显示有关 Git LFS 跟踪文件的信息，例如当前跟踪的文件、未跟踪的文件等。
  centeros 版:sudo yum install git-lfs
  ubuntu 版: sudo apt-get install git-lfs
  mac : brew install git-lfs/arch -arm64 brew install git-lfs
