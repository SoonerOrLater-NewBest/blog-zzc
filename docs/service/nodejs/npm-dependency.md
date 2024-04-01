---
customLabelArray: [1]
---

# <Label :level='1'/>NPM 精准控制依赖版本

NPM v5 引入了 `package-lock.json`，将其作为捕获在任意时刻安装的确切依赖树的机制，确保不同成员不同环境都能够获得完全相同的依赖树。

## npm-shrinkwrap.json

- 每次更新 `package.json` 或者 `node_modules` 时，如 `npm install` 新包，`npm update`， `npm uninstall` 等操作，为保持协作人的资源一致，还是要手动运行 `npm shrinkwrap` 更新 `npm-shrinkwrap.json` 文件的。
- shrinkwrap 计算时是根据当前依赖安装的目录结构生成的，如果你不能保证 `package.json` 文件定义的依赖与 `node_modules` 下已安装的依赖是匹配、无冗余的，建议在执行 shrinkwrap 命令前清理依赖并重新安装（`rm -rf node_modules && npm install`）或精简依赖（`npm prune`）。

## package-lock.json

### package.json 映射 package-lock.json

- npm5 后，在项目里会存在一个文件——package-lock.json

- 要确保你不去直接更改 `package-lock.json`。这将由 NPM 自动处理，它将对 `package.json` 的更改反映到`package-lock.json`，并保持最新。

- 但是只有在使用 NPM 的 CLI 进行更改时，才会发生这种情况。如果你手动更改 `package.json`，则不要期望 `package-lock.json`会更新。要始终使用 CLI 命令，例如 `install，uninstall`等。

### 使用 NPM CLI 时的依赖变化

#### npm install/uninstall（使用特定模块作为参数）

```js
npm install express body-parser cors
```

这将更改 `package.json` 和 `package-lock.json`，因为依赖关系树将会发生变化。

#### npm install（不带参数）

- `install` 将尝试安装与 `package-lock.json` 相关的所有依赖项。
- 如果有人手动更改 `package.json`（例如，删除了一个软件包），那么下次有人运行 `npm install` 时，它将更改 `package-lock.json` 以反映对先前软件包的删除。

#### npm update

`update` 将会读取 `package.json`，用来查找可以更新的所有依赖项。随后它将构造一个新的依赖关系树并更新 `package-lock.json`

#### npm ci

`ci` 将安装与 `package-lock.json` 有关的所有依赖项，类似于 `install` 这里的主要区别在于，在任何情况下都不会更改 `package-lock.json`

### 结论

- 用 NPM CLI 更改依赖项，如`npm install/uninstall`
- 不要在没有参数的情况下使用 `npm install` 来获取依赖关系，请使用 `npm ci`
- 如果所有成员都可以使用 NPM+5，则最好对未发布的项目使用 `package-lock.json`
- 可以将`package-lock.json`提交至代码库，跟踪或检出确切的依赖树

## npm-shrinkwrap.json 与 package-lock.json 的区别

### 从 npm 版本看

- `package-lock.json` 是 npm5 的新特性，也不向前兼容，如果 npm 版本是 4 或以下，那还是使用 `npm-shrinkwrap.json` 吧

### 从 npm 处理机制来看

- 如果项目里不存在这两个文件，那么在运行 `npm cli` 时，会自动生成 `package-lock.json`，安装信息会依据该文件进行，而不是单纯按照 `package.json`，这两个文件的优先级都比 `package.json` 高

- 如果项目两个文件都存在，那么安装的依赖是依据 `npm-shrinkwrap.json` 来的，而忽略 `package-lock.json`
- 运行命令 `npm shrinkwrap` 后，如果项目里不存在 `package-lock.json`，那么会新建一个 `npm-shrinkwrap.json` 文件，如果存在 `package-lock.json`，那么会把 `package-lock.json` 重命名为 `npm-shrinkwrap.json`

### 从文件更新来看

- `npm-shrinkwrap.json` 只会在运行 `npm shrinkwrap` 才会创建/更新
- `package-lock.json` 会在修改 `pacakge.json` 时自动产生或更新了。

### 从发布包来看

- `package-lock.json` 不会在发布包中出现，就算出现了，也会遭到 `npm` 的无视。
- `npm-shrinkwrap.json` 可以在发布包中出现

## npm info 查看所依赖的各个版本

### eslint-config-airbnb

Airbnb 标准,它依赖 eslint, eslint-plugin-import, eslint-plugin-react, and eslint-plugin-jsx-a11y 等插件，并且对各个插件的版本有所要求。

你可以执行以下命令查看所依赖的各个版本：

```
npm info "eslint-config-airbnb@latest" peerDependencies

// 你会看到以下输出信息，包含每个了每个plugins的版本要求
{ eslint: '^3.15.0',
  'eslint-plugin-jsx-a11y': '^3.0.2 || ^4.0.0',
  'eslint-plugin-import': '^2.2.0',
  'eslint-plugin-react': '^6.9.0' }
```
