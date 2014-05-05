/**
 * Created by fonpah on 27.04.2014.
 */
Ext.define('App.operator.ContextMenu',{
    statics: {

    },
    config: {
        activity: null,
        menuitems: {
            delete: null
        },
        currentTarget: null,
        drawspaceCtxMenu:null
    },
    constructor: function ( config ) {
        this.initConfig( config );
        this.activity.canvas.addSelectionListener( this );
        this.createDeleteCtxMenu();
        this.createAddCtxMenu();
        this.createViewActivityCtxMenu();
        this.createDrawspaceCtxMenu();

    },
    /**
     * @method
     * Called if the selection in the canvas has been changed. You must register this
     * class on the canvas to receive this event.
     *
     * @param {draw2d.Figure} figure
     */
    onSelectionChanged: function ( figure ) {
        var me = this;
        if(figure===null){
            me.currentTarget= null;
        }else{
            me.currentTarget =  figure;
            me.prepareContextMenu( figure );
        }

    },

    prepareContextMenu: function ( figure ) {
        var me = this;
        if(figure==null){
            me.menuitems.viewActivity.disable();

        }else{
            me.menuitems.viewActivity.enable();
        }
        //TODO tobe continued
    },
    deleteSelection: function ( canvas ) {
        var me = this;
        if(canvas.currentTarget){
            var figure = canvas.currentTarget;
            var command = new draw2d.command.CommandDelete( figure );
            canvas.getCommandStack().execute( command );
            figure.propertyForm.destroy();
            canvas.removalStack.push( figure );
            return figure;
        }

    },
    createViewActivityCtxMenu: function(){
        var me = this;
        this.menuitems.viewActivity = Ext.create( 'Ext.menu.Item', {
            text: 'View Content',
            glyph:'xf06e@fa',
            disabled: true,
            handler: function () {
                if(me.activity.canvas.currentTarget){
                    var fig = me.activity.canvas.currentTarget;
                    App.current.openContentWindowFromFigure(me.activity, fig);
                }
            }
        } );
    },
    createDeleteCtxMenu: function(){
        var me = this;
        this.menuitems.delete = Ext.create( 'Ext.menu.Item', {
            text: 'Delete',
            glyph:'xf014@fa',
            disabled: me.activity.isReadOnly,
            handler: function () {
                if(me.currentTarget !==null){
                    me.deleteSelection(me.activity.canvas);
                }
            }
        } );
    },
    createAddCtxMenu: function(){
        var me = this;
        this.menuitems.add = Ext.create( 'Ext.menu.Item', {
            text: 'Enter Content',
            glyph:'xf067@fa',
            disabled: me.activity.isReadOnly,
            handler: function () {
                if(me.currentTarget !==null){
                    me.currentTarget.contentForm.show();
                }
            }
        } );
    },
    createDrawspaceCtxMenu: function(){
        var opts = {
            margin: '0 0 10 0',
            items: []
        };
        opts.items.push(this.menuitems.add);
        opts.items.push(this.menuitems.viewActivity);
        opts.items.push(this.menuitems.delete);
        this.drawspaceCtxMenu =  Ext.create( 'Ext.menu.Menu', opts );
    }

});