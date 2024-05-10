---
customLabelArray: [1]
---

# <Label :level='1'/> mysql 数据库遇到的问题

## 日常操作

```bash
# 查看node进程
ps aux | grep node
# 杀死进程
kill [pid]
```

```sql

```

## mysql 报错

### Incorrect string value: '\xE5\xBE\xAE\xE4\xBF\xA1...' for column 'nickName' at row 1"

这个错误通常发生在 MySQL 数据库中，意味着你尝试将一个不符合当前列字符集的字符串值插入到数据库表的某个列中。在这个例子中，nickName 列可能是用来存储用户昵称的，而提供的值中包含了中文字符（如“\xE5\xBE\xAE\xE4\xBF\xA1”代表“邮件”），但是数据库的字符集设置可能不支持中文字符，通常是 UTF-8 字符集

```bash
# 为现有数据库设置UTF-8编码
ALTER DATABASE your_database_name CHARACTER SET utf8 COLLATE utf8_general_ci;
# 转换现有表
ALTER TABLE your_table_name CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
```

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
