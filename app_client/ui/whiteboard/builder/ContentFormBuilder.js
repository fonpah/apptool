/**
 * Created by fonpah on 04.05.2014.
 */
Ext.define('App.builder.ContentFormBuilder',{
    buildForm: function(config){
        if(!config.figure){
            return false;
        }
        return Ext.widget('window', {
            title: App.current.util.shortenString(config.figure.title,11),
            closeAction: 'hide',
            width: 400,
            height: 400,
            minHeight: 400,
            layout: 'fit',
            figure:config.figure,
            resizable: true,
            modal: true,
                listeners:{
                    beforeshow:function(cmp){
                        cmp.setTitle(App.current.util.shortenString(cmp.figure.title,11));
                    }
                }
            ,
            items: Ext.widget('form',{
                layout:{
                    type:'vbox',
                    align:'stretch'
                },
                border:false,
                bodyPadding:10,
                fieldDefaults:{
                    labelAlign:'top',
                    labelStyle:'font-weight:bold'
                },
                defaults:{
                    margins:'0 0 10 0'
                },
                items:[
                    {
                        xtype: 'htmleditor',
                        name: 'content',
                        height: 200,
                        listeners:{
                            change:function(cmp){
                                //console.log(cmp.up('window' ).figure);
                                cmp.up('window' ).figure.content = cmp.getValue();
                            }
                        }
                    }
                ],
                buttons:[
                    {
                        text: 'Save',
                        handler: function() {
                            this.up('form').getForm().isValid();
                        }
                    },{
                        text: 'Cancel',
                        handler: function() {
                            this.up('form').getForm().reset();
                        }
                    }
                ]
            })
        });

    }
});