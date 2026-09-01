(function () {
	dorado.widget.list = {};
	dorado.widget.AbstractList = $extend(dorado.widget.Control, {
		$className: "dorado.widget.AbstractList",
		tabStop: true,
		ATTRIBUTES: {
			itemModel: {},
			allowNoCurrent: { skipRefresh: true },
			selectionMode: {
				defaultValue: "none",
				skipRefresh: true,
				setter: function (v) {
					this.replaceSelection(this.get("selection"), null);
					this._selectionMode = v;
				},
			},
			selection: {
				skipRefresh: true,
				getter: function () {
					var selection = this._selection;
					if (selection instanceof dorado.Entity) {
						if (selection.state === dorado.Entity.STATE_DELETED) {
							this._selection = selection = null;
						}
					} else {
						if (selection instanceof Array) {
							for (var i = selection.length; i >= 0; i--) {
								var s = selection[i];
								if (
									s instanceof dorado.Entity &&
									s.state === dorado.Entity.STATE_DELETED
								) {
									selection.removeAt(i);
								}
							}
						}
					}
					if (this._selectionMode === "multiRows") {
						if (!selection) {
							selection = [];
						} else {
							selection = selection.slice(0);
						}
					}
					return selection;
				},
				setter: function (v) {
					if (v == null && "multiRows" === this._selectionMode) {
						v = [];
					}
					this.replaceSelection(this.get("selection"), v);
				},
			},
			dragMode: { writeBeforeReady: true, defaultValue: "item" },
			dropMode: { writeBeforeReady: true, defaultValue: "insertItems" },
		},
		EVENTS: {
			onCurrentChange: {},
			beforeSelectionChange: {},
			onSelectionChange: {},
			onCompareItems: {},
			onFilterItem: {},
		},
		constructor: function () {
			this._itemModel = this.createItemModel();
			$invokeSuper.call(this, arguments);
		},
		hasRealWidth: function () {
			var width = this.getRealWidth();
			return width != null && width !== "none" && width !== "auto";
		},
		hasRealHeight: function () {
			var height = this.getRealHeight();
			return height != null && height !== "none" && height !== "auto";
		},
		createItemModel: function () {
			return new dorado.widget.list.ItemModel();
		},
		applyDraggable: function (dom, options) {
			if (this._droppable && dom === this._dom && this._dragMode === "item") {
				return;
			}
			$invokeSuper.call(this, arguments);
		},
		initDraggingInfo: function (draggingInfo, evt) {
			$invokeSuper.call(this, arguments);
			if (this._dragMode !== "control") {
				var itemDom = this.findItemDomByEvent(evt);
				draggingInfo.set({
					object: itemDom ? $fly(itemDom).data("item") : null,
					insertMode: null,
					refObject: null,
				});
			}
		},
		initDraggingIndicator: function (indicator, draggingInfo, evt) {
			if (this._dragMode !== "control") {
				var itemDom = draggingInfo.get("element");
				if (itemDom) {
					var contentDom = $DomUtils.xCreate({
						tagName: "div",
						className: "d-list-dragging-item",
					});
					$fly(itemDom).find(">*").clone().appendTo(contentDom);
					indicator.set("content", contentDom);
				}
			}
		},
		sort: function (sortParams) {
			var customComparator,
				list = this;
			if (list.getListenerCount("onCompareItems") > 0) {
				customComparator = function (item1, item2, sortParams) {
					var arg = {
						item1: item1,
						item2: item2,
						sortParams: sortParams,
						result: 0,
					};
					list.fireEvent("onCompareItems", list, arg);
					return arg.result;
				};
			}
			this._itemModel.sort(sortParams, customComparator);
			this.refresh(true);
		},
		filter: function (criterions) {
			var customFilter,
				list = this;
			if (list.getListenerCount("onFilterItem") > 0) {
				customFilter = function (value, criterions) {
					var arg = { value: value, criterions: criterions };
					list.fireEvent("onFilterItem", list, arg);
					return arg.accept;
				};
			}
			this._itemModel.filter(criterions, customFilter);
			this.refresh(true);
		},
		showLoadingTip: function () {
			function getLoadingTipDom() {
				var tipDom = this._loadingTipDom;
				if (!tipDom) {
					this._loadingTipDom = tipDom = $DomUtils.xCreate({
						tagName: "TABLE",
						className: "d-list-loading",
						cellPadding: 0,
						cellSpacing: 0,
						style: {
							position: "absolute",
							left: 0,
							top: 0,
							width: "100%",
							height: "100%",
							zIndex: 9999,
						},
						content: {
							tagName: "TR",
							content: {
								tagName: "TD",
								align: "center",
								content: [
									{
										tagName: "DIV",
										className: "mask",
										style: {
											zIndex: 1,
											position: "absolute",
											left: 0,
											top: 0,
											width: "100%",
											height: "100%",
										},
									},
									{
										tagName: "DIV",
										className: "tip",
										content: [
											{
												tagName: "DIV",
												className: "icon",
												content: { tagName: "div", className: "spinner" },
											},
											{
												tagName: "DIV",
												className: "label",
												content: $resource("dorado.list.LoadingData"),
											},
										],
										style: { zIndex: 2, position: "relative" },
									},
								],
							},
						},
					});
					this._dom.appendChild(tipDom);
				}
				return tipDom;
			}
			dorado.Toolkits.cancelDelayedAction(this, "$hideLoadingTip");
			dorado.Toolkits.setDelayedAction(
				this,
				"$showLoadingTip",
				function () {
					var tipDom = getLoadingTipDom.call(this);
					$fly(tipDom).show();
				},
				100,
			);
		},
		hideLoadingTip: function () {
			dorado.Toolkits.cancelDelayedAction(this, "$showLoadingTip");
			if (this._loadingTipDom) {
				dorado.Toolkits.setDelayedAction(
					this,
					"$hideLoadingTip",
					function () {
						$fly(this._loadingTipDom).hide();
					},
					200,
				);
			}
		},
		setDraggingOverItemDom: function (itemDom) {
			if (this._draggingOverItemDom === itemDom) {
				return;
			}
			if (this._draggingOverItemDom) {
				$fly(this._draggingOverItemDom).removeClass("drag-over-row");
			}
			this._draggingOverItemDom = itemDom;
			if (itemDom) {
				$fly(itemDom).addClass("drag-over-row");
			}
		},
		showDraggingInsertIndicator: function (draggingInfo, insertMode, itemDom) {
			var insertIndicator =
				dorado.widget.AbstractList.getDraggingInsertIndicator();
			var $insertIndicator = $fly(insertIndicator);
			if (insertMode) {
				var dom = this._dom;
				var width = dom.offsetWidth;
				var top =
					insertMode === "before"
						? itemDom.offsetTop
						: itemDom.offsetTop + itemDom.offsetHeight;
				if (dom.clientWidth < width) {
					width = dom.clientWidth;
				}
				$insertIndicator
					.width(width)
					.height(2)
					.left(0)
					.top(top - 1)
					.show()
					.appendTo(dom);
			} else {
				$insertIndicator.hide();
			}
		},
		doOnDraggingSourceMove: function (
			draggingInfo,
			evt,
			targetObject,
			insertMode,
			refObject,
			itemDom,
		) {
			var accept =
				draggingInfo.isDropAcceptable(this._droppableTags) &&
				!(this._dropMode === "onItem" && targetObject == null);
			draggingInfo.set({
				targetObject: targetObject,
				insertMode: insertMode,
				refObject: refObject,
				accept: accept,
			});
			var eventArg = {
				draggingInfo: draggingInfo,
				event: evt,
				processDefault: true,
			};
			this.fireEvent("onDraggingSourceMove", this, eventArg);
			if (accept && eventArg.processDefault) {
				this.showDraggingInsertIndicator(draggingInfo, insertMode, itemDom);
				this.setDraggingOverItemDom(accept && !insertMode ? itemDom : null);
			}
			return eventArg.processDefault;
		},
		onDraggingSourceMove: function (draggingInfo, evt) {
			var dropMode = this._dropMode;
			var targetObject = draggingInfo.get("targetObject");
			var insertMode, refObject, itemDom;
			if (dropMode !== "onControl") {
				var pos = this.getMousePosition(evt);
				itemDom = this.findItemDomByPosition(pos);
				if (
					itemDom &&
					$fly(itemDom).data("item") === draggingInfo.get("object")
				) {
					itemDom = null;
				}
				if (itemDom) {
					if (dropMode === "insertItems") {
						var dropY = itemDom._dropY;
						var halfHeight = itemDom.offsetHeight / 2;
						insertMode = dropY < halfHeight ? "before" : "after";
					} else {
						if (dropMode === "onOrInsertItems") {
							var dropY = itemDom._dropY;
							if (dropY <= 4) {
								insertMode = "before";
							} else {
								if (itemDom.offsetHeight - dropY <= 4) {
									insertMode = "after";
								}
							}
						}
					}
				}
				refObject = itemDom ? $fly(itemDom).data("item") : null;
				if (!refObject) {
					targetObject = dropMode === "onAnyWhere" ? this : null;
				} else {
					targetObject = refObject;
				}
			}
			if (itemDom) {
				return this.doOnDraggingSourceMove(
					draggingInfo,
					evt,
					targetObject,
					insertMode,
					refObject,
					itemDom,
				);
			} else {
				return false;
			}
		},
		onDraggingSourceOut: function (draggingInfo, evt) {
			$invokeSuper.call(this, arguments);
			this.setDraggingOverItemDom();
			this.showDraggingInsertIndicator();
		},
		processItemDrop: function (draggingInfo, evt) {
			function getItemList(control, entity) {
				var list;
				if (entity instanceof dorado.Entity) {
					list = entity.parent;
				} else {
					if (control.ATTRIBUTES.itemModel) {
						var itemModel = control.get("itemModel");
						if (itemModel) {
							list = itemModel.getOriginItems();
						}
					}
				}
				return list;
			}
			var object = draggingInfo.get("object");
			var insertMode = draggingInfo.get("insertMode");
			var refObject = draggingInfo.get("refObject");
			var sourceControl = draggingInfo.get("sourceControl");
			if (
				(insertMode && refObject) ||
				this._dropMode === "insertItems" ||
				this._dropMode === "onOrInsertItems" ||
				this._dropMode === "onAnyWhere"
			) {
				var sourceList = getItemList(sourceControl, object),
					oldState = object.state;
				if (sourceList) {
					sourceList.remove(object, true);
					if (
						!dorado.Object.isInstanceOf(
							sourceControl,
							dorado.widget.DataControl,
						)
					) {
						sourceControl.refresh();
					}
				}
				if (object instanceof dorado.Entity) {
					object.setState(
						oldState === dorado.Entity.STATE_NEW
							? dorado.Entity.STATE_NEW
							: dorado.Entity.STATE_MOVED,
					);
				}
				var targetList = this.get("itemModel").getItems(),
					highlight;
				if (!targetList) {
					if (!dorado.Object.isInstanceOf(this, dorado.widget.DataControl)) {
						if (this.ATTRIBUTES.items) {
							targetList = [];
							this.set("items", targetList);
						}
					} else {
						targetList = this.getBindingData();
					}
				}
				if (targetList) {
					if (targetList instanceof dorado.EntityList) {
						targetList.insert(object, insertMode, refObject);
						highlight = object;
					} else {
						var i = refObject ? targetList.indexOf(refObject) : -1;
						if (i < 0) {
							targetList.push(object);
							highlight = targetList.length - 1;
						} else {
							if (insertMode === "after") {
								i++;
							}
							targetList.insert(object, i);
							highlight = i;
						}
					}
					if (!dorado.Object.isInstanceOf(this, dorado.widget.DataControl)) {
						this.refresh();
					}
					if (highlight != null) {
						this.highlightItem(highlight);
					}
				}
			}
			return true;
		},
		onDraggingSourceDrop: function (draggingInfo, evt) {
			if (this.processItemDrop(draggingInfo, evt)) {
				$invokeSuper.call(this, arguments);
			}
		},
	});
	dorado.widget.AbstractList.getDraggingInsertIndicator = function () {
		var indicator = this._draggingInsertIndicator;
		if (indicator == null) {
			indicator = $DomUtils.xCreate({
				tagName: "div",
				className: "d-list-dragging-insert-indicator",
			});
			this._draggingInsertIndicator = indicator;
		}
		return indicator;
	};
	dorado.widget.ViewPortList = $extend(dorado.widget.AbstractList, {
		$className: "dorado.widget.ViewPortList",
		ATTRIBUTES: { scrollMode: { defaultValue: "lazyRender" } },
		createDom: function () {
			var dom = $DomUtils.xCreate({
				tagName: "DIV",
				content: { tagName: "DIV", style: { width: "100%", height: "100%" } },
			});
			var container = (this._container = dom.firstChild);
			if (!this._useNativeScrollbars) {
				this._modernScroller = $DomUtils.modernScroll(container);
			}
			return dom;
		},
		refreshItemDoms: function (
			itemDomContainer,
			reverse,
			fn,
			keepItemsOutOfViewPort,
		) {
			$fly(itemDomContainer).addClass("d-rendering");
			if (!this._itemDomMap) {
				this._itemDomMap = {};
			}
			var startIndex = this._itemModel.getStartIndex();
			if (
				!keepItemsOutOfViewPort &&
				this._scrollMode === "viewport" &&
				this.startIndex >= 0
			) {
				var _startIndex = reverse
					? this.startIndex + this.itemDomCount
					: this.startIndex;
				if (Math.abs(startIndex - _startIndex) < this.itemDomCount / 2) {
					for (var i = Math.abs(startIndex - _startIndex); i > 0; i--) {
						if (startIndex > _startIndex) {
							itemDomContainer.appendChild(itemDomContainer.firstChild);
						} else {
							itemDomContainer.insertBefore(
								itemDomContainer.lastChild,
								itemDomContainer.firstChild,
							);
						}
					}
				}
			}
			var itemDomCount = 0;
			var it = this._itemModel.iterator();
			var bookmark = it.createBookmark(),
				viewPortFilled = false,
				reverseFlag = true;
			if (reverse) {
				it.next();
				reverseFlag = it.hasNext();
				reverseFlag ? it.next() : it.last();
			}
			this._shouldSkipRender = false;
			while (reverse ? it.hasPrevious() : it.hasNext()) {
				var item = reverse ? it.previous() : it.next();
				var dom = this.refreshItemDom(
					itemDomContainer,
					item,
					itemDomCount,
					reverse,
				);
				itemDomCount++;
				if (fn && !fn(dom)) {
					if (this._scrollMode === "viewport") {
						viewPortFilled = true;
						break;
					} else {
						this._shouldSkipRender = true;
						fn = null;
					}
				}
			}
			this._shouldSkipRender = false;
			var fillCount = 0;
			if (!viewPortFilled && reverseFlag && this._scrollMode === "viewport") {
				it.restoreBookmark(bookmark);
				reverse ? it.next() : it.previous();
				while (reverse ? it.hasNext() : it.hasPrevious()) {
					var item = reverse ? it.next() : it.previous();
					var dom = this.refreshItemDom(
						itemDomContainer,
						item,
						--fillCount,
						!reverse,
					);
					itemDomCount++;
					if (fn && !fn(dom)) {
						break;
					}
				}
			}
			if (!keepItemsOutOfViewPort) {
				for (
					var i = itemDomContainer.childNodes.length - 1;
					i >= itemDomCount;
					i--
				) {
					this.removeItemDom(
						reverse ? itemDomContainer.firstChild : itemDomContainer.lastChild,
					);
				}
			}
			this.startIndex = reverse
				? startIndex - fillCount - itemDomCount + 1
				: startIndex + fillCount;
			$fly(itemDomContainer).removeClass("d-rendering");
			this.itemCount = this._itemModel.getItemCount();
			this.itemDomCount = itemDomCount;
			return itemDomCount;
		},
		removeItemDom: function (dom) {
			if (this._itemDomMap[dom._itemId] === dom) {
				delete this._itemDomMap[dom._itemId];
			}
			$fly(dom).remove();
		},
		getScrollingIndicator: function () {
			var indicator = dorado.widget.ViewPortList._indicator;
			if (!indicator) {
				indicator = $DomUtils.xCreate({
					tagName: "DIV",
					style: "position:absolute",
				});
				dorado.widget.ViewPortList._indicator = indicator;
				$fly(indicator).addClass("d-list-scrolling-indicator").hide();
				document.body.appendChild(indicator);
			}
			$fly(indicator).bringToFront();
			return indicator;
		},
		setScrollingIndicator: function (text) {
			var indicator = this.getScrollingIndicator();
			$fly(indicator).text(text).show();
			$DomUtils.placeCenterElement(indicator, this.getDom());
		},
		hideScrollingIndicator: function () {
			$fly(this.getScrollingIndicator()).hide();
		},
		doOnResize: function () {
			if (!this._ready) {
				return;
			}
			this.refresh(true);
		},
	});
})();
(function () {
	valueComparators = {};
	dorado.widget.list.ItemModel = $class({
		$className: "dorado.widget.list.ItemModel",
		EMPTY_ITERATOR: new dorado.util.ArrayIterator([]),
		_itemDomSize: 0,
		_viewPortSize: 0,
		_scrollSize: 0,
		_scrollPos: 0,
		_startIndex: 0,
		_reverse: false,
		setItemDomSize: function (itemDomSize) {
			this._itemDomSize = itemDomSize;
		},
		getStartIndex: function () {
			return this._startIndex > this.getItemCount() ? 0 : this._startIndex;
		},
		setStartIndex: function (startIndex) {
			this._startIndex = startIndex;
		},
		isReverse: function () {
			return this._reverse;
		},
		setReverse: function (reverse) {
			this._reverse = reverse;
		},
		setScrollSize: function (viewPortSize, scrollSize) {
			this._viewPortSize = viewPortSize;
			this._scrollSize = scrollSize;
		},
		setScrollPos: function (scrollPos) {
			var itemCount = this.getItemCount();
			if (itemCount > 0) {
				var itemDomSize = this._scrollSize / itemCount;
				if (scrollPos / (this._scrollSize - this._viewPortSize) > 0.5) {
					this._startIndex =
						itemCount -
						1 -
						(Math.round(
							(this._scrollSize - this._viewPortSize - scrollPos) / itemDomSize,
						) || 0);
					if (this._startIndex > itemCount - 1) {
						this._startIndex = itemCount - 1;
					}
					this._reverse = true;
				} else {
					this._startIndex = Math.round(scrollPos / itemDomSize) || 0;
					this._reverse = false;
				}
			} else {
				this._startIndex = 0;
				this._reverse = false;
			}
		},
		getItems: function () {
			return this._items || this._originItems;
		},
		getOriginItems: function () {
			return this._originItems || this._items;
		},
		setItems: function (items) {
			this._items = items;
			delete this._originItems;
			if (this._filterParams) {
				this.filter(this._filterParams);
			}
		},
		iterator: function (startIndex) {
			var items = this._items;
			if (!items) {
				return this.EMPTY_ITERATOR;
			}
			var index = startIndex || this._startIndex || 0;
			if (items instanceof Array) {
				return new dorado.util.ArrayIterator(this._items, index);
			} else {
				return items.iterator({ currentPage: true, nextIndex: index });
			}
		},
		getItemCount: function () {
			var items = this._items;
			if (!items) {
				return 0;
			}
			return items instanceof Array
				? items.length
				: items.pageSize > 0
					? items.getPageEntityCount()
					: items.entityCount;
		},
		getItemAt: function (index) {
			if (!this._items || !(index >= 0)) {
				return null;
			}
			if (this._items instanceof Array) {
				return this._items[index];
			} else {
				var entityList = this._items;
				return entityList.iterator({ nextIndex: index }).next();
			}
		},
		getItemById: function (itemId) {
			var items = this._items;
			if (items instanceof Array) {
				return items[itemId];
			} else {
				return items.getById(itemId);
			}
		},
		getItemIndex: function (item) {
			if (!this._items || !item) {
				return -1;
			}
			if (this._items instanceof Array) {
				return this._items.indexOf(item);
			} else {
				var entityList = this._items,
					itemId = item.entityId,
					page = item.page;
				if (page.entityList !== entityList) {
					return -1;
				}
				var index = 0,
					entry = page.first;
				while (entry != null) {
					if (entry.data.entityId === itemId) {
						return index;
					}
					if (entry.data.state !== dorado.Entity.STATE_DELETED) {
						index++;
					}
					entry = entry.next;
				}
				return -1;
			}
		},
		getItemId: function (item, index) {
			if (this._items instanceof Array || !(item instanceof dorado.Entity)) {
				return index >= 0 ? index : this.getItemIndex(item);
			} else {
				return item.entityId;
			}
		},
		sort: function (sortParams, comparator) {
			if (!this.getItemCount()) {
				return;
			}
			var items = this.toArray();
			dorado.DataUtil.sort(items, sortParams, comparator);
			if (!(this._items instanceof Array)) {
				this._items = items;
			}
		},
		filter: function (filterParams, customFilter) {
			function getValueComparator(op) {
				var comparator = valueComparators[escape(op)];
				if (!comparator) {
					if (!op || op === "=") {
						op = "==";
					} else {
						if (op === "<>") {
							op = "!=";
						}
					}
					valueComparators[escape(op)] = comparator = new Function(
						"v1,v2",
						"return v1" + op + "v2",
					);
				}
				return comparator;
			}
			function filterItem(item, filterParam) {
				var value;
				if (filterParam.property) {
					value =
						item instanceof dorado.Entity
							? item.get(filterParam.property)
							: item[filterParam.property];
				} else {
					value = item;
				}
				var op = filterParam.operator;
				if (op === "like") {
					var s = (filterParam.value + "").toLowerCase();
					return (value + "").toLowerCase().indexOf(s) >= 0;
				} else {
					if (op === "like*") {
						var s = (filterParam.value + "").toLowerCase();
						return (value + "").toLowerCase().startsWith(s);
					} else {
						if (op === "*like") {
							var s = (filterParam.value + "").toLowerCase();
							return (value + "").toLowerCase().endsWith(s);
						} else {
							return getValueComparator(op)(value, filterParam.value);
						}
					}
				}
			}
			function processFilterParams(filterParams, junction) {
				var passed = junction === "or" ? false : true;
				for (var i = 0; i < filterParams.length; i++) {
					var filterParam = filterParams[i],
						b;
					if (filterParam.junction) {
						b = processFilterParams(
							filterParam.criterions,
							filterParam.junction,
						);
					} else {
						b = filterItem(item, filterParams[i]);
					}
					if (junction === "or" && b) {
						passed = true;
						break;
					} else {
						if (junction === "and" && !b) {
							passed = false;
							break;
						}
					}
				}
				return passed;
			}
			if (filterParams && filterParams.length > 0) {
				if (this._originItems) {
					this._items = this._originItems;
				} else {
					if (this.getItemCount() > 0) {
						this._originItems = this._items;
					}
				}
				var filtered = [];
				for (var it = this.iterator(0); it.hasNext(); ) {
					var item = it.next(),
						passed = undefined;
					if (customFilter) {
						passed = customFilter(item, filterParams);
					}
					if (passed === undefined || passed == null) {
						passed = processFilterParams(filterParams, "and");
					}
					if (passed) {
						filtered.push(item);
					}
				}
				this.filtered = true;
				this._items = filtered;
				this._filterParams = filterParams;
			} else {
				if (this._originItems) {
					this.filtered = false;
					this._items = this._originItems;
					delete this._originItems;
					delete this._filterParams;
				}
			}
		},
		toArray: function () {
			if (this._items instanceof Array) {
				return this._items;
			} else {
				if (this._items instanceof dorado.EntityList) {
					return this._items.toArray();
				} else {
					var v = [];
					for (var it = this.iterator(0); it.hasNext(); ) {
						v.push(it.next());
					}
					return v;
				}
			}
		},
	});
})();
