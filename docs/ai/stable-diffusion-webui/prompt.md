---
customLabelArray: [1]
---

# <Label :level='1'/>AI 绘画 prompt 提示词的进阶使用

## prompt 介绍

prompt 是用于指挥 AI 生成你所需要的内容的一段指令，也叫提示词，，其中还分正向提示词和反向提示词，每个单独的提示词叫 tag（关键词）

## 用什么语言描述

国外的大模型基本都是英文，不过可以装翻译插件，但总觉得中文关键词没那么好用，而国内的大模型很多都支持中文，不过也是一样的问题，翻译有偏差

## 基础写法

1. 用英文半角逗号分隔每个关键词即可，像下面这样

```bash
Amazing epic chinese ancient theme,chinese ink style, a young man is preparing to climb the stonesteps ladder
```

## 改变权重

1. (tag:权重数值)：数值从 0.1~100，默认状态是 1,低于 1 就是减弱，大于 1 就是加强

```bash
(gradient hair: 1.2),(high detailed skin:1.1),(flower hairpin:0.9)
```

2. `(…(tag)…)/[…[tag]…]`：每加一层()括号，权重就重 1.1 倍，每加一层[]括号就反向减弱 1.1 倍.比如说括号加两层是 1.1\*1.1=1.21 倍，三层是 1.331 倍……

```bash
((gradient hair)),(high detailed skin),[flower hairpin]
```

## 按步数控制 tag 生成

- 就是 SD 先按你输入的这个 tag1 开始生成，然后在达到你设定的步数之后，tag1 停止产生作用，此时 tag2 再参与到对内容生成的影响。
- `[tag1:tag2:数字]`，数字大于 1 理解为第 X 步前为 tag1，第 X 步后变成 tag2，数字小于 1 理解为总步数的百分之 X 前为 tag1，之后变成 tag2，示例见下方代码，代码块的#后为注释。注意这两种方法各有优劣，建议按需灵活调用。

```bash
#前10步这只鸟的羽毛是按照蓝色生成，11步开始按照绿色生成:
a bird with beautiful feather [blue:green:10]

#前50%的步数这只鸟的羽毛是按照蓝色生成，后50%的步数开始按照绿色生成:
a bird with beautiful feather [blue:green:0.5],
```

## 提示词的结构

- 光写我要画一个人，这样很难出好图的，想让 AI 好好干活，你就必须好好指挥

### 大概分个类

- 画风：sketch，3d，素描等
- 画面质量：8k 等
- 人物的话：表情，情绪，姿势等
- 摄影方面的知识也用上：比如视线，视角，镜头，光线
- 光线：cinematic lighting（电影光）,dynamic lighting（动感光）
- 视线：looking at viewer,looking at another,looking away,looking back,looking up
- 视角：dynamic angle,from above,from below,wide shot
- 镜头：full body shot,cow body shot
- 图片的主题和背景也很重要

### 举个例子

1. 人像正向提示词

```bash
#高质量高标准画，注视分别对应下面每一行
#肌肤要好，面部轮廓，注意解刨学正确是避免出现变异人的有效tag，
#构图方式，这里contrapposto是对称，female focus也可以换成male focus，景深是为了画面有深度构造立体感
#模特，写了模特之后人物的表情和姿态在没有用controlnet的情况下也会很好看
#精致的面料，衣着光鲜，服装具有丰富细节
#这是可以推荐的吗。。。
8k, best quality, (masterpiece), ultra-detailed,
(high detailed skin), glossy skin,anatomically correct,clear facial contours,
contrapposto, female focus, fashion,  depth of field,
model,
fine fabric emphasis,fine clothed, detailed clothed,
sfw
```

2. 人像反向提示词

- 基本上就是不要 sfw，不要断肢残疾，不要低质量图，不要水印等等

```bash
(revealing clothes:1.2), ​
nsfw, paintings, ​
sketches, lowres, jpeg artifacts, signature, watermark, username,​
(worst quality:2),(low quality:2), (normal quality:2),​
((monochrome)), ((grayscale)),​
skin spots, acnes, skin blemishes, age spot, glans, extra fingers, fewer fingers, ​
(watermark:2), (white letters:1), blurry,​
bad anatomy, bad hands, error, missing fingers, missing arms, missing legs,​
bad feet, poorly drawn hands, poorly drawn face, mutation, deformed, extra limbs, extra arms, extra legs, malformed limbs, fused fingers, too many fingers, long neck, cross-eyed, mutated hands, polar lowres, bad body, bad proportions, gross proportions, wrong feet bottom render, abdominal stretch, briefs, knickers, kecks, thong, {{fused fingers}}, {{bad body}}, bad proportion body to legs, wrong toes, extra toes, missing toes, weird toes, 2 body, 2 pussy, 2 upper, 2 lower, 2 head, 3 hand, 3 feet, extra long leg, super long leg, ​
mirrored image, mirrored noise,EasyNegative
```
