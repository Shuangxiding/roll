/**
 * 入口文件
 */
import '../css/index.css'

import global from './global'
import preload from './preload'
import {initScene,animate,initUsers} from './3dScene'
import {updateStates,clearLuckyMan} from './tween'
import {guiInit} from './gui'
var pageBind=function(){
    $('btn_back').on('click',function(){
        $('#page_list').hide();
        clearLuckyMan();
    })
}
function threeStart() {
    initScene();
    preload(function(){
        initUsers();
        updateStates();
        guiInit();
        animate();
    });
}
window.onload = threeStart();
// (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='http://sqimg.qq.com/qq_product_operations/mma/javanli_test/lib/stats.min.js';document.head.appendChild(script);})()