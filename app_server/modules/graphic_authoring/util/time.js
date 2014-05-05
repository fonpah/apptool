/**
 * User: Disi
 * Date: 30.06.13
 * Time: 12:55
 * Description: TODO
 */
var dateFormat = require('dateformat');

exports.currentSStamp = function(){
    var now = new Date();
//    var time = dateFormat(now, 'yyyy-mm-dd HH:MM:ss');
    var time = dateFormat(now, 'isoDateTime');
    return time;
}
exports.todayStamp = function(){
    var now = new Date();
    var time = dateFormat(now, 'yymmdd');
    return time;
}