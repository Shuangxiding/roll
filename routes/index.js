var express = require('express');
var router = express.Router();
var dbMysql = require('../lib/dbmysql');
var when = require('when');
var path = require('path');

/* 展示首页*/
router.get('/', function(req, res, next) {
	// res.render('index');
	res.sendFile(path.join(__dirname, '../frontEnd/dst/index.html'))
});
router.get('/old_index', function(req, res, next) {
	res.render('index');
});
/* 获取所有奖项的剩余数量 */
router.get('/get_level_left', function(req, res, next) {
	var callBack = function(result) {
		res.send(result);
	};
	getAllPrizeLeft(callBack);
});

/**
 * [获取指定奖品信息]
 * @param  {[type]} req         [description]
 * @param  {[type]} res         [description]
 * @param  {[type]} next){	var callBack      [description]
 * @return {[type]}             [description]
 */
router.get('/get_prize_info', function(req, res, next) {
	var callBack = function(result) {
		res.send(result);
	};
	var levelId = req.query.level;
	getPrizeInfo(levelId, callBack);
});

/**
 * [开始抽奖]
 * @param  {[type]} req         [description]
 * @param  {[type]} res         [description]
 * @param  {[type]} next){	var callBack      [description]
 * @return {[type]}             [description]
 */
router.get('/start_Lottery',function(req,res,next){
	var callBack=function(result){
		res.send(result);
	};
	var priid=req.query.priid;
	startLottery(priid,callBack);
});

/**
 * [展示获奖列表]
 * @param  {[type]} req         [description]
 * @param  {[type]} res         [description]
 * @param  {[type]} next){	var callBack      [description]
 * @return {[type]}             [description]
 */
router.get('/show_result',function(req,res,next){
	var callBack=function(result){
		res.send(result);
	};
	var level=req.query.level;
	showResult(level,callBack);
});

/**
 * [抽奖测试]
 * @param  {[type]} req.res.next){} [description]
 * @return {[type]}                   [description]
 */
router.get("/test", function(req, res, next) {
	var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']; //带选定的集合
	var num = 6; //从集合中抽取6个
	var loop = 10000; //抽取1000次
	var result = {}; //累积集合
	var dateBegin = new Date().getTime();
	var i = 0,
		l = 0;
	for (i; i < loop; i++) {
		arr = shuffle(arr); //先进行混淆
		var rands = getRandNums(arr.length, num);
		for (l = 0; l < num; l++) {
			if (result[arr[l]]) {
				result[arr[l]] ++;
			} else {
				result[arr[l]] = 1;
			}
		}
	}
	//组合输出
	var resultHtml = "<p>\t出现次数\t占总共出现次数百分比</p>";
	console.log("\t出现次数\t占总共出现次数百分比");
	for (var attr in result) {
		resultHtml += "<p>" + attr + "\t" + result[attr] + "\t\t" + (result[attr] * 100 / loop / 6).toFixed(2) + "%</p>";
		console.log(attr + "\t" + result[attr] + "\t\t" + (result[attr] * 100 / loop / 6).toFixed(2) + "%");
	}
	var dateEnd = new Date().getTime();
	console.log("<p>循环耗时" + (dateEnd - dateBegin).toString() + "毫秒！</p>");
	resultHtml += "循环耗时" + (dateEnd - dateBegin).toString() + "毫秒！";
	res.send(resultHtml);
});

router.get('/all_users',function(req,res,next){
	var callBack=function(result){
		res.send(result);
	};
	showAllUsers(callBack);
});

/************************************************抽奖的数据交互操作begin************************************************/

/**
 * [返回所有奖品剩余]
 * @param  {[type]} callBack [description]
 * @return {[type]}          [description]
 */
var getAllPrizeLeft = function(callBack) {
	var prizeSql = "SELECT id, name, num, `level`,`type`,`index` FROM prize where 1=1 ORDER BY `index`";
	var awardsSql = "select priid,count(1)as num from awards group by priid";
	var allPrinzeInfo = [];
	var resultMsg = {
		recode: 0,
		content: ""
	};
	var callErr = function(err) {
		callBack({
			recode: 500,
			content: err
		});
	};
	dbMysql.queryPromise(prizeSql)
		.then(function(result) {
			allPrinzeInfo = result;
			return dbMysql.queryPromise(awardsSql);
		}, function(err) {
			callErr(err);
			return;
		})
		.then(function(awards) {
			var awardsLeft = {};
			var i = 0,
				len = allPrinzeInfo.length;
			var priItem;
			for (i, len; i < len; i++) {
				priItem = awards.find(function(item) {
					return item.priid == allPrinzeInfo[i].id;
				});
				awardsLeft[allPrinzeInfo[i].level] = priItem ? allPrinzeInfo[i].num - priItem.num : allPrinzeInfo[i].num;
			}
			resultMsg.content = awardsLeft;
			callBack(resultMsg);
		}, function(err) {
			callErr(err);
			return;
		});
};

/**
 * [获取单个奖项数据]
 * @param  {[type]} levelId    [奖品类别Id]
 * @param  {[type]} callBack [description]
 * @return {[type]}          [description]
 */
var getPrizeInfo = function(levelId, callBack) {
	var prizeSql = "SELECT id, name,cnname, num, `level`,`type`,`prelimit` FROM prize where level=?";
	var priParams = [levelId];
	var awardsSql = "select count(1)as num from awards where priid=?";
	var usedNum = 0; //已使用数量
	var resultMsg = {
		recode: 0,
		content: ""
	};
	var callErr = function(err) {
		callBack({
			recode: 500,
			content: err
		});
	};
	var curAward;
	dbMysql.queryPromise(prizeSql, priParams)
		.then(function(result) {
			curAward = result[0];
			var awaParams = [curAward.id];
			return dbMysql.queryPromise(awardsSql, awaParams);
		}, function(err) {
			callErr(err);
			return;
		})
		.then(function(award) {
			curAward["usedNum"] = award[0].num;
			resultMsg.content = curAward;
			callBack(resultMsg);
		}, function(err) {
			callErr(err);
			return;
		});
};


/**
 * [获得奖品信息]
 * @param  {[int]} priId [奖品Id]
 * @return {[type]}       [description]
 */
var getPrizeList = function(priId, callBack) {
	var sqlStr = "select id,name,cnname,num,level,type,index,prelimit from lottery where id=?";
	var params = [priId];
	dbMysql.query(sqlStr, params).then(function(result) {
		callBack(result);
	});

};

/**
 * [开始抽奖]
 * @param  {[type]} priId    [奖品Id]
 * @param  {[type]} callBack [description]
 * @return {[type]}          [description]
 */
var startLottery = function(priId, callBack) {
	var sqlStr = "select p.num-(select count(1) from awards as a where a.priid=?) as leftnum,p.level,prelimit,p.type,p.cnname from prize as p where p.id=?"; //获取指定奖品的剩余数量
	var params = [priId, priId];
	var sqlUser = "select u.rtx,u.name from users as u where u.rtx not in (select rtx from awards)";
	var sqlAwards = "INSERT INTO awards(rtx,priid,priname,havetime,pritype) VALUES ?";
	var awardsParams = [];
	var conn = dbMysql.createConnect();
	var resultMsg = {
		recode: 0,
		content: ""
	};
	var curPrize; //当前奖品情况
	var curUser; //可获奖的同学
	var awardsUser; //最终获奖的同学
	var date1=new Date().getTime();
	dbMysql.queryPromise(sqlStr, params, conn)
		.then(function(result) {
			curPrize = result[0];
			if (curPrize.leftnum <= 0) {
				resultMsg.recode = -1;
				resultMsg.content = "该奖品抽完啦！";
				return;
			}
			if (curPrize.level <= 3) {
				sqlUser += " and u.type=0"; //满足抽取三等奖及三等奖以上的条件
			}
			return dbMysql.queryPromise(sqlUser, null, conn);
		})
		.then(function(result) {
			curUser = result;
			if (curUser.length == 0) {
				resultMsg.recode = -1;
				resultMsg.content = "所有人都有奖品啦！";
				return;
			}
			var date2 = new Date().getTime();
			var shuffleNum = Math.floor(Math.random() * 10); //随机混淆的次数
			var i = 0;
			while (i < shuffleNum) {
				shuffle(curUser);
				i++;
			}
			var randArray = getRandNums(curUser.length, curPrize.prelimit); //随机的取值坐标
			awardsUser = [];
			for (i = 0; i < curPrize.prelimit; i++) {
				awardsUser.push(curUser[randArray[i]]);
				awardsParams.push([curUser[randArray[i]].rtx,parseInt(priId),curPrize.cnname,new Date(),curPrize.type]);
			}
			console.log("混淆数据用时：" + (new Date().getTime() - date2));
			//rtx,priid,priname,havetime,pritype
			return dbMysql.queryPromise(sqlAwards, [awardsParams], conn);
		})
		.then(function() {
			resultMsg.content = {
				users: curUser,
				luckyMan: awardsUser
			};
			console.log("最终用时：" + (new Date().getTime() - date1));
			callBack(resultMsg);
	});
};

/**
 * [展示获奖列表]
 * @param  {[type]} level    [description]
 * @param  {[type]} callBack [description]
 * @return {[type]}          [description]
 */
var showResult=function(level,callBack){
	var sqlStr="select a.rtx,u.name,a.priid,p.level from awards as a left join users as u on a.rtx=u.rtx inner join prize as p on a.priid=p.id where p.level=? ";
	var sqlParams=[level];
	var resultMsg={
		recode:0,
		content:""
	};
	dbMysql.queryPromise(sqlStr, sqlParams).then(function(result) {
		resultMsg.content=result;
		callBack(resultMsg);
	});
};

/**
 * [展示所有用户]
 * @param  {} callback
 */
var showAllUsers=function(callback){
	var sqlStr="select rtx,name from users"
	var resultMsg={
		recode:0,
		users:""
	};
	dbMysql.queryPromise(sqlStr,null).then(function(result) {
		resultMsg.users=result
		callback(resultMsg)
	})
}
/************************************************抽奖的数据交互操作end************************************************/
/************************************************抽奖逻辑begin**********************************************************/

/**
 * [数组混淆排序]，这种方法随着数组越大，随机性越差
 * @return {[type]}   [description]
 */
var randomSort = function() {
	return Math.random() - 0.5;
};

/**
 * [数组混淆洗牌]
 * @param  {[Array]} arr [需要处理的数组]
 * @return {[type]}       [返回数组]
 */
var shuffle = function(arr) {
	var len = arr.length;
	var t, i;
	//持续洗牌
	while (len) {
		i = Math.floor(Math.random() * (len--)); //从当前长度随机选择一个数
		t = arr[len];
		arr[len] = arr[i]; // 与当前元素进行交换
		arr[i] = t;
	}
	return arr;
};



/**
 * [获取随机数]
 * @param  {[number]} total [取值范围,0-*]
 * @param  {[number]} num   [取值数量]
 * @return {[array]}       [返回数组]
 */
var getRandNums = function(total, num) {
	var result = []; //返回的数组
	if (total === 0 || num === 0) {
		return result;
	}
	var i = 0;
	if (num >= total) {
		for (i; i < total; i++) {
			result[i] = i;
		}
		return result;
	}
	var flag = false; //循环标记
	var randNum = 0; //随机数
	for (i = 0; i < num; i++) {
		flag = false;
		while (!flag) {
			randNum = Math.floor(Math.random() * total); //随机取数
			//如果数组不包含则push，已包含则重新再取值
			if (result.indexOf(randNum) < 0) {
				result.push(randNum);
				flag = true;
			}
		}
	}
	// 再次确保数据不重复
	if (arrayUnique(result).length !== result.length) {
		result = getRandNums(total, num);
	}
	return result;
};

/**
 * [数组去重]
 * @param  {[array]} arr [数组]
 * @return {[array]}     [经过处理后的数组]
 */
var arrayUnique = function(arr) {
	var res = [];
	var json = {};
	for (var i = 0; i < arr.length; i++) {
		if (!json[arr[i]]) {
			res.push(arr[i]);
			json[arr[i]] = 1;
		}
	}
	return res;
};

/************************************************抽奖逻辑end**********************************************************/


module.exports = router;