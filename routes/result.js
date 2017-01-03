var express = require('express');
var router = express.Router();
var dbMysql=require('../lib/dbmysql');
var json2csv = require('json2csv');
var when = require('when');

router.get('/', function(req, res, next) {
	res.render('result');
});

router.get('/getlist', function(req, res, next) {
	var params = req.query;
	var callBack = function(result) {
		res.send(result);
	};
	getAwardsByPaging(params, callBack);
});

//导出excel
router.get('/export',function(req,res,next){
	var params = req.query;
	exportExcel(params,res)
});

//设置为阳光普照
router.get("/sunprize",function(req,res,next){
	setSunAwards(res);
});

//获取头像
router.get("/downimg", function() {
	var request = require("request");
	var fs = require("fs");
	var cookies="pgv_pvi=1607984128;code_user_name=3B222A6B1361E6F3;pgv_pvid=4184425523;pgv_si=s8767264768;ARRAffinity=a9dd87964a67f43993e446324ba89053c852fe636c8c1249fbef2e332ce15cc6;t_u=6736eb4e2e8b3ed8%7C5b3984d72d0d0340;CAKEPHP=dh43l8v9ekuuckughqf184lpn3;TCOA_TICKET=89F34419110EE63E6E8B4F689C48CA8732BD51909E41C83CD0A7C4B2EF4CC8F99EB121DFA9475B4C37597202A25785792CD7B49850F088AE616A25A2D3E7685A4731406A9BF45FCA7FEC08076C64FD170850014EBDAA90EB2591EEE9ED302C13F4B8B9087FC3CCDE77878C903AEFC1B2099601BED6E76BEBA412B65F028C01FE7831A734FF3ACDA2CF21F3553073ABEEC820B6EEB7559F3E03F4B77FEB27BF81;TCOA=aw5oGjeoGj";
	var cookiesArray=cookies.split(';');
	var url = "http://r.hrc.oa.com/photo/100/";
	var user = ["kelvinzheng", "fionaxmtan", "frankkfan", "frankynfu", "leonllwang", "cokayang", "lexitan", "tjtan", "daisyyhuang", "dorajwang", "jimmyqiu", "jevonszhang", "yukinzhang", "williamzheng", "rockyjiang", "ivanxu", "fengzhong", "karlzhong", "leoqliang", "tntzhang", "icemanliang", "lupingzhao", "peterlai", "aliceyxie", "ganyiwei", "gibsonfeng", "simsonhe", "lemonding", "mingjinwu", "maxwellcao", "jimhou", "rudyxie", "linelin", "jensenweng", "fikardjiang", "victorwwang", "viczhao", "joviliu", "fightguo", "sethmao", "ivenzhang", "zoeyxiong", "louispeng", "gricentwu", "cocohe", "nathanxwang", "raymondhu", "maxwellwli", "wilderwang", "acolorzhang", "dallonshi", "rockyyan", "hyimzhong", "jimmyniu", "zhenhuachen", "harlanye", "solonzhang", "alberthe", "vennwang", "kennytu", "martonzhang", "vinneywang", "lilyxie", "longchen", "lukehuang", "springming", "carlhysun", "aceding", "iveswu", "diaoliu", "zhekaiye", "jazzyfu", "akitozhang", "shawnwu", "feixiong", "amberzhu", "ragnarzhang", "minren", "jacobwang", "josephzhang", "daisyyang", "wikijin", "rongodzhang", "fredyang", "jackwo", "alvenli", "yunnanzhou", "superwei", "stephenysli", "dickyduan", "tianxie", "jackqzhang", "nirvanacao", "smittqiu", "davidhu", "ruifanyuan", "huanjiang", "randomzhang", "eathanwang", "graceyftang", "issacmo", "zhiyupan", "windgxhuang", "rosenluo", "jontan", "gavingxu", "yuqiuwang", "jerryyguo", "javierwu", "hodxiang", "engleliu", "willwlsun", "xuepingwu", "chesteryu", "heyseawang", "jianbochen", "enlonehe", "macawwang", "shoguncao", "fenchen", "rockeyyan", "leoymwang", "apolloli", "tomxiang", "carlmli", "daimonfan", "qinhe", "yanyanqin", "acetang", "samsonzhao", "ghostjiang", "iprincewang", "jonasluo", "jonaswu", "ivanyuan", "fantaxu", "lillianliu", "roraliu", "shrekyan", "takizhang", "laughinghou", "wingsui", "joezliu", "youngyliu", "tracyjiang", "edochen", "yolachen", "susanhu", "sasanzuo", "mariusmarco", "nianweiwu", "geoffli", "vyzhou", "simonhuang", "danahe", "aprilxdli", "walterwei", "alphahuang", "twinsenqin", "gartingsun", "hammerwu", "arsenli", "menayang", "gallinzhu", "mercyliu", "deanding", "fredyusun", "sevenztwang", "dilyfu", "louishliu", "frankouyang", "nizheng", "billyczhang", "hongpan", "davistang", "madaowang", "renojing", "watertan", "bobbiexuan", "lenayuyu", "jojoyzhang", "maytang", "abenwang", "alysali", "merryzhong", "vnawang", "chronozhang", "cathiewang", "cindyxyang", "okeyli", "queenieguan", "mubehuang", "verahchen", "caraxiong", "friday", "guccizeng", "nealbai", "paddywu", "shiangzhang", "jomliu", "browserwang", "hiyangwang", "zivli", "chaunmideng", "simonsdeng", "mikeluo", "baoliangli", "jayceli", "elekxing", "stevengong", "garygong", "sampanweng", "noblechen", "geoffreyliu", "hccheng", "armingli", "frankgwang", "patrickxue", "orzwang", "yoyotian", "joriswang", "vinnyxiong", "likidli", "rayxiao", "yangmo", "ellizhang", "davidyxxu", "yyyyzhang", "kingsan", "aliceli", "judymao", "brucean", "madai", "sharonhwang", "robertpeng", "mesazhang", "michellwang", "willycai", "leanzou", "teresazhao", "cainliu", "fanyin", "davidlwq", "joeyshu", "pazuluo", "boxertan", "samuelliu", "hugoyao", "trongxu", "qiaowu", "deltali", "maxwellpang", "tripli", "fengyuji", "clarktang", "summerliu", "kevinchen", "mortyzhu", "konysu", "landyji", "sensong", "vincentding", "owenzqzhang", "stivewang", "narvyliu", "brownli", "peleuswang", "binjiluo", "michaeldu", "kingsjin", "zhenxia", "samqin", "zenhuang", "jackitwang", "erikge", "wadesheng", "leonliao", "yongqingli", "mlzhong", "tongyiguo", "cathyzxhe", "johnlwang", "xiangxwang", "xuzhouzhang", "lvbowang", "crosbyli", "amoslan", "jesuszhang", "simonchwang", "joyjjwang", "cindytwu", "roclan", "vigosschen", "tobinchen", "janieyuan", "peterhchen", "russellchen", "michaelgeng", "kepingtian", "lionguo", "ankyzhang", "xiaohaiwang", "dustinwang", "maryzhen", "fancyxiao", "sparrowli", "ahuang", "alvinma", "jeringzhu", "felixypli", "asam", "ryandeng", "xlazyxia", "robotding", "xianhuanlin", "darrenhe", "zhuojuntian", "sandyxshi", "lokiyu", "soongao", "garyzeng", "terryzuo", "juanjia", "fengli", "bardshang", "xiaoyili", "ericdlduan", "xelementliu", "nickdai", "seiyabai", "kingqiu", "bidaluo", "shemarchen", "weipinggou", "allentan", "mayzha", "ronniehuang", "aragornzhao", "jairodai", "airywu", "james", "rodmanluo", "injoeqiu", "havenwang", "tomastang", "lovekidchen", "summerye", "skiffwang", "silentshi", "kamilxiao", "xiaopinghan", "alberli", "xiaoronglin", "maxcwfeng", "xianminxiao", "jerrypxiao", "gavinhuang", "georgewang", "medivhwu", "silasjiang", "renzzhang", "scarlettsun", "haihongqin", "thomasfan", "neasonliu", "ruoliang", "lorischen", "arthaszhou", "jehoochen", "misoraliu", "maxwellma", "jarettwang", "hongruichen", "sharkxu", "richardcjli", "liangyu", "gavinzhan", "fengfuliu", "leezyli", "louishe", "fishmai", "adolfliang", "kayangwang", "jaycexia", "seezhang", "bilsonchen", "beckwu", "mikiexu", "dickxiong", "tyrekezhao", "thomasxiao", "haifazhou", "vincentchen", "symonxiao", "sniperlu", "dylanzheng", "ollielin", "nandyliu", "penwang", "starshu", "ragoliang", "irvinli", "hansonliang", "karen", "alvinshen", "annymiao", "coletan", "jeanzhao", "johnqzheng", "phoenixwei", "skywen", "gmaxguo", "deandluo", "jimmyzhang", "kuanggu", "landypan", "noreenzheng", "tracyliu", "victorzyli", "wenchao", "elanliu", "flyingfan", "hdeng", "ivydong", "joyliao", "klarkyi", "sanrenwang", "scolarwang", "vibinfang", "windanyin", "zhoujinyu", "cathylxhe", "chrisqhe", "cissili", "davidlei", "gordanjiang", "mandyzhuo", "millieyao", "stevylu", "wendyyzhang", "yalangliu", "zhengjin", "yunma", "erweiwang", "junjun", "marklai", "pengfeiyang", "benjaminli", "jinniexu", "rowanluo", "jackyyyang", "victorhuang", "wenlezhou", "adayyang", "danacheng", "luckyhuang", "tracy", "junnie", "bonnieqiao", "teresazhang", "karllu", "charrywang", "ionzhong", "ivyliang", "jennyxie", "karosu", "leoringlin", "liqiangliu", "lynnezhong", "rachelsong", "rikukuang", "salshi", "seasonschen", "sesamesli", "wasonzhou", "weiweiyan", "xiaoguo", "yvonnexiao", "bellaqiu", "daheichen", "deenfu", "duochunshe", "jadchen", "joincizhang", "kahnjin", "momoowang", "songchen", "yoamimu", "zacharyyang", "池承", "eddricktang", "judithzhou", "linazhu", "sirisuding", "ahuamao", "rexchang", "jackgong", "micoliu", "willszhang", "jojosun", "irisluyang", "polozhao", "vincentliao", "junjiechen", "brantli", "tommyli", "logiczhang", "relentcui", "sizeng", "vitofliu", "willschen", "danteye", "roxwang", "eddiexue", "fanzhizeng", "hyderzhang", "tasyticfan", "walkerfang", "billzxchen", "vultureli", "fanyan", "jadenwang", "knutxiao", "shiweixiao", "starswu", "bisonliao", "angelye", "brattzhang", "forestli", "jolanxiao", "morriszheng", "epochliu", "pingyang", "yuyang", "spraydong", "budguo", "endevchen", "hackwang", "nicolleye", "shaneyu", "aaronshang", "ceceswang", "emilyllchen", "robinluo", "evazheng", "celinewu", "cottontan", "julyfan", "traviszhang", "yetmanhu", "pennwu", "elainehuang", "maggyhuang", "lindawang", "angelwu", "dianafeng", "candypeng", "v_jingshi", "v_cchunpeng", "carinaliu"];
	var request = request.defaults({jar: true});
	var j = request.jar();
	for (var i = 0, len =user.length; i < len; i++) {
		var newUrl = url + user[i] + ".png";
		var saveAdd = "./public/images/lottery/"+user[i] + ".png";
		for(var b=0,blen=cookiesArray.length;b<blen;b++){
			j.setCookie(cookiesArray[b],newUrl);	
		}
		var buffer="";
		request.get({
				url: newUrl,
				jar: j
			}, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					//console.log(body) // 打印google首页
				}
			})
			.pipe(fs.createWriteStream(saveAdd));
		
	}
});


//下载方法
var download = function(url, dir, filename) {
	request.head(url, function(err, res, body) {
		request(url).pipe(fs.createWriteStream(dir + "/" + filename));
	});
};


/************************************************抽奖的数据交互操作begin************************************************/

/**
 * [分页获取获取获奖详情]
 * @param  {[json]} params [description]
 * @param  {[func]} callBack   [description]
 * @return {[type]}            [description]
 */
var getAwardsByPaging=function(params,callBack){
	var sqlStr="select a.rtx,u.name,p.cnname as priname,a.havetime,p.level from awards as a inner join prize p on a.priid =p.id inner join users u on a.rtx=u.rtx ";
	var sqlParams=[];  //查询条件
	sqlStr += "where 1=1 ";
	//-1为全部奖项
	if (params.level != "-1") {
		sqlStr += "and p.level=?";
		sqlParams.push(params.level);
	}
	var pageParams={
		sort:"p.level,a.rtx",
		pageStart:params.pageStart,
		pageSize:params.pageSize
	};//分页条件
	dbMysql.selectPaging(sqlStr,sqlParams,pageParams,callBack);
};

var exportExcel=function(params,res){
	var levelName="level-"+(params.level==-1?"all":params.level)+".csv";
	var fields = ['user', 'prize', 'levelName','awardTime'];
	var fieldNames = ['中奖同学', '奖品','奖品等级',"中奖时间"];
	var levelList={
		"0":"特等奖",
		"1":"一等奖",
		"2":"二等奖",
		"3":"三等奖",
		"4":"四等奖",
		"5":"五等奖",
		"6":"六等奖",
		"7":"七等奖",
		"8":"八等奖",
		"9":"阳光普照奖"
	};

	getAwardsByPaging(params,function(result){
		if(result.recode==0){
			var userData=[],
				userItem;
			for(var i=0,len=result.content.list.length;i<len;i++){
				userItem=result.content.list[i];
				userData.push({
					user:userItem.rtx+"("+userItem.name+")",
					prize:userItem.priname,
					levelName:levelList[userItem.level],
					awardTime:dateFormat(new Date(userItem.havetime),"yyyy-MM-dd hh:mm")
				});
			}
			json2csv({
				data: userData,
				fields: fields,
				fieldNames: fieldNames
			}, function(err, csv) {
				if(csv){
					// 设置 header 使浏览器下载文件
					res.setHeader('Content-Description', 'File Transfer');
					res.setHeader('Content-Type', 'application/csv; charset=utf-8');
					res.setHeader('Content-Disposition', 'attachment; filename=' + levelName);
					res.setHeader('Expires', '0');
					res.setHeader('Cache-Control', 'must-revalidate');
					// 为了让 Windows 能识别 utf-8，加上了 dom
					res.send('\uFEFF' + csv);
				}
			});
		}
	});
}

/**
 * [设置剩下的同学为阳光普照奖]
 * @param {[type]} res [description]
 */
var setSunAwards = function(res) {
	var checkLeft = "select (select count(1) from users)-count(1) as leftnum from awards";
	var checkSql = "select (p.num-count(1))as leftnum,p.`level`  from awards as a INNER JOIN prize as p on a.priid=p.id GROUP BY a.priid HAVING leftnum!=0";
	var conn = dbMysql.createConnect();
	var resMsg = {
		recode: 0,
		content: ""
	};
	var leftUser;
	var callBack = function() {
		res.send(resMsg);
	};
	dbMysql.queryPromise(checkLeft, null, conn)
		.then(function(result) {
			var deferred = when.defer();
			if (result[0].leftnum == 0) {
				resMsg.recode = -1;
				resMsg.content = "全部人员已经抽奖完毕。";
				callBack(resMsg);
				deferred.reject();
				return deferred.promise;
			} else {
				return dbMysql.queryPromise(checkSql, null, conn);
			}
		})
		.then(function(result) {
			var deferred = when.defer();
			if (result.length != 0) {
				resMsg.recode = -1;
				resMsg.content = "有以下等级的奖品未抽完：";
				for (var i = 0, len = result.length; i < len; i++) {
					resMsg.content += result[i].level + ":" + result[i].leftnum + ";";
				}
				callBack(resMsg);
				deferred.reject();
				return deferred.promise;
			} else {
				var leftUserSql = "select rtx,name,type from users where rtx not in(select rtx from awards);"
				return dbMysql.queryPromise(leftUserSql, null, conn);
			}
		})
		.then(function(result) {
			var deferred = when.defer();
			if (result.length == 0) {
				resMsg.recode = -1;
				resMsg.content = "没有待抽奖的同学";
				callBack(resMsg);
				deferred.reject();
			} else {
				leftUser = result;
				var sunPrizeSql = "select id,cnname,level,type from prize where level=9";
				return dbMysql.queryPromise(sunPrizeSql, null, conn);
			}
		})
		.then(function(result) {
			if (result.length == 0) {
				resMsg.recode = -1;
				resMsg.content = "没有找到对应的奖项";
				callBack(resMsg);
				return;
			} else {
				var sunData = [];
				var insertSql = "INSERT INTO awards(rtx,priid,priname,havetime,pritype) VALUES ?"
				for (var i = 0, len = leftUser.length; i < len; i++) {
					sunData.push([leftUser[i].rtx, result[0].id, result[0].cnname, new Date(), result[0].type]);
				}
				return dbMysql.queryPromise(insertSql, [sunData], conn);
			}
		})
		.then(function(result) {
			callBack(resMsg);
		});
}


/************************************************抽奖的数据交互操作end************************************************/

var dateFormat = function(date, fmt) {  
	var o = {
		"M+": date.getMonth() + 1, //月份 
		"d+": date.getDate(), //日 
		"h+": date.getHours(), //小时 
		"m+": date.getMinutes(), //分 
		"s+": date.getSeconds(), //秒 
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
		"S": date.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

module.exports = router;
