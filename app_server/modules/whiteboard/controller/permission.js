/**
 * Created by fonpah on 03.06.2014.
 */
var Class = require('class.extend');
var mongodb = require('mongodb' );
var Permission = Class.extend({
    init: function(db,appSocket){
        this.db = db;
        this.socket = appSocket;
        this.collection = this.db.collection('permissions');
    }
});
module.exports= Permission;