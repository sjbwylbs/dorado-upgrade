"use strict";
// @ts-nocheck
/// <reference path="globals.d.ts" />
(function () {
    let currentException, exceptionDialog, detailExceptionDialog;
    let exceptionDialogMinWidth = 300;
    let exceptionDialogMaxWidth = 800;
    let exceptionDialogMaxHeight = 500;
    dorado.widget.UpdateAction.alertException = function (e) {
        currentException = e;
        $import("grid", function () {
            let dialog = getExceptionDialog();
            dialog.set({
                caption: $resource("dorado.baseWidget.ExceptionDialogTitle"),
                left: undefined,
                top: undefined,
                width: exceptionDialogMaxWidth,
                height: undefined,
            });
            dialog._textDom.innerText =
                dorado.Exception.getExceptionMessage(e) + "\n";
            dialog.show();
        });
    };
    function getExceptionDialog() {
        if (!exceptionDialog) {
            let doms = {};
            let contentDom = $DomUtils.xCreate({
                tagName: "DIV",
                className: "d-exception-content",
                content: [
                    {
                        tagName: "SPAN",
                        className: "d-exception-icon",
                        contextKey: "iconDom",
                    },
                    {
                        tagName: "SPAN",
                        className: "d-exception-text",
                        contextKey: "textDom",
                    },
                ],
            }, null, doms);
            exceptionDialog = new dorado.widget.Dialog({
                center: true,
                modal: true,
                resizeable: false,
                contentOverflow: "visible",
                layout: { $type: "Native" },
                buttonAlign: "right",
                buttons: [
                    {
                        caption: $resource("dorado.baseWidget.ExceptionDialogOK"),
                        width: 85,
                        onClick: function () {
                            exceptionDialog.hide();
                        },
                    },
                ],
                afterShow: function (dialog) {
                    let buttons = dialog._buttons, button;
                    if (buttons) {
                        button = buttons[0];
                        if (button && button._dom.style.display !== "none") {
                            button.setFocus();
                        }
                    }
                },
                beforeShow: function (dialog) {
                    getDetailLink().render(dialog._textDom);
                    let dom = dialog._dom;
                    let $dom = jQuery(dom), $contentDom = jQuery(contentDom);
                    let contentWidth = $fly(doms.iconDom).outerWidth() + $fly(doms.textDom).outerWidth();
                    if (contentWidth < exceptionDialogMinWidth) {
                        contentWidth = exceptionDialogMinWidth;
                    }
                    else {
                        if (contentWidth > exceptionDialogMaxWidth) {
                            contentWidth = exceptionDialogMaxWidth;
                        }
                    }
                    let dialogWidth = $dom.width(), panelWidth = $contentDom.width();
                    dialog._width = contentWidth + dialogWidth - panelWidth;
                    let contentHeight = $contentDom.outerHeight();
                    if (contentHeight > exceptionDialogMaxHeight) {
                        contentHeight = exceptionDialogMaxHeight;
                    }
                    else {
                        contentHeight = null;
                    }
                    if (contentHeight) {
                        let dialogHeight = $dom.height(), panelHeight = $contentDom.height();
                        dialog._height = contentHeight + dialogHeight - panelHeight;
                    }
                    dialog.doOnResize();
                },
                onHide: function (options) {
                    getDetailLink().unrender();
                },
            });
            let containerDom = exceptionDialog.get("containerDom");
            containerDom.appendChild(contentDom);
            exceptionDialog._contentDom = contentDom;
            exceptionDialog._iconDom = doms.iconDom;
            exceptionDialog._textDom = doms.textDom;
        }
        return exceptionDialog;
    }
    let detailLink, detailDialog;
    function getDetailLink() {
        if (!detailLink) {
            detailLink = new dorado.widget.Link({
                text: $resource("dorado.baseWidget.ShowSubmitValidationDetail"),
                onClick: function (self, arg) {
                    arg.returnValue = false;
                    try {
                        showDetailExceptionDialog(currentException);
                    }
                    catch (e) {
                        dorado.Exception.processException(e);
                    }
                },
            });
        }
        return detailLink;
    }
    function showDetailExceptionDialog(e) {
        function translateMessage(items, messages) {
            messages.each(function (message) {
                let item = dorado.Object.clone(message);
                if (item.entity && item.property) {
                    let pd = item.entity.getPropertyDef(item.property);
                    if (pd) {
                        item.propertyCaption = pd.get("label");
                    }
                }
                items.push(item);
            });
        }
        let dialog = getDetailExceptionDialog();
        let items = [], validateContext = e.validateContext;
        if (validateContext) {
            if (validateContext.error) {
                translateMessage(items, validateContext.error);
            }
            if (validateContext.warn) {
                translateMessage(items, validateContext.warn);
            }
        }
        dialog._grid.set("items", items);
        dialog.show();
    }
    function getDetailExceptionDialog() {
        if (!detailExceptionDialog) {
            let grid = new dorado.widget.Grid({
                readOnly: true,
                dynaRowHeight: true,
                columns: [
                    {
                        property: "state",
                        caption: $resource("dorado.baseWidget.SubmitValidationDetailState"),
                        width: 36,
                        align: "center",
                        onRenderCell: function (self, arg) {
                            let iconClass;
                            switch (arg.data.state) {
                                case "error":
                                    iconClass = "d-update-action-icon-error";
                                    break;
                                case "warn":
                                    iconClass = "d-update-action-icon-warn";
                                    break;
                            }
                            let $dom = $fly(arg.dom);
                            $dom
                                .empty()
                                .xCreate({
                                tagName: "LABEL",
                                className: iconClass,
                                style: { width: 16, height: 16, display: "inline-block" },
                            });
                            arg.processDefault = false;
                        },
                    },
                    {
                        property: "text",
                        caption: $resource("dorado.baseWidget.SubmitValidationDetailMessage"),
                        wrappable: true,
                    },
                    {
                        property: "property",
                        caption: $resource("dorado.baseWidget.SubmitValidationDetailProperty"),
                        width: 200,
                        resizeable: true,
                        onRenderCell: function (self, arg) {
                            if (arg.data.propertyCaption &&
                                arg.data.propertyCaption !== arg.data.property) {
                                arg.dom.innerText =
                                    arg.data.propertyCaption + "(" + arg.data.property + ")";
                                arg.processDefault = false;
                            }
                            else {
                                arg.processDefault = true;
                            }
                        },
                    },
                ],
                onDataRowDoubleClick: function (self, arg) {
                    let currentItem = self.get("currentEntity");
                    if (currentItem && currentItem.entity) {
                        currentItem.entity.setCurrent(true);
                    }
                },
            });
            detailExceptionDialog = new dorado.widget.Dialog({
                caption: $resource("dorado.baseWidget.ShowSubmitValidationDetail"),
                width: 800,
                height: 280,
                center: true,
                modal: true,
                resizeable: true,
                layout: { regionPadding: 8 },
                children: [
                    {
                        $type: "Tip",
                        text: $resource("dorado.baseWidget.SubmitValidationDetailTip"),
                        floating: false,
                        arrowDirection: "bottom",
                        arrowAlign: "left",
                    },
                    grid,
                ],
            });
            detailExceptionDialog._grid = grid;
        }
        return detailExceptionDialog;
    }
})();
(function () {
    let BUTTON_HOVER_CLASS = "-hover", BUTTON_CLICK_CLASS = "-click", BUTTON_TOGGLED_CLASS = "-toggled", BUTTON_TRIGGER_CLASS = "-trigger", ICON_CLASS = "d-icon";
    dorado.widget.Button = $extend(dorado.widget.AbstractButton, {
        $className: "dorado.widget.Button",
        tabStop: true,
        ATTRIBUTES: {
            className: { defaultValue: "d-button" },
            caption: {},
            icon: {},
            iconClass: {},
            triggerToggled: {},
            showTrigger: { writeBeforeReady: true },
            splitButton: { writeBeforeReady: true },
            width: { independent: true },
            height: { independent: true, readOnly: true },
        },
        EVENTS: { onTriggerClick: {} },
        needSplit: function () {
            return (this._showTrigger !== false &&
                (this._splitButton === true ||
                    (this._splitButton !== false &&
                        !!(this.getListenerCount("onClick") && this._menu))));
        },
        doOnKeyDown: function (event) {
            let retValue = true;
            let button = this;
            if (event.keyCode === 32) {
                button.fireEvent("onClick", button);
                retValue = false;
            }
            else {
                if (event.keyCode === 13) {
                    if (!$setting["common.enterAsTab"]) {
                        button.fireEvent("onClick", button);
                        retValue = false;
                    }
                }
            }
            return retValue;
        },
        doSetToggle: function () {
            let button = this, dom = button._dom, doms = button._doms, cls = button._className;
            if (dom) {
                if (button._toggled) {
                    $fly(dom).addClass(cls + BUTTON_TOGGLED_CLASS);
                    $fly(doms.buttonLeft).addClass("button-left-toggled");
                    $fly(doms.buttonRight).addClass(button.needSplit() ? "" : "button-right-toggled");
                }
                else {
                    $fly(dom).removeClass(cls + BUTTON_TOGGLED_CLASS);
                    $fly(doms.buttonLeft).removeClass("button-left-toggled");
                    $fly(doms.buttonRight).removeClass("button-right-toggled");
                }
            }
        },
        doShowMenu: function () {
            let button = this, menu = button._menu, dom = button._dom, doms = button._doms, cls = button._className;
            if (menu) {
                menu.bind("onShow", function () {
                    if (button._toggleOnShowMenu && !button._triggerToggled) {
                        if (!button.needSplit()) {
                            $fly(dom).addClass(cls + BUTTON_TOGGLED_CLASS);
                            $fly(doms.buttonLeft).addClass("button-left-toggled");
                            $fly(doms.buttonRight).addClass("button-right-toggled");
                        }
                        else {
                            $fly(doms.buttonRight).addClass("button-right-toggled");
                        }
                        button._triggerToggled = true;
                    }
                    menu.bind("onHide", function () {
                        button.doAfterMenuHide();
                    }, { once: true });
                    if (!menu.doBeforeHide) {
                        menu.doBeforeHide = function () {
                            button.doBeforeMenuHide && button.doBeforeMenuHide();
                        };
                    }
                }, { once: true });
                menu._focusParent = button;
                menu.show({
                    anchorTarget: button,
                    align: "innerleft",
                    vAlign: "bottom",
                });
            }
        },
        doAfterMenuHide: function () {
            let button = this, dom = button._dom;
            if (button._toggleOnShowMenu) {
                if (!button.needSplit()) {
                    $fly(dom).removeClass(button._className + BUTTON_TOGGLED_CLASS);
                    $fly(button._doms.buttonLeft).removeClass("button-left-toggled");
                    $fly(button._doms.buttonRight).removeClass("button-right-toggled");
                }
                else {
                    $fly(button._doms.buttonRight).removeClass("button-right-toggled");
                }
                button._triggerToggled = false;
            }
        },
        _createIconSpan: function (dom) {
            let button = this, doms = button._doms, action = button._action || {};
            dom = dom || button._dom;
            if (dom) {
                let icon = document.createElement("span");
                icon.className = ICON_CLASS;
                icon.innerHTML = "&nbsp;";
                $fly(icon)
                    .prependTo(doms.buttonLeft)
                    .addClass(button._iconClass || action._iconClass);
                $DomUtils.setBackgroundImage(icon, button._icon || action._icon);
                doms.icon = icon;
            }
        },
        onClick: function () {
            let button = this, action = button._action || {}, disabled = button._disabled || action._disabled || action._sysDisabled;
            if (!disabled) {
                $invokeSuper.call(this, arguments);
                if (this._menu && this.getListenerCount("onClick") === 0) {
                    this.doShowMenu();
                }
            }
        },
        doOnResize: function () {
            if (dorado.Browser.msie && dorado.Browser.version < 7) {
                let button = this, dom = button._dom, width = button.getRealWidth();
                if (dom && width != null) {
                    $fly(dom).width(width);
                    let leftWidth = dom.offsetWidth -
                        button._doms.buttonRight.offsetWidth -
                        parseInt($fly(button._doms.buttonLeft).css("margin-left"), 10);
                    if (leftWidth > 0) {
                        $fly(button._doms.buttonLeft).outerWidth(leftWidth);
                    }
                }
            }
        },
        onDisabledChange: function () {
            let button = this, dom = button._dom, cls = button._className;
            if (dom) {
                $fly(dom)
                    .removeClass(cls + BUTTON_HOVER_CLASS)
                    .removeClass(cls + "-focused");
                $fly(button._doms.buttonLeft).removeClass("button-left-hover");
                $fly(button._doms.buttonRight).removeClass("button-right-hover");
            }
        },
        createDom: function () {
            let button = this, cls = button._className, doms = {}, action = button._action || {};
            let dom = $DomUtils.xCreate({
                tagName: "span",
                content: [
                    {
                        tagName: "span",
                        className: "button-left",
                        contextKey: "buttonLeft",
                        content: {
                            tagName: "span",
                            className: "caption",
                            content: button._caption || action._caption,
                            contextKey: "caption",
                        },
                    },
                    {
                        tagName: "span",
                        className: "button-right",
                        contextKey: "buttonRight",
                    },
                ],
            }, null, doms);
            button._doms = doms;
            $fly(doms.buttonLeft)
                .hover(function () {
                let action = button._action || {}, disabled = button._disabled || action._disabled || action._sysDisabled;
                if (!disabled && !button._toggled) {
                    $fly(dom).addClass(cls + BUTTON_HOVER_CLASS);
                    $fly(doms.buttonLeft).addClass("button-left-hover");
                    $fly(doms.buttonRight).addClass(button.needSplit() ? "" : "button-right-hover");
                }
            }, function () {
                $fly(dom).removeClass(cls + BUTTON_HOVER_CLASS);
                $fly(doms.buttonLeft).removeClass("button-left-hover");
                $fly(doms.buttonRight).removeClass("button-right-hover");
            })
                .mousedown(function () {
                let action = button._action || {}, disabled = button._disabled || action._disabled || action._sysDisabled;
                if (!disabled) {
                    $fly(dom).addClass(cls + BUTTON_CLICK_CLASS);
                    $fly(doms.buttonLeft).addClass("button-left-click");
                    $fly(doms.buttonRight).addClass(button.needSplit() ? "" : "button-right-click");
                    $fly(document).one("mouseup", function () {
                        $fly(dom).removeClass(cls + BUTTON_CLICK_CLASS);
                        $fly(doms.buttonLeft).removeClass("button-left-click");
                        $fly(doms.buttonRight).removeClass("button-right-click");
                    });
                }
            });
            $fly(doms.buttonRight)
                .hover(function () {
                let action = button._action || {}, disabled = button._disabled || action._disabled || action._sysDisabled;
                if (!disabled) {
                    $fly(dom).addClass(button.needSplit() ? "" : cls + BUTTON_HOVER_CLASS);
                    $fly(doms.buttonLeft).addClass(button.needSplit() ? "" : "button-left-hover");
                    $fly(doms.buttonRight).addClass("button-right-hover");
                }
            }, function () {
                $fly(dom).removeClass(cls + BUTTON_HOVER_CLASS);
                $fly(doms.buttonLeft).removeClass("button-left-hover");
                $fly(doms.buttonRight).removeClass("button-right-hover");
            })
                .mousedown(function () {
                let action = button._action || {}, disabled = button._disabled || action._disabled || action._sysDisabled;
                if (!disabled) {
                    $fly(dom).addClass(button.needSplit() ? "" : cls + BUTTON_CLICK_CLASS);
                    $fly(doms.buttonLeft).addClass(button.needSplit() ? "" : "button-left-click");
                    $fly(doms.buttonRight).addClass("button-right-click");
                    $fly(document).one("mouseup", function () {
                        $fly(dom).removeClass(cls + BUTTON_CLICK_CLASS);
                        $fly(doms.buttonLeft).removeClass("button-left-click");
                        $fly(doms.buttonRight).removeClass("button-right-click");
                    });
                }
            })
                .click(function (event) {
                let action = button._action || {}, disabled = button._disabled || action._disabled || action._sysDisabled;
                if (!disabled) {
                    button.fireEvent("onTriggerClick", button);
                    if (button._menu) {
                        button.doShowMenu();
                    }
                    else {
                        if (button.onClick(event) === false) {
                            return false;
                        }
                        button.fireEvent("onClick", button, {
                            button: event.button,
                            event: event,
                        });
                    }
                }
                event.stopImmediatePropagation();
            });
            if (button._toggleable) {
                if (button._toggled) {
                    $fly(dom).addClass(button._className + BUTTON_TOGGLED_CLASS);
                    $fly(doms.buttonLeft).addClass("button-left-toggled");
                    $fly(doms.buttonRight).addClass(button.needSplit() ? "" : "button-right-toggled");
                }
                else {
                    $fly(dom).removeClass(button._className + BUTTON_TOGGLED_CLASS);
                    $fly(doms.buttonLeft).removeClass("button-left-toggled");
                    $fly(doms.buttonRight).removeClass("button-right-toggled");
                }
            }
            $fly(dom)
                .toggleClass("d-button-trigger " + cls + BUTTON_TRIGGER_CLASS, button._showTrigger === true ||
                (!!button._menu && button._showTrigger !== false))
                .toggleClass(cls + "-disabled", !!(button._disabled || action._disabled || action._sysDisabled));
            let icon = button._icon || action._icon, iconCls = button._iconClass || action._iconClass;
            if (icon || iconCls) {
                button._createIconSpan(dom);
            }
            return dom;
        },
        refreshDom: function (dom) {
            $invokeSuper.call(this, arguments);
            let button = this, cls = button._className, doms = button._doms, action = button._action || {}, disabled = button._disabled || action._disabled || action._sysDisabled;
            $fly(button._doms.caption).html(button._caption || action._caption);
            button._dom.disabled = disabled;
            $fly(dom)
                .toggleClass("d-button-trigger " + cls + BUTTON_TRIGGER_CLASS, button._showTrigger === true ||
                (!!button._menu && button._showTrigger !== false))
                .toggleClass(cls + "-disabled", !!(button._disabled || action._disabled || action._sysDisabled));
            if (button._toggleable) {
                if (button._toggled) {
                    $fly(dom).addClass(cls + BUTTON_TOGGLED_CLASS);
                    $fly(doms.buttonLeft).addClass("button-left-toggled");
                    $fly(doms.buttonRight).addClass(button.needSplit() ? "" : "button-right-toggled");
                }
                else {
                    $fly(dom).removeClass(cls + BUTTON_TOGGLED_CLASS);
                    $fly(doms.buttonLeft).removeClass("button-left-toggled");
                    $fly(doms.buttonRight).removeClass("button-right-toggled");
                }
            }
            else {
                if (!button.needSplit()) {
                    $fly(dom).toggleClass(cls + BUTTON_TOGGLED_CLASS, !!button._triggerToggled);
                    $fly(doms.buttonLeft).toggleClass("button-left-toggled", !!button._triggerToggled);
                    $fly(doms.buttonRight).toggleClass("button-right-toggled", !!button._triggerToggled);
                }
                else {
                    $fly(doms.buttonRight).toggleClass("button-right-toggled", !!button._triggerToggled);
                }
            }
            let icon = button._icon || action._icon, iconCls = button._iconClass || action._iconClass;
            if (!icon && !iconCls && doms.icon) {
                $fly(doms.icon).css("display", "none");
            }
            else {
                if (doms.icon) {
                    $fly(doms.icon).prop("className", ICON_CLASS).css("display", "");
                }
                if ((icon || iconCls) && !doms.icon) {
                    button._createIconSpan();
                }
                if (doms.icon) {
                    $DomUtils.setBackgroundImage(doms.icon, icon);
                }
                if (iconCls) {
                    $fly(doms.icon).addClass(iconCls);
                }
            }
            button.onResize();
        },
    });
})();
(function () {
    let MENU_ITEM_DISABLED_CLASS = "menu-item-disabled", CHECKED_ICON = "checked-icon", UN_CHECKED_ICON = "unchecked-icon", HAS_GROUP_CLASS = "has-subgroup", MENU_ITEM_OVER_CLASS = "menu-item-hover";
    dorado.widget.menu = {};
    dorado.widget.menu.AbstractMenuItem = $extend(dorado.widget.RenderableViewElement, {
        $className: "dorado.widget.menu.AbstractMenuItem",
        ATTRIBUTES: {
            name: {},
            parent: { readOnly: true },
            visible: {
                defaultValue: true,
                setter: function (value) {
                    let item = this, dom = item._dom;
                    item._visible = value;
                    if (dom) {
                        dom.style.display = value ? "" : "none";
                    }
                },
            },
        },
        getTopMenu: function () {
            let menu = this._parent, opener = menu.opener, result;
            while (opener) {
                let parent = opener._parent;
                if (opener instanceof dorado.widget.menu.AbstractMenuItem &&
                    parent instanceof dorado.widget.Menu) {
                    result = parent;
                }
                opener = parent ? parent.opener : null;
            }
            return result;
        },
    });
    dorado.widget.menu.Separator = $extend(dorado.widget.menu.AbstractMenuItem, {
        $className: "dorado.widget.menu.Separator",
        ATTRIBUTES: { className: { defaultValue: "menu-item-separator" } },
        createDom: function () {
            let item = this, dom = document.createElement("li");
            dom.className = item._className;
            dom.style.display = item._visible ? "" : "none";
            return dom;
        },
        refreshDom: function (dom) {
            let item = this;
            if (dom) {
                dom.style.display = item._visible ? "" : "none";
            }
        },
    });
    dorado.widget.menu.TextMenuItem = $extend([dorado.widget.menu.AbstractMenuItem, dorado.widget.ActionSupport], {
        $className: "dorado.widget.menu.TextMenuItem",
        ATTRIBUTES: {
            hideOnClick: { defaultValue: true },
            className: { defaultValue: "menu-item" },
            disabled: {},
            caption: {},
            icon: {},
            iconClass: {},
            action: { componentReference: true },
        },
        EVENTS: { onClick: {} },
        doOnRemove: function () {
            this.set("action", null);
            this._dom && $fly(this._dom).remove();
        },
        refreshDom: function (dom) {
            let item = this, action = item._action || {}, disabled = item._disabled || action._disabled || action._sysDisabled, icon = item._icon || action._icon, iconCls = item._iconClass || action._iconClass, doms = item._doms;
            $fly(dom)[disabled ? "addClass" : "removeClass"](MENU_ITEM_DISABLED_CLASS)
                .css("display", item._visible ? "" : "none");
            $fly(doms.caption).text(item._caption || action._caption);
            if (icon) {
                $DomUtils.setBackgroundImage(doms.icon, icon);
            }
            else {
                $fly(doms.icon).css("background-image", "");
            }
            $fly(doms.icon).prop("className", "d-icon");
            if (iconCls) {
                $fly(doms.icon).addClass(iconCls);
            }
        },
        createDom: function () {
            let item = this, action = item._action || {}, doms = {}, dom = $DomUtils.xCreate({
                tagName: "li",
                className: "menu-item",
                content: {
                    tagName: "span",
                    className: "menu-item-content",
                    contextKey: "itemContent",
                    content: [
                        {
                            tagName: "span",
                            className: "d-icon",
                            contextKey: "icon",
                            content: "&nbsp;",
                        },
                        {
                            tagName: "span",
                            className: "caption",
                            content: item._caption || action._caption,
                            contextKey: "caption",
                        },
                    ],
                },
            }, null, doms), disabled = item._disabled || action._disabled || action._sysDisabled, icon = item._icon || action._icon;
            item._doms = doms;
            $fly(dom)
                .css("display", item._visible ? "" : "none")
                .addClass(disabled ? MENU_ITEM_DISABLED_CLASS : "")
                .hover(function () {
                item._parent.focusItem(item, true);
            }, dorado._NULL_FUNCTION);
            if (icon) {
                $DomUtils.setBackgroundImage(doms.icon, icon);
            }
            else {
                $fly(doms.icon).css("background-image", "");
            }
            return dom;
        },
        hideTopMenu: function () {
            let item = this;
            if (item._parent) {
                item._parent.hideTopMenu();
            }
        },
    });
    dorado.widget.menu.ControlMenuItem = $extend(dorado.widget.menu.TextMenuItem, {
        $className: "dorado.widget.menu.ControlMenuItem",
        focusable: true,
        tabStop: true,
        ATTRIBUTES: {
            control: {
                setter: function (control) {
                    if (this._control) {
                        this.unregisterInnerViewElement(this._control);
                    }
                    if (!(control instanceof dorado.widget.Control)) {
                        control = dorado.Toolkits.createInstance("widget", control, function (type) {
                            return dorado.Toolkits.getPrototype("widget");
                        });
                    }
                    if (control) {
                        this.unregisterInnerViewElement(control);
                    }
                    this._control = control;
                },
            },
            view: {
                setter: function (view) {
                    $invokeSuper.call(this, arguments);
                    if (this._control) {
                        this._control.set("view", view);
                    }
                },
            },
        },
        createDom: function () {
            let item = this, dom = $invokeSuper.call(this, arguments);
            $fly(dom)
                .click(function (event) {
                item.onClick(event);
            })
                .addClass(item._control ? HAS_GROUP_CLASS : "");
            return dom;
        },
        hideControl: function () {
            let item = this;
            if (item._showControlTimer) {
                clearTimeout(item._showControlTimer);
                item._showControlTimer = null;
            }
            else {
                if (item._control) {
                    item._control.hide();
                }
            }
        },
        onSelect: function () {
            let item = this;
            item.hideControl();
            item.hideTopMenu();
        },
        onClick: function () {
            let item = this, action = item._action || {}, disabled = item._disabled || action._disabled || action._sysDisabled;
            if (!disabled) {
                action.execute && action.execute();
                item.fireEvent("onClick", item);
            }
        },
        onFocus: function () {
            let item = this, dom = item._dom;
            $fly(dom).addClass(MENU_ITEM_OVER_CLASS);
            item.showControl();
        },
        showControl: function () {
            let item = this;
            if (item._control) {
                item._showControlTimer = setTimeout(function () {
                    item._control.show({
                        anchorTarget: item,
                        align: "right",
                        vAlign: "innertop",
                        delay: 300,
                        onHide: function (self) {
                            self.opener = null;
                        },
                    });
                    item._control._focusParent = item._parent;
                    item._control.opener = item;
                    item._showControlTimer = null;
                }, 300);
            }
        },
        onBlur: function () {
            let item = this, dom = item._dom;
            $fly(dom).removeClass(MENU_ITEM_OVER_CLASS);
            item.hideControl();
        },
    });
    dorado.widget.menu.MenuItem = $extend(dorado.widget.menu.TextMenuItem, {
        $className: "dorado.widget.menu.MenuItem",
        focusable: true,
        tabStop: true,
        ATTRIBUTES: {
            submenu: {
                setter: function (value) {
                    if (this._submenu) {
                        this.unregisterInnerViewElement(this._submenu);
                    }
                    let submenu;
                    if (!value) {
                        submenu = null;
                    }
                    else {
                        if (value.constructor === Object.prototype.constructor) {
                            submenu = new dorado.widget.Menu(value);
                        }
                        else {
                            if (value instanceof dorado.widget.Menu) {
                                submenu = value;
                            }
                        }
                    }
                    if (submenu) {
                        this.registerInnerViewElement(submenu);
                    }
                    this._submenu = submenu;
                    let dom = this._dom;
                    if (dom) {
                        $fly(dom)[this._submenu ? "addClass" : "removeClass"](HAS_GROUP_CLASS);
                    }
                },
            },
            items: {
                getter: function () {
                    if (this._submenu) {
                        return this._submenu.get("items");
                    }
                    return null;
                },
                setter: function (value) {
                    let parentItem = this, submenu = parentItem._submenu;
                    if (value.constructor === Array.prototype.constructor) {
                        let originSkipRefresh;
                        if (submenu) {
                            originSkipRefresh = submenu._skipRefresh;
                            submenu._skipRefresh = true;
                        }
                        parentItem.clearItems();
                        value.each(function (item) {
                            parentItem.addItem(item);
                        });
                        if (submenu) {
                            submenu._skipRefresh = originSkipRefresh;
                        }
                    }
                },
            },
        },
        doGet: function (attr) {
            let c = attr.charAt(0);
            if (c === "#" || c === "&") {
                let itemName = attr.substring(1);
                return this.getItem(itemName);
            }
            else {
                return $invokeSuper.call(this, [attr]);
            }
        },
        hasSubmenu: function () {
            return !!this._submenu;
        },
        getItem: function (name) {
            let menuItem = this, submenu = menuItem._submenu;
            if (submenu) {
                return submenu.getItem(name);
            }
            return null;
        },
        addItem: function (item, index) {
            let menuItem = this, submenu = menuItem._submenu;
            if (item) {
                if (!submenu) {
                    submenu = new dorado.widget.Menu();
                    menuItem.set("submenu", submenu);
                }
                submenu.addItem(item, index);
            }
        },
        removeItem: function (item) {
            let menuItem = this, submenu = menuItem._submenu;
            if (item != null && submenu) {
                submenu.removeItem(item);
            }
        },
        clearItems: function () {
            let menuItem = this, submenu = menuItem._submenu;
            if (submenu) {
                submenu.clearItems();
            }
        },
        onFocus: function (showSubmenu) {
            let item = this, dom = item._dom;
            $fly(dom).addClass(MENU_ITEM_OVER_CLASS);
            if (item._submenu && showSubmenu) {
                item.showSubmenu();
            }
        },
        onBlur: function () {
            let item = this, dom = item._dom;
            $fly(dom).removeClass(MENU_ITEM_OVER_CLASS);
            if (item._submenu) {
                item.hideSubmenu();
            }
        },
        showSubmenu: function (focusfirst) {
            let item = this, submenu = item._submenu;
            if (submenu) {
                item._showSubmenuTimer = setTimeout(function () {
                    let owner = item._parent;
                    if (owner &&
                        owner.getListenerCount("onContextMenu") > 0 &&
                        submenu.getListenerCount("onContextMenu") === 0) {
                        let handles = item._parent._events["onContextMenu"];
                        for (let i = 0, j = handles.length; i < j; i++) {
                            let handler = handles[i];
                            submenu.bind("onContextMenu", handler.listener, handler.options);
                        }
                        submenu._inheritContextMenu = true;
                    }
                    if (submenu._parent !== owner) {
                        owner.registerInnerControl(submenu);
                    }
                    submenu.show({
                        anchorTarget: item,
                        align: "right",
                        vAlign: "innertop",
                        focusFirst: focusfirst,
                    });
                    submenu._focusParent = item._parent;
                    item._showSubmenuTimer = null;
                }, 300);
            }
        },
        onClick: function (event) {
            let item = this, action = item._action || {}, disabled = item._disabled || action._disabled || action._sysDisabled;
            if (!disabled) {
                if (item.hasSubmenu()) {
                    action.execute && action.execute();
                    item.fireEvent("onClick", item);
                }
                else {
                    action.execute && action.execute();
                    item.fireEvent("onClick", item);
                    if (item._hideOnClick) {
                        item._parent.hideTopMenu();
                    }
                }
            }
        },
        hideSubmenu: function () {
            let item = this, submenu = this._submenu;
            if (submenu) {
                if (item._showSubmenuTimer) {
                    clearTimeout(item._showSubmenuTimer);
                    item._showSubmenuTimer = null;
                }
                else {
                    if (submenu._inheritContextMenu) {
                        submenu.clearListeners("onContextMenu");
                    }
                    submenu.hide();
                }
            }
        },
        createDom: function () {
            let item = this, dom = $invokeSuper.call(this, arguments);
            $fly(dom)
                .click(function (event) {
                item.onClick(event);
            })
                .addClass(item.hasSubmenu() ? HAS_GROUP_CLASS : "");
            return dom;
        },
    });
    dorado.widget.menu.MenuItem.prototype.removeChild =
        dorado.widget.menu.MenuItem.prototype.removeItem;
    dorado.widget.menu.CheckGroupManager = {
        groups: {},
        addCheckItem: function (groupName, item) {
            if (!groupName || !item) {
                return;
            }
            let manager = this, groups = manager.groups, group = groups[groupName];
            if (!group) {
                group = groups[groupName] = { current: null, items: [] };
            }
            group.items.push(item);
            if (item._checked) {
                dorado.widget.menu.CheckGroupManager.setGroupCurrent(groupName, item);
            }
        },
        removeCheckItem: function (groupName, item) {
            if (!groupName || !item) {
                return;
            }
            let manager = this, groups = manager.groups, group = groups[groupName];
            if (group) {
                if (group.current === item) {
                    group.current = null;
                }
                group.items.remove(item);
            }
        },
        setGroupCurrent: function (groupName, item) {
            if (!groupName || !item) {
                return;
            }
            let manager = this, groups = manager.groups, group = groups[groupName];
            if (group) {
                let current = group.current;
                if (current === item) {
                    return;
                }
                if (current instanceof dorado.widget.menu.CheckableMenuItem) {
                    current.set("checked", false);
                }
                group.current = item;
            }
        },
    };
    dorado.widget.menu.CheckableMenuItem = $extend(dorado.widget.menu.MenuItem, {
        $className: "dorado.widget.menu.CheckableMenuItem",
        ATTRIBUTES: {
            checked: {
                setter: function (value) {
                    let item = this;
                    if (value && item._group) {
                        dorado.widget.menu.CheckGroupManager.setGroupCurrent(item._group, item);
                    }
                    item._checked = value;
                },
            },
            group: {
                setter: function (value) {
                    let item = this, oldValue = item._group;
                    if (oldValue) {
                        dorado.widget.menu.CheckGroupManager.removeCheckItem(oldValue, item);
                    }
                    if (value) {
                        dorado.widget.menu.CheckGroupManager.addCheckItem(value, item);
                    }
                    item._group = value;
                },
            },
        },
        EVENTS: { onCheckedChange: {} },
        refreshDom: function (dom) {
            $invokeSuper.call(this, arguments);
            let item = this;
            if (item._dom) {
                if (item._checked) {
                    $fly(item._doms.icon)
                        .removeClass(UN_CHECKED_ICON)
                        .addClass(CHECKED_ICON);
                }
                else {
                    $fly(item._doms.icon)
                        .removeClass(CHECKED_ICON)
                        .addClass(UN_CHECKED_ICON);
                }
            }
        },
        onClick: function () {
            let item = this, parent = item._parent, action = item._action || {}, disabled = item._disabled || action._disabled || action._sysDisabled;
            if (!disabled) {
                action.execute && action.execute();
                item.fireEvent("onClick", item);
                if (!item.hasSubmenu() && item._hideOnClick) {
                    parent.hideTopMenu();
                }
                item.set("checked", !item._checked);
                item.fireEvent("onCheckedChange", item);
            }
        },
        createDom: function () {
            let item = this, dom = $invokeSuper.call(this, arguments);
            $fly(item._doms.icon).addClass(item._checked ? CHECKED_ICON : UN_CHECKED_ICON);
            $fly(dom).hover(function () {
                item._parent.focusItem(item, true);
            }, dorado._NULL_FUNCTION);
            return dom;
        },
    });
    dorado.Toolkits.registerPrototype("menu", {
        "-": dorado.widget.menu.Separator,
        Separator: dorado.widget.menu.Separator,
        Checkable: dorado.widget.menu.CheckableMenuItem,
        Control: dorado.widget.menu.ControlMenuItem,
        Default: dorado.widget.menu.MenuItem,
    });
})();
(function () {
    let GROUP_CONTENT_CLASS = "group-content", GROUP_OVERFLOW_CLASS = "d-menu-overflow";
    let SKIP_REFRESH = false;
    dorado.widget.AbstractMenu = $extend([dorado.widget.Control, dorado.widget.FloatControl], {
        $className: "dorado.widget.AbstractMenu",
        ATTRIBUTES: {
            items: {
                setter: function (value) {
                    let menu = this, items = menu._items, doms = menu._doms, rendered = menu._rendered, i, l;
                    if (items) {
                        menu.clearItems();
                    }
                    if (value && value instanceof Array) {
                        let originSkipRefresh = menu._skipRefresh;
                        menu._skipRefresh = true;
                        for (i = 0, l = value.length; i < l; i++) {
                            menu.addItem(value[i]);
                        }
                        menu._skipRefresh = originSkipRefresh;
                        if (rendered) {
                            menu.refresh();
                        }
                    }
                },
            },
        },
        doGet: function (attr) {
            let c = attr.charAt(0);
            if (c === "#" || c === "&") {
                let itemName = attr.substring(1);
                return this.getItem(itemName);
            }
            else {
                return $invokeSuper.call(this, [attr]);
            }
        },
        addItem: function (item, index) {
            let menu = this, items = menu._items, doms = menu._doms, refItem;
            items = menu._items = items
                ? menu._items
                : new dorado.util.KeyedArray(function (value) {
                    return value._name;
                });
            if (item.constructor === Object.prototype.constructor ||
                typeof item === "string") {
                item = menu.createMenuItem(item);
            }
            else {
                item._parent = menu;
            }
            menu.registerInnerViewElement(item);
            item._parent = menu;
            if (typeof index === "number") {
                items.insert(item, index);
                refItem = items.get(index + 1);
            }
            else {
                if (index instanceof dorado.widget.menu.AbstractMenuItem) {
                    refItem = items.indexOf(index);
                    if (index !== -1) {
                        items.insert(item, index);
                    }
                    else {
                        throw new dorado.ResourceException("dorado.base.ItemNotInGroup");
                    }
                }
                else {
                    items.insert(item);
                }
            }
            if (!menu._skipRefresh) {
                menu.refresh();
            }
            return item;
        },
        getItem: function (name) {
            let menu = this, items = menu._items;
            if (items) {
                if (typeof name === "number" || typeof name === "string") {
                    return items.get(name);
                }
                else {
                    return name;
                }
            }
            return null;
        },
        findItem: function (path) {
            let menu = this, items = menu._items, item, itemgroup, i, j;
            if (!items) {
                return null;
            }
            if (typeof path === "string") {
                let index = path.indexOf("/"), mainpath, subpath;
                if (index !== -1) {
                    mainpath = path.substring(0, index);
                    subpath = path.substring(index + 1);
                }
                else {
                    mainpath = path;
                }
                if (subpath) {
                    for (i = 0, j = items.size; i < j; i++) {
                        item = items.get(i);
                        if (item._name === mainpath) {
                            itemgroup = item._submenu;
                            if (itemgroup) {
                                return itemgroup.findItem(subpath);
                            }
                        }
                    }
                }
                else {
                    for (i = 0, j = items.size; i < j; i++) {
                        item = items.get(i);
                        if (item._name === mainpath) {
                            return item;
                        }
                    }
                    return null;
                }
            }
            return null;
        },
        removeItem: function (item) {
            let menu = this, items = menu._items, dom;
            if (items) {
                if (typeof item === "number" || typeof item === "string") {
                    item = items.get(item);
                }
                if (item) {
                    item.doOnRemove && item.doOnRemove();
                    menu.unregisterInnerViewElement(item);
                    items.remove(item);
                }
            }
            if (!menu._skipRefresh) {
                menu.refresh();
            }
            return item;
        },
        clearItems: function (deep) {
            let menu = this, items = menu._items, dom;
            if (items) {
                let originSkipRefresh = menu._skipRefresh;
                menu._skipRefresh = true;
                let innerItems = items.items;
                for (let i = innerItems.length - 1; i >= 0; i--) {
                    let item = innerItems[i];
                    if (deep && item instanceof dorado.widget.menu.MenuItem) {
                        let subGroup = item._submenu;
                        if (subGroup) {
                            subGroup.clearItems(deep);
                            subGroup.destroy();
                        }
                    }
                    item.unrender();
                    item.doOnRemove && item.doOnRemove();
                    menu.unregisterInnerViewElement(item);
                    items.removeAt(i);
                }
                menu._skipRefresh = originSkipRefresh;
                menu.refresh();
            }
        },
        getTopMenu: function () {
            let menu = this, opener = menu.opener, result = menu;
            while (opener) {
                let parent = opener._parent;
                if (opener instanceof dorado.widget.menu.AbstractMenuItem &&
                    parent instanceof dorado.widget.Menu) {
                    result = parent;
                }
                opener = parent ? parent.opener : null;
            }
            return result;
        },
    });
    dorado.widget.AbstractMenu.prototype.removeChild =
        dorado.widget.AbstractMenu.prototype.removeItem;
    dorado.widget.Menu = $extend(dorado.widget.AbstractMenu, {
        $className: "dorado.widget.Menu",
        tabStop: true,
        selectable: false,
        ATTRIBUTES: {
            className: { defaultValue: "d-menu" },
            floatingClassName: { defaultValue: "d-menu-floating" },
            visible: { defaultValue: false },
            animateType: { defaultValue: "slide", skipRefresh: true },
            hideAnimateType: { defaultValue: "fade", skipRefresh: true },
            iconPosition: { defaultValue: "left" },
            iconSize: { defaultValue: "normal" },
            focusItem: {},
        },
        EVENTS: { onHideTopMenu: {}, onClick: {} },
        createMenuItem: function (config) {
            if (!config) {
                return null;
            }
            let menu = this, item;
            if (config instanceof dorado.widget.menu.AbstractMenuItem) {
                item = config;
            }
            else {
                item = dorado.Toolkits.createInstance("menu", config);
            }
            return item;
        },
        createOverflowArrow: function () {
            let menu = this, dom = menu._dom, doms = menu._doms;
            if (dom) {
                let topArrow = $DomUtils.xCreate({
                    tagName: "div",
                    className: "overflow-top-arrow",
                });
                let bottomArrow = $DomUtils.xCreate({
                    tagName: "div",
                    className: "overflow-bottom-arrow",
                });
                $fly(dom).prepend(topArrow);
                dom.appendChild(bottomArrow);
                jQuery(topArrow)
                    .repeatOnClick(function () {
                    menu.doScrollUp();
                }, 120)
                    .addClassOnHover("overflow-top-arrow-hover");
                jQuery(bottomArrow)
                    .repeatOnClick(function () {
                    menu.doScrollDown();
                }, 120)
                    .addClassOnHover("overflow-bottom-arrow-hover");
                doms.overflowTopArrow = topArrow;
                doms.overflowBottomArrow = bottomArrow;
            }
        },
        clearOverflow: function () {
            let menu = this, dom = menu._dom, doms = menu._doms;
            if (dom) {
                menu._overflowing = false;
                if (dorado.Browser.msie && dorado.Browser.version === 6) {
                    $fly(dom).css("width", "");
                }
                $fly(dom).css("height", "").removeClass(GROUP_OVERFLOW_CLASS);
                $fly(doms.groupContent).scrollTop(0).css("height", "");
            }
        },
        handleOverflow: function (overflowHeight) {
            let menu = this, dom = menu._dom, doms = menu._doms;
            if (dom) {
                $fly(dom).addClass(GROUP_OVERFLOW_CLASS).outerHeight(overflowHeight);
                if (!doms.overflowTopArrow) {
                    menu.createOverflowArrow();
                }
                menu._overflowing = true;
                let contentHeight = $fly(dom).innerHeight() -
                    $fly(doms.overflowTopArrow).outerHeight() -
                    $fly(doms.overflowBottomArrow).outerHeight(), contentWidth = $fly(dom).width();
                if (dorado.Browser.msie && dorado.Browser.version === 6) {
                    $fly(dom).width(contentWidth);
                    $fly(doms.groupContent).outerHeight(contentHeight);
                }
                else {
                    $fly(doms.groupContent).outerHeight(contentHeight);
                }
                $fly([doms.overflowTopArrow, doms.overflowBottomArrow]).outerWidth(contentWidth);
            }
        },
        clearFocusItem: function () {
            let menu = this, focusItem = menu._focusItem;
            if (focusItem && focusItem.focusable) {
                focusItem.onBlur();
            }
            menu._focusItem = null;
        },
        getFocusableItem: function (mode) {
            let menu = this, items = menu._items, focusItem = menu._focusItem, focusIndex = -1, result = null, i, j, item;
            if (!items) {
                return null;
            }
            mode = mode || "next";
            if (focusItem) {
                focusIndex = items.indexOf(focusItem);
            }
            if (mode === "next") {
                for (i = focusIndex + 1, j = items.size; i < j; i++) {
                    item = items.get(i);
                    if (!item._disabled &&
                        item._visible &&
                        !(item instanceof dorado.widget.menu.Separator)) {
                        result = item;
                        break;
                    }
                }
                if (result == null) {
                    mode = "first";
                }
                else {
                    return result;
                }
            }
            else {
                if (mode === "prev") {
                    for (i = focusIndex - 1; i >= 0; i--) {
                        item = items.get(i);
                        if (!item._disabled &&
                            item._visible &&
                            !(item instanceof dorado.widget.menu.Separator)) {
                            result = item;
                            break;
                        }
                    }
                    if (result == null) {
                        mode = "last";
                    }
                    else {
                        return result;
                    }
                }
            }
            if (mode === "first") {
                for (i = 0, j = items.size; i < j; i++) {
                    item = items.get(i);
                    if (!item._disabled &&
                        item._visible &&
                        !(item instanceof dorado.widget.menu.Separator)) {
                        result = item;
                        break;
                    }
                }
                return result;
            }
            else {
                if (mode === "last") {
                    for (i = items.size - 1; i >= 0; i--) {
                        item = items.get(i);
                        if (!item._disabled &&
                            item._visible &&
                            !(item instanceof dorado.widget.menu.Separator)) {
                            result = item;
                            break;
                        }
                    }
                    return result;
                }
            }
        },
        focusItem: function (item, showSubmenu) {
            let menu = this, focusItem = menu._focusItem;
            if (menu._freeze) {
                return;
            }
            if (item && focusItem !== item) {
                menu._focusItem = item;
                if (menu._overflowing) {
                    let itemDom = item._dom, doms = menu._doms, viewTop = $fly(doms.groupContent).prop("scrollTop"), contentTop = $fly(doms.groupContent).prop("offsetTop"), itemTop = itemDom.offsetTop, itemHeight = itemDom.offsetHeight, itemBottom = itemTop + itemHeight, contentHeight = $fly(doms.groupContent).innerHeight(), viewBottom = contentHeight + viewTop;
                    if (!dorado.Browser.msie) {
                        itemTop = itemTop - contentTop;
                        itemBottom = itemTop + itemHeight;
                    }
                    if (itemTop < viewTop) {
                        $fly(doms.groupContent).prop("scrollTop", itemTop);
                    }
                    else {
                        if (itemBottom > viewBottom) {
                            $fly(doms.groupContent).prop("scrollTop", itemBottom - contentHeight);
                        }
                    }
                }
                if (focusItem && focusItem.focusable) {
                    focusItem.onBlur();
                }
                if (!item._disabled && item.onFocus) {
                    item.onFocus(showSubmenu);
                }
            }
        },
        hideTopMenu: function () {
            let menu = this, opener = menu.opener, parent;
            if (menu._floating) {
                menu.hide();
                menu.fireEvent("onHideTopMenu", menu);
                if (opener) {
                    parent = opener._parent;
                    parent.hideTopMenu();
                }
            }
        },
        doScrollUp: function () {
            let menu = this, doms = menu._doms, groupContent = doms.groupContent, st = $fly(groupContent).scrollTop(), target = st - 22;
            if (target >= 0) {
                $fly(groupContent).scrollTop(target);
            }
            else {
                $fly(groupContent).scrollTop(0);
            }
        },
        doScrollDown: function () {
            let menu = this, doms = menu._doms, groupContent = doms.groupContent, st = $fly(groupContent).scrollTop(), target = st + 22, scrollHeight = $fly(groupContent).prop("scrollHeight");
            if (target <= scrollHeight) {
                $fly(groupContent).scrollTop(target);
            }
            else {
                $fly(groupContent).scrollTop(scrollHeight - $fly(groupContent).innerHeight());
            }
        },
        doOnBlur: function () {
            if (this._floating) {
                this.hide();
            }
            else {
                this.clearFocusItem();
            }
        },
        doOnKeyDown: function (event) {
            let menu = this, opener, focusItem;
            switch (event.keyCode) {
                case 37:
                    if (menu) {
                        opener = menu.opener;
                        if (opener) {
                            opener.hideSubmenu && opener.hideSubmenu();
                        }
                    }
                    break;
                case 38:
                    menu.focusItem(menu.getFocusableItem("prev"));
                    break;
                case 39:
                    if (menu._focusItem) {
                        menu._focusItem.showSubmenu && menu._focusItem.showSubmenu(true);
                    }
                    break;
                case 40:
                    menu.focusItem(menu.getFocusableItem("next"));
                    break;
                case 13:
                    focusItem = menu._focusItem;
                    if (focusItem) {
                        focusItem.onClick && focusItem.onClick();
                    }
                    return false;
                case 27:
                    menu.hideTopMenu();
                    break;
            }
        },
        freeze: function (deep) {
            this._freeze = true;
            if (deep !== false) {
                let opener = this.opener;
                while (opener) {
                    let parent = opener._parent;
                    if (opener instanceof dorado.widget.menu.AbstractMenuItem &&
                        parent instanceof dorado.widget.Menu) {
                        parent._freeze = true;
                    }
                    opener = parent ? parent.opener : null;
                }
            }
        },
        unfreeze: function (deep) {
            this._freeze = false;
            if (deep !== false) {
                let opener = this.opener;
                while (opener) {
                    let parent = opener._parent;
                    if (opener instanceof dorado.widget.menu.AbstractMenuItem &&
                        parent instanceof dorado.widget.Menu) {
                        parent._freeze = false;
                    }
                    opener = parent ? parent.opener : null;
                }
            }
        },
        createDom: function () {
            let menu = this, doms = {}, dom = $DomUtils.xCreate({
                tagName: "div",
                content: {
                    tagName: "ul",
                    className: "group-content",
                    contextKey: "groupContent",
                },
            }, null, doms), items = menu._items;
            menu._doms = doms;
            let groupContent = doms.groupContent;
            $fly(dom)
                .hover(function () {
                menu.notifyOpenerOnMouseEnter();
            }, function () {
                let focusItem = menu._focusItem;
                menu.notifyOpenerOnMouseLeave();
                if (menu._freeze) {
                    return;
                }
                if (focusItem) {
                    if (focusItem instanceof dorado.widget.menu.MenuItem) {
                        if (!focusItem._submenu) {
                            menu.clearFocusItem();
                        }
                    }
                    else {
                        if (focusItem instanceof dorado.widget.menu.ControlMenuItem) {
                            if (!focusItem._control) {
                                menu.clearFocusItem();
                            }
                        }
                        else {
                            menu.clearFocusItem();
                        }
                    }
                }
            })
                .click(function (event) {
                if (!menu.processDefaultMouseListener()) {
                    return;
                }
                let defaultReturnValue;
                if (menu.onClick) {
                    defaultReturnValue = menu.onClick(event);
                }
                let arg = {
                    button: event.button,
                    event: event,
                    returnValue: defaultReturnValue,
                };
                let target = event.target, item;
                if (target) {
                    let items = menu._items;
                    for (let i = 0, j = items.size; i < j; i++) {
                        let temp = items.get(i);
                        if (temp._dom === target || jQuery.contains(temp._dom, target)) {
                            item = temp;
                            arg.item = item;
                            break;
                        }
                    }
                }
                menu.fireEvent("onClick", menu, arg);
                event.stopImmediatePropagation();
                return arg.returnValue;
            });
            $fly(groupContent).mousewheel(function (event, delta) {
                if (menu._overflowing) {
                    if (delta < 0) {
                        menu.doScrollDown();
                    }
                    else {
                        if (delta > 0) {
                            menu.doScrollUp();
                        }
                    }
                }
            });
            if (menu._iconPosition === "top") {
                $fly(dom).addClass(menu._className + "-icon-top");
            }
            return dom;
        },
        refreshDom: function (dom) {
            $invokeSuper.call(this, arguments);
            let menu = this, items = menu._items, doms = menu._doms;
            let menuContentHeight = $fly(doms.groupContent).outerHeight();
            if (items) {
                items.each(function (item) {
                    item.render(doms.groupContent);
                });
            }
            if (menuContentHeight > dom.offsetHeight) {
                menu.handleOverflow();
            }
            let visibleItemCount = 0;
            for (let i = 0, j = items.size; i < j; i++) {
                let item = items.get(i);
                if (item._visible === false) {
                    continue;
                }
                visibleItemCount++;
            }
            if (visibleItemCount === 0) {
                if (!menu._noContentEl) {
                    menu._noContentEl = document.createElement("div");
                    menu._noContentEl.className = "no-content-group";
                    menu._noContentEl.innerHTML = $resource("dorado.baseWidget.MenuEmptyItem");
                    dom.appendChild(menu._noContentEl);
                }
                $fly(dom).addClass(menu._className + "-no-content");
            }
            else {
                if (menu._noContentEl) {
                    $fly(dom).removeClass(menu._className + "-no-content");
                }
            }
        },
        getShowPosition: function (options) {
            let menu = this, anchorTarget = options.anchorTarget, dom = menu._dom, fixedElement, result;
            options = options || {};
            options.overflowHandler = function (options) {
                menu.handleOverflow(options.maxHeight);
            };
            if (anchorTarget && anchorTarget instanceof dorado.widget.menu.MenuItem) {
                fixedElement = anchorTarget._dom;
                menu.opener = anchorTarget;
                menu._focusParent = anchorTarget._parent;
                result = $DomUtils.dockAround(dom, fixedElement, options);
                return result;
            }
            else {
                return $invokeSuper.call(this, arguments);
            }
        },
        doAfterShow: function (options) {
            let menu = this, focusfirst = (options || {}).focusFirst;
            if (focusfirst) {
                let item = menu.getFocusableItem("first");
                if (item) {
                    menu.focusItem(item);
                }
            }
            $invokeSuper.call(this, arguments);
        },
        doAfterHide: function () {
            let menu = this, dom = menu._dom;
            if (!dom) {
                return;
            }
            menu.clearFocusItem();
            if (dom) {
                if (menu._overflowing) {
                    menu.clearOverflow();
                }
            }
            menu.opener = null;
            $invokeSuper.call(this, arguments);
        },
        notifyOpenerOnMouseEnter: function () {
            let menu = this, focusParent = menu._focusParent;
            if (focusParent instanceof dorado.widget.Menu) {
                focusParent.notifyOpenerOnMouseEnter();
            }
            else {
                if (focusParent instanceof dorado.widget.AbstractButton) {
                    focusParent.doCancelHideMenuOnMouseEnter &&
                        focusParent.doCancelHideMenuOnMouseEnter();
                }
            }
        },
        notifyOpenerOnMouseLeave: function () {
            let menu = this, focusParent = menu._focusParent;
            if (focusParent instanceof dorado.widget.Menu) {
                focusParent.notifyOpenerOnMouseLeave();
            }
            else {
                if (focusParent instanceof dorado.widget.AbstractButton) {
                    focusParent.doHideMenuOnMouseLeave &&
                        focusParent.doHideMenuOnMouseLeave();
                }
            }
        },
    });
})();
dorado.widget.Slider = $extend(dorado.widget.Control, {
    $className: "dorado.widget.Slider",
    selectable: false,
    tabStop: true,
    ATTRIBUTES: {
        className: { defaultValue: "d-slider" },
        height: { independent: true },
        orientation: { defaultValue: "horizontal" },
        minValue: {
            defaultValue: 0,
            setter: function (value) {
                let parseValue = parseFloat(value);
                if (isNaN(parseValue)) {
                    throw new dorado.ResourceException("dorado.baseWidget.NumberFormatInvalid", value);
                }
                this._minValue = parseValue;
            },
        },
        maxValue: {
            defaultValue: 100,
            setter: function (value) {
                let parseValue = parseFloat(value);
                if (isNaN(parseValue)) {
                    throw new dorado.ResourceException("dorado.baseWidget.NumberFormatInvalid", value);
                }
                this._maxValue = parseValue;
            },
        },
        value: {
            setter: function (value) {
                let slider = this, minValue = slider._minValue, maxValue = slider._maxValue, parseValue = parseFloat(value);
                if (isNaN(parseValue)) {
                    throw new dorado.ResourceException("dorado.baseWidget.NumberFormatInvalid", value);
                }
                if (parseValue < minValue || parseValue > maxValue) {
                    throw new dorado.ResourceException("dorado.baseWidget.NumberRangeInvalid", minValue, maxValue, value);
                }
                value = slider.getValidValue(parseValue);
                let eventArg = { value: value };
                slider.fireEvent("beforeValueChange", slider, eventArg);
                if (eventArg.processDefault === false) {
                    return;
                }
                slider._value = value;
                slider.fireEvent("onValueChange", slider);
            },
        },
        precision: { defaultValue: 0 },
        step: {},
    },
    EVENTS: { beforeValueChange: {}, onValueChange: {} },
    _constructor: function (config) {
        let value = config && config.value;
        if (value) {
            delete config.value;
        }
        $invokeSuper.call(this, arguments);
        if (value) {
            this.set({ value: value });
        }
    },
    createDom: function () {
        let slider = this, dom, doms = {}, orientation = slider._orientation;
        dom = $DomUtils.xCreate({
            tagName: "div",
            content: [
                { tagName: "div", className: "slider-start", contextKey: "start" },
                { tagName: "div", className: "slider-end", contextKey: "end" },
                { tagName: "div", className: "slider-body", contextKey: "body" },
                {
                    tagName: "div",
                    className: "slider-current",
                    contextKey: "current",
                },
                {
                    tagName: "div",
                    className: "slider-thumb",
                    contextKey: "thumb",
                    style: { position: "absolute" },
                },
            ],
        }, null, doms);
        slider._doms = doms;
        let axis = orientation === "vertical" ? "y" : "x";
        let tip;
        if (!dorado.Browser.isTouch) {
            tip = new dorado.widget.Tip({ animateType: "none" });
        }
        jQuery(doms.thumb)
            .addClassOnHover("slider-thumb-hover")
            .addClassOnClick("slider-thumb-click")
            .draggable({
            addClasses: false,
            containment: "parent",
            axis: axis,
            stop: function (event, ui) {
                let helper = ui.helper[0], minValue = slider._minValue, maxValue = slider._maxValue, offset, size, thumbSize;
                if (orientation === "horizontal") {
                    thumbSize = doms.thumb.offsetWidth;
                    size = $fly(dom).width() - thumbSize;
                    offset = parseInt($fly(helper).css("left"), 10);
                }
                else {
                    thumbSize = doms.thumb.offsetHeight;
                    size = $fly(dom).height() - thumbSize;
                    offset = parseInt($fly(helper).css("top"), 10);
                }
                slider.set("value", ((maxValue - minValue) * offset) / size + minValue);
                if (tip) {
                    tip.hide();
                }
            },
            drag: function (event, ui) {
                let helper = ui.helper[0], minValue = slider._minValue, maxValue = slider._maxValue, offset, size, thumbSize;
                if (orientation === "horizontal") {
                    thumbSize = doms.thumb.offsetWidth;
                    size = $fly(dom).width() - thumbSize;
                    offset = parseInt($fly(helper).css("left"), 10);
                    $fly(doms.current).css("width", offset);
                }
                else {
                    thumbSize = doms.thumb.offsetHeight;
                    size = $fly(dom).height() - thumbSize;
                    offset = parseInt($fly(helper).css("top"), 10);
                    $fly(doms.current).css("height", offset);
                }
                if (tip) {
                    tip.set("text", slider.getValidValue(((maxValue - minValue) * offset) / size) +
                        minValue);
                    tip.refresh();
                    if (!tip._dom) {
                        return;
                    }
                    if (orientation === "horizontal") {
                        $DomUtils.dockAround(tip._dom, slider._doms.thumb, {
                            align: "center",
                            vAlign: "top",
                            offsetTop: -10,
                        });
                    }
                    else {
                        $DomUtils.dockAround(tip._dom, slider._doms.thumb, {
                            align: "right",
                            vAlign: "center",
                            offsetLeft: 10,
                        });
                    }
                }
            },
            start: function (event, ui) {
                if (!tip) {
                    return;
                }
                tip.set("text", slider._value);
                tip.show({
                    anchorTarget: ui.helper[0],
                    align: "center",
                    vAlign: "top",
                });
            },
        });
        return dom;
    },
    getValidValue: function (value) {
        function formatDecimal(value, precision) {
            if (precision == null) {
                precision = 0;
            }
            let result = value * Math.pow(10, precision);
            if (result - Math.floor(result) >= 0.5) {
                return (Math.floor(result) + 1) / Math.pow(10, precision);
            }
            else {
                return Math.floor(result) / Math.pow(10, precision);
            }
        }
        let slider = this, step = slider._step, result, minValue = slider._minValue, maxValue = slider._maxValue;
        if (value !== undefined) {
            result = formatDecimal(value, slider._precision);
            if (step != null) {
                let total = (maxValue - minValue) / step, left = Math.floor((result - minValue) / step), right = left + 1;
                if (right > total) {
                    result = formatDecimal(maxValue, slider._precision);
                }
                else {
                    if (Math.abs(minValue + step * right - result) >
                        Math.abs(minValue + step * left - result)) {
                        result = formatDecimal(minValue + step * left, slider._precision);
                    }
                    else {
                        result = formatDecimal(minValue + step * right, slider._precision);
                    }
                }
            }
            return result;
        }
        return null;
    },
    onClick: function (event) {
        let target = event.target || event.srcElement;
        if (target.className.indexOf("slider-thumb") !== -1) {
            return;
        }
        let slider = this, dom = slider._dom, doms = slider._doms, pageX = event.pageX, pageY = event.pageY, position = $fly(dom).offset(), offset, size, thumbSize;
        if (slider._orientation === "horizontal") {
            size = $fly(dom).innerWidth();
            thumbSize = $fly(doms.thumb).outerWidth();
            offset = pageX - position.left;
        }
        else {
            size = $fly(dom).innerHeight();
            thumbSize = $fly(doms.thumb).outerHeight();
            offset = pageY - position.top;
        }
        let percent = (offset - thumbSize / 2) / (size - thumbSize);
        if (percent < 0) {
            percent = 0;
        }
        else {
            if (percent > 1) {
                percent = 1;
            }
        }
        slider.set("value", slider._minValue + (slider._maxValue - slider._minValue) * percent);
    },
    doOnResize: function () {
        if (!this._ready) {
            return;
        }
        this.refresh();
    },
    refreshDom: function (dom) {
        $invokeSuper.call(this, arguments);
        let slider = this, doms = slider._doms, orientation = slider._orientation, maxValue = slider._maxValue, minValue = slider._minValue, value = slider._value, thumbSize, step = slider._step, handleIncrease = step != null, stepCount;
        $fly(dom).addClass(this._className + "-" + orientation);
        if (value == null) {
            value = minValue;
        }
        if (handleIncrease) {
            stepCount = (maxValue - minValue) / step;
            if (stepCount - Math.floor(stepCount) > 1e-11) {
                handleIncrease = false;
            }
        }
        if (orientation === "vertical") {
            thumbSize = doms.thumb.offsetHeight;
            let height, startHeight, endHeight;
            height = $fly(dom).innerHeight();
            startHeight = $fly(doms.start).innerHeight();
            endHeight = $fly(doms.end).innerHeight();
            $fly(doms.body).height(height - startHeight - endHeight);
            $fly(doms.thumb).css("top", ((height - thumbSize) * (value - minValue)) / (maxValue - minValue));
            $fly(doms.current).css("height", ((height - thumbSize) * (value - minValue)) / (maxValue - minValue));
            if (handleIncrease) {
                $fly(doms.thumb).draggable("option", "grid", [
                    0,
                    (height - thumbSize) / stepCount,
                ]);
            }
        }
        else {
            thumbSize = doms.thumb.offsetWidth;
            let width = $fly(dom).innerWidth();
            $fly(doms.thumb).css("left", ((width - thumbSize) * (value - minValue)) / (maxValue - minValue));
            $fly(doms.current).css("width", ((width - thumbSize) * (value - minValue)) / (maxValue - minValue));
            if (handleIncrease) {
                $fly(doms.thumb).draggable("option", "grid", [
                    (width - thumbSize) / stepCount,
                    0,
                ]);
            }
        }
    },
});
(function () {
    let TAB_CLOSEABLE_CLASS = "-closeable", TAB_DISABLED_CLASS = "-disabled", ICON_CLASS = "d-icon";
    dorado.widget.tab = {};
    dorado.widget.tab.Tab = $extend(dorado.widget.RenderableViewElement, {
        $className: "dorado.widget.tab.Tab",
        ATTRIBUTES: {
            className: { defaultValue: "tab" },
            exClassName: {},
            name: {},
            caption: {},
            closeable: {},
            icon: {},
            iconClass: {},
            disabled: {
                setter: function (value) {
                    let tab = this, tabbar = tab._parent;
                    if (tabbar) {
                        if (value) {
                            tabbar.disableTab(tab);
                        }
                        else {
                            tabbar.enableTab(tab);
                        }
                    }
                    else {
                        tab._disabled = value;
                    }
                },
            },
            visible: {
                defaultValue: true,
                skipRefresh: true,
                setter: function (value) {
                    let tab = this, tabbar = tab._parent;
                    if (tabbar && tab) {
                        tabbar.doSetTabVisible(tab, value);
                    }
                    tab._visible = value;
                },
            },
            tip: { skipRefresh: true },
        },
        EVENTS: { beforeClose: {}, onClose: {}, onClick: {} },
        destroy: function () {
            let tab = this, doms = tab._doms;
            if (doms) {
                doms.close && $fly(doms.close).unbind();
            }
            $invokeSuper.call(this);
        },
        _createIconSpan: function () {
            let tab = this, doms = tab._doms;
            let iconEl = document.createElement("span");
            iconEl.className = ICON_CLASS;
            doms.icon = iconEl;
            $fly(iconEl).prependTo(doms.tabLeft);
            $DomUtils.setBackgroundImage(iconEl, tab._icon);
        },
        refreshDom: function (dom) {
            let tab = this, closeable = tab._closeable, disabled = tab._disabled, visible = tab._visible, doms = tab._doms, captionDom = doms.caption, closeEl = doms.close, width = tab._width, tabbar = tab._parent, tabMinWidth;
            $fly(captionDom).text(tab._caption);
            if (closeable) {
                if (!closeEl) {
                    tab.createCloseDom(dom, doms);
                }
            }
            else {
                if (closeEl) {
                    $fly(closeEl).remove();
                    $fly(dom).removeClass(tab._className + TAB_CLOSEABLE_CLASS);
                }
            }
            $fly(dom).css("display", visible ? "" : "none");
            if (disabled) {
                $fly(dom).addClass(tab._className + TAB_DISABLED_CLASS);
            }
            else {
                $fly(dom).removeClass(tab._className + TAB_DISABLED_CLASS);
            }
            jQuery(dom).addClassOnHover(tab._className + "-hover", null, function () {
                return !tab._disabled;
            });
            if (tabbar && !width) {
                tabMinWidth = tabbar._tabMinWidth;
                if (dom.offsetWidth < tabMinWidth) {
                    width = tab._width = tabMinWidth;
                }
            }
            let icon = tab._icon, iconCls = tab._iconClass;
            if (!icon && !iconCls && doms.icon) {
                $fly(doms.icon).css("display", "none");
            }
            else {
                if (doms.icon) {
                    $fly(doms.icon).prop("className", ICON_CLASS).css("display", "");
                }
                if ((icon || iconCls) && !doms.icon) {
                    tab._createIconSpan();
                }
                if (icon) {
                    $DomUtils.setBackgroundImage(doms.icon, icon);
                }
                else {
                    if (doms.icon) {
                        $fly(doms.icon).css("background-image", "none");
                    }
                }
                if (iconCls) {
                    $fly(doms.icon).addClass(iconCls);
                }
            }
            if (this._tip && dorado.TipManager) {
                this._currentTip = this._tip;
                dorado.TipManager.initTip(dom, { text: this._tip });
            }
            else {
                if (this._currentTip) {
                    dorado.TipManager.deleteTip(dom);
                }
            }
            if (width) {
                tab.doOnResize();
            }
        },
        close: function () {
            let tab = this, tabbar = tab._parent, eventArg = {};
            if (tabbar) {
                tabbar.removeTab(tab);
            }
        },
        render: function (ctEl, index) {
            let dom = this.getDom();
            if (!dom) {
                return;
            }
            if (!ctEl) {
                ctEl = document.body;
            }
            if (dom.parentNode !== ctEl) {
                if (index != null) {
                    let refEl = ctEl.childNodes[index];
                    if (!refEl) {
                        ctEl.appendChild(dom);
                    }
                    else {
                        ctEl.insertBefore(dom, refEl);
                    }
                }
                else {
                    ctEl.appendChild(dom);
                }
            }
            this._rendered = true;
        },
        createDom: function () {
            let tab = this, doms = {}, dom = $DomUtils.xCreate({
                tagName: "li",
                className: tab._className + (tab._exClassName ? " " + tab._exClassName : ""),
                content: [
                    {
                        tagName: "span",
                        className: "tab-left",
                        contextKey: "tabLeft",
                        content: {
                            tagName: "span",
                            className: "caption",
                            content: tab._caption,
                            contextKey: "caption",
                        },
                    },
                    {
                        tagName: "span",
                        className: "tab-right",
                        contextKey: "tabRight",
                    },
                ],
            }, null, doms);
            $DomUtils.disableUserSelection(dom);
            tab._doms = doms;
            $fly(dom)
                .click(function () {
                let tabbar = tab._parent, disabled = tab._disabled;
                if (tabbar) {
                    if (!disabled) {
                        tab.fireEvent("onClick", tab);
                        tabbar.doChangeCurrentTab(tab);
                    }
                }
            })
                .addClass(tab._exClassName ? tab._exClassName : "");
            if (tab._closeable) {
                tab.createCloseDom(dom, doms);
            }
            jQuery(dom)
                .addClassOnHover(tab._className + "-hover", null, function () {
                return !tab._disabled;
            })
                .bind("contextmenu", function (event) {
                event = jQuery.event.fix(event || window.event);
                let tabbar = tab._parent, arg = { tab: tab, event: event, processDefault: true };
                tabbar._contextMenuTab = tab;
                if (tabbar.getListenerCount("onTabContextMenu")) {
                    arg.processDefault = false;
                    tabbar.fireEvent("onTabContextMenu", tabbar, arg);
                }
                if (!arg.processDefault) {
                    event.preventDefault();
                    event.returnValue = false;
                }
                return arg.processDefault;
            });
            if (tab._icon || tab._iconClass) {
                tab._createIconSpan();
            }
            return dom;
        },
        getControl: function () {
            return this.doGetControl ? this.doGetControl() : null;
        },
        doOnResize: function () {
            let tab = this, dom = tab._dom, doms = tab._doms, width = tab._width;
            if (tab._parent instanceof dorado.widget.TabColumn) {
                return;
            }
            $fly(dom).outerWidth(width);
            let leftEl = $fly(doms.tabLeft);
            let leftWidth = jQuery(dom).width() -
                (parseInt(leftEl.css("margin-left"), 10) || 0) -
                (parseInt(leftEl.css("margin-right"), 10) || 0) -
                (parseInt(leftEl.css("padding-left"), 10) || 0) -
                (parseInt(leftEl.css("padding-right"), 10) || 0);
            leftEl.width(leftWidth);
            let captionEl = $fly(doms.caption);
            captionEl.width(leftWidth -
                jQuery(doms.icon).outerWidth(true) -
                (parseInt(captionEl.css("padding-left"), 10) || 0) -
                (parseInt(captionEl.css("padding-right"), 10) || 0));
        },
        createCloseDom: function (dom, doms) {
            let tab = this, closeEl = $DomUtils.xCreate({ tagName: "span", className: "close", contextKey: "close" }, null, doms);
            if (tab._parent instanceof dorado.widget.TabBar) {
                doms.tabLeft.appendChild(closeEl);
            }
            else {
                dom.insertBefore(closeEl, doms.tabRight);
            }
            jQuery(closeEl)
                .click(function (event) {
                if (!tab._disabled) {
                    tab.close();
                }
                event.stopImmediatePropagation();
            })
                .addClassOnHover("close-hover", null, function () {
                return !tab._disabled;
            })
                .addClassOnClick("close-click", null, function () {
                return !tab._disabled;
            });
            $fly(dom).addClass(tab._className + TAB_CLOSEABLE_CLASS);
        },
        doSetParentViewElement: function (parentViewElement) {
            this._parent = parentViewElement;
        },
    });
    dorado.widget.tab.ControlTab = $extend(dorado.widget.tab.Tab, {
        $className: "dorado.widget.tab.ControlTab",
        ATTRIBUTES: {
            control: {
                setter: function (control) {
                    let oldValue = this._control;
                    if (control && control.constructor === Object.prototype.constructor) {
                        control = dorado.Toolkits.createInstance("widget", control);
                    }
                    this._control = control;
                    if (oldValue) {
                        let tabgroup = this._parent;
                        if (tabgroup && tabgroup._cardBook) {
                            tabgroup._cardBook.replaceControl(oldValue, control);
                        }
                    }
                },
            },
        },
        destroy: function () {
            this._control && this._control.destroy();
            $invokeSuper.call(this);
        },
        doGetControl: function () {
            let result = this._control;
            if (!result) {
                result = this._control = new dorado.widget.Control();
            }
            return result;
        },
    });
    dorado.widget.tab.IFrameTab = $extend(dorado.widget.tab.ControlTab, {
        $className: "dorado.widget.tab.IFrameTab",
        ATTRIBUTES: {
            path: { path: "_control.path" },
            iframeHeight: { writeBeforeReady: true },
        },
        doGetControl: function () {
            let tab = this, iframe = this._control;
            if (!iframe) {
                iframe = this._control = new dorado.widget.IFrame({
                    path: tab._path,
                    height: tab._iframeHeight,
                });
            }
            return iframe;
        },
    });
})();
(function () {
    let LEFT_BUTTON_CLASS = "left-button", RIGHT_BUTTON_CLASS = "right-button", MENU_BUTTON_CLASS = "menu-button", TOP_BUTTON_CLASS = "top-button", BOTTOM_BUTTON_CLASS = "bottom-button";
    dorado.widget.TabGroup = $extend(dorado.widget.Control, {
        $className: "dorado.widget.TabGroup",
        tabStop: true,
        tabShortTypeName: "tab",
        ATTRIBUTES: {
            currentTab: {
                setter: function (value) {
                    let tabgroup = this, tabs = tabgroup._tabs, rendered = tabgroup._rendered, realTab;
                    if (typeof value === "number" || typeof value === "string") {
                        realTab = tabs.get(value);
                    }
                    else {
                        realTab = value;
                    }
                    if (rendered) {
                        if (realTab && !realTab._disabled) {
                            tabgroup.doChangeCurrentTab(realTab);
                        }
                    }
                    else {
                        if (realTab == null) {
                            tabgroup._currentTab = value;
                        }
                        else {
                            tabgroup._currentTab = realTab;
                        }
                    }
                },
            },
            currentIndex: {
                skipRefresh: true,
                getter: function () {
                    let tabgroup = this, tabs = tabgroup._tabs, currentTab = tabgroup._currentTab;
                    if (currentTab) {
                        if (typeof currentTab === "number") {
                            return currentTab;
                        }
                        else {
                            return tabs.indexOf(currentTab);
                        }
                    }
                    return -1;
                },
                setter: function (index) {
                    this.set("currentTab", index);
                },
            },
            tabs: {
                setter: function (value) {
                    let tabgroup = this, tabs = tabgroup._tabs;
                    if (tabs) {
                        tabgroup.clearTabs();
                    }
                    if (value && value instanceof Array) {
                        for (let i = 0, j = value.length; i < j; i++) {
                            let tab = value[i];
                            tabgroup.addTab(tab, null, false);
                        }
                    }
                    let currentTab = tabgroup._currentTab;
                    if (typeof currentTab === "number" || typeof currentTab === "string") {
                        let result = tabgroup._tabs.get(currentTab);
                        if (result) {
                            tabgroup._currentTab = result;
                        }
                    }
                },
            },
            alwaysShowNavButtons: {
                skipRefresh: true,
                setter: function (value) {
                    let tabgroup = this;
                    tabgroup._alwaysShowNavButtons = value;
                    if (value) {
                        tabgroup.showNavButtons();
                        tabgroup.refreshNavButtons();
                    }
                    else {
                        tabgroup.hideNavButtons();
                    }
                },
            },
            tabPlacement: {
                skipRefresh: true,
                setter: function (value) {
                    if (this._rendered) {
                        this.doChangeTabPlacement(value);
                    }
                    else {
                        this._tabPlacement = value;
                    }
                },
            },
            contextMenuTab: { readOnly: true },
        },
        EVENTS: {
            beforeTabChange: {},
            onTabChange: {},
            onTabRemove: {},
            onTabContextMenu: {},
        },
        constructor: function () {
            this._tabs = new dorado.util.KeyedArray(function (value) {
                return value._name;
            });
            $invokeSuper.call(this, arguments);
        },
        destroy: function () {
            let tabgroup = this, tabs = tabgroup._tabs;
            for (let i = tabs.size - 1; i >= 0; i--) {
                tabs.get(i).destroy();
            }
            tabs.clear();
            $invokeSuper.call(tabgroup);
        },
        doGet: function (attr) {
            let c = attr.charAt(0);
            if (c === "#" || c === "&") {
                let name = attr.substring(1);
                return this.getTab(name);
            }
            else {
                return $invokeSuper.call(this, [attr]);
            }
        },
        disableTab: function (tab) {
            let tabgroup = this, tabDom, navmenu = tabgroup._navmenu, tabs = tabgroup._tabs, index;
            tab = tabgroup.getTab(tab);
            index = tabs.indexOf(tab);
            tabDom = tab._dom;
            tab._disabled = true;
            if (tabDom) {
                $fly(tabDom).addClass("tab-disabled");
                if (tab === tabgroup._currentTab) {
                    let newCurrentTab = tabgroup.getAvialableTab(tab);
                    tabgroup.doChangeCurrentTab(newCurrentTab);
                }
            }
            if (navmenu) {
                navmenu.getItem(index).set("disabled", true);
            }
        },
        enableTab: function (tab) {
            let tabgroup = this, tabDom, navmenu = tabgroup._navmenu, tabs = tabgroup._tabs, index;
            tab = tabgroup.getTab(tab);
            index = tabs.indexOf(tab);
            tabDom = tab._dom;
            tab._disabled = false;
            if (tabDom) {
                $fly(tabDom).removeClass("tab-disabled");
            }
            if (navmenu) {
                navmenu.getItem(index).set("disabled", false);
            }
        },
        doSetTabVisible: function (tab, visible) {
            let tabgroup = this, tabDom, navmenu = tabgroup._navmenu, tabs = tabgroup._tabs, index;
            tab = tabgroup.getTab(tab);
            index = tabs.indexOf(tab);
            tabDom = tab._dom;
            if (tab._visible === visible) {
                return;
            }
            if (tabDom) {
                if (visible) {
                    tabDom.style.display = "";
                }
                else {
                    tabDom.style.display = "none";
                    if (tab === tabgroup._currentTab) {
                        let newCurrentTab = tabgroup.getAvialableTab(tab);
                        tabgroup.doChangeCurrentTab(newCurrentTab);
                    }
                }
                tabgroup.refreshNavButtons();
            }
            if (navmenu) {
                navmenu.getItem(index).set("visible", visible);
            }
        },
        getTab: function (tab) {
            let tabgroup = this, tabs = tabgroup._tabs;
            if (typeof tab === "number" || typeof tab === "string") {
                return tabs.get(tab);
            }
            else {
                return tab;
            }
        },
        addTab: function (tab, index, current) {
            if (!tab) {
                throw new dorado.ResourceException("dorado.base.TabUndefined");
            }
            let tabgroup = this, tabs = tabgroup._tabs;
            if (tabs) {
                if (!(tab instanceof dorado.widget.tab.Tab)) {
                    tab = dorado.Toolkits.createInstance(tabgroup.tabShortTypeName, tab);
                }
                tabgroup.doAddTab(tab, index, current);
                return tab;
            }
            return null;
        },
        doAddTab: function (tab, index, current) {
            let tabgroup = this, tabs = tabgroup._tabs, doms = tabgroup._doms, navmenu = tabgroup._navmenu;
            if (index != null) {
                tabs.insert(tab, index);
            }
            else {
                index = tabs.size;
                tabs.insert(tab);
            }
            if (navmenu) {
                tabgroup.insertNavMenuItem(tab, index);
            }
            tabgroup.registerInnerViewElement(tab);
            if (tabgroup._rendered) {
                tab.render(doms.tabs, index);
                tab.refresh();
            }
            if (current) {
                tabgroup.doChangeCurrentTab(tab);
            }
        },
        removeTab: function (tab) {
            let tabgroup = this, tabs = tabgroup._tabs, navmenu = tabgroup._navmenu, index;
            if (tabs) {
                tab = tabgroup.getTab(tab);
                let eventArg = {};
                tab.fireEvent("beforeClose", tab, eventArg);
                if (eventArg.processDefault === false) {
                    return;
                }
                if (navmenu) {
                    index = tabs.indexOf(tab);
                    navmenu.removeItem(index);
                }
                tabgroup.unregisterInnerViewElement(tab);
                tabgroup.doRemoveTab(tab);
                tab.fireEvent("onClose", tab);
                tabgroup.fireEvent("onTabRemove", self, { tab: tab });
                tab.destroy();
            }
        },
        doRemoveTab: function (tab) {
            let tabgroup = this, tabs = tabgroup._tabs;
            if (tab !== tabgroup._currentTab) {
                tabs.remove(tab);
            }
            else {
                let avialableTab = tabgroup.getAvialableTab(tab);
                tabs.removeAt(tabs.indexOf(tab));
                tabgroup.doChangeCurrentTab(avialableTab);
            }
            tabgroup.refreshNavButtons();
        },
        getAvialableTab: function (tab) {
            let tabgroup = this, tabs = tabgroup._tabs, index, result, i, j;
            if (tabs) {
                if (!tab) {
                    index = -1;
                }
                else {
                    index = tabs.indexOf(tab);
                }
                for (i = index - 1; i >= 0; i--) {
                    result = tabs.get(i);
                    if (!result._disabled && result._visible) {
                        return result;
                    }
                }
                for (i = index + 1, j = tabs.size; i < j; i++) {
                    result = tabs.get(i);
                    if (!result._disabled && result._visible) {
                        return result;
                    }
                }
            }
            return null;
        },
        clearTabs: function () {
            let tabgroup = this, tabs = tabgroup._tabs;
            if (tabs.size) {
                tabgroup._currentTab = null;
            }
            for (let i = 0, j = tabs.size; i < j; i++) {
                tabgroup.removeTab(tabs.get(0));
            }
        },
        closeTab: function (tab) {
            if (tab) {
                tab.close();
            }
        },
        closeOtherTabs: function (tab, force) {
            if (!tab) {
                return;
            }
            let tabgroup = this, tabs = tabgroup.get("tabs").toArray();
            jQuery.each(tabs, function (index, target) {
                if (target !== tab &&
                    (force || (!target._disabled && target._closeable))) {
                    target.close();
                }
            });
        },
        closeAllTabs: function (force) {
            let tabgroup = this, tabs = tabgroup.get("tabs").toArray();
            jQuery.each(tabs, function (index, tab) {
                if (force || (!tab._disabled && tab._closeable)) {
                    tab.close();
                }
            });
        },
        doFilterTabs: function (tabs) {
            let result = new dorado.util.KeyedArray(function (value) {
                return value._name;
            });
            for (let i = 0, j = tabs.size; i < j; i++) {
                let tab = tabs.get(i);
                if (tab._visible) {
                    result.append(tab);
                }
            }
            return result;
        },
        doChangeCurrentTab: function (tab, force) {
            let tabgroup = this, doms = tabgroup._doms || {}, currentTab = tabgroup._currentTab;
            if (force !== true && tab === currentTab) {
                return false;
            }
            let eventArg = { newTab: tab, oldTab: currentTab };
            tabgroup.fireEvent("beforeTabChange", tabgroup, eventArg);
            if (eventArg.processDefault === false) {
                return;
            }
            if (currentTab && currentTab._dom) {
                $fly(currentTab._dom).removeClass("tab-selected");
            }
            if (tab && tab._dom) {
                tabgroup.scrollTabIntoView(tab);
            }
            tabgroup._currentTab = tab;
            tabgroup.doOnTabChange(eventArg);
            return true;
        },
        doOnTabChange: function (eventArg) {
            let tabgroup = this;
            tabgroup.fireEvent("onTabChange", tabgroup, eventArg);
        },
        doChangeTabPlacement: function (value) {
            let tabgroup = this, cls = tabgroup._className, doms = tabgroup._doms, tabbarDom = doms.tabbar;
            if (tabbarDom) {
                let oldValue = tabgroup._tabPlacement;
                $fly(tabbarDom).addClass("d-tabbar-" + value + " " + cls + "-" + value);
                if (oldValue) {
                    $fly(tabbarDom).removeClass("d-tabbar-" + oldValue + " " + cls + "-" + oldValue);
                }
            }
            tabgroup._tabPlacement = value;
            return true;
        },
    });
    dorado.widget.TabColumn = $extend(dorado.widget.TabGroup, {
        $className: "dorado.widget.TabColumn",
        ATTRIBUTES: {
            className: { defaultValue: "d-tabcolumn" },
            tabPlacement: { skipRefresh: true, defaultValue: "left" },
            verticalText: {},
        },
        createDom: function () {
            let tabcolumn = this, tabs = tabcolumn._tabs, doms = {}, dom = $DomUtils.xCreate({
                tagName: "div",
                className: tabcolumn._className,
                contextKey: "tabbar",
                content: [
                    {
                        tagName: "div",
                        className: "tabs-wrap column-tabs-wrap",
                        contextKey: "tabsWrap",
                        content: {
                            tagName: "ul",
                            className: "tabs column-tabs",
                            contextKey: "tabs",
                        },
                    },
                ],
            }, null, doms), jDom = jQuery(dom);
            tabcolumn._doms = doms;
            if (tabcolumn._verticalText) {
                jDom.addClass(tabcolumn._className + "-vtext");
                if (dorado.Browser.msie && dorado.Browser.version === 6) {
                    jDom.addClass(tabcolumn._className + "-vtext-" + tabcolumn._tabPlacement);
                }
            }
            jDom.addClass(tabcolumn._tabPlacement === "left"
                ? tabcolumn._className + "-left"
                : tabcolumn._className + "-right");
            if (tabcolumn._alwaysShowNavButtons) {
                tabcolumn.createNavButtons(dom);
            }
            let tabsEl = doms.tabs, currentTab = tabcolumn._currentTab;
            if (tabs) {
                for (let i = 0, j = tabs.size; i < j; i++) {
                    let tab = tabs.get(i);
                    if (tab._current) {
                        currentTab = tab;
                    }
                    tab.render(tabsEl);
                }
                if (!currentTab) {
                    currentTab = tabcolumn.getAvialableTab();
                }
                if (currentTab) {
                    tabcolumn.doChangeCurrentTab(currentTab, true);
                }
            }
            $fly(doms.tabsWrap).mousewheel(function (event, delta) {
                if (tabcolumn._overflowing) {
                    if (delta < 0) {
                        tabcolumn.doScrollBottom(false);
                    }
                    else {
                        if (delta > 0) {
                            tabcolumn.doScrollTop(false);
                        }
                    }
                }
            });
            return dom;
        },
        refreshTabColumn: function () {
            let tabbar = this, tabs = tabbar._tabs;
            if (tabs) {
                for (let i = 0, j = tabs.size; i < j; i++) {
                    let tab = tabs.get(i);
                    tab.refreshDom(tab._dom);
                }
            }
            tabbar.onToolButtonVisibleChange();
            tabbar.refreshNavButtons();
        },
        doChangeTabPlacement: function (value) {
            let tabgroup = this, cls = tabgroup._className, doms = tabgroup._doms, tabbarDom = doms.tabbar;
            if (tabbarDom) {
                let oldValue = tabgroup._tabPlacement;
                $fly(tabbarDom).addClass(this._className + "-" + value + " " + cls + "-" + value);
                if (oldValue) {
                    $fly(tabbarDom).removeClass(this._className + "-" + oldValue + " " + cls + "-" + oldValue);
                }
            }
            tabgroup._tabPlacement = value;
            return true;
        },
        refreshDom: function (dom) {
            $invokeSuper.call(this, arguments);
            this.refreshTabColumn();
        },
        scrollTabIntoView: function (tab) {
            let tabbar = this, doms = tabbar._doms, tabDom = tab._dom, tabsEl = doms.tabs, offsetTop = tabDom.offsetTop, offsetHeight = tabDom.offsetHeight, top = (parseInt(tabsEl.style.top, 10) || 0) * -1, viewHeight = $fly(doms.tabsWrap).height();
            $fly(tabDom).addClass("tab-selected");
            if (top > offsetTop) {
                $fly(tabsEl).animate({ top: -1 * offsetTop }, 300, null, function () {
                    tabbar.refreshNavButtons();
                });
            }
            else {
                if (top + viewHeight < offsetTop + offsetHeight) {
                    $fly(tabsEl).animate({ top: -1 * (offsetTop + offsetHeight - viewHeight) }, 300, null, function () {
                        tabbar.refreshNavButtons();
                    });
                }
                else {
                    tabbar.refreshNavButtons();
                }
            }
        },
        refreshNavButtons: function () {
            let tabcolumn = this, dom = tabcolumn._dom, tabs = tabcolumn._tabs, doms = tabcolumn._doms;
            if (!dom || !tabs) {
                return;
            }
            let topButton = tabcolumn._topButton, bottomButton = tabcolumn._bottomButton;
            let tabsHeight = tabcolumn.getTabsHeight(), tabsEl = doms.tabs, currentTop = parseInt(tabsEl.style.top || 0, 10);
            let visibleHeight = $fly(doms.tabsWrap).height();
            if (tabsHeight > 0) {
                if (tabcolumn._alwaysShowNavButtons !== true &&
                    visibleHeight > tabsHeight) {
                    tabcolumn._overflowing = false;
                    if (bottomButton) {
                        bottomButton.set("disabled", true);
                        if (tabsHeight + currentTop <= visibleHeight) {
                            $fly(tabsEl).top(0);
                            if (!tabcolumn._alwaysShowNavButtons) {
                                tabcolumn.hideNavButtons();
                            }
                        }
                    }
                }
                else {
                    tabcolumn._overflowing = true;
                    if (!tabcolumn._alwaysShowNavButtons) {
                        tabcolumn.showNavButtons();
                        visibleHeight = $fly(doms.tabsWrap).innerHeight();
                        currentTop = parseInt(tabsEl.style.top, 10);
                    }
                    if (!bottomButton) {
                        bottomButton = tabcolumn._bottomButton;
                        topButton = tabcolumn._topButton;
                    }
                    if (tabsHeight + currentTop > visibleHeight) {
                        bottomButton.set("disabled", false);
                    }
                    else {
                        if (tabsHeight + currentTop < visibleHeight) {
                            $fly(tabsEl).top(visibleHeight - tabsHeight);
                            bottomButton.set("disabled", true);
                        }
                        else {
                            if (tabsHeight + currentTop === visibleHeight) {
                                bottomButton.set("disabled", true);
                            }
                        }
                    }
                    if (parseInt(tabsEl.style.top, 10) < 0) {
                        topButton.set("disabled", false);
                    }
                    else {
                        topButton.set("disabled", true);
                    }
                    if (topButton._disabled && bottomButton._disabled) {
                        $fly(tabsEl).top(0);
                    }
                }
            }
        },
        showNavButtons: function () {
            let tabcolumn = this, dom = tabcolumn._dom, modifyTop = true, doms = tabcolumn._doms;
            if (dom) {
                if (!doms.topButton) {
                    tabcolumn.createNavButtons(dom);
                }
                else {
                    if ($fly(doms.topButton).css("display") === "none") {
                        $fly([doms.topButton, doms.bottomButton]).css("display", "block");
                    }
                    else {
                        modifyTop = false;
                    }
                }
                if (modifyTop) {
                    let tabsEl = doms.tabs, top = parseInt(tabsEl.style.top, 10) || 0;
                    $fly(tabsEl).top(top);
                }
                tabcolumn.onToolButtonVisibleChange();
            }
        },
        hideNavButtons: function (force) {
            let tabcolumn = this, dom = tabcolumn._dom, doms = tabcolumn._doms;
            if (!dom) {
                return;
            }
            let topButton = doms.topButton, bottomButton = doms.bottomButton;
            if (topButton && bottomButton) {
                let tabsHeight = tabcolumn.getTabsHeight(), visibleHeight = $fly(doms.tabsWrap).innerHeight();
                if (tabsHeight < visibleHeight || force) {
                    $fly(topButton).css("display", "none");
                    $fly(bottomButton).css("display", "none");
                    tabcolumn.onToolButtonVisibleChange();
                }
            }
        },
        getTabsHeight: function () {
            let tabcolumn = this, tabs = tabcolumn._tabs, lastTab, lastDom;
            if (tabs) {
                lastTab = tabs.get(tabs.size - 1);
                if (lastTab) {
                    lastDom = lastTab._dom;
                    if (lastDom) {
                        return lastDom.offsetTop + $fly(lastDom).outerHeight();
                    }
                }
            }
            return 0;
        },
        createNavButtons: function (dom) {
            let tabcolumn = this;
            if (!dom) {
                return;
            }
            let doms = tabcolumn._doms, tabbarDom = doms.tabbar, topBtn, bottomBtn;
            topBtn = tabcolumn._topButton = new dorado.widget.SimpleButton({
                className: TOP_BUTTON_CLASS,
                listener: {
                    onClick: function () {
                        tabcolumn.doScrollTop(true);
                    },
                },
            });
            bottomBtn = tabcolumn._bottomButton = new dorado.widget.SimpleButton({
                className: BOTTOM_BUTTON_CLASS,
                listener: {
                    onClick: function () {
                        tabcolumn.doScrollBottom(true);
                    },
                },
            });
            tabcolumn.registerInnerControl(topBtn);
            tabcolumn.registerInnerControl(bottomBtn);
            topBtn.render(tabbarDom);
            tabbarDom.insertBefore(topBtn._dom, tabbarDom.firstChild);
            bottomBtn.render(tabbarDom);
            tabbarDom.appendChild(bottomBtn._dom);
            doms.topButton = topBtn._dom;
            doms.bottomButton = bottomBtn._dom;
            $fly(doms.topButton).repeatOnClick(function () {
                tabcolumn.doScrollTop(false, 12);
            }, 30);
            $fly(doms.bottomButton).repeatOnClick(function () {
                tabcolumn.doScrollBottom(false, 12);
            }, 30);
        },
        doScrollTop: function (anim, length) {
            let tabcolumn = this, doms = tabcolumn._doms, tabsEl = doms.tabs, to = parseInt(tabsEl.style.top, 10) + (length > 0 ? length : 100);
            if (anim) {
                $fly(tabsEl).animate({ top: to > 0 ? 0 : to }, 300, null, function () {
                    tabcolumn.refreshNavButtons();
                });
            }
            else {
                $fly(tabsEl).top(to > 0 ? 0 : to);
                tabcolumn.refreshNavButtons();
            }
        },
        doScrollBottom: function (anim, length) {
            let tabcolumn = this, doms = tabcolumn._doms, tabs = tabcolumn._tabs, tabsEl = doms.tabs, currentTop = parseInt(tabsEl.style.top || 0, 10);
            length = length > 0 ? length : 100;
            if (tabs) {
                let tabsHeight = tabcolumn.getTabsHeight(), visibleHeight = $fly(doms.tabsWrap).innerHeight(), to = currentTop - length, bottomHeight = tabsHeight + currentTop - visibleHeight;
                if (bottomHeight <= 0) {
                    return false;
                }
                else {
                    if (bottomHeight < length) {
                        to = currentTop - bottomHeight;
                    }
                }
            }
            if (anim) {
                $fly(tabsEl).animate({ top: to }, 300, null, function () {
                    tabcolumn.refreshNavButtons();
                });
            }
            else {
                $fly(tabsEl).top(to);
                tabcolumn.refreshNavButtons();
            }
        },
        onToolButtonVisibleChange: function () {
            let tabcolumn = this, dom = tabcolumn._dom, doms = tabcolumn._doms;
            if (!dom) {
                return;
            }
            let topButton = doms.topButton, bottomButton = doms.bottomButton;
            let topHeight = 0, bottomHeight = 0, menuButtonWidth = 0;
            if (topButton && topButton.style.display !== "none") {
                topHeight += $fly(topButton).outerHeight(true);
            }
            if (bottomButton && bottomButton.style.display !== "none") {
                bottomHeight += $fly(bottomButton).outerHeight(true);
            }
            $fly(doms.tabsWrap).css({
                height: tabcolumn.getRealHeight() - topHeight - bottomHeight,
            });
        },
    });
    dorado.widget.TabBar = $extend(dorado.widget.TabGroup, {
        $className: "dorado.widget.TabBar",
        ATTRIBUTES: {
            className: { defaultValue: "d-tabbar" },
            showMenuButton: {
                skipRefresh: true,
                setter: function (value) {
                    let tabbar = this, dom = tabbar._dom, doms = tabbar._doms;
                    if (dom) {
                        if (value) {
                            if (!doms.menuButton) {
                                tabbar.createMenuButton(dom);
                            }
                            else {
                                $fly(doms.menuButton).css("display", "");
                            }
                        }
                        else {
                            if (doms.menuButton) {
                                $fly(doms.menuButton).css("display", "none");
                            }
                        }
                        tabbar.refreshNavButtons();
                        tabbar.onToolButtonVisibleChange();
                    }
                    tabbar._showMenuButton = value;
                },
            },
            tabMinWidth: { writeOnce: true },
            tabPlacement: { defaultValue: "top" },
            height: { independent: true, readOnly: true },
        },
        refreshNavButtons: function () {
            let tabbar = this, dom = tabbar._dom, tabs = tabbar._tabs, doms = tabbar._doms;
            if (!dom || !tabs) {
                return;
            }
            let leftButton = tabbar._leftButton, rightButton = tabbar._rightButton;
            let tabsWidth = tabbar.getTabsWidth(), tabsEl = doms.tabs, currentLeft = parseInt(tabsEl.style.left || 0, 10);
            let visibleWidth = $fly(doms.tabsWrap).width();
            if (tabsWidth > 0) {
                if (tabbar._alwaysShowNavButtons !== true && visibleWidth > tabsWidth) {
                    tabbar._overflowing = false;
                    if (rightButton) {
                        rightButton.set("disabled", true);
                        if (tabsWidth + currentLeft <= visibleWidth) {
                            $fly(tabsEl).left(0);
                            if (!tabbar._alwaysShowNavButtons) {
                                tabbar.hideNavButtons();
                            }
                        }
                    }
                }
                else {
                    tabbar._overflowing = true;
                    if (!tabbar._alwaysShowNavButtons) {
                        tabbar.showNavButtons();
                        visibleWidth = $fly(doms.tabsWrap).innerWidth();
                        currentLeft = parseInt(tabsEl.style.left, 10);
                    }
                    if (!rightButton) {
                        rightButton = tabbar._rightButton;
                        leftButton = tabbar._leftButton;
                    }
                    if (tabsWidth + currentLeft > visibleWidth) {
                        rightButton.set("disabled", false);
                    }
                    else {
                        if (tabsWidth + currentLeft < visibleWidth) {
                            $fly(tabsEl).left(visibleWidth - tabsWidth);
                            rightButton.set("disabled", true);
                        }
                        else {
                            if (tabsWidth + currentLeft === visibleWidth) {
                                rightButton.set("disabled", true);
                            }
                        }
                    }
                    if (parseInt(tabsEl.style.left, 10) < 0) {
                        leftButton.set("disabled", false);
                    }
                    else {
                        leftButton.set("disabled", true);
                    }
                    if (leftButton._disabled && rightButton._disabled) {
                        $fly(tabsEl).left(0);
                    }
                }
            }
        },
        showNavButtons: function () {
            let tabbar = this, dom = tabbar._dom, modifyLeft = true, doms = tabbar._doms;
            if (dom) {
                if (!doms.leftButton) {
                    tabbar.createNavButtons(dom);
                }
                else {
                    if ($fly(doms.leftButton).css("display") === "none") {
                        $fly([doms.leftButton, doms.rightButton]).css("display", "block");
                    }
                    else {
                        modifyLeft = false;
                    }
                }
                if (modifyLeft) {
                    let tabsEl = doms.tabs, left = parseInt(tabsEl.style.left, 10) || 0, leftButtonWidth = $fly(doms.leftButton).outerWidth(true), rightButtonWidth = $fly(doms.rightButton).outerWidth(true);
                    $fly(tabsEl).left(left - leftButtonWidth - rightButtonWidth);
                }
                tabbar.onToolButtonVisibleChange();
            }
        },
        hideNavButtons: function (force) {
            let tabbar = this, dom = tabbar._dom, doms = tabbar._doms;
            if (!dom) {
                return;
            }
            let leftButton = doms.leftButton, rightButton = doms.rightButton;
            if (leftButton && rightButton) {
                let tabsWidth = tabbar.getTabsWidth(), visibleWidth = $fly(doms.tabsWrap).innerWidth();
                if (tabsWidth < visibleWidth || force) {
                    $fly(leftButton).css("display", "none");
                    $fly(rightButton).css("display", "none");
                    tabbar.onToolButtonVisibleChange();
                }
            }
        },
        createDom: function () {
            let tabbar = this, tabs = tabbar._tabs, doms = {}, dom = $DomUtils.xCreate({
                tagName: "div",
                className: tabbar._className,
                contextKey: "tabbar",
                content: [
                    {
                        tagName: "div",
                        className: "tabs-wrap bar-tabs-wrap",
                        contextKey: "tabsWrap",
                        content: {
                            tagName: "ul",
                            className: "tabs bar-tabs",
                            contextKey: "tabs",
                        },
                    },
                ],
            }, null, doms), jDom = jQuery(dom);
            tabbar._doms = doms;
            jDom.addClass(tabbar._tabPlacement === "top"
                ? tabbar._className + "-top"
                : tabbar._className + "-bottom");
            if (tabbar._alwaysShowNavButtons) {
                tabbar.createNavButtons(dom);
            }
            if (tabbar._showMenuButton) {
                tabbar.createMenuButton(dom);
            }
            let tabsEl = doms.tabs, currentTab = tabbar._currentTab;
            if (tabs) {
                for (let i = 0, j = tabs.size; i < j; i++) {
                    let tab = tabs.get(i);
                    if (tab._current) {
                        currentTab = tab;
                    }
                    tab.render(tabsEl);
                }
                if (!currentTab) {
                    currentTab = tabbar.getAvialableTab();
                }
                if (currentTab) {
                    tabbar.doChangeCurrentTab(currentTab, true);
                }
            }
            $fly(doms.tabsWrap).mousewheel(function (event, delta) {
                if (tabbar._overflowing) {
                    if (delta < 0) {
                        tabbar.doScrollRight(false);
                    }
                    else {
                        if (delta > 0) {
                            tabbar.doScrollLeft(false);
                        }
                    }
                }
            });
            let rightToolButtons = tabbar._rightToolButtons;
            if (rightToolButtons) {
                for (let i = 0, j = rightToolButtons.length; i < j; i++) {
                    let toolButton = rightToolButtons[i];
                    tabbar.registerInnerControl(toolButton);
                    toolButton.render(dom);
                }
            }
            return dom;
        },
        refreshTabBar: function () {
            let tabbar = this, tabs = tabbar._tabs;
            if (tabs) {
                for (let i = 0, j = tabs.size; i < j; i++) {
                    let tab = tabs.get(i);
                    tab.refresh();
                }
            }
            tabbar.onToolButtonVisibleChange();
            tabbar.refreshNavButtons();
        },
        refreshDom: function (dom) {
            $invokeSuper.call(this, arguments);
            this.refreshTabBar();
        },
        doOnTabChange: function (eventArg) {
            let tabbar = this;
            tabbar.fireEvent("onTabChange", tabbar, eventArg);
        },
        createNavButtons: function (dom) {
            let tabbar = this;
            if (!dom) {
                return;
            }
            let doms = tabbar._doms, tabbarDom = doms.tabbar, leftBtn, rightBtn;
            leftBtn = tabbar._leftButton = new dorado.widget.SimpleButton({
                className: LEFT_BUTTON_CLASS,
                listener: {
                    onClick: function () {
                        tabbar.doScrollLeft(true);
                    },
                },
            });
            rightBtn = tabbar._rightButton = new dorado.widget.SimpleButton({
                className: RIGHT_BUTTON_CLASS,
                listener: {
                    onClick: function () {
                        tabbar.doScrollRight(true);
                    },
                },
            });
            tabbar.registerInnerControl(leftBtn);
            tabbar.registerInnerControl(rightBtn);
            leftBtn.render(tabbarDom);
            tabbarDom.insertBefore(leftBtn._dom, tabbarDom.firstChild);
            rightBtn.render(tabbarDom);
            tabbarDom.insertBefore(rightBtn._dom, doms.tabsWrap);
            doms.leftButton = leftBtn._dom;
            doms.rightButton = rightBtn._dom;
            $fly(doms.leftButton).repeatOnClick(function () {
                tabbar.doScrollLeft(false, 12);
            }, 30);
            $fly(doms.rightButton).repeatOnClick(function () {
                tabbar.doScrollRight(false, 12);
            }, 30);
        },
        doScrollLeft: function (anim, length) {
            let tabbar = this, doms = tabbar._doms, tabsEl = doms.tabs, to = parseInt(tabsEl.style.left, 10) + (length > 0 ? length : 100);
            if (anim) {
                $fly(tabsEl).animate({ left: to > 0 ? 0 : to }, 300, null, function () {
                    tabbar.refreshNavButtons();
                });
            }
            else {
                $fly(tabsEl).left(to > 0 ? 0 : to);
                tabbar.refreshNavButtons();
            }
        },
        doScrollRight: function (anim, length) {
            let tabbar = this, doms = tabbar._doms, tabs = tabbar._tabs, tabsEl = doms.tabs, currentLeft = parseInt(tabsEl.style.left || 0, 10);
            length = length > 0 ? length : 100;
            if (tabs) {
                let tabsWidth = tabbar.getTabsWidth(), visibleWidth = $fly(doms.tabsWrap).innerWidth(), to = currentLeft - length, rightWidth = tabsWidth + currentLeft - visibleWidth;
                if (rightWidth <= 0) {
                    return false;
                }
                else {
                    if (rightWidth < length) {
                        to = currentLeft - rightWidth;
                    }
                }
            }
            if (anim) {
                $fly(tabsEl).animate({ left: to }, 300, null, function () {
                    tabbar.refreshNavButtons();
                });
            }
            else {
                $fly(tabsEl).left(to);
                tabbar.refreshNavButtons();
            }
        },
        createMenuButton: function (dom) {
            let tabbar = this;
            if (!dom) {
                return;
            }
            let wrapEl = dom.lastChild, doms = tabbar._doms, rightButtonEl = doms.rightButton, refEl = wrapEl;
            if (rightButtonEl) {
                refEl = rightButtonEl;
            }
            let navmenu = (tabbar._navmenu = new dorado.widget.Menu({
                listener: {
                    beforeShow: function (self, configs) {
                        if (tabbar._tabPlacement === "top") {
                            dorado.Object.apply(configs, {
                                anchorTarget: menuBtn,
                                align: "innerright",
                                vAlign: "bottom",
                            });
                        }
                        else {
                            dorado.Object.apply(configs, {
                                anchorTarget: menuBtn,
                                align: "innerright",
                                vAlign: "top",
                            });
                        }
                    },
                },
            })), tabs = tabbar._tabs, tab;
            for (let i = 0, j = tabs.size; i < j; i++) {
                tab = tabs.get(i);
                tabbar.insertNavMenuItem(tab);
            }
            let menuBtn = (tabbar._menuButton = new dorado.widget.SimpleButton({
                className: MENU_BUTTON_CLASS,
                menu: navmenu,
            }));
            menuBtn.render(dom);
            dom.insertBefore(menuBtn._dom, refEl);
            doms.menuButton = menuBtn._dom;
        },
        insertNavMenuItem: function (tab, index) {
            let tabbar = this, navmenu = tabbar._navmenu;
            if (navmenu && tab) {
                navmenu.addItem({
                    caption: tab._caption,
                    icon: tab._icon,
                    iconClass: tab._iconClass,
                    disabled: tab._disabled,
                    visible: tab._visible,
                    listener: {
                        onClick: function () {
                            tabbar.set("currentTab", tab);
                        },
                    },
                }, index);
            }
        },
        getTabsWidth: function () {
            let tabbar = this, tabs = tabbar._tabs, lastTab, lastDom;
            if (tabs) {
                lastTab = tabs.get(tabs.size - 1);
                if (lastTab) {
                    lastDom = lastTab._dom;
                    if (lastDom) {
                        return lastDom.offsetLeft + $fly(lastDom).outerWidth();
                    }
                }
            }
            return 0;
        },
        addRightToolButton: function (button) {
            if (!button) {
                return;
            }
            let tabbar = this, rightToolButtons = tabbar._rightToolButtons;
            if (!rightToolButtons) {
                rightToolButtons = tabbar._rightToolButtons = [];
            }
            rightToolButtons.push(button);
            if (tabbar._rendered) {
                tabbar.registerInnerControl(button);
                button.render(tabbar._dom);
                tabbar.onToolButtonVisibleChange();
            }
        },
        scrollTabIntoView: function (tab) {
            let tabbar = this, doms = tabbar._doms, tabDom = tab._dom, tabsEl = doms.tabs, offsetLeft = tabDom.offsetLeft, offsetWidth = tabDom.offsetWidth, left = (parseInt(tabsEl.style.left, 10) || 0) * -1, viewWidth = $fly(doms.tabsWrap).width();
            $fly(tabDom).addClass("tab-selected");
            if (left > offsetLeft) {
                $fly(tabsEl).animate({ left: -1 * offsetLeft }, 300, null, function () {
                    tabbar.refreshNavButtons();
                });
            }
            else {
                if (left + viewWidth < offsetLeft + offsetWidth) {
                    $fly(tabsEl).animate({ left: -1 * (offsetLeft + offsetWidth - viewWidth) }, 300, null, function () {
                        tabbar.refreshNavButtons();
                    });
                }
                else {
                    tabbar.refreshNavButtons();
                }
            }
        },
        onToolButtonVisibleChange: function () {
            let tabbar = this, dom = tabbar._dom, doms = tabbar._doms;
            if (!dom) {
                return;
            }
            let leftButton = doms.leftButton, rightButton = doms.rightButton, menuButton = doms.menuButton;
            let leftWidth = 0, rightWidth = 0, menuButtonWidth = 0;
            if (leftButton && leftButton.style.display !== "none") {
                leftWidth += $fly(leftButton).outerWidth(true);
            }
            if (rightButton && rightButton.style.display !== "none") {
                rightWidth += $fly(rightButton).outerWidth(true);
            }
            if (menuButton) {
                let menuButtonVisible = menuButton.style.display !== "none";
                menuButtonWidth = menuButtonVisible
                    ? $fly(menuButton).outerWidth(true)
                    : 0;
                rightWidth += menuButtonWidth;
            }
            let rightToolButtons = tabbar._rightToolButtons, buttonsWidth = menuButtonWidth;
            if (rightToolButtons) {
                let tabsWrapHeight = $fly(doms.tabsWrap).height();
                for (let i = rightToolButtons.length - 1; i >= 0; i--) {
                    let toolButton = rightToolButtons[i], toolButtonWidth = $fly(toolButton._dom).outerWidth(true), toolButtonHeight = $fly(toolButton._dom).outerHeight(true);
                    $fly(toolButton._dom).css({
                        position: "absolute",
                        top: tabbar._tabPlacement === "top"
                            ? Math.floor((tabsWrapHeight - toolButtonHeight) / 2) - 2
                            : Math.floor((tabsWrapHeight - toolButtonHeight) / 2) + 2,
                        right: buttonsWidth,
                    });
                    buttonsWidth += toolButtonWidth;
                    rightWidth += toolButtonWidth;
                }
            }
            if (rightButton) {
                $fly(rightButton).css("right", buttonsWidth);
            }
            $fly(doms.tabsWrap).css({
                "margin-left": leftWidth,
                "margin-right": rightWidth,
            });
        },
    });
    dorado.Toolkits.registerPrototype("tab", {
        Default: dorado.widget.tab.Tab,
        Tab: dorado.widget.tab.Tab,
        IFrame: dorado.widget.tab.IFrameTab,
        Control: dorado.widget.tab.ControlTab,
    });
})();
dorado.widget.AbstractPanel = $extend(dorado.widget.Container, {
    $className: "dorado.widget.AbstractPanel",
    ATTRIBUTES: {
        caption: {},
        buttons: { writeBeforeReady: true, innerComponent: "Button" },
        buttonAlign: {
            defaultValue: "center",
            skipRefresh: true,
            setter: function (value) {
                let panel = this, doms = panel._doms, oldValue = panel._buttonAlign;
                if (doms) {
                    if (oldValue && oldValue !== "center") {
                        $fly(doms.buttonPanel).removeClass("button-panel-" + oldValue);
                    }
                    if (value && value !== "center") {
                        $fly(doms.buttonPanel).addClass("button-panel-" + value);
                    }
                }
                panel._buttonAlign = value;
            },
        },
        collapseable: {
            setter: function (value) {
                let panel = this, captionBar = panel._captionBar, button;
                panel._collapseable = value;
                if (captionBar) {
                    button = captionBar.getButton(panel._uniqueId + "_collapse");
                    if (value) {
                        if (button) {
                            $fly(button._dom).css("display", "");
                        }
                        else {
                            panel._createCollapseButton();
                        }
                    }
                    else {
                        if (button) {
                            $fly(button._dom).css("display", "none");
                        }
                    }
                }
            },
        },
        collapsed: {
            getter: function (attr, value) {
                let panel = this;
                if (panel._parent instanceof dorado.widget.SplitPanel &&
                    panel._parent._sideControl === panel &&
                    panel._parent._collapseable) {
                    return panel._parent._collapsed;
                }
                else {
                    return panel._collapsed;
                }
            },
            setter: function (value) {
                let panel = this;
                if (panel._rendered) {
                    panel.doSetCollapsed(value);
                }
                else {
                    panel._collapsed = value;
                    if (panel._collapseable) {
                        panel._contentContainerVisible = !value;
                    }
                }
            },
        },
        lazyInitChildren: { writerBeforeReady: true },
    },
    EVENTS: { beforeCollapsedChange: {}, onCollapsedChange: {} },
    isLazyInitChildren: function () {
        return this._isLazyInitChildren && this._collapsed;
    },
    doOnResize: function () {
        this._doOnResize();
        $invokeSuper.call(this);
    },
    toggleCollapsed: function (animate) {
        let panel = this, collapsed = panel.get("collapsed");
        panel.doSetCollapsed(!collapsed, animate);
    },
    setContentContainerVisible: function (collapsed) {
        let panel = this, buttons = panel._buttons, doms = panel._doms;
        if (buttons) {
            for (let i = 0, j = buttons.length; i < j; i++) {
                let button = buttons[i];
                button.setActualVisible(collapsed);
            }
        }
        if (doms && dorado.Browser.msie && dorado.Browser.version < 8) {
            $fly(doms.body).css("zoom", "1");
        }
        $invokeSuper.call(this, arguments);
    },
    doSetCollapsed: function (collapsed, animate) {
        function beforeCollapsedChange(panel, collapsed) {
            if (collapsed) {
                panel._heightBeforeCollapse = panel.getRealHeight();
            }
            panel.setContentContainerVisible(!collapsed);
        }
        function onCollapsedChange(panel, collapsed) {
            panel._doOnResize(collapsed);
            if (dorado.Browser.msie && !collapsed) {
                $fly(panel.getContentContainer()).css("zoom", 1);
            }
            panel.notifySizeChange(false, true);
            panel.fireEvent("onCollapsedChange", panel);
        }
        let panel = this, dom = panel._dom, doms = panel._doms, collapseButton = panel._collapseButton, eventArg = {};
        panel.fireEvent("beforeCollapsedChange", panel, eventArg);
        if (eventArg.processDefault === false) {
            return;
        }
        if (!collapsed && this._lazyInitChildren) {
            this._lazyInitChildren();
        }
        if (panel._parent instanceof dorado.widget.SplitPanel &&
            panel._parent._sideControl === panel &&
            panel._parent._collapseable) {
            let direction = panel._parent._direction;
            if (collapseButton) {
                collapseButton.set("iconClass", collapsed
                    ? "expand-icon expand-icon-" + direction
                    : "collapse-icon collapse-icon-" + direction);
            }
            if (!panel._splitPanelCascade) {
                panel._parent.doSetCollapsed(collapsed, function () {
                    beforeCollapsedChange(panel, collapsed);
                    onCollapsedChange(panel, collapsed);
                }, true);
            }
        }
        else {
            panel._collapsed = collapsed;
            let orginalZIndex;
            if (panel._rendered) {
                if (collapsed) {
                    if (!animate) {
                        $fly(dom).addClass(panel._className + "-collapsed");
                        if (collapseButton) {
                            collapseButton.set("iconClass", "expand-icon");
                        }
                        $fly(doms.body).css("display", "none");
                        beforeCollapsedChange(panel, collapsed);
                        onCollapsedChange(panel, collapsed);
                    }
                    else {
                        $fly(doms.body).safeSlideOut({
                            direction: "b2t",
                            start: function () {
                                orginalZIndex = dom.style.zIndex;
                                $fly(dom)
                                    .bringToFront()
                                    .addClass(panel._className + "-collapsed");
                                if (collapseButton) {
                                    collapseButton.set("iconClass", "expand-icon");
                                }
                                beforeCollapsedChange(panel, collapsed);
                            },
                            step: function () { },
                            complete: function () {
                                onCollapsedChange(panel, collapsed);
                                dom.style.zIndex = orginalZIndex || "";
                                orginalZIndex = null;
                            },
                        });
                    }
                }
                else {
                    if (!animate) {
                        $fly(dom).removeClass(panel._className + "-collapsed");
                        if (collapseButton) {
                            collapseButton.set("iconClass", "collapse-icon");
                        }
                        $fly(doms.body).css("display", "");
                        beforeCollapsedChange(panel, collapsed);
                        onCollapsedChange(panel, collapsed);
                    }
                    else {
                        let $body = jQuery(doms.body).css("display", "");
                        beforeCollapsedChange(panel, collapsed);
                        $body.safeSlideIn({
                            direction: "t2b",
                            start: function () {
                                orginalZIndex = dom.style.zIndex;
                                $fly(dom)
                                    .bringToFront()
                                    .removeClass(panel._className + "-collapsed");
                            },
                            step: function () { },
                            complete: function () {
                                if (collapseButton) {
                                    collapseButton.set("iconClass", "collapse-icon");
                                }
                                onCollapsedChange(panel, collapsed);
                                dom.style.zIndex = orginalZIndex || "";
                                orginalZIndex = null;
                            },
                        });
                    }
                }
            }
        }
    },
    _createButtonPanel: function (dom) {
        let panel = this, doms = panel._doms, buttonPanel = document.createElement("div");
        buttonPanel.className = "button-panel";
        doms.buttonPanel = buttonPanel;
        if (doms.body) {
            $fly(doms.body).append(buttonPanel);
        }
        else {
            $fly(dom).append(buttonPanel);
        }
        return buttonPanel;
    },
    initButtons: function (dom) {
        let panel = this, doms = panel._doms;
        if (panel._buttons) {
            let buttons = panel._buttons, button, buttonPanel;
            buttonPanel = panel._createButtonPanel(dom);
            for (let i = 0, j = buttons.length; i < j; i++) {
                button = buttons[i];
                panel.registerInnerControl(button);
                button.render(buttonPanel);
            }
            let buttonAlign = panel._buttonAlign;
            if (buttonAlign && buttonAlign !== "center") {
                $fly(doms.buttonPanel).addClass("button-panel-" + buttonAlign);
            }
        }
    },
    getFocusableSubControls: function () {
        let controls = this._children ? this._children : [];
        return controls.concat(this._buttons);
    },
});
dorado.widget.Panel = $extend(dorado.widget.AbstractPanel, {
    $className: "dorado.widget.Panel",
    ATTRIBUTES: {
        className: { defaultValue: "d-panel" },
        caption: { skipRefresh: true, path: "_captionBar.caption" },
        width: { defaultValue: 300 },
        border: { writeOnce: true, defaultValue: "normal" },
        background: {},
        showCaptionBar: { writeBeforeReady: true },
        icon: { skipRefresh: true, path: "_captionBar.icon" },
        iconClass: { skipRefresh: true, path: "_captionBar.iconClass" },
        tools: { innerComponent: "SimpleIconButton" },
        maximizeable: {
            setter: function (value) {
                let panel = this, captionBar = panel._captionBar, button;
                panel._maximizeable = value;
                if (captionBar) {
                    button = captionBar.getButton(panel._uniqueId + "_maximize");
                    if (value) {
                        if (button) {
                            $fly(button._dom).css("display", "");
                        }
                        else {
                            panel._createMaximizeButton();
                        }
                    }
                    else {
                        if (button) {
                            $fly(button._dom).css("display", "none");
                        }
                    }
                }
            },
        },
        maximized: {
            setter: function (value) {
                this._maximized = value;
                if (this._maximizeable && this._rendered) {
                    if (this.isActualVisible()) {
                        if (value) {
                            this.maximize();
                        }
                        else {
                            this.maximizeRestore();
                        }
                    }
                    else {
                        this._maximizedDirty = true;
                    }
                }
            },
        },
        closeable: {
            setter: function (value) {
                let panel = this, captionBar = panel._captionBar, button;
                panel._closeable = value;
                if (captionBar) {
                    button = captionBar.getButton(panel._uniqueId + "_close");
                    if (value) {
                        if (button) {
                            $fly(button._dom).css("display", "");
                        }
                        else {
                            panel._createCloseButton();
                        }
                    }
                    else {
                        if (button) {
                            $fly(button._dom).css("display", "none");
                        }
                    }
                }
            },
        },
        closeAction: { defaultValue: "hide" },
    },
    EVENTS: { beforeMaximize: {}, onMaximize: {}, beforeClose: {}, onClose: {} },
    doOnAttachToDocument: function () {
        if (this._maximizeable && this._maximized) {
            this.maximize();
        }
        $invokeSuper.call(this, arguments);
    },
    onActualVisibleChange: function () {
        $invokeSuper.call(this, arguments);
        if (this.isActualVisible() && this._maximizeable && this._maximizedDirty) {
            if (this._maximized) {
                this.maximize();
            }
            else {
                this.maximizeRestore();
            }
            this._maximizedDirty = false;
        }
    },
    createDom: function () {
        let panel = this, doms = {}, dom;
        dom = $DomUtils.xCreate({
            tagName: "div",
            content: {
                tagName: "div",
                className: "panel-body",
                contextKey: "body",
                content: {
                    tagName: "div",
                    className: "content-panel",
                    contextKey: "contentPanel",
                },
            },
        }, null, doms);
        panel._doms = doms;
        let caption = panel._caption, showCaptionBar = panel._showCaptionBar;
        if (showCaptionBar !== false && (caption || showCaptionBar)) {
            $fly(dom).addClass(panel._className + "-showcaptionbar");
            let tools = panel._tools, toolButtons = [];
            if (tools instanceof Array) {
                for (let i = 0, j = tools.length; i < j; i++) {
                    let tool = tools[i];
                    if (tool) {
                        toolButtons.push(tool);
                    }
                }
            }
            let captionBar = (panel._captionBar = new dorado.widget.CaptionBar({
                caption: panel._caption,
                icon: panel._icon,
                iconClass: panel._iconClass,
                buttons: toolButtons,
            }));
            if (doms.body) {
                captionBar.render(doms.body.parentNode, doms.body);
            }
            else {
                captionBar.render(dom, doms.contentPanel);
            }
            doms.captionBar = captionBar._dom;
            panel.registerInnerControl(captionBar);
            if (panel._collapseable) {
                panel._createCollapseButton();
            }
            if (panel._collapsed) {
                $fly(doms.body).css("display", "none");
            }
        }
        panel.initButtons(dom);
        if (panel._collapsed) {
            $fly(dom).addClass(panel._className + "-collapsed");
        }
        if (panel._closeable) {
            panel._createCloseButton();
        }
        if (panel._maximizeable) {
            panel._createMaximizeButton();
        }
        return dom;
    },
    _createCollapseButton: function () {
        let panel = this;
        if (!panel._captionBar) {
            return;
        }
        let collapseButton = (panel._collapseButton =
            new dorado.widget.SimpleIconButton({
                exClassName: "d-collapse-button",
                iconClass: panel._collapsed ? "expand-icon" : "collapse-icon",
                onCreate: function (self) {
                    self._uniqueId = panel._uniqueId + "_collapse";
                },
                onClick: function () {
                    panel.toggleCollapsed(true);
                },
            }));
        if (panel._parent instanceof dorado.widget.SplitPanel &&
            panel._parent._sideControl === panel &&
            panel._parent._collapseable) {
            let direction = panel._parent._direction;
            collapseButton.set("iconClass", panel._collapsed
                ? "expand-icon expand-icon-" + direction
                : "collapse-icon collapse-icon-" + direction);
        }
        panel._captionBar.addButton(collapseButton, 101);
    },
    _createCloseButton: function () {
        let panel = this, captionBar = panel._captionBar;
        if (captionBar) {
            captionBar.addButton(new dorado.widget.SimpleIconButton({
                exClassName: "d-close-button",
                iconClass: "close-icon",
                onCreate: function (self) {
                    self._uniqueId = panel._uniqueId + "_close";
                },
                onClick: function () {
                    panel.close();
                },
            }), 104);
        }
    },
    doClose: function () {
        let panel = this;
        panel.set("visible", false);
    },
    close: function () {
        let panel = this, eventArg = {};
        panel.fireEvent("beforeClose", panel, eventArg);
        if (eventArg.processDefault === false) {
            return;
        }
        panel.doClose();
        panel.fireEvent("onClose", panel);
        if (panel._closeAction === "close") {
            panel.destroy();
        }
    },
    _doOnResize: function (collapsed) {
        let panel = this, dom = panel._dom, doms = panel._doms, height = panel.getRealHeight();
        if (typeof height === "number" && height > 0) {
            if (collapsed === undefined) {
                collapsed = panel._collapsed;
            }
            if (collapsed) {
                $fly(dom).height("auto");
            }
            else {
                if (collapsed === false && panel._heightBeforeCollapse) {
                    height = panel._heightBeforeCollapse;
                    panel._heightBeforeCollapse = null;
                }
                height -=
                    (parseInt(jQuery.css(dom, "borderTopWidth")) || 0) +
                        (parseInt(jQuery.css(dom, "borderBottomWidth")) || 0);
                let buttonPanelHeight = 0, captionBarHeight = 0;
                if (doms.buttonPanel) {
                    buttonPanelHeight = $fly(doms.buttonPanel).outerHeight(true);
                }
                if (doms.captionBar) {
                    captionBarHeight = $fly(doms.captionBar).outerHeight(true);
                }
                $fly(doms.contentPanel).outerHeight(height - captionBarHeight - buttonPanelHeight);
                $fly(dom).height("auto");
            }
        }
    },
    refreshDom: function (dom) {
        let panel = this, doms = panel._doms;
        $invokeSuper.call(this, arguments);
        if (this._background) {
            doms.contentPanel.style.background = this._background;
        }
    },
    getContentContainer: function () {
        return this._doms.contentPanel;
    },
    maximizeRestore: function () {
        let panel = this, dom = panel._dom, doms = panel._doms;
        if (dom) {
            $fly(doms.contentPanel).css("display", "");
            if (panel._maximizedDirty || panel._maximized) {
                $fly(dom).unfullWindow({
                    callback: function () {
                        panel._maximized = false;
                        panel._width = panel._originalWidth;
                        panel._height = panel._originalHeight;
                        panel._realWidth = panel._originalRealWidth;
                        panel._realHeight = panel._originalRealHeight;
                        panel._left = panel._originalLeft;
                        panel._top = panel._originalTop;
                        panel.refresh();
                        if (panel._left !== undefined && panel._top !== undefined) {
                            $fly(dom).css({ left: panel._left, top: panel._top });
                        }
                    },
                });
                if (panel._draggable) {
                    jQuery(dom).draggable("enable");
                }
                let captionBar = panel._captionBar;
                if (captionBar) {
                    let button = captionBar.getButton(panel._uniqueId + "_maximize");
                    if (button) {
                        $fly(button._dom)
                            .removeClass("d-restore-button")
                            .addClass("d-maximize-button");
                        button._className = "d-maximize-button";
                    }
                }
            }
        }
    },
    maximize: function () {
        let panel = this, dom = panel._dom;
        if (dom) {
            let eventArg = {};
            panel.fireEvent("beforeMaximize", panel, eventArg);
            if (eventArg.processDefault === false) {
                return;
            }
            panel._originalWidth = panel._width;
            panel._originalHeight = panel._height;
            panel._originalRealWidth = panel._realWidth;
            panel._originalRealHeight = panel._realHeight;
            panel._originalLeft = panel._left;
            panel._originalTop = panel._top;
            let captionBar = panel._captionBar;
            if (captionBar) {
                let button = captionBar.getButton(panel._uniqueId + "_maximize");
                if (button) {
                    $fly(button._dom)
                        .removeClass("d-maximize-button")
                        .addClass("d-restore-button");
                    button._className = "d-restore-button";
                }
            }
            $fly(dom).fullWindow({
                modifySize: false,
                callback: function (docSize) {
                    panel._maximized = true;
                    panel._width = docSize.width;
                    panel._height = docSize.height;
                    panel._realWidth = panel._realHeight = undefined;
                    panel.refresh();
                },
            });
            if (panel._draggable) {
                jQuery(dom).draggable("disable");
            }
            panel.fireEvent("onMaximize", panel);
        }
    },
    _createMaximizeButton: function () {
        let panel = this, captionBar = panel._captionBar;
        if (captionBar) {
            captionBar.addButton(new dorado.widget.SimpleIconButton({
                exClassName: "d-maximize-button",
                iconClass: "maximize-icon",
                onCreate: function (self) {
                    self._uniqueId = panel._uniqueId + "_maximize";
                },
                onClick: function () {
                    if (!panel._maximized) {
                        panel.maximize();
                    }
                    else {
                        panel.maximizeRestore();
                    }
                },
            }), 103);
        }
    },
});
dorado.widget.FieldSet = $extend(dorado.widget.AbstractPanel, {
    $className: "dorado.widget.FieldSet",
    ATTRIBUTES: {
        caption: { skipRefresh: false },
        className: { defaultValue: "d-field-set" },
        collapseable: {
            defaultValue: true,
            skipRefresh: true,
            setter: function (value) {
                this._collapseable = value;
                if (value) {
                    if (this._rendered) {
                        if (!this._doms.icon) {
                            this._createCollapseButton();
                        }
                        else {
                            $fly(this._doms.icon).css("display", "");
                        }
                    }
                }
                else {
                    if (this._doms && this._doms.icon) {
                        $fly(this._doms.icon).css("display", "none");
                    }
                }
            },
        },
    },
    createDom: function () {
        let fieldset = this, doms = {}, dom = $DomUtils.xCreate({
            tagName: "fieldset",
            content: [
                {
                    tagName: "legend",
                    className: "field-set-legend",
                    contextKey: "captionContainer",
                    content: [
                        {
                            tagName: "span",
                            className: "caption",
                            contextKey: "caption",
                            content: fieldset._caption,
                        },
                    ],
                },
                {
                    tagName: "div",
                    className: "body",
                    contextKey: "body",
                    content: {
                        contextKey: "contentPanel",
                        tagName: "div",
                        className: "content-panel",
                    },
                },
            ],
        }, null, doms);
        fieldset._doms = doms;
        fieldset.initButtons(dom);
        if (fieldset._collapsed) {
            $fly(dom).addClass(fieldset._className + "-collapsed");
            $fly(doms.body).css("display", "none");
        }
        if (fieldset._collapseable) {
            fieldset._createCollapseButton();
        }
        return dom;
    },
    _createCollapseButton: function () {
        let fieldset = this, doms = fieldset._doms, button = document.createElement("span");
        button.className = "collapse-button";
        doms.icon = button;
        jQuery(doms.icon)
            .click(function () {
            fieldset.toggleCollapsed(true);
        })
            .addClassOnHover("collapse-button-hover")
            .addClassOnClick("collapse-button-click");
        doms.captionContainer.insertBefore(button, doms.caption);
    },
    refreshDom: function (dom) {
        let fieldset = this;
        $fly(dom)[fieldset._collapsed ? "addClass" : "removeClass"]("i-field-set-collapsed " + fieldset._className + "-collapsed");
        $fly(fieldset._doms.caption).html(fieldset._caption || "&nbsp;");
        $invokeSuper.call(this, arguments);
    },
    _doOnResize: function (collapsed) {
        let fieldset = this, dom = fieldset._dom, doms = fieldset._doms, height = fieldset.getRealHeight();
        if (typeof height === "number" && height > 0) {
            if (collapsed === undefined) {
                collapsed = fieldset._collapsed;
            }
            if (collapsed) {
                $fly(dom).height("auto");
            }
            else {
                if (collapsed === false && fieldset._heightBeforeCollapse) {
                    height = fieldset._heightBeforeCollapse;
                    fieldset._heightBeforeCollapse = null;
                }
                let buttonPanelHeight = 0, captionCtHeight = 0;
                if (doms.buttonPanel) {
                    buttonPanelHeight = $fly(doms.buttonPanel).outerHeight(true);
                }
                if (doms.captionContainer) {
                    captionCtHeight = $fly(doms.captionContainer).outerHeight(true);
                }
                let $dom = jQuery(dom), edgeHeight = $dom.edgeHeight();
                $fly(doms.contentPanel).outerHeight(height - captionCtHeight - buttonPanelHeight - edgeHeight);
                $fly(dom).height("auto");
            }
        }
    },
    getContentContainer: function () {
        return this._doms.contentPanel;
    },
});
dorado.widget.GroupBox = $extend(dorado.widget.AbstractPanel, {
    $className: "dorado.widget.GroupBox",
    ATTRIBUTES: {
        className: { defaultValue: "d-group-box" },
        caption: { skipRefresh: false },
        collapseable: {
            defaultValue: true,
            skipRefresh: true,
            setter: function (value) {
                this._collapseable = value;
                if (value) {
                    if (this._rendered) {
                        if (!this._doms.icon) {
                            this._createCollapseButton();
                        }
                        else {
                            $fly(this._doms.icon).css("display", "");
                        }
                    }
                }
                else {
                    if (this._doms && this._doms.icon) {
                        $fly(this._doms.icon).css("display", "none");
                    }
                }
            },
        },
    },
    createDom: function () {
        let groupBox = this, doms = {}, dom = $DomUtils.xCreate({
            tagName: "div",
            className: groupBox._className,
            content: [
                {
                    tagName: "div",
                    className: "caption-bar",
                    contextKey: "captionContainer",
                    content: [
                        {
                            tagName: "div",
                            className: "caption",
                            content: groupBox._caption,
                            contextKey: "caption",
                        },
                        { tagName: "div", className: "bar-right" },
                    ],
                },
                {
                    tagName: "div",
                    className: "body",
                    contextKey: "body",
                    content: {
                        contextKey: "contentPanel",
                        tagName: "div",
                        className: "content-panel",
                    },
                },
            ],
        }, null, doms);
        groupBox._doms = doms;
        groupBox.initButtons(dom);
        if (groupBox._collapsed) {
            $fly(dom).addClass(groupBox._className + "-collapsed");
            $fly(doms.body).css("display", "none");
        }
        if (groupBox._collapseable) {
            groupBox._createCollapseButton();
        }
        return dom;
    },
    _createCollapseButton: function () {
        let groupbox = this, doms = groupbox._doms;
        let button = document.createElement("div");
        button.className = "collapse-button";
        doms.icon = button;
        jQuery(doms.icon)
            .click(function () {
            groupbox.toggleCollapsed(true);
        })
            .addClassOnHover("collapse-button-hover")
            .addClassOnClick("collapse-button-click");
        doms.captionContainer.insertBefore(button, doms.caption);
    },
    refreshDom: function (dom) {
        let groupBox = this;
        $fly(dom)[groupBox._collapsed ? "addClass" : "removeClass"](groupBox._className + "-collapsed");
        $fly(groupBox._doms.caption).text(groupBox._caption);
        $invokeSuper.call(this, arguments);
        groupBox._doOnResize();
    },
    _doOnResize: function (collapsed) {
        let groupbox = this, dom = groupbox._dom, doms = groupbox._doms, height = groupbox.getRealHeight();
        if (typeof height === "number" && height > 0) {
            if (collapsed === undefined) {
                collapsed = groupbox._collapsed;
            }
            if (collapsed) {
                $fly(dom).height("auto");
            }
            else {
                if (collapsed === false && groupbox._heightBeforeCollapse) {
                    height = groupbox._heightBeforeCollapse;
                    groupbox._heightBeforeCollapse = null;
                }
                let buttonPanelHeight = 0, captionCtHeight = 0;
                if (doms.buttonPanel) {
                    buttonPanelHeight = $fly(doms.buttonPanel).outerHeight(true);
                }
                if (doms.captionContainer) {
                    captionCtHeight = $fly(doms.captionContainer).outerHeight(true);
                }
                $fly(doms.contentPanel).outerHeight(height - captionCtHeight - buttonPanelHeight);
                $fly(dom).height("auto");
            }
        }
    },
    getContentContainer: function () {
        return this._doms.contentPanel;
    },
});
dorado.widget.TabControl = $extend(dorado.widget.TabBar, {
    $className: "dorado.widget.TabControl",
    _inherentClassName: "",
    ATTRIBUTES: {
        height: { defaultValue: 200, independent: false, readOnly: false },
        dynaHeight: { defaultValue: false, writeBeforeReady: true },
    },
    constructor: function () {
        this._cardBook = new dorado.widget.CardBook();
        this.registerInnerControl(this._cardBook);
        $invokeSuper.call(this, arguments);
    },
    doOnTabChange: function (eventArg) {
        let tabControl = this, tabs = tabControl._tabs, tab = eventArg.newTab, index = typeof tab === "number" ? tab : tabs.indexOf(tab), card = tabControl._cardBook;
        if (card) {
            card.set("currentControl", index);
        }
        $invokeSuper.call(this, arguments);
    },
    doChangeTabPlacement: function (value) {
        let result = $invokeSuper.call(this, arguments);
        if (!result) {
            return false;
        }
        let tabcontrol = this, dom = tabcontrol._dom;
        if (dom) {
            let tabbarDom = tabcontrol._tabbarDom, cardDom = tabcontrol._cardBook._dom;
            if (dorado.Browser.msie && dorado.Browser.version === 6) {
                if (value === "top") {
                    dom.appendChild(cardDom);
                }
                else {
                    dom.insertBefore(cardDom, tabbarDom);
                }
            }
            else {
                if (value === "top") {
                    dom.insertBefore(tabbarDom, cardDom);
                }
                else {
                    dom.appendChild(tabbarDom);
                }
            }
        }
        return true;
    },
    doRemoveTab: function (tab) {
        let tabcontrol = this, tabs = tabcontrol._tabs, index = typeof tab === "number" ? tab : tabs.indexOf(tab), card = tabcontrol._cardBook;
        if (card) {
            card.removeControl(index);
        }
        $invokeSuper.call(this, arguments);
    },
    doAddTab: function (tab, index, current) {
        $invokeSuper.call(this, arguments);
        let tabcontrol = this, card = tabcontrol._cardBook, tabs = tabcontrol._tabs;
        if (index == null) {
            index = tabs.indexOf(tab);
        }
        if (card) {
            let control = tab.getControl();
            if (!control) {
                control = new dorado.widget.Control();
            }
            card.addControl(control, index, current);
        }
    },
    doOnAttachToDocument: function () {
        let className = "";
        if (this._ui) {
            let uis = this._ui.split(",");
            for (let i = 0; i < uis.length; i++) {
                className += " " + this._className + "-" + uis[i];
            }
        }
        if (className) {
            $fly(this._tabbarDom).addClass(className);
        }
    },
    createDom: function () {
        let tabcontrol = this, card = tabcontrol._cardBook, dom = document.createElement("div"), tabbarDom = $invokeSuper.call(this, arguments), tabPlacement = tabcontrol._tabPlacement;
        this._cardBook.set("dynaHeight", this._dynaHeight);
        if (tabPlacement === "top") {
            dom.appendChild(tabbarDom);
        }
        tabcontrol._tabbarDom = tabbarDom;
        let controls = [], tabs = tabcontrol._tabs;
        for (let i = 0, j = tabs.size; i < j; i++) {
            let tab = tabs.get(i);
            controls.push(tab.getControl());
        }
        let currentTab = tabcontrol._currentTab;
        if (currentTab) {
            card._currentControl = currentTab.getControl();
        }
        card.render(dom);
        if (tabPlacement === "bottom") {
            dom.appendChild(tabbarDom);
        }
        return dom;
    },
    doOnCardHeightChange: function () {
        this.notifySizeChange(false, true);
    },
    refreshDom: function (dom) {
        $invokeSuper.call(this, arguments);
        $fly(dom).prop("class", "");
        let tabcontrol = this, card = tabcontrol._cardBook, tabbarDom = tabcontrol._tabbarDom, cardDom = tabcontrol._cardBook._dom;
        tabcontrol.refreshTabBar();
        $fly(tabbarDom).css("height", "auto");
        let dynaHeight = tabcontrol._dynaHeight;
        if (dynaHeight) {
            $fly(dom).css("height", "");
        }
        if (tabcontrol._height != null) {
            if (!dynaHeight) {
                card._realHeight =
                    tabcontrol.getRealHeight() - $fly(tabbarDom).height();
            }
            card._realWidth = tabcontrol.getRealWidth();
        }
        let tabs = tabcontrol._tabs, currentTab = tabcontrol._currentTab, currentTabIndex = tabs.indexOf(currentTab);
        if (currentTabIndex !== -1) {
            card._currentControl = card._controls.get(currentTabIndex);
        }
        card.refreshDom(cardDom);
    },
    getFocusableSubControls: function () {
        return [this._cardBook];
    },
});
dorado.widget.VerticalTabControl = $extend(dorado.widget.TabColumn, {
    $className: "dorado.widget.VerticalTabControl",
    _inherentClassName: "",
    ATTRIBUTES: {
        height: { defaultValue: 200, independent: false, readOnly: false },
        tabColumnWidth: { defaultValue: 200 },
    },
    _constructor: function () {
        this._cardBook = new dorado.widget.CardBook();
        this.registerInnerControl(this._cardBook);
        $invokeSuper.call(this, arguments);
    },
    doOnTabChange: function (eventArg) {
        let tabcolumnControl = this, tabs = tabcolumnControl._tabs, tab = eventArg.newTab, index = typeof tab === "number" ? tab : tabs.indexOf(tab), card = tabcolumnControl._cardBook;
        if (card) {
            card.set("currentControl", index);
        }
        $invokeSuper.call(this, arguments);
    },
    doChangeTabPlacement: function (value) {
        let result = $invokeSuper.call(this, arguments);
        if (!result) {
            return false;
        }
        let tabcolumnControl = this, dom = tabcolumnControl._dom;
        if (dom) {
            let tabcolumnDom = tabcolumnControl._tabcolumnDom, cardDom = tabcolumnControl._cardBook._dom;
            if (dorado.Browser.msie && dorado.Browser.version === 6) {
                if (value === "left") {
                    dom.appendChild(cardDom);
                }
                else {
                    dom.insertBefore(cardDom, tabcolumnDom);
                }
            }
            else {
                if (value === "left") {
                    dom.insertBefore(tabcolumnDom, cardDom);
                }
                else {
                    dom.appendChild(tabcolumnDom);
                }
            }
        }
        return true;
    },
    doRemoveTab: function (tab) {
        let tabcolumnControl = this, tabs = tabcolumnControl._tabs, index = typeof tab === "number" ? tab : tabs.indexOf(tab), card = tabcolumnControl._cardBook;
        if (card) {
            card.removeControl(index);
        }
        $invokeSuper.call(this, arguments);
    },
    doAddTab: function (tab, index, current) {
        $invokeSuper.call(this, arguments);
        let tabcolumnControl = this, card = tabcolumnControl._cardBook, tabs = tabcolumnControl._tabs;
        if (index == null) {
            index = tabs.indexOf(tab);
        }
        if (card) {
            let control = tab.getControl();
            if (!control) {
                control = new dorado.widget.Control();
            }
            card.addControl(control, index, current);
        }
    },
    doOnAttachToDocument: function () {
        let className = "";
        if (this._ui) {
            let uis = this._ui.split(",");
            for (let i = 0; i < uis.length; i++) {
                className += " " + this._className + "-" + uis[i];
            }
        }
        if (className) {
            $fly(this._tabcolumnDom).addClass(className);
        }
    },
    createDom: function () {
        let tabcolumnControl = this, card = tabcolumnControl._cardBook, dom = document.createElement("div"), tabcolumnDom = $invokeSuper.call(this, arguments), tabPlacement = tabcolumnControl._tabPlacement;
        if (tabPlacement === "left") {
            dom.appendChild(tabcolumnDom);
        }
        tabcolumnControl._tabcolumnDom = tabcolumnDom;
        let currentTab = tabcolumnControl._currentTab;
        if (currentTab) {
            card._currentControl = currentTab.getControl();
        }
        card.render(dom);
        if (tabPlacement === "right") {
            dom.appendChild(tabcolumnDom);
        }
        return dom;
    },
    refreshDom: function (dom) {
        $invokeSuper.call(this, arguments);
        let tabcolumnControl = this, card = tabcolumnControl._cardBook, tabcolumnDom = tabcolumnControl._tabcolumnDom, cardDom = tabcolumnControl._cardBook._dom;
        tabcolumnControl.refreshTabColumn();
        let tabColumnWidth = tabcolumnControl._tabColumnWidth || 200;
        $fly(tabcolumnDom)
            .css({ height: "auto", float: "left" })
            .css("width", tabcolumnControl._verticalText ? "" : tabColumnWidth);
        $fly(cardDom).css("float", "left");
        if (tabcolumnControl._height != null) {
            card._realHeight = tabcolumnControl.getRealHeight();
            card._realWidth =
                tabcolumnControl.getRealWidth() - $fly(tabcolumnDom).outerWidth(true);
        }
        let tabs = tabcolumnControl._tabs, currentTab = tabcolumnControl._currentTab, currentTabIndex = tabs.indexOf(currentTab);
        if (currentTabIndex !== -1) {
            card._currentControl = card._controls.get(currentTabIndex);
        }
        card.refreshDom(cardDom);
    },
    getFocusableSubControls: function () {
        return [this._cardBook];
    },
    setFocus: function () {
        let dom = this._tabcolumnDom;
        if (dom) {
            dom.focus();
        }
    },
});
dorado.widget.CaptionBar = $extend(dorado.widget.Control, {
    $className: "dorado.widget.CaptionBar",
    ATTRIBUTES: {
        className: { defaultValue: "d-caption-bar" },
        caption: {},
        icon: {},
        iconClass: {},
        buttons: {
            innerComponent: "SimpleIconButton",
            setter: function (value) {
                let bar = this, oldValue = bar._buttons;
                if (oldValue) {
                    bar.clearButtons();
                }
                if (!bar._buttons) {
                    bar._buttons = new dorado.util.KeyedArray(function (value) {
                        return value._uniqueId;
                    });
                }
                if (value instanceof Array) {
                    for (let i = 0, j = value.length; i < j; i++) {
                        bar._buttons.insert(value[i]);
                    }
                }
                else {
                    if (value instanceof dorado.util.KeyedArray) {
                        for (let i = 0, j = value.size; i < j; i++) {
                            bar._buttons.insert(value.get(i));
                        }
                    }
                }
            },
        },
        height: { independent: true, readOnly: true },
    },
    addButton: function (button, index) {
        let bar = this, buttons = bar._buttons, doms = bar._doms, refBtn, dom = bar._dom;
        if (!bar._buttons) {
            buttons = bar._buttons = new dorado.util.KeyedArray(function (value) {
                return value._uniqueId;
            });
        }
        if (index == null) {
            buttons.insert(button);
        }
        else {
            if (typeof index === "number") {
                if (index > 100) {
                    let prevPriority = 0, target = index, insertIndex;
                    button._cbPriority = index;
                    for (let i = 0, j = buttons.size; i < j; i++) {
                        let btn = buttons.get(i), priority = btn._cbPriority || 0;
                        if (prevPriority <= target && priority > target) {
                            refBtn = btn;
                            insertIndex = i;
                            break;
                        }
                        prevPriority = priority;
                    }
                    buttons.insert(button, insertIndex);
                }
                else {
                    refBtn = buttons.get(index);
                    buttons.insert(button, index);
                }
            }
            else {
                if (typeof index === "string") {
                    refBtn = buttons.get(index);
                    if (!refBtn) {
                        buttons.insert(button);
                    }
                    else {
                        buttons.insert(button, "before", refBtn);
                    }
                }
            }
        }
        bar.registerInnerControl(button);
        if (dom) {
            if (!doms.buttonGroup) {
                bar._createButtonGroup();
            }
            button.render(doms.buttonGroup, refBtn ? refBtn._dom : null);
        }
    },
    getButton: function (button) {
        let bar = this, buttons = bar._buttons;
        if (buttons && (typeof button === "number" || typeof button === "string")) {
            return buttons.get(button);
        }
        else {
            return button;
        }
    },
    removeButton: function (button) {
        let bar = this, buttons = bar._buttons;
        if (typeof button === "string" || typeof button === "number") {
            button = buttons.get(button);
        }
        if (button) {
            bar.unregisterInnerControl(button);
            button.destroy();
            buttons.remove(button);
        }
    },
    clearButtons: function () {
        let bar = this, buttons = bar._buttons;
        if (buttons) {
            for (let i = 0, j = buttons.size; i < j; i++) {
                let button = buttons.get(i);
                bar.unregisterInnerControl(button);
                button.destroy();
                buttons.removeAt(0);
            }
        }
    },
    _createIcon: function (dom) {
        let bar = this, doms = bar._doms;
        dom = dom ? dom : bar._dom;
        let icon = document.createElement("div");
        icon.className = "caption-bar-icon";
        $fly(icon).insertBefore(doms.caption);
        doms.icon = icon;
    },
    _createButtonGroup: function (dom) {
        let bar = this, doms = bar._doms;
        dom = dom ? dom : bar._dom;
        let buttonGroup = document.createElement("div");
        buttonGroup.className = "button-group";
        $fly(dom).prepend(buttonGroup);
        doms.buttonGroup = buttonGroup;
    },
    createDom: function () {
        let bar = this, buttons = bar._buttons, doms = {}, dom = $DomUtils.xCreate({
            tagName: "div",
            content: [
                {
                    tagName: "div",
                    className: "caption",
                    content: bar._caption,
                    contextKey: "caption",
                },
            ],
        }, null, doms);
        bar._doms = doms;
        if (buttons) {
            bar._createButtonGroup(dom);
            for (let i = 0, j = buttons.size; i < j; i++) {
                let button = buttons.get(i);
                bar.registerInnerControl(button);
                button.render(doms.buttonGroup);
            }
        }
        let icon = bar._icon, iconCls = bar._iconClass;
        if (icon || iconCls) {
            bar._createIcon(dom);
            $fly(doms.icon).addClass(iconCls);
            $DomUtils.setBackgroundImage(doms.icon, icon);
        }
        return dom;
    },
    refreshDom: function () {
        $invokeSuper.call(this, arguments);
        let bar = this, doms = bar._doms;
        $fly(doms.caption).text(bar._caption);
        let icon = bar._icon, iconCls = bar._iconClass;
        if (!icon && !iconCls && doms.icon) {
            $fly(doms.icon).css("display", "none");
        }
        else {
            if (doms.icon) {
                $fly(doms.icon)
                    .prop("className", "caption-bar-icon")
                    .css("display", "");
            }
            if ((icon || iconCls) && !doms.icon) {
                bar._createIcon();
            }
            if (icon) {
                $DomUtils.setBackgroundImage(doms.icon, icon);
            }
            if (iconCls) {
                $fly(doms.icon).addClass(iconCls);
            }
        }
    },
});
(function () {
    let icons = {
        WARNING: "warning-icon",
        ERROR: "error-icon",
        INFO: "info-icon",
        QUESTION: "question-icon",
        "warning-icon": "warning-icon",
        "error-icon": "error-icon",
        "info-icon": "info-icon",
        "question-icon": "question-icon",
    };
    dorado.MessageBox = {
        _runStack: [],
        defaultTitle: "",
        minWidth: 300,
        maxWidth: 800,
        OK: ["ok"],
        CANCEL: ["cancel"],
        OKCANCEL: ["ok", "cancel"],
        YESNO: ["yes", "no"],
        YESNOCANCEL: ["yes", "no", "cancel"],
        WARNING_ICON: "warning-icon",
        ERROR_ICON: "error-icon",
        INFO_ICON: "info-icon",
        QUESTION_ICON: "question-icon",
        SINGLE_EDITOR: null,
        buttonText: {
            ok: "dorado.baseWidget.MessageBoxButtonOK",
            cancel: "dorado.baseWidget.MessageBoxButtonCancel",
            yes: "dorado.baseWidget.MessageBoxButtonYes",
            no: "dorado.baseWidget.MessageBoxButtonNo",
        },
        highlightButtons: ["ok", "yes"],
        declineButtons: [],
        onButtonClick: function (buttonIndex) {
            let buttonId;
            if (dorado.MessageBox._runStack.length > 0) {
                let config = dorado.MessageBox._runStack[0];
                if (buttonIndex === "close") {
                    if (config.closeAction) {
                        buttonId = config.closeAction;
                    }
                    else {
                        buttonIndex = config.buttons[config.buttons.length - 1];
                    }
                }
                if (typeof config.detailCallback === "function" ||
                    typeof config.callback === "function") {
                    if (!buttonId) {
                        buttonId = config.buttons[buttonIndex];
                    }
                    let text = null;
                    if (config.editor !== "none") {
                        if (buttonId !== "ok") {
                            text = "";
                        }
                        else {
                            switch (config.editor) {
                                case "singleLine":
                                    text = dorado.MessageBox.SINGLE_EDITOR.get("value");
                                    break;
                                case "multiLines":
                                    text = dorado.MessageBox.TEXTAREA.get("value");
                                    break;
                            }
                        }
                    }
                    dorado.MessageBox._callbackConfig = {
                        callback: config.callback,
                        detailCallback: config.detailCallback,
                        buttonId: buttonId,
                        text: text,
                    };
                }
                dorado.MessageBox._runStack.splice(0, 1);
            }
            dorado.MessageBox._dialog && dorado.MessageBox._dialog.hide();
        },
        executeCallback: function () {
            if (!dorado.MessageBox._callbackConfig) {
                return;
            }
            setTimeout(function () {
                let config = dorado.MessageBox._callbackConfig, buttonId = config.buttonId, text = config.text;
                if (typeof config.callback === "function" &&
                    (buttonId === "yes" || buttonId === "ok")) {
                    config.callback.apply(null, [text]);
                }
                if (typeof config.detailCallback === "function") {
                    config.detailCallback.apply(null, [buttonId, text]);
                }
                dorado.MessageBox._callbackConfig = null;
            }, 0);
        },
        getDialog: function () {
            if (!dorado.MessageBox._dialog) {
                dorado.MessageBox.defaultTitle = $resource("dorado.baseWidget.MessageBoxDefaultTitle");
                dorado.MessageBox._dialog = new dorado.widget.Dialog({
                    focusAfterShow: false,
                    align: "center",
                    vAlign: "center",
                    width: dorado.MessageBox.maxWidth,
                    resizeable: false,
                    exClassName: "d-message-box",
                    modal: true,
                    modalType: $setting["widget.MessageBox.defaultModalType"] || "transparent",
                    closeAction: "hide",
                    buttons: [
                        {
                            width: 60,
                            listener: {
                                onClick: function () {
                                    dorado.MessageBox.onButtonClick(0);
                                },
                            },
                        },
                        {
                            width: 60,
                            listener: {
                                onClick: function () {
                                    dorado.MessageBox.onButtonClick(1);
                                },
                            },
                        },
                        {
                            width: 60,
                            listener: {
                                onClick: function () {
                                    dorado.MessageBox.onButtonClick(2);
                                },
                            },
                        },
                    ],
                });
                dorado.MessageBox._dialog.doOnAttachToDocument = function () {
                    let dialog = this, dom = dialog.getContentContainer(), doms = dialog._doms;
                    dorado.widget.Dialog.prototype.doOnAttachToDocument.apply(dialog, []);
                    if (dom) {
                        dom.appendChild($DomUtils.xCreate({
                            tagName: "div",
                            className: "msg-content",
                            contextKey: "msgContent",
                            content: [
                                {
                                    tagName: "span",
                                    className: "msg-icon",
                                    contextKey: "msgIcon",
                                },
                                {
                                    tagName: "span",
                                    className: "msg-text",
                                    contextKey: "msgText",
                                    content: dorado.MessageBox._lastText,
                                },
                            ],
                        }, null, doms));
                        let editorWrap = $DomUtils.xCreate({
                            tagName: "div",
                            className: "editor-wrap",
                        });
                        doms.editorWrap = editorWrap;
                        let editor = new dorado.widget.TextEditor();
                        editor.render(editorWrap);
                        $fly(editor._dom).css("display", "none");
                        dorado.MessageBox.SINGLE_EDITOR = editor;
                        dialog.registerInnerControl(editor);
                        dom.appendChild(editorWrap);
                        let textareaWrap = $DomUtils.xCreate({
                            tagName: "div",
                            className: "textarea-wrap",
                        });
                        doms.textareaWrap = textareaWrap;
                        let textarea = new dorado.widget.TextArea();
                        textarea.render(textareaWrap);
                        $fly(textarea._dom).css("display", "none");
                        dorado.MessageBox.TEXTAREA = textarea;
                        dialog.registerInnerControl(textarea);
                        dom.appendChild(textareaWrap);
                        dorado.MessageBox.updateText(dorado.MessageBox._lastText, dorado.MessageBox._lastIcon, dorado.MessageBox._lastEditor, dorado.MessageBox._lastValue);
                    }
                    dialog.bind("beforeShow", function (self, arg) {
                        let dom = self._dom;
                        $fly(dom).width(dorado.MessageBox.maxWidth);
                        if (dorado.Browser.msie && dom.offsetWidth === 0) {
                            arg.processDefault = false;
                            setTimeout(function () {
                                self.show();
                            }, 100);
                            return;
                        }
                        let doms = self._doms, contentWidth = $fly(doms.msgText).outerWidth(true) +
                            $fly(doms.msgContent).outerWidth() -
                            $fly(doms.msgContent).width();
                        if (contentWidth < dorado.MessageBox.minWidth) {
                            contentWidth = dorado.MessageBox.minWidth;
                        }
                        else {
                            if (contentWidth > dorado.MessageBox.maxWidth) {
                                contentWidth = dorado.MessageBox.maxWidth;
                            }
                        }
                        let dialogWidth = $fly(dom).width(), panelWidth = $fly(doms.contentPanel).width();
                        self._width = contentWidth + dialogWidth - panelWidth;
                        $fly(dom).width(self._width);
                        self._height = null;
                        self.doOnResize();
                        let options = dorado.MessageBox._runStack[0];
                        let buttons = options.buttons || [], buttonCount = buttons.length, editor = options.editor || "none", dlgButtons = self._buttons;
                        if (editor !== "none") {
                            dorado.MessageBox.resetEditorWidth(editor);
                        }
                        for (let i = 0; i < 3; i++) {
                            let button = buttons[i], dlgButton = dlgButtons[i];
                            if (i >= buttonCount) {
                                $fly(dlgButton._dom).css("display", "none");
                            }
                            else {
                                let caption;
                                if (dorado.MessageBox.buttonText[button]) {
                                    caption = $resource(dorado.MessageBox.buttonText[button]);
                                }
                                else {
                                    caption = button;
                                }
                                dlgButton.set("caption", caption);
                                let ui;
                                if (dorado.MessageBox.highlightButtons.indexOf(button) >= 0) {
                                    ui = "highlight";
                                }
                                else {
                                    if (dorado.MessageBox.declineButtons.indexOf(button) >= 0) {
                                        ui = "decline";
                                    }
                                    else {
                                        ui = "default";
                                    }
                                }
                                dlgButton.set("ui", ui);
                                dlgButton.refresh();
                                $fly(dlgButton._dom).css("display", "");
                            }
                        }
                    });
                    dialog.bind("afterShow", function (self) {
                        let buttons = self._buttons, button;
                        if (buttons) {
                            button = buttons[0];
                            if (button && button._dom.style.display !== "none") {
                                button.setFocus();
                            }
                        }
                    });
                    dialog.bind("beforeHide", function (self, arg) {
                        if (dorado.MessageBox._runStack.length > 0) {
                            arg.processDefault = false;
                            dorado.MessageBox.executeCallback();
                            dorado.MessageBox.doShow(dorado.MessageBox._runStack[0]);
                        }
                    });
                    dialog.bind("afterHide", function () {
                        dorado.MessageBox.executeCallback();
                    });
                    dialog.bind("beforeClose", function (self, arg) {
                        dorado.MessageBox.onButtonClick("close");
                        arg.processDefault = false;
                    });
                };
            }
            return dorado.MessageBox._dialog;
        },
        alert: function (msg, options) {
            if (typeof options === "function") {
                let callback = options;
                options = { callback: callback };
            }
            else {
                options = options || {};
            }
            options.icon =
                options.icon == null ? dorado.MessageBox.INFO_ICON : options.icon;
            options.message = msg;
            options.buttons = dorado.MessageBox.OK;
            options.closeAction = "ok";
            dorado.MessageBox.show(options);
        },
        confirm: function (msg, options) {
            if (typeof options === "function") {
                let callback = options;
                options = { callback: callback };
            }
            else {
                options = options || {};
            }
            options.icon =
                options.icon == null ? dorado.MessageBox.QUESTION_ICON : options.icon;
            options.message = msg;
            options.buttons = dorado.MessageBox.YESNO;
            options.closeAction = "no";
            dorado.MessageBox.show(options);
        },
        prompt: function (msg, options) {
            if (typeof options === "function") {
                let callback = options;
                options = { callback: callback };
            }
            else {
                options = options || {};
            }
            options.message = msg;
            options.buttons = dorado.MessageBox.OKCANCEL;
            options.closeAction = "cancel";
            options.editor = "singleLine";
            dorado.MessageBox.show(options);
        },
        promptMultiLines: function (msg, options) {
            if (typeof options === "function") {
                let callback = options;
                options = { callback: callback };
            }
            else {
                options = options || {};
            }
            options.message = msg;
            options.buttons = dorado.MessageBox.OKCANCEL;
            options.closeAction = "cancel";
            options.editor = "multiLines";
            dorado.MessageBox.show(options);
        },
        resetEditorWidth: function (editor) {
            let dialog = dorado.MessageBox.getDialog(), doms = dialog._doms, width;
            if (editor === "multiLines" && dorado.MessageBox.TEXTAREA) {
                width = $fly(doms.textareaWrap).outerWidth();
                dorado.MessageBox.TEXTAREA.set("width", width);
            }
            else {
                if (editor === "singleLine" && dorado.MessageBox.SINGLE_EDITOR) {
                    width = $fly(doms.editorWrap).outerWidth();
                    dorado.MessageBox.SINGLE_EDITOR.set("width", width);
                }
            }
        },
        updateText: function (text, icon, editor, value) {
            let dialog = dorado.MessageBox.getDialog(), doms = dialog._doms;
            dorado.MessageBox._lastText = text;
            dorado.MessageBox._lastIcon = icon;
            dorado.MessageBox._lastEditor = editor;
            dorado.MessageBox._lastValue = value;
            if (!doms) {
                return;
            }
            text += "";
            if (text) {
                text = text.replace(/&/g, "&amp;").replace(/[<>\"\n]/g, function ($1) {
                    switch ($1) {
                        case "<":
                            return "&lt;";
                        case ">":
                            return "&gt;";
                        case "\n":
                            return "<br/>";
                        case '"':
                            return "&quot;";
                    }
                });
            }
            $fly(doms.msgText).html(text || "&nbsp;");
            $fly(doms.msgIcon).prop("className", "msg-icon");
            if (icon in icons) {
                icon = icons[icon];
            }
            if (icon) {
                if (icon) {
                    $fly(doms.msgIcon).addClass(icon);
                }
                else {
                    $fly(doms.msgIcon).css("background-image", "");
                }
                $fly(doms.msgIcon).css("display", "");
                $fly(doms.msgContent).addClass("msg-content-hasicon");
            }
            else {
                $fly(doms.msgIcon).css("display", "none");
                $fly(doms.msgContent).removeClass("msg-content-hasicon");
            }
            if (dorado.MessageBox.SINGLE_EDITOR) {
                switch (editor) {
                    case "none":
                        $fly(doms.editorWrap).css("display", "none");
                        $fly(dorado.MessageBox.SINGLE_EDITOR._dom).css("display", "none");
                        $fly(dorado.MessageBox.TEXTAREA._dom).css("display", "none");
                        break;
                    case "singleLine":
                        $fly(doms.editorWrap).css("display", "");
                        $fly(dorado.MessageBox.SINGLE_EDITOR._dom).css("display", "");
                        $fly(dorado.MessageBox.TEXTAREA._dom).css("display", "none");
                        dorado.MessageBox.SINGLE_EDITOR.set("value", value || "");
                        break;
                    case "multiLines":
                        $fly(doms.editorWrap).css("display", "");
                        $fly(dorado.MessageBox.SINGLE_EDITOR._dom).css("display", "none");
                        $fly(dorado.MessageBox.TEXTAREA._dom).css("display", "");
                        dorado.MessageBox.TEXTAREA.set("value", value || "");
                        break;
                }
            }
        },
        show: function (options) {
            dorado.MessageBox._runStack.push(options);
            if (dorado.MessageBox._runStack.length > 1) {
                return;
            }
            dorado.MessageBox.doShow(options);
        },
        doShow: function (options) {
            options = options || {};
            let dialog = dorado.MessageBox.getDialog(), msg = options.message, defaultText = options.defaultText, title = options.title || dorado.MessageBox.defaultTitle, icon = options.icon, editor = options.editor || "none";
            dorado.MessageBox.updateText(msg, icon, editor, defaultText);
            dialog.set({ caption: title });
            dialog.show();
        },
    };
})();
(function () {
    let directionReverse = {
        left: "right",
        right: "left",
        top: "bottom",
        bottom: "top",
    };
    let mouseEnterfunc = function (event) {
        let panel = event.data.panel;
        if (panel._hidePreviewTimer) {
            clearTimeout(panel._hidePreviewTimer);
        }
    };
    let mouseLeavefunc = function (event) {
        let panel = event.data.panel;
        panel._delayHidePreview();
    };
    let documentMouseDown = function (event) {
        $fly(document).unbind("click", documentMouseDown);
        let panel = event.data.panel;
        panel._closePreview();
    };
    dorado.widget.SplitPanel = $extend(dorado.widget.Control, {
        $className: "dorado.widget.SplitPanel",
        ATTRIBUTES: {
            className: { defaultValue: "d-split-panel" },
            animate: {
                defaultValue: dorado.Browser.msie && dorado.Browser.version < 9 ? false : true,
            },
            direction: {
                defaultValue: "left",
                setter: function (value) {
                    if (this._collapseable &&
                        this._sideControl instanceof dorado.widget.AbstractPanel) {
                        let collapseButton = this._sideControl._collapseButton;
                        if (collapseButton) {
                            collapseButton.set("iconClass", this._collapsed
                                ? "expand-icon-" + value
                                : "collapse-icon-" + value);
                        }
                    }
                    this._direction = value;
                },
            },
            maxPosition: {},
            minPosition: { defaultValue: 50 },
            position: {
                defaultValue: 100,
                setter: function (value) {
                    this._position = value;
                },
            },
            sideControl: {
                writeBeforeReady: true,
                writeOnce: true,
                innerComponent: "",
            },
            mainControl: {
                writeBeforeReady: true,
                writeOnce: true,
                innerComponent: "",
            },
            resizeable: { defaultValue: true },
            collapsed: {
                setter: function (value) {
                    this.doSetCollapsed(value);
                },
            },
            collapseBothSide: { writeBeforeReady: true },
            collapseable: { defaultValue: true },
            previewable: { defaultValue: false },
            openPreviewOnHover: { defaultValue: false },
        },
        EVENTS: { beforeCollapsedChange: {}, onCollapsedChange: {} },
        _openPreview: function () {
            let panel = this, dom = panel._dom, doms = panel._doms, direction = panel._direction, animPanelCss = {}, animConfig, width = $fly(dom).innerWidth(), height = $fly(dom).innerHeight(), collapseBarWidth = $fly(doms.collapseBar).outerWidth(), collapseBarHeight = $fly(doms.collapseBar).outerHeight(), splitterWidth = $fly(doms.splitter).outerWidth(), splitterHeight = $fly(doms.splitter).outerHeight();
            if (panel._previewOpened) {
                return;
            }
            panel._previewOpened = true;
            let position = panel.getPixelPosition(), collapsed = panel._collapsed, animPanel = doms.sidePanel;
            if (collapsed === "main") {
                animPanel = doms.mainPanel;
                switch (direction) {
                    case "left":
                        animConfig = { left: position - collapseBarWidth - splitterWidth };
                        animPanelCss.left = width;
                        break;
                    case "top":
                        animConfig = { top: position - collapseBarHeight - splitterHeight };
                        animPanelCss.top = height;
                        break;
                    case "right":
                        animConfig = { left: collapseBarWidth + splitterWidth };
                        animPanelCss.left = (width - position - collapseBarWidth) * -1;
                        break;
                    case "bottom":
                        animConfig = { top: collapseBarHeight + splitterHeight };
                        animPanelCss.top = (height - position - collapseBarHeight) * -1;
                        break;
                }
            }
            else {
                switch (direction) {
                    case "left":
                        animConfig = { left: collapseBarWidth + splitterWidth };
                        animPanelCss.left = position * -1;
                        break;
                    case "top":
                        animConfig = { top: collapseBarHeight + splitterHeight };
                        animPanelCss.top = position * -1;
                        break;
                    case "right":
                        animConfig = {
                            left: width - position - collapseBarWidth - splitterWidth,
                        };
                        animPanelCss.left = width;
                        break;
                    case "bottom":
                        animConfig = {
                            top: height - position - collapseBarHeight - splitterHeight,
                        };
                        animPanelCss.top = height;
                        break;
                }
            }
            if (panel._animate) {
                $fly(animPanel)
                    .css(animPanelCss)
                    .bringToFront()
                    .animate(animConfig, {
                    complete: function () {
                        if (collapsed === "main") {
                            if (panel._mainControl) {
                                panel._mainControl.setActualVisible(true);
                            }
                        }
                        else {
                            if (panel._sideControl) {
                                panel._sideControl.setActualVisible(true);
                            }
                        }
                    },
                });
            }
            else {
                $fly(animPanel).css(animPanelCss).bringToFront().css(animConfig);
                if (collapsed === "main") {
                    if (panel._mainControl) {
                        panel._mainControl.setActualVisible(true);
                    }
                }
                else {
                    if (panel._sideControl) {
                        panel._sideControl.setActualVisible(true);
                    }
                }
            }
            $fly(document).bind("click", { panel: panel }, documentMouseDown);
            $fly([animPanel, doms.collapseBar, doms.splitter]).bind("mouseenter", { panel: panel }, mouseEnterfunc);
            $fly([animPanel, doms.collapseBar]).bind("mouseleave", { panel: panel }, mouseLeavefunc);
        },
        _closePreview: function () {
            let panel = this, dom = panel._dom, doms = panel._doms, direction = panel._direction, animConfig, width = $fly(dom).innerWidth(), height = $fly(dom).innerHeight(), collapseBarWidth = $fly(doms.collapseBar).outerWidth(), collapseBarHeight = $fly(doms.collapseBar).outerHeight();
            if (!panel._previewOpened) {
                return;
            }
            panel._previewOpened = false;
            let position = panel.getPixelPosition(), collapsed = panel._collapsed, animPanel = doms.sidePanel;
            if (collapsed === "main") {
                animPanel = doms.mainPanel;
                switch (direction) {
                    case "left":
                        animConfig = { left: width };
                        break;
                    case "top":
                        animConfig = { top: height };
                        break;
                    case "right":
                        animConfig = { left: (width - position - collapseBarWidth) * -1 };
                        break;
                    case "bottom":
                        animConfig = { top: (height - collapseBarHeight - position) * -1 };
                        break;
                }
            }
            else {
                switch (direction) {
                    case "left":
                        animConfig = { left: position * -1 + collapseBarWidth };
                        break;
                    case "top":
                        animConfig = { top: position * -1 + collapseBarHeight };
                        break;
                    case "right":
                        animConfig = { left: width - collapseBarWidth };
                        break;
                    case "bottom":
                        animConfig = { top: height - collapseBarHeight };
                        break;
                }
            }
            if (panel._animate) {
                $fly(animPanel).animate(animConfig, {
                    complete: function () {
                        $fly(animPanel).css("z-index", "");
                        if (collapsed === "main") {
                            if (panel._mainControl) {
                                panel._mainControl.setActualVisible(true);
                            }
                        }
                        else {
                            if (panel._sideControl) {
                                panel._sideControl.setActualVisible(false);
                            }
                        }
                    },
                });
            }
            else {
                $fly(animPanel).css(animConfig);
                $fly(animPanel).css("z-index", "");
                if (collapsed === "main") {
                    if (panel._mainControl) {
                        panel._mainControl.setActualVisible(true);
                    }
                }
                else {
                    if (panel._sideControl) {
                        panel._sideControl.setActualVisible(false);
                    }
                }
            }
            $fly([animPanel, doms.collapseBar])
                .unbind("mouseenter", mouseEnterfunc)
                .unbind("mouseleave", mouseLeavefunc);
        },
        _togglePreview: function () {
            let panel = this;
            if (panel._previewOpened) {
                panel._closePreview();
            }
            else {
                panel._openPreview();
            }
        },
        _delayHidePreview: function () {
            let panel = this;
            if (panel._hidePreviewTimer) {
                clearTimeout(panel._hidePreviewTimer);
            }
            panel._hidePreviewTimer = setTimeout(function () {
                panel._hidePreviewTimer = null;
                panel._closePreview();
                $fly(document).unbind("click", documentMouseDown);
            }, 700);
        },
        _createCollapseBar: function () {
            let panel = this, doms = panel._doms, bar = $DomUtils.xCreate({
                tagName: "div",
                className: "collapse-bar",
                contextKey: "collapseBar",
                content: {
                    tagName: "div",
                    className: "button",
                    contextKey: "collapseBarButton",
                },
            }, null, doms);
            let hoverPreviewTimer;
            jQuery(doms.collapseBar)
                .addClass("collapse-bar-" + panel._direction)
                .addClassOnHover("collapse-bar-hover")
                .click(function (event) {
                panel._togglePreview();
                event.stopImmediatePropagation();
            })
                .mouseenter(function (event) {
                if (panel._openPreviewOnHover && !panel._previewOpened) {
                    hoverPreviewTimer = setTimeout(function () {
                        panel._openPreview();
                        hoverPreviewTimer = null;
                    }, 400);
                }
            })
                .mouseleave(function (event) {
                if (panel._openPreviewOnHover && !panel._previewOpened) {
                    if (hoverPreviewTimer) {
                        clearTimeout(hoverPreviewTimer);
                        hoverPreviewTimer = null;
                    }
                }
            });
            jQuery(doms.collapseBarButton)
                .click(function (event) {
                panel.doSetCollapsed(false);
                event.stopImmediatePropagation();
            })
                .addClassOnHover("button-hover");
            $fly(panel._dom).append(doms.collapseBar);
            return bar;
        },
        createDom: function () {
            let panel = this, doms = {}, dom = $DomUtils.xCreate({
                tagName: "div",
                content: [
                    {
                        tagName: "div",
                        className: "side-panel",
                        contextKey: "sidePanel",
                    },
                    {
                        tagName: "div",
                        className: "splitter",
                        content: {
                            tagName: "div",
                            className: "button",
                            contextKey: "button",
                        },
                        contextKey: "splitter",
                    },
                    {
                        tagName: "div",
                        className: "main-panel",
                        contextKey: "mainPanel",
                    },
                ],
            }, null, doms), direction = panel._direction, axis = direction === "left" || direction === "right" ? "x" : "y";
            if (panel._collapseBothSide === true) {
                $fly(dom).addClass(panel._className + "-collapse-both");
                let oppositeButton = document.createElement("div");
                oppositeButton.className = "opposite-button";
                doms.splitter.appendChild(oppositeButton);
                $fly(oppositeButton).click(function () {
                    panel.doSetCollapsed("main");
                });
            }
            panel._doms = doms;
            $DomUtils.disableUserSelection(doms.splitter);
            let splitterPosition, containment;
            $fly(doms.splitter)
                .addClass("splitter-" + panel._direction)
                .draggable({
                addClasses: false,
                axis: axis,
                helper: "clone",
                iframeFix: true,
                start: function (event, ui) {
                    let helper = ui.helper;
                    if (helper) {
                        helper
                            .addClass("d-splitter-dragging")
                            .bringToFront()
                            .find(">*")
                            .css("display", "none");
                    }
                    splitterPosition = $fly(doms.splitter).position();
                    let vertical = direction === "top" || direction === "bottom";
                    if (panel._maxPosition != null || panel._minPosition != null) {
                        let width = $fly(dom).width(), height = $fly(dom).height(), min = panel._minPosition || 50, max, sideMin, sideMax, range;
                        if (vertical) {
                            max = panel._maxPosition || height - 50;
                        }
                        else {
                            max = panel._maxPosition || width - 50;
                        }
                        if (panel._direction === "left") {
                            sideMin = min;
                            sideMax = max;
                        }
                        else {
                            if (panel._direction === "right") {
                                sideMin = width - max;
                                sideMax = width - min;
                            }
                            else {
                                if (panel._direction === "top") {
                                    sideMin = min;
                                    sideMax = max;
                                }
                                else {
                                    if (panel._direction === "bottom") {
                                        sideMin = height - max;
                                        sideMax = height - min;
                                    }
                                }
                            }
                        }
                        if (vertical) {
                            containment = [0, sideMin, 0, sideMax];
                        }
                        else {
                            containment = [sideMin, 0, sideMax, 0];
                        }
                    }
                },
                drag: function (event, ui) {
                    let inst = jQuery.data(this, "ui-draggable"), horiChange = event.pageX - inst.originalPageX, vertChange = event.pageY - inst.originalPageY;
                    ui.position = {
                        left: splitterPosition.left,
                        top: splitterPosition.top,
                    };
                    let left, top;
                    if (panel._direction === "left" || panel._direction === "right") {
                        left = splitterPosition.left + horiChange;
                        if (left < containment[0]) {
                            left = containment[0];
                        }
                        else {
                            if (left > containment[2]) {
                                left = containment[2];
                            }
                        }
                        ui.position.left = left;
                    }
                    else {
                        top = splitterPosition.top + vertChange;
                        if (top < containment[1]) {
                            top = containment[1];
                        }
                        else {
                            if (top > containment[3]) {
                                top = containment[3];
                            }
                        }
                        ui.position.top = top;
                    }
                    ui.helper.css(ui.position);
                },
                stop: function (event, ui) {
                    let position = ui.position;
                    switch (panel._direction) {
                        case "left":
                            panel.set("position", position.left);
                            break;
                        case "right":
                            panel.set("position", $fly(dom).width() -
                                position.left -
                                $fly(doms.splitter).outerWidth(true));
                            break;
                        case "top":
                            panel.set("position", position.top);
                            break;
                        case "bottom":
                            panel.set("position", $fly(dom).height() -
                                position.top -
                                $fly(doms.splitter).outerHeight(true));
                            break;
                    }
                },
            });
            $fly(doms.button).click(function () {
                if (panel._collapsed === "main") {
                    panel.doSetCollapsed(false);
                }
                else {
                    panel.doSetCollapsed(!panel._collapsed);
                }
            });
            $fly(doms.sidePanel).click(function (event) {
                if (panel._collapsed === true) {
                    event.stopImmediatePropagation();
                }
            });
            $fly(doms.mainPanel).click(function (event) {
                if (panel._collapsed === "main") {
                    event.stopImmediatePropagation();
                }
            });
            return dom;
        },
        initObjectShimForIE: function () {
            if (!dorado.Browser.msie ||
                !dorado.useObjectShim ||
                this._objectShimInited) {
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
            this._doms.splitter.appendChild(iframe);
            this._objectShimInited = true;
        },
        doSetCollapsed: function (collapsed, callback, slience) {
            let panel = this, dom = panel._dom, doms = panel._doms, oldValue = panel._collapsed, eventArg = {};
            panel.fireEvent("beforeCollapsedChange", panel, eventArg);
            if (eventArg.processDefault === false) {
                return;
            }
            if (dom) {
                let width = $fly(dom).width(), height = $fly(dom).height(), direction = panel._direction, left;
                let animConfig, position = panel.getPixelPosition(), animPanel = doms.sidePanel;
                if (collapsed === "main") {
                    animPanel = doms.mainPanel;
                }
                let onCollapsedChange = function () {
                    if (collapsed === "main") {
                        if (panel._mainControl) {
                            panel._mainControl.setActualVisible(false);
                        }
                        if (panel._sideControl) {
                            panel._sideControl.setActualVisible(true);
                        }
                    }
                    else {
                        if (panel._mainControl) {
                            panel._mainControl.setActualVisible(true);
                        }
                        if (panel._sideControl) {
                            panel._sideControl.setActualVisible(!collapsed);
                        }
                    }
                    panel._collapsed = collapsed;
                    panel.refresh();
                    panel.fireEvent("onCollapsedChange", panel);
                    $fly(animPanel).css("z-index", "");
                    if (typeof callback === "function") {
                        callback.apply(null, []);
                    }
                };
                if (collapsed) {
                    if (collapsed === "main") {
                        switch (direction) {
                            case "left":
                                animConfig = { left: width };
                                break;
                            case "top":
                                animConfig = { top: height };
                                break;
                            case "right":
                                animConfig = { left: position - width };
                                break;
                            case "bottom":
                                animConfig = { top: position - height };
                                break;
                        }
                    }
                    else {
                        switch (direction) {
                            case "left":
                                animConfig = { left: position * -1 };
                                break;
                            case "top":
                                animConfig = { top: position * -1 };
                                break;
                            case "right":
                                animConfig = { left: width };
                                break;
                            case "bottom":
                                animConfig = { top: height };
                                break;
                        }
                    }
                    if (panel._animate) {
                        $fly(animPanel).animate(animConfig, {
                            complete: function () {
                                onCollapsedChange();
                            },
                        });
                    }
                    else {
                        $fly(animPanel).css(animConfig);
                        onCollapsedChange();
                    }
                }
                else {
                    if (panel._previewOpened) {
                        $fly([doms.sidePanel, doms.collapseBar])
                            .unbind("mouseenter", mouseEnterfunc)
                            .unbind("mouseleave", mouseLeavefunc);
                        $fly(document).unbind("click", documentMouseDown);
                        panel._previewOpened = false;
                        onCollapsedChange();
                    }
                    else {
                        let animPanelCss = {};
                        if (oldValue === "main") {
                            animPanel = doms.mainPanel;
                            switch (direction) {
                                case "left":
                                    animConfig = { left: position };
                                    animPanelCss.left = width;
                                    break;
                                case "top":
                                    animConfig = { top: position };
                                    animPanelCss.top = height;
                                    break;
                                case "right":
                                    animConfig = { left: 0 };
                                    animPanelCss.left = position - width;
                                    break;
                                case "bottom":
                                    animConfig = { top: 0 };
                                    animPanelCss.top = position - height;
                                    break;
                            }
                        }
                        else {
                            switch (direction) {
                                case "left":
                                    animConfig = { left: 0 };
                                    animPanelCss.left = position * -1;
                                    break;
                                case "top":
                                    animConfig = { top: 0 };
                                    animPanelCss.top = position * -1;
                                    break;
                                case "right":
                                    animConfig = { left: width - position };
                                    animPanelCss.left = width;
                                    break;
                                case "bottom":
                                    animConfig = { top: height - position };
                                    animPanelCss.top = height;
                                    break;
                            }
                        }
                        if (panel._animate) {
                            $fly(animPanel)
                                .css(animPanelCss)
                                .bringToFront()
                                .animate(animConfig, {
                                complete: function () {
                                    onCollapsedChange();
                                },
                            });
                        }
                        else {
                            $fly(animPanel).css(animPanelCss).css(animConfig);
                            onCollapsedChange();
                        }
                    }
                }
            }
            else {
                panel._collapsed = collapsed;
                panel.fireEvent("onCollapsedChange", panel);
            }
            if (slience !== true) {
                if (panel._sideControl instanceof dorado.widget.AbstractPanel) {
                    panel._sideControl._splitPanelCascade = true;
                    panel._sideControl.set("collapsed", collapsed);
                    panel._sideControl._splitPanelCascade = false;
                }
            }
        },
        getPixelPosition: function () {
            let panel = this, position = panel._position, dir = panel._direction;
            if (typeof position === "string") {
                if (position.indexOf("%") === -1) {
                    position = parseInt(position, 10);
                }
                else {
                    position =
                        ((dir === "left" || dir === "right"
                            ? panel.getRealWidth()
                            : panel.getRealHeight()) *
                            parseInt(position.replace("%", ""), 10)) /
                            100;
                }
            }
            return position;
        },
        doOnAttachToDocument: function () {
            let panel = this, sideControl = panel._sideControl, mainControl = panel._mainControl, doms = panel._doms;
            if (sideControl) {
                sideControl.render(doms.sidePanel);
                sideControl.setActualVisible(!panel._collapsed);
            }
            if (mainControl) {
                mainControl.render(doms.mainPanel);
            }
            panel.initObjectShimForIE();
        },
        refreshDom: function (dom) {
            $invokeSuper.call(this, arguments);
            let panel = this, doms = panel._doms, width = $fly(dom).width(), height = $fly(dom).height(), splitterWidth = $fly(doms.splitter).width(), splitterHeight = $fly(doms.splitter).height(), direction = panel._direction, previewable = panel._previewable && panel._collapseable, vertical = direction === "top" || direction === "bottom";
            if (panel._collapseable) {
                if (panel._collapsed) {
                    $fly(dom)
                        .addClass(panel._className + "-collapsed")
                        .addClass(panel._collapsed === "main"
                        ? panel._className + "-main-collapsed"
                        : "");
                    $fly(doms.splitter).draggable("disable");
                }
                else {
                    $fly(dom)
                        .removeClass(panel._className + "-collapsed")
                        .removeClass(panel._className + "-main-collapsed");
                    $fly(doms.splitter).draggable("enable");
                }
            }
            if (panel._collapseable) {
                $fly(doms.button).css("display", "");
            }
            else {
                $fly(doms.button).css("display", "none");
            }
            $fly(doms.splitter).removeClass("splitter-h-resizeable splitter-v-resizeable");
            if (panel._resizeable) {
                $fly(doms.splitter).addClass(vertical ? "splitter-v-resizeable" : "splitter-h-resizeable");
            }
            let sidePanelStyle, splitterStyle, mainPanelStyle, mainControlStyle, sideControlStyle, collapseBarStyle, collapseBarWidth = 0, collapseBarHeight = 0;
            let position = panel.getPixelPosition();
            if (panel._collapseable && panel._collapsed) {
                if (previewable) {
                    if (!doms.collapseBar) {
                        panel._createCollapseBar();
                    }
                    $fly(doms.collapseBar)
                        .css({ display: "", width: "", height: "" })
                        .removeClass("collapse-bar-left collapse-bar-right collapse-bar-top collapse-bar-bottom")
                        .addClass("collapse-bar-" + direction);
                    if (direction === "top" || direction === "bottom") {
                        $fly(doms.collapseBar).outerWidth(width);
                    }
                    else {
                        if (direction === "left" || direction === "right") {
                            $fly(doms.collapseBar).outerHeight(height);
                        }
                    }
                    collapseBarWidth = $fly(doms.collapseBar).outerWidth();
                    collapseBarHeight = $fly(doms.collapseBar).outerHeight();
                    let dir = direction;
                    if (panel._collapsed === "main") {
                        dir = directionReverse[dir];
                    }
                    switch (dir) {
                        case "left":
                            collapseBarStyle = { left: 0, top: 0 };
                            break;
                        case "right":
                            collapseBarStyle = { left: width - collapseBarWidth, top: 0 };
                            break;
                        case "top":
                            collapseBarStyle = { left: 0, top: 0 };
                            break;
                        case "bottom":
                            collapseBarStyle = { top: height - collapseBarHeight, left: 0 };
                            break;
                    }
                    $fly(doms.collapseBar).css(collapseBarStyle);
                }
                splitterWidth = $fly(doms.splitter).width();
                splitterHeight = $fly(doms.splitter).height();
                if (panel._collapsed === "main") {
                    switch (direction) {
                        case "left":
                            splitterStyle = {
                                left: width - splitterWidth - collapseBarWidth,
                                top: 0,
                            };
                            break;
                        case "right":
                            splitterStyle = { left: collapseBarWidth, top: 0 };
                            break;
                        case "top":
                            splitterStyle = {
                                top: height - splitterHeight - collapseBarHeight,
                                left: 0,
                            };
                            break;
                        case "bottom":
                            splitterStyle = { top: collapseBarHeight, left: 0 };
                            break;
                    }
                    switch (direction) {
                        case "left":
                            sidePanelStyle = {
                                left: 0,
                                top: 0,
                                width: width - splitterWidth - collapseBarWidth,
                                height: height,
                            };
                            mainPanelStyle = { left: width, top: 0, height: height };
                            mainControlStyle = { height: height };
                            sideControlStyle = {
                                width: width - splitterWidth - collapseBarWidth,
                                height: height,
                            };
                            break;
                        case "right":
                            sidePanelStyle = {
                                left: splitterWidth + collapseBarWidth,
                                top: 0,
                                width: width - splitterWidth - collapseBarWidth,
                                height: height,
                            };
                            mainPanelStyle = { left: -1 * width, top: 0, height: height };
                            mainControlStyle = { height: height };
                            sideControlStyle = {
                                width: width - splitterWidth - collapseBarWidth,
                                height: height,
                            };
                            break;
                        case "top":
                            sidePanelStyle = {
                                top: 0,
                                left: 0,
                                width: width,
                                height: height - splitterHeight - collapseBarHeight,
                            };
                            mainPanelStyle = { top: height, left: 0, width: width };
                            mainControlStyle = { width: width };
                            sideControlStyle = {
                                height: height - splitterHeight - collapseBarHeight,
                                width: width,
                            };
                            break;
                        case "bottom":
                            sidePanelStyle = {
                                top: splitterHeight + collapseBarHeight,
                                left: 0,
                                width: width,
                                height: height - splitterHeight - collapseBarHeight,
                            };
                            mainPanelStyle = { top: -1 * height, left: 0, width: width };
                            mainControlStyle = { width: width };
                            sideControlStyle = {
                                width: width,
                                height: height - splitterHeight - collapseBarHeight,
                            };
                            break;
                    }
                }
                else {
                    $fly(doms.splitter)
                        .removeClass("splitter-left splitter-right splitter-top splitter-bottom")
                        .addClass("splitter-" + directionReverse[direction]);
                    switch (direction) {
                        case "left":
                            splitterStyle = { left: collapseBarWidth, top: 0 };
                            break;
                        case "right":
                            splitterStyle = {
                                left: width - splitterWidth - collapseBarWidth,
                                top: 0,
                            };
                            break;
                        case "top":
                            splitterStyle = { top: collapseBarHeight, left: 0 };
                            break;
                        case "bottom":
                            splitterStyle = {
                                top: height - splitterHeight - collapseBarHeight,
                                left: 0,
                            };
                            break;
                    }
                    switch (direction) {
                        case "left":
                            sidePanelStyle = { left: position * -1, top: 0, height: height };
                            mainPanelStyle = {
                                left: splitterWidth + collapseBarWidth,
                                top: 0,
                                width: width - splitterWidth - collapseBarWidth,
                                height: height,
                            };
                            mainControlStyle = {
                                width: width - splitterWidth - collapseBarWidth,
                                height: height,
                            };
                            sideControlStyle = { width: position, height: height };
                            break;
                        case "right":
                            sidePanelStyle = { left: width, top: 0, height: height };
                            mainPanelStyle = {
                                left: 0,
                                top: 0,
                                width: width - splitterWidth - collapseBarWidth,
                                height: height,
                            };
                            mainControlStyle = {
                                width: width - splitterWidth - collapseBarWidth,
                                height: height,
                            };
                            sideControlStyle = { width: position, height: height };
                            break;
                        case "top":
                            sidePanelStyle = { top: position * -1, left: 0, width: width };
                            mainPanelStyle = {
                                top: splitterHeight + collapseBarHeight,
                                left: 0,
                                width: width,
                                height: height - splitterHeight - collapseBarHeight,
                            };
                            mainControlStyle = {
                                width: width,
                                height: height - splitterHeight - collapseBarHeight,
                            };
                            sideControlStyle = { width: width, height: position };
                            break;
                        case "bottom":
                            sidePanelStyle = { top: height, left: 0, width: width };
                            mainPanelStyle = {
                                top: 0,
                                left: 0,
                                width: width,
                                height: height - splitterHeight - collapseBarHeight,
                            };
                            mainControlStyle = {
                                width: width,
                                height: height - splitterHeight - collapseBarHeight,
                            };
                            sideControlStyle = { width: width, height: position };
                            break;
                    }
                }
                $fly(doms.splitter).css(splitterStyle);
                $fly(doms.sidePanel).css(sidePanelStyle);
                $fly(doms.mainPanel).css(mainPanelStyle);
                if (panel._sideControl) {
                    panel._sideControl.set(sideControlStyle);
                }
                if (panel._mainControl) {
                    panel._mainControl.set(mainControlStyle);
                }
            }
            else {
                if (previewable) {
                    $fly(doms.collapseBar).css("display", "none");
                }
                $fly(doms.splitter)
                    .removeClass("splitter-left splitter-right splitter-top splitter-bottom")
                    .addClass("splitter-" + direction);
                splitterWidth = $fly(doms.splitter).width();
                splitterHeight = $fly(doms.splitter).height();
                switch (panel._direction) {
                    case "left":
                        splitterStyle = { left: position, top: 0 };
                        break;
                    case "right":
                        splitterStyle = { left: width - position - splitterWidth, top: 0 };
                        break;
                    case "top":
                        splitterStyle = { top: position, left: 0 };
                        break;
                    case "bottom":
                        splitterStyle = {
                            top: height - position - splitterHeight,
                            left: 0,
                        };
                        break;
                }
                $fly(doms.splitter).css(splitterStyle);
                switch (panel._direction) {
                    case "left":
                        sidePanelStyle = {
                            left: 0,
                            top: 0,
                            width: position,
                            height: height,
                        };
                        sideControlStyle = { width: position, height: height };
                        mainPanelStyle = {
                            left: position + splitterWidth,
                            top: 0,
                            width: width - position - splitterWidth,
                            height: height,
                        };
                        mainControlStyle = {
                            width: width - position - splitterWidth,
                            height: height,
                        };
                        break;
                    case "right":
                        sidePanelStyle = {
                            left: width - position,
                            top: 0,
                            width: position,
                            height: height,
                        };
                        sideControlStyle = { width: position, height: height };
                        mainPanelStyle = {
                            left: 0,
                            top: 0,
                            width: width - position - splitterWidth,
                            height: height,
                        };
                        mainControlStyle = {
                            width: width - position - splitterWidth,
                            height: height,
                        };
                        break;
                    case "top":
                        sidePanelStyle = {
                            top: 0,
                            left: 0,
                            width: width,
                            height: position,
                        };
                        sideControlStyle = { width: width, height: position };
                        mainPanelStyle = {
                            top: position + splitterHeight,
                            left: 0,
                            width: width,
                            height: height - position - splitterHeight,
                        };
                        mainControlStyle = {
                            width: width,
                            height: height - position - splitterHeight,
                        };
                        break;
                    case "bottom":
                        sidePanelStyle = {
                            top: height - position,
                            left: 0,
                            width: width,
                            height: position,
                        };
                        sideControlStyle = { width: width, height: position };
                        mainPanelStyle = {
                            top: 0,
                            left: 0,
                            width: width,
                            height: height - position - splitterHeight,
                        };
                        mainControlStyle = {
                            width: width,
                            height: height - position - splitterHeight,
                        };
                        break;
                }
                if (panel._sideControl) {
                    panel._sideControl.set(sideControlStyle);
                    panel._sideControl.refresh();
                }
                if (panel._mainControl) {
                    panel._mainControl.set(mainControlStyle);
                    panel._mainControl.refresh();
                }
                $fly(doms.sidePanel).css(sidePanelStyle);
                $fly(doms.mainPanel).css(mainPanelStyle);
            }
            $fly(doms.splitter).draggable(panel._resizeable ? "enable" : "disable");
        },
        getFocusableSubControls: function () {
            let direction = this._direction;
            if (direction === "left" || direction === "top") {
                return [this._sideControl, this._mainControl];
            }
            else {
                return [this._mainControl, this._sideControl];
            }
        },
    });
})();
(function () {
    let CONST_MOUSE_POS_ADJ_X = 5, CONST_MOUSE_POS_ADJ_Y = 15, TOOLTIP_KEY = "dorado.tooltip", DOMS_KEY = "dorado.tip.doms";
    let elementMouseEnter = function (event) {
        let element = this, tip = dorado.TipManager.getTip(element);
        if (tip._hideTimer) {
            clearTimeout(tip._hideTimer);
            tip._hideTimer = null;
        }
        else {
            if ((tip._text || tip._content) && !tip._visible) {
                dorado.TipManager.showTip(element, tip._showDelay || 0, event);
            }
        }
        if (tip._stopPropagation !== false) {
            event.stopImmediatePropagation();
        }
    };
    let elementMouseMove = function (event) {
        let element = this, tip = dorado.TipManager.getTip(element);
        if (tip) {
            if (tip._showTimer) {
                tip._latestEvent = event;
                if (tip._stopPropagation !== false) {
                    event.stopImmediatePropagation();
                }
            }
            if (tip._trackMouse &&
                tip._dom &&
                $fly(tip._dom).css("display") !== "none") {
                tip._updatePosition(event);
            }
        }
    };
    let elementMouseLeave = function () {
        let element = this, tip = dorado.TipManager.getTip(element);
        if (tip) {
            if (tip._showTimer) {
                clearTimeout(tip._showTimer);
                tip._showTimer = null;
            }
            if (tip._autoHide) {
                dorado.TipManager.hideTip(tip, tip._hideDelay || 0);
            }
        }
    };
    let tipCanUsePool = [];
    dorado.widget.ToolTip = $extend(dorado.widget.Tip, {
        $className: "dorado.widget.ToolTip",
        ATTRIBUTES: {
            mouseOffset: {
                defaultValue: [CONST_MOUSE_POS_ADJ_X, CONST_MOUSE_POS_ADJ_Y],
            },
            anchorToTarget: {
                defaultValue: false,
                skipRefresh: true,
                setter: function (value) {
                    this._anchorToTarget = value;
                    if (this._ready) {
                        if (value === false) {
                            this.unbindTarget();
                        }
                        else {
                            this.bindTarget();
                        }
                    }
                },
            },
            anchorTarget: {
                skipRefresh: true,
                setter: function (value) {
                    let oldValue = this._anchorTarget;
                    if (oldValue && this._anchorTargetBinded) {
                        this.unbindTarget();
                    }
                    this._anchorTarget = value;
                    if (this._ready && value) {
                        this.bindTarget();
                    }
                },
            },
            showDelay: { skipRefresh: true, defaultValue: 500 },
            hideDelay: { skipRefresh: true, defaultValue: 300 },
            autoHide: { defaultValue: true },
            trackMouse: {},
            stopPropagation: {},
        },
        isLazyInit: function () {
            return false;
        },
        getShowPosition: function (options) {
            let tip = this, dom = tip.getDom(), event = tip._latestEvent || options.event;
            if (tip._anchorToTarget === true) {
                return $invokeSuper.call(this, arguments);
            }
            else {
                if (tip._anchorToTarget !== true && event) {
                    let mouseOffset = tip._mouseOffset || [
                        CONST_MOUSE_POS_ADJ_X,
                        CONST_MOUSE_POS_ADJ_Y,
                    ];
                    $DomUtils.locateIn(dom, {
                        position: {
                            left: event.pageX + mouseOffset[0],
                            top: event.pageY + mouseOffset[1],
                        },
                    });
                    tip._latestEvent = null;
                }
            }
            return {
                left: parseInt($fly(dom).css("left"), 10),
                top: parseInt($fly(dom).css("top"), 10),
            };
        },
        doClose: function (closeEl) {
            let target = jQuery.data(closeEl.parentNode, TOOLTIP_KEY);
            target.hide();
        },
        getDom: function () {
            let dom = this._dom;
            if (!dom) {
                dom = tipCanUsePool.pop();
                if (dom) {
                    this._doms = jQuery.data(dom, DOMS_KEY);
                    this._dom = dom;
                    if (this._visible) {
                        $fly(dom).css({
                            display: "",
                            visibility: "hidden",
                            left: -99999,
                            top: -99999,
                        });
                    }
                    else {
                        $fly(dom).css({ display: "none" });
                    }
                    jQuery.data(dom, TOOLTIP_KEY, this);
                    return dom;
                }
                else {
                    dom = $invokeSuper.call(this, arguments);
                    document.body.appendChild(dom);
                    jQuery.data(dom, TOOLTIP_KEY, this);
                    return dom;
                }
            }
            else {
                return dom;
            }
        },
        _updatePosition: function (event) {
            let tip = this;
            if (event) {
                let mouseOffset = tip._mouseOffset || [
                    CONST_MOUSE_POS_ADJ_X,
                    CONST_MOUSE_POS_ADJ_Y,
                ];
                $DomUtils.locateIn(tip._dom, {
                    position: {
                        left: event.pageX + mouseOffset[0],
                        top: event.pageY + mouseOffset[1],
                    },
                });
            }
        },
        bindTarget: function () {
            let element = this._anchorTarget;
            if (element && !this._anchorTargetBinded) {
                jQuery(element)
                    .hover(elementMouseEnter, elementMouseLeave)
                    .mousemove(elementMouseMove);
                this._anchorTargetBinded = true;
            }
        },
        unbindTarget: function () {
            let element = this._anchorTarget;
            if (element && this._anchorTargetBinded) {
                jQuery(element)
                    .unbind("mousemove", elementMouseMove)
                    .unbind("mouseenter", elementMouseEnter)
                    .unbind("mouseleave", elementMouseLeave);
                this._anchorTargetBinded = false;
            }
        },
        hide: function () {
            let tip = this;
            if (tip._showTimer) {
                clearTimeout(tip._showTimer);
                tip._showTimer = null;
                tip._visible = false;
                return;
            }
            $invokeSuper.call(this, arguments);
        },
        show: function () {
            let tip = this;
            if (tip._hideTimer) {
                clearTimeout(tip._hideTimer);
                tip._hideTimer = null;
                tip._visible = true;
                return;
            }
            $invokeSuper.call(this, arguments);
        },
        doAfterHide: function () {
            let tip = this;
            $invokeSuper.call(tip, arguments);
            tipCanUsePool.push(tip._dom);
            jQuery.data(tip._dom, DOMS_KEY, tip._doms);
            jQuery.data(tip._dom, TOOLTIP_KEY, null);
            tip._rendered = false;
            tip._attached = false;
            tip._dom = null;
            tip._doms = null;
        },
    });
    dorado.TipManager = {
        _previousTip: null,
        hasTip: function (element) {
            return !!dorado.TipManager.getTip(element);
        },
        getTip: function (element) {
            let result;
            if (element) {
                result = jQuery.data(element, TOOLTIP_KEY);
            }
            return result;
        },
        allocTip: function (element, options) {
            let result;
            options = options || {};
            options.anchorTarget = element;
            result = new dorado.widget.ToolTip(options);
            result.bindTarget();
            jQuery.data(element, TOOLTIP_KEY, result);
        },
        initTip: function (element, options) {
            let manager = this;
            if (element) {
                if (dorado.Object.isInstanceOf(element, dorado.RenderableElement)) {
                    element = element._dom;
                    if (!element) {
                        return;
                    }
                }
                if (!options) {
                    manager.deleteTip(element);
                }
                else {
                    if (manager.hasTip(element)) {
                        manager.updateTip(element, options);
                    }
                    else {
                        manager.allocTip(element, options);
                    }
                }
            }
        },
        updateTip: function (element, options) {
            if (dorado.Object.isInstanceOf(element, dorado.RenderableElement)) {
                element = element._dom;
                if (!element) {
                    return;
                }
            }
            let tip = dorado.TipManager.getTip(element);
            tip.set(options, { tryNextOnError: true });
        },
        deleteTip: function (element) {
            if (dorado.Object.isInstanceOf(element, dorado.RenderableElement)) {
                element = element._dom;
                if (!element) {
                    return;
                }
            }
            let tip = dorado.TipManager.getTip(element);
            if (tip) {
                dorado.TipManager.hideTip(tip, false);
                tip.unbindTarget();
                jQuery.data(element, TOOLTIP_KEY, null);
            }
        },
        showTip: function (element, delay, event) {
            let manager = this, tip = dorado.TipManager.getTip(element);
            if (tip._autoHide === false && !tip._visible) {
                if (delay) {
                    tip._showTimer = setTimeout(function () {
                        tip.show({ element: element, event: event });
                        tip._showTimer = null;
                    }, delay);
                }
                else {
                    tip.show({ element: element, event: event });
                }
            }
            else {
                let oldPrevTip = manager._previousTip;
                if (oldPrevTip && oldPrevTip !== tip) {
                    oldPrevTip.hide();
                }
                if (delay) {
                    tip._showTimer = setTimeout(function () {
                        tip.show({ element: element, event: event });
                        tip._showTimer = null;
                    }, delay);
                }
                else {
                    tip.show({ element: element, event: event });
                }
                manager._previousTip = tip;
            }
            return tip;
        },
        hideTip: function (tip, delay) {
            let manager = this;
            if (tip) {
                if (manager._previousTip === tip) {
                    manager._previousTip = null;
                }
                if (delay) {
                    tip._hideTimer = setTimeout(function () {
                        tip.hide();
                        tip._hideTimer = null;
                    }, delay);
                }
                else {
                    tip.hide();
                }
            }
        },
    };
})();
dorado.widget.Section = $extend(dorado.widget.Control, {
    $className: "dorado.widget.Section",
    ATTRIBUTES: {
        className: { defaultValue: "d-section" },
        name: {},
        caption: { skipRefresh: true, path: "_captionBar.caption" },
        icon: { skipRefresh: true, path: "_captionBar.icon" },
        iconClass: { skipRefresh: true, path: "_captionBar.iconClass" },
        disabled: {
            setter: function (value) {
                this._disabled = value;
                if (this._parent) {
                    if (this._parent._currentSection === this) {
                        this._parent.changeToAvailableSection();
                        this._parent.refresh();
                    }
                }
            },
        },
        visible: {
            setter: function (value) {
                this._visible = value;
                if (this._rendered) {
                    $fly(this._dom).css("display", value ? "" : "none");
                }
                if (this._parent) {
                    if (this._parent._currentSection === this) {
                        this._parent.changeToAvailableSection();
                    }
                    else {
                        if (this._parent._dynaHeight) {
                            this._parent.notifySizeChange(false, true);
                        }
                    }
                    this._parent.refresh();
                }
            },
        },
        expandable: {
            defaultValue: true,
            setter: function (value) {
                this._expandable = value;
                if (this._parent) {
                    if (this._parent._currentSection === this) {
                        this._parent.changeToAvailableSection();
                        this._parent.refresh();
                    }
                }
            },
        },
        control: {
            componentReference: true,
            innerComponent: "",
            setter: function (value) {
                if (value instanceof dorado.widget.Menu) {
                    value.set("floating", false);
                }
                this._control = value;
            },
        },
        hideMode: {
            skipRefresh: true,
            writeBeforeReady: true,
            readOnly: true,
            defaultValue: "display",
        },
        userData: {},
    },
    EVENTS: { onCaptionClick: {} },
    createDom: function () {
        let section = this, doms = {}, dom = $DomUtils.xCreate({
            tagName: "div",
            content: [
                { tagName: "div", className: "container", contextKey: "container" },
            ],
        }, null, doms);
        section._doms = doms;
        jQuery(dom).addClassOnHover("hover-section");
        let captionBar = (section._captionBar = new dorado.widget.CaptionBar({
            caption: section._caption,
            className: "d-section-caption-bar",
            icon: section._icon,
            iconClass: section._iconClass,
        }));
        captionBar.render(dom, doms.container);
        section.registerInnerControl(captionBar);
        doms.captionBar = captionBar._dom;
        return dom;
    },
    refreshDom: function (dom) {
        $invokeSuper.call(this, arguments);
        $fly(dom).toggleClass(this._className + "-disabled", !!this._disabled);
    },
    onControlSizeChange: function () {
        let accordion = this._parent;
        if (accordion && accordion._dynaHeight) {
            accordion.notifySizeChange(false, true);
        }
    },
    doRenderControl: function () {
        let section = this, doms = section._doms, control = section._control;
        if (control) {
            control.set("visible", true);
            control.render(doms.container);
            section.registerInnerControl(control);
            control._parentLayout = section;
        }
    },
});
(function () {
    function refreshCurrentSection(currentSection) {
        $fly(currentSection._dom).addClass("current-section");
        if (currentSection._control) {
            if (!currentSection._control._rendered) {
                currentSection.doRenderControl();
            }
            else {
                currentSection._control.setActualVisible(true);
            }
        }
    }
    dorado.widget.Accordion = $extend(dorado.widget.Control, {
        $className: "dorado.widget.Accordion",
        tabStop: true,
        ATTRIBUTES: {
            className: { defaultValue: "d-accordion" },
            animate: {
                defaultValue: dorado.Browser.msie && dorado.Browser.version < 9 ? false : true,
            },
            sections: {
                innerComponent: "Section",
                setter: function (value) {
                    let accordion = this, oldValue = accordion._sections;
                    if (oldValue) {
                        accordion.clearSections();
                    }
                    if (typeof value === "object" &&
                        value.constructor === Array.prototype.constructor) {
                        for (let i = 0, j = value.length; i < j; i++) {
                            accordion.addSection(value[i]);
                        }
                    }
                },
            },
            height: { defaultValue: 400 },
            currentSection: {
                setter: function (value) {
                    if (typeof value === "number" || typeof value === "string") {
                        value = this._sections ? this._sections.get(value) : null;
                    }
                    this.doSetCurrentSection(value);
                },
            },
            dynaHeight: { defaultValue: false, writeBeforeReady: true },
            currentIndex: {
                skipRefresh: true,
                getter: function () {
                    if (this._currentSection) {
                        return this._sections.indexOf(this._currentSection);
                    }
                    return -1;
                },
                setter: function (index) {
                    this.set("currentSection", this._sections.get(index));
                },
            },
        },
        EVENTS: { beforeCurrentSectionChange: {}, onCurrentSectionChange: {} },
        doGet: function (attr) {
            let c = attr.charAt(0);
            if (c === "#" || c === "&") {
                let name = attr.substring(1);
                return this.getSection(name);
            }
            else {
                return $invokeSuper.call(this, [attr]);
            }
        },
        getSection: function (name) {
            if (this._sections) {
                return this._sections.get(name);
            }
            return null;
        },
        doSetCurrentSection: function (section, animate) {
            let accordion = this, oldCurrent = accordion._currentSection, newCurrent = section;
            if (oldCurrent === newCurrent) {
                return;
            }
            if (!accordion._dom) {
                accordion._currentSection = newCurrent;
                return;
            }
            let eventArg = { newSection: section, oldSection: oldCurrent };
            accordion.fireEvent("beforeCurrentSectionChange", accordion, eventArg);
            if (eventArg.processDefault === false) {
                return;
            }
            if (animate) {
                let oldCurrentContainer = oldCurrent._doms.container, oldContainerHeight = $fly(oldCurrentContainer).height();
                accordion._sliding = true;
                if (accordion._dynaHeight) {
                    let newCurrentControlHeight = 0, oldControlHeight = 0;
                    if (oldCurrent._control) {
                        oldControlHeight = $fly(oldCurrent._control._dom).height();
                    }
                    refreshCurrentSection(newCurrent);
                    if (newCurrent._control) {
                        newCurrent._control.refresh();
                        newCurrentControlHeight = newCurrent._control._dom.offsetHeight;
                    }
                    $fly(newCurrent._doms.container)
                        .css({ height: 0 })
                        .animate({ dummy: 1 }, {
                        complete: function () {
                            $fly(oldCurrentContainer)
                                .height(oldControlHeight)
                                .css("display", "");
                            $fly(oldCurrent._dom).removeClass("current-section");
                            accordion._currentSection = newCurrent;
                            accordion.fireEvent("onCurrentSectionChange", accordion, eventArg);
                            accordion.notifySizeChange(false, true);
                            accordion._sliding = false;
                        },
                        step: function (now, animate) {
                            let defaultEasing = animate.options.easing ||
                                (jQuery.easing.swing ? "swing" : "linear"), pos = jQuery.easing[defaultEasing](animate.state, animate.options.duration * animate.state, 0, 1, animate.options.duration);
                            $fly(newCurrent._doms.container).css("height", Math.ceil(newCurrentControlHeight * pos));
                            $fly(oldCurrentContainer).css("height", Math.floor(oldControlHeight * (1 - pos)));
                        },
                    });
                }
                else {
                    $fly(oldCurrentContainer).dockable("bottom", true);
                    $fly(newCurrent._doms.container).safeSlideIn({
                        direction: "t2b",
                        complete: function () {
                            $fly(oldCurrentContainer)
                                .height(oldContainerHeight)
                                .css("display", "")
                                .undockable(true);
                            accordion._currentSection = newCurrent;
                            accordion.refresh();
                            accordion.fireEvent("onCurrentSectionChange", accordion, eventArg);
                            accordion._sliding = false;
                        },
                        step: function (now) {
                            $fly(oldCurrentContainer).height(oldContainerHeight - now.height);
                        },
                    });
                }
            }
            else {
                accordion._currentSection = newCurrent;
                accordion.refresh();
                accordion.fireEvent("onCurrentSectionChange", accordion, eventArg);
            }
        },
        changeToAvailableSection: function () {
            let accordion = this, sections = accordion._sections;
            if (sections) {
                let startIndex = -1, currentSection = accordion._currentSection, i, j, section;
                if (currentSection) {
                    startIndex = sections.indexOf(currentSection);
                }
                for (i = startIndex + 1, j = sections.size; i < j; i++) {
                    section = sections.get(i);
                    if (section &&
                        section._visible &&
                        section._expandable &&
                        !section._disabled) {
                        accordion.doSetCurrentSection(section);
                        return section;
                    }
                }
                for (i = startIndex - 1; i >= 0; i--) {
                    section = sections.get(i);
                    if (section &&
                        section._visible &&
                        section._expandable &&
                        !section._disabled) {
                        accordion.doSetCurrentSection(section);
                        return section;
                    }
                }
            }
            return null;
        },
        getVisibleSectionCount: function () {
            let accordion = this, sections = accordion._sections, result = 0;
            if (sections) {
                let section;
                for (let i = 0, j = sections.size; i < j; i++) {
                    section = sections.get(i);
                    if (section && section._visible) {
                        result++;
                    }
                }
            }
            return result;
        },
        addSection: function (section, index) {
            let accordion = this, sections = accordion._sections, refDom;
            if (!sections) {
                accordion._sections = sections = new dorado.util.KeyedArray(function (value) {
                    return value._name;
                });
            }
            if (typeof section === "object" &&
                section.constructor === Object.prototype.constructor) {
                section = new dorado.widget.Section(section);
            }
            if (typeof index === "number") {
                refDom = sections.get(index)._dom;
                sections.insert(section, index);
            }
            else {
                sections.insert(section);
            }
            accordion.registerInnerControl(section);
            if (accordion._rendered) {
                section.render(accordion._dom, refDom);
                accordion.bindAction(section);
                accordion.refresh();
                if (accordion._dynaHeight) {
                    accordion.notifySizeChange(false, true);
                }
            }
        },
        removeSection: function (section) {
            let accordion = this, sections = accordion._sections;
            if (sections) {
                if (typeof section === "number") {
                    section = sections.get(section);
                }
                if (section instanceof dorado.widget.Section) {
                    accordion.unregisterInnerControl(section);
                    if (accordion._rendered) {
                        section.destroy();
                        if (section === accordion._currentSection) {
                            accordion.changeToAvailableSection();
                        }
                        sections.remove(section);
                        accordion.refresh();
                        if (accordion._dynaHeight) {
                            accordion.notifySizeChange(false, true);
                        }
                    }
                    else {
                        sections.remove(section);
                    }
                }
            }
        },
        clearSections: function () {
            let accordion = this, sections = accordion._sections, section;
            if (sections) {
                for (let i = 0, j = sections.size; i < j; i++) {
                    section = sections.get(i);
                    accordion.unregisterInnerControl(section);
                    section.destroy();
                }
                accordion._currentSection = null;
                accordion._sections.clear();
                if (accordion._dynaHeight) {
                    accordion.notifySizeChange(false, true);
                }
            }
        },
        bindAction: function (section) {
            let accordion = this;
            section._captionBar.bind("onClick", function () {
                if (accordion._sliding || section._disabled) {
                    return;
                }
                section.fireEvent("onCaptionClick", section);
                if (section._expandable) {
                    accordion.doSetCurrentSection(section, !!accordion._animate);
                }
            });
        },
        refreshDom: function (dom) {
            $invokeSuper.call(this, arguments);
            let accordion = this, sections = accordion._sections, currentSection = accordion._currentSection, dynaHeight = accordion._dynaHeight;
            if (sections && !currentSection) {
                currentSection = accordion.changeToAvailableSection();
            }
            let sectionMinHeight, ctHeight, accordionHeight = $fly(dom).height(), visibleCount = accordion.getVisibleSectionCount();
            if (sections) {
                let section, control, sectionCt;
                for (let i = 0, j = sections.size; i < j; i++) {
                    section = sections.get(i);
                    if (!section._rendered) {
                        section.render(dom);
                        accordion.bindAction(section);
                    }
                    sectionCt = section._doms.container;
                    if (currentSection !== section) {
                        $fly(section._dom).removeClass("current-section");
                        if (section._control && section._control._rendered) {
                            section._control.setActualVisible(false);
                        }
                    }
                    if (typeof sectionMinHeight !== "number") {
                        sectionMinHeight =
                            $fly(section._dom).outerHeight(true) - sectionCt.offsetHeight;
                        ctHeight = accordionHeight - sectionMinHeight * visibleCount;
                    }
                    if (!dynaHeight) {
                        $fly(sectionCt).outerHeight(ctHeight, true);
                    }
                    control = section._control;
                    if (control) {
                        if (!dynaHeight) {
                            control.set({ width: $fly(dom).width(), height: ctHeight });
                        }
                        else {
                            control.set({ width: $fly(dom).width() });
                        }
                    }
                }
            }
            if (dynaHeight) {
                $fly(dom).css("height", "");
            }
            if (currentSection) {
                refreshCurrentSection(currentSection);
            }
        },
        getFocusableSubControls: function () {
            return [this._currentSection ? this._currentSection._control : null];
        },
    });
})();
dorado.widget.toolbar = {};
dorado.widget.ToolBar = $extend(dorado.widget.Control, {
    $className: "dorado.widget.ToolBar",
    ATTRIBUTES: {
        className: { defaultValue: "d-toolbar" },
        height: { independent: true, readOnly: true },
        items: {
            setter: function (value) {
                let toolbar = this, items = toolbar._items, rendered = toolbar._rendered, i, l, item;
                if (items) {
                    toolbar.clearItems();
                }
                if (!items) {
                    toolbar._items = items = new dorado.util.KeyedArray(function (value) {
                        return value._id;
                    });
                }
                if (value) {
                    if (value.constructor === Array.prototype.constructor) {
                        for (i = 0, l = value.length; i < l; i++) {
                            if (value[i]) {
                                item = toolbar.createItem(value[i]);
                                items.insert(item);
                            }
                        }
                        if (rendered) {
                            toolbar.doRenderItems();
                        }
                    }
                    else {
                        if (value instanceof dorado.util.KeyedArray) {
                            for (i = 0, l = value.size; i < l; i++) {
                                item = toolbar.createItem(value.get(i));
                                items.append(item);
                            }
                            if (rendered) {
                                toolbar.doRenderItems();
                            }
                        }
                    }
                }
            },
        },
        fixRight: { defaultValue: false },
        showMenuOnHover: {},
    },
    createDom: function () {
        let toolbar = this, doms = {}, dom = $DomUtils.xCreate({
            tagName: "div",
            className: toolbar._className,
            content: [
                {
                    tagName: "div",
                    className: "toolbar-left-wrap",
                    contextKey: "toolbarLeftWrap",
                    content: [
                        {
                            tagName: "div",
                            className: "toolbar-left",
                            contextKey: "toolbarLeft",
                        },
                    ],
                },
                {
                    tagName: "div",
                    className: "toolbar-right",
                    contextKey: "toolbarRight",
                    style: { position: "absolute" },
                },
            ],
        }, null, doms);
        toolbar._doms = doms;
        toolbar.doRenderItems();
        return dom;
    },
    createItem: function (config) {
        if (!config) {
            return null;
        }
        let item;
        if (typeof config === "string" ||
            config.constructor === Object.prototype.constructor) {
            item = dorado.Toolkits.createInstance("toolbar,widget", config);
        }
        else {
            if (config instanceof dorado.widget.Control) {
                item = config;
            }
        }
        if (dorado.widget.DataPilot && item instanceof dorado.widget.DataPilot) {
            let oldRefreshItems = item.refreshItems;
            item.refreshItems = function () {
                oldRefreshItems.apply(this, arguments);
                if (item._visibleByOverflow === false) {
                    let menuItems = item._bindMenuItems || [];
                    for (let i = 0, j = menuItems.length; i < j; i++) {
                        let menuItem = menuItems[i], control = item._itemObjects[menuItem.itemCode.key];
                        if (control) {
                            menuItem.set({
                                visible: control._visible,
                                icon: control._icon,
                                action: control._action,
                                disabled: control._disabled,
                                iconClass: control._iconClass,
                            });
                        }
                    }
                }
            };
        }
        if (item) {
            this.registerInnerControl(item);
        }
        return item;
    },
    addItem: function (item, index) {
        let toolbar = this, items = toolbar._items;
        if (!item) {
            return null;
        }
        if (!items) {
            items = toolbar._items = new dorado.util.KeyedArray(function (value) {
                return value._id;
            });
        }
        item = toolbar.createItem(item);
        if (toolbar._rendered) {
            let refDom = null, doms = toolbar._doms;
            if (typeof index === "number") {
                let refItem = items.get(index);
                refDom = refItem ? refItem._dom : null;
            }
            items.insert(item, index);
            if (toolbar._fixRight) {
                let fillIndex = -1;
                for (let i = 0, j = items.size; i < j; i++) {
                    if (items.get(i) instanceof dorado.widget.toolbar.Fill) {
                        fillIndex = i;
                        break;
                    }
                }
                if (index === undefined && fillIndex > -1) {
                    item.render(doms.toolbarRight, refDom);
                }
                else {
                    if (index !== undefined && index > fillIndex) {
                        item.render(doms.toolbarRight, refDom);
                    }
                    else {
                        item.render(doms.toolbarLeft, refDom);
                    }
                }
            }
            else {
                item.render(doms.toolbarLeft, refDom);
            }
            $fly(item._dom).addClass("d-toolbar-item");
            toolbar.refresh(300);
        }
        else {
            items.insert(item, index);
        }
        return item;
    },
    removeItem: function (item) {
        let toolbar = this, items = toolbar._items;
        if (items && item !== undefined) {
            let realItem = item;
            if (typeof item === "number") {
                realItem = items.get(item);
                items.removeAt(item);
            }
            else {
                items.remove(item);
            }
            realItem.destroy();
            toolbar.unregisterInnerControl(realItem);
        }
    },
    clearItems: function () {
        let toolbar = this, items = toolbar._items, afterFill = false;
        for (let i = 0, j = items.size; i < j; i++) {
            let item = items.get(i);
            if (!(item instanceof dorado.widget.toolbar.Fill)) {
                toolbar.unregisterInnerControl(item);
                item.destroy();
            }
        }
        items.clear();
    },
    doRenderItems: function () {
        let toolbar = this, doms = toolbar._doms, items = toolbar._items || {}, afterFill = false;
        for (let i = 0, j = items.size; i < j; i++) {
            let item = items.get(i);
            if (item instanceof dorado.widget.toolbar.Fill) {
                afterFill = true;
            }
            else {
                toolbar.registerInnerControl(item);
                if (!afterFill) {
                    item.render(doms.toolbarLeft);
                }
                else {
                    item.render(doms.toolbarRight);
                }
                $fly(item._dom).addClass("d-toolbar-item");
            }
        }
    },
    hideOverflowItem: function (item, overflowMenu, dataPilotItemCode, dataPilot) {
        function addItem(itemCode, innerControl, dataPilot) {
            let menuItem = overflowMenu.addItem({
                caption: map[itemCode.code],
                visible: innerControl._visible,
                icon: innerControl._icon,
                action: innerControl._action,
                disabled: innerControl._disabled,
                iconClass: innerControl._iconClass,
                listener: {
                    onClick: function () {
                        innerControl.fireEvent("onClick", item);
                    },
                },
            });
            menuItem.itemCode = itemCode;
            dataPilot._bindMenuItems.push(menuItem);
        }
        let map = {
            "|<": $resource("dorado.baseWidget.DataPilotFirstPage"),
            "<": $resource("dorado.baseWidget.DataPilotPreviousPage"),
            ">": $resource("dorado.baseWidget.DataPilotNextPage"),
            ">|": $resource("dorado.baseWidget.DataPilotLastPage"),
            "+": $resource("dorado.baseWidget.DataPilotInsert"),
            "-": $resource("dorado.baseWidget.DataPilotDelete"),
            x: $resource("dorado.baseWidget.DataPilotCancel"),
        };
        let menuItem;
        if (dataPilotItemCode) {
            switch (dataPilotItemCode.code) {
                case "|<":
                case "<":
                case ">":
                case ">|":
                case "+":
                case "-":
                case "x":
                    addItem(dataPilotItemCode, item, dataPilot);
                    break;
                case "goto":
                case "info":
                    break;
                case "|":
                    break;
            }
        }
        else {
            if (item instanceof dorado.widget.Button) {
                menuItem = overflowMenu.addItem({
                    caption: item._caption,
                    visible: item._visible,
                    submenu: item._menu,
                    action: item._action,
                    disabled: item._disabled,
                    icon: item._icon,
                    iconClass: item._iconClass,
                    listener: {
                        onClick: function () {
                            item.fireEvent("onClick", item);
                        },
                    },
                });
            }
            else {
                if (item instanceof dorado.widget.toolbar.Separator) {
                    overflowMenu.addItem("-");
                }
                else {
                    if (dorado.widget.DataPilot &&
                        item instanceof dorado.widget.DataPilot) {
                        let compiledItemCodes = item._compiledItemCodes || [], bindMenuItems = [];
                        item._bindMenuItems = bindMenuItems;
                        for (let i = 0, j = compiledItemCodes.length; i < j; i++) {
                            let itemCode = compiledItemCodes[i], innerControl = item._itemObjects[itemCode.key];
                            switch (itemCode.code) {
                                case "|<":
                                case "<":
                                case ">":
                                case ">|":
                                case "+":
                                case "-":
                                case "x":
                                    addItem(itemCode, innerControl, item);
                                    break;
                                case "goto":
                                case "info":
                                    break;
                                case "|":
                                    break;
                            }
                        }
                    }
                }
            }
        }
        item._visibleByOverflow = false;
        item._bindingMenuItem = menuItem;
        if (dataPilotItemCode || item._hideMode === "visibility") {
            $fly(item._dom).css({ visibility: "hidden" });
        }
        else {
            $fly(item._dom).css({ display: "none" });
        }
    },
    showUnoverflowItem: function (item, dataPilotItem) {
        item._visibleByOverflow = true;
        if (dorado.widget.DataPilot && item instanceof dorado.widget.DataPilot) {
            item._bindMenuItems = [];
        }
        let visible = item._visible;
        item._bindingMenuItem = null;
        if (dataPilotItem) {
            $fly(item._dom).css({ visibility: "" });
        }
        else {
            if (item._hideMode === "display") {
                $fly(item._dom).css({ display: visible ? "" : "none" });
            }
            else {
                $fly(item._dom).css({ visibility: visible ? "" : "hidden" });
            }
        }
    },
    refreshDom: function (dom) {
        $invokeSuper.call(this, arguments);
        let toolbar = this;
        if (toolbar._fixRight) {
            $fly(dom).addClass(toolbar._className + "-fixright");
        }
        else {
            $fly(dom).removeClass(toolbar._className + "-fixright");
        }
    },
    showDataPilot: function (item) {
        let compiledItemCodes = item._compiledItemCodes || [];
        item._visibleByOverflow = true;
        for (let i = 0, j = compiledItemCodes.length; i < j; i++) {
            let itemCode = compiledItemCodes[i], innerControl = item._itemObjects[itemCode.key];
            this.showUnoverflowItem(innerControl, true);
        }
    },
    hideDataPilot: function (item, overflowMenu, currentLeft, leftVisibleWidth) {
        let toolbar = this, compiledItemCodes = item._compiledItemCodes || [], startHide = false, bindMenuItems = [];
        item._bindMenuItems = bindMenuItems;
        item._visibleByOverflow = false;
        for (let i = 0, j = compiledItemCodes.length; i < j; i++) {
            let itemCode = compiledItemCodes[i], innerControl = item._itemObjects[itemCode.key];
            toolbar.showUnoverflowItem(innerControl, true);
            if (startHide) {
                toolbar.hideOverflowItem(innerControl, overflowMenu, itemCode, item);
                continue;
            }
            currentLeft += $fly(innerControl._dom).outerWidth(true);
            if (currentLeft >= leftVisibleWidth) {
                startHide = true;
                toolbar.hideOverflowItem(innerControl, overflowMenu, itemCode, item);
            }
        }
    },
    doOnResize: function () {
        $invokeSuper.call(this, arguments);
        let toolbar = this, dom = toolbar._dom, doms = toolbar._doms, overflowMenu = toolbar._overflowMenu, overflowButton = toolbar._overflowButton, items = toolbar._items, lastChild = doms.toolbarLeft.lastChild, overflow = false;
        if (dorado.Browser.msie && items) {
            items.each(function (item) {
                if (item instanceof dorado.widget.TextEditor) {
                    item.resetDimension();
                }
            });
        }
        if (lastChild && lastChild.offsetLeft === 0) {
            let childrens = doms.toolbarLeft.children;
            for (let i = childrens.length - 1; i >= 0; i--) {
                if (childrens[i].offsetLeft > lastChild.offsetLeft) {
                    lastChild = childrens[i];
                }
            }
        }
        if (items && lastChild) {
            let leftRealWidth = lastChild.offsetWidth + lastChild.offsetLeft, leftVisibleWidth = dom.offsetWidth - doms.toolbarRight.offsetWidth;
            overflow = leftRealWidth > leftVisibleWidth;
        }
        toolbar._overflowItems = [];
        if (overflow) {
            $fly(dom).addClass(toolbar._className + "-overflow");
            if (!overflowMenu) {
                overflowMenu = toolbar._overflowMenu = new dorado.widget.Menu();
                overflowButton = toolbar._overflowButton =
                    new dorado.widget.SimpleButton({
                        className: "overflow-button",
                        menu: overflowMenu,
                    });
                overflowButton.render(doms.toolbarRight);
                toolbar.registerInnerControl(overflowButton);
            }
            else {
                overflowMenu.clearItems();
            }
            let leftWidthSum = 0, startHideIndex = -1, item, i, j, afterFill;
            if (toolbar._fixRight) {
                leftVisibleWidth = dom.offsetWidth - doms.toolbarRight.offsetWidth;
                for (i = 0, j = items.size; i < j; i++) {
                    item = items.get(i);
                    if (item instanceof dorado.widget.toolbar.Fill) {
                        break;
                    }
                    toolbar.showUnoverflowItem(item);
                    leftWidthSum += $fly(item._dom).outerWidth(true);
                    if (leftWidthSum >= leftVisibleWidth) {
                        startHideIndex = i;
                        break;
                    }
                    if (dorado.widget.DataPilot &&
                        item instanceof dorado.widget.DataPilot) {
                        toolbar.showDataPilot(item);
                    }
                }
                if (startHideIndex > -1) {
                    for (i = startHideIndex, j = items.size; i < j; i++) {
                        item = items.get(i);
                        if (item instanceof dorado.widget.toolbar.Fill) {
                            break;
                        }
                        if (i === startHideIndex &&
                            dorado.widget.DataPilot &&
                            item instanceof dorado.widget.DataPilot) {
                            let currentLeft = leftWidthSum - $fly(item._dom).outerWidth(true);
                            toolbar.hideDataPilot(item, overflowMenu, currentLeft, leftVisibleWidth);
                        }
                        else {
                            toolbar.hideOverflowItem(item, overflowMenu);
                        }
                    }
                }
            }
            else {
                afterFill = false;
                for (i = 0, j = items.size; i < j; i++) {
                    item = items.get(i);
                    if (afterFill) {
                        if (item._dom && item._dom.parentNode === doms.toolbarRight) {
                            doms.toolbarLeft.appendChild(item._dom);
                        }
                    }
                    if (item instanceof dorado.widget.toolbar.Fill) {
                        afterFill = true;
                    }
                }
                leftVisibleWidth = dom.offsetWidth - doms.toolbarRight.offsetWidth;
                for (i = 0, j = items.size; i < j; i++) {
                    item = items.get(i);
                    toolbar.showUnoverflowItem(item);
                    if (item instanceof dorado.widget.toolbar.Fill) {
                        continue;
                    }
                    leftWidthSum += $fly(item._dom).outerWidth(true);
                    if (leftWidthSum >= leftVisibleWidth) {
                        startHideIndex = i;
                        break;
                    }
                    if (dorado.widget.DataPilot &&
                        item instanceof dorado.widget.DataPilot) {
                        toolbar.showDataPilot(item);
                    }
                }
                if (startHideIndex > -1) {
                    for (i = startHideIndex, j = items.size; i < j; i++) {
                        item = items.get(i);
                        if (item instanceof dorado.widget.toolbar.Fill) {
                            continue;
                        }
                        if (i === startHideIndex &&
                            dorado.widget.DataPilot &&
                            item instanceof dorado.widget.DataPilot) {
                            let currentLeft = leftWidthSum - $fly(item._dom).outerWidth(true);
                            toolbar.hideDataPilot(item, overflowMenu, currentLeft, leftVisibleWidth);
                        }
                        else {
                            toolbar.hideOverflowItem(item, overflowMenu);
                        }
                    }
                }
            }
        }
        else {
            $fly(dom).removeClass(toolbar._className + "-overflow");
            if (!items) {
                return;
            }
            if (!toolbar._fixRight) {
                afterFill = false;
                for (i = 0, j = items.size; i < j; i++) {
                    item = items.get(i);
                    if (afterFill) {
                        if (item._dom && item._dom.parentNode === doms.toolbarLeft) {
                            doms.toolbarRight.appendChild(item._dom);
                        }
                    }
                    if (item instanceof dorado.widget.toolbar.Fill) {
                        afterFill = true;
                    }
                }
            }
            for (i = 0, j = items.size; i < j; i++) {
                item = items.get(i);
                if (dorado.widget.DataPilot &&
                    item instanceof dorado.widget.DataPilot) {
                    toolbar.showDataPilot(item);
                }
                else {
                    toolbar.showUnoverflowItem(item);
                }
            }
        }
    },
    getFocusableSubControls: function () {
        return this._items.toArray();
    },
});
dorado.widget.toolbar.Separator = $extend(dorado.widget.Control, {
    $className: "dorado.widget.toolbar.Separator",
    ATTRIBUTES: { className: { defaultValue: "d-toolbar-sep" } },
    createDom: function () {
        let separator = this, dom;
        dom = document.createElement("span");
        dom.className = separator._className;
        return dom;
    },
});
dorado.widget.toolbar.Button = $extend(dorado.widget.Button, {
    $className: "dorado.widget.toolbar.Button",
    _constructor: function (config) {
        let items = config && config.items;
        if (items) {
            delete config.items;
        }
        $invokeSuper.call(this, arguments);
        if (items) {
            this.set("items", items);
        }
    },
    ATTRIBUTES: {
        items: {
            getter: function () {
                if (this._menu) {
                    return this._menu.get("items");
                }
                return null;
            },
            setter: function (value) {
                if (value.constructor === Array.prototype.constructor) {
                    this._menu = new dorado.widget.Menu({ items: value });
                    this.registerInnerControl(this._menu);
                }
            },
        },
        showMenuOnHover: {},
        hideMenuOnMouseLeave: {},
        hideMenuOnMouseLeaveDelay: { defaultValue: 300 },
    },
    doGet: function (attr) {
        let c = attr.charAt(0);
        if ((c === "#" || c === "&") && this._menu) {
            return this._menu.get(attr);
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
        if (this._parent instanceof dorado.widget.ToolBar) {
            let menuItem = this._bindingMenuItem;
            if (menuItem) {
                menuItem.set({
                    caption: this._caption,
                    visible: this._visible,
                    submenu: this._menu,
                    action: this._action,
                    disabled: this._disabled,
                    icon: this._icon,
                    iconClass: this._iconClass,
                });
            }
        }
    },
    doCancelHideMenuOnMouseEnter: function () {
        if (this._hideMenuOnMouseLeaveTimer) {
            clearTimeout(this._hideMenuOnMouseLeaveTimer);
            this._hideMenuOnMouseLeaveTimer = null;
        }
    },
    doHideMenuOnMouseLeave: function () {
        let button = this;
        if (this._hideMenuOnMouseLeaveTimer) {
            clearTimeout(this._hideMenuOnMouseLeaveTimer);
            this._hideMenuOnMouseLeaveTimer = null;
        }
        button._hideMenuOnMouseLeaveTimer = setTimeout(function () {
            if (button._hideMenuOnMouseLeave && button._menu) {
                button._menu.hide(true);
            }
            button._hideMenuOnMouseLeaveTimer = null;
        }, button._hideMenuOnMouseLeaveDelay || 300);
    },
    createDom: function () {
        let button = this, dom = $invokeSuper.call(button, arguments);
        $fly(dom)
            .mouseenter(function () {
            let menu = button._menu, toolbar = button._parent;
            if (button._hideMenuOnMouseLeave) {
                button.doCancelHideMenuOnMouseEnter();
            }
            if (menu && toolbar && !button._disabled) {
                let activeButton = toolbar._activeMenuButton;
                if (button.willShowMenuOnHover()) {
                    if (activeButton && activeButton !== button) {
                        activeButton._menu.hide(true);
                        button.doShowMenu();
                    }
                    else {
                        if (activeButton !== button) {
                            button.doShowMenu();
                        }
                    }
                }
                else {
                    if (activeButton && activeButton !== button) {
                        activeButton._menu.hide(true);
                        button.doShowMenu();
                    }
                }
            }
        })
            .mouseleave(function () {
            if (button._hideMenuOnMouseLeave) {
                button.doHideMenuOnMouseLeave();
            }
        });
        return dom;
    },
    willShowMenuOnHover: function () {
        let button = this, toolbar = button._parent, menu = button._menu;
        if (menu && toolbar && !button._disabled) {
            return button._showMenuOnHover !== undefined
                ? button._showMenuOnHover
                : toolbar._showMenuOnHover !== undefined
                    ? toolbar._showMenuOnHover
                    : undefined;
        }
        return false;
    },
    doShowMenu: function () {
        $invokeSuper.call(this, arguments);
        let button = this, menu = button._menu;
        if (menu) {
            let toolbar = button._parent;
            toolbar._activeMenuButton = button;
        }
    },
    doBeforeMenuHide: function () {
        let button = this, toolbar = button._parent;
        if (toolbar) {
            toolbar._activeMenuButton = null;
        }
    },
});
dorado.widget.toolbar.Fill = $extend(dorado.widget.Control, {
    $className: "dorado.widget.toolbar.Fill",
});
dorado.widget.toolbar.Label = $extend(dorado.widget.Control, {
    $className: "dorado.widget.toolbar.Label",
    ATTRIBUTES: { className: { defaultValue: "d-toolbar-label" }, text: {} },
    createDom: function () {
        let label = this, dom = document.createElement("div");
        dom.className = label._className;
        $fly(dom).text(label._text ? label._text : "");
        return dom;
    },
    refreshDom: function (dom) {
        $invokeSuper.call(this, arguments);
        let label = this;
        $fly(dom).text(label._text ? label._text : "");
    },
});
dorado.Toolkits.registerPrototype("toolbar", {
    Default: dorado.widget.toolbar.Button,
    Label: dorado.widget.toolbar.Label,
    ToolBarButton: dorado.widget.toolbar.Button,
    "->": dorado.widget.toolbar.Fill,
    Fill: dorado.widget.toolbar.Fill,
    ToolBarLabel: dorado.widget.toolbar.Label,
    "-": dorado.widget.toolbar.Separator,
    "|": dorado.widget.toolbar.Separator,
    Separator: dorado.widget.toolbar.Separator,
});
dorado.widget.FloatPanel = $extend([dorado.widget.Panel, dorado.widget.FloatControl], {
    $className: "dorado.widget.FloatPanel",
    focusable: true,
    ATTRIBUTES: { visible: { defaultValue: false } },
    doClose: function () {
        let panel = this;
        panel.hide && panel.hide();
    },
    doShow: function () {
        let panel = this, doms = panel._doms;
        $fly([doms.contentPanel, doms.buttonPanel]).css("display", "");
        $invokeSuper.call(this, arguments);
    },
    doAfterShow: function () {
        let panel = this;
        panel._minimized = false;
        $invokeSuper.call(this, arguments);
    },
});
(function () {
    let handleConfigMap = {
        "dialog-header-left": {
            cursor: "nw-resize",
            horiStyle: "left width",
            vertStyle: "top height",
            widthRatio: -1,
            heightRatio: -1,
        },
        "dialog-header-right": {
            cursor: "ne-resize",
            horiStyle: "width",
            vertStyle: "top height",
            widthRatio: 1,
            heightRatio: -1,
        },
        "dialog-header-center": {
            cursor: "n-resize",
            horiStyle: "",
            vertStyle: "top height",
            widthRatio: 1,
            heightRatio: -1,
        },
        "dialog-body-left": {
            cursor: "w-resize",
            horiStyle: "left width",
            vertStyle: "",
            widthRatio: -1,
            heightRatio: 1,
        },
        "dialog-body-right": {
            cursor: "e-resize",
            horiStyle: "width",
            vertStyle: "",
            widthRatio: 1,
            heightRatio: 1,
        },
        "dialog-footer-left": {
            cursor: "sw-resize",
            horiStyle: "left width",
            vertStyle: "height",
            widthRatio: -1,
            heightRatio: 1,
        },
        "dialog-footer-right": {
            cursor: "se-resize",
            horiStyle: "width",
            vertStyle: "height",
            widthRatio: 1,
            heightRatio: 1,
        },
        "dialog-footer-center": {
            cursor: "s-resize",
            horiStyle: "",
            vertStyle: "height",
            widthRatio: 1,
            heightRatio: 1,
        },
    };
    let useDraggingFakeDialog = dorado.Browser.msie && dorado.Browser.version < 9;
    let fakeDialog, fullWindowDialogs = [];
    dorado.bindResize(function () {
        let docWidth = jQuery(window).width(), docHeight = jQuery(window).height();
        for (let i = 0, j = fullWindowDialogs.length; i < j; i++) {
            let dialog = fullWindowDialogs[i];
            if (dialog && !dialog._maximizeTarget) {
                dialog.set({ width: docWidth, height: docHeight });
            }
        }
    });
    dorado.widget.Dialog = $extend(dorado.widget.FloatPanel, {
        $className: "dorado.widget.Dialog",
        _inherentClassName: "i-dialog",
        ATTRIBUTES: {
            className: { defaultValue: "d-dialog" },
            minWidth: { defaultValue: 200 },
            minHeight: { defaultValue: 100 },
            maxWidth: {},
            maxHeight: {},
            draggable: { defaultValue: true },
            dragOutside: { defaultValue: false },
            center: { defaultValue: true },
            modal: { defaultValue: true },
            resizeable: {
                defaultValue: true,
                setter: function (value) {
                    this._resizeable = value;
                    if (this._dom) {
                        if (this._resizeable) {
                            $fly(this._dom)
                                .addClass("i-dialog-resizeable d-dialog-resizeable")
                                .find(".dialog-resize-handle")
                                .draggable("enable");
                        }
                        else {
                            $fly(this._dom)
                                .removeClass("i-dialog-resizeable d-dialog-resizeable")
                                .find(".dialog-resize-handle")
                                .draggable("disable");
                        }
                    }
                },
            },
            maximizeTarget: {},
            minimizeable: {
                defaultValue: false,
                setter: function (value) {
                    let dialog = this, captionBar = dialog._captionBar, button;
                    dialog._minimizeable = value;
                    if (captionBar) {
                        if (value) {
                            button = captionBar.getButton(dialog._uniqueId + "_minimize");
                            if (button) {
                                $fly(button._dom).css("display", "");
                            }
                            else {
                                dialog._createMinimizeButton();
                            }
                        }
                        else {
                            button = captionBar.getButton(dialog._uniqueId + "_minimize");
                            if (button) {
                                $fly(button._dom).css("display", "none");
                            }
                        }
                    }
                },
            },
            minimized: {
                setter: function (value) {
                    this._minimized = value;
                    if (this._minimizeable) {
                        if (value) {
                            this.minimize();
                        }
                        else {
                            this.show();
                        }
                    }
                },
            },
            closeable: { defaultValue: true },
            shadowMode: { defaultValue: "frame", skipRefresh: true },
            animateType: { defaultValue: dorado.Browser.msie ? "none" : "zoom" },
        },
        EVENTS: {
            beforeMaximize: {},
            onMaximize: {},
            beforeMinimize: {},
            onMinimize: {},
        },
        doSetFocus: function () {
            let dialog = this;
            if (dialog._dom) {
                dialog._dom.focus();
            }
        },
        applyDraggable: function () { },
        doOnAttachToDocument: function () {
            $invokeSuper.call(this, arguments);
        },
        doHandleOverflow: function (options) {
            let dialog = this;
            dialog._height = options.maxHeight;
        },
        maximizeRestore: function () {
            let dialog = this, dom = dialog._dom, doms = dialog._doms;
            if (dom) {
                $fly(doms.contentPanel).css("display", "");
                if (dialog._maximizedDirty || dialog._maximized) {
                    dialog._maximized = false;
                    dialog._width = dialog._originalWidth;
                    dialog._height = dialog._originalHeight;
                    dialog._left = dialog._originalLeft;
                    dialog._top = dialog._originalTop;
                    dialog.refresh();
                    if (dialog._left !== undefined && dialog._top !== undefined) {
                        $fly(dom).css({ left: dialog._left, top: dialog._top });
                    }
                    let captionBar = dialog._captionBar;
                    if (captionBar) {
                        let button = captionBar.getButton(dialog._uniqueId + "_maximize");
                        if (button) {
                            $fly(button._dom)
                                .removeClass("d-restore-button")
                                .addClass("d-maximize-button");
                            button._className = "d-maximize-button";
                        }
                    }
                    let $dom = jQuery(dom);
                    if (dialog._resizeable) {
                        $dom
                            .addClass("d-dialog-resizeable")
                            .find(".dialog-resize-handle")
                            .draggable("enable");
                    }
                    if (dialog._draggable) {
                        $dom.addClass("d-dialog-draggable").draggable("enable");
                    }
                    fullWindowDialogs.remove(dialog);
                }
            }
        },
        maximize: function () {
            let dialog = this, dom = dialog._dom;
            if (dom) {
                let eventArg = {};
                dialog.fireEvent("beforeMaximize", dialog, eventArg);
                if (eventArg.processDefault === false) {
                    return;
                }
                dialog._maximized = true;
                dialog._originalWidth = dialog._width;
                dialog._originalHeight = dialog._height;
                dialog._originalLeft = dialog._left;
                dialog._originalTop = dialog._top;
                let maximizeTarget = dialog._maximizeTarget, originalMaimizeTarget = maximizeTarget;
                if (maximizeTarget === "parent") {
                    maximizeTarget = dialog._dom.parentNode;
                }
                else {
                    if (typeof maximizeTarget === "String") {
                        maximizeTarget = jQuery(maximizeTarget)[0];
                    }
                    else {
                        if (maximizeTarget &&
                            dorado.Object.isInstanceOf(maximizeTarget, dorado.RenderableElement)) {
                            maximizeTarget = maximizeTarget._dom;
                        }
                    }
                }
                if (maximizeTarget) {
                    dialog._width = $fly(maximizeTarget).outerWidth(true);
                    dialog._height = $fly(maximizeTarget).outerHeight(true);
                }
                else {
                    dialog._width = $fly(window).width();
                    dialog._height = $fly(window).height();
                }
                let captionBar = dialog._captionBar;
                if (captionBar) {
                    let button = captionBar.getButton(dialog._uniqueId + "_maximize");
                    if (button) {
                        $fly(button._dom)
                            .removeClass("d-maximize-button")
                            .addClass("d-restore-button");
                        button._className = "d-restore-button";
                    }
                }
                let targetOffset;
                if (originalMaimizeTarget === "parent") {
                    targetOffset = { left: 0, top: 0 };
                }
                else {
                    targetOffset = $fly(maximizeTarget).offset() || { left: 0, top: 0 };
                }
                dialog._left = targetOffset.left;
                dialog._top = targetOffset.top;
                let domEl = jQuery(dom);
                domEl.css(targetOffset);
                if (dialog._resizeable) {
                    domEl
                        .removeClass("d-dialog-resizeable")
                        .find(".dialog-resize-handle")
                        .draggable("disable");
                }
                if (dialog._draggable) {
                    domEl.removeClass("d-dialog-draggable").draggable("disable");
                }
                dialog.refresh();
                fullWindowDialogs.push(dialog);
                dialog.fireEvent("onMaximize", dialog);
            }
        },
        minimize: function () {
            let dialog = this, dom = dialog._dom;
            if (dom) {
                let eventArg = { processDefault: true };
                dialog.fireEvent("beforeMinimize", dialog, eventArg);
                if (!eventArg.processDefault) {
                    return;
                }
                dialog._minimized = true;
                dialog.hide();
                dialog.fireEvent("onMinimize", dialog);
            }
        },
        doSetCollapsed: function (collapsed) {
            $invokeSuper.call(this, arguments);
            let dialog = this;
            if (dialog._resizeable) {
                if (collapsed) {
                    jQuery(dialog._dom)
                        .removeClass("d-dialog-resizeable")
                        .find(".dialog-resize-handle")
                        .draggable("disable");
                }
                else {
                    jQuery(dialog._dom)
                        .addClass("d-dialog-resizeable")
                        .find(".dialog-resize-handle")
                        .draggable("enable");
                }
            }
        },
        _doOnResize: function (collapsed) {
            let dialog = this, dom = dialog._dom, doms = dialog._doms, height = dialog.getRealHeight(), width = dialog.getRealWidth();
            if (typeof width === "string") {
                if (width.indexOf("%") === -1) {
                    width = parseInt(width, 10);
                }
                else {
                    width =
                        (jQuery(window).width() * parseInt(width.replace("%", ""), 10)) /
                            100;
                }
            }
            if (typeof height === "string") {
                if (height.indexOf("%") === -1) {
                    height = parseInt(height, 10);
                }
                else {
                    height =
                        ($fly(window).height() * parseInt(height.replace("%", ""), 10)) /
                            100;
                }
            }
            if (typeof height === "number" && height > 0) {
                if (collapsed === undefined) {
                    collapsed = dialog._collapsed;
                }
                if (collapsed) {
                    $fly(dom).height("auto");
                }
                else {
                    let headerHeight = $fly(doms.header).outerHeight(true), footerHeight = $fly(doms.footer).outerHeight(true), captionBarHeight = 0, buttonPanelHeight = 0;
                    if (doms.captionBar) {
                        captionBarHeight = $fly(doms.captionBar).outerHeight(true);
                    }
                    if (doms.buttonPanel) {
                        buttonPanelHeight = $fly(doms.buttonPanel).outerHeight(true);
                    }
                    $fly(doms.contentPanel).outerHeight(height -
                        headerHeight -
                        footerHeight -
                        captionBarHeight -
                        buttonPanelHeight);
                    if (dorado.Browser.msie && dorado.Browser.version === 6) {
                        $fly([
                            doms.bodyWrap,
                            doms.header,
                            dialog.footer,
                            doms.headerCenter,
                            doms.bodyLeft,
                            doms.bodyRight,
                        ])
                            .css("zoom", "")
                            .css("zoom", 1);
                    }
                }
            }
            else {
                $fly(doms.contentPanel).css("height", "");
                if (dorado.Browser.msie && dorado.Browser.version === 6) {
                    $fly([
                        doms.bodyWrap,
                        doms.header,
                        dialog.footer,
                        doms.headerCenter,
                        doms.bodyLeft,
                        doms.bodyRight,
                    ])
                        .css("zoom", "")
                        .css("zoom", 1);
                }
            }
            $fly(dom).css("height", "");
            if (typeof width === "number" && width > 0) {
                $fly(dom).outerWidth(width);
            }
        },
        _createMinimizeButton: function () {
            let dialog = this, captionBar = dialog._captionBar;
            if (captionBar) {
                captionBar.addButton(new dorado.widget.SimpleIconButton({
                    exClassName: "d-minimize-button",
                    iconClass: "minimize-icon",
                    onCreate: function () {
                        this._uniqueId = dialog._uniqueId + "_minimize";
                    },
                    onClick: function () {
                        if (!dialog._minimized) {
                            dialog.minimize();
                        }
                    },
                }), 102);
            }
        },
        createDom: function () {
            let dialog = this, doms = {}, dom = $DomUtils.xCreate({
                tagName: "div",
                className: dialog._className,
                style: { visibility: dialog._visible ? "visible" : "hidden" },
                content: [
                    {
                        tagName: "div",
                        className: "dialog-header",
                        contextKey: "header",
                        content: [
                            {
                                tagName: "div",
                                className: "dialog-header-left dialog-resize-handle",
                                contextKey: "headerLeft",
                            },
                            {
                                tagName: "div",
                                className: "dialog-header-right dialog-resize-handle",
                                contextKey: "headerRight",
                            },
                            {
                                tagName: "div",
                                className: "dialog-header-center dialog-resize-handle",
                                contextKey: "headerCenter",
                            },
                        ],
                    },
                    {
                        tagName: "div",
                        className: "dialog-body-wrap",
                        contextKey: "bodyWrap",
                        content: [
                            {
                                tagName: "div",
                                className: "dialog-body-left dialog-resize-handle",
                                contextKey: "bodyLeft",
                            },
                            {
                                tagName: "div",
                                className: "dialog-body-right dialog-resize-handle",
                                contextKey: "bodyRight",
                            },
                            {
                                tagName: "div",
                                className: "dialog-body",
                                contextKey: "body",
                                content: {
                                    tagName: "div",
                                    className: "content-panel",
                                    contextKey: "contentPanel",
                                },
                            },
                        ],
                    },
                    {
                        tagName: "div",
                        className: "dialog-footer",
                        contextKey: "footer",
                        content: [
                            {
                                tagName: "div",
                                className: "dialog-footer-left dialog-resize-handle",
                                contextKey: "footerLeft",
                            },
                            {
                                tagName: "div",
                                className: "dialog-footer-right dialog-resize-handle",
                                contextKey: "footerRight",
                            },
                            {
                                tagName: "div",
                                className: "dialog-footer-center dialog-resize-handle",
                                contextKey: "footerCenter",
                            },
                        ],
                    },
                ],
            }, null, doms);
            dialog._doms = doms;
            let showCaptionBar = dialog._showCaptionBar;
            if (showCaptionBar !== false) {
                let tools = dialog._tools, toolButtons = [];
                if (tools instanceof Array) {
                    for (let i = 0, j = tools.length; i < j; i++) {
                        let tool = tools[i];
                        if (tool) {
                            toolButtons.push(tool);
                        }
                    }
                }
                let captionBar = (dialog._captionBar = new dorado.widget.CaptionBar({
                    className: "d-dialog-caption-bar",
                    caption: dialog.get("caption") || dialog._caption,
                    icon: dialog._icon,
                    iconClass: dialog._iconClass,
                    buttons: toolButtons,
                }));
                dialog.registerInnerControl(captionBar);
                captionBar.render(doms.body.parentNode, doms.body);
                doms.captionBar = captionBar._dom;
                $DomUtils.disableUserSelection(doms.captionBar);
            }
            dialog.initButtons();
            if (dialog._minimizeable) {
                dialog._createMinimizeButton();
            }
            if (dialog._maximizeable) {
                dialog._createMaximizeButton();
            }
            if (dialog._closeable) {
                dialog._createCloseButton();
            }
            if (dialog._collapseable) {
                dialog._createCollapseButton();
            }
            if (dialog._draggable && showCaptionBar !== false) {
                let bodyRect;
                jQuery(dom)
                    .addClass("d-dialog-draggable")
                    .css("position", "absolute")
                    .draggable({
                    iframeFix: true,
                    addClasses: false,
                    handle: ".d-dialog-caption-bar",
                    cancel: ".button-group > div",
                    cursor: "move",
                    distance: 10,
                    containment: dialog._dragOutside ? null : "parent",
                    helper: function () {
                        if (useDraggingFakeDialog) {
                            if (!fakeDialog) {
                                fakeDialog = new dorado.widget.Dialog({
                                    exClassName: "d-dialog-helper",
                                    visible: true,
                                    animateType: "none",
                                    shadowMode: "none",
                                });
                                fakeDialog.render(dialog._dom.parentNode);
                            }
                            fakeDialog.render(dialog._dom.parentNode);
                            $fly(fakeDialog._dom).css("display", "");
                            let height = dialog.getRealHeight();
                            if (height == null) {
                                height = $fly(dom).height();
                            }
                            fakeDialog.set({
                                width: dom.offsetWidth,
                                height: height,
                                caption: dialog.get("caption"),
                                icon: dialog._icon,
                                iconClass: dialog._iconClass,
                                minimizeable: dialog._minimizeable,
                                maximizeable: dialog._maximizeable,
                                closeable: dialog._closeable,
                                collapseable: dialog._collapseable,
                                left: dialog._left,
                                top: dialog._top,
                                collapsed: dialog._collapsed,
                            });
                            fakeDialog.refresh();
                            return fakeDialog._dom;
                        }
                        else {
                            return dom;
                        }
                    },
                    start: function (event, ui) {
                        if (useDraggingFakeDialog) {
                            let helper = ui.helper;
                            helper.css({ display: "", visibility: "" }).bringToFront();
                            $fly(dom)
                                .addClass("d-dialog-dragging")
                                .css("visibility", "hidden");
                        }
                        let bodyEl = $fly(document.body), width = bodyEl.outerWidth(true), height = bodyEl.outerHeight(true), offset = bodyEl.offset();
                        bodyRect = {
                            left: offset.left,
                            top: offset.top,
                            right: offset.left + width,
                            bottom: offset.top + height,
                        };
                    },
                    drag: function (event, ui) {
                        let position = ui.position;
                        let helperRect = {
                            left: position.left,
                            top: position.top,
                            right: position.left + ui.helper.width(),
                            bottom: position.top + ui.helper.height(),
                        };
                        if (helperRect.left < bodyRect.left) {
                            position.left = bodyRect.left;
                        }
                        if (helperRect.top < bodyRect.top) {
                            position.top = bodyRect.top;
                        }
                    },
                    stop: function (event, ui) {
                        if (useDraggingFakeDialog) {
                            let helper = ui.helper, left = parseInt(helper.css("left"), 10), top = parseInt(helper.css("top"), 10);
                            $fly(dom)
                                .removeClass("d-dialog-dragging")
                                .css({ visibility: "", left: left, top: top });
                            dialog._left = left;
                            dialog._top = top;
                            $.ui.ddmanager.current.cancelHelperRemoval = true;
                            ui.helper.css("display", "none");
                        }
                    },
                });
            }
            if (dialog._resizeable) {
                let dialogXY, dialogSize, dialogHelperOffset, bodyRect;
                jQuery(dom)
                    .addClass("d-dialog-resizeable")
                    .find(".dialog-resize-handle")
                    .each(function (index, handle) {
                    let className = handle.className.split(" ")[0], config = handleConfigMap[className];
                    if (!config) {
                        return;
                    }
                    jQuery(handle).draggable({
                        iframeFix: true,
                        cursor: config.cursor,
                        addClasses: false,
                        containment: "parent",
                        helper: function () {
                            let proxy = document.createElement("div");
                            proxy.className = "d-dialog-drag-proxy";
                            proxy.style.position = "absolute";
                            let $dom = $fly(dom);
                            dialogXY = $dom.offset();
                            dialogSize = [$dom.width(), $dom.height()];
                            proxy.style.left = (dialog._left || 0) + "px";
                            proxy.style.top = (dialog._top || 0) + "px";
                            dom.parentNode.appendChild(proxy);
                            let helperOffset = $fly(proxy).offset();
                            dialogHelperOffset = {
                                left: (dialog._left || 0) - helperOffset.left,
                                top: (dialog._top || 0) - helperOffset.top,
                            };
                            $fly(proxy)
                                .bringToFront()
                                .outerWidth(dialogSize[0])
                                .outerHeight(dialogSize[1])
                                .css("cursor", config.cursor);
                            return proxy;
                        },
                        start: function (event, ui) {
                            let bodyEl = $fly(document.body), width = bodyEl.outerWidth(true), height = bodyEl.outerHeight(true), offset = bodyEl.offset();
                            bodyRect = {
                                left: offset.left,
                                top: offset.top,
                                right: offset.left + width,
                                bottom: offset.top + height,
                            };
                        },
                        drag: function (event, ui) {
                            let horiStyle = config.horiStyle, vertStyle = config.vertStyle, heightRatio = config.heightRatio, widthRatio = config.widthRatio, minWidth = dialog._minWidth || 200, minHeight = dialog._minHeight || 100, maxWidth = dialog._maxWidth, maxHeight = dialog._maxHeight;
                            ui.position = {
                                left: $fly(dom).offset().left,
                                top: $fly(dom).offset().top,
                            };
                            let inst = jQuery.data(this, "ui-draggable"), horiChange = event.pageX - inst.originalPageX, vertChange = event.pageY - inst.originalPageY, width, height, horiOverflowOffset, vertOverflowOffset;
                            let helper = ui.helper, position = ui.position, widthFlag = false, heightFlag = false;
                            position.left += dialogHelperOffset.left;
                            position.top += dialogHelperOffset.top;
                            if (horiStyle.indexOf("width") !== -1) {
                                width = dialogSize[0] + widthRatio * horiChange;
                                if (width < minWidth) {
                                    horiOverflowOffset = width - minWidth;
                                    width = minWidth;
                                    widthFlag = true;
                                }
                                if (maxWidth && width > maxWidth) {
                                    horiOverflowOffset = width - maxWidth;
                                    width = maxWidth;
                                    widthFlag = true;
                                }
                            }
                            if (vertStyle.indexOf("height") !== -1) {
                                height = dialogSize[1] + heightRatio * vertChange;
                                if (height < minHeight) {
                                    vertOverflowOffset = height - minHeight;
                                    height = minHeight;
                                    heightFlag = true;
                                }
                                if (maxHeight && height > maxHeight) {
                                    vertOverflowOffset = height - maxHeight;
                                    height = maxHeight;
                                    heightFlag = true;
                                }
                            }
                            if (horiStyle.indexOf("left") !== -1) {
                                if (!widthFlag) {
                                    position.left = dialogXY.left + horiChange;
                                }
                                else {
                                    position.left =
                                        dialogXY.left + horiChange + horiOverflowOffset;
                                }
                            }
                            if (vertStyle.indexOf("top") !== -1) {
                                if (!heightFlag) {
                                    position.top = dialogXY.top + vertChange;
                                }
                                else {
                                    position.top =
                                        dialogXY.top + vertChange + vertOverflowOffset;
                                }
                            }
                            if (!dialog._dragOutside) {
                                let helperRect = {
                                    left: position.left,
                                    top: position.top,
                                    right: position.left + width,
                                    bottom: position.top + height,
                                };
                                if (helperRect.left < bodyRect.left) {
                                    position.left = bodyRect.left;
                                    width = helperRect.right - bodyRect.left;
                                }
                                else {
                                    if (helperRect.right >= bodyRect.right) {
                                        width = bodyRect.right - helperRect.left;
                                    }
                                }
                                if (helperRect.top < bodyRect.top) {
                                    position.top = bodyRect.top;
                                    height = helperRect.bottom - bodyRect.top;
                                }
                                else {
                                    if (helperRect.bottom >= bodyRect.bottom) {
                                        height = bodyRect.bottom - helperRect.top;
                                    }
                                }
                            }
                            helper.outerWidth(width).outerHeight(height);
                        },
                        stop: function (event, ui) {
                            let wrapEl = ui.helper, offset = wrapEl.offset();
                            offset.left += dialogHelperOffset.left;
                            offset.top += dialogHelperOffset.top;
                            dialog._left = offset.left;
                            dialog._top = offset.top;
                            dialog._width = wrapEl.outerWidth();
                            dialog._height = wrapEl.outerHeight();
                            dialog.refresh();
                            $fly(dialog._dom).css(offset);
                        },
                    });
                });
            }
            return dom;
        },
        getShowPosition: function (options) {
            let dialog = this;
            if (dialog._maximized) {
                let result = { left: 0, top: 0 };
                $fly(dialog._dom).css(result);
                return result;
            }
            else {
                return $invokeSuper.call(dialog, arguments);
            }
        },
    });
})();
(function () {
    let validItemCodes = [
        "|<",
        "<",
        ">",
        ">|",
        "goto",
        "pageSize",
        "info",
        "+",
        "-",
        "x",
        "|",
    ];
    let defaultShowTextItemCodes = ["goto", "+", "-", "x"];
    dorado.widget.DataPilot = $extend([dorado.widget.Control, dorado.widget.DataControl], {
        $className: "dorado.widget.DataPilot",
        ATTRIBUTES: {
            className: { defaultValue: "d-data-pilot" },
            itemCodes: {
                defaultValue: "pages",
                setter: function (v) {
                    if (this._itemCodes !== v) {
                        this._itemCodes = v;
                        this.compileItemCodes(v);
                    }
                },
            },
            height: { independent: true, readOnly: true },
            disabled: {},
        },
        EVENTS: { onSubControlRefresh: {}, onSubControlAction: {} },
        filterDataSetMessage: function (messageCode, arg, data) {
            let b = true;
            let entities;
            switch (messageCode) {
                case dorado.widget.DataSet.MESSAGE_CURRENT_CHANGED:
                case dorado.widget.DataSet.MESSAGE_REFRESH_ENTITY:
                case dorado.widget.DataSet.MESSAGE_ENTITY_STATE_CHANGED:
                    entities = this.getBindingData();
                    b =
                        !this._entities ||
                            entities === this._entities ||
                            dorado.DataUtil.isOwnerOf(entities, arg.entityList);
                    break;
                case dorado.widget.DataSet.MESSAGE_DATA_CHANGED:
                    entities = this.getBindingData();
                    b =
                        !this._entities ||
                            entities === this._entities ||
                            dorado.DataUtil.isOwnerOf(entities, arg.entity);
                    break;
                case dorado.widget.DataSet.MESSAGE_DELETED:
                case dorado.widget.DataSet.MESSAGE_INSERTED:
                case dorado.widget.DataSet.MESSAGE_LOADING_START:
                case dorado.widget.DataSet.MESSAGE_LOADING_END:
                    b = false;
                    break;
            }
            if (b) {
                this._entities = this.getBindingData();
            }
            return b;
        },
        processDataSetMessage: function (messageCode, arg, data) {
            switch (messageCode) {
                case dorado.widget.DataSet.MESSAGE_REFRESH:
                case dorado.widget.DataSet.MESSAGE_DATA_CHANGED:
                case dorado.widget.DataSet.MESSAGE_CURRENT_CHANGED:
                case dorado.widget.DataSet.MESSAGE_REFRESH_ENTITY:
                case dorado.widget.DataSet.MESSAGE_ENTITY_STATE_CHANGED:
                    this.refresh(true);
                    break;
            }
        },
        getBindingData: function (options) {
            let realOptions = { firstResultOnly: true, acceptAggregation: true };
            if (typeof options === "string") {
                realOptions.loadMode = options;
            }
            else {
                dorado.Object.apply(realOptions, options);
            }
            return $invokeSuper.call(this, [realOptions]);
        },
        refreshDom: function (dom) {
            $invokeSuper.call(this, arguments);
            if (this._currentItemCodeExpression === undefined) {
                this.compileItemCodes();
            }
            if (this._itemCodeExpression !== this._currentItemCodeExpression) {
                this._currentItemCodeExpression = this._itemCodeExpression || null;
                let itemObjects = this._itemObjects, oldItemObjects = itemObjects;
                if (itemObjects) {
                    for (let p in itemObjects) {
                        let item = itemObjects[p];
                        item.destroy();
                    }
                }
                this._itemObjects = itemObjects = {};
                let itemCodes = this._compiledItemCodes;
                if (itemCodes) {
                    for (let i = 0; i < itemCodes.length; i++) {
                        let itemCode = itemCodes[i];
                        let item = oldItemObjects ? oldItemObjects[itemCode.key] : null;
                        if (!item) {
                            item = this.createItem(itemCode);
                        }
                        item.render(dom);
                        this.registerInnerControl(item);
                        itemObjects[itemCode.key] = item;
                    }
                }
            }
            let entityList = this.getBindingData();
            if (!this._entities || this._entities !== entityList) {
                this._entities = entityList;
            }
            this.refreshItems();
        },
        createItem: function (itemCode) {
            function fireOnActionEvent(code, control) {
                let eventArg = { code: code, control: control, processDefault: true };
                this.fireEvent("onSubControlAction", this, eventArg);
                return eventArg.processDefault;
            }
            function callback() {
                pilot.set("disabled", false);
            }
            let item, pilot = this;
            switch (itemCode.code) {
                case "|<":
                    item = new PageButton({
                        iconClass: itemCode.showIcon ? "icon-first-page" : null,
                        tip: itemCode.showCaption
                            ? $resource("dorado.baseWidget.DataPilotFirstPage")
                            : null,
                        onClick: function (self) {
                            if (!fireOnActionEvent.call(pilot, itemCode.code, self)) {
                                return;
                            }
                            let list = pilot.getBindingData();
                            if (list instanceof dorado.EntityList && list.pageNo > 1) {
                                pilot.set("disabled", true);
                                list.firstPage(callback);
                            }
                        },
                    });
                    break;
                case "<":
                    item = new PageButton({
                        iconClass: itemCode.showIcon ? "icon-previous-page" : null,
                        tip: itemCode.showCaption
                            ? $resource("dorado.baseWidget.DataPilotPreviousPage")
                            : null,
                        onClick: function () {
                            if (!fireOnActionEvent.call(pilot, itemCode.code, self)) {
                                return;
                            }
                            let list = pilot.getBindingData();
                            if (list instanceof dorado.EntityList && list.pageNo > 1) {
                                let current = list.current, pageNo = list.pageNo;
                                while (current === list.current && pageNo > 1) {
                                    pageNo--;
                                    pilot.set("disabled", true);
                                    let loaded = list.isPageLoaded(pageNo);
                                    list.gotoPage(pageNo, callback);
                                    if (!loaded) {
                                        break;
                                    }
                                }
                            }
                        },
                    });
                    break;
                case ">":
                    item = new PageButton({
                        iconClass: itemCode.showIcon ? "icon-next-page" : null,
                        tip: itemCode.showCaption
                            ? $resource("dorado.baseWidget.DataPilotNextPage")
                            : null,
                        onClick: function () {
                            if (!fireOnActionEvent.call(pilot, itemCode.code, self)) {
                                return;
                            }
                            let list = pilot.getBindingData();
                            if (list instanceof dorado.EntityList &&
                                list.pageNo < list.pageCount) {
                                let current = list.current, pageNo = list.pageNo;
                                while (current === list.current && pageNo < list.pageCount) {
                                    pageNo++;
                                    pilot.set("disabled", true);
                                    let loaded = list.isPageLoaded(pageNo);
                                    list.gotoPage(pageNo, callback);
                                    if (!loaded) {
                                        break;
                                    }
                                }
                            }
                        },
                    });
                    break;
                case ">|":
                    item = new PageButton({
                        iconClass: itemCode.showIcon ? "icon-last-page" : null,
                        tip: itemCode.showCaption
                            ? $resource("dorado.baseWidget.DataPilotLastPage")
                            : null,
                        onClick: function () {
                            if (!fireOnActionEvent.call(pilot, itemCode.code, self)) {
                                return;
                            }
                            let list = pilot.getBindingData();
                            if (list instanceof dorado.EntityList &&
                                list.pageNo < list.pageCount) {
                                pilot.set("disabled", true);
                                list.lastPage(callback);
                            }
                        },
                    });
                    break;
                case "goto":
                    item = new GotoPageControl({
                        onAction: function (self, arg) {
                            if (arg.pageNo < 1) {
                                arg.pageNo = 1;
                            }
                            if (!fireOnActionEvent.call(pilot, itemCode.code, self)) {
                                return;
                            }
                            let list = pilot.getBindingData();
                            if (list instanceof dorado.EntityList &&
                                list.pageNo !== arg.pageNo &&
                                arg.pageNo > 0 &&
                                arg.pageNo <= list.pageCount) {
                                item.set("disabled", true);
                                list.gotoPage(arg.pageNo, callback);
                            }
                            else {
                                pilot.refreshItems();
                            }
                        },
                    });
                    break;
                case "info":
                    item = new dorado.widget.Label();
                    break;
                case "pageSize":
                    item = new PageSizeControl({
                        step: itemCode.options || 5,
                        onAction: function (self, arg) {
                            if (!arg.pageSize || arg.pageSize < 1) {
                                self._pageSize = 10;
                                arg.pageSize = 10;
                            }
                            if (!fireOnActionEvent.call(pilot, itemCode.code, self)) {
                                return;
                            }
                            if (arg.pageSize > 0) {
                                let list = pilot.getBindingData();
                                if (list instanceof dorado.EntityList &&
                                    list.pageSize !== arg.pageSize) {
                                    let parent = list.parent;
                                    if (parent &&
                                        parent instanceof dorado.Entity &&
                                        list.parentProperty) {
                                        let pd = parent.dataType.getPropertyDef(list.parentProperty);
                                        if (pd) {
                                            item.set("disabled", true);
                                            pd.set("pageSize", arg.pageSize);
                                            parent.reset(list.parentProperty);
                                            return;
                                        }
                                    }
                                    else {
                                        if (!pilot._dataPath && pilot._dataSet) {
                                            item.set("disabled", true);
                                            pilot._dataSet.set("pageSize", arg.pageSize);
                                            pilot._dataSet.flushAsync();
                                            return;
                                        }
                                    }
                                }
                            }
                            else {
                                item.set("disabled", false);
                            }
                            pilot.refreshItems();
                        },
                    });
                    break;
                case "+":
                    item = new ToolBarButton({
                        iconClass: itemCode.showIcon ? "icon-add" : null,
                        caption: itemCode.showCaption
                            ? $resource("dorado.baseWidget.DataPilotInsert")
                            : null,
                        onClick: function () {
                            if (!fireOnActionEvent.call(pilot, itemCode.code, self)) {
                                return;
                            }
                            let list = pilot.getBindingData();
                            if (list instanceof dorado.EntityList) {
                                list.createChild();
                            }
                        },
                    });
                    break;
                case "-":
                    item = new ToolBarButton({
                        iconClass: itemCode.showIcon ? "icon-delete" : null,
                        caption: itemCode.showCaption
                            ? $resource("dorado.baseWidget.DataPilotDelete")
                            : null,
                        onClick: function () {
                            if (!fireOnActionEvent.call(pilot, itemCode.code, self)) {
                                return;
                            }
                            dorado.MessageBox.confirm($resource("dorado.baseWidget.DataPilotDeleteConfirm"), function () {
                                let list = pilot.getBindingData();
                                if (list instanceof dorado.EntityList && list.current) {
                                    list.current.remove();
                                }
                            });
                        },
                    });
                    break;
                case "x":
                    item = new ToolBarButton({
                        iconClass: itemCode.showIcon ? "icon-cancel" : null,
                        caption: itemCode.showCaption
                            ? $resource("dorado.baseWidget.DataPilotCancel")
                            : null,
                        onClick: function () {
                            if (!fireOnActionEvent.call(pilot, itemCode.code, self)) {
                                return;
                            }
                            dorado.MessageBox.confirm($resource("dorado.baseWidget.DataPilotCancelConfirm"), function () {
                                let list = pilot.getBindingData();
                                if (list instanceof dorado.EntityList && list.current) {
                                    list.current.cancel();
                                }
                            });
                        },
                    });
                    break;
                case "|":
                    item = new dorado.widget.toolbar.Separator();
                    break;
            }
            if (item) {
                item.set("style", "float: left");
            }
            return item;
        },
        compileItemCodes: function () {
            let itemCodes = this._itemCodes;
            if (itemCodes && itemCodes.indexOf("pages") >= 0) {
                itemCodes = itemCodes.replace("pages", "|<,<,goto,>,>|");
            }
            itemCodes = (itemCodes || "").split(",");
            let compiledItemCodes = (this._compiledItemCodes = []), itemCodeExpression = "";
            for (let i = 0; i < itemCodes.length; i++) {
                let itemCode = itemCodes[i], index = itemCode.indexOf("/");
                let code, showIcon = true, showCaption, options = null;
                if (index > 0) {
                    code = itemCode.substring(0, index);
                    options = itemCode.substring(index + 1);
                    if (code === "pageSize") {
                        options = parseInt(options);
                    }
                    else {
                        showIcon = options.indexOf("i") >= 0;
                        showCaption = options.indexOf("c") >= 0;
                        options = undefined;
                    }
                }
                else {
                    code = itemCode;
                    showCaption = defaultShowTextItemCodes.indexOf(code) >= 0;
                }
                if (validItemCodes.indexOf(code) >= 0) {
                    itemCode = {
                        code: code,
                        showIcon: showIcon,
                        showCaption: showCaption,
                        options: options,
                        key: code +
                            "/" +
                            (showIcon ? "i" : "") +
                            (showCaption ? "c" : "") +
                            i,
                    };
                    compiledItemCodes.push(itemCode);
                    if (itemCodeExpression.length > 0) {
                        itemCodeExpression += ",";
                    }
                    itemCodeExpression += itemCode.key;
                }
            }
            this._itemCodeExpression = itemCodeExpression;
        },
        refreshItems: function () {
            if (this._itemObjects) {
                let itemCodes = this._compiledItemCodes;
                if (itemCodes) {
                    for (let i = 0; i < itemCodes.length; i++) {
                        this.refreshItem(itemCodes[i]);
                    }
                }
            }
        },
        refreshItem: function (itemCode) {
            let item = this._itemObjects[itemCode.key];
            if (!item) {
                return;
            }
            let eventArg = {
                code: itemCode.code,
                control: item,
                processDefault: true,
            };
            this.fireEvent("onSubControlRefresh", this, eventArg);
            if (!eventArg.processDefault) {
                return;
            }
            let list = this._entities;
            if (!(list instanceof dorado.EntityList)) {
                list = null;
            }
            let pageNo = list ? list.pageNo : 1, pageCount = list ? list.pageCount : 1, pageSize = list ? list.pageSize : 0, entityCount = list ? list.entityCount : 0;
            let current = list ? list.current : null, disabled = this._disabled;
            switch (itemCode.code) {
                case "|<":
                    item.set("disabled", disabled || pageNo <= 1);
                    break;
                case "<":
                    item.set("disabled", disabled || pageNo <= 1);
                    break;
                case ">":
                    item.set("disabled", disabled || pageNo >= pageCount);
                    break;
                case ">|":
                    item.set("disabled", disabled || pageNo >= pageCount);
                    break;
                case "goto":
                    item.set({
                        disabled: disabled || pageCount === 1,
                        pageNo: pageNo,
                        pageCount: pageCount,
                        entityCount: entityCount,
                    });
                    break;
                case "info":
                    let text = $resource("dorado.baseWidget.DataPilotInfo", pageNo, pageCount, entityCount);
                    item.set("text", text);
                    break;
                case "pageSize":
                    item.set({
                        disabled: disabled || pageSize === 0,
                        pageSize: pageSize,
                    });
                    break;
                case "+":
                    item.set("disabled", disabled || (this._dataSet ? this._dataSet._readOnly : true));
                    break;
                case "-":
                    item.set("disabled", disabled || !current || this._dataSet._readOnly);
                    break;
                case "x":
                    item.set("disabled", disabled ||
                        !current ||
                        (current.state !== dorado.Entity.STATE_MODIFIED &&
                            current.state !== dorado.Entity.STATE_NEW) ||
                        this._dataSet._readOnly);
                    break;
            }
        },
    });
    let PageButton = dorado.widget.SimpleIconButton;
    let ToolBarButton = dorado.widget.toolbar.Button;
    let GotoPageControl = $extend(dorado.widget.Control, {
        ATTRIBUTES: {
            className: { defaultValue: "d-goto-page" },
            pageNo: { defaultValue: 1 },
            pageCount: { defaultValue: 1 },
            entityCount: { defaultValue: 0 },
            disabled: {},
        },
        EVENTS: {
            onAction: {
                interceptor: function (superFire, self, arg) {
                    if (arg.pageNo > 0) {
                        this._pageNo = arg.pageNo;
                        return superFire(self, arg);
                    }
                    else {
                        this._spinner.set("value", this._currentPageNo);
                    }
                },
            },
        },
        createDom: function (dom) {
            dom = document.createElement("SPAN");
            let gotoPage = this;
            this._labelPrefix = $DomUtils.xCreate({
                tagName: "SPAN",
                className: "text",
                style: "float: left",
            });
            dom.appendChild(this._labelPrefix);
            let spinner = (this._spinner = new dorado.widget.NumberSpinner({
                min: 1,
                max: 1000,
                value: 1,
                showSpinTrigger: false,
                onPost: function (self, arg) {
                    gotoPage.fireEvent("onAction", gotoPage, {
                        pageNo: spinner.get("value"),
                    });
                },
                onKeyDown: function (self, arg) {
                    if (arg.keyCode === 13) {
                        spinner.post();
                        arg.returnValue = true;
                    }
                },
                width: 40,
                style: "float: left",
            }));
            this.registerInnerControl(this._spinner);
            this._spinner.render(dom);
            this._labelSuffix = $DomUtils.xCreate({
                tagName: "SPAN",
                className: "text",
                style: "float: left",
            });
            dom.appendChild(this._labelSuffix);
            return dom;
        },
        refreshDom: function (dom) {
            $invokeSuper.call(this, arguments);
            let spinner = this._spinner;
            $fly(this._labelPrefix).text($resource("dorado.baseWidget.DataPilotGotoPagePrefix", this._pageNo, this._pageCount, this._entityCount));
            $fly(this._labelSuffix).text($resource("dorado.baseWidget.DataPilotGotoPageSuffix", this._pageNo, this._pageCount, this._entityCount));
            this._currentPageNo = this._pageNo;
            spinner.set({
                max: this._pageCount,
                value: this._pageNo,
                readOnly: this._disabled,
            });
        },
    });
    let PageSizeControl = $extend(dorado.widget.Control, {
        ATTRIBUTES: {
            className: { defaultValue: "d-page-size" },
            pageSize: { defaultValue: 10 },
            step: { defaultValue: 5 },
            disabled: {},
        },
        EVENTS: {
            onAction: {
                interceptor: function (superFire, self, arg) {
                    this._pageSize = arg.pageSize;
                    return superFire(self, arg);
                },
            },
        },
        createDom: function (dom) {
            dom = document.createElement("SPAN");
            let pageSizeControl = this;
            this._labelPrefix = $DomUtils.xCreate({
                tagName: "SPAN",
                className: "text",
                style: "float: left",
            });
            dom.appendChild(this._labelPrefix);
            let spinner = (this._spinner = new dorado.widget.NumberSpinner({
                min: 1,
                onPost: function (self, arg) {
                    let pageSize = spinner.get("value");
                    if (pageSize > 1000) {
                        pageSize = 1000;
                    }
                    if (pageSize < 1) {
                        pageSize = 1;
                    }
                    pageSizeControl.fireEvent("onAction", pageSizeControl, {
                        pageSize: pageSize,
                    });
                },
                onKeyDown: function (self, arg) {
                    if (arg.keyCode === 13) {
                        spinner.post();
                        arg.returnValue = true;
                    }
                },
                width: 45,
                style: "float: left",
            }));
            return dom;
        },
        doOnAttachToDocument: function () {
            let dom = this.getDom();
            this.registerInnerControl(this._spinner);
            this._spinner.render(dom);
        },
        refreshDom: function (dom) {
            $invokeSuper.call(this, arguments);
            let spinner = this._spinner;
            $fly(this._labelPrefix).text($resource("dorado.baseWidget.DataPilotPageSize"));
            this._currentPageSize;
            spinner.set({
                step: this._step,
                value: this._pageSize,
                readOnly: this._disabled,
            });
        },
    });
})();
