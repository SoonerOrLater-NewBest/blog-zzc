---
customLabelArray: [1]
---

# <Label :level='1'/> 数据库遇到的问题

## Navicat 连接失败

### 2059-Authentication plugin ‘caching_sha2_password‘ cannot be loaded

- 高版本的 mysql 选择了强加密规则 caching_sha2_password,与之前的 mysql5.7 的 mysql_native_password 规则不同，navicate 驱动目前不支持新加密规则
- 解决方法：切换加密规则

```bash
mysql -uroot -ppassword #登录
use mysql; #选择数据库
# 远程连接请将'localhost'换成'%'
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'; #更改加密方式
FLUSH PRIVILEGES; #刷新权限
```
