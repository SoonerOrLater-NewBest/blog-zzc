# 浏览器跨域问题
[[toc]]

## 同源策略

1995年，同源政策由 Netscape 公司引入浏览器。目前，所有浏览器都实行这个政策。最初，它的含义是指，A网页设置的 Cookie，B网页不能打开，除非这两个网页"同源"。所谓"同源"指的是"三个相同"

* 协议相同
* 域名相同
* 端口相同

## JSONP
### 原理
虽然浏览器同源策略限制了XMLHttpRequest请求不同域上的数据。但是，在页面上引入不同域的js脚本是可以的，而且script元素请求的脚本会被浏览器直接运行

* 前端页面
```js
function getJsonP() {
    var script = document.createElement('script');
    script.src = baseUrl + '/jsonp?type=json&callback=onBack';
    document.head.appendChild(script);
}

function onBack(res) {
  alert('JSONP CALLBACK:  ', JSON.stringify(res)); 
}
```

getJsonP方法会在当前页面添加一个script，src属性指向跨域的GET请求:
http://xxxx:3201/jsonp?type=json&callback=onBack，通过query格式带上请求的参数。**callback**是关键，用于定义跨域请求回调的函数名称，这个值必须后台和脚本保持一致

* nodeJs后台
```js
router.get('/jsonp', async (ctx, next) => {
  const req = ctx.request.query;
  console.log(req);
  const data = {
    data: req.type
  }
  ctx.body = req.callback + '('+ JSON.stringify(data) +')';
})

app.use(router.routes());
```

* 针对jsonp请求，后台要做的是：

1. 获取请求参数中的callback值，如本例中的onBack
2. 将callback的值以function(args)的格式作为response

### 优缺点

* 优点：
JSONP方案的兼容性好，IE浏览器也支持

* 缺点：
因为是利用的 script 元素，所以只支持GET请求
缺乏错误处理机制

## CORS
CORS即跨域资源分享（Cross-Origin Resource Sharing），是W3C制定的标准

### 特性
CORS需要浏览器和服务器同时支持

* 大多主流浏览器都支持，IE 10以下不支持
* 只要服务器端实现了CORS接口，浏览器就能自动实现基于CORS的跨域请求

### 简单请求和非简单请求

简单请求需要满足两个条件：

1. 请求类型为HEAD，GET，POST之一

2. 请求头信息不超出以下几种：
* Accept
* Accept-Language
* Content-Language
* Last-Event-ID
* Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

#### 简单请求
对于简单请求，浏览器会直接发出，同时在请求头中添加Origin字段。

Origin用来说明请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。

如果Origin指定的源，不在许可范围内，服务器会返回一个正常的HTTP回应。浏览器发现，这个回应的头信息没有包含Access-Control-Allow-Origin字段（详见下文），就知道出错了，从而抛出一个错误，被XMLHttpRequest的onerror回调函数捕获。注意，这种错误无法通过状态码识别，因为HTTP回应的状态码有可能是200。

浏览器为这个简单的GET请求添加了Origin，而响应头信息中没有Access-Control-Allow-Origin，浏览器判断请求跨域，给出错误提示。

#### 非简单请求
非简单请求是那种对服务器有特殊要求的请求，比如请求方法是PUT或DELETE，或者Content-Type字段的类型是application/json。

非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）。

浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的XMLHttpRequest请求，否则就报错。

**OPTIONS-预检请求**

服务器判断Origin为跨域，所以返回404，除了Origin字段，"预检"请求的头信息包括两个特殊字段

（1）Access-Control-Request-Method

该字段是必须的，用来列出浏览器的CORS请求会用到哪些HTTP方法

（2）Access-Control-Request-Headers

该字段是一个逗号分隔的字符串，指定浏览器CORS请求会额外发送的头信息字段


在OPTIONS的请求响应报文中，头信息里有一些CORS提供的其他字段：

* Access-Control-Allow-Credentials: true
* Access-Control-Allow-Headers: Content-Type,Authorization,Accept
* Access-Control-Allow-Methods: GET,POST,DELETE
* Access-Control-Max-Age: 5

（1）Access-Control-Allow-Methods

该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求

（2）Access-Control-Allow-Headers

如果浏览器请求包括Access-Control-Request-Headers字段，则Access-Control-Allow-Headers字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段

（3）Access-Control-Allow-Credentials

该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可

（4）Access-Control-Max-Age

该字段可选，用来指定本次预检请求的有效期，单位为秒，在此期间，不用发出另一条预检请求

## koa2-cors配置跨域

[koa2-cors配置跨域请求](/nodejs/node/koa.html)
