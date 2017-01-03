/**
 * 控制面板
 */
import {toRandom,toBall,rotate,count,play,chooseUser,clearLuckyMan} from './tween'
import {getJSON,myAlert} from './utils'
import {CURR_LEVEL,setLevel,showPrize,CURR_LEFT_NUM,startLottery} from './roll'
var roll=function(){
    console.log(CURR_LEVEL)
    if(CURR_LEVEL==null||CURR_LEVEL==-1){
        myAlert('请选择奖品')
    }
    else if(CURR_LEFT_NUM==0){
        myAlert('此奖品已抽完！')
    }
    else{
        startLottery();
    }
    // getJSON('./index/get_prize_info?level=0', function(json) {
    //     console.log(json)
    //     var data = json.content;
    //     var nowNum = data.num - data.usedNum;
    //     var str = '<div class="inner"><img src="./images/prize/' + data.name + '.jpg" alt=""></div>';
    //     var CURR_PRIZE = data;
    //     var CURR_LEFT_NUM = nowNum;
    //     var CURR_NUM = data.prelimit;
    //     getJSON('./index/start_Lottery?priid=' + CURR_PRIZE.id, function(json) {
    //         console.log(json)
    //         var CURR_DATA = json.content;
    //         chooseUser(CURR_DATA.luckyMan[0].rtx)
    //         // currentUsers=CURR_DATA.users;
    //     });
    // });
}
var controller={
    play:play,
    // toRandom:toRandom,
    // toBall:toBall,
    // rotate:rotate,
    // count:count,
    '抽奖':roll,
    '奖品':'请选择',
    '奖品剩余':0,
    '当前奖品':'',
    '中奖名单':function(){
        window.open('./result')
    }
}
var levelMap={
    '特等奖':0,'一等奖':1,'二等奖':2,'三等奖':3,'四等奖':4,'五等奖':5,'六等奖':6,'七等奖':7,'八等奖':8
}
var guiInit=function(){
    var gui=new dat.GUI();
    gui.add(controller,'play');
    gui.add(controller,'奖品',['请选择','特等奖','一等奖','二等奖','三等奖','四等奖','五等奖','六等奖','七等奖','八等奖'])
        .onChange(function(value){
            var level=levelMap[value];
            if(level==null){
                level=-1;
            }
            clearLuckyMan()
            setLevel(level)
            showPrize(CURR_LEVEL)
            console.log(level)
            console.log('奖品：'+value)
        })
    gui.add(controller,'当前奖品').listen()
    gui.add(controller,'奖品剩余').min(0).step(1).listen()
    gui.add(controller,'抽奖');
    gui.add(controller,'中奖名单')
    $('#gui_container').append(gui.domElement)
    window.controller=controller
    window.gui=gui
}

export {controller,guiInit}