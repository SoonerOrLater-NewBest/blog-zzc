---
customLabelArray: [1]
---
# <Label :level='1'/>EasyMock本地部署，随时mock数据

## 本地搭建
鉴于在线服务常年登不上，最好自己搭个本地服务，美滋滋

* [Mac本地搭建easy-mock](http://www.imooc.com/article/267594)
* [Win本地搭建easy-mock](https://cloud.tencent.com/developer/article/1356684)

**网上有很多文章，如上贴2篇，照着来，说一下注意点**

* 8.9 < node 版本 < 10.x 
* MongoDB不再开源了，所以mac不能直接 brew install mongodb
* 解决方案->[官网选项](https://github.com/mongodb/homebrew-brew) [Brew安装MongoDB](https://blog.csdn.net/weixin_43972437/article/details/100671337)
* 注意修改 config/default.json 配置文件
* 创建一个数据库存储目录 /data/db
```c
sudo mkdir -p /data/db
// 如果你的数据库目录不是/data/db，可以通过 --dbpath 来指定。
sudo mongod --dbpath=/data/db
```
* 编译源码
```js
// 分开执行或用&&连接
$ git clone https://github.com/easy-mock/easy-mock.git
$ npm i
$ npm run build
$ cross-env NODE_ENV=production pm2 start app.js
```
## 服务命令

**mongodb**
```js
$ brew services start mongodb-community // 启动
$ brew services stop mongodb-community // 停止
$ mongod --config /usr/local/etc/mongod.conf // 手动
// 如果不包括–config选项具有配置文件的路径，则MongoDB服务器没有默认配置文件或日志目录路径，并且将使用 /data/db.
$ mongo admin --eval "db.shutdownServer()" // 关闭
$ mongo // 进入mongo环境
```

**redis**
> 我没设置环境变量或软链接，所以这边就用./运行了，前台起的服务，关闭只需control + c
```js
$ ./redis-server 启动redis服务
$ ./redis-cli 测试 redis命令
$ ./redis-cli --raw 避免中文乱码
// 脚本命令
1	EVAL script numkeys key [key ...] arg [arg ...]
执行 Lua 脚本。
2	EVALSHA sha1 numkeys key [key ...] arg [arg ...]
执行 Lua 脚本。
3	SCRIPT EXISTS script [script ...]
查看指定的脚本是否已经被保存在缓存当中。
4	SCRIPT FLUSH
从脚本缓存中移除所有脚本。
5	SCRIPT KILL
杀死当前正在运行的 Lua 脚本。
6	SCRIPT LOAD script
将脚本 script 添加到脚本缓存中，但并不立即执行这个脚本。
```
## API 自动生成
**使用[Easy-Mokc-ClI](https://easy-mock.github.io/easy-mock-cli/#/) 自动生成api调用文件**
* npm install -g easy-mock-cli // 安装
* 根目录配置文件.easymockrc
```json
{
  "host":"http://localhost:7300", // 默认是https://www.easy-mock.com
  "output": "api",
  "template": "axios",
  "projects": [
    {
      "id": "你要创建的 Easy Mock 项目的 id",
      "name": "demo",
      "black": [
        "/query" // 排除 query 接口
      ]
    },
    {
      "id": "58fef6ac5e43ae5dbea5eb51",
      "name": "top", // 生成到 api/top 目录下。
      "white": [
        "/proxy" // 只生成 proxy 接口
      ]
    }
  ]
}
```
* easymock init . // 生成js文件
## 遇到的问题
* [Easy-mock中post数据预览](https://segmentfault.com/a/1190000018618747)