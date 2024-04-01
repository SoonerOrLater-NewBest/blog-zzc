---
customLabelArray: [1]
---

# <Label :level='1'/>apiDoc 生成 api 接口文档

> 本文采用倒叙，实战放在前面，基础参数查询往下翻，或[查阅官网](https://apidocjs.com/index.html)
>
> 拓展阅读 - [RESTful API 设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)

## 快速开始

1. 全局安装 apiDoc 命令行工具 `npm install apidoc -g`
2. [配置(apidoc.json)](#apidoc-配置)
3. 实战总结（[如何优雅的写接口注释](#如何优雅的写-apidoc-注释)）
4. 生成接口文档 `apidoc -i src/router/ -o apidoc/`
5. 查阅 [apiDoc 注释参数](apidoc-注释参数)

## 如何优雅的写 apiDoc 注释

待完善-敬请期待

## apiDoc 配置

### 新建 apidoc.json 文件

每次导出接口文档都必须要让 apidoc 读取到 apidoc.json 文件(如果未添加配置文件，导出报错)，你可以在你项目的根目录下添加 apidoc.json 文件，这个文件主要包含一些项目的描述信息，比如标题、简短的描述、版本等，你也可以加入一些可选的配置项，比如页眉、页脚、模板等。

```json
// apidoc.json
{
  "name": "系统接口文档",
  "version": "0.0.1",
  "description": "文档总描述",
  "title": "apidoc 浏览器自定义标题",
  "url": "文档 url 地址"
}
```

如果你的项目中使用了 package.json 文件(例如:node.js 工程)，那么你可以将 apidoc.json 文件中的所有配置信息放到 package.json 文件中的 apidoc 参数中：

```json
// package.json
{
  "name": "系统接口文档",
  "version": "0.0.1",
  "description": "文档总描述",
  "apidoc": {
    "title": "apidoc 浏览器自定义标题",
    "url": "文档 url 地址"
  }
}
```

### apidoc.json 配置项

| 参数            | 描述                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| name            | 工程名称如果 apidoc.json 文件中没有配置该参数，apidoc 会尝试从 pakcage.json 文件中读取                                         |
| version         | 版本如果 apidoc.json 文件中没有配置该参数，apidoc 会尝试从 pakcage.json 文件中读取                                             |
| description     | 工程描述如果 apidoc.json 文件中没有配置该参数，apidoc 会尝试从 pakcage.json 文件中读取                                         |
| title           | 浏览器标题                                                                                                                     |
| url             | api 路径前缀例如:https://api.github.com/v1                                                                                     |
| sampleUrl       | 如果设置了该参数，那么在文档中便可以看到用于测试接口的一个表单(详情可以查看参数@apiSampleReques)                               |
| header.title    | 页眉导航标题                                                                                                                   |
| header.filename | 页眉文件名(markdown)                                                                                                           |
| footer.title    | 页脚导航标题                                                                                                                   |
| footer.filename | 页脚文件名(markdown)                                                                                                           |
| order           | 接口名称或接口组名称的排序列表如果未定义，那么所有名称会自动排序"order": [ "Error", "Define", "PostTitleAndError", PostError"] |

[更多详情](https://apidocjs.com/#install)

## apiDoc 注释参数

### @api

【必填字段】否则，apidoc 会忽略该条注释

```ts
@api {method} path [title]
```

参数列表:

| 参数   | 必填 | 描述                                     |
| ------ | ---- | ---------------------------------------- |
| method | yes  | 请求类型:DELETE, GET, POST, PUT, ...更多 |
| path   | yes  | 请求路径                                 |
| title  | no   | 接口标题                                 |

例：

```ts
/**
 * @api {get} /user/getUserById/:id 获取用户数据 - 根据 id
 */
```

### @apiErrorExample

接口错误返回示例(格式化输出)

```ts
@apiErrorExample [{type}][title]
example
```

参数列表:

| 参数    | 必填 | 描述               |
| ------- | ---- | ------------------ |
| type    | no   | 响应类型           |
| title   | no   | 示例标题           |
| example | yes  | 示例详情(兼容多行) |

例：

```ts
/**
 *@api {get} /user/getUserById/:id 获取用户数据 - 根据 id
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
```

### @apiDefine

定义注释模块(类似于代码中定义一个常量)，对于一些通用可复用的注释模块(例如:接口错误响应模块),只需要在源代码中定义一次，便可以在其他注释模块中随便引用，最后在文档导出时会自动替换所引用的注释模块，定义之后您可以通过@apiUse 来引入所定义的注释模块。(注:可以同时使用@apiVersion 来定义注释模块的版本)

```ts
@apiDefine name [title][description]
```

参数列表:

| 参数        | 必填 | 描述                                                           |
| ----------- | ---- | -------------------------------------------------------------- |
| name        | yes  | 注释模块名称(唯一)，不同@apiVersion 可以定义相同名称的注释模块 |
| title       | no   | 注释模块标题                                                   |
| description | no   | 注释模块详细描述(详细描述另起一行，可包含多行)                 |

例：

```ts
/**
 *@apiDefine FailResponse
 * @apiErrorExample Response (fail):
 *     {
 *       "code":"error"
 *       "error_message": "错误内容"
 *     }
 */

/**
 * @apiDefine SuccessResponse
 * @apiSuccessExample Response (success):
 *     {
 *       "code":"0"
 *       "error_message": ""
 *       "data":"内容"
 *     }
 */

/**
 * @apiUse SuccessResponse
 *
 * @apiUse FailResponse
 */
```

### @apiDeprecated

标注一个接口已经被弃用

```ts
@apiDeprecated [text]
```

参数列表:

| 参数 | 必填 | 描述         |
| ---- | ---- | ------------ |
| text | yes  | 多行文字描述 |

例：

```ts
/**
 * @apiDeprecated use now (#Group:Name).
 *
 * Example: to set a link to the GetDetails method of your group User
 * write (#User:GetDetails)
 */
```

### @apiDescription

api 接口的详细描述

```ts
@apiDescription [text]
```

参数列表:

| 参数 | 必填 | 描述         |
| ---- | ---- | ------------ |
| text | yes  | 多行文字描述 |

例：

```ts
/**
 * @apiDescription This is the Description.
 * It is multiline capable.
 *
 * Last line of Description.
 */
```

### @apiError

错误返回参数

```ts
@apiError [(group)][{type}] field [description]
```

参数列表:

| 参数        | 必填 | 描述                                                                                  |
| ----------- | ---- | ------------------------------------------------------------------------------------- |
| (group)     | no   | 所有的参数都会通过这个参数进行分组，如果未设置，默认值为 Error 4xx                    |
| {type}      | no   | 返回类型，例如{Boolean}， {Number}， {String}， {Object}，{String[]}（字符串数组），… |
| field       | yes  | 返回 id                                                                               |
| description | no   | 参数描述                                                                              |

例：

```ts
/**
 * @api {get} /user/getUserById/:id 获取用户数据 - 根据 id
 * @apiError UserNotFound The <code>id</code> of the User was not found.
 */

/**
- @apiError (错误分组) {Object} xxx xxxxxxxx
*/
```

### @apiExample

接口方式请求示例

```ts
@apiExample [{type}] title
example
```

参数列表:

| 参数    | 必填 | 描述               |
| ------- | ---- | ------------------ |
| type    | no   | 请求内容格式       |
| title   | yes  | 示例标题           |
| example | yes  | 示例详情(兼容多行) |

例：

```ts
/**
 * @api {get} /user/getUserById/:id
 * @apiExample {curl} Example usage:
 *     curl -i http://127.0.0.1/user/getUserById/1
 */
```

### @apiGroup

定义接口所属的接口组，虽然接口定义里不需要这个参数，但是您应该在每个接口注释里都添加这个参数，因为导出的接口文档会以接口组的形式导航展示。

```ts
@apiGroup name
```

参数列表:

| 参数 | 必填 | 描述                            |
| ---- | ---- | ------------------------------- |
| name | yes  | 接口组名称(用于导航,不支持中文) |

例：

```ts
/**
 * @apiDefine User 用户信息
 */

/**
 * @api {get} /user/getUserById/:id
 * @apiGroup User
 */
```

### @apiParam

接口请求体参数

```ts
@apiParam [(group)][{type}] [field=defaultValue][description]
```

参数列表:

| 参数                 | 必填 | 描述                                                                                                                                                                                                                                     |
| -------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (group)              | no   | 所有的参数都会以该参数值进行分组(默认 Parameter)                                                                                                                                                                                         |
| {type}               | no   | 返回类型(例如:{Boolean}, {Number}, {String}, {Object}, {String[]})                                                                                                                                                                       |
| {type{size}}         | no   | 返回类型,同时定义参数的范围{string{…5}}意为字符串长度不超过 5{string{2…5}}意为字符串长度介于 25 之间{number{100-999}}意为数值介于 100999 之间                                                                                            |
| {type=allowedValues} | no   | 参数可选值{string=“small”}意为字符串仅允许值为"small"{string=“small”,“huge”}意为字符串允许值为"small"、“huge”{number=1,2,3,99}意为数值允许值为 1、2、3、99{string {…5}=“small”,"huge"意为字符串最大长度为 5 并且值允许为:“small”、“huge” |
| field                | yes  | 参数名称(定义该请求体参数为必填)                                                                                                                                                                                                         |
| [field]              | yes  | 参数名称(定义该请求体参数为可选)                                                                                                                                                                                                         |
| =defaultValue        | no   | 参数默认值                                                                                                                                                                                                                               |
| description          | no   | 参数描述                                                                                                                                                                                                                                 |

例：

```ts
/**
 * @api {get} /user/getUserById/:id
 * @apiParam {Number} id Users unique ID.
 */

/**
 * @api {post} /user/
 * @apiParam {String} [firstname] Optional Firstname of the User.
 * @apiParam {String} lastname Mandatory Lastname.
 * @apiParam {String} country="DE" Mandatory with default value "DE".
 * @apiParam {Number} [age=18] Optional Age with default 18.
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
```

### @apiHeader

描述接口请求头部需要的参数(功能类似@apiParam)

```ts
@apiHeader [(group)][{type}] [field=defaultValue][description]
```

参数列表:

| 参数          | 必填 | 描述                                                               |
| ------------- | ---- | ------------------------------------------------------------------ |
| (group)       | no   | 所有的参数都会以该参数值进行分组(默认 Parameter)                   |
| {type}        | no   | 返回类型(例如:{Boolean}, {Number}, {String}, {Object}, {String[]}) |
| field         | yes  | 参数名称(定义该头部参数为必填)                                     |
| [field]       | yes  | 参数名称(定义该头部参数为可选)                                     |
| =defaultValue | no   | 参数默认值                                                         |
| description   | no   | 参数描述                                                           |

例：

```ts
/**
 * @api {get} /user/getUserById/:id
 * @apiHeader {String} access-key Users unique access-key.
 */
```

### @apiHeaderExample

请求头部参数示例

```ts
@apiHeaderExample [{type}][title]
example
```

参数列表:

| 参数    | 必填 | 描述                   |
| ------- | ---- | ---------------------- |
| type    | no   | 请求内容格式           |
| title   | no   | 请求示例标题           |
| example | yes  | 请求示例详情(兼容多行) |

例：

```ts
/**
 * @api {get} /user/getUserById/:id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Accept-Encoding": "Accept-Encoding: gzip, deflate"
 *     }
 */
```

### @apiIgnore

如果你需要使用该参数，请把它放到注释块的最前面。如果设置了该参数，那么该注释模块将不会被解析(当有些接口还未完成或未投入使用时，可以使用该字段)

```ts
@apiIgnore [hint]
```

参数列表:

| 参数 | 必填 | 描述               |
| ---- | ---- | ------------------ |
| hint | no   | 描接口忽略原因描述 |

例：

````ts
/**
* @apiIgnore Not finished Method
* @api {get} /user/getUserById/:id
*/

  ### @apiName
  接口名称，每一个接口注释里都应该添加该字段，在导出的接口文档里会已该字段值作为导航子标题，如果两个接口的@apiVersion 和@apiName 一样，那么有一个接口的注释将会被覆盖(接口文档里不会展示)
```ts
@apiName name
````

参数列表:

| 参数 | 必填 | 描述                                             |
| ---- | ---- | ------------------------------------------------ |
| name | yes  | 接口名称(相同接口版本下所有接口名称应该是唯一的) |

例：

```ts
/**
 * @api {get} /user/getUserById/:id
 * @apiName getUserById
 */
```

### @apiParamExample

请求体参数示例

```ts
@apiParamExample [{type}][title]
example
```

参数列表:

| 参数    | 必填 | 描述                   |
| ------- | ---- | ---------------------- |
| type    | no   | 请求内容格式           |
| title   | no   | 请求示例标题           |
| example | yes  | 请求示例详情(兼容多行) |

例：

```ts
/**
 * @api {get} /user/getUserById/:id
 * @apiParamExample {json} Request-Example:
 *     {
 *       "id": 1
 *     }
 */
```

### @apiPermission

允许访问该接口的角色名称

```ts
@apiPermission name
```

参数列表:

| 参数 | 必填 | 描述                     |
| ---- | ---- | ------------------------ |
| name | yes  | 允许访问的角色名称(唯一) |

例：

```ts
/**
 * @api {get} /user/getUserById/:id
 * @apiPermission none
 */
```

### @apiPrivate

定义私有接口，对于定义为私有的接口，可以在生成接口文档的时候，通过在命令行中设置参数 --private false|true 来决定导出的文档中是否包含私有接口

```ts
@apiPrivate
```

例：

```ts
/**
 * @api {get} /user/getUserById/:id
 * @apiPrivate
 */
```

### @apiSampleRequest

设置了该参数后，导出的 html 接口文档中会包含模拟接口请求的 form 表单；如果在配置文件 apidoc.json 中设置了参数 sampleUrl,那么导出的文档中每一个接口都会包含模拟接口请求的 form 表单，如果既设置了 sampleUrl 参数，同时也不希望当前这个接口不包含模拟接口请求的 form 表单，可以使用@apiSampleRequest off 来关闭。

```ts
@apiSampleRequest url
```

参数列表:

| 参数 | 必填 | 描述                        |
| ---- | ---- | --------------------------- |
| url  | yes  | 模拟接口请求的 url 测试功能 |

例：

- 默认测试请求将发送到`apidoc.json`中的`sampleUrl`参数
- `@apiSampleRequest`会覆盖`apidoc.json`中的`sampleUrl`参数
- 如果`apidoc.json`中没有设置`sampleUrl`参数，则只有设置了`@apiSampleRequest`的接口有模拟测试功能)

```ts
/**
 * @api {get} /user/getUserById/:id
 * @apiSampleRequest http://test.com/
 */
```

- 关闭接口测试功能

```ts
/**
 * @api {get} /user/getUserById/:id
 * @apiSampleRequest off
 */
```

### @apiSuccess

接口成功返回参数

```ts
@apiSuccess [(group)][{type}] field [description]
```

参数列表:

| 参数          | 必填 | 描述                                                               |
| ------------- | ---- | ------------------------------------------------------------------ |
| (group)       | no   | 所有的参数都会以该参数值进行分组,默认值:Success 200                |
| {type}        | no   | 返回类型(例如:{Boolean}, {Number}, {String}, {Object}, {String[]}) |
| field         | yes  | 返回值(返回成功码)                                                 |
| =defaultValue | no   | 参数默认值                                                         |
| description   | no   | 参数描述                                                           |

例：

```ts
/**
 * @api {get} /user/getUserById/:id
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname Lastname of the User.
 */
```

包含(group):

```ts
/**
- @api {get} /user/getUserById/:id
- @apiSuccess (200) {String} firstname Firstname of the User.
- @apiSuccess (200) {String} lastname Lastname of the User.
*/
```

返回参数中有对象:

```ts
/**
 * @api {get} /user/getUserById/:id
 * @apiSuccess {Boolean} active Specify if the account is active.
 * @apiSuccess {Object} profile User profile information.
 * @apiSuccess {Number} profile.age Users age.
 * @apiSuccess {String} profile.image Avatar-Image.
 */
```

返回参数中有数组：

```ts
/**
 * @api {get} /users
 * @apiSuccess {Object[]} profiles List of user profiles.
 * @apiSuccess {Number} profiles.age Users age.
 * @apiSuccess {String} profiles.image Avatar-Image.
 */
```

### @apiSuccessExample

返回成功示例

```ts
@apiSuccessExample [{type}][title]
example
```

参数列表:

| 参数    | 必填 | 描述                   |
| ------- | ---- | ---------------------- |
| type    | no   | 返回内容格式           |
| title   | no   | 返回示例标题           |
| example | yes  | 返回示例详情(兼容多行) |

例：

```ts
/**
 * @api {get} /user/getUserById/:id
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code":"0"
 *       "message": ""
 *       "data":"加密内容"
 *     }
 */
```

### @apiUse

引入注释模块，如果当前模块定义了@apiVersion,那么版本相同或版本最近的注释模块会被引入

```ts
@apiUse name
```

参数列表:

| 参数 | 必填 | 描述               |
| ---- | ---- | ------------------ |
| name | yes  | 引入注释模块的名称 |

例：

```ts
/**
 * @apiDefine MySuccess
 * @apiSuccess {string} firstname The users firstname.
 * @apiSuccess {number} age The users age.
 */

/**
 * @api {get} /user/getUserById/:id
 * @apiUse MySuccess
 */
```

### @apiVersion

定义接口/注释模块版本

```ts
@apiVersion version
```

参数列表:

| 参数    | 必填 | 描述                                        |
| ------- | ---- | ------------------------------------------- |
| version | yes  | 版本号(支持 APR 版本规则:major.minor.patch) |

例：

```ts
/**
 * @api {get} /user/getUserById/:id
 * @apiVersion 1.6.2
 */
```
