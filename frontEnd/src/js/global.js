var imgs=[];
for(var i=0;i<200;i++){
    var cnt=Math.floor(Math.random()*112+2);
    imgs.push('http://sqimg.qq.com/qq_product_operations/mma/javanli_test/rolls/imgs/pic' + cnt + '.jpg');
}
export default {
    coordsVisible:false,
    outlineVisible:true,
    imgs:imgs,
    peopleCnt:imgs.length,
    maps:[]
}