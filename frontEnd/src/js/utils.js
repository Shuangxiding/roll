/**
 * 工具函数
 */

/**
 * [统一获取数据的接口]
 * @param  {[type]}   url      [访问的url地址]
 * @param  {Function} callback [回调方法]
 * @return {[type]}            [description]
 */
var getJSON = function(url, callback) {
    url += url.indexOf("?") < 0 ? "?" : "&";
    $.getJSON(url + 'r=' + Math.random(), function(json) {
        console.log(json)
        if (json.recode == 0) {
            callback(json);
        } else {
            if (json.recode == -1) {
                myAlert(json.content);
            } else {
                myAlert('抽奖接口发生错误');
            }
        }
    }).error(function() {
        myAlert('抽奖接口发生错误');
    });
};

var myAlert = function(msg) {
    layer.alert(msg);
};

export {getJSON,myAlert}