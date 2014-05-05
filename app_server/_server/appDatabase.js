/**
 * User: Disi
 * Date: 30.06.13
 * Description:
 */
var appRunMeta = require('./appRunMeta.js');
exports.connect = function(next){

    var MongoClient = require('mongodb').MongoClient
        , format = require('util').format;

    var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
    var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : 27017;

    console.log("Connecting to database " + host + ":" + port);

    MongoClient.connect(format("mongodb://%s:%s/" + appRunMeta.database, host, port), function(err, db){
        if(err) throw err;
        exports.db = db;
        next();
    });
}

exports.isEnsureIndex = false;



