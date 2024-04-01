---
customLabelArray: [1]
---

# <Label :level='1'/> 云服务器自建部署流程

> 趁着[优惠活动](https://www.aliyun.com/minisite/goods?userCode=jfhdn89k)，买了个阿里云乞丐版云服务器，主要用来折腾学习，并为个人小程序公众号提供少量接口需求，配置如下：

![云服务器](./image.png)

- 系统记得选： **CentOS 7.9 64 位 UEFI 版**
- 省流：Nginx+NodeJS+Python+Mysql

### 安装 Nginx

1. 运行以下命令安装 Nginx

```bash
yum -y install nginx
```

2. 运行以下命令查看 Nginx 版本

```bash
nginx -v
```

3. 返回结果如下所示，表示 Nginx 安装成功

```bash
nginx version: nginx/1.20.1
```

### 安装 NVM

node 版本管理器

1. 执行下面 bash

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

2. 然后`source .bashrc`
3. 查询版本`nvm -v`
4. 环境变量`.bash_profile`也写一份，下次启动命令行就不用 source 了

```bash
vi .bash_profile #编辑文件
i #插入
source .bashrc #放到最后一行
esc #退出插入
:wq #退出并保存文件
```

### 安装 NodeJS

1. 可以多安装几个版本，这也是安装 nvm 的目的

```bash
nvm install 14 #安装node@14
nvm install 18 #安装node@18
nvm install stable #安装node最新稳定版
```

2. 查询版本`node -v`，出现版本就安装成功
3. 切换版本`nvm use xx`，查询版本列表`nvm ls`

### 安装 Git

1. 先安装 git

```bash
yum -y install git
```

2. 查询版本`git --verison`，出现版本就安装成功
3. 使用 git 需要配置 ssh 密钥，还要注册 github，详见[Git 快速上手](../../technology-stack/tools/git-quick-start)

### 安装 pyenv

python 版本管理器

1. 执行 bash 安装 pyenv

```bash
curl https://pyenv.run | bash
```

2. 添加 pyenv 的环境变量

```bash
vi .bashrc #编辑文件
i #插入
#粘贴下面3句放到末尾
export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"
esc #退出插入
:wq #退出并保存文件
source .bashrc
```

3. 查询版本`pyenv -v`，出现版本就安装成功

### 安装 python

1. 安装 python3 之前，要先安装相关依赖包和编译环境

```bash
yum -y install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel gcc libffi-devel
```

- zlib-devel：提供对 zlib 压缩库的支持。
- bzip2-devel：提供对 bzip2 压缩库的支持。
- openssl-devel：提供对 OpenSSL 加密库的支持。
- ncurses-devel：提供对 ncurses 库的支持，用于处理终端屏幕输出。
- sqlite-devel：提供对 SQLite 数据库的支持。
- readline-devel：提供对 readline 库的支持，用于提供命令行编辑和历史记录功能。
- tk-devel：提供对 Tk 图形库的支持，用于构建 Python 图形界面应用程序。
- gdbm-devel：提供对 GDBM（GNU 数据库管理系统）的支持。
- db4-devel：提供对 Berkeley DB（数据库）的支持。
- libpcap-devel：提供对 libpcap（网络数据包捕获库）的支持。
- xz-devel：提供对 XZ 压缩库的支持。
- gcc：GNU 编译器集合，用于编译和构建源代码。
- libffi-devel：提供对 libffi 库的开发支持。

2. OpenSSL 有点问题，再装一下，然后用 pyenv 装个 3.10.6

```bash
yum swap openssl-devel openssl11-devel
pyenv install 3.10.6
```

3. 如果出现`ERROR: The Python ssl extension was not compiled. Missing the OpenSSL lib?`

```bash
CPPFLAGS="$(pkg-config --cflags openssl11)" \
LDFLAGS="$(pkg-config --libs openssl11)" \
pyenv install -v 3.10.6
```

- pyenv 安装速度有点慢，一直超时的话也可以切换镜像源，如下

```bash
vi .bashrc #编辑文件
i #插入
export PYENV_PYTHON_BUILD_MIRRORS="https://pypi.python.org/simple,https://jedore.netlify.app/tools/python-mirrors/"
esc #退出插入
:wq #退出并保存文件
source .bashrc
```

- pyenv 还有其他报错的话，可以去这个网站查一下[pyenv/wiki/Common-build-problems](https://github.com/pyenv/pyenv/wiki/Common-build-problems#error-the-python-ssl-extension-was-not-compiled-missing-the-openssl-lib)

4. 很遗憾我到这还是报错，于是我准备升级 OpenSSL 到 3.0.2

- 安装 Perl-CPAN 模块

```bash
# 安装perl-CPAN
yum install -y perl-CPAN
# 执行模块
perl -MCPAN -e shell
```

- 所有提示的选项都默认回车即可，直到出现提示符“cpan[1]>”，则执行如下命令

```bash
# 安装IPC/Cmd.pm（注意提示符：cpan[1]> 下执行）
install IPC/Cmd.pm
# 执行完成后，出现提示符 cpan[2]>时，执行如下
quit
```

- 下载 OpenSSL 源码

```bash
# 在线下载3.0.2版本
wget https://www.openssl.org/source/openssl-3.0.2.tar.gz
```

- 编译安装

```bash
# 解压
tar -zxvf openssl-3.0.2.tar.gz
# 进入解压后目录
cd openssl-3.0.2
# 配置
./config --prefix=/usr/local/openssl-3.0.2 shared zlib
# 设置主机CPU核心数
make -j2
# 安装
make install
```

- 设置环境变量

```bash
# 查询动态库名称
openssl version -a
# 查找动态库位置
find / -name libssl.so.3

# 设置环境变量
touch /etc/profile.d/openssl.sh
chmod 777 /etc/profile.d/openssl.sh
echo -e '\nexport PATH=/usr/local/openssl-3.0.2/bin:$PATH\n' >> /etc/profile.d/openssl.sh
source /etc/profile.d/openssl.sh

#设置头文件
ln -sv /usr/local/openssl-3.0.2/include/openssl /usr/include/openssl

#设置库文件
touch /etc/ld.so.conf.d/openssl.conf
chmod 777 /etc/ld.so.conf.d/openssl.conf
echo -e "/usr/local/openssl-3.0.2/lib64" >> /etc/ld.so.conf.d/openssl.conf

#加载动态连接库
ldconfig -v
ldconfig -p |grep openssl
```

- 显示版本号

```bash
openssl version -a
```

- 然后重新执行第三步，记得三句一起，别把\漏了

5. 设置版本，再配合 venv 使用，相当干净方便快捷

```bash
pyenv global 3.10.6 #全局设置
pyenv local  3.10.6  #local 本地设置 只影响所在文件夹
```

### 安装 MySQL

1. 运行以下命令更新 YUM 源

```bash
rpm -Uvh  http://dev.mysql.com/get/mysql57-community-release-el7-9.noarch.rpm
```

2. 运行以下命令安装 MySQL

```bash
yum -y install mysql-community-server --nogpgcheck
```

3. 运行`mysql -V`查看 MySQL 版本号

- 返回结果如下所示，表示 MySQL 安装成功

```bash
mysql  Ver 14.14 Distrib 5.7.36, for Linux (x86_64) using  EditLine wrapper
```

4. 启动 MySQL

```bash
systemctl start mysqld
#设置开机启动MySQL
systemctl enable mysqld
systemctl daemon-reload
```

### 结束

web 服务需要的环境基本是装好了，接下来就是使用了
