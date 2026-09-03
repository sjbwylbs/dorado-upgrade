// @ts-nocheck
/// <reference path="globals.d.ts" />

(function() {
    dorado.widget.grid = {};
    dorado.widget.grid.ColumnList = $extend(dorado.util.KeyedArray, {$className:"dorado.widget.grid.ColumnList", constructor:function(parent: any) {
        $invokeSuper.call(this, [dorado._GET_NAME]);
        this.parent = parent;
    }, destroy:function() {
        let items = this.items;
        for (let i = 0, len = items.length; i < len; i++) {
            items[i].destroy();
        }
    }, updateGridColumnModelTimestamp:function() {
        let p = this.parent;
        while (p) {
            if (p instanceof dorado.widget.AbstractGrid) {
                p._columnModelTimestamp = dorado.Core.getTimestamp();
                return;
            }
            p = p._parent;
        }
    }, beforeInsert:function(column: any) {
        column._parent = this.parent;
        this.updateGridColumnModelTimestamp();
    }, beforeRemove:function(column: any) {
        delete column._parent;
        this.updateGridColumnModelTimestamp();
    }});
    dorado.widget.grid.ColumnModel = $extend(dorado.AttributeSupport, {$className:"dorado.widget.grid.ColumnModel", ATTRIBUTES:{columns:{setter:function(v: any) {
        this.addColumns(v);
    }}}, destroy:function() {
        this._columns.destroy();
    }, doGet:function(attr: any) {
        let c = attr.charAt(0);
        if (c === "#" || c === "&") {
            let col = attr.substring(1);
            return this.getColumn(col);
        } else {
            return $invokeSuper.call(this, [attr]);
        }
    }, addColumn:function(columnConfig: any, insertMode: any, refColumn: any) {
        let column;
        if (columnConfig instanceof dorado.widget.grid.Column) {
            column = columnConfig;
        } else {
            if (!columnConfig.name && columnConfig.property) {
                let name = columnConfig.property;
                if (this.getColumn(name)) {
                    let j = 2;
                    while (!this.getColumn(name + "_" + j)) {
                        j++;
                    }
                    name = name + "_" + j;
                }
                columnConfig.name = name;
            }
            column = dorado.Toolkits.createInstance("gridcolumn", columnConfig, function(type: any) {
                if (type) {
                    return dorado.util.Common.getClassType("dorado.widget.grid." + type + "Column", true);
                }
                return (columnConfig.columns && columnConfig.columns.length) ? dorado.widget.grid.ColumnGroup : dorado.widget.grid.DataColumn;
            });
        }
        this._columns.insert(column, insertMode, refColumn);
        if (this._grid) {
            this._grid.registerInnerViewElement(column);
        }
        column.set("grid", this._grid);
        return column;
    }, addColumns:function(columnConfigs: any) {
        for (let i = 0; i < columnConfigs.length; i++) {
            this.addColumn(columnConfigs[i]);
        }
    }, removeColumn:function(column: any) {
        this._columns.remove(column);
        if (this._grid) {
            this._grid.unregisterInnerViewElement(column);
        }
        column.set("grid", null);
    }, removeAllColumns:function() {
        let columns = this._columns.items;
        for (let i = columns.length - 1; i >= 0; i--) {
            this.removeColumn(columns[i]);
        }
    }, getColumn:function(name: any) {
        return this._columns.get(name);
    }, findColumns:function(name: any) {
        function doFindColumns(column: any, name: any, result: any) {
            let cols = column._columns.items;
            for (let i = 0; i < cols.length; i++) {
                let col = cols[i];
                if (col._name === name) {
                    result.push(col);
                }
                if (col instanceof dorado.widget.grid.ColumnGroup) {
                    doFindColumns(col, name, result);
                }
            }
        }
        let result = [];
        doFindColumns(this, name, result);
        return result;
    }, getColumnsInfo:function(fixedColumnCount: any) {
        function getStructure(structure: any, cols: any, row: any) {
            if (structure.length <= row) {
                structure.push([]);
                if (row >= maxRowCount) {
                    maxRowCount = row + 1;
                }
            }
            let cells = structure[row];
            for (let i = 0; i < cols.length; i++) {
                let col = cols[i];
                if (!col._visible) {
                    continue;
                }
                idMap[col._uniqueId] = col;
                let cell = {column:col, row:row, colSpan:1, rowSpan:0, topColIndex:topColIndex};
                if (col instanceof dorado.widget.grid.ColumnGroup) {
                    let oldDataCellCount = dataColCount;
                    getStructure(structure, col._columns.items, row + 1);
                    cell.colSpan = dataColCount - oldDataCellCount;
                    cell.rowSpan = 1;
                } else {
                    dataColCount++;
                    dataColumnInfos.push(cell);
                }
                if (row === 0) {
                    topColIndex++;
                }
                cells.push(cell);
            }
        }
        function extractStructure(structure: any, start: any, end: any) {
            let subStruct = [];
            if (end === undefined) {
                end = Number.MAX_VALUE;
            }
            for (let i = 0; i < structure.length; i++) {
                let row = structure[i], subRow = [];
                for (let j = 0; j < row.length; j++) {
                    let col = row[j];
                    if (col.topColIndex >= start && col.topColIndex <= end) {
                        subRow.push(col);
                    }
                }
                subStruct.push(subRow);
            }
            return subStruct;
        }
        function extractDataColumns(dataColumnInfos: any, start: any, end: any) {
            let dataCols = [];
            if (end === undefined) {
                end = Number.MAX_VALUE;
            }
            for (let i = 0; i < dataColumnInfos.length; i++) {
                let col = dataColumnInfos[i];
                if (col.topColIndex >= start && col.topColIndex <= end) {
                    dataCols.push(col.column);
                }
            }
            return dataCols;
        }
        let cols = this._columns.items, topColIndex = 0, dataColCount = 0, maxRowCount = 0;
        let idMap = {}, fixedColumns, mainColumns = {}, dataColumnInfos = [];
        let tempStruct = [];
        getStructure(tempStruct, cols, 0);
        fixedColumnCount = fixedColumnCount || 0;
        if (fixedColumnCount > 0) {
            fixedColumns = {};
            fixedColumns.structure = extractStructure(tempStruct, 0, fixedColumnCount - 1);
            fixedColumns.dataColumns = extractDataColumns(dataColumnInfos, 0, fixedColumnCount - 1);
        }
        mainColumns.structure = extractStructure(tempStruct, fixedColumnCount);
        mainColumns.dataColumns = extractDataColumns(dataColumnInfos, fixedColumnCount);
        let allDataColumns = [], propertyPaths = [];
        for (let i = 0; i < dataColumnInfos.length; i++) {
            let col = dataColumnInfos[i], column = col.column;
            allDataColumns.push(col.column);
            if (column._property && column._property.indexOf(".") > 0) {
                propertyPaths.push(column._property);
            }
        }
        return {idMap:idMap, fixed:fixedColumns, main:mainColumns, dataColumns:allDataColumns, propertyPaths:(propertyPaths.length ? propertyPaths.join(",") : undefined)};
    }});
    dorado.widget.grid.DefaultCellHeaderRenderer = $extend(dorado.Renderer, {render:function(dom: any, arg: any) {
        let grid = arg.grid, column = arg.column, cell = dom.parentNode, label;
        if (dom.childNodes.length === 1) {
            label = dom.firstChild;
        } else {
            $fly(dom).empty();
            label = $DomUtils.xCreate({tagName:"LABEL", className:"caption"});
            dom.appendChild(label);
        }
        label.innerText = column.get("caption") || "";
        if (column instanceof dorado.widget.grid.DataColumn) {
            let readOnly = false;
            if (grid._dataSet) {
                readOnly = grid._dataSet.get("readOnly");
            }
            readOnly = readOnly && grid.get("readOnly");
            $fly(label).toggleClass("caption-required", !!column.get("required"));
            let sortState = column.get("sortState"), sortIndicator;
            if (sortState) {
                sortIndicator = $DomUtils.xCreate({tagName:"LABEL", className:"sort-state sort-state-" + sortState});
            }
            if (sortIndicator) {
                dom.appendChild(sortIndicator);
            }
        }
    }});
    dorado.widget.grid.Column = $extend(dorado.widget.ViewElement, {$className:"dorado.widget.grid.Column", ATTRIBUTES:{grid:{}, name:{writeOnce:true}, caption:{getter:function() {
        let caption = this._caption;
        if (caption == null) {
            caption = this._name;
        }
        return caption;
    }}, parent:{}, headerAlign:{defaultValue:"center"}, headerRenderer:{}, visible:{defaultValue:true}, supportsOptionMenu:{skipRefresh:true, defaultValue:true}}, EVENTS:{onRenderHeaderCell:{}, onHeaderClick:{}}, constructor:function(config: any) {
        $invokeSuper.call(this, [config]);
        if (!this._name) {
            this._name = this._uniqueId;
        }
    }, destroy:function() {
    }, doSet:function(attr: any, value: any) {
        $invokeSuper.call(this, [attr, value]);
        let grid = this._grid;
        if (grid && grid._rendered) {
            let def = this.ATTRIBUTES[attr];
            if (def && !def.skipRefresh) {
                grid.refresh(true);
            }
        }
    }});
    dorado.widget.grid.RowRenderer = $extend(dorado.Renderer, {rebuildRow:function(grid: any, innerGrid: any, row: any, rowType: any) {
        let dataColumns = innerGrid._columnsInfo.dataColumns, len = dataColumns.length, oldRowType = row.rowType, $row = jQuery(row);
        if (oldRowType === "header") {
            $row.empty();
        }
        $row.toggleClass("group-header-row", (rowType === "header")).toggleClass("group-footer-row", (rowType === "footer"));
        if (rowType === "header") {
            $row.empty();
            let cell = innerGrid.createCell();
            cell.colSpan = len;
            row.appendChild(cell);
        } else {
            $fly(row).empty();
            for (let i = 0; i < len; i++) {
                $DomUtils.getOrCreateChild(row, i, innerGrid.createCell);
            }
            row.columnModelTimestamp = grid._columnModelTimestamp;
        }
        if (rowType) {
            row.rowType = rowType;
        } else {
            row.removeAttribute("rowType");
        }
    }, render:function(row: any, arg: any) {
        let grid = arg.grid, innerGrid = arg.innerGrid, entity = arg.data, dataColumns = innerGrid._columnsInfo.dataColumns;
        let shouldRebuild = (row.rowType !== entity.rowType || row.columnModelTimestamp !== grid._columnModelTimestamp);
        if (!shouldRebuild) {
            shouldRebuild = (entity.rowType !== "header" && row.cells.length !== dataColumns.length) || (entity.rowType === "header" && row.firstChild.colSpan !== dataColumns.length);
        }
        if (shouldRebuild) {
            this.rebuildRow(grid, innerGrid, row, entity.rowType);
        }
        this.doRender(row, arg);
    }});
    dorado.widget.grid.DefaultRowRenderer = $extend(dorado.widget.grid.RowRenderer, {renderCell:function(cellRenderer: any, dom: any, arg: any) {
        let grid = arg.grid, column = arg.column, entity = arg.data, processDefault = true, eventArg = {dom:dom, data:entity, column:column, rowType:entity.rowType, cellRenderer:cellRenderer, processDefault:false};
        if (grid.getListenerCount("onRenderCell")) {
            grid.fireEvent("onRenderCell", grid, eventArg);
            processDefault = eventArg.processDefault;
        }
        if (processDefault) {
            cellRenderer = eventArg.cellRenderer;
            if (column.getListenerCount("onRenderCell")) {
                eventArg.processDefault = false;
                column.fireEvent("onRenderCell", column, eventArg);
                processDefault = eventArg.processDefault;
            }
            if (processDefault) {
                cellRenderer = eventArg.cellRenderer;
                dorado.Renderer.render(cellRenderer, dom, arg);
            }
        }
    }, doRender:function(row: any, arg: any) {
        if (row._lazyRender) {
            return;
        }
        let grid = arg.grid, innerGrid = arg.innerGrid, entity = arg.data, dataColumns = innerGrid._columnsInfo.dataColumns;
        let rowHeightInfos = grid._rowHeightInfos, itemId = row._itemId, oldHeight;
        if (grid._dynaRowHeight) {
            if (innerGrid.fixed) {
                oldHeight = row.clientHeight;
            } else {
                if (rowHeightInfos) {
                    oldHeight = rowHeightInfos.rows[itemId];
                }
            }
            row.style.height = "";
            if (dorado.Browser.msie && dorado.Browser.version === 8) {
                $fly(row).addClass("fix-valign-bug");
            }
        }
        for (let i = 0; i < dataColumns.length; i++) {
            let col = dataColumns[i];
            let cell = row.cells[i];
            let label = cell.firstChild;
            if (grid._dynaRowHeight && col._dynaRowHeight) {
                label.style.overflowY = "visible";
                cell.style.height = grid._rowHeight + "px";
            } else {
                cell.style.height = "";
                label.style.height = (grid._rowHeight - 1) + "px";
            }
            if (col instanceof dorado.widget.grid.DataColumn) {
                label.style.width = col._realWidth + "px";
            }
            let align = "", renderer = col._renderer || grid._cellRenderer;
            if (!renderer) {
                let dt = col.get("dataType");
                let dtCode = dt ? dt._code : -1;
                if (dtCode === dorado.DataType.PRIMITIVE_BOOLEAN || dtCode === dorado.DataType.BOOLEAN) {
                    let pd = col._propertyDef;
                    if (pd && pd._mapping) {
                        renderer = $singleton(dorado.widget.grid.DefaultCellRenderer);
                    } else {
                        renderer = $singleton(dorado.widget.grid.CheckBoxCellRenderer);
                        align = "center";
                    }
                } else {
                    renderer = $singleton(dorado.widget.grid.DefaultCellRenderer);
                }
            }
            cell.align = col._align || align || "left";
            this.renderCell(renderer, label, {grid:grid, innerGrid:arg.innerGrid, data:entity, column:col});
            cell.colId = col._uniqueId;
        }
        if (grid._dynaRowHeight) {
            let h = row.clientHeight;
            if (oldHeight !== h) {
                if (!grid.xScroll || !grid.yScroll) {
                    grid.notifySizeChange();
                }
            }
            if (grid._realFixedColumnCount && rowHeightInfos) {
                if (innerGrid.fixed) {
                    rowHeightInfos.rows[itemId] = h;
                    rowHeightInfos.unfound[itemId] = true;
                } else {
                    delete rowHeightInfos.unfound[itemId];
                    if (oldHeight !== h) {
                        let fh = rowHeightInfos.rows[itemId];
                        if (h > fh) {
                            rowHeightInfos.rows[itemId] = h;
                            rowHeightInfos.unmatched.push(itemId);
                            if (!innerGrid._duringRefreshDom) {
                                grid._fixedInnerGrid.syncroRowHeight(itemId);
                            }
                        } else {
                            if (fh > 0) {
                                if (dorado.Browser.msie && dorado.Browser.version === 8) {
                                    row.style.height = fh + "px";
                                    $fly(row).toggleClass("fix-valign-bug");
                                } else {
                                    row.style.height = fh + "px";
                                }
                            }
                        }
                    }
                }
            }
        }
    }});
    dorado.widget.grid.CellRenderer = $extend(dorado.Renderer, {getText:function(entity: any, column: any) {
        let text = "";
        if (entity) {
            if (column._property) {
                let property;
                if (column._propertyPath && !entity.rowType) {
                    entity = column._propertyPath.evaluate(entity, true);
                    property = column._subProperty;
                } else {
                    property = column._property;
                }
                if (entity) {
                    let dataType = column.get("dataType"), displayFormat = column.get("displayFormat");
                    if (displayFormat) {
                        let value = (entity instanceof dorado.Entity) ? entity.get(property) : entity[property];
                        text = (dataType || dorado.$String).toText(value, displayFormat);
                    } else {
                        text = (entity instanceof dorado.Entity) ? entity.getText(property) : (entity[property] || "");
                    }
                }
            }
        }
        if (text && text.replace && !column._wrappable) {
            text = text.replace(/\n/g, " ");
        }
        return text;
    }, beforeCellValueEdit:function(entity: any, column: any, value: any) {
        column._grid.beforeCellValueEdit(entity, column, value);
    }, onCellValueEdit:function(entity: any, column: any) {
        column._grid.onCellValueEdit(entity, column);
    }, renderFlag:function(dom: any, arg: any) {
        let entity = arg.data, column = arg.column;
        if (!entity.rowType && entity instanceof dorado.Entity && column._property) {
            let property;
            if (column._propertyPath) {
                entity = column._propertyPath.evaluate(entity, true);
                property = column._subProperty;
            } else {
                property = column._property;
            }
            if (entity) {
                let state = entity.getMessageState(property), exCls;
                if (state === "error" || state === "warn") {
                    exCls = "cell-flag-" + state;
                } else {
                    if (entity.isDirty(property)) {
                        exCls = "cell-flag-dirty";
                    }
                }
                dom.parentNode.className = exCls || "";
            }
        }
    }, render:function() {
        this.doRender.apply(this, arguments);
    }});
    dorado.widget.grid.DefaultCellRenderer = $extend(dorado.widget.grid.CellRenderer, {doRender:function(dom: any, arg: any) {
        let text = this.getText(arg.data, arg.column);
        dom.innerText = text;
        dom.title = text.length > 5 ? text : "";
        $fly(dom).toggleClass("wrappable", !!arg.column._wrappable);
        this.renderFlag(dom, arg);
    }});
    dorado.widget.grid.DefaultCellFooterRenderer = $extend(dorado.widget.grid.CellRenderer, {doRender:function(dom: any, arg: any) {
        let entity = arg.data, expired = !!entity.get("$expired");
        dom.innerText = expired ? (arg.column._summaryType ? "..." : "") : this.getText(entity, arg.column);
    }});
    dorado.widget.grid.SubControlCellRenderer = $extend(dorado.widget.grid.DefaultCellRenderer, {doRender:function(dom: any, arg: any) {
        let subControl, data = arg.data;
        if (dom._subControlId && dom.parentNode && dom.parentNode.colId === arg.column._uniqueId) {
            subControl = dorado.widget.ViewElement.ALL[dom._subControlId];
            if (subControl && subControl._gridRowData !== data) {
                dom._subControlId = null;
                subControl.destroy();
                subControl = null;
            }
        }
        let attach;
        if (!subControl) {
            if (data && data.rowType !== "header" && data.rowType !== "footer") {
                subControl = this.createSubControl(arg);
                if (subControl) {
                    subControl._gridRowData = data;
                }
            }
            attach = true;
        }
        if (subControl == null) {
            $fly(dom).empty();
            return;
        } else {
            if (subControl === undefined) {
                $invokeSuper.call(this, arguments);
                return;
            }
        }
        if (this.refreshSubControl) {
            this.refreshSubControl(subControl, arg);
        }
        if (!subControl._cellRendererInited) {
            subControl._cellRendererInited = true;
            let controlEl = subControl.getDom();
            if (controlEl.parentNode === dom) {
                subControl.refresh();
            } else {
                $fly(dom).empty();
                subControl.render(dom);
                dom._subControlId = subControl._uniqueId;
            }
            jQuery(controlEl).bind("remove", function() {
                let control = dorado.widget.ViewElement.ALL[dom._subControlId];
                dom._subControlId = null;
                if (control) {
                    control.destroy();
                }
            });
            subControl.bind("onClick", function() {
                arg.grid._editing = false;
                arg.grid._doSetCurrentColumn(arg.column, false);
            });
            arg.innerGrid.registerInnerControl(subControl);
        }
        this.renderFlag(dom, arg);
    }});
    dorado.widget.grid.CheckBoxCellRenderer = $extend(dorado.widget.grid.SubControlCellRenderer, {preventCellEditing:true, createSubControl:function(arg: any) {
        let self = this;
        let checkbox = new dorado.widget.CheckBox({iconOnly:true, beforePost:function(control: any, arg: any) {
            arg.processDefault = self.beforeCellValueEdit(control._cellEntity, control._cellColumn, control.get("value"));
        }, onPost:function(control: any) {
            let column = control._cellColumn, entity = control._cellEntity, value = control.get("value"), property;
            if (column._propertyPath) {
                entity = column._propertyPath.evaluate(entity, true);
                if (!entity) {
                    return;
                }
                property = column._subProperty;
            } else {
                property = column._property;
            }
            (entity instanceof dorado.Entity) ? entity.set(property, value) : entity[property] = value;
            self.onCellValueEdit(entity, column);
        }});
        let dt = arg.column.get("dataType");
        if (dt) {
            switch (dt._code) {
              case dorado.DataType.BOOLEAN:
                checkbox.set("triState", true);
                break;
              case dorado.DataType.PRIMITIVE_INT:
              case dorado.DataType.PRIMITIVE_FLOAT:
                checkbox.set({offValue:0, onValue:1});
                break;
              case dorado.DataType.INTEGER:
              case dorado.DataType.FLOAT:
                checkbox.set({offValue:0, onValue:1, triState:true});
                break;
            }
        }
        return checkbox;
    }, refreshSubControl:function(checkbox: any, arg: any) {
        let column = arg.column, entity = arg.data, property;
        if (column._propertyPath) {
            entity = column._propertyPath.evaluate(entity, true);
            if (!entity) {
                return;
            }
            property = column._subProperty;
        } else {
            property = column._property;
        }
        let value = (entity instanceof dorado.Entity) ? entity.get(property) : entity[property];
        checkbox._cellEntity = entity;
        checkbox._cellColumn = column;
        checkbox.disableListeners();
        checkbox.set({readOnly:!arg.grid.shouldEditing(column), value:value});
        checkbox.refresh();
        checkbox.enableListeners();
    }});
    dorado.widget.grid.RadioGroupCellRenderer = $extend(dorado.widget.grid.SubControlCellRenderer, {preventCellEditing:true, getRadioButtons:function(arg: any) {
        let radioButtons = [];
        let pd = arg.column._propertyDef;
        if (pd && pd._mapping) {
            for (let i = 0; i < pd._mapping.length; i++) {
                let item = pd._mapping[i];
                radioButtons.push({value:item.key, text:item.value});
            }
        }
        return radioButtons;
    }, createSubControl:function(arg: any) {
        let self = this;
        return new dorado.widget.RadioGroup({width:"100%", radioButtons:this.getRadioButtons(arg), beforePost:function(control: any, arg: any) {
            arg.processDefault = self.beforeCellValueEdit(control._cellEntity, control._cellColumn, control.get("value"));
        }, onPost:function(control: any) {
            let column = control._cellColumn, entity = control._cellEntity, value = control.get("value"), property;
            if (column._propertyPath) {
                entity = column._propertyPath.evaluate(entity, true);
                if (!entity) {
                    return;
                }
                property = column._subProperty;
            } else {
                property = column._property;
            }
            (entity instanceof dorado.Entity) ? entity.set(property, value) : entity[property] = value;
            self.onCellValueEdit(entity, column);
        }});
    }, refreshSubControl:function(radioGroup: any, arg: any) {
        let column = arg.column, entity = arg.data, property;
        if (column._propertyPath) {
            entity = column._propertyPath.evaluate(entity, true);
            if (!entity) {
                return;
            }
            property = column._subProperty;
        } else {
            property = column._property;
        }
        let value = (entity instanceof dorado.Entity) ? entity.get(property) : entity[property];
        radioGroup._cellEntity = entity;
        radioGroup._cellColumn = column;
        radioGroup.disableListeners();
        radioGroup.set({readOnly:!arg.grid.shouldEditing(column), value:value});
        radioGroup.refresh();
        radioGroup.enableListeners();
    }});
    dorado.widget.grid.ProgressBarCellRenderer = $extend(dorado.widget.grid.SubControlCellRenderer, {createSubControl:function(arg: any) {
        return new dorado.widget.ProgressBar();
    }, refreshSubControl:function(progressBar: any, arg: any) {
        let column = arg.column, entity = arg.data, property;
        if (column._propertyPath) {
            entity = column._propertyPath.evaluate(entity, true);
            if (!entity) {
                return;
            }
            property = column._subProperty;
        } else {
            property = column._property;
        }
        let value = (entity instanceof dorado.Entity) ? entity.get(property) : entity[property];
        progressBar.set("value", parseFloat(value) || 0);
    }});
    dorado.widget.grid.GroupHeaderRenderer = $extend(dorado.widget.grid.RowRenderer, {doRender:function(dom: any, arg: any) {
        if (dom._lazyRender) {
            return;
        }
        let grid = arg.grid, entity = arg.data, processDefault = true;
        if (grid.getListenerCount("onRenderCell")) {
            let arg = {dom:dom, data:entity, rowType:entity.rowType, processDefault:false};
            grid.fireEvent("onRenderCell", grid, arg);
            processDefault = arg.processDefault;
        }
        if (processDefault) {
            dom.firstChild.firstChild.innerText = entity.getText("$groupValue") + " (" + entity.get("$count") + ")";
        }
    }});
    dorado.widget.grid.GroupFooterRenderer = $extend(dorado.widget.grid.DefaultRowRenderer, {renderCell:function(cellRenderer: any, dom: any, arg: any) {
        let grid = arg.grid, entity = arg.data, processDefault = true;
        if (grid.getListenerCount("onRenderCell")) {
            let arg = {dom:dom, data:entity, column:arg.column, rowType:entity.rowType, processDefault:false};
            grid.fireEvent("onRenderCell", grid, arg);
            processDefault = arg.processDefault;
        }
        if (processDefault) {
            if (!!entity.get("$expired")) {
                dom.innerText = arg.column._summaryType ? "..." : "";
            } else {
                dorado.Renderer.render(cellRenderer, dom, arg);
            }
        }
    }});
    dorado.widget.grid.CellEditor = $class({$className:"dorado.widget.grid.CellEditor", cachable:true, hideCellContent:true, destroy:function() {
    }, bindColumn:function(column: any) {
        this.grid = column._grid;
        this.column = column;
    }, createDom:function() {
        return $DomUtils.xCreate({tagName:"DIV", className:"d-grid-cell-editor" + (this.showBorder ? " d-grid-cell-editor-border" : ""), style:{position:"absolute"}});
    }, getDom:function() {
        if (!this._dom) {
            this._dom = this.createDom();
            let fn = function() {
                return false;
            };
            $fly(this._dom).mousewheel(fn);
            this.grid.getDom().appendChild(this._dom);
        }
        return this._dom;
    }, resize:function() {
        let dom = this.getDom(), cell = this.cell, $gridDom = jQuery(this.grid.getDom());
        if (!dom || !cell) {
            return;
        }
        let offsetGrid = $gridDom.offset(), offsetCell = $fly(cell).offset();
        let l = offsetCell.left - offsetGrid.left - $gridDom.edgeLeft(), t = offsetCell.top - offsetGrid.top - $gridDom.edgeTop(), w = cell.offsetWidth, h = cell.offsetHeight;
        if (!this.grid._divScroll && $gridDom.scrollLeft() > 0) {
            l += $gridDom.scrollLeft();
        }
        if (this.minWidth && this.minWidth > w) {
            w = this.minWidth;
        }
        if (this.minHeight && this.minHeight > h) {
            h = this.minHeight;
        }
        $fly(dom).css({left:l, top:t}).outerWidth(w).outerHeight(h);
    }, shouldShow:function() {
        return this.column && this.column._property;
    }, show:function(parent: any, cell: any) {
        this.cell = cell;
        let dom = this.getDom();
        this.grid.getDom().appendChild(dom);
        this.initDom(dom);
        this.refresh();
        let self = this;
        if (dorado.Browser.mozilla) {
            setTimeout(function() {
                self.resize();
            }, 0);
        } else {
            self.resize();
        }
        $fly(window).one("resize", function() {
            self.hide();
        });
        if (this.hideCellContent) {
            cell.firstChild.style.visibility = "hidden";
        }
        this.visible = true;
    }, hide:function(post: any) {
        let grid = this.grid;
        if (post !== false) {
            if (this.post) {
                this.post();
            }
        } else {
            if (this.cancel) {
                this.cancel();
            }
        }
        $DomUtils.getUndisplayContainer().appendChild(this.getDom());
        delete this.data;
        if (grid._currentCellEditor === this) {
            delete grid._currentCellEditor;
        }
        this.visible = false;
        if (this.cell) {
            if (this.hideCellContent) {
                this.cell.firstChild.style.visibility = "";
            }
            this.cell = null;
        }
    }, getEditorValue:function() {
        return null;
    }, beforePost:function(arg: any) {
        arg.processDefault = this.grid.beforeCellValueEdit(this.data, this.column, this.getEditorValue());
    }, onPost:function(arg: any) {
        if (this.visible) {
            this.grid.onCellValueEdit(this.data, this.column);
        }
    }});
    dorado.widget.grid.ControlCellEditor = $extend(dorado.widget.grid.CellEditor, {destroy:function() {
        if (this._editorControl) {
            this._editorControl.destroy();
        }
        $invokeSuper.call(this);
    }, shouldShow:function() {
        let shouldShow = $invokeSuper.call(this);
        if (shouldShow) {
            let column = this.column, dataType = column.get("dataType"), dtCode = dataType ? dataType._code : -1;
            let trigger = column.get("trigger"), pd = column._propertyDef;
            if (!trigger && !(pd && pd._mapping) && (dtCode === dorado.DataType.PRIMITIVE_BOOLEAN || dtCode === dorado.DataType.BOOLEAN)) {
                shouldShow = false;
            }
        }
        return shouldShow;
    }, setEditorControl:function(editorControl: any) {
        if (this._editorControl) {
            this._editorControl.destroy();
        }
        this._editorControl = editorControl;
    }, getEditorControl:function(create: any) {
        let editorControl = null;
        if (this._editorControl) {
            editorControl = this._editorControl;
        } else {
            if (create === false) {
                return null;
            }
            let column = this.column;
            if (column._editor) {
                editorControl = column._editor;
            } else {
                if (column._editorType) {
                    if (column._editorType !== "None") {
                        let cacheKey = "_cache_" + column._editorType;
                        editorControl = this[cacheKey];
                        if (!editorControl) {
                            editorControl = dorado.Toolkits.createInstance("widget", column._editorType);
                            this[cacheKey] = editorControl;
                        }
                    }
                } else {
                    editorControl = this.createEditorControl();
                    if (editorControl) {
                        this.grid.registerInnerControl(editorControl);
                    }
                }
            }
            if (this.cachable) {
                this._editorControl = editorControl;
            }
            if (editorControl && editorControl instanceof dorado.widget.TextArea) {
                let attrWatcher = editorControl.getAttributeWatcher();
                this.minWidth = (attrWatcher.getWritingTimes("width")) ? editorControl.get("width") : 120;
                this.minHeight = (attrWatcher.getWritingTimes("height")) ? editorControl.get("height") : 40;
            }
        }
        let column = this.column, cellEditor = this, pd = column._propertyDef;
        let dataType = column.get("dataType"), dtCode = dataType ? dataType._code : -1;
        let trigger = column.get("trigger"), displayFormat = column.get("displayFormat"), typeFormat = column.get("typeFormat");
        if (!dtCode || (pd && pd._mapping)) {
            dataType = undefined;
        }
        if (trigger === undefined) {
            if (pd && pd._mapping) {
                trigger = new dorado.widget.AutoMappingDropDown({items:pd._mapping});
            } else {
                if (dtCode === dorado.DataType.DATE) {
                    trigger = "defaultDateDropDown";
                } else {
                    if (dtCode === dorado.DataType.DATETIME) {
                        trigger = "defaultDateTimeDropDown";
                    }
                }
            }
        }
        if (editorControl) {
            editorControl.set({dataType:dataType, displayFormat:displayFormat, typeFormat:typeFormat, trigger:trigger, editable:column._editable}, {skipUnknownAttribute:true, tryNextOnError:true, preventOverwriting:true, lockWritingTimes:true});
        }
        if (editorControl && !editorControl._initedForCellEditor) {
            editorControl._initedForCellEditor = true;
            editorControl.bind("onBlur", function(self: any) {
                if ((new Date() - cellEditor._showTimestamp) > 300) {
                    cellEditor.hide();
                }
            });
            if (editorControl instanceof dorado.widget.AbstractEditor) {
                editorControl.bind("beforePost", function(self: any, arg: any) {
                    cellEditor.beforePost(arg);
                }).bind("onPost", function(self: any, arg: any) {
                    cellEditor.onPost(arg);
                });
                editorControl._cellEditor = cellEditor;
                editorControl._propertyDef = column._propertyDef;
            }
            this.grid.registerInnerControl(editorControl);
        }
        return editorControl;
    }, getContainerElement:function(dom: any) {
        return dom;
    }, initDom:function(dom: any) {
        let editorControl = this.getEditorControl();
        let containerElement = this.getContainerElement(dom);
        if (containerElement.firstChild) {
            let originControl = dorado.widget.Control.findParentControl(containerElement.firstChild);
            if (originControl && originControl !== editorControl) {
                originControl.unrender();
            }
        }
        if (editorControl && !editorControl._rendered) {
            editorControl.render(containerElement);
        }
    }, resize:function() {
        let dom = this.getDom(), control = this.getEditorControl();
        let ie6 = (dorado.Browser.msie && dorado.Browser.version < 7);
        if (control) {
            if (ie6) {
                control.getDom().style.display = "none";
            }
        }
        $invokeSuper.call(this);
        if (control) {
            let w = dom.clientWidth, h = dom.clientHeight;
            if (ie6) {
                control.getDom().style.display = "";
            }
            control.set({width:w, height:h}, {tryNextOnError:true});
            control.refresh();
        }
    }, show:function(parent: any, cell: any) {
        $invokeSuper.call(this, [parent, cell]);
        let control = this.getEditorControl();
        if (!control) {
            return;
        }
        control.set("focusParent", parent._grid);
        control.setActualVisible(true);
        control.setFocus();
    }, hide:function(post: any) {
        if (this._processingHide) {
            return;
        }
        this._processingHide = true;
        try {
            $invokeSuper.call(this, [post]);
            let control = this.getEditorControl(false);
            if (control) {
                dorado.widget.onControlGainedFocus(control.get("focusParent"));
                control.set("focusParent", null);
                control.setActualVisible(false);
            }
        }
        finally {
            this._processingHide = false;
        }
    }});
    dorado.widget.grid.SimpleCellEditor = $extend(dorado.widget.grid.ControlCellEditor, {refresh:function() {
        let editor = this.getEditorControl();
        if (!editor) {
            return;
        }
        let entity = this.data, column = this.column, property, value;
        if (column._propertyPath) {
            property = column._subProperty;
        } else {
            property = column._property;
        }
        if (entity) {
            if (entity instanceof dorado.Entity) {
                if (editor instanceof dorado.widget.AbstractTextEditor) {
                    let propertyDef = entity.getPropertyDef(property);
                    if (propertyDef && column.get("dataType") && !propertyDef.get("mapping")) {
                        value = entity.get(property);
                        editor.set("value", value);
                    } else {
                        value = entity.getText(property);
                        editor.set("text", value);
                    }
                    editor.setValidationState(entity.getMessageState(property), entity.getMessages(property));
                } else {
                    value = entity.get(property);
                    editor.set("value", value);
                }
            } else {
                value = entity[property];
                editor.set("value", value);
            }
        } else {
            editor.set("value", null);
        }
    }, getEditorValue:function() {
        let editor = this.getEditorControl();
        return editor ? editor.get("value") : null;
    }, post:function() {
        let editor = this.getEditorControl(false);
        return (editor) ? editor.post() : false;
    }, onPost:function(arg: any) {
        let editor = this.getEditorControl(false);
        if (!editor) {
            return;
        }
        let entity = this.data, column = this.column, property, value;
        if (column._propertyPath) {
            property = column._subProperty;
        } else {
            property = column._property;
        }
        if (entity) {
            if (entity instanceof dorado.Entity) {
                if (editor instanceof dorado.widget.AbstractTextEditor) {
                    value = editor.get("value");
                    let pd = column._propertyDef;
                    if (pd && pd._mapping) {
                        entity.setText(property, editor.get("text"));
                    } else {
                        entity.set(property, value);
                    }
                } else {
                    value = editor.get("value");
                    entity.set(property, value);
                }
            } else {
                value = editor.get("value");
                entity[property] = value;
            }
        }
        $invokeSuper.call(this, [arg]);
    }});
    dorado.widget.grid.DefaultCellEditor = $extend(dorado.widget.grid.SimpleCellEditor, {createEditorControl:function() {
        let editor, column = this.column, grid = column._grid;
        let dt = column.get("dataType"), dtCode = dt ? dt._code : -1;
        let trigger = column.get("trigger"), displayFormat = column.get("displayFormat"), typeFormat = column.get("typeFormat");
        let pd = column._propertyDef;
        if (trigger === undefined) {
            if (pd && pd._mapping) {
                trigger = new dorado.widget.AutoMappingDropDown({items:pd._mapping});
            } else {
                if (dtCode === dorado.DataType.PRIMITIVE_BOOLEAN || dtCode === dorado.DataType.BOOLEAN) {
                    editor = new dorado.widget.CheckBox({onValue:true, offValue:false, triState:(dtCode === dorado.DataType.BOOLEAN)});
                    $fly(editor.getDom()).addClass("d-checkbox-center");
                } else {
                    if (dtCode === dorado.DataType.DATE) {
                        trigger = "defaultDateDropDown";
                    } else {
                        if (dtCode === dorado.DataType.DATETIME) {
                            trigger = "defaultDateTimeDropDown";
                        }
                    }
                }
            }
        }
        if (editor === undefined) {
            if (column._wrappable && dtCode !== dorado.DataType.TIME && dtCode !== dorado.DataType.DATE && dtCode !== dorado.DataType.DATETIME) {
                editor = new dorado.widget.TextArea();
            } else {
                editor = new dorado.widget.TextEditor();
            }
        }
        return editor;
    }, show:function(parent: any, cell: any) {
        this._showTimestamp = new Date();
        let editor = this.getEditorControl();
        let sameEditor = (dorado.widget.getMainFocusedControl() === editor);
        if (sameEditor && editor) {
            editor.onBlur();
        }
        $invokeSuper.call(this, [parent, cell]);
        if (sameEditor && editor) {
            editor.onFocus();
        }
    }});
    dorado.widget.grid.DataColumn = $extend(dorado.widget.grid.Column, {$className:"dorado.widget.grid.DataColumn", ATTRIBUTES:{width:{defaultValue:"*", setter:function(width: any) {
        this._width = width;
        delete this._realWidth;
    }}, dynaRowHeight:{defaultValue:true}, caption:{getter:function() {
        let caption = this._caption;
        if (caption == null && this._propertyDef) {
            caption = this._propertyDef.get("label");
        }
        if (caption == null) {
            caption = (this._name.charAt(0) === "_" ? this._property : this._name);
        }
        return caption;
    }}, name:{setter:function(v: any) {
        this._name = v;
        if (!this.getAttributeWatcher().getWritingTimes("property") && !this.ATTRIBUTES.property.defaultValue) {
            this._property = v;
        }
    }}, property:{writeOnce:true, setter:function(property: any) {
        this._property = property;
        let i = 0;
        if (property) {
            i = property.lastIndexOf(".");
            if (i > 0) {
                this._propertyPath = dorado.DataPath.create(property.substring(0, i));
                this._subProperty = property.substring(i + 1);
            }
        }
        if (i <= 0) {
            delete this._propertyPath;
            delete this._subProperty;
        }
        if (!this.getAttributeWatcher().getWritingTimes("name") && !this.ATTRIBUTES.name.defaultValue) {
            this._name = property;
        }
    }}, align:{setter:function(align: any) {
        this._align = align;
        if (align) {
            if (!this._footerAlign) {
                this._footerAlign = align;
            }
        }
    }}, footerAlign:{}, dataType:{getter:function() {
        let dt = dorado.LazyLoadDataType.dataTypeGetter.call(this);
        if (!dt && this._propertyDef) {
            dt = this._propertyDef.get("dataType");
        }
        return dt;
    }}, dataTypeRepository:{getter:function() {
        if (this._grid) {
            let view = this._grid.get("view");
            if (view) {
                return view.getDataTypeRepository();
            }
        }
        return null;
    }, readOnly:true}, readOnly:{skipRefresh:true, getter:function() {
        let readOnly = this._readOnly;
        if (!readOnly && this._propertyDef) {
            readOnly = this._propertyDef.get("readOnly");
        }
        return readOnly;
    }}, required:{getter:function() {
        let required = this._required;
        if (!required && this._propertyDef) {
            required = this._propertyDef.get("required");
        }
        return required;
    }}, typeFormat:{skipRefresh:true, getter:function() {
        let typeFormat = this._typeFormat;
        if (!typeFormat && this._propertyDef) {
            typeFormat = this._propertyDef.get("typeFormat");
        }
        return typeFormat;
    }}, displayFormat:{getter:function() {
        let displayFormat = this._displayFormat;
        if (!displayFormat && this._propertyDef) {
            displayFormat = this._propertyDef.get("displayFormat");
        }
        return displayFormat;
    }}, trigger:{skipRefresh:true}, editable:{defaultValue:true}, renderer:{setter:function(value: any) {
        if (typeof value === "string") {
            value = dorado.Core.createClassFromString(value);
        }
        this._renderer = value;
    }}, footerRenderer:{setter:function(value: any) {
        if (typeof value === "string") {
            value = dorado.Core.createClassFromString(value);
        }
        this._footerRenderer = value;
    }}, filterBarRenderer:{setter:function(value: any) {
        if (typeof value === "string") {
            value = dorado.Core.createClassFromString(value);
        }
        this._filterBarRenderer = value;
    }}, summaryType:{writeOnce:true}, editorType:{}, editor:{setter:function(editor: any) {
        if (!(editor instanceof dorado.widget.Control)) {
            editor = dorado.Toolkits.createInstance("widget", editor, function(type: any) {
                return dorado.Toolkits.getPrototype("widget", type || "TextEditor");
            });
        }
        this._editor = editor;
    }}, cellEditor:{readOnly:true}, sortState:{skipRefresh:true}, wrappable:{}, propertyDef:{readOnly:true}, filterable:{defaultValue:true}, defaultFilterOperator:{}, resizeable:{defaultValue:true}}, EVENTS:{onRenderCell:{}, onRenderFooterCell:{}, onGetCellEditor:{}}, destroy:function() {
        if (this._cellEditor) {
            this._cellEditor.destroy();
        }
    }});
    dorado.widget.grid.ColumnGroup = $extend([dorado.widget.grid.Column, dorado.widget.grid.ColumnModel], {$className:"dorado.widget.grid.ColumnGroup", ATTRIBUTES:{grid:{setter:function(grid: any) {
        let oldGrid = this._grid;
        this._grid = grid;
        this._columns.each(function(column: any) {
            if (oldGrid) {
                oldGrid.unregisterInnerViewElement(column);
            }
            if (grid) {
                grid.registerInnerViewElement(column);
            }
            column.set("grid", grid);
        });
    }}}, constructor:function(config: any) {
        this._columns = new dorado.widget.grid.ColumnList(this);
        $invokeSuper.call(this, [config]);
    }, doGet:dorado.widget.grid.ColumnModel.prototype.doGet});
    dorado.widget.grid.IndicatorColumn = $extend(dorado.widget.grid.DataColumn, {ATTRIBUTES:{width:{defaultValue:16}, dynaRowHeight:{defaultValue:false}, caption:{defaultValue:"Indicator"}, property:{defaultValue:"none"}, resizeable:{defaultValue:false}, filterable:{defaultValue:false}, headerRenderer:{dontEvalDefaultValue:true, defaultValue:function(dom: any, arg: any) {
        $fly(dom).empty();
        $fly(dom.parentNode).addClass("indicator");
    }}, renderer:{dontEvalDefaultValue:true, defaultValue:function(dom: any, arg: any) {
        if (arg.data.rowType) {
            return;
        }
        let className = "indicator-none";
        if (arg.data instanceof dorado.Entity) {
            let entity = arg.data;
            let messageState = entity.getMessageState();
            if (messageState === "warn" || messageState === "error") {
                className = "indicator-" + messageState;
            } else {
                switch (entity.state) {
                  case dorado.Entity.STATE_NEW:
                    className = "indicator-new";
                    break;
                  case dorado.Entity.STATE_MODIFIED:
                  case dorado.Entity.STATE_MOVED:
                    className = "indicator-modified";
                    break;
                }
            }
        }
        dom.style.height = "auto";
        dom.innerHTML = "";
        dom.className = "cell indicator " + className;
    }}}});
    dorado.widget.grid.RowNumColumn = $extend(dorado.widget.grid.DataColumn, {ATTRIBUTES:{width:{defaultValue:16}, dynaRowHeight:{defaultValue:false}, caption:{defaultValue:"RowNum"}, align:{defaultValue:"center"}, property:{defaultValue:"none"}, resizeable:{defaultValue:false}, filterable:{defaultValue:false}, headerRenderer:{dontEvalDefaultValue:true, defaultValue:function(dom: any, arg: any) {
        $fly(dom).empty();
        $fly(dom.parentNode).addClass("row-num");
    }}, renderer:{dontEvalDefaultValue:true, defaultValue:function(dom: any, arg: any) {
        let row = dom.parentNode.parentNode;
        dom.style.height = "auto";
        dom.innerHTML = arg.grid._groupProperty ? "" : row.itemIndex + 1;
    }}}});
    dorado.widget.grid.RowSelectorCellRenderer = $extend(dorado.widget.grid.SubControlCellRenderer, {ATTRIBUTES:{checkboxMap:{}}, cellMouseDownListener:function(arg: any) {
        if (arg.grid._selectionMode === "multiRows") {
            return false;
        }
    }, gridOnSelectionChangedListener:function(grid: any, arg: any) {
        let itemModel = grid._itemModel;
        let selectionMode = grid._selectionMode, removed = arg.removed, added = arg.added, checkbox;
        if (selectionMode === "multiRows") {
            if (removed) {
                for (let i = 0; i < removed.length; i++) {
                    checkbox = this._checkboxMap[itemModel.getItemId(removed[i])];
                    if (checkbox) {
                        checkbox.set("checked", false);
                    }
                }
            }
            if (added) {
                for (let i = 0; i < added.length; i++) {
                    checkbox = this._checkboxMap[itemModel.getItemId(added[i])];
                    if (checkbox) {
                        checkbox.set("checked", true);
                    }
                }
            }
        } else {
            if (selectionMode === "singleRow") {
                if (removed) {
                    checkbox = this._checkboxMap[itemModel.getItemId(removed)];
                    if (checkbox) {
                        checkbox.set("checked", false);
                    }
                }
                if (added) {
                    checkbox = this._checkboxMap[itemModel.getItemId(added)];
                    if (checkbox) {
                        checkbox.set("checked", true);
                    }
                }
            }
        }
    }, createSubControl:function(arg: any) {
        let self = this;
        if (!this._listenerBinded) {
            this._listenerBinded = true;
            arg.grid.bind("onSelectionChange", $scopify(this, this.gridOnSelectionChangedListener));
        }
        let checkbox = new dorado.widget.CheckBox({iconOnly:true, onValueChange:function(checkbox: any) {
            let grid = arg.grid, innerGrid = grid._innerGrid, selectionMode = grid._selectionMode;
            let data = grid.get("itemModel").getItemById(checkbox._selectDataId), checked = checkbox.get("checked");
            let newSelection = (selectionMode === "multiRows") ? [data] : data;
            innerGrid.replaceSelection.apply(innerGrid, checked ? [null, newSelection] : [newSelection, null]);
            let selection = innerGrid._selection;
            if (selection && selection instanceof Array) {
                checked = (selection.indexOf(data) >= 0);
            } else {
                checked = (selection === data);
            }
            if (checkbox.get("checked") !== checked) {
                checkbox.disableListeners();
                checkbox.set("checked", checked);
                checkbox.enableListeners();
            }
        }, onDestroy:function() {
            let id = checkbox._selectDataId;
            if (id != null) {
                delete self._checkboxMap[id];
            }
        }});
        $fly(checkbox.getDom()).mousedown(function() {
            return self.cellMouseDownListener(arg);
        });
        return checkbox;
    }, refreshSubControl:function(checkbox: any, arg: any) {
        if (arg.data.rowType) {
            checkbox.destroy();
            return;
        }
        let grid = arg.grid, data = arg.dataForSelection || arg.data, selection = grid._innerGrid._selection, selectionMode = grid._selectionMode, config = {};
        if (selectionMode === "multiRows") {
            config.checked = (selection && selection.indexOf(data) >= 0);
            config.readOnly = false;
        } else {
            if (selectionMode === "singleRow") {
                config.checked = (data === selection);
                config.readOnly = false;
            } else {
                config.checked = false;
                config.readOnly = true;
            }
        }
        checkbox.set(config);
        checkbox.refresh();
        checkbox._selectDataId = grid._itemModel.getItemId(data);
        if (!this._checkboxMap) {
            this._checkboxMap = {};
        }
        this._checkboxMap[checkbox._selectDataId] = checkbox;
    }});
    dorado.widget.grid.RowSelectorColumn = $extend(dorado.widget.grid.DataColumn, {ATTRIBUTES:{width:{defaultValue:16}, dynaRowHeight:{defaultValue:false}, align:{defaultValue:"center"}, caption:{defaultValue:"RowSelector"}, property:{defaultValue:"none"}, resizeable:{defaultValue:false}, filterable:{defaultValue:false}, headerRenderer:{dontEvalDefaultValue:true, defaultValue:function(dom: any, arg: any) {
        function getMenu(column: any) {
            let menu = column._rowSelectorMenu;
            if (!menu) {
                menu = column._rowSelectorMenu = new dorado.widget.Menu({items:[{name:"select-all", caption:$resource("dorado.grid.SelectAll"), onClick:function(self: any) {
                    grid.selectAll();
                }}, {name:"unselect-all", caption:$resource("dorado.grid.UnselectAll"), onClick:function(self: any) {
                    grid.unselectAll();
                }}, {name:"select-invert", caption:$resource("dorado.grid.SelectInvert"), onClick:function(self: any) {
                    grid.selectInvert();
                }}]});
                grid.registerInnerControl(menu);
            }
            return menu;
        }
        let grid = arg.grid, column = arg.column, cell = dom.parentNode;
        $fly(dom).empty();
        let $cell = $fly(cell);
        $cell.addClass("row-selector");
        if (!$cell.data("selectionMenuBinded")) {
            $cell.data("selectionMenuBinded", true).click(function() {
                if (grid._selectionMode === "multiRows") {
                    let menu = getMenu(column);
                    menu.show({anchorTarget:cell, align:"innerright", vAlign:"bottom"});
                }
                return false;
            });
        }
    }}, renderer:{defaultValue:function() {
        return new dorado.widget.grid.RowSelectorCellRenderer();
    }}}});
    dorado.widget.grid.FilterBarCellRenderer = $extend(dorado.widget.grid.SubControlCellRenderer, {createFilterExpressionEditor:function(arg: any) {
        let self = this, column = arg.column, grid = arg.grid;
        let textEditor = new dorado.widget.TextEditor({width:"100%", onBlur:function(textEditor: any) {
            let filterEntity = grid.get("filterEntity");
            let criterion = filterEntity.get(column._property);
            textEditor.set("text", criterion ? dorado.widget.grid.DataColumn.criterionToText(criterion, column) : "");
        }, onPost:function(textEditor: any) {
            let criterion = dorado.widget.grid.DataColumn.parseCriterion(textEditor.get("text"), column);
            let filterEntity = grid.get("filterEntity");
            filterEntity.disableObservers();
            filterEntity.set(column._property, criterion);
            filterEntity.enableObservers();
            grid.filter();
        }, onKeyDown:function(textEditor: any, arg: any) {
            if (arg.keyCode === 13) {
                textEditor.post(true);
            }
        }, onTextEdit:function(textEditor: any) {
            let criterionDropDown = textEditor.get("trigger");
            if (criterionDropDown && criterionDropDown instanceof dorado.widget.Component && criterionDropDown.get("opened") && criterionDropDown.get("editor") === textEditor) {
                criterionDropDown.close();
            }
        }});
        textEditor.set("trigger", "defaultCriterionDropDown");
        return textEditor;
    }, createSubControl:function(arg: any) {
        let column = arg.column;
        if (column._property && column._filterable) {
            return this.createFilterExpressionEditor(arg);
        } else {
            return null;
        }
    }, refreshSubControl:function(textEditor: any, arg: any) {
        let text, entity = arg.data, column = arg.column, property = column._property, criterion = entity.get(property);
        if (criterion) {
            text = dorado.widget.grid.DataColumn.criterionToText(criterion, column);
        }
        textEditor._cellColumn = arg.column;
        textEditor.disableListeners();
        if (text) {
            textEditor.set("text", text);
        } else {
            textEditor.set("value", null);
        }
        textEditor.refresh();
        textEditor.enableListeners();
    }});
    dorado.Toolkits.registerPrototype("gridcolumn", {"Group":dorado.widget.grid.ColumnGroup, "*":dorado.widget.grid.IndicatorColumn, "#":dorado.widget.grid.RowNumColumn, "[]":dorado.widget.grid.RowSelectorColumn});
})();
(function() {
    let MIN_COL_WIDTH = 8;
    function getEntityValue(entity: any, property: any) {
        if (property.indexOf(".") > 0) {
            return dorado.DataPath.create(property).evaluate(entity, true);
        } else {
            return (entity instanceof dorado.Entity) ? entity.get(property) : entity[property];
        }
    }
    function getEntityText(entity: any, property: any) {
        let i = property.lastIndexOf(".");
        if (i > 0) {
            if (entity instanceof dorado.Entity) {
                let dataPath = dorado.DataPath.create(property.substring(0, i));
                let subProperty = property.substring(i + 1);
                entity = dataPath.evaluate(entity);
                return entity ? entity.getText(subProperty) : "";
            } else {
                return dorado.DataPath.create(property).evaluate(entity, true) || "";
            }
        } else {
            return (entity instanceof dorado.Entity) ? entity.getText(property) : entity[property];
        }
    }
    GroupedItemIterator = $extend(dorado.util.Iterator, {constructor:function(groups: any, showFooter: any, nextIndex: any) {
        this.groups = groups;
        this.showFooter = showFooter;
        if (nextIndex > 0) {
            nextIndex--;
            let g;
            for (let i = 0; i < groups.length; i++) {
                g = groups[i], gs = g.entities.length + 1 + (showFooter ? 1 : 0);
                if (gs <= nextIndex) {
                    nextIndex -= gs;
                } else {
                    this.groupIndex = i;
                    this.entityIndex = nextIndex - 1;
                    this.isFirst = this.isLast = false;
                    this.currentGroup = g;
                    break;
                }
            }
        } else {
            this.first();
        }
    }, first:function() {
        this.groupIndex = 0;
        this.entityIndex = -2;
        this.isFirst = true;
        this.isLast = (this.groups.length === 0);
        this.currentGroup = this.groups[this.groupIndex];
    }, last:function() {
        this.groupIndex = this.groups.length - 1;
        this.entityIndex = this.currentGroup.length + (this.showFooter ? 1 : 0);
        this.isFirst = (this.groups.length === 0);
        this.isLast = true;
        this.currentGroup = this.groups[this.groupIndex];
    }, hasPrevious:function() {
        if (this.isFirst || this.groups.length === 0) {
            return false;
        }
        if (this.groupIndex <= 0 && this.entityIndex <= -1) {
            return false;
        }
        return true;
    }, hasNext:function() {
        if (this.isLast || this.groups.length === 0) {
            return false;
        }
        let maxEntityIndex = this.currentGroup.entities.length + (this.showFooter ? 0 : -1);
        if (this.groupIndex >= this.groups.length - 1 && this.entityIndex >= maxEntityIndex) {
            return false;
        }
        return true;
    }, current:function() {
        if (this.entityIndex === -1) {
            return this.currentGroup.headerEntity;
        } else {
            if (this.entityIndex >= this.currentGroup.entities.length) {
                return this.currentGroup.footerEntity;
            } else {
                return this.currentGroup.entities[this.entityIndex];
            }
        }
    }, previous:function() {
        if (this.entityIndex >= 0) {
            this.entityIndex--;
        } else {
            if (this.groupIndex > 0) {
                this.currentGroup = this.groups[--this.groupIndex];
                this.entityIndex = this.currentGroup.entities.length + (this.showFooter ? 0 : -1);
            } else {
                this.isFirst = true;
                this.entityIndex = -1;
            }
        }
        return (this.isFirst) ? null : this.current();
    }, next:function() {
        let maxEntityIndex = this.currentGroup.entities.length + (this.showFooter ? 0 : -1);
        if (this.entityIndex < maxEntityIndex) {
            this.entityIndex++;
        } else {
            if (this.groupIndex < this.groups.length - 1) {
                this.currentGroup = this.groups[++this.groupIndex];
                this.entityIndex = -1;
            } else {
                this.isLast = true;
                this.entityIndex = maxEntityIndex + 1;
            }
        }
        return (this.isLast) ? null : this.current();
    }, createBookmark:function() {
        return {groupIndex:this.groupIndex, entityIndex:this.entityIndex, currentEntity:this.currentEntity, isFirst:this.isFirst, isLast:this.isLast};
    }, restoreBookmark:function(bookmark: any) {
        this.groupIndex = bookmark.groupIndex;
        this.entityIndex = bookmark.entityIndex;
        this.currentEntity = bookmark.currentEntity;
        this.isFirst = bookmark.isFirst;
        this.isLast = bookmark.isLast;
    }});
    dorado.widget.grid.ItemModel = $extend(dorado.widget.list.ItemModel, {resetFilterEntityOnSetItem:true, constructor:function(grid: any) {
        this.grid = grid;
        let items = this._items, footerData = {};
        let footerEntity = this.footerEntity = (items instanceof dorado.EntityList) ? items.createChild(footerData, true) : new dorado.Entity(footerData);
        footerEntity.rowType = "footer";
        footerEntity.ignorePropertyPath = true;
        footerEntity.acceptUnknownProperty = true;
        footerEntity.disableEvents = true;
        footerEntity._setObserver({grid:grid, entityMessageReceived:function(messageCode: any, arg: any) {
            if (messageCode === 0 || messageCode === dorado.Entity._MESSAGE_DATA_CHANGED || messageCode === dorado.Entity._MESSAGE_REFRESH_ENTITY) {
                let grid = this.grid;
                if (!grid._innerGrid) {
                    return;
                }
                if (grid._domMode === 2) {
                    grid._fixedInnerGrid.refreshFrameFooter();
                }
                grid._innerGrid.refreshFrameFooter();
            }
        }});
        let filterEntity = this.filterEntity = new dorado.Entity();
        filterEntity.rowType = "filter";
        filterEntity.ignorePropertyPath = true;
        filterEntity.acceptUnknownProperty = true;
        filterEntity.disableEvents = true;
        filterEntity._setObserver({grid:grid, entityMessageReceived:function(messageCode: any, arg: any) {
            if (messageCode === 0 || messageCode === dorado.Entity._MESSAGE_DATA_CHANGED || messageCode === dorado.Entity._MESSAGE_REFRESH_ENTITY) {
                let grid = this.grid;
                if (!grid._innerGrid) {
                    return;
                }
                if (grid._domMode === 2) {
                    grid._fixedInnerGrid.refreshFilterBar();
                }
                grid._innerGrid.refreshFilterBar();
            }
        }});
        let oldSet = filterEntity._set;
        filterEntity._set = function(property: any, value: any) {
            if (typeof value === "string") {
                let dataColumns = grid.get("dataColumns"), column;
                for (let i = 0; i < dataColumns.length; i++) {
                    if (dataColumns[i]._name === property) {
                        column = dataColumns[i];
                        break;
                    }
                }
                value = dorado.widget.grid.DataColumn.parseCriterion(value, column);
            }
            oldSet.call(this, property, value);
        };
        $invokeSuper.call(this, arguments);
    }, getItems:function() {
        return this._originItems || this._items;
    }, setItems:function(items: any) {
        if ((this._originItems || this._items) === items) {
            return;
        }
        if (this.resetFilterEntityOnSetItem) {
            let filterEntity = this.filterEntity;
            filterEntity.disableObservers();
            filterEntity.clearData();
            filterEntity.enableObservers();
        }
        $invokeSuper.call(this, arguments);
        this.refreshItems();
    }, clearSortFlags:function() {
        let grid = this.grid;
        if (grid._skipClearSortFlags) {
            delete grid._skipClearSortFlags;
            return;
        }
        if (grid._columnsInfo) {
            let columns = grid._columnsInfo.dataColumns;
            for (let i = 0; i < columns.length; i++) {
                columns[i].set("sortState", null);
            }
        }
    }, refreshItems:function() {
        let grid = this.grid;
        if (grid._rendered) {
            this.clearSortFlags();
            if (grid._groupProperty) {
                this.group();
            } else {
                this.refreshSummary();
            }
        }
    }, extractSummaryColumns:function(dataColumns: any) {
        let columns = [];
        for (let i = 0; i < dataColumns.length; i++) {
            let column = dataColumns[i];
            if (!column._summaryType || column._property === "none") {
                continue;
            }
            let cal = dorado.SummaryCalculators[column._summaryType];
            if (cal) {
                columns.push({name:column._name, property:column._property, calculator:cal});
            }
        }
        return columns.length ? columns : null;
    }, initSummary:function(summary: any) {
        let columns = this._summaryColumns;
        for (let i = 0; i < columns.length; i++) {
            let col = columns[i], cal = col.calculator;
            summary[col.property] = (typeof cal === "function") ? 0 : cal.getInitialValue();
        }
    }, accumulate:function(entity: any, summary: any) {
        let columns = this._summaryColumns;
        for (let i = 0; i < columns.length; i++) {
            let col = columns[i], cal = col.calculator;
            summary[col.property] = ((typeof cal === "function") ? cal : cal.accumulate)(summary[col.property], entity, col.property);
        }
    }, finishSummary:function(summary: any) {
        let columns = this._summaryColumns;
        for (let i = 0; i < columns.length; i++) {
            let col = columns[i], cal = col.calculator;
            if (typeof cal !== "function") {
                summary[col.property] = cal.getFinalValue(summary[col.property]);
            }
        }
        delete summary.$expired;
    }, group:function() {
        function getGroupSysEntityObserver(grid: any) {
            if (!grid._groupSysEntityObserver) {
                grid._groupSysEntityObserver = {grid:grid, entityMessageReceived:function(messageCode: any, arg: any) {
                    if (messageCode === 0 || messageCode === dorado.Entity._MESSAGE_DATA_CHANGED || messageCode === dorado.Entity._MESSAGE_REFRESH_ENTITY) {
                        if (!this.grid._rendered) {
                            return;
                        }
                        this.grid.refreshEntity(arg.entity);
                    }
                }};
            }
            return grid._groupSysEntityObserver;
        }
        this.filter();
        let items = this._items;
        if (!items) {
            return;
        }
        let grid = this.grid, groupProperty = grid._groupProperty;
        let isArray = items instanceof Array;
        let entities = isArray ? items.slice(0) : items.toArray();
        if (grid._groupOnSort) {
            dorado.DataUtil.sort(entities, {property:groupProperty});
        }
        this.entityCount = entities.length;
        let columns = this._summaryColumns;
        let groups = this.groups = [], groupMap = this.groupMap = {}, entityMap = this.entityMap = {};
        let entity, groupValue, curGroupValue, curGroup, groupEntities, headerEntity, footerEntity, summary, totalSummary = this.footerEntity._data;
        if (columns) {
            this.initSummary(totalSummary);
        }
        for (let i = 0; i < entities.length; i++) {
            entity = entities[i];
            groupValue = getEntityText(entity, groupProperty);
            if (curGroupValue !== groupValue) {
                if (curGroup) {
                    headerEntity.set("$count", groupEntities.length);
                    footerEntity.set("$count", groupEntities.length);
                    if (columns) {
                        this.finishSummary(summary);
                    }
                }
                curGroupValue = groupValue;
                headerEntity = isArray ? new dorado.Entity() : items.createChild(null, true);
                headerEntity.rowType = "header";
                headerEntity.ignorePropertyPath = true;
                headerEntity.acceptUnknownProperty = true;
                headerEntity.disableEvents = true;
                headerEntity.set("$groupValue", groupValue);
                headerEntity._setObserver(getGroupSysEntityObserver(grid));
                footerEntity = isArray ? new dorado.Entity() : items.createChild(null, true);
                footerEntity.rowType = "footer";
                footerEntity.ignorePropertyPath = true;
                footerEntity.acceptUnknownProperty = true;
                footerEntity.disableEvents = true;
                footerEntity.set("$groupValue", groupValue);
                footerEntity._setObserver(getGroupSysEntityObserver(grid));
                groupEntities = [], summary = footerEntity._data;
                curGroup = {expanded:true, entities:groupEntities, headerEntity:headerEntity, footerEntity:footerEntity};
                if (columns) {
                    this.initSummary(summary);
                }
                groups.push(curGroup);
                groupMap[groupValue] = curGroup;
            }
            if (columns) {
                this.accumulate(entity, summary);
                this.accumulate(entity, totalSummary);
            }
            groupEntities.push(entity);
            if (entity instanceof dorado.Entity) {
                entityMap[entity.entityId] = groupValue;
            }
        }
        if (curGroup) {
            headerEntity.set("$count", groupEntities.length);
            footerEntity.set("$count", groupEntities.length);
            if (columns) {
                this.finishSummary(summary);
            }
        }
        if (columns) {
            this.finishSummary(totalSummary);
        }
        this.footerEntity.timestamp = dorado.Core.getTimestamp();
        this.clearSortFlags();
    }, ungroup:function() {
        delete this.groups;
        delete this.groupMap;
        delete this.entityMap;
        this.clearSortFlags();
    }, filter:function(criterions: any, customFilter: any) {
        let hasParam = (criterions && criterions.length > 0);
        if (hasParam) {
            this.ungroup();
        }
        $invokeSuper.call(this, arguments);
        if (hasParam) {
            this.refreshSummary();
        }
    }, refreshSummary:function() {
        if (!this._summaryColumns) {
            return;
        }
        let totalSummary = this.footerEntity._data;
        if (this.groups) {
            let groups = this.groups, columns = this._summaryColumns, summary, entity;
            this.initSummary(totalSummary);
            for (let i = 0; i < groups.length; i++) {
                let group = groups[i], entities = group.entities, headerEntity = group.headerEntity, footerEntity = group.footerEntity;
                summary = (footerEntity.get("$expired")) ? footerEntity._data : null;
                if (summary) {
                    this.initSummary(summary);
                }
                for (let j = 0; j < entities.length; j++) {
                    entity = entities[j];
                    if (summary) {
                        this.accumulate(entity, summary);
                    }
                    this.accumulate(entity, totalSummary);
                }
                if (summary) {
                    this.finishSummary(summary);
                    headerEntity.set("$count", entities.length);
                    footerEntity.set("$count", entities.length);
                    headerEntity.set("$expired", false);
                    footerEntity.set("$expired", false);
                }
            }
            this.finishSummary(totalSummary);
        } else {
            this.initSummary(totalSummary);
            if (this._items) {
                let self = this;
                if (this._items instanceof Array) {
                    jQuery.each(this._items, function(i: any, entity: any) {
                        self.accumulate(entity, totalSummary);
                    });
                } else {
                    for (let it = this._items.iterator({currentPage:true}); it.hasNext(); ) {
                        self.accumulate(it.next(), totalSummary);
                    }
                }
            }
            this.finishSummary(totalSummary);
        }
        this.footerEntity.timestamp = dorado.Core.getTimestamp();
        this.footerEntity.sendMessage(0);
    }, iterator:function() {
        if (this.groups) {
            return new GroupedItemIterator(this.groups, this.grid._showGroupFooter, this._startIndex || 0);
        } else {
            return $invokeSuper.call(this, arguments);
        }
    }, getItemCount:function() {
        if (this.groups) {
            return this.entityCount + this.groups.length * (this.grid._showGroupFooter ? 2 : 1);
        } else {
            return $invokeSuper.call(this, arguments);
        }
    }, getItemAt:function(index: any) {
        if (this.groups) {
            let grid = this.grid, groupProperty = grid.groupProperty, groups = this.groups, showFooter = grid._showGroupFooter, g;
            for (let i = 0; i < groups.length; i++) {
                g = groups[i], gs = g.entities.length + 1 + (showFooter ? 1 : 0);
                if (gs <= index) {
                    index -= gs;
                } else {
                    if (index === 0) {
                        return g.headerEntity;
                    }
                    if (index <= g.entities.length) {
                        return g.entities[index - 1];
                    }
                    return g.footerEntity;
                }
            }
        } else {
            return $invokeSuper.call(this, arguments);
        }
    }, getItemIndex:function(item: any) {
        if (this.groups) {
            let grid = this.grid, groupProperty = grid._groupProperty, groups = this.groups, showFooter = grid._showGroupFooter;
            let groupValue;
            if (item.rowType) {
                groupValue = item.get("$groupValue");
            } else {
                groupValue = ((item instanceof dorado.Entity) ? this.entityMap[item.entityId] : item[groupProperty]) + "";
            }
            let group = this.groupMap[groupValue], index = 0;
            for (let i = 0; i < groups.length; i++) {
                let g = groups[i];
                if (g === group) {
                    break;
                }
                index += g.entities.length + 1;
                if (showFooter) {
                    index++;
                }
            }
            let i = group.entities.indexOf(item);
            if (i < 0) {
                i = (item.rowType === "header" ? -1 : group.entities.length);
            }
            index += i + 1;
            return index;
        } else {
            return $invokeSuper.call(this, arguments);
        }
    }, sort:function(sortParams: any, comparator: any) {
        if (!this.getItemCount()) {
            return;
        }
        if (!(sortParams instanceof Array)) {
            sortParams = [sortParams];
        }
        let grid = this.grid, columns = grid._columnsInfo.dataColumns, sortParamMap = {};
        for (let i = 0; i < sortParams.length; i++) {
            let sortParam = sortParams[i];
            if (sortParam.property) {
                sortParamMap[sortParam.property] = !!sortParam.desc;
            }
        }
        for (let i = 0; i < columns.length; i++) {
            let column = columns[i], desc = sortParamMap[column._property];
            if (desc === undefined) {
                column.set("sortState", null);
            } else {
                column.set("sortState", desc ? "desc" : "asc");
            }
        }
        if (this.groups) {
            let groups = this.groups;
            for (let i = 0; i < groups.length; i++) {
                let group = groups[i];
                dorado.DataUtil.sort(group.entities, sortParams, comparator);
            }
        } else {
            let items = this._items;
            if (items instanceof Array) {
                $invokeSuper.call(this, arguments);
            } else {
                for (let i = 1; i <= items.pageCount; i++) {
                    if (!items.isPageLoaded(i)) {
                        continue;
                    }
                    let page = items.getPage(i);
                    let array = page.toArray();
                    dorado.DataUtil.sort(array, sortParams, comparator);
                    let entry = page.first, j = 0;
                    while (entry != null) {
                        entry.data = array[j];
                        page._registerEntry(entry);
                        entry = entry.next;
                        j++;
                    }
                    items.timestamp = dorado.Core.getTimestamp();
                }
            }
        }
    }, getAllDataEntities:function() {
        let v = [];
        for (let it = this.iterator(); it.hasNext(); ) {
            let entity = it.next();
            if (!entity.rowType) {
                v.push(entity);
            }
        }
        return v;
    }});
    let overrides = {constructor:function(itemModel: any) {
        this._itemModel = itemModel;
    }};
    let dp = ["setStartIndex", "setItemDomSize", "setScrollPos", "setItems"];
    dorado.Object.eachProperty(dorado.widget.list.ItemModel.prototype, function(p: any, v: any) {
        if (typeof v === "function" && p !== "constructor") {
            if (dp.indexOf(p) >= 0) {
                overrides[p] = dorado._NULL_FUNCTION;
            } else {
                // CSP 兼容：使用闭包替代 new Function
                let methodName = p;
                overrides[p] = function() {
                    return this._itemModel[methodName].apply(this._itemModel, arguments);
                };
            }
        }
    });
    let PassiveItemModel = $extend(dorado.widget.list.ItemModel, overrides);
    function getCellOffsetTop(cell: any, rowHeight: any) {
        return (dorado.Browser.webkit) ? (cell.parentNode.sectionRowIndex * (rowHeight + 1)) : cell.offsetTop;
    }
    dorado.widget.AbstractGrid = $extend([dorado.widget.AbstractList, dorado.widget.grid.ColumnModel], {$className:"dorado.widget.AbstractGrid", ATTRIBUTES:{className:{defaultValue:"d-grid"}, highlightCurrentRow:{defaultValue:true, skipRefresh:true, setter:function(v: any) {
        this._highlightCurrentRow = v;
        if (this._innerGrid) {
            this._innerGrid.set("highlightCurrentRow", v);
        }
        if (this._fixedInnerGrid) {
            this._fixedInnerGrid.set("highlightCurrentRow", v);
        }
    }}, highlightHoverRow:{defaultValue:true}, highlightSelectedRow:{defaultValue:true}, rowHeight:{defaultValue:(dorado.Browser.isTouch || $setting["common.simulateTouch"]) ? ($setting["touch.Grid.defaultRowHeight"] || 30) : ($setting["widget.Grid.defaultRowHeight"] || 22)}, headerRowHeight:{defaultValue:(dorado.Browser.isTouch || $setting["common.simulateTouch"]) ? ($setting["touch.Grid.defaultRowHeight"] || 30) : ($setting["widget.Grid.defaultRowHeight"] || 22)}, footerRowHeight:{defaultValue:(dorado.Browser.isTouch || $setting["common.simulateTouch"]) ? ($setting["touch.Grid.defaultRowHeight"] || 30) : ($setting["widget.Grid.defaultRowHeight"] || 22)}, scrollMode:{defaultValue:"lazyRender"}, fixedColumnCount:{defaultValue:0}, showHeader:{defaultValue:true}, showFooter:{}, readOnly:{}, dynaRowHeight:{writeBeforeReady:true}, cellRenderer:{setter:function(value: any) {
        if (typeof value === "string") {
            value = dorado.Core.createClassFromString(value);
        }
        this._cellRenderer = value;
    }}, headerRenderer:{setter:function(value: any) {
        if (typeof value === "string") {
            value = dorado.Core.createClassFromString(value);
        }
        this._headerRenderer = value;
    }}, footerRenderer:{setter:function(value: any) {
        if (typeof value === "string") {
            value = dorado.Core.createClassFromString(value);
        }
        this._footerRenderer = value;
    }}, filterBarRenderer:{setter:function(value: any) {
        if (typeof value === "string") {
            value = dorado.Core.createClassFromString(value);
        }
        this._filterBarRenderer = value;
    }}, rowRenderer:{}, groupHeaderRenderer:{}, groupFooterRenderer:{}, currentColumn:{skipRefresh:true, setter:function(column: any) {
        if (!(column instanceof dorado.widget.grid.Column)) {
            column = this.getColumn(column);
        }
        this.setCurrentColumn(column);
    }}, dataColumns:{getter:function() {
        return this._columnsInfo ? this._columnsInfo.dataColumns : [];
    }, readOnly:true}, editing:{defaultValue:true, readOnly:true, skipRefresh:true, getter:function(p: any, v: any) {
        return this._editing;
    }}, allowNoCurrent:{skipRefresh:true, setter:function(v: any) {
        this._allowNoCurrent = v;
        if (this._fixedInnerGrid) {
            this._fixedInnerGrid.set("allowNoCurrent", v);
        }
        if (this._innerGrid) {
            this._innerGrid.set("allowNoCurrent", v);
        }
    }}, selectionMode:{defaultValue:"none", skipRefresh:true, setter:function(v: any) {
        if (this._innerGrid) {
            this._innerGrid.set("selectionMode", v);
        }
        this._selectionMode = v;
    }}, selection:{getter:function() {
        if (this._innerGrid) {
            return this._innerGrid.get("selection");
        } else {
            if (this._selection) {
                return this._selection;
            } else {
                return ("multiRows" === this._selectionMode) ? [] : null;
            }
        }
    }, setter:function(selection: any) {
        if (selection == null && ["multiRows", "multiCells"].indexOf(this._selectionMode) >= 0) {
            selection = [];
        }
        if (this._innerGrid) {
            this._innerGrid.set("selection", selection);
        } else {
            this._selection = selection;
        }
    }}, groupProperty:{setter:function(v: any) {
        if (this._groupProperty === v) {
            return;
        }
        this._groupProperty = v;
        if (v != null) {
            this._itemModel.group();
        } else {
            this._itemModel.ungroup();
        }
    }}, groupOnSort:{defaultValue:true, skipRefresh:true}, showGroupFooter:{}, footerEntity:{readOnly:true, getter:function(p: any) {
        return this._itemModel.footerEntity;
    }}, showFilterBar:{}, filterEntity:{readOnly:true, getter:function(p: any) {
        return this._itemModel.filterEntity;
    }}, stretchColumnsMode:{defaultValue:"auto"}, useNativeScrollbars:{}}, EVENTS:{onGetCellEditor:{}, onDataRowClick:{}, onDataRowDoubleClick:{}, onRenderRow:{}, onRenderCell:{}, onRenderHeaderCell:{}, onRenderFooterCell:{}, onHeaderClick:{}, beforeCellValueEdit:{}, onCellValueEdit:{}}, constructor:function() {
        this._columns = new dorado.widget.grid.ColumnList(this, dorado._GET_NAME);
        this._grid = this;
        $invokeSuper.call(this, arguments);
    }, destroy:function() {
        this._columns.destroy();
        $invokeSuper.call(this);
    }, doSetFocus:dorado._NULL_FUNCTION, doGet:function(attr: any) {
        let c = attr.charAt(0);
        if (c === "#" || c === "&") {
            let col = attr.substring(1);
            return this.getColumn(col);
        } else {
            return $invokeSuper.call(this, [attr]);
        }
    }, createItemModel:function() {
        return new dorado.widget.grid.ItemModel(this);
    }, getCurrentItem:function() {
        return this._innerGrid.getCurrentItem();
    }, notifySizeChange:function() {
        if (!this.xScroll || !this.yScroll) {
            $invokeSuper.call(this, arguments);
        }
    }, getFocusableSubControls:function() {
        return null;
    }, createDom:function() {
        let dom = $invokeSuper.call(this, arguments);
        $fly(dom).mousewheel($scopify(this, function(evt: any, delta: any) {
            let divScroll = this._divScroll;
            if (!divScroll) {
                return;
            }
            if (divScroll.scrollHeight > divScroll.clientHeight) {
                let scrollTop = divScroll.scrollTop - delta * this._rowHeight * 2;
                if (scrollTop <= 0) {
                    scrollTop = 0;
                } else {
                    if (scrollTop + divScroll.clientHeight > divScroll.scrollHeight) {
                        scrollTop = divScroll.scrollHeight - divScroll.clientHeight;
                    }
                }
                if (scrollTop !== divScroll.scrollTop) {
                    divScroll.scrollTop = scrollTop;
                    this.hideCellEditor();
                    return false;
                }
            }
        }));
        return dom;
    }, refreshDom:function(dom: any) {
        function getDivScroll() {
            if (this._divScroll) {
                return this._divScroll;
            }
            let style;
            if (dorado.Browser.isTouch || $setting["common.simulateTouch"]) {
                style = {width:"100%", height:"100%", overflow:"hidden", position:"absolute", left:-99999, top:-99999};
            } else {
                style = {overflow:"scroll", width:"100%", height:"100%"};
            }
            let div = this._divScroll = $DomUtils.xCreate({tagName:"DIV", style:style, content:"^DIV"});
            this._divViewPort = div.firstChild;
            dom.appendChild(div);
            if (this._useNativeScrollbars) {
                let grid = this;
                $fly(div).bind("scroll", function(event: any) {
                    grid.onScroll(event, {scrollLeft:div.scrollLeft, scrollTop:div.scrollTop, scrollWidth:div.scrollWidth, scrollHeight:div.scrollHeight, clientWidth:div.clientWidth, clientHeight:div.clientHeight});
                });
            } else {
                this._modernScroller = $DomUtils.modernScroll(div);
                $fly(div).bind("modernScrolled", $scopify(this, this.onScroll));
            }
            return div;
        }
        function registerInnerControl(innerGrid: any) {
            function findRowByEvent(grid: any, innerGrid: any, event: any) {
                return $DomUtils.findParent(event.target, function(parentNode: any) {
                    return (parentNode.parentNode === innerGrid._dataTBody);
                });
            }
            function findColumnByEvent(grid: any, row: any, event: any) {
                let column = null;
                if (row) {
                    let cell = $DomUtils.findParent(event.target, function(parentNode: any) {
                        return parentNode.parentNode === row;
                    }, true);
                    if (cell) {
                        column = grid._columnsInfo.idMap[cell.colId];
                    }
                }
                return column;
            }
            let grid = this;
            innerGrid.bind("onDataRowClick", function(self: any, arg: any) {
                if (grid.getListenerCount("onDataRowClick")) {
                    let row = findRowByEvent(grid, innerGrid, arg.event);
                    arg.column = findColumnByEvent(grid, row, arg.event);
                    arg.data = $fly(row).data("item");
                    arg.rowType = row.rowType;
                    grid.fireEvent("onDataRowClick", grid, arg);
                }
            });
            innerGrid.bind("onDataRowDoubleClick", function(self: any, arg: any) {
                if (grid.getListenerCount("onDataRowDoubleClick")) {
                    let row = findRowByEvent(grid, innerGrid, arg.event);
                    arg.column = findColumnByEvent(grid, row, arg.event);
                    arg.data = $fly(row).data("item");
                    arg.rowType = row.rowType;
                    grid.fireEvent("onDataRowDoubleClick", grid, arg);
                }
            });
            this.registerInnerControl(innerGrid);
        }
        function getFixedInnerGrid() {
            if (this._fixedInnerGrid) {
                return this._fixedInnerGrid;
            }
            let innerGrid = this._fixedInnerGrid = this.createInnerGrid(true), self = this;
            innerGrid.set({allowNoCurrent:this._allowNoCurrent, beforeSelectionChange:function(innerGrid: any, arg: any) {
                self.fireEvent("beforeSelectionChange", self, arg);
            }, onSelectionChange:function(innerGrid: any, arg: any) {
                self.fireEvent("onSelectionChange", self, arg);
            }});
            registerInnerControl.call(this, innerGrid);
            return innerGrid;
        }
        function getInnerGrid() {
            if (this._innerGrid) {
                return this._innerGrid;
            }
            let innerGrid = this._innerGrid = this.createInnerGrid(), self = this;
            innerGrid.set({allowNoCurrent:this._allowNoCurrent, selectionMode:this._selectionMode, selection:this._selection, onCurrentChange:function(innerGrid: any, arg: any) {
                self.fireEvent("onCurrentChange", self, arg);
            }, beforeSelectionChange:function(innerGrid: any, arg: any) {
                self.fireEvent("beforeSelectionChange", self, arg);
            }, onSelectionChange:function(innerGrid: any, arg: any) {
                self.fireEvent("onSelectionChange", self, arg);
            }});
            delete this._selection;
            registerInnerControl.call(this, innerGrid);
            this._innerGridDom = innerGrid.getDom();
            return innerGrid;
        }
        function getFixedInnerGridWrapper() {
            let wrapper = this._fixedInnerGridWrapper;
            if (!wrapper) {
                let wrapper = this._fixedInnerGridWrapper = document.createElement("DIV");
                wrapper.style.overflowX = "visible";
                wrapper.style.position = "absolute";
                wrapper.style.left = wrapper.style.top = 0;
                wrapper.style.height = "100%";
                dom.appendChild(wrapper);
            }
            return wrapper;
        }
        function getInnerGridWrapper() {
            let wrapper = this._innerGridWrapper;
            if (!wrapper) {
                let wrapper = this._innerGridWrapper = document.createElement("DIV");
                wrapper.style.position = "absolute";
                wrapper.style.left = wrapper.style.top = 0;
                wrapper.style.height = "100%";
                dom.appendChild(wrapper);
            }
            return wrapper;
        }
        $invokeSuper.call(this, arguments);
        if (!this._columns.size) {
            this.addColumns([{name:"empty", caption:""}]);
        }
        let ignoreItemTimestamp = (this._ignoreItemTimestamp === undefined) ? true : this._ignoreItemTimestamp;
        if (!this.hasRealWidth() || this._groupProperty) {
            this._realFixedColumnCount = 0;
        } else {
            this._realFixedColumnCount = this._fixedColumnCount;
            if (this._realFixedColumnCount > this._columns.size) {
                this._realFixedColumnCount = this._columns.size;
            }
        }
        if (this._stretchColumnsMode === "auto") {
            this._realStretchColumnsMode = (this._realFixedColumnCount > 0) ? "off" : "stretchableColumns";
        } else {
            this._realStretchColumnsMode = this._stretchColumnsMode;
        }
        let columnsInfo = this._columnsInfo = this.getColumnsInfo(this._realFixedColumnCount);
        if (columnsInfo) {
            let cols = columnsInfo.dataColumns;
            for (let i = 0; i < cols.length; i++) {
                let col = cols[i];
                col._realWidth = parseInt(col._realWidth || col._width) || 80;
            }
        }
        let itemModel = this._itemModel;
        itemModel._summaryColumns = itemModel.extractSummaryColumns(columnsInfo.dataColumns);
        if (this._currentCell) {
            $fly(this._currentCell).removeClass("current-cell");
        }
        let menuColumn = this._headerMenuOpenColumn || this._headerHoverColumn;
        if (menuColumn) {
            this.hideHeaderOptionButton(menuColumn);
        }
        this._headerMenuOpenColumn = this._headerHoverColumn = null;
        let divScroll = this._divScroll, fixedInnerGrid = this._fixedInnerGrid, fixedInnerGridWrapper = this._fixedInnerGridWrapper;
        let innerGrid = getInnerGrid.call(this), innerGridWrapper = this._innerGridWrapper;
        let xScroll = this.xScroll = this.hasRealWidth();
        let yScroll = this.yScroll = this.hasRealHeight();
        let domMode;
        if (this._realFixedColumnCount > 0) {
            domMode = xScroll ? 2 : 0;
        } else {
            domMode = yScroll ? 1 : 0;
        }
        let oldWidth, oldHeight;
        if (!this.xScroll || !this.yScroll) {
            oldWidth = dom.offsetWidth;
            oldHeight = dom.offsetHeight;
        }
        if (this._domMode !== domMode) {
            this._domMode = domMode;
            switch (domMode) {
              case 0:
                dom.style.overflowX = dom.style.overflowY = "hidden";
                if (divScroll) {
                    $fly(divScroll).hide();
                }
                if (fixedInnerGridWrapper) {
                    $fly(fixedInnerGridWrapper).hide();
                }
                this._innerGridDom.style.position = this._innerGridDom.style.top = this._innerGridDom.style.left = this._innerGridDom.style.width = this._innerGridDom.style.height = "";
                innerGrid.render(dom);
                break;
              case 1:
                dom.style.overflowX = dom.style.overflowY = xScroll ? "hidden" : "visible";
                divScroll = getDivScroll.call(this);
                $fly(divScroll).show();
                if (fixedInnerGridWrapper) {
                    $fly(fixedInnerGridWrapper).hide();
                }
                let innerGridWrapper = getInnerGridWrapper.call(this);
                innerGridWrapper.style.overflowX = (this.hasRealWidth()) ? "hidden" : "visible";
                innerGridWrapper.style.overflowY = (this.hasRealHeight()) ? "hidden" : "visible";
                this._innerGridDom.style.position = this._innerGridDom.style.top = this._innerGridDom.style.left = this._innerGridDom.style.width = "";
                innerGrid.render(innerGridWrapper);
                break;
              case 2:
                dom.style.overflowX = "hidden";
                dom.style.overflowY = yScroll ? "hidden" : "visible";
                divScroll = getDivScroll.call(this);
                $fly(divScroll).show();
                fixedInnerGridWrapper = getFixedInnerGridWrapper.call(this);
                fixedInnerGridWrapper.style.overflowY = (this.hasRealHeight()) ? "hidden" : "visible";
                $fly(fixedInnerGridWrapper).show();
                fixedInnerGrid = getFixedInnerGrid.call(this);
                fixedInnerGrid.render(fixedInnerGridWrapper);
                innerGridWrapper = getInnerGridWrapper.call(this);
                innerGridWrapper.style.overflowX = (this.hasRealWidth()) ? "hidden" : "visible";
                innerGridWrapper.style.overflowY = (this.hasRealHeight()) ? "hidden" : "visible";
                this._innerGridDom.style.position = this._innerGridDom.style.top = this._innerGridDom.style.left = this._innerGridDom.style.width = "";
                innerGrid.render(innerGridWrapper);
                break;
            }
        }
        if (this._currentScrollMode !== this._scrollMode && this._scrollMode !== "viewport") {
            itemModel.setScrollPos(0);
        }
        if (!this.hasRealHeight()) {
            this._scrollMode = "simple";
        }
        this._currentScrollMode = this._scrollMode;
        let shouldProcessScrollerMargin = (this._modernScroller && this._modernScroller instanceof dorado.util.Dom.DesktopModernScroller);
        if (this.stretchColumnsToFit() && shouldProcessScrollerMargin) {
            let scrollerSize = $setting["widget.scrollerSize"] || 4;
            let h = dom.clientHeight - scrollerSize;
            if (this._innerGridWrapper) {
                this._innerGridWrapper.style.height = h + "px";
            }
            if (this._fixedInnerGridWrapper) {
                this._fixedInnerGridWrapper.style.height = h + "px";
            }
        } else {
            if (this._innerGridWrapper) {
                if (this._useNativeScrollbars) {
                    this._innerGridWrapper.style.height = divScroll.clientHeight + "px";
                } else {
                    this._innerGridWrapper.style.height = "100%";
                }
            }
            if (this._fixedInnerGridWrapper) {
                if (this._useNativeScrollbars) {
                    this._fixedInnerGridWrapper.style.height = divScroll.clientHeight + "px";
                } else {
                    this._fixedInnerGridWrapper.style.height = "100%";
                }
            }
        }
        if (domMode === 2) {
            fixedInnerGridWrapper.style.overflowX = fixedInnerGridWrapper.style.width = "";
            fixedInnerGrid._scrollMode = this._scrollMode;
            fixedInnerGrid._rowHeight = this._rowHeight;
            fixedInnerGrid._highlightCurrentRow = this._highlightCurrentRow;
            fixedInnerGrid._highlightHoverRow = this._highlightHoverRow;
            fixedInnerGrid._highlightSelectedRow = this._highlightSelectedRow;
            fixedInnerGrid._selectionMode = this._selectionMode;
            fixedInnerGrid._columnsInfo = columnsInfo.fixed;
            fixedInnerGrid._forceRefreshRearRows = this._forceRefreshRearRows;
            fixedInnerGrid._ignoreItemTimestamp = ignoreItemTimestamp;
            fixedInnerGrid.refreshDom(innerGrid.getDom());
            let scrollLeft = ((dorado.Browser.msie && dorado.Browser.version < 7) ? fixedInnerGridWrapper.firstChild : fixedInnerGridWrapper).offsetWidth;
            if (scrollLeft >= divScroll.clientWidth) {
                fixedInnerGridWrapper.style.overflowX = "hidden";
                fixedInnerGridWrapper.style.width = divScroll.clientWidth + "px";
                innerGridWrapper.style.width = 0;
            } else {
                innerGridWrapper.style.overflowX = "hidden";
                innerGridWrapper.style.width = (divScroll.clientWidth - scrollLeft) + "px";
                innerGridWrapper.style.left = scrollLeft + "px";
            }
        } else {
            if (innerGridWrapper) {
                innerGridWrapper.style.left = 0;
                innerGridWrapper.style.overflowX = "hidden";
                innerGridWrapper.style.width = divScroll.clientWidth + "px";
            }
        }
        if (domMode !== 2) {
            if (innerGrid._itemModel instanceof PassiveItemModel) {
                innerGrid._itemModel = itemModel;
            }
        } else {
            if (!(innerGrid._itemModel instanceof PassiveItemModel)) {
                innerGrid._itemModel = new PassiveItemModel(itemModel);
            }
        }
        innerGrid._scrollMode = this._scrollMode;
        innerGrid._rowHeight = this._rowHeight;
        innerGrid._highlightCurrentRow = this._highlightCurrentRow;
        innerGrid._highlightHoverRow = this._highlightHoverRow;
        innerGrid._highlightSelectedRow = this._highlightSelectedRow;
        innerGrid._columnsInfo = columnsInfo.main;
        innerGrid._forceRefreshRearRows = this._forceRefreshRearRows;
        innerGrid._ignoreItemTimestamp = ignoreItemTimestamp;
        innerGrid.refreshDom(innerGrid.getDom());
        if (!this._groupProperty && itemModel.footerEntity && itemModel.footerEntity.get("$expired")) {
            this.refreshSummary();
        }
        if ((!this.xScroll || !this.yScroll) && oldWidth !== dom.offsetWidth && oldHeight !== dom.offsetHeight) {
            this.notifySizeChange();
        }
    }, stretchColumnsToFit:function() {
        let WIDTH_ADJUST = 6;
        let columns = this._columnsInfo.dataColumns;
        if (!columns.length) {
            return;
        }
        let clientWidth;
        if (dorado.Browser.msie) {
            clientWidth = (this._domMode === 0) ? this._dom.offsetWidth : this._divScroll.offsetWidth;
        } else {
            clientWidth = (this._domMode === 0) ? this._dom.clientWidth : this._divScroll.clientWidth;
        }
        if (!clientWidth) {
            return;
        }
        let totalWidth = 0, column;
        let totalWeight = 0, assignedWidth;
        switch (this._realStretchColumnsMode) {
          case "stretchableColumns":
            let stretchableColumns = [];
            for (let i = 0; i < columns.length; i++) {
                column = columns[i];
                if (column._width === "*") {
                    stretchableColumns.push(column);
                } else {
                    totalWidth += (columns[i]._realWidth || 80) + WIDTH_ADJUST;
                }
            }
            for (let i = 0; i < stretchableColumns.length; i++) {
                column = stretchableColumns[i];
                let w = Math.round((clientWidth - totalWidth) / (stretchableColumns.length - i)) - WIDTH_ADJUST;
                if (w < MIN_COL_WIDTH) {
                    w = MIN_COL_WIDTH;
                }
                column._realWidth = w;
                totalWidth += (w + WIDTH_ADJUST);
            }
            break;
          case "lastColumn":
            for (let i = 0; i < columns.length; i++) {
                column = columns[i];
                if (i === columns.length - 1) {
                    column._realWidth = clientWidth - totalWidth - WIDTH_ADJUST;
                    if (column._realWidth < MIN_COL_WIDTH) {
                        column._realWidth = MIN_COL_WIDTH;
                    }
                }
                totalWidth += (column._realWidth + WIDTH_ADJUST);
            }
            break;
          case "allColumns":
            totalWeight = 0;
            for (let i = 0; i < columns.length; i++) {
                totalWeight += (columns[i]._realWidth || 80) + WIDTH_ADJUST;
            }
            assignedWidth = 0;
            for (let i = 0; i < columns.length; i++) {
                let column = columns[i], weight = (parseInt(column._realWidth) || 80) + WIDTH_ADJUST;
                if (i === columns.length - 1) {
                    column._realWidth = clientWidth - assignedWidth - WIDTH_ADJUST;
                } else {
                    let w = Math.round(clientWidth * weight / totalWeight) - WIDTH_ADJUST;
                    if (w < MIN_COL_WIDTH) {
                        w = MIN_COL_WIDTH;
                    }
                    column._realWidth = w;
                }
                assignedWidth += (column._realWidth + WIDTH_ADJUST);
            }
            totalWeight += assignedWidth;
            break;
          case "allResizeableColumns":
            totalWeight = 0;
            for (let i = 0; i < columns.length; i++) {
                let column = columns[i];
                if (!column._resizeable) {
                    continue;
                }
                totalWeight += (column._realWidth || 80) + WIDTH_ADJUST;
            }
            assignedWidth = 0;
            for (let i = 0; i < columns.length; i++) {
                let column = columns[i];
                if (!column._resizeable) {
                    continue;
                }
                let weight = (parseInt(column._realWidth) || 80) + WIDTH_ADJUST;
                if (i === columns.length - 1) {
                    column._realWidth = clientWidth - assignedWidth - WIDTH_ADJUST;
                } else {
                    let w = Math.round(clientWidth * weight / totalWeight) - WIDTH_ADJUST;
                    if (w < MIN_COL_WIDTH) {
                        w = MIN_COL_WIDTH;
                    }
                    column._realWidth = w;
                }
                assignedWidth += (column._realWidth + WIDTH_ADJUST);
            }
            totalWeight += assignedWidth;
            break;
          default:
            totalWeight = 0;
            for (let i = 0; i < columns.length; i++) {
                totalWeight += (columns[i]._realWidth || 80) + WIDTH_ADJUST;
            }
        }
        return (totalWeight > clientWidth);
    }, syncroRowHeights:function(scrollInfo: any) {
        if (this._domMode === 2) {
            this._fixedInnerGrid.syncroRowHeights(scrollInfo);
        }
    }, updateScroller:function(info: any) {
        if (this._divScroll) {
            let divScroll = this._divScroll, divViewPort = this._divViewPort;
            let ratio = info.clientHeight ? (divScroll.clientHeight / (info.clientHeight || 1)) : 1;
            if (this.yScroll) {
                divViewPort.style.height = Math.round(info.scrollHeight * ratio) + "px";
            } else {
                divViewPort.style.height = this._innerGridWrapper.offsetHeight + "px";
            }
            divScroll.scrollTop = Math.round(info.scrollTop * ratio);
            if (this._scrollTop !== undefined) {
                this._scrollTop = divScroll.scrollTop;
            }
            if (this._innerGridWrapper) {
                let innerGridWrapper = this._innerGridWrapper;
                if (innerGridWrapper.offsetLeft <= divScroll.clientWidth) {
                    let ratio = (divScroll.clientWidth / (innerGridWrapper.clientWidth || 1)) || 1;
                    let viewPortWidth = Math.round(innerGridWrapper.scrollWidth * ratio);
                    divViewPort.style.width = viewPortWidth + "px";
                    divScroll.scrollLeft = this._scrollLeft = Math.round(innerGridWrapper.scrollLeft * ratio);
                } else {
                    divViewPort.style.width = divScroll.scrollLeft = 0;
                }
            }
        }
        if (this._modernScroller) {
            this._modernScroller.update();
        }
    }, onClick:dorado._NULL_FUNCTION, onDoubleClick:dorado._NULL_FUNCTION, doOnResize:function() {
        if (!this._ready) {
            return;
        }
        this.refresh(true);
    }, onScroll:function(event: any, arg: any) {
        if (this._currentCellEditor) {
            if (dorado.Browser.webkit) {
                let self = this;
                setTimeout(function() {
                    self._currentCellEditor.resize();
                }, 0);
            } else {
                this._currentCellEditor.resize();
            }
        }
        if (this._currentCell) {
            $fly(this._currentCell).removeClass("current-cell");
        }
        if ((this._scrollLeft || 0) !== arg.scrollLeft) {
            if (this.onXScroll) {
                this.onXScroll(arg);
            }
        }
        if ((this._scrollTop || 0) !== arg.scrollTop) {
            if (this.onYScroll) {
                this.onYScroll(arg);
            }
        }
        this._scrollLeft = arg.scrollLeft;
        this._scrollTop = arg.scrollTop;
    }, onXScroll:function(arg: any) {
        if (this._innerGridWrapper) {
            let innerGridWrapper = this._innerGridWrapper;
            let ratio = ((arg.scrollWidth - arg.clientWidth) / (innerGridWrapper.scrollWidth - innerGridWrapper.clientWidth)) || 1;
            innerGridWrapper.scrollLeft = Math.round(arg.scrollLeft / ratio);
        }
    }, onYScroll:function(arg: any) {
        if (!this._divScroll) {
            return;
        }
        let ratio = arg.scrollTop / (arg.scrollHeight - arg.clientHeight), innerContainer = this._innerGrid._container;
        if (this._scrollMode === "lazyRender") {
            innerContainer.scrollTop = Math.round((innerContainer.scrollHeight - innerContainer.clientHeight) * ratio);
        } else {
            this._innerGrid.setYScrollPos(ratio);
        }
        if (this._domMode === 2) {
            this._fixedInnerGrid._container.scrollTop = innerContainer.scrollTop;
        }
        if (this._scrollMode === "lazyRender") {
            if (this._domMode === 2) {
                this._fixedInnerGrid.doOnYScroll(this._fixedInnerGrid._container);
            }
            let innerGrid = this._innerGrid;
            innerGrid.doOnYScroll(innerGrid._container);
            if (this._rowHeightInfos) {
                this.syncroRowHeights(innerGrid._container);
            }
            this.updateScroller(innerGrid._container);
        } else {
            if (this._scrollMode === "viewport") {
                dorado.Toolkits.setDelayedAction(this, "$scrollTimerId", function() {
                    if (this._domMode === 2) {
                        this._fixedInnerGrid.doOnYScroll(this._fixedInnerGrid._container);
                    }
                    this._innerGrid.doOnYScroll(this._innerGrid._container);
                }, 300);
            }
        }
    }, doOnKeyDown:function(evt: any) {
        let retValue = true;
        switch (evt.keyCode) {
          case 37:
            if (evt.ctrlKey && this._currentColumn) {
                let columns = this._columnsInfo.dataColumns;
                let i = columns.indexOf(this._currentColumn);
                if (i > 0) {
                    this.setCurrentColumn(columns[i - 1]);
                }
            }
            break;
          case 39:
            if (evt.ctrlKey && this._currentColumn) {
                let columns = this._columnsInfo.dataColumns;
                let i = columns.indexOf(this._currentColumn);
                if (i >= 0 && i < columns.length - 1) {
                    this.setCurrentColumn(columns[i + 1]);
                }
            }
            break;
          case 27:
            if (this._currentCellEditor) {
                this._editing = false;
                this.hideCellEditor(false);
                dorado.widget.onControlGainedFocus(this);
            }
            break;
          default:
            retValue = this._doOnKeyDown(evt);
            break;
        }
        if (this._editing && !this._currentCellEditor && this._currentColumn) {
            if (dorado.Browser.msie && dorado.Browser.version <= 8) {
                $setTimeout(this, function() {
                    this.showCellEditor(this._currentColumn);
                }, 0);
            } else {
                this.showCellEditor(this._currentColumn);
            }
        }
        return retValue;
    }, doInnerGridSetCurrentRow:function(innerGrid: any, itemId: any) {
        if (this._processingCurrentRow) {
            return;
        }
        this.hideCellEditor();
        this._processingCurrentRow = true, ig = this._innerGrid;
        if (this._domMode === 2) {
            (innerGrid === ig ? this._fixedInnerGrid : ig).setCurrentRowByItemId(itemId);
        }
        if (this._divScroll) {
            let st = Math.round(ig._container.scrollTop / ig._container.scrollHeight * this._divScroll.scrollHeight);
            if (this._scrollMode !== "lazyRender") {
                this._scrollTop = st;
            }
            this._divScroll.scrollTop = st;
        }
        this._processingCurrentRow = false;
    }, onMouseDown:function(evt: any) {
        this._disableCellEditor = true;
    }, onClick:function(evt: any) {
        this._disableCellEditor = false;
        let tbody1 = this._innerGrid._dataTBody, tbody2 = (this._domMode === 2) ? this._fixedInnerGrid._dataTBody : null;
        let self = this, innerGrid;
        let row = $DomUtils.findParent(evt.target, function(parentNode: any) {
            let p = parentNode.parentNode;
            if (p === tbody1) {
                innerGrid = self._innerGrid;
                return true;
            } else {
                if (tbody2 && p === tbody2) {
                    innerGrid = self._fixedInnerGrid;
                    return true;
                }
            }
        });
        if (row) {
            this._editing = true;
            let column = null;
            if (innerGrid.getCurrentItemDom() === row) {
                let cell = $DomUtils.findParent(evt.target, function(parentNode: any) {
                    return parentNode.parentNode === row;
                }, true);
                if (cell) {
                    column = this._columnsInfo.idMap[cell.colId];
                    if (this._currentColumn === column && column) {
                        this.showCellEditor(column);
                    } else {
                        this.setCurrentColumn(column);
                    }
                }
            }
        } else {
            let clickOnCellEditor = false;
            if (this._currentCellEditor) {
                let cellEditorDom = this._currentCellEditor.getDom();
                clickOnCellEditor = ($DomUtils.isOwnerOf(evt.target, cellEditorDom));
            }
            if (!clickOnCellEditor) {
                this._editing = false;
                this.setCurrentColumn(null);
            }
        }
        return $invokeSuper.call(this, arguments);
    }, _getCellByEvent:function(event: any) {
        let tbody1 = this._innerGrid._dataTBody, tbody2 = (this._domMode === 2) ? this._fixedInnerGrid._dataTBody : null;
        return $DomUtils.findParent(event.target, function(parentNode: any) {
            let p = parentNode.parentNode;
            if (!p) {
                return;
            }
            p = p.parentNode;
            return (p === tbody1 || tbody2 && p === tbody2);
        });
    }, getEntityByEvent:function(event: any) {
        let cell = this._getCellByEvent(event);
        return (cell) ? $fly(cell.parentNode).data("item") : null;
    }, getColumnByEvent:function(event: any) {
        let cell = this._getCellByEvent(event);
        return (cell) ? this._columnsInfo.idMap[cell.colId] : null;
    }, doOnFocus:function() {
        if (!this._currentColumn) {
            let dataColumns = this._columnsInfo.dataColumns;
            for (let i = 0; i < dataColumns.length; i++) {
                let column = dataColumns[i];
                if (!column._property || column._property === "none") {
                    continue;
                }
                if (this.shouldEditing(column)) {
                    dorado.Toolkits.setDelayedAction(this, "$showEditorTimerId", function() {
                        if (!this._currentColumn) {
                            this.setCurrentColumn(column);
                        }
                    }, 100);
                    break;
                }
            }
        } else {
            dorado.Toolkits.setDelayedAction(this, "$showEditorTimerId", function() {
                if (this._currentColumn && !this._currentCellEditor) {
                    this.showCellEditor(this._currentColumn);
                }
            }, 100);
        }
    }, doOnBlur:function() {
        if (this._currentCell) {
            $fly(this._currentCell).removeClass("current-cell");
        }
        this.hideCellEditor();
    }, shouldEditing:function(column: any) {
        return column && !column.get("readOnly") && !this.get("readOnly") && column._property && column._property !== "none" && column._property !== this._groupProperty;
    }, _doSetCurrentColumn:function(column: any, showCellEditor: any) {
        if (this._currentColumn !== column) {
            if (this._currentCell) {
                $fly(this._currentCell).removeClass("current-cell");
            }
            this.hideCellEditor();
            this._currentColumn = column;
            if (column && showCellEditor) {
                this.showCellEditor(column);
            }
        }
    }, setCurrentColumn:function(column: any) {
        this._doSetCurrentColumn(column, true);
    }, showCellEditor:function(column: any) {
        if (this._disableCellEditor) {
            return;
        }
        if (this._domMode === 2) {
            this._fixedInnerGrid.showCellEditor(column);
        }
        this._innerGrid.showCellEditor(column);
    }, hideCellEditor:function(post: any) {
        if (this._currentCellEditor) {
            this._currentCellEditor.hide(post);
            delete this._currentCellEditor;
        }
    }, getCellEditor:function(column: any, entity: any) {
        if (entity) {
            let cellEditorCache = this._cellEditorCache;
            if (!cellEditorCache) {
                this._cellEditorCache = cellEditorCache = {};
            }
            let cellEditor = cellEditorCache[column._uniqueId];
            if (cellEditor === undefined) {
                cellEditor = column._cellEditor;
                if (cellEditor === undefined) {
                    cellEditor = new dorado.widget.grid.DefaultCellEditor();
                }
                cellEditor.bindColumn(column);
            } else {
                if (cellEditor) {
                    if (cellEditor.column) {
                        if (cellEditor.column !== column) {
                            throw new ResourceException("dorado.grid.CellEditorShareError");
                        }
                    } else {
                        cellEditor.bindColumn(column);
                    }
                }
            }
            if (column._propertyPath) {
                entity = column._propertyPath.evaluate(entity, true);
            }
            let eventArg = {data:entity, column:column, cellEditor:cellEditor};
            column.fireEvent("onGetCellEditor", column, eventArg);
            this.fireEvent("onGetCellEditor", this, eventArg);
            cellEditor = eventArg.cellEditor;
            if (cellEditor && cellEditor.cachable) {
                cellEditorCache[column._uniqueId] = cellEditor;
            }
            if (cellEditor) {
                cellEditor.data = entity;
            }
            return cellEditor;
        } else {
            return null;
        }
    }, sort:function(column: any, desc: any) {
        let sortParams;
        if (typeof column === "string") {
            column = this.getColumn(column);
        }
        if (column instanceof dorado.widget.grid.Column) {
            sortParams = [{property:column.get("property"), desc:desc}];
        } else {
            sortParams = column;
        }
        $invokeSuper.call(this, [sortParams]);
    }, filter:function(criterions: any) {
        function verifyCriterion(criterion: any, column: any) {
            if (criterion.junction) {
                let criterions = criterion.criterions;
                if (criterions && criterions.length) {
                    for (let i = 0; i < criterions.length; i++) {
                        let c = criterions[i];
                        if (c != null) {
                            verifyCriterion(c, column);
                        }
                    }
                }
            } else {
                verifyCriterion.property = column._property;
            }
        }
        if (criterions === undefined) {
            criterions = [];
            let filterEntity = this._itemModel.filterEntity;
            let dataColumns = this._columnsInfo.dataColumns;
            for (let i = 0; i < dataColumns.length; i++) {
                let column = dataColumns[i];
                if (!column._property || column._property === "none") {
                    continue;
                }
                let criterion = filterEntity.get(column._property);
                if (criterion) {
                    verifyCriterion(criterion, column);
                    if (criterion.junction && criterion.junction !== "or") {
                        criterions = criterions.concat(criterion.criterions);
                    } else {
                        criterions.push(criterion);
                    }
                }
            }
        }
        $invokeSuper.call(this, [criterions]);
    }, highlightItem:function(entity: any, options: any, speed: any) {
        function highlight(row: any) {
            if (!row) {
                return;
            }
            $fly(row).addClass("highlighting-row").effect("highlight", options || {color:"#FFFF80"}, speed || 1500, function() {
                $fly(row).removeClass("highlighting-row");
            });
        }
        entity = entity || this.getCurrentItem();
        let itemId = this._itemModel.getItemId(entity), innerGrid, row1, row2;
        if (this._domMode === 2) {
            innerGrid = this._fixedInnerGrid;
            row1 = innerGrid._itemDomMap[itemId];
        }
        innerGrid = this._innerGrid;
        row2 = innerGrid._itemDomMap[itemId];
        if (row2) {
            highlight(row1);
            highlight(row2);
        } else {
            if (!entity._disableDelayHighlight) {
                let self = this;
                setTimeout(function() {
                    entity._disableDelayHighlight = true;
                    self.highlightItem(entity, options, speed);
                    entity._disableDelayHighlight = false;
                }, 100);
            }
        }
    }, setHoverHeaderColumn:function(column: any) {
        if (this._headerHoverColumn === column) {
            return;
        }
        let oldColumn = this._headerHoverColumn;
        if (oldColumn) {
            $fly(oldColumn.headerCell).removeClass("hover-header");
            if (this._headerMenuOpenColumn !== oldColumn) {
                this.hideHeaderOptionButton(oldColumn);
            }
        }
        this._headerHoverColumn = column;
        if (column) {
            hideColumnResizeHandler();
            let $cell = jQuery(column.headerCell);
            $cell.addClass("hover-header");
            if (!$cell.data("ui-draggable")) {
                let grid = this;
                let options = dorado.Object.apply({appendTo:"body", helper:function(evt: any) {
                    return getColumnDragHelper(evt, this);
                }, draggingInfo:function() {
                    let column = grid._columnsInfo.idMap[this.colId];
                    return new dorado.DraggingInfo({object:column, sourceControl:grid, options:options, tags:["grid-column"]});
                }, start:function() {
                    let column = grid._columnsInfo.idMap[this.colId];
                    grid.hideHeaderOptionButton(column);
                }}, this.defaultDraggableOptions);
                $cell.draggable(options);
            }
            this.showHeaderOptionButton(column);
        }
    }, showHeaderOptionButton:function(column: any) {
        if (!column || !column._supportsOptionMenu || column._property === "none") {
            return;
        }
        let cell = column.headerCell, $cell = jQuery(cell);
        $cell.addClass("menu-open-header");
        let button = this.getHeaderOptionButton(column);
        button.style.display = "";
        let offset = $cell.offset(), offsetParent = $fly(cell.offsetParent).offset();
        let l = offset.left - offsetParent.left + cell.offsetWidth - button.offsetWidth, t = offset.top - offsetParent.top + 1;
        $fly(button).css({left:l, top:t}).outerHeight(cell.offsetHeight - 2);
    }, hideHeaderOptionButton:function(column: any) {
        if (!column) {
            return;
        }
        $fly(column.headerCell).removeClass("menu-open-header");
        let button = this.getHeaderOptionButton(column);
        if (button) {
            button.style.display = "none";
        }
    }, getHeaderOptionButton:function(column: any) {
        let cell = column.headerCell, button = cell.lastChild;
        if ((!button || button.className !== "header-option-button") && cell) {
            button = $DomUtils.xCreate({tagName:"DIV", className:"header-option-button", style:{display:"none", position:"absolute"}});
            $DomUtils.disableUserSelection(button);
            let self = this;
            $fly(button).mousedown(function(evt: any) {
                return false;
            }).click(function() {
                let menu = self.getHeaderOptionMenu(true);
                if (menu.get("visible")) {
                    menu.hide();
                } else {
                    let column = $fly(button).data("gridColumn");
                    self.initHeaderOptionMenu(menu, column);
                    menu._gridColumn = column;
                    menu.bind("onHide", function() {
                        let col = self._headerMenuOpenColumn;
                        if (col && col !== self._headerHoverColumn) {
                            self.hideHeaderOptionButton(col);
                            self._headerMenuOpenColumn = null;
                        }
                    }, {once:true, delay:0});
                    menu.show({anchorTarget:button, align:"innerright", vAlign:"bottom"});
                    self._headerMenuOpenColumn = column;
                }
                return false;
            });
        }
        if (cell && button.parentNode !== cell) {
            cell.appendChild(button);
        }
        $fly(button).data("gridColumn", column);
        return button;
    }, getHeaderOptionMenu:function(create: any) {
        let menu = this._headerOptionMenu, grid = this;
        if (!menu && create) {
            this._headerOptionMenu = menu = new dorado.widget.Menu({items:[{name:"sortAsc", caption:$resource("dorado.grid.OptionMenuSortAscending"), iconClass:"d-grid-menu-sort-asc", onClick:function(self: any) {
                if (menu._gridColumn instanceof dorado.widget.grid.DataColumn) {
                    grid.sort(menu._gridColumn, false);
                }
            }}, {name:"sortDesc", caption:$resource("dorado.grid.OptionMenuSortDescending"), iconClass:"d-grid-menu-sort-desc", onClick:function(self: any) {
                if (menu._gridColumn instanceof dorado.widget.grid.DataColumn) {
                    grid.sort(menu._gridColumn, true);
                }
            }}, new dorado.widget.menu.Separator({name:"sortSeprator"}), {name:"fix", caption:$resource("dorado.grid.OptionMenuFix"), iconClass:"d-grid-menu-fix", onClick:function(self: any) {
                grid.set("fixedColumnCount", menu._columnIndex + 1);
            }}, {name:"unfix", caption:$resource("dorado.grid.OptionMenuUnfix"), onClick:function(self: any) {
                grid.set("fixedColumnCount", 0);
            }}, new dorado.widget.menu.Separator({name:"fixSeprator"}), {name:"group", caption:$resource("dorado.grid.OptionMenuGroup"), iconClass:"d-grid-menu-group", onClick:function(self: any) {
                let column = menu._gridColumn, grid = column._grid;
                grid.set("groupProperty", column.get("property"));
                grid.refresh();
            }}, {name:"ungroup", caption:$resource("dorado.grid.OptionMenuUngroup"), onClick:function(self: any) {
                let column = menu._gridColumn, grid = column._grid;
                grid.set("groupProperty", null);
                grid.refresh();
            }}, new dorado.widget.menu.Separator({name:"groupSeprator"}), {$type:"Checkable", name:"toggleFilterBar", caption:$resource("dorado.grid.OptionMenuToggleFilterBar"), checked:!!grid.get("showFilterBar"), onClick:function(self: any) {
                grid.set("showFilterBar", !grid.get("showFilterBar"));
            }}, new dorado.widget.menu.Separator({name:"filterSeprator"}), {name:"groupColumn", caption:$resource("dorado.grid.OptionMenuGroupColumn"), onClick:function(self: any) {
                dorado.MessageBox.prompt($resource("dorado.grid.InputNewGroupName"), function(text: any) {
                    let column = menu._gridColumn, parentColumn = column._parent, grid = column._grid;
                    let i = parentColumn.get("columns").remove(column);
                    if (i >= 0) {
                        parentColumn.addColumn(new dorado.widget.grid.ColumnGroup({caption:text, columns:[column]}), i);
                        grid.refresh();
                    }
                });
            }}, {name:"ungroupColumns", caption:$resource("dorado.grid.OptionMenuUngroupColumns"), onClick:function(self: any) {
                let column = menu._gridColumn, parentColumn = column._parent, grid = column._grid;
                let i = parentColumn.get("columns").remove(column);
                if (i >= 0) {
                    column.get("columns").each(function(subColumn: any) {
                        parentColumn.addColumn(subColumn, i);
                        i++;
                    });
                    grid.refresh();
                }
            }}, new dorado.widget.menu.Separator({name:"groupColumnSeprator"}), {name:"columns", caption:$resource("dorado.grid.OptionMenuColumns"), iconClass:"d-grid-menu-column", items:[]}]});
            this.registerInnerControl(menu);
        }
        return menu;
    }, initHeaderOptionMenu:function(menu: any, column: any) {
        function crreateColumnItems(columnsItem: any, columns: any) {
            columns.each(function(column: any) {
                let item = new dorado.widget.menu.CheckableMenuItem({$type:"Checkable", caption:column.get("caption") || column.get("name"), checked:column.get("visible"), hideOnClick:false, onCheckedChange:function(self: any) {
                    let col = self._column;
                    col.set("visible", !col.get("visible"));
                    col._grid.refresh();
                }});
                item._column = column;
                if (column instanceof dorado.widget.grid.ColumnGroup) {
                    crreateColumnItems(item, column.get("columns"));
                }
                columnsItem.addItem(item);
            });
        }
        let isDataColumn = column instanceof dorado.widget.grid.DataColumn;
        let sortState = isDataColumn ? column.get("sortState") : null;
        menu.findItem("sortAsc").set("disabled", !isDataColumn);
        menu.findItem("sortDesc").set("disabled", !isDataColumn);
        let columns = this.get("columns");
        let isTopColumn = (column.get("parent") === this), fixed = false;
        if (isTopColumn) {
            menu._columnIndex = columns.indexOf(column);
            fixed = (this._realFixedColumnCount > 0 && (menu._columnIndex + 1) === this._realFixedColumnCount);
        }
        menu.findItem("fix").set("disabled", !isTopColumn || fixed || this._groupProperty);
        menu.findItem("unfix").set("disabled", this._realFixedColumnCount === 0 || this._groupProperty);
        menu.findItem("toggleFilterBar").set("checked", this._showFilterBar);
        menu.findItem("ungroupColumns").set("disabled", isDataColumn);
        menu.findItem("group").set("disabled", !isDataColumn);
        menu.findItem("ungroup").set("disabled", !this._groupProperty);
        let columnsItem = menu.findItem("columns");
        columnsItem.clearItems();
        crreateColumnItems(columnsItem, columns);
    }, selectAll:function() {
        if (this._selectionMode !== "multiRows") {
            return;
        }
        let added = this._itemModel.getAllDataEntities();
        let selection = this.get("selection");
        if (selection.length && added.length) {
            for (let i = 0; i < selection.length; i++) {
                added.remove(selection[i]);
            }
        }
        this._innerGrid.replaceSelection(null, added);
    }, unselectAll:function() {
        this._innerGrid.replaceSelection(this.get("selection"), null);
    }, selectInvert:function() {
        if (this._selectionMode !== "multiRows") {
            return;
        }
        let selection = this.get("selection"), removed = [], added = [];
        jQuery.each(this._itemModel.getAllDataEntities(), function(i: any, item: any) {
            if (selection.indexOf(item) >= 0) {
                removed.push(item);
            } else {
                added.push(item);
            }
        });
        this._innerGrid.replaceSelection(removed, added);
    }, refreshSummary:function() {
        this._itemModel.footerEntity.set("$expired", true);
        dorado.Toolkits.setDelayedAction(this, "$refreshSummaryTimerId", function() {
            this._itemModel.refreshSummary();
        }, 300);
    }, onEntityChanged:function(entity: any, property: any) {
        let itemModel = this._itemModel;
        if (itemModel.groups) {
            let groupProperty = this._groupProperty;
            let groupValue = ((entity instanceof dorado.Entity) ? itemModel.entityMap[entity.entityId] : entity[groupProperty]) + "";
            if (property === groupProperty && entity instanceof dorado.Entity && entity.getText(groupProperty) !== groupValue) {
                this._itemModel.refreshItems();
                this.refresh(true);
                return false;
            }
            let group = itemModel.groupMap[groupValue];
            if (group) {
                group.headerEntity.set("$expired", true);
                group.footerEntity.set("$expired", true);
            }
        }
        return true;
    }, getFloatFilterPanel:function() {
        let floatFilterPanel = this._floatFilterPanel;
        if (!floatFilterPanel) {
            this._floatFilterPanel = floatFilterPanel = $DomUtils.xCreate({tagName:"DIV", className:"float-filter-panel"});
            let self = this;
            $fly(floatFilterPanel).mouseenter(function() {
                self.showFilterPanel();
            }).mouseleave(function() {
                dorado.Toolkits.setDelayedAction(self, "$filterPanelTimerId", self.hideFilterPanel, 500);
            });
            let button;
            button = new dorado.widget.SimpleIconButton({exClassName:"filter-button", onClick:function() {
                self.filter();
            }});
            this.registerInnerControl(button);
            button.render(floatFilterPanel);
            button = new dorado.widget.SimpleIconButton({exClassName:"reset-button", onClick:function() {
                self.get("filterEntity").clearData();
                self.filter();
            }});
            this.registerInnerControl(button);
            button.render(floatFilterPanel);
            this.getDom().appendChild(floatFilterPanel);
        }
        return floatFilterPanel;
    }, showFilterPanel:function() {
        if (!dorado.Toolkits.cancelDelayedAction(this, "$filterPanelTimerId")) {
            let panel = this.getFloatFilterPanel(), filterBar = this._innerGrid._filterBarRow;
            let $panel = $fly(panel);
            $panel.hide().top(filterBar.offsetTop + filterBar.offsetHeight - 1);
            if (dorado.Browser.msie && dorado.Browser.version < 7) {
                $panel.show();
            } else {
                $panel.slideDown("fast");
            }
        }
    }, hideFilterPanel:function() {
        dorado.Toolkits.cancelDelayedAction(this, "$filterPanelTimerId");
        let panel = this.getFloatFilterPanel(), filterBar = this._innerGrid._filterBarRow;
        if (dorado.Browser.msie && dorado.Browser.version < 7) {
            $fly(panel).hide();
        } else {
            $fly(panel).slideUp("slow");
        }
    }, getDraggableOptions:function(dom: any) {
        let options = $invokeSuper.call(this, arguments);
        if (dom === this._dom) {
            options.handle = ":first-child";
        }
        return options;
    }, findItemDomByEvent:function(evt: any) {
        let target = evt.srcElement || evt.target || evt;
        let innerTbody = this._innerGrid._dataTBody, fixedInnerTBody;
        if (this._domMode === 2) {
            fixedInnerTBody = this._fixedInnerGrid._dataTBody;
        }
        return $DomUtils.findParent(target, function(parentNode: any) {
            return parentNode.parentNode === innerTbody || (fixedInnerTBody && parentNode.parentNode === fixedInnerTBody);
        });
    }, getDraggingInsertIndicator:dorado.widget.AbstractList.prototype.getDraggingInsertIndicator, onDragStart:function() {
        $invokeSuper.call(this, arguments);
        this.hideCellEditor();
    }, findItemDomByPosition:function(pos: any) {
        pos.y -= this._innerGrid._frameTBody.offsetTop - this._innerGrid._container.scrollTop;
        return this._innerGrid.findItemDomByPosition.call(this._innerGrid, pos);
    }, showDraggingInsertIndicator:function(draggingInfo: any, insertMode: any, itemDom: any) {
        let insertIndicator = dorado.widget.AbstractList.getDraggingInsertIndicator();
        if (insertMode) {
            let dom = this._dom;
            let width = dom.firstChild.offsetWidth;
            let top = this._innerGrid._frameTBody.offsetTop - this._innerGrid._container.scrollTop + ((insertMode === "before") ? itemDom.offsetTop : (itemDom.offsetTop + itemDom.offsetHeight));
            if (dom.firstChild.clientWidth < width) {
                width = dom.firstChild.clientWidth;
            }
            $fly(insertIndicator).width(width).height(2).left(0).top(top - 1).show();
            dom.appendChild(insertIndicator);
        } else {
            $fly(insertIndicator).hide();
        }
    }, setDraggingOverItemDom:function(itemDom: any) {
        this._innerGrid.setDraggingOverItemDom(itemDom);
        if (this._fixedInnerGrid) {
            if (itemDom) {
                itemDom = this._fixedInnerGrid._itemDomMap[itemDom._itemId];
            }
            this._fixedInnerGrid.setDraggingOverItemDom(itemDom);
        }
    }, onHeaderDragMove:function(draggingInfo: any, evt: any) {
        function findDropPosition(columns: any) {
            for (let i = 0; i < columns.length; i++) {
                let column = columns[i];
                let cell = column.headerCell;
                if (!cell || !column.get("visible")) {
                    continue;
                }
                if (offsetParent !== cell.offsetParent) {
                    offsetParent = cell.offsetParent;
                    parentOffset = $fly(offsetParent).offset();
                }
                let left = parentOffset.left + cell.offsetLeft;
                if (left <= evt.pageX && left + cell.offsetWidth >= evt.pageX) {
                    if (column instanceof dorado.widget.grid.ColumnGroup) {
                        let top = parentOffset.top + getCellOffsetTop(cell, this._headerRowHeight);
                        if (evt.pageY > top + cell.offsetHeight) {
                            return findDropPosition.call(this, column._columns.items);
                        }
                    }
                    return {before:evt.pageX < left + cell.offsetWidth / 2, column:column};
                }
            }
            return null;
        }
        let column = draggingInfo.get("object");
        if (column) {
            let offsetParent, parentOffset, dropPosition = findDropPosition.call(this, this._columns.items);
            if (dropPosition != null) {
                if (dropPosition.column === column) {
                    dropPosition = null;
                } else {
                    let oldColumns = column._parent._columns;
                    if (dropPosition.column === oldColumns.items[oldColumns.indexOf(column) + (dropPosition.before ? 1 : -1)]) {
                        dropPosition = null;
                    }
                }
            }
            showColumnDropIndicator(this, dropPosition);
            draggingInfo.dropPosition = dropPosition;
            draggingInfo.set("accept", dropPosition != null);
        }
    }, onDraggingSourceMove:function(draggingInfo: any, evt: any) {
        let pos = this.getMousePosition(evt);
        if (pos.y < this._innerGrid._frameTBody.offsetTop) {
            let column = draggingInfo.get("object");
            if (draggingInfo.isDropAcceptable(["grid-column"]) && column && this === column.get("grid")) {
                this.showDraggingInsertIndicator();
                this.onHeaderDragMove(draggingInfo, evt);
            } else {
                draggingInfo.set("accept", false);
            }
        } else {
            hideColumnDropIndicator();
            return dorado.widget.AbstractList.prototype.onDraggingSourceMove.apply(this, arguments);
        }
    }, doOnDraggingSourceMove:dorado.widget.AbstractList.prototype.doOnDraggingSourceMove, onDraggingSourceOut:function(draggingInfo: any, evt: any) {
        hideColumnDropIndicator();
        return dorado.widget.AbstractList.prototype.onDraggingSourceOut.apply(this, arguments);
    }, onHeaderDragDrop:function(draggingInfo: any, evt: any) {
        let dropPosition = draggingInfo.dropPosition;
        if (dropPosition) {
            let ind = window._colDropIndicator;
            if (ind) {
                let column = draggingInfo.get("object");
                let refColumn = dropPosition.column;
                hideColumnDropIndicator();
                let oldColumns = column._parent._columns;
                let columns = refColumn._parent._columns;
                if (columns !== oldColumns && oldColumns.size <= 1) {
                    setTimeout(function() {
                        throw new dorado.ResourceException("dorado.grid.RemoveTheOnlyColumn", (grid._id || grid._uniqueId));
                    }, 100);
                    return;
                }
                let oldGrid = column.get("grid");
                oldColumns.remove(column);
                columns.insert(column, columns.indexOf(refColumn) + (dropPosition.before ? 0 : 1));
                this._ignoreItemTimestamp = true;
                this.refresh();
                if (oldGrid !== this) {
                    oldGrid._ignoreItemTimestamp = true;
                    oldGrid.refresh();
                }
            }
        } else {
            hideColumnDropIndicator();
        }
        return true;
    }, onDraggingSourceDrop:function(draggingInfo: any, evt: any) {
        let pos = this.getMousePosition(evt);
        if (pos.y < this._innerGrid._frameTBody.offsetTop) {
            this.onHeaderDragDrop(draggingInfo, evt);
        } else {
            dorado.widget.AbstractList.prototype.onDraggingSourceDrop.apply(this, arguments);
        }
    }, processItemDrop:dorado.widget.AbstractList.prototype.processItemDrop, initDraggingIndicator:function() {
    }, beforeCellValueEdit:function(entity: any, column: any, value: any) {
        let arg = {entity:entity, column:column, value:value, processDefault:true};
        this.fireEvent("beforeCellValueEdit", this, arg);
        return arg.processDefault;
    }, onCellValueEdit:function(entity: any, column: any) {
        this.fireEvent("onCellValueEdit", this, {entity:entity, column:column});
    }, showLoadingTip:dorado.widget.AbstractList.prototype.showLoadingTip, hideLoadingTip:dorado.widget.AbstractList.prototype.hideLoadingTip});
    dorado.widget.grid.AbstractInnerGrid = $extend(dorado.widget.RowList, {$className:"dorado.widget.grid.AbstractInnerGrid", focusable:false, ATTRIBUTES:{selection:{getter:function(p: any, v: any) {
        if (this.fixed) {
            return this.grid.get(p);
        } else {
            if (this._selectionMode === "multiRows") {
                return this._selection ? this._selection.slice(0) : [];
            } else {
                return this._selection;
            }
        }
    }}, useNativeScrollbars:{readOnly:true}}, constructor:function(grid: any, fixed: any) {
        this.grid = grid;
        this.fixed = fixed;
        $invokeSuper.call(this, []);
        this._itemModel = grid._itemModel;
        if (fixed) {
            this._className = "fixed-inner-grid";
            this._skipProcessBlankRows = true;
            this.setScrollingIndicator = dorado._NULL_FUNCTION;
        } else {
            this._className = "inner-grid";
        }
    }, createItemModel:dorado._NULL_FUNCTION, createDom:function() {
        this._container = $DomUtils.xCreate({tagName:"DIV", style:{overflow:"hidden", height:"100%", position:"relative"}});
        let tableFrame = $DomUtils.xCreate({tagName:"TABLE", className:"frame-table", cellSpacing:0, cellPadding:0, style:{position:"relative"}, content:["^THEAD", {tagName:"TR", content:{tagName:"TD", vAlign:"top", content:this._container}}, "^TFOOT"]});
        this._frameTHead = tableFrame.tHead;
        this._frameTBody = tableFrame.tBodies[0];
        this._frameTFoot = tableFrame.tFoot;
        return tableFrame;
    }, refreshDom:function(dom: any) {
        if (!this._columnsInfo) {
            return;
        }
        dorado.widget.Control.prototype.refreshDom.apply(this, arguments);
        this.refreshFrameHeader();
        this.refreshFrameFooter();
        this.updateContainerHeight(this._container);
        this.refreshFrameBody(this._container);
        this._scrollMode = this._scrollMode;
        let grid = this.grid;
        if (!this.fixed) {
            if (!grid._skipScrollCurrentIntoView) {
                if (this._currentRow) {
                    this.scrollItemDomIntoView(this._currentRow);
                } else {
                    this.scrollCurrentIntoView();
                }
            }
            delete grid._skipScrollCurrentIntoView;
            if (grid._rowHeightInfos) {
                let rowHeightInfos = grid._rowHeightInfos;
                let p = (dorado.Browser.mozilla || dorado.Browser.opera) ? "offsetHeight" : "clientHeight";
                if (this._beginBlankRow) {
                    rowHeightInfos.rows["beginBlankRow"] = (this._beginBlankRow.parentNode.style.display === "none") ? 0 : this._beginBlankRow.firstChild[p];
                }
                if (this._endBlankRow) {
                    rowHeightInfos.rows["endBlankRow"] = (this._endBlankRow.parentNode.style.display === "none") ? 0 : this._endBlankRow.firstChild[p];
                }
                rowHeightInfos.rowHeightAverage = this._rowHeightAverage;
                rowHeightInfos.startIndex = this.startIndex;
            }
            if (grid._rowHeightInfos) {
                grid.syncroRowHeights(this._container);
            }
            let oldScrollTop = grid._scrollTop || 0;
            grid.updateScroller(this._container);
        }
    }, refreshFrameHeader:function() {
        let grid = this.grid, tableFrameHeader = this._frameTHead;
        let $tableFrameHeader = jQuery(tableFrameHeader);
        if (grid._showHeader) {
            let headerTable = this._headerTable;
            let headerTBody = this._headerTBody;
            if (!headerTable) {
                headerTable = this._headerTable = $DomUtils.xCreate({tagName:"TABLE", className:"header-table", cellSpacing:0, cellPadding:0, style:{width:"100%"}, content:"^TBODY"});
                tableFrameHeader.appendChild($DomUtils.xCreate({tagName:"TR", style:{height:"1px"}, content:{tagName:"TD", content:headerTable}}));
                headerTBody = this._headerTBody = headerTable.tBodies[0];
                let self = this;
                $fly(headerTBody).mousemove(function() {
                    return self.onHeaderMouseMove.apply(self, arguments);
                }).mouseleave(function() {
                    return self.onHeaderMouseLeave.apply(self, arguments);
                });
                let options = dorado.Object.apply({doradoDroppable:grid}, grid.defaultDroppableOptions);
                $fly(headerTable).droppable(options);
            }
            if (headerTable.columnModelTimestamp && headerTable.columnModelTimestamp !== grid._columnModelTimestamp) {
                $fly(headerTBody).empty();
            }
            headerTable.columnModelTimestamp = grid._columnModelTimestamp;
            let structure = this._columnsInfo.structure;
            for (let i = 0; i < structure.length; i++) {
                let cellInfos = structure[i];
                let row = $DomUtils.getOrCreateChild(headerTBody, i, function() {
                    let row = document.createElement("TR"), offset = 0;
                    if (dorado.Browser.msie && dorado.Browser.version < 8 && cellInfos.length === 0) {
                        offset = structure.length * 2;
                    }
                    row.style.height = (grid._headerRowHeight + offset) + "px";
                    if (dorado.Browser.msie && dorado.Browser.version < 7) {
                        row.style.position = "static";
                    }
                    return row;
                });
                let self = this;
                for (let j = 0; j < cellInfos.length; j++) {
                    let cellInfo = cellInfos[j];
                    let col = cellInfo.column;
                    let cell = col.headerCell = $DomUtils.getOrCreateChild(row, j, function() {
                        let cell = self.createCell();
                        $fly(cell).click(function() {
                            let column = grid._columnsInfo.idMap[cell.colId];
                            if (column) {
                                let eventArg = {column:column, processDefault:true};
                                grid.fireEvent("onHeaderClick", grid, eventArg);
                                if (eventArg.processDefault) {
                                    column.fireEvent("onHeaderClick", column, eventArg);
                                }
                                if (eventArg.processDefault) {
                                    if (column instanceof dorado.widget.grid.DataColumn && column._property !== "none" && column._supportsOptionMenu) {
                                        let sortState = column.get("sortState");
                                        try {
                                            grid.sort(column, !(sortState == null || sortState === "desc"));
                                        }
                                        catch (e) {
                                            dorado.Exception.removeException(e);
                                        }
                                    }
                                }
                            }
                        });
                        return cell;
                    });
                    cell.className = "header";
                    cell.colSpan = cellInfo.colSpan;
                    cell.rowSpan = cellInfo.rowSpan || (structure.length - i);
                    if (dorado.Browser.msie && dorado.Browser.version < 7) {
                        cell.style.position = "static";
                    }
                    cell.align = col._headerAlign;
                    let $cell = $fly(cell);
                    if ($cell.data("selectionMenuBinded")) {
                        $cell.removeData("selectionMenuBinded");
                        $cell.unbind("click");
                    }
                    let label = cell.firstChild;
                    if (col instanceof dorado.widget.grid.DataColumn) {
                        if (col.get("sortState")) {
                            $fly(cell).addClass("sorted-header");
                        }
                        label.style.width = col._realWidth + "px";
                    } else {
                        let w = 0;
                        col._columns.each(function(subCol: any) {
                            if (subCol._visible) {
                                w += (subCol._realWidth || 0);
                            }
                        });
                        if (w) {
                            label.style.width = w + "px";
                        }
                    }
                    let processDefault = true, arg = {dom:label, column:col, processDefault:false};
                    if (grid.getListenerCount("onRenderHeaderCell")) {
                        grid.fireEvent("onRenderHeaderCell", this, arg);
                        processDefault = arg.processDefault;
                    }
                    if (processDefault) {
                        if (col.getListenerCount("onRenderHeaderCell")) {
                            arg.processDefault = false;
                            col.fireEvent("onRenderHeaderCell", col, arg);
                            processDefault = arg.processDefault;
                        }
                        if (processDefault) {
                            dorado.Renderer.render(col._headerRenderer || grid._headerRenderer || $singleton(dorado.widget.grid.DefaultCellHeaderRenderer), label, {grid:grid, innerGrid:this, column:col});
                        }
                    }
                    cell.colId = col._uniqueId;
                    if (grid._headerMenuOpenColumn === col) {
                        grid.showHeaderOptionButton(col);
                    }
                }
                $DomUtils.removeChildrenFrom(row, cellInfos.length);
            }
            $DomUtils.removeChildrenFrom(headerTBody, structure.length);
            let filterBarRow = this._filterBarRow, filterBarHeight = 0;
            let tFoot = headerTable.tFoot;
            if (grid._showFilterBar) {
                if (!filterBarRow) {
                    tFoot = document.createElement("TFOOT");
                    this._filterBarRow = filterBarRow = document.createElement("TR");
                    filterBarRow.className = "filter-bar";
                    $fly(filterBarRow).mouseenter(function() {
                        grid.showFilterPanel();
                    }).mouseleave(function() {
                        dorado.Toolkits.setDelayedAction(grid, "$filterPanelTimerId", grid.hideFilterPanel, 500);
                    });
                    tFoot.appendChild(filterBarRow);
                    headerTable.appendChild(tFoot);
                } else {
                    tFoot = filterBarRow.parentNode;
                    $fly(tFoot).show();
                }
                this.refreshFilterBar();
                filterBarHeight = tFoot.offsetHeight;
            } else {
                if (tFoot) {
                    $fly(tFoot).hide();
                }
            }
            $tableFrameHeader.show();
        } else {
            $tableFrameHeader.hide();
        }
    }, refreshFilterBar:function() {
        let grid = this.grid, filterBarRow = this._filterBarRow, filterEntity = grid._itemModel.filterEntity;
        let dataColumns = this._columnsInfo.dataColumns;
        for (let i = 0; i < dataColumns.length; i++) {
            let column = dataColumns[i];
            let cell = $DomUtils.getOrCreateChild(filterBarRow, i, this.createCell), label = cell.firstChild;
            cell.className = "filter-bar-cell";
            label.style.width = column._realWidth + "px";
            let renderer = grid._filterBarRenderer || column._filterBarRenderer || $singleton(dorado.widget.grid.FilterBarCellRenderer);
            dorado.Renderer.render(renderer, label, {grid:grid, innerGrid:this, data:filterEntity, column:column});
            cell.colId = column._uniqueId;
        }
        $DomUtils.removeChildrenFrom(filterBarRow, dataColumns.length);
    }, refreshFrameFooter:function() {
        let grid = this.grid, tableFrameFooter = this._frameTFoot;
        let $tableFrameFooter = jQuery(tableFrameFooter);
        if (grid._showFooter) {
            let footerTable = this._footerTable;
            let footerRow = this._footerRow;
            if (!footerTable) {
                footerTable = this._footerTable = $DomUtils.xCreate({tagName:"TABLE", className:"footer-table", cellSpacing:0, cellPadding:0, style:{width:"100%"}, content:"^TR"});
                tableFrameFooter.appendChild($DomUtils.xCreate({tagName:"TR", style:{height:"1px"}, content:{tagName:"TD", content:footerTable}}));
                footerRow = this._footerRow = footerTable.tBodies[0].childNodes[0];
            }
            footerRow.style.height = grid._footerRowHeight + "px";
            if (footerTable.columnModelTimestamp && footerTable.columnModelTimestamp !== grid._columnModelTimestamp) {
                $fly(footerRow).empty();
            }
            footerTable.columnModelTimestamp = grid._columnModelTimestamp;
            let dataColumns = this._columnsInfo.dataColumns;
            for (let i = 0; i < dataColumns.length; i++) {
                let col = dataColumns[i];
                let cell = $DomUtils.getOrCreateChild(footerRow, i, this.createCell);
                cell.className = "footer";
                if (col._footerAlign) {
                    cell.align = col._footerAlign;
                } else {
                    cell.removeAttribute("align");
                }
                let label = cell.firstChild;
                if (col instanceof dorado.widget.grid.DataColumn) {
                    label.style.width = col._realWidth + "px";
                }
                let processDefault = true, arg = {dom:label, data:grid._itemModel.footerEntity, column:col, processDefault:false};
                if (grid.getListenerCount("onRenderFooterCell")) {
                    grid.fireEvent("onRenderFooterCell", this, arg);
                    processDefault = arg.processDefault;
                }
                if (processDefault) {
                    if (col.getListenerCount("onRenderFooterCell")) {
                        arg.processDefault = false;
                        col.fireEvent("onRenderFooterCell", col, arg);
                        processDefault = arg.processDefault;
                    }
                    if (processDefault) {
                        dorado.Renderer.render(col._footerRenderer || grid._footerRenderer || $singleton(dorado.widget.grid.DefaultCellFooterRenderer), label, {grid:grid, innerGrid:this, column:col, data:grid._itemModel.footerEntity});
                    }
                }
                cell.colId = col._uniqueId;
            }
            $DomUtils.removeChildrenFrom(footerRow, dataColumns.length);
            $tableFrameFooter.show();
        } else {
            $tableFrameFooter.hide();
        }
    }, appendTouchMoveEvent:function(container: any) {
        let grid = this.grid;
        if (dorado.Browser.isTouch) {
            container.addEventListener("touchstart", function(event: any) {
                this._scrollStartPosX = this.scrollLeft + event.touches[0].pageX;
                this._scrollStartPosY = this.scrollTop + event.touches[0].pageY;
            });
            let rowList = this;
            container.addEventListener("touchmove", function(event: any) {
                this.scrollLeft = this._scrollStartPosX - event.touches[0].pageX;
                this.scrollTop = this._scrollStartPosY - event.touches[0].pageY;
                grid.onScroll(null, this);
            });
        }
    }, refreshFrameBody:function(container: any) {
        this._cols = this._columnsInfo.dataColumns.length;
        if (this._scrollMode === "viewport") {
            this.refreshViewPortContent(container);
        } else {
            this.refreshContent(container);
        }
        if (this._scrollMode && this._scrollMode !== this._scrollMode && !this.getCurrentItemId()) {
            this.onYScroll(this._divScroll);
        }
    }, updateContainerHeight:function(container: any) {
        if (this.grid.hasRealHeight()) {
            let tableFrame = this.getDom();
            let h = (tableFrame.parentNode.offsetHeight - (this._headerTable ? this._headerTable.offsetHeight : 0) - (this._footerTable ? this._footerTable.offsetHeight : 0));
            if (h >= 0) {
                container.style.height = h + "px";
            }
        } else {
            container.style.height = "";
        }
    }, notifySizeChange:function() {
        if (!this._parent || !this._rendered || this.fixed) {
            return;
        }
        this.grid.notifySizeChange();
    }, doRefreshItemDomData:function(row: any, entity: any) {
        let grid = this.grid, processDefault = true;
        if (grid.getListenerCount("onRenderRow")) {
            let arg = {dom:row, data:entity, rowType:entity.rowType, processDefault:true};
            grid.fireEvent("onRenderRow", grid, arg);
            processDefault = arg.processDefault;
        }
        if (processDefault) {
            let renderer;
            if (entity.rowType === "header") {
                renderer = grid._groupHeaderRenderer || $singleton(dorado.widget.grid.GroupHeaderRenderer);
            } else {
                if (entity.rowType === "footer") {
                    renderer = grid._groupFooterRenderer || $singleton(dorado.widget.grid.GroupFooterRenderer);
                } else {
                    renderer = grid._rowRenderer || $singleton(dorado.widget.grid.DefaultRowRenderer);
                }
            }
            dorado.Renderer.render(renderer, row, {grid:grid, innerGrid:this, data:entity});
        }
    }, createCell:function() {
        let label = document.createElement("DIV");
        label.className = "cell";
        label.style.overflow = "hidden";
        let cell = document.createElement("TD");
        cell.appendChild(label);
        return cell;
    }, createItemDom:function(item: any) {
        let grid = this.grid;
        let row = document.createElement("TR");
        row.className = "row";
        if (this._scrollMode === "lazyRender" && this._shouldSkipRender) {
            row._lazyRender = true;
            row.style.height = grid._rowHeight + "px";
        }
        if (dorado.Browser.isTouch) {
            row.addEventListener("touchstart", function(event: any) {
                this._touchmove = false;
            });
            row.addEventListener("touchmove", function(event: any) {
                this._touchmove = true;
            });
            let rowList = this;
            row.addEventListener("touchend", function(event: any) {
                if (!this._touchmove) {
                    rowList.setCurrentRow(this);
                }
            });
        }
        return row;
    }, createItemDomDetail:function(row: any, item: any) {
        row.style.height = "";
    }, refreshItemDoms:function(tbody: any, reverse: any, fn: any) {
        let grid = this.grid;
        if (this.fixed) {
            grid._rowHeightInfos = {rows:{}, unmatched:[], unfound:{}};
        }
        if (grid._domMode === 2) {
            let rows;
            if (this.fixed) {
                rows = $invokeSuper.call(this, arguments);
            } else {
                let i = 0;
                let visibleRows = grid._rowHeightInfos ? grid._rowHeightInfos.visibleRows : Number.MAX_VALUE;
                rows = $invokeSuper.call(this, [tbody, reverse, (function(row: any) {
                    let b = fn ? fn(row) : true;
                    return b && ((++i) < visibleRows);
                })]);
            }
            if (grid._rowHeightInfos) {
                grid._rowHeightInfos.visibleRows = rows;
            }
            return rows;
        } else {
            return $invokeSuper.call(this, arguments);
        }
    }, setFocus:dorado._NULL_FUNCTION, doOnResize:dorado._NULL_FUNCTION, onScroll:function(event: any, arg: any) {
        let grid = this.grid;
        if (grid._innerGrid === this) {
            grid.onScroll(event, arg);
        }
    }, doOnKeyDown:function() {
        return true;
    }, syncroRowHeights:function(scrollInfo: any) {
        let rowHeightInfos = this.grid._rowHeightInfos;
        if (this.grid._dynaRowHeight) {
            for (let i = 0; i < rowHeightInfos.unmatched.length; i++) {
                let row = this._itemDomMap[rowHeightInfos.unmatched[i]];
                if (row) {
                    let h = rowHeightInfos.rows[rowHeightInfos.unmatched[i]];
                    if (dorado.Browser.msie && dorado.Browser.version === 8) {
                        row.style.height = h + "px";
                        $fly(row).toggleClass("fix-row-bug");
                    } else {
                        row.style.height = h + "px";
                    }
                }
            }
            rowHeightInfos.unmatched = [];
            if (this._itemDomCount > rowHeightInfos.visibleRows) {
                for (let itemId in rowHeightInfos.unfound) {
                    if (rowHeightInfos.unfound.hasOwnProperty(itemId)) {
                        let row = this._itemDomMap[itemId];
                        if (row) {
                            this.removeItemDom(row);
                        }
                    }
                }
                rowHeightInfos.unfound = {};
            }
        }
        if (this._beginBlankRow) {
            let beginBlankRowEl = this._beginBlankRow;
            let beginBlankRow = rowHeightInfos.rows["beginBlankRow"];
            if (beginBlankRow) {
                beginBlankRowEl.firstChild.colSpan = this._cols;
                beginBlankRowEl.firstChild.style.height = beginBlankRow + "px";
                beginBlankRowEl.parentNode.style.display = "";
            } else {
                beginBlankRowEl.parentNode.style.display = "none";
            }
        }
        if (this._endBlankRow) {
            let endBlankRowEl = this._endBlankRow;
            let endBlankRow = rowHeightInfos.rows["endBlankRow"];
            if (endBlankRow) {
                endBlankRowEl.firstChild.colSpan = this._cols;
                endBlankRowEl.firstChild.style.height = endBlankRow + "px";
                endBlankRowEl.parentNode.style.display = "";
            } else {
                endBlankRowEl.parentNode.style.display = "none";
            }
        }
        this._itemDomCount = rowHeightInfos.visibleRows;
        this._rowHeightAverage = rowHeightInfos.rowHeightAverage;
        this.startIndex = rowHeightInfos.startIndex;
        this._container.scrollTop = this._scrollTop = scrollInfo.scrollTop;
    }, syncroRowHeight:function(itemId: any) {
        let row = this._itemDomMap[itemId];
        if (!row) {
            return;
        }
        let h = this.grid._rowHeightInfos.rows[itemId];
        if (dorado.Browser.msie && dorado.Browser.version === 8) {
            row.style.height = h + "px";
            $fly(row).toggleClass("fix-row-bug");
        } else {
            row.style.height = h + "px";
        }
    }, setYScrollPos:function(ratio: any) {
        let container = this._container, scrollTop = Math.round((container.scrollHeight - container.clientHeight) * ratio);
        if (scrollTop !== container.scrollTop) {
            container.scrollTop = scrollTop;
            this.onYScroll(container, true);
            dorado.Toolkits.cancelDelayedAction(this._container, "$scrollTimerId");
            this._container.$scrollTimerId = 1;
        }
    }, setScrollingIndicator:function(text: any) {
        let indicator = this.getScrollingIndicator();
        $fly(indicator).text(text).show();
        $DomUtils.placeCenterElement(indicator, this.grid.getDom());
    }, setHoverRow:function(row: any) {
        if (row && row.rowType) {
            row = null;
        }
        row = (row == null) ? null : ((row && row.nodeType) ? row : this._itemDomMap[row]);
        $invokeSuper.call(this, arguments);
        let grid = this.grid;
        if (row && grid._draggable && grid._dragMode !== "control") {
            grid.applyDraggable(row);
        }
        if (grid._domMode !== 2 || grid._processingSetHoverRow) {
            return;
        }
        grid._processingSetHoverRow = true;
        (this === grid._innerGrid ? grid._fixedInnerGrid : grid._innerGrid).setHoverRow(row ? row._itemId : null);
        grid._processingSetHoverRow = false;
    }, showCellEditor:function(column: any) {
        let grid = this.grid;
        let row = this._currentRow;
        if (!row) {
            return;
        }
        if (grid._currentCell) {
            $fly(grid._currentCell).removeClass("current-cell");
        }
        for (let i = 0; i < row.cells.length; i++) {
            let cell = row.cells[i];
            if (cell.colId === column._uniqueId) {
                if (grid._divScroll) {
                    let offset1 = $fly(grid._divScroll).offset(), offset2 = $fly(cell).offset();
                    let t = offset2.top - offset1.top;
                    if ((t + cell.offsetHeight / 2) > grid._divScroll.clientHeight || t < 0) {
                        return;
                    }
                }
                let gridDom = grid.getDom();
                if (gridDom.scrollWidth > gridDom.clientWidth || gridDom.scrollHeight > gridDom.clientHeight) {
                    let offset1 = $fly(gridDom).offset(), offset2 = $fly(cell).offset();
                    let l = offset2.left - offset1.left;
                    if ((l + cell.offsetWidth) > gridDom.clientWidth) {
                        gridDom.scrollLeft -= gridDom.clientWidth - (l + cell.offsetWidth);
                    } else {
                        if (l < 0) {
                            gridDom.scrollLeft += l;
                        }
                    }
                } else {
                    if (grid._divScroll) {
                        let container = this.getDom().parentNode;
                        if (container.scrollWidth > container.clientWidth) {
                            let scrollPos = -1, ratio;
                            if ((cell.offsetLeft + cell.offsetWidth) > (container.scrollLeft + container.clientWidth)) {
                                scrollPos = cell.offsetLeft + cell.offsetWidth - container.clientWidth;
                            } else {
                                if (cell.offsetLeft < container.scrollLeft) {
                                    scrollPos = cell.offsetLeft;
                                }
                            }
                            ratio = scrollPos / (container.scrollWidth - container.clientWidth);
                            if (scrollPos >= 0) {
                                let divScroll = grid._divScroll;
                                divScroll.scrollLeft = ratio * (divScroll.scrollWidth - divScroll.clientWidth);
                            }
                        }
                    }
                }
                grid._currentCell = cell;
                if (grid._highlightCurrentRow) {
                    $fly(cell).addClass("current-cell");
                }
                if (grid._focused && !(column._renderer && column._renderer.preventCellEditing) && grid._editing && grid.shouldEditing(column)) {
                    let currentItem = this.getCurrentItem(), cellEditor;
                    if (currentItem) {
                        cellEditor = grid._currentCellEditor = grid.getCellEditor(column, currentItem);
                    }
                    if (cellEditor) {
                        if (cellEditor.shouldShow()) {
                            cellEditor.show(this, cell);
                        } else {
                            let subCellControl = dorado.widget.findFocusableControlInElement(cell);
                            if (subCellControl) {
                                subCellControl.setFocus();
                            }
                        }
                    } else {
                        let fc = dorado.widget.findFocusableControlInElement(cell);
                        if (fc) {
                            if (!fc.get("focused")) {
                                fc.setFocus();
                            }
                        } else {
                            if (!grid.get("focused")) {
                                grid.setFocus();
                            }
                        }
                    }
                }
                break;
            }
        }
    }, onHeaderMouseMove:function(evt: any) {
        if ($DomUtils.isDragging()) {
            return;
        }
        let grid = this.grid, headerTable = this._headerTable;
        let offset = $fly(headerTable).offset(), action;
        let dataColumns = this._columnsInfo.dataColumns;
        for (let i = 0; i < dataColumns.length; i++) {
            let col = dataColumns[i];
            let headerCell = col.headerCell;
            if (col._resizeable && Math.abs((headerCell.offsetLeft + headerCell.offsetWidth) - (evt.pageX - offset.left)) < 2 && (evt.pageY - offset.top) > getCellOffsetTop(headerCell, grid._headerRowHeight)) {
                action = "resize";
                showColumnResizeHandler(col);
                break;
            }
        }
        if (!action) {
            let headerCell = $DomUtils.findParent(evt.target, function(node: any) {
                return node.nodeName === "TD" && node.parentNode.parentNode.parentNode === headerTable;
            }, true);
            if (headerCell) {
                let column = grid._columnsInfo.idMap[headerCell.colId];
                if (column) {
                    grid.setHoverHeaderColumn(column);
                }
            }
        }
        return !action;
    }, onHeaderMouseLeave:function() {
        if ($DomUtils.isDragging()) {
            return;
        }
        let grid = this.grid;
        grid.setHoverHeaderColumn(null);
        return true;
    }, getSelection:function() {
        if (this.fixed) {
            return this.grid._innerGrid.getSelection();
        } else {
            return $invokeSuper.call(this);
        }
    }, setSelection:function(selection: any) {
        if (this.fixed) {
            this.grid._innerGrid._selection = selection;
        } else {
            this._selection = selection;
        }
    }, toggleItemSelection:function(item: any, selected: any) {
        let grid = this.grid;
        if (!grid._highlightSelectedRow) {
            return;
        }
        $invokeSuper.call(this, arguments);
        if (grid._domMode !== 2 || grid._processingToggleItemSelection) {
            return;
        }
        grid._processingToggleItemSelection = true;
        ((this === grid._fixedInnerGrid) ? grid._innerGrid : grid._fixedInnerGrid).toggleItemSelection(item, selected);
        grid._processingToggleItemSelection = false;
    }});
    function getColumnDragHelper(evt: any, draggableElement: any) {
        let cell = draggableElement;
        let ind = window._dragColIndicator;
        if (!ind) {
            window._dragColIndicator = ind = $DomUtils.xCreate({tagName:"DIV", className:"d-grid-col-drag-helper", style:{position:"absolute", tabIndex:-1}, content:{tagName:"TABLE", style:{width:"100%", height:"100%"}, content:{tagName:"TR", content:"^TD"}}});
            document.body.appendChild(ind);
        }
        if (cell) {
            $fly(ind).outerWidth(cell.offsetWidth).outerHeight(cell.offsetHeight).show().bringToFront();
            $fly(ind).find(">TABLE>TBODY>TR>TD").empty().attr("align", cell.align).append(cell.firstChild.cloneNode(true));
        }
        return ind;
    }
    function showColumnDropIndicator(grid: any, dropPosition: any) {
        if (!dropPosition) {
            hideColumnDropIndicator();
            return;
        }
        let ind = window._colDropIndicator;
        if (!ind) {
            let ind1 = $DomUtils.xCreate({tagName:"DIV", className:"d-grid-col-drag-top", style:{position:"absolute"}});
            let ind2 = $DomUtils.xCreate({tagName:"DIV", className:"d-grid-col-drag-bottom", style:{position:"absolute"}});
            let ind3 = $DomUtils.xCreate({tagName:"DIV", className:"d-grid-col-drop-indicator", style:{width:1, position:"absolute"}});
            document.body.appendChild(ind1);
            document.body.appendChild(ind2);
            document.body.appendChild(ind3);
            window._colDropIndicator = ind = [ind1, ind2, ind3];
        }
        let cacheId = dropPosition.column._uniqueId + dropPosition.before;
        if (cacheId !== window._colDropPosition) {
            window._colDropPosition = cacheId;
            let cell = dropPosition.column.headerCell;
            let offset = $fly(cell).offset();
            let cellOffsetTop = getCellOffsetTop(cell, grid._headerRowHeight);
            offset.top = $fly(cell.offsetParent).offset().top + cellOffsetTop;
            let arrowHeight = $setting["GridColDropIndicatorSize"] || 9;
            $fly(ind[0]).top(offset.top - arrowHeight);
            let top2 = $fly(cell.offsetParent).offset().top + cell.offsetParent.offsetHeight;
            $fly(ind[1]).top(top2);
            let widthAdj = dropPosition.before ? 0 : cell.offsetWidth;
            $fly([ind[0], ind[1]]).left(offset.left - 1 + widthAdj - parseInt(arrowHeight / 2));
            $fly(ind[2]).position(offset.left - 1 + widthAdj - parseInt(ind[2].offsetWidth / 2), offset.top).height(top2 - offset.top);
            if (ind[0].parentNode !== document.body) {
                document.body.appendChild(ind[0]);
                document.body.appendChild(ind[1]);
                document.body.appendChild(ind[2]);
            }
            $fly(ind).show().bringToFront();
        }
    }
    function hideColumnDropIndicator() {
        window._colDropPosition = undefined;
        let ind = window._colDropIndicator;
        if (ind) {
            $fly(ind).hide();
        }
    }
    function showColumnResizeHandler(column: any) {
        let handler = window._colResizingHanlder, minSize = 5;
        if (!handler) {
            window._colResizingHanlder = handler = $DomUtils.xCreate({tagName:"DIV", className:"d-grid-col-resize-handler", style:{position:"absolute", width:6, tabIndex:-1}, onmouseleave:function() {
                $fly(handler).hide();
            }});
            document.body.appendChild(handler);
            $DomUtils.disableUserSelection(handler);
            $fly(handler).draggable({distence:3, helper:getColumnResizeHelper, axis:"x", start:function(evt: any, ui: any) {
                let column = $fly(handler).data("column");
                let grid = column.get("grid");
                if (grid._currentCellEditor) {
                    grid.hideCellEditor();
                    dorado.widget.onControlGainedFocus(grid);
                }
                let cell = column.headerCell;
                let tableOffset = $fly(cell.offsetParent).offset();
                let cellOffsetTop = getCellOffsetTop(cell, grid._headerRowHeight);
                let cellOffset = $fly(cell).offset();
                cellOffset.top = tableOffset.top + cellOffsetTop;
                this._originLeft = cellOffset.left;
                this._originWidth = evt.pageX - cellOffset.left;
                let height = ((grid._domMode === 0) ? (grid.getDom()) : (grid._divScroll)).clientHeight - cellOffsetTop;
                ui.helper.show().bringToFront().position(this._originLeft, cellOffset.top).height(height);
            }, drag:function(evt: any, ui: any) {
                ui.position.left = this._originLeft;
                if (evt.pageX - this._originLeft > minSize) {
                    ui.helper.width(evt.pageX - this._originLeft);
                }
            }, stop:function(evt: any, ui: any) {
                let width = evt.pageX - this._originLeft;
                if (width < minSize) {
                    width = minSize;
                }
                if (width !== this._originWidth) {
                    let column = $fly(handler).data("column");
                    let grid = column.get("grid");
                    column._realWidth = column._width = column._realWidth + (width - this._originWidth);
                    grid._ignoreItemTimestamp = true;
                    grid.stretchColumnsToFit();
                    grid.refresh();
                }
                return true;
            }});
        }
        let columnCell = column.headerCell, $columnCell = $fly(columnCell);
        let offset = $columnCell.offset();
        $fly(handler).data("column", column).bringToFront().top(offset.top).left(offset.left + columnCell.offsetWidth - 3).height(columnCell.offsetHeight).show();
        return handler;
    }
    function hideColumnResizeHandler() {
        let handler = window._colResizingHanlder;
        if (handler) {
            $fly(handler).hide();
        }
    }
    function getColumnResizeHelper() {
        if (!window._colResizeHelper) {
            window._colResizeHelper = $fly(document.body).xCreate({tagName:"DIV", style:{position:"absolute"}, content:{tagName:"DIV", className:"d-grid-col-resize-helper", style:{height:"100%"}}}, null, {returnNewElements:true});
        }
        return window._colResizeHelper;
    }
})();
(function() {
    let operatorItemsInited = false;
    let operators = ["like", "like*", "*like", "=", "<>", ">", ">=", "<", "<="], operatorsForParse = ["like", "like*", "*like", "=", ">", ">=", "<", "<=", "<>"];
    let operatorItems = [];
    function getOperatorItems() {
        if (!operatorItemsInited) {
            operatorItemsInited = true;
            let texts = $resource("dorado.grid.FilterExpressionOperators").split(",");
            for (let i = 0; i < operators.length; i++) {
                let operator = operators[i];
                operatorItems.push({key:operator, value:texts[i]});
            }
        }
        return operatorItems;
    }
    let numberTypeCodes = [dorado.DataType.INTEGER, dorado.DataType.PRIMITIVE_INT, dorado.DataType.FLOAT, dorado.DataType.PRIMITIVE_FLOAT, dorado.DataType.DATE, dorado.DataType.TIME, dorado.DataType.DATETIME];
    let mappingOperatorDropDown, numberOperatorDropDown, stringOperatorDropDown, booleanOperatorDropDow;
    function getOperatorDropDown(column: any) {
        let dropDown, operatorItems = getOperatorItems();
        let pd = column._propertyDef;
        if (pd && pd._mapping) {
            if (!mappingOperatorDropDown) {
                mappingOperatorDropDown = new dorado.widget.ListDropDown({items:operatorItems.slice(3, 5), property:"key", displayProperty:"value", autoOpen:true});
            }
            dropDown = mappingOperatorDropDown;
        } else {
            let dataType = column.get("dataType");
            if (dataType && dataType._code) {
                if (numberTypeCodes.indexOf(dataType._code) >= 0) {
                    if (!numberOperatorDropDown) {
                        numberOperatorDropDown = new dorado.widget.ListDropDown({items:operatorItems.slice(3), property:"key", displayProperty:"value", autoOpen:true});
                    }
                    dropDown = numberOperatorDropDown;
                } else {
                    if ([dorado.DataType.PRIMITIVE_BOOLEAN, dorado.DataType.BOOLEAN].indexOf(dataType._code) >= 0) {
                        if (!booleanOperatorDropDow) {
                            booleanOperatorDropDow = new dorado.widget.ListDropDown({items:operatorItems.slice(3, 5), property:"key", displayProperty:"value", autoOpen:true});
                        }
                        dropDown = booleanOperatorDropDow;
                    }
                }
            }
            if (!dropDown) {
                stringOperatorDropDown = new dorado.widget.ListDropDown({items:operatorItems.slice(0, 5), property:"key", displayProperty:"value", autoOpen:true});
                dropDown = stringOperatorDropDown;
            }
        }
        return dropDown;
    }
    let booleanMapping;
    function getBooleanMapping() {
        if (!booleanMapping) {
            booleanMapping = [{key:true, value:$resource("dorado.core.BooleanTrue")}, {key:false, value:$resource("dorado.core.BooleanFalse")}];
        }
        return booleanMapping;
    }
    function splitCriterions(text: any, column: any) {
        let criterions = [], criterion = "", contentBegin = false, contentEnd = false, inQuote = false, escape = false;
        let c;
        for (let i = 0, len = text.length; i < len; i++, escape = false) {
            c = text.charAt(i);
            if (c === "," || c === ";") {
                if (contentBegin) {
                    if (!inQuote) {
                        if (operators.indexOf(criterion) < 0) {
                            criterions.push(criterion);
                            criterion = "";
                            contentBegin = false;
                            contentEnd = false;
                            inQuote = false;
                        }
                        continue;
                    }
                } else {
                    continue;
                }
            } else {
                if (c === "\\") {
                    escape = true;
                } else {
                    if ((c === "'" || c === "\"") && !escape) {
                        if (!inQuote) {
                            inQuote = c;
                            continue;
                        } else {
                            if (c === inQuote) {
                                contentEnd = true;
                                inQuote = null;
                                continue;
                            }
                        }
                    } else {
                        if (contentEnd) {
                            throw new dorado.ResourceException("dorado.grid.InvalidFilterExpression", text);
                        }
                    }
                }
            }
            criterion += c;
            contentBegin = true;
        }
        if (criterion) {
            criterions.push(criterion);
        }
        return criterions;
    }
    function parseSingleCriterion(criterionText: any, column: any) {
        let criterion = {};
        for (let i = operatorsForParse.length - 1; i >= 0; i--) {
            let operator = operatorsForParse[i];
            if (criterionText.startsWith(operator)) {
                criterion.operator = operator;
                criterion.value = criterionText.substring(operator.length);
                break;
            }
        }
        if (!criterion.operator) {
            let defaultOperator = dorado.widget.grid.DataColumn.getDefaultOperator(column), len = criterionText.length;
            if (len > 1) {
                let firstChar = criterionText.charAt(0), lastChar = criterionText.charAt(len - 1);
                if (len > 2 && criterionText.charAt(len - 2) === "\\") {
                    lastChar = 0;
                }
                if (firstChar !== "*" && firstChar !== "%") {
                    firstChar = 0;
                }
                if (lastChar !== "*" && lastChar !== "%") {
                    lastChar = 0;
                }
                if (firstChar) {
                    if (lastChar) {
                        if (len > 2) {
                            criterion.operator = "like";
                            criterion.value = criterionText.substring(1, len - 1);
                        } else {
                            criterion.operator = "=";
                            criterion.value = criterionText;
                        }
                    } else {
                        criterion.operator = "*like";
                        criterion.value = criterionText.substring(1);
                    }
                } else {
                    if (lastChar) {
                        criterion.operator = "like*";
                        criterion.value = criterionText.substring(0, len - 1);
                    }
                }
            }
            if (!criterion.operator) {
                criterion.operator = defaultOperator;
                criterion.value = criterionText;
            }
        }
        criterion.property = column._property;
        if (criterion.value && criterion.value.indexOf("\\") >= 0) {
            try {
                criterion.value = JSON.parse("\"" + criterion.value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\"");
            } catch(e) { /* keep original value if JSON.parse fails */
                console.log(e);
                console.log(`Invalid criterion value: ${criterion.value}`);
            }
        }
        let pd = column._propertyDef;
        if (pd) {
            criterion.propertyPath = pd._propertyPath;
            if (pd._mapping) {
                criterion.value = pd.getMappedKey(criterion.value);
            }
        }
        let dataType = column.get("dataType");
        if (dataType) {
            criterion.value = dataType.parse(criterion.value, column.get("displayFormat"));
        }
        return criterion;
    }
    dorado.widget.grid.DataColumn.getDefaultOperator = function(column: any) {
        if (column._defaultFilterOperator) {
            return column._defaultFilterOperator;
        }
        let dataType = column.get("dataType"), pd = column._propertyDef;
        if (pd && pd._mapping || dataType && (dataType._code && numberTypeCodes.indexOf(dataType._code) >= 0 || [dorado.DataType.PRIMITIVE_BOOLEAN, dorado.DataType.BOOLEAN].indexOf(dataType._code) >= 0)) {
            return "=";
        } else {
            return "like";
        }
    };
    dorado.widget.grid.DataColumn.parseCriterion = function(text: any, column: any) {
        function parseCriterions(text: any, column: any) {
            let criterions = [], criterionTexts = splitCriterions(text, column);
            for (let i = 0; i < criterionTexts.length; i++) {
                criterions.push(parseSingleCriterion(jQuery.trim(criterionTexts[i]), column));
            }
            return criterions;
        }
        text = jQuery.trim(text);
        if (!text) {
            return null;
        }
        let criterion = {};
        if (text.charAt(0) === "[" && text.charAt(text.length - 1) === "]") {
            criterion.junction = "or";
            text = text.substring(1, text.length - 1);
        } else {
            criterion.junction = "and";
        }
        criterion.criterions = parseCriterions(text, column);
        return criterion;
    };
    dorado.widget.grid.DataColumn.criterionToText = function(criterion: any, column: any) {
        function criterionsToText(criterions: any, column: any) {
            let text = "", pd = column._propertyDef, dataType = column.get("dataType");
            let defaultOperator = dorado.widget.grid.DataColumn.getDefaultOperator(column);
            for (let i = 0; i < criterions.length; i++) {
                let criterion = criterions[i], operator = criterion.operator;
                if (!criterion.value && criterion.value !== 0) {
                    continue;
                }
                if (text !== "") {
                    text += ", ";
                }
                if (operator && operator !== defaultOperator && operator.indexOf("like") < 0) {
                    text += operator;
                }
                let valueText;
                if (pd && pd._mapping) {
                    valueText = pd.getMappedValue(criterion.value);
                } else {
                    let dataType = column.get("dataType");
                    if (dataType) {
                        valueText = dataType.toText(criterion.value, column.get("typeFormat"));
                    } else {
                        valueText = criterion.value + "";
                    }
                }
                if (operator && operator !== defaultOperator) {
                    if (operator.startsWith("like")) {
                        valueText = valueText + "*";
                    }
                    if (operator.endsWith("like")) {
                        valueText = "*" + valueText;
                    }
                }
                if (typeof valueText === "string" && (valueText.indexOf(",") >= 0 || valueText.indexOf(";") >= 0)) {
                    text += ("\"" + valueText + "\"");
                } else {
                    text += valueText;
                }
            }
            return text;
        }
        if (!criterion) {
            return null;
        }
        let text = "";
        if (criterion.junction === "or") {
            text += "[ ";
        }
        text += criterionsToText(criterion.criterions, column);
        if (criterion.junction === "or") {
            text += " ]";
        }
        return text;
    };
    dorado.widget.grid.CriterionDropDown = $extend(dorado.widget.DropDown, {$className:"dorado.widget.grid.CriterionDropDown", ATTRIBUTES:{maxWidth:{defaultValue:330}, supportsMultiCriterions:{defaultValue:true}, supportsJunction:{defaultValue:true}, avialableOperators:{}, criterion:{defaultValue:[], setter:function(criterion: any) {
        criterion = criterion || {};
        criterion = this._criterion = dorado.Core.clone(criterion, true);
        if (!criterion.criterions) {
            criterion.criterions = [];
        }
        let criterions = criterion.criterions;
        for (let i = 0; i < criterions.length; i++) {
            let c = criterions[i];
            if (!c.id) {
                c.id = dorado.Core.newId();
            }
        }
    }}}, constructor:function() {
        this._criterionMap = {};
        this._criterionControlCache = [];
        $invokeSuper.call(this, arguments);
    }, destroy:function() {
        for (let i = 0; i < this._criterionControlCache.length; i++) {
            let criterionControl = this._criterionControlCache[i];
            if (!criterionControl._destroyed) {
                criterionControl.destroy();
            }
        }
        $invokeSuper.call(this);
    }, createDropDownBox:function() {
        let dropdown = this, box = $invokeSuper.call(dropdown, arguments);
        box._dropDown = dropdown;
        let containerElement = box.get("containerDom"), doms = {};
        $fly(containerElement).xCreate({tagName:"DIV", className:"d-criterion-panel", content:[{tagName:"DIV", contextKey:"criterionsContainer"}, {tagName:"TABLE", style:{width:"100%"}, content:{tagName:"TR", content:[{tagName:"TD", contextKey:"junctionContainer"}, {tagName:"TD", className:"d-buttons-container", contextKey:"buttonsContainer", style:{width:150}}]}}]}, null, {context:doms});
        dropdown._criterionsContainer = doms.criterionsContainer;
        if (dropdown._supportsJunction && dropdown._supportsMultiCriterions) {
            let junctionRadio = new dorado.widget.RadioGroup({value:"and", radioButtons:[{value:"and", text:$resource("dorado.core.And")}, {value:"or", text:$resource("dorado.core.Or")}], onPost:function(self: any) {
                dropdown._criterion.junction = self.get("value");
            }});
            box.registerInnerControl(junctionRadio);
            junctionRadio.render(doms.junctionContainer);
            dropdown._junctionRadio = junctionRadio;
        }
        if (this._supportsMultiCriterions) {
            let addButton = new dorado.widget.Button({iconClass:"d-icon-add", style:"margin-right:2px", onClick:function() {
                dropdown.addCriterion(box);
            }});
            box.registerInnerControl(addButton);
            addButton.render(doms.buttonsContainer);
        }
        let okButton = new dorado.widget.Button({caption:$resource("dorado.baseWidget.MessageBoxButtonOK"), onClick:function() {
            let editor = dropdown._editor, column = editor._cellColumn, criterion = dropdown._criterion, grid = column._grid;
            let text = dorado.widget.grid.DataColumn.criterionToText(criterion, column);
            dropdown.close(text);
            grid.filter();
        }});
        box.registerInnerControl(okButton);
        okButton.render(doms.buttonsContainer);
        return box;
    }, open:function(editor: any) {
        editor.post();
        let column = editor._cellColumn, grid = column._grid;
        let filterEntity = grid.get("filterEntity");
        let criterion = filterEntity.get(column._property);
        if (criterion && criterion instanceof Array) {
            criterion = {junction:"and", criterions:criterion};
        }
        this.set("criterion", criterion);
        return $invokeSuper.call(this, arguments);
    }, initDropDownBox:function(box: any, editor: any) {
        $invokeSuper.call(this, arguments);
        let dropdown = this, criterion = dropdown._criterion, criterions = criterion.criterions, criterionsContainer = dropdown._criterionsContainer, i = 0;
        let column = editor._cellColumn;
        if (criterions.length === 0) {
            criterions.push({id:dorado.Core.newId(), operator:dorado.widget.grid.DataColumn.getDefaultOperator(column)});
        }
        criterions.each(function(criterion: any) {
            let criterionControl, criterionDom = criterionsContainer.childNodes[i];
            if (criterionDom) {
                criterionControl = dorado.widget.Control.findParentControl(criterionDom, CriterionControl);
            }
            if (criterionControl) {
                criterionControl.set({column:column, criterion:criterion});
            } else {
                criterionControl = dropdown.getCriterionControl(box, criterion);
                criterionControl.render(dropdown._criterionsContainer);
            }
            dropdown._criterionMap[criterion.id] = criterionControl;
            i++;
        });
        let criterionControls = criterionsContainer.childNodes, criterionControlsNum = criterionControls.length;
        for (; i < criterionControlsNum; i++) {
            let criterionControl = dorado.widget.Control.findParentControl(criterionsContainer.lastChild, CriterionControl);
            let criterion = criterionControl._criterion;
            delete dropdown._criterionMap[criterion.id];
            criterionControl.unrender();
            dropdown._criterionControlCache.push(criterionControl);
        }
        if (dropdown._junctionRadio) {
            dropdown._junctionRadio.set("value", criterion.junction || "and");
        }
    }, getCriterionControl:function(box: any, criterion: any) {
        let criterionControl = this._criterionControlCache.pop();
        if (!criterionControl) {
            criterionControl = new CriterionControl(this, box);
        }
        let column = box._editor._cellColumn;
        criterionControl.set({column:column, criterion:criterion});
        return criterionControl;
    }, addCriterion:function(box: any) {
        let dropdown = this, column = box._editor._cellColumn, criterion = {id:dorado.Core.newId(), operator:dorado.widget.grid.DataColumn.getDefaultOperator(column)};
        let criterionControl = dropdown.getCriterionControl(box, criterion);
        criterionControl.render(dropdown._criterionsContainer);
        dropdown._criterionMap[criterion.id] = criterionControl;
        dropdown._criterion.criterions.push(criterion);
        dropdown.locate();
    }, removeCriterion:function(box: any, criterion: any) {
        let dropdown = this, criterionControl = dropdown._criterionMap[criterion.id];
        criterionControl.unrender();
        dropdown._criterionControlCache.push(criterionControl);
        delete dropdown._criterionMap[criterion.id];
        dropdown._criterion.criterions.remove(criterion);
        dropdown.locate();
        setTimeout(function() {
            if (dropdown._criterion.criterions.length === 0) {
                dropdown.addCriterion(box);
            }
        }, 100);
    }});
    let CriterionControl = $extend(dorado.widget.Control, {$className:"dorado.widget.grid.CriterionControl", ATTRIBUTES:{column:{}, criterion:{}}, constructor:function(dropDown: any, dropDownBox: any) {
        $invokeSuper.call(this);
        this._dropDown = dropDown;
        this._dropDownBox = dropDownBox;
        dropDownBox.registerInnerControl(this);
    }, createDom:function() {
        let criterionControl = this, doms = {}, dom = $DomUtils.xCreate({tagName:"TABLE", className:"d-criterion", content:{tagName:"TR", content:[{tagName:"TD", className:"operator-container", contextKey:"operatorContainer"}, {tagName:"TD", className:"value-container", contextKey:"valueContainer"}, {tagName:"TD", className:"button-container", contextKey:"buttonContainer"}]}}, null, doms);
        let dropDownBox = criterionControl._dropDownBox;
        let operatorEditor = criterionControl._operatorEditor = new dorado.widget.TextEditor({width:100, mapping:getOperatorItems(), onPost:function(self: any) {
            criterionControl._criterion.operator = self.get("value");
        }});
        criterionControl.registerInnerControl(operatorEditor);
        operatorEditor.render(doms.operatorContainer);
        let valueEditor = criterionControl._valueEditor = new dorado.widget.TextEditor({width:180, onPost:function(self: any) {
            criterionControl._criterion.value = self.get("value");
        }});
        criterionControl.registerInnerControl(valueEditor);
        valueEditor.render(doms.valueContainer);
        let delButton = criterionControl._delButton = new dorado.widget.SimpleButton({className:"delete-button", onClick:function() {
            let dropdown = criterionControl._dropDown, criterion = criterionControl._criterion;
            dropdown.removeCriterion(dropDownBox, criterion);
        }});
        criterionControl.registerInnerControl(delButton);
        delButton.render(doms.buttonContainer);
        this._doms = doms;
        return dom;
    }, refreshDom:function(dom: any) {
        $invokeSuper.call(this, [dom]);
        let column = this._column, pd = column._propertyDef;
        let dataType = column.get("dataType"), dtCode = dataType ? dataType._code : -1;
        let trigger = column.get("trigger"), mapping = null, displayFormat = column.get("displayFormat"), typeFormat = column.get("typeFormat");
        if (!dtCode || (pd && pd._mapping)) {
            dataType = undefined;
        }
        let operatorEditor = this._operatorEditor, valueEditor = this._valueEditor, doms = this._doms;
        let operatorDropDown = getOperatorDropDown(column);
        if (this._avialableOperators) {
            let operatorItems = operatorDropDown.get("items"), newItems = [];
            for (let i = 0; i < operatorItems.length; i++) {
                let operatorItem = operatorItems[i];
                if (this._avialableOperators.indexOf(operatorItem.key) >= 0) {
                    newItems.push(operatorItem);
                }
            }
            operatorDropDown = this._operatorDropDown;
            if (!operatorDropDown) {
                this._operatorDropDown = operatorDropDown = new dorado.widget.ListDropDown({items:newItems, property:"key", displayProperty:"value", autoOpen:true});
            }
        }
        operatorEditor.set({trigger:operatorDropDown, value:this._criterion && this._criterion.operator});
        if (!trigger) {
            if (pd && pd._mapping) {
                trigger = "autoMappingDropDown2";
                mapping = pd._mapping;
            } else {
                if (dtCode === dorado.DataType.PRIMITIVE_BOOLEAN) {
                    trigger = "autoOpenMappingDropDown1";
                    mapping = getBooleanMapping();
                } else {
                    if (dtCode === dorado.DataType.BOOLEAN) {
                        trigger = "autoOpenMappingDropDown2";
                        mapping = getBooleanMapping();
                    } else {
                        if (dtCode === dorado.DataType.DATE) {
                            trigger = "defaultDateDropDown";
                        } else {
                            if (dtCode === dorado.DataType.DATETIME) {
                                trigger = "defaultDateTimeDropDown";
                            }
                        }
                    }
                }
            }
        } else {
            if (pd && pd._mapping) {
                mapping = pd._mapping;
            }
        }
        valueEditor.set({dataType:dataType || null, displayFormat:displayFormat, typeFormat:typeFormat, trigger:trigger, mapping:mapping, editable:column._editable}, {skipUnknownAttribute:true, tryNextOnError:true});
        valueEditor.set("value", this._criterion && this._criterion.value);
    }});
    dorado.widget.View.registerDefaultComponent("defaultCriterionDropDown", function() {
        return new dorado.widget.grid.CriterionDropDown();
    });
})();
(function() {
    dorado.widget.Grid = $extend(dorado.widget.AbstractGrid, {$className:"dorado.widget.Grid", ATTRIBUTES:{currentIndex:{skipRefresh:true, getter:function(p: any) {
        return (this._domMode === 2 ? this._fixedInnerGrid : this._innerGrid).get(p);
    }, setter:function(index: any, p: any) {
        if (!this._ready) {
            return;
        }
        if (index >= this._itemModel.getItemCount()) {
            index = -1;
        }
        (this._domMode === 2 ? this._fixedInnerGrid : this._innerGrid).set(p, index);
    }}, currentEntity:{readOnly:true, getter:function() {
        return this._innerGrid.getCurrentItem(0);
    }}, items:{setter:function(items: any) {
        this.set("selection", null);
        this._itemModel.setItems(items);
    }, getter:function() {
        return this._itemModel.getItems();
    }}, groupProperty:{setter:function(v: any) {
        if (this._groupProperty === v) {
            return;
        }
        this.set("currentIndex", -1);
        $invokeSuper.call(this, arguments);
    }}}, createInnerGrid:function(fixed: any) {
        return new dorado.widget.grid.InnerGrid(this, fixed);
    }, refreshDom:function(dom: any) {
        $invokeSuper.call(this, arguments);
        let currentIndex = this._currentIndex;
        if (currentIndex < 0 && !this._allowNoCurrent && this._itemModel.getItemCount()) {
            currentIndex = 0;
        }
        this.set("currentIndex", currentIndex);
    }, _doOnKeyDown:function(evt: any) {
        let retValue = true;
        let items = this._itemModel.getItems();
        let index;
        switch (evt.keyCode) {
          case 36:
            if (evt.ctrlKey) {
                this.set("currentIndex", 0);
            } else {
                this.setCurrentColumn(this._columnsInfo.dataColumns[0]);
            }
            break;
          case 35:
            if (evt.ctrlKey) {
                this.set("currentIndex", this._itemModel.getItemCount() - 1);
            } else {
                let columns = this._columnsInfo.dataColumns;
                this.setCurrentColumn(columns[columns.length - 1]);
            }
            break;
          case 38:
            index = this.get("currentIndex");
            if (index > 0) {
                this.set("currentIndex", index - 1);
            }
            retValue = false;
            break;
          case 40:
            index = this.get("currentIndex");
            if (index < this._itemModel.getItemCount() - 1) {
                this.set("currentIndex", index + 1);
            }
            retValue = false;
            break;
          case 13:
            retValue = false;
            let columns = this._columnsInfo.dataColumns, i;
            if (this._currentColumn) {
                i = columns.indexOf(this._currentColumn) || 0;
                if (evt.shiftKey) {
                    if (i > 0) {
                        i--;
                    } else {
                        let index = this.get("currentIndex");
                        if (index > 0) {
                            this.set("currentIndex", index - 1);
                            i = columns.length - 1;
                        } else {
                            retValue = true;
                        }
                    }
                } else {
                    if (i < columns.length - 1) {
                        i++;
                    } else {
                        let index = this.get("currentIndex");
                        if (index < this._itemModel.getItemCount() - 1) {
                            this.set("currentIndex", index + 1);
                            i = 0;
                        } else {
                            retValue = true;
                        }
                    }
                }
            } else {
                i = evt.shiftKey ? (columns.length - 1) : 0;
            }
            this.setCurrentColumn(columns[i]);
            break;
        }
        return retValue;
    }, refreshEntity:function(entity: any) {
        if (!this._rendered) {
            return;
        }
        let itemId = this._itemModel.getItemId(entity), row, innerGrid;
        if (this._domMode === 2) {
            innerGrid = this._fixedInnerGrid;
            row = innerGrid._itemDomMap[itemId];
            if (row) {
                innerGrid.refreshItemDomData(row, entity);
            }
        }
        innerGrid = this._innerGrid;
        row = innerGrid._itemDomMap[itemId];
        if (row) {
            innerGrid.refreshItemDomData(row, entity);
        }
    }, onCellValueEdit:function(entity: any, column: any) {
        this.refreshEntity(entity);
        if (!entity.rowType) {
            this.onEntityChanged(entity, column._property);
        }
        this.refreshSummary();
        $invokeSuper.call(this, arguments);
    }, sort:function(column: any, desc: any) {
        $invokeSuper.call(this, arguments);
        this.refresh();
    }, highlightItem:function(entity: any, options: any, speed: any) {
        if (typeof entity === "number") {
            entity = this._itemModel.getItemAt(entity);
        }
        $invokeSuper.call(this, [entity, options, speed]);
    }});
    let ListBoxPrototype = dorado.widget.ListBox.prototype;
    dorado.widget.grid.InnerGrid = $extend(dorado.widget.grid.AbstractInnerGrid, {$className:"dorado.widget.grid.InnerGrid", ATTRIBUTES:{currentIndex:{skipRefresh:true, setter:function(index: any) {
        if (this._currentIndex === index) {
            return;
        }
        if (this._rendered && this._itemDomMap) {
            let itemModel = this._itemModel, item = itemModel.getItemAt(index);
            if (item && item.rowType) {
                return;
            }
        }
        ListBoxPrototype.ATTRIBUTES.currentIndex.setter.apply(this, arguments);
        this.grid.doInnerGridSetCurrentRow(this, index);
    }}}, getCurrentItem:ListBoxPrototype.getCurrentItem, setCurrentItemDom:ListBoxPrototype.setCurrentItemDom, getCurrentItemId:ListBoxPrototype.getCurrentItemId, refreshItemDom:ListBoxPrototype.refreshItemDom, getItemDomByItemIndex:ListBoxPrototype.getItemDomByItemIndex, setCurrentRowByItemId:function(itemId: any) {
        if (this._currentIndex !== itemId) {
            this.set("currentIndex", itemId);
        }
    }});
})();
(function() {
    let ItemModel = $extend(dorado.widget.grid.ItemModel, {resetFilterEntityOnSetItem:false, getItemCount:function() {
        let items = this._items;
        if (!items) {
            return 0;
        }
        if (this.groups || this._items instanceof Array) {
            return $invokeSuper.call(this, arguments);
        } else {
            if (!(items.pageSize > 0)) {
                return items.entityCount;
            } else {
                if (this.grid._supportsPaging || items.entityCount < items.pageSize) {
                    return items.entityCount;
                } else {
                    return items.pageSize;
                }
            }
        }
    }, getItemId:function(item: any, index: any) {
        if (this.filtered) {
            return item.entityId;
        } else {
            return $invokeSuper.call(this, arguments);
        }
    }, getItemById:function(itemId: any) {
        if (this.filtered) {
            return this._originItems.getById(itemId);
        } else {
            return $invokeSuper.call(this, arguments);
        }
    }, iterator:function(startIndex: any) {
        if (!this._items) {
            return this.EMPTY_ITERATOR;
        }
        if (this.groups || this._items instanceof Array) {
            return $invokeSuper.call(this, arguments);
        } else {
            return this._items.iterator({simulateUnloadPage:this.grid._supportsPaging, currentPage:!this.grid._supportsPaging, nextIndex:startIndex || this._startIndex || 0});
        }
    }, getItemAt:function(index: any) {
        if (!this._items || !(index >= 0)) {
            return null;
        }
        if (this.groups || this._items instanceof Array) {
            return $invokeSuper.call(this, arguments);
        } else {
            return this._items.iterator({simulateUnloadPage:this.grid._supportsPaging, currentPage:!this.grid._supportsPaging, nextIndex:index}).next();
        }
    }, getItemIndex:function(item: any) {
        if (!item || item.dummy) {
            return -1;
        }
        if (this.groups || this._items instanceof Array) {
            return $invokeSuper.call(this, arguments);
        } else {
            let entityList = this._items, itemId, page;
            if (item instanceof dorado.Entity) {
                itemId = item.entityId;
                page = item.page;
            } else {
                itemId = item;
                item = entityList.getById(itemId);
                if (item) {
                    page = item.page;
                }
            }
            if (!page || page.entityList !== entityList) {
                return -1;
            }
            let index = 0, entry = page.first, found = false;
            while (entry != null) {
                if (entry.data.entityId === itemId) {
                    found = true;
                    break;
                }
                if (entry.data.state !== dorado.Entity.STATE_DELETED) {
                    index++;
                }
                entry = entry.next;
            }
            if (found) {
                if (this.grid._supportsPaging) {
                    for (let i = page.pageNo - 1; i > 0; i--) {
                        index += entityList.getPage(i, false).entityCount;
                    }
                }
                return index;
            } else {
                return -1;
            }
        }
    }});
    dorado.widget.DataGrid = $extend([dorado.widget.AbstractGrid, dorado.widget.DataControl], {$className:"dorado.widget.DataGrid", ATTRIBUTES:{autoCreateColumns:{defaultValue:true}, supportsPaging:{}, appendOnLastEnter:{}, filterMode:{defaultValue:"clientSide"}, sortMode:{defaultValue:"clientSide"}, rowSelectionProperty:{skipRefresh:true, wirteBeforeReady:true}, currentEntity:{readOnly:true, getter:function() {
        return this.getCurrentEntity();
    }}}, createItemModel:function() {
        return new ItemModel(this);
    }, createInnerGrid:function(fixed: any) {
        return new dorado.widget.grid.InnerDataGrid(this, fixed);
    }, setCurrentEntity:function(entity: any) {
        let retValue = this._innerGrid.setCurrentEntity(entity);
        if (this._domMode === 2) {
            this._fixedInnerGrid.setCurrentEntity(entity);
        }
        return retValue;
    }, getCurrentEntity:function() {
        return this._innerGrid.getCurrentItem();
    }, addColumn:function() {
        let column = $invokeSuper.call(this, arguments);
        if (this._autoCreateColumns && (column instanceof dorado.widget.grid.DataColumn && column._property && column._property !== "none" || column instanceof dorado.widget.grid.ColumnGroup)) {
            let watcher = this.getAttributeWatcher();
            if (watcher.getWritingTimes("autoCreateColumns") === 0) {
                this._autoCreateColumns = false;
            }
        }
        return column;
    }, initColumns:function(dataType: any) {
        function doInitColumns(cols: any, dataType: any) {
            for (let i = 0; i < cols.length; i++) {
                let col = cols[i];
                if (col instanceof dorado.widget.grid.ColumnGroup) {
                    doInitColumns(col._columns.items, dataType);
                } else {
                    if (col._propertyPath) {
                        let subDataType = col._propertyPath.getDataType(dataType);
                        col._propertyDef = (subDataType) ? subDataType.getPropertyDef(col._subProperty) : null;
                    } else {
                        col._propertyDef = (col._property) ? dataType.getPropertyDef(col._property) : null;
                    }
                }
                if (!col._align && col._propertyDef) {
                    let dt = col._propertyDef.get("dataType");
                    if (dt && dt._code >= dorado.DataType.PRIMITIVE_INT && dt._code <= dorado.DataType.FLOAT) {
                        col.set("align", "right");
                    }
                }
            }
        }
        if (dataType && (this._dataType !== dataType || !this._columnInited)) {
            this._columnInited = true;
            this._dataType = dataType;
            if (dataType) {
                let columns = this._columns;
                if (this._autoCreateColumns && !this._defaultColumnsGenerated) {
                    this._defaultColumnsGenerated = true;
                    let self = this, columnsClear = false;
                    dataType._propertyDefs.each(function(pd: any) {
                        if (!pd._visible) {
                            return;
                        }
                        let column = columns.get(pd._name), columnConfig = {};
                        if (column) {
                            columns.remove(column);
                            columns.append(column);
                        }
                        let t = pd.getDataType(true);
                        if (t && (!t._code || !(t instanceof dorado.DataType))) {
                            return;
                        }
                        columnConfig.name = columnConfig.property = pd._name;
                        if (column) {
                            column.set(columnConfig, {tryNextOnError:true, preventOverwriting:true});
                        } else {
                            if (!columnsClear && columns.size === 1 && columns.get(0)._name === "empty") {
                                columns.clear();
                                columnsClear = true;
                            }
                            self.addColumn(new dorado.widget.grid.DataColumn(columnConfig));
                        }
                    });
                }
                doInitColumns(columns.items, dataType);
            }
        }
    }, refreshDom:function(dom: any) {
        let columnsInited = false;
        if (this._dataSet) {
            let entityList = this.getBindingData({firstResultOnly:true, acceptAggregation:true});
            if (entityList) {
                if (!(entityList instanceof dorado.EntityList)) {
                    throw new dorado.ResourceException("dorado.grid.BindingTypeMismatch", (this._id || this._uniqueId));
                }
            }
            let dataType;
            if (entityList && entityList.dataType) {
                dataType = entityList.dataType.getElementDataType("auto");
            }
            if (!dataType) {
                dataType = this.getBindingDataType("auto");
            }
            if (dataType) {
                this.initColumns(dataType);
                columnsInited = true;
            } else {
                if (this._autoCreateColumns && !this._listeningDataTypeRepository) {
                    this._columnInited = false;
                    this._listeningDataTypeRepository = true;
                    let grid = this;
                    this.get("dataTypeRepository").bind("onDataTypeRegister", function(self: any, arg: any) {
                        let dataType = grid.getBindingDataType("never");
                        if (dataType && dataType instanceof dorado.EntityDataType) {
                            self.unbind("onDataTypeRegister", arguments.callee);
                            grid._autoCreateColumns = true;
                            grid._listeningDataTypeRepository = false;
                            grid.initColumns(dataType);
                            grid.refresh(true);
                        }
                    });
                }
            }
            let oldItems = this._itemModel.getOriginItems();
            if (oldItems !== entityList || (entityList && (entityList.pageNo !== this._selectionPageNo || entityList.pageSize !== this._selectionPageSize))) {
                this._selectionPageNo = entityList ? entityList.pageNo : 0;
                this._selectionPageSize = entityList ? entityList.pageSize : 0;
                if (this._itemModel.criterions && this._filterMode === "clientSide") {
                    this.get("filterEntity").clearData();
                }
                if (this._itemModel.footerEntity && this._itemModel.footerEntity.get("$expired") === undefined) {
                    this.get("footerEntity").set("$expired", true);
                }
                this._itemModel.setItems(entityList);
                if (!this._rowSelectionProperty) {
                    this.set("selection", null);
                }
            }
        }
        if (this._rowSelectionProperty) {
            let selection = ("multiRows" === this._selectionMode) ? [] : null;
            if (entityList) {
                let it = entityList.iterator();
                while (it.hasNext()) {
                    let entity = it.next();
                    if (entity.get(this._rowSelectionProperty)) {
                        if (this._selectionMode === "singleRow") {
                            selection = entity;
                            break;
                        }
                        selection.push(entity);
                    }
                }
            }
            this.set("selection", selection);
        }
        if (!columnsInited) {
            this.initColumns();
        }
        $invokeSuper.call(this, arguments);
        if (!this._ready && this._dataSet && this._dataSet._loadingData) {
            this.showLoadingTip();
        }
        if (this._shouldHideLoadingTipOnVisible) {
            this.hideLoadingTip();
            this._shouldHideLoadingTipOnVisible = false;
        }
    }, refreshEntity:function(entity: any) {
        if (!this._rendered) {
            return;
        }
        if (this._domMode === 2) {
            this._fixedInnerGrid.refreshEntity(entity);
        }
        this._innerGrid.refreshEntity(entity);
        if (this._currentCellEditor && this._currentCellEditor.data === entity) {
            this._currentCellEditor.refresh();
        }
    }, onEntityInserted:function(arg: any) {
        if (this._domMode === 2) {
            this._fixedInnerGrid.onEntityInserted(arg);
        }
        this._innerGrid.onEntityInserted(arg);
        this.updateScroller(this._innerGrid._container);
    }, onEntityDeleted:function(arg: any) {
        if (this._domMode === 2) {
            this._fixedInnerGrid.onEntityDeleted(arg);
        }
        this._innerGrid.onEntityDeleted(arg);
        if (this._itemModel.filtered && this._filterMode === "clientSide" && this._itemModel._items instanceof Array && arg.entity) {
            this._itemModel._items.remove(arg.entity);
        }
        this.updateScroller(this._innerGrid._container);
    }, shouldEditing:function(column: any) {
        let readOnly = false;
        if (this._dataSet) {
            readOnly = this._dataSet.get("readOnly");
        }
        return !readOnly && $invokeSuper.call(this, [column]);
    }, _doOnKeyDown:function(evt: any) {
        let retValue = true;
        let items = this._itemModel.getItems();
        switch (evt.keyCode) {
          case 36:
            if (evt.ctrlKey) {
                if (items instanceof dorado.widget.list.ItemModel) {
                    items.first(this._supportsPaging);
                } else {
                    this.setCurrentEntity(items[0]);
                }
            } else {
                this.setCurrentColumn(this._columnsInfo.dataColumns[0]);
            }
            break;
          case 35:
            if (evt.ctrlKey) {
                if (items instanceof dorado.widget.list.ItemModel) {
                    items.last(this._supportsPaging);
                } else {
                    this.setCurrentEntity(items[items.length - 1]);
                }
            } else {
                let columns = this._columnsInfo.dataColumns;
                this.setCurrentColumn(columns[columns.length - 1]);
            }
            break;
          case 38:
            if (items instanceof dorado.widget.list.ItemModel) {
                items.previous(this._supportsPaging);
            } else {
                let currentItem = this.getCurrentItem();
                let index = items.indexOf(currentItem) - 1;
                this.setCurrentEntity(items[(index < 0) ? 0 : index]);
            }
            retValue = false;
            break;
          case 40:
            if (items instanceof dorado.widget.list.ItemModel) {
                items.next(this._supportsPaging);
            } else {
                let currentItem = this.getCurrentItem();
                let index = items.indexOf(currentItem) + 1;
                this.setCurrentEntity(items[(index > (items.length - 1)) ? (items.length - 1) : index]);
            }
            retValue = false;
            break;
          case 13:
            retValue = false;
            let columns = this._columnsInfo.dataColumns, i;
            if (this._currentColumn) {
                i = columns.indexOf(this._currentColumn) || 0;
            } else {
                i = evt.shiftKey ? (columns.length) : -1;
            }
            let count = 0, column, newColumn, wrapped;
            i = columns.indexOf(this._currentColumn) || 0;
            while (count < columns.length) {
                count++;
                (evt.shiftKey) ? i-- : i++;
                if (i < 0) {
                    i = columns.length - 1;
                    wrapped = true;
                } else {
                    if (i >= columns.length) {
                        i = 0;
                        wrapped = true;
                    }
                }
                column = columns[i];
                if (this.shouldEditing(column)) {
                    newColumn = column;
                    break;
                }
            }
            if (wrapped) {
                if (evt.shiftKey) {
                    if (items.hasPrevious()) {
                        items.previous(this._supportsPaging);
                    } else {
                        retValue = true;
                    }
                } else {
                    if (items.hasNext()) {
                        items.next(this._supportsPaging);
                    } else {
                        if (this._appendOnLastEnter && items.current) {
                            items.insert();
                        } else {
                            retValue = true;
                        }
                    }
                }
            }
            if (retValue) {
                this.setCurrentColumn(null);
                this.hideCellEditor();
            } else {
                this.setCurrentColumn(newColumn);
            }
            break;
          case 45:
            break;
          case 46:
            if (evt.ctrlKey && !this._readOnly) {
                items.remove();
            }
            break;
        }
        return retValue;
    }, filterDataSetMessage:function(messageCode: any, arg: any) {
        let itemModel = this._itemModel;
        let items = itemModel.getOriginItems();
        switch (messageCode) {
          case dorado.widget.DataSet.MESSAGE_REFRESH:
            return true;
          case dorado.widget.DataSet.MESSAGE_CURRENT_CHANGED:
            return (!items || arg.entityList === items || dorado.DataUtil.isOwnerOf(items, arg.entityList));
          case dorado.widget.DataSet.MESSAGE_DATA_CHANGED:
          case dorado.widget.DataSet.MESSAGE_REFRESH_ENTITY:
            let b = (!items || items._observer !== this._dataSet || arg.entity.parent === items || dorado.DataUtil.isOwnerOf(items, arg.newValue));
            if (!b && this._columnsInfo.propertyPaths) {
                b = dorado.DataUtil.isOwnerOf(arg.entity, items);
                if (b && arg.property) {
                    b = this._columnsInfo.propertyPaths.indexOf("." + arg.property) > 0;
                }
            }
            return b;
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
    }, dataSetMessageReceived:function(messageCode: any, arg: any) {
        if (this._rendered && dorado.widget.DataSet.MESSAGE_LOADING_END) {
            if (!this.isActualVisible()) {
                this._shouldHideLoadingTipOnVisible = true;
            }
        }
        $invokeSuper.call(this, arguments);
    }, processDataSetMessage:function(messageCode: any, arg: any, data: any) {
        let items;
        switch (messageCode) {
          case dorado.widget.DataSet.MESSAGE_REFRESH:
            if (this._itemModel.groups) {
                this._itemModel.refreshItems();
            }
            this.refresh(true);
            break;
          case dorado.widget.DataSet.MESSAGE_CURRENT_CHANGED:
            this.hideCellEditor();
            if (arg.entityList === this._itemModel.getOriginItems()) {
                let oldCurrentEntity = this.getCurrentEntity();
                if (!this._supportsPaging && (!oldCurrentEntity || oldCurrentEntity.page && oldCurrentEntity.page.pageNo !== arg.entityList.pageNo)) {
                    if (this._itemModel.criterions && this._filterMode === "clientSide") {
                        this.get("filterEntity").clearData();
                        this.filter();
                    }
                    this.refresh(true);
                    this.refreshSummary();
                } else {
                    if (this._itemModel.groups && oldCurrentEntity && oldCurrentEntity.state === dorado.Entity.STATE_NEW && oldCurrentEntity.parent == null) {
                        this._itemModel.refreshItems();
                    }
                    this.setCurrentEntity(arg.entityList.current);
                }
            } else {
                this.refresh(true);
            }
            break;
          case dorado.widget.DataSet.MESSAGE_DATA_CHANGED:
            items = this._itemModel.getOriginItems();
            if (!items || items._observer !== this._dataSet || arg.entity.parent !== items) {
                this.refresh(true);
            } else {
                let entity = arg.entity;
                if (entity.parent === items) {
                    if (this._rowSelectionProperty && !this._processingSelectionChange && this._rowSelectionProperty === arg.property) {
                        if (!!arg.newValue !== !!arg.oldValue) {
                            this._processingSelectionChange = true;
                            let removed, added;
                            switch (this._selectionMode) {
                              case "singleRow":
                                if (arg.newValue) {
                                    added = arg.entity;
                                } else {
                                    removed = arg.entity;
                                }
                                break;
                              case "multiRows":
                                if (arg.newValue) {
                                    added = [arg.entity];
                                } else {
                                    removed = [arg.entity];
                                }
                                break;
                            }
                            this._innerGrid.replaceSelection(removed, added);
                            this._processingSelectionChange = false;
                        }
                    }
                }
                if (dorado.DataUtil.isOwnerOf(entity, items)) {
                    while (entity.parent !== items) {
                        entity = entity.parent;
                    }
                }
                this.refreshEntity(entity);
                if (!entity.rowType) {
                    this.onEntityChanged(entity, arg.property);
                }
                this.refreshSummary();
            }
            break;
          case dorado.widget.DataSet.MESSAGE_REFRESH_ENTITY:
            items = this._itemModel.getOriginItems();
            if (!items || items._observer !== this._dataSet || arg.entity.parent !== items) {
                this.refresh(true);
            } else {
                if (this._itemModel.groups) {
                    this._itemModel.refreshItems();
                    this.refresh(true);
                } else {
                    this.refreshEntity(arg.entity);
                }
            }
            break;
          case dorado.widget.DataSet.MESSAGE_ENTITY_STATE_CHANGED:
            this.refreshEntity(arg.entity);
            break;
          case dorado.widget.DataSet.MESSAGE_DELETED:
            if (this._itemModel.groups) {
                if (arg.entity.state !== dorado.Entity.STATE_NEW) {
                    this._itemModel.refreshItems();
                }
                this.refresh(true);
            } else {
                let items = this._itemModel.getOriginItems();
                if (items === arg.entityList) {
                    this.onEntityDeleted(arg);
                    this.refreshSummary();
                } else {
                    this.refresh(true);
                }
            }
            break;
          case dorado.widget.DataSet.MESSAGE_INSERTED:
            if (this._itemModel.groups) {
                this._itemModel.refreshItems();
                this.refresh(true);
            } else {
                this.onEntityInserted(arg);
                this.refreshSummary();
            }
            break;
          case dorado.widget.DataSet.MESSAGE_LOADING_START:
            this.showLoadingTip();
            break;
          case dorado.widget.DataSet.MESSAGE_LOADING_END:
            this.hideLoadingTip();
            break;
        }
    }, _requirePage:function(pageNo: any, timeout: any) {
        let requiredPages = this._requiredPages;
        if (!requiredPages) {
            this._requiredPages = requiredPages = [];
        }
        let loadingPages = this._loadingPages;
        if (loadingPages && loadingPages.indexOf(pageNo) >= 0) {
            return;
        }
        if (this._loadPageTimerId) {
            clearTimeout(this._loadPageTimerId);
            delete this._loadPageTimerId;
        }
        if (requiredPages.indexOf(pageNo) < 0) {
            requiredPages.push(pageNo);
        }
        this._loadPageTimerId = $setTimeout(this, function() {
            this._loadingPages = requiredPages;
            delete this._requiredPages;
            let items = this._itemModel.getOriginItems();
            for (let i = 0; i < requiredPages.length; i++) {
                items.getPage(requiredPages[i], true, dorado._NULL_FUNCTION);
            }
            this._skipScrollCurrentIntoView = true;
        }, timeout || 20);
    }, _getParentEntityInfo:function() {
        let dataSet = this._dataSet;
        if (!dataSet) {
            return;
        }
        if (this._dataPath.match(/\.[\w]*$/)) {
            let i = this._dataPath.lastIndexOf(".");
            let parentDataPath = this._dataPath.substring(0, i);
            let subProperty = this._dataPath.substring(i + 1);
            let parentEntity = dataSet.getData(parentDataPath);
            if (parentEntity && parentEntity instanceof dorado.Entity) {
                let parentDataType = parentEntity.dataType;
                if (parentDataType && parentDataType instanceof dorado.EntityDataType) {
                    let propertyDef = parentDataType.getPropertyDef(subProperty);
                    if (propertyDef && propertyDef instanceof dorado.Reference) {
                        return {propertyDef:propertyDef, parentEntity:parentEntity, subProperty:subProperty};
                    }
                }
            }
        }
    }, _doInitFilterServerCriterions:function(sysParameter: any, criterions: any) {
        function criterionToServerCriterion(criterion: any, column: any, dataColumns: any) {
            let serverCriterion = null;
            if (criterion.junction) {
                let criterions = criterion.criterions;
                if (criterions && criterions.length) {
                    serverCriterion = {junction:criterion.junction, criterions:[]};
                    for (let i = 0; i < criterions.length; i++) {
                        let c = criterions[i];
                        if (c != null) {
                            serverCriterion.criterions.push(criterionToServerCriterion(c, column, dataColumns));
                        }
                    }
                }
            } else {
                let property;
                if (!column) {
                    if (!criterion.property) {
                        throw new dorado.ResourceException("dorado.list.CriterionPropertyUndefined");
                    }
                    property = criterion.property;
                    column = getColumn(dataColumns, property);
                } else {
                    property = column._property;
                }
                let dataType = (column ? column.get("dataType") : null), expression = "";
                if (criterion.operator && criterion.operator.indexOf("like") < 0) {
                    expression += criterion.operator;
                }
                expression += (dataType ? dataType : dorado.$String).toText(criterion.value);
                if (criterion.operator) {
                    if (criterion.operator.startsWith("like")) {
                        expression = expression + "*";
                    }
                    if (criterion.operator.endsWith("like")) {
                        expression = "*" + expression;
                    }
                }
                let pd = column._propertyDef;
                let propertyPath = (pd) ? pd._propertyPath : undefined;
                serverCriterion = {property:property, propertyPath:propertyPath, dataType:((!dataType || dataType instanceof dorado.EntityDataType || dataType instanceof dorado.AggregationDataType) ? undefined : dataType._name), expression:expression};
            }
            return serverCriterion;
        }
        function getColumn(dataColumns: any, property: any) {
            for (let i = 0; i < dataColumns.length; i++) {
                let column = dataColumns[i];
                if (column._property === property) {
                    return column;
                }
            }
            return null;
        }
        function verifyCriterion(criterion: any, column: any) {
            if (criterion.junction) {
                let criterions = criterion.criterions;
                if (criterions && criterions.length) {
                    for (let i = 0; i < criterions.length; i++) {
                        let c = criterions[i];
                        if (c != null) {
                            verifyCriterion(c, column);
                        }
                    }
                }
            } else {
                verifyCriterion.property = column._property;
            }
        }
        let serverCriterions = [], dataColumns = this._columnsInfo.dataColumns;
        if (criterions === undefined) {
            let filterEntity = this._itemModel.filterEntity;
            for (let i = 0; i < dataColumns.length; i++) {
                let column = dataColumns[i];
                if (!column._property || column._property === "none") {
                    continue;
                }
                let criterion = filterEntity.get(column._property);
                if (criterion) {
                    let serverCriterion = criterionToServerCriterion(criterion, column, null);
                    if (serverCriterion.junction && serverCriterion.junction !== "or") {
                        serverCriterions = serverCriterions.concat(serverCriterion.criterions);
                    } else {
                        serverCriterions.push(serverCriterion);
                    }
                }
            }
        } else {
            for (let i = 0; i < criterions.length; i++) {
                let serverCriterion = criterionToServerCriterion(criterions[i], null, dataColumns);
                if (serverCriterion.junction && serverCriterion.junction !== "or") {
                    serverCriterions = serverCriterions.concat(serverCriterion.criterions);
                } else {
                    serverCriterions.push(serverCriterion);
                }
            }
        }
        let criteria = sysParameter.get("criteria") || {};
        criteria.criterions = serverCriterions;
        if (!(criteria.criterions || criteria.criterions.length || criteria.orders || criteria.orders.length)) {
            criteria = null;
        }
        sysParameter.put("criteria", criteria);
    }, filter:function(criterions: any) {
        if (this._filterMode === "serverSide") {
            let dataSet = this._dataSet;
            if (!dataSet) {
                return;
            }
            let parentEntityInfo, hostObject;
            if (this._dataPath) {
                parentEntityInfo = this._getParentEntityInfo();
                if (!parentEntityInfo) {
                    throw new dorado.Exception("Can not perform server side filter on DataPath \"" + this._dataPath + "\"");
                }
                hostObject = parentEntityInfo.propertyDef;
            } else {
                hostObject = dataSet;
            }
            let sysParameter = hostObject._sysParameter;
            if (!sysParameter) {
                hostObject._sysParameter = sysParameter = new dorado.util.Map();
            }
            this._doInitFilterServerCriterions(sysParameter, criterions);
            if (parentEntityInfo) {
                parentEntityInfo.parentEntity.reset(parentEntityInfo.subProperty);
            } else {
                dataSet.flushAsync();
            }
        } else {
            return $invokeSuper.call(this, arguments);
        }
    }, sort:function(column: any, desc: any) {
        let itemModel = this._itemModel;
        if (this._sortMode === "serverSide") {
            let dataSet = this._dataSet;
            if (!dataSet) {
                return;
            }
            let parentEntityInfo, hostObject;
            if (this._dataPath) {
                parentEntityInfo = this._getParentEntityInfo();
                if (!parentEntityInfo) {
                    throw new dorado.Exception("Can not perform server side sort on DataPath \"" + this._dataPath + "\"");
                }
                hostObject = parentEntityInfo.propertyDef;
            } else {
                hostObject = dataSet;
            }
            let sysParameter = hostObject._sysParameter;
            if (!sysParameter) {
                hostObject._sysParameter = sysParameter = new dorado.util.Map();
            }
            this._doInitFilterServerCriterions(sysParameter);
            let criteria = sysParameter.get("criteria") || {};
            if (column) {
                criteria.orders = orders = [{property:column._property, desc:desc}];
            } else {
                if (parameter instanceof dorado.util.Map) {
                    delete criteria.orders;
                }
            }
            if (!(criteria.criterions && criteria.criterions.length || criteria.orders && criteria.orders.length)) {
                criteria = null;
            }
            sysParameter.put("criteria", criteria);
            let dataColumns = this._columnsInfo.dataColumns, grid = this;
            function setSortFlags() {
                let sortOrderMap = {};
                for (let i = 0; i < orders.length; i++) {
                    let order = orders[i];
                    if (order.property) {
                        sortOrderMap[order.property] = !!order.desc;
                    }
                }
                for (let i = 0; i < dataColumns.length; i++) {
                    let column = dataColumns[i], desc = sortOrderMap[column._property];
                    if (desc === undefined) {
                        column.set("sortState", null);
                    } else {
                        column.set("sortState", desc ? "desc" : "asc");
                    }
                }
                grid._skipClearSortFlags = true;
            }
            if (parentEntityInfo) {
                parentEntityInfo.parentEntity.reset(parentEntityInfo.subProperty);
                parentEntityInfo.parentEntity.getAsync(parentEntityInfo.subProperty, setSortFlags);
            } else {
                dataSet.flushAsync(setSortFlags);
            }
        } else {
            return $invokeSuper.call(this, arguments);
        }
    }});
    let DataListBoxProtoType = dorado.widget.DataListBox.prototype;
    dorado.widget.grid.InnerDataGrid = $extend(dorado.widget.grid.AbstractInnerGrid, {$className:"dorado.widget.grid.InnerDataGrid", EVENTS:{onSelectionChange:{interceptor:function(superFire: any, self: any, arg: any) {
        let grid = self.grid;
        if (this._duringRefreshDom || grid._duringRefreshDom) {
            return;
        }
        let retval = superFire(self, arg);
        if (grid._rowSelectionProperty && !grid._processingSelectionChange) {
            grid._processingSelectionChange = true;
            try {
                let property = grid._rowSelectionProperty, removed = arg.removed, added = arg.added;
                let selectionMode = grid._selectionMode;
                switch (selectionMode) {
                  case "singleRow":
                    if (removed) {
                        removed.set(property, false);
                    }
                    if (added) {
                        added.set(property, true);
                    }
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
                    if (removed) {
                        if (!(removed instanceof Array)) {
                            removed = [removed];
                        }
                        for (let i = 0; i < removed.length; i++) {
                            removed[i].set(property, false);
                        }
                    }
                    if (added) {
                        for (let i = 0; i < added.length; i++) {
                            added[i].set(property, true);
                        }
                    }
                    break;
                }
            }
            finally {
                grid._processingSelectionChange = false;
            }
        }
        return retval;
    }}}, getCurrentItem:DataListBoxProtoType.getCurrentItem, getCurrentItemId:DataListBoxProtoType.getCurrentItemId, getRealCurrentItemId:DataListBoxProtoType.getRealCurrentItemId, refreshEntity:DataListBoxProtoType.refreshEntity, refreshItemDom:DataListBoxProtoType.refreshItemDom, onEntityDeleted:DataListBoxProtoType.onEntityDeleted, onEntityInserted:DataListBoxProtoType.onEntityInserted, _adjustBeginBlankRow:DataListBoxProtoType._adjustBeginBlankRow, _adjustEndBlankRow:DataListBoxProtoType._adjustEndBlankRow, setCurrentItemDom:function(row: any) {
        let entity = (row ? $fly(row).data("item") : null);
        if (entity) {
            if (entity.dummy) {
                this.grid._requirePage(entity.page.pageNo);
            }
            if (entity.rowType) {
                return;
            }
        }
        return DataListBoxProtoType.setCurrentItemDom.apply(this, arguments);
    }, setCurrentRowByItemId:function(itemId: any) {
        if (!this._itemDomMap) {
            return;
        }
        let row = (itemId == null) ? null : this._itemDomMap[itemId];
        let item = row ? $fly(row).data("item") : null;
        let entityList = this._itemModel.getOriginItems();
        entityList.setCurrent(item);
        if (entityList.current === item) {
            this.setCurrentEntity(item);
        }
    }, setCurrentEntity:function(entity: any) {
        let retValue = DataListBoxProtoType.setCurrentEntity.apply(this, arguments);
        this.grid.doInnerGridSetCurrentRow(this, entity ? this._itemModel.getItemId(entity) : null);
        return retValue;
    }, doRefreshItemDomData:function(row: any, item: any) {
        $invokeSuper.call(this, arguments);
        row.dummy = item.dummy;
        if (row.dummy) {
            row.pageNo = item.page.pageNo;
            if (this._requiredPages) {
                this._requiredPages.push(row.pageNo);
            }
        }
        $fly(row).toggleClass("dummy-row", !!row.dummy);
    }, refreshContent:function(container: any) {
        this._requiredPages = [];
        $invokeSuper.call(this, arguments);
        for (let i = 0; i < this._requiredPages.length; i++) {
            this.grid._requirePage(this._requiredPages[i]);
        }
    }, refreshViewPortContent:function(container: any) {
        this._requiredPages = [];
        $invokeSuper.call(this, arguments);
        for (let i = 0; i < this._requiredPages.length; i++) {
            this.grid._requirePage(this._requiredPages[i]);
        }
    }, doOnYScroll:function() {
        if (this._scrollMode === "lazyRender") {
            this._requiredPages = [];
            $invokeSuper.call(this, arguments);
            for (let i = 0; i < this._requiredPages.length; i++) {
                this.grid._requirePage(this._requiredPages[i]);
            }
        } else {
            $invokeSuper.call(this, arguments);
        }
    }});
})();

