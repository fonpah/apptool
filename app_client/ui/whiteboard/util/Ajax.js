/**
 * Created by fonpah on 05.04.2014.
 */
Ext.define('App.util.Ajax', {
    decodeJSON: App.util.decodeJSON,
    loadPropertyForm: function ( callback) {
        var me = this;
        Ext.Ajax.request({
            url: '/whiteboard/property/form',
            success: function (conn, res, opts, eOpts) {
                var result = me.decodeJSON(conn.responseText, true);

                if (result.success) {
                    callback(result.form);
                }
                else {
                    App.current.util.showErrorMsg(result.message);
                }
            },
            failure: function (conn, res, opts, eOpts) {
                Ext.JSON.decode(conn.responseText, true);
                App.current.util.showErrorMsg('Oh no! Something went wrong!');
            }
        });
    },
    loadActivity: function(id, callback){
        var me = this;
        Ext.Ajax.request({
            url: '/whiteboard/activity/' + id,
            success: function (conn, res, opts, eOpts) {
                var result = me.decodeJSON(conn.responseText, true);

                if (result.success) {
                    callback(result.activity);
                }
                else {
                    App.util.showErrorMsg(result.message);
                }
            },
            failure: function (conn, res, opts, eOpts) {
                Ext.JSON.decode(conn.responseText, true);
                App.util.showErrorMsg('Oh no! Something went wrong!');
            }
        });
    },
    loadArtifactTypes: function(){
        Ext.define('Artifact', {
            extend: 'Ext.data.Model',
            fields: [
                {type: 'string', name: 'value'},
                {type: 'string', name: 'name'}
            ]
        });

        var types = [
            {
                name:'Solution',
                value:'solution'
            }
        ];
        return Ext.create('Ext.data.Store', {
            autoDestroy: true,
            model: 'Artifact',
            data: types
        });
    },
    saveWorkspace: function(id ,workspace){
        var me = this;
        Ext.Ajax.request({
            url: '/whiteboard/save/' + id,
            params:{
                workspace:JSON.stringify(workspace)
            },
            success: function (conn, res, opts, eOpts) {
                var result = me.decodeJSON(conn.responseText, true);

                if (result.success) {
                }
                else {
                    App.util.showErrorMsg(result.message);
                }
            },
            failure: function (conn, res, opts, eOpts) {
                Ext.JSON.decode(conn.responseText, true);
                App.util.showErrorMsg('Oh no! Something went wrong!');
            }
        });
    },
    saveArtifact: function(figure, callback){
        var me = this;
        Ext.Ajax.request({
            url: '/whiteboard/artifact/save/' + figure.activityId,
            params:{data:JSON.stringify(figure.getPersistentAttributes())},
            success: function (conn, res, opts, eOpts) {
                var result = me.decodeJSON(conn.responseText, true);

                if (result.success) {
                    if(callback ){
                        callback();
                    }
                }
                else {
                    App.current.util.showErrorMsg(result.message);
                }

            },
            failure: function (conn, res, opts, eOpts) {
                Ext.JSON.decode(conn.responseText, true);
                App.util.showErrorMsg('Oh no! Something went wrong!');
            }
        });
    },
    startActivity: function(id, callback){
        var me = this;
        Ext.Ajax.request({
            url: '/whiteboard/activity/start/' + id,
            success: function (conn, res, opts, eOpts) {
                var result = me.decodeJSON(conn.responseText, true);
                if (result.success) {
                    location.reload();
                    if(callback ){
                        callback();
                    }

                }
                else {
                    App.util.showErrorMsg(result.message);
                }
            },
            failure: function (conn, res, opts, eOpts) {
                Ext.JSON.decode(conn.responseText, true);
                App.util.showErrorMsg('Oh no! Something went wrong!');
            }
        });
    },
    stopActivity: function(id, callback){
        var me = this;
        Ext.Ajax.request({
            url: '/whiteboard/activity/stop/' + id,
            params:{
                workspace:JSON.stringify(firue.getPersistentAttributes())
            },
            success: function (conn, res, opts, eOpts) {
                var result = me.decodeJSON(conn.responseText, true);

                if (result.success) {
                    location.reload();
                    if(callback ){
                        callback();
                    }

                }
                else {
                    App.util.showErrorMsg(result.message);
                }
            },
            failure: function (conn, res, opts, eOpts) {
                Ext.JSON.decode(conn.responseText, true);
                App.util.showErrorMsg('Oh no! Something went wrong!');
            }
        });
    }

});