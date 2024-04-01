---
customLabelArray: [3]
---

# <Label :level='3'/>Nginx

Nginx 是一款广泛应用的 Web 服务器，常用于反向代理、负载均衡器以及 HTTP 缓存等。

## 使用 Nginx 服务为 Linux 实例绑定多个域名

> 以 CentOS 6.8 为例

1. 登录 Linux 实例。
2. 进入 Nginx 服务的配置文件目录，执行如下命令：

```
cd /etc/nginx/conf.d
```

3. 创建域名规则配置文件，输入 i 编辑新建的配置文件。

```
vi [$Domain_Name].conf
```

### 为每一个域名建立一个单独的配置文件

```conf
server
{
listen   80;                    #监听端口设为80。
server_name  www.server110.com;      #绑定您的域名。
index index.htm index.html index.php;   #指定默认文件。
root /home/www/server110.com;        #指定网站根目录。
include location.conf;            #当您需要调用其他配置文件时才粘贴此项，如无需要，请删除此项。
}
```

### 将多个域名规则写进一个共同的配置文件

```conf
server
{
listen   80;                       #监听端口设为 80。
server_name  www.server110.com;         #绑定您的域名。
index index.htm index.html index.php;   #指定默认文件。
root /home/www/server110.com;           #指定网站根目录。
include location.conf;                  #当您需要调用其他配置文件时才粘贴此项，如无需要，请删除此项。
}
server
{
listen   80;                            #监听端口设为 80。
server_name  msn.server111.com;         #绑定您的域名。
index index.htm index.html index.php;   #指定默认文件。
root /home/www/msn.server110.com;      #指定网站根目录。
include location.conf;             #当您需要调用其他配置文件时才粘贴此项，如无需要，请删除此项。
}
```

### 为无 WWW 前缀的域名配置规则，并添加 301 跳转

```conf
server
{
listen 80;
server_name server110.com;
rewrite ^/(.*) http://www.server110.com/$1 permanent;
}
```

4. 按 Esc 键退出编辑，输入`:wq`，保存并退出。
5. 执行`nginx -t`命令，检查配置是否有误，并按照报错提示修复错误。
6. `service nginx restart`，重启 Nginx 服务。
7. `service nginx reload`，重新载入 Nginx 服务。

## 使用 Nginx 反向代理 Nodejs

```js
upstream node1 {
    server 127.0.0.1:3000;
}
upstream node2 {
    server 127.0.0.1:3001;
}
underscores_in_headers on;

map $http_my_header $pool{
    default "dev1";
    condition1 "node1";
    condition2 "node2";
}
server {
    listen 443;
    server_name xxxxxxxxxxxx;
    access_log /var/log/nginx/xxx.log;
    ssl on;
    ssl_certificate 你的证书;
    ssl_certificate_key 你的key
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    location / {
        proxy_pass http://$pool;
        proxy_set_header X-NginX-Proxy true;
    }
}
```

- 从上面的 conf 中，有 2 个分别监听 3000 和 3001 端口的`nodejs`应用
- `underscores_in_headers` 默认为`off` 意思就是如果你的头部有下划线就忽略掉，那么很显然我不想忽略所以设置成 on
- `map $http_my_header $pool`根据请求头来访问不同的`nodejs`服务
- 最后就是配置 server 然后监听 https 的默认端口
- 输入 `nginx -t` 测试一下，ok 的话就可以 `service nginx reload` 重新载入。
