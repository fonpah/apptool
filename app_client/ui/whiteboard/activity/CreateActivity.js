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
    /*loadActivity: function(id){
        var me = this;
        this.ajax.loadActivity(id,function(json){
            me.setRawData(json);
            me.title= json.title;
            me.description = json.description;
            me.isReadOnly = json.status==0 || json.status ==2? true :false;
            me.canvasHolderEltId = json._id;
            me.createHolderElement( me.canvasHolderEltId );
            me.tabId = 'tab_' + me.canvasHolderEltId;
            me.createWorkspace();
        });
    },*/
    createFigurePool: function ( holderTpl ) {
        holderTpl.children().eq(0).html($('#node_courseActivityInstance').clone());
    },
    createWorkspace: function(){
        this.callParent();
        var t = [
            {"type":"App.node.Artifact","id":"a779fa5a11f6464089661be0aee4def6","x":1145,"y":87,"width":50,"height":50,"title":"Artifact0","entityType":"artifact","userData":{}},
            {"type":"App.node.Artifact","id":"9363aad05ec84d8486604a4cb0798a53","x":965,"y":167,"width":50,"height":50,"title":"Artifact1","entityType":"artifact","userData":{}},
            {
                "type":"App.node.Connection",
                "id":"5f0163a6c1fe4d408af51a47129f0b7a",
                "userData":null,
                "stroke":3,
                "color":"#00A8F0",
                "policy":"draw2d.policy.line.LineSelectionFeedbackPolicy",
                "router":"draw2d.layout.connection.SplineConnectionRouter",
                "source":{"node":"9363aad05ec84d8486604a4cb0798a53","port":"output0"},
                "target":{"node":"a779fa5a11f6464089661be0aee4def6","port":"input0"},
                "entityType":"connection"
            }
        ];
        this.ioReader.unmarshal(this.canvas,t);
    }
})