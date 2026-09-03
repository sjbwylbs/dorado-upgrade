// @ts-nocheck
/// <reference path="globals.d.ts" />

(function () {
    dorado.widget.layout.AnchorLayout = $extend(dorado.widget.layout.Layout, {$className:"dorado.widget.layout.AnchorLayout", _className:"d-anchor-layout", createDom:function () {
        let dom = document.createElement("DIV");
        dom.className = this._className;
        return dom;
    }, refreshDom:function (dom: any) {
        let scrollTop, scrollLeft, parentNode = dom.parentNode;
        if (parentNode) {
            scrollTop = parentNode.scrollTop;
            scrollLeft = parentNode.scrollLeft;
        }
        dom.style.width = "100%";
        dom.style.height = "100%";
        this.ensureControlsInited();
        this.doRefreshDom(dom);
        if (scrollTop) {
            parentNode.scrollTop = scrollTop;
        }
        if (scrollLeft) {
            parentNode.scrollLeft = scrollLeft;
        }
    }, doRefreshDom:function (dom: any) {
        let clientSize = this._container.getContentContainerSize();
        let clientWidth = clientSize[0], clientHeight = clientSize[1];
        if (clientWidth > 10000) {
            clientWidth = 0;
        }
        if (clientHeight > 10000) {
            clientHeight = 0;
        }
        this._maxRegionRight = this._maxRegionBottom = 0;
        let regions = this._regions.items, region;
        for (let i = 0, len = regions.length; i < len; i++) {
            region = regions[i];
            let constraint = region.constraint;
            if (constraint === dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT) {
                let control = region.control;
                if (control._dom) {
                    $DomUtils.getUndisplayContainer().appendChild(control._dom);
                }
            } else {
                let realignArg = this.doAdjustRegion(region, clientWidth, clientHeight);
                if (realignArg) {
                    this.realignRegion(region, realignArg);
                }
            }
        }
        if (this.processOverflow(dom, clientWidth, clientHeight)) {
            this.calculateRegions();
        }
    }, recordMaxRange:function (region: any) {
        let controlDom = region.control.getDom();
        if (controlDom.style.position === "absolute") {
            if (region.right === undefined) {
                let right = (region.left || 0) + region.realWidth + region.regionPadding;
                if (right > this._maxRegionRight) {
                    this._maxRegionRight = right;
                }
            }
            if (region.bottom === undefined) {
                let bottom = (region.top || 0) + region.realHeight + region.regionPadding;
                if (bottom > this._maxRegionBottom) {
                    this._maxRegionBottom = bottom;
                }
            }
        }
    }, processOverflow:function (dom: any, clientWidth: any, clientHeight: any) {
        if (clientWidth === undefined || clientHeight === undefined) {
            let containerSize = this._container.getContentContainerSize();
            clientWidth = containerSize[0];
            clientHeight = containerSize[0];
        }
        let overflowed = false, padding = parseInt(this._padding) || 0;
        let width = this._maxRegionRight;
        if (width < dom.scrollWidth) {
            width = dom.scrollWidth;
        }
        if (width > 0 && (width > clientWidth || (width === dom.offsetWidth && dom.style.width === ""))) {
            dom.style.width = (width + padding) + "px";
            overflowed = true;
        }
        let height = this._maxRegionBottom;
        if (height < dom.scrollHeight) {
            height = dom.scrollHeight;
        }
        if (height > 0 && (height > clientHeight || (height === dom.offsetHeight && dom.style.height === ""))) {
            dom.style.height = (height + padding) + "px";
            overflowed = true;
        }
        return overflowed;
    }, onAddControl:function (control: any) {
        if (!this._attached) {
            return;
        }
        let region = this.getRegion(control);
        if (region) {
            let realignArg = this.adjustRegion(region);
            if (this._disableRendering) {
                return;
            }
            if (realignArg) {
                this.realignRegion(region, realignArg);
            }
            if (this.processOverflow(this.getDom())) {
                this.calculateRegions();
            }
        }
    }, onRemoveControl:function (control: any) {
        if (!this._attached) {
            return;
        }
        let region = this.getRegion(control);
        if (region) {
            this.getDom().removeChild(control.getDom());
            if (this._disableRendering) {
                return;
            }
            let nextRegion = this.getNextRegion(region);
            if (nextRegion) {
                this.calculateRegions(nextRegion);
            }
        }
    }, doOnControlSizeChange:function (control: any) {
        this.refreshControl(control);
    }, doRefreshRegion:function (region: any) {
        let control = region.control, controlDom = control.getDom(), dom = this.getDom();
        let hidden = (region.constraint === dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT), visibilityChanged = false;
        if (hidden) {
            if (controlDom.parentNode === dom) {
                dom.removeChild(controlDom);
                this.refresh();
            }
        } else {
            let oldWidth = region.realWidth, oldHeight = region.realHeight;
            let $controlDom = $fly(controlDom);
            if (controlDom.parentNode !== dom || $controlDom.outerWidth() !== oldWidth || $controlDom.outerHeight() !== oldHeight) {
                this.refresh();
            }
        }
    }, calculateRegions:function (fromRegion: any) {
        let regions = this._regions.items;
        if (regions.length === 0) {
            return;
        }
        let clientSize = this._container.getContentContainerSize();
        let clientWidth = clientSize[0], clientHeight = clientSize[1];
        if (clientWidth > 10000) {
            clientWidth = 0;
        }
        if (clientHeight > 10000) {
            clientHeight = 0;
        }
        let found = !fromRegion, region;
        for (let i = 0, len = regions.length; i < len; i++) {
            region = regions[i];
            if (!found) {
                found = (fromRegion === region);
                if (!found) {
                    return;
                }
            }
            if (region.constraint === dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT) {
                return;
            }
            let realignArg = this.doAdjustRegion(region, clientWidth, clientHeight);
            if (realignArg) {
                this.realignRegion(region, realignArg);
            }
        }
    }, adjustRegion:function (region: any) {
        let clientSize = this._container.getContentContainerSize();
        let clientWidth = clientSize[0], clientHeight = clientSize[1];
        if (clientWidth > 10000) {
            clientWidth = 0;
        }
        if (clientHeight > 10000) {
            clientHeight = 0;
        }
        this.doAdjustRegion(region, clientWidth, clientHeight);
    }, doAdjustRegion:function (region: any, clientWidth: any, clientHeight: any) {
        function getAnchorRegion(region: any, p: any) {
            let anchor = constraint[p];
            if (anchor) {
                if (anchor.constructor === String) {
                    if (anchor === "previous") {
                        anchor = this.getPreviousRegion(region);
                    } else {
                        anchor = null;
                    }
                } else {
                    if (typeof anchor === "function") {
                        anchor = anchor.call(this, region);
                    }
                }
            }
            return anchor;
        }
        let constraint = region.constraint, realignArg;
        let containerDom = this._dom.parentNode;
        let left, right, width, top, bottom, height;
        left = right = width = top = bottom = height = -1;
        let lp, rp, tp, bp, wp, hp;
        lp = rp = tp = bp = wp = hp = 0;
        let padding = (parseInt(this._padding) || 0);
        let regionPadding = (parseInt(this._regionPadding) || 0) + (parseInt(constraint.padding) || 0);
        let realContainerWidth = clientWidth - padding * 2, realContainerHeight = clientHeight - padding * 2;
        if (constraint.anchorLeft === "previous" && constraint.left == null) {
            constraint.left = 0;
        }
        if (constraint.left != null && constraint.anchorLeft !== "none") {
            let l = constraint.left;
            if (l.constructor === String && l.match("%")) {
                let rate = lp = parseInt(l);
                if (!isNaN(rate)) {
                    left = rate * realContainerWidth / 100 + regionPadding;
                }
            }
            if (left < 0) {
                let anchorRegion = getAnchorRegion.call(this, region, "anchorLeft");
                if (anchorRegion) {
                    let anchorDom = anchorRegion.control.getDom();
                    left = anchorDom.offsetLeft + anchorRegion.realWidth + regionPadding + parseInt(l);
                } else {
                    left = parseInt(l) + padding + regionPadding;
                }
            }
        }
        if (constraint.anchorRight === "previous" && constraint.right == null) {
            constraint.right = 0;
        }
        if (constraint.right != null && constraint.anchorRight !== "none") {
            let r = constraint.right;
            if (r.constructor === String && r.match("%")) {
                let rate = rp = parseInt(r);
                if (!isNaN(rate)) {
                    right = rate * realContainerWidth / 100 + regionPadding;
                }
            }
            if (right < 0) {
                let anchorRegion = getAnchorRegion.call(this, region, "anchorRight");
                if (anchorRegion) {
                    let anchorDom = anchorRegion.control.getDom();
                    right = clientWidth - anchorDom.offsetLeft + regionPadding + parseInt(r);
                } else {
                    right = parseInt(r) + padding + regionPadding;
                }
            }
        }
        if (constraint.anchorTop === "previous" && constraint.top == null) {
            constraint.top = 0;
        }
        if (constraint.top != null && constraint.anchorTop !== "none") {
            let t = constraint.top;
            if (t.constructor === String && t.match("%")) {
                let rate = tp = parseInt(t);
                if (!isNaN(rate)) {
                    top = rate * realContainerHeight / 100 + regionPadding;
                }
            }
            if (top < 0) {
                let anchorRegion = getAnchorRegion.call(this, region, "anchorTop");
                if (anchorRegion) {
                    let anchorDom = anchorRegion.control.getDom();
                    top = anchorDom.offsetTop + anchorRegion.realHeight + regionPadding + parseInt(t);
                } else {
                    top = parseInt(t) + padding + regionPadding;
                }
            }
        }
        if (constraint.anchorBottom === "previous" && constraint.bottom == null) {
            constraint.bottom = 0;
        }
        if (constraint.bottom != null && constraint.anchorBottom !== "none") {
            let b = constraint.bottom;
            if (b.constructor === String && b.match("%")) {
                let rate = bp = parseInt(b);
                if (!isNaN(rate)) {
                    bottom = rate * realContainerWidth / 100 + regionPadding;
                }
            }
            if (bottom < 0) {
                let anchorRegion = getAnchorRegion.call(this, region, "anchorBottom");
                if (anchorRegion) {
                    let anchorDom = anchorRegion.control.getDom();
                    bottom = clientHeight - anchorDom.offsetTop + regionPadding + parseInt(b);
                } else {
                    bottom = parseInt(b) + padding + regionPadding;
                }
            }
        }
        let useControlWidth = region.control.getAttributeWatcher().getWritingTimes("width");
        if (useControlWidth || left < 0 || right < 0) {
            let w = region.control._width;
            if (w && w.constructor === String && w.match("%")) {
                let rate = wp = parseInt(w);
                if (!isNaN(rate)) {
                    width = rate * realContainerWidth / 100;
                }
            } else {
                width = parseInt(w);
            }
            if (left >= 0 && right >= 0) {
                right = -1;
                rp = false;
            }
        } else {
            if (left >= 0 && right >= 0) {
                if (lp && rp) {
                    width = clientWidth - left - right;
                    right = -1;
                    lp = rp = false;
                } else {
                    width = clientWidth;
                    if (lp) {
                        left = -1;
                        width -= right;
                    }
                    if (rp) {
                        right = -1;
                        width -= left;
                    }
                    if (!lp && !rp) {
                        width -= (left + right);
                        right = -1;
                    }
                }
            }
        }
        let useControlHeight = region.control.getAttributeWatcher().getWritingTimes("height");
        if (useControlHeight || top < 0 || bottom < 0) {
            let h = region.control._height;
            if (h && h.constructor === String && h.match("%")) {
                let rate = hp = parseInt(h);
                if (!isNaN(rate)) {
                    height = rate * realContainerHeight / 100;
                }
            } else {
                height = parseInt(h);
            }
            if (top >= 0 && bottom >= 0) {
                bottom = -1;
                bp = false;
            }
        } else {
            if (top >= 0 && bottom >= 0) {
                if (tp && bp) {
                    height = clientHeight - top - bottom;
                    bottom = -1;
                    tp = bp = false;
                } else {
                    height = clientHeight;
                    if (tp) {
                        top = -1;
                        height -= bottom;
                    }
                    if (bp) {
                        bottom = -1;
                        height -= top;
                    }
                    if (!tp && !bp) {
                        height -= (top + bottom);
                        bottom = -1;
                    }
                }
            }
        }
        if (lp || rp || tp || bp || wp || hp) {
            region.realignArg = realignArg = {left:lp, right:rp, top:tp, bottom:bp, width:wp, height:hp};
        }
        if (left >= 0 || right >= 0 || top >= 0 || bottom >= 0) {
            if (padding > 0) {
                if ((left >= 0 || right >= 0) && top < 0 && bottom < 0) {
                    top = padding + regionPadding;
                }
                if ((top >= 0 || bottom >= 0) && left < 0 && right < 0) {
                    left = padding + regionPadding;
                }
            }
        } else {
            if (padding > 0) {
                left = top = padding + regionPadding;
            }
        }
        region.left = (left >= 0) ? left + (parseInt(constraint.leftOffset) || 0) : undefined;
        region.right = (right >= 0) ? right - (parseInt(constraint.leftOffset) || 0) : undefined;
        region.top = (top >= 0) ? top + (parseInt(constraint.topOffset) || 0) : undefined;
        region.bottom = (bottom >= 0) ? bottom - (parseInt(constraint.topOffset) || 0) : undefined;
        region.width = (width >= 0) ? width + (parseInt(constraint.widthOffset) || 0) : undefined;
        region.height = (height >= 0) ? height + (parseInt(constraint.heightOffset) || 0) : undefined;
        region.regionPadding = regionPadding || 0;
        let dom = this._dom;
        if (region.right >= 0 && !dom.style.width) {
            dom.style.width = (clientWidth) ? (clientWidth + "px") : "";
        }
        if (region.bottom >= 0 && !dom.style.height) {
            dom.style.height = (clientHeight) ? (clientHeight + "px") : "100%";
        }
        this.renderControl(region, dom, true, true);
        let controlDom = region.control.getDom();
        if (controlDom) {
            let $controlDom = $fly(controlDom);
            region.realWidth = $controlDom.outerWidth();
            region.realHeight = $controlDom.outerHeight();
        } else {
            region.realWidth = region.control.getRealWidth() || 0;
            region.realHeight = region.control.getRealHeight() || 0;
        }
        if (!realignArg) {
            this.recordMaxRange(region);
        }
        return realignArg;
    }, realignRegion:function (region: any, realignArg: any) {
        let controlDom = region.control.getDom();
        let left, right, width, top, bottom, height;
        left = right = width = top = bottom = height = -1;
        let constraint = region.constraint, containerDom = this._dom.parentNode;
        let padding = (parseInt(this._padding) || 0);
        let regionPadding = region.regionPadding;
        let clientSize = this._container.getContentContainerSize();
        let clientWidth = clientSize[0], clientHeight = clientSize[1], realContainerWidth, realContainerHeight;
        if (clientWidth > 10000) {
            clientWidth = realContainerWidth = 0;
        } else {
            realContainerWidth = clientWidth - padding * 2;
        }
        if (clientHeight > 10000) {
            clientHeight = realContainerHeight = 0;
        } else {
            realContainerHeight = clientHeight - padding * 2;
        }
        if (realignArg.left) {
            left = Math.round((realContainerWidth - region.realWidth - (region.right > 0 ? region.right : 0)) * realignArg.left / 100) + padding + regionPadding + (parseInt(constraint.leftOffset) || 0);
        } else {
            if (realignArg.right) {
                right = Math.round((realContainerWidth - region.realWidth - (region.left > 0 ? region.left : 0)) * realignArg.right / 100) + padding + regionPadding + (parseInt(constraint.rightOffset) || 0);
            }
        }
        if (realignArg.top) {
            top = Math.round((realContainerHeight - region.realHeight - (region.bottom > 0 ? region.bottom : 0)) * realignArg.top / 100) + padding + regionPadding + (parseInt(constraint.topOffset) || 0);
        } else {
            if (realignArg.bottom) {
                bottom = Math.round((realContainerHeight - region.realHeight - (region.top > 0 ? region.top : 0)) * realignArg.bottom / 100) + padding + regionPadding + (parseInt(constraint.bottomOffset) || 0);
            }
        }
        let style = controlDom.style;
        if (left >= 0) {
            region.left = left;
            style.left = left + "px";
        }
        if (right >= 0) {
            region.right = right;
            style.right = right + "px";
        }
        if (top >= 0) {
            region.top = top;
            style.top = top + "px";
        }
        if (bottom >= 0) {
            region.bottom = bottom;
            style.bottom = bottom + "px";
        }
        this.recordMaxRange(region);
    }, resetControlDimension:function (region: any, regionDom: any, autoWidth: any, autoHeight: any) {
        let control = region.control, controlDom = control.getDom();
        let style = controlDom.style;
        if (region.left >= 0 || region.top >= 0 || region.right >= 0 || region.bottom >= 0) {
            style.position = "absolute";
        }
        style.left = (region.left >= 0) ? (region.left + "px") : "";
        style.right = (region.right >= 0) ? (region.right + "px") : "";
        style.top = (region.top >= 0) ? (region.top + "px") : "";
        style.bottom = (region.bottom >= 0) ? (region.bottom + "px") : "";
        $invokeSuper.call(this, [region, regionDom, autoWidth, autoHeight]);
    }});
})();
(function () {
    let defaultRegionPadding = 0;
    let getLastRegionFuncs = {};
    jQuery.each(["left", "right", "top", "bottom"], function (i: any, type: any) {
        getLastRegionFuncs[type] = function (region: any) {
            let regions = this._regions.items;
            let i = regions.indexOf(region);
            for (i--; i >= 0; i--) {
                region = regions[i];
                if (region.constraint.type === type) {
                    return region;
                }
            }
            return null;
        };
    });
    let defaultConstraintsCache = {top:{type:"top", left:0, right:0, top:0, bottom:undefined, anchorLeft:getLastRegionFuncs.left, anchorRight:getLastRegionFuncs.right, anchorTop:getLastRegionFuncs.top, anchorBottom:undefined}, bottom:{type:"bottom", left:0, right:0, top:undefined, bottom:0, anchorLeft:getLastRegionFuncs.left, anchorRight:getLastRegionFuncs.right, anchorTop:undefined, anchorBottom:getLastRegionFuncs.bottom}, left:{type:"left", left:0, right:undefined, top:0, bottom:0, anchorLeft:getLastRegionFuncs.left, anchorRight:undefined, anchorTop:getLastRegionFuncs.top, anchorBottom:getLastRegionFuncs.bottom}, right:{type:"right", left:undefined, right:0, top:0, bottom:0, anchorLeft:undefined, anchorRight:getLastRegionFuncs.right, anchorTop:getLastRegionFuncs.top, anchorBottom:getLastRegionFuncs.bottom}, center:{type:"center", left:0, right:0, top:0, bottom:0, anchorLeft:getLastRegionFuncs.left, anchorRight:getLastRegionFuncs.right, anchorTop:getLastRegionFuncs.top, anchorBottom:getLastRegionFuncs.bottom}};
    function getDefaultConstraint(type: any) {
        return dorado.Object.apply({}, defaultConstraintsCache[type || "center"]);
    }
    dorado.widget.layout.DockLayout = $extend(dorado.widget.layout.AnchorLayout, {$className:"dorado.widget.layout.DockLayout", _className:"d-dock-layout", ATTRIBUTES:{regionPadding:{defaultValue:defaultRegionPadding}}, preprocessLayoutConstraint:function (layoutConstraint: any, control: any) {
        if (!control._visible && control._hideMode === "display") {
            layoutConstraint = dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT;
        }
        if (layoutConstraint) {
            if (layoutConstraint !== dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT) {
                if (layoutConstraint.constructor === String) {
                    layoutConstraint = getDefaultConstraint(layoutConstraint);
                } else {
                    layoutConstraint = dorado.Object.apply(layoutConstraint, getDefaultConstraint(layoutConstraint.type));
                }
            }
        } else {
            layoutConstraint = dorado.Object.apply({}, getDefaultConstraint(null));
        }
        return layoutConstraint;
    }, onAddControl:function (control: any) {
        let region = this.getRegion(control);
        if (region.constraint && region.constraint.type === "center") {
            let centerRegion = this._centerRegion;
            if (centerRegion) {
                let centerControl = centerRegion.control;
                if (!centerControl._layoutConstraint || typeof centerControl._layoutConstraint !== "object") {
                    centerControl._layoutConstraint = "top";
                } else {
                    centerControl._layoutConstraint.type = "top";
                }
                dorado.Object.apply(centerRegion.constraint, getDefaultConstraint("top"));
            }
            this._centerRegion = region;
        }
        $invokeSuper.call(this, [control]);
    }, onRemoveControl:function (control: any) {
        let region = this.getRegion(control);
        if (this._centerRegion === region && region) {
            delete this._centerRegion;
        }
        $invokeSuper.call(this, [control]);
    }, refreshDom:function (dom: any) {
        let regions = this._regions;
        if (this._centerRegion && this._centerRegion !== regions.items[regions.size - 1]) {
            regions.remove(this._centerRegion);
            regions.append(this._centerRegion);
        }
        $invokeSuper.call(this, [dom]);
    }, renderControl:function (region: any, regionDom: any, autoWidth: any, autoHeight: any) {
        switch (region.constraint.type) {
          case "top":
          case "bottom":
            autoWidth = true;
            break;
          case "left":
          case "right":
            autoHeight = true;
            break;
          default:
            autoWidth = autoHeight = true;
        }
        return $invokeSuper.call(this, [region, regionDom, autoWidth, autoHeight]);
    }});
    dorado.Toolkits.registerPrototype("layout", "Default", dorado.widget.layout.DockLayout);
})();
(function () {
    let defaultRegionPadding = 2;
    let HBOX_ALIGNS = {top:"top", center:"middle", bottom:"bottom"}, HBOX_PACKS = {start:"left", center:"center", end:"right"};
    let VBOX_ALIGNS = {left:"left", center:"center", right:"right"}, VBOX_PACKS = {start:"top", center:"middle", end:"bottom"};
    dorado.widget.layout.AbstractBoxLayout = $extend(dorado.widget.layout.Layout, {$className:"dorado.widget.layout.AbstractBoxLayout", ATTRIBUTES:{pack:{defaultValue:"start"}, stretch:{defaultValue:true}, padding:{defaultValue:2}, regionPadding:{defaultValue:defaultRegionPadding}}});
    let p = dorado.widget.layout.AbstractBoxLayout.prototype;
    p.onAddControl = p.doRefreshRegion = function () {
        if (!this._attached || this._disableRendering) {
            return;
        }
        this.refresh();
    };
    p.onRemoveControl = function (control: any) {
        if (!this._attached || this._disableRendering) {
            return;
        }
        this.refresh();
    };
    dorado.widget.layout.HBoxLayout = $extend(dorado.widget.layout.AbstractBoxLayout, {$className:"dorado.widget.layout.HBoxLayout", _className:" d-hbox-layout", ATTRIBUTES:{align:{defaultValue:"center"}}, createDom:function () {
        let context = {}, dom = $DomUtils.xCreate({tagName:"TABLE", className:this._className, cellSpacing:0, cellPadding:0, content:{tagName:"TBODY", content:{tagName:"TR", contextKey:"row"}}}, null, context);
        this._row = context.row;
        return dom;
    }, refreshDom:function (dom: any) {
        this.ensureControlsInited();
        let table = dom, row = this._row, containerDom = table.parentNode;
        let domCache = this.domCache || {}, newDomCache = this.domCache = {};
        let padding = parseInt(this._padding) || 0, regionPadding = this._regionPadding || 0;
        if (dorado.Browser.msie && dorado.Browser.version < 8) {
            table.style.margin = padding + "px";
        } else {
            table.style.padding = padding + "px";
        }
        let clientSize = this._container.getContentContainerSize();
        let clientWidth = clientSize[0], clientHeight = clientSize[1];
        if (clientWidth > 10000) {
            clientWidth = 0;
        }
        if (clientHeight > 10000) {
            clientHeight = 0;
        }
        let realContainerWidth = clientWidth - padding * 2;
        let realContainerHeight = clientHeight - padding * 2;
        if (realContainerWidth < 0) {
            realContainerWidth = 0;
        }
        if (realContainerHeight < 0) {
            realContainerHeight = 0;
        }
        if (dorado.Browser.webkit) {
            realContainerHeight -= padding * 2;
        }
        $fly(containerDom).css("text-align", HBOX_PACKS[this._pack]);
        row.style.verticalAlign = HBOX_ALIGNS[this._align];
        if (!dorado.Browser.webkit) {
            table.style.height = realContainerHeight + "px";
        } else {
            row.style.height = realContainerHeight + "px";
        }
        let regions = this._regions.items, region, cell, childNodeIndex = 0;
        for (let i = 0, len = regions.length; i < len; i++) {
            region = regions[i];
            cell = domCache[region.id];
            if (cell) {
                cell.style.display = "none";
            }
            let constraint = region.constraint;
            if (constraint === dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT) {
                let control = region.control;
                if (control._dom) {
                    $DomUtils.getUndisplayContainer().appendChild(control._dom);
                }
            } else {
                let div, isNewCell = false;
                if (!cell) {
                    cell = document.createElement("TD");
                    isNewCell = true;
                } else {
                    delete domCache[region.id];
                }
                newDomCache[region.id] = cell;
                let refCell = row.childNodes[childNodeIndex];
                if (refCell !== cell) {
                    if (cell.parentNode === row) {
                        while (refCell && refCell !== cell) {
                            row.removeChild(refCell);
                            refCell = refCell.nextSibling;
                        }
                    } else {
                        (refCell) ? row.insertBefore(cell, refCell) : row.appendChild(cell);
                    }
                }
                childNodeIndex++;
                cell.style.display = "";
                if (constraint.align) {
                    cell.style.verticalAlign = (constraint.align === "center") ? "middle" : constraint.align;
                }
                let w = region.control._width;
                if (w) {
                    if (w.constructor === String && w.match("%")) {
                        let rate = parseInt(w);
                        if (!isNaN(rate)) {
                            w = rate * realContainerWidth / 100;
                        }
                    } else {
                        w = parseInt(w);
                    }
                } else {
                    w = undefined;
                }
                region.width = w;
                let h;
                if (!this._stretch || region.control.getAttributeWatcher().getWritingTimes("height")) {
                    h = region.control._height;
                    if (h) {
                        if (h.constructor === String && h.match("%")) {
                            let rate = parseInt(h);
                            if (!isNaN(rate)) {
                                h = rate * realContainerHeight / 100;
                            }
                        } else {
                            h = parseInt(h);
                        }
                    } else {
                        h = undefined;
                    }
                } else {
                    h = realContainerHeight;
                }
                region.height = h;
                if (i > 0) {
                    cell.style.paddingLeft = (region.constraint.padding || regionPadding) + "px";
                }
                this.renderControl(region, cell, true, this._stretch);
            }
        }
        for (let regionId in domCache) {
            let cell = domCache[regionId];
            if (cell && cell.parentNode === row) {
                row.removeChild(cell);
            }
            delete domCache[regionId];
        }
        if (this._stretch) {
            let rowHeight = row.offsetHeight;
            if (rowHeight > realContainerHeight) {
                table.style.height = "";
                realContainerHeight += (rowHeight - realContainerHeight);
                for (let i = 0, len = regions.length; i < len; i++) {
                    region = regions[i];
                    let constraint = region.constraint;
                    if (constraint === dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT) {
                        continue;
                    }
                    let h = region.control._height;
                    if (h) {
                        if (h.constructor === String && h.match("%")) {
                            let rate = parseInt(h);
                            if (!isNaN(rate)) {
                                h = rate * realContainerHeight / 100;
                            }
                        }
                    }
                    if (h) {
                        region.height = h;
                        let cell = newDomCache[region.id];
                        this.resetControlDimension(region, cell, true, true);
                    }
                }
            }
        }
    }});
    dorado.widget.layout.VBoxLayout = $extend(dorado.widget.layout.AbstractBoxLayout, {$className:"dorado.widget.layout.VBoxLayout", _className:"d-vbox-layout", ATTRIBUTES:{lazyRenderChild:{}, align:{defaultValue:"left"}}, createDom:function () {
        let context = {}, dom = $DomUtils.xCreate({tagName:"TABLE", className:this._className, cellSpacing:0, cellPadding:0, content:{tagName:"TBODY", contextKey:"tbody"}}, null, context);
        this._tbody = context.tbody;
        return dom;
    }, preparePackTable:function (container: any, pack: any) {
        if (!this._packTable) {
            let context = {};
            this._packTable = $DomUtils.xCreate({tagName:"TABLE", cellSpacing:0, cellPadding:0, content:{tagName:"TR", content:{tagName:"TD", contextKey:"packCell", content:this.getDom()}}, style:{width:"100%", height:"100%"}}, null, context);
            this._packCell = context.packCell;
            container.appendChild(this._packTable);
        }
        this._packCell.style.verticalAlign = VBOX_PACKS[pack];
        this._packCell.style.align = "center";
        this._packCell.align = "center";
        return this._packTable;
    }, removePackTable:function (container: any) {
        if (this._packTable) {
            container.removeChild(this._packTable);
            container.appendChild(this.getDom());
            delete this._packTable;
            delete this._packCell;
        }
    }, refreshDom:function (dom: any) {
        let containerDom = this._dom.parentNode;
        if (this._pack === "start") {
            this.removePackTable(containerDom);
        } else {
            this.preparePackTable(containerDom, this._pack);
        }
        let table = dom, tbody = this._tbody;
        let domCache = this.domCache || {}, newDomCache = this.domCache = {};
        let padding = parseInt(this._padding) || 0, regionPadding = this._regionPadding || 0;
        if (dorado.Browser.msie && dorado.Browser.version < 8) {
            table.style.margin = padding + "px";
        } else {
            table.style.padding = padding + "px";
        }
        let clientSize = this._container.getContentContainerSize();
        let clientWidth = clientSize[0], clientHeight = clientSize[1];
        if (clientWidth > 10000) {
            clientWidth = 0;
        }
        if (clientHeight > 10000) {
            clientHeight = 0;
        }
        let realContainerWidth = clientWidth - padding * 2;
        let realContainerHeight = clientHeight - padding * 2;
        if (realContainerWidth < 0) {
            realContainerWidth = 0;
        }
        if (realContainerHeight < 0) {
            realContainerHeight = 0;
        }
        table.style.width = realContainerWidth + "px";
        let regions = this._regions.items, region, control, fakeDom, row, cell;
        let childNodeIndex = 0, overflowed;
        for (let i = 0, len = regions.length; i < len; i++) {
            region = regions[i];
            row = domCache[region.id];
            let constraint = region.constraint;
            if (constraint === dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT) {
                if (row) {
                    row.style.display = "none";
                }
                continue;
            }
            control = region.control;
            fakeDom = region.fakeDom;
            if (!control._rendered) {
                if (!fakeDom) {
                    if (containerDom && this._lazyRenderChild && (overflowed || containerDom.scrollHeight - (containerDom.scrollTop + containerDom.clientHeight) > 5)) {
                        region.fakeDom = fakeDom = document.createElement("DIV");
                        let properHeight = control.getRealHeight();
                        if (!properHeight) {
                            properHeight = FAKE_PROPER_HEIGHT;
                        }
                        $fly(fakeDom).css({width:control.getRealWidth(), height:properHeight});
                        if (!this.overflowedDoms) {
                            this.overflowedDoms = [];
                        }
                        this.overflowedDoms.push(fakeDom);
                        overflowed = true;
                    }
                } else {
                    if (containerDom && this._lazyRenderChild && (overflowed || this.getFakeDomOffsetTop(fakeDom) > (containerDom.scrollTop + containerDom.clientHeight))) {
                        let properHeight = control.getRealHeight();
                        if (!properHeight) {
                            properHeight = FAKE_PROPER_HEIGHT;
                        }
                        $fly(fakeDom).css({width:control.getRealWidth(), height:properHeight});
                        if (!this.overflowedDoms) {
                            this.overflowedDoms = [];
                        }
                        this.overflowedDoms.push(fakeDom);
                        overflowed = true;
                    }
                }
                if (!overflowed) {
                    this.ensureControlInited(control, region);
                    constraint = region.constraint;
                    if (constraint === dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT) {
                        if (row) {
                            row.style.display = "none";
                        }
                        continue;
                    }
                }
            }
            let w, div, isNewRow = false;
            if (!row) {
                row = $DomUtils.xCreate({tagName:"TR", content:{tagName:"TD", content:(function () {
                    if (dorado.Browser.msie && dorado.Browser.version < 8) {
                        return undefined;
                    } else {
                        return {tagName:"DIV", className:"d-fix-text-align", style:!dorado.Browser.webkit ? "zoom:1" : "display:table-cell"};
                    }
                })()}});
                isNewRow = true;
            } else {
                delete domCache[region.id];
            }
            newDomCache[region.id] = row;
            row.style.display = "none";
            let refRow = tbody.childNodes[childNodeIndex];
            if (refRow !== row) {
                if (row.parentNode === tbody) {
                    while (refRow && refRow !== row) {
                        tbody.removeChild(refRow);
                        refRow = refRow.nextSibling;
                    }
                } else {
                    (refRow) ? tbody.insertBefore(row, refRow) : tbody.appendChild(row);
                }
            }
            childNodeIndex++;
            row.style.display = "";
            cell = row.firstChild;
            div = (dorado.Browser.msie && dorado.Browser.version < 8) ? cell : cell.firstChild;
            if (!this._stretch || control.getAttributeWatcher().getWritingTimes("width")) {
                w = control._width;
                if (w) {
                    if (w.constructor === String && w.match("%")) {
                        let rate = parseInt(w);
                        if (!isNaN(rate)) {
                            w = rate * realContainerWidth / 100;
                        }
                    } else {
                        w = parseInt(w);
                    }
                } else {
                    w = undefined;
                }
            } else {
                w = realContainerWidth;
            }
            region.width = w;
            let h = control._height;
            if (h) {
                if (h.constructor === String && h.match("%")) {
                    let rate = parseInt(h);
                    if (!isNaN(rate)) {
                        h = rate * realContainerHeight / 100;
                    }
                } else {
                    h = parseInt(h);
                }
            } else {
                h = undefined;
            }
            region.height = h;
            cell.align = constraint.align || VBOX_ALIGNS[this._align];
            if (i > 0) {
                cell.style.paddingTop = (region.constraint.padding || regionPadding) + "px";
            }
            if (!overflowed) {
                this.renderControl(region, div, true, true);
                if (dorado.Browser.msie && dorado.Browser.version < 9 && control._rendered) {
                    if (dorado.Browser.version < 8) {
                        $fly(control.getDom()).addClass("d-fix-text-align");
                    }
                    row.appendChild(cell);
                }
            } else {
                div.appendChild(fakeDom);
            }
        }
        for (let regionId in domCache) {
            let row = domCache[regionId];
            if (row && row.parentNode === tbody) {
                tbody.removeChild(row);
            }
            delete domCache[regionId];
        }
        let tableWidth = realContainerWidth;
        if (this._stretch && (tableWidth - padding * 2) > realContainerWidth) {
            realContainerWidth += (tableWidth - padding * 2 - realContainerWidth);
            for (let i = 0, len = regions.length; i < len; i++) {
                region = regions[i];
                if (region.fakeDom || region.constraint === dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT) {
                    continue;
                }
                let w = region.control._width;
                if (w) {
                    if (w.constructor === String && w.match("%")) {
                        let rate = parseInt(w);
                        if (!isNaN(rate)) {
                            w = rate * realContainerWidth / 100;
                        }
                    }
                }
                if (w) {
                    region.width = w;
                    let div = newDomCache[region.id];
                    this.resetControlDimension(region, div, true, true);
                }
            }
        }
    }, getFakeDomOffsetTop:function (fakeDom: any) {
        let cell = (dorado.Browser.msie && dorado.Browser.version < 8) ? fakeDom.parentNode : fakeDom.parentNode.parentNode;
        return cell.offsetTop;
    }});
})();
(function () {
    let IGNORE_PROPERTIES = ["colSpan", "rowSpan", "align", "vAlign"];
    dorado.widget.layout.FormLayout = $extend(dorado.widget.layout.Layout, {$className:"dorado.widget.layout.FormLayout", _className:"d-form-layout", ATTRIBUTES:{regionClassName:{defaultValue:"d-form-layout-region"}, cols:{defaultValue:"*,*"}, rowHeight:{defaultValue:22}, colPadding:{defaultValue:6}, rowPadding:{defaultValue:6}, padding:{defaultValue:8}, stretchWidth:{}}, constructor:function (config: any) {
        this._useTable = true;
        this._currentUseTable = false;
        this._useBlankRow = true;
        $invokeSuper.call(this, [config]);
    }, createDom:function () {
        this._currentUseTable = this._useTable;
        if (this._useTable) {
            return $DomUtils.xCreate({tagName:"TABLE", className:this._className, cellSpacing:0, cellPadding:0, content:"^TBODY"});
        } else {
            return $DomUtils.xCreate({tagName:"DIV", className:this._className});
        }
    }, refreshTableLayout:function (dom: any) {
        function isSameGrid(oldGrid: any, newGrid: any) {
            if (!oldGrid) {
                return false;
            }
            if (oldGrid.length !== newGrid.length) {
                return false;
            }
            let same = true;
            for (let i = 0; i < newGrid.length && same; i++) {
                let oldRow = oldGrid[i], newRow = newGrid[i];
                if (oldRow == null || oldRow.length !== newRow.length) {
                    same = false;
                    break;
                }
                for (let j = 0; j < newRow.length; j++) {
                    let oldRegion = oldRow[j], newRegion = newRow[j];
                    if (oldRegion == null && newRegion == null) {
                        continue;
                    }
                    if (oldRegion == null || newRegion == null || oldRegion.colSpan !== newRegion.colSpan || oldRegion.rowSpan !== newRegion.rowSpan || oldRegion.regionIndex !== newRegion.regionIndex) {
                        same = false;
                        break;
                    }
                }
            }
            return same;
        }
        let tbody;
        let grid = this.precalculateRegions();
        let structureChanged = !isSameGrid(this._grid, grid);
        if (structureChanged) {
            this._domCache = {};
            this._grid = grid;
            tbody = dom.tBodies[0];
            for (let i = 0, rowNum = tbody.childNodes.length, row; i < rowNum; i++) {
                row = tbody.childNodes[i];
                for (let j = 0, cellNum = row.childNodes.length; j < cellNum; j++) {
                    let cell = row.childNodes[j];
                    if (cell.firstChild) {
                        cell.removeChild(cell.firstChild);
                    }
                }
            }
            $fly(tbody).remove();
            tbody = document.createElement("TBODY");
            dom.appendChild(tbody);
        } else {
            tbody = dom.tBodies[0];
            grid = this._grid;
        }
        this.resizeTableAndCols();
        let realColWidths = this._realColWidths;
        if (this._useBlankRow) {
            if (structureChanged) {
                let tr = document.createElement("TR");
                tr.style.height = 0;
                for (let i = 0; i < realColWidths.length; i++) {
                    let td = document.createElement("TD");
                    if(td && td.style) {
                        td.style.width = realColWidths[i] + "px";
                    }
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            } else {
                let tr = tbody.childNodes[0];
                for (let i = 0; i < realColWidths.length; i++) {
                    let td = tr.childNodes[i];
                    if(td && td.style) {
                        td.style.width = realColWidths[i] + "px";
                    }
                }
            }
        }
        let rowIndexOffset = ((this._useBlankRow) ? 1 : 0), index = -1;
        for (let row = 0; row < grid.length; row++) {
            let tr;
            if (structureChanged) {
                tr = document.createElement("TR");
                if (row === 0) {
                    tr.className = "d-form-layout-row first-row";
                } else {
                    tr.className = "d-form-layout-row";
                }
                tbody.appendChild(tr);
            } else {
                tr = tbody.childNodes[row + rowIndexOffset];
            }
            if (!dorado.Browser.webkit) {
                tr.style.height = this._rowHeight + "px";
            }
            let cols = grid[row], colIndex = 0;
            for (let col = 0; col < cols.length; col++) {
                let region = grid[row][col];
                if (region && region.regionIndex <= index) {
                    continue;
                }
                let td;
                if (structureChanged) {
                    td = this.createTableRegionContainer(region);
                    if (dorado.Browser.webkit) {
                        td.style.height = this._rowHeight + "px";
                    }
                    tr.appendChild(td);
                } else {
                    td = tr.childNodes[colIndex];
                }
                colIndex++;
                let cls = this._colClss[col];
                if (cls) {
                    $fly(td).addClass(cls);
                }
                if (region) {
                    index = region.regionIndex;
                    region.autoWidthAdjust = region.autoHeightAdjust = 0;
                    if ((col + region.colSpan) < cols.length) {
                        region.autoWidthAdjust = 0 - this._colPadding;
                    }
                    if ((row + region.rowSpan) < grid.length) {
                        region.autoHeightAdjust = 0 - this._rowPadding;
                    }
                    td.colSpan = region.colSpan;
                    td.rowSpan = region.rowSpan;
                    let w = 0;
                    if (region.colSpan > 1) {
                        let endIndex = region.colIndex + region.colSpan;
                        for (let j = region.colIndex; j < endIndex; j++) {
                            w += realColWidths[j];
                        }
                    } else {
                        w = realColWidths[region.colIndex];
                    }
                    region.width = w;
                    if (dorado.Browser.msie && dorado.Browser.version < 8) {
                        td.style.paddingTop = "0px";
                    }
                    td.style.paddingBottom = (-region.autoHeightAdjust || 0) + "px";
                    let useControlWidth = region.control.getAttributeWatcher().getWritingTimes("width") && region.control._width !== "auto";
                    this.renderControl(region, td, !useControlWidth, false);
                }
            }
        }
    }, createTableRegionContainer:function (region: any) {
        let dom = this.getRegionDom(region);
        if (!dom) {
            dom = document.createElement("TD");
            if (region) {
                this._domCache[region.id] = dom;
            }
        } else {
            if (dom.firstChild) {
                dom.removeChild(dom.firstChild);
            }
        }
        dom.className = this._regionClassName;
        if (region) {
            let $dom = $fly(dom), constraint = region.constraint;
            if (constraint.className) {
                $dom.addClass(constraint.className);
            }
            if (region.colIndex === 0) {
                $dom.addClass("first-cell");
            }
            if (constraint.align) {
                dom.align = constraint.align;
            }
            if (constraint.vAlign) {
                dom.vAlign = constraint.vAlign;
            }
            let css = dorado.Object.apply({}, constraint, function (p: any, v: any) {
                if (IGNORE_PROPERTIES.indexOf(p) >= 0) {
                    return false;
                }
            });
            $dom.css(css);
        }
        return dom;
    }, initColInfos:function () {
        this._cols = this._cols || "*";
        let colWidths = this._colWidths = [];
        let colClss = this._colClss = [];
        let dynaColCount = 0, fixedWidth = 0;
        this._cols.split(",").each(function (col: any, i: any) {
            let w, cls, ind = col.indexOf("[");
            if (ind > 0) {
                w = col.substring(0, ind);
                cls = col.substring(ind + 1);
                if (cls.charAt(cls.length - 1) === "]") {
                    cls = cls.substring(0, cls.length - 1);
                }
            } else {
                w = col;
            }
            colClss[i] = cls;
            if (w === "*") {
                colWidths.push(-1);
                dynaColCount++;
            } else {
                w = parseInt(w);
                colWidths.push(w);
                fixedWidth += (w || 0);
            }
        });
        this.colCount = colWidths.length;
        this.dynaColCount = dynaColCount;
        this.fixedWidth = fixedWidth;
    }, precalculateRegions:function () {
        function precalculateRegion(grid: any, region: any) {
            function doTestRegion() {
                for (let row = rowIndex; row < rowIndex + rowSpan && row < grid.length; row++) {
                    for (let col = colIndex; col < colIndex + colSpan; col++) {
                        if (grid[row][col]) {
                            return false;
                        }
                    }
                }
                return true;
            }
            let previousRegion = this.getPreviousRegion(region);
            let pRegionIndex = -1, pRowIndex = 0, pColIndex = -1, pColSpan = 1;
            if (previousRegion) {
                pRegionIndex = previousRegion.regionIndex;
                pRowIndex = previousRegion.rowIndex;
                pColIndex = previousRegion.colIndex;
            }
            let constraint = region.constraint;
            let rowIndex = pRowIndex, colIndex = pColIndex;
            let colSpan = ((constraint.colSpan > this.colCount) ? this.colCount : constraint.colSpan) || 1;
            let rowSpan = constraint.rowSpan || 1;
            do {
                colIndex++;
                if (colIndex + colSpan > this.colCount) {
                    rowIndex++;
                    colIndex = 0;
                }
            } while (!doTestRegion());
            for (let row = 0; row < rowSpan; row++) {
                if ((rowIndex + row) >= grid.length) {
                    grid.push(new Array(this.colCount));
                }
                for (let col = 0; col < colSpan; col++) {
                    grid[rowIndex + row][colIndex + col] = region;
                }
            }
            region.regionIndex = pRegionIndex + 1;
            region.colIndex = colIndex;
            region.rowIndex = rowIndex;
            region.colSpan = colSpan;
            region.rowSpan = rowSpan;
        }
        this.initColInfos();
        let grid = [];
        let regions = this._regions.items, region, constraint;
        for (let i = 0, len = regions.length; i < len; i++) {
            region = regions[i];
            constraint = region.constraint;
            if (constraint === dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT) {
                region.regionIndex = -1;
                continue;
            }
            constraint.colSpan = parseInt(constraint.colSpan);
            constraint.rowSpan = parseInt(constraint.rowSpan);
            precalculateRegion.call(this, grid, region);
        }
        return grid;
    }, resizeTableAndCols:function () {
        let realColWidths = this._realColWidths;
        if (!realColWidths) {
            this._realColWidths = realColWidths = [];
        }
        let table = this.getDom(), padding = parseInt(this._padding) || 0, colPadding = this._colPadding || 0;
        let containerWidth = (table.parentNode) ? (jQuery(table.parentNode).width() - padding * 2) : 0;
        if (!(containerWidth >= 0) || containerWidth > 10000) {
            containerWidth = 0;
        }
        if (!containerWidth) {
            return;
        }
        if (this._stretchWidth || this.dynaColCount > 0) {
            table.style.width = (containerWidth - $fly(table).edgeWidth()) + "px";
        }
        if (dorado.Browser.msie && dorado.Browser.version < 8) {
            table.style.margin = padding + "px";
        } else {
            table.style.padding = padding + "px";
        }
        containerWidth -= colPadding * (this._colWidths.length - 1);
        for (let i = 0; i < this._colWidths.length; i++) {
            let w = this._colWidths[i];
            if (this.dynaColCount > 0) {
                if (w === -1) {
                    w = parseInt((containerWidth - this.fixedWidth) / this.dynaColCount);
                }
                w = (w < 0) ? 0 : w;
            } else {
                if (this._stretchWidth) {
                    w = parseInt(w * containerWidth / this.fixedWidth);
                }
            }
            if (i < this._colWidths.length - 1) {
                w += colPadding;
            }
            realColWidths[i] = w;
        }
    }, refreshDivLayout:function (dom: any) {
        function getOrCreateChild(parentNode: any, index: any, tagName: any) {
            let child, refChild;
            if (index < parentNode.childNodes.length) {
                child = refChild = parentNode.childNodes[index];
            }
            if (!child || child.tagName !== tagName) {
                child = (typeof tagName === "function") ? tagName(index) : ((tagName.constructor === String) ? document.createElement(tagName) : this.xCreate(tagName));
                (refChild) ? parentNode.insertBefore(child, refChild) : parentNode.appendChild(child);
            }
            return child;
        }
        let grid = this.precalculateRegions();
        let realColWidths = this._realColWidths;
        if (!realColWidths) {
            this._realColWidths = realColWidths = [];
        }
        let padding = parseInt(this._padding) || 0, colPadding = this._colPadding || 0;
        let containerWidth = (dom.parentNode) ? (jQuery(dom.parentNode).width() - padding * 2) : 0;
        if (!(containerWidth >= 0) || containerWidth > 10000) {
            containerWidth = 0;
        }
        if (this._stretchWidth || this.dynaColCount > 0) {
            dom.style.width = containerWidth + "px";
        }
        dom.style.padding = padding + "px";
        containerWidth -= colPadding * (this._colWidths.length - 1);
        for (let i = 0; i < this._colWidths.length; i++) {
            let w = this._colWidths[i];
            if (this.dynaColCount > 0) {
                if (w === -1) {
                    w = parseInt((containerWidth - this.fixedWidth) / this.dynaColCount);
                }
                w = (w < 0) ? 0 : w;
            } else {
                if (this._stretchWidth) {
                    w = parseInt(w * containerWidth / this.fixedWidth);
                }
            }
            realColWidths[i] = w;
        }
        let index = -1, domIndex = 0;
        for (let row = 0; row < grid.length; row++) {
            let cols = grid[row];
            for (let col = 0; col < cols.length; col++) {
                let region = cols[col];
                if (!region) {
                    continue;
                }
                if (region.regionIndex <= index) {
                    if (region.regionIndex === -1) {
                        let control = region.control;
                        if (control._dom) {
                            $DomUtils.getUndisplayContainer().appendChild(control._dom);
                        }
                    }
                    continue;
                }
                index = region.regionIndex;
                let constraint = region.constraint;
                constraint.padding = parseInt(constraint.padding) || 0;
                constraint.colSpan = parseInt(constraint.colSpan) || 0;
                let div = getOrCreateChild(dom, domIndex++, "DIV"), control = region.control;
                div.className = this._regionClassName;
                div.style.display = "inline-block";
                div.style.verticalAlign = "middle";
                div.style.position = "relative";
                let cls = this._colClss[col];
                if (cls) {
                    $fly(div).addClass(cls);
                }
                let width = 0;
                if (constraint.colSpan > 1) {
                    for (let _col = col; _col < (col + constraint.colSpan) && _col < realColWidths.length; _col++) {
                        width += realColWidths[_col];
                        if (_col > col) {
                            width += this._colPadding;
                        }
                    }
                } else {
                    width = realColWidths[col];
                }
                div.style.padding = constraint.padding + "px";
                if (col > 0) {
                    div.style.marginLeft = this._colPadding + "px";
                }
                if (row > 0) {
                    let rowPaddingAdj = 4;
                    div.style.marginTop = (this._rowPadding - rowPaddingAdj) + "px";
                }
                region.width = width - constraint.padding * 2;
                div.style.width = region.width + "px";
                let useControlWidth = control.getAttributeWatcher().getWritingTimes("width") && control._width !== "auto";
                if (div.firstChild !== control.getDom()) {
                    this.renderControl(region, div, !useControlWidth, false);
                } else {
                    this.resetControlDimension(region, div, !useControlWidth, false);
                }
            }
            getOrCreateChild(dom, domIndex++, "BR");
        }
        $DomUtils.removeChildrenFrom(dom, domIndex);
    }, preprocessLayoutConstraint:function (layoutConstraint: any, control: any) {
        layoutConstraint = $invokeSuper.call(this, arguments);
        if (layoutConstraint.rowSpan > 1) {
            this._useTable = true;
        }
        return layoutConstraint;
    }, refreshDom:function (dom: any) {
        this.ensureControlsInited();
        let oldDom;
        if (this._useTable !== this._currentUseTable) {
            oldDom = dom;
            if (!this._dom) {
                this._dom = dom = this.createDom();
            }
        }
        if (this._currentUseTable) {
            this.refreshTableLayout(dom);
        } else {
            this.refreshDivLayout(dom);
        }
        if (oldDom) {
            $fly(oldDom).remove();
        }
    }});
    let p = dorado.widget.layout.FormLayout.prototype;
    p.onAddControl = p.onRemoveControl = p.doRefreshRegion = function () {
        if (!this._attached || this._disableRendering) {
            return;
        }
        this.refresh();
    };
})();

