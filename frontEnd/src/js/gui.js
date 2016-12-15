import {toRandom,toBall,rotate,count,play} from './tween'
import {objects} from './3dScene'
var gui=new dat.GUI();
var controller={
    play:play,
    toRandom:toRandom,
    toBall:toBall,
    rotate:rotate,
    count:count,
    scale:0.1,
}
gui.add(controller,'play');
gui.add(controller,'toRandom');
gui.add(controller,'toBall');
gui.add(controller,'rotate');
gui.add(controller,'count');
var scaleWatcher=gui.add(controller,'scale',0,2)
scaleWatcher.onChange(function(value){
    for(var i=0;i<objects.length;i++){
        objects[i].scale.set(value,value,value)
    }
})