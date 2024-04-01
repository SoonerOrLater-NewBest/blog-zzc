---
customLabelArray: [1]
---

# <Label :level='1'/>前端 ESLint 工作流（2020 手把手版）

## 从零构建前端 Lint 工作流

- `eslint prettier stylelint husky lint-staged typescript eslint-config-alloy` 为构建项目代码质量保驾护航。
- 传承 ESLint 推崇的插件化、配置化的理念，满足个性化需求（即让专业的工具做擅长的事）因此，各位可以选择自己需要的功能进行集成。

### 选择性阅读

- 新手建议从头开始，都是手把手，按步骤配置一遍
- 有 ESLint 使用经验的，直接上 [AlloyTeam 配置](#推荐使用-alloyteam-的配置)
- 让 ESLint 检查 [TypeScript](#配合-typescript)
- [VSCode 集成 ESLint 检查](#vscode-集成-eslint-检查) => 自动提示/修复错误
- [结合 Prettier](#结合-prettier-使用) => 格式化文件
- [继续集成 Stylelint](#继续集成-stylelint) => 检查样式
- 本地 Lint 已构建，缺少 [Git 提交代码预检](#git-代码预检)

## 什么是代码检查

- 代码检查主要是用来发现代码错误、统一代码风格。
- 在 JavaScript 项目中，我们一般使用 ESLint 来进行代码检查，它通过插件化的特性极大的丰富了适用范围，搭配 typescript-eslint 之后，甚至可以用来检查 TypeScript 代码。

## 配置 ESLint

### 小试牛刀

1. 新建一个文件夹，打开命令行，`npm init -y`创建`package.json`
2. 安装依赖`npm install --save-dev eslint babel-eslint eslint-config-alloy`
3. 在项目根目录下创建一个`.eslintrc.js` 或 `.eslintrc.json`的配置文件：

```js
// .eslintrc.js
module.exports = {
  extends: ['alloy']
};
```

4. 在项目根目录下创建一个`index.js`，复制下面内容：

```js
var myName = 'Tom';
console.log(`My name is ${myNane}`);
```

5. 在命令行输入`npx eslint index.js`

```js
// eslint 报错信息：
✖ 2 problems (2 errors, 0 warnings)
error  Unexpected var, use let or const instead  no-var
error  'myNane' is not defined                   no-undef
```

6. 使用`npx eslint index.js --fix`自动修复某些规则

```js
// 这时 var 变成了 let
// 还剩下一个无法自动修复的错误
✖ 1 problem (1 error, 0 warnings)
error  'myNane' is not defined  no-undef
```

### 配合 TypeScript

1. 由于 ESLint 默认使用 Espree 进行语法解析，无法识别 TypeScript 的一些语法，故我们需要安装 @typescript-eslint/parser，替代掉默认的解析器，别忘了同时安装 typescript：

```js
npm install --save-dev typescript @typescript-eslint/parser
```

2. 接下来需要安装对应的插件 @typescript-eslint/eslint-plugin 它作为 eslint 默认规则的补充，提供了一些额外的适用于 ts 语法的规则。

```js
npm install --save-dev @typescript-eslint/eslint-plugin
```

3. 修改配置文件

```js
module.exports = {
  extends: ['alloy'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // 禁止使用 var
    'no-var': 'error',
    // 优先使用 interface 而不是 type
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface']
  }
};
```

- 以上配置中，我们自定义了两个规则，其中`no-var`是 ESLint 原生的规则（我们刚刚已经用到了这个规则，它被包含在`alloy`中，此处会覆盖），@typescript-eslint/consistent-type-definitions 是 @typescript-eslint/eslint-plugin 新增的规则
- 规则的取值一般是一个数组（上例中的 @typescript-eslint/consistent-type-definitions），其中第一项是 off、warn 或 error 中的一个，表示关闭、警告和报错。后面的项都是该规则的其他配置。
- 如果没有其他配置的话，则可以将规则的取值简写为数组中的第一项（上例中的 no-var）。
  > warning 关闭、警告和报错的含义如下：
- 关闭：禁用此规则
- 警告：代码检查时输出错误信息，但是不会影响到 exit code
- 报错：发现错误时，不仅会输出错误信息，而且 exit code 将被设为 1（一般 exit code 不为 0 则表示执行出现错误）

4. 新建`index.ts`文件：

```ts
var myName = 'Tom';
console.log(`My name is ${myNane}`);
console.log(`My name is ${myName.toStrng()}`);
type Foo = {};
```

5. 在命令行输入`npx eslint index.ts`，如下可以看到报错信息以及可修复项

```js
  1:1   error  Unexpected var, use let or const instead  no-var
  2:27  error  'myNane' is not defined                   no-undef
  4:6   error  Use an `interface` instead of a `type`    @typescript-eslint/consistent-type-definitions

✖ 3 problems (3 errors, 0 warnings)
  2 errors and 0 warnings potentially fixable with the `--fix` option.
```

### 脚本命令检查整个项目

1. 根目录新建一个 src 文件夹，将我们的`index.js`和`index.ts`放进去
2. 在`package.json`中的`scripts`新增：

```js
{
    "scripts": {
        // 因为eslint不是全局安装的，所以要使用npx
        "lint": "npx eslint src --ext .js,.ts,tsx"
        // eslint 默认不会检查 .ts 后缀的文件，所以需要加上参数 --ext .ts
    }
}
```

3. 然后`npm run lint`就可以看到 src 下所有指定后缀文件的报错信息

### 推荐使用 AlloyTeam 的配置

- 上面手把手完成了`ESLint`的配置过程
- 有一定经验的推荐直接使用`AlloyTeam`实现可自定义拓展的`ESLint`规则
- [AlloyTeam/eslint-config-alloy](https://github.com/AlloyTeam/eslint-config-alloy/blob/master/README.zh-CN.md)已经帮我们集成了各种技术栈

1. 安装技术栈相关依赖

```js
// Eslint
npm install --save-dev eslint babel-eslint eslint-config-alloy
// React
npm install --save-dev eslint babel-eslint eslint-plugin-react eslint-config-alloy
// Vue
npm install --save-dev eslint babel-eslint vue-eslint-parser eslint-plugin-vue eslint-config-alloy
// TypeScript
npm install --save-dev eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-alloy
// TypeScript React
npm install --save-dev eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-config-alloy
```

2. 配置`.eslintrc.js`文件

```js
/* .eslintrc.js */
module.exports = {
  extends: [
    'alloy', // 都需要
    'alloy/vue', //vue项目需要
    'alloy/react', //react项目需要
    'alloy/typescript' //ts项目需要
  ],
  env: {
    // 你的环境变量（包含多个预定义的全局变量）
    //
    // browser: true,
    // node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // 你的全局变量（设置为 false 表示它不允许被重新赋值）
    //
    // myGlobal: false
  },
  rules: {
    // 自定义你的规则
  }
};
```

3. 接下来就可以直接用`eslint`命令检查文件了
4. 这样就引入了 alloy 团队的 lint 规则了，然后可以用 rules 覆盖你不爽的规则，直接采用开源规则是为了避免重复造轮子，你也可以选择别的团队，或者自己定义一套

## VSCode 集成 ESLint 检查

> 在编辑器中集成 ESLint 检查，可以在开发过程中就发现错误，甚至可以在保存时自动修复错误，极大的增加了开发效率

1. 先安装 ESLint 插件，打开 VSCode 点击「扩展」按钮，搜索 ESLint，然后安装即可
2. 在「文件 => 首选项 => 设置 => 工作区」中（也可以在项目根目录下创建一个配置文件 `.vscode/settings.json`），添加以下配置：

```json
{
  // VSCode 中的 ESLint 插件默认是不会检查 `.vue`、`.ts` 或 `.tsx` 后缀的
  "eslint.validate": ["javascript", "javascriptreact", "vue", "typescript", "typescriptreact"],
  // 开启保存时自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  // 指定VSCode用于IntelliSense（智能感知）的ts版本，将内置版本更换为工作区版本
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## 结合 Prettier 使用

> Prettier 是一个代码格式化工具，相比于 ESLint 中的代码格式规则，它提供了更少的选项，但是却更加专业。
> AlloyTeam 推荐用 Prettier 管理格式化相关的规则，用 ESLint 来检查它更擅长的逻辑错误。

### 配置 Prettier

1. 安装 Prettier

```js
npm install --save-dev prettier
```

2.  配置 `.prettierrc.js` 仅供参考：

```js
// .prettierrc.js
module.exports = {
  // 一行最多 100 字符
  printWidth: 100,
  // 使用 4 个空格缩进
  tabWidth: 4,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾不需要逗号
  trailingComma: 'none',
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // 换行符使用 lf
  endOfLine: 'lf'
};
```

### VSCode 集成 Prettier

1. 在`.vscode/settings.json`中添加配置：

```json
{
  // 保存时自动格式化所有支持文件 javascript/javascriptreact/typescript/typescriptreact/json/graphql
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

2. 这时我们保存文件的时候，已经可以自动格式化了
3. 也可以指定格式化文件类型：

```js
{
    // Set the default
    "editor.formatOnSave": false,
    // Enable per-language
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true
    }
}
```

## 继续集成 Stylelint

> 顾名思义，`Stylelint`帮我们解决类 css 文件样式问题

### stylelint 规则分为三个类别

- Possible errors： 可以使用 stylelint-config-recommended 启用这些规则
- Stylistic issues： stylelint-config-standard 拓展了 Possible errors，并启用此类的规则
- Limit language features： 其他规则，如果有需要，可以在 rules 里面配置
- [详尽的配置规则](https://ask.dcloud.net.cn/article/36067)

### Stylelint 配置

1. 安装依赖

```js
npm install --save-dev stylelint stylelint-config-standard stylelint-order
```

2. 在项目根目录中创建一个`.stylelintrc.js`配置文件：

```js
module.exports = {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order'],
  rules: {
    // ...
  }
};
```

- `stylelint-config-standard`是`stylelint`的推荐配置
- [`stylelint-order`](https://github.com/hudochenkov/stylelint-order)是 css 属性排序插件

3. `npx stylelint "**/*.css"` 尝试检查 css 文件

### 支持 SCSS

1. 安装依赖

```js
npm install --save-dev stylelint-config-sass-guidelines stylelint-scss
```

2. 调整`.stylelintrc.js`配置文件：

```js
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-sass-guidelines'],
  plugins: ['stylelint-order', 'stylelint-scss'],
  rules: {
    // ...
  }
};
```

3. [更多配置及插件](https://github.com/stylelint/awesome-stylelint)
4. [忽略代码，禁用规则](https://stylelint.io/user-guide/ignore-code)

### VSCode 集成 Stylelint

1. 在`.vscode/settings.json`中添加配置：

```json
{
  "editor.codeActionsOnSave": {
    // 开启保存自动修复所有stylelint可修复的选项
    "source.fixAll.stylelint": true
  }
}
```

2. 这时我们保存文件的时候，`Stylelint`已经可以自动修复，但是我们上面让`Prettier`负责了所有文件的格式化，因此可能会导致冲突，倒腾了好久`VSCode`配置项，效果并不好，比如去除了 css 等文件的格式化，到`.vue`内联`<style>`依然有问题：

```json
{
  // 去除其他插件
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  // 编辑器格式化全部交给 Prettiern 配置
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  // 针对某种语言，配置替代编辑器设置，取消自动保存格式化
  "[css]": {
    "editor.formatOnSave": false
  },
  "[less]": {
    "editor.formatOnSave": false
  },
  "[scss]": {
    "editor.formatOnSave": false
  }
}
```

3. 如上还是会有问题，换个思路，让`Stylelint`禁用所有与`Prettiern`有关的规则，很符合我们整篇文章「各司其职」的思想
4. 安装依赖`npm install --save-dev stylelint-config-prettier`
5. 调整`.stylelintrc.js`配置文件：

```js
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-sass-guidelines',
    'stylelint-config-prettier'
  ],
  plugins: ['stylelint-order', 'stylelint-scss'],
  rules: {
    // ...
  }
};
```

6. 至此，我们让`Prettiern`负责格式化，让`Stylelint`检查样式，让`ESLint`检查语法逻辑，完成了整个前端 Lint 工作流

## Git 代码预检

- 上面我们配置了`ESLint、Prettier、Stylelint`集成了 VSCode 插件，实现了错误提示和保存自动修复
- 然而自动修复的只是小部分，如果团队成员不按规范，依然可以将不规范的代码推送至远程代码库
- 我们通过 Git 代码预检，一定程度防止不规范的代码被提交

### 实现过程

1. 待提交的代码
2. git add 添加到暂存区
3. 执行 git commit（这时进行代码预检）
4. husky 注册在 git pre-commit 的钩子调起 lint-staged
5. lint-staged 取得所有被提交的文件依次执行写好的任务
6. 如果有错误（没通过 ESlint 检查）则停止任务，等待下次 commit，同时打印错误信息
7. 成功提交后，git push 推送到远程库

### 什么是 git hook

- `git hook`就是.git 文件夹的 hooks 下的一些钩子函数，特定时机他们将被调用
- 查看所有 git 钩子函数：

```js
cd .git/hooks
ls -l
// 打印如下：
total 96
-rwxr-xr-x  1 zzc  staff   478 10 21  2019 applypatch-msg.sample
-rwxr-xr-x  1 zzc  staff   896 10 21  2019 commit-msg.sample
-rwxr-xr-x  1 zzc  staff  3327 10 21  2019 fsmonitor-watchman.sample
-rwxr-xr-x  1 zzc  staff   189 10 21  2019 post-update.sample
-rwxr-xr-x  1 zzc  staff   424 10 21  2019 pre-applypatch.sample
-rwxr-xr-x  1 zzc  staff  1638 10 21  2019 pre-commit.sample
-rwxr-xr-x  1 zzc  staff  1348 10 21  2019 pre-push.sample
-rwxr-xr-x  1 zzc  staff  4898 10 21  2019 pre-rebase.sample
-rwxr-xr-x  1 zzc  staff   544 10 21  2019 pre-receive.sample
-rwxr-xr-x  1 zzc  staff  1492 10 21  2019 prepare-commit-msg.sample
-rwxr-xr-x  1 zzc  staff  3610 10 21  2019 update.sample
```

- `.sample`为各个钩子的案例脚本，可以把 sample 去掉，直接编写 shell 脚本来执行。
- 而前端可以用插件 husky 与 pre-commit，来使钩子生效。

### husky 注册 git hook

> Requires Node >= 10 and Git >= 2.13.0.

- `husky`新老版本的配置方式和使用变化较大，老版本请自行升级，详见 [husky](https://github.com/typicode/husky)

1. 安装 husky

```js
npm install husky --save-dev
```

2. 编辑 `package.json` 文件：

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "eslint src/**/*.js"
    }
  }
}
```

3. 尝试 `git commit` 提交，就会先执行`eslint src/**/*.js`，代码没有问题才会被真正提交
4. 这样每次提交代码，`eslint`都会检查所有文件，如果报错过多，一定会崩溃

### lint-staged 只 Lint 改动代码

> lint-staged requires Node.js version 10.13.0 or later.

- v10.0.0 以后对原始暂存文件的任何新修改都将自动添加到提交中。如果您的任务以前包含一个 git add 步骤，请删除此步骤，同时运行多个 git 操作通常会导致错误，详见 [lint-staged](https://github.com/okonet/lint-staged)

1. 安装 lint-staged

```js
npm install lint-staged --save-dev
```

2. 新增 `package.json` 配置：

```json
{
  "lint-staged": {
    "src/**/*.js": "eslint"
  }
}
```

3. 如此`husky`只负责注册`git hook`，后续操作交给`lint-staged`，只对改动的文件执行任务，而且可以很方便
   地配置多条命令：

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.js": ["eslint --fix", "prettier --write"]
  }
}
```

4. 如上，我们提交代码之前，程序会自动修复`eslint`配置，格式化`prettier`配置

## 几点建议

- 建议代码提交只做检查和测试，拦截问题代码比较好，还是在保存时，自动修复`eslint、prettier`配置，而且大部分还需要手动修复才行
- 实在紧急，也可通过`git commit -m -n "跳过代码代码预检"`跳过检查，慎用
- 和构建有关的包建议使用`--save-dev`安装在项目内部
- 老版本`husky lint-staged`配置都放在`package.json`中，现在`eslint prettier husky lint-staged`都支持多种后缀配置文件，建议采用`.js`统一格式，也方便拓展：

### 统一配置文件格式

```js
// .eslintrc.js
module.exports = {
  extends: ['alloy']
};
// .prettierrc.js
module.exports = {
  // 一行最多 100 字符
  printWidth: 100,
  // 使用 4 个空格缩进
  tabWidth: 4
  // ...
};
// .huskyrc.js
module.exports = {
  hooks: {
    'pre-commit': 'lint-staged'
  }
};
// .lintstagedrc.js
module.exports = {
  'src/**/*.{js,ts}': 'eslint'
};
// .stylelintrc.js
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-sass-guidelines',
    'stylelint-config-prettier'
  ],
  plugins: ['stylelint-order', 'stylelint-scss'],
  rules: {
    // indentation: [2, { baseIndentLevel: 1 }]
  }
};
```

### 拓展示例

- `.huskyrc.js`

```js
// 数组方式配置多条命令
const tasks = (arr) => arr.join(' && ');
module.exports = {
  hooks: {
    'pre-commit': tasks(['npm run lint', 'npm test'])
  }
};
```

- `.lintstagedrc.js`

```js
module.exports = {
  // 如果超过10个暂存文件，则在整个存储库上运行eslint
  '**/*.js?(x)': (filenames) =>
    filenames.length > 10 ? 'eslint .' : `eslint ${filenames.join(' ')}`,
  '*.css': 'stylelint',
  '*.scss': 'stylelint --syntax=scss',
  // 对ts文件运行tsc，但不传递任何参数
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit'
};
```
