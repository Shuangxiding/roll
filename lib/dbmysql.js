var mysql = require('mysql');
var when = require('when');
var connInfo = {
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'lottery',
	port: 3306
};

//创建链接
var createConnect = function() {
	var resultMsg = {
		recode: 0,
		content: ""
	};
	var conn = mysql.createConnection(connInfo);
	conn.connect(function(err) {
		if (err) {
			//异常处理
		}
	});
	return conn;
};

var mysqldb = {

	/**
	 * [执行sql语句操作]
	 * @param  {[String]} sqlStr    [Sql语句]
	 * @param  {[Array]} sqlParams [参数]
	 * @param  {[Func]} callBack  [回调函数]
	 * @return {[type]}           []
	 */
	query: function(sqlStr, sqlParams, callBack) {
		var conn = createConnect();
		var resultMsg = {
			recode: 0,
			content: ""
		};
		//执行sql语句
		conn.query(sqlStr, sqlParams, function(err, rows, fields) {
			if (err) {
				resultMsg.recode = 500;
				resultMsg.content = err;
			} else {
				resultMsg.content = rows.length > 0 ? rows : "";
			}
			callBack(resultMsg);
		});
		//关闭连接
		conn.end();
	},
	queryPromise: function(strSql, sqlParams, conn) {
		var resultMsg = {
				recode: 0,
				content: ""
			},
			deferred = when.defer();
		var iscon = true;
		if (typeof conn === "undefined") {
			conn = createConnect();
			iscon = false;
		}

		conn.query(strSql, sqlParams, function(err, result) {
			if (err) {
				conn.end();
				deferred.reject(err);
			} else {
				deferred.resolve(result);
			}
		});
		if (!iscon) {
			conn.end();
		}
		return deferred.promise; //使用when的Promise
	},
	/**
	 * [分页查询]
	 * @param  {[String]} sqlStr     [查询sql语句]
	 * @param  {[Array]} sqlParams  [查询的参数]
	 * @param  {[Json]} pageParams [分页的参数(注意分页查询的条件为对象)]
	 * @param  {[Func]} callBack   [回调函数]
	 * @return {[type]}            [description]
	 */
	selectPaging: function(sqlStr, sqlParams, pageParams, callBack) {
		//分页查询
		var conn = createConnect();
		var resultMsg = {
			recode: 0,
			content: ""
		};
		conn.query(sqlStr, sqlParams, function(err, rows, fields) {
			if (err) {
				resultMsg.recode = 500;
				resultMsg.content = err;
				callBack(resultMsg);
				conn.end();
			} else {
				resultMsg.content = {
					total: rows.length
				};
				if (!sqlParams) {
					//无查询条件时增加过滤
					sqlStr += " where 1=1 ";
				}
				if (pageParams.sort) {
					//存在排序条件
					sqlStr += " order by "+pageParams.sort;
				}
				//存在页开始条数和每页大小
				if (pageParams.pageStart == 0 || pageParams.pageStart && pageParams.pageSize) {
					sqlStr += " limit ?,?";
					sqlParams.push(parseInt(pageParams.pageStart), parseInt(pageParams.pageSize));
				}
				conn.query(sqlStr, sqlParams, function(err2, rows2, fields2) {
					//第二次查询返回结果
					conn.end();
					if (err2) {
						resultMsg.recode = 500;
						resultMsg.content = err2;
					} else {
						resultMsg.content.list = rows2.length > 0 ? rows2 : [];
					}
					callBack(resultMsg);
				});
				
			}
		});
	},
	createConnect:createConnect
};

module.exports = mysqldb;