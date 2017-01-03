/**
 * THREE.js相关，场景绘制，动画循环
 */
import global from './global'
import drawCoords from './coords'
var width, height;
var renderer, camera, scene, light;
var group,choosedGroup,bgObject;
function initScene() {
    //init renderer
    width = document.getElementById('three_canvas').clientWidth;
    height = document.getElementById('three_canvas').clientHeight;
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('three_canvas'),
        antialias : true,
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1.0);

    //init camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 1000;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt({
        x: 0,
        y: 0,
        z: 0
    });

    //init scene
    scene = new THREE.Scene();


    //init background
    var bgGeometry=new THREE.PlaneGeometry(2400,1200);
    var bgMaterial=new THREE.MeshBasicMaterial({color: 0xeeeeee});
    bgMaterial.map=new THREE.TextureLoader().load('./images/mybg.jpg')
    bgObject = new THREE.Mesh(bgGeometry, bgMaterial);
    bgObject.position.z=-300;
    scene.add(bgObject)
}
var initUsers=function(){
    //init object
    group=new THREE.Group();
    choosedGroup=new THREE.Group();
    scene.add(group);
    scene.add(choosedGroup)
    var geometry = new THREE.PlaneGeometry(8000/global.users.length, 8000/global.users.length);
    for (var i = 0; i < global.users.length; i++) {
        var material = new THREE.MeshBasicMaterial({color: 0xeeeeee, side: THREE.DoubleSide});
        material.map = global.users[i].map;
        var object = new THREE.Mesh(geometry, material);
        global.users[i].object=object;
        object.position.x = Math.random() * 2 - 1;
        object.position.y = Math.random() * 2 - 1;
        object.position.z = Math.random() * 2 - 1;
        object.scale.x=0.001;
        object.scale.y=0.001;
        object.scale.z=0.001;
        group.add(object);
    }
}
function animate(){
    requestAnimationFrame(animate);
    render();
}
function render() {
    if(global.outlineVisible){
        updateOutline();
    }
    TWEEN.update();
    renderer.render(scene, camera);
}
export {initScene,initUsers,animate,group,choosedGroup}