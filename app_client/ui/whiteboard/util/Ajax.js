/**
 * Created by fonpah on 05.04.2014.
 */
Ext.define('App.util.Ajax', {
    decodeJSON: App.util.Util.decodeJSON,
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
                    me.showErrorMsg(result.message);
                }
            },
            failure: function (conn, res, opts, eOpts) {
                Ext.JSON.decode(conn.responseText, true);
                me.showErrorMsg('Oh no! Something went wrong!');
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
                    me.showErrorMsg(result.message);
                }
            },
            failure: function (conn, res, opts, eOpts) {
                Ext.JSON.decode(conn.responseText, true);
                me.showErrorMsg('Oh no! Something went wrong!');
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
                    App.current.util.showErrorMsg(result.message);
                }
            },
            failure: function (conn, res, opts, eOpts) {
                Ext.JSON.decode(conn.responseText, true);
                App.current.util.showErrorMsg('Oh no! Something went wrong!');
            }
        });
    }

});