/**
 * 资源预加载
 */
import global from './global'
import {getJSON} from './utils'
export default function preload(callback){
    getJSON(global.serverPath+'/index/all_users',function(result){
        var users=result.users;
        global.users=users;
        for(var i=0;i<users.length;i++){
            users[i].map=new THREE.TextureLoader().load(global.serverPath+'/images/lottery/'+users[i].rtx+'.png')
            users[i].index=i
            global.userMap[users[i].rtx]=users[i]
        }
        console.log(global.users)
        callback();
    })
}