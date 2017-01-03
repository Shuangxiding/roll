/**
 * 控制面板
 */
import {toRandom,toBall,rotate,count,play,chooseUser,clearLuckyMan,currentLuckyMan} from './tween'
import {getJSON,myAlert} from './utils'
import {CURR_LEVEL,setLevel,showPrize,CURR_LEFT_NUM,CURR_PRIZE,startLottery} from './roll'
var roll=function(){
    if(CURR_LEVEL==null||CURR_LEVEL==-1){
        myAlert('请选择奖品')
    }
    else if(CURR_LEFT_NUM==0){
        getJSON('./index/show_result?level=' + CURR_LEVEL, function(json) {
            showResult(json.content)
        });
    }
    else{
        startLottery();
    }
}
var levelMap={
    '特等奖':0,'一等奖':1,'二等奖':2,'三等奖':3,'四等奖':4,'五等奖':5,'六等奖':6,'七等奖':7,'八等奖':8
}
var controller;
var rollController;
var guiInit=function(){
    controller={
        'play':play,
        '抽奖':roll,
        '奖品':'请选择',
        '奖品剩余':0,
        '当前奖品':'',
        '中奖名单汇总':function(){
            window.open('./result')
        }
    }
    var gui=new dat.GUI({ autoPlace: false });
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
        })
    gui.add(controller,'当前奖品').listen()
    gui.add(controller,'奖品剩余').min(0).step(1).listen().onChange(function(value){
        if(value==0){
            rollController.name('查看获奖名单')
        }
    })
    rollController=gui.add(controller,'抽奖');
    gui.add(controller,'中奖名单汇总')
    $('#gui_container').append(gui.domElement)
}
var showResult=function(luckyMan){
    gui.close();
    $('#prize_title').css('background-image','url(./images/jp'+CURR_LEVEL+'.png)');
    $('#prize_img').css('background-image','url(./images/prize/'+CURR_PRIZE.name+'.jpg)');
    $('#goodsName').text(CURR_PRIZE.cnname);
    $("#goodsNum").text("（" + CURR_LEFT_NUM + "）");
    var str='';
    for(var i=0;i<luckyMan.length;i++){
        str += '<li>' + luckyMan[i].rtx + '(' + luckyMan[i].name + ')</li>';
    }
    $('#luckyManList').html(str);
    $('#page_list').show(500);
}
export {controller,guiInit,rollController,showResult}