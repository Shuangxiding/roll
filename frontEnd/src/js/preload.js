import global from './global'
export default function preload(){
    for(var i=0;i<global.imgs.length;i++){
        global.maps.push(new new THREE.TextureLoader().load(global.imgs[i]));
    }
}