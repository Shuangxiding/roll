import global from './global'
import drawCoords from './coords'
var width, height;
var renderer, camera, scene, light;
var group,choosedGroup;
var objects=[],choosedObjects=[];
window.group=group;
window.choosedGroup=choosedGroup;
window.objects=objects;
window.choosedObjects=choosedObjects;
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

    //init object
    group=new THREE.Group();
    choosedGroup=new THREE.Group();
    window.choosedGroup=choosedGroup
    scene.add(group);
    scene.add(choosedGroup)
    var geometry = new THREE.PlaneGeometry(40, 40);
    for (var i = 0; i < global.peopleCnt; i++) {
        var material = new THREE.MeshBasicMaterial({color: 0xeeeeee, side: THREE.DoubleSide});
        material.map = global.maps[i];
        var object = new THREE.Mesh(geometry, material);
        object.position.x = Math.random() * 2 - 1;
        object.position.y = Math.random() * 2 - 1;
        object.position.z = Math.random() * 2 - 1;
        object.scale.x=0.001;
        object.scale.y=0.001;
        object.scale.z=0.001;
        objects.push(object);
        group.add(object);
    }

    if(global.coordsVisible) {
        drawCoords(scene,group);
    }
    if(global.outlineVisible){
        outline=new THREE.LineSegments(new THREE.EdgesGeometry( geometry ),new THREE.LineBasicMaterial( { color: 0xffd700,lineWidth:2 } ));
        group.add(outline);
    }
    initControls();
}
var controls;
var outline;
function initControls() {
    controls = new THREE.TrackballControls(camera,renderer.domElement);

    controls.rotateSpeed = 4;
    controls.zoomSpeed = 0.1;
    controls.noRotate=true;
    controls.noPan=true;
    controls.minDistance = 400;
    controls.maxDistance = 6000;
}
function updateOutline() {
    var minD=2000*2000;
    var choosed=100;
    for(var i=0;i<objects.length;i++){
        var v=new THREE.Vector3();
        v.setFromMatrixPosition(objects[i].matrixWorld);
        if(v.z>0) {
            var d = v.x*v.x+v.y*v.y;
            if(d<minD){
                minD=d;
                choosed=i;
            }
        }
    }
    outline.position.copy(objects[choosed].position);
    outline.scale.copy(objects[choosed].scale);
    outline.scale.multiplyScalar(1.02);
    outline.rotation.copy(objects[choosed].rotation);
}

function animate(){
    requestAnimationFrame(animate);
    render();
}
function render() {
    if(global.outlineVisible){
        updateOutline();
    }
    controls.update();
    TWEEN.update();
    renderer.render(scene, camera);
}
export {initScene,animate,group,objects,choosedGroup,choosedObjects}