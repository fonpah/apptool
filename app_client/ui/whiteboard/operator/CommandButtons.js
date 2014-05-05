/**
 * Created by fonpah on 27.04.2014.
 */
Ext.define('App.operator.CommandButtons',{
    activity:null,
    buttons: {},
    constructor: function(config){
        this.activity = config.activity;
        var me = this;
        this.buttons.start = Ext.create( 'Ext.Button', {
            text: 'Start',
            glyph: 'xf01d@fa',
            disabled: !me.activity.isReadOnly,
            handler: function () {

            }
        } );
        this.buttons.stop = Ext.create( 'Ext.Button', {
            text: 'stop',
            glyph: 'xf04d@fa',
            disabled: this.activity.isReadOnly,
            handler: function () {

            }
        } );
        this.buttons.separator = Ext.create('Ext.toolbar.Separator');
        this.activity.canvas.getCommandStack().addEventListener( this );
        this.addToCommandStack();
        this.activity.canvas.addSelectionListener( this );
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

    },
    addToCommandStack: function () {
        var arr = [];
        Ext.Object.each( this.buttons, function ( key, value ) {
            if(key!='separator'){
                arr.push( value );
            }
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