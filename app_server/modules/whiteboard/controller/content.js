/**
 * Created by fonpah on 20.05.2014.
 */
var Class = require('class.extend');
var mongodb = require('mongodb' );
var Content = Class.extend({
    init: function(db,appSocket){
        this.db = db;
        this.socket = appSocket;
        this.collection = this.db.collection('contents');
    } ,
    updateAction:function(req, res, next){
        var data = req.body.content;
        var me = this;
        var id = data._id;
        delete data._id;
        this.collection.update({_id:new mongodb.ObjectID(id)},{$set:data},{multi:false},function(err,record){
            if(err) return res.json({success:false,message:err.message});
            res.json({success:true,message:'ok'});

        });
        //next();
    },
    readAction:function(req, res, next){
        var  id = req.param('artifactId');
        if(!id){
            return res.json({success:false,message:'Invalid Id'});
        }
        this.collection.findOne({artifactId:id},function(err,record){
            if(err) return res.json({success:false,message:err.message});
            res.json({success:true,content:record||{}});

        });
    },
    deleteAction:function(req, res, next){
        var data = req.body.content;
        var me = this;
        this.collection.remove({_id:new mongodb.ObjectID(data._id)},function(err){
            if(err) return res.json({success:false,message:err.message});
            return res.json({success:true,message:'ok'});
        });

    },
    createAction:function(req, res, next){
        var data = req.body.content;
        var me = this;
        delete data._id;
        this.collection.insert(data,function(err,record){
            if(err) return res.json({success:false,message:err.message});
            return res.json({success:true,content:record[0]});
        });
    },
    listAction:function(req, res, next){
        var  id = req.param('id');
        if(!id){
            return res.json({success:false,message:'Invalid Id'});
        }
        this.collection.find({activityId : id } ).toArray(function(err, records){
            if(err) return res.json({success:false,message:err.message});
            return res.json({success:true,contents:records});
        });
    }
});
module.exports = Content;