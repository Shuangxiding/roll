/**
 * 入口文件
 */
import '../css/index.css'

import global from './global'
import preload from './preload'
import {initScene,animate,initUsers} from './3dScene'
import {updateStates,clearLuckyMan} from './tween'
import {guiInit,gui} from './gui'
/**
 * dom事件绑定
 */
var pageBind=function(){
    $('#btn_back').on('click',function(){
        $('#page_list').hide();
        gui.domElement.style.display='block';
        clearLuckyMan();
    })
}
/**
 * 开始：
 * 初始化场景，加载用户头像，坐标初始化，用户界面初始化，开始动画循环，绑定事件
 */
function start() {
    initScene();
    preload(function(){
        initUsers();
        updateStates();
        guiInit();
        animate();
        pageBind();
    });
}
window.onload = start();
// (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='http://sqimg.qq.com/qq_product_operations/mma/javanli_test/lib/stats.min.js';document.head.appendChild(script);})()