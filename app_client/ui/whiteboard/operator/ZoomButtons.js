/**
 * Created by fonpah on 27.04.2014.
 */
Ext.define('App.operator.ZoomButtons',{
    activity:null,
    buttons: null,
    constructor: function(config){
       this.activity = config.activity;
       var me = this;
       this.buttons= {
           in: Ext.create( 'Ext.Button', {
               iconCls: 'icon_zoom_in',
               handler: function () {
                   me.activity.canvas.setZoom( me.activity.canvas.getZoom() - 0.1, true );
               }
           } ),
           out: Ext.create( 'Ext.Button', {
               iconCls: 'icon_zoom_out',
               handler: function () {
                   me.activity.canvas.setZoom(me.activity.canvas.getZoom() + 0.1, true );
               }
           } ),
           reset: Ext.create( 'Ext.Button', {
               text: '1:1',
               handler: function () {
                   me.activity.canvas.setZoom( 1.0, true );
               }
           } )
       };

        this.activity.canvas.getCommandStack().addEventListener( this );
        this.addToCommandStack();
        this.activity.canvas.addSelectionListener( this );
    },
    stackChanged: function ( event ) {

    },
    onSelectionChanged: function ( figure ) {
        var me = this;
        if(figure===null){
            me.currentTarget= null;
        }else{
            me.currentTarget =  figure;

        }
    },
    addToCommandStack: function () {
        var arr = [];
        Ext.Object.each( this.buttons, function ( key, value ) {
            arr.push( value );
        } );
        App.current.addCmdButtons( arr );
        this.hide();
    },
    hide: function () {
        Ext.Object.each( this.buttons, function ( key, btn ) {
            btn.hide()
        } );
    },
    show: function () {
        Ext.Object.each( this.buttons, function ( key, btn ) {
            btn.show()
        } );
    },
    remove: function () {
        Ext.Object.each( this.buttons, function ( key, btn ) {
            btn.destroy()
        } );
    }
});