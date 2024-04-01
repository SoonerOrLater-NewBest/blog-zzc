## HTTP/1.1 协议

- 是一个客户端和服务端请求与应答的标准协议
- 谁请求谁是客户端，谁应答谁是服务端
- 基于 TCP 协议，面向连接，必须三次通信才能建立连接，简称“三次握手”
- 有点是传输数据过程稳定，缺点是消耗时间和资源，每次请求都要重新建立连接，服务端无法主动发送消息，只能客户端轮询
- 不保存状态，使用 Cookie 缓存

## HTTP 协议内容

### 请求报文

1. 请求行
   包括`请求方法 URL 协议版本`以空格相隔

- URL 分为 1 协议：http(s)、FTP、File，2 服务器地址：域名或 IP 地址，3 端口：如默认 80 和 443

### 响应报文

## 一句话概括

- 正向代理隐藏真实客户端，反向代理隐藏真实服务端

## 拓展阅读 & 好文推荐

关于 http 状态码 204 理解

HTTP 的状态码有很多种,主要有 1xx（临时响应）、2xx（成功）、3xx（已重定向）、4xx（请求错误）以及 5xx（服务器错误）五个大类，每个大类还对应一些具体的分类。平时我们接触比较多的是 200、400、500 等。

这里我们主要讨论一下状态码 204，在 HTTP RFC 2616 中关于 204 的描述如下:

If the client is a user agent, it SHOULD NOT change its document view from that which caused the request to be sent. This response is primarily intended to allow input for actions to take place without causing a change to the user agent’s active document view, although any new or updated metainformation SHOULD be applied to the document currently in the user agent’s active view.

意思等同于请求执行成功，但是没有数据，浏览器不用刷新页面.也不用导向新的页面。如何理解这段话呢。还是通过例子来说明吧，假设页面上有个 form，提交的 url 为 http-204.htm，提交 form，正常情况下，页面会跳转到 http-204.htm，但是如果 http-204.htm 的相应的状态码是 204，此时页面就不会发生转跳，还是停留在当前页面。另外对于 a 标签，如果链接的页面响应码为 204，页面也不会发生跳转。

所以对于一些提交到服务器处理的数据，只需要返回是否成功的情况下，可以考虑使用状态码 204 来作为返回信息，从而省掉多余的数据传输。

- [图解跨域请求、反向代理原理，对前端更友好的反向代理服务器 - Caddy](https://github.com/a1029563229/Blogs/tree/master/BestPractices/caddy)
