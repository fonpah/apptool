/**
 * Created by fonpah on 03.05.2014.
 */
Ext.define('App.activity.CreateActivity',{
    extend:'App.activity.AbstractActivity',
    type:'create',
    readOnly:false,
    editButtons: null,
    constructor: function(config){
        this.ajax = config.ajax;
        this.util = config.util;
        this.callParent(arguments);
    },
    createFigurePool: function ( holderTpl ) {
        holderTpl.children().eq(0).html($('#node_courseActivityInstance').clone());
    },
    createWorkspace: function(){
        this.callParent();
        //this.canvas.addPolicy( 'geometry', 'draw2d.policy.canvas.SnapToGeometryEditPolicy' );
        this.commandButtons = Ext.create( 'App.operator.CommandButtons', {activity: this} );
        this.editButtons = Ext.create( 'App.operator.EditButtons', {activity: this} );
        this.contextMenu = Ext.create( 'App.operator.ContextMenu', {activity: this} );
        this.tab = App.current.createNewTab( this.getTabConfig() );
        App.current.propertyFormBuilder.isReadOnly = false;
       if(this.getRawData().artifacts){
           this.ioReader.unmarshal(this.canvas,this.getRawData().artifacts);
       }
    },
    getTabConfig: function () {
        var me = this;
        return {
            id: this.tabId,
            contentEl: this.canvasHolderEltId + '_holder',
            activity: this,
            autoScroll: true,
            closable: false,
            glyph: 'xf069@fa',
            title: App.current.util.shortenString( this.title, 20 ),
            listeners: this.getTabListeners()
        };
    },
    getTabListeners: function () {
        var me = this;
        return  {
            tabactivate: function ( tab ) {
                App.current.currentCanvas = me.canvas;
                tab.activity.zoomButtons.show();
                tab.activity.editButtons.show();
            },
            deactivate: function ( tab ) {
                tab.activity.zoomButtons.hide();
                tab.activity.editButtons.hide();
            },
            close: function ( tab ) {
                tab.activity.zoomButtons.remove();
                tab.activity.editButtons.remove();
                tab.activity.canvas.removeContextListener();
                tab.destroy();
            }
        }
    }
})