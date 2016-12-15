# FBI Webpack2 模板

## 简介

基于Webpack v2 的简单项目模板。最适合做单页应用，也支持多页应用。

### 特性：
- `babel`: 可以使用ES6和ES7语法写js
- `postcss`: 可以使用类似`sass`的语法写css，并有`autoprefixer`做兼容前缀处理
- `html模板`: 自动植入css和js文件，自动添加静态资源版本号
- `koa静态服务器`

## 如何使用

```bash

$ cd path/to/a/empty/folder   # 定位到一个空目录

$ fbi init webpack2           # 初始化本模板

# $ fbi i                       # 安装模板依赖（`package.json`文件中的`dependencies`会安装在本地目录，`devDependencies`会装在模板目录）

# 更新(2016.08.24):  `node_modules` 文件夹也已提交，`fbi clone` 时一起下载，下载完后不需要再执行 `fbi i`

$ fbi ls                      # 查看可用任务
```

你随时可以修改`./fbi`目录内的配置文件 ( `config.js`和`webpack.config.js` ) 和 任务文件,

还可以通过`fbi atm` 更新到FBI全局模板,

这些操作都不会影响本仓库, 在你执行`fbi pull`之后你本地模板会恢复与本仓库一致。
