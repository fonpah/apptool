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
        this.socket.on('/connection/create',function(data){me.createAction(data);});
        this.socket.on('/connection/update', function(data){me.updateAction(data);});
        this.socket.on('/connection/delete', function(data){me.deleteAction(data);});
        this.socket.on('/connections', function(data){me.listAction(data);});
    } ,
    updateAction:function(data){
        var me = this;
        var id = data._id;
        delete data._id;
        me.collection.findAndModify({_id:new mongodb.ObjectID(id)},[],{$set:data},{new:true},function(err, doc){
            if(err) return me.socket.emit('/connection/update',{success:false,message:err.message});
            me.socket.emit('/connection/update',{success:true,message:'ok'});
            me.socket.broadcast.emit('/connection/update',{success:true,connection:doc});
        });
    },
    deleteAction:function(data){
        var me = this;
        var ids= [];
        if(Array.isArray(data)){
            for(var i=0; i<data.length;i++){
                ids.push(new mongodb.ObjectID(data[i]._id));
            }
        }else{
            ids.push(new mongodb.ObjectID(data._id));
        }
        this.collection.find({_id:{$in:ids}} ).toArray(function(err,docs){
            if(err) return me.socket.emit('/connection/delete',{success:false,message:err.message});
            var models= docs;
            me.collection.remove({_id:{$in:ids}},function(err){
                if(err) return me.socket.emit('/connection/delete',{success:false,message:err.message});

                me.socket.emit('/connection/delete',{success:true,message:'ok'});

                me.socket.broadcast.emit('/connection/delete',{success:true,connection:models});
            });

        });
    },
    createAction:function(data){
        var me = this;
        this.collection.insert(data,function(err,records){
            if(err) return me.socket.emit('/connection/create',{success:false,message:err.message});
            me.socket.emit('/connection/create',{success:true,connection:records});
            me.socket.broadcast.emit('/connection/create',{success:true,connection:records});
        });
    },
    removeListeners:function(){
        this.socket.removeAllListeners('/connection/create');
        this.socket.removeAllListeners('/connection/delete');
        this.socket.removeAllListeners('/connection/update');
        this.socket.removeAllListeners('/connections');

    },
    listAction:function(data){
        var me = this;
        var  id = data.activityId;
        if(!id){
            return this.socket.emit('/connections',{success:false,message:'Invalid Id'});
        }
        this.collection.find({activityId : id } ).toArray(function(err, records){
            if(err) return me.socket.emit('/connections',{success:false,message:err.message});

            return me.socket.emit('/connections',{success:true,connection:records});
        });
    }
});
module.exports = Connection;