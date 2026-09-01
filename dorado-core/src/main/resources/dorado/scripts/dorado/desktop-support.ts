// @ts-nocheck
/// <reference path="globals.d.ts" />
(function () {
	let exceptionStack: any[] = [],
		currentException: any;
	let exceptionDialog: any,
		exceptionDialogOpening: boolean = false;
	let exceptionDialogMinWidth: number = 300;
	let exceptionDialogMaxWidth: number = 800;
	let exceptionDialogMaxHeight: number = 500;
	let exceptionDetailDialog: any,
		exceptionDetailDialogOpening: boolean = false;
	dorado.Exception.alertException = function (e: any) {
		exceptionStack.push(e);
		if (!exceptionDialogOpening) {
			doShowExceptionDialog();
		}
	};
	function doShowExceptionDialog() {
		currentException = exceptionStack.pop();
		if (!currentException) {
			return;
		}
		let dialog: any = getExceptionDialog();
		dialog.set({
			caption: $resource("dorado.baseWidget.ExceptionDialogTitle"),
			left: undefined,
			top: undefined,
			width: exceptionDialogMaxWidth,
			height: undefined,
		});
		dialog._textDom.innerText =
			dorado.Exception.getExceptionMessage(currentException);
		dialog.show();
	}
	function getExceptionDialog() {
		if (!exceptionDialog) {
			let doms: any = {};
			let contentDom: any = $DomUtils.xCreate(
				{
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
				},
				null,
				doms,
			);
			let buttons: any[] = [];
			if ($setting["common.showExceptionStackTrace"]) {
				buttons.push({
					caption: $resource("dorado.baseWidget.ExceptionDialogDetail"),
					width: 80,
					onClick: function () {
						showExceptionDetailDialog(currentException);
					},
				});
			}
			buttons.push({
				caption: $resource("dorado.baseWidget.ExceptionDialogOK"),
				ui: "highlight",
				width: 85,
				onClick: function () {
					exceptionDialog.hide();
				},
			});
			exceptionDialog = new dorado.widget.Dialog({
				center: true,
				modal: true,
				resizeable: false,
				contentOverflow: "visible",
				animateType: "none",
				layout: { $type: "Native" },
				buttonAlign: "right",
				buttons: buttons,
				beforeShow: function () {
					exceptionDialogOpening = true;
					let dom: any = exceptionDialog._dom;
					let $dom: any = jQuery(dom),
						$contentDom: any = jQuery(contentDom);
					let contentWidth: number =
						$fly(doms.iconDom).outerWidth() + $fly(doms.textDom).outerWidth();
					if (contentWidth < exceptionDialogMinWidth) {
						contentWidth = exceptionDialogMinWidth;
					} else {
						if (contentWidth > exceptionDialogMaxWidth) {
							contentWidth = exceptionDialogMaxWidth;
						}
					}
					let dialogWidth: number = $dom.width(),
						panelWidth: number = $contentDom.width();
					exceptionDialog._width = contentWidth + dialogWidth - panelWidth;
					let contentHeight: number = $contentDom.outerHeight();
					if (contentHeight > exceptionDialogMaxHeight) {
						contentHeight = exceptionDialogMaxHeight;
					} else {
						contentHeight = null as any;
					}
					if (contentHeight) {
						let dialogHeight: number = $dom.height(),
							panelHeight: number = $contentDom.height();
						exceptionDialog._height =
							contentHeight + dialogHeight - panelHeight;
					}
					exceptionDialog.refresh();
				},
				onHide: function () {
					setTimeout(function () {
						exceptionDialogOpening = false;
						doShowExceptionDialog();
					}, 0);
				},
			});
			let containerDom: any = exceptionDialog.get("containerDom");
			containerDom.appendChild(contentDom);
			exceptionDialog._contentDom = contentDom;
			exceptionDialog._iconDom = doms.iconDom;
			exceptionDialog._textDom = doms.textDom;
		}
		return exceptionDialog;
	}
	function showExceptionDetailDialog(e: any) {
		if (!exceptionDetailDialogOpening) {
			let dialog: any = getExceptionDetailDialog();
			dialog._messsageTextArea.set(
				"text",
				dorado.Exception.getExceptionMessage(e),
			);
			let tabControl: any = dialog._tabControl,
				tab: any,
				currentTab: any;
			tab = tabControl.getTab("CallStack");
			tab.set("disabled", !e.stack);
			if (e.stack) {
				tab.get("control").set("text", dorado.Exception.formatStack(e.stack));
				currentTab = tab;
			}
			tab = tabControl.getTab("SystemStack");
			tab.set("disabled", !e.systemStack);
			if (e.systemStack) {
				tab
					.get("control")
					.set("text", dorado.Exception.formatStack(e.systemStack));
				if (!currentTab) {
					currentTab = tab;
				}
			}
			tab = tabControl.getTab("RemoteStack");
			tab.set("disabled", !e.remoteStack);
			if (e.remoteStack) {
				tab
					.get("control")
					.set("text", dorado.Exception.formatStack(e.remoteStack));
				if (!currentTab) {
					currentTab = tab;
				}
			}
			tabControl.set("currentTab", currentTab);
			dialog.show();
		}
	}
	function getExceptionDetailDialog() {
		if (!exceptionDetailDialog) {
			let messsageTextArea: any = new dorado.widget.TextArea({
				readOnly: true,
				selectTextOnFocus: false,
			});
			let tabControl: any = new dorado.widget.TabControl({
				tabs: [
					{
						$type: "Control",
						name: "CallStack",
						caption: $resource(
							"dorado.baseWidget.ExceptionDialogDetailCallStack",
						),
						control: {
							$type: "TextArea",
							readOnly: true,
							selectTextOnFocus: false,
						},
					},
					{
						$type: "Control",
						name: "SystemStack",
						caption: $resource(
							"dorado.baseWidget.ExceptionDialogDetailSystemStack",
						),
						control: {
							$type: "TextArea",
							readOnly: true,
							selectTextOnFocus: false,
						},
					},
					{
						$type: "Control",
						name: "RemoteStack",
						caption: $resource(
							"dorado.baseWidget.ExceptionDialogDetailRemoteStack",
						),
						control: {
							$type: "TextArea",
							readOnly: true,
							selectTextOnFocus: false,
						},
					},
				],
			});
			exceptionDetailDialog = new dorado.widget.Dialog({
				caption: $resource("dorado.baseWidget.ExceptionDialogDetailTitle"),
				width: 800,
				height: 560,
				center: true,
				resizeable: true,
				maximizeable: true,
				layout: { regionPadding: 8 },
				children: [
					{
						$type: "Container",
						height: 60,
						children: [
							{
								$type: "FormElement",
								width: "100%",
								showHint: false,
								label: $resource(
									"dorado.baseWidget.ExceptionDialogDetailMessage",
								),
								editor: messsageTextArea,
							},
						],
					},
					tabControl,
				],
				beforeShow: function () {
					exceptionDialogDetailOpening = true;
				},
				onHide: function () {
					exceptionDialogDetailOpening = false;
				},
			});
			exceptionDetailDialog._messsageTextArea = messsageTextArea;
			exceptionDetailDialog._tabControl = tabControl;
		}
		return exceptionDetailDialog;
	}
})();
