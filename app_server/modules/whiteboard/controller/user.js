/**
 * Created by fonpah on 20.05.2014.
 */
var Class = require('class.extend');
var mongodb = require('mongodb' );
var User = Class.extend({
    init: function(db,appSocket){
        this.db = db;
        this.socket = appSocket;
        this.collection = this.db.collection('users');
    } ,
    updateAction:function(req, res, next){

    },
    readAction:function(req, res, next){
        return res.json({success:true,user:{
            id:'1234d5d6e87e98tzh31s97arz56478r',
            firstName:'john',
            lastName:'doe',
            role:'student'
        }});
    },
    deleteAction:function(req, res, next){

    },
    createAction:function(req, res, next){

    },
    listAction:function(req, res, next){

    }
});
module.exports = User;