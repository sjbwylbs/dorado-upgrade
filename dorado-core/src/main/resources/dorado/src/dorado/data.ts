// @ts-nocheck
/// <reference path="globals.d.ts" />
dorado.DataPipe = $class({
	$className: "dorado.DataPipe",
	runningProcNum: 0,
	shouldFireEvent: true,
	convertIfNecessary: function(data: any, dataTypeRepository: any, dataType: any) {
		let oldFireEvent = dorado.DataUtil.FIRE_ON_ENTITY_LOAD;
		dorado.DataUtil.FIRE_ON_ENTITY_LOAD = this.shouldFireEvent;
		try {
			return dorado.DataUtil.convertIfNecessary(
				data,
				dataTypeRepository,
				dataType,
			);
		} finally {
			dorado.DataUtil.FIRE_ON_ENTITY_LOAD = oldFireEvent;
		}
	},
	get: function() {
		dorado.DataPipe.MONITOR.executionTimes++;
		dorado.DataPipe.MONITOR.syncExecutionTimes++;
		return this.convertIfNecessary(
			this.doGet(),
			this.dataTypeRepository,
			this.dataType,
		);
	},
	getAsync: function(callback: any) {
		dorado.DataPipe.MONITOR.executionTimes++;
		dorado.DataPipe.MONITOR.asyncExecutionTimes++;
		callback = callback || dorado._NULL_FUNCTION;
		let callbacks = this._waitingCallbacks;
		if (callbacks) {
			callbacks.push(callback);
		} else {
			this._waitingCallbacks = callbacks = [callback];
			this.runningProcNum++;
			this.doGetAsync({
				scope: this,
				callback: function(success: any, result: any) {
					if (success) {
						result = this.convertIfNecessary(
							result,
							this.dataTypeRepository,
							this.dataType,
						);
					}
					let errors,
						callbacks = this._waitingCallbacks;
					delete this._waitingCallbacks;
					this.runningProcNum = 0;
					if (callbacks) {
						for (let i = 0; i < callbacks.length; i++) {
							try {
								$callback(callbacks[i], success, result);
							} catch (e) {
								if (errors === undefined) {
									errors = [];
								}
								errors.push(e);
							}
						}
					}
					if (errors) {
						throw errors.length > 1 ? errors : errors[0];
					}
				},
			});
		}
	},
	abort: function(success: any, result: any) {
		let callbacks = this._waitingCallbacks;
		delete this._waitingCallbacks;
		this.runningProcNum = 0;
		if (!callbacks) {
			return;
		}
		let errors;
		for (let i = 0; i < callbacks.length; i++) {
			try {
				$callback(callbacks[i], success, result);
			} catch (e) {
				if (errors === undefined) {
					errors = [];
				}
				errors.push(e);
			}
		}
		if (errors) {
			throw errors.length > 1 ? errors : errors[0];
		}
	},
});
dorado.DataPipe.MONITOR = {
	executionTimes: 0,
	asyncExecutionTimes: 0,
	syncExecutionTimes: 0,
};
(function() {
	dorado.DataProvider = $class({
		$className: "dorado.DataProvider",
		supportsEntity: true,
		shouldFireEvent: true,
		constructor: function(id: any) {
			this.id = id;
			this.name = dorado.DataUtil.extractNameFromId(id);
		},
		getAjaxOptions: function(arg: any) {
			let jsonData = {
				action: "load-data",
				dataProvider: this.id,
				supportsEntity: this.supportsEntity,
			};
			if (arg) {
				jsonData.parameter = arg.parameter;
				jsonData.sysParameter = arg.sysParameter;
				if (arg.dataType) {
					let dataType = arg.dataType;
					if (dataType instanceof dorado.DataType) {
						dataType = dataType.get("id");
					} else {
						if (typeof dataType === "string") {
							dataType = dataType;
						} else {
							dataType = dataType.id;
						}
					}
					jsonData.resultDataType = dataType;
				}
				jsonData.pageSize = arg.pageSize;
				jsonData.pageNo = arg.pageNo;
				jsonData.context = arg.view ? arg.view.get("context") : null;
			}
			if (this.supportsEntity && this.dataTypeRepository) {
				jsonData.loadedDataTypes = this.dataTypeRepository.getLoadedDataTypes();
			}
			return dorado.Object.apply(
				{ jsonData: jsonData },
				$setting["ajax.dataProviderOptions"],
			);
		},
		convertEntity: function(data: any, dataTypeRepository: any, dataType: any, ajaxOptions: any) {
			if (data == null) {
				return data;
			}
			let oldFireEvent = dorado.DataUtil.FIRE_ON_ENTITY_LOAD;
			dorado.DataUtil.FIRE_ON_ENTITY_LOAD = this.shouldFireEvent;
			try {
				data = dorado.DataUtil.convertIfNecessary(
					data,
					dataTypeRepository,
					dataType,
				);
			} finally {
				dorado.DataUtil.FIRE_ON_ENTITY_LOAD = oldFireEvent;
			}
			if (data instanceof dorado.EntityList) {
				data.dataProvider = this;
				data.parameter = ajaxOptions.jsonData.parameter;
				data.sysParameter = ajaxOptions.jsonData.sysParameter;
				data.pageSize = ajaxOptions.jsonData.pageSize;
			} else {
				if (data instanceof dorado.Entity) {
					data.dataProvider = this;
					data.parameter = ajaxOptions.jsonData.parameter;
					data.sysParameter = ajaxOptions.jsonData.sysParameter;
				}
			}
			return data;
		},
		getResult: function(arg: any) {
			let ajaxOptions = this.getAjaxOptions(arg),
				ajax = dorado.util.AjaxEngine.getInstance(ajaxOptions);
			let result = ajax.requestSync(ajaxOptions);
			if (result.success) {
				let json = result.getJsonData(),
					data;
				if (json && (json.$dataTypeDefinitions || json.$context)) {
					data = json.data;
					if (json.$dataTypeDefinitions) {
						this.dataTypeRepository.parseJsonData(json.$dataTypeDefinitions);
					}
					if (json.$context && arg && arg.view) {
						let context = arg.view.get("context");
						context.put(json.$context);
					}
				} else {
					data = json;
				}
				if (data && this.supportsEntity) {
					data = this.convertEntity(
						data,
						this.dataTypeRepository,
						this.dataType,
						ajaxOptions,
					);
				}
				return data;
			} else {
				throw result.exception;
			}
		},
		getResultAsync: function(arg: any, callback: any) {
			let ajaxOptions = this.getAjaxOptions(arg),
				ajax = dorado.util.AjaxEngine.getInstance(ajaxOptions);
			let dataType = this.dataType,
				supportsEntity = this.supportsEntity,
				dataTypeRepository = this.dataTypeRepository;
			let message = this.message;
			if (message == null) {
				message = ajaxOptions.message;
			}
			if (message === undefined) {
				message = $resource("dorado.data.DataProviderTaskIndicator");
			}
			if (message) {
				ajaxOptions.message = message;
			}
			ajax.request(ajaxOptions, {
				scope: this,
				callback: function(success: any, result: any) {
					if (success) {
						let json = result.getJsonData(),
							data;
						if (json && (json.$dataTypeDefinitions || json.$context)) {
							data = json.data;
							if (json.$dataTypeDefinitions) {
								this.dataTypeRepository.parseJsonData(
									json.$dataTypeDefinitions,
								);
							}
							if (json.$context && arg && arg.view) {
								let context = arg.view.get("context");
								context.put(json.$context);
							}
						} else {
							data = json;
						}
						if (data && supportsEntity) {
							data = this.convertEntity(
								data,
								dataTypeRepository,
								dataType,
								ajaxOptions,
							);
						}
						$callback(callback, true, data, { scope: this });
					} else {
						$callback(callback, false, result.exception, { scope: this });
					}
				},
			});
		},
	});
	dorado.AjaxDataProvider = $extend(dorado.DataProvider, {
		$className: "dorado.AjaxDataProvider",
		constructor: function(options: any) {
			if (typeof options === "string") {
				options = { url: options };
			}
			this._baseOptions = options || {};
		},
		getAjaxOptions: function(arg: any) {
			let options = dorado.Object.apply({}, this._baseOptions),
				jsonData = (options.jsonData = {});
			if (this._baseOptions.jsonData) {
				dorado.Object.apply(jsonData, this._baseOptions.jsonData);
			}
			if (arg) {
				jsonData.parameter = arg.parameter;
				jsonData.sysParameter = arg.sysParameter;
				jsonData.pageSize = arg.pageSize;
				jsonData.pageNo = arg.pageNo;
			}
			return options;
		},
	});
	let dataProviders = {};
	dorado.DataProvider.create = function(id: any) {
		let provider = dataProviders[id];
		if (provider === undefined) {
			dataProviders[id] = provider = new dorado.DataProvider(id);
		}
		return provider;
	};
	dorado.DataProviderPipe = $extend(dorado.DataPipe, {
		$className: "dorado.DataProviderPipe",
		getDataProvider: function() {
			return this.dataProvider;
		},
		doGet: function() {
			return this.doGetAsync();
		},
		doGetAsync: function(callback: any) {
			let dataProvider = this.getDataProvider();
			if (dataProvider) {
				let dataProviderArg = this.getDataProviderArg();
				dataProvider.dataTypeRepository = this.dataTypeRepository;
				dataProvider.dataType = this.dataType;
				dataProvider.shouldFireEvent = this.shouldFireEvent;
				if (callback) {
					dataProvider.getResultAsync(dataProviderArg, callback);
				} else {
					return dataProvider.getResult(dataProviderArg);
				}
			} else {
				if (callback) {
					$callback(callback, true, null);
				} else {
					return null;
				}
			}
		},
	});
})();
(function() {
	dorado.DataResolver = $class({
		$className: "dorado.DataResolver",
		supportsEntity: true,
		constructor: function(id: any) {
			this.id = id;
			this.name = dorado.DataUtil.extractNameFromId(id);
		},
		getAjaxOptions: function(arg: any) {
			let jsonData = {
				action: "resolve-data",
				dataResolver: this.id,
				supportsEntity: this.supportsEntity,
			};
			if (arg) {
				jsonData.dataItems = arg.dataItems;
				jsonData.parameter = arg.parameter;
				jsonData.sysParameter = arg.sysParameter;
				jsonData.context = arg.view ? arg.view.get("context") : null;
			}
			if (this.supportsEntity && this.dataTypeRepository) {
				jsonData.loadedDataTypes = this.dataTypeRepository.getLoadedDataTypes();
			}
			return dorado.Object.apply(
				{ jsonData: jsonData },
				$setting["ajax.dataResolverOptions"],
			);
		},
		resolve: function(arg: any) {
			let ajaxOptions = this.getAjaxOptions(arg),
				ajax = dorado.util.AjaxEngine.getInstance(ajaxOptions);
			let result = ajax.requestSync(ajaxOptions);
			if (result.success) {
				let result = result.getJsonData(),
					returnValue = result ? result.returnValue : null;
				if (
					returnValue &&
					(returnValue.$dataTypeDefinitions || returnValue.$context)
				) {
					if (returnValue.$dataTypeDefinitions) {
						this.dataTypeRepository.parseJsonData(
							returnValue.$dataTypeDefinitions,
						);
					}
					if (returnValue.$context && arg && arg.view) {
						let context = arg.view.get("context");
						context.put(returnValue.$context);
					}
					returnValue = returnValue.data;
				}
				if (returnValue && this.supportsEntity) {
					returnValue = dorado.DataUtil.convertIfNecessary(
						returnValue,
						this.dataTypeRepository,
					);
				}
				return { returnValue: returnValue, entityStates: result.entityStates };
			} else {
				throw result.exception;
			}
		},
		resolveAsync: function(arg: any, callback: any) {
			let ajaxOptions = this.getAjaxOptions(arg),
				supportsEntity = this.supportsEntity,
				ajax = dorado.util.AjaxEngine.getInstance(ajaxOptions);
			let message = this.message;
			if (message == null) {
				message = ajaxOptions.message;
			}
			if (message === undefined) {
				message = $resource("dorado.data.DataResolverTaskIndicator");
			}
			if (message) {
				ajaxOptions.message = message;
			}
			if (ajaxOptions.modal == null) {
				ajaxOptions.modal = this.modal;
			}
			ajax.request(ajaxOptions, {
				scope: this,
				callback: function(success: any, result: any) {
					if (success) {
						let result = result.getJsonData(),
							returnValue = result ? result.returnValue : null;
						if (
							returnValue &&
							(returnValue.$dataTypeDefinitions || returnValue.$context)
						) {
							if (returnValue.$dataTypeDefinitions) {
								this.dataTypeRepository.parseJsonData(
									returnValue.$dataTypeDefinitions,
								);
							}
							if (returnValue.$context && arg && arg.view) {
								let context = arg.view.get("context");
								context.put(returnValue.$context);
							}
							returnValue = returnValue.data;
						}
						if (returnValue && supportsEntity) {
							returnValue = dorado.DataUtil.convertIfNecessary(
								returnValue,
								this.dataTypeRepository,
							);
						}
						$callback(
							callback,
							true,
							{ returnValue: returnValue, entityStates: result.entityStates },
							{ scope: this },
						);
					} else {
						$callback(callback, false, result.exception, { scope: this });
					}
				},
			});
		},
	});
	dorado.AjaxDataResolver = $extend(dorado.DataResolver, {
		$className: "dorado.AjaxDataResolver",
		constructor: function(options: any) {
			if (typeof options === "string") {
				options = { url: options };
			}
			this._baseOptions = options || {};
		},
		getAjaxOptions: function(arg: any) {
			let options = dorado.Object.apply({}, this._baseOptions),
				jsonData = (options.jsonData = {});
			if (this._baseOptions.jsonData) {
				dorado.Object.apply(jsonData, this._baseOptions.jsonData);
			}
			jsonData.action = "resolve-data";
			jsonData.dataResolver = this.name;
			if (arg) {
				jsonData.dataItems = arg.dataItems;
				jsonData.parameter = arg.parameter;
				jsonData.sysParameter = arg.sysParameter;
				jsonData.context = arg.view ? arg.view.get("context") : null;
			}
			return options;
		},
	});
	let dataResolvers = {};
	dorado.DataResolver.create = function(id: any) {
		let resolver = dataResolvers[id];
		if (resolver === undefined) {
			dataResolvers[id] = resolver = new dorado.DataResolver(id);
		}
		return resolver;
	};
})();
(function() {
	dorado.DataType = $extend(dorado.AttributeSupport, {
		$className: "dorado.DataType",
		ATTRIBUTES: {
			name: { readOnly: true },
			id: { writeOnce: true },
			dataTypeRepository: { readOnly: true },
			view: { path: "_dataTypeRepository._view" },
			userData: { skipRefresh: true },
		},
		constructor: function(config: any) {
			dorado.AttributeSupport.prototype.constructor.call(this, config);
			let name;
			if (config && config.constructor === String) {
				name = config;
				config = null;
			} else {
				if (config) {
					name = config.name;
					delete config.name;
					this.set(config, {
						tryNextOnError: true,
						skipUnknownAttribute: true,
					});
				}
			}
			this._name = name ? name : dorado.Core.newId();
			if (!this._id) {
				this._id = this._name;
			}
			if (this.id) {
				if (window[this.id] === undefined) {
					window[this.id] = this;
				} else {
					let v = window[this.id];
					if (v instanceof Array) {
						v.push(this);
					} else {
						window[this.id] = [v, this];
					}
				}
			}
		},
		setDataTypeRepository: function(dataTypeRepository: any) {
			this._dataTypeRepository = dataTypeRepository;
			if (this._processLiveBinding && dataTypeRepository) {
				let view = dataTypeRepository._view;
				if (view && view !== $topView && !this._liveBindingProcessed) {
					this._processLiveBinding(view);
				}
			}
		},
		getListenerScope: function() {
			return this.get("view");
		},
		toText: function(data: any, argument: any) {
			if (typeof argument === "string" && argument.indexOf("call:") === 0) {
				let func = argument.substring(5);
				func = window[func];
				if (typeof func === "function") {
					return func(data);
				}
			}
			return this.doToText.apply(this, arguments);
		},
		doToText: function(data: any, argument: any) {
			if (
				data == null ||
				data === undefined ||
				(typeof data !== "string" && typeof data !== "object" && isNaN(data))
			) {
				return "";
			} else {
				return data + "";
			}
		},
	});
	dorado.DataType.getSubName = function(name: any) {
		let complexDataTypeNameRegex = /^[\w\/.$:@#\-|]*\[[\w\/\[\]\..$:@#\-|]*\]$/;
		return name.match(complexDataTypeNameRegex)
			? name.substring(name.indexOf("[") + 1, name.length - 1)
			: null;
	};
	dorado.AggregationDataType = $extend(dorado.DataType, {
		$className: "dorado.AggregationDataType",
		ATTRIBUTES: {
			elementDataType: {
				getter: function() {
					return this.getElementDataType("always");
				},
				writeOnce: true,
			},
			pageSize: { defaultValue: 0 },
		},
		constructor: function(config: any, elementDataType: any) {
			dorado.DataType.prototype.constructor.call(this, config, elementDataType);
			if (elementDataType) {
				this._elementDataType = elementDataType;
			}
		},
		getElementDataType: function(loadMode: any) {
			let dataType = this._elementDataType;
			if (dataType != null) {
				dataType = dorado.LazyLoadDataType.dataTypeTranslator.call(
					this,
					dataType,
					loadMode,
				);
				if (dataType instanceof dorado.DataType) {
					this._elementDataType = dataType;
				}
			}
			return dataType;
		},
		parse: function(data: any) {
			if (data != null) {
				let elementDataType = this.getElementDataType("always");
				if (elementDataType && elementDataType._code) {
					let array = [];
					if (!(data instanceof Array)) {
						data = [data];
					}
					for (let i = 0; i < data.length; i++) {
						array.push(elementDataType.parse(data[i]));
					}
					return array;
				} else {
					return data instanceof dorado.EntityList
						? data
						: new dorado.EntityList(data, this._dataTypeRepository, this);
				}
			} else {
				return null;
			}
		},
	});
	dorado.EntityDataType = $extend([dorado.DataType, dorado.EventSupport], {
		$className: "dorado.EntityDataType",
		ATTRIBUTES: {
			acceptUnknownProperty: {},
			defaultDisplayProperty: {},
			acceptValidationState: { defaultValue: "ok" },
			validatorsDisabled: {},
			propertyDefs: {
				setter: function(value: any) {
					this.removeAllPropertyDef();
					if (value) {
						for (let i = 0; i < value.length; i++) {
							this.addPropertyDef(value[i]);
						}
					}
				},
			},
		},
		EVENTS: {
			beforeCurrentChange: {},
			onCurrentChange: {},
			beforeInsert: {},
			onInsert: {},
			beforeRemove: {},
			onRemove: {},
			beforeDataChange: {},
			onDataChange: {},
			beforeStateChange: {},
			onStateChange: {},
			onEntityLoad: {},
			onMessageChange: {},
			onEntityToText: {},
		},
		constructor: function(config: any) {
			this._observers = {};
			this._propertyDefs = new dorado.util.KeyedArray(function(propertyDef: any) {
				return propertyDef._name;
			});
			dorado.DataType.prototype.constructor.call(this, config);
		},
		_addObserver: function(observer: any) {
			let key = observer._uniqueId;
			if (!key) {
				observer._uniqueId = key = dorado.Core.newId();
			}
			if (!this._observers[key]) {
				this._observers[key] = observer;
			}
		},
		_removeObserver: function(observer: any) {
			let key = observer._uniqueId;
			if (!key) {
				return;
			}
			delete this._observers[key];
		},
		doGet: function(attr: any) {
			let c = attr.charAt(0);
			if (c === "#" || c === "&") {
				return this.getPropertyDef(attr.substring(1));
			} else {
				return dorado.DataType.prototype.doGet.call(this, attr);
			}
		},
		fireEvent: function() {
			let view = this.get("view"),
				oldView = window.view;
			window.view = view;
			try {
				return $invokeSuper.call(this, arguments);
			} finally {
				window.view = oldView;
			}
		},
		addPropertyDef: function(propertyDef: any) {
			if (propertyDef instanceof dorado.PropertyDef) {
				if (propertyDef._parent) {
					let parent = propertyDef._parent;
					if (parent.getPropertyDef(propertyDef._name) === propertyDef) {
						parent._propertyDefs.remove(propertyDef);
					}
				}
			} else {
				propertyDef = dorado.Toolkits.createInstance(
					"propertydef",
					propertyDef,
				);
			}
			propertyDef._parent = this;
			this._propertyDefs.append(propertyDef);
			if (this._wrapperType) {
				this.updateWrapperType();
			}
			return propertyDef;
		},
		removePropertyDef: function(propertyDef: any) {
			propertyDef._parent = null;
			this._propertyDefs.remove(propertyDef);
		},
		removeAllPropertyDef: function() {
			if (this._propertyDefs.size === 0) {
				return;
			}
			this._propertyDefs.each(function(propertyDef: any) {
				propertyDef._parent = null;
			});
			this._propertyDefs.clear();
		},
		getPropertyDef: function(name: any) {
			return this._propertyDefs.get(name);
		},
		parse: function(data: any) {
			if (data != null) {
				if (data instanceof dorado.Entity) {
					return data;
				} else {
					let oldProcessDefaultValue = SHOULD_PROCESS_DEFAULT_VALUE;
					SHOULD_PROCESS_DEFAULT_VALUE = false;
					let entity = new dorado.Entity(data, this._dataTypeRepository, this);
					SHOULD_PROCESS_DEFAULT_VALUE = oldProcessDefaultValue;
					return entity;
				}
			} else {
				return null;
			}
		},
		extend: function(config: any) {
			if (typeof config === "string") {
				config = { name: config };
			} else {
				config = config || {};
			}
			let self = this;
			jQuery(["acceptUnknownProperty", "tag"]).each(function(i: any, p: any) {
				if (config[p] === undefined) {
					config[p] = self.get(p);
				}
			});
			let newDataType = new this.constructor(config);
			newDataType._events = dorado.Core.clone(this._events);
			this._propertyDefs.each(function(pd: any) {
				newDataType.addPropertyDef(dorado.Core.clone(pd));
			});
			return newDataType;
		},
		_processLiveBinding: function(view: any) {
			if (view) {
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
									} else {
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
									this.set(
										liveSetting.attr,
										liveSetting.value,
										liveSetting.options,
									);
								}
							}
						}
					}
				}
			}
			this._liveBindingProcessed = true;
		},
		updateWrapperType: function() {
			let wrapperType = this._wrapperType,
				wrapperPrototype = wrapperType.prototype;
			this._propertyDefs.each(function(pd: any) {
				let name = pd._name;
				if (wrapperType._definedProperties[name]) {
					return;
				}
				wrapperType._definedProperties[name] = true;
				let getter = function() {
					let value;
					if (this._textMode) {
						value = this._entity._data[name];
						if (value && typeof value === "object" && !(value instanceof Date)) {
							value = this._entity.get(name);
						} else {
							value = this._entity.getText(name);
						}
					} else {
						value = this._entity.get(name);
					}
					if (
						value instanceof dorado.Entity ||
						value instanceof dorado.EntityList
					) {
						value = value.getWrapper(this._options);
					}
					return value;
				};
				let setter = function(value: any) {
					if (this._readOnly) {
						throw new dorado.Exception("Wrapper is readOnly.");
					}
					this._entity.set(name, value);
				};
				try {
					wrapperPrototype.__defineGetter__(name, getter);
					wrapperPrototype.__defineSetter__(name, setter);
				} catch (e) {
					Object.defineProperty(wrapperPrototype, name, {
						get: getter,
						set: setter,
					});
				}
			});
		},
		getWrapperType: function() {
			if (!this._wrapperType) {
				this._wrapperType = function(entity: any, options: any) {
					this._entity = entity;
					this._options = options;
					this._textMode = options && options.textMode;
					this._readOnly = options && options.readOnly;
				};
				this._wrapperType._definedProperties = {};
				this.updateWrapperType();
			}
			return this._wrapperType;
		},
	});
	dorado.datatype = {};
	let DataType = dorado.DataType;
	DataType.STRING = 1;
	DataType.PRIMITIVE_INT = 2;
	DataType.INTEGER = 3;
	DataType.PRIMITIVE_FLOAT = 4;
	DataType.FLOAT = 5;
	DataType.PRIMITIVE_BOOLEAN = 6;
	DataType.BOOLEAN = 7;
	DataType.DATE = 8;
	DataType.TIME = 9;
	DataType.DATETIME = 10;
	DataType.PRIMITIVE_CHAR = 11;
	DataType.CHARACTER = 12;
	dorado.datatype.StringDataType = $extend(DataType, {
		$className: "dorado.datatype.StringDataType",
		_code: DataType.STRING,
		parse: function(data: any, argument: any) {
			return data == null ? null : data + "";
		},
		doToText: function(data: any, argument: any) {
			return data == null ? "" : data + "";
		},
	});
	dorado.$String = new dorado.datatype.StringDataType("String");
	$parseFloat = dorado.util.Common.parseFloat;
	$parseInt = function(s: any) {
		let n = Math.round($parseFloat(s));
		if (n > 9007199254740991) {
			throw new dorado.ResourceException("dorado.data.ErrorNumberOutOfRangeG");
		} else {
			if (n < -9007199254740991) {
				throw new dorado.ResourceException(
					"dorado.data.ErrorNumberOutOfRangeL",
				);
			}
		}
		return n;
	};
	$formatFloat = dorado.util.Common.formatFloat;
	dorado.datatype.PrimitiveIntDataType = $extend(DataType, {
		$className: "dorado.datatype.PrimitiveIntDataType",
		_code: DataType.PRIMITIVE_INT,
		parse: function(data: any, argument: any) {
			let n = $parseInt(data);
			return isNaN(n) ? 0 : n;
		},
		doToText: $formatFloat,
	});
	dorado.$int = new dorado.datatype.PrimitiveIntDataType("int");
	dorado.datatype.IntegerDataType = $extend(DataType, {
		$className: "dorado.datatype.IntegerDataType",
		_code: DataType.INTEGER,
		parse: function(data: any, argument: any) {
			let n = $parseInt(data);
			return isNaN(n) ? null : n;
		},
		doToText: $formatFloat,
	});
	dorado.$Integer = new dorado.datatype.IntegerDataType("Integer");
	dorado.datatype.PrimitiveFloatDataType = $extend(DataType, {
		$className: "dorado.datatype.PrimitiveFloatDataType",
		_code: DataType.PRIMITIVE_FLOAT,
		parse: function(data: any, argument: any) {
			let n = $parseFloat(data);
			return isNaN(n) ? 0 : n;
		},
		doToText: $formatFloat,
	});
	dorado.$float = new dorado.datatype.PrimitiveFloatDataType("float");
	dorado.datatype.FloatDataType = $extend(DataType, {
		$className: "dorado.datatype.FloatDataType",
		_code: DataType.FLOAT,
		parse: function(data: any, argument: any) {
			let n = $parseFloat(data);
			return isNaN(n) ? null : n;
		},
		doToText: $formatFloat,
	});
	dorado.$Float = new dorado.datatype.FloatDataType("Float");
	function parseBoolean(data: any, argument: any) {
		if (argument == null) {
			if (data == null) {
				return false;
			}
			if (data.constructor === String) {
				return data.toLowerCase() === "true";
			} else {
				return !!data;
			}
		} else {
			return data === argument;
		}
	}
	dorado.datatype.PrimitiveBooleanDataType = $extend(DataType, {
		$className: "dorado.datatype.PrimitiveBooleanDataType",
		_code: DataType.PRIMITIVE_BOOLEAN,
		parse: parseBoolean,
	});
	dorado.$boolean = new dorado.datatype.PrimitiveBooleanDataType("boolean");
	dorado.datatype.BooleanDataType = $extend(DataType, {
		$className: "dorado.datatype.BooleanDataType",
		_code: DataType.BOOLEAN,
		parse: function(data: any, argument: any) {
			if (data === undefined || data == null) {
				return null;
			}
			return parseBoolean(data, argument);
		},
	});
	dorado.$Boolean = new dorado.datatype.BooleanDataType("Boolean");
	dorado.datatype.DateDataType = $extend(DataType, {
		$className: "dorado.datatype.DateDataType",
		_code: DataType.DATE,
		parse: function(data: any, argument: any) {
			if (data == null) {
				return null;
			}
			if (typeof data === "string") {
				data = jQuery.trim(data);
			}
			if (data === "") {
				return null;
			}
			if (data instanceof Date) {
				return data;
			}
			if (typeof data === "number") {
				let date = new Date(data);
				if (!isNaN(date.getTime())) {
					return date;
				} else {
					date = null;
				}
			}
			if (typeof data === "string") {
				let format = argument || $setting["common.defaultDateFormat"];
				let date = Date.parseDate(data, format);
				if (date == null) {
					date = Date.parseDate(data, "Y-m-d\\TH:i:s\\Z");
					if (date == null) {
						format = $setting["common.defaultTimeFormat"];
						if (format) {
							date = Date.parseDate(data, format);
							if (date == null) {
								let format = $setting["common.defaultDateTimeFormat"];
								if (format) {
									date = Date.parseDate(data, format);
								}
							}
						}
					}
				}
			}
			if (date == null) {
				throw new dorado.ResourceException("dorado.data.BadDateFormat", data);
			}
			return date;
		},
		doToText: function(data: any, argument: any) {
			return data != null && data instanceof Date
				? data.formatDate(
						argument || $setting["common.defaultDisplayDateFormat"],
					)
				: "";
		},
	});
	dorado.$Date = new dorado.datatype.DateDataType("Date");
	let time = (dorado.$Time = new dorado.datatype.DateDataType("Time"));
	time._code = DataType.TIME;
	time.doToText = function(data: any, argument: any) {
		return data != null && data instanceof Date
			? data.formatDate(argument || $setting["common.defaultDisplayTimeFormat"])
			: "";
	};
	let datetime = (dorado.$DateTime = new dorado.datatype.DateDataType(
		"DateTime",
	));
	datetime._code = DataType.DATETIME;
	datetime.doToText = function(data: any, argument: any) {
		return data != null && data instanceof Date
			? data.formatDate(
					argument || $setting["common.defaultDisplayDateTimeFormat"],
				)
			: "";
	};
	dorado.datatype.PrimitiveCharDataType = $extend(DataType, {
		$className: "dorado.datatype.PrimitiveCharDataType",
		_code: DataType.PRIMITIVE_CHAR,
		parse: function(data: any, argument: any) {
			let s = data == null ? "\x00" : data + "\x00";
			return s.charAt(0);
		},
	});
	dorado.$char = new dorado.datatype.PrimitiveCharDataType("char");
	dorado.datatype.CharacterDataType = $extend(DataType, {
		$className: "dorado.datatype.CharacterDataType",
		_code: DataType.CHARACTER,
		parse: function(data: any, argument: any) {
			let s = data == null ? "" : data + "";
			return s.length > 0 ? s.charAt(0) : null;
		},
	});
	dorado.$Character = new dorado.datatype.CharacterDataType("Character");
})();
(function() {
	let hasRespositoryListener = false;
	function newAggDataType(name: any, subId: any) {
		let dataType = new AggregationDataType(
			name,
			dorado.LazyLoadDataType.create(this, subId),
		);
		this.register(dataType);
		return dataType;
	}
	dorado.LazyLoadDataType = $class({
		$className: "dorado.LazyLoadDataType",
		constructor: function(dataTypeRepository: any, id: any) {
			this.dataTypeRepository = dataTypeRepository;
			this.id = id;
		},
		get: function(loadMode: any) {
			return this.dataTypeRepository.get(this.id, loadMode);
		},
		getAsync: function(loadMode: any, callback: any) {
			this.dataTypeRepository.getAsync(this.id, callback, loadMode);
		},
		toString: function() {
			return dorado.defaultToString(this);
		},
	});
	dorado.LazyLoadDataType.create = function(dataTypeRepository: any, id: any) {
		let name = dorado.DataUtil.extractNameFromId(id);
		let origin = dataTypeRepository._get(name);
		if (origin instanceof dorado.DataType) {
			return origin;
		} else {
			if (origin && origin !== DataTypeRepository.UNLOAD_DATATYPE) {
				return dataTypeRepository.get(name);
			} else {
				let subId = dorado.DataType.getSubName(id);
				if (subId) {
					let aggDataType = newAggDataType.call(
						dataTypeRepository,
						name,
						subId,
					);
					aggDataType.set("id", id);
					return aggDataType;
				} else {
					dataTypeRepository.register(name);
					return new dorado.LazyLoadDataType(dataTypeRepository, id);
				}
			}
		}
	};
	dorado.LazyLoadDataType.dataTypeTranslator = function(dataType: any, loadMode: any) {
		if (dataType.constructor === String) {
			let repository;
			if (this.getDataTypeRepository) {
				repository = this.getDataTypeRepository();
			} else {
				if (this.ATTRIBUTES && this.ATTRIBUTES.dataTypeRepository) {
					repository = this.get("dataTypeRepository");
				}
			}
			if (!repository) {
				repository = dorado.DataTypeRepository.ROOT;
			}
			if (repository) {
				dataType = dorado.LazyLoadDataType.create(repository, dataType);
			} else {
				throw new dorado.ResourceException("dorado.data.RepositoryUndefined");
			}
		}
		loadMode = loadMode || "always";
		if (loadMode === "always") {
			if (dataType instanceof dorado.AggregationDataType) {
				dataType.getElementDataType();
			} else {
				if (dataType instanceof dorado.LazyLoadDataType) {
					dataType = dataType.get();
				}
			}
		} else {
			if (loadMode === "auto") {
				if (dataType instanceof dorado.AggregationDataType) {
					dataType.getElementDataType();
				} else {
					if (dataType instanceof dorado.LazyLoadDataType) {
						dataType.getAsync();
					}
				}
			}
		}
		if (!(dataType instanceof dorado.DataType)) {
			dataType = null;
		}
		return dataType;
	};
	dorado.LazyLoadDataType.dataTypeGetter = function() {
		let dataType = this._dataType;
		if (dataType != null) {
			dataType = dorado.LazyLoadDataType.dataTypeTranslator.call(
				this,
				dataType,
			);
			if (this._dataType !== dataType && dataType instanceof dorado.DataType) {
				this._dataType = dataType;
			}
		}
		return dataType;
	};
	dorado.DataTypePipe = $extend(dorado.DataPipe, {
		constructor: function(dataTypeRepository: any, id: any) {
			this.dataTypeRepository = dataTypeRepository || $dataTypeRepository;
			this.loadOptions = dataTypeRepository.loadOptions;
			this.id = id;
			this.name = dorado.DataUtil.extractNameFromId(id);
		},
		getAjaxOptions: function() {
			let dataTypeRepository = this.dataTypeRepository;
			return dorado.Object.apply(
				{
					jsonData: {
						action: "load-datatype",
						dataType: [this.id],
						context: dataTypeRepository._view
							? dataTypeRepository._view.get("context")
							: null,
					},
				},
				this.loadOptions,
			);
		},
		doGet: function() {
			return this.doGetAsync();
		},
		doGetAsync: function(callback: any) {
			let ajax = dorado.util.AjaxEngine.getInstance(this.loadOptions),
				dataTypeRepository = this.dataTypeRepository;
			if (callback) {
				dataTypeRepository.register(this.name, this);
				ajax.request(this.getAjaxOptions(), {
					scope: this,
					callback: function(success: any, result: any) {
						if (success) {
							let json = result.getJsonData(),
								dataTypeJson,
								context;
							if (json.$context) {
								dataTypeJson = json.data;
								context = json.$context;
							} else {
								dataTypeJson = json;
							}
							if (dataTypeRepository.parseJsonData(dataTypeJson) > 0) {
								let dataType = dataTypeRepository._dataTypeMap[this.name];
								$callback(callback, true, dataType, { scope: this });
							}
							if (context && dataTypeRepository._view) {
								let context = dataTypeRepository._view.get("context");
								context.put(context);
							}
						} else {
							$callback(callback, false, result.error, { scope: this });
						}
					},
				});
			} else {
				dataTypeRepository.unregister(this.name);
				let result = ajax.requestSync(this.getAjaxOptions());
				let jsonData = result.getJsonData(),
					dataType;
				if (jsonData && dataTypeRepository.parseJsonData(jsonData) > 0) {
					dataType = dataTypeRepository._dataTypeMap[this.name];
				}
				if (!dataType) {
					throw new dorado.ResourceException(
						"dorado.data.DataTypeLoadFailed",
						this.name,
					);
				}
				return dataType;
			}
		},
	});
	dorado.DataTypeRepository = DataTypeRepository = $extend(
		dorado.EventSupport,
		{
			$className: "dorado.DataTypeRepository",
			EVENTS: {
				onDataTypeRegister: {
					interceptor: function(superFire: any, self: any, arg: any) {
						let retval = superFire(self, arg);
						if (retval !== false) {
							for (let i = 0; i < this.children.length; i++) {
								this.children[i].fireEvent(self, arg);
							}
						}
						return retval;
					},
				},
			},
			constructor: function(parent: any) {
				this._dataTypeMap = {};
				this.parent = parent;
				if (parent) {
					parent.children.push(this);
				}
				this.children = [];
				this.loadOptions = dorado.Object.apply(
					{},
					$setting["ajax.dataTypeRepositoryOptions"],
				);
			},
			destroy: function() {
				if (this.parent) {
					this.parent.children.remove(this);
				}
			},
			bind: function() {
				hasRespositoryListener = true;
				return $invokeSuper.call(this, arguments);
			},
			parseSingleDataType: function(jsonData: any) {
				let dataType,
					name = jsonData.name,
					type = jsonData.$type;
				delete jsonData.name;
				delete jsonData.$type;
				if (type === "Aggregation") {
					dataType = new dorado.AggregationDataType(name);
				} else {
					dataType = new dorado.EntityDataType(name);
				}
				if (dataType) {
					dataType.loadFromServer = true;
					dataType._dataTypeRepository = this;
					dataType.set(jsonData, {
						tryNextOnError: true,
						skipUnknownAttribute: true,
					});
				}
				return dataType;
			},
			parseJsonData: function(jsonData: any) {
				let n = 0,
					dataTypeMap = this._dataTypeMap,
					dataType;
				if (jsonData instanceof Array) {
					n = jsonData.length;
					for (let i = 0; i < n; i++) {
						this.register(this.parseSingleDataType(jsonData[i]));
					}
				} else {
					this.register(this.parseSingleDataType(jsonData));
					n++;
				}
				return n;
			},
			register: function(name: any, dataType: any) {
				if (name.constructor === String) {
					dataType = dataType || DataTypeRepository.UNLOAD_DATATYPE;
				} else {
					dataType = name;
					name = name._name;
				}
				if (this._dataTypeMap[name] instanceof dorado.DataType) {
					return;
				}
				this._dataTypeMap[name] = dataType;
				if (dataType instanceof dorado.DataType) {
					dataType.setDataTypeRepository(this);
					if (hasRespositoryListener) {
						this.fireEvent("onDataTypeRegister", this, { dataType: dataType });
					}
				}
			},
			unregister: function(name: any) {
				delete this._dataTypeMap[name];
			},
			_get: function(name: any) {
				let dataType = this._dataTypeMap[name];
				if (dataType && dataType._config) {
					let config = dataType._config;
					delete dataType._config;
					dataType.set(config, {
						tryNextOnError: true,
						skipUnknownAttribute: true,
					});
				}
				if (!dataType && this.parent) {
					dataType = this.parent._get(name);
				}
				return dataType;
			},
			get: function(name: any, loadMode: any) {
				let id = name;
				name = dorado.DataUtil.extractNameFromId(id);
				let dataType = this._get(name);
				if (dataType === DataTypeRepository.UNLOAD_DATATYPE) {
					let subId = dorado.DataType.getSubName(id);
					if (subId) {
						dataType = newAggDataType.call(this, name, subId);
						dataType.set("id", id);
					} else {
						loadMode = loadMode || "always";
						if (loadMode === "always") {
							let pipe = new dorado.DataTypePipe(this, id);
							dataType = pipe.get();
						} else {
							if (loadMode === "auto") {
								this.getAsync(id);
							}
							dataType = null;
						}
					}
				} else {
					if (dataType instanceof dorado.DataTypePipe) {
						let pipe = dataType;
						if (loadMode === "always") {
							dataType = pipe.get(callback);
						} else {
							dataType = null;
						}
					} else {
						if (!dataType) {
							let subId = dorado.DataType.getSubName(id);
							if (subId) {
								dataType = newAggDataType.call(this, name, subId);
								dataType.set("id", id);
							}
						}
					}
				}
				return dataType;
			},
			getAsync: function(name: any, callback: any, loadMode: any) {
				let id = name;
				name = dorado.DataUtil.extractNameFromId(id);
				let dataType = this._get(name);
				if (dataType === DataTypeRepository.UNLOAD_DATATYPE) {
					let subId = dorado.DataType.getSubName(id);
					if (subId) {
						dataType = newAggDataType.call(this, name, subId);
						dataType.set("id", id);
					} else {
						loadMode = loadMode || "always";
						if (loadMode !== "never") {
							let pipe = new dorado.DataTypePipe(this, id);
							pipe.getAsync(callback);
							return;
						}
					}
				} else {
					if (dataType instanceof dorado.DataTypePipe) {
						let pipe = dataType;
						if (loadMode !== "never") {
							pipe.getAsync(callback);
							return;
						}
					} else {
						if (!dataType) {
							let subId = dorado.DataType.getSubName(id);
							if (subId) {
								dataType = newAggDataType.call(this, name, subId);
								dataType.set("id", id);
							}
						}
					}
				}
				$callback(callback, true, dataType);
			},
			getLoadedDataTypes: function() {
				function collect(dataTypeRepository: any, nameMap: any) {
					let map = dataTypeRepository._dataTypeMap;
					for (let name in map) {
						let dt = map[name];
						if (
							dt.loadFromServer &&
							!(dt instanceof dorado.AggregationDataType)
						) {
							nameMap[name] = true;
						}
					}
					if (dataTypeRepository.parent) {
						collect(dataTypeRepository.parent, nameMap);
					}
				}
				let nameMap = {},
					result = [];
				collect(this, nameMap);
				for (let name in nameMap) {
					result.push(name);
				}
				return result;
			},
		},
	);
	let DataType = dorado.DataType;
	let root = new DataTypeRepository();
	DataTypeRepository.ROOT = root;
	DataTypeRepository.UNLOAD_DATATYPE = {};
	window.$dataTypeRepository = DataTypeRepository.ROOT;
	function cloneDataType(dataType: any, name: any) {
		let newDataType = dorado.Object.clone(dataType);
		newDataType._name = name;
		return newDataType;
	}
	root.register(dorado.$String);
	root.register("UUID", cloneDataType(dorado.$String, "UUID"));
	root.register(dorado.$char);
	root.register(dorado.$Character);
	dataType = dorado.$int;
	root.register("int", dataType);
	root.register("byte", cloneDataType(dataType, "byte"));
	root.register("short", cloneDataType(dataType, "short"));
	root.register("long", cloneDataType(dataType, "long"));
	dataType = dorado.$Integer;
	root.register("Integer", dataType);
	root.register("Byte", cloneDataType(dataType, "Byte"));
	root.register("Short", cloneDataType(dataType, "Short"));
	root.register("Long", cloneDataType(dataType, "Long"));
	dataType = dorado.$float;
	root.register("float", dataType);
	root.register("double", cloneDataType(dataType, "double"));
	dataType = dorado.$Float;
	root.register("Float", dataType);
	root.register("Double", cloneDataType(dataType, "Double"));
	root.register("BigDecimal", cloneDataType(dataType, "BigDecimal"));
	root.register(dorado.$boolean);
	root.register(dorado.$Boolean);
	dataType = dorado.$Date;
	root.register("Date", dataType);
	root.register("Calendar", cloneDataType(dataType, "Calendar"));
	root.register("Time", dorado.$Time);
	root.register("DateTime", dorado.$DateTime);
	let AggregationDataType = dorado.AggregationDataType;
	root.register(new AggregationDataType("List"));
	root.register(new AggregationDataType("Set"));
	root.register(new AggregationDataType("Array"));
	let EntityDataType = dorado.EntityDataType;
	root.register(new EntityDataType("Bean"));
	root.register(new EntityDataType("Map"));
	root.register(new EntityDataType("Entity"));
})();
(function() {
	dorado.PropertyDef = $extend([dorado.AttributeSupport, dorado.EventSupport], {
		$className: "dorado.PropertyDef",
		ATTRIBUTES: {
			name: { readOnly: true },
			parent: { readOnly: true },
			view: { path: "parent.view" },
			dataType: {
				getter: dorado.LazyLoadDataType.dataTypeGetter,
				writeOnce: true,
			},
			label: {
				notifyObservers: true,
				getter: function() {
					let label = this._label;
					if (label == null) {
						label = this._name;
					}
					return label;
				},
			},
			description: {},
			readOnly: { notifyObservers: true },
			visible: { defaultValue: true },
			typeFormat: {},
			displayFormat: {},
			mapping: {
				setter: function(mapping: any) {
					this._mapping = mapping;
					if (mapping && mapping.length > 0) {
						let index = (this._mappingIndex = {});
						for (let i = 0; i < mapping.length; i++) {
							let key = mapping[i].key;
							if (key == null) {
								key = "${null}";
							} else {
								if (key === "") {
									key = "${empty}";
								}
							}
							index[key + ""] = mapping[i].value;
						}
					} else {
						delete this._mappingIndex;
					}
					delete this._mappingRevIndex;
				},
			},
			acceptUnknownMapKey: {},
			submittable: { defaultValue: true },
			required: { notifyObservers: true },
			defaultValue: {},
			validators: {
				setter: function(value: any) {
					let validators = [];
					for (let i = 0; i < value.length; i++) {
						let v = value[i];
						if (!(v instanceof dorado.validator.Validator)) {
							v = dorado.Toolkits.createInstance("validator", v);
						}
						if (v._propertyDef) {
							throw new dorado.Exception(
								'Validator alreay belongs to another PropertyDef "' +
									v._propertyDef._name +
									'".',
							);
						}
						v._propertyDef = this;
						validators.push(v);
					}
					this._validators = validators;
				},
			},
			dataTypeRepository: {
				getter: function(attr: any) {
					let parent = this.get("parent");
					return parent ? parent.get(attr) : null;
				},
				readOnly: true,
			},
			userData: { skipRefresh: true },
		},
		EVENTS: { onGet: {}, onGetText: {}, onSet: {} },
		constructor: function(name: any, dataType: any) {
			dorado.AttributeSupport.prototype.constructor.call(this, name, dataType);
			if (name) {
				if (name.constructor === String) {
					this._name = name;
					this._dataType = dataType;
				} else {
					this._name = name.name;
					delete name.name;
					this.set(name);
				}
			}
		},
		doSet: function(attr: any, value: any, skipUnknownAttribute: any, lockWritingTimes: any) {
			dorado.AttributeSupport.prototype.doSet.call(
				this,
				attr,
				value,
				skipUnknownAttribute,
				lockWritingTimes,
			);
			if (this._parent) {
				let def = this.ATTRIBUTES[attr];
				if (def && def.notifyObservers) {
					let observers = this._parent._observers,
						observer;
					for (let key in observers) {
						observer = observers[key];
						if (observer.notifyObservers) {
							if (dorado.Browser.msie && dorado.Browser.version < 9) {
								observer.notifyObservers();
							} else {
								dorado.Toolkits.setDelayedAction(
									observer,
									"$refreshDelayTimerId",
									observer.notifyObservers,
									0,
								);
							}
						}
					}
				}
			}
		},
		doGet: function(attr: any) {
			let c = attr.charAt(0);
			if (c === "#" || c === "&") {
				let validatorName = attr.substring(1);
				return this.getValidator(validatorName);
			} else {
				return dorado.AttributeSupport.prototype.doGet.call(this, attr);
			}
		},
		getListenerScope: function() {
			return this.get("view");
		},
		fireEvent: function() {
			let view = this.get("view"),
				oldView = window.view;
			window.view = view;
			try {
				return $invokeSuper.call(this, arguments);
			} finally {
				window.view = oldView;
			}
		},
		getDataType: function(loadMode: any) {
			return dorado.LazyLoadDataType.dataTypeGetter.call(this, loadMode);
		},
		getMappedValue: function(key: any) {
			if (key == null) {
				key = "${null}";
			} else {
				if (key === "") {
					key = "${empty}";
				}
			}
			return this._mappingIndex ? this._mappingIndex[key + ""] : undefined;
		},
		getMappedKey: function(value: any) {
			if (!this._mappingRevIndex) {
				let index = (this._mappingRevIndex = {}),
					mapping = this._mapping;
				for (let i = 0; i < mapping.length; i++) {
					let v = mapping[i].value;
					if (v == null) {
						v = "${null}";
					} else {
						if (v === "") {
							v = "${empty}";
						}
					}
					index[v + ""] = mapping[i].key;
				}
			}
			if (value == null) {
				value = "${null}";
			} else {
				if (value === "") {
					value = "${empty}";
				}
			}
			return this._mappingRevIndex[value + ""];
		},
		getValidator: function(name: any) {
			if (!this._validators) {
				return null;
			}
			for (let i = 0; i < this._validators.length; i++) {
				let validator = this._validators[i];
				if (validator._name === name) {
					return validator;
				}
			}
		},
	});
	dorado.BasePropertyDef = $extend(dorado.PropertyDef, {
		$className: "dorado.BasePropertyDef",
		ATTRIBUTES: { key: {} },
	});
	dorado.ReferenceDataPipe = $extend(dorado.DataProviderPipe, {
		$className: "dorado.ReferenceDataPipe",
		shouldFireEvent: false,
		constructor: function(propertyDef: any, entity: any) {
			this.propertyDef = propertyDef;
			this.entity = entity;
			this.dataType = propertyDef._dataType;
			let parent = propertyDef.get("parent");
			this.dataTypeRepository =
				(parent ? parent.get("dataTypeRepository") : null) ||
				$dataTypeRepository;
			this.view = this.dataTypeRepository
				? this.dataTypeRepository._view
				: null;
		},
		getDataProviderArg: function() {
			let propertyDef = this.propertyDef;
			dorado.$this = this.entity;
			return {
				pageSize: propertyDef._pageSize,
				parameter: dorado.JSON.evaluate(propertyDef._parameter),
				sysParameter: propertyDef._sysParameter
					? propertyDef._sysParameter.toJSON()
					: undefined,
				dataType: this.dataType,
				view: this.view,
			};
		},
		getDataProvider: function() {
			return this.propertyDef._dataProvider;
		},
	});
	dorado.Reference = $extend(dorado.PropertyDef, {
		$className: "dorado.Reference",
		ATTRIBUTES: {
			dataProvider: {},
			parameter: {
				setter: function(parameter: any) {
					if (
						this._parameter instanceof dorado.util.Map &&
						parameter instanceof dorado.util.Map
					) {
						this._parameter.put(parameter);
					} else {
						this._parameter = parameter;
					}
				},
			},
			pageSize: {},
			activeOnNewEntity: {},
		},
		EVENTS: { beforeLoadData: {}, onLoadData: {} },
		getDataPipe: function(entity: any) {
			if (this._dataProvider) {
				return new dorado.ReferenceDataPipe(this, entity);
			} else {
				return null;
			}
		},
	});
	dorado.Toolkits.registerPrototype("propertydef", {
		Default: dorado.BasePropertyDef,
		Reference: dorado.Reference,
	});
})();
let SHOULD_PROCESS_DEFAULT_VALUE = true;
(function() {
	let DEFAULT_VALIDATION_RESULT_STATE = "error";
	let STATE_CODE = dorado.Toolkits.STATE_CODE;
	let VALIDATION_RESULT_CODE = { ok: 0, invalid: 1, executing: 2 };
	function addMessage2Context(context: any, entity: any, property: any, message: any) {
		let state = message.state || "error";
		context[state].push({
			entity: entity,
			property: property,
			state: message.state,
			text: message.text,
		});
	}
	function addMessages2Context(context: any, entity: any, property: any, messages: any) {
		for (let i = 0; i < messages.length; i++) {
			addMessage2Context(context, entity, property, messages[i]);
		}
	}
	function mergeValidationContext(context: any, state: any, subContext: any) {
		let subContextMessages = subContext[state];
		if (!subContextMessages) {
			return;
		}
		for (let i = 0; i < subContextMessages.length; i++) {
			context[state].push(subContextMessages[i]);
		}
	}
	function mergeValidationContexts(context: any, subContext: any) {
		mergeValidationContext(context, "info", subContext);
		mergeValidationContext(context, "ok", subContext);
		mergeValidationContext(context, "warn", subContext);
		mergeValidationContext(context, "error", subContext);
		mergeValidationContext(context, "executing", subContext);
	}
	function doDefineProperty(proto: any, property: any) {
		let getter = function() {
			let value;
			if (this._textMode) {
				value = this._entity._data[property];
				if (value && typeof value === "object" && !(value instanceof Date)) {
					value = this._entity.get(property);
				} else {
					value = this._entity.getText(property);
				}
			} else {
				value = this._entity.get(property);
			}
			if (
				value instanceof dorado.Entity ||
				value instanceof dorado.EntityList
			) {
				value = value.getWrapper(this._options);
			}
			return value;
		};
		let setter = function(value: any) {
			if (this._readOnly) {
				throw new dorado.Exception("Wrapper is readOnly.");
			}
			this._entity.set(property, value);
		};
		try {
			proto.__defineGetter__(property, getter);
			proto.__defineSetter__(property, setter);
		} catch (e) {
			Object.defineProperty(proto, property, { get: getter, set: setter });
		}
	}
	let STATE_NONE = 0;
	dorado.Entity = $class({
		$className: "dorado.Entity",
		constructor: function(data: any, dataTypeRepository: any, dataType: any) {
			this.entityId = dorado.Core.getTimestamp() + "";
			this.timestamp = dorado.Core.getTimestamp();
			this.dataTypeRepository = dataTypeRepository;
			this._propertyInfoMap = {};
			if (data) {
				this._data = data;
				if (dataType == null) {
					if (dataTypeRepository && data.$dataType) {
						dataType = dataTypeRepository.get(data.$dataType);
					}
				} else {
					data.$dataType = dataType._id;
				}
				if (data.$state) {
					this.state = data.$state;
				}
			} else {
				this._data = data = {};
				if (dataType) {
					this._data.$dataType = dataType._id;
				}
			}
			this.dataType = dataType;
			if (dataType) {
				this._propertyDefs = dataType._propertyDefs;
				let pdItems = this._propertyDefs.items;
				for (let i = 0, len = pdItems.length; i < len; i++) {
					let pd = pdItems[i];
					if (
						SHOULD_PROCESS_DEFAULT_VALUE &&
						pd._defaultValue !== undefined &&
						data[pd._name] === undefined
					) {
						data[pd._name] =
							typeof pd._defaultValue === "function"
								? pd._defaultValue.call(this)
								: pd._defaultValue;
					}
					if (data[pd._name] == null) {
						let dataType = pd.get("dataType");
						if (dataType) {
							switch (dataType._code) {
								case dorado.DataType.PRIMITIVE_INT:
								case dorado.DataType.PRIMITIVE_FLOAT:
									data[pd._name] = 0;
									break;
								case dorado.DataType.PRIMITIVE_BOOLEAN:
									data[pd._name] = false;
									break;
							}
						}
					}
				}
			} else {
				this._propertyDefs = null;
			}
			if (this.acceptUnknownProperty == null) {
				this.acceptUnknownProperty = dataType
					? dataType._acceptUnknownProperty
					: true;
			}
		},
		state: STATE_NONE,
		_observer: null,
		_disableObserversCounter: 0,
		_messages: null,
		_setObserver: function(observer: any) {
			if (this._observer && this.dataType) {
				this.dataType._removeObserver(this._observer);
			}
			this._observer = observer;
			if (this.dataType && observer) {
				this.dataType._addObserver(observer);
			}
			let data = this._data;
			for (p in data) {
				if (data.hasOwnProperty(p)) {
					let v = data[p];
					if (v == null) {
						continue;
					}
					if (v instanceof dorado.Entity || v instanceof dorado.EntityList) {
						v._setObserver(observer);
					}
				}
			}
		},
		disableObservers: function() {
			this._disableObserversCounter++;
		},
		enableObservers: function() {
			if (this._disableObserversCounter > 0) {
				this._disableObserversCounter--;
			}
		},
		notifyObservers: function() {
			this.sendMessage(0);
		},
		sendMessage: function(messageCode: any, arg: any) {
			if (this._disableObserversCounter === 0 && this._observer) {
				this._observer.entityMessageReceived(messageCode, arg);
			}
		},
		setState: function(state: any) {
			if (this.state === state) {
				return;
			}
			let eventArg = {
				entity: this,
				oldState: this.state,
				newState: state,
				processDefault: true,
			};
			let dataType = this.dataType;
			if (dataType && !this.disableEvents) {
				dataType.fireEvent("beforeStateChange", dataType, eventArg);
			}
			if (!eventArg.processDefault) {
				return;
			}
			if (
				this.state === dorado.Entity.STATE_NONE &&
				(state === dorado.Entity.STATE_MODIFIED ||
					state === dorado.Entity.STATE_MOVED)
			) {
				this.storeOldData();
			}
			this.state = state;
			this.timestamp = dorado.Core.getTimestamp();
			let entityList = this.parent;
			if (entityList && entityList instanceof dorado.EntityList) {
				let page = this.page;
				if (eventArg.oldState === dorado.Entity.STATE_DELETED) {
					entityList.changeEntityCount(page, 1);
				} else {
					if (eventArg.newState === dorado.Entity.STATE_DELETED) {
						entityList.changeEntityCount(page, -1);
					}
				}
			}
			if (dataType && !this.disableEvents) {
				dataType.fireEvent("onStateChange", dataType, eventArg);
			}
			this.sendMessage(dorado.Entity._MESSAGE_ENTITY_STATE_CHANGED, eventArg);
		},
		_get: function(property: any, propertyDef: any, callback: any, loadMode: any) {
			function transferAndReplaceIf(entity: any, propertyDef: any, value: any, replaceValue: any) {
				if (
					value &&
					typeof (
						value instanceof dorado.Entity || value instanceof dorado.EntityList
					) &&
					value.parent === entity
				) {
					return value;
				}
				let dataType = propertyDef.get("dataType");
				if (dataType == null) {
					return value;
				}
				let originValue = value;
				value = dataType.parse(originValue, propertyDef.get("typeFormat"));
				replaceValue =
					replaceValue &&
					(value instanceof dorado.Entity ||
						value instanceof dorado.EntityList) &&
					value.parent !== entity;
				if (
					(value instanceof dorado.Entity ||
						value instanceof dorado.EntityList) &&
					value.parent !== this
				) {
					value.parent = entity;
					value.timestamp = dorado.Core.getTimestamp();
					value.parentProperty = property;
					value._setObserver(entity._observer);
				}
				if (replaceValue) {
					let oldValue = entity._data[propertyDef._name];
					if (oldValue !== value) {
						if (oldValue && oldValue.isDataPipeWrapper) {
							oldValue = oldValue.value;
						}
						if (
							oldValue instanceof dorado.Entity ||
							oldValue instanceof dorado.EntityList
						) {
							oldValue.parent = null;
							oldValue.timestamp = dorado.Core.getTimestamp();
							oldValue._setObserver(null);
						}
						entity._data[propertyDef._name] = value;
					}
					let eventArg = {};
					if (value instanceof dorado.Entity) {
						eventArg.entity = value;
						dataType.fireEvent("onEntityLoad", dataType, eventArg);
					} else {
						if (value instanceof dorado.EntityList) {
							let elementDataType = dataType.get("elementDataType");
							if (elementDataType) {
								for (let it = value.iterator(); it.hasNext(); ) {
									eventArg.entity = it.next();
									elementDataType.fireEvent("onEntityLoad", dataType, eventArg);
								}
							}
						}
					}
				}
				return value;
			}
			let value = this._data[property],
				invokeCallback = true;
			if (value === undefined) {
				if (propertyDef) {
					let dataPipeWrapper = null;
					if (loadMode !== "never" && propertyDef.getDataPipe) {
						let pipe;
						if (propertyDef instanceof dorado.Reference) {
							if (
								this.state !== dorado.Entity.STATE_NEW ||
								propertyDef._activeOnNewEntity
							) {
								pipe = propertyDef.getDataPipe(this);
							}
						} else {
							pipe = propertyDef.getDataPipe(this);
						}
						if (pipe) {
							let eventArg = { entity: this, property: property, pageNo: 1 };
							propertyDef.fireEvent("beforeLoadData", propertyDef, eventArg);
							if (eventArg.processDefault === false) {
								if (callback) {
									$callback(callback, false);
								}
								return;
							}
							if (callback || loadMode === "auto") {
								let isNewPipe = pipe.runningProcNum === 0;
								pipe.getAsync({
									scope: this,
									callback: function(success: any, result: any) {
										let dummyData = this._data[property],
											dummyValue;
										if (dummyData.isDataPipeWrapper) {
											dummyValue = dummyData.value;
										}
										this._data[property] = dummyValue || null;
										if (isNewPipe) {
											this.sendMessage(
												dorado.Entity._MESSAGE_LOADING_END,
												eventArg,
											);
										}
										if (success) {
											eventArg.data = result;
											if (isNewPipe) {
												if (
													result == null &&
													(dummyValue instanceof dorado.EntityList ||
														dummyValue instanceof dorado.Entity) &&
													dummyValue.isNull
												) {
													if (dummyData.isDataPipeWrapper) {
														result = this._data[property];
													}
												} else {
													result = transferAndReplaceIf(
														this,
														propertyDef,
														result,
														true,
													);
												}
												propertyDef.fireEvent(
													"onLoadData",
													propertyDef,
													eventArg,
												);
											}
											this.sendMessage(dorado.Entity._MESSAGE_DATA_CHANGED, {
												entity: this,
												property: property,
												newValue: result,
											});
											if (propertyDef.getListenerCount("onGet")) {
												eventArg = { entity: this, value: result };
												propertyDef.fireEvent("onGet", propertyDef, eventArg);
												result = eventArg.value;
											}
										} else {
											if (isNewPipe) {
												this._data[property] = null;
											}
										}
										if (callback) {
											$callback(callback, success, result);
										}
									},
								});
								this._data[property] = dataPipeWrapper = {
									isDataPipeWrapper: true,
									pipe: pipe,
								};
								if (isNewPipe) {
									this.sendMessage(
										dorado.Entity._MESSAGE_LOADING_START,
										eventArg,
									);
								}
								invokeCallback = false;
							} else {
								value = pipe.get();
								value = transferAndReplaceIf(this, propertyDef, value, true);
								eventArg.data = value;
								propertyDef.fireEvent("onLoadData", propertyDef, eventArg);
							}
						}
					}
					if (
						(value === undefined || value == null) &&
						dorado.Entity.ALWAYS_RETURN_VALID_ENTITY_LIST
					) {
						let pdt = propertyDef.get("dataType");
						if (pdt instanceof dorado.AggregationDataType) {
							value = transferAndReplaceIf(this, propertyDef, [], false);
							value.isNull = true;
							if (dataPipeWrapper) {
								dataPipeWrapper.value = value;
							} else {
								if (loadMode !== "never") {
									this._data[property] = value;
								}
							}
						}
					}
				}
			} else {
				if (value != null && value.isDataPipeWrapper) {
					let pipe = value.pipe;
					if (loadMode !== "never") {
						if (loadMode === "auto" || callback) {
							pipe.getAsync(callback);
							value = undefined;
							invokeCallback = false;
						} else {
							let shouldAbortAsyncProcedures =
								dorado.Setting["common.abortAsyncLoadingOnSyncLoading"];
							if (pipe.runningProcNum > 0 && !shouldAbortAsyncProcedures) {
								throw new dorado.ResourceException(
									"dorado.data.GetDataDuringLoading",
									"Entity",
								);
							}
							try {
								value = pipe.get();
								pipe.abort(true, value);
							} catch (e) {
								pipe.abort(false, e);
								throw e;
							}
						}
					}
				} else {
					if (propertyDef) {
						if (value == null) {
							if (dorado.Entity.ALWAYS_RETURN_VALID_ENTITY_LIST) {
								let aggregationDataType = propertyDef.get("dataType");
								if (aggregationDataType instanceof dorado.AggregationDataType) {
									value = transferAndReplaceIf(this, propertyDef, [], false);
									value.isNull = true;
									this._data[property] = value;
								}
							}
						} else {
							value = transferAndReplaceIf(this, propertyDef, value, true);
						}
					}
				}
			}
			if (propertyDef && propertyDef.getListenerCount("onGet")) {
				eventArg = { entity: this, value: value };
				propertyDef.fireEvent("onGet", propertyDef, eventArg);
				value = eventArg.value;
			}
			if (invokeCallback && callback) {
				$callback(callback, true, value);
			}
			return value;
		},
		getPropertyDef: function(property: any) {
			let propertyDef = null;
			if (this._propertyDefs) {
				propertyDef = this._propertyDefs.get(property);
				if (!propertyDef && !this.acceptUnknownProperty) {
					throw new dorado.ResourceException(
						"dorado.data.UnknownProperty",
						property,
					);
				}
			}
			return propertyDef;
		},
		get: function(property: any, loadMode: any) {
			loadMode = loadMode || "always";
			let result;
			if (this.ignorePropertyPath) {
				let propertyDef = this.getPropertyDef(property);
				result = this._get(property, propertyDef, null, loadMode);
			} else {
				let properties = property.split(".");
				for (let i = 0; i < properties.length; i++) {
					property = properties[i];
					if (i === 0) {
						let propertyDef = this.getPropertyDef(property);
						result = this._get(property, propertyDef, null, loadMode);
					} else {
						if (!result) {
							break;
						}
						result =
							result instanceof dorado.Entity
								? result.get(property)
								: result[property];
					}
				}
			}
			return result;
		},
		getAsync: function(property: any, callback: any, loadMode: any) {
			function _getAsync(entity: any, property: any, callback: any, loadMode: any) {
				let i = property.indexOf(".");
				if (i > 0 && !entity.ignorePropertyPath) {
					let p1 = property.substring(0, i);
					let p2 = property.substring(i + 1);
					if (entity instanceof dorado.Entity) {
						entity.getAsync(
							p1,
							{
								callback: function(success: any, result: any) {
									if (success && result && result instanceof Object) {
										_getAsync(result, p2, callback, loadMode);
									} else {
										$callback(callback, success, result);
									}
								},
							},
							loadMode,
						);
					} else {
						let subEntity = entity[p1];
						if (subEntity && subEntity instanceof Object) {
							_getAsync(subEntity, p2, callback, loadMode);
						}
					}
				} else {
					if (entity instanceof dorado.Entity) {
						entity._get(
							property,
							entity.getPropertyDef(property),
							callback,
							loadMode,
						);
					} else {
						let result = entity[property];
						$callback(callback, true, result);
					}
				}
			}
			loadMode = loadMode || "always";
			_getAsync(this, property, callback || dorado._NULL_FUNCTION, loadMode);
		},
		doGetText: function(property: any, callback: any, loadMode: any) {
			function toText(value: any, propertyDef: any) {
				let text;
				if (propertyDef) {
					let dataType = propertyDef.get("dataType");
					text = (dataType || dorado.$String).toText(
						value,
						propertyDef._displayFormat,
					);
					if (text && propertyDef._mapping) {
						text = propertyDef.getMappedValue(text) || "";
					}
				} else {
					text = dorado.$String.toText(value);
				}
				return text;
			}
			let propertyDef = this.getPropertyDef(property);
			if (callback) {
				let entity = this;
				this._get(
					property,
					propertyDef,
					function(value: any) {
						let text = toText(value, propertyDef);
						if (propertyDef && propertyDef.getListenerCount("onGetText")) {
							eventArg = { entity: entity, text: text };
							propertyDef.fireEvent("onGetText", propertyDef, eventArg);
							text = eventArg.text;
						}
						$callback(callback, true, text);
					},
					loadMode,
				);
			} else {
				let value = this._get(property, propertyDef, null, loadMode);
				let text = toText(value, propertyDef);
				if (propertyDef && propertyDef.getListenerCount("onGetText")) {
					eventArg = { entity: this, text: text };
					propertyDef.fireEvent("onGetText", propertyDef, eventArg);
					text = eventArg.text;
				}
				return text;
			}
		},
		getText: function(property: any, loadMode: any) {
			loadMode = loadMode || "always";
			let result;
			if (this.ignorePropertyPath) {
				result = this.doGetText(property, null, loadMode);
			} else {
				let properties = property.split("."),
					result = this;
				for (let i = 0; i < properties.length; i++) {
					property = properties[i];
					if (i === properties.length - 1) {
						result = result.doGetText(property, null, loadMode);
					} else {
						result =
							result instanceof dorado.Entity
								? result.get(property)
								: result[property];
					}
					if (result == null) {
						break;
					}
				}
			}
			return result;
		},
		getTextAsync: function(property: any, callback: any, loadMode: any) {
			function _getTextAsync(entity: any, property: any, callback: any, loadMode: any) {
				let i = property.indexOf(".");
				if (i > 0 && !entity.ignorePropertyPath) {
					let p1 = property.substring(0, i);
					let p2 = property.substring(i + 1);
					if (entity instanceof dorado.Entity) {
						entity.getAsync(
							p1,
							{
								callback: function(success: any, result: any) {
									if (success && result && result instanceof Object) {
										_getTextAsync(result, p2, callback, loadMode);
									} else {
										$callback(callback, success, result);
									}
								},
							},
							loadMode,
						);
					} else {
						let subEntity = entity[p1];
						if (subEntity && subEntity instanceof Object) {
							_getTextAsync(subEntity, p2, callback, loadMode);
						}
					}
				} else {
					if (entity instanceof dorado.Entity) {
						entity.doGetText(property, callback, loadMode);
					} else {
						let result = entity[property];
						$callback(callback, true, result);
					}
				}
			}
			loadMode = loadMode || "always";
			_getTextAsync(
				this,
				property,
				callback || dorado._NULL_FUNCTION,
				loadMode,
			);
		},
		storeOldData: function() {
			if (this._oldData) {
				return;
			}
			let data = this._data,
				oldData = (this._oldData = {});
			for (let p in data) {
				if (data.hasOwnProperty(p)) {
					let value = data[p];
					if (value != null && value.isDataPipeWrapper) {
						continue;
					}
					oldData[p] = value;
				}
			}
		},
		_validateProperty: function (
			dataType,
			propertyDef,
			propertyInfo,
			value,
			preformAsyncValidator,
		) {
			let messages = [],
				property = propertyDef._name,
				validating,
				propertyDataType = propertyDef.get("dataType");
			if (propertyDef._required && !dataType._validatorsDisabled) {
				let hasRequiredValidator = false;
				if (propertyDef._validators) {
					for (let i = 0; i < propertyDef._validators.length; i++) {
						if (
							propertyDef._validators[i] instanceof
							dorado.validator.RequiredValidator
						) {
							hasRequiredValidator = true;
							break;
						}
					}
				}
				if (!hasRequiredValidator) {
					let v = value;
					if (typeof value === "string") {
						v = jQuery.trim(v);
					}
					let blank = false;
					if (v === undefined || v == null || v === "") {
						if (
							propertyDataType &&
							propertyDataType._code === dorado.DataType.STRING
						) {
							blank = !v;
						} else {
							blank = true;
						}
					} else {
						if (
							v instanceof dorado.EntityList &&
							propertyDataType instanceof dorado.AggregationDataType
						) {
							blank = !v.entityCount;
						}
					}
					if (blank) {
						messages.push({
							state: "error",
							text: $resource("dorado.data.ErrorContentRequired"),
						});
					}
				}
			}
			if (
				propertyDef._mapping &&
				value !== undefined &&
				value != null &&
				value !== ""
			) {
				let mappedValue = propertyDef.getMappedValue(value);
				if (!propertyDef._acceptUnknownMapKey && mappedValue === undefined) {
					messages.push({
						state: "error",
						text: $resource("dorado.data.UnknownMapKey", value),
					});
				}
			}
			if (propertyDef._validators && !dataType._validatorsDisabled) {
				let entity = this,
					currentValue = value,
					validateArg = { property: property, entity: entity },
					oldData = this._oldData;
				let valueForValidator = entity.get(property, "never");
				propertyInfo.validating = propertyInfo.validating || 0;
				for (let i = 0; i < propertyDef._validators.length; i++) {
					let validator = propertyDef._validators[i];
					if (
						!validator._revalidateOldValue &&
						oldData &&
						currentValue === oldData[property]
					) {
						continue;
					}
					if (
						validator instanceof dorado.validator.RemoteValidator &&
						validator._async &&
						preformAsyncValidator
					) {
						propertyInfo.validating++;
						validator.validate(valueForValidator, validateArg, {
							callback: function(success: any, result: any) {
								if (propertyInfo.validating <= 0) {
									return;
								}
								propertyInfo.validating--;
								if (propertyInfo.validating <= 0) {
									propertyInfo.validating = 0;
									propertyInfo.validated = true;
								}
								if (success) {
									if (entity._data[property] !== currentValue) {
										return;
									}
									let originMessages = propertyInfo.messages;
									let messages = dorado.Toolkits.trimMessages(
										result,
										DEFAULT_VALIDATION_RESULT_STATE,
									);
									if (originMessages) {
										messages = originMessages.concat(messages);
									}
									entity.doSetMessages(property, messages);
								}
								if (entity._data[property] === currentValue) {
									entity.sendMessage(dorado.Entity._MESSAGE_DATA_CHANGED, {
										entity: entity,
										property: property,
									});
								}
							},
						});
					} else {
						let msgs = validator.validate(valueForValidator, validateArg);
						if (msgs) {
							messages = messages.concat(msgs);
							let state = dorado.Toolkits.getTopMessageState(msgs);
							let acceptState = dataType.get("acceptValidationState");
							if (
								STATE_CODE[state || "info"] > STATE_CODE[acceptState || "ok"]
							) {
								asyncValidateActions = [];
								break;
							}
						}
					}
				}
			}
			this.doSetMessages(property, messages);
			if (!propertyInfo.validating) {
				propertyInfo.validated = true;
			}
			return messages;
		},
		_set: function(property: any, value: any, propertyDef: any) {
			let oldValue = this._data[property];
			if (
				oldValue &&
				oldValue instanceof dorado.Entity &&
				value &&
				!(value instanceof dorado.Entity) &&
				typeof value === "object"
			) {
				oldValue.set(value);
				return;
			}
			let eventArg = {
				entity: this,
				property: property,
				oldValue: oldValue,
				newValue: value,
				processDefault: true,
			};
			let dataType = this.dataType;
			if (
				dataType &&
				!this.disableEvents &&
				dataType.getListenerCount("beforeDataChange")
			) {
				dataType.fireEvent("beforeDataChange", dataType, eventArg);
				value = eventArg.newValue;
			}
			if (!eventArg.processDefault) {
				return;
			}
			if (this.state === dorado.Entity.STATE_NONE) {
				this.storeOldData();
			}
			if (oldValue && oldValue.isDataPipeWrapper) {
				oldValue = oldValue.value;
			}
			if (
				oldValue instanceof dorado.Entity ||
				oldValue instanceof dorado.EntityList
			) {
				oldValue.parent = null;
				oldValue.timestamp = dorado.Core.getTimestamp();
				oldValue._setObserver(null);
			}
			let propertyInfoMap = this._propertyInfoMap,
				propertyInfo = propertyInfoMap[property];
			if (!propertyInfo) {
				propertyInfoMap[property] = propertyInfo = {};
			}
			if (
				value instanceof dorado.Entity ||
				value instanceof dorado.EntityList
			) {
				if (value.parent != null) {
					throw new dorado.ResourceException(
						"dorado.data.ValueNotFree",
						value instanceof dorado.Entity ? "Entity" : "EntityList",
					);
				}
				value.parent = this;
				value.timestamp = dorado.Core.getTimestamp();
				value.parentProperty = property;
				value._setObserver(this._observer);
				propertyInfo.isDirty = true;
			} else {
				let ov = this._oldData ? this._oldData[property] : oldValue;
				propertyInfo.isDirty = ov !== value;
				if (
					value &&
					typeof value === "object" &&
					value.$state === undefined &&
					propertyDef &&
					propertyDef.get("dataType") instanceof dorado.EntityDataType
				) {
					value = dorado.Object.apply(
						{ $state: dorado.Entity.STATE_NEW },
						value,
					);
				}
			}
			eventArg.value = value;
			if (propertyDef && propertyDef.getListenerCount("onSet")) {
				propertyDef.fireEvent("onSet", propertyDef, eventArg);
				value = eventArg.value;
			}
			this._data[property] = value;
			this.timestamp = dorado.Core.getTimestamp();
			if (property.charAt(0) !== "$") {
				let messages;
				if (propertyDef) {
					messages = this._validateProperty(
						dataType,
						propertyDef,
						propertyInfo,
						value,
						true,
					);
				} else {
					messages = null;
				}
				if (!(messages && messages.length) && !propertyInfo.validating) {
					messages = [{ state: "ok" }];
				}
				this.doSetMessages(property, messages);
				if (this.state === dorado.Entity.STATE_NONE) {
					this.setState(dorado.Entity.STATE_MODIFIED);
				}
			}
			if (
				dataType &&
				!this.disableEvents &&
				dataType.getListenerCount("onDataChange")
			) {
				dataType.fireEvent("onDataChange", dataType, eventArg);
			}
			this.sendMessage(dorado.Entity._MESSAGE_DATA_CHANGED, eventArg);
		},
		_dispatchOperationToSubEntity: function(property: any, create: any, method: any, args: any) {
			let i = property.indexOf(".");
			let property1 = property.substring(0, i),
				property2 = property.substring(i + 1);
			let subEntity = this.get(property1);
			if (subEntity == null && create) {
				subEntity = this.createChild(property1);
			}
			if (subEntity != null) {
				return subEntity[method].apply(subEntity, [property2].concat(args));
			}
		},
		set: function(property: any, value: any) {
			function doSet(entity: any, property: any, value: any) {
				if (!entity.ignorePropertyPath && property.indexOf(".") > 0) {
					entity._dispatchOperationToSubEntity(property, true, "set", [value]);
				} else {
					let propertyDef = entity.getPropertyDef(property);
					if (propertyDef) {
						let dataType = propertyDef.get("dataType");
						if (dataType) {
							value = dataType.parse(value, propertyDef._typeFormat);
						}
					}
					entity._set(property, value, propertyDef);
				}
			}
			if (property.constructor !== String) {
				this.disableObservers();
				try {
					for (let p in property) {
						if (property.hasOwnProperty(p)) {
							doSet(this, p, property[p]);
						}
					}
				} finally {
					this.enableObservers();
					this.sendMessage(dorado.Entity._MESSAGE_REFRESH_ENTITY, {
						entity: this,
					});
				}
			} else {
				doSet(this, property, value);
			}
			return this;
		},
		setText: function(property: any, text: any) {
			if (!this.ignorePropertyPath && property.indexOf(".") > 0) {
				this._dispatchOperationToSubEntity(property, true, "setText", [text]);
			} else {
				let propertyDef = this.getPropertyDef(property),
					value = text;
				if (propertyDef) {
					if (propertyDef._mapping && text != null) {
						value = propertyDef.getMappedKey(text);
						if (value === undefined) {
							value = text;
						}
					}
					let dataType = propertyDef.get("dataType");
					if (dataType) {
						value = dataType.parse(value, propertyDef._displayFormat);
					}
				}
				this._set(property, value, propertyDef);
			}
		},
		cancel: function(deep: any) {
			function deepCancel(entity: any) {
				let data = entity._data;
				for (let p in data) {
					if (data.hasOwnProperty(p)) {
						let value = data[p];
						if (
							value &&
							(value instanceof dorado.Entity ||
								value instanceof dorado.EntityList)
						) {
							value.cancel(true);
						}
					}
				}
			}
			if (
				this.state === dorado.Entity.STATE_NEW &&
				this.parent &&
				this.parent instanceof dorado.EntityList
			) {
				this.remove();
			} else {
				if (this.state !== dorado.Entity.STATE_NONE) {
					let data = this._data,
						oldData = this._oldData;
					if (oldData) {
						for (let p in data) {
							if (data.hasOwnProperty(p)) {
								let value = data[p];
								if (value != null && value.isDataPipeWrapper) {
									continue;
								}
								delete data[p];
							}
						}
						for (let p in oldData) {
							if (oldData.hasOwnProperty(p)) {
								data[p] = oldData[p];
							}
						}
					}
					let oldState = this.state;
					if (deep) {
						deepCancel(this);
					}
					if (oldState !== dorado.Entity.STATE_MOVED) {
						this.resetState();
					}
					if (
						oldState === dorado.Entity.STATE_DELETED &&
						this.parent &&
						this.parent instanceof dorado.EntityList
					) {
						let entityList = this.parent;
						if (entityList.current == null) {
							entityList.disableObservers();
							entityList.setCurrent(this);
							entityList.enableObservers();
						}
					}
					this.sendMessage(0);
				} else {
					if (deep) {
						deepCancel(this);
					}
				}
			}
		},
		resetState: function() {
			this._propertyInfoMap = {};
			delete this._messages;
			delete this._messageState;
			this.setState(dorado.Entity.STATE_NONE);
			delete this._oldData;
		},
		reset: function(property: any) {
			let data = this._data;
			if (property) {
				let props = property.split(",");
				for (let i = 0; i < props.length; i++) {
					let prop = props[i];
					if (data[prop] !== undefined) {
						let propertyDef = this._propertyDefs
							? this._propertyDefs.get(prop)
							: null;
						if (propertyDef && propertyDef instanceof dorado.Reference) {
							let oldValue = data[prop];
							if (
								oldValue instanceof dorado.Entity ||
								oldValue instanceof dorado.EntityList
							) {
								oldValue.parent = null;
								oldValue.timestamp = dorado.Core.getTimestamp();
								oldValue._setObserver(null);
							}
							delete data[prop];
						}
					}
					this.doSetMessages(prop, null);
					let propertyInfo = this._propertyInfoMap[prop];
					delete propertyInfo.validating;
					delete propertyInfo.validated;
				}
				this.timestamp = dorado.Core.getTimestamp();
			} else {
				this._propertyDefs.each(function(propertyDef: any) {
					if (propertyDef instanceof dorado.Reference) {
						let oldValue = data[propertyDef._name];
						if (
							oldValue instanceof dorado.Entity ||
							oldValue instanceof dorado.EntityList
						) {
							oldValue.parent = null;
							oldValue.timestamp = dorado.Core.getTimestamp();
							oldValue._setObserver(null);
						}
						delete data[propertyDef._name];
					}
				});
				this._propertyInfoMap = {};
				delete this._messages;
				delete this._messageState;
			}
			this.sendMessage(0);
		},
		createBrother: function(data: any, detached: any) {
			if (data instanceof dorado.Entity) {
				data = data.getData();
			}
			let brother = new dorado.Entity(
				null,
				this.dataTypeRepository,
				this.dataType,
			);
			if (data) {
				brother.set(data);
			}
			if (!detached && this.parent instanceof dorado.EntityList) {
				this.parent.insert(brother);
			}
			return brother;
		},
		createChild: function(property: any, data: any, detached: any) {
			if (data instanceof dorado.Entity) {
				data = data.getData();
			}
			let child = null;
			if (this.dataType) {
				let propertyDef = this.getPropertyDef(property);
				if (!propertyDef) {
					throw new dorado.ResourceException(
						"dorado.data.UnknownProperty",
						property,
					);
				}
				let elementDataType = propertyDef.get("dataType"),
					aggregationDataType;
				if (
					elementDataType &&
					elementDataType instanceof dorado.AggregationDataType
				) {
					aggregationDataType = elementDataType;
					elementDataType = elementDataType.getElementDataType();
				}
				if (
					elementDataType &&
					!(elementDataType instanceof dorado.EntityDataType)
				) {
					throw new ResourceException(
						"dorado.data.EntityPropertyExpected",
						property,
					);
				}
				child = new dorado.Entity(
					null,
					this.dataTypeRepository,
					elementDataType,
				);
				if (data) {
					child.set(data);
				}
				if (!detached) {
					if (aggregationDataType) {
						let list = this._get(property, propertyDef);
						list.insert(child);
					} else {
						this._set(property, child, propertyDef);
					}
				}
			} else {
				child = new dorado.Entity();
				if (data) {
					child.set(data);
				}
				if (!detached) {
					let oldChild = this.get(property);
					if (oldChild instanceof dorado.EntityList) {
						oldChild.insert(child);
					} else {
						if (oldChild instanceof Array) {
							oldChild.push(child);
						} else {
							this.set(property, child);
						}
					}
				}
			}
			return child;
		},
		getPrevious: function() {
			let entityList = this.parent;
			if (!entityList || !(entityList instanceof dorado.EntityList)) {
				return null;
			}
			let page = this.page;
			let entry = page.findEntry(this);
			entry = entityList._findPreviousEntry(entry);
			return entry ? entry.data : null;
		},
		getNext: function() {
			let entityList = this.parent;
			if (!entityList || !(entityList instanceof dorado.EntityList)) {
				return null;
			}
			let page = this.page;
			let entry = page.findEntry(this);
			entry = entityList._findNextEntry(entry);
			return entry ? entry.data : null;
		},
		setCurrent: function(cascade: any) {
			let parentEntity;
			if (this.parent instanceof dorado.EntityList) {
				this.parent.setCurrent(this);
				parentEntity = this.parent.parent;
			} else {
				parentEntity = this.parent;
			}
			if (cascade && parentEntity && parentEntity instanceof dorado.Entity) {
				parentEntity.setCurrent(true);
			}
		},
		clearData: function() {
			let data = this._data;
			for (let property in data) {
				if (!data.hasOwnProperty(property)) {
					continue;
				}
				delete data[property];
			}
			this.timestamp = dorado.Core.getTimestamp();
			this.sendMessage(0);
		},
		fromJSON: function(json: any) {
			if (this.dataType) {
				json.$dataType = this.dataType._id;
			}
			this._data = json;
			delete this._oldData;
			this.state = dorado.Entity.STATE_NONE;
			this.timestamp = dorado.Core.getTimestamp();
			this.sendMessage(0);
		},
		toJSON: function(options: any, context: any) {
			let result = {};
			let includeUnsubmittableProperties,
				includeReferenceProperties,
				simplePropertyOnly,
				generateDataType,
				generateState,
				generateEntityId,
				generateOldData,
				properties,
				entityFilter;
			(includeUnsubmittableProperties = includeReferenceProperties = true),
				(loadMode = "never");
			simplePropertyOnly =
				generateDataType =
				generateState =
				generateEntityId =
				generateOldData =
					false;
			properties = entityFilter = null;
			if (options != null) {
				if (options.includeUnsubmittableProperties === false) {
					includeUnsubmittableProperties = false;
				}
				if (options.includeReferenceProperties === false) {
					includeReferenceProperties = false;
				}
				if (options.loadMode) {
					loadMode = options.loadMode;
				}
				simplePropertyOnly = options.simplePropertyOnly;
				generateDataType = options.generateDataType;
				generateState = options.generateState;
				generateEntityId = options.generateEntityId;
				generateOldData = !!(options.generateOldData && this._oldData);
				properties = options.properties;
				entityFilter = options.entityFilter;
				if (properties != null && properties.length === 0) {
					properties = null;
				}
			}
			let data = this._data,
				oldData = this._oldData,
				oldDataHolder;
			for (let property in data) {
				if (!data.hasOwnProperty(property)) {
					continue;
				}
				if (property.charAt(0) === "$") {
					continue;
				}
				if (properties && properties.indexOf(property) < 0) {
					continue;
				}
				let propertyDef = this._propertyDefs
					? this._propertyDefs.get(property)
					: null;
				if (propertyDef && simplePropertyOnly) {
					let pdt = propertyDef.getDataType("never");
					if (
						pdt &&
						(pdt instanceof dorado.EntityDataType ||
							pdt instanceof dorado.AggregationDataType)
					) {
						continue;
					}
				}
				if (
					!includeUnsubmittableProperties &&
					propertyDef &&
					!propertyDef._submittable
				) {
					continue;
				}
				if (propertyDef instanceof dorado.Reference) {
					if (!includeReferenceProperties) {
						continue;
					}
				}
				let value = this._get(property, propertyDef, null, loadMode);
				if (value != null) {
					if (value instanceof dorado.Entity) {
						if (simplePropertyOnly) {
							continue;
						}
						if (!entityFilter || entityFilter(value)) {
							value = value.toJSON(options, context);
						} else {
							value = null;
						}
					} else {
						if (value instanceof dorado.EntityList) {
							value = value.toJSON(options, context);
						} else {
							if (value instanceof Object && value.isDataPipeWrapper) {
								value = undefined;
							}
						}
					}
				}
				if (generateOldData && propertyDef && oldData != null) {
					if (!oldDataHolder) {
						oldDataHolder = {};
					}
					oldDataHolder[property] = oldData[property];
				}
				result[property] = value;
			}
			if (generateDataType && data.$dataType) {
				result.$dataType = data.$dataType;
			}
			if (generateState && this.state !== dorado.Entity.STATE_NONE) {
				result.$state = this.state;
			}
			if (generateEntityId) {
				result.$entityId = this.entityId;
			}
			if (oldDataHolder) {
				result.$oldData = oldDataHolder;
			}
			if (context && context.entities) {
				context.entities.push(this);
			}
			return result;
		},
		getWrapper: function(options: any) {
			let wrapperType;
			if (this.acceptUnknownProperty) {
				wrapperType = function(entity: any, options: any) {
					this._entity = entity;
					this._options = options;
					this._textMode = options && options.textMode;
					this._readOnly = options && options.readOnly;
				};
				let wrapperPrototype = wrapperType.prototype;
				let data = this._data;
				for (let property in data) {
					if (!data.hasOwnProperty(property)) {
						continue;
					}
					doDefineProperty(wrapperPrototype, property);
				}
			} else {
				wrapperType = this.dataType.getWrapperType();
			}
			return new wrapperType(this, options);
		},
		getData: function() {
			return this._data;
		},
		getOldData: function() {
			return this._oldData;
		},
		getMessages: function(property: any) {
			let results;
			if (property) {
				let obj = this._propertyInfoMap[property];
				results = obj ? obj.messages : null;
			} else {
				results = this._messages;
			}
			return results;
		},
		doSetMessages: function(property: any, messages: any) {
			function getMessageState(entity: any) {
				let state = null,
					stateCode = -1;
				if (entity._messages) {
					state = dorado.Toolkits.getTopMessageState(entity._messages);
					if (state) {
						stateCode = STATE_CODE[state];
					}
				}
				let map = entity._propertyInfoMap;
				for (let p in map) {
					let obj = map[p];
					let code = STATE_CODE[obj.state];
					if (code > stateCode) {
						stateCode = code;
						state = obj.state;
					}
				}
				return state;
			}
			let retval = false;
			if (messages === undefined) {
				messages = property;
				messages = dorado.Toolkits.trimMessages(
					messages,
					DEFAULT_VALIDATION_RESULT_STATE,
				);
				if (this._messages === messages) {
					return false;
				}
				this._messages = messages;
				this._messageState = getMessageState(this);
				retval = true;
			} else {
				let map = this._propertyInfoMap;
				messages = dorado.Toolkits.trimMessages(
					messages,
					DEFAULT_VALIDATION_RESULT_STATE,
				);
				let propertyInfo = map[property];
				if (
					propertyInfo &&
					!propertyInfo.validating &&
					propertyInfo.messages === messages
				) {
					return false;
				}
				let state = dorado.Toolkits.getTopMessageState(messages);
				if (!propertyInfo) {
					map[property] = propertyInfo = {};
				}
				propertyInfo.state = state;
				propertyInfo.messages = messages;
				this._messageState = getMessageState(this);
				retval = true;
			}
			let dataType = this.dataType;
			if (dataType) {
				dataType.fireEvent("onMessageChange", dataType, {
					entity: this,
					property: property,
					messages: messages,
				});
			}
			return retval;
		},
		setMessages: function(property: any, messages: any) {
			let retval = this.doSetMessages(property, messages);
			if (retval) {
				this.timestamp = dorado.Core.getTimestamp();
				if (property) {
					this.sendMessage(dorado.Entity._MESSAGE_DATA_CHANGED, {
						entity: this,
						property: property,
					});
				} else {
					this.sendMessage(0);
				}
			}
			return retval;
		},
		getMessageState: function(property: any) {
			if (property) {
				let map = this._propertyInfoMap;
				return map[property] ? map[property].state : null;
			} else {
				return this._messageState;
			}
		},
		getValidateState: function(property: any) {
			let state = "unvalidate",
				map = this._propertyInfoMap;
			if (map) {
				let propertyInfo = map[property];
				if (propertyInfo) {
					if (propertyInfo.validating) {
						state = "validating";
					} else {
						if (propertyInfo.validated) {
							state = this.getMessageState(property);
							if (!state || state === "info") {
								state = "ok";
							}
						}
					}
				}
			}
			return state;
		},
		validate: function(options: any) {
			if (typeof options === "string") {
				options = { property: options };
			} else {
				if (typeof options === "boolean") {
					options = { force: options };
				}
			}
			let property = options && options.property;
			let force = options && options.force === false ? false : true;
			let simplePropertyOnly =
				options && options.validateSimplePropertyOnly === false ? false : true;
			let preformAsyncValidator = options
				? options.preformAsyncValidator
				: false;
			let context = options ? options.context : null;
			let result,
				topResult,
				resultCode,
				topResultCode = -1,
				hasValidated = false;
			if (force) {
				if (property) {
					delete this._propertyInfoMap[property];
				} else {
					this._propertyInfoMap = {};
					delete this._messages;
					delete this._messageState;
				}
			}
			let dataType = this.dataType,
				propertyInfoMap = this._propertyInfoMap;
			if (context) {
				context.info = [];
				context.ok = [];
				context.warn = [];
				context.error = [];
				context.executing = [];
				context.executingValidationNum = 0;
			}
			if (dataType) {
				let entity = this;
				let doValidate = function(pd: any) {
					let property = pd._name,
						propertyInfo = propertyInfoMap[property];
					if (property.charAt(0) === "$") {
						return;
					}
					if (propertyInfo) {
						if (propertyInfo.validating) {
							if (context) {
								context.executingValidationNum =
									(context.executingValidationNum || 0) +
									propertyInfo.validating;
								let executing = (context.executing = context.executing || []);
								executing.push({
									entity: entity,
									property: property,
									num: propertyInfo.validating,
								});
							}
							return;
						} else {
							if (propertyInfo.validated) {
								if (context && propertyInfo.messages) {
									addMessages2Context(
										context,
										entity,
										property,
										propertyInfo.messages,
									);
								}
								return;
							}
						}
					} else {
						propertyInfoMap[property] = propertyInfo = {};
					}
					let value = entity._data[property];
					hasValidated = true;
					let messages = entity._validateProperty(
						dataType,
						pd,
						propertyInfo,
						value,
						preformAsyncValidator,
					);
					if (context && messages) {
						addMessages2Context(context, entity, property, messages);
					}
				};
				if (property) {
					let pd = this.getPropertyDef(property);
					if (pd) {
						doValidate(pd);
					}
				} else {
					dataType._propertyDefs.each(doValidate);
				}
			}
			if (!simplePropertyOnly) {
				let data = this._data;
				let doValidateEntity = function(p: any) {
					let value = data[p];
					if (value instanceof dorado.Entity) {
						if (context) {
							options.context = {};
						}
						result = value.validate(options);
						if (context) {
							mergeValidationContexts(context, options.context);
							options.context = context;
						}
						resultCode = VALIDATION_RESULT_CODE[result];
						if (resultCode > topResultCode) {
							topResultCode = resultCode;
							topResult = result;
						}
					} else {
						if (value instanceof dorado.EntityList) {
							let it = value.iterator();
							while (it.hasNext()) {
								if (context) {
									options.context = {};
								}
								result = it.next().validate(options);
								if (context) {
									mergeValidationContexts(context, options.context);
									options.context = context;
								}
								resultCode = VALIDATION_RESULT_CODE[result];
								if (resultCode > topResultCode) {
									topResultCode = resultCode;
									topResult = result;
								}
							}
						}
					}
				};
				if (property) {
					doValidateEntity(property);
				} else {
					for (let p in data) {
						if (!data.hasOwnProperty(p) || p.charAt(0) === "$") {
							continue;
						}
						doValidateEntity(p);
					}
				}
			}
			state = this.getMessageState(property);
			let acceptState = dataType ? dataType.get("acceptValidationState") : null;
			if (STATE_CODE[state || "info"] <= STATE_CODE[acceptState || "ok"]) {
				result = "ok";
			} else {
				result = "invalid";
			}
			resultCode = VALIDATION_RESULT_CODE[result];
			if (resultCode > topResultCode) {
				topResultCode = resultCode;
				topResult = result;
			}
			if (context) {
				context.result = topResult;
			}
			if (hasValidated) {
				this.sendMessage(0);
			}
			return topResult;
		},
		isDirty: function(property: any) {
			if (this.state === dorado.Entity.STATE_NONE) {
				return false;
			}
			if (property) {
				let propertyInfo = this._propertyInfoMap[property];
				return propertyInfo ? propertyInfo.isDirty : false;
			} else {
				return this.state !== dorado.Entity.STATE_NONE;
			}
		},
		isCascadeDirty: function() {
			function isDirty(entity: any) {
				let dirty = entity.state !== dorado.Entity.STATE_NONE;
				if (!dirty) {
					let data = entity._data;
					for (let p in data) {
						let v = data[p];
						if (v instanceof dorado.Entity) {
							dirty = isDirty(v);
						} else {
							if (v instanceof dorado.EntityList) {
								let it = v.iterator(true);
								while (it.hasNext()) {
									dirty = isDirty(it.next());
									if (dirty) {
										break;
									}
								}
							}
						}
						if (dirty) {
							break;
						}
					}
				}
				return dirty;
			}
			return isDirty(this);
		},
		flush: function(callback: any) {
			function checkResult(result: any) {
				if (result instanceof Array && result.length > 1) {
					throw new dorado.ResourceException("dorado.data.TooMoreResult");
				}
			}
			if (!this.dataType || !this.dataProvider) {
				throw new dorado.ResourceException("dorado.data.DataProviderUndefined");
			}
			let arg = { parameter: this.parameter },
				oldSupportsEntity = this.dataProvider.supportsEntity;
			this.dataProvider.supportsEntity = false;
			try {
				if (callback) {
					this.dataProvider.getResultAsync(arg, {
						scope: this,
						callback: function(success: any, result: any) {
							if (success) {
								this.fromJSON(result);
							}
							$callback(callback, success, success ? this : result);
						},
					});
				} else {
					let result = this.dataProvider.getResult(arg);
					this.fromJSON(result);
				}
			} finally {
				this.dataProvider.supportsEntity = oldSupportsEntity;
			}
		},
		flushAsync: function(callback: any) {
			this.flush(callback || dorado._NULL_FUNCTION);
		},
		remove: function(detach: any) {
			if (this.parent instanceof dorado.EntityList) {
				this.parent.remove(this, detach);
			}
		},
		toString: function() {
			let text;
			if (this.dataType) {
				let dataType = this.dataType;
				let eventArg = { entity: this, processDefault: true };
				if (
					!this.disableEvents &&
					dataType.getListenerCount("onEntityToText")
				) {
					eventArg.processDefault = false;
					dataType.fireEvent("onEntityToText", dataType, eventArg);
				}
				if (eventArg.processDefault) {
					if (dataType._defaultDisplayProperty) {
						text = this.getText(dataType._defaultDisplayProperty, "never");
					}
					if (text === undefined) {
						text = "Entity@" + this.entityId;
					}
				}
			} else {
				text = "Entity@" + this.entityId;
			}
			return text;
		},
		clone: function(deep: any) {
			let newData,
				data = this._data;
			if (deep) {
				newData = dorado.Core.clone(data, deep);
			} else {
				newData = {};
				for (let attr in data) {
					let v = data[attr];
					if (v instanceof dorado.Entity || v instanceof dorado.EntityList) {
						continue;
					}
					newData[attr] = v;
				}
			}
			return new dorado.Entity(newData, this.dataTypeRepository, this.dataType);
		},
	});
	dorado.Entity.STATE_NONE = STATE_NONE;
	dorado.Entity.STATE_NEW = 1;
	dorado.Entity.STATE_MODIFIED = 2;
	dorado.Entity.STATE_DELETED = 3;
	dorado.Entity.STATE_MOVED = 4;
	dorado.Entity._MESSAGE_DATA_CHANGED = 3;
	dorado.Entity._MESSAGE_ENTITY_STATE_CHANGED = 4;
	dorado.Entity._MESSAGE_REFRESH_ENTITY = 5;
	dorado.Entity._MESSAGE_LOADING_START = 10;
	dorado.Entity._MESSAGE_LOADING_END = 11;
	dorado.Entity.ALWAYS_RETURN_VALID_ENTITY_LIST = true;
	let dummyEntityMap = {};
	dorado.Entity.getDummyEntity = function(pageNo: any) {
		let entity = dummyEntityMap[pageNo];
		if (!entity) {
			dummyEntityMap[pageNo] = entity = new dorado.Entity();
			entity.get = entity.set = dorado._NULL_FUNCTION;
			entity.dummy = true;
			entity.page = { pageNo: pageNo };
		}
		return entity;
	};
})();
(function() {
	dorado.EntityList = $class({
		$className: "dorado.EntityList",
		constructor: function(data: any, dataTypeRepository: any, dataType: any) {
			this.objId = dorado.Core.getTimestamp() + "";
			this.timestamp = dorado.Core.getTimestamp();
			this.dataTypeRepository = dataTypeRepository;
			if (data) {
				if (dataType == null) {
					if (dataTypeRepository && data.$dataType) {
						dataType = dataTypeRepository.get(data.$dataType);
					}
				} else {
					data.$dataType = dataType._id;
				}
			}
			this.dataType = dataType;
			this.elementDataType = dataType ? dataType.getElementDataType() : null;
			this.pageSize = dataType ? dataType._pageSize : 0;
			this.pageNo = 1;
			this.pageCount = 0;
			this.entityCount = 0;
			this._pages = new dorado.util.KeyedList();
			this._keyMap = {};
			if (data != null) {
				this.fromJSON(data);
			}
		},
		_disableObserversCounter: 0,
		_setObserver: function(observer: any) {
			this._observer = observer;
			let it = this.iterator(),
				entity;
			while (it.hasNext()) {
				entity = it.next();
				entity._setObserver(observer);
			}
		},
		disableObservers: dorado.Entity.prototype.disableObservers,
		enableObservers: dorado.Entity.prototype.enableObservers,
		notifyObservers: dorado.Entity.prototype.notifyObservers,
		sendMessage: function(messageCode: any, arg: any) {
			if (this._disableObserversCounter === 0 && this._observer) {
				this._observer.entityMessageReceived(messageCode, arg);
			}
		},
		_findPreviousEntry: function(entry: any, loadPage: any, pageNo: any) {
			let previous = entry ? entry.previous : null,
				pages = this._pages,
				pageEntry;
			while (
				!(previous && previous.data.state !== dorado.Entity.STATE_DELETED)
			) {
				if (!previous) {
					if (!pageEntry) {
						if (entry) {
							pageEntry = pages.findEntry(entry.data.page);
							pageEntry = pageEntry.previous;
						} else {
							pageEntry = pages.last;
						}
					} else {
						pageEntry = pageEntry.previous;
					}
					if (pageEntry) {
						previous = pageEntry.data.last;
					} else {
						break;
					}
				} else {
					previous = previous.previous;
				}
			}
			return previous;
		},
		_findNextEntry: function(entry: any, loadPage: any) {
			let next = entry ? entry.next : null,
				pages = this._pages,
				pageEntry;
			while (!(next && next.data.state !== dorado.Entity.STATE_DELETED)) {
				if (!next) {
					if (!pageEntry) {
						if (entry) {
							pageEntry = pages.findEntry(entry.data.page);
							pageEntry = pageEntry.next;
						} else {
							pageEntry = pages.first;
						}
					} else {
						pageEntry = pageEntry.next;
					}
					if (pageEntry) {
						next = pageEntry.data.first;
					} else {
						break;
					}
				} else {
					next = next.next;
				}
			}
			return next;
		},
		_throwInvalidEntity: function(entity: any) {
			throw new dorado.ResourceException("dorado.data.InvalidEntityToList");
		},
		_throwNoCurrent: function() {
			throw new dorado.ResourceException("dorado.data.NoCurrent");
		},
		isPageLoaded: function(pageNo: any) {
			let page = this._pages.get(pageNo + "");
			return page && page.loaded;
		},
		getPage: function(pageNo: any, loadPage: any, callback: any) {
			function pageLoaded() {
				let entity = this.parent;
				if (entity && entity instanceof dorado.EntityList) {
					let propertyDef = entity.getPropertyDef(this.parentProperty);
					if (propertyDef && propertyDef instanceof dorado.Reference) {
						propertyDef.fireEvent("onLoadData", propertyDef, {
							entity: entity,
							property: this.parentProperty,
							pageNo: pageNo,
						});
					}
				} else {
					if (!entity) {
						let dataSet = this._observer;
						if (
							dataSet &&
							dorado.widget &&
							dorado.widget.DataSet &&
							dataSet instanceof dorado.widget.DataSet
						) {
							dataSet.fireEvent("onLoadData", dataSet, { pageNo: pageNo });
						}
					}
				}
			}
			if (pageNo > 0 && pageNo <= this.pageCount) {
				let page = this._pages.get(pageNo + "");
				if (!page && loadPage) {
					page = new dorado.EntityList.Page(this, pageNo);
					if (!this._pages.size) {
						this._pages.insert(page);
					} else {
						let it = this._pages.iterator(),
							refPage,
							tempPage;
						it.last();
						while (it.hasPrevious()) {
							tempPage = it.previous();
							if (tempPage.page < pageNo) {
								refPage = tempPage;
								break;
							}
						}
						if (refPage) {
							this._pages.insert(page, "after", refPage);
						} else {
							this._pages.insert(page);
						}
					}
				}
				if (page && page.loaded) {
					if (callback) {
						$callback(callback, true, page);
					}
					return page;
				} else {
					if (loadPage) {
						if (this.dataProvider) {
							let pipe = page.loadPagePipe;
							if (!pipe) {
								page.loadPagePipe = pipe = new LoadPagePipe(this, pageNo);
							}
							if (callback) {
								let arg = { entityList: this, pageNo: pageNo };
								let isNewPipe = pipe.runningProcNum === 0;
								pipe.getAsync({
									scope: this,
									callback: function(success: any, result: any) {
										if (isNewPipe) {
											this.sendMessage(dorado.Entity._MESSAGE_LOADING_END, arg);
										}
										if (success && !page.loaded) {
											this._fillPage(page, result, false, true);
											page.loaded = true;
											pageLoaded.call(this);
										}
										$callback(callback, success, success ? page : result);
									},
								});
								if (isNewPipe) {
									this.sendMessage(dorado.Entity._MESSAGE_LOADING_START, arg);
								}
							} else {
								let result = pipe.get();
								this._fillPage(page, result, false, true);
								page.loaded = true;
								pageLoaded.call(this);
							}
						} else {
							page.loaded = true;
						}
					}
				}
				return page;
			} else {
				throw new dorado.ResourceException("dorado.data.InvalidPage", pageNo);
			}
		},
		getPageEntityCount: function(pageNo: any) {
			if (pageNo > 0) {
				let page = this.getPage(pageNo);
				return page ? page.entityCount : this.pageSize;
			} else {
				return this.current ? this.current.page.entityCount : 0;
			}
		},
		setCurrent: function(current: any) {
			if (this.current === current) {
				return;
			}
			if (current && (!current.page || current.page.entityList !== this)) {
				this._throwInvalidEntity(current);
			}
			if (current && current.state === dorado.Entity.STATE_DELETED) {
				throw new dorado.ResourceException("dorado.data.EntityDeleted");
			}
			let eventArg = {
				entityList: this,
				oldCurrent: this.current,
				newCurrent: current,
				processDefault: true,
			};
			let dataType = this.dataType,
				elementDataType;
			if (dataType) {
				elementDataType = dataType.getElementDataType();
			}
			if (elementDataType) {
				if (dorado.EntityList.duringFillPage) {
					setTimeout(function() {
						elementDataType.fireEvent(
							"beforeCurrentChange",
							elementDataType,
							eventArg,
						);
					}, 0);
				} else {
					elementDataType.fireEvent(
						"beforeCurrentChange",
						elementDataType,
						eventArg,
					);
				}
			}
			if (!eventArg.processDefault) {
				return;
			}
			this.current = current;
			this.pageNo = current ? current.page.pageNo : 1;
			this.timestamp = dorado.Core.getTimestamp();
			this.sendMessage(dorado.EntityList._MESSAGE_CURRENT_CHANGED, eventArg);
			if (elementDataType) {
				if (dorado.EntityList.duringFillPage) {
					setTimeout(function() {
						elementDataType.fireEvent(
							"onCurrentChange",
							elementDataType,
							eventArg,
						);
					}, 0);
				} else {
					elementDataType.fireEvent(
						"onCurrentChange",
						elementDataType,
						eventArg,
					);
				}
			}
		},
		hasPrevious: function() {
			if (this.current) {
				let page = this.current.page;
				if (page > 1) {
					return true;
				}
				let entry = page.findEntry(this.current);
				entry = this._findPreviousEntry(entry, false);
				return entry != null;
			} else {
				if (this.entityCount > 0) {
					this._throwNoCurrent();
				}
			}
		},
		hasNext: function() {
			if (this.current) {
				let page = this.current.page;
				if (page < this.pageCount) {
					return true;
				}
				let entry = page.findEntry(this.current);
				entry = this._findNextEntry(entry, false);
				return entry != null;
			} else {
				if (this.entityCount > 0) {
					this._throwNoCurrent();
				}
			}
		},
		getFirst: function() {
			let entry = this._findNextEntry(null, false);
			return entry ? entry.data : null;
		},
		getLast: function() {
			let entry = this._findPreviousEntry(null, false, this.pageCount + 1);
			return entry ? entry.data : null;
		},
		first: function(loadPage: any) {
			let entry = this._findNextEntry(null, loadPage);
			let entity = entry ? entry.data : null;
			this.setCurrent(entity);
			return entity;
		},
		previous: function(loadPage: any) {
			if (this.current) {
				let page = this.current.page;
				let entry = page.findEntry(this.current);
				entry = this._findPreviousEntry(entry, loadPage);
				if (entry) {
					this.setCurrent(entry.data);
					return entry.data;
				}
				return null;
			} else {
				if (this.entityCount > 0) {
					this._throwNoCurrent();
				}
			}
		},
		next: function(loadPage: any) {
			if (this.current) {
				let page = this.current.page;
				let entry = page.findEntry(this.current);
				entry = this._findNextEntry(entry, loadPage);
				if (entry) {
					this.setCurrent(entry.data);
					return entry.data;
				}
				return null;
			} else {
				if (this.entityCount > 0) {
					this._throwNoCurrent();
				}
			}
		},
		last: function(loadPage: any) {
			let entry = this._findPreviousEntry(null, loadPage, this.pageCount + 1);
			let entity = entry ? entry.data : null;
			this.setCurrent(entity);
			return entity;
		},
		move: function(offset: any) {
			let page = this.current.page;
			let entry = page.findEntry(this.current);
			if (offset > 0) {
				for (let i = 0; i < offset; i++) {
					entry = this._findNextEntry(entry, true);
					if (!entry && this.entityCount > 0) {
						this._throwNoCurrent();
					}
				}
			} else {
				if (offset < 0) {
					for (let i = 0; i > offset; i--) {
						entry = this._findPreviousEntry(entry, true);
						if (!entry && this.entityCount > 0) {
							this._throwNoCurrent();
						}
					}
				}
			}
			this.setCurrent(entry.data);
			return entry.data;
		},
		gotoPage: function(pageNo: any, callback: any) {
			if (callback) {
				let self = this;
				this.getPage(pageNo, true, {
					callback: function(success: any, result: any) {
						if (success) {
							let entry = result.first;
							while (entry && entry.data.state === dorado.Entity.STATE_DELETED) {
								entry = entry.next;
							}
							let entity = entry ? entry.data : null;
							if (entity) {
								self.setCurrent(entity);
							}
						}
						$callback(callback, success, result);
					},
				});
			} else {
				let entry = this.getPage(pageNo, true).first;
				while (entry && entry.data.state === dorado.Entity.STATE_DELETED) {
					entry = entry.next;
				}
				let entity = entry ? entry.data : null;
				if (entity) {
					this.setCurrent(entity);
				}
				return entity;
			}
		},
		firstPage: function(callback: any) {
			this.gotoPage(1, callback);
		},
		previousPage: function(callback: any) {
			if (this.pageNo <= 1) {
				return;
			}
			this.gotoPage(this.pageNo - 1, callback);
		},
		nextPage: function(callback: any) {
			if (this.pageNo >= this.pageCount) {
				return;
			}
			this.gotoPage(this.pageNo + 1, callback);
		},
		lastPage: function(callback: any) {
			this.gotoPage(this.pageCount, callback);
		},
		changeEntityCount: function(page: any, num: any) {
			page.entityCount += num;
			this.entityCount += num;
		},
		isEmpty: function() {
			return this.entityCount === 0;
		},
		_doEmptyParentPropertyInfo: function(entity: any, mode: any) {
			let parent = entity.parent;
			if (
				parent != null &&
				parent instanceof dorado.EntityList &&
				parent.parent != null &&
				parent.parent instanceof dorado.Entity
			) {
				let parentProperty = parent.parentProperty;
				let parentPropertyDef = parent.parent.getPropertyDef(parentProperty);
				if (parentPropertyDef._required) {
					if (
						mode === "insert" ||
						(mode === "remove" && parent.entityCount === 0)
					) {
						let propertyInfoMap = parent.parent._propertyInfoMap,
							propertyInfo = propertyInfoMap[parentProperty];
						if (propertyInfo) {
							propertyInfoMap[parentProperty] = propertyInfo = {};
						}
					}
				}
			}
		},
		insert: function(entity: any, insertMode: any, refEntity: any) {
			if (entity == null) {
				entity = this.createChild(null, true);
			} else {
				if (entity instanceof dorado.Entity) {
					if (entity.parent) {
						if (entity.parent instanceof dorado.EntityList) {
							entity.parent.remove(entity, true);
						} else {
							throw new dorado.ResourceException(
								"dorado.data.ValueNotFree",
								"Entity",
							);
						}
					}
				} else {
					entity = new dorado.Entity(
						entity,
						this.dataTypeRepository,
						this.elementDataType,
					);
				}
			}
			if (insertMode === "before" || insertMode === "after") {
				refEntity = refEntity || this.current;
				if (!refEntity) {
					insertMode = insertMode === "before" ? "begin" : "after";
				}
			}
			let eventArg = {
				entityList: this,
				entity: entity,
				insertMode: insertMode,
				refEntity: refEntity,
				processDefault: true,
			};
			let dataType = entity.dataType;
			if (dataType) {
				dataType.fireEvent("beforeInsert", dataType, eventArg);
			}
			if (!eventArg.processDefault) {
				return;
			}
			if (this.pageCount === 0 && this.pageNo === 1) {
				this.pageCount = 1;
			}
			let page = this.getPage(this.pageNo, true);
			page.insert(entity, insertMode, refEntity);
			if (entity.state !== dorado.Entity.STATE_DELETED) {
				this.changeEntityCount(page, 1);
			}
			if (entity.state !== dorado.Entity.STATE_MOVED) {
				entity.setState(dorado.Entity.STATE_NEW);
			}
			this.timestamp = dorado.Core.getTimestamp();
			this._doEmptyParentPropertyInfo(entity, "insert");
			if (this.isNull) {
				delete this.isNull;
			}
			if (dataType) {
				dataType.fireEvent("onInsert", dataType, eventArg);
			}
			this.sendMessage(dorado.EntityList._MESSAGE_INSERTED, eventArg);
			this.setCurrent(entity);
			return entity;
		},
		remove: function(entity: any, detach: any) {
			if (!entity) {
				if (!this.current) {
					this._throwNoCurrent();
				}
				entity = this.current;
			}
			if (entity.parent !== this) {
				this._throwInvalidEntity();
			}
			let eventArg = { entity: entity, entityList: this, processDefault: true };
			let dataType = entity.dataType,
				simpleDetach = entity.state === dorado.Entity.STATE_DELETED;
			if (!simpleDetach) {
				if (dataType) {
					dataType.fireEvent("beforeRemove", dataType, eventArg);
				}
				if (!eventArg.processDefault) {
					return;
				}
			}
			let isCurrent = this.current === entity;
			let newCurrent = null;
			if (isCurrent) {
				let entry = entity.page.findEntry(this.current);
				let newCurrentEntry = this._findNextEntry(entry);
				if (!newCurrentEntry) {
					newCurrentEntry = this._findPreviousEntry(entry);
				}
				if (newCurrentEntry) {
					newCurrent = newCurrentEntry.data;
				}
			}
			let page = entity.page;
			if (simpleDetach) {
				detach = true;
			} else {
				detach = detach || entity.state === dorado.Entity.STATE_NEW;
				if (!detach) {
					entity.setState(dorado.Entity.STATE_DELETED);
				}
			}
			if (detach) {
				if (entity.state !== dorado.Entity.STATE_DELETED) {
					this.changeEntityCount(page, -1);
				}
			}
			this.timestamp = dorado.Core.getTimestamp();
			this._doEmptyParentPropertyInfo(entity, "remove");
			if (!simpleDetach) {
				if (dataType) {
					dataType.fireEvent("onRemove", dataType, eventArg);
				}
				this.sendMessage(dorado.EntityList._MESSAGE_DELETED, eventArg);
			}
			if (detach) {
				page.remove(entity);
			}
			if (isCurrent) {
				this.setCurrent(newCurrent);
			}
		},
		createChild: function(data: any, detached: any) {
			let elementDataType = this.dataType
				? this.dataType.getElementDataType()
				: null;
			if (
				elementDataType &&
				!(elementDataType instanceof dorado.EntityDataType)
			) {
				throw new ResourceException(
					"dorado.data.EntityPropertyExpected",
					property,
				);
			}
			let child = new dorado.Entity(
				null,
				this.dataTypeRepository,
				elementDataType,
			);
			if (data) {
				child.set(data);
			}
			if (!detached) {
				this.insert(child);
			}
			return child;
		},
		getById: function(id: any) {
			return this._keyMap[id];
		},
		_fillPage: function(page: any, jsonArray: any, changeCurrent: any, fireEvent: any) {
			page.entityCount = 0;
			if (jsonArray == null) {
				return;
			}
			if (!(jsonArray instanceof Array)) {
				if (jsonArray.$isWrapper) {
					let v = jsonArray.data;
					v.entityCount = jsonArray.entityCount;
					v.pageCount = jsonArray.pageCount;
					jsonArray = v;
				}
				if (!(jsonArray instanceof Array)) {
					jsonArray = [jsonArray];
				}
			}
			let entity, firstEntity;
			let dataType = this.dataType;
			if (dataType) {
				dataType._disableObserversCounter++;
			}
			this._disableObserversCounter++;
			dorado.EntityList.duringFillPage =
				(dorado.EntityList.duringFillPage || 0) + 1;
			try {
				let elementDataType = this.elementDataType,
					eventArg;
				if (fireEvent && elementDataType != null) {
					eventArg = {};
				}
				for (let i = 0; i < jsonArray.length; i++) {
					let json = jsonArray[i];
					if (json instanceof dorado.Entity && json.parent) {
						if (json.parent instanceof dorado.EntityList) {
							json.parent.remove(json, true);
						} else {
							throw new dorado.ResourceException(
								"dorado.data.ValueNotFree",
								"Entity",
							);
						}
					}
					if (elementDataType != null) {
						entity = elementDataType.parse(json);
					} else {
						let oldProcessDefaultValue = SHOULD_PROCESS_DEFAULT_VALUE;
						SHOULD_PROCESS_DEFAULT_VALUE = false;
						try {
							entity = new dorado.Entity(
								json,
								this.dataType ? this.dataType.get("dataTypeRepository") : null,
							);
						} finally {
							SHOULD_PROCESS_DEFAULT_VALUE = oldProcessDefaultValue;
						}
					}
					page.insert(entity);
					if (entity.state !== dorado.Entity.STATE_DELETED) {
						page.entityCount++;
						this.entityCount++;
						if (!firstEntity) {
							firstEntity = entity;
						}
						if (fireEvent && elementDataType != null) {
							eventArg.entity = entity;
							elementDataType.fireEvent(
								"onEntityLoad",
								elementDataType,
								eventArg,
							);
						}
					}
				}
				if (jsonArray.entityCount) {
					this.entityCount = jsonArray.entityCount;
				}
				if (jsonArray.pageCount) {
					this.pageCount = jsonArray.pageCount;
				}
				if (changeCurrent && firstEntity) {
					this.setCurrent(firstEntity);
				}
			} finally {
				dorado.EntityList.duringFillPage--;
				this._disableObserversCounter--;
				if (dataType) {
					dataType._disableObserversCounter--;
				}
			}
			if (firstEntity) {
				this.timestamp = dorado.Core.getTimestamp();
				this.sendMessage(0);
			}
		},
		cancel: function(deep: any) {
			let it = this.iterator(true),
				changed = false;
			while (it.hasNext()) {
				let entity = it.next();
				if (
					entity.state !== dorado.Entity.STATE_NONE &&
					entity.state !== dorado.Entity.STATE_MOVED
				) {
					entity.disableObservers();
					entity.cancel(deep);
					entity.enableObservers();
					changed = true;
				}
			}
			if (changed) {
				this.timestamp = dorado.Core.getTimestamp();
				this.sendMessage(0);
			}
		},
		clear: function() {
			this._keyMap = {};
			this._pages.clear();
			page = new dorado.EntityList.Page(this, 1);
			page.loaded = true;
			this._pages.insert(page);
			this.pageNo = 1;
			this.pageCount = 1;
			this.entityCount = 0;
			this.current = null;
			this.timestamp = dorado.Core.getTimestamp();
			this.sendMessage(0);
		},
		flush: function(callback: any) {
			function clear() {
				this._keyMap = {};
				this._pages.clear();
				this.timestamp = dorado.Core.getTimestamp();
			}
			clear.call(this);
			if (callback) {
				let self = this;
				this.getPage(this.pageNo, true, {
					callback: function(success: any, page: any) {
						self._disableObserversCounter++;
						try {
							if (success) {
								let entity = page.first ? page.first.data : null;
								self.setCurrent(entity);
								$callback(callback, true, null);
							}
						} finally {
							self._disableObserversCounter--;
							self.sendMessage(0);
						}
					},
				});
			} else {
				let entry = this.getPage(this.pageNo, true).first;
				let entity = entry ? entry.data : null;
				this._disableObserversCounter++;
				try {
					this.setCurrent(entity);
				} finally {
					this._disableObserversCounter--;
					this.sendMessage(0);
				}
			}
		},
		flushAsync: function(callback: any) {
			this.flush(callback);
		},
		fromJSON: function(json: any) {
			let jsonArray = json.$isWrapper ? json.data : json;
			if (json.pageNo) {
				this.pageNo = json.pageNo;
			}
			if (this.pageCount === 0) {
				if (json.pageCount) {
					this.pageCount = json.pageCount;
				} else {
					if (this.pageNo === 1) {
						this.pageCount = 1;
					}
				}
			}
			let page = this.getPage(this.pageNo, true);
			this._fillPage(page, jsonArray, true);
			if (this.entityCount > 0) {
				if (this.isNull) {
					delete this.isNull;
				}
			}
		},
		toJSON: function(options: any, context: any) {
			if (this.isNull) {
				return null;
			}
			let result = [];
			let generateDataType = options ? options.generateDataType : false;
			let entityFilter = options ? options.entityFilter : null;
			let it = this.iterator(options);
			while (it.hasNext()) {
				let entity = it.next();
				if (entity) {
					if (!entityFilter || entityFilter(entity)) {
						result.push(entity.toJSON(options, context));
					}
				} else {
					result.push(null);
				}
			}
			if (result.length === 0 && entityFilter) {
				result = null;
			}
			if (generateDataType && result && this.dataType) {
				result = {
					$isWrapper: true,
					$dataType: this.dataType._id,
					data: result,
				};
			}
			return result;
		},
		toArray: function() {
			let result = [];
			this.each(function(entity: any) {
				result.push(entity);
			});
			return result;
		},
		getWrapper: function(options: any) {
			let result = [];
			this.each(function(entity: any) {
				result.push(entity.getWrapper(options));
			});
			return result;
		},
		each: function(fn: any, scope: any) {
			let it = this.iterator(),
				entity;
			while (it.hasNext()) {
				entity = it.next();
				if (fn.call(scope || entity, entity) === false) {
					break;
				}
			}
		},
		iterator: function(options: any) {
			return new dorado.EntityList.EntityListIterator(this, options);
		},
		toText: function() {
			return this.toString();
		},
		toString: function() {
			return "EntityList@" + this.objId + "(" + this.entityCount + ")";
		},
		clone: function(deep: any) {
			if (this.isNull) {
				return null;
			}
			let cloned = new dorado.EntityList(
				null,
				this.dataTypeRepository,
				this.dataType,
			);
			for (let it = this.iterator(); it.hasNext(); ) {
				let entity = it.next();
				if (deep) {
					entity = dorado.Core.clone(entity, deep);
				}
				cloned.insert(entity);
			}
			return cloned;
		},
	});
	let Page = (dorado.EntityList.Page = $extend(dorado.util.KeyedList, {
		$className: "dorado.EntityList.Page",
		constructor: function(entityList: any, pageNo: any) {
			$invokeSuper.call(this, [
				function(entity: any) {
					return entity.entityId;
				},
			]);
			this.entityList = entityList;
			this.pageNo = pageNo;
			this.entityCount = entityList.pageSize;
			this.id = pageNo;
		},
		insert: function(data: any, insertMode: any, refData: any) {
			$invokeSuper.call(this, [data, insertMode, refData]);
			data.page = this;
			data.parent = this.entityList;
			data._setObserver(this.entityList._observer);
			this.entityList._keyMap[data.entityId] = data;
			this.loaded = true;
		},
		remove: function(data: any) {
			$invokeSuper.call(this, [data]);
			data.parent = null;
			data.page = null;
			data._setObserver(null);
			delete this.entityList._keyMap[data.entityId];
		},
		each: function(fn: any, scope: any) {
			let entry = this.first,
				i = 0;
			while (entry != null) {
				let entity = entry.data;
				if (entity && entity.state !== dorado.Entity.STATE_DELETED) {
					if (fn.call(scope || entity, entity, i++) === false) {
						break;
					}
				}
				entry = entry.next;
			}
		},
	}));
	dorado.EntityList.EntityListIterator = $extend(dorado.util.Iterator, {
		$className: "dorado.EntityList.EntityListIterator",
		constructor: function(entityList: any, options: any) {
			this._entityList = entityList;
			if (options === true) {
				this._includeDeletedEntity = true;
			} else {
				if (options instanceof Object) {
					this._includeDeletedEntity = options.includeDeletedEntity;
					this._includeUnloadPage = options.includeUnloadPage;
					this._nextIndex = options.nextIndex;
					this._fixedPageNo = options.pageNo;
					if (!this._fixedPageNo && options.currentPage) {
						this._fixedPageNo = entityList.pageNo;
					}
					this._simulateUnloadPage = options.simulateUnloadPage;
					if (this._simulateUnloadPage) {
						this._includeUnloadPage = true;
					}
				}
			}
			this.firstOrLast();
		},
		firstOrLast: function(reverse: any) {
			let entityList = this._entityList;
			let it,
				page,
				pageNo = 0;
			if (!this._fixedPageNo) {
				it = entityList._pages.iterator();
				if (reverse) {
					it.last();
				}
			} else {
				pageNo = this._fixedPageNo;
			}
			if (this._nextIndex) {
				let skiped = 0;
				if (!this._fixedPageNo) {
					let tempPage;
					while (reverse ? it.hasPrevious() : it.hasNext()) {
						tempPage = reverse ? it.previous() : it.next();
						if (tempPage.loaded || this._includeUnloadPage) {
							skiped += tempPage.entityCount;
							if (skiped + tempPage.entityCount > this._nextIndex) {
								skiped -= tempPage.entityCount;
								break;
							}
						}
					}
					if (tempPage) {
						page = tempPage;
						pageNo = page.pageNo;
					}
				}
				if (pageNo) {
					this._previous = this._next = this._findFromPage(pageNo);
					if (this._next && skiped < this._nextIndex) {
						for (let i = skiped; i < this._nextIndex; i++) {
							if (this.hasNext()) {
								this.next();
							} else {
								break;
							}
						}
					}
				}
				delete this._nextIndex;
			} else {
				if (!this._fixedPageNo) {
					let tempPage;
					while (reverse ? it.hasPrevious() : it.hasNext()) {
						tempPage = reverse ? it.previous() : it.next();
						if (tempPage.loaded || this._includeUnloadPage) {
							page = tempPage;
							pageNo = page.pageNo;
							break;
						}
					}
				}
				if (pageNo) {
					let result = this._findFromPage(pageNo, reverse);
					if (reverse) {
						this._previous = result;
					} else {
						this._next = result;
					}
				}
			}
		},
		_findFromPage: function(pageNo: any, reverse: any) {
			let result = null,
				entityList = this._entityList,
				pageCount = entityList.pageCount;
			let page = entityList.getPage(pageNo, !this._simulateUnloadPage);
			if (page && page.loaded) {
				let entry = reverse ? page.last : page.first;
				while (entry) {
					if (
						this._includeDeletedEntity ||
						entry.data.state !== dorado.Entity.STATE_DELETED
					) {
						result = entry;
						break;
					}
					entry = reverse ? entry.previous : entry.next;
				}
			} else {
				result = { data: dorado.Entity.getDummyEntity(pageNo) };
				let entityList = this._entityList;
				this._simulatePageSize =
					pageNo === pageCount
						? entityList.entityCount % entityList.pageSize
						: entityList.pageSize;
				this._simulateIndex = reverse ? this._simulatePageSize : 0;
			}
			return result;
		},
		_findNeighbor: function(entry: any, pageNo: any, reverse: any) {
			if (!entry) {
				return null;
			}
			let oldEntry = entry;
			if (entry.data && !entry.data.dummy) {
				do {
					entry = reverse ? entry.previous : entry.next;
					if (
						entry &&
						(this._includeDeletedEntity ||
							entry.data.state !== dorado.Entity.STATE_DELETED)
					) {
						break;
					}
				} while (entry);
			} else {
				let inc = reverse ? -1 : 1;
				this._simulateIndex += inc;
				if (
					this._simulateIndex < 0 ||
					this._simulateIndex >= this._simulatePageSize
				) {
					this._simulateIndex -= inc;
					entry = null;
				}
			}
			if (entry == null && !this._fixedPageNo) {
				if (this._includeUnloadPage) {
					pageNo += reverse ? -1 : 1;
					if (pageNo > 0 && pageNo <= this._entityList.pageCount) {
						entry = this._findFromPage(pageNo, reverse);
					}
				} else {
					let entityList = this._entityList,
						page = oldEntry.data.page;
					let entry = entityList._pages.findEntry(page);
					if (entry) {
						entry = reverse ? entry.previous : entry.next;
						if (entry) {
							page = entry.data;
							if (page.loaded) {
								entry = this._findFromPage(page.pageNo, reverse);
							}
						}
					}
				}
			}
			return entry;
		},
		_find: function(reverse: any) {
			let fromEntry = reverse ? this._previous : this._next;
			let result = this._findNeighbor(
				fromEntry,
				fromEntry.data.page.pageNo,
				reverse,
			);
			if (reverse) {
				this._next = this._current;
				this._current = this._previous;
				this._previous = result;
			} else {
				this._previous = this._current;
				this._current = this._next;
				this._next = result;
			}
		},
		first: function() {
			this.firstOrLast();
		},
		last: function() {
			this.firstOrLast(true);
		},
		hasPrevious: function() {
			return !!this._previous;
		},
		hasNext: function() {
			return !!this._next;
		},
		previous: function() {
			if (!this._previous) {
				this._next = this._current;
				this._current = this._previous = null;
				return null;
			}
			let data = this._previous.data;
			this._find(true);
			return data;
		},
		next: function() {
			if (!this._next) {
				this._previous = this._current;
				this._current = this._next = null;
				return null;
			}
			let data = this._next.data;
			this._find(false);
			return data;
		},
		current: function() {
			return this._current ? this._current.data : null;
		},
		createBookmark: function() {
			return {
				previous: this._previous,
				current: this._current,
				next: this._next,
				simulateIndex: this._simulateIndex,
				simulatePageSize: this._simulatePageSize,
			};
		},
		restoreBookmark: function(bookmark: any) {
			this._previous = bookmark.previous;
			this._current = bookmark.current;
			this._next = bookmark.next;
			this._simulateIndex = bookmark.simulateIndex;
			this._simulatePageSize = bookmark.simulatePageSize;
		},
	});
	LoadPagePipe = $extend(dorado.DataPipe, {
		shouldFireEvent: false,
		constructor: function(entityList: any, pageNo: any) {
			this.entityList = entityList;
			let dataType = entityList.dataType,
				view;
			if (dataType) {
				let dataTypeRepository = dataType.get("dataTypeRepository");
				this.dataTypeRepository = dataTypeRepository;
				view = dataTypeRepository ? dataTypeRepository._view : null;
			}
			this.dataProviderArg = {
				parameter: entityList.parameter,
				sysParameter: entityList.sysParameter,
				pageSize: entityList.pageSize,
				pageNo: pageNo,
				dataType: dataType,
				view: view,
			};
		},
		doGet: function() {
			return this.invokeDataProvider(false);
		},
		doGetAsync: function(callback: any) {
			this.invokeDataProvider(true, callback);
		},
		invokeDataProvider: function(async: any, callback: any) {
			let dataProvider = this.entityList.dataProvider,
				dataProviderArg = this.dataProviderArg,
				oldSupportsEntity = dataProvider.supportsEntity;
			dataProvider.supportsEntity = false;
			dataProvider.shouldFireEvent = this.shouldFireEvent;
			try {
				let callbackWrapper = {
					callback: function(success: any, result: any) {
						if (callback) {
							$callback(callback, success, result);
						}
					},
				};
				if (async) {
					dataProvider.getResultAsync(dataProviderArg, callbackWrapper);
				} else {
					let result = dataProvider.getResult(dataProviderArg);
					$callback(callbackWrapper, true, result);
					return result;
				}
			} finally {
				dataProvider.supportsEntity = oldSupportsEntity;
			}
		},
	});
	dorado.EntityList._MESSAGE_CURRENT_CHANGED = 20;
	dorado.EntityList._MESSAGE_DELETED = 21;
	dorado.EntityList._MESSAGE_INSERTED = 22;
})();
(function() {
	let BREAK_ALL = {};
	let BREAK_LEVEL = {};
	let ENTITY_PATH_CACHE = {};
	dorado.DataPath = $class({
		$className: "dorado.DataPath",
		_VISIBLE: [{ visibility: 0 }],
		_ALL: [{ visibility: 1 }],
		_CURRENT: [{ visibility: 2 }],
		_REPEAT_VISIBLE: [{ visibility: 0, repeat: true }],
		_REPEAT_ALL: [{ visibility: 1, repeat: true }],
		constructor: function(path: any) {
			this.path = path != null ? $.trim(path) : path;
		},
		_throw: function(message: any, position: any) {
			let text = "DataPath syntax error";
			if (message) {
				text += ":\n" + message + "in:\n";
			} else {
				text += " in:\n";
			}
			let path = this.path;
			text += path;
			if (isFinite(position)) {
				position = parseInt(position);
				text += "\nat char " + position;
			}
			throw new SyntaxError(text);
		},
		compile: function() {
			function isUnsignedInteger(s: any) {
				return s.search(/^[0-9]+$/) === 0;
			}
			let path = this.path;
			if (path == null || path === "" || path === "*") {
				this._compiledPath = this._VISIBLE;
				return;
			}
			if (path === "#" || path === "[#current]") {
				this._compiledPath = this._CURRENT;
				this._compiledPath.singleResult = true;
				return;
			}
			let _path = path.toLowerCase();
			if (_path === "(repeat)" || _path === "(r)") {
				this._compiledPath = this._REPEAT_VISIBLE;
				return;
			}
			let compiledPath = [];
			let property = "";
			let args = null;
			let arg;
			let conditions = null;
			let condition;
			let quotation = null;
			let inArgs = false;
			let afterArgs = false;
			let inCondition = false;
			let afterCondition = false;
			let escapeNext = false;
			for (let i = 0; i < path.length; i++) {
				let c = path.charAt(i);
				if (escapeNext) {
					property += c;
					escapeNext = false;
					continue;
				}
				if (afterArgs && afterCondition && c !== ".") {
					this._throw(null, i);
				}
				switch (c) {
					case ".":
						if (!quotation && !inArgs && !inCondition) {
							compiledPath.push({
								property: property,
								args: args,
								conditions: conditions,
							});
							property = "";
							args = null;
							arg = "";
							conditions = null;
							condition = "";
							c = null;
							quotation = null;
							inArgs = false;
							afterArgs = false;
							inCondition = false;
							afterCondition = false;
						}
						break;
					case ",":
						if (!inArgs && !inCondition) {
							this._throw(null, i);
						}
						if (!quotation) {
							if (inArgs) {
								args.push(arg);
								arg = "";
							} else {
								if (inCondition) {
									conditions.push(condition);
									condition = "";
								}
							}
							c = null;
						}
						break;
					case "'":
					case '"':
						if (!inArgs && !inCondition) {
							this._throw(null, i);
						}
						if (!quotation) {
							quotation = c;
						} else {
							if (quotation === c) {
								quotation = null;
							}
						}
						break;
					case "[":
						if (inArgs || afterCondition) {
							this._throw(null, i);
						}
						if (!inCondition) {
							inCondition = true;
							conditions = [];
							condition = "";
							c = null;
						}
						break;
					case "]":
						if (inCondition) {
							if (condition.length > 0) {
								conditions.push(condition);
							}
							inCondition = false;
							afterCondition = true;
							c = null;
						} else {
							this._throw(null, i);
						}
						break;
					case "(":
						if (!inCondition) {
							if (inArgs || afterArgs) {
								this._throw(null, i);
							}
							inArgs = true;
							args = [];
							arg = "";
							c = null;
						}
						break;
					case ")":
						if (!inCondition && afterArgs) {
							this._throw(null, i);
						}
						if (inArgs) {
							if (arg.length > 0) {
								args.push(arg);
							}
							inArgs = false;
							afterArgs = true;
							c = null;
						}
						break;
					case "@":
						c = "$this";
						break;
					default:
						escapeNext = c === "\\";
				}
				if (!escapeNext && c != null) {
					if (inCondition) {
						condition += c;
					} else {
						if (inArgs) {
							arg += c;
						} else {
							property += c;
						}
					}
				}
			}
			if (
				property.length > 0 ||
				(args && args.length > 0) ||
				(conditions && conditions.length > 0)
			) {
				compiledPath.push({
					property: property,
					args: args,
					conditions: conditions,
				});
			}
			let singleResult = compiledPath.length > 0;
			for (let i = 0; i < compiledPath.length; i++) {
				let section = compiledPath[i];
				if (
					(!section.property || section.property === "*") &&
					!section.args &&
					!section.conditions
				) {
					section = this._VISIBLE;
					compiledPath[i] = section;
					singleResult = false;
				} else {
					let property = section.property;
					if (property) {
						if (property.charAt(0) === "#") {
							section.visibility = 2;
							section.property = property = property.substring(1);
						}
						if (property.charAt(0) === "!") {
							section.visibility = 1;
							section.interceptor = property.substring(1);
						}
					}
					let args = section.args;
					if (args) {
						for (let j = 0; j < args.length; j++) {
							let arg = args[j].toLowerCase();
							if (arg === "r" || arg === "repeat") {
								section.repeat = true;
							} else {
								if (arg === "l" || arg === "leaf") {
									section.repeat = true;
									section.leaf = true;
								} else {
									if (isUnsignedInteger(arg)) {
										section.max = parseInt(arg);
									}
								}
							}
						}
					}
					let conditions = section.conditions;
					if (conditions) {
						for (let j = conditions.length - 1; j >= 0; j--) {
							let condition = conditions[j];
							if (
								condition &&
								condition.charAt(0) === "#" &&
								!(section.visibility > 0)
							) {
								if (condition === "#all") {
									section.visibility = 1;
								} else {
									if (condition === "#current") {
										section.visibility = 2;
									} else {
										if (condition === "#dirty") {
											section.visibility = 3;
										} else {
											if (condition === "#new") {
												section.visibility = 4;
											} else {
												if (condition === "#modified") {
													section.visibility = 5;
												} else {
													if (condition === "#deleted") {
														section.visibility = 6;
													} else {
														if (condition === "#moved") {
															section.visibility = 7;
														} else {
															if (condition === "#none") {
																section.visibility = 8;
															} else {
																if (condition === "#visible") {
																	section.visibility = 9;
																} else {
																	this._throw(
																		'Unknown token "' + condition + '".',
																	);
																}
															}
														}
													}
												}
											}
										}
									}
								}
								conditions.removeAt(j);
							}
						}
					}
					singleResult =
						section.visibility === 2 && (section.leaf || !section.repeat);
				}
			}
			compiledPath.singleResult = singleResult;
			this._compiledPath = compiledPath;
		},
		_selectEntityIf: function(context: any, entity: any, isLeaf: any) {
			let section = context.section;
			if (!section.leaf || isLeaf) {
				let sections = context.sections;
				if (section === sections[sections.length - 1]) {
					context.addResult(entity);
				} else {
					this._evaluateSectionOnEntity(context, entity, true);
				}
			}
		},
		_evaluateSectionOnEntity: function(context: any, entity: any, nextSection: any) {
			let oldLevel = context.level;
			if (nextSection) {
				if (context.level >= context.sections.length - 1) {
					return;
				}
				context.setCurrentLevel(context.level + 1);
			}
			let oldLastSection = context.lastSection;
			let section = context.section;
			context.lastSection = section;
			try {
				let result;
				if (section.interceptor) {
					let interceptors = dorado.DataPath.interceptors[section.interceptor];
					if (interceptors && interceptors.dataInterceptor) {
						result = interceptors.dataInterceptor.call(
							this,
							entity,
							section.interceptor,
						);
					} else {
						throw new dorado.Exception(
							'DataPath interceptor "' + section.interceptor + '" not found.',
						);
					}
				} else {
					if (section.property) {
						if (entity instanceof dorado.Entity) {
							dorado.Entity.ALWAYS_RETURN_VALID_ENTITY_LIST = !section.leaf;
							try {
								result = entity.get(section.property, context.loadMode);
							} finally {
								dorado.Entity.ALWAYS_RETURN_VALID_ENTITY_LIST = true;
							}
						} else {
							result = entity[section.property];
						}
						if (result == null && section.leaf && section === oldLastSection) {
							this._selectEntityIf(context, entity, true);
						}
					} else {
						result = entity;
					}
				}
				if (result instanceof dorado.EntityList || result instanceof Array) {
					this._evaluateSectionOnAggregation(context, result);
				} else {
					if (result != null) {
						this._selectEntityIf(context, result);
						if (result != null && section.repeat) {
							this._evaluateSectionOnEntity(context, entity);
						}
					}
				}
			} finally {
				context.lastSection = oldLastSection;
				context.setCurrentLevel(oldLevel);
			}
		},
		_evaluateSectionOnAggregation: function(context: any, entities: any, isRoot: any) {
			function selectEntityIf(entity: any) {
				let b = true;
				switch (section.visibility) {
					case 1:
						b = true;
						break;
					case 3:
						b = entity.state !== dorado.Entity.STATE_NONE;
						break;
					case 4:
						b = entity.state === dorado.Entity.STATE_NEW;
						break;
					case 5:
						b = entity.state === dorado.Entity.STATE_MODIFIED;
						break;
					case 6:
						b = entity.state === dorado.Entity.STATE_DELETED;
						break;
					case 7:
						b = entity.state === dorado.Entity.STATE_MOVED;
						break;
					case 8:
						b = entity.state === dorado.Entity.STATE_NONE;
						break;
					default:
						b = entity.state !== dorado.Entity.STATE_DELETED;
				}
				if (b) {
				    let conditions = section.conditions;
				    if (conditions) {
				        let $this = entity;
				        for (let i = 0; i < conditions.length; i++) {
				            // CSP 兼容：不支持动态条件表达式
				            // 条件应该预先编译为函数或使用预定义的条件检查
				            console.warn("CSP-compliant mode: Dynamic condition expressions are not supported.");
				            b = false;
				            break;
				        }
				    }
				}
				if (b) {
					this._selectEntityIf(context, entity);
				}
				if (section.repeat) {
					this._evaluateSectionOnEntity(context, entity);
				}
			}
			try {
				context.possibleMultiResult = true;
				let section = context.section;
				if (section.interceptor) {
					let interceptors = dorado.DataPath.interceptors[section.interceptor];
					if (interceptors && interceptors.dataInterceptor) {
						entities = interceptors.dataInterceptor.call(
							this,
							entities,
							section.interceptor,
						);
						if (entities == null) {
							return;
						}
					} else {
						throw new dorado.Exception(
							'DataPath interceptor "' + section.interceptor + '" not found.',
						);
					}
				}
				if (
					entities instanceof dorado.EntityList ||
					entities instanceof Array
				) {
					if (
						context.acceptAggregation &&
						!(section.visibility > 0) &&
						!section.conditions
					) {
						let sections = context.sections;
						if (section === sections[sections.length - 1]) {
							context.addResult(entities);
							throw BREAK_LEVEL;
						}
					}
				} else {
					entities = [entities];
				}
				if (entities instanceof dorado.EntityList) {
					if (section.visibility === 2) {
						if (entities.current) {
							selectEntityIf.call(this, entities.current);
						}
					} else {
						let includeDeleted =
							section.visibility === 1 ||
							section.visibility === 3 ||
							section.visibility === 6;
						let it = entities.iterator(includeDeleted);
						while (it.hasNext()) {
							selectEntityIf.call(this, it.next());
						}
					}
				} else {
					for (let i = 0; i < entities.length; i++) {
						selectEntityIf.call(this, entities[i]);
					}
				}
			} catch (e) {
				if (e !== BREAK_LEVEL) {
					throw e;
				}
			}
		},
		evaluate: function(data: any, options: any) {
			let firstResultOnly,
				acceptAggregation = false,
				loadMode;
			if (options === true) {
				firstResultOnly = options;
			} else {
				if (options instanceof Object) {
					firstResultOnly = options.firstResultOnly;
					acceptAggregation = options.acceptAggregation;
					loadMode = options.loadMode;
				}
			}
			loadMode = loadMode || "always";
			if (this._compiledPath === undefined) {
				this.compile();
			}
			firstResultOnly = firstResultOnly || this._compiledPath.singleResult;
			let context = new dorado.DataPathContext(
				this._compiledPath,
				firstResultOnly,
			);
			context.acceptAggregation = acceptAggregation;
			context.loadMode = loadMode;
			context.possibleMultiResult = false;
			try {
				if (data != null) {
					if (data instanceof dorado.EntityList || data instanceof Array) {
						this._evaluateSectionOnAggregation(context, data, true);
					} else {
						this._evaluateSectionOnEntity(context, data);
					}
				}
				if (!context.possibleMultiResult && context.results) {
					if (context.results.length === 0) {
						context.results = null;
					} else {
						if (context.results.length === 1) {
							context.results = context.results[0];
						}
					}
				}
				return context.results;
			} catch (e) {
				if (e === BREAK_ALL) {
					return firstResultOnly ? context.result : context.results;
				} else {
					throw e;
				}
			}
		},
		getDataType: function(dataType: any, options: any) {
			if (!dataType) {
				return null;
			}
			let acceptAggregationDataType, loadMode;
			if (options === true) {
				acceptAggregationDataType = options;
			} else {
				if (options instanceof Object) {
					acceptAggregationDataType = options.acceptAggregationDataType;
					loadMode = options.loadMode;
				}
			}
			loadMode = loadMode || "always";
			let cache = dataType._subDataTypeCache;
			if (cache) {
				let dt = cache[this.path];
				if (dt !== undefined) {
					if (
						!acceptAggregationDataType &&
						dt instanceof dorado.AggregationDataType
					) {
						dt = dt.getElementDataType(loadMode);
					}
					if (dt instanceof dorado.DataType) {
						return dt;
					}
				}
			} else {
				dataType._subDataTypeCache = cache = {};
			}
			if (dataType instanceof dorado.LazyLoadDataType) {
				dataType = dataType.get(loadMode);
			}
			if (this._compiledPath === undefined) {
				this.compile();
			}
			if (dataType) {
				let compiledPath = this._compiledPath;
				for (let i = 0; i < compiledPath.length; i++) {
					let section = compiledPath[i];
					if (section.interceptor) {
						let interceptors =
							dorado.DataPath.interceptors[section.interceptor];
						if (interceptors && interceptors.dataTypeInterceptor) {
							dataType = interceptors.dataTypeInterceptor.call(
								this,
								dataType,
								section.interceptor,
							);
						} else {
							dataType = null;
						}
					} else {
						if (section.property) {
							if (dataType instanceof dorado.AggregationDataType) {
								dataType = dataType.getElementDataType(loadMode);
							}
							let p = dataType.getPropertyDef(section.property);
							dataType = p ? p.get("dataType") : null;
						}
					}
					if (!dataType) {
						break;
					}
				}
			}
			cache[this.path] = dataType;
			if (
				dataType instanceof dorado.AggregationDataType &&
				(this._compiledPath.singleResult || !acceptAggregationDataType)
			) {
				dataType = dataType.getElementDataType(loadMode);
			}
			return dataType;
		},
		_section2Path: function(section: any) {
			let path = section.visibility === 2 ? "#" : "";
			path += section.property ? section.property : "";
			let args = section.args;
			if (args && args.length > 0) {
				path += "(" + args.join(",") + ")";
			}
			let conditions = section.conditions;
			if (conditions && conditions.length > 0) {
				path += "[" + conditions.join(",") + "]";
			}
			return path ? path : "*";
		},
		_compiledPath2Path: function() {
			let compiledPath = this._compiledPath;
			let sections = [];
			for (let i = 0; i < compiledPath.length; i++) {
				sections.push(this._section2Path(compiledPath[i]));
			}
			return sections.join(".");
		},
		toString: function() {
			this.compile();
			return this._compiledPath2Path();
		},
	});
	dorado.DataPath.create = function(path: any) {
		let key = path || "$EMPTY";
		let dataPath = ENTITY_PATH_CACHE[key];
		if (dataPath == null) {
			ENTITY_PATH_CACHE[key] = dataPath = new dorado.DataPath(path);
		}
		return dataPath;
	};
	dorado.DataPath.evaluate = function(data: any, path: any, options: any) {
		let dataPath = dorado.DataPath.create(path);
		return dataPath.evaluate();
	};
	dorado.DataPath.interceptors = {};
	dorado.DataPath.registerInterceptor = function (
		section,
		dataInterceptor,
		dataTypeInterceptor,
	) {
		dorado.DataPath.interceptors[section] = {
			dataInterceptor: dataInterceptor,
			dataTypeInterceptor: dataTypeInterceptor,
		};
	};
	dorado.DataPathContext = $class({
		$className: "dorado.DataPathContext",
		constructor: function(sections: any, firstResultOnly: any) {
			this.sections = sections;
			this.firstResultOnly = firstResultOnly;
			this.level = -1;
			this.levelInfos = [];
			if (firstResultOnly) {
				this.result = null;
			} else {
				this.results = [];
			}
			this.lastSection = sections[sections.length - 1];
			this.setCurrentLevel(0);
		},
		setCurrentLevel: function(level: any) {
			if (level > this.level) {
				this.levelInfos[level] = this.levelInfo = { count: 0 };
			} else {
				this.levelInfo = this.levelInfos[level];
			}
			this.level = level;
			this.section = this.sections[level];
		},
		addResult: function(result: any) {
			if (this.firstResultOnly) {
				this.result = result;
				throw BREAK_ALL;
			} else {
				let section = this.section;
				if (section.max > 0 && this.levelInfo.count >= section.max) {
					throw BREAK_LEVEL;
				}
				this.results.push(result);
				this.levelInfo.count++;
			}
		},
	});
})();
(function() {
	dorado.DataUtil = {
		extractNameFromId: function(id: any) {
			function extractName(id: any) {
				if (id.indexOf("v:") === 0) {
					let i = id.indexOf("$");
					if (i > 0) {
						return id.substring(i + 1);
					}
				}
				return id;
			}
			let name = id;
			let subId = dorado.DataType.getSubName(id);
			if (subId) {
				let subName = this.extractNameFromId(subId);
				if (subName !== subId) {
					name = name.replace(subId, subName);
				}
			}
			return extractName(name);
		},
		FIRE_ON_ENTITY_LOAD: true,
		convertIfNecessary: function(data: any, dataTypeRepository: any, dataType: any) {
			if (data == null) {
				return data;
			}
			if (dataType) {
				if (dataType instanceof dorado.LazyLoadDataType) {
					dataType = dataType.get();
				} else {
					if (typeof dataType === "string" && dataTypeRepository) {
						dataType = dataTypeRepository.get(dataType);
					}
				}
			}
			if (data instanceof dorado.Entity || data instanceof dorado.EntityList) {
				if (!dataType || data.dataType === dataType) {
					return data;
				}
				if (
					data.dataType instanceof dorado.AggregationDataType &&
					data.dataType.get("elementDataType") === dataType
				) {
					return data;
				}
				data = data.toJSON();
			}
			if (data.$dataType && !dataType && dataTypeRepository) {
				dataType = dataTypeRepository.get(data.$dataType);
			}
			if (dataType) {
				let realData = data.$isWrapper ? data.data : data;
				if (data.$isWrapper) {
					realData = data.data;
					realData.entityCount = data.entityCount;
					realData.pageCount = data.pageCount;
				} else {
					realData = data;
				}
				if (
					dataType instanceof dorado.EntityDataType &&
					realData instanceof Array
				) {
					dataType = new dorado.AggregationDataType({
						elementDataType: dataType,
					});
				}
				if (dataType instanceof dorado.DataType) {
					let rudeData = data;
					data = dataType.parse(data);
					if (this.FIRE_ON_ENTITY_LOAD) {
						let eventArg = {};
						if (data instanceof dorado.Entity) {
							if (dataType.getListenerCount("onEntityLoad")) {
								eventArg.entity = data;
								dataType.fireEvent("onEntityLoad", dataType, eventArg);
							}
						} else {
							if (data instanceof dorado.EntityList) {
								if (rudeData.$isWrapper) {
									data.pageSize = rudeData.pageSize;
									data.pageNo = rudeData.pageNo;
								}
								let elementDataType = dataType.get("elementDataType");
								if (
									elementDataType &&
									elementDataType.getListenerCount("onEntityLoad")
								) {
									for (let it = data.iterator(); it.hasNext(); ) {
										eventArg.entity = it.next();
										elementDataType.fireEvent(
											"onEntityLoad",
											dataType,
											eventArg,
										);
									}
								}
							}
						}
					}
				}
			}
			return data;
		},
		convert: function(data: any, dataTypeRepository: any, dataType: any) {
			if (data == null) {
				return data;
			}
			let result = this.convertIfNecessary(data, dataTypeRepository, dataType);
			if (result === data) {
				if (data instanceof Array) {
					result = new dorado.EntityList(data, dataTypeRepository, dataType);
				} else {
					if (data instanceof Object) {
						result = new dorado.Entity(data, dataTypeRepository, dataType);
					}
				}
			}
			return result;
		},
		isOwnerOf: function(data: any, owner: any) {
			if (data == null) {
				return false;
			}
			while (true) {
				data = data.parent;
				if (data == null) {
					return false;
				}
				if (data === owner) {
					return true;
				}
			}
		},
		DEFAULT_SORT_PARAMS: [{ desc: false }],
		sort: function(array: any, sortParams: any, comparator: any) {
			array.sort(function(item1: any, item2: any) {
				if (comparator) {
					return comparator(item1, item2, sortParams);
				}
				let result1, result2;
				if (!(sortParams instanceof Array)) {
					sortParams = [sortParams];
				}
				for (let i = 0; i < sortParams.length; i++) {
					let sortParam = sortParams[i],
						property = sortParam.property;
					let value1, value2;
					if (property) {
						value1 =
							item1 instanceof dorado.Entity
								? item1.get(property)
								: item1[property];
						value2 =
							item2 instanceof dorado.Entity
								? item2.get(property)
								: item2[property];
					} else {
						value1 = item1;
						value2 = item2;
					}
					let factor = 0;
					if (value1 == null) {
						factor = -1;
					} else {
						if (value2 == null) {
							factor = 1;
						} else {
							if (
								typeof value1 === "string" &&
								typeof value2 === "string" &&
								value1.localeCompare
							) {
								let isSimpleChar1 = value1.charCodeAt(0) > 255,
									isSimpleChar2 = value2.charCodeAt(0) > 255;
								if (isSimpleChar1 !== isSimpleChar2) {
									factor = value1 === value2 ? 0 : value1 > value2 ? 1 : -1;
								} else {
									factor = value1.localeCompare(value2);
								}
							} else {
								factor = value1 - value2;
							}
						}
					}
					if (sortParam.desc) {
						factor = factor * -1;
					}
					return factor;
				}
				return 0;
			});
		},
	};
	function getValueForSummary(entity: any, property: any) {
		let value;
		if (property.indexOf(".") > 0) {
			value = dorado.DataPath.create(property).evaluate(entity);
		} else {
			value =
				entity instanceof dorado.Entity
					? entity.get(property)
					: entity[property];
		}
		return parseFloat(value) || 0;
	}
	dorado.SummaryCalculators = {
		count: function(value: any, entity: any, property: any) {
			return value + 1;
		},
		sum: function(value: any, entity: any, property: any) {
			return value + getValueForSummary(entity, property);
		},
		average: {
			getInitialValue: function() {
				return { sum: 0, count: 0 };
			},
			accumulate: function(value: any, entity: any, property: any) {
				value.sum += getValueForSummary(entity, property);
				value.count++;
				return value;
			},
			getFinalValue: function(value: any) {
				return value.count ? value.sum / value.count : 0;
			},
		},
		max: {
			getInitialValue: function() {
				return null;
			},
			accumulate: function(value: any, entity: any, property: any) {
				let v = getValueForSummary(entity, property);
				if (value == null) {
					return v;
				}
				return v < value ? value : v;
			},
			getFinalValue: function(value: any) {
				return value;
			},
		},
		min: {
			getInitialValue: function() {
				return null;
			},
			accumulate: function(value: any, entity: any, property: any) {
				let v = getValueForSummary(entity, property);
				if (value == null) {
					return v;
				}
				return v > value ? value : v;
			},
			getFinalValue: function(value: any) {
				return value;
			},
		},
	};
})();
dorado.validator = {};
dorado.validator.defaultOkMessage = [{ state: "ok" }];
dorado.Toolkits.registerTypeTranslator("validator", function(type: any) {
	return dorado.util.Common.getClassType(
		"dorado.validator." + type + "Validator",
		true,
	);
});
dorado.validator.Validator = $extend(
	[dorado.AttributeSupport, dorado.EventSupport],
	{
		className: "dorado.validator.Validator",
		ATTRIBUTES: {
			name: {},
			defaultResultState: { defaultValue: "error" },
			revalidateOldValue: { defaultValue: true },
		},
		constructor: function(config: any) {
			$invokeSuper.call(this, [config]);
			if (config) {
				this.set(config);
			}
		},
		getListenerScope: function() {
			return this._propertyDef
				? this._propertyDef.get("view")
				: dorado.widget.View.TOP;
		},
		validate: function(data: any, arg: any) {
			let result = this.doValidate(data, arg);
			return (
				dorado.Toolkits.trimMessages(result, this._defaultResultState) ||
				dorado.validator.defaultOkMessage
			);
		},
	},
);
dorado.validator.RemoteValidator = $extend(dorado.validator.Validator, {
	className: "dorado.validator.RemoteValidator",
	ATTRIBUTES: { async: { defaultValue: true }, executingMessage: {} },
	validate: function(data: any, arg: any, callback: any) {
		if (this._async) {
			this.doValidate(data, arg, {
				scope: this,
				callback: function(success: any, result: any) {
					if (success) {
						result = dorado.Toolkits.trimMessages(
							result,
							this._defaultResultState,
						);
					} else {
						result = dorado.Toolkits.trimMessages(
							dorado.Exception.getExceptionMessage(result),
							"error",
						);
					}
					result = result || dorado.validator.defaultOkMessage;
					$callback(callback, true, result);
				},
			});
		} else {
			let result = $invokeSuper.call(this, [data, arg, callback]);
			if (callback) {
				$callback(callback, true, result);
			}
			return result;
		}
	},
});
dorado.validator.BaseValidator = $extend(dorado.validator.Validator, {
	className: "dorado.validator.BaseValidator",
	ATTRIBUTES: { resultMessage: {} },
	validate: function(data: any, arg: any) {
		let result = this.doValidate(data, arg);
		if (this._resultMessage && result && typeof result === "string") {
			result = this._resultMessage;
		}
		return dorado.Toolkits.trimMessages(result, this._defaultResultState);
	},
});
dorado.validator.RequiredValidator = $extend(dorado.validator.BaseValidator, {
	className: "dorado.validator.RequiredValidator",
	ATTRIBUTES: {
		trimBeforeValid: { defaultValue: true },
		acceptZeroOrFalse: { defaultValue: false },
	},
	doValidate: function(data: any, arg: any) {
		let valid = data != null && data !== undefined && data !== "",
			message = "";
		if (valid) {
			if (this._trimBeforeValid && typeof data === "string") {
				valid = jQuery.trim(data) !== "";
			} else {
				if (typeof data === "number" || typeof data === "boolean") {
					valid = !!data || this._acceptZeroOrFalse;
				}
			}
		}
		if (!valid) {
			message = $resource("dorado.data.ErrorContentRequired");
		}
		return message;
	},
});
dorado.validator.LengthValidator = $extend(dorado.validator.BaseValidator, {
	className: "dorado.validator.LengthValidator",
	ATTRIBUTES: {
		minLength: { defaultValue: -1 },
		maxLength: { defaultValue: -1 },
	},
	doValidate: function(data: any, arg: any) {
		if (typeof data === "number") {
			data += "";
		}
		if (typeof data !== "string") {
			return;
		}
		let invalid,
			message = "",
			len = data.length;
		if (this._minLength > 0 && len < this._minLength) {
			invalid = true;
			message += $resource("dorado.data.ErrorContentTooShort", this._minLength);
		}
		if (this._maxLength > 0 && len > this._maxLength) {
			invalid = true;
			if (message) {
				message += "\n";
			}
			message += $resource("dorado.data.ErrorContentTooLong", this._maxLength);
		}
		return message;
	},
});
dorado.validator.CharLengthValidator = $extend(dorado.validator.BaseValidator, {
	className: "dorado.validator.CharLengthValidator",
	ATTRIBUTES: {
		minLength: { defaultValue: -1 },
		maxLength: { defaultValue: -1 },
	},
	doValidate: function(data: any, arg: any) {
		function getBytesLength(data: any) {
			let str = escape(data);
			for (let i = 0, length = 0; i < str.length; i++, length++) {
				if (str.charAt(i) === "%") {
					if (str.charAt(++i) === "u") {
						i += 3;
						length++;
					}
					i++;
				}
			}
			return length;
		}
		if (typeof data === "number") {
			data += "";
		}
		if (typeof data !== "string") {
			return;
		}
		let invalid,
			message = "",
			len = getBytesLength(data);
		if (this._minLength > 0 && len < this._minLength) {
			invalid = true;
			message += $resource("dorado.data.ErrorContentTooShort", this._minLength);
		}
		if (this._maxLength > 0 && len > this._maxLength) {
			invalid = true;
			if (message) {
				message += "\n";
			}
			message += $resource("dorado.data.ErrorContentTooLong", this._maxLength);
		}
		return message;
	},
});
dorado.validator.RangeValidator = $extend(dorado.validator.BaseValidator, {
	className: "dorado.validator.RangeValidator",
	ATTRIBUTES: {
		minValue: {},
		minValueValidateMode: { defaultValue: "ignore" },
		maxValue: {},
		maxValueValidateMode: { defaultValue: "ignore" },
	},
	doValidate: function(data: any, arg: any) {
		let invalidMin,
			invalidMax,
			message = "",
			subMessage = "";
		data = typeof data === "number" ? data : parseFloat(data);
		if (this._minValueValidateMode !== "ignore") {
			if (
				data === this._minValue &&
				this._minValueValidateMode !== "allowEquals"
			) {
				invalidMin = true;
			}
			if (data < this._minValue) {
				invalidMin = true;
			}
			if (this._minValueValidateMode === "allowEquals") {
				subMessage = $resource("dorado.data.ErrorOrEqualTo");
			} else {
				subMessage = "";
			}
			if (invalidMin) {
				message += $resource(
					"dorado.data.ErrorNumberTooLess",
					subMessage,
					this._minValue,
				);
			}
		}
		if (this._maxValueValidateMode !== "ignore") {
			if (
				data === this._maxValue &&
				this._maxValueValidateMode !== "allowEquals"
			) {
				invalidMax = true;
			}
			if (data > this._maxValue) {
				invalidMax = true;
			}
			if (this._maxValueValidateMode === "allowEquals") {
				subMessage = $resource("dorado.data.ErrorOrEqualTo");
			} else {
				subMessage = "";
			}
			if (invalidMax) {
				if (message) {
					message += "\n";
				}
				message += $resource(
					"dorado.data.ErrorNumberTooGreat",
					subMessage,
					this._maxValue,
				);
			}
		}
		if (invalidMin || invalidMax) {
			return message;
		}
	},
});
dorado.validator.EnumValidator = $extend(dorado.validator.BaseValidator, {
	className: "dorado.validator.EnumValidator",
	ATTRIBUTES: { enumValues: {} },
	doValidate: function(data: any, arg: any) {
		if (data == null) {
			return;
		}
		if (
			this._enumValues instanceof Array &&
			this._enumValues.indexOf(data) < 0
		) {
			return $resource("dorado.data.ErrorValueOutOfEnumRange");
		}
	},
});
dorado.validator.RegExpValidator = $extend(dorado.validator.BaseValidator, {
	className: "dorado.validator.RegExpValidator",
	ATTRIBUTES: {
		whiteRegExp: {},
		blackRegExp: {},
		validateMode: { defaultValue: "whiteBlack" },
	},
	doValidate: function(data: any, arg: any) {
		function toRegExp(text: any) {
					let regexp = null;
					if (text) {
						// CSP 兼容：使用 new RegExp 替代 eval
						if (text.charAt(0) === "/" && text.lastIndexOf("/") === text.length - 1 && text.length > 1) {
							// 格式：/pattern/flags
							const lastSlash = text.lastIndexOf("/");
							const pattern = text.substring(1, lastSlash);
							const flags = text.substring(lastSlash + 1);
							regexp = new RegExp(pattern, flags);
						} else {
							regexp = new RegExp(text);
						}
					}
					return regexp;
				}
		if (typeof data !== "string" || data === "") {
			return;
		}
		let whiteRegExp = toRegExp(this._whiteRegExp),
			blackRegExp = toRegExp(this._blackRegExp);
		let whiteMatch = whiteRegExp ? data.match(whiteRegExp) : false;
		let blackMatch = blackRegExp ? data.match(blackRegExp) : false;
		let valid;
		if (this._validateMode === "whiteBlack") {
			valid = whiteRegExp ? whiteMatch : true;
			if (valid && blackRegExp) {
				valid = !blackMatch;
			}
		} else {
			valid = blackRegExp ? !blackMatch : true;
			if (valid && whiteRegExp) {
				valid = whiteMatch;
			}
		}
		if (!valid) {
			return $resource("dorado.data.ErrorBadFormat", data);
		}
	},
});
dorado.validator.AjaxValidator = $extend(dorado.validator.RemoteValidator, {
	className: "dorado.validator.AjaxValidator",
	ATTRIBUTES: {
		service: {},
		ajaxAction: {
			setter: function(ajaxAction: any) {
				this._ajaxAction = dorado.widget.ViewElement.getComponentReference(
					this,
					"ajaxAction",
					ajaxAction,
				);
			},
		},
	},
	EVENTS: { beforeExecute: {} },
	constructor: function(config: any) {
		if (!dorado.widget || !dorado.widget.AjaxAction) {
			this._disabled = true;
			throw new dorado.Exception(
				"'dorado.validator.AjaxValidator' is disabled because the 'dorado.widget.AjaxAction' is not available.",
			);
		}
		$invokeSuper.call(this, arguments);
	},
	doValidate: function(data: any, arg: any, callback: any) {
		let eventArg = {
			data: data,
			property: arg.property,
			entity: arg.entity,
			parameter: data,
		};
		this.fireEvent("beforeExecute", this, eventArg);
		let ajaxAction = this._ajaxAction;
		if (!ajaxAction) {
			this._ajaxAction = ajaxAction = new dorado.widget.AjaxAction();
		}
		let config = { modal: false, async: this._async };
		if (this._executingMessage) {
			config.executingMessage = this._executingMessage;
		}
		if (this._service) {
			config.service = this._service;
		}
		config.parameter = eventArg.parameter;
		ajaxAction.set(config);
		let retval = ajaxAction.execute(this._async ? callback : null);
		if (retval && !this._async) {
			return ajaxAction.get("returnValue");
		}
	},
});
dorado.validator.CustomValidator = $extend(dorado.validator.Validator, {
	className: "dorado.validator.CustomValidator",
	EVENTS: { onValidate: {} },
	doValidate: function(data: any, arg: any) {
		let result;
		try {
			let eventArg = {
				data: data,
				property: arg ? arg.property : null,
				entity: arg ? arg.entity : null,
			};
			this.fireEvent("onValidate", this, eventArg);
			result = eventArg.result;
		} catch (e) {
			dorado.Exception.removeException(e);
			result = dorado.Exception.getExceptionMessage(e);
		}
		return result;
	},
});
