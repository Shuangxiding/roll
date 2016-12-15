import global from './global'
var canvas = document.createElement('canvas')
document.body.appendChild(canvas)
canvas.width=200
canvas.height=200
var ctx = canvas.getContext('2d')
var pList=[];
var len=200;
var offX=50,offY=170
function drawNum(num){
    offX=num>=10?0:50;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font='200px monospace'
    ctx.fillText(num,offX,offY)
    
    window.imgData=ctx.getImageData(0,0,len,len)
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
    var rate=(list.length-list.length%global.peopleCnt)/global.peopleCnt;
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