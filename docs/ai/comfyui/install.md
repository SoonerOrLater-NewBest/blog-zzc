---
customLabelArray: [1]
---

# <Label :level='1'/> Mac (Intel 集成显卡)安装 ComfyUI

> windows 版安装更简单，直接[github 项目](https://github.com/comfyanonymous/ComfyUI)里下载解压包，解压就完事了

## git 拉取项目代码

```bash
# clone 项目代码
git clone https://github.com/comfyanonymous/ComfyUI.git
# 进入项目代码
cd ComfyUI
```

## Python 虚拟环境

和 webui 一样，最好就用`3.10.6`，怎么装 Python 就不说啦，webui 安装那一篇里有

```bash
#使用python创建虚拟环境
python -m venv .venv
source .venv/bin/active
```

## 安装依赖

```bash
pip install torch torchvision torchaudio
pip install -r requirements.txt
# 要是网络不好，配置一下pip镜像
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
pip config set install.trusted-host pypi.tuna.tsinghua.edu.cn
```

- 感觉有必要把所有需要切换镜像的总结一下，想下载点东西实在太苦了

## 启动程序

因为 MacBook Pro 是英特尔的集成显卡，不支持 CUDA，所以也就不支持 GPU 的使用。启动时，一定要指明关闭 GPU，使用 CPU。

```bash
python main.py --disable-cuda-malloc --use-split-cross-attention --cpu
```

- --cpu： 就是指明使用 CPU 来画图
- --disable-cuda-malloc： 指明不使用 CUDA。
- --use-split-cross-attention ： 低内存的时候使用
- 运行成功，就可以在浏览器`http://127.0.0.1:8188`访问

## 模型和插件下载

- 即使使用默认工作流，也至少需要一个底摸才能跑起来
- 能访问的话推荐 Hugging Face 和 Civitai 下载模型
- 否则就`https://hf-mirror.com`或魔搭社区找一找，不保证有最新的
- 下载的模型，放到 ComfyUI/models/checkpoints 目录下
- 下载的插件，放入到 ComfyUI/custom_nodes 目录下
