/**
 * User: DISI
 * Date: 12.08.13
 * Time: 21:11
 */
var resMessage = require('../../graphic_authoring/util/resMessage.js');
var socketHandlers = require('../../whiteboard/controller/socket');
var db = require('../../../_server/appDatabase.js' ).db;
var socketIo = require('socket.io');
var appSocket;
exports.startSocketIo = function(server){
    socketIo = socketIo.listen(server);
    socketIo.sockets.on('connection', function (socket) {
        appSocket = socket;
        var msg = {success:true, message:'hallo there!'};
        socket.emit('connected', msg);
        var artifact =new socketHandlers.Artifact(db, socket);
        var conn = new  socketHandlers.Connection(db, socket);
        var content = new socketHandlers.Content(db,socket);
        var comment = new socketHandlers.Comment(db, socket);
        socket.on('disconnect', function () {
            artifact.removeListeners();
            conn.removeListeners();
            content.removeListeners();
            comment.removeListeners();
        });
    });
}

exports.getSocket = function(){
    return appSocket;
}

