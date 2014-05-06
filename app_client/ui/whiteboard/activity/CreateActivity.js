/**
 * Created by fonpah on 03.05.2014.
 */
Ext.define('App.activity.CreateActivity',{
    extend:'App.activity.AbstractActivity',
    type:'create',
    commandButtons: null,
    editButtons: null,
    constructor: function(config){
        this.ajax = config.ajax;
        this.util = config.util;
    },
    createFigurePool: function ( holderTpl ) {
        holderTpl.children().eq(0).html($('#node_courseActivityInstance').clone());
    },
    createWorkspace: function(){
        this.callParent();
       if(this.getRawData().artifacts){
           this.ioReader.unmarshal(this.canvas,this.getRawData().artifacts);
       }
    }
})