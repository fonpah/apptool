/**
 * Created by fonpah on 27.04.2014.
 */
Ext.define('App.operator.EditButtons',{
    activity:null,
    buttons: {},
    constructor: function(config){
        this.activity = config.activity;
        var me = this;
        this.buttons={
            undo: Ext.create( 'Ext.Button', {
                iconCls: 'icon_undo',
                disabled: true,
                handler: function () {
                    me.activity.canvas.getCommandStack().undo();
                }
            } ),
            redo: Ext.create( 'Ext.Button', {
                iconCls: 'icon_redo',
                disabled: true,
                handler: function () {
                    me.activity.canvas.getCommandStack().redo();
                }
            } ),
            save: Ext.create('Ext.Button',{
                text:'Save',
                glyph:'xf0c7@fa',
                handler: function(){
                    var data = me.activity.ioWriter.marshal(me.activity.canvas);
                    me.activity.ajax.saveWorkspace(me.activity.activityId, data);
                }
            })
        };


        this.activity.canvas.getCommandStack().addEventListener( this );
        this.activity.canvas.addSelectionListener( this );
        this.addToCommandStack();
    },
    onSelectionChanged: function ( figure ) {
        var me = this;
        if(figure===null){
            me.currentTarget= null;
        }else{
            me.currentTarget =  figure;

        }

    },
    stackChanged: function ( event ) {
        var canUndo = event.getStack().canUndo();
        var canRedo = event.getStack().canRedo();
        this.buttons['undo'].setDisabled( !canUndo );
        this.buttons['redo'].setDisabled( !canRedo );

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