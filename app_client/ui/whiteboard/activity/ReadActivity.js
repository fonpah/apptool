/**
 * Created by fonpah on 03.05.2014.
 */
Ext.define('App.activity.ReadActivity',{
    extend:'App.activity.AbstractActivity',
    type:'read',
    isReadOnly: true,
    constructor: function(config){
        this.callParent(arguments);
        this.ajax = config.ajax;
        this.util = config.util;

    },
    createWorkspace: function(){
        this.callParent();
        this.title = '[ReadOnly] ' + this.title;
        this.contextMenu = Ext.create( 'App.operator.ContextMenu', {activity: this} );
        this.tab = App.current.createNewTab( this.getTabConfig() );
        App.current.propertyFormBuilder.isReadOnly = true;
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
            glyph: 'xf02d@fa',
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
            },
            deactivate: function ( tab ) {
                tab.activity.zoomButtons.hide();
            },
            close: function ( tab ) {
                tab.activity.zoomButtons.remove();
                tab.activity.canvas.removeContextListener();
                tab.destroy();
            }
        }
    }
});