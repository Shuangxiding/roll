import '../css/index.css'

import global from './global'
import preload from './preload'
import {initScene,animate} from './3dScene'
import {updateStates} from './tween'
import gui from './gui'
function threeStart() {
    preload();
    initScene();
    updateStates();
    setTimeout(function(){
        animate();
    },100);//给预加载一点时间，回头改
}
window.onload = threeStart();
(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='http://sqimg.qq.com/qq_product_operations/mma/javanli_test/lib/stats.min.js';document.head.appendChild(script);})()