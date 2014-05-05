/**
 * User: DISI
 * Date: 12.08.13
 * Time: 21:11
 */
var resMessage = require('../../graphic_authoring/util/resMessage.js');

var socketIo = require('socket.io');

var appSocket;
exports.startSocketIo = function(server){
    socketIo = socketIo.listen(server);
    socketIo.sockets.on('connection', function (socket) {
        appSocket = socket;
        var msg = resMessage.setTrueTextRes('key154');
        socket.emit('connected', msg);
       /* console.log(msg.body);

        socket.on('disconnect', function (data) {
            console.log(data);
        });*/
    });
}

exports.getSocket = function(){
    return appSocket;
}

