import {getJSON} from './utils'
import {controller} from './gui'
import {chooseUsers} from './tween'
var CURR_PRIZE; //当前奖品信息
var CURR_LEVEL; //当前中奖等级
var CURR_LEFT_NUM; //当前奖品剩余数量
var CURR_DATA; //当前的抽奖数据
var CURR_NUM; //当前抽奖的个数
var setLevel=function(level){
    CURR_LEVEL=level;
}
var getAllLevelLeft = function() {
    getJSON('./index/get_level_left', function(json) {
        var map = json.content;

    });
};

var showPrize = function(level) {
    console.log('level:'+level+' CURR_LEVEL:'+CURR_LEVEL)
    CURR_PRIZE = null;
    CURR_LEFT_NUM = 0;
    if(level==null||level==-1){
        controller['当前奖品']='';
        controller['奖品剩余']=0;
        return
    }
    getJSON('./index/get_prize_info?level=' + level, function(json) {
        var data = json.content;
        var nowNum = data.num - data.usedNum;
        var imgpath = './images/prize/' + data.name + '.jpg';
        var goodsName=data.cnname;
        CURR_PRIZE = data;
        CURR_LEFT_NUM = nowNum;
        CURR_NUM = data.prelimit;
        controller['当前奖品']=data.cnname;
        controller['奖品剩余']=nowNum;
    });
};
var startLottery=function(){
    getJSON('./index/start_Lottery?priid=' + CURR_PRIZE.id, function(json) {
        CURR_DATA = json.content;
        var num=CURR_DATA.luckyMan.length;
        CURR_LEFT_NUM = CURR_LEFT_NUM - num;
        CURR_NUM = num;
        controller['奖品剩余']=CURR_LEFT_NUM;
        chooseUsers(CURR_DATA.luckyMan)
    });
}
var showResult = function() {
    getJSON('./index/show_result?level=' + CURR_LEVEL, function(json) {
        var awards = json.content;
        var str = '<ul class="list">';
        for (var i = 0; i < awards.length; i++) {
            str += '<li>' + awards[i].rtx + '(' + awards[i].name + ')</li>';
        }
        str += '</ul>';
        $('#users_lottery').html(str);
    });
};

export {showPrize,CURR_LEVEL,setLevel,CURR_LEFT_NUM,startLottery}