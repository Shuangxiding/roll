# 简介
年会抽奖项目

# 说明

后端复用了去年年会的后端，有少量修改：

* 增加接口`/all_users`，返回所有用户
* 增加静态文件目录`./frontEnd/dst`
* 抽奖页面指向`./frontEnd/dst/index.html`

抽奖前端在文件夹`frontEnd`下，使用基于FBI的webpack2模板。

# 运行

依赖nodejs,mysql
首先初始化数据库，数据库配置在`./lib/dbmysql.js`中，依次执行db目录下的db.sql,awards.sql,prize.sql,users.sql。

> 注意：Windows下的CMD中执行SQL文件可能导致编码问题。

执行`npm start`启动服务

# 编译

如对前端代码(`./frontEnd`下的代码)做修改，需执行`fbi b`进行编译

开发时也可使用`fbi w`