# Chrome 开发者工具

- [中文文档](https://www.html.cn/doc/chrome-what/)
- [chrome://flags/#block-insecure-private-network-requests](https://blog.csdn.net/ababab12345/article/details/120684986)

- 查看谷歌版本及安装信息等 chrome://version/

### MacBook 打包谷歌扩展程序

1. 打开网址 chrome://version/ 查看插件安装位置：
   个人资料路径 /Users/fanfan/Library/Application Support/Google/Chrome/Default

2. 打开 chrome://extensions/ 扩展程序
   记录相应的 ID，版本号
   例如：ID：oof\***\*\*\*\***dp

3. 打开命令行工具，进入扩展程序列表目录
   cd ~/Library/Application/Support/Google/Chrome/Default/Extensions/

4. 选择要打包的扩展程序目录 （根据扩展程序 id 选择）
   即第二步中的 ID：
   cd oof\***\*\*\*\***dp
   cd 版本号

5. pwd 命令打印目录路径，拷贝出来备用

6. 点击 2 中扩展程序中的详情，点击上方打包扩展程序，在弹窗中，扩展程序根目录，输入 5 的路径，点击打包扩展程序 按钮

7. command+空格键,输入 1 的路径/ID/版本号（ID：为扩展程序的 ID，版本号，需要自己去文件查看）即可看到打包完成的插件包
