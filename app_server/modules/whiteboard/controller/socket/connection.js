/**
 * Created by fonpah on 21.05.2014.
 */
var Class = require('class.extend');
var mongodb = require('mongodb' );
var Connection = Class.extend({
    init: function(db,appSocket){
        var me = this;
        this.db = db;
        this.socket = appSocket;
        this.collection = this.db.collection('connections');
        this.socket.on('client/connection/create',function(data){me.createAction(data);});
        this.socket.on('client/connection/update', function(data){me.updateAction(data);});
        this.socket.on('client/connection/delete', function(data){me.deleteAction(data);});
    } ,
    updateAction:function(data){
        var me = this;
        var id = data._id;
        delete data._id;
        me.collection.update({_id:new mongodb.ObjectID(id)},{$set:data},{multi:false},function(err,record){
            if(err) return me.socket.emit('server/connection/update/feedback',{success:false,message:err.message});
            me.socket.emit('server/connection/update/feedback',{success:true,connection:{_id:id}});
            data._id = id;
            me.socket.broadcast.emit('server/connection/updated',{success:true,connection:data});

        });
    },
    deleteAction:function(data){
        var me = this;
        this.collection.remove({_id:new mongodb.ObjectID(data._id)},function(err){
            if(err) return me.socket.emit('server/connection/delete/feedback',{success:false,message:err.message});
            me.socket.emit('server/connection/delete/feedback',{success:true,connection:data});
            me.socket.broadcast.emit('server/connection/deleted',{success:true,connection:data});
        });
    },
    createAction:function(data){
        var me = this;
        delete data._id;
        this.collection.insert(data,function(err,record){
            if(err) return me.socket.emit('server/connection/create/feedback',{success:false,message:err.message});
            me.socket.emit('server/connection/create/feedback',{success:true,connection:record[0]});
            me.socket.broadcast.emit('server/connection/created',{success:true,connection:record[0]});
        });
    },
    removeListeners:function(){
        this.socket.removeAllListeners('client/connection/create');
        this.socket.removeAllListeners('client/connection/delete');
        this.socket.removeAllListeners('client/connection/update');

    }
});
module.exports = Connection;