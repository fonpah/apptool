/**
 * Created by fonpah on 25.05.2014.
 */
var Class = require('class.extend');
var mongodb = require('mongodb' );
var Content = Class.extend({
    init: function(db,appSocket){
        var me = this;
        this.db = db;
        this.socket = appSocket;
        this.collection = this.db.collection('contents');
        this.socket.on('/content/create',function(data){me.createAction(data);});
        this.socket.on('/content/update', function(data){me.updateAction(data);});
        this.socket.on('/content/delete', function(data){me.deleteAction(data);});
        this.socket.on('/contents', function(data){me.listAction(data);});
    } ,
    updateAction:function(data){
        var me = this;
        var id = data._id;
        delete data._id;
        me.collection.findAndModify({_id:new mongodb.ObjectID(id)},[],{$set:data},{new:true},function(err, doc){
            if(err) return me.socket.emit('/content/update',{success:false,message:err.message});
            me.socket.broadcast.emit('/content/update',{success:true,content:doc});
            me.socket.emit('/content/update',{success:true,message:'ok'});
        });
    },
    deleteAction:function(data){
        var me = this;
        this.collection.findOne({_id:new mongodb.ObjectID(data._id)},function(err,doc){
            if(err) return me.socket.emit('/content/delete',{success:false,message:err.message});
            var model= doc;
            me.collection.remove({_id:new mongodb.ObjectID(data._id)},function(err){
                if(err) return me.socket.emit('/content/delete',{success:false,message:err.message});
                me.socket.emit('/content/delete',{success:true,content:data});
                me.socket.broadcast.emit('/content/delete',{success:true,content:model});
            });

        });
    },
    createAction:function(data){
        var me = this;
        this.collection.insert(data,function(err,records){
            if(err) return me.socket.emit('/content/create',{success:false,message:err.message});
            me.socket.emit('/content/create',{success:true,content:records});
            me.socket.broadcast.emit('/content/create',{success:true,content:records});
        });
    },
    removeListeners:function(){
        this.socket.removeAllListeners('/content/create');
        this.socket.removeAllListeners('/content/delete');
        this.socket.removeAllListeners('/content/update');
        this.socket.removeAllListeners('/contents');

    },
    listAction:function(data){
        var me = this;
        var  id = data.activityId;
        if(!id){
            return this.socket.emit('/contents',{success:false,message:'Invalid Id'});
        }
        this.collection.find({activityId : id } ).toArray(function(err, records){
            if(err) return me.socket.emit('/contents',{success:false,message:err.message});

            return me.socket.emit('/contents',{success:true,content:records});
        });
    }
});
module.exports = Content;