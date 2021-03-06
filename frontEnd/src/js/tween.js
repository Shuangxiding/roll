/**
 * 补间动画
 */
import global from './global'
import {group,choosedGroup} from './3dScene'
import {pList,drawNum} from './number'
import {showResult} from './roll'
var states ={sphere: [], random: [], init: []}//不同状态（球，随机，点）下每个头像的状态（位置，大小）
var STATE_SPHERE=0,STATE_RANDOM=1,STATE_INIT=2;
var CURR_STATE=STATE_INIT;//当前状态
var isPlaying=false;//当前状态
var luckyManShowing=false;//当前状态
var currentLuckyMan;//当前被抽中的人

/**
 * 这里是一个简单的动画队列。
 * 把函数和参数push进队列中，每次动画执行完时检查队列，播放下一个动画
 */
var animates=[]
function updateAnimate(){
    if(isPlaying) return;
    else if(animates.length==0){
        return
    }
    else{
        var nextAnimate=animates.shift();
        isPlaying=true;
        nextAnimate.animateFunc(...nextAnimate.args);
    }
}
function buildAnimate(animateFunc,args){
    return {
        animateFunc:animateFunc,
        args:args?args:[]
    }
}
function onAnimateComplete(){
    group.rotation.x%=Math.PI*2;
    group.rotation.y%=Math.PI*2;
    group.rotation.z%=Math.PI*2;
    isPlaying=false;
    updateAnimate();
}
/**
 * 将选出的中奖者放回球里
 */
var clearLuckyMan=function(){
    if(luckyManShowing){
        for(var user of currentLuckyMan){
            var object=global.userMap[user.rtx].object
            var index=global.userMap[user.rtx].index
            // object.material.opacity=0;
            choosedGroup.remove(object)
            group.add(object)
            object.scale.set(1,1,1)
            object.position.copy(states.sphere[index].position)
            object.rotation.copy(states.sphere[index].rotation)
        }
        luckyManShowing=false;
    }
}

/**
 * 生成初始状态下每个坐标
 */
var updateInit=function(){
    states.init=[]
    var object = new THREE.Object3D();
    object.scale.set(0.01,0.01,0.01)
    for(var i=0;i<global.users.length;i++){
        states.init.push(object);
    }
}
/**
 * 生成球形下每个头像的坐标与大小
 * 这里采用了球面均匀分布的近似算法，效果较好。
 * 球面均匀分布是一个NP hard问题，不存在线性时间解法。
 * 另外用遗传算法解决这个问题也是很有意思的：球面上每个点有一个斥力，根据受力移动每个点，迭代下去直到稳定状态。
 */
var updateSphere=function(){
    states.sphere=[]
    var vector = new THREE.Vector3();
    for (var i = 0; i < global.users.length; i++) {
        var k = 1 - (2 * i + 1) / global.users.length;
        var phi = Math.acos(k);
        var theta = Math.sqrt(global.users.length * Math.PI) * phi;
        global.users[i].phi=phi;
        global.users[i].theta=theta;
        var object = new THREE.Object3D();
        object.position.x = 200 * Math.cos(theta) * Math.sin(phi);
        object.position.y = 200 * Math.sin(theta) * Math.sin(phi);
        object.position.z = 200 * Math.cos(phi);
        object.up.x=1;
        object.lookAt(vector);
        states.sphere.push(object);
    }
}
var updateRandom=function(){
    states.random=[]
    for(var i=0;i<global.users.length;i++){
        var object = new THREE.Object3D();
        object.position.x = Math.random() * 1000 - 500;
        object.position.y = Math.random() * 1000 - 500;
        object.position.z = Math.random() * 1000 - 500;
        states.random.push(object);
    }
}
function updateStates(){
    updateSphere();
    updateRandom();
    updateInit();
}
var nullFunc=function(){};
function toBall(){
    if(CURR_STATE==STATE_SPHERE){
        onAnimateComplete();
        return;
    }
    for (var i = 0; i < global.users.length; i++) {
        var position2sphere=new TWEEN.Tween(global.users[i].object.position)
                .to(states.sphere[i].position, 5000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onComplete(i==0?onAnimateComplete:nullFunc)
                .start();
        var rotation2sphere=new TWEEN.Tween(global.users[i].object.rotation)
                .to(
                        {
                            x: states.sphere[i].rotation.x,
                            y: states.sphere[i].rotation.y,
                            z: states.sphere[i].rotation.z
                        },
                        5000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        var scaleBall=new TWEEN.Tween(global.users[i].object.scale)
                .to(
                        {
                            x: 1,
                            y: 1,
                            z: 1
                        },
                        3000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
    }
    CURR_STATE=STATE_SPHERE;
}
function toInit(){
    if(CURR_STATE==STATE_INIT) return;
    for (var i = 0; i < global.users.length; i++) {
        var position2sphere=new TWEEN.Tween(global.users[i].object.position)
                .to({x:0,y:0,z:0}, 5000)
                .easing(TWEEN.Easing.Exponential.InOut)
                onComplete(i==0?onAnimateComplete:nullFunc)
                .start();
        var rotation2sphere=new TWEEN.Tween(global.users[i].object.rotation)
                .to(
                        {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        5000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        var scaleBall=new TWEEN.Tween(global.users[i].object.scale)
                .to(
                        {
                            x: 0.001,
                            y: 0.001,
                            z: 0.001
                        },
                        3000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
    }
    CURR_STATE=STATE_INIT;
}

function toRandom(time,isDelay){
    updateRandom();
    for (var i = 0; i < global.users.length; i++) {
        var positionBoom=new TWEEN.Tween(global.users[i].object.position)
                .to(states.random[i].position, time?time:3000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onComplete(i==0?function(){
                    if(isDelay){
                        setTimeout(onAnimateComplete,1000)
                    }
                    else{
                        onAnimateComplete();
                    }
                }:nullFunc)
                .delay(isDelay?Math.random()*1000:0)
                .start();
        var scaleBoom=new TWEEN.Tween(global.users[i].object.scale)
                .to(
                        {
                            x: 1,
                            y: 1,
                            z: 1
                        },
                        time?time:3000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .delay(isDelay?Math.random()*1000:0)
                .start();
    }
    CURR_STATE=STATE_RANDOM;
}
/**
 * 倒计时
 */
function count(){
    for(var i=3;i>=0;i--){
        animates.push(buildAnimate(toRandom,[1000]))
        animates.push(buildAnimate(toNum,[i]))
    }
    updateAnimate();
}
/**
 * 照片拼出数字，0~10
 */
function toNum(num){
    drawNum(num,global.users.length)
    new TWEEN.Tween(group.rotation)
            .to({x:0,y:0,z:0},2000)
            .easing(TWEEN.Easing.Quintic.InOut)
            .start();
    for (var i = 0; i < global.users.length; i++) {
        new TWEEN.Tween(global.users[i].object.position)
                .to({
                        x:pList[i].x,
                        y:pList[i].y,
                        z:Math.random()-0.5
                    }, 2000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onComplete(i==0?onAnimateComplete:nullFunc)
                .start();
        new TWEEN.Tween(global.users[i].object.scale)
                .to(
                        {
                            x: 0.15,
                            y: 0.15,
                            z: 0.15
                        },
                        2000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        new TWEEN.Tween(global.users[i].object.rotation)
                .to(
                        {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        2000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
    }
}
function rotate() {
    var targetRotation={
        x: Math.PI*(20+Math.random()*2),
        y: Math.PI*(20+Math.random()*2),
        z: Math.PI*(20+Math.random()*2)
    }
    var rotation=new TWEEN.Tween(group.rotation)
            .to(targetRotation,4000)
            .easing(TWEEN.Easing.Quintic.InOut)
            .onComplete(onAnimateComplete)
            .start();
}
function rotateAroundWorldAxis(object, axis, radians) {
    var rotWorldMatrix;
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);               
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
}
/**
 * 旋转到指定位置
 */
var rotateToUser=function(rtx){
    var object=new THREE.Object3D();
    var theta=global.userMap[rtx].theta;
    var phi=global.userMap[rtx].phi;
    object.rotateZ(-theta);
    object.updateMatrix();
    var yAxis=new THREE.Vector3(0,1,0);
    rotateAroundWorldAxis(object,yAxis,-phi)
    new TWEEN.Tween(group.rotation)
            .to({
                x:object.rotation.x+20*Math.PI,
                y:object.rotation.y+20*Math.PI,
                z:object.rotation.z+20*Math.PI
            },4000)
            .easing(TWEEN.Easing.Quintic.InOut)
            .onComplete(onAnimateComplete)
            .start();
}
/**
 * 让一个头像从当前位置飞出
 */
var showUser=function(rtx){
    console.log(rtx)
    var object=global.userMap[rtx].object;
    object.updateMatrixWorld();
    object.material.transparent=true
    //物体坐标与世界坐标的转换
    var vector = new THREE.Vector3();
    vector.setFromMatrixPosition( object.matrixWorld );
    object.position.copy(vector)
    object.rotation.set(0,0,0)
    group.remove(object)
    choosedGroup.add(object)
    new TWEEN.Tween(object.position)
            .to({
                x:0,y:200,z:201
                }, 2000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    new TWEEN.Tween(object.scale)
            .to({
                x:10,y:10,z:10
                }, 2000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(function(){
                onAnimateComplete();
                luckyManShowing=true;
                currentLuckyMan=[global.userMap[rtx]];
                showResult(currentLuckyMan);
            })
            .start();
    updateStates();
}
var showUsers=function(luckyMan){
    var num=luckyMan.length;
    var width=1;
    while(width*width<num) width++;
    var scale=20/width;
    var time=8000/num;
    var step=400/width;
    var showMan=function(i){
        if(i==num){
            return;
        }
        var x=i%width;
        var y=(i-x)/width;
        var object=global.userMap[luckyMan[i].rtx].object;
        object.updateMatrixWorld();
        object.material.transparent=true
        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition( object.matrixWorld );
        object.position.copy(vector)
        object.rotation.set(0,0,0)
        group.remove(object)
        choosedGroup.add(object)
        new TWEEN.Tween(object.position)
            .to({
                x:-200+x*step,y:200-y*step,z:201
                }, 2000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        new TWEEN.Tween(object.scale)
            .to({
                x:scale,y:scale,z:scale
                }, 2000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        setTimeout(showMan,time,i+1)
    }
    setTimeout(showMan,1000,0)
    new TWEEN.Tween(group.rotation)
        .to({
            x:25*Math.PI,
            y:25*Math.PI,
            z:25*Math.PI
        },12000)
        .easing(TWEEN.Easing.Quintic.InOut)
        .onComplete(function(){
            luckyManShowing=true;
            currentLuckyMan=luckyMan;
            showResult(luckyMan)
            onAnimateComplete();
        })
        .start();

}
var chooseUser=function(rtx){
    // animates.push(buildAnimate(toRandom,[1000,true]));
    animates.push(buildAnimate(toBall))
    animates.push(buildAnimate(rotateToUser,[rtx]))
    animates.push(buildAnimate(showUser,[rtx]))
    updateAnimate();
}
/**
 * 抽奖抽中某人
 */
var chooseUsers=function(luckyMan){
    if(luckyMan.length==1){
        chooseUser(luckyMan[0].rtx)
    }
    else{
        animates.push(buildAnimate(toBall))
        animates.push(buildAnimate(showUsers,[luckyMan]))
        updateAnimate();
    }
}
/**
 * 准备阶段的动画
 */
var play=function(){
    // count();
    animates.push(buildAnimate(toBall))
    updateAnimate()
}
export {toRandom,toBall,rotate,count,play,updateStates,chooseUsers,clearLuckyMan,currentLuckyMan,isPlaying};