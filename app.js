var async = require('async');
var express = require('express');
var http = require('http');

var path = require('path');

var app;
async.series([
    function(callback){
        require('./app_server/_server/appDatabase.js').connect(function () {
            console.log("1/4. Database connection ready.");

            callback();
        });
    },
    function(callback){
        require('./app_server/_server/appExpress.js').setConfig(express, path, function(resApp){
            app = resApp;
            console.log("2/4. Application configuration ready.");
            callback()
        });
    },
    function(callback){

        console.log('   . Initailising custom middlewares');
        callback();
    },
    function(callback){
        app = require('./app_server/routes/whiteboard.js')(app);
        app.port = app.get('port');
        app.server = http.createServer(app).listen(app.port, function(){
            console.log("3/4. Http service ready.");
            callback();
        });
    },
    function(callback){
        require('./app_server/modules/_common/controller/socket.js').startSocketIo(app.server);
        console.log("4/4. Socket service ready.");
        callback();
    }
], function(){
    console.log("---== Application listening on port " + app.port + " has been successfully started ==---");
    require('./app_server/_server/appRunMeta.js').readDevInfo();

});





