/**
 * 绘制数字并返回每个照片的坐标，用于倒计时动画。
 * 倒计时动画已取消。--2017/1/6 javanli
 * 以目前人数来看，对每个头像单独应用补间动画会出现卡顿，估计卡顿主要来自tween.js而不是three.js。
 */
import global from './global'
var canvas = document.createElement('canvas')
canvas.width=200
canvas.height=200
var ctx = canvas.getContext('2d')
var pList=[];
var len=200;
var offX=0,offY=170
function drawNum(num,userCnt){
    offX=num>=10?0:50;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font='200px monospace'
    ctx.fillText(num,offX,offY)
    
    var imgData=ctx.getImageData(0,0,len,len)
    var i,j
    var list=[]
    pList=[]
    for(i=0;i<len;i++){
        for(j=0;j<len;j++){
            if(getA(imgData,i,j)!=0){
                list.push({x:(i-len/2)*2,y:(len/2-j)*2})
            }
        }
    }
    var rate=(list.length-list.length%userCnt)/userCnt;
    var flag=1
    for(var i=0;i<list.length;i++){
        if(flag==rate){
            flag=0
            pList.push(list[i-Math.floor(rate*Math.random())])
        }
        flag++
    }
};
function getR(imgData,i,j){
    return imgData.data[ (j*imgData.width + i)*4]
}
function getG(imgData,i,j){
    return imgData.data[ (j*imgData.width + i)*4+1]
}
function getB(imgData,i,j){
    return imgData.data[ (j*imgData.width + i)*4+2]
}
function getA(imgData,i,j){
    return imgData.data[ (j*imgData.width + i)*4+3]
}
function getColor(imgData,i,j){
    return getR(imgData,i,j)*256*256+getG(imgData,i,j)*256+getB(imgData,i,j)
}

export {pList,drawNum}