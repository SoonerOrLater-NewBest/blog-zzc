---
customLabelArray: [1]
---

# <Label :level='1'/> 一款极简绿色无广告视频下载器，可在线使用｜本地部署｜ API 调用，实乃良心之作

现在想下载个喜欢的视频是不是特别难？这款软件必能帮到您。
你只需粘贴链接即可获取文件，无需任何复杂操作，让套路消失。

## cobalt 是什么

cobalt 是一个免费且易于使用的媒体下载工具，它没有广告、没有侵入性分析
它支持多种流媒体服务，包括 B 站、油管、tiktok 等，采用了先进的下载技术和算法，确保用户能够获得高效稳定的下载速度，节省用户的时间；极简的操作界面，让你梦回没有任何套路的时代。

以下是目前项目支持的网站列表：
![](https://cdn.jsdelivr.net/gh/SoonerOrLater-NewBest/zzc-images/img/202406141602032.jpg)

该列表是截止到目前的，应该会随着时间的推移而不断扩大。如果缺少您想要的服务，你还可以给项目提 ISSUE，作者会考虑支持。

## 部署 Cobalt

不想自己部署的，直接看后面的在线试用

## docker 部署

- 如果想自己部署一个的话，这里建议使用`docker compose`
- 首先你需要安装好`docker`
- 再创建一个 docker compose 文件，参考如下命令：

```bash
mkdir cobalt
cd cobalt && vi docker-compose.yml
```

- 然后在`docker-compose.yml`中写入下面的配置，已经包括了 API 和 WEB 服务

```yml
version: '3.5'
services:
cobalt-api:
image: ghcr.io/wukko/cobalt:7
restart: unless-stopped
container_name: cobalt-api

        init: true

        # if container doesn't run detached on your machine, uncomment the next line
        #tty: true

        ports:
            - 9000:9000/tcp
            # if you're using a reverse proxy, uncomment the next line and remove the one above (9000:9000/tcp):
            #- 127.0.0.1:9000:9000

        environment:
            # replace <https://co.wuk.sh/> with your instance's target url in same format
            API_URL: "<https://替换自己的URL//>"
            # replace eu-nl with your instance's distinctive name
            API_NAME: "eu-nl"
            # if you want to use cookies when fetching data from services, uncomment the next line and the lines under volume
            # COOKIE_PATH: "/cookies.json"
            # see docs/run-an-instance.md for more information
        labels:
            - com.centurylinklabs.watchtower.scope=cobalt

        # if you want to use cookies when fetching data from services, uncomment volumes and next line
        #volumes:
            #- ./cookies.json:/cookies.json

    cobalt-web:
        image: ghcr.io/wukko/cobalt:7
        restart: unless-stopped
        container_name: cobalt-web

        init: true

        # if container doesn't run detached on your machine, uncomment the next line
        #tty: true

        ports:
            - 9001:9001/tcp
            # if you're using a reverse proxy, uncomment the next line and remove the one above (9001:9001/tcp):
            #- 127.0.0.1:9001:9001

        environment:
            # replace <https://cobalt.tools/> with your instance's target url in same format
            WEB_URL: "<https://替换自己的URL/>"
            # replace <https://co.wuk.sh/> with preferred api instance url
            API_URL: "<https://替换自己的URL//>"

        labels:
            - com.centurylinklabs.watchtower.scope=cobalt

    # update the cobalt image automatically with watchtower
    watchtower:
        image: ghcr.io/containrrr/watchtower
        restart: unless-stopped
        command: --cleanup --scope cobalt --interval 900
        volumes:
            - /var/run/docker.sock:/var/run/docker.sock
```

- 最后启动容器

```bash
docker compose up -d
```

## 源码部署

通过源码来启动项目，这里需要首先在本地安装好 nodejs 环境，要求`nodejs 18+`

```bash
git clone https://github.com/imputnet/cobalt
npm run setup
npm start
```

## API 调用

cobalt 有一个开放的 api，您可以在项目中免费使用~。
它使用起来简单明了，[查看文档](https://github.com/imputnet/cobalt/blob/current/docs/api.md)了解如何使用它。
官方提供的在线环境，同时提供了网页 WEB 服务，和 API 调用服务，但是不要用于商业，要用还是自己部署，仔细看下面公告：
✅ 您可以在个人项目中使用主 api 实例（api.cobalt.tools）
❌ 你不能在商业上使用免费的 api（在付费墙或广告后面的任何地方）。为此托管您自己的实例。
我们保留限制滥用/过度访问主实例 api 的权利。

- API 的主接口信息如下：

```bash
POST: /api/json
request body type: application/json
response body type: application/json
```

- 更多的请求参数和返回参数，还是看文档吧，就不贴图了，贴个链接
- https://github.com/imputnet/cobalt/blob/current/docs/api.md

## 在线网站

网址：https://cobalt.tools/
![](https://cdn.jsdelivr.net/gh/SoonerOrLater-NewBest/zzc-images/img/202406141545105.png)

1. 使用 Cobalt，很简单、很直接，就是复制链接，自动开始下载。

2) 在下方的设置里面，可以自行设置下载的视频、音频的一些参数，如视频的质量、大小，音频的格式。

![](https://cdn.jsdelivr.net/gh/SoonerOrLater-NewBest/zzc-images/img/202406141543139.png)

3. 除了对视频和音频的下载设置外，还有一些其他设置，文件命名等。
   ![](https://cdn.jsdelivr.net/gh/SoonerOrLater-NewBest/zzc-images/img/202406141544042.png)

从技术的角度，Cobalt 是非常不错的，支持多种流媒体服务，提供高效稳定的下载速度和灵活多样的下载选项，是一个很好的视频下载器。除了基本的 web 使用，还可以通过 API 来使用的，你可以将它融入到自己的程序当中来进行调用，这就有了非常多的想象空间。

## Save what you love

- 去 B 站找了个好身材跳舞的视频
  ![](https://cdn.jsdelivr.net/gh/SoonerOrLater-NewBest/zzc-images/img/202406141627362.png)
- 把链接复制到 cobalt，等一会就一气呵成下载好了
  ![](https://cdn.jsdelivr.net/gh/SoonerOrLater-NewBest/zzc-images/img/202406141629129.png)
- 怎么样，看到喜欢的不用收藏了，直接下手

项目作者写的项目介绍就是`save what you love`，保存你所爱的，相当完美。

最后也要说明，开源项目的本身目的是技术分享和交流，而不是为盗版提供便利。
所以大家在使用的时候也同样要注意版权问题，如果作者有版权要求，还是要遵守。

---

本篇完～点个在看和关注再走行不行啊～
