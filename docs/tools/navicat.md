---
customLabelArray: [1]
---

# <Label :level='1'/> Mac 安装 Navicat 数据库管理工具

> Premium12.0.22 中文破解版

## 安装

### 1、下载安装包

- [百度网盘链接](https://pan.baidu.com/s/111nlbVEQ0DDz0Aum30cdew):https://pan.baidu.com/s/111nlbVEQ0DDz0Aum30cdew
- 提取码:5771

### 2、双击安装包、直接拖动完成安装

- 如果有权限问题
- 进入 系统设置->隐私与安全性
  ![alt text](./imgnavicat/image.png)

### 3、激活

1. 到应用程序，**右键 navicat->显示包内容->Contents->Resources**
   ![alt text](./imgnavicat/image1.png)

2. 双击打开 **rpk** 文件，将下面的公钥复制进去，然后保存退出

```bash
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvc8jdtI4y68rvFvRULCY
hprieJINbeOkzUBoQVRl2o2VNE5qWy9lNmS7reCfCwqq/YQpbKH2dHrhiICviNiM
DKRLw1NH+fGDzje3qCHm8tG5EHZQSTyqDe7rI8UDN1W3vk28Snwz97XQ+toVfiA3
4zGNbWYsKmEBjxXR502ZLwf2oCx64zFZLNJeub0UVrZMLOTSnClPHT0cfFvRdzHB
qDGx8KuOUgKBzuPyrUYwF8t5byXdxWwPOaNQu/aoEecZX0wbxvu06LmKxfJ6kaUE
hoe9ztH4XQNcpxF68O3Z7BNsitkDEzV8G40t/uLoE09WHtOD/YEW0zLCOlSb74pw
twIDAQAB
-----END PUBLIC KEY-----
```

3. 运行 Navicat 会弹出一个对话框，**点击“注册”**

4. 到了这步，**记得一定要断网**。然后输入序列号(中文版 64 位密钥序列号： `NAVH-T4PX-WT8W-QBL5`)，点击激活

5. 因为断了网，所以激活失败，这时 Navicat 会弹出一个对话框，**选择手动激活**，这时 Navicat 会再弹出一个消息框，消息框中会出现一个**请求码**如下图所示：
   ![alt text](./imgnavicat/image2.png)

6. 现在可以恢复网络连接了，打开这个[Rsa 在线加解密](http://tool.chacuo.net/cryptrsaprikey)

7. 复制下面的私钥到[Rsa 在线加解密网址](http://tool.chacuo.net/cryptrsaprikey)： http://tool.chacuo.net/cryptrsaprikey

```bash 私钥
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9zyN20jjLryu8
W9FQsJiGmuJ4kg1t46TNQGhBVGXajZU0TmpbL2U2ZLut4J8LCqr9hClsofZ0euGI
gK+I2IwMpEvDU0f58YPON7eoIeby0bkQdlBJPKoN7usjxQM3Vbe+TbxKfDP3tdD6
2hV+IDfjMY1tZiwqYQGPFdHnTZkvB/agLHrjMVks0l65vRRWtkws5NKcKU8dPRx8
W9F3McGoMbHwq45SAoHO4/KtRjAXy3lvJd3FbA85o1C79qgR5xlfTBvG+7TouYrF
8nqRpQSGh73O0fhdA1ynEXrw7dnsE2yK2QMTNXwbjS3+4ugTT1Ye04P9gRbTMsI6
VJvvinC3AgMBAAECggEADMCE3m/DNxP+uTnl9yjWJnzzaCxP0KkxokSIfJMiAKvw
cUIvbQ7jGuNrpIPpy4Ec+clOSykaeLrkuhoDMQtzZUoIeQf4Vvd95nXh1d7pODkU
2OFKBZGYzzTVAWM0ExykKpnoY4yypRrG/oN2XDHn71Cd8tKhdvtrcmSB5KtW9kzS
CE3NJrAQ4ABbK5O7+9zaUfsKzhDTjFIu1XX2NYvZQOEP+6z69cA1tg5O1KiPkJT/
QdHemXhc+PvIbp0txhtX9NWJahz7wmpWoRluCAk7xR+bFFLFiCyhT9TV4Plg8nWW
6vtKPy6UPzs7nZW6EKxcR4vIMEOrycdzEoslAqA90QKBgQDiyUpWrN2TsMjcbuRN
y0YVg6f6jWdmt1MNWjpt0MTgtdU5dROYWJxSM3z+RF4q9+1gDBQ7lnPgzDeK5b9U
ArQJRgDkT2kV0QXlyY6Tu7KAk9rhfJyeJRIAp8dZWF8uRPb91xuhhX7NYnniIu4m
WN3XPzBcwRjDK3OIiHRRLXnDiQKBgQDWQnS/43ZGcKC6Dfo7m7pGqO0G+Nv6Wv/L
l8ORJVioKFtfurz136HfAaxTLvlVWjWrru/i/gQTI3p1Zy/r9+Cr97eUSEevABcf
hi8K+RuiGl1Pcl6kS3gaywLdo4f9Ho/hf+xJ3L0rZAsqUl8tYmQvDMCHzrOPSHAp
H+05vFpCPwKBgFyOYFuNg4TyQpfMXjrtujWvnM/iBBBkw22QpIYLDT7UlygzAwNL
LslRoDK5vmD0/JkVdPB4z+QwFH8IkxR7YfTi8Bw92JqBy1Fj+F+M3CYjsdITJGxa
nsVLtE1fhsEAfnlM4EcEj6LNDQdg0CcwX6GodVl1qWCGDEntvuMelzJZAoGBAK4N
yHgFmRR59CeQqUH5LOav3fV2/oSvnfLPM8DafN4GAsyOj2iRphbabhoZI9Vxdf4l
G5zjy32cqaNsEuL3N92bW9eqrAj+4snqIJcibI9QKZMbjsSaxlPFrWtNqHA4fpuq
ZtJN7qKsH+HejpD4x/fsvQ7WHMn+B5dw5y6q0wvTAoGARyJjwklaCLJ09+pWlX+d
5ygIH+psQ1PuZ/avkBViUUQb1HhhBfdzm88Wo5eSlh+1dAsFIZrOQlwQgzyLocPZ
YIsKLcrR0RAepLL9wCEgtuPACr2RGBr6Aanzzaa7fiMuZbnS9lGCus/w0p95iSD/
QbBGDdt5W9nzPaIStoLLSDM=
-----END PRIVATE KEY-----
```

8. 然后把私钥放在这个网站的第一个框，之前获得的请求码放在第二个框，点解密
   ![alt text](./imgnavicat/image3.png)

9. 解密成功得到一段 JSON 字符串，需要里面的`K`和`DI`加上时间戳`T`，[在线获取当前时间戳](https://unixtime.51240.com/)：https://unixtime.51240.com/

```json
{ "K": "你的K值", "N": "52pojie", "O": "52pojie.cn", "DI": "你的DI值", "T": 你的时间戳 }
```

10. 把刚刚获得的三个字段替换到上面的 JSON 里，时间戳是数字记得不要加双引号，构造新的 JSON 字符串。
11. 把新的 JSON 字符串放入刚才打开的 RSA 在线加解密的网站中的第二个框（替换之前的请求码），第一个框不动（还是之前的私钥），点击 RSA 私钥加密，这个加密的字符串就是激活码。
12. 把激活码放在刚才 Navicat 弹窗中的激活码一栏，点击激活
