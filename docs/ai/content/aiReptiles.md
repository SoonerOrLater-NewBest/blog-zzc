---
customLabelArray: [1]
---

# <Label :level='1'/>AI 实战｜和 chatgpt 聊聊天就把网络爬虫做好了

先看结果，再看主流程，最后说细节，还不会可私信，保证有手就行

## 执行结果

- 控制台打印如下：
  ![alt text](./pachongImg/image.png)
- 表格文件输出：
  ![alt text](./pachongImg/image-1.png)

![alt text](./pachongImg/image-2.png)

## 流程也很简单

1. 确定需要了解的信息和网站，或者直接按我的例子玩一遍先
   ![alt text](./pachongImg/image-3.png)

打开网站，右击->检查，定位到你需要的内容
![alt text](./pachongImg/image-4.png)
然后每个标签独有的属性，你就可以用来当作它的身份标识，然后像你平时鼠标怎么点的，就怎么组织语言，让 AI 帮你写代码

2. 让 chatgpt 写爬虫脚本，仔细看我下面的例子，依葫芦画瓢

```markdown
你是一个 nodejs 编程专家，要用 puppeteer 完成一个爬取网页内容的 node 脚本，具体步骤如下：

在当前文件夹下新建一个 Excel 文件：最新日漫.xlsx

打开网页：https://www.857yhdm.com/type/ribendongman.html

循环定位前 20 个 class="myui-vodlist\_\_box"的 div 标签；

在每个 div 标签循环事件中按以下步骤执行：

1. 定位 div 标签里面的 h4 标签，将 title 属性值，写入“最新日漫.xlsx”这个 Excel 文件的第 1 列，列的标头为：标题；
2. 定位第一个 a 标签，把 data-original 属性值，写入“最新日漫.xlsx”这个 Excel 文件的第 2 列，列的标头为：缩略图；
3. 定位 class="pic-text text-right"的 span 标签，提取其文本内容作为更新状态，写入“最新日漫.xlsx”这个 Excel 文件的第 3 列，列的标头为：更新状态；
4. 点击这个 a 标签，进入详情页；
5. 在详情页中定位 class="myui-content\_\_list sort-list clearfix"的 ul 标签，循环提取其中最后一个 a 标签的 href 属性值，前面加上"https://www.857yhdm.com",构造成一个URL数组，写入”最新日漫.xlsx”这个Excel文件的第4列，列的标头为：最新一集播放链接；

## 规则：

1. 每一步都要输出相关信息到屏幕；
2. 注意处理反爬虫机制：

- 设置用户代理和请求头
- 使用 waitForTimeout 随机延迟请求，模拟人为操作
```

3. 看 AI 帮我们写的代码
   ![alt text](./pachongImg/image-5.png)
4. 完整代码，我也放在这，注释也很详细

```js
const puppeteer = require('puppeteer');
const XLSX = require('xlsx');

(async () => {
  // 创建一个新的 Excel 工作簿和工作表
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([['标题', '缩略图', '更新状态', '最新一集播放链接']]);
  XLSX.utils.book_append_sheet(workbook, worksheet, '最新日漫');

  // 启动 Puppeteer 浏览器
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // 设置用户代理和请求头来模拟真实用户
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36'
  );
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'zh-CN,zh;q=0.9'
  });

  // 打开目标网页
  console.log('打开网页：https://www.857yhdm.com/type/ribendongman.html');
  await page.goto('https://www.857yhdm.com/type/ribendongman.html', { waitUntil: 'networkidle2' });

  // 获取前 20 个 class="myui-vodlist__box" 的 div 标签
  const animeList = await page.$$eval('.myui-vodlist__box', (boxes) => {
    return boxes.slice(0, 20).map((box) => {
      const titleElement = box.querySelector('h4 a');
      const imgElement = box.querySelector('a[data-original]');
      const statusElement = box.querySelector('.pic-text.text-right');
      return {
        title: titleElement ? titleElement.getAttribute('title') : '',
        thumbnail: imgElement ? imgElement.getAttribute('data-original') : '',
        updateStatus: statusElement ? statusElement.innerText : '',
        detailUrl: titleElement ? titleElement.href : ''
      };
    });
  });

  // 循环处理每个动漫
  for (let i = 0; i < animeList.length; i++) {
    const anime = animeList[i];
    console.log(`处理第 ${i + 1} 个: ${anime.title}`);

    // 打开详情页
    await page.goto(anime.detailUrl, { waitUntil: 'networkidle2' });

    // 获取最新一集播放链接
    const latestEpisodeLink = await page.$$eval(
      '.myui-content__list.sort-list.clearfix a',
      (links) => {
        const latestLink = links[links.length - 1];
        return latestLink ? `https://www.857yhdm.com${latestLink.getAttribute('href')}` : '';
      }
    );

    // 写入Excel
    const row = {
      标题: anime.title,
      缩略图: anime.thumbnail,
      更新状态: anime.updateStatus,
      最新一集播放链接: latestEpisodeLink
    };
    console.log(`Excel 数据: ${JSON.stringify(row)}`);

    XLSX.utils.sheet_add_json(worksheet, [row], {
      skipHeader: true,
      origin: -1
    });

    // 随机延迟请求，模拟人为操作
    await page.waitForTimeout(Math.floor(Math.random() * 3000) + 1000);
  }

  // 保存Excel文件
  XLSX.writeFile(workbook, '最新日漫.xlsx');
  console.log('Excel文件已保存');

  await browser.close();
})();
```

5. 后面 chatgpt 还贴心的写了代码解释
   ![alt text](./pachongImg/image-6.png)

## 为什么我选择了 node 而不是 python

因为 node 安装更简单，还有 puppeteer 这个库其实就是谷歌浏览器，可以完全按照你平时的操作来模拟，所以你只要会用语言表达怎么用鼠标操作的就行

## 安装执行

node 可以直接官网一键安装，也可以看我之前写的，里面有

1. 然后创建一个 node 项目，或者直接创建个`script.js`文件，把上面的完整代码或者你自己让 ai 写的代码复制进去
2. 记得安装下面 2 个主要的库，会创建 node 项目的不要全局安装，不会的就`-g`

```bash
npm install -g puppeteer xlsx
```

3. 打开 cmd 命令行，输入`node script.js`，就能获得我最开始的效果了

## 注意事项

1. 不要做违法的事情
2. 仔细看我的示例，记得都限制一下获取数据的数量，我一开始获取全部链接的时候，当找到海贼王，上千集的 url 直接让表格文件报错了，如果你遇到报错，你可以直接贴给 chatgpt，或者执行时代码有缺陷报错，你贴给他，他会自己优化代码或告诉你解决方法
3. 访问不了 chatgpt 可以用 kimi 等替代
