/**
 * 控制面板
 */
import {toRandom,toBall,rotate,count,play,chooseUser,clearLuckyMan,currentLuckyMan,isPlaying} from './tween'
import {getJSON,myAlert} from './utils'
import {CURR_LEVEL,setLevel,showPrize,CURR_LEFT_NUM,CURR_PRIZE,startLottery,showResult} from './roll'
var roll=function(){
    if(isPlaying){
        layer.msg('正在抽奖，请稍等')
        return
    }
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
var gui;
/**
 * 初始化用户界面
 */
var guiInit=function(){
    controller={
        '准备':play,
        '抽奖':roll,
        '奖品':'请选择',
        '奖品剩余':0,
        '当前奖品':'',
        '中奖名单汇总':function(){
            window.open('./result')
        }
    }
    gui=new dat.GUI({ autoPlace: false });
    gui.add(controller,'准备');
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
    gui.add(controller,'奖品剩余').min(0).step(1).listen()
    rollController=gui.add(controller,'抽奖');
    gui.add(controller,'中奖名单汇总')
    $('#gui_container').append(gui.domElement)
}

export {gui,controller,guiInit,rollController}