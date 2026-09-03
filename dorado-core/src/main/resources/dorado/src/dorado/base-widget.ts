// @ts-nocheck
/// <reference path="globals.d.ts" />
(function() {
    dorado.widget.Action = $extend(dorado.widget.Component, {
        $className: "dorado.widget.Action", ATTRIBUTES: {
            caption: {}, icon: {}, iconClass: {}, tip: {}, disabled: {
                getter: function() {
                    return this._disabled || this._sysDisabled;
                }
            }, parameter: {
                setter: function(parameter: any) {
                    if (this._parameter instanceof dorado.util.Map && parameter instanceof dorado.util.Map) {
                        this._parameter.put(parameter);
                    } else {
                        this._parameter = parameter;
                    }
                }
            }, returnValue: {readOnly: true}, hotkey: {
                writeBeforeReady: true, setter: function(hotkey: any) {
                    this._hotkey = hotkey;
                    let self = this;
                    if (hotkey) {
                        jQuery(document).bind("keydown", hotkey, function() {
                            if (!this._disabled) {
                                self.execute();
                            }
                            return false;
                        });
                    }
                }
            }, confirmMessage: {}, successMessage: {}
        }, EVENTS: {beforeExecute: {}, onExecute: {}, onSuccess: {}, onFailure: {}}, constructor: function() {
            this._bindingObjects = new dorado.ObjectGroup();
            $invokeSuper.call(this, arguments);
            this.bind("onAttributeChange", function(self: any, arg: any) {
                self.notifyBindingObjects(arg.attribute, arg.value);
            });
        }, notifyBindingObjects: function(attr: any, value: any) {
            let self = this;
            dorado.Toolkits.setDelayedAction(self, "$actionStateChangeTimerId", function() {
                if ((attr === "icon") || (attr === "iconClass")) {
                    self._bindingObjects.set(attr, value, {skipUnknownAttribute: true});
                } else {
                    self._bindingObjects.invoke("onActionStateChange");
                }
            }, 20);
        }, doAddBindingObject: function(object: any) {
            this._bindingObjects.objects.push(object);
        }, doRemoveBindingObject: function(object: any) {
            this._bindingObjects.objects.remove(object);
        }, doExecute: dorado._NULL_FUNCTION, execute: function(callback: any) {
            if (this._disabled) {
                throw new dorado.ResourceException("dorado.baseWidget.ErrorCallDisabledAction", this._id);
            }
            let self = this, retval;

            function realCall() {
                let eventArg = {};
                let success = false, result;
                try {
                    self._returnValue = result = self.doExecute();
                    success = true;
                } catch (e) {
                    self._returnValue = result = e;
                }
                eventArg.success = success;
                eventArg[success ? "result" : "error"] = result;
                self.fireEvent("onExecute", self, eventArg);
                eventArg.processDefault = true;
                self.fireEvent((success) ? "onSuccess" : "onFailure", self, eventArg);
                if (!success) {
                    if (eventArg.processDefault) {
                        if (result) {
                            throw result;
                        }
                    } else {
                        if (result) {
                            dorado.Exception.removeException(result);
                        }
                    }
                }
                if (success && eventArg.processDefault && self._successMessage) {
                    dorado.widget.NotifyTipManager.notify(self._successMessage);
                }
                return result;
            }

            let eventArg = {processDefault: true};
            self.fireEvent("beforeExecute", self, eventArg);
            if (eventArg.processDefault) {
                if (self._confirmMessage) {
                    dorado.MessageBox.confirm(self._confirmMessage, function() {
                        let retval = realCall.call(self);
                        $callback(callback, retval);
                    });
                } else {
                    retval = realCall.call(self);
                    $callback(callback, retval);
                }
            }
            return retval;
        }
    });
    dorado.widget.AsyncAction = $extend(dorado.widget.Action, {
        $className: "dorado.widget.AsyncAction",
        ATTRIBUTES: {async: {}, modal: {defaultValue: true}, executingMessage: {}},
        doExecuteSync: dorado._NULL_FUNCTION,
        doExecuteAsync: function(callback: any) {
            $callback(callback);
        },
        execute: function(callback: any) {
            if (this._disabled) {
                throw new dorado.ResourceException("dorado.baseWidget.ErrorCallDisabledAction", this._id);
            }
            if (this._sysDisabled) {
                throw new dorado.ResourceException("dorado.baseWidget.ErrorCallSysDisabledAction", this._id);
            }
            let self = this, retval;

            function realCall(callback: any) {
                let eventArg = {processDefault: true};
                if (self._async) {
                    let taskId, message = self._executingMessage || $resource("dorado.core.DefaultTaskMessage");
                    if (this._modal) {
                        if (message && message !== "none") {
                            taskId = dorado.util.TaskIndicator.showTaskIndicator(message, this._modal ? "main" : "daemon");
                        } else {
                            taskId = 0;
                        }
                    }
                    let hasIcon, oldIcon, oldIconClass;
                    if (self._modal) {
                        self._sysDisabled = true;
                        self.notifyBindingObjects();
                    }
                    try {
                        self.doExecuteAsync({
                            callback: function(success: any, result: any) {
                                if (taskId) {
                                    dorado.util.TaskIndicator.hideTaskIndicator(taskId);
                                }
                                if (self._modal) {
                                    self._sysDisabled = false;
                                    self.notifyBindingObjects();
                                }
                                self._returnValue = result;
                                $callback(callback, success, result, {scope: self._view});
                                eventArg.success = success;
                                eventArg[success ? "result" : "error"] = result;
                                self.fireEvent("onExecute", self, eventArg);
                                self.fireEvent((success) ? "onSuccess" : "onFailure", self, eventArg);
                                if (!success && !eventArg.processDefault) {
                                    dorado.Exception.removeException(eventArg.error);
                                }
                                if (success && eventArg.processDefault && self._successMessage) {
                                    dorado.widget.NotifyTipManager.notify(self._successMessage);
                                }
                            }
                        });
                    } catch (e) {
                        if (taskId) {
                            dorado.util.TaskIndicator.hideTaskIndicator(taskId);
                        }
                        if (self._modal) {
                            self._sysDisabled = false;
                            self.notifyBindingObjects();
                        }
                        if (!(e instanceof dorado.AbstractException)) {
                            throw e;
                        }
                    }
                } else {
                    let success = false, result;
                    try {
                        self._returnValue = result = self.doExecuteSync();
                        success = true;
                        $callback(callback, true, result, {scope: self._view});
                    } catch (e) {
                        self._returnValue = result = e;
                    }
                    eventArg.success = success;
                    eventArg[success ? "result" : "error"] = result;
                    self.fireEvent("onExecute", self, eventArg);
                    self.fireEvent((success) ? "onSuccess" : "onFailure", self, eventArg);
                    if (!success) {
                        if (eventArg.processDefault) {
                            if (result) {
                                throw result;
                            }
                        } else {
                            dorado.Exception.removeException(eventArg.error);
                        }
                    }
                    if (success && eventArg.processDefault && self._successMessage) {
                        dorado.widget.NotifyTipManager.notify(self._successMessage);
                    }
                    return result;
                }
            }

            let eventArg = {processDefault: true};
            self.fireEvent("beforeExecute", self, eventArg);
            if (eventArg.processDefault) {
                if (this._confirmMessage && this._confirmMessage !== "none") {
                    let self = this;
                    dorado.MessageBox.confirm(this._confirmMessage, function() {
                        realCall.call(self, callback);
                    });
                } else {
                    retval = realCall.call(this, callback);
                }
            }
            return retval;
        }
    });
    let listenedAttrs = ["caption", "icon", "iconClass", "tip", "disabled"];
    dorado.widget.ActionSupport = $class({
        $className: "dorado.widget.ActionSupport", ATTRIBUTES: {
            action: {
                componentReference: true, setter: function(action: any) {
                    if (this._action instanceof dorado.widget.Action) {
                        this._action.doRemoveBindingObject(this);
                    }
                    if (action && !(action instanceof dorado.widget.Action)) {
                        let ref = action;
                        action = ref.view.id(ref.component);
                    }
                    this._action = action;
                    if (action) {
                        action.doAddBindingObject(this);
                    }
                }
            }
        }, onActionStateChange: function() {
            if (this.refresh) {
                this.refresh(true);
            }
        }, destroy: function() {
            if (this._destroyed) {
                return;
            }
            this.set("action", null);
            $invokeSuper.call(this, arguments);
        }
    });
})();
(function() {
    let VALIDATION_RESULT_CODE = {ok: 0, invalid: 1, executing: 2};
    dorado.widget.AjaxAction = $extend(dorado.widget.AsyncAction, {
        $className: "dorado.widget.AjaxAction",
        ATTRIBUTES: {
            async: {defaultValue: true},
            service: {},
            timeout: {},
            batchable: {defaultValue: true},
            supportsEntity: {defaultValue: true}
        },
        getAjaxOptions: function() {
            let jsonData = {
                action: "remote-service",
                service: this._service,
                supportsEntity: this._supportsEntity,
                parameter: dorado.JSON.evaluate(this._parameter),
                sysParameter: this._sysParameter ? this._sysParameter.toJSON() : undefined,
                context: (this._view ? this._view.get("context") : null)
            };
            if (this._supportsEntity) {
                jsonData.loadedDataTypes = this.get("dataTypeRepository").getLoadedDataTypes();
            }
            return dorado.Object.apply({
                jsonData: jsonData,
                timeout: this._timeout,
                batchable: this._batchable
            }, $setting["ajax.remoteServiceOptions"]);
        },
        doExecuteSync: function() {
            let ajaxOptions = this.getAjaxOptions(), ajax = dorado.util.AjaxEngine.getInstance(ajaxOptions);
            let result = ajax.requestSync(ajaxOptions);
            if (result.success) {
                let result = result.getJsonData(), dataTypeRepository = this.get("dataTypeRepository"), data;
                if (result && typeof result === "object" && (result.$dataTypeDefinitions || result.$context)) {
                    data = result.data;
                    if (result.$dataTypeDefinitions) {
                        dataTypeRepository.parseJsonData(result.$dataTypeDefinitions);
                    }
                    if (result.$context && this._view) {
                        let context = this._view.get("context");
                        context.put(result.$context);
                    }
                }
                if (data && this._supportsEntity) {
                    data = dorado.DataUtil.convertIfNecessary(data, dataTypeRepository);
                }
                return data;
            } else {
                throw result.exception;
            }
        },
        doExecuteAsync: function(callback: any) {
            let ajaxOptions = this.getAjaxOptions(), ajax = dorado.util.AjaxEngine.getInstance(ajaxOptions);
            ajax.request(ajaxOptions, {
                scope: this, callback: function(success: any, result: any) {
                    if (success) {
                        let data;
                        result = result.getJsonData(), dataTypeRepository = this.get("dataTypeRepository");
                        if (result && (result.$dataTypeDefinitions || result.$context)) {
                            data = result.data;
                            if (result.$dataTypeDefinitions) {
                                dataTypeRepository.parseJsonData(result.$dataTypeDefinitions);
                            }
                            if (result.$context && this._view) {
                                let context = this._view.get("context");
                                context.put(result.$context);
                            }
                        }
                        if (data && this._supportsEntity) {
                            data = dorado.DataUtil.convertIfNecessary(data, dataTypeRepository);
                        }
                        $callback(callback, true, data);
                    } else {
                        $callback(callback, false, result.exception);
                    }
                }
            });
        }
    });
    dorado.DataPath.registerInterceptor("CASCADE_DIRTY", function(data: any) {
        if (data instanceof dorado.Entity) {
            if (!data.isCascadeDirty()) {
                data = null;
            }
        } else {
            if (data instanceof dorado.EntityList) {
                let it = data.iterator(true);
                let data = [];
                while (it.hasNext()) {
                    let e = it.next();
                    if (e.isCascadeDirty()) {
                        data.push(e);
                    }
                }
            } else {
                data = null;
            }
        }
        return data;
    }, function(dataType: any) {
        return dataType;
    });
    let CASCADE_NOT_DRITY_ENTITYS;
    dorado.DataPath.registerInterceptor("DIRTY_TREE", function(data: any) {
        function gothrough(entity: any, ignoreSelf: any) {
            let isDirty = entity.isDirty();
            let data = entity._data;
            for (let property in data) {
                if (!data.hasOwnProperty(property)) {
                    continue;
                }
                if (property.charAt(0) === "$") {
                    continue;
                }
                let propertyDef = (entity._propertyDefs) ? entity._propertyDefs.get(property) : null;
                if (!propertyDef || !propertyDef._submittable) {
                    continue;
                }
                let value = entity.get(property, "never");
                if (value instanceof dorado.EntityList) {
                    let it = value.iterator(true);
                    while (it.hasNext()) {
                        if (gothrough(it.next())) {
                            isDirty = true;
                        }
                    }
                } else {
                    if (value instanceof dorado.Entity) {
                        if (gothrough(value, true)) {
                            isDirty = true;
                        }
                    }
                }
            }
            if (!isDirty && !ignoreSelf) {
                CASCADE_NOT_DRITY_ENTITYS[entity.entityId] = true;
            }
            return isDirty;
        }

        CASCADE_NOT_DRITY_ENTITYS = {};
        if (data instanceof dorado.Entity) {
            if (!gothrough(data)) {
                data = null;
            }
        } else {
            if (data instanceof dorado.EntityList) {
                let it = data.iterator(true);
                data = [];
                while (it.hasNext()) {
                    let entity = it.next();
                    if (gothrough(entity)) {
                        data.push(entity);
                    }
                }
            }
        }
        return data;
    }, function(dataType: any) {
        return dataType;
    });

    function filterCascadeDrityEntity(entity: any) {
        return !CASCADE_NOT_DRITY_ENTITYS[entity.entityId];
    }

    dorado.widget.UpdateAction = $extend(dorado.widget.AsyncAction, {
        $className: "dorado.widget.UpdateAction", ATTRIBUTES: {
            async: {defaultValue: true}, dataResolver: {
                setter: function(v: any) {
                    this._dataResolver = (v && typeof v === "string") ? dorado.DataResolver.create(v) : v;
                }
            }, updateItems: {
                getter: function() {
                    let updateItems = this._updateItems;
                    if (updateItems) {
                        let self = this;
                        jQuery.each(updateItems, function(i: any, updateItem: any) {
                            if (updateItem.refreshMode == null) {
                                updateItem.refreshMode = "value";
                            }
                            if (updateItem.autoResetEntityState == null) {
                                updateItem.autoResetEntityState = true;
                            }
                            if (updateItem.validateData == null) {
                                updateItem.validateData = true;
                            }
                            if (updateItem.dataSet == null) {
                                return;
                            }
                            if (typeof updateItem.dataSet === "string") {
                                updateItem.dataSet = self.get("view").id(updateItem.dataSet);
                            } else {
                                if (!(updateItem.dataSet instanceof dorado.widget.DataSet)) {
                                    let ref = updateItem.dataSet;
                                    updateItem.dataSet = ref.view.id(ref.component);
                                }
                            }
                        });
                    }
                    return updateItems;
                }
            }, alwaysExecute: {}, hasUpdateData: {
                readOnly: true, getter: function() {
                    if (!this._updateItems.length) {
                        return false;
                    } else {
                        try {
                            let context = this.getResolveContext();
                            return context.hasUpdateData;
                        } catch (e) {
                            if (e instanceof dorado.widget.UpdateAction.ValidateException) {
                                dorado.Exception.removeException(e);
                                return true;
                            }
                        }
                    }
                }
            }, executingMessage: {
                defaultValue: function() {
                    return $resource("dorado.baseWidget.SubmitingData");
                }
            }
        }, EVENTS: {
            beforeExecute: {
                interceptor: function(superFire: any, self: any, arg: any) {
                    let retval = superFire(self, arg);
                    this._realExecutingMessage = self._executingMessage;
                    this._executingMessage = "none";
                    this._realConfirmMessage = self._confirmMessage;
                    this._confirmMessage = "none";
                    return retval;
                }
            }, beforeUpdate: {}, onUpdate: {}, onGetUpdateData: {}
        }, constructor: function(id: any) {
            this._updateItems = [];
            $invokeSuper.call(this, arguments);
        }, getResolveContext: function() {
            function mergeValidateContext(context: any, contextForMerge: any) {
                if (!context) {
                    return contextForMerge;
                }
                if (VALIDATION_RESULT_CODE[contextForMerge.result] > VALIDATION_RESULT_CODE[context.result]) {
                    context.result = contextForMerge.result;
                }
                context.info = context.info.concat(contextForMerge.info);
                context.ok = context.ok.concat(contextForMerge.ok);
                context.warn = context.warn.concat(contextForMerge.warn);
                context.error = context.error.concat(contextForMerge.error);
                context.executing = context.executing.concat(contextForMerge.executing);
                context.executingValidationNum += contextForMerge.executingValidationNum;
                return context;
            }

            function validateEntity(validateContext: any, entity: any, validateOptions: any, validateSubEntities: any) {
                if (entity.isDirty() && entity.state !== dorado.Entity.STATE_DELETED) {
                    validateOptions.context = {};
                    entity.validate(validateOptions);
                    validateContext = mergeValidateContext(validateContext, validateOptions.context);
                }
                if (validateSubEntities) {
                    for (let p in entity._data) {
                        if (p.charAt(0) === "$") {
                            continue;
                        }
                        let v = entity._data[p];
                        if (!v) {
                            continue;
                        }
                        if (v instanceof dorado.Entity) {
                            validateContext = validateEntity(validateContext, v, validateOptions, validateSubEntities);
                        } else {
                            if (v instanceof dorado.EntityList) {
                                let it = v.iterator();
                                while (it.hasNext()) {
                                    let e = it.next();
                                    validateContext = validateEntity(validateContext, e, validateOptions, validateSubEntities);
                                }
                            }
                        }
                    }
                }
                return validateContext;
            }

            let dataItems = [], updateInfos = [], aliasMap = {}, hasUpdateData = false,
                updateItems = this.get("updateItems");
            for (let i = 0; i < updateItems.length; i++) {
                let updateItem = updateItems[i];
                let dataSet = updateItem.dataSet;
                let options = updateItem.options;
                if (!options && options instanceof Object) {
                    if (options.loadMode !== false) {
                        options.loadMode = true;
                    }
                    if (options.includeUnsubmittableProperties !== true) {
                        options.includeUnsubmittableProperties = false;
                    }
                    if (options.generateDataType !== false) {
                        options.generateDataType = true;
                    }
                    if (options.generateState !== false) {
                        options.generateState = true;
                    }
                    if (options.generateEntityId !== false) {
                        options.generateEntityId = true;
                    }
                } else {
                    options = {
                        loadMode: "never",
                        includeUnsubmittableProperties: false,
                        generateDataType: true,
                        generateState: true,
                        generateEntityId: true
                    };
                }
                updateItem.options = options;
                options.includeDeletedEntity = updateItem.submitDeletedEntity;
                options.firstResultOnly = updateItem.firstResultOnly;
                options.generateOldData = updateItem.submitOldData;
                options.simplePropertyOnly = updateItem.submitSimplePropertyOnly;
                let alias = updateItem.alias;
                if (dataSet) {
                    alias = alias || dataSet._id;
                    aliasMap[alias] = dataSet;
                } else {
                    if (!alias) {
                        alias = "$alias" + i;
                    }
                }
                let dataPath = updateItem.dataPath || "!DIRTY_TREE";
                if (dataPath.indexOf("!DIRTY_TREE") >= 0) {
                    options.entityFilter = filterCascadeDrityEntity;
                    options.includeDeletedEntity = true;
                    CASCADE_NOT_DRITY_ENTITYS = {};
                } else {
                    if (updateItem.submitSimplePropertyOnly) {
                        options.entityFilter = filterCascadeDrityEntity;
                        CASCADE_NOT_DRITY_ENTITYS = {};
                    }
                }
                let entityFilter = options.entityFilter;
                let data;
                if (dataSet) {
                    dataSet.post();
                    data = dataSet.queryData(dataPath, options);
                }
                let eventArg = {updateItem: updateItem, data: data};
                this.fireEvent("onGetUpdateData", this, eventArg);
                data = eventArg.data;
                if (data) {
                    let validateContext;
                    if (updateItem.validateData) {
                        let validateOptions = {
                            force: false,
                            validateSimplePropertyOnly: updateItem.submitSimplePropertyOnly
                        };
                        let validateSubEntities = !updateItem.submitSimplePropertyOnly;
                        if (data instanceof Array) {
                            for (let j = 0; j < data.length; j++) {
                                let entity = data[j];
                                if (entity instanceof dorado.Entity) {
                                    validateContext = validateEntity(validateContext, entity, validateOptions, validateSubEntities);
                                }
                            }
                        } else {
                            if (data instanceof dorado.EntityList) {
                                for (let it = data.iterator(); it.hasNext();) {
                                    let entity = it.next();
                                    validateContext = validateEntity(validateContext, entity, validateOptions, validateSubEntities);
                                }
                            } else {
                                if (data instanceof dorado.Entity) {
                                    validateContext = validateEntity(validateContext, data, validateOptions, validateSubEntities);
                                }
                            }
                        }
                    }
                }
                dataItems.push({
                    updateItem: updateItem,
                    alias: alias,
                    data: data,
                    refreshMode: updateItem.refreshMode,
                    autoResetEntityState: updateItem.autoResetEntityState
                });
            }
            if (validateContext) {
                let errorLength = validateContext.error.length + validateContext.warn.length;
                if (validateContext.result === "invalid" && errorLength > 0) {
                    let errorMessage = $resource("dorado.baseWidget.SubmitInvalidData") + "\n";
                    if (errorLength === 1) {
                        if (validateContext.error.length) {
                            errorMessage += validateContext.error[0].text;
                        } else {
                            errorMessage += validateContext.warn[0].text;
                        }
                    } else {
                        errorMessage += $resource("dorado.baseWidget.SubmitValidationSummary", validateContext.error.length, validateContext.warn.length);
                    }
                    throw new dorado.widget.UpdateAction.ValidateException(errorMessage, validateContext);
                } else {
                    if (validateContext.executing.length > 0) {
                        throw new dorado.ResourceException("dorado.baseWidget.SubmitValidatingData", validateContext.executing.length);
                    }
                }
            }
            for (let i = 0; i < dataItems.length; i++) {
                let dataItem = dataItems[i], updateItem = dataItem.updateItem, data = dataItem.data,
                    options = updateItem.options;
                delete dataItem.updateItem;
                options = options || {};
                let entities = [], context = {entities: []};
                if (data) {
                    if (data instanceof Array) {
                        let v = data, data = [];
                        hasUpdateData = hasUpdateData || (v.length > 0);
                        for (let j = 0; j < v.length; j++) {
                            let entity = v[j];
                            if (entity instanceof dorado.Entity) {
                                entities.push(entity);
                                data.push(entity.toJSON(options, context));
                            }
                        }
                    } else {
                        if (data instanceof dorado.EntityList || data instanceof dorado.Entity) {
                            hasUpdateData = true;
                            if (updateItem.refreshMode === "cascade") {
                                if (data instanceof dorado.Entity) {
                                    if (updateItem.refreshMode === "cascade") {
                                        entities.push(data);
                                    }
                                } else {
                                    for (let it = data.iterator(); it.hasNext();) {
                                        let entity = it.next();
                                        if (updateItem.refreshMode === "cascade") {
                                            entities.push(entity);
                                        }
                                    }
                                }
                            }
                            data = data.toJSON(options, context);
                        }
                    }
                }
                if ((!data || !data.$isWrapper) && updateItem.dataSet) {
                    options.acceptAggregationDataType = true;
                    let dataType = updateItem.dataSet.getDataType(updateItem.dataPath, options);
                    if (dataType) {
                        if (dataType instanceof dorado.AggregationDataType && !data && !(data instanceof Array)) {
                            dataType = dataType.get("elementDataType");
                        }
                        data = {$isWrapper: true, $dataType: dataType._id, data: data};
                    }
                }
                dataItem.data = data;
                updateInfos.push({
                    alias: dataItem.alias,
                    refreshMode: updateItem.refreshMode,
                    entities: ((updateItem.refreshMode === "cascade") ? entities : context.entities)
                });
            }
            return {
                aliasMap: aliasMap,
                updateInfos: updateInfos,
                dataResolverArg: {
                    dataItems: dataItems,
                    parameter: this._parameter,
                    sysParameter: this._sysParameter ? this._sysParameter.toJSON() : undefined,
                    view: this._view
                },
                hasUpdateData: hasUpdateData
            };
        }, doExecuteSync: function() {
            return this.doExecuteAsync();
        }, doExecuteAsync: function(callback: any) {
            this._executingMessage = this._realExecutingMessage;
            delete this._realExecutingMessage;
            this._confirmMessage = this._realConfirmMessage;
            delete this._realConfirmMessage;
            let confirmMessage = this._confirmMessage, executingMessage = this._executingMessage;

            function processEntityStates(entityStates: any, context: any) {
                function processEntity(entity: any, entityStates: any, refreshMode: any) {
                    if (!entity.entityId) {
                        return;
                    }
                    let b;
                    if (refreshMode !== "cascade") {
                        let data = entity.getData();
                        for (let p in data) {
                            if (!data.hasOwnProperty(p)) {
                                continue;
                            }
                            let v = data[p];
                            if (v instanceof Object && v.entityId) {
                                b = processEntity(v, entityStates) || b;
                            }
                        }
                    }
                    entity.disableEvents = true;
                    try {
                        let state = entityStates[entity.entityId] || dorado.Entity.STATE_NONE;
                        if (state.constructor === Number) {
                            delete entity._oldData;
                            if (state === dorado.Entity.STATE_DELETED) {
                                entity.remove(true);
                            } else {
                                if (entity.state === state) {
                                    return b;
                                } else {
                                    if (state === dorado.Entity.STATE_NONE) {
                                        entity.resetState();
                                    } else {
                                        entity.setState(state);
                                    }
                                }
                            }
                        } else {
                            let s = state.$state || dorado.Entity.STATE_NONE;
                            delete state.$state;
                            if (refreshMode === "cascade") {
                                for (let p in state) {
                                    if (state.hasOwnProperty(p)) {
                                        let pd = entity.getPropertyDef(p);
                                        if (pd && !pd._submittable) {
                                            delete state[p];
                                        }
                                    }
                                }
                                entity.fromJSON(state);
                            } else {
                                let dataType = entity.dataType;
                                if (dataType) {
                                    dataType.set("validatorsDisabled", true);
                                }
                                for (let p in state) {
                                    if (state.hasOwnProperty(p)) {
                                        let pd = entity.getPropertyDef(p);
                                        if (pd && pd._submittable) {
                                            let dt = pd.get("dataType");
                                            if (dt instanceof dorado.AggregationDataType || dt instanceof dorado.EntityDataType) {
                                                continue;
                                            }
                                            entity.set(p, state[p]);
                                        }
                                    }
                                }
                                if (dataType) {
                                    dataType.set("validatorsDisabled", false);
                                }
                            }
                            delete entity._oldData;
                            if (s === dorado.Entity.STATE_NONE) {
                                entity.resetState();
                            } else {
                                entity.setState(s);
                            }
                        }
                    } finally {
                        entity.disableEvents = false;
                    }
                    return true;
                }

                function processUpdateInfo(updateInfo: any, entityStates: any) {
                    if (updateInfo.refreshMode === "none") {
                        return false;
                    }
                    let b = false, entities = updateInfo.entities;
                    if (updateInfo.refreshMode === "cascade") {
                        let map = {};
                        for (let i = 0; i < entities.length; i++) {
                            let entity = entities[i];
                            map[entity.entityId] = entity;
                        }
                        for (let entityId in entityStates) {
                            if (entityStates.hasOwnProperty(entityId)) {
                                let entity = map[entityId];
                                if (entity) {
                                    b = processEntity(entity, entityStates, updateInfo.refreshMode) || b;
                                }
                            }
                        }
                    } else {
                        for (let i = 0; i < entities.length; i++) {
                            let entity = entities[i];
                            b = processEntity(entity, entityStates, updateInfo.refreshMode) || b;
                        }
                    }
                    return b;
                }

                let updateInfos = context.updateInfos, changedDataSets = [];
                for (let i = 0; i < updateInfos.length; i++) {
                    let updateInfo = updateInfos[i], alias = updateInfo.alias, dataSet = context.aliasMap[alias];
                    if (!dataSet && updateInfo.entities.length) {
                        dataSet = dorado.widget.DataSet.getOwnerDataSet(updateInfo.entities[0]);
                    }
                    if (dataSet) {
                        dataSet.disableObservers();
                    }
                    try {
                        if (processUpdateInfo(updateInfos[i], entityStates) && dataSet) {
                            changedDataSets.push(dataSet);
                        }
                    } finally {
                        if (dataSet) {
                            dataSet.enableObservers();
                        }
                    }
                }
                jQuery.each(changedDataSets, function(i: any, dataSet: any) {
                    dataSet.notifyObservers();
                });
            }

            function doUpdate(context: any, dataResolverArg: any) {
                let eventArg = {
                    dataItems: dataResolverArg.dataItems,
                    parameter: dataResolverArg.parameter,
                    processDefault: true
                };
                this.fireEvent("beforeUpdate", this, eventArg);
                if (eventArg.processDefault && this._dataResolver) {
                    let dataResolver = this._dataResolver;
                    dataResolver.supportsEntity = this._supportsEntity;
                    dataResolver.dataTypeRepository = this.get("dataTypeRepository");
                    dataResolver.message = executingMessage ? executingMessage : "";
                    dataResolver.modal = this._modal;
                    if (callback) {
                        return dataResolver.resolveAsync(dataResolverArg, {
                            scope: this, callback: function(success: any, result: any) {
                                if (success) {
                                    processEntityStates.call(this, result.entityStates, context);
                                }
                                $callback(callback, success, (success) ? result.returnValue : result);
                                this.fireEvent("onUpdate", this, eventArg);
                            }
                        });
                    } else {
                        let result = dataResolver.resolve(dataResolverArg);
                        processEntityStates.call(this, result.entityStates, context);
                        this.fireEvent("onUpdate", this, eventArg);
                        return result.returnValue;
                    }
                } else {
                    $callback(callback, true);
                }
            }

            let context;
            try {
                context = this.getResolveContext();
            } catch (e) {
                if (e instanceof dorado.widget.UpdateAction.ValidateException) {
                    dorado.Exception.removeException(e);
                    let eventArg = {success: false, error: e, processDefault: true};
                    this.fireEvent("onFailure", this, eventArg);
                    if (eventArg.processDefault) {
                        if (dorado.widget.UpdateAction.alertException) {
                            dorado.widget.UpdateAction.alertException(e);
                        } else {
                            throw e;
                        }
                    }
                    throw new dorado.AbortException();
                } else {
                    throw e;
                }
            }
            let dataResolverArg = context.dataResolverArg;
            if (this._alwaysExecute || !this._updateItems.length || context.hasUpdateData) {
                if (confirmMessage && confirmMessage !== "none") {
                    let self = this;
                    dorado.MessageBox.confirm(confirmMessage, {
                        detailCallback: function(buttonId: any) {
                            if (buttonId === "yes") {
                                return doUpdate.call(self, context, dataResolverArg);
                            } else {
                                $callback(callback, false);
                            }
                        }
                    });
                } else {
                    return doUpdate.call(this, context, dataResolverArg);
                }
            } else {
                if (!this._alwaysExecute && this._updateItems.length && !context.hasUpdateData) {
                    dorado.widget.NotifyTipManager.notify($resource("dorado.baseWidget.NoDataToSubmit"));
                }
                if (callback) {
                    $callback(callback, false);
                } else {
                    return false;
                }
            }
        }
    });
    dorado.widget.UpdateAction.ValidateException = $extend(dorado.Exception, {
        constructor: function(message: any, validateContext: any) {
            $invokeSuper.call(this, arguments);
            this.validateContext = validateContext;
        }
    });
})();
(function() {
    let form_prefix = "form_submit_action_", form_seed = 1;
    let dateToJSON = function(date: any) {
        function f(n: any) {
            return n < 10 ? "0" + n : n;
        }

        return date.getUTCFullYear() + "-" + f(date.getUTCMonth() + 1) + "-" + f(date.getUTCDate()) + "T" + f(date.getUTCHours()) + ":" + f(date.getUTCMinutes()) + ":" + f(date.getUTCSeconds()) + "Z";
    };
    dorado.widget.FormSubmitAction = $extend(dorado.widget.Action, {
        $className: "dorado.widget.FormSubmitAction",
        ATTRIBUTES: {action: {}, target: {defaultValue: "_self"}, method: {defaultValue: "post"}},
        doSubmitData: function(data: any) {
            let action = this, form = document.createElement("form");
            form.name = form_prefix + form_seed++;
            form.style.display = "none";
            form.action = dorado.util.Common.translateURL(action._action);
            form.target = action._target || "_self";
            form.method = action._method || "post";
            for (let param in data) {
                let input = document.createElement("input"), value = data[param], string = "";
                if (value !== undefined) {
                    if (value instanceof Date) {
                        string = dateToJSON(value);
                    } else {
                        if (value.toString) {
                            string = value.toString();
                        }
                    }
                }
                input.type = "hidden";
                input.value = string;
                input.name = param;
                form.appendChild(input);
            }
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        },
        doExecute: function() {
            let action = this, parameter = dorado.JSON.evaluate(action._parameter), data = {};
            if (parameter && parameter instanceof dorado.Entity) {
                data = parameter.toJSON();
            } else {
                if (parameter) {
                    data = parameter;
                }
            }
            action.doSubmitData(data);
        }
    });
})();
(function() {
    let ACTIVE_STATES = ["running", "resuming"];
    let ALIVE_STATES = ["running", "suspending", "suspended", "resuming"];
    dorado.widget.LongTask = $extend(dorado.widget.Action, {
        $className: "dorado.widget.LongTask",
        ATTRIBUTES: {
            taskName: {},
            socket: {},
            appearence: {defaultValue: "daemonTask", writeBeforeReady: true},
            disableOnActive: {defaultValue: true},
            stateInfo: {},
            lastLog: {},
            active: {
                readOnly: true, getter: function() {
                    return ACTIVE_STATES.indexOf(this._stateInfo.state) >= 0;
                }
            },
            alive: {
                readOnly: true, getter: function() {
                    return ALIVE_STATES.indexOf(this._stateInfo.state) >= 0;
                }
            }
        },
        EVENTS: {onTaskScheduled: {}, onTaskEnd: {}, onStateChange: {}, onReceive: {}, onLog: {}},
        onReady: function() {
            $invokeSuper.call(this);
            this.connect();
        },
        onReceiveAll: function(type: any, data: any) {
            let task = this;
            if (task._starting) {
                if (!task._pendingMessages) {
                    task._pendingMessages = [];
                }
                task._pendingMessages.push({type: type, data: data});
            } else {
                switch (type) {
                    case "state":
                        task.onStateChange(data);
                        break;
                    case "log":
                        task.onLog(data);
                        break;
                    default:
                        task.fireEvent("onReceive", task, {type: type, data: data});
                }
            }
        },
        getStateDisplayInfo: function(stateInfo: any) {
            let task = this, text = stateInfo.text;
            if (!text) {
                text = (task._caption || $resource("dorado.baseWidget.LongTask")) + " [" + $resource("dorado.baseWidget.LongTask." + stateInfo.state) + "]";
            }
            return {
                text: text,
                startTime: (stateInfo.localStartTime) ? new Date(stateInfo.localStartTime) : new Date()
            };
        },
        onTaskScheduled: function(stateInfo: any) {
            let task = this;
            task._isAlive = true;
            let displayInfo = task.getStateDisplayInfo(stateInfo);
            switch (task._appearence) {
                case "daemonTask":
                    task._taskIndicatorId = dorado.util.TaskIndicator.showTaskIndicator(displayInfo.text, "daemon", displayInfo.startTime);
                    break;
                case "mainTask":
                    task._taskIndicatorId = dorado.util.TaskIndicator.showTaskIndicator(displayInfo.text, "main", displayInfo.startTime);
                    break;
            }
            if (task._disableOnActive) {
                task._sysDisabled = true;
            }
            task.notifyBindingObjects();
            task.fireEvent("onTaskScheduled", task, stateInfo);
        },
        onTaskEnd: function(stateInfo: any) {
            let task = this, state = stateInfo.state;
            task._isAlive = false;
            task.fireEvent("onTaskEnd", task, stateInfo);
            let success = (state === "terminated"), eventArg = {success: success};
            let result = stateInfo.data;
            if (result && !eventArg.success) {
                result = new dorado.RemoteException(result.message, result.exceptionType, result.stackTrace);
            } else {
                task._returnValue = result;
            }
            eventArg[eventArg.success ? "result" : "error"] = result;
            task.fireEvent("onExecute", task, eventArg);
            eventArg.processDefault = true;
            task.fireEvent((success) ? "onSuccess" : "onFailure", task, eventArg);
            if (task._disableOnActive) {
                task._sysDisabled = false;
            }
            task.notifyBindingObjects();
            if (!success && !eventArg.processDefault) {
                dorado.Exception.removeException(result);
            }
            switch (task._appearence) {
                case "daemonTask":
                case "mainTask":
                    dorado.util.TaskIndicator.hideTaskIndicator(task._taskIndicatorId);
                    break;
            }
        },
        onStateChange: function(stateInfo: any) {
            let task = this;
            if (stateInfo) {
                let remoteStartTime = (stateInfo.state === "waiting") ? stateInfo.waitingStartTime : stateInfo.runningStartTime;
                let timeGap = stateInfo.transferTimestamp - (new Date()).getTime();
                stateInfo.localStartTime = remoteStartTime - timeGap;
            }
            task._stateInfo = stateInfo;
            task.fireEvent("onStateChange", task, stateInfo);
            if (stateInfo) {
                let state = stateInfo.state;
                if (["terminated", "error", "aborted"].indexOf(state) >= 0) {
                    if (task._isAlive) {
                        task.onTaskEnd(stateInfo);
                    }
                } else {
                    if (!task._isAlive) {
                        task.onTaskScheduled(stateInfo);
                    }
                }
                switch (task._appearence) {
                    case "daemonTask":
                    case "mainTask":
                        let displayInfo = task.getStateDisplayInfo(stateInfo);
                        dorado.util.TaskIndicator.updateTaskIndicator(task._taskIndicatorId, displayInfo.text, displayInfo.startTime);
                        break;
                }
            }
        },
        onLog: function(log: any) {
            let task = this;
            task._lastLog = log;
            task.fireEvent("onLog", task, log);
            let stateInfo = task._stateInfo;
            if (stateInfo) {
                switch (task._appearence) {
                    case "daemonTask":
                    case "mainTask":
                        let displayInfo = task.getStateDisplayInfo(stateInfo);
                        dorado.util.TaskIndicator.updateTaskIndicator(task._taskIndicatorId, displayInfo.text + "\n" + log.text);
                        break;
                }
            }
        },
        connect: function() {
            let task = this;
            let socket = task._socket = dorado.Socket.connect({
                service: "dorado.connectLongTask", parameter: task._taskName, onReceive: function(self: any, arg: any) {
                    task.onReceiveAll(arg.type, arg.data);
                }
            }, function(stateInfo: any) {
                if (stateInfo != null) {
                    task.onStateChange(stateInfo);
                }
            });
        },
        getAjaxOptions: function(service: any) {
            let task = this, jsonData = {
                action: "remote-service",
                service: service,
                parameter: {
                    taskName: task._taskName,
                    socketId: task._socket._socketId,
                    parameter: dorado.JSON.evaluate(task._parameter)
                },
                sysParameter: task._sysParameter ? task._sysParameter.toJSON() : undefined,
                context: (task._view ? task._view.get("context") : null)
            };
            if (this._supportsEntity) {
                jsonData.loadedDataTypes = task.get("dataTypeRepository").getLoadedDataTypes();
            }
            return dorado.Object.apply({jsonData: jsonData, batchable: true}, $setting["ajax.remoteServiceOptions"]);
        },
        doStart: function(callback: any) {
            let task = this;
            let ajaxOptions = task.getAjaxOptions("dorado.startLongTask"),
                ajax = dorado.util.AjaxEngine.getInstance(ajaxOptions);
            task._starting = true;
            ajax.request(ajaxOptions, {
                callback: function(success: any, result: any) {
                    try {
                        result = result.getJsonData();
                        if (success) {
                            task.bind("onExecute", function(self: any, arg: any) {
                                task.unbind("onExecute", arguments.callee);
                                $callback(callback, arg.success, arg.result);
                            });
                            task.onStateChange({state: "waiting"});
                        } else {
                            $callback(callback, false, result && result.exception);
                        }
                    } finally {
                        task._starting = false;
                        if (task._pendingMessages) {
                            let messages = task._pendingMessages;
                            delete task._pendingMessages;
                            setTimeout(function() {
                                messages.each(function(message: any) {
                                    task.onReceiveAll(message.type, message.data);
                                });
                            }, 0);
                        }
                    }
                }
            });
        },
        checkSocket: function(callback: any) {
            let task = this;
            if (!task._socket) {
                setTimeout(function() {
                    task.checkSocket(callback);
                }, 30);
            } else {
                callback();
            }
        },
        execute: function(callback: any) {
            let task = this, eventArg = {processDefault: true};
            task.fireEvent("beforeExecute", task, eventArg);
            if (eventArg.processDefault) {
                if (task._confirmMessage) {
                    dorado.MessageBox.confirm(task._confirmMessage, function() {
                        task.checkSocket(function() {
                            task.doStart(callback);
                        });
                    });
                } else {
                    task.checkSocket(function() {
                        task.doStart(callback);
                    });
                }
            }
        },
        start: function(callback: any) {
            this.execute(callback);
        },
        abort: function(callback: any) {
            let task = this;
            task.checkSocket(function() {
                task.bind("onTaskEnd", function(self: any, arg: any) {
                    task.unbind("onTaskEnd", arguments.callee);
                    $callback(callback, (arg.state === "aborted"), arg.data);
                });
                task._socket.send("abort");
            });
        },
        suspend: function(callback: any) {
            let task = this;
            task.checkSocket(function() {
                task._socket.send("suspend");
            });
        },
        resume: function(callback: any) {
            let task = this;
            task.checkSocket(function() {
                task._socket.send("resume");
            });
        },
        send: function(type: any, data: any, callback: any) {
            let task = this;
            task.checkSocket(function() {
                task._socket.send(type, data, callback);
            });
        }
    });
})();
dorado.widget.AbstractButton = $extend([dorado.widget.Control, dorado.widget.ActionSupport], {
    selectable: false, ATTRIBUTES: {
        disabled: {
            setter: function(value: any) {
                this._disabled = value;
                this.onDisabledChange && this.onDisabledChange();
            }
        }, toggleable: {}, menu: {componentReference: true}, toggleOnShowMenu: {defaultValue: true}, toggled: {
            skipRefresh: true, setter: function(value: any) {
                let button = this;
                if (button._toggled !== value) {
                    button._toggled = value;
                    button.fireEvent("onToggle", button);
                    button.doSetToggle(value);
                }
            }
        }, tip: {
            getter: function() {
                return this._tip || (this._action && this._action._tip);
            }
        }
    }, EVENTS: {onToggle: {}}, onClick: function() {
        let button = this, action = button._action;
        if (button.getListenerCount("onClick") === 0 && action) {
            action.execute && action.execute();
        }
        if (button._toggleable) {
            button.set("toggled", !button._toggled);
        }
        return false;
    }, click: function() {
        this.onClick();
        this.fireEvent("onClick", self, {});
    }
});
(function() {
    let BUTTON_CLICK_CLASS = "-click", BUTTON_HOVER_CLASS = "-hover", BUTTON_TOGGLED_CLASS = "-toggled",
        BUTTON_DISABLED_CLASS = "-disabled";
    dorado.widget.SimpleButton = $extend(dorado.widget.AbstractButton, {
        $className: "dorado.widget.SimpleButton",
        ATTRIBUTES: {
            className: {defaultValue: "d-simple-button"},
            mouseDownClassName: {},
            hoverClassName: {},
            toggledClassName: {},
            disabledClassName: {}
        },
        doSetToggle: function() {
            let button = this, dom = button._dom, cls = button._className, toggledClass = button._toggledClassName;
            if (dom) {
                $fly(dom).toggleClass("d-toggled " + (toggledClass ? toggledClass : (cls + BUTTON_TOGGLED_CLASS)), !!button._toggled);
            }
        },
        doShowMenu: function() {
            let button = this, menu = button._menu, dom = button._dom, cls = button._className,
                toggledClass = button._toggledClassName;
            if (menu) {
                menu.bind("onShow", function() {
                    if (button._toggleOnShowMenu) {
                        $fly(dom).addClass("d-toggled " + (toggledClass ? toggledClass : (cls + BUTTON_TOGGLED_CLASS)));
                    }
                    menu.bind("onHide", function() {
                        if (button._toggleOnShowMenu) {
                            $fly(dom).removeClass("d-toggled " + (toggledClass ? toggledClass : (cls + BUTTON_TOGGLED_CLASS)));
                        }
                    }, {once: true});
                }, {once: true});
                menu._focusParent = button;
                menu.show({anchorTarget: button, align: "innerleft", vAlign: "bottom"});
            }
        },
        onDisabledChange: function() {
            let button = this, dom = button._dom, cls = button._className, hoverClass = button._hoverClassName;
            if (dom) {
                $fly(dom).removeClass("d-hover " + (hoverClass ? hoverClass : (button._className + BUTTON_HOVER_CLASS))).removeClass(cls + "-focused");
            }
        },
        createDom: function() {
            let button = this, dom = document.createElement("div"), hoverClass = button._hoverClassName,
                mouseDownClass = button._mouseDownClassName;
            dom.className = button._className;
            $fly(dom).hover(function() {
                if (!button._disabled) {
                    $fly(dom).addClass("d-hover " + (hoverClass ? hoverClass : (button._className + BUTTON_HOVER_CLASS)));
                }
            }, function() {
                $fly(dom).removeClass("d-hover " + (hoverClass ? hoverClass : (button._className + BUTTON_HOVER_CLASS)));
            }).mousedown(function() {
                if (!button._disabled) {
                    $fly(dom).addClass("d-click " + (mouseDownClass ? mouseDownClass : (button._className + BUTTON_CLICK_CLASS)));
                }
                $(document).one("mouseup", function() {
                    $fly(dom).removeClass("d-click " + (mouseDownClass ? mouseDownClass : (button._className + BUTTON_CLICK_CLASS)));
                });
            });
            return dom;
        },
        refreshDom: function(dom: any) {
            $invokeSuper.call(this, arguments);
            let button = this, cls = button._className, disabledClass = button._disabledClassName,
                toggledClass = button._toggledClassName;
            $fly(dom).toggleClass("d-disabled " + (disabledClass ? disabledClass : (cls + BUTTON_DISABLED_CLASS)), !!button._disabled).toggleClass("d-toggled " + (toggledClass ? toggledClass : (cls + BUTTON_TOGGLED_CLASS)), !!button._toggled);
        },
        onClick: function() {
            $invokeSuper.call(this, arguments);
            if (this._menu) {
                this.doShowMenu();
            }
        }
    });
    dorado.widget.SimpleIconButton = $extend(dorado.widget.SimpleButton, {
        $className: "dorado.widget.SimpleIconButton",
        ATTRIBUTES: {
            className: {defaultValue: "d-icon-button"},
            width: {independent: true},
            height: {independent: true},
            icon: {},
            iconClass: {},
            showTrigger: {writeBeforeReady: true}
        },
        createDom: function() {
            this._className = this._showTrigger === true || (this._menu && (this._showTrigger !== false)) ? this._className + "-trigger d-trigger" : this._className;
            let dom = $invokeSuper.call(this, arguments);
            $fly(dom).addClass(this._className).xCreate({tagName: "div", className: "d-icon"});
            return dom;
        },
        refreshDom: function(dom: any) {
            $invokeSuper.call(this, arguments);
            let button = this, cls = button._className, action = button._action || {},
                icon = button._icon || action._icon, iconClass = button._iconClass || action._iconClass;
            let iconEl = dom.firstChild;
            $DomUtils.setBackgroundImage(iconEl, icon);
            if (iconClass) {
                iconEl.className = "d-icon " + iconClass;
            }
            $fly(dom).toggleClass("d-disabled " + cls + BUTTON_DISABLED_CLASS, !!(button._disabled || action._disabled));
        }
    });
})();
(function() {
    let BLANK_PATH = "about:blank";
    dorado.widget.IFrame = $extend(dorado.widget.Control, {
        $className: "dorado.widget.IFrame", ATTRIBUTES: {
            className: {defaultValue: "d-iframe"}, name: {writeBeforeReady: true}, path: {
                skipRefresh: true, setter: function(value: any) {
                    let frame = this, oldPath = frame._path, dom = frame._dom, doms = frame._doms;
                    if (oldPath === value) {
                        return;
                    }
                    frame._path = value;
                    if (dom) {
                        $fly(doms.loadingCover).css("display", "block");
                        frame.releaseCurrentPage();
                        $fly(doms.iframe).addClass("hidden");
                        if (oldPath !== value) {
                            frame._loaded = false;
                        }
                        if (frame.isActualVisible()) {
                            frame.replaceUrl(value);
                        } else {
                            frame._toReplaceUrl = value;
                        }
                    }
                }
            }, iFrameWindow: {
                readOnly: true, getter: function() {
                    return this.getIFrameWindow();
                }
            }
        }, EVENTS: {onLoad: {}}, getDomainInfo: function(domain: any) {
            let regex = /^(http[s]?):\/\/([\w.]+)(:([\d]+))?/ig, result = regex.exec(domain);
            if (result) {
                return {protocol: result[1], domain: result[2], port: result[4]};
            } else {
                return {};
            }
        }, isSameDomain: function() {
            let iframeSrc = $url(this._path);
            if (/^(http[s]?|file):/ig.test(iframeSrc)) {
                let localDomain = this.getDomainInfo(location.href), frameDomain = this.getDomainInfo(iframeSrc);
                return localDomain.protocol === frameDomain.protocol && localDomain.domain === frameDomain.domain && localDomain.port === frameDomain.port;
            }
            return true;
        }, releaseCurrentPage: function() {
            let frame = this, doms = frame._doms;
            if (doms) {
                try {
                    if (frame.isSameDomain()) {
                        if (doms.iframe.contentWindow.dorado) {
                            doms.iframe.contentWindow.dorado.cleanContentOnClose = true;
                            doms.iframe.contentWindow.dorado.Exception.IGNORE_ALL_EXCEPTIONS = true;
                        }
                        if (dorado.Browser.msie) {
                            doms.iframe.contentWindow.close();
                            CollectGarbage();
                        } else {
                            doms.iframe.contentWindow.close();
                        }
                    } else {
                        frame.replaceUrl(null);
                    }
                } catch (e) {
                }
            }
        }, destroy: function() {
            let frame = this, doms = frame._doms;
            frame.releaseCurrentPage();
            if (doms) {
                $fly(doms.iframe).remove();
            }
            $invokeSuper.call(frame);
        }, createDom: function() {
            let frame = this, doms = {}, dom = $DomUtils.xCreate({
                tagName: "div",
                content: [{
                    tagName: "iframe",
                    className: "iframe hidden",
                    contextKey: "iframe",
                    scrolling: dorado.Browser.iOS ? "no" : "auto",
                    frameBorder: 0
                }, {
                    tagName: "div",
                    contextKey: "loadingCover",
                    className: "frame-loading-cover",
                    style: {display: "none"},
                    content: {
                        tagName: "div",
                        className: "frame-loading-image",
                        contextKey: "loadingCoverImg",
                        content: {tagName: "div", className: "spinner"}
                    }
                }]
            }, null, doms);
            if (frame._name !== undefined) {
                doms.iframe.name = frame._name || "";
            }
            frame._doms = doms;
            return dom;
        }, doOnAttachToDocument: function() {
            let frame = this, doms = frame._doms, iframe = doms.iframe;
            $fly(iframe).on('load', function() {
                $fly(doms.loadingCover).css("display", "none");
                if (!(dorado.Browser.msie && dorado.Browser.version === 6)) {
                    $fly(iframe).removeClass("hidden");
                }
                if (!frame.isActualVisible()) {
                    frame._notifyResizeOnVisible = true;
                    frame.onActualVisibleChange();
                }
                frame.fireEvent("onLoad", frame);
                if (frame.isSameDomain()) {
                    if (frame._replacedUrl && frame._replacedUrl !== BLANK_PATH) {
                        frame._loaded = true;
                    }
                } else {
                    if (iframe.src && iframe.src !== BLANK_PATH) {
                        frame._loaded = true;
                    }
                }
            });
            frame.doLoad();
        }, replaceUrl: function(url: any) {
            let frame = this, doms = frame._doms, replacedUrl = $url(url || BLANK_PATH);
            delete frame._notifyResizeOnVisible;
            if (frame.isSameDomain()) {
                frame._replacedUrl = replacedUrl;
                if (frame.getIFrameWindow()) {
                    frame.getIFrameWindow().location.replace(replacedUrl);
                }
            } else {
                $fly(doms.iframe).prop("src", replacedUrl);
            }
        }, doLoad: function() {
            let frame = this, doms = frame._doms;
            $fly(doms.loadingCover).css("display", "");
            if (frame._path) {
                this.replaceUrl(frame._path);
            }
        }, reloadIfNotLoaded: function() {
            let frame = this;
            if (!frame._loaded && frame._path) {
                frame.doLoad();
            }
        }, cancelLoad: function() {
            this.replaceUrl(null);
        }, doOnResize: function() {
            if (dorado.Browser.isTouch) {
                $fly(this._doms.iframe).css({width: this._dom.clientWidth, height: this._dom.clientHeight});
            }
        }, reload: function() {
            let frame = this;
            if (dorado.Browser.msie && dorado.Browser.version < 8) {
                frame.releaseCurrentPage();
                frame.replaceUrl(null);
            }
            frame.replaceUrl(frame._path);
        }, onActualVisibleChange: function() {
            function resizeSubView(subView: any) {
                subView._children.each(function(child: any) {
                    if (child.resetDimension && child._rendered && child._visible) {
                        child.resetDimension();
                    }
                });
            }

            $invokeSuper.call(this, arguments);
            let frame = this, actualVisible = frame.isActualVisible();
            if (frame._toReplaceUrl) {
                if (actualVisible) {
                    setTimeout(function() {
                        if (frame._toReplaceUrl) {
                            frame.replaceUrl(frame._toReplaceUrl);
                            frame._toReplaceUrl = null;
                        }
                    }, 10);
                    return;
                } else {
                    return;
                }
            }
            if (dorado.Browser.isTouch) {
                let frameDom = frame._dom;
                if (actualVisible === false) {
                    let frameWin = frame.getIFrameWindow();
                    if (frame.isSameDomain() && frameWin) {
                        if (frameWin.document.activeElement) {
                            frameWin.document.activeElement.blur();
                        }
                        $fly(frameWin.document.body).find("input").blur();
                    }
                }
            }
            if (dorado.Browser.android) {
                return;
            }
            let iframeWindow = frame.getIFrameWindow();
            if (frame._ready && frame._loaded && frame.isSameDomain()) {
                if (iframeWindow && iframeWindow.$topView && iframeWindow.dorado && iframeWindow.dorado.widget) {
                    if (dorado.Browser.chrome || dorado.Browser.android) {
                        setTimeout(function() {
                            if (!iframeWindow.document || !iframeWindow.document.body) {
                                return;
                            }
                            iframeWindow.$topView.setActualVisible(actualVisible);
                            if (frame._notifyResizeOnVisible && actualVisible) {
                                resizeSubView(iframeWindow.$topView);
                            }
                        }, 50);
                    } else {
                        if (!iframeWindow.document || !iframeWindow.document.body) {
                            return;
                        }
                        iframeWindow.$topView.setActualVisible(actualVisible);
                        if (frame._notifyResizeOnVisible && actualVisible) {
                            resizeSubView(iframeWindow.$topView);
                        }
                    }
                }
            }
        }, getIFrameWindow: function() {
            let frame = this, doms = frame._doms || {}, contentWindow = null;
            try {
                if (doms.iframe) {
                    contentWindow = doms.iframe.contentWindow;
                }
            } catch (e) {
            }
            return contentWindow;
        }
    });
})();
dorado.widget.CardBook = $extend(dorado.widget.Control, {
    $className: "dorado.widget.CardBook", ATTRIBUTES: {
        className: {defaultValue: "d-cardbook"}, currentControl: {
            skipRefresh: true, setter: function(control: any) {
                let cardbook = this, controls = cardbook._controls;
                if (control != null) {
                    if (typeof control === "string" || typeof control === "number") {
                        control = controls.get(control);
                    }
                }
                if (cardbook._currentControl === control) {
                    return;
                }
                if (!cardbook._ready) {
                    cardbook._currentControl = control;
                    return;
                }
                cardbook.doSetCurrentControl(control);
            }
        }, currentIndex: {
            skipRefresh: true, getter: function() {
                let cardbook = this, controls = cardbook._controls;
                if (cardbook._currentControl) {
                    return controls.indexOf(cardbook._currentControl);
                }
                return -1;
            }, setter: function(index: any) {
                let cardbook = this;
                cardbook.set("currentControl", cardbook._controls.get(index));
            }
        }, controls: {
            writeOnce: true, innerComponent: "", setter: function(value: any) {
                if (value) {
                    let controls = this._controls;
                    if (value instanceof Array) {
                        for (let i = 0; i < value.length; i++) {
                            controls.insert(value[i]);
                            this.registerInnerControl(value[i]);
                        }
                    } else {
                        this.registerInnerControl(value);
                        controls.insert(value);
                    }
                }
            }
        }, dynaHeight: {defaultValue: false, writeBeforeReady: true}
    }, EVENTS: {beforeCurrentChange: {}, onCurrentChange: {}}, constructor: function() {
        this._controls = new dorado.util.KeyedArray(function(value: any) {
            return value._id;
        });
        $invokeSuper.call(this, arguments);
        let card = this;
        card._onControlSizeChange = function() {
            if (card._dynaHeight) {
                card.syncCurrentControlHeight();
            }
        };
    }, destroy: function() {
        let cardbook = this, controls = cardbook._controls;
        for (let i = controls.size - 1; i >= 0; i--) {
            controls.get(i).destroy();
        }
        cardbook._controls.clear();
        delete cardbook._currentControl;
        $invokeSuper.call(cardbook);
    }, onReady: function() {
        let currentControl = this._currentControl;
        this._currentControl = null;
        $invokeSuper.call(this);
        if (!currentControl) {
            currentControl = this._controls.get(0);
        }
        if (currentControl) {
            this.set("currentControl", currentControl);
        }
    }, syncCurrentControlHeight: function(control: any) {
        if (!control) {
            control = this._currentControl;
        }
        if (!control) {
            return;
        }
        let card = this, realHeight = control.getRealHeight();
        if (!realHeight) {
            realHeight = $fly(control._dom).outerHeight(true);
        }
        card._realHeight = realHeight;
        card.resetDimension(true);
        if (dorado.widget.TabControl && card._parent instanceof dorado.widget.TabControl) {
            card._parent.doOnCardHeightChange();
        } else {
            card.notifySizeChange(true, true);
        }
    }, doSetCurrentControl: function(control: any) {
        let cardbook = this, oldControl = cardbook._currentControl;
        let eventArg = {oldControl: oldControl, newControl: control};
        cardbook.fireEvent("beforeCurrentChange", this, eventArg);
        if (eventArg.processDefault === false) {
            return;
        }
        if (oldControl && !oldControl._destroyed) {
            if (oldControl instanceof dorado.widget.IFrame) {
                if (!oldControl._loaded) {
                    oldControl.cancelLoad();
                }
            }
            let oldDom = oldControl._dom;
            if (oldDom) {
                oldDom.style.display = "none";
            }
            oldControl.setActualVisible(false);
        }
        cardbook._currentControl = control;
        let dom = cardbook._dom, dynaHeight = cardbook._dynaHeight;
        if (dom && control) {
            if (!control._rendered) {
                this._resetInnerControlDemension(control);
                let controlDom = control.getDom();
                if (controlDom) {
                    $fly(controlDom).addClass("d-rendering");
                }
                control.render(dom);
                if (dynaHeight) {
                    control._parentLayout = {onControlSizeChange: cardbook._onControlSizeChange};
                }
                if (controlDom) {
                    setTimeout(function() {
                        $fly(controlDom).removeClass("d-rendering");
                    }, 500);
                }
            } else {
                $fly(control._dom).css("display", "block");
                control.setActualVisible(true);
                this._resetInnerControlDemension(control);
                control.resetDimension();
                if (control instanceof dorado.widget.IFrame && !control._loaded) {
                    control.reloadIfNotLoaded();
                }
            }
            if (dynaHeight) {
                cardbook.syncCurrentControlHeight(control);
            }
        }
        cardbook.fireEvent("onCurrentChange", this, eventArg);
    }, addControl: function(control: any, index: any, current: any) {
        if (!control) {
            throw new dorado.ResourceException("dorado.base.CardControlUndefined");
        }
        let card = this, controls = card._controls;
        card.registerInnerControl(control);
        controls.insert(control, index);
        if (current) {
            card.set("currentControl", control);
        }
        return control;
    }, removeControl: function(control: any) {
        let card = this, controls = card._controls;
        control = card.getControl(control);
        if (control) {
            controls.remove(control);
            control.destroy && control.destroy();
            return control;
        }
        return null;
    }, removeAllControls: function() {
        let card = this, controls = card._controls;
        for (let i = 0, j = controls.size; i < j; i++) {
            let item = controls.get(0);
            card.removeControl(item);
        }
    }, replaceControl: function(oldControl: any, newControl: any) {
        if (!oldControl || !newControl) {
            return;
        }
        let result = this._controls.replace(oldControl, newControl);
        if (result === -1) {
            return;
        }
        if (this._rendered) {
            if (oldControl === this._currentControl) {
                this.set("currentControl", newControl);
            }
            if (oldControl._rendered) {
                oldControl.destroy();
            }
        }
    }, getControl: function(id: any) {
        let card = this, controls = card._controls;
        if (controls) {
            if (typeof id === "number" || typeof id === "string") {
                return controls.get(id);
            } else {
                return id;
            }
        }
        return null;
    }, getCurrentControlIndex: function() {
        let card = this, controls = card._controls, currentControl = card._currentControl;
        if (controls && currentControl) {
            return controls.indexOf(currentControl);
        }
        return -1;
    }, _resetInnerControlDemension: function(control: any) {
        let dom = this.getDom(), width, height, dynaHeight = this._dynaHeight;
        if (this.getRealWidth()) {
            width = $fly(dom).innerWidth();
            if (width) {
                control.set("width", width, {tryNextOnError: true});
            }
        }
        if (!dynaHeight && this.getRealHeight()) {
            height = $fly(dom).innerHeight();
            if (height) {
                control.set("height", height, {tryNextOnError: true});
            }
        }
        control.refresh();
    }, refreshDom: function(dom: any) {
        $invokeSuper.call(this, arguments);
        let card = this, currentControl = card._currentControl, dynaHeight = card._dynaHeight;
        if (currentControl) {
            this._resetInnerControlDemension(currentControl);
            if (!currentControl._rendered) {
                currentControl.render(dom);
                if (dynaHeight) {
                    currentControl._parentLayout = {onControlSizeChange: card._onControlSizeChange};
                    card.syncCurrentControlHeight(currentControl);
                }
            } else {
                $fly(currentControl._dom).css("display", "block");
                currentControl.setActualVisible(true);
                if (dynaHeight) {
                    card.syncCurrentControlHeight(currentControl);
                }
            }
        }
    }, getFocusableSubControls: function() {
        return [this._currentControl];
    }
});
dorado.widget.ProgressBar = $extend([dorado.widget.Control, dorado.widget.PropertyDataControl], {
    $className: "dorado.widget.ProgressBar",
    selectable: false,
    ATTRIBUTES: {
        className: {defaultValue: "d-progress-bar"},
        height: {independent: true},
        minValue: {defaultValue: 0},
        maxValue: {defaultValue: 100},
        showText: {defaultValue: true},
        value: {},
        textPattern: {defaultValue: "{percent}%"}
    },
    createDom: function() {
        let bar = this, doms = {}, dom = $DomUtils.xCreate({
            tagName: "div",
            className: bar._className,
            content: [{tagName: "span", className: "msg", contextKey: "msg"}, {
                tagName: "span",
                className: "bar",
                contextKey: "bar",
                content: {tagName: "span", className: "bar-msg", contextKey: "barMsg"}
            }]
        }, null, doms);
        bar._doms = doms;
        return dom;
    },
    processDataSetMessage: function(messageCode: any, arg: any, data: any) {
        switch (messageCode) {
            case dorado.widget.DataSet.MESSAGE_REFRESH:
            case dorado.widget.DataSet.MESSAGE_REFRESH_ENTITY:
            case dorado.widget.DataSet.MESSAGE_DATA_CHANGED:
            case dorado.widget.DataSet.MESSAGE_CURRENT_CHANGED:
                this.refresh(true);
                break;
        }
    },
    refreshDom: function(dom: any) {
        $invokeSuper.call(this, arguments);
        let bar = this, entity = this.getBindingData(true), value;
        if (entity) {
            let timestamp = entity.timestamp;
            if (timestamp === this._timestamp) {
                return;
            }
            value = ((this._property && entity != null) ? entity.get(this._property) : "") || 0;
            this._timestamp = timestamp;
        } else {
            value = bar._value || 0;
        }
        let min = bar._minValue, max = bar._maxValue, doms = bar._doms, percent = value / (max - min),
            showText = bar._showText, pattern = bar._textPattern || "";
        if (percent === 0) {
            $fly(dom).addClass("d-rendering");
        }
        if (percent >= 0 && percent <= 1) {
            $fly(doms.bar).css("width", percent * 100 + "%");
        } else {
            if (percent > 1) {
                $fly(doms.bar).css("width", "100%");
            } else {
                if (percent < 0) {
                    $fly(doms.bar).css("width", "0%");
                }
            }
        }
        let $msg = $fly([doms.msg, doms.barMsg]).css("width", dom.offsetWidth);
        if (showText) {
            $msg.text(pattern.replace("{percent}", parseInt(percent * 100, 10)));
        } else {
            $msg.empty();
        }
        if (percent === 0) {
            $fly(dom).removeClass("d-rendering");
        }
    }
});
(function() {
    let ANCHOR_OFFSET_ADJ_HORIZENTAL = 5, ANCHOR_OFFSET_ADJ_VERTICAL = 5;
    let icons = {WARNING: "warning-icon", ERROR: "error-icon", INFO: "info-icon", QUESTION: "question-icon"};
    dorado.widget.Tip = $extend([dorado.widget.Control, dorado.widget.FloatControl], {
        $className: "dorado.widget.Tip",
        ATTRIBUTES: {
            className: {defaultValue: "d-tip"},
            height: {independent: true},
            visible: {defaultValue: false},
            shadowMode: {defaultValue: "none", skipRefresh: true},
            animateType: {defaultValue: dorado.Browser.msie ? "none" : "fade", skipRefresh: true},
            focusAfterShow: {defaultValue: false},
            caption: {},
            text: {},
            content: {},
            icon: {},
            iconClass: {},
            closeable: {},
            arrowDirection: {},
            arrowAlign: {defaultValue: "center"},
            arrowOffset: {},
            showDuration: {}
        },
        createDom: function() {
            let tip = this, dom, doms = {};
            dom = $DomUtils.xCreate({
                tagName: "div",
                content: {
                    tagName: "div",
                    className: "tip-cm",
                    contextKey: "tipCenter",
                    content: {
                        tagName: "div",
                        contextKey: "tipContent",
                        className: "tip-content",
                        content: [{tagName: "span", className: "tip-icon", contextKey: "tipIcon"}, {
                            tagName: "span",
                            className: "tip-text",
                            contextKey: "tipText"
                        }]
                    }
                }
            }, null, doms);
            tip._doms = doms;
            $fly(dom).hover(function() {
                tip = jQuery.data(this, "dorado.tooltip") || tip;
                if (tip._showDurationTimer) {
                    clearTimeout(tip._showDurationTimer);
                    tip._showDurationTimer = null;
                }
                if (tip._hideTimer) {
                    clearTimeout(tip._hideTimer);
                    tip._hideTimer = null;
                }
            }, function() {
                tip = jQuery.data(this, "dorado.tooltip") || tip;
                if (tip._showDuration) {
                    tip._showDurationTimer = setTimeout(function() {
                        tip.hide();
                        tip._showDurationTimer = null;
                    }, tip._showDuration * 1000);
                }
                if (tip._autoHide) {
                    dorado.TipManager.hideTip(tip, tip._hideDelay || 0);
                }
            });
            return dom;
        },
        doAfterShow: function() {
            let tip = this;
            $invokeSuper.call(tip, arguments);
            if (tip._showDuration) {
                tip._showDurationTimer = setTimeout(function() {
                    tip.hide();
                    tip._showDurationTimer = null;
                }, tip._showDuration * 1000);
            }
        },
        doClose: function() {
            this.hide();
        },
        getShowPosition: function(options: any) {
            let tip = this, arrowDirection = tip._arrowDirection, doms = tip._doms;
            if (arrowDirection && (options.offsetLeft == null && options.offsetTop == null)) {
                let arrowAlign = tip._arrowAlign;
                if (arrowAlign) {
                    if (arrowDirection === "left") {
                        options.offsetLeft = doms.arrow.offsetWidth;
                    } else {
                        if (arrowDirection === "right") {
                            options.offsetLeft = -1 * doms.arrow.offsetWidth;
                        } else {
                            if (arrowDirection === "top") {
                                options.offsetTop = doms.arrow.offsetHeight;
                            } else {
                                options.offsetHeight = -1 * doms.arrow.offsetHeight;
                            }
                        }
                    }
                }
            }
            return $invokeSuper.call(this, arguments);
        },
        refreshDom: function(dom: any) {
            $invokeSuper.call(this, arguments);
            let tip = this, text = (tip._text === undefined) ? "" : tip._text, doms = tip._doms,
                arrowDirection = tip._arrowDirection, content = this._content;
            let classNames = [];
            if (tip._inherentClassName) {
                classNames.push(tip._inherentClassName);
            }
            if (tip._className) {
                classNames.push(tip._className);
            }
            if (tip._floating) {
                classNames.push("d-floating");
                if (tip._className) {
                    classNames.push(tip._className + "-floating");
                }
                if (tip._floatingClassName) {
                    classNames.push(tip._floatingClassName);
                }
            }
            if (classNames.length) {
                $fly(dom).prop("className", classNames.join(" "));
            }
            $fly(dom).shadow({mode: tip._shadowMode});
            let $tipText = $fly(doms.tipText);
            if (content) {
                if (typeof content === "string") {
                    $tipText.html(content);
                } else {
                    if (content instanceof dorado.widget.Control) {
                        if (!content._rendered) {
                            $tipText.empty();
                            content.render(doms.tipText);
                        }
                    } else {
                        if (content.nodeType && content.nodeName) {
                            $tipText.empty().append(content);
                        } else {
                            $tipText.empty().xCreate(content);
                        }
                    }
                }
            } else {
                if (/<[^<]+?>/g.test(text)) {
                    $tipText.html(text);
                } else {
                    $tipText.text(text);
                }
            }
            $fly(dom).shadow({mode: tip._shadowMode});
            if (arrowDirection && arrowDirection !== "none") {
                if (doms.arrow == null) {
                    let arrowEl = document.createElement("div");
                    arrowEl.className = "arrow";
                    $fly(dom).append(arrowEl);
                    doms.arrow = arrowEl;
                }
                $fly(dom).addClass("d-tip-arrow-" + arrowDirection);
            } else {
                $fly(dom).removeClass("d-tip-arrow-top").removeClass("d-tip-arrow-bottom").removeClass("d-tip-arrow-left").removeClass("d-tip-arrow-right");
            }
            let captionDom = doms.caption;
            if (tip._caption || tip._closeable) {
                let caption = tip._caption || $resource("dorado.baseWidget.DefaultTipCaption");
                if (captionDom == null) {
                    doms.caption = captionDom = document.createElement("div");
                    captionDom.className = "caption";
                    $fly(doms.tipCenter).prepend(captionDom);
                    $fly(captionDom).html(caption);
                } else {
                    $fly(captionDom).css("display", "").html(caption);
                }
            } else {
                if (captionDom != null) {
                    $fly(captionDom).css("display", "none");
                }
            }
            if (tip._closeable) {
                if (doms.close == null) {
                    let closeEl = document.createElement("div");
                    closeEl.className = "close";
                    $fly(dom).append(closeEl);
                    doms.close = closeEl;
                    jQuery(closeEl).click(function(event: any) {
                        tip.doClose(this);
                        event.stopImmediatePropagation();
                    }).addClassOnHover("close-hover").addClassOnClick("close-click");
                } else {
                    $fly(doms.close).css("display", "");
                }
            } else {
                if (doms.close) {
                    $fly(doms.close).css("display", "none");
                }
            }
            let icon = tip._icon, iconClass = tip._iconClass || "", exClassName;
            if (icon in icons) {
                exClassName = icons[icon];
                icon = null;
            }
            $fly(doms.tipIcon).prop("className", "tip-icon");
            if (icon || iconClass || exClassName) {
                if (exClassName) {
                    $fly(doms.tipIcon).addClass(exClassName);
                }
                if (iconClass) {
                    $fly(doms.tipIcon).addClass(iconClass);
                }
                if (icon) {
                    $DomUtils.setBackgroundImage(doms.tipIcon, icon);
                } else {
                    $fly(doms.tipIcon).css("background-image", "");
                }
                $fly(doms.tipContent).addClass("tip-content-hasicon");
            } else {
                $fly(doms.tipContent).removeClass("tip-content-hasicon");
            }
            $fly(doms.arrow).css({left: "", top: ""});
            if (arrowDirection && !tip._trackMouse) {
                let arrowAlign = tip._arrowAlign, arrowOffset = tip._arrowOffset || 0;
                if (arrowAlign) {
                    if (arrowDirection === "left" || arrowDirection === "right") {
                        if (arrowAlign === "center") {
                            $fly(doms.arrow).css("top", (dom.offsetHeight - doms.arrow.offsetHeight) / 2 + arrowOffset);
                        } else {
                            if (arrowAlign === "top") {
                                $fly(doms.arrow).css("top", ANCHOR_OFFSET_ADJ_VERTICAL + arrowOffset);
                            } else {
                                if (arrowAlign === "bottom") {
                                    $fly(doms.arrow).css("top", dom.offsetHeight - doms.arrow.offsetHeight - ANCHOR_OFFSET_ADJ_VERTICAL + arrowOffset);
                                }
                            }
                        }
                    } else {
                        if (arrowAlign === "center") {
                            $fly(doms.arrow).css("left", (dom.offsetWidth - doms.arrow.offsetWidth) / 2 + arrowOffset);
                        } else {
                            if (arrowAlign === "left") {
                                $fly(doms.arrow).css("left", ANCHOR_OFFSET_ADJ_HORIZENTAL + arrowOffset);
                            } else {
                                if (arrowAlign === "right") {
                                    $fly(doms.arrow).css("left", dom.offsetWidth - doms.arrow.offsetWidth - ANCHOR_OFFSET_ADJ_HORIZENTAL + arrowOffset);
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    dorado.widget.NotifyTip = $extend(dorado.widget.Tip, {
        $className: "dorado.widget.NotifyTip",
        ATTRIBUTES: {
            width: {defaultValue: (dorado.Browser.isTouch ? 200 : 300)},
            closeable: {defaultValue: true},
            icon: {},
            iconClass: {},
            showDuration: {defaultValue: 3}
        },
        isLazyInit: function() {
            return false;
        },
        getShowPosition: function() {
            return dorado.widget.NotifyTipManager.getAvialablePosition(this);
        },
        doAfterHide: function() {
            $invokeSuper.call(this, arguments);
            dorado.NotifyTipPool.returnObject(this);
        }
    });
    dorado.NotifyTipPool = new dorado.util.ObjectPool({
        makeObject: function() {
            return new dorado.widget.NotifyTip();
        }, passivateObject: function(object: any) {
            let attrs = ["caption", "text", "content", "icon", "iconClass", "arrowDirection", "arrowAlign", "arrowOffset"];
            for (let i = 0, j = attrs.length; i < j; i++) {
                let attr = attrs[i];
                delete object["_" + attr];
            }
            object._showDuration = 3;
            object._closeable = true;
        }
    });
    let getRegionOffsets = function(region1: any, region2: any) {
        return {
            top: Math.max(region1["top"], region2["top"]),
            right: Math.min(region1["right"], region2["right"]),
            bottom: Math.min(region1["bottom"], region2["bottom"]),
            left: Math.max(region1["left"], region2["left"])
        };
    };
    let intersect = function(element1: any, element2: any) {
        if (element1 == null) {
            return false;
        }
        let region1 = $fly(element1).region(), region2;
        if (element2.nodeType) {
            region2 = $fly(element2).region();
        } else {
            region2 = element2;
        }
        let offset = getRegionOffsets(region1, region2);
        return offset["bottom"] >= offset["top"] && offset["right"] >= offset["left"];
    };
    dorado.widget.NotifyTipManager = {
        offsetLeft: -10,
        offsetTop: 10,
        padding: 10,
        notifyWidth: dorado.Browser.isTouch ? 200 : 300,
        position: "br",
        alignPriority: "vertical",
        notify: function(msg: any, options: any) {
            if (typeof msg === "string") {
                options = dorado.Object.apply({}, options);
                options.text = msg;
            } else {
                if (typeof msg === "object") {
                    options = dorado.Object.apply({}, msg);
                }
            }
            if (options.caption === undefined) {
                options.caption = $resource("dorado.baseWidget.NotifyTipDefaultCaption") || "Dorado7";
            }
            if (options.autoHide === false) {
                options.showDuration = 0;
            }
            delete options.autoHide;
            let tip = dorado.NotifyTipPool.borrowObject();
            tip.set(options);
            tip.show();
            return tip;
        },
        nextRegion: function(refTip: any, tip: any) {
            let left, top, dom = tip._dom, width = dom.offsetWidth, height = dom.offsetHeight, position = this.position;
            let docWidth = $fly(window).width(), docHeight = $fly(window).height();
            if (this.alignPriority === "vertical") {
                if (position === "tr") {
                    left = parseInt($fly(refTip._dom).css("left"), 10);
                    top = $fly(refTip._dom).outerHeight() + parseInt($fly(refTip._dom).css("top"), 10) + this.padding;
                    if (top + height > docHeight) {
                        left = left - this.notifyWidth - this.padding;
                        top = this.padding;
                    }
                } else {
                    if (position === "br") {
                        left = parseInt($fly(refTip._dom).css("left"), 10);
                        top = parseInt($fly(refTip._dom).css("top"), 10) - $fly(tip._dom).outerHeight() - this.padding;
                        if (top < 0) {
                            left = left - this.notifyWidth - this.padding;
                            top = docHeight - height - this.padding;
                        }
                    } else {
                        if (position === "tl") {
                            left = parseInt($fly(refTip._dom).css("left"), 10);
                            top = parseInt($fly(refTip._dom).css("top"), 10) + $fly(refTip._dom).outerHeight() + this.padding;
                            if (top + height > docHeight) {
                                left = left + this.notifyWidth + this.padding;
                                top = this.padding;
                            }
                        } else {
                            if (position === "bl") {
                                left = parseInt($fly(refTip._dom).css("left"), 10);
                                top = parseInt($fly(refTip._dom).css("top"), 10) - $fly(tip._dom).outerHeight() - this.padding;
                                if (top < 0) {
                                    left = left + this.notifyWidth + this.padding;
                                    top = docHeight - height - this.padding;
                                }
                            }
                        }
                    }
                }
            } else {
                if (position === "tr") {
                    left = parseInt($fly(refTip._dom).css("left"), 10) - this.notifyWidth - this.padding;
                    top = parseInt($fly(refTip._dom).css("top"), 10);
                    if (left < 0) {
                        left = docWidth - this.padding - this.notifyWidth;
                        top = top + $fly(refTip._dom).outerHeight() + this.padding;
                    }
                } else {
                    if (position === "br") {
                        left = parseInt($fly(refTip._dom).css("left"), 10) - this.notifyWidth - this.padding;
                        top = parseInt($fly(refTip._dom).css("top"), 10);
                        if (left < 0) {
                            left = docWidth - this.padding - this.notifyWidth;
                            top = top - $fly(refTip._dom).outerHeight() - this.padding;
                        }
                    } else {
                        if (position === "tl") {
                            left = parseInt($fly(refTip._dom).css("left"), 10) + $fly(refTip._dom).outerWidth() + this.padding;
                            top = parseInt($fly(refTip._dom).css("top"), 10);
                            if (left + width > docWidth) {
                                left = this.padding;
                                top = top + $fly(refTip._dom).outerHeight() + this.padding;
                            }
                        } else {
                            if (position === "bl") {
                                left = parseInt($fly(refTip._dom).css("left"), 10) + $fly(refTip._dom).outerWidth() + this.padding;
                                top = parseInt($fly(refTip._dom).css("top"), 10);
                                if (left + width > docWidth) {
                                    left = this.padding;
                                    top = top - $fly(refTip._dom).outerHeight() - this.padding;
                                }
                            }
                        }
                    }
                }
            }
            return {left: left, top: top, bottom: top + height, right: left + width};
        },
        avialable: function(tip: any, region: any) {
            let passed = true, activePool = dorado.NotifyTipPool._activePool;
            for (let k = 0, l = activePool.length; k < l; k++) {
                if (activePool[k] !== tip) {
                    let intersected = intersect(activePool[k]._dom, region);
                    if (intersected) {
                        passed = false;
                    }
                }
            }
            return passed;
        },
        getAvialablePosition: function(tip: any) {
            let docWidth = $fly(window).width(), dom = tip._dom, width = dom.offsetWidth, height = dom.offsetHeight,
                left, top, region, position = this.position;
            if (position === "tr") {
                left = docWidth - this.padding - width;
                top = this.padding;
            } else {
                if (position === "br") {
                    left = docWidth - this.padding - width;
                    top = $fly(window).height() - height - this.padding;
                } else {
                    if (position === "tl") {
                        left = this.padding;
                        top = this.padding;
                    } else {
                        if (position === "bl") {
                            left = this.padding;
                            top = $fly(window).height() - height - this.padding;
                        }
                    }
                }
            }
            region = {left: left, top: top, bottom: top + height, right: left + width};
            if (this.avialable(tip, region)) {
                dorado.NotifyTipPool._activePool.remove(tip);
                dorado.NotifyTipPool._activePool.unshift(tip);
                $fly(dom).css({left: left, top: top});
                return {left: left, top: top};
            }
            if (dorado.NotifyTipPool.getNumActive() > 1) {
                let activePool = dorado.NotifyTipPool._activePool;
                for (let i = 0, j = activePool.length; i < j; i++) {
                    let curTip = activePool[i];
                    if (curTip !== tip) {
                        region = this.nextRegion(curTip, tip);
                        if (this.avialable(tip, region)) {
                            dorado.NotifyTipPool._activePool.remove(tip);
                            dorado.NotifyTipPool._activePool.insert(tip, dorado.NotifyTipPool._activePool.indexOf(curTip) + 1);
                            $fly(tip._dom).css({left: region.left, top: region.top});
                            return {left: region.left, top: region.top};
                        }
                    }
                }
            }
        }
    };
})();
dorado.widget.FloatContainer = $extend([dorado.widget.Container, dorado.widget.FloatControl], {
    $className: "dorado.widget.FloatContainer",
    ATTRIBUTES: {visible: {defaultValue: false}}
});

