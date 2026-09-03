"use strict";
// @ts-nocheck
/// <reference path="globals.d.ts" />
(function () {
    dorado.widget = {};
    dorado.widget.ViewElement = $extend([dorado.AttributeSupport, dorado.EventSupport], {
        $className: "dorado.widget.ViewElement",
        _ignoreOnCreateListeners: 0,
        ATTRIBUTES: {
            id: { readOnly: true },
            destroyed: { readOnly: true },
            parentViewElement: { readOnly: true },
            view: {
                skipRefresh: true,
                getter: function () {
                    return this._view || window._DEFAULT_VIEW;
                },
                setter: function (view) {
                    if (this._view === view) {
                        return;
                    }
                    if (this._view && this._id) {
                        this._view.unregisterViewElement(this._id);
                    }
                    this._view = view;
                    if (view && this._id) {
                        view.registerViewElement(this._id, this);
                    }
                    if (this._innerViewElements) {
                        this._innerViewElements.each(function (viewElement) {
                            viewElement.set("view", view);
                        });
                    }
                    if (view && view !== $topView && !this._liveBindingProcessed) {
                        this._processLiveBinding(view);
                    }
                },
            },
            userData: { skipRefresh: true },
        },
        EVENTS: { onCreate: {}, onDestroy: {} },
        constructor: function (config) {
            let lazyInit = this.isLazyInit && this.isLazyInit(config);
            let id, tags, DEFINITION;
            if (config && config.constructor === String) {
                id = config;
                config = null;
            }
            else {
                if (config) {
                    id = config.id;
                    tags = config.tags;
                    DEFINITION = config.DEFINITION;
                    delete config.id;
                    delete config.tags;
                    delete config.DEFINITION;
                }
            }
            this._uniqueId = dorado.Core.newId();
            dorado.widget.ViewElement.ALL[this._uniqueId] = this;
            if (id) {
                id = id + "";
                if (!/^[a-zA-Z_$][a-z0-9A-Z_$]*$/.exec(id)) {
                    throw new dorado.ResourceException("dorado.widget.InvalidComponentId", id);
                }
                this._id = id;
                if (this instanceof dorado.widget.View) {
                    this.registerViewElement(id, this);
                }
                else {
                    let view = window._DEFAULT_VIEW;
                    if (view) {
                        view.registerViewElement(id, this);
                    }
                }
            }
            if (tags || DEFINITION) {
                this.set({ tags: tags, DEFINITION: DEFINITION });
            }
            dorado.AttributeSupport.prototype.constructor.call(this, config);
            if (id && !(this instanceof dorado.widget.View)) {
                let view = this._view || window._DEFAULT_VIEW;
                if (view && view._liveIdBindingMap) {
                    let liveBindings = view._liveIdBindingMap[id];
                    if (liveBindings) {
                        let liveBinding, pendingBindings;
                        for (let i = 0, len = liveBindings.length; i < len; i++) {
                            liveBinding = liveBindings[i];
                            if (!liveBinding.subObject) {
                                this.bind(liveBinding.event, liveBinding.listener);
                            }
                            else {
                                if (!pendingBindings) {
                                    pendingBindings = [];
                                }
                                pendingBindings.push(liveBinding);
                            }
                        }
                        if (pendingBindings) {
                            view._liveIdBindingMap[id] = pendingBindings;
                        }
                        else {
                            delete view._liveIdBindingMap[id];
                        }
                    }
                }
            }
            if (lazyInit) {
                this._lazyInit = function () {
                    delete this._lazyInit;
                    this._constructor(config);
                    if (!this._liveBindingProcessed) {
                        this._processLiveBinding(this._view || window._DEFAULT_VIEW);
                    }
                };
            }
            else {
                this._constructor(config);
            }
        },
        _constructor: function (config) {
            if (config) {
                this.set(config, {
                    tryNextOnError: true,
                    skipUnknownAttribute: true,
                });
            }
            if (!this._ignoreOnCreateListeners) {
                if (this.getListenerCount("onCreate")) {
                    this.fireEvent("onCreate", this);
                }
                this._onCreateFired = true;
            }
        },
        destroy: function () {
            if (this._destroyed) {
                return;
            }
            this._destroyed = true;
            this.fireEvent("onDestroy", this);
            if (this._innerViewElements) {
                let viewElements = this._innerViewElements.slice(0);
                for (let i = 0, len = viewElements.length; i < len; i++) {
                    viewElements[i].destroy();
                }
                delete this._innerViewElements;
            }
            if (!dorado.windowClosed) {
                if (this._view && this._id) {
                    this._view.unregisterViewElement(this._id);
                }
                delete dorado.widget.ViewElement.ALL[this._uniqueId];
            }
        },
        doSet: function (attr, value, skipUnknownAttribute, lockWritingTimes) {
            let def = this.ATTRIBUTES[attr];
            if (def) {
                if (this._ready && def.writeBeforeReady) {
                    throw new dorado.AttributeException("dorado.widget.AttributeWriteBeforeReady", attr);
                }
                if (def.componentReference) {
                    if (value instanceof dorado.widget.Component) {
                        return dorado.AttributeSupport.prototype.doSet.call(this, attr, value, skipUnknownAttribute, lockWritingTimes);
                    }
                    let component = null, allPrepared = false;
                    if (value) {
                        if (value instanceof Array) {
                            if (value.length > 0) {
                                (component = []), (allPrepared = true);
                                for (let i = 0; i < value.length; i++) {
                                    component[i] =
                                        dorado.widget.ViewElement.getComponentReference(this, attr, value[i]);
                                    if (!(component[i] instanceof dorado.widget.Component)) {
                                        allPrepared = false;
                                    }
                                }
                            }
                        }
                        else {
                            component = dorado.widget.ViewElement.getComponentReference(this, attr, value);
                            allPrepared = component instanceof dorado.widget.Component;
                        }
                    }
                    return dorado.AttributeSupport.prototype.doSet.call(this, attr, allPrepared ? component : null, skipUnknownAttribute, lockWritingTimes);
                }
                else {
                    if (def.innerComponent != null) {
                        if (value) {
                            let defaultType = "dorado.widget." + def.innerComponent;
                            if (value instanceof Array) {
                                let components = [];
                                for (let i = 0; i < value.length; i++) {
                                    components.push(this.createInnerComponent(value[i], defaultType));
                                }
                                value = components;
                            }
                            else {
                                value = this.createInnerComponent(value, defaultType);
                            }
                        }
                    }
                }
            }
            return dorado.AttributeSupport.prototype.doSet.call(this, attr, value, skipUnknownAttribute, lockWritingTimes);
        },
        getListenerScope: function () {
            return this.get("view") || $topView;
        },
        bind: function (name, listener, options) {
            let retVal = $invokeSuper.call(this, [name, listener, options]);
            if (name === "onCreate" &&
                !this._ignoreOnCreateListeners &&
                this._onCreateFired) {
                this.fireEvent("onCreate", this);
                delete this._events["onCreate"];
            }
            return retVal;
        },
        _processLiveBinding: function (view) {
            if (view) {
                if (this._id) {
                    if (view._liveIdBindingMap) {
                        let liveBindings = view._liveIdBindingMap[this._id];
                        if (liveBindings) {
                            let liveBinding;
                            for (let i = 0, len = liveBindings.length; i < len; i++) {
                                liveBinding = liveBindings[i];
                                if (liveBinding.subObject) {
                                    let subObject = this.get(liveBinding.subObject);
                                    if (subObject) {
                                        subObject.bind(liveBinding.event, liveBinding.listener);
                                    }
                                }
                                else {
                                    this.bind(liveBinding.event, liveBinding.listener);
                                }
                            }
                            delete view._liveIdBindingMap[this._id];
                        }
                    }
                    if (view._liveIdSettingMap) {
                        let liveSettings = view._liveIdSettingMap[this._id];
                        if (liveSettings) {
                            let liveSetting;
                            for (let i = 0, len = liveSettings.length; i < len; i++) {
                                liveSetting = liveSettings[i];
                                this.set(liveSetting.attr, liveSetting.value, liveSetting.options);
                            }
                            delete view._liveIdSettingMap[this._id];
                        }
                    }
                }
                if (this._tags) {
                    let tag;
                    for (let i = 0, len = this._tags.length; i < len; i++) {
                        tag = this._tags[i];
                        if (view._liveTagBindingMap) {
                            let liveBindings = view._liveTagBindingMap[tag];
                            if (liveBindings) {
                                let liveBinding;
                                for (let j = 0, l = liveBindings.length; j < l; j++) {
                                    liveBinding = liveBindings[j];
                                    if (liveBinding.subObject) {
                                        let subObject = this.get(liveBinding.subObject);
                                        if (subObject) {
                                            subObject.bind(liveBinding.event, liveBinding.listener);
                                        }
                                    }
                                    else {
                                        this.bind(liveBinding.event, liveBinding.listener);
                                    }
                                }
                            }
                        }
                        if (view._liveTagSettingMap) {
                            let liveSettings = view._liveTagSettingMap[tag];
                            if (liveSettings) {
                                let liveSetting;
                                for (let j = 0, l = liveSettings.length; j < l; j++) {
                                    liveSetting = liveSettings[j];
                                    this.set(liveSetting.attr, liveSetting.value, liveSetting.options);
                                }
                            }
                        }
                    }
                }
            }
            this._liveBindingProcessed = true;
        },
        fireEvent: function (name) {
            if (this._destroyed) {
                return false;
            }
            return $invokeSuper.call(this, arguments);
        },
        createInnerComponent: function (config, typeTranslator) {
            if (!config) {
                return null;
            }
            if (config instanceof dorado.widget.Component) {
                return config;
            }
            let component = null;
            if (typeof config === "object") {
                component = dorado.Toolkits.createInstance("widget", config, typeTranslator);
            }
            return component;
        },
        registerInnerViewElement: function (viewElement) {
            if (!this._innerViewElements) {
                this._innerViewElements = [];
            }
            this._innerViewElements.push(viewElement);
            viewElement._parentViewElement = this;
            if (viewElement.doSetParentViewElement) {
                viewElement.doSetParentViewElement(this);
            }
            viewElement.set("view", this instanceof dorado.widget.View ? this : this.get("view"));
            if (viewElement.parentChanged) {
                viewElement.parentChanged();
            }
        },
        unregisterInnerViewElement: function (viewElement) {
            if (!this._innerViewElements) {
                return;
            }
            this._innerViewElements.remove(viewElement);
            viewElement._parentViewElement = null;
            if (viewElement.doSetParentViewElement) {
                viewElement.doSetParentViewElement(null);
            }
            viewElement.set("view", null);
            if (viewElement.parentChanged) {
                viewElement.parentChanged();
            }
        },
    });
    dorado.widget.RenderableViewElement = $extend([dorado.widget.ViewElement, dorado.RenderableElement], {
        doSet: function (attr, value) {
            dorado.widget.ViewElement.prototype.doSet.call(this, attr, value);
            let def = this.ATTRIBUTES[attr];
            if (this._rendered &&
                this.refresh &&
                this._ignoreRefresh < 1 &&
                def &&
                !def.skipRefresh) {
                this.refresh(true);
            }
        },
        destroy: function () {
            if (this._destroyed) {
                return;
            }
            dorado.Toolkits.cancelDelayedAction(this, "$refreshDelayTimerId");
            $invokeSuper.call(this);
            dorado.RenderableElement.prototype.destroy.call(this);
        },
    });
    dorado.widget.ViewElement.getComponentReference = function (object, attr, value) {
        if (!value) {
            return value;
        }
        if (value instanceof dorado.widget.Component) {
            return value;
        }
        else {
            let component, view = window._DEFAULT_VIEW;
            if (typeof value === "string") {
                if (!view) {
                    if (object.getListenerScope) {
                        view = object.getListenerScope();
                    }
                    else {
                        view = $topView;
                    }
                }
                component = view.id(value);
                if (component) {
                    return component;
                }
                value = { view: view, component: value };
            }
            else {
                if (typeof value === "object" && value.$type) {
                    if (!view) {
                        if (object.getListenerScope) {
                            view = object.getListenerScope();
                        }
                        else {
                            view = $topView;
                        }
                    }
                    return dorado.Toolkits.createInstance("widget", value);
                }
            }
            (view = value.view), (componentId = value.component);
            component = view.id(componentId);
            if (component) {
                return component;
            }
            let wantedComponents = view._wantedComponents;
            if (!wantedComponents) {
                view._wantedComponents = wantedComponents = { count: 0 };
                view.bind("onComponentRegistered._getComponentReference", viewOnComponentRegisteredListener);
            }
            let wanters = wantedComponents[componentId];
            if (!wanters) {
                wantedComponents[componentId] = wanters = [];
                wantedComponents.count++;
            }
            wanters.push({ object: object, attribute: attr });
            let idProperty = "_" + attr + "_id";
            if (!object[idProperty]) {
                object[idProperty] = componentId;
            }
            else {
                let ids = object[idProperty];
                if (typeof ids === "string") {
                    object[idProperty] = ids = [object[idProperty]];
                }
                ids.push(componentId);
            }
            return componentId;
        }
    };
    function viewOnComponentRegisteredListener(view, arg) {
        let wantedComponents = view._wantedComponents;
        let wanters = wantedComponents[arg.component._id];
        if (wanters) {
            let component = arg.component;
            delete wantedComponents[component._id];
            wantedComponents.count--;
            if (wantedComponents.count === 0) {
                view.unbind("onComponentRegistered._getComponentReference");
                delete view._wantedComponents;
            }
            for (let i = 0, len = wanters.length; i < len; i++) {
                let wanter = wanters[i], object = wanter.object, attribute = wanter.attribute;
                let ids = object["_" + attribute + "_id"];
                if (ids) {
                    if (typeof ids === "string") {
                        if (ids === component._id) {
                            object.set(attribute, component, { lockWritingTimes: true });
                        }
                    }
                    else {
                        let index = ids.indexOf(component._id);
                        if (index >= 0) {
                            ids[index] = component;
                            let allComponentPrepared = true;
                            for (let j = 0; j < ids.length; j++) {
                                if (typeof ids[j] === "string") {
                                    allComponentPrepared = false;
                                    break;
                                }
                            }
                            if (allComponentPrepared) {
                                object.set(attribute, ids, { lockWritingTimes: true });
                            }
                        }
                    }
                }
            }
        }
    }
    dorado.widget.ViewElement.findParentViewElement = function (element, type) {
        function find(win, dom, className) {
            let control = null;
            do {
                let viewElement;
                if (dom.doradoUniqueId) {
                    viewElement = win.dorado.widget.ViewElement.ALL[dom.doradoUniqueId];
                }
                if (viewElement) {
                    let match = false;
                    if (className) {
                        if (viewElement.constructor.className === className) {
                            match = true;
                        }
                        else {
                            while (!viewElement._isDoradoControl) {
                                viewElement = viewElement._parentViewElement;
                                if (viewElement &&
                                    viewElement.constructor.className === className) {
                                    match = true;
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        match = true;
                    }
                    if (match) {
                        break;
                    }
                }
                dom = dom.parentNode;
            } while (dom != null);
            if (!viewElement && win.parent) {
                let parentFrames;
                try {
                    parentFrames = win.parent.frames;
                }
                catch (e) { }
                if (parentFrames && parentFrames.length) {
                    let frame;
                    for (let i = 0; i < parentFrames.length; i++) {
                        if (parentFrames[i].contentWindow === win) {
                            frame = parentFrames[i];
                            break;
                        }
                    }
                    if (frame) {
                        viewElement = find(win.parent, frame, className);
                    }
                }
            }
            return viewElement;
        }
        let className;
        if (typeof type === "function") {
            className = type.className;
        }
        else {
            if (type) {
                className = type + "";
            }
        }
        return find(window, element, className);
    };
    dorado.widget.ViewElement.ALL = {};
    dorado.Toolkits.registerTypeTranslator("widget", function (type) {
        return dorado.util.Common.getClassType("dorado.widget." + type, true);
    });
})();
dorado.widget.Component = $extend(dorado.widget.ViewElement, {
    $className: "dorado.widget.Component",
    ATTRIBUTES: {
        ready: { readOnly: true },
        parent: { readOnly: true },
        dataTypeRepository: {
            readOnly: true,
            getter: function () {
                return this.getDataTypeRepository();
            },
        },
    },
    EVENTS: { onReady: {} },
    constructor: function (config) {
        dorado.widget.ViewElement.prototype.constructor.call(this, config);
        if (!this._parent && AUTO_APPEND_TO_TOPVIEW && window.$topView) {
            $topView.addChild(this);
        }
    },
    onReady: function () {
        if (this._ready) {
            return;
        }
        if (this._lazyInit) {
            this._lazyInit();
        }
        this._ready = true;
        this.fireEvent("onReady", this);
    },
    getDataTypeRepository: function () {
        let view = this.get("view") || window._DEFAULT_VIEW || $topView;
        return view ? view._dataTypeRepository : null;
    },
    fireEvent: function () {
        let optimized = AUTO_APPEND_TO_TOPVIEW === false;
        if (optimized) {
            AUTO_APPEND_TO_TOPVIEW = true;
        }
        let retVal = $invokeSuper.call(this, arguments);
        if (optimized) {
            AUTO_APPEND_TO_TOPVIEW = false;
        }
        return retVal;
    },
    doSetParentViewElement: function (parentViewElement) {
        this._parent = parentViewElement;
    },
});
(function () {
    dorado.widget.DataSet = $extend(dorado.widget.Component, {
        $className: "dorado.widget.DataSet",
        ATTRIBUTES: {
            loadMode: { writeBeforeReady: true, defaultValue: "lazy" },
            dataType: {
                getter: function () {
                    return this.getDataType();
                },
            },
            data: {
                getter: function () {
                    return this.getData();
                },
                setter: function (data) {
                    if (data && data instanceof Object && !(data instanceof Array)) {
                        data.$state = dorado.Entity.STATE_NONE;
                    }
                    if (this._ready) {
                        this.setData(data);
                    }
                    else {
                        this._data = data;
                    }
                },
            },
            dataProvider: {
                setter: function (dp) {
                    this._dataProvider =
                        dp && dp.constructor === String
                            ? dorado.DataProvider.create(dp)
                            : dp;
                },
            },
            parameter: {
                setter: function (parameter) {
                    if (this._parameter instanceof dorado.util.Map &&
                        parameter instanceof dorado.util.Map) {
                        this._parameter.put(parameter);
                    }
                    else {
                        this._parameter = parameter;
                    }
                },
            },
            pageSize: { defaultValue: 0 },
            pageNo: { defaultValue: 1 },
            dataLoaded: { readOnly: true },
            readOnly: { notifyObservers: true },
            cacheable: {},
        },
        EVENTS: { beforeLoadData: {}, onLoadData: {}, onDataLoad: {} },
        _disableObserversCounter: 0,
        constructor: function (configs) {
            this._dataPathCache = {};
            this._observers = [];
            $invokeSuper.call(this, [configs]);
        },
        _constructor: function (configs) {
            $invokeSuper.call(this, [configs]);
            if (this._loadMode === "onCreate") {
                let view = this._view || window._DEFAULT_VIEW;
                if (view && view._loadingDataSets) {
                    view._loadingDataSets.push(this);
                }
                this.getDataAsync();
            }
        },
        get: function (attr) {
            if (attr.substring(0, 5) === "data:") {
                let dataPath = attr.substring(5);
                return this.queryData(dataPath);
            }
            else {
                return $invokeSuper.call(this, [attr]);
            }
        },
        doSet: function (attr, value, skipUnknownAttribute, lockWritingTimes) {
            $invokeSuper.call(this, [
                attr,
                value,
                skipUnknownAttribute,
                lockWritingTimes,
            ]);
            if (!this._ready) {
                return;
            }
            let def = this.ATTRIBUTES[attr];
            if (def && def.notifyObservers) {
                dorado.Toolkits.setDelayedAction(this, "$refreshDelayTimerId", this.notifyObservers, 50);
            }
        },
        onReady: function () {
            $invokeSuper.call(this);
            if (this._observers.length > 0) {
                for (let i = 0; i < this._observers; i++) {
                    this.retrievePreloadConfig(this._observers[i]);
                }
                if (this._data) {
                    this.setData(this._data);
                }
                else {
                    this.sendMessage(0);
                }
            }
            if (this._loadMode === "onReady") {
                let view = this._view || window._DEFAULT_VIEW;
                if (view && view._loadingDataSets) {
                    view._loadingDataSets.push(this);
                }
                this.getDataAsync();
            }
        },
        setData: function (data) {
            let dataType = this.getDataType(null, true), oldData = this._data;
            if (dataType) {
                if (data != null) {
                    if (!(data instanceof dorado.EntityList || data instanceof dorado.Entity)) {
                        let state = data.$state;
                        data = dorado.DataUtil.convert(data, this.getDataTypeRepository(), dataType);
                        if (data instanceof dorado.EntityList) {
                            data.pageSize = this._pageSize;
                        }
                        data.dataProvider = this._dataProvider;
                        if (data instanceof dorado.Entity && state == null) {
                            data.setState(dorado.Entity.STATE_NEW);
                        }
                    }
                }
                else {
                    if (dataType instanceof dorado.AggregationDataType) {
                        data = dorado.DataUtil.convert([], this.getDataTypeRepository(), dataType);
                    }
                }
                if (oldData &&
                    (oldData instanceof dorado.EntityList ||
                        oldData instanceof dorado.Entity)) {
                    oldData._setObserver(null);
                }
                if (data) {
                    if (data.dataType == null) {
                        data.dataType = dataType;
                    }
                    else {
                        if (dataType !== data.dataType) {
                            let mismatch = true;
                            if (dataType instanceof dorado.EntityDataType && data.dataType) {
                                mismatch = data.dataType.getElementDataType() !== dataType;
                            }
                            if (mismatch) {
                                throw new dorado.ResourceException("dorado.widget.DataTypeNotAccording", this._id);
                            }
                        }
                    }
                }
                this._data = data;
            }
            else {
                if (data &&
                    !(data instanceof dorado.Entity || data instanceof dorado.EntityList)) {
                    if (data instanceof Array) {
                        data = new dorado.EntityList(data);
                    }
                    else {
                        if (data instanceof Object && !(data instanceof Date)) {
                            data = new dorado.Entity(data);
                        }
                    }
                }
                this._data = data;
            }
            this._dataLoaded = true;
            if (data &&
                (data instanceof dorado.EntityList || data instanceof dorado.Entity)) {
                data._setObserver(this);
                this._dataPathCache = {};
            }
            if (oldData !== data) {
                this.sendMessage(0);
            }
        },
        insert: function (data) {
            let dataType = this.getDataType(null, true), entity;
            if (dataType instanceof dorado.AggregationDataType) {
                if (this._data == null) {
                    this.setData([]);
                }
                let entityList = this.getData();
                entity = entityList.insert(data);
            }
            else {
                if (dataType instanceof dorado.EntityDataType) {
                    if (this._data == null) {
                        if (data instanceof dorado.Entity) {
                            entity = data;
                        }
                        else {
                            entity = new dorado.Entity(data, this.getDataTypeRepository(), dataType);
                            entity.storeOldData();
                            entity.setState(dorado.Entity.STATE_NEW);
                        }
                        this.setData(entity);
                    }
                    else {
                        throw new dorado.ResourceException("dorado.widget.DataSetNotEmptyException", this._id);
                    }
                }
                else {
                    if (dataType) {
                        throw new dorado.ResourceException("dorado.widget.DataSetNotSupportInsert", this._id);
                    }
                    else {
                        let data = this.getData();
                        if (data instanceof dorado.EntityList) {
                            entity = data.insert();
                        }
                        else {
                            entity = new dorado.Entity();
                            this.setData(entity);
                        }
                    }
                }
            }
            return entity;
        },
        doLoad: function (callback, flush) {
            let data = this._data, shouldFireOnLoadData = false;
            let dataCache, hashCode;
            if (this._cacheable) {
                dataCache = this._dataCache;
                if (!dataCache) {
                    this._dataCache = dataCache = {};
                }
                hashCode =
                    dorado.Object.hashCode(this._parameter) +
                        "-" +
                        dorado.Object.hashCode(this._sysParameter);
                data = dataCache[hashCode];
                if (data !== undefined) {
                    this.setData(data);
                    if (callback) {
                        $callback(callback, true);
                    }
                    return;
                }
            }
            if (data === undefined || flush) {
                if (this._dataProvider) {
                    data = this._dataPipe;
                    if (!data) {
                        data = this._dataPipe = new dorado.DataSetDataPipe(this);
                        shouldFireOnLoadData = true;
                    }
                }
                else {
                    this.setData(null);
                }
            }
            if (data instanceof dorado.DataPipe) {
                let arg = { dataSet: this, pageNo: this._pageNo || 1 };
                this.fireEvent("beforeLoadData", this, arg);
                if (arg.processDefault === false) {
                    delete this._dataPipe;
                    if (callback) {
                        $callback(callback, false);
                    }
                    return;
                }
                if (flush) {
                    this.discard();
                }
                let pipe = data;
                if (callback) {
                    let isNewPipe = pipe.runningProcNum === 0;
                    pipe.getAsync({
                        scope: this,
                        callback: function (success, result) {
                            delete this._dataPipe;
                            if (isNewPipe) {
                                this._data = null;
                                this.sendMessage(DataSet.MESSAGE_LOADING_END, arg);
                                this._loadingData = false;
                                delete this._data;
                            }
                            if (success) {
                                if (shouldFireOnLoadData) {
                                    this.setData(result);
                                    if (this._cacheable) {
                                        dataCache[hashCode] = this.getData();
                                    }
                                    this.fireEvent("onDataLoad", this, arg);
                                    this.fireEvent("onLoadData", this, arg);
                                }
                            }
                            else {
                                if (shouldFireOnLoadData) {
                                    this.setData(null);
                                }
                            }
                            $callback(callback, success);
                        },
                    });
                    if (isNewPipe) {
                        this._loadingData = true;
                        this.sendMessage(DataSet.MESSAGE_LOADING_START, arg);
                    }
                    return;
                }
                else {
                    let shouldAbortAsyncProcedures = dorado.Setting["common.abortAsyncLoadingOnSyncLoading"];
                    if (pipe.runningProcNum > 0 && !shouldAbortAsyncProcedures) {
                        throw new dorado.ResourceException("dorado.widget.GetDataDuringLoading", this._id);
                    }
                    try {
                        let data = pipe.get();
                        this.setData(data);
                        pipe.abort(true, data);
                    }
                    catch (e) {
                        pipe.abort(false, e);
                        this.setData(null);
                        throw e;
                    }
                    delete this._dataPipe;
                    if (this._cacheable) {
                        dataCache[hashCode] = this.getData();
                    }
                    this.fireEvent("onDataLoad", this);
                    this.fireEvent("onLoadData", this);
                }
            }
            else {
                if (flush) {
                    this.discard();
                }
                if (callback) {
                    $callback(callback, true);
                }
            }
        },
        load: function () {
            return this.doLoad();
        },
        loadAsync: function (callback) {
            this.doLoad(callback || dorado._NULL_FUNCTION);
        },
        doGetData: function (path, options, callback) {
            function pollEvaluate(data, dataPath, option, callback) {
                let totalAsyncExecutionTimes = dorado.DataPipe.MONITOR.asyncExecutionTimes;
                let data = dataPath.evaluate(data, options);
                if (dorado.DataPipe.MONITOR.asyncExecutionTimes -
                    totalAsyncExecutionTimes >
                    0) {
                    setTimeout(function () {
                        pollEvaluate(data, dataPath, option, callback);
                    }, 60);
                }
                else {
                    $callback(callback, true, data);
                }
            }
            function evaluatePath(path, options, callback) {
                let data = this._data;
                if (data instanceof dorado.DataPipe) {
                    return null;
                }
                if (data) {
                    if (!(data instanceof dorado.EntityList || data instanceof dorado.Entity)) {
                        this.setData(data);
                        data = this._data;
                    }
                    if (path && path.charAt(0) !== "!" && path.indexOf(".!") < 0) {
                        let key = (path || "$EMPTY") + "~" + optionsCode;
                        let cachedData = this._dataPathCache[key];
                        if (cachedData !== undefined) {
                            dorado.DataPipe.MONITOR.asyncExecutionTimes +=
                                cachedData.asyncExecutionTimes || 0;
                            dorado.DataPipe.MONITOR.executionTimes +=
                                cachedData.asyncExecutionTimes || 0;
                            if (callback) {
                                $callback(callback, true, cachedData.data);
                                return;
                            }
                            else {
                                return cachedData.data;
                            }
                        }
                    }
                    let totalAsyncExecutionTimes = dorado.DataPipe.MONITOR.asyncExecutionTimes;
                    let dataPath = dorado.DataPath.create(path);
                    if (data) {
                        data = dataPath.evaluate(data, options);
                    }
                    let asyncExecutionTimes = dorado.DataPipe.MONITOR.asyncExecutionTimes -
                        totalAsyncExecutionTimes;
                    this._dataPathCache[key] = {
                        data: data,
                        asyncExecutionTimes: asyncExecutionTimes,
                    };
                    if (callback) {
                        if (asyncExecutionTimes < 1) {
                            $callback(callback, true, data);
                        }
                        else {
                            let pollOption = dorado.Core.clone(option);
                            pollOption.loadMode = "always";
                            setTimeout(function () {
                                pollEvaluate(data, dataPath, pollOption, callback);
                            }, 60);
                        }
                    }
                    else {
                        return data;
                    }
                }
                else {
                    if (!path) {
                        let dataType = this.getDataType(null, true);
                        if (dataType instanceof dorado.AggregationDataType) {
                            this.setData([]);
                            data = this._data;
                        }
                        if (callback) {
                            $callback(callback, true, data);
                        }
                        else {
                            return data;
                        }
                    }
                }
            }
            if (typeof options === "string") {
                options = { loadMode: options };
            }
            else {
                options = options || {};
            }
            let optionsCode, loadMode = options.loadMode;
            if (!loadMode) {
                if (this._loadMode === "manual") {
                    loadMode = "never";
                }
                else {
                    loadMode = "always";
                }
            }
            optionsCode = loadMode;
            if (options.firstResultOnly) {
                optionsCode += "F";
            }
            if (options.acceptAggregation) {
                optionsCode += "A";
            }
            if ((options.flush || this._data === undefined) && loadMode !== "never") {
                let sysParameter;
                if (this._preloadConfigsMap) {
                    let preloadConfigs = this._preloadConfigsMap[path || "#EMPTY"];
                    if (preloadConfigs) {
                        sysParameter = this._sysParameter;
                        if (!sysParameter) {
                            this._sysParameter = sysParameter = new dorado.util.Map();
                        }
                        sysParameter.put("preloadConfigs", preloadConfigs);
                    }
                }
                if (callback) {
                    this.doLoad({
                        scope: this,
                        callback: function (success, result) {
                            if (success) {
                                result = evaluatePath.call(this, path, options, callback);
                            }
                        },
                    }, options.flush);
                    if (sysParameter) {
                        sysParameter.remove("preloadConfigs");
                    }
                    return;
                }
                else {
                    if (loadMode === "auto") {
                        this.doLoad(dorado._NULL_FUNCTION, options.flush);
                        if (sysParameter) {
                            sysParameter.remove("preloadConfigs");
                        }
                        return;
                    }
                    else {
                        this.doLoad(null, options.flush);
                        if (sysParameter) {
                            sysParameter.remove("preloadConfigs");
                        }
                    }
                }
            }
            if (callback) {
                evaluatePath.call(this, path, options, callback);
            }
            else {
                return evaluatePath.call(this, path, options, null);
            }
        },
        getData: function (path, options) {
            options = options || {};
            if (options.firstResultOnly == null) {
                options.firstResultOnly = true;
            }
            if (options.acceptAggregation == null) {
                options.acceptAggregation = true;
            }
            return this.doGetData(path, options);
        },
        getDataAsync: function (path, callback, options) {
            options = options || {};
            if (options.firstResultOnly == null) {
                options.firstResultOnly = true;
            }
            if (options.acceptAggregation == null) {
                options.acceptAggregation = true;
            }
            this.doGetData(path, options, callback || dorado._NULL_FUNCTION);
        },
        queryData: function (path, options) {
            return this.doGetData(path, options);
        },
        queryDataAsync: function (path, callback, options) {
            this.doGetData(path, options, callback || dorado._NULL_FUNCTION);
        },
        flush: function () {
            this.getData(null, { flush: true, loadMode: "always" });
        },
        flushAsync: function (options) {
            if (options && typeof options === "function") {
                options = { callback: options };
            }
            else {
                options = options || {};
            }
            let callback = options.callback, modal = options.modal, executingMessage = options.executingMessage;
            let self = this, taskId;
            if (modal) {
                taskId = dorado.util.TaskIndicator.showTaskIndicator(executingMessage ||
                    $resource("dorado.data.DataProviderTaskIndicator"), "main");
            }
            try {
                this.getDataAsync(null, {
                    callback: function (success, result) {
                        if (taskId) {
                            dorado.util.TaskIndicator.hideTaskIndicator(taskId);
                        }
                        $callback(callback, success, result, { scope: self._view });
                    },
                }, { flush: true, loadMode: "always" });
            }
            finally {
                if (taskId) {
                    dorado.util.TaskIndicator.hideTaskIndicator(taskId);
                }
            }
        },
        getDataType: function (path, options) {
            let loadMode;
            if (typeof options === "string") {
                loadMode = options;
            }
            else {
                loadMode = options ? options.loadMode : undefined;
            }
            let dataType = dorado.LazyLoadDataType.dataTypeGetter.call(this);
            if (!dataType && this._data) {
                dataType = this._data.dataType;
            }
            if (dataType) {
                return dorado.DataPath.create(path).getDataType(dataType, options);
            }
            else {
                return null;
            }
        },
        discard: function () {
            delete this._data;
            this._dataPathCache = {};
        },
        clear: function () {
            this.setData(null);
        },
        retrievePreloadConfig: function (observer) {
            if (dorado.widget.DataTree &&
                dorado.Object.isInstanceOf(observer, dorado.widget.DataTree)) {
                let bindingConfigs = observer.get("bindingConfigs");
                if (bindingConfigs) {
                    let preloadConfigsMap = this._preloadConfigsMap, dataPath = observer._dataPath || "#EMPTY";
                    if (!preloadConfigsMap) {
                        this._preloadConfigsMap = preloadConfigsMap = {};
                    }
                    let preloadConfigs = preloadConfigsMap[dataPath] || [];
                    for (let i = 0; i < bindingConfigs.length; i++) {
                        let configs = dorado.widget.DataTree.bindingConfigToPreloadConfig(bindingConfigs[i]);
                        if (configs) {
                            preloadConfigs = preloadConfigs.concat(configs);
                        }
                    }
                    if (preloadConfigs.length) {
                        preloadConfigsMap[dataPath] = preloadConfigs;
                    }
                }
            }
        },
        addObserver: function (observer) {
            this._observers.push(observer);
            if (this._ready && observer._ready) {
                this.retrievePreloadConfig(observer);
            }
        },
        removeObserver: function (observer) {
            this._observers.remove(observer);
        },
        entityMessageReceived: function (messageCode, args) {
            this._dataPathCache = {};
            if (this._ready) {
                this.sendMessage(messageCode, args);
            }
        },
        disableObservers: dorado.Entity.prototype.disableObservers,
        enableObservers: dorado.Entity.prototype.enableObservers,
        notifyObservers: function () {
            dorado.Toolkits.cancelDelayedAction(this, "$refreshDelayTimerId");
            this._dataPathCache = {};
            this.sendMessage(0);
        },
        sendMessage: function (messageCode, args) {
            if (this._disableObserversCounter > 0) {
                return;
            }
            let observers = this._observers;
            for (let i = 0, len = observers.length; i < len; i++) {
                let observer = observers[i];
                observer.dataSetMessageReceived.call(observer, messageCode, args);
            }
        },
        post: function () {
            let observers = this._observers;
            for (let i = 0, len = observers.length; i < len; i++) {
                let observer = observers[i];
                if (dorado.Object.isInstanceOf(observer, dorado.widget.AbstractEditor)) {
                    if (observer.get("rendered")) {
                        observer.post();
                    }
                }
            }
        },
    });
    dorado.DataSetDataPipe = $extend(dorado.DataProviderPipe, {
        $className: "dorado.DataSetDataPipe",
        constructor: function (dataSet) {
            this.dataSet = dataSet;
            this.dataType = dataSet._dataType;
            this.dataTypeRepository = dataSet.get("dataTypeRepository");
            this.view = dataSet.get("view");
        },
        getDataProviderArg: function () {
            let dataSet = this.dataSet, parameter = (dorado.$this = this.dataSet._parameter);
            return {
                pageSize: dataSet._pageSize,
                pageNo: dataSet._pageNo,
                parameter: dorado.JSON.evaluate(parameter),
                sysParameter: dataSet._sysParameter
                    ? dataSet._sysParameter.toJSON()
                    : undefined,
                dataType: this.dataType,
                view: this.view,
            };
        },
        getDataProvider: function () {
            return this.dataSet._dataProvider;
        },
    });
    let DataSet = dorado.widget.DataSet;
    DataSet.MESSAGE_REFRESH = 0;
    DataSet.MESSAGE_DATA_CHANGED = dorado.Entity._MESSAGE_DATA_CHANGED;
    DataSet.MESSAGE_ENTITY_STATE_CHANGED =
        dorado.Entity._MESSAGE_ENTITY_STATE_CHANGED;
    DataSet.MESSAGE_DELETED = dorado.EntityList._MESSAGE_DELETED;
    DataSet.MESSAGE_INSERTED = dorado.EntityList._MESSAGE_INSERTED;
    DataSet.MESSAGE_CURRENT_CHANGED = dorado.EntityList._MESSAGE_CURRENT_CHANGED;
    DataSet.MESSAGE_REFRESH_ENTITY = dorado.Entity._MESSAGE_REFRESH_ENTITY;
    DataSet.MESSAGE_LOADING_START = dorado.Entity._MESSAGE_LOADING_START;
    DataSet.MESSAGE_LOADING_END = dorado.Entity._MESSAGE_LOADING_END;
    DataSet.getOwnerDataSet = function (data) {
        return data._observer instanceof dorado.widget.DataSet
            ? data._observer
            : null;
    };
    dorado.widget.DataSetObserver = $class({
        $className: "dorado.widget.DataSetObserver",
        dataSetMessageReceived: function (messageCode, arg) { },
    });
})();
dorado.widget.DataControl = $extend(dorado.widget.DataSetObserver, {
    $className: "dorado.widget.DataControl",
    ATTRIBUTES: {
        dataSet: {
            componentReference: true,
            setter: function (dataSet) {
                if (this._dataSet === dataSet) {
                    return;
                }
                if (this._dataSet) {
                    this._dataSet.removeObserver(this);
                }
                this._dataSet = dataSet;
                if (dataSet) {
                    dataSet.addObserver(this);
                }
            },
        },
        dataPath: {},
    },
    EVENTS: { onGetBindingData: {}, onGetBindingDataType: {} },
    _disableBindingCounter: 0,
    disableBinding: function () {
        this._disableBindingCounter++;
    },
    enableBinding: function () {
        if (this._disableBindingCounter > 0) {
            this._disableBindingCounter--;
        }
    },
    getBindingData: function (options) {
        if (!options) {
            options = {};
        }
        if (options.loadMode == null) {
            options.loadMode = "auto";
        }
        let eventArg = { options: options, processDefault: true };
        if (this.getListenerCount("onGetBindingData") > 0) {
            this.fireEvent("onGetBindingData", this, eventArg);
        }
        let data = null;
        if (this._dataSet && eventArg.processDefault) {
            data = this._dataSet.getData(this._dataPath, options);
        }
        else {
            data = eventArg.data;
        }
        return data;
    },
    getBindingDataType: function (options) {
        if (!options) {
            options = {};
        }
        if (options.loadMode == null) {
            options.loadMode = "auto";
        }
        let eventArg = { options: options, processDefault: true };
        if (this.getListenerCount("onGetBindingDataType") > 0) {
            this.fireEvent("onGetBindingDataType", this, eventArg);
        }
        let dataType = null;
        if (this._dataSet && eventArg.processDefault) {
            dataType = this._dataSet.getDataType(this._dataPath, options);
        }
        else {
            dataType = eventArg.dataType;
        }
        return dataType;
    },
    dataSetMessageReceived: function (messageCode, arg) {
        if (this._disableBindingCounter === 0) {
            if (this instanceof dorado.widget.Control) {
                if (this._ready) {
                    if (this.isActualVisible()) {
                        if (this.filterDataSetMessage(messageCode, arg)) {
                            this.processDataSetMessage(messageCode, arg);
                        }
                    }
                    else {
                        this._shouldRefreshOnVisible = !!this._rendered;
                    }
                }
            }
            else {
                if (this.filterDataSetMessage(messageCode, arg)) {
                    this.processDataSetMessage(messageCode, arg);
                }
            }
        }
    },
    filterDataSetMessage: function (messageCode, arg) {
        return true;
    },
    processDataSetMessage: dorado._NULL_FUNCTION,
});
dorado.widget.PropertyDataControl = $extend(dorado.widget.DataControl, {
    $className: "dorado.widget.PropertyDataControl",
    ATTRIBUTES: {
        dataPath: {
            defaultValue: "#",
            setter: function (dataPath) {
                this._dataPath = this._realDataPath = dataPath;
                this.processComplexProperty();
            },
        },
        property: {
            setter: function (property) {
                this._property = this._realProperty = property;
                this.processComplexProperty();
            },
        },
    },
    processComplexProperty: function () {
        let dataPath = this._realDataPath;
        let property = this._realProperty;
        if (property) {
            let i = property.lastIndexOf(".");
            if (i > 0 && i < property.length - 1) {
                let property1 = property.substring(0, i);
                let property2 = property.substring(i + 1);
                if (dataPath) {
                    dataPath += "." + property1;
                }
                else {
                    dataPath = "#." + property1;
                }
                this._dataPath = dataPath;
                this._property = property2;
            }
        }
    },
    filterDataSetMessage: function (messageCode, arg, data) {
        let b = true;
        switch (messageCode) {
            case dorado.widget.DataSet.MESSAGE_DATA_CHANGED:
                b = arg.property === this._property;
                if (!b) {
                    let bindingData = this.getBindingData();
                    b =
                        bindingData === arg.newValue ||
                            dorado.DataUtil.isOwnerOf(bindingData, arg.newValue);
                }
                break;
            case dorado.widget.DataSet.MESSAGE_DELETED:
            case dorado.widget.DataSet.MESSAGE_INSERTED:
                b = false;
                break;
        }
        return b;
    },
    getBindingData: function (options) {
        let realOptions = { firstResultOnly: true, acceptAggregation: false };
        if (options) {
            if (typeof options === "String") {
                realOptions.loadMode = options;
            }
            else {
                dorado.Object.apply(realOptions, options);
            }
        }
        return $invokeSuper.call(this, [realOptions]);
    },
    getBindingPropertyDef: function () {
        if (!this._property) {
            return null;
        }
        let entityDataType = this.getBindingDataType(), pd;
        if (entityDataType) {
            let properties = this._property.split("."), i = 0;
            while (entityDataType) {
                pd = entityDataType.getPropertyDef(properties[i]);
                if (pd) {
                    if (i === properties.length - 1) {
                        break;
                    }
                    else {
                        entityDataType = pd.getDataType();
                        if (!entityDataType ||
                            !(entityDataType instanceof dorado.EntityDataType)) {
                            pd = null;
                            break;
                        }
                    }
                }
                else {
                    break;
                }
                i++;
            }
        }
        return pd;
    },
    getBindingPropertyValue: function () {
        let entity = this.getBindingData();
        return entity ? entity.get(this._property) : null;
    },
    getBindingPropertyText: function () {
        let entity = this.getBindingData();
        return entity ? entity.getText(this._property) : "";
    },
});
(function () {
    let lastMouseDownTarget, lastMouseDownTimestamp = 0;
    dorado.widget.Control = $extend([
        dorado.widget.Component,
        dorado.RenderableElement,
        dorado.Draggable,
        dorado.Droppable,
    ], {
        $className: "dorado.widget.Control",
        _isDoradoControl: true,
        _ignoreRefresh: 1,
        _parentActualVisible: true,
        focusable: true,
        tabStop: false,
        selectable: true,
        ATTRIBUTES: {
            className: { writeBeforeReady: true, defaultValue: "d-control" },
            exClassName: {},
            ui: {
                defaultValue: "default",
                skipRefresh: true,
                setter: function (ui) {
                    if (ui === this._ui) {
                        return;
                    }
                    if (this._dom) {
                        if (this._ui) {
                            let classNames = [];
                            let uis = this._ui.split(",");
                            for (let i = 0; i < uis.length; i++) {
                                classNames.push(this._className + "-" + uis[i]);
                            }
                            $fly(this._dom).removeClass(classNames.join(" "));
                        }
                    }
                    this._ui = ui;
                    if (this._dom) {
                        if (ui) {
                            let classNames = [];
                            let uis = ui.split(",");
                            for (let i = 0; i < uis.length; i++) {
                                classNames.push(this._className + "-" + uis[i]);
                            }
                            $fly(this._dom).addClass(classNames.join(" "));
                        }
                    }
                },
            },
            width: {
                setter: function (v) {
                    this._width = isFinite(v) ? parseInt(v) : v;
                    delete this._realWidth;
                    this._fixedWidth =
                        !(typeof v === "string" && v.match("%")) || v === "auto";
                },
            },
            height: {
                setter: function (v) {
                    this._height = isFinite(v) ? parseInt(v) : v;
                    delete this._realHeight;
                    this._fixedHeight =
                        !(typeof v === "string" && v.match("%")) || v === "auto";
                },
            },
            renderTo: { writeOnce: true, writeBeforeReady: true },
            renderOn: { writeOnce: true, writeBeforeReady: true },
            visible: {
                defaultValue: true,
                skipRefresh: true,
                setter: function (visible) {
                    if (visible == null) {
                        visible = true;
                    }
                    if (this._visible !== visible) {
                        this._visible = visible;
                        this.onActualVisibleChange();
                    }
                },
            },
            actualVisible: {
                readOnly: true,
                getter: function () {
                    return this.isActualVisible() && this._attached && this._rendered;
                },
            },
            hideMode: {
                skipRefresh: true,
                writeBeforeReady: true,
                defaultValue: "visibility",
            },
            attached: { readOnly: true },
            focused: { readOnly: true },
            focusParent: {
                skipRefresh: true,
                getter: function () {
                    return this._focusParent || this._parent;
                },
            },
            tip: { skipRefresh: true },
            layoutConstraint: {
                setter: function (layoutConstraint) {
                    if (this._layoutConstraint !== layoutConstraint ||
                        this._visible ||
                        this._hideMode !== "display") {
                        this._layoutConstraint = layoutConstraint;
                        if (this._rendered && this._parent && this._parent._layout) {
                            this._parent._layout.refreshControl(this);
                        }
                        if (this._layoutConstraint ==
                            dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT ||
                            layoutConstraint ==
                                dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT) {
                            this.onActualVisibleChange();
                        }
                    }
                },
            },
            view: {
                skipRefresh: true,
                setter: function (view) {
                    if (this._view === view) {
                        return;
                    }
                    $invokeSuper.call(this, [view]);
                    if (this._innerControls) {
                        let controls = this._innerControls;
                        for (let i = 0, len = controls.length; i < len; i++) {
                            controls[i].set("view", view);
                        }
                    }
                },
            },
        },
        EVENTS: {
            onCreateDom: {},
            beforeRefreshDom: {},
            onRefreshDom: {},
            onClick: {},
            onDoubleClick: {},
            onMouseDown: {},
            onMouseUp: {},
            onContextMenu: {},
            onFocus: {},
            onBlur: {},
            onKeyDown: {},
            onKeyPress: {},
            onResize: {},
            onTap: {},
            onDoubleTap: {},
            onTapHold: {},
            onSwipe: {},
        },
        constructor: function (config) {
            this._actualVisible = !dorado.Object.isInstanceOf(this, dorado.widget.FloatControl);
            dorado.widget.Component.prototype.constructor.call(this, config);
            if (config && typeof config === "object") {
                if (dorado.Object.isInstanceOf(this, dorado.widget.FloatControl)) {
                    let floating = config.floating;
                    if (floating != null) {
                        this.set("floating", floating);
                        delete config.floating;
                    }
                    if (!this._floating) {
                        this._actualVisible = true;
                    }
                }
                let layoutConstraint = config.layoutConstraint;
                if (layoutConstraint) {
                    this.set("layoutConstraint", layoutConstraint);
                    delete config.layoutConstraint;
                }
                let hideMode = config.hideMode;
                if (hideMode) {
                    this.set("hideMode", hideMode);
                    delete config.hideMode;
                }
                let visible = config.visible;
                if (visible != null) {
                    this.set("visible", visible);
                    delete config.visible;
                }
            }
        },
        _constructor: function (config) {
            dorado.widget.Component.prototype._constructor.call(this, config);
            if (this._renderTo || this._renderOn) {
                $setTimeout(this, function () {
                    if (this._rendered) {
                        return;
                    }
                    this.render();
                }, 0);
            }
        },
        isLazyInit: function (config) {
            let lazyInit = config && config.$lazyInit, isFloatControl;
            if (lazyInit === undefined) {
                isFloatControl = dorado.Object.isInstanceOf(this, dorado.widget.FloatControl);
                if (isFloatControl && $setting["widget.lazyInitFloatControl"]) {
                    lazyInit = true;
                }
            }
            return lazyInit;
        },
        onReady: function () {
            $invokeSuper.call(this);
            if (this._innerControls) {
                let controls = this._innerControls, control;
                for (let i = 0, len = controls.length; i < len; i++) {
                    control = controls[i];
                    if (!(control instanceof dorado.widget.Control) &&
                        !control._ready) {
                        control.onReady();
                    }
                }
            }
        },
        destroy: function () {
            if (this._destroyed) {
                return;
            }
            dorado.Toolkits.cancelDelayedAction(this, "$refreshDelayTimerId");
            if (this._innerControls) {
                let controls = this._innerControls.slice(0);
                for (let i = 0, len = controls.length; i < len; i++) {
                    controls[i].destroy();
                }
                delete this._innerControls;
            }
            let isClosed = window.closed || dorado.windowClosed;
            if (!isClosed) {
                if (this._focused) {
                    dorado.widget.onControlGainedFocus(this.get("focusParent"));
                }
                if (this._parent) {
                    if (this._isInnerControl) {
                        this._parent.unregisterInnerControl(this);
                    }
                    else {
                        this._parent.removeChild(this);
                    }
                }
            }
            if (this._modernScroller) {
                this._modernScroller.destroy();
            }
            let dom = this._dom;
            if (dom) {
                delete this._dom;
                dom.doradoUniqueId = null;
                if (dorado.windowClosed) {
                    $fly(dom).unbind();
                }
                else {
                    $fly(dom).remove();
                }
            }
            $invokeSuper.call(this);
        },
        doSet: function (attr, value, skipUnknownAttribute, lockWritingTimes) {
            let def = this.ATTRIBUTES[attr];
            if (def &&
                def.innerComponent != null &&
                def.autoRegisterInnerControl !== false) {
                let originComponent = this.doGet(attr);
                if (originComponent) {
                    if (originComponent instanceof Array) {
                        for (let i = 0; i < originComponent.length; i++) {
                            let c = originComponent[i];
                            if (c instanceof dorado.widget.Control) {
                                this.unregisterInnerControl(c);
                            }
                        }
                    }
                    else {
                        if (originComponent instanceof dorado.widget.Control) {
                            this.unregisterInnerControl(originComponent);
                        }
                    }
                }
            }
            dorado.widget.Component.prototype.doSet.call(this, attr, value, skipUnknownAttribute, lockWritingTimes);
            if (def) {
                if (def.innerComponent != null &&
                    def.autoRegisterInnerControl !== false) {
                    let component = this.doGet(attr);
                    if (component) {
                        if (component instanceof Array) {
                            for (let i = 0, len = component.length; i < len; i++) {
                                let c = component[i];
                                if (c instanceof dorado.widget.Control) {
                                    this.registerInnerControl(c);
                                }
                            }
                        }
                        else {
                            if (component.each || typeof component.each === "function") {
                                let self = this;
                                component.each(function (c) {
                                    if (c instanceof dorado.widget.Control) {
                                        self.registerInnerControl(c);
                                    }
                                });
                            }
                            else {
                                if (component instanceof dorado.widget.Control) {
                                    this.registerInnerControl(component);
                                }
                            }
                        }
                    }
                }
                if (this._rendered &&
                    !this._duringRefreshDom &&
                    this._ignoreRefresh < 1 &&
                    def &&
                    !def.skipRefresh) {
                    this.refresh(true);
                }
            }
        },
        setActualVisible: function (actualVisible) {
            if (this._actualVisible !== actualVisible) {
                this._actualVisible = actualVisible;
                this.onActualVisibleChange();
            }
        },
        isActualVisible: function () {
            let actualVisible = this._visible && this._actualVisible;
            if (!actualVisible) {
                return false;
            }
            if (this._floating &&
                dorado.Object.isInstanceOf(this, dorado.widget.FloatControl)) {
                return true;
            }
            else {
                return (this._parentActualVisible &&
                    this._layoutConstraint !=
                        dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT);
            }
        },
        onActualVisibleChange: function () {
            function notifyChildren(control, parentActualVisible) {
                if (control._innerControls) {
                    let controls = control._innerControls, child;
                    for (let i = 0, len = controls.length; i < len; i++) {
                        child = controls[i];
                        if (child._parentActualVisible === parentActualVisible ||
                            !(child instanceof dorado.widget.Control)) {
                            return;
                        }
                        child._parentActualVisible = parentActualVisible;
                        child.onActualVisibleChange();
                    }
                }
            }
            let actualVisible = this.isActualVisible();
            if (this._parentLayout &&
                this._parentLayout._rendered &&
                this._hideMode === "display" &&
                this._currentVisible !== this._visible) {
                this._parentLayout.refreshControl(this);
            }
            if (actualVisible &&
                this._rendered &&
                this._shouldRefreshOnVisible &&
                !dorado.widget.Control.SKIP_REFRESH_ON_VISIBLE) {
                this.refresh();
            }
            else {
                this.resetAppearance();
            }
            notifyChildren(this, actualVisible);
        },
        refresh: function (delay) {
            if (this._duringRefreshDom || !this._rendered || !this._attached) {
                return;
            }
            if (!this.isActualVisible() &&
                !this._forceRefresh &&
                !(this._currentVisible !== undefined &&
                    this._currentVisible !== this._visible)) {
                this._shouldRefreshOnVisible = !!this._rendered;
                return;
            }
            this._shouldRefreshOnVisible = false;
            if (delay) {
                dorado.Toolkits.setDelayedAction(this, "$refreshDelayTimerId", function () {
                    dorado.Toolkits.cancelDelayedAction(this, "$refreshDelayTimerId");
                    if (!this.isActualVisible() &&
                        !this._forceRefresh &&
                        !(this._currentVisible !== undefined &&
                            this._currentVisible !== this._visible)) {
                        this._shouldRefreshOnVisible = true;
                        return;
                    }
                    this._duringRefreshDom = true;
                    this._shouldRefreshOnVisible = false;
                    let dom = this.getDom(), arg = { dom: dom, processDefault: true };
                    if (this.getListenerCount("beforeRefreshDom")) {
                        this.fireEvent("beforeRefreshDom", this, arg);
                    }
                    if (arg.processDefault) {
                        this.refreshDom(dom);
                        this.onResize();
                        this.fireEvent("onRefreshDom", this, arg);
                    }
                    this.updateModernScroller();
                    this._duringRefreshDom = false;
                }, 50);
            }
            else {
                dorado.Toolkits.cancelDelayedAction(this, "$refreshDelayTimerId");
                this._duringRefreshDom = true;
                let dom = this.getDom(), arg = { dom: dom, processDefault: true };
                if (this.getListenerCount("beforeRefreshDom")) {
                    this.fireEvent("beforeRefreshDom", this, arg);
                }
                if (arg.processDefault) {
                    this.refreshDom(dom);
                    this.onResize();
                    this.fireEvent("onRefreshDom", this, arg);
                }
                this.updateModernScroller();
                this._duringRefreshDom = false;
            }
        },
        resetAppearance: function () {
            if (!this._dom) {
                return;
            }
            let dom = this._dom;
            if (this._currentVisible !== undefined) {
                if (this._currentVisible !== this._visible) {
                    if (this._hideMode === "display") {
                        if (this._visible) {
                            dom.style.display = this._oldDisplay;
                        }
                        else {
                            this._oldDisplay = dom.style.display;
                            dom.style.display = "none";
                        }
                    }
                    else {
                        dom.style.visibility = this._visible ? "" : "hidden";
                    }
                }
            }
            else {
                if (!this._visible) {
                    if (this._hideMode === "display") {
                        this._oldDisplay = dom.style.display;
                        dom.style.display = "none";
                    }
                    else {
                        dom.style.visibility = "hidden";
                    }
                }
            }
            this._currentVisible = !!this._visible;
        },
        _refreshDom: function (dom) {
            dom.doradoUniqueId = this._uniqueId;
            this.resetAppearance();
            let tip = this.get("tip");
            if (tip) {
                this._currentTip = tip;
                dorado.TipManager.initTip(dom, { text: tip });
            }
            else {
                if (this._currentTip) {
                    dorado.TipManager.deleteTip(dom);
                }
            }
        },
        refreshDom: function (dom) {
            if (!this.selectable) {
                $DomUtils.disableUserSelection(dom);
            }
            this._refreshDom(dom);
            let floatClassName = "d-floating";
            if (this._floatingClassName) {
                floatClassName += " " + this._floatingClassName;
            }
            $fly(dom).toggleClass(floatClassName, !!this._floating);
            this.applyDraggable(dom);
            this.applyDroppable(dom);
            $invokeSuper.call(this, [dom]);
        },
        updateModernScroller: function (delay) {
            if (!this._modernScroller) {
                return;
            }
            if (delay) {
                dorado.Toolkits.setDelayedAction(this, "$updateModernScrollerTimerId", function () {
                    if (this._modernScroller) {
                        this._modernScroller.update();
                    }
                }, 50);
            }
            else {
                this._modernScroller.update();
            }
        },
        getRealWidth: function () {
            if (this._width === "none") {
                return null;
            }
            return this._realWidth == null ? this._width : this._realWidth;
        },
        getRealHeight: function () {
            if (this._height === "none") {
                return null;
            }
            return this._realHeight == null ? this._height : this._realHeight;
        },
        doResetDimension: function (force) {
            return dorado.RenderableElement.prototype.resetDimension.call(this, force);
        },
        resetDimension: function (forced) {
            if (this._skipResetDimension || !this.isActualVisible()) {
                return;
            }
            let changed = this.doResetDimension(forced) ||
                !this._fixedWidth ||
                !this._fixedHeight;
            if (!this._duringRefreshDom && (changed || !this._currentVisible)) {
                this._skipResetDimension = true;
                this.onResize();
                this._skipResetDimension = false;
            }
            return changed;
        },
        notifySizeChange: function (delay, force) {
            if (this._parentLayout) {
                this._parentLayout.onControlSizeChange(this, delay, force);
            }
        },
        getDom: function () {
            if (this._destroyed) {
                return null;
            }
            if (this._lazyInit) {
                this._lazyInit();
            }
            if (!this._dom) {
                let dom = (this._dom = this.createDom()), $dom = $fly(this._dom);
                if (!dom.id) {
                    dom.id = "d_" + (this._id || this._uniqueId);
                }
                let className = (this._inherentClassName
                    ? this._inherentClassName
                    : this.ATTRIBUTES.className.defaultValue) || "";
                if (this._className && this._className !== className) {
                    className += " " + this._className;
                }
                if (this._exClassName) {
                    className += " " + this._exClassName;
                }
                if (this._ui) {
                    let uis = this._ui.split(",");
                    for (let i = 0; i < uis.length; i++) {
                        className += " " + this._className + "-" + uis[i];
                    }
                }
                if (className) {
                    $dom.addClass(className);
                }
                this.applyStyle(dom);
                if (this.focusable) {
                    dom.tabIndex = 1;
                }
                let self = this;
                $dom.mousedown(function (evt) {
                    if (!self._eventBinded) {
                        self._eventBinded = true;
                        jQuery(this)
                            .click(function (evt) {
                            if (!self.processDefaultMouseListener()) {
                                return;
                            }
                            let defaultReturnValue;
                            if (self.onClick) {
                                defaultReturnValue = self.onClick(evt);
                            }
                            let arg = {
                                button: evt.button,
                                event: evt,
                                returnValue: defaultReturnValue,
                            };
                            self.fireEvent("onClick", self, arg);
                            return arg.returnValue;
                        })
                            .bind("dblclick", function (evt) {
                            if (!self.processDefaultMouseListener()) {
                                return;
                            }
                            let defaultReturnValue;
                            if (self.onDoubleClick) {
                                defaultReturnValue = self.onDoubleClick(evt);
                            }
                            let arg = {
                                button: evt.button,
                                event: evt,
                                returnValue: defaultReturnValue,
                            };
                            self.fireEvent("onDoubleClick", self, arg);
                            return arg.returnValue;
                        })
                            .mouseup(function (evt) {
                            if (!self.processDefaultMouseListener()) {
                                return;
                            }
                            let defaultReturnValue;
                            if (self.onMouseUp) {
                                defaultReturnValue = self.onMouseUp(evt);
                            }
                            let arg = {
                                button: evt.button,
                                event: evt,
                                returnValue: defaultReturnValue,
                            };
                            self.fireEvent("onMouseUp", self, arg);
                            return arg.returnValue;
                        })
                            .bind("contextmenu", function (evt) {
                            evt = jQuery.event.fix(evt || window.event);
                            let eventArg = { event: evt, processDefault: true };
                            if (self.getListenerCount("onContextMenu")) {
                                eventArg.processDefault = false;
                                self.fireEvent("onContextMenu", self, eventArg);
                            }
                            if (!eventArg.processDefault) {
                                evt.preventDefault();
                                evt.returnValue = false;
                                return false;
                            }
                        });
                    }
                    let target = evt.srcElement || evt.target;
                    if (target !== lastMouseDownTarget ||
                        new Date() - lastMouseDownTimestamp > 500) {
                        if (dorado.Browser.msie && dorado.Browser.version < 10) {
                            let nodeName = target && target.nodeName.toLowerCase();
                            if (nodeName !== "input" &&
                                nodeName !== "textarea" &&
                                nodeName !== "select") {
                                dorado.widget.setFocusedControl(self);
                            }
                        }
                        else {
                            dorado.widget.setFocusedControl(self);
                        }
                        lastMouseDownTarget = target;
                        lastMouseDownTimestamp = new Date();
                    }
                    if (!self.processDefaultMouseListener()) {
                        return;
                    }
                    let defaultReturnValue;
                    if (self.onMouseDown) {
                        defaultReturnValue = self.onMouseDown(evt);
                    }
                    let arg = {
                        button: evt.button,
                        event: evt,
                        returnValue: defaultReturnValue,
                    };
                    self.fireEvent("onMouseDown", self, arg);
                    return arg.returnValue;
                });
                if (this.getListenerCount("onCreateDom")) {
                    this.fireEvent("onCreateDom", this, { dom: dom });
                }
            }
            return this._dom;
        },
        processDefaultMouseListener: function () {
            return !this._disabled;
        },
        doRenderToOrReplace: function (replace, element, nextChildElement) {
            let dom = this.getDom();
            if (!dom) {
                return;
            }
            if (replace) {
                if (!element.parentNode) {
                    return;
                }
                element.parentNode.replaceChild(dom, element);
            }
            else {
                if (!element) {
                    element = document.body;
                }
                if (dom.parentNode !== element ||
                    (nextChildElement && dom.nextSibling !== nextChildElement)) {
                    if (nextChildElement) {
                        element.insertBefore(dom, nextChildElement);
                    }
                    else {
                        element.appendChild(dom);
                    }
                }
            }
            let attached = false, renderTarget = this._renderTo || this._renderOn;
            if (!renderTarget &&
                this._parent &&
                this._parent !== dorado.widget.View.TOP &&
                !(this._floating &&
                    dorado.Object.isInstanceOf(this, dorado.widget.FloatControl))) {
                attached = this._parent._attached;
            }
            else {
                let body = dom.ownerDocument.body;
                let node = dom.parentNode;
                while (node) {
                    if (node === body) {
                        attached = true;
                        break;
                    }
                    node = node.parentNode;
                }
            }
            if (attached) {
                this.onAttachToDocument();
            }
            else {
                this._waitingAttach = true;
                if (this._attached) {
                    this.onDetachFromDocument();
                }
            }
        },
        render: function (containerElement, nextChildElement) {
            if (containerElement) {
                this.doRenderToOrReplace(false, containerElement, nextChildElement);
            }
            else {
                if (this._renderTo) {
                    let container = this._renderTo;
                    if (typeof container === "string") {
                        container = jQuery(container)[0];
                    }
                    this.doRenderToOrReplace(false, container);
                }
                else {
                    if (this._renderOn) {
                        let placeHolder = this._renderOn;
                        if (typeof placeHolder === "string") {
                            placeHolder = jQuery(placeHolder)[0];
                        }
                        if (placeHolder) {
                            this.doRenderToOrReplace(true, placeHolder);
                        }
                    }
                    else {
                        this.doRenderToOrReplace(false);
                    }
                }
            }
        },
        replace: function (elmenent) {
            this.doRenderToOrReplace(true, elmenent);
        },
        unrender: function () {
            if (this._focused) {
                let focusParent = this.get("focusParent");
                dorado.widget.setFocusedControl(focusParent);
            }
            $invokeSuper.call(this);
        },
        onAttachToDocument: function () {
            if (!this._rendered && !this._attached) {
                this._waitingAttach = false;
                let view = this._view;
                if (view &&
                    view !== $topView &&
                    (!view._ready || view._templateMode) &&
                    !view._rendering) {
                    view._templateMode = true;
                    let parents = [];
                    let parent = this._parent;
                    while (parent && parent !== $topView) {
                        if (!parent._ready && !parent._rendering) {
                            parents.push(parent);
                        }
                        parent = parent._parent;
                    }
                    for (let i = parents.length - 1; i >= 0; i--) {
                        parent = parents[i];
                        if (!parent._ready) {
                            parent.onReady();
                        }
                    }
                }
                let dom = this.getDom();
                this._attached = true;
                this._ignoreRefresh--;
                this._duringRefreshDom = true;
                this._skipResize = true;
                let arg = { dom: dom, processDefault: true };
                if (this.getListenerCount("beforeRefreshDom")) {
                    this.fireEvent("beforeRefreshDom", this, arg);
                }
                if (arg.processDefault) {
                    this.refreshDom(dom);
                    this._rendered = true;
                    this.fireEvent("onRefreshDom", this, arg);
                }
                this._duringRefreshDom = false;
                this._skipResize = false;
                if (this.doOnAttachToDocument) {
                    this.doOnAttachToDocument();
                }
                if (this._innerControls) {
                    let innerControls = this._innerControls;
                    for (let i = 0, len = innerControls.length; i < len; i++) {
                        let control = innerControls[i];
                        if (control._waitingAttach &&
                            !control._rendered &&
                            !control._attached) {
                            control.onAttachToDocument();
                        }
                    }
                }
                this.onResize();
                this.updateModernScroller();
                if (!this._ready) {
                    this.onReady();
                }
            }
        },
        onDetachFromDocument: function () {
            if (this._rendered && this._attached) {
                this._attached = false;
                this._ignoreRefresh++;
                if (this.doOnDetachFromDocument) {
                    this.doOnDetachFromDocument();
                }
                if (this._innerControls) {
                    let controls = this._innerControls, control;
                    for (let i = 0, len = controls.length; i < len; i++) {
                        controls[i].onDetachFromDocument();
                    }
                }
            }
        },
        registerInnerControl: function (control) {
            if (!this._innerControls) {
                this._innerControls = [];
            }
            this._innerControls.push(control);
            control._isInnerControl = true;
            if (control._parent === window.$topView) {
                window.$topView.removeChild(control);
            }
            control._parent = control._focusParent = this;
            control.set("view", this instanceof dorado.widget.View ? this : this.get("view"));
            if (control.parentChanged) {
                control.parentChanged();
            }
            if (!control._ready && this._ready) {
                control.onReady.call(control);
            }
        },
        unregisterInnerControl: function (control) {
            if (!this._innerControls) {
                return;
            }
            control.onDetachFromDocument();
            this._innerControls.remove(control);
            control._parent = control._focusParent = null;
            control.set("view", null);
            delete control._isInnerControl;
            if (control.parentChanged) {
                control.parentChanged();
            }
        },
        parentChanged: function () {
            if (!this._ready ||
                (this._floating &&
                    dorado.Object.isInstanceOf(this, dorado.widget.FloatControl))) {
                return;
            }
            let parent = this._parent;
            let parentActualVisible = parent ? parent.isActualVisible() : true;
            if (parentActualVisible !== this._parentActualVisible) {
                this.onActualVisibleChange();
            }
        },
        onResize: function () {
            if (this._skipResize) {
                return;
            }
            if (!this.isActualVisible()) {
                this._shouldRefreshOnVisible = true;
                return;
            }
            if (this.doOnResize) {
                this.doOnResize.apply(this, arguments);
            }
            this.fireEvent("onResize", this);
        },
        findParent: function (type) {
            let parent = this._parent;
            while (parent) {
                if (dorado.Object.isInstanceOf(parent, type)) {
                    return parent;
                }
                parent = parent._parent;
            }
            return null;
        },
        getFocusableSubControls: function () {
            return this._innerControls;
        },
        isFocusable: function (deep) {
            if (!this.focusable ||
                !this._rendered ||
                !this.isActualVisible() ||
                !this.getDom() ||
                this._disabled) {
                return false;
            }
            let dom = this.getDom();
            if (dom.disabled || dom.offsetWidth <= 0) {
                return false;
            }
            if (dorado.ModalManager._controlStack.length > 0) {
                if ((isFloating =
                    dorado.Object.isInstanceOf(this, dorado.widget.FloatControl) &&
                        this._floating)) {
                    if (dom.style.zIndex < dorado.ModalManager.getMask().style.zIndex) {
                        return false;
                    }
                }
                else {
                    if (!this.findParent(dorado.widget.FloatControl)) {
                        return false;
                    }
                }
            }
            if (deep) {
                let child = this, parent = child._parent;
                while (parent && parent !== $topView) {
                    if (!parent._rendered) {
                        break;
                    }
                    if (!parent.isFocusable()) {
                        let focusableSubControls = parent.getFocusableSubControls();
                        return focusableSubControls
                            ? focusableSubControls.indexOf(child) >= 0
                            : false;
                    }
                    if (dorado.Object.isInstanceOf(parent, dorado.widget.FloatControl) &&
                        parent._floating) {
                        break;
                    }
                    child = parent;
                    parent = child._parent;
                }
            }
            return true;
        },
        setFocus: function () {
            let control = this;
            if (control._destroyed) {
                return;
            }
            dorado._LAST_FOCUS_CONTROL = control;
            dorado.Toolkits.setDelayedAction(window, "$setFocusTimerId", function () {
                if (dorado._LAST_FOCUS_CONTROL === control && !control._destroyed) {
                    try {
                        control.doSetFocus();
                    }
                    catch (e) { }
                    dorado.widget.onControlGainedFocus(control);
                }
                dorado._LAST_FOCUS_CONTROL = null;
            }, 10);
        },
        doSetFocus: function () {
            if (this._dom) {
                this._dom.focus();
            }
        },
        onFocus: function () {
            if (this._destroyed) {
                return;
            }
            this._focused = true;
            if (this.doOnFocus) {
                this.doOnFocus();
            }
            if (this._className) {
                let dom = this.getDom();
                if (dom) {
                    $fly(dom).addClass("d-focused " + this._className + "-focused");
                }
            }
            this.fireEvent("onFocus", this);
        },
        onBlur: function () {
            if (this._destroyed) {
                return;
            }
            this._focused = false;
            if (this.doOnBlur) {
                this.doOnBlur();
            }
            let dom = this.getDom();
            if (dom) {
                $fly(dom).removeClass("d-focused " + this._className + "-focused");
            }
            this.fireEvent("onBlur", this);
        },
        onKeyDown: function (evt) {
            let b = true;
            if (this.getListenerCount("onKeyDown")) {
                let arg = {
                    keyCode: evt.keyCode,
                    shiftKey: evt.shiftKey,
                    ctrlKey: evt.ctrlKey,
                    altlKey: evt.altlKey,
                    event: evt,
                    returnValue: true,
                };
                this.fireEvent("onKeyDown", this, arg);
                b = arg.returnValue;
            }
            if (!b) {
                return b;
            }
            let b = this.doOnKeyDown ? this.doOnKeyDown(evt) : true;
            if (!b) {
                return b;
            }
            let p = this.get("parent");
            if (p && !dorado.widget.disableKeyBubble) {
                b = p.onKeyDown(evt);
            }
            return b;
        },
        onKeyPress: function (evt) {
            let b = true;
            if (this.getListenerCount("onKeyPress")) {
                let arg = {
                    keyCode: evt.keyCode,
                    shiftKey: evt.shiftKey,
                    ctrlKey: evt.ctrlKey,
                    altlKey: evt.altlKey,
                    event: evt,
                };
                this.fireEvent("onKeyPress", this, arg);
                b = arg.returnValue;
            }
            if (!b) {
                return b;
            }
            let b = this.doOnKeyPress ? this.doOnKeyPress(evt) : true;
            if (!b) {
                return b;
            }
            let p = this.get("parent");
            if (p && !dorado.widget.disableKeyBubble) {
                b = p.onKeyPress(evt);
            }
            return b;
        },
        initDraggingInfo: function (draggingInfo, evt) {
            $invokeSuper.call(this, arguments);
            draggingInfo.set({ object: this, sourceControl: this });
        },
        onDraggingSourceOver: function (draggingInfo, evt) {
            draggingInfo.set({ targetObject: this, targetControl: this });
            return $invokeSuper.call(this, arguments);
        },
        onDraggingSourceOut: function (draggingInfo, evt) {
            let retval = $invokeSuper.call(this, arguments);
            draggingInfo.set({ targetObject: null, targetControl: null });
            return retval;
        },
        scrollIntoView: function () {
            function doScrollIntoView(container, dom) {
                if (container instanceof dorado.widget.Container) {
                    let contentContainer = container.getContentContainer();
                    if (contentContainer &&
                        $DomUtils.isOwnerOf(dom, contentContainer)) {
                        container._modernScroller &&
                            container._modernScroller.scrollToElement(dom);
                    }
                }
                let parent = container._parent;
                if (parent) {
                    doScrollIntoView(parent, dom);
                }
            }
            if (!this.isActualVisible() || !this._rendered) {
                return;
            }
            let container = this._parent;
            if (container) {
                doScrollIntoView(container, this._dom);
            }
        },
    });
    dorado.widget.disableKeyBubble = false;
    dorado.widget.focusedControl = [];
    dorado.widget.onControlGainedFocus = function (control) {
        if (dorado.widget.focusedControl.peek() === control) {
            return;
        }
        let ov = dorado.widget.focusedControl;
        let nv = [];
        if (control) {
            let c = control;
            while (c) {
                nv.push(c);
                let focusParent = c.get("focusParent");
                if (!focusParent) {
                    break;
                }
                c = focusParent;
            }
            nv = nv.reverse();
        }
        let i = ov.length - 1;
        for (; i >= 0; i--) {
            let o = ov[i];
            if (o === nv[i]) {
                break;
            }
            if (o.onBlur) {
                o.onBlur();
            }
        }
        dorado.widget.focusedControl = nv;
        i++;
        for (; i < nv.length; i++) {
            if (nv[i].onFocus) {
                nv[i].onFocus();
            }
        }
    };
    dorado.widget.setFocusedControl = function (control, ignorePhyscialFocus, skipGlobalBoardcast) {
        if (dorado.widget.focusedControl.peek() === control) {
            return;
        }
        if (!skipGlobalBoardcast && control) {
            let win = window, topDomainWindow, windowStack = [], parentFrames;
            do {
                try {
                    let parent = win.parent;
                    if (parent == null || parent === win) {
                        break;
                    }
                    windowStack.push(parent);
                    try {
                        parentFrames = parent.jQuery("iframe,frame");
                        if (parentFrames) {
                            parentFrames.each(function () {
                                if (this.contentWindow === win) {
                                    let frameControl = win.parent.dorado.widget.Control.findParentControl(this);
                                    win.parent.dorado.widget.setFocusedControl(frameControl, true, true);
                                    return false;
                                }
                            });
                            topDomainWindow = parent;
                        }
                    }
                    catch (e) { }
                }
                catch (e) {
                    break;
                }
                win = parent;
            } while (win);
            function setFrameBlur(win) {
                try {
                    if (win !== window &&
                        win.dorado.widget.Control &&
                        windowStack.indexOf(win) < 0) {
                        win.dorado.widget.setFocusedControl(null, true, true);
                    }
                }
                catch (e) { }
                for (let i = 0; i < win.frames.length; i++) {
                    setFrameBlur(win.frames[i]);
                }
            }
            if (topDomainWindow) {
                setFrameBlur(topDomainWindow);
            }
        }
        while (control && !control.isFocusable()) {
            control = control.get("focusParent");
        }
        if (control) {
            if (!ignorePhyscialFocus) {
                control.setFocus();
            }
            else {
                dorado.widget.onControlGainedFocus(control);
            }
        }
        else {
            if (document.body) {
                setTimeout(function () {
                    if (dorado._LAST_FOCUS_CONTROL == null) {
                        if (!ignorePhyscialFocus) {
                            try {
                                document.body.focus();
                            }
                            catch (e) { }
                        }
                        dorado.widget.onControlGainedFocus(null);
                    }
                }, 0);
            }
        }
    };
    dorado.widget.getMainFocusedControl = function () {
        let v = dorado.widget.focusedControl;
        for (let i = v.length - 1; i >= 0; i--) {
            if (!v[i]._focusParent) {
                return v[i];
            }
        }
        return v[0];
    };
    dorado.widget.getFocusedControl = function () {
        let v = dorado.widget.focusedControl;
        return v.peek();
    };
    dorado.widget.findFocusableControlInElement = function (element, reverse) {
        function findInChildren(element) {
            let el = reverse ? element.lastChild : element.firstChild, control = null;
            while (el) {
                control = findInChildren(el);
                if (control) {
                    break;
                }
                if (el.doradoUniqueId) {
                    let c = dorado.widget.ViewElement.ALL[el.doradoUniqueId];
                    if (c && c.isFocusable() && c.tabStop) {
                        control = c;
                        break;
                    }
                }
                el = reverse ? el.previousSibling : el.nextSibling;
            }
            return control;
        }
        return findInChildren(element);
    };
    function findFocusableControl(control, options) {
        let focusableControls, subControls = control.getFocusableSubControls();
        if (control.isFocusable()) {
            focusableControls = [control];
        }
        if (subControls && subControls.length) {
            if (focusableControls) {
                focusableControls = subControls.concat(focusableControls);
            }
            else {
                focusableControls = subControls;
            }
        }
        let focusableControl = null;
        if (focusableControls) {
            let reverse = false, from = null;
            if (options) {
                reverse = options.reverse;
                from = options.from;
            }
            if (reverse) {
                focusableControls.reverse();
            }
            let start = 0;
            if (from) {
                start = focusableControls.indexOf(from) + 1;
            }
            for (let i = start; i < focusableControls.length; i++) {
                let c = focusableControls[i];
                if (c && c instanceof dorado.widget.Control) {
                    if (c !== control &&
                        dorado.Object.isInstanceOf(c, dorado.widget.FloatControl) &&
                        c._floating) {
                        continue;
                    }
                    if (c === control) {
                        focusableControl = c;
                    }
                    else {
                        focusableControl = findFocusableControl(c, { reverse: reverse });
                    }
                    if (focusableControl && !focusableControl.tabStop) {
                        focusableControl = null;
                    }
                    if (focusableControl) {
                        break;
                    }
                }
            }
        }
        return focusableControl;
    }
    function findNext(from) {
        let control = null, parent = from._focusParent || from._parent;
        while (parent) {
            control = findFocusableControl(parent, { from: from });
            if (control) {
                break;
            }
            from = parent;
            parent = parent._focusParent || parent._parent;
        }
        return control;
    }
    function findPrevious(from) {
        let control = null, parent = from._focusParent || from._parent;
        while (parent) {
            control = findFocusableControl(parent, { from: from, reverse: true });
            if (control) {
                break;
            }
            from = parent;
            parent = parent._focusParent || parent._parent;
        }
        return control;
    }
    dorado.widget.findNextFocusableControl = function (from) {
        let from = from || dorado.widget.getFocusedControl();
        while (from) {
            let control = findNext(from);
            if (control) {
                control = findFocusableControl(control);
            }
            if (control) {
                return control;
            }
            from = from._focusParent || from._parent;
        }
        let floatControls = dorado.widget.FloatControl.VISIBLE_FLOAT_CONTROLS;
        for (let i = 0; i < floatControls.length; i++) {
            from = floatControls[i];
            let control = findFocusableControl(from);
            if (control) {
                return control;
            }
        }
        return findFocusableControl($topView);
    };
    dorado.widget.findPreviousFocusableControl = function (control) {
        let from = from || dorado.widget.getFocusedControl(), control;
        control = findFocusableControl(from, { from: from, reverse: true });
        if (control) {
            return control;
        }
        while (from) {
            control = findPrevious(from);
            if (control) {
                return control;
            }
            from = from._focusParent || from._parent;
        }
        let floatControls = dorado.widget.FloatControl.VISIBLE_FLOAT_CONTROLS;
        for (let i = floatControls.length - 1; i >= 0; i--) {
            from = floatControls[i];
            control = findFocusableControl(from, { reverse: true });
            if (control) {
                return control;
            }
        }
        return findFocusableControl($topView, { reverse: true });
    };
    dorado.widget.Control.findParentControl = function (element, type) {
        function find(win, dom, className) {
            let control = null;
            do {
                let control;
                if (dom.doradoUniqueId) {
                    control = win.dorado.widget.ViewElement.ALL[dom.doradoUniqueId];
                }
                if (control) {
                    if (className) {
                        if (control.constructor.className === className) {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                }
                dom = dom.parentNode;
            } while (dom != null);
            if (!control && win.parent) {
                let parentFrames;
                try {
                    parentFrames = win.parent.jQuery("iframe,frame");
                }
                catch (e) { }
                if (parentFrames) {
                    let frame;
                    parentFrames.each(function () {
                        if (this.contentWindow === win) {
                            frame = this;
                            return false;
                        }
                    });
                    if (frame) {
                        control = find(win.parent, frame, className);
                    }
                }
            }
            return control;
        }
        let className;
        if (typeof type === "function") {
            className = type.className;
        }
        else {
            if (type) {
                className = type + "";
            }
        }
        return find(window, element, className);
    };
    dorado.widget.findParentControl = dorado.widget.Control.findParentControl;
})();
dorado._queueObject = {};
dorado.queue = function (namespace, fn) {
    if (!namespace) {
        return;
    }
    let queue = dorado._queueObject[namespace];
    if (!queue) {
        queue = dorado._queueObject[namespace] = [];
    }
    queue.push(fn);
    if (queue.length === 1) {
        dorado.dequeue(namespace);
    }
};
dorado.dequeue = function (namespace) {
    if (!namespace) {
        return true;
    }
    let queue = dorado._queueObject[namespace];
    if (queue) {
        if (queue.length > 0) {
            let fn = queue.shift();
            fn.call(null, []);
        }
    }
};
(function () {
    let SHOWHIDE_SUFFIX = "_SHOWHIDE";
    let queue = [], needUseModal = false, modalKey = "DORADO_TOUCH_MODAL";
    jQuery(function () {
        document.onclick = function () {
            if (queue.length > 0) {
                queue.forEach(function (fn) {
                    setTimeout(function () {
                        fn && fn();
                    }, 400);
                });
                queue.splice(0, queue.length);
            }
        };
    });
    dorado.doOnBodyClick = function (fn) {
        queue.push(fn);
    };
    let layerModalPool = new dorado.util.ObjectPool({
        makeObject: function () {
            let dom = document.createElement("div");
            $fly(dom)
                .css({
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                opacity: 0.5,
                background: "transparent",
                zIndex: 1000,
                display: "none",
            })
                .click(function () {
                layerModalPool.returnObject(this);
            });
            document.body.appendChild(dom);
            return dom;
        },
        passivateObject: function (dom) {
            let control = jQuery.data(dom, modalKey);
            if (control) {
                control._modalDom = null;
            }
            $fly(dom).css("display", "none");
        },
    });
    dorado.widget.FloatControl = $class({
        $className: "dorado.widget.FloatControl",
        ATTRIBUTES: {
            floating: {
                defaultValue: true,
                writeBeforeReady: true,
                setter: function (floating) {
                    if (this._floating === floating) {
                        return;
                    }
                    let attributeWatcher = this.getAttributeWatcher();
                    if (attributeWatcher.getWritingTimes("visible") === 0) {
                        this._visible = !floating;
                    }
                    this._actualVisible = !floating;
                    this._floating = floating;
                    this.onActualVisibleChange();
                },
            },
            floatingClassName: { writeBeforeReady: true },
            visible: {
                defaultValue: false,
                setter: function (visible) {
                    if (visible == null) {
                        visible = !this._floating;
                    }
                    $invokeSuper.call(this, [visible]);
                },
            },
            animateType: { defaultValue: "zoom", skipRefresh: true },
            showAnimateType: { skipRefresh: true },
            hideAnimateType: { skipRefresh: true },
            animateTarget: { skipRefresh: true },
            left: {},
            top: {},
            center: { skipRefresh: true },
            anchorTarget: { skipRefresh: true },
            offsetLeft: { skipRefresh: true },
            offsetTop: { skipRefresh: true },
            align: { skipRefresh: true },
            vAlign: { skipRefresh: true },
            autoAdjustPosition: { skipRefresh: true, defaultValue: true },
            handleOverflow: { skipRefresh: true, defaultValue: true },
            modal: { skipRefresh: true },
            modalType: { skipRefresh: true, defaultValue: "dark" },
            shadowMode: { defaultValue: "sides" },
            focusAfterShow: { defaultValue: true },
            continuedFocus: {},
        },
        EVENTS: {
            beforeShow: {},
            onShow: {},
            afterShow: {},
            beforeHide: {},
            onHide: {},
            afterHide: {},
            beforeClose: {},
            onClose: {},
        },
        show: function (options) {
            if (typeof options === "function") {
                let callback = options;
                options = { callback: callback };
            }
            else {
                options = options || {};
            }
            let control = this;
            let attrs = [
                "center",
                "autoAdjustPosition",
                "handleOverflow",
                "gapX",
                "gapY",
                "offsetLeft",
                "offsetTop",
                "align",
                "vAlign",
                "handleOverflow",
                "anchorTarget",
            ];
            for (let i = 0; i < attrs.length; i++) {
                let attr = attrs[i], value = options[attr];
                if (value === undefined) {
                    options[attr] = control["_" + attr];
                }
            }
            if (!options.overflowHandler && control.doHandleOverflow) {
                options.overflowHandler = $scopify(control, control.doHandleOverflow);
            }
            dorado.queue(control._uniqueId + SHOWHIDE_SUFFIX, function () {
                options = options || {};
                if (!control._rendered) {
                    let renderTo = control._renderTo;
                    if (renderTo) {
                        if (renderTo instanceof dorado.widget.Container) {
                            renderTo = renderTo.get("containerDom");
                        }
                        else {
                            if (renderTo instanceof dorado.widget.Control) {
                                renderTo = renderTo.getDom();
                            }
                            else {
                                if (typeof renderTo === "string") {
                                    renderTo = jQuery(document.body).find(renderTo)[0];
                                }
                                else {
                                    if (!renderTo.nodeName) {
                                        renderTo = null;
                                    }
                                }
                            }
                        }
                    }
                    let oldVisible = control._visible, oldActualVisible = control._actualVisible;
                    control._visible = true;
                    dorado.widget.Control.SKIP_REFRESH_ON_VISIBLE = true;
                    control.setActualVisible(true);
                    control.render(renderTo);
                    control._visible = oldVisible;
                    dorado.widget.Control.SKIP_REFRESH_ON_VISIBLE = false;
                    control.setActualVisible(oldActualVisible);
                }
                control.initObjectShimForIE();
                control.doShow.apply(control, [options]);
            });
        },
        initObjectShimForIE: function () {
            if (!dorado.useObjectShim || this._objectShimInited) {
                return;
            }
            let iframe = $DomUtils.xCreate({
                tagName: "iframe",
                style: {
                    position: "absolute",
                    visibility: "inherit",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                    filter: "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)",
                },
                src: "about:blank",
            });
            this._dom.appendChild(iframe);
            this._objectShimInited = true;
        },
        doShow: function (options) {
            let control = this, dom = control.getDom(), anim = true, handleModal = true;
            $fly(dom).css({
                display: "",
                visibility: "hidden",
                left: -99999,
                top: -99999,
            });
            let arg = {};
            control.fireEvent("beforeShow", control, arg);
            if (arg.processDefault === false) {
                dorado.dequeue(control._uniqueId + SHOWHIDE_SUFFIX);
                return;
            }
            if (control._visible) {
                handleModal = false;
            }
            control._visible = true;
            control.setActualVisible(true);
            let $dom = $fly(dom);
            $dom.css({ display: "", visibility: "hidden" });
            if (control._shadowMode !== "none") {
                $dom.shadow({ mode: control._shadowMode || "sides" });
            }
            let position = control.getShowPosition(options);
            options.position = position;
            options.animateTarget = control._animateTarget;
            if (needUseModal) {
                if (!control._modalDom) {
                    control._modalDom = layerModalPool.borrowObject();
                    jQuery.data(control._modalDom, modalKey, control);
                }
                control._modalDom.style.display = "";
            }
            if (handleModal && control._modal) {
                dorado.ModalManager.show(dom, dorado.widget.FloatControl.modalTypeClassName[control._modalType]);
            }
            let animateType = options.animateType || control._showAnimateType || control._animateType;
            if (anim && animateType !== "none") {
                control.fireEvent("onShow", control);
                if (options.callback) {
                    options.callback.apply(control.get("view"), [control]);
                }
                let behavior = dorado.widget.FloatControl.behaviors[animateType];
                if (typeof behavior.show === "function") {
                    behavior.show.apply(control, [options]);
                }
            }
            else {
                $fly(dom).css(position);
                control.fireEvent("onShow", control);
                if (options.callback) {
                    options.callback.apply(control.get("view"), [control]);
                }
                control.doAfterShow.apply(control, [options]);
            }
        },
        doAfterShow: function () {
            let control = this, dom = control.getDom();
            if (dorado.widget.FloatControl.VISIBLE_FLOAT_CONTROLS.indexOf(control) < 0) {
                dorado.widget.FloatControl.VISIBLE_FLOAT_CONTROLS.push(control);
            }
            if (dom) {
                jQuery(dom).css({ visibility: "", display: "" }).bringToFront();
                let continuedFocus = control._continuedFocus === undefined
                    ? control._modal
                    : !!control._continuedFocus;
                if (continuedFocus) {
                    let focusParent = dorado.widget.getFocusedControl();
                    let parent = focusParent;
                    while (parent) {
                        if (parent === control) {
                            focusParent = parent.get("focusParent");
                            break;
                        }
                        parent = parent.get("focusParent");
                    }
                    control._focusParent = focusParent;
                }
                if (control._focusAfterShow || control._modal) {
                    control.setFocus();
                }
                control.fireEvent("afterShow", control);
            }
            dorado.dequeue(control._uniqueId + SHOWHIDE_SUFFIX);
        },
        getShowPosition: function (options) {
            let control = this, anchorTarget = options.anchorTarget, position = options.position, dom = control.getDom(), event = options.event, fixedElement, result;
            if (anchorTarget && (options.align || options.vAlign)) {
                if (anchorTarget instanceof dorado.widget.Control) {
                    fixedElement = anchorTarget._dom;
                }
                else {
                    if (dorado.Object.isInstanceOf(anchorTarget, dorado.RenderableElement)) {
                        fixedElement = anchorTarget._dom;
                    }
                    else {
                        if (typeof anchorTarget === "string") {
                            fixedElement = jQuery(anchorTarget)[0];
                        }
                        else {
                            fixedElement = anchorTarget;
                        }
                    }
                }
                result = $DomUtils.dockAround(dom, fixedElement, options);
            }
            else {
                if (position) {
                    result = $DomUtils.locateIn(dom, options);
                }
                else {
                    if (event) {
                        options.position = { left: event.pageX, top: event.pageY };
                        result = $DomUtils.locateIn(dom, options);
                    }
                    else {
                        if (options.center &&
                            control._left === undefined &&
                            control._top === undefined) {
                            let docSize = {
                                width: $fly(window).width(),
                                height: $fly(window).height(),
                            };
                            control._left =
                                (docSize.width - $fly(dom).width()) / 2 +
                                    jQuery(window).scrollLeft();
                            control._top =
                                (docSize.height - $fly(dom).height()) / 2 +
                                    jQuery(window).scrollTop();
                        }
                        options.position = {
                            left: control._left || 0,
                            top: control._top || 0,
                        };
                        result = $DomUtils.locateIn(dom, options);
                    }
                }
            }
            return result;
        },
        hide: function (options) {
            let control = this, args = arguments;
            if (!control._visible) {
                dorado.dequeue(control._uniqueId + SHOWHIDE_SUFFIX);
                return;
            }
            dorado.queue(control._uniqueId + SHOWHIDE_SUFFIX, function () {
                let arg = {};
                control.fireEvent("beforeHide", control, arg);
                if (arg.processDefault === false) {
                    dorado.dequeue(control._uniqueId + SHOWHIDE_SUFFIX);
                    return;
                }
                else {
                    if (control.doBeforeHide) {
                        control.doBeforeHide();
                    }
                }
                let focused = control._focused;
                if (focused) {
                    let focusParent = control._focusParent || control._parent;
                    while (focusParent) {
                        if (focusParent.isFocusable()) {
                            dorado.widget.setFocusedControl(focusParent);
                            break;
                        }
                        focusParent = focusParent._focusParent || focusParent._parent;
                    }
                }
                if (focused && dorado.Browser.msie) {
                    dorado.widget.Control.IGNORE_FOCUSIN_EVENT = true;
                }
                if (control.doHide) {
                    control.doHide.apply(control, args);
                }
                if (focused && dorado.Browser.msie) {
                    dorado.widget.Control.IGNORE_FOCUSIN_EVENT = false;
                }
            });
        },
        doHide: function (options) {
            let control = this, dom = control._dom;
            if (dom) {
                options = options || {};
                if (control._modal) {
                    dorado.ModalManager.hide(dom);
                }
                if (needUseModal) {
                    let hideModalLayer = function () {
                        if (control._modalDom) {
                            control._modalDom.style.display = "none";
                            layerModalPool.returnObject(control._modalDom);
                            control._modalDom = null;
                        }
                    };
                    dorado.doOnBodyClick(hideModalLayer);
                    setTimeout(hideModalLayer, 1000);
                }
                control._visible = false;
                control.setActualVisible(false);
                dorado.widget.FloatControl.VISIBLE_FLOAT_CONTROLS.remove(control);
                let animateType = options.animateType ||
                    control._hideAnimateType ||
                    control._animateType;
                options.animateTarget = control._animateTarget;
                if (animateType !== "none") {
                    let behavior = dorado.widget.FloatControl.behaviors[animateType];
                    if (typeof behavior.hide === "function") {
                        behavior.hide.apply(control, [options]);
                    }
                }
                else {
                    control.doAfterHide();
                }
            }
        },
        doAfterHide: function () {
            let control = this, dom = control._dom;
            control.fireEvent("onHide", control);
            jQuery(dom).unshadow().css({ visibility: "hidden", display: "none" });
            control._currentVisible = false;
            control.fireEvent("afterHide", control);
            dorado.dequeue(control._uniqueId + SHOWHIDE_SUFFIX);
            let continuedFocus = control._continuedFocus === undefined
                ? control._modal
                : !!control._continuedFocus;
            if (continuedFocus) {
                control._focusParent = null;
            }
        },
    });
    dorado.widget.FloatControl.VISIBLE_FLOAT_CONTROLS = [];
    dorado.widget.FloatControl.layerModalPool = layerModalPool;
    let slideShow = function (options, safe) {
        let control = this, align = options.align, vAlign = options.vAlign, direction = options.direction, dom = control._dom;
        $fly(dom).css("visibility", "");
        if (!direction && vAlign && align) {
            if (vAlign.indexOf("inner") !== -1) {
                direction = align.indexOf("right") !== -1 ? "l2r" : "r2l";
            }
            else {
                direction = vAlign.indexOf("bottom") !== -1 ? "t2b" : "b2t";
            }
        }
        direction = direction || "t2b";
        control._slideInDir = direction;
        let position = options.position || {};
        jQuery(dom)
            .css(position)
            .bringToFront()[safe ? "safeSlideIn" : "slideIn"]({
            duration: options.animateDuration || 200,
            easing: options.animateEasing,
            direction: direction,
            complete: function () {
                control.doAfterShow.apply(control, [options]);
                dom.style.display = "";
            },
        });
    };
    let slideHide = function (options, safe) {
        let control = this, dom = control._dom, direction = control._slideInDir;
        switch (direction) {
            case "l2r":
                direction = "r2l";
                break;
            case "r2l":
                direction = "l2r";
                break;
            case "b2t":
                direction = "t2b";
                break;
            case "t2b":
                direction = "b2t";
                break;
        }
        control._slideInDir = null;
        jQuery(dom)[safe ? "safeSlideOut" : "slideOut"]({
            direction: direction,
            duration: options.animateDuration || 200,
            easing: options.animateEasing,
            complete: function () {
                control.doAfterHide.apply(control, arguments);
            },
        });
    };
    dorado.widget.FloatControl.modalTypeClassName = {
        dark: "d-modal-mask",
        transparent: "d-modal-mask-transparent",
    };
    dorado.widget.FloatControl.behaviors = {
        zoom: {
            show: function (options) {
                let control = this, dom = control._dom;
                jQuery(dom).zoomIn(jQuery.extend(options, {
                    duration: options.animateDuration || 200,
                    easing: options.animateEasing,
                    complete: function () {
                        control.doAfterShow.apply(control, [options]);
                    },
                }));
            },
            hide: function (options) {
                let control = this, dom = control._dom;
                jQuery(dom)
                    .css("visibility", "hidden")
                    .zoomOut(jQuery.extend(options, {
                    duration: options.animateDuration || 200,
                    easing: options.animateEasing,
                    complete: function () {
                        control.doAfterHide.apply(control, arguments);
                    },
                }));
            },
        },
        flip: {
            show: function (options) {
                let control = this, dom = control._dom;
                jQuery(dom)
                    .css("visibility", "")
                    .flipIn(jQuery.extend(options, {
                    duration: options.animateDuration || 200,
                    easing: options.animateEasing,
                    complete: function () {
                        control.doAfterShow.apply(control, [options]);
                    },
                }));
            },
            hide: function (options) {
                let control = this, dom = control._dom;
                jQuery(dom).flipOut(jQuery.extend(options, {
                    duration: options.animateDuration || 200,
                    easing: options.animateEasing,
                    complete: function () {
                        control.doAfterHide.apply(control, arguments);
                    },
                }));
            },
        },
        modernZoom: {
            show: function (options) {
                let control = this, dom = control._dom;
                jQuery(dom)
                    .css("visibility", "")
                    .modernZoomIn(jQuery.extend(options, {
                    duration: options.animateDuration || 200,
                    easing: options.animateEasing,
                    complete: function () {
                        control.doAfterShow.apply(control, [options]);
                    },
                }));
            },
            hide: function (options) {
                let control = this, dom = control._dom;
                jQuery(dom).modernZoomOut(jQuery.extend(options, {
                    duration: options.animateDuration || 200,
                    easing: options.animateEasing,
                    complete: function () {
                        control.doAfterHide.apply(control, arguments);
                    },
                }));
            },
        },
        slide: {
            show: function (options) {
                slideShow.apply(this, [options]);
            },
            hide: function (options) {
                slideHide.apply(this, [options]);
            },
        },
        safeSlide: {
            show: function (options) {
                slideShow.apply(this, [options, true]);
            },
            hide: function (options) {
                slideHide.apply(this, [options, true]);
            },
        },
        fade: {
            show: function (options) {
                let control = this, dom = control._dom;
                jQuery(dom)
                    .bringToFront()
                    .css({ visibility: "", opacity: 0 })
                    .animate({ opacity: 1 }, {
                    duration: options.animateDuration || 200,
                    easing: options.animateEasing,
                    complete: function () {
                        $fly(dom).css({ opacity: "" });
                        control.doAfterShow.apply(control, [options]);
                    },
                });
            },
            hide: function (options) {
                let control = this, dom = control._dom;
                jQuery(dom).animate({ opacity: 0 }, {
                    duration: options.animateDuration || 200,
                    easing: options.animateEasing,
                    complete: function () {
                        $fly(dom).css({ opacity: "" });
                        control.doAfterHide.apply(control, arguments);
                    },
                });
            },
        },
    };
})();
(function () {
    let fireParentChanged = true;
    dorado.widget.Container = $extend(dorado.widget.Control, {
        $className: "dorado.widget.Container",
        ATTRIBUTES: {
            className: { defaultValue: "d-container" },
            layout: {
                setter: function (layout) {
                    let oldLayout = this._layout, controls;
                    if (oldLayout) {
                        oldLayout.disableRendering();
                        oldLayout.set("container", null);
                        controls = [];
                        oldLayout._regions.each(function (region) {
                            controls.push(region.control);
                        });
                        oldLayout.removeAllControls();
                        oldLayout.enableRendering();
                        oldLayout.onDetachFromDocument();
                    }
                    if (layout && !(layout instanceof dorado.widget.layout.Layout)) {
                        layout = dorado.Toolkits.createInstance("layout", layout, function (type) {
                            type = type || "Dock";
                            return dorado.util.Common.getClassType("dorado.widget.layout." + type + "Layout", true);
                        });
                    }
                    this._layout = layout;
                    if (layout) {
                        layout.set("container", this);
                        if (controls && controls.length) {
                            layout.disableRendering();
                            controls.each(function (control) {
                                if (control._lazyInit) {
                                    control._lazyInit();
                                }
                                layout.addControl(control);
                            });
                            layout.enableRendering();
                        }
                        if (this._attached &&
                            layout._regions.size === 0 &&
                            !layout._rendered) {
                            layout.onAttachToDocument(this.getContentContainer());
                            layout.refresh();
                        }
                    }
                },
                getter: function () {
                    if (this._layout === undefined) {
                        this._ignoreRefresh++;
                        this.createDefaultLayout();
                        this._ignoreRefresh--;
                    }
                    return this._layout;
                },
            },
            children: {
                skipRefresh: true,
                setter: function (children) {
                    if (!children || children.length < 1) {
                        return;
                    }
                    let container = this;
                    let optimized = AUTO_APPEND_TO_TOPVIEW === false;
                    if (!optimized) {
                        AUTO_APPEND_TO_TOPVIEW = false;
                    }
                    let layout = container._layout;
                    if (layout && layout._rendered) {
                        layout.disableRendering();
                    }
                    if (container._children.length) {
                        for (let i = 0, len = container._children.length; i < len; i++) {
                            container.removeChild(container._children[i]);
                        }
                    }
                    for (let i = 0, len = children.length; i < len; i++) {
                        let child = children[i];
                        if (child instanceof dorado.widget.Component) {
                            container.addChild(child);
                        }
                        else {
                            if (child.$type) {
                                container.addChild(this.createInnerComponent(child));
                            }
                        }
                    }
                    if (!this._ready) {
                        dorado.util.AjaxEngine.processAllPendingRequests(false);
                    }
                    if (!optimized) {
                        AUTO_APPEND_TO_TOPVIEW = true;
                    }
                    if (layout && layout._rendered) {
                        layout.enableRendering();
                        layout.refresh();
                    }
                },
            },
            contentOverflow: {},
            contentOverflowX: {},
            contentOverflowY: {},
            view: {
                setter: function (view) {
                    if (this._view === view) {
                        return;
                    }
                    let container = this;
                    $invokeSuper.call(container, [view]);
                    let children = container._children, child;
                    for (let i = 0, len = children.length; i < len; i++) {
                        children[i].set("view", view);
                    }
                },
            },
            containerDom: {
                readOnly: true,
                getter: function () {
                    if (!this._dom) {
                        this.getDom();
                    }
                    return this.getContentContainer();
                },
            },
            containerUi: { defaultValue: "default" },
        },
        EVENTS: { onScroll: {} },
        constructor: function (config) {
            this._contentContainerVisible = true;
            this._children = [];
            dorado.widget.Control.prototype.constructor.call(this, config);
        },
        _constructor: function (config) {
            let children = config && config.children;
            if (children) {
                delete config.children;
            }
            this._ignoreOnCreateListeners++;
            dorado.widget.Control.prototype._constructor.call(this, config);
            this._ignoreOnCreateListeners--;
            if (children) {
                config.children = children;
                if (!this.isLazyInitChildren || !this.isLazyInitChildren()) {
                    this.set("children", children);
                }
                else {
                    this._lazyInitChildren = function () {
                        delete this._lazyInitChildren;
                        this.set("children", children);
                    };
                }
            }
            if (!this._ignoreOnCreateListeners) {
                if (this.getListenerCount("onCreate")) {
                    this.fireEvent("onCreate", this);
                }
                this._onCreateFired = true;
            }
        },
        createDefaultLayout: function () {
            this.set("layout", new dorado.widget.layout.DockLayout());
        },
        onReady: function () {
            let children = this._children, child;
            for (let i = 0, len = children.length; i < len; i++) {
                child = children[i];
                if (!child._ready && !(child instanceof dorado.widget.Control)) {
                    child.onReady();
                }
            }
            $invokeSuper.call(this);
            for (let i = 0, len = children.length; i < len; i++) {
                child = children[i];
                if (child._floating &&
                    dorado.Object.isInstanceOf(child, dorado.widget.FloatControl) &&
                    !child._ready &&
                    child._visible) {
                    child.show();
                }
            }
        },
        destroy: function () {
            let children = this._children;
            for (let i = children.length - 1; i >= 0; i--) {
                children[i].destroy();
            }
            $invokeSuper.call(this);
        },
        onActualVisibleChange: function () {
            function notifyChildren(control, parentActualVisible) {
                let children = control._children, child;
                for (let i = 0, len = children.length; i < len; i++) {
                    child = children[i];
                    if (child._parentActualVisible === parentActualVisible ||
                        !(child instanceof dorado.widget.Control)) {
                        continue;
                    }
                    child._parentActualVisible = parentActualVisible;
                    child.onActualVisibleChange();
                }
            }
            $invokeSuper.call(this);
            notifyChildren(this, this.isActualVisible());
        },
        doRenderToOrReplace: function (replace, element, nextChildElement) {
            let hasChild = false;
            if (replace &&
                this._children.length === 0 &&
                element.childNodes.length > 0) {
                hasChild = true;
                if (element.childNodes.length === 1) {
                    let childNode = element.childNodes[0];
                    if (childNode.nodeType === 3 &&
                        jQuery.trim(childNode.textContent) === "") {
                        hasChild = false;
                    }
                }
                if (hasChild) {
                    let children = [];
                    for (let i = 0; i < element.childNodes.length; i++) {
                        children.push(element.childNodes[i]);
                    }
                    if (dorado.widget.HtmlContainer) {
                        let htmlContrainer = new dorado.widget.HtmlContainer({
                            content: children,
                        });
                        this.addChild(htmlContrainer);
                    }
                    else {
                        $fly(this.getContentContainer()).append(children);
                    }
                }
            }
            if (!this._ready) {
                let children = this._children, child;
                for (let i = 0, len = children.length; i < len; i++) {
                    child = children[i];
                    if (!(child instanceof dorado.widget.Control) && !child._ready) {
                        child.onReady();
                    }
                }
            }
            $invokeSuper.call(this, [replace, element, nextChildElement]);
        },
        addChild: function (component) {
            if (component._parent) {
                fireParentChanged = false;
                if (component._parent.removeChild) {
                    component._parent.removeChild(component);
                }
                fireParentChanged = true;
            }
            this._children.push(component);
            component._parent = this;
            component.set("view", this instanceof dorado.widget.View ? this : this.get("view"));
            if (fireParentChanged && component.parentChanged) {
                component.parentChanged();
            }
            if (component instanceof dorado.widget.Control) {
                let parentActualVisible = this.isActualVisible();
                if (component._parentActualVisible !== parentActualVisible) {
                    component._parentActualVisible = parentActualVisible;
                    component.onActualVisibleChange();
                }
                let layout = this.get("layout");
                if (layout) {
                    if (!(dorado.Object.isInstanceOf(component, dorado.widget.FloatControl) && component._floating)) {
                        let shouldFireOnAttach = this._attached && layout._regions.size === 0 && !layout._rendered;
                        layout.addControl(component);
                        if (shouldFireOnAttach) {
                            layout.onAttachToDocument(this.getContentContainer());
                            layout.refresh();
                        }
                    }
                }
                if (this._rendered) {
                    this.updateModernScroller(true);
                }
            }
            if (!(component instanceof dorado.widget.Control) &&
                !component._ready &&
                this._ready) {
                component.onReady.call(component);
            }
        },
        removeChild: function (component) {
            this._children.remove(component);
            component.set("view", null);
            component._parent = null;
            if (fireParentChanged && component.parentChanged) {
                component.parentChanged();
            }
            if (component instanceof dorado.widget.Control) {
                let layout = this._layout;
                if (layout) {
                    layout.removeControl(component);
                }
                if (this._rendered) {
                    this.updateModernScroller(true);
                }
            }
        },
        removeAllChildren: function () {
            let layout = this._layout;
            if (layout) {
                layout._disableRendering = true;
            }
            let children = this._children;
            for (let i = children.length - 1; i >= 0; i--) {
                this.removeChild(children[i]);
            }
            if (layout) {
                layout._disableRendering = false;
                layout.refresh();
            }
        },
        createDom: function () {
            let dom = $DomUtils.xCreate({
                tagName: "DIV",
                content: { tagName: "DIV", style: { width: "100%", height: "100%" } },
            });
            this._container = dom.firstChild;
            return dom;
        },
        getContentContainer: function () {
            return this._container || this.getDom();
        },
        getContentContainerSize: function () {
            if (this._className === "d-container" && !this._exClassName) {
                let width = this.getRealWidth(), height = this.getRealHeight();
                if (typeof width === "string" && width.endsWith("px")) {
                    width = parseInt(width);
                }
                if (typeof height === "string" && height.endsWith("px")) {
                    height = parseInt(height);
                }
                if (width >= 0 && height >= 0) {
                    return [width, height];
                }
                let contentContainer = this.getContentContainer();
                if (!(width >= 0)) {
                    width = contentContainer.style.width || -1;
                    if (typeof width === "string" && width.endsWith("px")) {
                        width = parseInt(width);
                    }
                    if (!(width >= 0)) {
                        width =
                            contentContainer.clientWidth || contentContainer.offsetWidth;
                    }
                }
                if (!(height >= 0)) {
                    height = contentContainer.style.height || -1;
                    if (typeof height === "string" && height.endsWith("px")) {
                        height = parseInt(height);
                    }
                    if (!(height >= 0)) {
                        height =
                            contentContainer.clientHeight || contentContainer.offsetHeight;
                    }
                }
                return [width, height];
            }
            else {
                let contentContainer = this.getContentContainer();
                let width = contentContainer.style.width || -1;
                if (typeof width === "string" && width.endsWith("px")) {
                    width = parseInt(width);
                }
                if (!(width >= 0)) {
                    width = contentContainer.clientWidth || contentContainer.offsetWidth;
                }
                let height = contentContainer.style.height || -1;
                if (typeof height === "string" && height.endsWith("px")) {
                    height = parseInt(height);
                }
                if (!(height >= 0)) {
                    height =
                        contentContainer.clientHeight || contentContainer.offsetHeight;
                }
                return [width, height];
            }
        },
        setContentContainerVisible: function (visible) {
            let children = this._children, child;
            for (let i = 0, len = children.length; i < len; i++) {
                child = children[i];
                if (child instanceof dorado.widget.Control) {
                    if (!child._floating ||
                        !dorado.Object.isInstanceOf(child, dorado.widget.FloatControl)) {
                        child.setActualVisible(visible);
                    }
                }
            }
            this._contentContainerVisible = visible;
            let layout = this._layout;
            if (this._rendered &&
                layout &&
                visible &&
                !(layout._regions.size === 0 && !layout._rendered)) {
                layout.onAttachToDocument(this.getContentContainer());
                layout.refresh();
            }
        },
        doOnAttachToDocument: function () {
            let container = this;
            let overflowX = !container._contentOverflowX
                ? container._contentOverflow
                : container._contentOverflowX;
            let overflowY = !container._contentOverflowY
                ? container._contentOverflow
                : container._contentOverflowY;
            overflowX = overflowX || "auto";
            overflowY = overflowY || "auto";
            let contentCt = container.getContentContainer();
            if (contentCt) {
                if (contentCt.nodeType &&
                    contentCt.nodeType === 1 &&
                    (overflowX === "auto" ||
                        overflowY === "auto" ||
                        overflowX === "scroll" ||
                        overflowY === "scroll")) {
                    contentCt.style.overflowX = overflowX;
                    contentCt.style.overflowY = overflowY;
                    container._modernScroller = $DomUtils.modernScroll(contentCt, {
                        autoDisable: true,
                    });
                    $fly(contentCt).bind("modernScrolling", function () {
                        dorado.Toolkits.setDelayedAction(container, "$onScrollTimerId", function () {
                            container.fireEvent("onScroll", container);
                        }, 50);
                    });
                }
                if (dorado.Browser.msie && dorado.Browser.version < 8) {
                    $fly(contentCt).addClass("d-relative");
                }
                if (container._containerUi) {
                    $fly(contentCt).addClass("d-container-ui-" + container._containerUi);
                }
            }
            let layout = container._layout;
            if (container._contentContainerVisible &&
                layout &&
                !(layout._regions.size === 0 && !layout._rendered)) {
                layout.onAttachToDocument(contentCt);
            }
        },
        doOnDetachToDocument: function () {
            let layout = this._layout;
            if (layout) {
                layout.onDetachToDocument();
            }
        },
        doResetDimension: function (force) {
            let changed = $invokeSuper.call(this, [force]);
            this._useOriginalWidth = this._useOriginalHeight = true;
            return changed;
        },
        doOnResize: function () {
            let container = this;
            dorado.Toolkits.cancelDelayedAction(container, "$notifySizeChangeTimerId");
            let layout = container._layout;
            if (container._contentContainerVisible && layout && layout._attached) {
                layout.onResize();
                this.processContentSizeChange();
            }
        },
        onContentSizeChange: function () {
            if (!this._rendered || !this._layout || !this._layout._attached) {
                return;
            }
            this.processContentSizeChange();
            this.updateModernScroller();
        },
        processContentSizeChange: function () {
            if (!this._layout) {
                return;
            }
            let dom = this._dom, containerDom = this.getContentContainer(), layoutDom = this._layout.getDom();
            let overflowX = !this._contentOverflowX
                ? this._contentOverflow
                : this._contentOverflowX;
            let overflowY = !this._contentOverflowY
                ? this._contentOverflow
                : this._contentOverflowY;
            let newWidth, newHeight, containerDomSize;
            if (overflowX === "visible" || !this.getRealWidth()) {
                containerDomSize = this.getContentContainerSize();
                let edgeWidth = dom.offsetWidth - containerDom.offsetWidth;
                let width = layoutDom.offsetWidth + edgeWidth;
                if (layoutDom.offsetWidth > containerDomSize[0]) {
                    newWidth = width;
                }
                else {
                    if (!this._useOriginalWidth && width < this._currentOffsetWidth) {
                        let parent = this._parent, containerToRefresh = this;
                        while (parent) {
                            if (!parent._useOriginalWidth) {
                                containerToRefresh = parent;
                                parent = parent._parent;
                            }
                            else {
                                break;
                            }
                        }
                        if (containerToRefresh) {
                            containerToRefresh.refresh();
                            return;
                        }
                    }
                }
            }
            if (overflowY === "visible" || !this.getRealHeight()) {
                if (!containerDomSize) {
                    containerDomSize = this.getContentContainerSize();
                }
                let edgeHeight = dom.offsetHeight - containerDom.offsetHeight;
                let height = layoutDom.offsetHeight + edgeHeight;
                if (layoutDom.offsetHeight > containerDomSize[1]) {
                    newHeight = height;
                }
                else {
                    if (!this._useOriginalHeight && height < this._currentOffsetHeight) {
                        let parent = this._parent, containerToRefresh = this;
                        while (parent) {
                            if (!parent._useOriginalHeight) {
                                containerToRefresh = parent;
                                parent = parent._parent;
                            }
                            else {
                                break;
                            }
                        }
                        if (containerToRefresh) {
                            containerToRefresh.refresh();
                            return;
                        }
                    }
                }
            }
            let sizeChanged = false, $dom = $fly(dom);
            if (newWidth !== undefined) {
                $dom.outerWidth(newWidth);
                sizeChanged = true;
                this._useOriginalWidth = false;
            }
            else {
                newWidth = $dom.outerWidth();
                sizeChanged = this._useOriginalWidth !== newWidth;
            }
            this._currentOffsetWidth = newWidth;
            if (newHeight !== undefined) {
                $dom.outerHeight(newHeight);
                sizeChanged = true;
                this._useOriginalHeight = false;
            }
            else {
                newHeight = $dom.outerHeight();
                if (this._currentOffsetHeight !== newHeight) {
                    sizeChanged = true;
                }
            }
            this._currentOffsetHeight = newHeight;
            if (sizeChanged) {
                this.notifySizeChange();
            }
        },
        getFocusableSubControls: function () {
            return this._children;
        },
    });
})();
dorado.widget.HtmlContainer = $extend(dorado.widget.Container, {
    $className: "dorado.widget.HtmlContainer",
    focusable: false,
    ATTRIBUTES: {
        className: { defaultValue: "d-html-container" },
        content: {
            skipRefresh: true,
            setter: function (content) {
                this._content = content;
                if (this._ready && this._rendered) {
                    this.applyContent(this._dom, content);
                }
            },
        },
        containerExpression: { writeBeforeReady: true },
    },
    destroy: function () {
        if (this._divFormInnerHtml) {
            $fly(this._divFormInnerHtml).remove();
            delete this._divFormInnerHtml;
        }
        $invokeSuper.call(this);
    },
    assignDom: function (dom) {
        this._dom = dom;
        if (dom) {
            try {
                dom.style.display = "";
            }
            catch (e) { }
        }
    },
    createDom: function () {
        let dom = document.createElement("SPAN");
        if (this._content) {
            this.applyContent(dom, this._content);
        }
        return dom;
    },
    applyContent: function (dom, content) {
        let layoutDom;
        if (this._layout && this._layout._dom) {
            layoutDom = this._layout._dom;
            layoutDom.parentNode.removeChild(layoutDom);
        }
        if (content) {
            this._xCreateContext = {};
            let doms = [];
            this.pushHtmlElement(doms, this._content);
            if (dorado.Browser.isTouch) {
                $fly(dom).find("> :not(.scroll-bar)").remove();
                $fly(dom).prepend(doms);
                let scroller = jQuery.data(dom, "modernScroller");
                if (scroller && scroller._contentInited) {
                    scroller.content = dom.firstChild;
                }
            }
            else {
                $fly(dom).empty().append(doms);
            }
        }
        else {
            if (dorado.Browser.isTouch) {
                $fly(dom).find(":not(.scroll-bar)").remove();
                let scroller = jQuery.data(dom, "modernScroller");
                if (scroller && scroller._contentInited) {
                    scroller.content = null;
                }
            }
            else {
                $fly(dom).empty();
            }
        }
        let container = dom;
        if (this._containerExpression) {
            let jq = $fly(container).find(this._containerExpression);
            if (jq && jq.length > 0) {
                container = jq[0];
            }
        }
        this._container = container;
        if (container && layoutDom) {
            container.appendChild(layoutDom);
        }
        if (this._ready && this._rendered) {
            this.updateModernScroller();
        }
    },
    pushHtmlElement: function (doms, content) {
        function doPush(doms, content, context) {
            if (!content) {
                return;
            }
            if (content.constructor === String) {
                let div = this._divFormInnerHtml;
                if (!div) {
                    this._divFormInnerHtml = div = document.createElement("DIV");
                }
                div.innerHTML = content;
                while (div.firstChild) {
                    let node = div.firstChild;
                    div.removeChild(node);
                    if (dorado.Browser.msie && node.nodeType === 3) {
                        let span = document.createElement("SPAN");
                        span.appendChild(node);
                        node = span;
                    }
                    doms.push(node);
                }
            }
            else {
                if (content.nodeType) {
                    doms.push(content);
                }
                else {
                    doms.push($DomUtils.xCreate(content, null, context));
                }
            }
        }
        if (content instanceof Array) {
            for (let i = 0; i < content.length; i++) {
                doPush(doms, content[i], this._xCreateContext);
            }
        }
        else {
            doPush(doms, content, this._xCreateContext);
        }
    },
    doOnFocus: function () { },
    getSubDom: function (contextKey) {
        this.getDom();
        return this._xCreateContext ? this._xCreateContext[contextKey] : null;
    },
});
let AUTO_APPEND_TO_TOPVIEW = true;
(function () {
    let ALL_VIEWS = [];
    dorado.widget.View = $extend(dorado.widget.Container, {
        $className: "dorado.widget.View",
        ATTRIBUTES: {
            dataTypeRepository: {
                getter: function (p) {
                    return this["_" + p] || $dataTypeRepository;
                },
            },
            className: { defaultValue: "d-view" },
            width: { defaultValue: "100%" },
            height: { defaultValue: "100%" },
            name: { writeBeforeReady: true },
            renderMode: { defaultValue: "onCreate" },
            view: {
                setter: function (view) {
                    dorado.widget.Component.prototype.ATTRIBUTES.view.setter.call(this, view);
                },
            },
            context: {
                writeBeforeReady: true,
                getter: function () {
                    if (this._context == null) {
                        this._context = $map();
                    }
                    return this._context;
                },
                setter: function (context) {
                    this._context = context == null ? null : $map(context);
                },
            },
            children: {
                setter: function (children, attr) {
                    let oldDefaultView = window._DEFAULT_VIEW;
                    window._DEFAULT_VIEW = this;
                    $invokeSuper.call(this, [children, attr]);
                    window._DEFAULT_VIEW = oldDefaultView;
                },
            },
        },
        EVENTS: {
            onLoadData: {},
            onViewElementRegistered: {},
            onViewElementUnregistered: {},
            onComponentRegistered: {},
            onComponentUnregistered: {},
        },
        constructor: function (configs) {
            ALL_VIEWS.push(this);
            this._identifiedViewElements = {};
            this._loadingDataSets = [];
            if (configs === "$TOP_VIEW") {
                this._dataTypeRepository = dorado.DataTypeRepository.ROOT;
            }
            else {
                this._dataTypeRepository = new dorado.DataTypeRepository(dorado.DataTypeRepository.ROOT);
            }
            this._dataTypeRepository._view = this;
            $invokeSuper.call(this, [configs]);
            if (this._id) {
                let oldValue = window[this._id];
                if (oldValue !== undefined) {
                    let errorMesssage;
                    if (oldValue instanceof dorado.widget.View) {
                        errorMesssage = "dorado.widget.UnsafeViewId";
                    }
                    else {
                        errorMesssage = "dorado.widget.UniqueViewId";
                    }
                    new dorado.ResourceException(errorMesssage, this._id);
                }
                else {
                    window[this._id] = this;
                }
            }
        },
        fireOnCreateForOldJsController: function () {
            if (this.getListenerCount("onCreate")) {
                this.fireEvent("onCreate", this);
            }
        },
        loadData: function () {
            if (this._renderMode === "onDataLoaded") {
                let view = this, dataSets = this._loadingDataSets.slice();
                $waitFor(this._loadingDataSets, function () {
                    view.onLoadData(dataSets);
                });
                this._loadingDataSets = [];
                dorado.util.AjaxEngine.processAllPendingRequests(false);
            }
        },
        onReady: function () {
            $invokeSuper.call(this);
            if (this._renderMode !== "onDataLoaded") {
                let view = this, dataSets = this._loadingDataSets.slice();
                $waitFor(this._loadingDataSets, function () {
                    view.onLoadData(dataSets);
                });
                this._loadingDataSets = [];
                dorado.util.AjaxEngine.processAllPendingRequests(false);
            }
        },
        onLoadData: function (dataSets) {
            this.fireEvent("onLoadData", this, { dataSets: dataSets });
            if (this._renderMode === "onDataLoaded") {
                this.render();
            }
        },
        destroy: function () {
            ALL_VIEWS.remove(this);
            $invokeSuper.call(this);
        },
        createDefaultLayout: function () {
            if (this._id !== "$TOP_VIEW") {
                $invokeSuper.call(this);
            }
        },
        parentChanged: function () {
            if (this._parent) {
                let container = this._parent;
                do {
                    if (container instanceof dorado.widget.View) {
                        this._dataTypeRepository.parent = container._dataTypeRepository;
                        break;
                    }
                    container = container._parent;
                } while (container != null);
            }
            else {
                this._dataTypeRepository.parent = dorado.DataTypeRepository.ROOT;
            }
        },
        registerViewElement: function (id, comp) {
            if (!id) {
                return;
            }
            let old = this._identifiedViewElements[id];
            if (old) {
                if (old !== comp) {
                    throw new dorado.ResourceException("dorado.widget.ComponentIdNotUnique", id, this._id);
                }
                else {
                    if (!comp._lazyInit) {
                        return;
                    }
                }
            }
            else {
                this._identifiedViewElements[id] = comp;
            }
            if (!comp._lazyInit) {
                if (this.getListenerCount("onViewElementRegistered")) {
                    this.fireEvent("onViewElementRegistered", this, {
                        viewElement: comp,
                    });
                }
                if (this.getListenerCount("onComponentRegistered")) {
                    this.fireEvent("onComponentRegistered", this, { component: comp });
                }
            }
        },
        unregisterViewElement: function (id) {
            if (!id) {
                return;
            }
            let comp = this._identifiedViewElements[id];
            if (comp && !comp._lazyInit) {
                if (this.getListenerCount("onViewElementUnregistered")) {
                    this.fireEvent("onViewElementUnregistered", this, {
                        component: comp,
                    });
                }
                if (this.getListenerCount("onComponentUnregistered")) {
                    this.fireEvent("onComponentUnregistered", this, { component: comp });
                }
            }
            delete this._identifiedViewElements[id];
        },
        registerComponent: function (id, comp) {
            this.registerViewElement(id, comp);
        },
        unregisterComponent: function (id) {
            this.unregisterViewElement(id);
        },
        getListenerScope: function () {
            return this;
        },
        doGet: function (attr) {
            let c = attr.charAt(0);
            if (c === "#") {
                return this.id(attr.substring(1));
            }
            else {
                if (c === "^") {
                    return this.tag(attr.substring(1));
                }
                else {
                    if (c === "@") {
                        return this.getDataType(attr.substring(1));
                    }
                    else {
                        return $invokeSuper.call(this, [attr]);
                    }
                }
            }
        },
        id: function (id) {
            let viewElement = this._identifiedViewElements[id];
            if (viewElement) {
                if (viewElement._lazyInit) {
                    viewElement._lazyInit();
                }
            }
            else {
                if (dorado.widget.View.DEFAULT_COMPONENTS) {
                    viewElement = dorado.widget.View.getDefaultComponent(this, id);
                    if (viewElement) {
                        this.registerViewElement(id, viewElement);
                    }
                }
            }
            return viewElement;
        },
        tag: function (tags, allowNull) {
            let group = dorado.TagManager.find(tags), allObjects = group.objects, objects = [];
            for (let i = 0; i < allObjects.length; i++) {
                let object = allObjects[i];
                if (object._view === this ||
                    object.view === this ||
                    (object.ATTRIBUTES.view && object.get("view") === this) ||
                    (object.getListenerScope && object.getListenerScope() === this)) {
                    objects.push(object);
                }
            }
            if (!objects.length) {
                if (allowNull) {
                    return null;
                }
                else {
                    if ($setting["common.debugEnabled"] && window.console) {
                        console.log('No element found with tag "' + tags + '".');
                    }
                }
            }
            return new dorado.ObjectGroup(objects);
        },
        getComponentReference: function (id) {
            let comp = this.id(id);
            return comp || { view: this, component: id };
        },
        getDataType: function (name) {
            return this._dataTypeRepository.get(name);
        },
        getDataTypeAsync: function (name, callback) {
            return this._dataTypeRepository.getAsync(name, callback);
        },
        liveSet: function (attr, value, options) {
            function doLiveSet(attr, value, options) {
                let i = attr.indexOf(".");
                if (i > 0) {
                    let fc = attr.charAt(0);
                    if (fc === "#") {
                        let id = attr.substring(1, i);
                        let subAttr = attr.substring(i + 1);
                        let object = this._identifiedViewElements[id];
                        if (object) {
                            object.set(subAttr, value, options);
                        }
                        else {
                            let liveSettingMap = this._liveIdSettingMap;
                            if (!liveSettingMap) {
                                this._liveIdSettingMap = liveSettingMap = {};
                            }
                            let liveSettings = liveSettingMap[id];
                            if (!liveSettings) {
                                liveSettingMap[id] = liveSettings = [];
                            }
                            liveSettings.push({
                                attr: subAttr,
                                value: value,
                                options: options,
                            });
                        }
                    }
                    else {
                        if (fc === "^") {
                            let tag = attr.substring(1, i);
                            let subAttr = attr.substring(i + 1);
                            let group = this.tag(tag, true);
                            if (group) {
                                group.set(subAttr, value, options);
                            }
                            let liveSettingMap = this._liveTagSettingMap;
                            if (!liveSettingMap) {
                                this._liveTagSettingMap = liveSettingMap = {};
                            }
                            let liveSettings = liveSettingMap[tag];
                            if (!liveSettings) {
                                liveSettingMap[tag] = liveSettings = [];
                            }
                            liveSettings.push({
                                attr: subAttr,
                                value: value,
                                options: options,
                            });
                        }
                    }
                }
                else {
                    this.set(attr, value, options);
                }
            }
            if (attr.constructor !== String) {
                for (let p in attr) {
                    if (attr.hasOwnProperty(p)) {
                        let v = attr[p];
                        doLiveSet.call(this, p, v, options);
                    }
                }
            }
            else {
                doLiveSet.call(this, attr, value, options);
            }
            return this;
        },
        liveBind: function (name, listener, options) {
            if (options) {
                this.liveSet(name, { listener: listener, options: options });
            }
            else {
                this.liveSet(name, listener);
            }
            return this;
        },
        doOnResize: function () {
            if (this._templateMode) {
                let children = this._children;
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    if (child.onResize && (child._renderTo || child._renderOn)) {
                        child.onResize();
                    }
                }
            }
            else {
                $invokeSuper.call(this, arguments);
            }
        },
        render: function (containerElement) {
            $fly(document.body).addClass("d-rendering");
            let bodyWidth;
            if (containerElement === document.body) {
                bodyWidth = document.body.clientWidth;
            }
            $invokeSuper.call(this, [containerElement]);
            if (bodyWidth && bodyWidth > document.body.clientWidth) {
                this.onResize();
            }
            dorado.Toolkits.setDelayedAction(document.body, "$removeRenderingCls", function () {
                $fly(document.body).removeClass("d-rendering");
            }, 500);
        },
        doRenderToOrReplace: function (replace, element, nextChildElement) {
            this._rendering = true;
            $invokeSuper.call(this, [replace, element, nextChildElement]);
            this._rendering = false;
        },
        bindByExpression: function (expression, listener, options) {
            let i = expression.lastIndexOf("."), objectsExpression, eventName;
            if (i > 0) {
                objectsExpression = expression.substring(0, i);
                eventName = expression.substring(i + 1);
            }
            if (i <= 0 || !eventName) {
                throw new dorado.Exception('Invalid binding expression "' + expression + '".');
            }
            let objects;
            if (objectsExpression === "view") {
                objects = this;
            }
            else {
                objects = this.get(objectsExpression);
            }
            let count = 0;
            if (objects) {
                if (dorado.Object.isInstanceOf(objects, dorado.EventSupport)) {
                    objects.bind(eventName, listener, options);
                    count = 1;
                }
                else {
                    if (objects instanceof dorado.ObjectGroup) {
                        objects.bind(eventName, listener, options);
                        count = objects.objects.length;
                    }
                }
            }
            return count;
        },
    });
    dorado.widget.View.registerDefaultComponent = function (id, component) {
        let comps = (this.DEFAULT_COMPONENTS = this.DEFAULT_COMPONENTS || {});
        comps[id] = component;
    };
    dorado.widget.View.getDefaultComponent = function (view, id) {
        let comps = this.DEFAULT_COMPONENTS;
        if (!comps || !comps[id]) {
            return;
        }
        let comp = comps[id];
        if (typeof comp === "function") {
            comp = comp(view);
        }
        return comp;
    };
    window.$id = function (id) {
        let viewElements = [];
        for (let i = 0; i < ALL_VIEWS.length; i++) {
            let view = ALL_VIEWS[i];
            let viewElement = view.id(id);
            if (viewElement) {
                viewElements.push(viewElement);
            }
        }
        return new dorado.ObjectGroup(viewElements);
    };
    window.$waitFor = dorado.widget.View.waitFor = function (tasks, callback) {
        if (!(tasks instanceof Array)) {
            tasks = [tasks];
        }
        let simTasks = [];
        jQuery.each(tasks, function (i, task) {
            if (task instanceof dorado.widget.DataSet) {
                if (!task.get("dataLoaded")) {
                    simTasks.push({
                        callback: dorado._NULL_FUNCTION,
                        run: function (callback) {
                            task.loadAsync(callback);
                        },
                    });
                }
            }
            else {
                if (task instanceof dorado.widget.AsyncAction) {
                    simTasks.push({
                        callback: dorado._NULL_FUNCTION,
                        run: function (callback) {
                            task.execute(callback);
                        },
                    });
                }
                else {
                    if (typeof task === "function") {
                        simTasks.push({ callback: dorado._NULL_FUNCTION, run: task });
                    }
                    else {
                        simTasks.push(task);
                    }
                }
            }
        });
        dorado.Callback.simultaneousCallbacks(simTasks, callback);
    };
    let resizeCallbacks = [];
    dorado.bindResize = function (callback) {
        if (typeof callback !== "function") {
            return;
        }
        resizeCallbacks.push(callback);
    };
    dorado.fireResizeCallback = function (keyboardVisible) {
        for (let i = 0, j = resizeCallbacks.length; i < j; i++) {
            let callback = resizeCallbacks[i];
            callback.call(null, keyboardVisible);
        }
    };
    dorado.unbindResize = function (callback) {
        if (typeof callback !== "function") {
            return;
        }
        let index = resizeCallbacks.indexOf(callback);
        if (index !== -1) {
            resizeCallbacks.removeAt(index);
        }
    };
    let topView = new dorado.widget.View("$TOP_VIEW");
    dorado.widget.View.TOP = topView;
    window.$topView = topView;
    jQuery().ready(function () {
        function getControlByElement(el) {
            let node = $DomUtils.findParent(el, function (node) {
                return !!node.doradoUniqueId;
            });
            let control = null;
            if (node) {
                control = dorado.widget.ViewElement.ALL[node.doradoUniqueId];
            }
            return control;
        }
        window._doradoInit = new Date();
        dorado.fireBeforeInit();
        $fly(document).mousedown(function (evt) {
            let element = evt.target;
            if (!element || !element.style || element.style.tabIndex < 0) {
                return;
            }
            let nodeName = element.nodeName.toLowerCase();
            let ignorePhyscialFocus = nodeName === "input" || nodeName === "textarea" || nodeName === "select";
            let control = getControlByElement(element);
            if (control == null) {
                dorado.widget.setFocusedControl(null, ignorePhyscialFocus);
            }
            else {
                dorado.widget.setFocusedControl(control, ignorePhyscialFocus);
            }
        });
        $fly(document)
            .keydown(function (evt) {
            let b, c = dorado.widget.getFocusedControl();
            if (c) {
                b = c.onKeyDown(evt);
            }
            if ((dorado.widget.HtmlContainer &&
                c instanceof dorado.widget.HtmlContainer) ||
                (dorado.widget.TemplateField &&
                    c instanceof dorado.widget.TemplateField)) {
                return true;
            }
            if (b === false) {
                evt.preventDefault();
                evt.cancelBubble = true;
                return false;
            }
            else {
                if ($setting["common.preventBackspace"]) {
                    switch (evt.keyCode || evt.which) {
                        case 8:
                            let doPrevent = false;
                            let target = evt.srcElement || evt.target;
                            if ((target.tagName.toLowerCase() === "input" &&
                                (target.type.toLowerCase() === "text" ||
                                    target.type.toLowerCase() === "password" ||
                                    target.type.toLowerCase() === "file")) ||
                                target.tagName.toLowerCase() === "textarea") {
                                doPrevent = target.readOnly || target.disabled;
                            }
                            else {
                                doPrevent = true;
                            }
                            if (doPrevent) {
                                evt.preventDefault();
                                evt.cancelBubble = true;
                                return false;
                            }
                            break;
                    }
                }
                if (b === true) {
                    switch (evt.keyCode || evt.which) {
                        case 8:
                            let target = evt.srcElement || evt.target;
                            if (target) {
                                let nodeName = target.nodeName.toLowerCase();
                                if (!((nodeName === "input" || nodeName === "textarea") &&
                                    !target.readOnly &&
                                    !target.disabled)) {
                                    return false;
                                }
                            }
                            break;
                        case 13:
                            if ($setting["common.enterAsTab"]) {
                                let c = evt.shiftKey
                                    ? dorado.widget.findPreviousFocusableControl()
                                    : dorado.widget.findNextFocusableControl();
                                if (c) {
                                    c.setFocus();
                                }
                                evt.preventDefault();
                                evt.cancelBubble = true;
                                return false;
                            }
                            break;
                        case 9:
                            let c = evt.shiftKey
                                ? dorado.widget.findPreviousFocusableControl()
                                : dorado.widget.findNextFocusableControl();
                            if (c) {
                                c.setFocus();
                            }
                            evt.preventDefault();
                            evt.cancelBubble = true;
                            return false;
                    }
                }
                return true;
            }
        })
            .keypress(function (evt) {
            let b, c = dorado.widget.getFocusedControl();
            if (c) {
                b = c.onKeyPress(evt);
            }
            if (b === false) {
                evt.preventDefault();
                evt.cancelBubble = true;
                return false;
            }
            else {
                return true;
            }
        });
        let cls = "d-unknown-browser", b = dorado.Browser, v = b.version;
        if (b.isTouch) {
            if (b.android) {
                cls = "d-android";
            }
            else {
                if (b.iOS) {
                    cls = "d-ios";
                }
            }
            if (b.androidNative) {
                cls += " d-android-native";
            }
        }
        else {
            if (b.msie) {
                cls = "d-ie";
            }
            else {
                if (b.mozilla) {
                    cls = "d-mozilla";
                }
                else {
                    if (b.chrome) {
                        cls = "d-chrome";
                    }
                    else {
                        if (b.safari) {
                            cls = "d-safari";
                        }
                        else {
                            if (b.opera) {
                                cls = "d-opera";
                            }
                        }
                    }
                }
            }
            if ($setting["common.simulateTouch"]) {
                cls += " d-touch";
            }
        }
        if (v) {
            cls += " " + cls + v;
        }
        if (b.android_40) {
            cls += " d-android-40";
        }
        $fly(document.body).addClass(cls);
        if (!dorado.Browser.isTouch) {
            $fly(document.body).focusin(function (evt) {
                if (dorado.widget.Control.IGNORE_FOCUSIN_EVENT) {
                    return;
                }
                let control = getControlByElement(evt.target);
                if (control) {
                    dorado.widget.onControlGainedFocus(control);
                }
            });
        }
        let resizeTopView = function () {
            if (topView.onResizeTimerId) {
                clearTimeout(topView.onResizeTimerId);
                delete topView.onResizeTimerId;
            }
            topView.onResizeTimerId = setTimeout(function () {
                dorado.fireResizeCallback();
                rootViewport.updateBodySize();
                delete topView.onResizeTimerId;
                topView._children.each(function (child) {
                    if (child.resetDimension &&
                        ((child._rendered && child._visible) || child._templateMode)) {
                        child.resetDimension();
                    }
                });
            }, 100);
        };
        let isInIFrame = false;
        try {
            isInIFrame = !!(top !== window || window.frameElement);
        }
        catch (e) {
            isInIFrame = true;
        }
        let doInitDorado = function () {
            dorado.fireOnInit();
            topView.onReady();
            let oldWidth = $fly(window).width(), oldHeight = $fly(window).height();
            $fly(window).on("unload", function () {
                dorado.windowClosed = true;
                if (!topView._destroyed) {
                    topView.destroy();
                }
            });
            let oldResize = window.onresize, keyboardVisible;
            window.onresize = function () {
                oldResize && oldResize.apply(window, arguments);
                let control = dorado.widget.getFocusedControl();
                while (control) {
                    if (control instanceof dorado.widget.AbstractEditor) {
                        control.post();
                    }
                    control = control._focusParent || control._parent;
                }
                if (dorado.Browser.isTouch) {
                    let width = $fly(window).width(), height = $fly(window).height();
                    if ((oldWidth === undefined && oldHeight === undefined) ||
                        (width !== oldWidth && height !== oldHeight)) {
                        resizeTopView();
                    }
                    else {
                        if (dorado.Browser.miui &&
                            !keyboardVisible &&
                            Math.abs(height - oldHeight) < 100) {
                            resizeTopView();
                        }
                        else {
                            if (dorado.Browser.android &&
                                Math.abs(height - oldHeight) > 100) {
                                keyboardVisible = height - oldHeight < 0;
                                dorado.fireResizeCallback(keyboardVisible);
                            }
                        }
                    }
                    oldWidth = width;
                    oldHeight = height;
                }
                else {
                    resizeTopView();
                }
            };
            if (dorado.Browser.isTouch) {
                $fly(window).bind("orientationchange", function () {
                    resizeTopView();
                });
                $fly(document).bind("touchmove", function (event) {
                    event.preventDefault();
                });
            }
            dorado.fireAfterInit();
        };
        let rootViewport = {
            init: function (fn, scope) {
                let me = this, stretchSize = Math.max(window.innerHeight, window.innerWidth) * 2, body = document.body;
                this.initialHeight = window.innerHeight;
                jQuery(body).height(stretchSize);
                this.scrollToTop();
                setTimeout(function () {
                    me.scrollToTop();
                    setTimeout(function () {
                        me.scrollToTop();
                        me.initialHeight = Math.max(me.initialHeight, window.innerHeight);
                        me.updateBodySize();
                        if (fn) {
                            fn.apply(scope || window);
                        }
                    }, 50);
                }, 50);
            },
            scrollToTop: function () {
                if (!dorado.Browser.isPhone) {
                    return;
                }
                if (dorado.Browser.iOS) {
                    if (dorado.Browser.isPhone) {
                        document.body.scrollTop = document.body.scrollHeight;
                    }
                }
                else {
                    window.scrollTo(0, 1);
                }
            },
            updateBodySize: function () {
                if (isInIFrame) {
                    return;
                }
                let $body = $fly(document.body), width = jQuery(window).width(), height = jQuery(window).height();
                $body.height(height).width(width);
            },
        };
        if (dorado.Browser.isTouch) {
            if (isInIFrame) {
                setTimeout(doInitDorado, 10);
            }
            else {
                rootViewport.init(function () {
                    doInitDorado();
                });
            }
            return;
        }
        if (dorado.Browser.chrome) {
            setTimeout(doInitDorado, 10);
        }
        else {
            doInitDorado();
        }
    });
})();
(function () {
    let EMPTY_CONTROLLER = {};
    dorado.widget.View.prototype.controller = EMPTY_CONTROLLER;
    dorado.widget.Controller = {
        registerFunctions: function (view, configs) {
            function doRegister(view, configs) {
                for (let i = 0; i < configs.length; i++) {
                    let config = configs[i], name = config.name, func = config.func, bindingInfos = config.bindingInfos;
                    if (bindingInfos) {
                        let exp, expSections, fc, count, id, tag, liveIdBindingMap, liveBindings;
                        for (let j = 0, len = bindingInfos.length; j < len; j++) {
                            exp = bindingInfos[j];
                            let fc = exp.charAt(0), count;
                            if (exp === "view.onCreate" &&
                                $setting["widget.fireViewOnCreateForOldController"]) {
                                view._ignoreOnCreateListeners++;
                                count = view.bindByExpression(exp, func);
                                view._ignoreOnCreateListeners--;
                            }
                            else {
                                count = view.bindByExpression(exp, func);
                            }
                            if (fc === "#") {
                                if (count === 0) {
                                    expSections = exp.split(".");
                                    id = expSections[0].substring(1);
                                    liveBindingMap = view._liveIdBindingMap;
                                    if (!liveBindingMap) {
                                        view._liveIdBindingMap = liveBindingMap = {};
                                    }
                                    liveBindings = liveBindingMap[id];
                                    if (!liveBindings) {
                                        liveBindingMap[id] = liveBindings = [];
                                    }
                                    if (expSections.length === 2) {
                                        liveBindings.push({
                                            id: id,
                                            event: expSections[1],
                                            listener: func,
                                        });
                                    }
                                    else {
                                        liveBindings.push({
                                            id: id,
                                            subObject: expSections
                                                .slice(1, expSections.length - 1)
                                                .join("."),
                                            event: expSections[expSections.length - 1],
                                            listener: func,
                                        });
                                    }
                                }
                            }
                            else {
                                if (fc === "^") {
                                    expSections = exp.split(".");
                                    tag = expSections[0].substring(1);
                                    liveBindingMap = view._liveTagBindingMap;
                                    if (!liveBindingMap) {
                                        view._liveTagBindingMap = liveBindingMap = {};
                                    }
                                    liveBindings = liveBindingMap[tag];
                                    if (!liveBindings) {
                                        liveBindingMap[tag] = liveBindings = [];
                                    }
                                    if (expSections.length === 2) {
                                        liveBindings.push({
                                            tag: tag,
                                            event: expSections[1],
                                            listener: func,
                                        });
                                    }
                                    else {
                                        liveBindings.push({
                                            tag: tag,
                                            subObject: expSections
                                                .slice(1, expSections.length - 1)
                                                .join("."),
                                            event: expSections[expSections.length - 1],
                                            listener: func,
                                        });
                                    }
                                }
                            }
                        }
                    }
                    if (config.global) {
                        if (window[name] !== undefined) {
                            throw new dorado.Exception('A gloal function or variable named "' +
                                name +
                                '" is already exists.');
                        }
                        window[name] = func;
                    }
                    if (config.view) {
                        if (view[name] !== undefined) {
                            throw new dorado.Exception('A method or property named "' +
                                name +
                                '" is already exists in View "' +
                                View._id +
                                '".');
                        }
                        view[name] = func;
                    }
                }
            }
            doRegister(view, configs);
        },
    };
})();
dorado.widget.SubViewHolder = $extend(dorado.widget.Control, {
    $className: "dorado.widget.SubViewHolder",
    ATTRIBUTES: {
        className: { defaultValue: "d-sub-view" },
        subViewName: { readOnly: true },
        loadMode: { readOnly: true },
        context: {},
        subView: { writeBeforeReady: true },
        loaded: { readOnly: true },
    },
    EVENTS: { beforeLoad: {}, onLoad: {}, onLoadFailure: {} },
    _constructor: function (config) {
        if (config && typeof config === "object") {
            this._subViewName = config.subViewName;
            this._loadMode = config.loadMode;
            this._context = config.context;
            delete config.subViewName;
            delete config.loadMode;
            delete config.context;
        }
        $invokeSuper.call(this, arguments);
    },
    onReady: function () {
        if (this._loadMode === "lazy") {
            this.load();
        }
        else {
            let subView = this._subView;
            if (subView) {
                this.registerInnerControl(subView);
                subView.render(this.getDom());
            }
        }
        $invokeSuper.call(this);
    },
    doOnResize: function () {
        if (!this._ready) {
            return;
        }
        let subView = this._subView;
        if (subView) {
            subView._realWidth = this._dom.offsetWidth;
            subView._realHeight = this._dom.offsetHeight;
            subView.resetDimension();
        }
    },
    getAjaxEngine: function () {
        let ajax = dorado.widget.SubViewHolder.AJAX_ENGINE;
        if (!ajax) {
            ajax = dorado.util.AjaxEngine.getInstance($setting["ajax.loadViewOptions"]);
        }
        return ajax;
    },
    load: function (callback) {
        let subViewHolder = this;
        if (subViewHolder._loaded) {
            $callback(callback, true);
            return;
        }
        if (subViewHolder._loading) {
            throw new ResourceException("dorado.baseWidget.ErrorSubViewLoading");
        }
        let eventArg = { processDefault: true };
        this.fireEvent("beforeLoad", eventArg);
        if (!eventArg.processDefault) {
            return;
        }
        subViewHolder._loaded = true;
        if (subViewHolder._subView) {
            subViewHolder._subView.unrender();
            subViewHolder._subView.destroy();
        }
        $fly(subViewHolder._dom)
            .empty()
            .xCreate({
            tagName: "DIV",
            className: "loading-indicator",
            content: { tagName: "div", className: "spinner" },
        });
        let ajax = subViewHolder.getAjaxEngine();
        subViewHolder._loading = true;
        ajax.request({
            parameter: {
                q: dorado.JSON.stringify({
                    action: "load-view",
                    viewName: subViewHolder._subViewName,
                    context: subViewHolder._context,
                }),
            },
        }, {
            callback: function (success, result) {
                subViewHolder._loading = false;
                $fly(subViewHolder._dom).empty();
                if (success) {
                    let jsonResult = result.getJsonData();
                    if (jsonResult.packages) {
                        $import(jsonResult.packages, function () {
                            subViewHolder._subView = jsonResult.createView();
                            subViewHolder.registerInnerControl(subViewHolder._subView);
                            subViewHolder._subView.render(subViewHolder._dom);
                            subViewHolder.fireEvent("onLoad");
                            $callback(callback, true);
                        });
                    }
                    else {
                        subViewHolder._subView = jsonResult.createView();
                        subViewHolder.registerInnerControl(subViewHolder._subView);
                        subViewHolder._subView.render(subViewHolder._dom);
                        subViewHolder.fireEvent("onLoad");
                        $callback(callback, true);
                    }
                }
                else {
                    $fly(subViewHolder._dom).xCreate({
                        tagName: "DIV",
                        className: "error-message",
                        content: dorado.Exception.getExceptionMessage(result.exception),
                    });
                    eventArg = { processDefault: true, exception: result.exception };
                    subViewHolder.fireEvent("onLoadFailure", eventArg);
                    if (!eventArg.processDefault) {
                        dorado.Exception.removeException(result.exception);
                    }
                    $callback(callback, false, result.exception);
                }
            },
        });
    },
    reload: function (callback) {
        subViewHolder._loaded = false;
        subViewHolder._loading = false;
        this.load(callback);
    },
});
dorado.widget.layout = {};
dorado.widget.layout.Layout = $extend(dorado.AttributeSupport, {
    $className: "dorado.widget.layout.Layout",
    ATTRIBUTES: {
        padding: {},
        container: {
            setter: function (container) {
                if (this._container !== container) {
                    this._domCache = {};
                    this._container = container;
                }
            },
        },
        rendered: { readOnly: true },
        attached: { readOnly: true },
    },
    constructor: function (config) {
        this._regions = new dorado.util.KeyedArray(function (region) {
            return region.control._uniqueId;
        });
        $invokeSuper.call(this, [config]);
        if (config) {
            this.set(config);
        }
    },
    getDom: function () {
        if (!this._dom) {
            this._dom = this.createDom();
        }
        return this._dom;
    },
    getRegionDom: function (region) {
        if (region) {
            return this._domCache[region.id];
        }
    },
    ensureControlInited: function (control, region) {
        if (control._lazyInit) {
            control._lazyInit();
            region.constraint = this.preprocessLayoutConstraint(control._layoutConstraint, control);
        }
    },
    ensureControlsInited: function () {
        if (this._lazyInitControls) {
            let control;
            for (let i = 0, len = this._lazyInitControls.length; i < len; i++) {
                control = this._lazyInitControls[i];
                this.ensureControlInited(control, this.getRegion(control));
            }
            delete this._lazyInitControls;
        }
    },
    refresh: function () {
        if (this._duringRefreshDom) {
            return;
        }
        this._duringRefreshDom = true;
        if (this._attached) {
            let regions = this._regions.items, region, control;
            for (let i = 0, len = regions.length; i < len; i++) {
                region = regions[i];
                control = region.control;
                region.constraint = this.preprocessLayoutConstraint(control._layoutConstraint, control);
            }
            delete this.overflowedDoms;
            this.refreshDom(this.getDom());
            if (this._container) {
                if (this.overflowedDoms) {
                    let layout = this;
                    this._container.bind("onScroll.layout", function () {
                        layout.onScroll();
                    });
                }
                else {
                    this._container.unbind("onScroll.layout");
                }
            }
            this._rendered = true;
        }
        this._duringRefreshDom = false;
    },
    onAttachToDocument: function (containerElement) {
        if (!this._attached) {
            if (this._regions.size === 0) {
                return;
            }
            this._attached = true;
            let dom = this.getDom();
            if (dom.parentNode !== containerElement) {
                containerElement.appendChild(dom);
            }
        }
    },
    onDetachFromDocument: function () {
        if (this._attached) {
            this._attached = false;
            let regions = this._regions.items;
            for (let i = 0, len = regions.length; i < len; i++) {
                regions[i].control.onDetachFromDocument();
            }
        }
    },
    getPreviousRegion: function (region) {
        let regions = this._regions.items;
        let i = regions.indexOf(region);
        for (i--; i >= 0; i--) {
            region = regions[i];
            if (region.constraint !== dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT) {
                return region;
            }
        }
        return null;
    },
    getNextRegion: function (region) {
        let regions = this._regions.items;
        let i = regions.indexOf(region), len = regions.length;
        for (i++; i < len; i++) {
            region = regions[i];
            if (region.constraint !== dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT) {
                return region;
            }
        }
        return null;
    },
    preprocessLayoutConstraint: function (layoutConstraint, control) {
        if (!control._visible && control._hideMode === "display") {
            layoutConstraint = dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT;
        }
        return layoutConstraint || {};
    },
    addControl: function (control) {
        let region = {
            id: dorado.Core.newId(),
            control: control,
            constraint: this.preprocessLayoutConstraint(control._layoutConstraint, control),
        };
        if (control._lazyInit) {
            if (!this._lazyInitControls) {
                this._lazyInitControls = [];
            }
            this._lazyInitControls.push(control);
        }
        this._regions.insert(region);
        control._parentLayout = this;
        if (this.onAddControl) {
            this.onAddControl(control);
        }
    },
    removeControl: function (control) {
        control._parentLayout = null;
        if (this.onRemoveControl) {
            this.onRemoveControl(control);
        }
        let region = this._regions.removeKey(control._uniqueId);
        if (region && region.fakeDom) {
            $fly(region.fakeDom).remove();
        }
    },
    removeAllControls: function () {
        let regions = this._regions.items;
        for (let i = regions.length - 1; i >= 0; i--) {
            this.removeControl(regions[i].control);
        }
    },
    disableRendering: function () {
        this._disableRendering = true;
    },
    enableRendering: function () {
        this._disableRendering = false;
    },
    resetControlDimension: function (region, regionDom, autoWidth, autoHeight) {
        let control = region.control, attrWatcher = control.getAttributeWatcher();
        let oldWidth = control._currentWidth, oldHeight = control._currentHeight;
        if (autoWidth &&
            region.width !== undefined &&
            (!control.ATTRIBUTES.width.independent || control._fixedWidth)) {
            control._realWidth = region.width + (region.autoWidthAdjust || 0);
        }
        if (autoHeight &&
            region.height !== undefined &&
            (!control.ATTRIBUTES.height.independent || control._fixedHeight)) {
            control._realHeight = region.height + (region.autoHeightAdjust || 0);
        }
        if (control._attached &&
            (oldWidth !== control._realWidth || oldHeight !== control._realHeight)) {
            control.refresh();
        }
    },
    renderControl: function (region, regionDom, autoWidth, autoHeight) {
        this.resetControlDimension(region, regionDom, autoWidth, autoHeight);
        let control = region.control;
        if (!control._dom || control._dom.parentNode !== regionDom) {
            this._ignoreControlSizeChange = true;
            if (region.fakeDom) {
                control.replace(region.fakeDom);
                $fly(region.fakeDom).remove();
                delete region.fakeDom;
            }
            else {
                control.render(regionDom);
            }
            this._ignoreControlSizeChange = false;
        }
    },
    getRegion: function (control) {
        return this._regions.get(control._uniqueId);
    },
    refreshControl: function (control) {
        let region = this.getRegion(control);
        if (region) {
            region.constraint = this.preprocessLayoutConstraint(control._layoutConstraint, control);
            let container = this._container, dom = this._dom;
            if (!container || !dom) {
                return;
            }
            if (container.isActualVisible()) {
                this._ignoreControlSizeChange = true;
                if (this.doRefreshRegion) {
                    let currentWidth = dom.offsetWidth, currentHeight = dom.offsetHeight;
                    this.doRefreshRegion(region);
                    if (currentWidth !== dom.offsetWidth ||
                        currentHeight !== dom.offsetHeight) {
                        container.onContentSizeChange();
                    }
                }
                this._ignoreControlSizeChange = false;
            }
            else {
                container.refresh();
            }
        }
    },
    onResize: function () {
        if (!this._attached || this._ignoreControlSizeChange || !this.doOnResize) {
            return;
        }
        this.doOnResize();
    },
    doOnResize: function () {
        if (!this._duringRefreshDom) {
            this.refresh();
        }
    },
    onControlSizeChange: function (control, delay, force) {
        if (this._ignoreControlSizeChange) {
            return;
        }
        dorado.Toolkits.cancelDelayedAction(this, "$notifySizeChangeTimerId");
        let fn = function () {
            let container = this._container, dom = this._dom;
            if (!container || !dom) {
                return;
            }
            let currentWidth, currentHeight;
            if (!force && this.doOnControlSizeChange) {
                currentWidth = dom.offsetWidth;
                currentHeight = dom.offsetHeight;
            }
            if (this.doOnControlSizeChange) {
                this.doOnControlSizeChange(control);
            }
            if (force ||
                currentWidth !== dom.offsetWidth ||
                currentHeight !== dom.offsetHeight) {
                container.onContentSizeChange();
            }
        };
        let region = this.getRegion(control);
        if (region) {
            region.constraint = this.preprocessLayoutConstraint(control._layoutConstraint, control);
            if (delay) {
                dorado.Toolkits.setDelayedAction(this, "$onControlSizeChangeTimerId", fn, 200);
            }
            else {
                fn.call(this);
            }
        }
    },
    getFakeDomOffsetTop: function (fakeDom) {
        return fakeDom.offsetTop;
    },
    onScroll: function () {
        if (!this._lazyRenderChild || !this.overflowedDoms) {
            return;
        }
        dorado.Toolkits.setDelayedAction(this, "$onScrollTimerId", function () {
            let containerDom = this._dom.parentNode, overflowedDoms = this.overflowedDoms;
            for (let i = 0; i < overflowedDoms.length; i++) {
                let fakeDom = overflowedDoms[i];
                if (fakeDom &&
                    this.getFakeDomOffsetTop(fakeDom) <
                        containerDom.scrollTop + containerDom.clientHeight) {
                    this.refresh();
                    break;
                }
            }
        }, 200);
    },
});
dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT = "none";
dorado.widget.layout.NativeLayout = $extend(dorado.widget.layout.Layout, {
    $className: "dorado.widget.layout.NativeLayout",
    _className: "d-native-layout",
    ATTRIBUTES: {
        lazyRenderChild: {},
        container: {
            setter: function (container) {
                if (this._container === container) {
                    return;
                }
                this._domCache = {};
                this._container = container;
            },
        },
        style: {
            setter: function (v) {
                if (typeof v === "string" || !this._style) {
                    this._style = v;
                }
                else {
                    if (v) {
                        dorado.Object.apply(this._style, v);
                    }
                }
            },
        },
    },
    createDom: function () {
        let dom = document.createElement("DIV");
        dom.className = this._className;
        return dom;
    },
    refreshDom: function (dom) {
        $fly(dom).css("padding", this._padding);
        if (this._style) {
            let style = this._style;
            if (typeof this._style === "string") {
                let map = {};
                jQuery.each(style.split(";"), function (i, section) {
                    let v = section.split(":");
                    map[jQuery.trim(v[0])] = jQuery.trim(v[1]);
                });
                style = map;
            }
            $fly(dom).css(style);
            delete this._style;
        }
        let containerDom = this._dom.parentNode;
        let regions = this._regions.items, region, control, overflowed;
        for (let i = 0, len = regions.length; i < len; i++) {
            region = regions[i];
            control = region.control;
            fakeDom = region.fakeDom;
            if (region.constraint === dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT) {
                if (control._dom && control._dom.parentNode !== dom) {
                    dom.appendChild(control._dom);
                }
                else {
                    if (!fakeDom) {
                        region.fakeDom = fakeDom = document.createElement("DIV");
                        fakeDom.style.display = "none";
                        dom.appendChild(fakeDom);
                    }
                }
            }
            else {
                if (!control._rendered) {
                    if (!fakeDom) {
                        if (containerDom &&
                            this._lazyRenderChild &&
                            (overflowed ||
                                containerDom.scrollHeight -
                                    (containerDom.scrollTop + containerDom.clientHeight) >
                                    5)) {
                            region.fakeDom = fakeDom = document.createElement("DIV");
                            let properHeight = control.getRealHeight();
                            if (!properHeight) {
                                properHeight = FAKE_PROPER_HEIGHT;
                            }
                            $fly(fakeDom).css({
                                width: control.getRealWidth(),
                                height: properHeight,
                            });
                            dom.appendChild(fakeDom);
                            if (!this.overflowedDoms) {
                                this.overflowedDoms = [];
                            }
                            this.overflowedDoms.push(fakeDom);
                            overflowed = true;
                        }
                    }
                    else {
                        if (containerDom &&
                            this._lazyRenderChild &&
                            (overflowed ||
                                this.getFakeDomOffsetTop(fakeDom) >
                                    containerDom.scrollTop + containerDom.clientHeight)) {
                            let properHeight = control.getRealHeight();
                            if (!properHeight) {
                                properHeight = FAKE_PROPER_HEIGHT;
                            }
                            $fly(fakeDom).css({
                                width: control.getRealWidth(),
                                height: properHeight,
                            });
                            if (!this.overflowedDoms) {
                                this.overflowedDoms = [];
                            }
                            this.overflowedDoms.push(fakeDom);
                            overflowed = true;
                        }
                    }
                    if (!overflowed) {
                        this.ensureControlInited(control, region);
                    }
                }
            }
            if (!overflowed) {
                this.renderControl(region, dom, false, false);
            }
        }
    },
    onAddControl: function (control) {
        if (!this._attached || this._disableRendering) {
            return;
        }
        this.refresh();
    },
    onRemoveControl: function (control) {
        if (!this._attached) {
            return;
        }
        control.unrender();
    },
    doRefreshRegion: function (region) {
        region.control.refresh();
    },
});
let FAKE_PROPER_HEIGHT = 120;
