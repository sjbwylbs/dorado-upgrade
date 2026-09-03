// @ts-nocheck
/// <reference path="globals.d.ts" />

(function () {
    let TABLE_HEIGHT_ADJUST = (dorado.Browser.msie) ? -1 : 0;
    dorado.widget.RowList = $extend(dorado.widget.ViewPortList, {$className:"dorado.widget.RowList", ATTRIBUTES:{rowHeight:{defaultValue:dorado.Browser.isTouch ? ($setting["touch.ListBox.defaultRowHeight"] || 30) : ($setting["widget.ListBox.defaultRowHeight"] || 22)}, highlightCurrentRow:{defaultValue:true, skipRefresh:true, setter:function (v: any) {
        this._highlightCurrentRow = v;
        if (this._currentRow) {
            $fly(this._currentRow).toggleClass("current-row", !!v);
        }
    }}, highlightHoverRow:{defaultValue:true}, highlightSelectedRow:{defaultValue:true}, useNativeScrollbars:{}}, EVENTS:{onDataRowClick:{}, onDataRowDoubleClick:{}}, _constructor:function () {
        $invokeSuper.call(this, arguments);
        if (this._itemModel) {
            this._itemModel.setItemDomSize(this._rowHeight);
        }
    }, getIndexByItemId:function (itemId: any) {
        if (typeof itemId === "number") {
            return itemId;
        } else {
            let itemModel = this._itemModel;
            return itemModel.getItemIndex(itemModel.getItemById(itemId));
        }
    }, getCurrentItemDom:function () {
        return this._currentRow;
    }, getDraggableOptions:function (dom: any) {
        let options = $invokeSuper.call(this, arguments);
        if (dom === this._dom) {
            options.handle = ":first-child";
        }
        return options;
    }, createDataTable:function () {
        let table = this._dataTable = $DomUtils.xCreate({tagName:"TABLE", cellSpacing:0, cellPadding:0, className:"data-table", content:{tagName:"TBODY"}});
        let tbody = this._dataTBody = table.tBodies[0];
        let self = this;
        $fly(table).mouseover(function (evt: any) {
            if ($DomUtils.isDragging() || !self._highlightHoverRow) {
                return;
            }
            dorado.Toolkits.cancelDelayedAction(self, "$hoverOutTimerId");
            self.setHoverRow(self.findItemDomByEvent(evt));
        }).mouseout(function (evt: any) {
            dorado.Toolkits.setDelayedAction(self, "$hoverOutTimerId", function () {
                self.setHoverRow(null);
            }, 50);
        });
        return table;
    }, findItemDomByEvent:function (evt: any) {
        let target = evt.srcElement || evt.target || evt,
            tbody = this._dataTBody;
        return $DomUtils.findParent(target, function (parentNode: any) {
            return parentNode.parentNode === tbody;
        });
    }, onMouseDown:function (evt: any) {
        let row = this.findItemDomByEvent(evt);
        if (row || this._allowNoCurrent) {
            if (row && evt.shiftKey) {
                $DomUtils.disableUserSelection(row);
            }
            let oldCurrentItem = this.getCurrentItem();
            if (this.setCurrentItemDom(row)) {
                let clickedItem = (row ? $fly(row).data("item") : null), selection = this.getSelection();
                if (this._selectionMode === "singleRow") {
                    if (evt.ctrlKey || evt.shiftKey) {
                        this.replaceSelection(null, clickedItem);
                    }
                } else {
                    if (this._selectionMode === "multiRows") {
                        let removed = [], added = [];
                        if (evt.altKey || evt.ctrlKey && evt.shiftKey) {
                            removed = selection;
                        } else {
                            if (evt.ctrlKey) {
                                this.addOrRemoveSelection(selection, clickedItem, removed, added);
                            } else {
                                if (evt.shiftKey) {
                                    let si = -1, ei, itemModel = this._itemModel;
                                    if (oldCurrentItem) {
                                        si = itemModel.getItemIndex(oldCurrentItem);
                                    }
                                    if (oldCurrentItem) {
                                        if (si < 0) {
                                            si = itemModel.getItemIndex(oldCurrentItem);
                                        }
                                        ei = itemModel.getItemIndex(clickedItem);
                                        if (si > ei) {
                                            let i = si;
                                            si = ei, ei = i;
                                        }
                                        removed = selection.slice(0);
                                        removed.remove(oldCurrentItem);
                                        removed.remove(clickedItem);
                                        selection = [];
                                        let c = ei - si + 1, i = 0;
                                        let it = itemModel.iterator(si);
                                        while (it.hasNext() && i < c) {
                                            added.push(it.next());
                                            i++;
                                        }
                                    } else {
                                        this.addOrRemoveSelection(selection, clickedItem, removed, added);
                                    }
                                }
                            }
                        }
                        this.replaceSelection(removed, added);
                    }
                }
            }
            if (dorado.Browser.msie) {
                let tbody = this._dataTBody;
                try {
                    let cell = $DomUtils.findParent(evt.target, function (parentNode: any) {
                        return parentNode.parentNode.parentNode === tbody;
                    }, true);
                    if (cell) {
                        ((cell.firstChild && cell.firstChild.nodeType === 1) ? cell.firstChild : cell).focus();
                    }
                }
                catch (e) {
                    try {
                        evt.target.focus();
                    }
                    catch (e) {
                    }
                }
            }
        }
    }, getSelection:function () {
        let selection = this._selection;
        if (this._selectionMode === "multiRows") {
            if (!selection) {
                selection = [];
            }
        }
        return selection;
    }, setSelection:function (selection: any) {
        this._selection = selection;
    }, replaceSelection:function (removed: any, added: any, silence: any) {
        if (removed === added) {
            return;
        }
        switch (this._selectionMode) {
          case "singleRow":
            removed = this.get("selection");
            break;
          case "multiRows":
            if (removed instanceof Array && removed.length === 0) {
                removed = null;
            }
            if (added instanceof Array && added.length === 0) {
                added = null;
            }
            if (removed === added) {
                return;
            }
            if (removed && !(removed instanceof Array)) {
                removed = [removed];
            }
            if (added && !(added instanceof Array)) {
                added = [added];
            }
            break;
        }
        let eventArg = {removed:removed, added:added};
        if (!silence) {
            this.fireEvent("beforeSelectionChange", this, eventArg);
            removed = eventArg.removed;
            added = eventArg.added;
        }
        switch (this._selectionMode) {
          case "singleRow":
            if (removed) {
                this.toggleItemSelection(removed, false);
            }
            if (added) {
                this.toggleItemSelection(added, true);
            }
            this.setSelection(added);
            break;
          case "multiRows":
            let selection = this.get("selection");
            if (removed && selection) {
                if (removed === selection) {
                    removed = selection.slice(0);
                    for (let i = 0; i < selection.length; i++) {
                        this.toggleItemSelection(selection[i], false);
                    }
                    selection = null;
                } else {
                    for (let i = 0; i < removed.length; i++) {
                        selection.remove(removed[i]);
                        this.toggleItemSelection(removed[i], false);
                    }
                }
            }
            if (selection == null) {
                this.setSelection(selection = []);
            }
            if (added) {
                for (let i = 0; i < added.length; i++) {
                    if (selection.indexOf(added[i]) >= 0) {
                        continue;
                    }
                    selection.push(added[i]);
                    this.toggleItemSelection(added[i], true);
                }
            }
            this.setSelection(selection);
            break;
        }
        if (!silence) {
            eventArg.removed = removed;
            eventArg.added = added;
            this.fireEvent("onSelectionChange", this, eventArg);
        }
    }, addOrRemoveSelection:function (selection: any, clickedObj: any, removed: any, added: any) {
        if (!selection || selection.indexOf(clickedObj) < 0) {
            added.push(clickedObj);
        } else {
            removed.push(clickedObj);
        }
    }, toggleItemSelection:function (item: any, selected: any) {
        if (!this._highlightSelectedRow || !this._itemDomMap) {
            return;
        }
        let row = this._itemDomMap[this._itemModel.getItemId(item)];
        if (row) {
            $fly(row).toggleClass("selected-row", selected);
        }
    }, onClick:function (evt: any) {
        if (this.findItemDomByEvent(evt)) {
            this.fireEvent("onDataRowClick", this, {event:evt});
        }
    }, onDoubleClick:function (evt: any) {
        if (this.findItemDomByEvent(evt)) {
            this.fireEvent("onDataRowDoubleClick", this, {event:evt});
        }
    }, setHoverRow:function (row: any) {
        if (row) {
            if (this._draggable && this._dragMode !== "control") {
                this.applyDraggable(row);
            }
            $fly(row).addClass("hover-row");
        }
        if (this._hoverRow === row) {
            return;
        }
        if (this._hoverRow) {
            $fly(this._hoverRow).removeClass("hover-row");
        }
        this._hoverRow = row;
    }, setCurrentRow:function (row: any) {
        if (this._currentRow === row) {
            return;
        }
        this.setHoverRow(null);
        if (this._currentRow) {
            $fly(this._currentRow).removeClass("current-row");
        }
        this._currentRow = row;
        if (row && this._highlightCurrentRow) {
            $fly(row).addClass("current-row");
        }
    }, getItemTimestamp:function (item: any) {
        return (item instanceof dorado.Entity) ? item.timestamp : -1;
    }, refreshItemDoms:function (tbody: any, reverse: any, fn: any) {
        if (this._scrollMode === "viewport") {
            this.setCurrentRow(null);
        }
        this._duringRefreshAll = true;
        this._selectionCache = this.get("selection");
        try {
            return $invokeSuper.call(this, arguments);
        }
        finally {
            delete this._selectionCache;
            this._duringRefreshAll = false;
        }
    }, getRealCurrentItemId:function () {
        return this.getCurrentItemId();
    }, refreshItemDom:function (tbody: any, item: any, index: any, prepend: any) {
        let row;
        if (index >= 0 && index < tbody.childNodes.length) {
            let i = index;
            if (prepend) {
                i = tbody.childNodes.length - i - 1;
            }
            row = tbody.childNodes[i];
            if (this._itemDomMap[row._itemId] === row) {
                delete this._itemDomMap[row._itemId];
            }
        } else {
            row = this.createItemDom(item);
            prepend ? tbody.insertBefore(row, tbody.firstChild) : tbody.appendChild(row);
        }
        let flag = prepend ? -1 : 1;
        if (index < 0) {
            flag = -flag;
        }
        index = this._itemModel.getStartIndex() + index * flag;
        let itemId = this._itemModel.getItemId(item, index);
        this._itemDomMap[itemId] = row;
        row.itemIndex = index;
        row._itemId = itemId;
        let $row = $fly(row);
        $row.data("item", item);
        if (!this._shouldSkipRender && row._lazyRender) {
            this.createItemDomDetail(row, item);
            row._lazyRender = undefined;
        }
        if (!row._lazyRender) {
            $row.toggleClass("odd-row", (!this._itemModel.groups && (index % 2) === 1));
            if (itemId === this.getRealCurrentItemId()) {
                this.setCurrentRow(row);
            }
            if (this._selectionMode !== "none") {
                let selection = this._selectionCache || this.get("selection");
                switch (this._selectionMode) {
                  case "singleRow":
                    $row.toggleClass("selected-row", (selection === item) && this._highlightSelectedRow);
                    break;
                  case "multiRows":
                    $row.toggleClass("selected-row", !!(selection && selection.indexOf(item) >= 0) && this._highlightSelectedRow);
                    break;
                }
            }
            this.refreshItemDomData(row, item);
        }
        return row;
    }, refreshItemDomData:function (row: any, item: any) {
        if (row._lazyRender) {
            return;
        }
        let timestamp = this.getItemTimestamp(item);
        if (this._ignoreItemTimestamp || timestamp <= 0 || row.timestamp !== timestamp) {
            this.doRefreshItemDomData(row, item);
            row.timestamp = timestamp;
        }
    }, appendTouchMoveEvent:function (container: any) {
        if (dorado.Browser.isTouch) {
            container.addEventListener("touchstart", function (event: any) {
                this._scrollStartPosX = this.scrollLeft + event.touches[0].pageX;
                this._scrollStartPosY = this.scrollTop + event.touches[0].pageY;
            });
            let rowList = this;
            container.addEventListener("touchmove", function (event: any) {
                this.scrollLeft = this._scrollStartPosX - event.touches[0].pageX;
                this.scrollTop = this._scrollStartPosY - event.touches[0].pageY;
                if ((rowList._scrollLeft || 0) !== this.scrollLeft) {
                    if (rowList.onXScroll) {
                        rowList.onXScroll(this);
                    }
                }
                if ((rowList._scrollTop || 0) !== this.scrollTop) {
                    rowList.onYScroll(this);
                }
            });
        }
    }, refreshContent:function (container: any) {
        if (!this._dataTable) {
            let table = this.createDataTable();
            container.appendChild(table);
        }
        if (this._currentScrollMode === "viewport") {
            let beginBlankRow = this._beginBlankRow;
            let endBlankRow = this._endBlankRow;
            if (beginBlankRow) {
                beginBlankRow.parentNode.style.display = "none";
            }
            if (endBlankRow) {
                endBlankRow.parentNode.style.display = "none";
            }
            this._itemModel.setScrollPos(0);
        }
        let fn;
        if (this._scrollMode === "lazyRender" && container.clientHeight > 0) {
            let count = parseInt(container.clientHeight / this._rowHeight), i = 0;
            fn = function (row: any) {
                i++;
                return i <= count;
            };
        }
        this.refreshItemDoms(this._dataTBody, false, fn);
    }, refreshViewPortContent:function (container: any) {
        let beginBlankRow = this._beginBlankRow;
        let endBlankRow = this._endBlankRow;
        if (!this._dataTable) {
            let table = this.createDataTable();
            container.appendChild(table);
        }
        if (!beginBlankRow) {
            this._beginBlankRow = beginBlankRow = $DomUtils.xCreate({tagName:"TR", className:"preparing-area", content:"^TD"});
            let thead = document.createElement("THEAD");
            thead.appendChild(beginBlankRow);
            container.firstChild.appendChild(thead);
        }
        if (!endBlankRow) {
            this._endBlankRow = endBlankRow = $DomUtils.xCreate({tagName:"TR", className:"preparing-area", content:"^TD"});
            let tfoot = document.createElement("TFOOT");
            tfoot.appendChild(endBlankRow);
            container.firstChild.appendChild(tfoot);
        }
        let tbody = this._dataTBody;
        let itemModel = this._itemModel, itemCount = itemModel.getItemCount();
        let clientHeight = (container.scrollWidth > container.clientWidth) ? container.offsetHeight : container.clientHeight;
        let viewPortHeight, itemDomCount, self = this;
        if (clientHeight) {
            viewPortHeight = TABLE_HEIGHT_ADJUST;
            itemDomCount = this.refreshItemDoms(tbody, itemModel.isReverse(), function (row: any) {
                viewPortHeight += row.offsetHeight;
                if (dorado.Browser.safari) {
                    viewPortHeight -= 2;
                }
                return viewPortHeight <= (clientHeight + 0);
            });
        } else {
            itemDomCount = viewPortHeight = 0;
        }
        this._itemDomCount = itemDomCount;
        if (!this._skipProcessBlankRows) {
            let startIndex = this.startIndex;
            let cols = this._cols || 1;
            let rowHeightAverage = (itemDomCount > 0) ? viewPortHeight / itemDomCount : this._rowHeight;
            if (startIndex > 0) {
                beginBlankRow.firstChild.colSpan = cols;
                beginBlankRow.firstChild.style.height = Math.round(startIndex * rowHeightAverage) + "px";
                beginBlankRow.parentNode.style.display = "";
            } else {
                beginBlankRow.parentNode.style.display = "none";
                beginBlankRow.firstChild.style.height = "0px";
            }
            if ((itemDomCount + startIndex) < itemCount) {
                endBlankRow.firstChild.colSpan = cols;
                endBlankRow.firstChild.style.height = Math.round((itemCount - itemDomCount - startIndex) * rowHeightAverage) + "px";
                endBlankRow.parentNode.style.display = "";
            } else {
                endBlankRow.parentNode.style.display = "none";
                endBlankRow.firstChild.style.height = "0px";
            }
            let st;
            if (this.startIndex >= itemModel.getStartIndex()) {
                st = this._dataTBody.offsetTop;
            } else {
                st = this._dataTBody.offsetTop + this._dataTBody.offsetHeight - container.clientHeight;
            }
            container.scrollTop = this._scrollTop = st;
            let scrollHeight = container.scrollHeight;
            itemModel.setScrollSize(container.clientHeight, scrollHeight);
            this._rowHeightAverage = rowHeightAverage;
        }
    }, onScroll:function (event: any, arg: any) {
        let rowList = this;
        if (rowList._scrollMode === "simple") {
            return;
        }
        let container = rowList._container;
        if ((rowList._scrollLeft || 0) !== arg.scrollLeft) {
            if (rowList.onXScroll) {
                rowList.onXScroll(arg);
            }
        }
        if ((rowList._scrollTop || 0) !== arg.scrollTop) {
            rowList.onYScroll(arg);
        }
        rowList._scrollLeft = arg.scrollLeft;
        rowList._scrollTop = arg.scrollTop;
    }, onYScroll:function (arg: any, fixedBug: any) {
        let container = this._container;
        if (arg.scrollTop === (container._scrollTop || 0)) {
            return;
        }
        if (this._scrollMode === "viewport") {
            if (dorado.Toolkits.cancelDelayedAction(container, "$scrollTimerId")) {
                if (Math.abs(arg.scrollTop - container._scrollTop) > (arg.clientHeight / 4)) {
                    let itemCount = this._itemModel.getItemCount();
                    let rowHeight = arg.scrollHeight / itemCount;
                    this.setScrollingIndicator((Math.round(arg.scrollTop / rowHeight) + 1) + "/" + itemCount);
                }
            } else {
                container._scrollTop = arg.scrollTop;
            }
            if (!fixedBug) {
                let self = this;
                dorado.Toolkits.setDelayedAction(container, "$scrollTimerId", function () {
                    self.doOnYScroll(arg);
                }, 300);
            }
        } else {
            container._scrollTop = arg.scrollTop;
            if (!fixedBug) {
                this.doOnYScroll(arg);
            }
        }
    }, doOnYScroll:function (arg: any) {
        if (this._scrollMode === "viewport") {
            dorado.Toolkits.cancelDelayedAction(this._container, "$scrollTimerId");
            this._itemModel.setScrollPos(arg.scrollTop);
            this.setHoverRow(null);
            this.refresh();
            this.hideScrollingIndicator();
        } else {
            if (this._scrollMode === "lazyRender") {
                let rows = this._dataTBody.rows;
                let i = parseInt(arg.scrollTop / this._rowHeight) || 0;
                if (i >= rows.length) {
                    i = rows.length - 1;
                }
                let row = rows[i];
                if (!row) {
                    return;
                }
                while (row && row.offsetTop > arg.scrollTop) {
                    i--;
                    row = rows[i];
                }
                let bottom = arg.scrollTop + arg.clientHeight;
                while (row && row.offsetTop < bottom) {
                    if (row._lazyRender) {
                        let item = $fly(row).data("item");
                        this.createItemDomDetail(row, item);
                        row._lazyRender = undefined;
                        this.refreshItemDomData(row, item);
                    }
                    i++;
                    row = rows[i];
                }
            }
        }
    }, createDom:function () {
        let dom = $invokeSuper.call(this, arguments);
        if (dorado.Browser.msie && dorado.Browser.version >= 8) {
            dom.hideFocus = true;
        }
        if (this._useNativeScrollbars) {
            $fly(this._container).css("overflow", "auto");
        } else {
            $fly(this._container).bind("modernScrolled", $scopify(this, this.onScroll));
        }
        return dom;
    }, refreshDom:function (dom: any) {
        let hasRealWidth = !!this._width, hasRealHeight = !!this._height, oldWidth, oldHeight;
        if (!hasRealWidth || !hasRealHeight) {
            oldWidth = dom.offsetWidth;
            oldHeight = dom.offsetHeight;
        }
        $invokeSuper.call(this, arguments);
        let container = this._container;
        if (this._scrollMode === "viewport") {
            this.refreshViewPortContent(container);
        } else {
            this.refreshContent(container);
        }
        if (this._currentScrollMode && this._currentScrollMode !== this._scrollMode && !this.getCurrentItemId()) {
            this.doOnYScroll(container);
        }
        this._currentScrollMode = this._scrollMode;
        if (!this._skipScrollCurrentIntoView) {
            if (this._currentRow) {
                this.scrollItemDomIntoView(this._currentRow);
            } else {
                this.scrollCurrentIntoView();
            }
        }
        delete this._skipScrollCurrentIntoView;
        if ((!hasRealWidth || !hasRealHeight) && (oldWidth !== dom.offsetWidth || oldHeight !== dom.offsetHeight)) {
            this.notifySizeChange();
        }
        delete this._ignoreItemTimestamp;
    }, scrollItemDomIntoView:function (row: any) {
        let container = this._container;
        let st = -1;
        if ((row.offsetTop + row.offsetHeight) > (container.scrollTop + container.clientHeight)) {
            st = row.offsetTop + row.offsetHeight - container.clientHeight;
        } else {
            if (row.offsetTop < container.scrollTop) {
                st = row.offsetTop;
            }
        }
        if (st >= 0) {
            if (this._scrollMode !== "lazyRender") {
                this._scrollTop = st;
            }
            container.scrollTop = st;
        }
    }, scrollCurrentIntoView:function () {
        let currentItemId = this.getRealCurrentItemId();
        if (currentItemId != null) {
            let row = this._currentRow;
            if (row) {
                this.scrollItemDomIntoView(row);
            } else {
                if (this._scrollMode === "viewport") {
                    let itemModel = this._itemModel;
                    let index = this.getIndexByItemId(currentItemId);
                    if (index < 0) {
                        index = 0;
                    }
                    itemModel.setStartIndex(index);
                    let oldReverse = itemModel.isReverse();
                    itemModel.setReverse(index >= this.startIndex);
                    this.refresh();
                    itemModel.setReverse(oldReverse);
                } else {
                    row = this._itemDomMap[currentItemId];
                    if (row) {
                        this.setCurrentItemDom(row);
                    }
                }
            }
        }
    }, findItemDomByPosition:function (pos: any) {
        let dom = this._dom, y = pos.y + dom.scrollTop, row = null;
        let rows = this._dataTBody.rows, rowHeight = this._rowHeightAverage || this._rowHeight, i;
        if (this._scrollMode === "viewport") {
            let relativeY = y;
            if (this._beginBlankRow) {
                relativeY -= this._beginBlankRow.offsetHeight;
            }
            i = parseInt(relativeY / rowHeight);
        } else {
            i = parseInt(y / rowHeight);
        }
        if (i < 0) {
            i = 0;
        } else {
            if (i >= rows.length) {
                i = rows.length - 1;
            }
        }
        row = rows[i];
        while (row) {
            if (row.offsetTop > y) {
                row = row.previousSibling;
            } else {
                if (row.offsetTop + row.offsetHeight < y) {
                    if (row.nextSibling) {
                        row = row.nextSibling;
                    } else {
                        row._dropY = y - row.offsetTop;
                        break;
                    }
                } else {
                    row._dropY = y - row.offsetTop;
                    break;
                }
            }
        }
        return row;
    }});
})();
dorado.widget.list.ListBoxRowRenderer = $extend(dorado.Renderer, {$className:"dorado.widget.list.ListBoxRowRenderer", render:function (dom: any, arg: any) {
    let item = arg.data, text;
    if (item != null) {
        if (arg.property) {
            if (item instanceof dorado.Entity) {
                text = item.getText(arg.property);
            } else {
                text = item[arg.property];
            }
        } else {
            if (!item.isEmptyItem) {
                text = item;
            }
        }
    }
    dom.innerText = (text === undefined || text == null) ? "" : text;
}});
dorado.widget.AbstractListBox = $extend(dorado.widget.RowList, {$className:"dorado.widget.AbstractListBox", ATTRIBUTES:{className:{defaultValue:"d-list-box"}, width:{defaultValue:200}, property:{setter:function (property: any) {
    this._property = property;
    this._ignoreItemTimestamp = true;
}}, renderer:{}}, EVENTS:{onRenderRow:{}}, doRefreshItemDomData:function (row: any, item: any) {
    let processDefault = true, arg = {dom:row.firstChild, data:item, property:this._property, processDefault:false};
    if (this.getListenerCount("onRenderRow")) {
        this.fireEvent("onRenderRow", this, arg);
        processDefault = arg.processDefault;
    }
    if (processDefault) {
        (this._renderer || $singleton(dorado.widget.list.ListBoxRowRenderer)).render(row.firstChild, arg);
    }
}, createItemDom:function (item: any) {
    let row = document.createElement("TR");
    row.className = "row";
    row.style.height = this._rowHeight + "px";
    if (this._scrollMode === "lazyRender" && this._shouldSkipRender) {
        row._lazyRender = true;
        row.style.height = this._rowHeight + "px";
    } else {
        this.createItemDomDetail(row, item);
    }
    if (dorado.Browser.isTouch) {
        row.addEventListener("touchstart", function (event: any) {
            this._touchmove = false;
        });
        row.addEventListener("touchmove", function (event: any) {
            this._touchmove = true;
        });
        let rowList = this;
        row.addEventListener("touchend", function (event: any) {
            if (!this._touchmove) {
                rowList.setCurrentRow(this);
            }
        });
    }
    return row;
}, createItemDomDetail:function (dom: any, item: any) {
    let cell = document.createElement("TD");
    dom.appendChild(cell);
}, getItemByEvent:function (event: any) {
    let row = this.findItemDomByEvent(event);
    return (row) ? $fly(row).data("item") : null;
}});
dorado.widget.ListBox = $extend(dorado.widget.AbstractListBox, {$className:"dorado.widget.ListBox", ATTRIBUTES:{currentIndex:{skipRefresh:true, defaultValue:-1, setter:function (index: any) {
    if (index >= this._itemModel.getItemCount()) {
        index = -1;
    }
    if (this._currentIndex === index) {
        return;
    }
    this._currentIndex = index;
    let row = this.getItemDomByItemIndex(index);
    this.setCurrentRow(row);
    this.scrollCurrentIntoView();
    if (!row) {
        row = this.getItemDomByItemIndex(index);
        this.setCurrentRow(row);
    }
    this.fireEvent("onCurrentChange", this);
}}, currentItem:{readOnly:true, getter:function () {
    return this.getCurrentItem();
}}, items:{setter:function (v: any) {
    this.set("selection", null);
    this._currentIndex = -1;
    this._itemModel.setItems(v);
}, getter:function () {
    return this._itemModel.getItems();
}}}, refreshDom:function (dom: any) {
    $invokeSuper.call(this, arguments);
    let currentIndex = this._currentIndex;
    if (currentIndex < 0 && !this._allowNoCurrent && this._itemModel.getItemCount()) {
        currentIndex = 0;
    }
    this.set("currentIndex", currentIndex);
}, getItemDomByItemIndex:function (index: any) {
    let itemModel = this._itemModel, row;
    if (index >= itemModel.getItemCount()) {
        index = -1;
    }
    let item = index >= 0 ? itemModel.getItemAt(index) : null;
    if (this._rendered && this._itemDomMap && index >= 0) {
        if (this._rowCache && $fly(this._rowCache).data("item") === item) {
            row = this._rowCache;
            delete this._rowCache;
        } else {
            row = this._itemDomMap[itemModel.getItemId(item)];
        }
    }
    return row;
}, getCurrentItem:function () {
    if (this._currentIndex >= 0) {
        return this._itemModel.getItemAt(this._currentIndex);
    }
}, getCurrentItemId:function () {
    return this._currentIndex;
}, doOnKeyDown:function (evt: any) {
    let retValue = true;
    switch (evt.keyCode || evt.which) {
      case 36:
        this.set("currentIndex", 0);
        break;
      case 35:
        this.set("currentIndex", this._itemModel.getItemCount() - 1);
        break;
      case 38:
        if (this._currentIndex > 0) {
            this.set("currentIndex", this._currentIndex - 1);
        }
        retValue = false;
        break;
      case 40:
        if (this._currentIndex < this._itemModel.getItemCount() - 1) {
            this.set("currentIndex", this._currentIndex + 1);
        }
        retValue = false;
        break;
    }
    return retValue;
}, setCurrentItemDom:function (row: any) {
    this._rowCache = row;
    this.set("currentIndex", row ? this._itemModel.getItemIndex($fly(row).data("item")) : -1);
    return true;
}, highlightItem:function (index: any, options: any, speed: any) {
    if (index === undefined) {
        index = this._currentIndex;
    }
    let row = this.getItemDomByItemIndex(index);
    if (row) {
        $fly(row).addClass("highlighting-row").effect("highlight", options || {color:"#FF8000"}, speed || 1500, function () {
            $fly(row).removeClass("highlighting-row");
        });
    }
}});
dorado.widget.DataListBox = $extend([dorado.widget.AbstractListBox, dorado.widget.DataControl], {$className:"dorado.widget.DataListBox", ATTRIBUTES:{selection:{setter:function (selection: any) {
    this.refresh();
    $invokeSuper.call(this, arguments);
}}}, getCurrentItem:function () {
    return (this._currentRow) ? $fly(this._currentRow).data("item") : null;
}, getCurrentItemId:function (item: any, index: any) {
    let current = this.getCurrentItem();
    return current ? this._itemModel.getItemId(current) : null;
}, getRealCurrentItemId:function () {
    let current = this._itemModel.getOriginItems() ? this._itemModel.getOriginItems().current : null;
    return current ? this._itemModel.getItemId(current) : null;
}, setCurrentItemDom:function (row: any) {
    let item = (row ? $fly(row).data("item") : null);
    if (item) {
        let entityList = this._itemModel.getOriginItems();
        entityList.setCurrent(item);
        if (entityList.current === item) {
            this.setCurrentEntity(item);
            return true;
        }
    }
    return false;
}, refreshEntity:function (entity: any) {
    let row = this._itemDomMap[this._itemModel.getItemId(entity)];
    if (row) {
        this.refreshItemDomData(row, entity);
    }
}, refreshDom:function (dom: any) {
    let entityList = this.getBindingData({firstResultOnly:true, acceptAggregation:true});
    if (entityList && !(entityList instanceof dorado.EntityList)) {
        throw new dorado.ResourceException(dorado.list.BindingTypeMismatch);
    }
    let oldItems = this._itemModel.getOriginItems();
    if (oldItems !== entityList) {
        this._itemModel.setItems(entityList);
        this.set("selection", null);
    }
    $invokeSuper.call(this, arguments);
}, setCurrentEntity:function (entity: any) {
    let currentItem = this._currentRow ? $fly(this._currentRow).data("item") : null;
    if (currentItem === entity) {
        return;
    }
    let itemId = entity ? this._itemModel.getItemId(entity) : null;
    let row = this._itemDomMap[itemId];
    this.setCurrentRow(row);
    this.scrollCurrentIntoView();
    this.fireEvent("onCurrentChange", this);
    return !!row;
}, doOnKeyDown:function (evt: any) {
    let retValue = true;
    let items = this._itemModel.getItems();
    switch (evt.keyCode) {
      case 36:
        if (items instanceof dorado.widget.list.ItemModel) {
            items.first();
        } else {
            this.setCurrentEntity(items[0]);
        }
        break;
      case 35:
        if (items instanceof dorado.widget.list.ItemModel) {
            items.last();
        } else {
            this.setCurrentEntity(items[items.length - 1]);
        }
        break;
      case 38:
        if (items instanceof dorado.widget.list.ItemModel) {
            items.previous();
        } else {
            let currentItem = this.getCurrentItem();
            let index = items.indexOf(currentItem) - 1;
            this.setCurrentEntity(items[(index < 0) ? 0 : index]);
        }
        retValue = false;
        break;
      case 40:
        if (items instanceof dorado.widget.list.ItemModel) {
            items.next();
        } else {
            let currentItem = this.getCurrentItem();
            let index = items.indexOf(currentItem) + 1;
            this.setCurrentEntity(items[(index > (items.length - 1)) ? (items.length - 1) : index]);
        }
        retValue = false;
        break;
    }
    return retValue;
}, _adjustBeginBlankRow:function () {
    this._ignoreOnScroll++;
    let itemModel = this._itemModel;
    let container = this.getDom();
    let beginBlankRow = this._beginBlankRow;
    let adj = container.scrollTop - beginBlankRow.offsetHeight;
    beginBlankRow.firstChild.style.height = this.startIndex * this._rowHeightAverage + "px";
    container.scrollTop = beginBlankRow.offsetHeight + adj;
    itemModel.setScrollSize(container.clientHeight, container.scrollHeight);
    $setTimeout(this, function () {
        this._ignoreOnScroll--;
    }, 0);
}, _adjustEndBlankRow:function () {
    let itemModel = this._itemModel;
    let container = this.getDom();
    let endBlankRow = this._endBlankRow;
    endBlankRow.firstChild.style.height = (itemModel.getItemCount() - this.startIndex - this.itemDomCount) * this._rowHeightAverage + "px";
    itemModel.setScrollSize(container.clientHeight, container.scrollHeight);
}, onEntityDeleted:function (arg: any) {
    let entity = arg.entity;
    this.replaceSelection(entity, null);
    let row = this._itemDomMap[this._itemModel.getItemId(entity)], tbody = this._dataTBody;
    if (this._scrollMode !== "viewport") {
        if (row) {
            let nextRow = row.nextSibling;
            this.removeItemDom(row);
            if (this._forceRefreshRearRows !== false) {
                while (nextRow) {
                    this.refreshItemDom(tbody, $fly(nextRow).data("item"), nextRow.sectionRowIndex);
                    nextRow = nextRow.nextSibling;
                }
            }
            this.notifySizeChange();
        }
    } else {
        let itemModel = this._itemModel;
        if (row) {
            if (row === tbody.firstChild) {
                itemModel.setStartIndex(itemModel.getStartIndex() - 1);
                if (itemModel.getStartIndex() < 0) {
                    itemModel.setStartIndex(0);
                }
            } else {
                this.removeItemDom(row);
            }
            this.refresh();
        } else {
            let i = itemModel.getItemIndex(entity);
            if (i >= 0) {
                if (i < itemModel.getStartIndex()) {
                    this.startIndex--;
                    itemModel.setStartIndex(itemModel.getStartIndex() - 1);
                    this._adjustBeginBlankRow();
                } else {
                    this._adjustEndBlankRow();
                }
            }
        }
    }
}, onEntityInserted:function (arg: any) {
    function findFontNearestRow(entity: any) {
        entity = entity.getPrevious();
        let row, itemDomMap = this._itemDomMap, itemModel = this._itemModel;
        while (entity) {
            row = itemDomMap[itemModel.getItemId(entity)];
            if (row) {
                return row;
            }
            entity = entity.getPrevious();
        }
    }
    function findBackNearestRow(entity: any) {
        entity = entity.getNext();
        let row, itemDomMap = this._itemDomMap, itemModel = this._itemModel;
        while (entity) {
            row = itemDomMap[itemModel.getItemId(entity)];
            if (row) {
                return row;
            }
            entity = entity.getNext();
        }
    }
    let entity = arg.entity;
    let mode = arg.insertMode;
    let refEntity = arg.refEntity;
    let tbody = this._dataTBody, itemDomMap = this._itemDomMap, itemModel = this._itemModel;
    if (itemModel.filtered) {
        itemModel._items.push(entity);
    }
    if (this._scrollMode !== "viewport") {
        let row;
        let refRow, inserted;
        switch (mode) {
          case "begin":
            row = this.createItemDom(entity);
            tbody.insertBefore(row, tbody.firstChild);
            break;
          case "before":
            row = this.createItemDom(entity);
            refRow = itemDomMap[itemModel.getItemId(refEntity)];
            if (!refRow) {
                refRow = findBackNearestRow.call(this, refEntity);
                if (!refRow) {
                    tbody.appendChild(row);
                    inserted = true;
                }
            }
            if (!inserted) {
                tbody.insertBefore(row, refRow);
            }
            break;
          case "after":
            row = this.createItemDom(entity);
            refRow = itemDomMap[itemModel.getItemId(refEntity)];
            if (!refRow) {
                refRow = findFontNearestRow.call(this, refEntity);
                if (!refRow) {
                    tbody.insertBefore(row, tbody.firstChild);
                    inserted = true;
                }
            }
            if (!inserted) {
                if (refRow.nextSibling) {
                    tbody.insertBefore(row, refRow.nextSibling);
                } else {
                    tbody.appendChild(row);
                }
            }
            break;
          default:
            row = this.createItemDom(entity);
            tbody.appendChild(row);
        }
        this.refreshItemDom(tbody, entity, row.sectionRowIndex);
        if (this._forceRefreshRearRows !== false) {
            row = row.nextSibling;
            while (row) {
                this.refreshItemDom(tbody, $fly(row).data("item"), row.sectionRowIndex);
                row = row.nextSibling;
            }
        }
        this.notifySizeChange();
    } else {
        let i = itemModel.getItemIndex(entity);
        if (i >= 0) {
            if (i < this.startIndex) {
                this.startIndex++;
                itemModel.setStartIndex(itemModel.getStartIndex() + 1);
            } else {
                if (i < this.startIndex + this.itemDomCount) {
                    let row = tbody.lastChild;
                    let nextRow = tbody.childNodes[i - this.startIndex];
                    tbody.insertBefore(row, nextRow);
                } else {
                    itemModel.setStartIndex(i - this.itemDomCount + 1);
                }
            }
            this.refresh();
        }
    }
}, filterDataSetMessage:function (messageCode: any, arg: any) {
    let itemModel = this._itemModel;
    let items = itemModel.getOriginItems();
    switch (messageCode) {
      case dorado.widget.DataSet.MESSAGE_REFRESH:
        return true;
      case dorado.widget.DataSet.MESSAGE_CURRENT_CHANGED:
        return (!items || arg.entityList === items || dorado.DataUtil.isOwnerOf(items, arg.entityList));
      case dorado.widget.DataSet.MESSAGE_DATA_CHANGED:
      case dorado.widget.DataSet.MESSAGE_REFRESH_ENTITY:
        return (!items || items._observer !== this._dataSet || arg.entity.parent === items || dorado.DataUtil.isOwnerOf(items, arg.entity));
      case dorado.widget.DataSet.MESSAGE_DELETED:
        return (arg.entity.parent === items || dorado.DataUtil.isOwnerOf(items, arg.entity));
      case dorado.widget.DataSet.MESSAGE_INSERTED:
        return (arg.entityList === items);
      case dorado.widget.DataSet.MESSAGE_ENTITY_STATE_CHANGED:
        return (arg.entity.parent === items);
      case dorado.widget.DataSet.MESSAGE_LOADING_START:
      case dorado.widget.DataSet.MESSAGE_LOADING_END:
        if (arg.entityList) {
            return (items === arg.entityList || dorado.DataUtil.isOwnerOf(items, arg.entityList));
        } else {
            if (arg.entity) {
                let asyncExecutionTimes = dorado.DataPipe.MONITOR.asyncExecutionTimes;
                this.getBindingData({firstResultOnly:true, acceptAggregation:true});
                if (dorado.DataPipe.MONITOR.asyncExecutionTimes > asyncExecutionTimes) {
                    return true;
                } else {
                    this.hideLoadingTip();
                    return false;
                }
            } else {
                return true;
            }
        }
      default:
        return false;
    }
}, processDataSetMessage:function (messageCode: any, arg: any, data: any) {
    switch (messageCode) {
      case dorado.widget.DataSet.MESSAGE_REFRESH:
        this.refresh(true);
        break;
      case dorado.widget.DataSet.MESSAGE_CURRENT_CHANGED:
        if (!this.setCurrentEntity(arg.entityList.current)) {
            this.refresh(true);
        }
        break;
      case dorado.widget.DataSet.MESSAGE_DATA_CHANGED:
      case dorado.widget.DataSet.MESSAGE_REFRESH_ENTITY:
        let items = this._itemModel.getOriginItems();
        if (!items || items._observer !== this._dataSet || arg.entity.parent === items || dorado.DataUtil.isOwnerOf(items, arg.newValue)) {
            this.refresh(true);
        } else {
            this.refreshEntity(arg.entity);
        }
        break;
      case dorado.widget.DataSet.MESSAGE_ENTITY_STATE_CHANGED:
        this.refreshEntity(arg.entity);
        break;
      case dorado.widget.DataSet.MESSAGE_DELETED:
        this.onEntityDeleted(arg);
        break;
      case dorado.widget.DataSet.MESSAGE_INSERTED:
        this.onEntityInserted(arg);
        break;
      case dorado.widget.DataSet.MESSAGE_LOADING_START:
        this.showLoadingTip();
        break;
      case dorado.widget.DataSet.MESSAGE_LOADING_END:
        this.hideLoadingTip();
        break;
    }
}, highlightItem:function (entity: any, options: any, speed: any) {
    entity = entity || this.getCurrentItem();
    let row = this._itemDomMap[this._itemModel.getItemId(entity)];
    if (row) {
        $fly(row).addClass("highlighting-row").effect("highlight", options || {color:"#FF8000"}, speed || 1500, function () {
            $fly(row).removeClass("highlighting-row");
        });
    }
}});

