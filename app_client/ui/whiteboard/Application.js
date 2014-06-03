/**
 * Created by fonpah on 02.05.2014.
 */
var app = null;
Ext.define( 'App.Application', {
    name: 'App',
    extend: 'Ext.app.Application',
    appFolder: '/ui/whiteboard',
    postfixNr: 0,
    appProperty: 'current',
    models: ['User','Activity','Connection','Artifact','Content','Comment','Role','Permission'],
    stores: ['Artifacts', 'Connections', 'Comments'],
    controllers:['board','property','controls','content','comment','lang'],
    currentCanvas: null,
    config:{
        user:null,
        activity:null,
        role:null
    },
    init: function () {
        this.addEvents('loadstore');
       // this.defaultRouter = new draw2d.layout.connection.SplineConnectionRouter();
        this.fullPath = location.protocol + '//' + location.hostname +':3000';// (location.port ? ':' + location.port : '');
        this.establishRealTimeCom();
        this.util = Ext.create( 'App.util.Util' );
        this.ajax = Ext.create( 'App.util.Ajax' );
        this.initMainContentCmp();
        this.initNorthPanelCmp();
        this.initSouthPanelCmp();
        this.initEastPanelCmp();
        this.initPropertyForm();
        //this.propertyFormBuilder = Ext.create( 'App.builder.PropertyFormBuilder' );

        this.getArtifactsStore().addListener('update',this.onUpdatePersist,this);
        this.getArtifactsStore().addListener('add',this.onCreatePersist,this);
        this.getArtifactsStore().addListener('remove',this.onDestroyPersist,this);

        this.getConnectionsStore().addListener('update',this.onUpdatePersist,this);
        this.getConnectionsStore().addListener('add',this.onCreatePersist,this);
        this.getConnectionsStore().addListener('destroy',this.onDestroyPersist,this);

        this.getCommentsStore().addListener('update',this.onUpdatePersist,this);
        this.getCommentsStore().addListener('add',this.onCreatePersist,this);
        this.getCommentsStore().addListener('destroy',this.onDestroyPersist,this);
    },
    establishRealTimeCom: function () {
        var me = this;
        this.socket = io.connect(this.fullPath);
        me.getArtifactsStore().getProxy().setSocket(me.socket);
        me.getConnectionsStore().getProxy().setSocket(me.socket);
        me.getCommentsStore().getProxy().setSocket(me.socket);
        this.socket.on('connected', function (data) {
            console.log(data);
            me.getArtifactsStore().getProxy().removeEvents(me.socket);
            me.getArtifactsStore().getProxy().bindEvents(me.socket);
            me.getConnectionsStore().getProxy().removeEvents(me.socket);
            me.getConnectionsStore().getProxy().bindEvents(me.socket);
            me.getCommentsStore().getProxy().removeEvents(me.socket);
            me.getCommentsStore().getProxy().bindEvents(me.socket);

        });

    },
    launch: function () {
        var me = this;
        Ext.state.Manager.setProvider( Ext.create( 'Ext.state.CookieProvider' ) );
        Ext.tip.QuickTipManager.init();
        me.createViewport();
        this.loadActivity();
        this.loadUser();

    },
    initMainContentCmp: function () {
        this.mainContentCmp = Ext.create( 'Ext.tab.Panel', {
            region: 'center', // a center
            deferredRender: false,
            margins: '0 0 0 5',
            activeTab: 0
        } );
        this.mainContentCmp.loadMask = new Ext.LoadMask( this.mainContentCmp, {msg: App.lang.t("Loading, please wait...")} );
    },
    initNorthPanelCmp: function () {
        this.initTopToolBarCmp();
        this.northPanelCmp = Ext.create( 'Ext.panel.Panel', {
            id: 'top_panel',
            region: 'north',
            layout: 'anchor',
            frame: false,
            border: false,
            bodyStyle: 'background:transparent; padding: 5px',
            items: [
                this.topToolBarCmp
            ]

        } );
    },
    initSouthPanelCmp: function () {
        this.initButtonStatusBarCmp();
        this.southPanelCmp = Ext.create( 'Ext.panel.Panel', {
            region: 'south',
            border: false,
            bodyStyle: 'background:transparent; padding: 5px',
            items: [
                this.buttonStatusBarCmp
            ]
        } );
    },
    initEastPanelCmp: function () {
        this.eastPanelCmp = Ext.create( 'Ext.tab.Panel', {
            stateful: true,
            stateId: 'east_panel',
            region: 'east',
            title: 'Property',
            collapsible: true,
            collapsed: true,
            split: true,
            width: 300,
            minWidth: 220,
            margins: '0 5 0 0',
            tabPosition: 'bottom'
        } );
    },
    initTitleCmp: function () {
        this.titleCmp = Ext.create( 'Ext.Component', {
            region: 'north',
            margin: '0',
            autoEl: {
                tag: 'div',
                html: '<p style="font-size: 15px; font-weight: bold; color: rgb(21, 127, 204); margin: 0 5px 0 5px">'+App.lang.t('Application Tool')+'</p>'
            }
        } );
    },
    initCommOpBarCmp: function () {
        this.commOpBarCmp = Ext.create( 'Ext.toolbar.Toolbar', {
            style: 'padding: 0; margin: 0; border: none'
        } );
    },
    initTopToolBarCmp: function () {
        this.initTitleCmp();
        this.initCommOpBarCmp();
        this.topToolBarCmp = Ext.create( 'Ext.toolbar.Toolbar', {
            style: 'padding-left: 0',
            items: [
                this.titleCmp,
                { xtype: 'tbspacer', width: 50 },
                this.commOpBarCmp,
                '->'

            ]
        } );
    },
    initButtonStatusBarCmp: function () {
        this.buttonStatusBarCmp = Ext.create( 'Ext.ux.StatusBar', {
            id: 'app-status',
            style: 'padding-left: 0',
            border: false,
            defaultText: 'Ready',
            defaultIconCls: 'x-status-valid',
            text: 'Ready',
            iconCls: 'x-status-valid'
        } );
    },
    initPropertyForm: function () {
        var me = this;
        this.ajax.loadPropertyForm( function ( form ) {
            me.propertyForm = form;
        } );
    },
    createViewport: function ( activity ) {
        var me = this;
        Ext.create( 'Ext.Viewport', {
            id: 'application_viewpoint',
            layout: 'border',
            items: [
                me.northPanelCmp,
                me.mainContentCmp,
                me.eastPanelCmp,
                me.southPanelCmp
            ]
        } );
    },
    showUserInfo:function(user){
       var cmp= Ext.create( 'Ext.Component', {
            region: 'east',
            margin: '0 5 0 0',
            autoEl: {
                tag: 'div',
                html: '<p style="font-size: 15px; font-weight: bold; color: rgb(21, 127, 204); margin: 0 5px 0 5px">'+App.lang.t('Welcome ')+user.getFullName()+'</p>'
            }
        } );
        this.topToolBarCmp.add(cmp);
        this.topToolBarCmp.add({
            xtype:'translation'
        });
    },
    createConnection: function ( sourcePort, targetPort ) {
        var me = this;
        if ( me.currentCanvas.isDupConnection( sourcePort, targetPort ) ) {
            return false
        }
        var conn = new App.node.Connection();
        conn.entityType = 'connection';
        conn.activityId = me.getActivity().get('_id');
        var task = new Ext.util.DelayedTask(function(){
            me.getController('board' ).fireEvent('createconnection', conn, me.currentCanvas);
        });
        task.delay(100);
        return conn;
    },
    loadActivity: function (  ) {
        var me = this;
        this.mainContentCmp.loadMask.show();
        this.getActivityModel().load(activityId,{
            scope:this,
            callback:function(record, operation,success){
                this.mainContentCmp.loadMask.hide();
                if(!operation.success){
                    App.util.showErrorMsg(App.lang.t('Activity not found!'));
                }
                //console.log(App.util.decodeJSON(operation.response.responseText));
            },
            success:function(activity){
                this.setActivity(activity);
                this.fireEvent('openwhiteboard', me.mainContentCmp, me.getActivity());
                this.mainContentCmp.loadMask.hide();
            },
            failure:function(){
                Ext.Error.raise(App.lang.t('something went wrong with the server'));

            }
        });

    },
    loadUser:function(){
        var me = this;
        this.getUserModel().load(userId,{
            scope:me,
            success: function(user){
                this.setUser(user);
                this.showUserInfo(user);
                if(user.get('roleId')){
                    this.loadRole(user.get('roleId'));
                }

            }
        })
    },
    loadRole:function(roleId){
        this.getRoleModel().load(roleId,{
            scope:this,
            success:function( role,operation){
                if(!operation.success){
                    return;
                }
                var res = App.util.decodeJSON(operation.response.responseText);
                this.setRole(role);
                this.loadPermissions(role,res.role.permissions);
            },
            failure:function(record,operation){
                Ext.Error.raise(App.lang.t('something went wrong with the server'));
            }
        });
    },
    loadPermissions:function(role,permissions){
        var perms = permissions||[];
        Ext.Array.each(perms,function(perm){
            var model = Ext.create(this.getPermissionModel(),perm);
            role.getPermissions().add(model.get('_id'),model);
        },this);
    },
    onUpdatePersist:function(){
        this.buttonStatusBarCmp.showBusy(App.lang.t('Updating Record!'));
    },
    onCreatePersist:function(){
        this.buttonStatusBarCmp.showBusy(App.lang.t('Creating Record!'));
        return true;
    },
    onDestroyPersist:function(){
        this.buttonStatusBarCmp.showBusy(App.lang.t('Deleting Record!'));
    }
} );


//Start
Ext.onReady( function () {
    document.oncontextmenu= function(){
        return true;
    };
    app = Ext.create( 'App.Application' );
    draw2d.Connection.createConnection = function ( sourcePort, targetPort ) {
        return App.current.createConnection( sourcePort, targetPort );
    };
    draw2d.util.UUID.create = function () {
        var id = App.current.util.uuid();
        return id.replace( '-', '' );
    };
} );
