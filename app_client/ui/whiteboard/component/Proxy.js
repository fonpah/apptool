/**
 * Created by fonpah on 22.05.2014.
 */

Ext.define('Ext.ux.data.proxy.Socket', {
    extend: 'Ext.data.proxy.Proxy',
    alias: 'proxy.socket',

    /**
     * @property {Object} callbacks
     * @private
     * Callbacks stack
     */
    callbacks: {},
    config: {
        /**
         * @cfg {String} storeId (required) Id of the store associated
         */
        storeId: '',

        /**
         * @cfg {Object} api CRUD operation for the communication with the server
         */
        api: {
            create: 'create',
            read: 'read',
            update: 'update',
            destroy: 'destroy'
        },

        /**
         * @cfg {String} url (required) The URL to connect the websocket
         */
        url: '',

        /**
         * @cfg {Ext.ux.WebSocket} websocket An instance of Ext.ux.WebSocket (no needs to make a new one)
         */
        socket: null
    },

    constructor: function (cfg) {
        var me = this;
        // Requires a configuration
        if (Ext.isEmpty(cfg)) {
            Ext.Error.raise('A configuration is needed!');
            return false;
        }

        me.initConfig(cfg);
        //console.log(cfg.storeId);
        me.mixins.observable.constructor.call(me, cfg);
        // Requires a storeId
        if (Ext.isEmpty(me.getStoreId())) {
            Ext.Error.raise('The storeId field is needed!');
            return false;
        }
        // Allows to define WebSocket proxy both into a model and a store
        me.callParent([cfg]);

        return me;
    },

    /**
     * @method create
     * Starts a new CREATE operation (pull)
     * The use of this method is discouraged: it's invoked by the store with sync/load operations.
     * Use api config instead
     */
    create: function (operation, callback, scope) {
        this.runTask(this.getApi().create, operation, callback, scope);
    },

    /**
     * @method read
     * Starts a new READ operation (pull)
     * The use of this method is discouraged: it's invoked by the store with sync/load operations.
     * Use api config instead
     */
    read: function (operation, callback, scope) {
        //console.log(callback);
        this.runTask(this.getApi().read, operation, callback, scope);
    },

    /**
     * @method update
     * Starts a new CREATE operation (pull)
     * The use of this method is discouraged: it's invoked by the store with sync/load operations.
     * Use api config instead
     */
    update: function (operation, callback, scope) {
        this.runTask(this.getApi().update, operation, callback, scope);
    },

    /**
     * @method destroy
     * Starts a new DESTROY operation (pull)
     * The use of this method is discouraged: it's invoked by the store with sync/load operations.
     * Use api config instead
     */
    destroy: function (operation, callback, scope) {
        this.runTask(this.getApi().destroy, operation, callback, scope);
    },

    /**
     * @method runTask
     * Starts a new operation (pull)
     * @private
     */
    runTask: function (action, operation, callback, scope) {
        var me = this ,
            data = {} ,
            ws = me.getSocket() ,
            i = 0;
        //console.log(arguments);
        scope = scope || me;
        if(Ext.isEmpty(ws)){
            Ext.Error.raise('Web socket required!');
            return false;
        }
        // Callbacks store
        me.callbacks[action] = {
            operation: operation,
            callback: callback,
            scope: scope
        };
        // Treats 'read' as a string event, with no data inside
        if (action === me.getApi().read) {
            var sorters = operation.sorters ,
                groupers = operation.groupers;

            // Remote sorters
            if (sorters && sorters.length > 0) {
                data.sort = [];

                for (i = 0; i < sorters.length; i++) {
                    data.sort.push({
                        property: sorters[i].property,
                        direction: sorters[i].direction
                    });
                }
            }

            // Remote groupers
            if (groupers && groupers.length > 0) {
                data.group = [];

                for (i = 0; i < groupers.length; i++) {
                    data.group.push({
                        property: groupers[i].property,
                        direction: groupers[i].direction
                    });
                }
            }

            // Paging params
            data.page = operation.page;
            data.limit = operation.limit;
            data.start = operation.start;
            if(operation.params){
                Ext.Object.each(operation.params, function(key, value){
                    data[key]= value;
                });
            }
        }

        // create Update, Destroy
        else {
            var writer =  Ext.data.StoreManager.lookup(me.getStoreId()).getProxy().getWriter(),
                records = operation.getRecords();

            data = [];

            for (i = 0; i < records.length; i++) {
                var d = writer.getRecordData(records[i]);
                if(action === me.getApi().create){
                    delete d[records[i].idProperty];
                }
                data.push(d);
            }
            if(data.length<2 && data.length>0){
                data= data[0];
            }
        }

        ws.emit(action, data);

    },

    /**
     * @method completeTask
     * Completes a pending operation (push/pull)
     * @private
     */
    completeTask: function (action, event, data) {
        var me = this ,
            resultSet = me.getReader().read(data);
        // Server push case: the store is get up-to-date with the incoming data
        if (Ext.isEmpty(me.callbacks[event])) {
            var store =  Ext.data.StoreManager.lookup(me.getStoreId());

            if (typeof store === 'undefined') {
                Ext.Error.raise('Unrecognized store: check if the storeId passed into configuration is right.');
                return false;
            }

            if (action === 'update') {
                for (var i = 0; i < resultSet.records.length; i++) {
                    var record = store.getById(resultSet.records[i].internalId);
                    if (record) {
                        store.suspendEvents();
                        record.set(resultSet.records[i].data);
                        store.resumeEvents();
                    }
                }
                store.commitChanges();
                store.fireEvent('updated',store,resultSet.records,true);
            }
            else if (action === 'destroy') {
                store.remove(resultSet.records);
                store.commitChanges();
                store.fireEvent('removed',store,resultSet.records,true);
            }
            else {
                store.loadData(resultSet.records, true);
                store.fireEvent('load', store);
                store.fireEvent('added',store,resultSet.records,true);
            }
        }
        // Client request case: a callback function (operation) has to be called
        else {
            var store =  Ext.data.StoreManager.lookup(me.getStoreId());
            var fun = me.callbacks[event] ,
                opt = fun.operation ,
                records = opt.records || data;
            delete me.callbacks[event];
            if (typeof opt.setResultSet === 'function') opt.setResultSet(resultSet);
            else opt.resultSet = resultSet;
            opt.scope = fun.scope;
            if(action==='create'){
                opt.resultSet = resultSet;
                for (var i = 0; i < resultSet.records.length; i++) {
                    var record = store.getAt(store.findPhantomRecord(resultSet.records[i]));
                    if (record) {
                        store.suspendEvents();
                        record.setId(resultSet.records[i].get(resultSet.records[i].idProperty));
                        store.commitChanges();
                        store.resumeEvents();
                    }
                }
            }
            opt.setCompleted();
            opt.setSuccessful();
            fun.callback.apply(fun.scope, [opt]);
        }
    },
    bindEvents: function(ws){
        var me = this;
        me.setSocket(ws);
        ws.on(me.getApi().create, function (data) {
            me.completeTask('create', me.getApi().create, data);
        });
        ws.on(me.getApi().read, function (data) {
            me.completeTask('read', me.getApi().read, data);
        });

        ws.on(me.getApi().update, function (data) {
            me.completeTask('update', me.getApi().update, data);
        });

        ws.on(me.getApi().destroy, function (data) {
            me.completeTask('destroy', me.getApi().destroy, data);
        });
    },
    removeEvents: function(socket){
        var me = this;
        socket.removeAllListeners(me.getApi().create);
        socket.removeAllListeners(me.getApi().update);
        socket.removeAllListeners(me.getApi().destroy);
        socket.removeAllListeners(me.getApi().read);
    }
});