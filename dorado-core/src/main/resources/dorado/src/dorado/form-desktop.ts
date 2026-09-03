// @ts-nocheck
/// <reference path="globals.d.ts" />
dorado.widget.DropDownBox = $extend(dorado.widget.FloatContainer, {
	$className: "dorado.widget.DropDownBox",
	_useInnerWidth: true,
	_useInnerHeight: true,
	ATTRIBUTES: {
		className: { defaultValue: "d-drop-down-box" },
		showAnimateType: { defaultValue: "safeSlide" },
		hideAnimateType: { defaultValue: "none" },
		focusAfterShow: { defaultValue: false },
		editor: {},
		dropDown: {},
		control: {
			writeOnce: true,
			setter: function(control: any) {
				if (this._control === control) {
					return;
				}
				this._control = control;
				this.removeAllChildren();
				this.addChild(control);
			},
		},
	},
	EVENTS: { onDropDownBoxShow: {} },
	_constructor: function(config: any) {
		$invokeSuper.call(this, arguments);
		if (dorado.Browser.msie && dorado.Browser.version < 9) {
			this._showAnimateType = "none";
		}
	},
	createDom: function() {
		let dom = $invokeSuper.call(this);
		dom.id = "d_" + ((this._dropDown && this._dropDown._id) || this._uniqueId);
		return dom;
	},
	doAfterShow: function(editor: any) {
		if (this._dropDown._editor) {
			$invokeSuper.call(this, arguments);
			this.fireEvent("onDropDownBoxShow", this);
		}
	},
});
(function() {
	DropDownFilterTrigger = $extend(dorado.widget.Trigger, {
		$className: "dorado.widget.DropDownFilterTrigger",
		ATTRIBUTES: { iconClass: { defaultValue: "d-trigger-icon-filter" } },
		execute: function(editor: any) {
			let dropDown = this._dropDown;
			if (dropDown) {
				dropDown.onFilterItems(editor.doGetText());
			}
		},
	});
	DropDownResetFilterTrigger = $extend(dorado.widget.Trigger, {
		$className: "dorado.widget.DropDownResetFilterTrigger",
		ATTRIBUTES: { iconClass: { defaultValue: "d-trigger-icon-reset" } },
		execute: function(editor: any) {
			let dropDown = this._dropDown;
			if (dropDown) {
				dropDown.onFilterItems();
			}
		},
	});
	let globalFilterTrigger;
	function getDropDownFilterTrigger() {
		if (!globalFilterTrigger) {
			globalFilterTrigger = new DropDownFilterTrigger();
		}
		return globalFilterTrigger;
	}
	let globalResetFilterTrigger;
	function getDropDownResetFilterTrigger() {
		if (!globalResetFilterTrigger) {
			globalResetFilterTrigger = new DropDownResetFilterTrigger();
		}
		return globalResetFilterTrigger;
	}
	dorado.widget.RowListDropDown = $extend(dorado.widget.DropDown, {
		$className: "dorado.widget.RowListDropDown",
		ATTRIBUTES: {
			property: {},
			displayProperty: {},
			columns: { writeBeforeReady: true },
			dynaFilter: {},
			editable: {
				getter: function() {
					return this._editable || this._dynaFilter;
				},
			},
			filterOnOpen: {},
			filterOnTyping: { defaultValue: true },
			minFilterInterval: { defaultValue: 240 },
			useEmptyItem: { writeBeforeReady: true },
		},
		EVENTS: { onFilterItems: {}, onFilterItem: {} },
		_constructor: function() {
			$import("list", dorado._NULL_FUNCTION);
			$invokeSuper.call(this, arguments);
		},
		getSelectedValue: function() {
			let rowList = this.get("box.control");
			if (!this._rowSelected) {
				return;
			}
			let value = rowList.getCurrentItem();
			if (value && this._property) {
				if (value instanceof dorado.Entity) {
					value = value.get(this._property);
				} else {
					value = value[this._property];
				}
				if (value === undefined) {
					value = null;
				}
			}
			return value;
		},
		getEntityForAssignment: function() {
			let rowList = this.get("box.control");
			return rowList.getCurrentItem();
		},
		createDropDownBox: function() {
			let dropDown = this,
				box = $invokeSuper.call(this, arguments),
				rowList;
			let config = {
				style: "border: none",
				allowNoCurrent: true,
				onDataRowClick: function(self: any) {
					self.set("highlightCurrentRow", (dropDown._rowSelected = true));
					dropDown.close(dropDown.getSelectedValue());
				},
				onFilterItem: function(self: any, arg: any) {
					if (arg && arg.criterions && arg.criterions.length > 0) {
						arg.filterValue = arg.criterions[0].value;
					}
					dropDown.fireEvent("onFilterItem", dropDown, arg);
				},
			};
			if (this._columns) {
				if (!dorado.widget.Grid) {
					throw new dorado.ResourceException(
						"dorado.core.packageMissingError",
						"grid",
					);
				}
				config.stretchColumnsMode = "stretchableColumns";
				config.columns = this._columns;
				config.readOnly = true;
				rowList = new dorado.widget.Grid(config);
			} else {
				rowList = new dorado.widget.ListBox(config);
			}
			box.set({ control: rowList });
			return box;
		},
		initDropDownData: function(box: any, editor: any) {
			let rowList = box.get("control");
			let items = this.getDropDownItems() || [];
			if (rowList instanceof dorado.widget.AbstractListBox) {
				rowList.set("property", this._displayProperty || this._property);
			}
			let text = editor.doGetText();
			if (
				this._filterOnOpen &&
				(text.length > 0 || (editor._lastFilterValue || "") !== text)
			) {
				rowList.set("items", items);
				this.onFilterItems(text);
			} else {
				delete rowList._itemModel._filterParams;
				rowList.set("items", items);
			}
			let value = editor.get("value"),
				currentIndex = -1;
			if (items && value) {
				if (items instanceof Array) {
					if (!this._property) {
						currentIndex = items.indexOf(value);
					} else {
						for (let i = 0; i < items.length; i++) {
							let item = items[i];
							if (item == null || item === undefined) {
								continue;
							}
							if (item instanceof dorado.Entity) {
								if (item.get(this._property) === value) {
									currentIndex = i;
									break;
								}
							} else {
								if (item[this._property] === value) {
									currentIndex = i;
									break;
								}
							}
						}
					}
				}
			}
			rowList.set("currentIndex", currentIndex);
		},
		initDropDownBox: function(box: any, editor: any, forceInitData: any) {
			$invokeSuper.call(this, arguments);
			let rowList = box.get("control");
			if ((!this._boxVisible && this.initDropDownData) || forceInitData) {
				rowList._ignoreRefresh++;
				this.initDropDownData(box, editor);
				rowList._ignoreRefresh--;
			}
			rowList.set(
				"highlightCurrentRow",
				(this._rowSelected = !!rowList.getCurrentItem()),
			);
			let itemCount = rowList._itemModel.getItemCount();
			let cellCount = itemCount;
			if (
				dorado.widget.AbstractGrid &&
				rowList instanceof dorado.widget.AbstractGrid
			) {
				cellCount = rowList.get("dataColumns").length * itemCount;
			}
			if (!this._height) {
				let useMaxHeight = true,
					refreshed = false;
				if (
					this._realMaxHeight &&
					(!itemCount ||
						this._realMaxHeight / (rowList._rowHeight + 1) > itemCount + 1)
				) {
					rowList.set({ height: "auto", scrollMode: "simple" });
					rowList._forceRefresh = true;
					rowList.refresh();
					rowList._forceRefresh = false;
					refreshed = true;
					let height = $fly(rowList._dom).outerHeight();
					if (height <= this._realMaxHeight) {
						useMaxHeight = false;
					}
				}
				if (useMaxHeight && this._realMaxHeight) {
					rowList.set({
						height: this._realMaxHeight - (this._edgeHeight || 0),
						scrollMode: cellCount > 300 ? "viewport" : "lazyRender",
					});
					rowList._forceRefresh = true;
					rowList.refresh();
					rowList._forceRefresh = false;
					refreshed = true;
				}
				if (!refreshed) {
					rowList.refresh();
				}
			} else {
				rowList.set({
					height: this._height - (this._edgeHeight || 0),
					scrollMode: cellCount > 300 ? "viewport" : "lazyRender",
				});
				rowList.refresh();
			}
		},
		onDropDownBoxShow: function() {
			let rowList = this.get("box.control");
			let editor = this._editor;
			if (this._dynaFilter && editor instanceof dorado.widget.AbstractTextBox) {
				let dropDown = this;
				if (dropDown._resetFilter) {
					dropDown.onFilterItems();
					delete dropDown._resetFilter;
				}
				editor.bind("onTextEdit._filter", function() {
					if (dropDown._filterOnTyping && dropDown.get("opened")) {
						dorado.Toolkits.setDelayedAction(
							dropDown,
							"$filterTimeId",
							function() {
								if (!dropDown._rowSelected && editor === dropDown._editor) {
									dropDown.onFilterItems(editor.doGetText());
								}
							},
							dropDown._minFilterInterval,
						);
					}
				});
			}
		},
		resetFilter: function() {
			let rowList = this.get("box.control");
			if (rowList) {
				this.onFilterItems();
			} else {
				this._resetFilter = true;
			}
		},
		open: function(editor: any) {
			$invokeSuper.call(this, arguments);
			if (this._dynaFilter && !this._filterOnTyping) {
				let triggers = editor.get("trigger");
				if (!(triggers instanceof Array)) {
					triggers = [triggers];
				}
				let resetFilterTrigger = getDropDownResetFilterTrigger();
				let filterTrigger = getDropDownFilterTrigger();
				triggers.remove(filterTrigger);
				triggers.remove(resetFilterTrigger);
				triggers.insert(resetFilterTrigger);
				triggers.insert(filterTrigger);
				resetFilterTrigger._dropDown = this;
				filterTrigger._dropDown = this;
				editor.set("trigger", triggers);
			}
		},
		close: function(selectedValue: any) {
			let editor = this._editor;
			if (this._dynaFilter && !this._filterOnTyping) {
				let triggers = editor.get("trigger");
				if (!(triggers instanceof Array)) {
					triggers = [triggers];
				}
				let resetFilterTrigger = getDropDownResetFilterTrigger();
				let filterTrigger = getDropDownFilterTrigger();
				triggers.remove(filterTrigger);
				triggers.remove(resetFilterTrigger);
				filterTrigger._dropDown = null;
				resetFilterTrigger._dropDown = null;
				editor.set("trigger", triggers);
			}
			if (editor instanceof dorado.widget.AbstractTextBox) {
				editor.unbind("onTextEdit._filter");
			}
			if (editor._lastFilterValue) {
				delete editor._lastFilterValue;
			}
			$invokeSuper.call(this, arguments);
		},
		onFilterItems: function(filterValue: any) {
			let rowList = this.get("box.control");
			if (!rowList) {
				return;
			}
			this._editor._lastFilterValue = filterValue;
			let arg = {
				filterOperator: "like*",
				filterValue: filterValue,
				processDefault: true,
			};
			this.fireEvent("onFilterItems", this, arg);
			if (!arg.processDefault) {
				return;
			}
			let realFilterValue;
			if (filterValue !== arg.filterValue) {
				realFilterValue = arg.filterValue;
			} else {
				if (filterValue) {
					realFilterValue = filterValue.toLowerCase();
				}
			}
			let filterParams;
			if (realFilterValue && filterValue.length > 0) {
				let property = this._displayProperty || this._property;
				filterParams = [
					{
						property: property,
						operator: arg.filterOperator,
						value: realFilterValue,
					},
				];
			}
			rowList.set("highlightCurrentRow", (this._rowSelected = false));
			rowList.filter(filterParams);
			let box = this.get("box");
			if (box && box.get("visible")) {
				this.locate();
			}
		},
		doOnEditorKeyDown: function(editor: any, evt: any) {
			function assignValue(dropdown: any, rowList: any) {
				let property = dropdown._displayProperty || dropdown._property;
				let value = rowList.getCurrentItem();
				if (value && property) {
					if (value instanceof dorado.Entity) {
						value = value.get(property);
					} else {
						value = value[property];
					}
				}
				let eventArg = {
					editor: editor,
					selectedValue: value,
					processDefault: true,
				};
				dropdown.fireEvent("onValueSelect", dropdown, eventArg);
				let entityForAssignment;
				if (dropdown.getEntityForAssignment) {
					entityForAssignment = dropdown.getEntityForAssignment();
				}
				if (eventArg.processDefault && eventArg.selectedValue !== undefined) {
					dropdown.assignValue(editor, entityForAssignment, eventArg);
				}
			}
			let dropdown = this,
				retValue = true;
			if (this.get("opened")) {
				let rowList = this.get("box.control");
				switch (evt.keyCode) {
					case 38:
					case 40:
						if (!rowList._highlightCurrentRow) {
							rowList.set(
								"highlightCurrentRow",
								(dropdown._rowSelected = true),
							);
							assignValue(dropdown, rowList);
							retValue = false;
						} else {
							dorado.widget.disableKeyBubble = true;
							try {
								let oldCurrentItem = rowList.getCurrentItem();
								retValue = rowList.onKeyDown(evt);
								if (rowList.getCurrentItem() !== oldCurrentItem) {
									assignValue(dropdown, rowList);
								}
							} finally {
								dorado.widget.disableKeyBubble = false;
							}
						}
						break;
					case 13:
						this.close(this.getSelectedValue());
						retValue = false;
						break;
					case 27:
						this.close();
						retValue = false;
						break;
					default:
						if (dropdown._rowSelected) {
							rowList = dropdown.get("box.control");
							rowList.set(
								"highlightCurrentRow",
								(dropdown._rowSelected = false),
							);
						}
						try {
							retValue = rowList.onKeyDown(evt);
						} finally {
							dorado.widget.disableKeyBubble = false;
						}
				}
			}
			if (retValue) {
				retValue = $invokeSuper.call(this, arguments);
			}
			return retValue;
		},
	});
	dorado.widget.ListDropDown = $extend(dorado.widget.RowListDropDown, {
		$className: "dorado.widget.ListDropDown",
		ATTRIBUTES: {
			items: {
				setter: function(items: any) {
					if (this._useEmptyItem) {
						if (items instanceof Array) {
							let emptyItem = items[0];
							if (!emptyItem || !emptyItem.isEmptyItem) {
								items.insert({ isEmptyItem: true }, 0);
							}
						} else {
							if (items instanceof dorado.EntityList) {
								let emptyItem = items.getFirst();
								if (!emptyItem || !emptyItem.isEmptyItem) {
									emptyItem = items.insert({}, "begin");
									emptyItem.isEmptyItem = true;
								}
							} else {
								if (items == null) {
									items = [{ isEmptyItem: true }];
								}
							}
						}
					}
					this._items = items;
				},
			},
		},
		_constructor: function(config: any) {
			let items = config && config.items;
			delete config.items;
			$invokeSuper.call(this, [config]);
			if (items) {
				this.set("items", items);
			}
		},
		getDropDownItems: function() {
			return this._items;
		},
	});
	dorado.widget.AutoMappingDropDown = $extend(dorado.widget.RowListDropDown, {
		$className: "dorado.widget.AutoMappingDropDown",
		ATTRIBUTES: { dynaFilter: { defaultValue: true } },
		getDropDownItems: function() {
			let editor = this._editor,
				pd = editor._propertyDef;
			let items = editor.get("mapping");
			if (!items) {
				if (!pd) {
					if (
						dorado.Object.isInstanceOf(
							editor,
							dorado.widget.PropertyDataControl,
						)
					) {
						pd = editor.getBindingPropertyDef();
					}
				}
				if (!pd) {
					let entity = editor.get("entity");
					if (entity instanceof dorado.Entity) {
						pd = entity.getPropertyDef(editor.get("property"));
					}
				}
				if (pd) {
					items = pd.get("mapping");
				}
				this._property = "value";
				this._displayProperty = null;
			} else {
				this._property = "key";
				this._displayProperty = "value";
			}
			if (this._useEmptyItem) {
				items = [{ key: null, value: null }].concat(items);
			}
			return items;
		},
	});
	dorado.widget.View.registerDefaultComponent(
		"autoMappingDropDown1",
		function() {
			return new dorado.widget.AutoMappingDropDown();
		},
	);
	dorado.widget.View.registerDefaultComponent(
		"autoMappingDropDown2",
		function() {
			return new dorado.widget.AutoMappingDropDown({ useEmptyItem: true });
		},
	);
	dorado.widget.View.registerDefaultComponent(
		"autoOpenMappingDropDown1",
		function() {
			return new dorado.widget.AutoMappingDropDown({ autoOpen: true });
		},
	);
	dorado.widget.View.registerDefaultComponent(
		"autoOpenMappingDropDown2",
		function() {
			return new dorado.widget.AutoMappingDropDown({
				autoOpen: true,
				useEmptyItem: true,
			});
		},
	);
})();
dorado.widget.DataSetDropDown = $extend(dorado.widget.ListDropDown, {
	$className: "dorado.widget.DataSetDropDown",
	ATTRIBUTES: {
		dataSet: { componentReference: true },
		dataPath: {},
		useDataBinding: { defaultValue: true },
		filterMode: { defaultValue: "serverSide" },
		reloadDataOnOpen: {},
		dynaFilter: {},
		filterOnTyping: { defaultValue: false },
	},
	EVENTS: { onSetFilterParameter: {} },
	open: function(editor: any) {
		let dropdown = this,
			dataSet = dropdown._dataSet,
			superClass = $getSuperClass();
		let doOpen = function(flush: any) {
			if (dropdown._useDataBinding) {
				if (dropdown._useEmptyItem) {
					dataSet.bind("onLoadData._insertEmptyItem", function(self: any, arg: any) {
						if (arg.pageNo === 1) {
							let items = self.getData(self._dataPath);
							if (items instanceof dorado.EntityList) {
								let emptyItem = items.insert(null, "begin");
								emptyItem.isEmptyItem = true;
							}
						}
					});
				}
				dataSet.bind("onLoadData._relocate", function() {
					if (dropdown._duringShowAnimation) {
						dropdown._shouldRelocate = true;
					} else {
						dropdown.locate();
					}
				});
				dropdown.bind(
					"onClose",
					function() {
						if (dropdown._useDataBinding && dropdown._useEmptyItem) {
							dataSet.unbind("onLoadData._insertEmptyItem");
						}
						dataSet.unbind("onLoadData._relocate");
					},
					{ once: true },
				);
			}
			dataSet.getDataAsync(
				dropdown._dataPath,
				function(data: any) {
					if (!dropdown._useDataBinding) {
						dropdown.set("items", data);
					} else {
						if (
							!flush &&
							dropdown._useEmptyItem &&
							data &&
							data instanceof dorado.EntityList
						) {
							let emptyItem = data.getFirst();
							if (!emptyItem || !emptyItem.isEmptyItem) {
								emptyItem = data.insert({}, "begin");
								emptyItem.isEmptyItem = true;
							}
						}
					}
					if (editor && editor._actualVisible && editor._focused) {
						superClass.prototype.open.call(dropdown, editor);
					}
				},
				{ loadMode: "always", flush: flush },
			);
		};
		this._editor = editor;
		if (this._useDataBinding && this._filterOnOpen) {
			let filterValue = editor.get("text");
			if ((editor._lastFilterValue || "") !== filterValue) {
				this.onFilterItems(filterValue, function() {
					doOpen(false);
				});
			} else {
				doOpen(false);
			}
		} else {
			let lastFilterValue;
			if (this._filterOnOpen) {
				lastFilterValue = editor._lastFilterValue;
			} else {
				delete editor._lastFilterValue;
				dataSet &&
					dataSet._sysParameter &&
					dataSet._sysParameter.remove("filterValue");
			}
			doOpen(this._reloadDataOnOpen || lastFilterValue != null);
		}
	},
	createDropDownBox: function() {
		if (this._useDataBinding) {
			let dropDown = this,
				box = dorado.widget.DropDown.prototype.createDropDownBox.call(this),
				rowList;
			let config = {
				dataSet: this._dataSet,
				dataPath: this._dataPath,
				style: "border: none",
				onDataRowClick: function(rowList: any) {
					rowList.set("highlightCurrentRow", (dropDown._rowSelected = true));
					dropDown.close(dropDown.getSelectedValue());
				},
				onFilterItem: function(rowList: any, arg: any) {
					if (arg && arg.criterions && arg.criterions.length > 0) {
						arg.filterValue = arg.criterions[0].value;
					}
					dropDown.fireEvent("onFilterItem", dropDown, arg);
				},
			};
			if (this._columns) {
				config.stretchColumnsMode = "stretchableColumns";
				config.columns = this._columns;
				config.readOnly = true;
				rowList = new dorado.widget.DataGrid(config);
			} else {
				config.width = "100%";
				rowList = new dorado.widget.DataListBox(config);
			}
			box.set({ style: { overflow: "hidden" }, control: rowList });
			return box;
		} else {
			return $invokeSuper.call(this, arguments);
		}
	},
	initDropDownData: function(box: any, editor: any) {
		if (!this._useDataBinding) {
			$invokeSuper.call(this, arguments);
		} else {
			let rowList = box.get("control");
			if (rowList instanceof dorado.widget.AbstractListBox) {
				rowList.set("property", this._displayProperty || this._property);
			}
		}
	},
	getDropDownItems: function() {
		return this._items;
	},
	onFilterItems: function(filterValue: any, callback: any) {
		let dataSet = this._dataSet;
		if (this._useDataBinding) {
			let arg = { filterValue: filterValue, processDefault: true };
			this.fireEvent("onFilterItems", this, arg);
			if (arg.processDefault) {
				if (this._filterMode === "clientSide") {
					$invokeSuper.call(this, [filterValue, callback]);
					this._editor._lastFilterValue = filterValue;
				} else {
					arg = { dataSet: dataSet, filterValue: filterValue };
					if (this.getListenerCount("onSetFilterParameter") > 0) {
						this.fireEvent("onSetFilterParameter", this, arg);
						filterValue = arg.filterValue;
					}
					let sysParameter = dataSet._sysParameter;
					if (!sysParameter) {
						dataSet._sysParameter = sysParameter = new dorado.util.Map();
					}
					if (filterValue) {
						sysParameter.put("filterValue", filterValue);
					} else {
						sysParameter.remove("filterValue");
					}
					dataSet.clear();
					let dropdown = this;
					dataSet.flushAsync(function() {
						if (dropdown._editor) {
							dropdown._editor._lastFilterValue = filterValue;
						}
						$callback(callback);
					});
				}
			}
		} else {
			$invokeSuper.call(this, [filterValue, callback]);
			this._editor._lastFilterValue = filterValue;
		}
	},
	onDropDownBoxShow: function() {
		if (this._useDataBinding) {
			let filterOnOpen = this._filterOnOpen;
			this._filterOnOpen = false;
			$invokeSuper.call(this, arguments);
			this._filterOnOpen = filterOnOpen;
		} else {
			$invokeSuper.call(this, arguments);
		}
	},
	doOnEditorKeyDown: function(editor: any, evt: any) {
		if (evt.keyCode === 13 && this.get("dynaFilter")) {
			let filterValue = editor.get("text");
			if (
				!this._rowSelected &&
				(editor._lastFilterValue || "") !== filterValue
			) {
				this.onFilterItems(filterValue);
				return false;
			}
		}
		return $invokeSuper.call(this, arguments);
	},
});
dorado.widget.CustomDropDown = $extend(dorado.widget.DropDown, {
	$className: "dorado.widget.CustomDropDown",
	ATTRIBUTES: {
		control: { writeBeforeReady: true, innerComponent: "" },
		view: {
			setter: function(view: any) {
				if (this._view === view) {
					return;
				}
				$invokeSuper.call(this, [view]);
				if (view && this._control) {
					this._control.set("view", view);
				}
			},
		},
	},
	createDropDownBox: function() {
		let box,
			control = this._control;
		if (dorado.Object.isInstanceOf(control, dorado.widget.FloatControl)) {
			box = control;
		} else {
			box = $invokeSuper.call(this, arguments);
			box.set("control", control);
			box.bind("beforeShow", function() {
				let $box = jQuery(box.getDom().firstChild),
					boxWidth = $box.width(),
					boxHeight = $box.height();
				let $dom = jQuery(control.getDom()),
					realWidth = $dom.outerWidth(),
					realHeight = $dom.outerHeight(),
					shouldRefresh;
				if (realWidth < boxWidth - box._dropDown._edgeWidth) {
					control.set("width", boxWidth - box._dropDown._edgeWidth);
					shouldRefresh = true;
				}
				if (realHeight < boxHeight - box._dropDown._edgeHeight) {
					control.set("height", boxHeight - box._dropDown._edgeHeight);
					shouldRefresh = true;
				}
				if (shouldRefresh) {
					control.refresh();
				}
			});
		}
		return box;
	},
});
(function() {
	dorado.widget.NumberGridPicker = $extend(dorado.widget.Control, {
		$className: "dorado.widget.NumberGridPicker",
		tabStop: true,
		ATTRIBUTES: {
			className: {},
			formatter: {},
			columnCount: { writeBeforeReady: true },
			rowCount: { writeBeforeReady: true },
			cellClassName: { writeBeforeReady: true },
			selectedCellClassName: { writeBeforeReady: true },
			rowClassName: { writeBeforeReady: true },
			tableClassName: { writeBeforeReady: true },
			min: {},
			max: {},
			step: {},
			value: {},
		},
		EVENTS: { onPick: {} },
		createDom: function() {
			let picker = this,
				min = picker._min === undefined ? 1 : picker._min,
				max = picker._max,
				step = picker._step || 1,
				columnCount = picker._columnCount || 1,
				rowCount = picker._rowCount || 1,
				doms = {};
			let dom = $DomUtils.xCreate(
				{
					tagName: "table",
					className:
						(picker._className || "") + " " + (picker._tableClassName || ""),
					content: { tagName: "tbody", contextKey: "body" },
				},
				null,
				doms,
			);
			picker._doms = doms;
			let formatter = picker._formatter;
			for (let i = 0; i < rowCount; i++) {
				let tr = document.createElement("tr");
				for (let j = 0; j < columnCount; j++) {
					let td = document.createElement("td"),
						value = min + step * (i * columnCount + j);
					td.className = picker._cellClassName || "";
					if (typeof formatter === "function") {
						td.innerText = formatter(value);
					} else {
						td.innerText = value;
					}
					tr.appendChild(td);
				}
				tr.className = picker._rowClassName || "";
				doms.body.appendChild(tr);
			}
			$fly(dom).click(function(event: any) {
				let position = $DomUtils.getCellPosition(event),
					step = picker._step || 1;
				if (position && position.element) {
					if (position.row >= picker._rowCount) {
						return;
					}
					let min = picker._min === undefined ? 1 : picker._min,
						step = (step = picker._step || 1),
						value = min + step * (position.row * columnCount + position.column);
					picker._value = value;
					picker.fireEvent("onPick", picker, { value: value });
					picker.refreshValue();
				}
			});
			return dom;
		},
		refreshTable: function() {
			let picker = this,
				dom = picker._doms.body,
				formatter = picker._formatter;
			let step = picker._step || 1,
				min = picker._min === undefined ? 1 : picker._min,
				columnCount = picker._columnCount,
				rowCount = picker._rowCount,
				row = Math.floor((value - min) / columnCount),
				column = (value - min) % columnCount;
			for (let i = 0; i < rowCount; i++) {
				let rows = dom.rows[i];
				for (let j = 0; j < columnCount; j++) {
					let cell = rows.cells[j],
						value = min + step * (i * columnCount + j);
					cell.className = picker._cellClassName || "";
					if (typeof formatter === "function") {
						cell.innerText = formatter(value);
					} else {
						cell.innerText = value;
					}
				}
			}
		},
		refreshValue: function() {
			let picker = this,
				dom = picker._doms.body,
				lastSelectedCell = picker._lastSelectedCell,
				value = picker._value;
			if (isNaN(picker._value)) {
				return;
			}
			let step = picker._step || 1,
				min = picker._min === undefined ? 1 : picker._min,
				columnCount = picker._columnCount,
				rowCount = picker._rowCount,
				row = Math.floor((value - min) / columnCount),
				column = (value - min) % columnCount,
				cell;
			if (dom.rows[row]) {
				cell = dom.rows[row].cells[column];
			} else {
				return;
			}
			if (lastSelectedCell) {
				$fly(lastSelectedCell).removeClass(
					picker._selectedCellClassName || "selected",
				);
			}
			if (cell) {
				$fly(cell).addClass(picker._selectedCellClassName || "selected");
			}
			picker._lastSelectedCell = cell;
		},
		refreshDom: function(dom: any) {
			$invokeSuper.call(this, arguments);
			this.refreshTable();
			this.refreshValue();
		},
	});
	dorado.widget.MonthPicker = $extend(dorado.widget.NumberGridPicker, {
		tabStop: true,
		ATTRIBUTES: {
			height: { independent: true, readOnly: true },
			className: { defaultValue: "d-month-picker" },
			rowCount: { defaultValue: 6 },
			min: { defaultValue: 0 },
			max: { defaultValue: 11 },
			columnCount: { defaultValue: 2 },
			tableClassName: { defaultValue: "month-table" },
			rowClassName: { defaultValue: "number-row" },
			value: {},
		},
		createDom: function() {
			let monthLabel =
					$resource("dorado.baseWidget.AllMonths") ||
					$resource("dorado.core.AllMonths") ||
					"",
				monthLabels = monthLabel.split(",");
			this._formatter = function(value: any) {
				return monthLabels[value];
			};
			return $invokeSuper.call(this, arguments);
		},
		doOnKeyDown: function(event: any) {
			let picker = this,
				month = picker.get("value");
			switch (event.keyCode) {
				case 37:
					picker.set("value", month === 0 ? 11 : month - 1);
					break;
				case 39:
					picker.set("value", month === 11 ? 0 : month + 1);
					break;
				case 13:
					picker.fireEvent("onPick", picker);
					return false;
			}
		},
	});
	dorado.widget.YearPicker = $extend(dorado.widget.NumberGridPicker, {
		tabStop: true,
		ATTRIBUTES: {
			height: { independent: true, readOnly: true },
			className: { defaultValue: "d-year-picker" },
			rowCount: { defaultValue: 5 },
			columnCount: { defaultValue: 2 },
			tableClassName: { defaultValue: "year-table" },
			rowClassName: { defaultValue: "number-row" },
			value: {
				setter: function(value: any) {
					let picker = this,
						oldValue = picker._value,
						startYear,
						remainder;
					remainder = value % 10;
					picker._min = value - (remainder === 0 ? 10 : remainder) + 1;
					picker._value = value;
				},
			},
		},
		createDom: function() {
			let picker = this,
				dom = $invokeSuper.call(picker, arguments);
			let preYearButton = new dorado.widget.SimpleIconButton({
				iconClass: "prev-year-button",
				onClick: function() {
					picker.set("value", picker._value - 10);
				},
			});
			let nextYearButton = new dorado.widget.SimpleIconButton({
				iconClass: "next-year-button",
				onClick: function() {
					picker.set("value", picker._value + 10);
				},
			});
			let buttonRow = document.createElement("tr"),
				prevYearCell = document.createElement("td"),
				nextYearCell = document.createElement("td");
			buttonRow.className = "btn-row";
			prevYearCell.align = "center";
			nextYearCell.align = "center";
			buttonRow.appendChild(prevYearCell);
			buttonRow.appendChild(nextYearCell);
			picker._doms.body.appendChild(buttonRow);
			preYearButton.render(prevYearCell);
			nextYearButton.render(nextYearCell);
			picker.registerInnerControl(preYearButton);
			picker.registerInnerControl(nextYearButton);
			return dom;
		},
		doOnKeyDown: function(event: any) {
			let picker = this,
				year = picker.get("value");
			switch (event.keyCode) {
				case 38:
					picker.set("value", year - 1);
					break;
				case 40:
					picker.set("value", year + 1);
					break;
				case 33:
					picker.set("value", year - 10);
					break;
				case 34:
					picker.set("value", year + 10);
					break;
				case 13:
					picker.fireEvent("onPick", picker);
					return false;
			}
		},
	});
	dorado.widget.YearMonthPicker = $extend(dorado.widget.Control, {
		$className: "dorado.widget.YearMonthPicker",
		_opened: false,
		tabStop: true,
		ATTRIBUTES: {
			height: { independent: true },
			className: { defaultValue: "d-year-month-picker" },
			year: {
				defaultValue: new Date().getFullYear(),
				path: "_yearTablePicker.value",
			},
			month: { defaultValue: 0, path: "_monthTablePicker.value" },
			pickOnClickMonth: { defaultValue: false },
		},
		EVENTS: { onPick: {}, onCancel: {} },
		updateDate: function(date: any, month: any) {
			let picker = this,
				year = date;
			if (date instanceof Date) {
				picker.set("year", date.getFullYear());
				picker.set("month", date.getMonth());
			} else {
				if (!isNaN(year) && !isNaN(month)) {
					picker.set("year", year);
					picker.set("month", month);
				}
			}
		},
		createDom: function() {
			let monthLabel = $resource("dorado.baseWidget.AllMonths") || "",
				monthLabels = monthLabel.split(",");
			let picker = this,
				doms = {},
				dom = $DomUtils.xCreate(
					{
						tagName: "div",
						className: picker._className,
						content: [
							{
								tagName: "div",
								className: "btns-pane",
								contextKey: "buttonPanel",
							},
						],
					},
					null,
					doms,
				);
			let monthLastOverCell, yearLastOverCell;
			picker._doms = doms;
			let monthTablePicker = new dorado.widget.MonthPicker({
				value: picker._month || 0,
				onPick: function(self: any, arg: any) {
					if (picker._pickOnClickMonth) {
						picker.fireEvent("onPick", picker);
					}
				},
			});
			monthTablePicker.render(dom, doms.buttonPanel);
			doms.monthTable = monthTablePicker._dom;
			picker._monthTablePicker = monthTablePicker;
			picker.registerInnerControl(monthTablePicker);
			let yearTablePicker = new dorado.widget.YearPicker({
				value: picker._year,
			});
			yearTablePicker.render(dom, doms.monthTable);
			doms.yearTable = yearTablePicker._dom;
			picker._yearTablePicker = yearTablePicker;
			picker.registerInnerControl(yearTablePicker);
			let okButton = new dorado.widget.Button({
				caption: $resource("dorado.baseWidget.YMPickerConfirm"),
				ui: "highlight",
				onClick: function() {
					picker.fireEvent("onPick", picker);
				},
			});
			okButton.render(doms.buttonPanel);
			let cancelButton = new dorado.widget.Button({
				caption: $resource("dorado.baseWidget.YMPickerCancel"),
				onClick: function() {
					picker.fireEvent("onCancel", picker);
				},
			});
			cancelButton.render(doms.buttonPanel);
			picker.registerInnerControl(okButton);
			picker.registerInnerControl(cancelButton);
			return dom;
		},
		doOnResize: function() {
			$invokeSuper.call(this, arguments);
			let picker = this,
				dom = picker._dom,
				doms = picker._doms,
				height = picker.getRealHeight();
			if (typeof height === "number" && height > 0) {
				let innerHeight = dom.clientHeight,
					blockHeight = innerHeight - doms.buttonPanel.offsetHeight;
				$fly([doms.yearTable, doms.monthTable]).css("height", blockHeight);
			}
		},
		doOnKeyDown: function(event: any) {
			let picker = this,
				year = picker.get("year"),
				month = picker.get("month");
			switch (event.keyCode) {
				case 37:
					picker.set("month", month === 0 ? 11 : month - 1);
					break;
				case 38:
					picker.set("year", year - 1);
					break;
				case 39:
					picker.set("month", month === 11 ? 0 : month + 1);
					break;
				case 40:
					picker.set("year", year + 1);
					break;
				case 33:
					picker.set("year", year - 10);
					break;
				case 34:
					picker.set("year", year + 10);
					break;
				case 13:
					picker.fireEvent("onPick", picker);
					return false;
			}
		},
	});
	dorado.widget.YearDropDown = $extend(dorado.widget.DropDown, {
		$className: "dorado.widget.YearDropDown",
		tabStop: true,
		ATTRIBUTES: {
			width: { defaultValue: 150 },
			iconClass: { defaultValue: "d-trigger-icon-date" },
		},
		createDropDownBox: function(editor: any) {
			let dropDown = this,
				box = $invokeSuper.call(this, arguments),
				picker = new dorado.widget.YearPicker({
					onPick: function() {
						dropDown.close(picker.get("value"));
					},
				});
			box.set("control", picker);
			return box;
		},
		doOnEditorKeyDown: function(editor: any, evt: any) {
			let dropdown = this,
				retValue = true,
				yearPicker = dropdown.get("box.control");
			switch (evt.keyCode) {
				case 27:
					dropdown.close();
					retValue = false;
					break;
				case 13:
					yearPicker.fireEvent("onPick", yearPicker);
					retValue = false;
					break;
				default:
					retValue = yearPicker.onKeyDown(evt);
			}
			return retValue;
		},
		initDropDownBox: function(box: any, editor: any) {
			let dropDown = this,
				picker = dropDown.get("box.control");
			if (picker) {
				let value = parseInt(editor.get("value"), 10);
				if (!isNaN(value)) {
					picker.set("value", value);
				} else {
					picker.set("value", new Date().getFullYear());
				}
			}
		},
	});
	dorado.widget.View.registerDefaultComponent(
		"defaultYearDropDown",
		function() {
			return new dorado.widget.YearDropDown();
		},
	);
	dorado.widget.MonthDropDown = $extend(dorado.widget.DropDown, {
		$className: "dorado.widget.MonthDropDown",
		tabStop: true,
		ATTRIBUTES: {
			width: { defaultValue: 150 },
			iconClass: { defaultValue: "d-trigger-icon-date" },
		},
		createDropDownBox: function(editor: any) {
			let dropDown = this,
				box = $invokeSuper.call(this, arguments),
				picker = new dorado.widget.MonthPicker({
					onPick: function(self: any) {
						dropDown.close(self.get("value"));
					},
				});
			box.set("control", picker);
			return box;
		},
		doOnEditorKeyDown: function(editor: any, event: any) {
			let dropDown = this,
				retValue = true,
				yearPicker = dropDown.get("box.control");
			if (this.get("opened")) {
				switch (event.keyCode) {
					case 27:
						dropDown.close();
						retValue = false;
						break;
					case 13:
						yearPicker.fireEvent("onPick", yearPicker);
						retValue = false;
						break;
					default:
						retValue = yearPicker.onKeyDown(event);
				}
			}
			return retValue;
		},
		initDropDownBox: function(box: any, editor: any) {
			let dropDown = this,
				picker = dropDown.get("box.control");
			if (picker) {
				let value = parseInt(editor.get("value"), 10);
				if (!isNaN(value)) {
					picker.set("value", value);
				} else {
					picker.set("value", 0);
				}
			}
		},
	});
	dorado.widget.View.registerDefaultComponent(
		"defaultMonthDropDown",
		function() {
			return new dorado.widget.MonthDropDown();
		},
	);
	dorado.widget.YearMonthDropDown = $extend(dorado.widget.DropDown, {
		$className: "dorado.widget.YearMonthDropDown",
		ATTRIBUTES: {
			width: { defaultValue: 260 },
			iconClass: { defaultValue: "d-trigger-icon-date" },
		},
		createDropDownBox: function(editor: any) {
			let dropDown = this,
				box = $invokeSuper.call(this, arguments),
				picker = new dorado.widget.YearMonthPicker({
					pickOnClickMonth: true,
					onPick: function(self: any) {
						let retval = new Date(self.get("year"), self.get("month"));
						retval.year = self.get("year");
						retval.month = self.get("month");
						dropDown.close(retval);
					},
					onCancel: function() {
						dropDown.close();
					},
				});
			box.set("control", picker);
			return box;
		},
		doOnEditorKeyDown: function(editor: any, event: any) {
			let dropDown = this,
				retValue = true,
				ymPicker = dropDown.get("box.control");
			if (this.get("opened")) {
				switch (event.keyCode) {
					case 27:
						dropDown.close();
						retValue = false;
						break;
					case 13:
						ymPicker.fireEvent("onPick", ymPicker);
						retValue = false;
						break;
					default:
						retValue = ymPicker.onKeyDown(event);
				}
			}
			return retValue;
		},
	});
	dorado.widget.View.registerDefaultComponent(
		"defaultYearMonthDropDown",
		function() {
			return new dorado.widget.YearMonthDropDown();
		},
	);
})();
(function() {
	let DateHelper = {
		getWeekCountOfYear: function(date: any) {
			let begin = new Date(date.getFullYear(), 0, 1);
			let day = begin.getDay();
			if (day === 0) {
				day = 7;
			}
			let duration =
				date.getTime() - begin.getTime() + (day - 1) * 3600 * 24 * 1000;
			return Math.ceil(duration / 3600 / 24 / 1000 / 7);
		},
		getDayCountOfMonth: function(year: any, month: any) {
			if (month === 3 || month === 5 || month === 8 || month === 10) {
				return 30;
			}
			if (month === 1) {
				if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
					return 29;
				} else {
					return 28;
				}
			}
			return 31;
		},
		getFirstDayOfMonth: function(date: any) {
			let temp = new Date(date.getTime());
			temp.setDate(1);
			return temp.getDay();
		},
	};
	let CELL_UNSELECTABLE_CLASS = "unselectable",
		CELL_SELECTED_CLASS = "selected-date",
		PREV_MONTH_CLASS = "pre-month",
		NEXT_MONTH_CLASS = "next-month";
	dorado.widget.DatePicker = $extend(dorado.widget.Control, {
		$className: "dorado.widget.DatePicker",
		tabStop: true,
		ATTRIBUTES: {
			width: { independent: true },
			height: { independent: true },
			className: { defaultValue: "d-date-picker" },
			date: {
				defaultValue: function() {
					return new Date();
				},
				setter: function(value: any) {
					this._date =
						value && value.getTime ? new Date(value.getTime()) : value;
					this.refreshButtonOnFilterDate();
				},
			},
			selectionMode: {
				defaultValue: "singleDate",
				skipRefresh: true,
				writeBeforeReady: true,
			},
			selection: {
				getter: function() {
					if (this._selection) {
						return this._selection;
					} else {
						return "multiDate" === this._selectionMode ? [] : this._date;
					}
				},
				setter: function(selection: any) {
					if (selection == null && this._selectionMode === "multiDate") {
						selection = [];
					}
					this._selection = selection;
				},
			},
			showTimeSpinner: { defaultValue: false },
			showTodayButton: { defaultValue: true },
			showClearButton: { defaultValue: true },
			showCancelButton: { defaultValue: false },
			showConfirmButton: { defaultValue: true },
			yearMonthFormat: {},
		},
		EVENTS: {
			onPick: {},
			onClear: {},
			onConfirm: {},
			onCancel: {},
			onRefreshDateCell: {},
			onFilterDate: {},
		},
		addSelection: function(date: any) {
			let selection = this._selection;
			if (!selection) {
				selection = this._selection = [];
			}
			selection.push(date);
		},
		removeSelection: function(date: any) {
			let selection = this._selection;
			if (!selection || !date) {
				return;
			}
			let targetIndex = null;
			selection.forEach(function(item: any, index: any) {
				if (item && item.getTime() === date.getTime()) {
					targetIndex = index;
				}
			});
			if (targetIndex) {
				selection.removeAt(targetIndex);
			}
		},
		clearSelections: function() {
			let selection = this._selection;
			this._selection = [];
			this.refreshDate();
		},
		setYear: function(year: any, refresh: any, animate: any) {
			let picker = this,
				date = picker._date,
				oldDay = date.getDate(),
				oldMonth = date.getMonth(),
				oldYear = date.getFullYear();
			let source = new Date(date.getTime());
			if (year === "prev") {
				year = oldYear - 1;
			} else {
				if (year === "next") {
					year = oldYear + 1;
				}
			}
			if (oldMonth === 1 && oldDay === 29) {
				let newMonthDay = DateHelper.getDayCountOfMonth(year, date.getMonth());
				if (oldDay > newMonthDay) {
					date.setDate(newMonthDay);
				}
			}
			date.setFullYear(year);
			if (refresh) {
				if (animate === false) {
					picker.refresh();
				} else {
					picker.doMonthAnimate(source, date);
				}
			}
			picker.refreshButtonOnFilterDate();
		},
		getMonthAnimateType: function(source: any, target: any) {
			if (source && target) {
				let syear = source.getFullYear(),
					tyear = target.getFullYear(),
					smonth = source.getMonth(),
					tmonth = target.getMonth();
				if (syear === tyear && smonth === tmonth) {
					return null;
				}
				if (syear === tyear) {
					return smonth > tmonth ? "r2l" : "l2r";
				} else {
					return syear > tyear ? "t2b" : "b2t";
				}
			}
			return null;
		},
		doMonthAnimate: function(source: any, target: any) {
			let picker = this,
				animateType = picker.getMonthAnimateType(source, target);
			if (picker._doMonthAnimating) {
				return;
			}
			if (animateType == null) {
				picker.refresh();
				return;
			}
			let dateTable = picker._doms.dateTable,
				dateBlock = picker._doms.dateBlock,
				dateTableWidth = dateBlock.offsetWidth,
				dateTableHeight = dateBlock.offsetHeight;
			let sourceRegion, targetRegion, style, animConfig;
			switch (animateType) {
				case "l2r":
					sourceRegion = 1;
					targetRegion = 2;
					style = { width: dateTableWidth * 2, left: 0, top: 0 };
					animConfig = { left: -1 * dateTableWidth };
					break;
				case "r2l":
					sourceRegion = 2;
					targetRegion = 1;
					style = {
						width: dateTableWidth * 2,
						left: -1 * dateTableWidth,
						top: 0,
					};
					animConfig = { left: 0 };
					break;
				case "b2t":
					sourceRegion = 1;
					targetRegion = 3;
					style = { width: dateTableWidth * 2, left: 0, top: 0 };
					animConfig = { top: -1 * dateTableHeight };
					break;
				case "t2b":
					sourceRegion = 3;
					targetRegion = 1;
					style = {
						width: dateTableWidth * 2,
						left: 0,
						top: -1 * dateTableHeight,
					};
					animConfig = { top: 0 };
					break;
			}
			picker.refreshDate(source, sourceRegion);
			picker.refreshDate(target, targetRegion);
			$fly(dateTable).css(style);
			picker._visibleDateRegion = targetRegion;
			picker._doMonthAnimating = true;
			$fly(dateTable).animate(animConfig, {
				complete: function() {
					picker._doMonthAnimating = false;
					picker.refreshYearMonth();
				},
			});
		},
		setMonth: function(month: any, refresh: any, animate: any) {
			let picker = this,
				date = picker._date,
				oldDay = date.getDate(),
				oldYear = date.getFullYear(),
				oldMonth = date.getMonth();
			let source = new Date(date.getTime());
			if (month === "prev") {
				if (oldMonth !== 0) {
					month = oldMonth - 1;
				} else {
					picker.setYear(oldYear - 1);
					month = 11;
				}
			} else {
				if (month === "next") {
					if (oldMonth !== 11) {
						month = oldMonth + 1;
					} else {
						picker.setYear(oldYear + 1);
						month = 0;
					}
				}
			}
			if (oldDay >= 29) {
				let newMonthDay = DateHelper.getDayCountOfMonth(oldYear, month);
				if (oldDay > newMonthDay) {
					date.setDate(newMonthDay);
				}
			}
			date.setMonth(month);
			if (refresh) {
				if (animate === false) {
					picker.refresh();
				} else {
					picker.doMonthAnimate(source, date);
				}
			}
			picker.refreshButtonOnFilterDate();
		},
		setDate: function(day: any, refresh: any) {
			let picker = this,
				date = picker._date;
			switch (day) {
				case "next":
					date.setDate(date.getDate() + 1);
					break;
				case "prev":
					date.setDate(date.getDate() - 1);
					break;
				case "nextweek":
					date.setDate(date.getDate() + 7);
					break;
				case "prevweek":
					date.setDate(date.getDate() - 7);
					break;
				default:
					if (!isNaN(day)) {
						date.setDate(day);
					}
					break;
			}
			if (refresh) {
				picker.refresh();
			}
			picker.refreshButtonOnFilterDate();
		},
		refreshButtonOnFilterDate: function() {
			if (this.isActualVisible()) {
				if (this._todayButton) {
					this._todayButton.set("disabled", !this.isDateSelectable(new Date()));
				}
				if (this._confirmButton) {
					this._confirmButton.set(
						"disabled",
						!this.isDateSelectable(this._date),
					);
				}
			}
		},
		refreshDateCell: function(date: any, cell: any) {
			let picker = this;
			picker.fireEvent("onRefreshDateCell", picker, { date: date, cell: cell });
			let selectable = picker.isDateSelectable(date);
			if (selectable) {
				$fly(cell).removeClass(CELL_UNSELECTABLE_CLASS);
			} else {
				$fly(cell).addClass(CELL_UNSELECTABLE_CLASS);
			}
			if (picker._selectionMode === "multiDate") {
				let selection = this._selection;
				if (!selection || !date) {
					return;
				}
				let targetIndex = null;
				selection.forEach(function(item: any, index: any) {
					if (item && item.getTime() === date.getTime()) {
						targetIndex = index;
					}
				});
				if (targetIndex != null) {
					$fly(cell).addClass(CELL_SELECTED_CLASS);
				} else {
					$fly(cell).removeClass(CELL_SELECTED_CLASS);
				}
			}
		},
		isDateSelectable: function(date: any) {
			let picker = this,
				filterArg = { date: date, selectable: true };
			picker.fireEvent("onFilterDate", picker, filterArg);
			return filterArg.selectable;
		},
		refreshDate: function(target: any, region: any) {
			let picker = this,
				doms = picker._doms,
				date = target || picker._date,
				count = 1,
				day = DateHelper.getFirstDayOfMonth(date),
				maxDay = DateHelper.getDayCountOfMonth(
					date.getFullYear(),
					date.getMonth(),
				),
				dateTable = doms.dateTable,
				selectDay = date.getDate(),
				lastMonthDay = DateHelper.getDayCountOfMonth(
					date.getFullYear(),
					date.getMonth() === 0 ? 11 : date.getMonth() - 1,
				);
			day = day === 0 ? 7 : day;
			let isSingleSelect = picker._selectionMode !== "multiDate";
			let startI = 0,
				startJ = 0;
			region = region || picker._visibleDateRegion;
			switch (region) {
				case 2:
					startJ = 7;
					break;
				case 3:
					startI = 6;
					break;
				case 4:
					startI = 6;
					startJ = 7;
					break;
			}
			for (let i = startI; i < startI + 6; i++) {
				for (let j = startJ; j < startJ + 7; j++) {
					let cell = dateTable.rows[i].cells[j];
					if (i === startI) {
						if (j - startJ >= day) {
							cell.innerHTML = count++;
							this.refreshDateCell(
								new Date(
									date.getFullYear(),
									date.getMonth(),
									parseInt(cell.innerHTML, 10),
								),
								cell,
							);
							if (isSingleSelect) {
								if (count - 1 === selectDay) {
									if (!$fly(cell).hasClass(CELL_UNSELECTABLE_CLASS)) {
										cell.className = CELL_SELECTED_CLASS;
									} else {
										cell.className = CELL_UNSELECTABLE_CLASS;
									}
								} else {
									$fly(cell).removeClass(CELL_SELECTED_CLASS);
								}
							}
							$fly(cell)
								.removeClass(NEXT_MONTH_CLASS)
								.removeClass(PREV_MONTH_CLASS);
						} else {
							cell.innerHTML = lastMonthDay - (day - (j % 7)) + 1;
							cell.className = PREV_MONTH_CLASS;
							this.refreshDateCell(
								new Date(
									date.getFullYear(),
									date.getMonth() - 1,
									parseInt(cell.innerHTML, 10),
								),
								cell,
							);
						}
					} else {
						if (count <= maxDay) {
							cell.innerHTML = count++;
							this.refreshDateCell(
								new Date(
									date.getFullYear(),
									date.getMonth(),
									parseInt(cell.innerHTML, 10),
								),
								cell,
							);
							if (isSingleSelect) {
								if (count - 1 === selectDay) {
									if (!$fly(cell).hasClass(CELL_UNSELECTABLE_CLASS)) {
										cell.className = CELL_SELECTED_CLASS;
									} else {
										cell.className = CELL_UNSELECTABLE_CLASS;
									}
								} else {
									$fly(cell).removeClass(CELL_SELECTED_CLASS);
								}
							}
							$fly(cell)
								.removeClass(NEXT_MONTH_CLASS)
								.removeClass(PREV_MONTH_CLASS);
						} else {
							cell.innerHTML = count++ - maxDay;
							cell.className = NEXT_MONTH_CLASS;
							this.refreshDateCell(
								new Date(
									date.getFullYear(),
									date.getMonth() + 1,
									parseInt(cell.innerHTML, 10),
								),
								cell,
							);
						}
					}
				}
			}
		},
		refreshYearMonth: function() {
			let picker = this,
				doms = picker._doms,
				date = picker._date;
			let format =
				this._yearMonthFormat ||
				$setting["widget.datepicker.defaultYearMonthFormat"];
			doms.yearMonthLabel.innerHTML = format
				.replace("Y", date.getFullYear())
				.replace("m", date.getMonth() + 1);
		},
		refreshSpinner: function() {
			let picker = this,
				spinner = picker._timeSpinner,
				date = picker._date;
			if (picker._showTimeSpinner && spinner) {
				spinner.set({
					hours: date.getHours(),
					minutes: date.getMinutes(),
					seconds: date.getSeconds(),
				});
			}
		},
		refreshDom: function(dom: any) {
			let picker = this;
			picker.refreshDate();
			picker.refreshYearMonth();
			picker.refreshButtonOnFilterDate();
			if (picker._showTimeSpinner) {
				picker.doShowTimeSpinner();
				picker.refreshSpinner();
			} else {
				picker.doHideTimeSpinner();
			}
			$invokeSuper.call(this, arguments);
		},
		createDom: function() {
			let allWeeks =
					$resource("dorado.baseWidget.AllWeeks") ||
					$resource("dorado.core.AllWeeks") ||
					"",
				weeks = allWeeks.split(",");
			let dateRows = [];
			for (let i = 0; i < 12; i++) {
				dateRows.push({
					tagName: "tr",
					content: [
						{ tagName: "td" },
						{ tagName: "td" },
						{ tagName: "td" },
						{ tagName: "td" },
						{ tagName: "td" },
						{ tagName: "td" },
						{ tagName: "td" },
						{ tagName: "td" },
						{ tagName: "td" },
						{ tagName: "td" },
						{ tagName: "td" },
						{ tagName: "td" },
						{ tagName: "td" },
						{ tagName: "td" },
					],
				});
			}
			let picker = this,
				doms = {},
				dom = $DomUtils.xCreate(
					{
						tagName: "div",
						content: [
							{
								tagName: "div",
								className: "year-month-block",
								contextKey: "yearMonthBlock",
								content: [
									{
										tagName: "div",
										className: "pre-button-div",
										contextKey: "prevButtonDiv",
									},
									{
										tagName: "div",
										className: "next-button-div",
										contextKey: "nextButtonDiv",
									},
									{
										tagName: "div",
										className: "year-month-label",
										contextKey: "yearMonthLabel",
									},
								],
							},
							{
								tagName: "table",
								cellPadding: 0,
								cellSpacing: 0,
								border: 0,
								className: "date-header",
								contextKey: "dateHeader",
								content: [
									{
										tagName: "tr",
										className: "header",
										content: [
											{ tagName: "td", content: weeks[0] },
											{ tagName: "td", content: weeks[1] },
											{ tagName: "td", content: weeks[2] },
											{ tagName: "td", content: weeks[3] },
											{ tagName: "td", content: weeks[4] },
											{ tagName: "td", content: weeks[5] },
											{ tagName: "td", content: weeks[6] },
										],
									},
								],
							},
							{
								tagName: "div",
								className: "date-block",
								contextKey: "dateBlock",
								content: {
									tagName: "table",
									cellPadding: 0,
									cellSpacing: 0,
									border: 0,
									className: "date-table",
									contextKey: "dateTable",
									content: dateRows,
								},
							},
							{ contextKey: "buttonBlock", className: "button-block" },
							{
								tagName: "div",
								contextKey: "spinnerBlock",
								className: "spinner-block",
							},
						],
					},
					null,
					doms,
				);
			picker._doms = doms;
			if (picker._showTodayButton) {
				let todayButton = new dorado.widget.Button({
					caption: $resource("dorado.baseWidget.DatePickerToday"),
					listener: {
						onClick: function() {
							let now = new Date(),
								oldDate = picker._date;
							picker.set("date", now);
							if (
								now.getFullYear() === oldDate.getFullYear() &&
								now.getMonth() === oldDate.getMonth()
							) {
								picker.fireEvent("onPick", picker, {
									date: picker._showTimeSpinner
										? new Date(now.getTime())
										: new Date(
												now.getFullYear(),
												now.getMonth(),
												now.getDate(),
											),
								});
							}
						},
					},
				});
				todayButton.render(doms.buttonBlock);
				picker._todayButton = todayButton;
				picker.registerInnerControl(todayButton);
			}
			if (picker._showClearButton) {
				let clearButton = new dorado.widget.Button({
					caption: $resource("dorado.baseWidget.DatePickerClear"),
					listener: {
						onClick: function() {
							picker.fireEvent("onClear", picker, {});
						},
					},
				});
				clearButton.render(doms.buttonBlock);
				picker.registerInnerControl(clearButton);
			}
			if (picker._showCancelButton) {
				let cancelButton = new dorado.widget.Button({
					caption: $resource("dorado.baseWidget.DatePickerCancel"),
					listener: {
						onClick: function() {
							picker.fireEvent("onCancel", picker);
						},
					},
				});
				cancelButton.render(doms.buttonBlock);
				picker._cancelButton = cancelButton;
				picker.registerInnerControl(cancelButton);
			}
			if (picker._showConfirmButton) {
				let confirmButton = new dorado.widget.Button({
					caption: $resource("dorado.baseWidget.DatePickerConfirm"),
					ui: "highlight",
					listener: {
						onClick: function() {
							let date,
								pickerDate = picker._date;
							if (picker._showTimeSpinner && picker._timeSpinner) {
								let spinner = picker._timeSpinner;
								date = new Date(
									pickerDate.getFullYear(),
									pickerDate.getMonth(),
									pickerDate.getDate(),
									spinner.get("hours"),
									spinner.get("minutes"),
									spinner.get("seconds"),
								);
							} else {
								date = new Date(
									pickerDate.getFullYear(),
									pickerDate.getMonth(),
									pickerDate.getDate(),
								);
							}
							picker.fireEvent("onConfirm", picker, { date: date });
						},
					},
				});
				confirmButton.render(doms.buttonBlock);
				picker._confirmButton = confirmButton;
				picker.registerInnerControl(confirmButton);
			}
			let dateTable = doms.dateTable;
			let isSingleSelect = picker._selectionMode !== "multiDate";
			$fly(dateTable)
				.click(function(event: any) {
					let position = $DomUtils.getCellPosition(event),
						element = position.element,
						date = picker._date;
					if (position && element) {
						let className = element.className;
						if (className.indexOf(CELL_UNSELECTABLE_CLASS) !== -1) {
							return;
						}
						if (className.indexOf("next-month") !== -1) {
							picker.setMonth(date.getMonth() + 1);
						} else {
							if (className.indexOf("pre-month") !== -1) {
								picker.setMonth(date.getMonth() - 1);
							}
						}
						if (isSingleSelect) {
							picker.setDate(parseInt(element.innerHTML, 10), true);
							picker.fireEvent("onPick", picker, {
								date: new Date(date.getTime()),
							});
						} else {
							if (
								className.indexOf("next-month") !== -1 ||
								className.indexOf("pre-month") !== -1
							) {
								picker.setDate(parseInt(element.innerHTML, 10), true);
								return;
							}
							let selectDate = new Date(
								date.getFullYear(),
								date.getMonth(),
								parseInt(element.innerHTML, 10),
							);
							picker.fireEvent("onPick", picker, { date: selectDate });
							if (className.indexOf(CELL_SELECTED_CLASS) !== -1) {
								picker.removeSelection(selectDate);
								$fly(element).removeClass(CELL_SELECTED_CLASS);
							} else {
								picker.addSelection(selectDate);
								$fly(element).addClass(CELL_SELECTED_CLASS);
							}
						}
					}
				})
				.dblclick(function(event: any) {
					if (picker._showTimeSpinner === false) {
						return;
					}
					let position = $DomUtils.getCellPosition(event),
						element = position.element,
						date = picker._date;
					if (position && element) {
						let className = element.className;
						if (className.indexOf(CELL_UNSELECTABLE_CLASS) !== -1) {
							return;
						}
						if (
							className.indexOf("next-month") !== -1 ||
							className.indexOf("pre-month") !== -1
						) {
							return;
						}
						picker.setDate(parseInt(element.innerHTML, 10), true);
						picker.fireEvent("onConfirm", picker, {
							date: new Date(date.getTime()),
						});
					}
				});
			let prevYearButton = new dorado.widget.SimpleIconButton({
				iconClass: "pre-year-button",
				listener: {
					onClick: function() {
						picker.setYear("prev", true);
					},
				},
			});
			let prevMonthButton = new dorado.widget.SimpleIconButton({
				iconClass: "pre-month-button",
				listener: {
					onClick: function() {
						picker.setMonth("prev", true);
					},
				},
			});
			prevYearButton.render(doms.prevButtonDiv);
			prevMonthButton.render(doms.prevButtonDiv);
			let nextMonthButton = new dorado.widget.SimpleIconButton({
				iconClass: "next-month-button",
				listener: {
					onClick: function() {
						picker.setMonth("next", true);
					},
				},
			});
			let nextYearButton = new dorado.widget.SimpleIconButton({
				iconClass: "next-year-button",
				listener: {
					onClick: function() {
						picker.setYear("next", true);
					},
				},
			});
			nextMonthButton.render(doms.nextButtonDiv);
			nextYearButton.render(doms.nextButtonDiv);
			picker.registerInnerControl(prevYearButton);
			picker.registerInnerControl(prevMonthButton);
			picker.registerInnerControl(nextMonthButton);
			picker.registerInnerControl(nextYearButton);
			$fly(doms.yearMonthLabel).click(function() {
				picker.showYMPicker();
			});
			picker._visibleDateRegion = 1;
			return dom;
		},
		doShowTimeSpinner: function() {
			let picker = this,
				spinner = picker._timeSpinner;
			if (!spinner) {
				spinner = picker._timeSpinner = new dorado.widget.DateTimeSpinner({
					type: "time",
					width: 100,
					listener: {
						onPost: function() {
							let date = picker._date;
							date.setHours(spinner.get("hours"));
							date.setMinutes(spinner.get("minutes"));
							date.setSeconds(spinner.get("seconds"));
						},
					},
				});
				spinner.render(picker._doms.spinnerBlock);
				picker.registerInnerControl(spinner);
			}
			$fly(spinner._dom).css("display", "");
		},
		doHideTimeSpinner: function() {
			let picker = this,
				spinner = picker._timeSpinner;
			if (spinner) {
				$fly(spinner._dom).css("display", "none");
			}
		},
		showYMPicker: function() {
			let picker = this,
				dom = picker._dom,
				ymPicker = picker._yearMonthPicker;
			if (!ymPicker && dom) {
				ymPicker = picker._yearMonthPicker = new dorado.widget.YearMonthPicker({
					style: { display: "none" },
					height: picker._height ? picker._height : undefined,
					listener: {
						onPick: function() {
							let ymPicker = picker._yearMonthPicker,
								year = ymPicker.get("year"),
								month = ymPicker.get("month");
							picker.setYear(year, false, false);
							picker.setMonth(month, true, false);
							picker.hideYMPicker();
						},
						onCancel: function() {
							picker.hideYMPicker();
						},
					},
				});
				ymPicker.render(dom);
				picker.registerInnerControl(ymPicker);
			}
			ymPicker.updateDate(picker._date);
			if (!ymPicker._rendered) {
				ymPicker.render(document.body);
			}
			ymPicker._opened = true;
			$fly(ymPicker._dom).css("display", "").slideIn("t2b");
		},
		hideYMPicker: function(animate: any) {
			let picker = this,
				ymPicker = picker._yearMonthPicker;
			if (ymPicker) {
				if (animate === false) {
					$fly(ymPicker._dom).css("display", "none");
				} else {
					$fly(ymPicker._dom).slideOut("b2t");
				}
				ymPicker._opened = false;
				dorado.widget.setFocusedControl(picker);
			}
		},
		doOnResize: function() {
			$invokeSuper.call(this, arguments);
			let picker = this,
				dom = picker._dom,
				doms = picker._doms,
				height = picker.getRealHeight();
			if (typeof height === "number" && height > 0) {
				let innerHeight = dom.clientHeight,
					blockHeight =
						innerHeight -
						doms.dateHeader.offsetHeight -
						doms.buttonBlock.offsetHeight -
						doms.yearMonthBlock.offsetHeight;
				$fly(doms.dateBlock).css("height", blockHeight);
				$fly(doms.dateTable).css("height", blockHeight * 2);
			}
		},
		doOnKeyDown: function(event: any) {
			let picker = this,
				date,
				ymPicker = picker._yearMonthPicker;
			if (ymPicker && ymPicker._opened) {
				ymPicker.onKeyDown(event);
			} else {
				date = picker._date;
				switch (event.keyCode) {
					case 89:
						if (event.ctrlKey) {
							picker.showYMPicker();
						}
						break;
					case 37:
						if (!event.ctrlKey) {
							picker.setDate("prev", true);
						} else {
							picker.setMonth("prev", true);
						}
						break;
					case 38:
						if (!event.ctrlKey) {
							picker.setDate("prevweek", true);
						} else {
							picker.setYear("prev", true);
						}
						break;
					case 39:
						if (!event.ctrlKey) {
							picker.setDate("next", true);
						} else {
							picker.setMonth("next", true);
						}
						break;
					case 40:
						if (!event.ctrlKey) {
							picker.setDate("nextweek", true);
						} else {
							picker.setYear("next", true);
						}
						break;
					case 13:
						if (picker.isDateSelectable(picker._date)) {
							picker.fireEvent("onConfirm", picker, {
								date: new Date(picker._date.getTime()),
							});
						}
						return false;
					case 27:
						if (ymPicker && ymPicker._opened) {
							return false;
						}
						break;
				}
			}
		},
	});
	dorado.widget.DateDropDown = $extend(dorado.widget.DropDown, {
		$className: "dorado.widget.DateDropDown",
		ATTRIBUTES: {
			width: { defaultValue: 260 },
			iconClass: { defaultValue: "d-trigger-icon-date" },
			showTimeSpinner: {
				setter: function(showTimeSpinner: any) {
					this._showTimeSpinner = showTimeSpinner;
					if (this._picker) {
						this._picker.set("showTimeSpinner", showTimeSpinner);
					}
				},
			},
			showTodayButton: { defaultValue: true, path: "_picker.showTodayButton" },
			showConfirmButton: {
				defaultValue: true,
				path: "_picker.showConfirmButton",
			},
			selectionMode: {
				defaultValue: "singleDate",
				path: "_picker.selectionMode",
			},
			selection: { path: "_picker.selection" },
		},
		EVENTS: { onFilterDate: {}, onRefreshDateCell: {} },
		createDropDownBox: function() {
			let dropDown = this,
				box = $invokeSuper.call(this, arguments),
				picker = new dorado.widget.DatePicker({
					showClearButton: false,
					showCancelButton: true,
					showTodayButton: this._showTodayButton,
					showConfirmButton: this._showConfirmButton,
					selectionMode: this._selectionMode,
					showTimeSpinner: this._showTimeSpinner,
					listener: {
						onPick: function(self: any, arg: any) {
							if (
								!dropDown._showTimeSpinner &&
								"multiDate" !== this._selectionMode
							) {
								dropDown.close(arg.date);
							}
						},
						onClear: function(self: any) {
							dropDown.close(null);
						},
						onConfirm: function(self: any, arg: any) {
							dropDown.close(arg.date);
						},
						onCancel: function() {
							dropDown.close();
						},
						onFilterDate: function(self: any, arg: any) {
							dropDown.fireEvent("onFilterDate", dropDown, arg);
						},
						onRefreshDateCell: function(self: any, arg: any) {
							dropDown.fireEvent("onRefreshDateCell", dropDown, arg);
						},
					},
				});
			dropDown._picker = picker;
			box.set("control", picker);
			return box;
		},
		doOnEditorKeyDown: function(editor: any, evt: any) {
			let dropDown = this,
				retValue = true,
				datePicker = dropDown.get("box.control");
			if (this.get("opened")) {
				switch (evt.keyCode) {
					case 27:
						dropDown.close();
						retValue = false;
						break;
					default:
						let ymPicker = datePicker._yearMonthPicker;
						if (!ymPicker || !ymPicker._opened) {
							retValue = datePicker.onKeyDown(evt);
						} else {
							retValue = ymPicker.onKeyDown(evt);
						}
						break;
				}
			}
			if (retValue) {
				retValue = $invokeSuper.call(dropDown, arguments);
			}
			return retValue;
		},
		initDropDownBox: function(box: any, editor: any) {
			let dropDown = this,
				datePicker = dropDown.get("box.control");
			if (datePicker) {
				let date = editor.get("value");
				if (date && date instanceof Date) {
					datePicker.set("date", new Date(date.getTime()));
				} else {
					datePicker.set("date", new Date());
				}
				if (
					datePicker._yearMonthPicker &&
					datePicker._yearMonthPicker._opened
				) {
					datePicker.hideYMPicker(false);
				}
			}
		},
	});
	dorado.widget.View.registerDefaultComponent(
		"defaultDateDropDown",
		function() {
			return new dorado.widget.DateDropDown({});
		},
	);
	dorado.widget.View.registerDefaultComponent(
		"defaultDateTimeDropDown",
		function() {
			return new dorado.widget.DateDropDown({ showTimeSpinner: true });
		},
	);
})();
dorado.widget.CustomDropDown = $extend(dorado.widget.DropDown, {
	$className: "dorado.widget.CustomDropDown",
	ATTRIBUTES: {
		control: { writeBeforeReady: true, innerComponent: "" },
		view: {
			setter: function(view: any) {
				if (this._view === view) {
					return;
				}
				$invokeSuper.call(this, [view]);
				if (view && this._control) {
					this._control.set("view", view);
				}
			},
		},
	},
	createDropDownBox: function() {
		let box,
			control = this._control;
		if (dorado.Object.isInstanceOf(control, dorado.widget.FloatControl)) {
			box = control;
		} else {
			box = $invokeSuper.call(this, arguments);
			box.set("control", control);
			box.bind("beforeShow", function() {
				let $box = jQuery(box.getDom().firstChild),
					boxWidth = $box.width(),
					boxHeight = $box.height();
				let $dom = jQuery(control.getDom()),
					realWidth = $dom.outerWidth(),
					realHeight = $dom.outerHeight(),
					shouldRefresh;
				if (realWidth < boxWidth - box._dropDown._edgeWidth) {
					control.set("width", boxWidth - box._dropDown._edgeWidth);
					shouldRefresh = true;
				}
				if (realHeight < boxHeight - box._dropDown._edgeHeight) {
					control.set("height", boxHeight - box._dropDown._edgeHeight);
					shouldRefresh = true;
				}
				if (shouldRefresh) {
					control.refresh();
				}
			});
		}
		return box;
	},
});
(function() {
	dorado.widget.SpinnerTrigger = $extend(dorado.widget.Trigger, {
		$className: "dorado.widget.SpinnerTrigger",
		ATTRIBUTES: { className: { defaultValue: "d-trigger d-spinner-trigger" } },
		createTriggerButton: function(editor: any) {
			let trigger = this,
				control = new dorado.widget.HtmlContainer({
					exClassName: trigger._className || "",
					content: {
						tagName: "div",
						content: [
							{
								tagName: "div",
								className: "up-button",
								contextKey: "upButton",
								content: { tagName: "div", className: "icon" },
							},
							{
								tagName: "div",
								className: "down-button",
								contextKey: "downButton",
								content: { tagName: "div", className: "icon" },
							},
						],
					},
				});
			control.getDom();
			jQuery(control.getSubDom("upButton"))
				.repeatOnClick(function() {
					if (!editor._realReadOnly) {
						editor.doStepUp();
					}
				}, 150)
				.addClassOnClick("up-button-click", null, function() {
					return !editor._realReadOnly;
				});
			jQuery(control.getSubDom("downButton"))
				.repeatOnClick(function() {
					if (!editor._realReadOnly) {
						editor.doStepDown();
					}
				}, 150)
				.addClassOnClick("down-button-click", null, function() {
					return !editor._realReadOnly;
				});
			return control;
		},
	});
	dorado.widget.Spinner = $extend(dorado.widget.AbstractTextBox, {
		$className: "dorado.widget.Spinner",
		tabStop: true,
		ATTRIBUTES: {
			width: { defaultValue: 150 },
			height: { independent: true, readOnly: true },
			trigger: {
				getter: function() {
					let triggers = this._trigger;
					if (triggers && !(triggers instanceof Array)) {
						triggers = [triggers];
					}
					let spinnerTriggers = this.getSpinnerTriggers();
					return triggers ? spinnerTriggers.concat(triggers) : spinnerTriggers;
				},
			},
			showSpinTrigger: { defaultValue: true },
			step: { defaultValue: 1 },
			postValueOnSpin: { defaultValue: true },
		},
		getSpinnerTriggers: function() {
			if (!this._showSpinTrigger) {
				return [];
			}
			if (!this._spinTrigger) {
				let triggers = (this._spinTrigger = []),
					self = this;
				triggers.push(new dorado.widget.SpinnerTrigger({}));
			}
			return this._spinTrigger;
		},
		_initBindingProperties: function(propertyDef: any) {
			let watcher = this.getAttributeWatcher();
			if (!watcher.getWritingTimes("displayFormat")) {
				this._displayFormat = propertyDef._displayFormat;
			}
			if (!watcher.getWritingTimes("inputFormat")) {
				this._inputFormat = propertyDef._inputFormat;
			}
			if (!propertyDef._mapping && !watcher.getWritingTimes("dataType")) {
				this._dataType = propertyDef._dataType;
			}
		},
		createDom: function() {
			let dom = $invokeSuper.call(this, arguments),
				self = this;
			jQuery(dom).addClassOnHover(
				this._className + "-hover",
				null,
				function() {
					return !self._realReadOnly;
				},
			);
			return dom;
		},
	});
	dorado.widget.NumberSpinner = $extend(dorado.widget.Spinner, {
		$className: "dorado.widget.NumberSpinner",
		ATTRIBUTES: {
			min: { defaultValue: -2147483648 },
			max: { defaultValue: 2147483648 },
			text: { defaultValue: 0 },
			value: {
				getter: function() {
					return parseInt(this.get("text"), 10);
				},
				setter: function(value: any) {
					value = this.getValidValue(value);
					this._value = value;
					this.doSetText(value != null ? value + "" : "");
				},
			},
			selectTextOnFocus: { defaultValue: true },
		},
		createTextDom: function() {
			let textDom = document.createElement("INPUT");
			textDom.className = "editor";
			textDom.imeMode = "disabled";
			if (dorado.Browser.msie && dorado.Browser.version > 7) {
				textDom.style.top = 0;
				textDom.style.position = "absolute";
			} else {
				textDom.style.padding = 0;
			}
			return textDom;
		},
		doGetText: function() {
			return this._textDom ? this._textDom.value : this._text;
		},
		doSetText: function(text: any) {
			if (this._textDom) {
				this._textDom.value = text;
			} else {
				this._text = text;
			}
		},
		doStepUp: function() {
			let spinner = this;
			let value = parseInt(spinner.get("value"), 10);
			if (!isNaN(value)) {
				value += spinner._step;
				if (this._max !== undefined && value > this._max) {
					return;
				}
				spinner.set("value", value);
				if (spinner._postValueOnSpin) {
					if (!spinner._editorFocused) {
						spinner._editorFocused = true;
					}
					spinner.post();
				}
			}
		},
		doStepDown: function() {
			let spinner = this;
			let value = parseInt(spinner.get("value"), 10);
			if (!isNaN(value)) {
				value -= spinner._step;
				if (this._min !== undefined && value < this._min) {
					return;
				}
				spinner.set("value", value);
				if (spinner._postValueOnSpin) {
					if (!spinner._editorFocused) {
						spinner._editorFocused = true;
					}
					spinner.post();
				}
			}
		},
		getValidValue: function(value: any) {
			if (isNaN(value)) {
				value = "";
			} else {
				if (value != null) {
					if (value > this._max) {
						value = this._max;
					} else {
						if (value < this._min) {
							value = this._min;
						}
					}
				}
			}
			return value;
		},
		post: function(force: any) {
			let text = this.get("text"),
				value = text ? parseInt(text, 10) : null;
			if (text !== value) {
				this._textDom.value = value;
			}
			let value2 = this.getValidValue(value);
			if (value2 !== value) {
				this.set("value", value2);
			}
			$invokeSuper.call(this, arguments);
		},
		doOnFocus: function() {
			$invokeSuper.call(this, arguments);
			if (this._selectTextOnFocus) {
				$setTimeout(
					this,
					function() {
						this._textDom.select();
					},
					0,
				);
			}
		},
		doOnKeyDown: function(event: any) {
			let spinner = this,
				retval = true;
			let text, value;
			switch (event.keyCode) {
				case 38:
					if (!spinner._realReadOnly) {
						spinner.doStepUp();
						retval = false;
					}
					break;
				case 40:
					if (!spinner._realReadOnly) {
						spinner.doStepDown();
						retval = false;
					}
					break;
				case 37:
				case 39:
				case 8:
				case 9:
				case 13:
				case 35:
				case 36:
				case 46:
					break;
				case 187:
					text = this.get("text");
					value = text ? parseInt(text) : null;
					if (value) {
						value = Math.abs(value);
						spinner._textDom.value = value;
					}
					retval = false;
					break;
				case 189:
					text = this.get("text");
					value = text ? parseInt(text) : null;
					if (value) {
						value = 0 - Math.abs(value);
						spinner._textDom.value = value;
					}
					retval = false;
					break;
				default:
					if (
						(event.keyCode >= 48 && event.keyCode <= 57) ||
						(event.keyCode >= 96 && event.keyCode <= 105)
					) {
					} else {
						retval = false;
					}
					break;
			}
			return retval;
		},
	});
	dorado.widget.MultiSlotSpinner = $extend(dorado.widget.Spinner, {
		$className: "dorado.widget.MultiSlotSpinner",
		slotConfigs: [{}],
		defaultSlot: 0,
		constructor: function() {
			if (this.slotConfigs) {
				this.initSlotConfigs();
			}
			this._currentSlotIndex = 0;
			$invokeSuper.call(this, arguments);
		},
		initSlotConfigs: function() {
			let slotConfigs = this.slotConfigs,
				slotMap = (this._slotMap = {}),
				values = (this._values = []);
			for (let i = 0, j = slotConfigs.length; i < j; i++) {
				let config = slotConfigs[i],
					name = config.name;
				config.className = config.className || "slot";
				config.range = config.range || [null, null];
				slotMap[name] = config;
				values[i] = config.defaultValue;
			}
		},
		createTextDom: function() {
			let spinner = this,
				doms = {},
				dom = $DomUtils.xCreate(
					{
						tagName: "div",
						className: "editor slots-container",
						contextKey: "editor",
					},
					null,
					doms,
				);
			spinner._doms = doms;
			let slotConfigs = spinner.slotConfigs;
			for (let i = 0, j = slotConfigs.length; i < j; i++) {
				let config = slotConfigs[i],
					name = config.name;
				let label = document.createElement("span");
				label.className = config.className;
				label.slotIndex = i;
				doms["slot_" + i] = label;
				$fly(label).mousedown(function() {
					spinner.doChangeCurrentSlot(parseInt(this.slotIndex));
				});
				if (config.prefix) {
					let spEl = document.createElement("span");
					$fly(spEl).text(config.prefix).prop("class", "text");
					$fly(doms.editor).append(spEl);
				}
				$fly(doms.editor).append(label);
				if (config.suffix) {
					let spEl = document.createElement("span");
					$fly(spEl).text(config.suffix).prop("class", "text");
					$fly(doms.editor).append(spEl);
				}
			}
			return dom;
		},
		doGetSlotRange: function(slotIndex: any) {
			if (typeof slotIndex === "string") {
				slotIndex = this.getSlotIndexByName(slotIndex);
			}
			return this.slotConfigs[slotIndex].range;
		},
		getSlotIndexByName: function(name: any) {
			let config = this._slotMap[name];
			return config ? this.slotConfigs.indexOf(config) : -1;
		},
		doGetSlotValue: function(slotIndex: any) {
			this._slotValueChanged = true;
			if (typeof slotIndex === "string") {
				slotIndex = this.getSlotIndexByName(slotIndex);
			}
			return this._values[slotIndex];
		},
		doSetSlotValue: function(slotIndex: any, value: any) {
			let spinner = this;
			if (typeof slotIndex === "string") {
				slotIndex = spinner.getSlotIndexByName(slotIndex);
			}
			if (slotIndex < 0) {
				return;
			}
			if (value != null) {
				let config = spinner.slotConfigs[slotIndex],
					range = config.range || [],
					minValue = range[0],
					maxValue = range[1];
				value = parseInt(value, 10);
				if (isNaN(value)) {
					value = config.defaultValue || 0;
				}
				if (maxValue != null && value > maxValue) {
					value = maxValue;
				} else {
					if (minValue != null && value < minValue) {
						value = minValue;
					}
				}
			}
			this._values[slotIndex] = value;
			dorado.Toolkits.setDelayedAction(
				spinner,
				"$refreshDelayTimerId",
				spinner.doRefreshSlots,
				50,
			);
		},
		doGetSlotText: function(slotIndex: any) {
			let spinner = this;
			if (typeof slotIndex === "string") {
				slotIndex = spinner.getSlotIndexByName(slotIndex);
			}
			if (slotIndex < 0) {
				return "";
			}
			let config = spinner.slotConfigs[slotIndex];
			let text = this.doGetSlotValue(slotIndex);
			if (text == null) {
				if (config.digit > 0) {
					text = "";
					for (let i = 0; i < config.digit; i++) {
						text += "&nbsp;";
					}
				} else {
					text = "&nbsp;";
				}
			} else {
				let num = text,
					negative = num < 0,
					text = Math.abs(num) + "";
				if (config.digit > 0 && text.length < config.digit) {
					for (let i = text.length; i <= config.digit - 1; i++) {
						text = "0" + text;
					}
				}
				text = (negative ? "-" : "") + text;
			}
			return text;
		},
		doStepUp: function() {
			let spinner = this,
				currentSlotIndex = spinner._currentSlotIndex;
			if (!currentSlotIndex) {
				currentSlotIndex = spinner.doChangeCurrentSlot();
			}
			let value = spinner.doGetSlotValue(currentSlotIndex) + spinner._step;
			let range = spinner.doGetSlotRange(currentSlotIndex),
				minValue = range[0],
				maxValue = range[1];
			if (value == null) {
				value = minValue;
			} else {
				if (maxValue != null && value > maxValue) {
					return;
				}
			}
			spinner.doSetSlotValue(currentSlotIndex, value || 0);
			if (spinner._postValueOnSpin) {
				spinner.post();
			}
		},
		doStepDown: function() {
			let spinner = this,
				currentSlotIndex = spinner._currentSlotIndex;
			if (!currentSlotIndex) {
				currentSlotIndex = spinner.doChangeCurrentSlot();
			}
			let value = spinner.doGetSlotValue(currentSlotIndex) - spinner._step;
			let range = spinner.doGetSlotRange(currentSlotIndex),
				minValue = range[0],
				maxValue = range[1];
			if (value == null) {
				value = maxValue;
			}
			if (minValue != null && value < minValue) {
				return;
			}
			spinner.doSetSlotValue(currentSlotIndex, value || 0);
			if (spinner._postValueOnSpin) {
				spinner.post();
			}
		},
		doOnKeyDown: function(event: any) {
			let spinner = this,
				retval = true;
			switch (event.keyCode) {
				case 38:
					if (!spinner._realReadOnly) {
						spinner.doStepUp();
						retval = false;
					}
					break;
				case 40:
					if (!spinner._realReadOnly) {
						spinner.doStepDown();
						retval = false;
					}
					break;
				case 8:
					if (spinner._currentSlotIndex >= 0 && !spinner._realReadOnly) {
						let currentSlotIndex = spinner._currentSlotIndex,
							value,
							range = spinner.doGetSlotRange(currentSlotIndex);
						if (spinner._neverEdit) {
							value = 0;
						} else {
							let text = spinner.doGetSlotText(currentSlotIndex);
							value = parseInt(text.substring(0, text.length - 1), 10);
						}
						spinner.doSetSlotValue(currentSlotIndex, value);
					}
					retval = false;
					break;
				case 9:
					if (
						event.ctrlKey ||
						(!event.shiftKey &&
							spinner._currentSlotIndex === spinner.slotConfigs.length - 1) ||
						(event.shiftKey && spinner._currentSlotIndex === 0)
					) {
						retval = true;
					} else {
						spinner.doChangeCurrentSlot(event.shiftKey ? "prev" : "next");
						retval = false;
					}
					break;
				case 187:
					if (spinner._currentSlotIndex >= 0 && !spinner._realReadOnly) {
						let currentSlotIndex = spinner._currentSlotIndex,
							value = spinner.doGetSlotValue(currentSlotIndex) || 0;
						if (value) {
							value = Math.abs(value);
							spinner.doSetSlotValue(currentSlotIndex, value);
						}
						retval = false;
					}
					break;
				case 189:
					if (spinner._currentSlotIndex >= 0 && !spinner._realReadOnly) {
						let currentSlotIndex = spinner._currentSlotIndex,
							value = spinner.doGetSlotValue(currentSlotIndex) || 0;
						if (value) {
							value = 0 - Math.abs(value);
							spinner.doSetSlotValue(currentSlotIndex, value);
						}
						retval = false;
					}
					break;
				default:
					if (spinner._currentSlotIndex >= 0 && !spinner._realReadOnly) {
						if (
							(event.keyCode >= 48 && event.keyCode <= 57) ||
							(event.keyCode >= 96 && event.keyCode <= 105)
						) {
							let number =
									event.keyCode >= 96 ? event.keyCode - 96 : event.keyCode - 48,
								currentSlotIndex = spinner._currentSlotIndex,
								range = spinner.doGetSlotRange(currentSlotIndex),
								maxValue = range[1];
							let value = spinner._neverEdit
									? 0
									: spinner.doGetSlotValue(currentSlotIndex) || 0,
								ignore = false;
							let config = spinner.slotConfigs[currentSlotIndex],
								digit = config.digit;
							if (!digit && maxValue != null) {
								digit = (maxValue + "").length;
							}
							value = value * 10 + number;
							if (maxValue != null && value > maxValue) {
								value = number;
							}
							if (!ignore) {
								spinner.doSetSlotValue(currentSlotIndex, value);
							}
							retval = false;
						}
					}
					break;
			}
			if (retval === false) {
				spinner._neverEdit = false;
			}
			return retval;
		},
		doChangeCurrentSlot: function(slotIndex: any) {
			let spinner = this;
			if (typeof slotIndex === "string") {
				if (slotIndex === "next") {
					slotIndex =
						spinner._currentSlotIndex >= 0
							? spinner._currentSlotIndex + 1
							: spinner.defaultSlot;
				} else {
					if (slotIndex === "prev") {
						slotIndex =
							spinner._currentSlotIndex >= 0
								? spinner._currentSlotIndex - 1
								: spinner.defaultSlot;
					} else {
						slotIndex = spinner.getSlotIndexByName(slotIndex);
					}
				}
			}
			slotIndex = slotIndex || 0;
			let oldSlotIndex = spinner._currentSlotIndex,
				doms = spinner._doms;
			let config = spinner.slotConfigs[slotIndex];
			if (config) {
				if (oldSlotIndex >= 0) {
					let oldSlotConfig = spinner.slotConfigs[oldSlotIndex];
					$fly(doms["slot_" + oldSlotIndex]).removeClass(
						oldSlotConfig.className + "-selected",
					);
					spinner.doAfterSlotBlur(oldSlotIndex);
				}
				$fly(doms["slot_" + slotIndex]).addClass(
					config.className + "-selected",
				);
				spinner._currentSlotIndex = slotIndex;
				return slotIndex;
			} else {
				return oldSlotIndex;
			}
		},
		doAfterSlotBlur: function(slotIndex: any) {
			let spinner = this,
				value = spinner.doGetSlotValue(slotIndex);
			if (value == null) {
				spinner.doSetSlotValue(
					slotIndex,
					spinner.slotConfigs[slotIndex].defaultValue,
				);
			}
		},
		doOnFocus: function() {
			let spinner = this,
				currentSlotIndex = spinner._currentSlotIndex,
				doms = spinner._doms;
			spinner._neverEdit = true;
			if (currentSlotIndex >= 0 && !spinner._realReadOnly) {
				$fly(doms["slot_" + currentSlotIndex]).addClass(
					spinner.slotConfigs[currentSlotIndex].className + "-selected",
				);
			}
			this._editorFocused = true;
		},
		doOnBlur: function() {
			let spinner = this,
				currentSlotIndex = spinner._currentSlotIndex,
				doms = spinner._doms;
			if (currentSlotIndex >= 0) {
				$fly(doms["slot_" + currentSlotIndex]).removeClass(
					spinner.slotConfigs[currentSlotIndex].className + "-selected",
				);
				spinner.doAfterSlotBlur(currentSlotIndex);
			}
			this.post(true);
			this._editorFocused = false;
		},
		doRefreshSlots: function() {
			let spinner = this,
				doms = spinner._doms;
			if (!spinner._dom) {
				return;
			}
			for (let i = 0; i < spinner.slotConfigs.length; i++) {
				$fly(doms["slot_" + i]).html(spinner.doGetSlotText(i));
			}
		},
		refreshDom: function() {
			$invokeSuper.call(this, arguments);
			this.doRefreshSlots();
		},
		doGetText: function() {
			let spinner = this,
				slotConfigs = spinner.slotConfigs,
				text = "";
			for (let i = 0; i < slotConfigs.length; i++) {
				let config = slotConfigs[i];
				text += config.prefix || "";
				text += spinner.doGetSlotText(i);
				text += config.suffix || "";
			}
			return text;
		},
	});
	function slotAttributeGetter(attr: any) {
		return this.doGetSlotValue(attr);
	}
	function slotAttributeSetter(value: any, attr: any) {
		this.doSetSlotValue(attr, value);
	}
	let now = new Date();
	dorado.widget.DateTimeSpinner = $extend(dorado.widget.MultiSlotSpinner, {
		$className: "dorado.widget.DateTimeSpinner",
		slotConfigTemplate: {
			year: { name: "year", range: [0, 9999], defaultValue: now.getFullYear() },
			month: {
				name: "month",
				range: [1, 12],
				defaultValue: now.getMonth() + 1,
				digit: 2,
				prefix: "-",
			},
			date: {
				name: "date",
				range: [1, 31],
				defaultValue: now.getDate(),
				digit: 2,
				prefix: "-",
			},
			hours: {
				name: "hours",
				range: [0, 23],
				digit: 2,
				defaultValue: 0,
				prefix: "|",
			},
			leading_hours: {
				name: "hours",
				range: [0, 23],
				digit: 2,
				defaultValue: 0,
			},
			minutes: {
				name: "minutes",
				range: [0, 59],
				digit: 2,
				defaultValue: 0,
				prefix: ":",
			},
			seconds: {
				name: "seconds",
				range: [0, 59],
				digit: 2,
				defaultValue: 0,
				prefix: ":",
			},
		},
		ATTRIBUTES: {
			type: {
				defaultValue: "time",
				setter: function(type: any) {
					this._type = type = type || "time";
					this._typeChanged = true;
					let configs,
						template = this.slotConfigTemplate;
					switch (type) {
						case "date":
							configs = [template.year, template.month, template.date];
							break;
						case "time":
							configs = [
								template.leading_hours,
								template.minutes,
								template.seconds,
							];
							break;
						case "dateTime":
							configs = [
								template.year,
								template.month,
								template.date,
								template.hours,
								template.minutes,
								template.seconds,
							];
							break;
						case "hours":
							configs = [template.leading_hours];
							break;
						case "minutes":
							configs = [template.leading_hours, template.minutes];
							break;
						case "dateHours":
							configs = [
								template.year,
								template.month,
								template.date,
								template.hours,
							];
							break;
						case "dateMinutes":
							configs = [
								template.year,
								template.month,
								template.date,
								template.hours,
								template.minutes,
							];
							break;
					}
					this.slotConfigs = configs;
					this.initSlotConfigs();
				},
			},
			year: { getter: slotAttributeGetter, setter: slotAttributeSetter },
			month: { getter: slotAttributeGetter, setter: slotAttributeSetter },
			date: { getter: slotAttributeGetter, setter: slotAttributeSetter },
			hours: { getter: slotAttributeGetter, setter: slotAttributeSetter },
			minutes: { getter: slotAttributeGetter, setter: slotAttributeSetter },
			seconds: { getter: slotAttributeGetter, setter: slotAttributeSetter },
			value: {
				getter: function() {
					let year = this.doGetSlotValue("year") || 1980;
					let month = this.doGetSlotValue("month") - 1 || 0;
					let date = this.doGetSlotValue("date") || 1;
					let hours = this.doGetSlotValue("hours") || 0;
					let minutes = this.doGetSlotValue("minutes") || 0;
					let seconds = this.doGetSlotValue("seconds") || 0;
					return new Date(year, month, date, hours, minutes, seconds);
				},
				setter: function(d: any) {
					let year = 0,
						month = 1,
						date = 1,
						hours = 0,
						minutes = 0,
						seconds = 0;
					if (d) {
						year = d.getFullYear();
						month = d.getMonth() + 1;
						date = d.getDate();
						hours = d.getHours();
						minutes = d.getMinutes();
						seconds = d.getSeconds();
					}
					this.doSetSlotValue("year", year);
					this.doSetSlotValue("month", month);
					this.doSetSlotValue("date", date);
					this.doSetSlotValue("hours", hours);
					this.doSetSlotValue("minutes", minutes);
					this.doSetSlotValue("seconds", seconds);
					this.setValidationState("none");
				},
			},
		},
		constructor: function() {
			this.slotConfigs = [];
			$invokeSuper.call(this, arguments);
			if (!this.slotConfigs.length) {
				this.set("type", this._type);
			}
		},
		createTextDom: function() {
			if (!this._ready && !this._typeChanged) {
				this.set("type", "time");
			}
			return $invokeSuper.call(this, arguments);
		},
		doSetSlotValue: function(slotIndex: any, value: any) {
			if (value == null) {
				$invokeSuper.call(this, arguments);
				return;
			}
			let spinner = this,
				slotName;
			if (typeof slotIndex === "number") {
				let config = spinner.slotConfigs[slotIndex];
				if (config) {
					slotName = config.name;
				}
			} else {
				slotName = slotIndex;
				slotIndex = spinner.getSlotIndexByName(slotIndex);
			}
			if (!slotName || !spinner._slotMap[slotName]) {
				return;
			}
			if (!spinner._slotMap["date"]) {
				$invokeSuper.call(this, arguments);
				return;
			}
			let dateSlotIndex = spinner.getSlotIndexByName("date"),
				date = spinner._values[dateSlotIndex],
				newDate = 0;
			if (date >= 28) {
				let year = slotIndex === 0 ? value : spinner._values[0];
				let month = slotIndex === 1 ? value : spinner._values[1];
				let dayCount = new Date(year, month - 1).getDaysInMonth();
				if (date > dayCount) {
					newDate = dayCount;
				}
			}
			if (newDate) {
				if (slotName === "year" || slotName === "month") {
					spinner.doSetSlotValue("date", newDate);
					$invokeSuper.call(this, arguments);
				} else {
					$invokeSuper.call(this, [slotIndex, newDate]);
				}
			} else {
				$invokeSuper.call(this, arguments);
			}
		},
		doGetSlotRange: function(slotIndex: any) {
			let spinner = this,
				slotName;
			if (typeof slotIndex === "number") {
				slotName = spinner.slotConfigs[slotIndex].name;
			} else {
				slotName = slotIndex;
			}
			if (slotName === "date" && spinner._slotMap["date"]) {
				let year = spinner._values[0],
					month = spinner._values[1],
					dayCount = new Date(year, month - 1).getDaysInMonth();
				return [1, dayCount];
			} else {
				return $invokeSuper.call(this, arguments);
			}
		},
		doSetText: function(text: any) {
			let format;
			switch (this._type) {
				case "date":
					format = "Y-m-d";
					break;
				case "time":
					format = "h:i:s";
					break;
				case "dateTime":
					format = "Y-m-d h:i:s";
					break;
				case "hours":
					format = "h";
					break;
				case "minutes":
					format = "h:i";
					break;
				case "dateHours":
					format = "Y-m-d h";
					break;
				case "dateMinutes":
					format = "Y-m-d h:i";
					break;
			}
			this.set("value", format);
		},
	});
	dorado.widget.CustomSpinner = $extend(dorado.widget.MultiSlotSpinner, {
		$className: "dorado.widget.CustomSpinner",
		ATTRIBUTES: {
			pattern: {
				writeOnce: true,
				writeBeforeReady: true,
				setter: function(pattern: any) {
					this.parsePattern(pattern);
				},
			},
			value: {
				getter: function() {
					return this._values;
				},
				setter: function(v: any) {
					v = v || [];
					if (typeof v === "string") {
						v = v.split(",");
					}
					for (let i = 0; i < this.slotConfigs.length; i++) {
						let n = parseInt(v[i]);
						if (isNaN(n)) {
							n = null;
						}
						this.doSetSlotValue(i, n);
					}
					this.setValidationState("none");
				},
			},
		},
		_constructor: function(configs: any) {
			if (configs && configs.pattern) {
				this.parsePattern(configs.pattern);
				delete configs.pattern;
			}
			$invokeSuper.call(this, [configs]);
		},
		parsePattern: function(pattern: any) {
			function parseSlotConfig(slotConfig: any) {
							let slot = {},
								sections = slotConfig.split("|");
							if (sections[0] !== "*") {
								// CSP 兼容：使用 JSON.parse 替代 eval
								let range = sections[0].replace(/\*/g, "null");
								try {
									slot.range = JSON.parse("[" + range + "]");
								} catch (e) {
									console.warn("Failed to parse slot range config:", range, e);
									slot.range = [];
								}
							}
							if (sections[1]) {
								slot.digit = parseInt(sections[1]);
							}
							slot.defaultValue = slot.defaultValue || 0;
							return slot;
						}
			if (!pattern) {
				throw new dorado.ResourceException(
					"dorado.core.AttributeValueRequired",
					"pattern",
				);
			}
			this.slotConfigs = [];
			let i = 0,
				c,
				text = "",
				slotConfig = "",
				inSlot = false;
			while (i < pattern.length) {
				c = pattern.charAt(i);
				if (inSlot) {
					if (c === "]") {
						let slot = parseSlotConfig(slotConfig);
						if (text) {
							slot.prefix = text;
						}
						this.slotConfigs.push(slot);
						inSlot = false;
						text = slotConfig = "";
					} else {
						slotConfig += c;
					}
				} else {
					if (c === "\\") {
						c = pattern.charAt(++i);
						text += c;
					} else {
						if (c === "[") {
							inSlot = true;
						} else {
							text += c;
						}
					}
				}
				i++;
			}
			if (!this.slotConfigs.length) {
				throw new dorado.ResourceException(
					"dorado.baseWidget.InvalidSpinnerPattern",
					pattern,
				);
			}
			if (text) {
				this.slotConfigs.peek().suffix = text;
			}
			this.initSlotConfigs();
		},
		doSetText: function(text: any) {
			this.set("value", value);
		},
	});
})();
