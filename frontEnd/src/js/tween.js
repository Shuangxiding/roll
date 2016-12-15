import global from './global'
import {objects,group,choosedGroup,choosedObjects} from './3dScene'
import {pList,drawNum} from './number'
var states ={sphere: [], random: [], init: []}
window.states=states
var animates=[]
var isPlaying=false;
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
var updateInit=function(){
    states.init=[]
    var object = new THREE.Object3D();
    object.scale.set(0.01,0.01,0.01)
    for(var i=1;i<=global.peopleCnt;i++){
        states.init.push(object);
    }
}
var updateSphere=function(){
    states.sphere=[]
    var vector = new THREE.Vector3();
    for (var i = 1; i <= objects.length; i++) {
        var k = 1 - (2 * i - 1) / objects.length;
        var phi = Math.acos(k);
        var theta = Math.sqrt(objects.length * Math.PI) * phi;
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
    for(var i=0;i<objects.length;i++){
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
updateStates();
var nullFunc=function(){};
function toBall(){
    for (var i = 0; i < objects.length; i++) {
        var position2sphere=new TWEEN.Tween(objects[i].position)
                .to(states.sphere[i].position, 5000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onComplete(i==0?onAnimateComplete:nullFunc)
                .start();
        var rotation2sphere=new TWEEN.Tween(objects[i].rotation)
                .to(
                        {
                            x: states.sphere[i].rotation.x,
                            y: states.sphere[i].rotation.y,
                            z: states.sphere[i].rotation.z
                        },
                        5000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        var scaleBall=new TWEEN.Tween(objects[i].scale)
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
}
function toInit(){
    for (var i = 0; i < objects.length; i++) {
        var position2sphere=new TWEEN.Tween(objects[i].position)
                .to({x:0,y:0,z:0}, 5000)
                .easing(TWEEN.Easing.Exponential.InOut)
                onComplete(i==0?onAnimateComplete:nullFunc)
                .start();
        var rotation2sphere=new TWEEN.Tween(objects[i].rotation)
                .to(
                        {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        5000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        var scaleBall=new TWEEN.Tween(objects[i].scale)
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
}

function toRandom(time,isDelay){
    updateRandom();
    for (var i = 0; i < objects.length; i++) {
        var positionBoom=new TWEEN.Tween(objects[i].position)
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
        var scaleBoom=new TWEEN.Tween(objects[i].scale)
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
}
function count(){
    for(var i=10;i>=0;i--){
        animates.push(buildAnimate(toRandom,[1000]))
        animates.push(buildAnimate(toNum,[i]))
    }
    updateAnimate();
}
/**
 * 照片拼出数字，0~10
 */
function toNum(num){
    drawNum(num)
    new TWEEN.Tween(group.rotation)
            .to({x:0,y:0,z:0},2000)
            .easing(TWEEN.Easing.Quintic.InOut)
            .start();
    for (var i = 0; i < objects.length; i++) {
        new TWEEN.Tween(objects[i].position)
                .to({
                        x:pList[i].x,
                        y:pList[i].y,
                        z:Math.random()-0.5
                    }, 2000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onComplete(i==0?onAnimateComplete:nullFunc)
                .start();
        new TWEEN.Tween(objects[i].scale)
                .to(
                        {
                            x: 0.15,
                            y: 0.15,
                            z: 0.15
                        },
                        2000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        new TWEEN.Tween(objects[i].rotation)
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
var rotateToIndex=function(index){
    var k = 1 - (2 * index + 1) / global.peopleCnt;
    var phi = Math.acos(k);
    var theta = Math.sqrt(global.peopleCnt * Math.PI) * phi;
    var object=new THREE.Object3D();
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
var showIndex=function(index){
    var object=objects[index];
    object.updateMatrixWorld();
    object.material.transparent=true
    var vector = new THREE.Vector3();
    vector.setFromMatrixPosition( object.matrixWorld );
    object.position.copy(vector)
    object.rotation.set(0,0,0)
    group.remove(object)
    choosedGroup.add(object)
    objects.splice(index,1);
    choosedObjects.push(object)
    new TWEEN.Tween(object.position)
            .to({
                x:-200,y:200,z:200
                }, 2000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    new TWEEN.Tween(object.scale)
            .to({
                x:3,y:3,z:3
                }, 2000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .chain(new TWEEN.Tween(object.material)
                .to({
                    opacity:0
                    }, 2000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onComplete(function(){
                    onAnimateComplete();
                })
            )
            .start();
    updateStates();
}

var chooseOne=function(){
    animates.push(buildAnimate(toRandom,[1000,true]));
    animates.push(buildAnimate(toBall))
    var index=Math.floor(Math.random()*objects.length);
    animates.push(buildAnimate(rotateToIndex,[index]))
    animates.push(buildAnimate(showIndex,[index]))
}
function play(){
    animates.push(buildAnimate(toRandom,[2000,true]));
    count();
    chooseOne()
    chooseOne()
    chooseOne()
    updateAnimate()
}
export {toRandom,toBall,rotate,count,play,updateStates};