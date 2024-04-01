---
customLabelArray: [2, 3]
---

# <Label :level='3'/> 使用 Commitizen 规范检查 Git Commit Message

> 包含以下工具类型：

- 适配器：用于配置 cz 的提交说明
- 校验：校验提交说明是否符合规范
- 日志：根据提交说明的类型快速生成日志

## 规范的 Git 提交说明

- 提供更多的历史信息，方便快速浏览
- 可以过滤某些 commit，便于筛选代码 review
- 可以追踪 commit 生成更新日志
- 可以关联 issues

### 提交说明结构

Git 提交说明可分为三个部分：`Header、Body 和 Footer`

```js
<Header> <Body> <Footer>
```

### Header

包括三个字段 `type（必需）、scope（可选）和 subject（必需）`

```js
<type>(<scope>): <subject>
```

- `type` 用于说明 `commit` 的提交性质

| 值       | 描述                                                                                   |
| -------- | -------------------------------------------------------------------------------------- |
| feat     | 新增一个功能                                                                           |
| fix      | 修复一个 Bug                                                                           |
| docs     | 文档变更                                                                               |
| style    | 代码格式（不影响功能，例如空格、分号等格式修正）                                       |
| refactor | 代码重构                                                                               |
| perf     | 改善性能                                                                               |
| test     | 测试                                                                                   |
| build    | 变更项目构建或外部依赖（例如 scopes: webpack、gulp、npm 等）                           |
| ci       | 更改持续集成软件的配置文件和 package 中的 scripts 命令，例如 scopes: Travis, Circle 等 |
| chore    | 变更构建流程或辅助工具                                                                 |
| revert   | 代码回退                                                                               |

- `scope` 说明 `commit` 影响的范围。
  scope 依据项目而定，例如在业务项目中可以依据菜单或者功能模块划分，如果是组件库开发，则可以依据组件划分。

> 提示：scope 可以省略。

- `subject` 是 `commit` 的简短描述。

### Body

`commit` 的详细描述，说明代码提交的详细说明。

### Footer

如果代码的提交是不兼容变更或关闭缺陷，则 Footer 必需，否则可以省略。

- 不兼容变更：
  当前代码与上一个版本不兼容，则 Footer 以 BREAKING CHANGE 开头，后面是对变动的描述、以及变动的理由和迁移方法。
- 关闭缺陷：
  如果当前提交是针对特定的 issue，那么可以在 Footer 部分填写需要关闭的单个 issue 或一系列 issues。

## Commitizen

[Commitizen](https://github.com/commitizen/cz-cli) 是一个规范 Git 提交说明（Commit Message）的 CLI 工具

全局安装 cz

```bash
npm install -g commitizen
```

## 适配器

### cz-conventional-changelog

如果想使用符合 Angular 规范提交说明的 cz 适配器

```bash
commitizen init cz-conventional-changelog --save --save-exact
```

> 该命令执行`cz-conventional-changelog`依赖安装和在`pacakge.json`中配置`config.commitizen`适配器路径。

执行提交说明命令`git cz`:

![enter image description here](https://raw.githubusercontent.com/ziyi2/cz-example/master/images/cz_1.png)

代码提交后，查看远程提交说明信息：

![enter image description here](https://raw.githubusercontent.com/ziyi2/cz-example/master/images/cz_2.png)

### cz-customizable

如果想定制说明，可以使用该 cz 适配器

```bash
npm install cz-customizable --save-dev
```

该适配器需要手动配置 cz 的适配器路径，在`pacakge.json`中

```json
"config": {
  "commitizen": {
    "path": "node_modules/cz-customizable"
  }
}
```

新增`.cz-config`定制说明的配置文件（以下是一个汉化示例）：

```js
'use strict';

module.exports = {
  types: [
    { value: '特性', name: '特性:    一个新的特性' },
    { value: '修复', name: '修复:    修复一个Bug' },
    { value: '文档', name: '文档:    变更的只有文档' },
    { value: '格式', name: '格式:    空格, 分号等格式修复' },
    { value: '重构', name: '重构:    代码重构，注意和特性、修复区分开' },
    { value: '性能', name: '性能:    提升性能' },
    { value: '测试', name: '测试:    添加一个测试' },
    { value: '工具', name: '工具:    开发工具变动(构建、脚手架工具等)' },
    { value: '回滚', name: '回滚:    代码回退' }
  ],

  scopes: [{ name: '模块1' }, { name: '模块2' }, { name: '模块3' }, { name: '模块4' }],

  // it needs to match the value for field type. Eg.: 'fix'
  /*
  scopeOverrides: {
    fix: [
      {name: 'merge'},
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  },
  */
  // override the messages, defaults are as follows
  messages: {
    type: '选择一种你的提交类型:',
    scope: '选择一个scope (可选):',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change:',
    subject: '短说明:\n',
    body: '长说明，使用"|"换行(可选)：\n',
    breaking: '非兼容性说明 (可选):\n',
    footer: '关联关闭的issue，例如：#31, #34(可选):\n',
    confirmCommit: '确定提交说明?'
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['特性', '修复'],

  // limit subject length
  subjectLimit: 100
};
```

执行提交说明命令`git cz`:

![enter image description here](https://raw.githubusercontent.com/ziyi2/cz-example/master/images/cz_3.png)

![enter image description here](https://raw.githubusercontent.com/ziyi2/cz-example/master/images/cz_4.png)

查看远程提交说明：

![enter image description here](https://raw.githubusercontent.com/ziyi2/cz-example/master/images/cz_5.png)

## 校验

### commitlint

校验提交说明是否符合规范

安装校验工具

```bash
npm install --save-dev @commitlint/cli
```

#### @commitlint/config-conventional

安装符合 Angular 风格的校验规则

```bash
npm install --save-dev @commitlint/config-conventional
```

新建`commitlint.config.js`文件并设置校验规则：

```js
module.exports = {
  extends: ['@commitlint/config-conventional']
};
```

安装 huksy（git 钩子工具）

```bash
npm install husky --save-dev
```

在 package.json 中配置`git commit`提交时的校验钩子：

```json
"husky": {
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}
```

需要注意，使用该校验规则不能对`.cz-config.js`进行不符合 Angular 规范的定制处理，例如之前的汉化，此时需要将`.cz-config.js`的文件按照官方示例文件[cz-config-EXAMPLE.js](https://github.com/leonardoanalista/cz-customizable/blob/master/cz-config-EXAMPLE.js)进行符合 Angular 风格的改动：

```js
'use strict';

module.exports = {
  types: [
    { value: 'feat', name: 'feat:     A new feature' },
    { value: 'fix', name: 'fix:      A bug fix' },
    { value: 'docs', name: 'docs:     Documentation only changes' },
    {
      value: 'style',
      name:
        'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)'
    },
    {
      value: 'refactor',
      name: 'refactor: A code change that neither fixes a bug nor adds a feature'
    },
    { value: 'perf', name: 'perf:     A code change that improves performance' },
    { value: 'test', name: 'test:     Adding missing tests' },
    {
      value: 'chore',
      name:
        'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation'
    },
    { value: 'revert', name: 'revert:   Revert to a commit' },
    { value: 'WIP', name: 'WIP:      Work in progress' }
  ],

  scopes: [{ name: 'accounts' }, { name: 'admin' }, { name: 'exampleScope' }, { name: 'changeMe' }],

  // it needs to match the value for field type. Eg.: 'fix'
  /*
  scopeOverrides: {
    fix: [
      {name: 'merge'},
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  },
  */
  // override the messages, defaults are as follows
  messages: {
    type: "Select the type of change that you're committing:",
    scope: '\nDenote the SCOPE of this change (optional):',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change:',
    subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?'
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],

  // limit subject length
  subjectLimit: 100
};
```

执行错误的提交说明：

![enter image description here](https://raw.githubusercontent.com/ziyi2/cz-example/master/images/cz_6.png)

执行符合 Angular 规范的提交说明：

![enter image description here](https://raw.githubusercontent.com/ziyi2/cz-example/master/images/cz_7.png)

### validate-commit-msg

也可以使用工具对 cz 提交说明进行校验，具体可查看[validate-commit-msg](https://github.com/Frikki/validate-commit-message)。

### commitlint-config-cz

如果是使用 cz-customizable 适配器做了破坏 Angular 风格的提交说明配置，那么不能使用@commitlint/config-conventional 进行提交说明校验，可以使用[commitlint-config-cz](https://github.com/whizark/commitlint-config-cz)对定制化提交说明进行校验。

## 日志

安装生成日志工具

```bash
npm install conventional-changelog-cli -D
```

配置生成日志的命令

```json
"version": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md"
```

执行`npm run version`后可查看生产的日志[CHANGELOG.md](https://github.com/ziyi2/cz-example/blob/master/CHANGELOG.md)。

> 注意要使用正确的`Header`的`type`，否则生成的日志会不准确，这里只是一个示例，生成的日志不是很严格。

## 链接

- [Cz 工具集使用介绍](https://juejin.im/post/6844903831893966856)
- [cz-example](https://github.com/ziyi2/cz-example)
