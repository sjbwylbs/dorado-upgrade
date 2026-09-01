// @ts-nocheck
/// <reference path="globals.d.ts" />
dorado.widget.LabelRenderer = $extend(dorado.Renderer, {
	render: function(dom: any, arg: any) {
		dom.innerText = arg.text || "";
	},
});
dorado.widget.Label = $extend(
	[dorado.widget.Control, dorado.widget.PropertyDataControl],
	{
		$className: "dorado.widget.Label",
		ATTRIBUTES: {
			className: { defaultValue: "d-label" },
			width: {},
			text: {},
			renderer: {
				setter: function(value: any) {
					if (typeof value === "string") {
						// CSP 兼容：通过类注册表查找并实例化，替代 eval("new " + value + "()")
						value = dorado.Core.createClassFromString(value);
					}
					this._renderer = value;
				},
			},
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
			let renderer = this._renderer || $singleton(dorado.widget.LabelRenderer);
			let entity = this.getBindingData(true);
			if (entity) {
				let timestamp = entity.timestamp;
				if (timestamp !== this._timestamp) {
					renderer.render(dom, {
						text:
							this._property && entity != null
								? entity.getText(this._property)
								: "",
						entity: entity,
						property: this._property,
					});
					this._timestamp = timestamp;
				}
			} else {
				renderer.render(dom, { text: this._text });
			}
		},
	},
);
dorado.widget.Link = $extend(dorado.widget.Label, {
	$className: "dorado.widget.Link",
	ATTRIBUTES: {
		className: { defaultValue: "d-link" },
		href: {
			setter: function(v: any) {
				this._href = v;
				if (!this._text) {
					this._text = v;
				}
			},
		},
		target: {},
	},
	EVENTS: {
		onClick: {
			interceptor: function(superFire: any, self: any, arg: any) {
				if (this.getListenerCount("onClick") > 0) {
					arg.returnValue === false;
					superFire(self, arg);
					return !!arg.returnValue;
				}
			},
		},
	},
	createDom: function() {
		return document.createElement("A");
	},
	refreshDom: function(dom: any) {
		$invokeSuper.call(this, arguments);
		dom.href = this._href;
		dom.target = this._target || "_self";
	},
});
dorado.widget.Image = $extend(
	[dorado.widget.Control, dorado.widget.PropertyDataControl],
	{
		$className: "dorado.widget.Image",
		ATTRIBUTES: {
			className: { defaultValue: "d-image" },
			image: {},
			stretchMode: { writeBeforeReady: true, defaultValue: "keepRatio" },
			packMode: { writeBeforeReady: true, defaultValue: "center" },
			blankImage: { defaultValue: ">dorado/client/resources/blank.gif" },
		},
		doStretchAndPack: function() {
			if (!this._srcLoaded) {
				return;
			}
			let image = this,
				dom = image._dom,
				imageDom = dom.firstChild,
				stretchMode = image._stretchMode,
				packMode = image._packMode || "center",
				controlWidth = dom.clientWidth || image._width,
				controlHeight = dom.clientHeight || image._height,
				left = 0,
				top = 0,
				imageWidth = image._originalWidth,
				imageHeight = image._originalHeight,
				forceFit = false;
			if (stretchMode === "fill") {
				forceFit = true;
				if (controlWidth / controlHeight > imageWidth / imageHeight) {
					stretchMode = "fitWidth";
				} else {
					stretchMode = "fitHeight";
				}
			}
			if (stretchMode === "keepRatio" || stretchMode === "fitWidth") {
				if (imageWidth > controlWidth || forceFit) {
					imageHeight = Math.round((controlWidth * imageHeight) / imageWidth);
					imageWidth = controlWidth;
				}
			}
			if (stretchMode === "keepRatio" || stretchMode === "fitHeight") {
				if (imageHeight > controlHeight || forceFit) {
					imageWidth = Math.round((controlHeight * imageWidth) / imageHeight);
					imageHeight = controlHeight;
				}
			}
			if (packMode === "center") {
				left = Math.round((controlWidth - imageWidth) / 2);
				top = Math.round((controlHeight - imageHeight) / 2);
			} else {
				if (packMode === "end") {
					left = Math.round(controlWidth - imageWidth);
					top = Math.round(controlHeight - imageHeight);
				}
			}
			$fly(imageDom).css({
				left: left,
				top: top,
				width: imageWidth,
				height: imageHeight,
				visibility: "",
			});
			if (this._modernScroller) {
				this._modernScroller.update();
			}
		},
		doOnAttachToDocument: function() {
			$invokeSuper.call(this, arguments);
			if (this._stretchMode === "none") {
				this._modernScroller = $DomUtils.modernScroll(this.getDom(), {
					autoDisable: true,
				});
			}
		},
		createDom: function() {
			let image = this,
				dom = $DomUtils.xCreate({
					tagName: "DIV",
					content: { tagName: "IMG" },
					style: { position: "relative" },
				});
			let imageDom = (image._imageDom = dom.firstChild),
				$imageDom = $fly(imageDom),
				stretchMode = image._stretchMode;
			if (
				stretchMode === "keepRatio" ||
				stretchMode === "fitWidth" ||
				stretchMode === "fitHeight" ||
				stretchMode === "fill"
			) {
				$imageDom
					.css({
						position: "absolute",
						width: "",
						height: "",
						visibility: "hidden",
					})
					.bind("load", function() {
						image._srcLoaded = true;
						image._originalWidth = imageDom.offsetWidth;
						image._originalHeight = imageDom.offsetHeight;
						image.doStretchAndPack();
					});
			} else {
				if (stretchMode === "stretch" || stretchMode === "fit") {
					$imageDom.css({ position: "", width: "100%", height: "100%" });
				}
			}
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
		doOnResize: function() {
			$invokeSuper.call(this, arguments);
			this.doStretchAndPack();
		},
		refreshDom: function(dom: any) {
			let imgUrl;
			let entity = this.getBindingData(true);
			if (entity) {
				let timestamp = entity.timestamp;
				if (timestamp === this._timestamp) {
					return;
				}
				imgUrl =
					(this._property && entity != null
						? entity.get(this._property)
						: "") || this._blankImage;
				this._timestamp = timestamp;
			} else {
				imgUrl = this._image || this._blankImage;
			}
			let $imageDom = $fly(this._imageDom);
			if (this._stretchMode === "keepRatio") {
				$imageDom.css({ position: "absolute", width: "", height: "" });
			}
			if (this._lastImgUrl !== imgUrl) {
				this._lastImgUrl = imgUrl;
				this._srcLoaded = false;
				this._originalWidth = null;
				this._originalHeight = null;
			}
			$imageDom.attr("src", $url(imgUrl));
			$invokeSuper.call(this, arguments);
		},
	},
);
dorado.widget.TemplateField = $extend(
	[dorado.widget.Control, dorado.widget.DataControl],
	{
		$className: "dorado.widget.TemplateField",
		ATTRIBUTES: {
			className: { defaultValue: "d-template-field" },
			dataPath: { defaultValue: "#" },
			template: {},
			entity: {},
		},
		getBindingData: function(options: any) {
			let realOptions = { firstResultOnly: true, acceptAggregation: false };
			if (typeof options === "String") {
				realOptions.loadMode = options;
			} else {
				dorado.Object.apply(realOptions, options);
			}
			return $invokeSuper.call(this, [realOptions]);
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
			let entity = this.getBindingData(true) || this._entity;
			if (entity) {
				let timestamp = entity.timestamp;
				if (timestamp === this._timestamp) {
					return;
				}
				this._timestamp = timestamp;
			}
			if (this._template) {
				let html,
					context = { view: this.get("view"), control: this, entity: entity };
				context.data = entity
					? entity.getWrapper({ textMode: true, readOnly: true })
					: {};
				html = _.template(this._template, context);
				dom.innerHTML = html;
			} else {
				dom.innerHTML = "";
			}
		},
	},
);
(function() {
	dorado.widget.editor = {};
	let deamonForm;
	dorado.widget.editor.GET_DEAMON_FORM = function() {
		if (!deamonForm) {
			deamonForm = $DomUtils.xCreate({
				tagName: "FORM",
				id: dorado.Core.newId(),
				style: "display: none",
				onsubmit: function() {
					let focusedControl = dorado.widget.focusedControl.peek();
					if (focusedControl) {
						let textEditor;
						if (
							dorado.Object.isInstanceOf(
								focusedControl,
								dorado.widget.AbstractEditor,
							)
						) {
							textEditor = focusedControl;
						} else {
							textEditor = focusedControl.findParent(
								dorado.widget.AbstractEditor,
							);
						}
						if (textEditor && textEditor.post) {
							try {
								textEditor.post();
							} finally {
							}
						}
					}
					return false;
				},
			});
			document.body.appendChild(deamonForm);
		}
		return deamonForm;
	};
	dorado.widget.AbstractEditor = $extend(dorado.widget.Control, {
		$className: "dorado.widget.AbstractEditor",
		tabStop: true,
		ATTRIBUTES: {
			value: {},
			entity: {
				getter: function() {
					if (this._dataSet && this._dataSet._ready) {
						let entity = this._dataSet.getData(this._dataPath, {
							loadMode: "auto",
							firstResultOnly: true,
						});
						if (entity && entity instanceof dorado.EntityList) {
							entity = entity.current;
						}
						return entity;
					} else {
						return this._entity;
					}
				},
				setter: function(v: any) {
					if (this._dataSet) {
						return;
					}
					this._entity = v;
					this.refreshData();
				},
			},
			property: {
				setter: function(v: any) {
					this._property = v;
					this.refreshData();
				},
			},
			readOnly: {},
			supportsDirtyFlag: { defaultValue: true },
			modified: { readOnly: true },
		},
		EVENTS: { beforePost: {}, onPost: {}, onPostFailed: {} },
		refreshDom: function(dom: any) {
			this._bindingInfo = null;
			if (this._dataSet) {
				this._entity = null;
				if (this._property) {
					let bindingInfo = (this._bindingInfo = this.getBindingInfo());
					if (bindingInfo.entity instanceof dorado.Entity) {
						this._entity = bindingInfo.entity;
					}
				}
			}
			$invokeSuper.call(this, [dom]);
		},
		cancel: function() {
			this.timestamp = 0;
			this.refresh();
		},
		post: function() {
			try {
				let eventArg = { processDefault: true };
				this.fireEvent("beforePost", this, eventArg);
				if (eventArg.processDefault === false) {
					return false;
				}
				if (this.doPost) {
					this.doPost();
				}
				this.fireEvent("onPost", this);
				return true;
			} catch (e) {
				dorado.Exception.processException(e);
			}
		},
		refreshData: function() {
			if (this._property && this._entity) {
				if (this.doRefreshData) {
					if (
						!this._refreshDataPerformed &&
						this._entity &&
						this._entity instanceof dorado.widget.FormProfile.DefaultEntity &&
						this._entity[this._property] === undefined
					) {
						return;
					}
					this._refreshDataPerformed = true;
					this.doRefreshData();
				}
			}
		},
		doRefreshData: function() {
			let p = this._property,
				e = this._entity;
			this.set("value", e instanceof dorado.Entity ? e.get(p) : e[p]);
			this.setDirty(false);
		},
		doPost: function() {
			let p = this._property,
				e = this._entity;
			if (p && e) {
				let v = this.get("value");
				if (e instanceof dorado.Entity) {
					e.set(p, v);
					this.setDirty(e.isDirty(p));
				} else {
					e[p] = v;
					this.setDirty(true);
				}
			}
			return true;
		},
		setDirty: function(dirty: any) {
			if (!this._supportsDirtyFlag) {
				return;
			}
			$fly(this.getDom()).toggleClass(this._className + "-dirty", !!dirty);
		},
	});
	dorado.widget.AbstractDataEditor = $extend(
		[dorado.widget.AbstractEditor, dorado.widget.PropertyDataControl],
		{
			$className: "dorado.widget.AbstractDataEditor",
			filterDataSetMessage: function(messageCode: any, arg: any, data: any) {
				let b = true;
				switch (messageCode) {
					case dorado.widget.DataSet.MESSAGE_ENTITY_STATE_CHANGED:
						b = false;
						break;
					default:
						b = $invokeSuper.call(this, [messageCode, arg, data]);
				}
				return b;
			},
			processDataSetMessage: function(messageCode: any, arg: any, data: any) {
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
			getBindingInfo: function() {
				if (
					this._bindingInfoCache &&
					new Date().getTime() - this._bindingInfoCache.cacheTimestamp < 50
				) {
					return this._bindingInfoCache;
				}
				let info = {};
				let entityDataType, propertyDef;
				let entity = (info.entity = this.getBindingData());
				if (entity != null) {
					info.timestamp = entity.timestamp;
				}
				propertyDef = this.getBindingPropertyDef();
				if (propertyDef) {
					info.propertyDef = propertyDef;
					info.entityDataType = propertyDef.parent;
					info.dataType = propertyDef ? propertyDef.get("dataType") : null;
				}
				if (info.timestamp == null) {
					info.timestamp = 0;
				}
				info.cacheTimestamp = new Date().getTime();
				this._bindingInfoCache = info;
				return info;
			},
			doPost: function() {
				let p = this._property,
					e = this._entity;
				if (!p || !e) {
					return false;
				}
				let b = false;
				if (this._dataSet) {
					e.set(p, this.get("value"));
					b = true;
				} else {
					if (e instanceof dorado.Entity) {
						e.set(p, this.get("value"));
					} else {
						e[p] = this.get("value");
					}
					b = true;
				}
				return b;
			},
			refreshExternalReadOnly: function() {
				if (this._dataSet) {
					let readOnly = this._dataSet._readOnly;
					if (!readOnly && this._property) {
						let bindingInfo = this._bindingInfo;
						readOnly = bindingInfo.entity == null;
						if (!readOnly && bindingInfo.propertyDef) {
							readOnly = bindingInfo.propertyDef.get("readOnly");
						}
					} else {
						readOnly = true;
					}
					this._readOnly2 = readOnly;
				} else {
					this._readOnly2 = false;
				}
			},
			isFocusable: function() {
				return $invokeSuper.call(this) && !(this._readOnly || this._readOnly2);
			},
		},
	);
})();
dorado.widget.CheckBox = $extend(dorado.widget.AbstractDataEditor, {
	$className: "dorado.widget.CheckBox",
	ATTRIBUTES: {
		className: { defaultValue: "d-checkbox" },
		height: { independent: true },
		iconOnly: { writeBeforeReady: true },
		onValue: { defaultValue: true },
		offValue: { defaultValue: false },
		mixedValue: {},
		caption: {},
		value: {
			defaultValue: false,
			getter: function() {
				return this._checked
					? this._onValue
					: this._checked == null || this._checked === undefined
						? this._mixedValue
						: this._offValue;
			},
			setter: function(v: any) {
				if (this._onValue === v) {
					this._checked = true;
				} else {
					if (this._offValue === v) {
						this._checked = false;
					} else {
						this._checked = null;
					}
				}
				if (!this._dataSet && this._rendered) {
					this._lastPost = this._checked;
				}
			},
		},
		checked: {
			defaultValue: false,
			setter: function(value: any) {
				if (this._triState) {
					this._checked = value;
				} else {
					this._checked = !!value;
				}
			},
		},
		triState: { defaultValue: false },
	},
	EVENTS: { onValueChange: {} },
	_isReadOnly: function() {
		let checkBox = this;
		let extraReadOnly = false;
		let column = checkBox._cellColumn;
		if (column) {
			let grid = column._grid;
			if (grid) {
				extraReadOnly = !grid.shouldEditing(column);
			}
		}
		return checkBox._readOnly || this._readOnly2 || extraReadOnly;
	},
	onClick: function(event: any) {
		let checkBox = this;
		if (checkBox._isReadOnly()) {
			return;
		}
		if (event !== true && event.target === checkBox._dom) {
			return;
		}
		let checked = checkBox._checked;
		if (checkBox._triState) {
			if (checkBox._checked == null || checkBox._checked === undefined) {
				checkBox._checked = true;
			} else {
				if (checkBox._checked === true) {
					checkBox._checked = false;
				} else {
					checkBox._checked = null;
				}
			}
		} else {
			checkBox._checked = !checkBox._checked;
		}
		let postResult = checkBox.post();
		if (postResult === false) {
			checkBox._checked = checked;
		}
		checkBox.refresh();
		checkBox.fireEvent("onValueChange", checkBox);
	},
	post: function() {
		let modified = this._lastPost !== this._checked;
		if (!modified) {
			return true;
		}
		let lastPost = this._lastPost;
		try {
			this._lastPost = this._checked;
			let eventArg = { processDefault: true };
			this.fireEvent("beforePost", this, eventArg);
			if (eventArg.processDefault === false) {
				return false;
			}
			if (this.doPost) {
				this.doPost();
			}
			this.fireEvent("onPost", this);
			return true;
		} catch (e) {
			this._lastPost = lastPost;
			dorado.Exception.processException(e);
			return false;
		}
	},
	refreshDom: function(dom: any) {
		$invokeSuper.call(this, arguments);
		let checkBox = this,
			checked = checkBox._checked,
			caption = checkBox._caption || "";
		this.refreshExternalReadOnly();
		$fly(dom)
			.toggleClass(checkBox._className + "-icononly", !!checkBox._iconOnly)
			.toggleClass(
				checkBox._className + "-readonly",
				!!(checkBox._readOnly || checkBox._readOnly2),
			);
		if (checkBox._dataSet) {
			checked = undefined;
			let value, dirty;
			if (checkBox._property) {
				let bindingInfo = checkBox._bindingInfo;
				let dt = bindingInfo.dataType;
				if (dt) {
					let config;
					switch (dt._code) {
						case dorado.DataType.BOOLEAN:
							config = { triState: true };
							break;
						case dorado.DataType.PRIMITIVE_INT:
						case dorado.DataType.PRIMITIVE_FLOAT:
							config = { offValue: 0, onValue: 1 };
							break;
						case dorado.DataType.INTEGER:
						case dorado.DataType.FLOAT:
							config = { offValue: 0, onValue: 1, triState: true };
							break;
					}
					if (config) {
						this.set(config, { preventOverwriting: true });
					}
				}
				if (bindingInfo.entity instanceof dorado.Entity) {
					value = bindingInfo.entity.get(checkBox._property);
					dirty = bindingInfo.entity.isDirty(checkBox._property);
				}
			}
			value += "";
			if (value === checkBox._onValue + "") {
				checked = true;
			} else {
				if (value === checkBox._offValue + "") {
					checked = false;
				}
			}
			checkBox._checked = checked;
			checkBox._lastPost = checked;
			checkBox.setDirty(dirty);
		}
		let iconEl = dom.firstChild;
		if (checked) {
			$fly(iconEl).removeClass("unchecked halfchecked").addClass("checked");
		} else {
			if (checked == null && checkBox._triState) {
				$fly(iconEl).removeClass("checked unchecked").addClass("halfchecked");
			} else {
				$fly(iconEl).removeClass("checked halfchecked").addClass("unchecked");
			}
		}
		if (!checkBox._iconOnly) {
			iconEl.nextSibling.innerText = caption;
		}
	},
	createDom: function() {
		let checkBox = this,
			dom,
			doms = {};
		if (checkBox._iconOnly) {
			dom = $DomUtils.xCreate({
				tagName: "SPAN",
				className: checkBox._className,
				content: { tagName: "SPAN", className: "icon" },
			});
		} else {
			dom = $DomUtils.xCreate({
				tagName: "SPAN",
				className: checkBox._className,
				content: [
					{ tagName: "SPAN", className: "icon", contextKey: "icon" },
					{
						tagName: "SPAN",
						className: "caption",
						contextKey: "caption",
						content: checkBox._caption || "",
					},
				],
			});
		}
		$fly(dom).hover(
			function() {
				if (!(checkBox._readOnly || checkBox._readOnly2)) {
					if (checkBox._checked) {
						$fly(dom)
							.removeClass("d-checkbox-checked")
							.addClass("d-checkbox-hover");
					} else {
						if (checkBox._checked == null) {
							$fly(dom)
								.removeClass("d-checkbox-halfchecked")
								.addClass("d-checkbox-hover");
						} else {
							$fly(dom)
								.removeClass("d-checkbox-unchecked")
								.addClass("d-checkbox-hover");
						}
					}
				}
			},
			function() {
				$fly(dom).removeClass("d-checkbox-hover");
				if (checkBox._checked) {
					$fly(dom).addClass("d-checkbox-checked");
				} else {
					if (checkBox._checked == null || checkBox._checked === undefined) {
						$fly(dom).addClass("d-checkbox-halfchecked");
					} else {
						$fly(dom).addClass("d-checkbox-unchecked");
					}
				}
			},
		);
		return dom;
	},
	doOnKeyDown: function(evt: any) {
		let retValue = true;
		switch (evt.keyCode) {
			case 32:
				this.onClick(true);
				retValue = false;
				break;
		}
		return retValue;
	},
});
dorado.widget.RadioButton = $extend(dorado.widget.Control, {
	$className: "dorado.widget.RadioButton",
	tabStop: true,
	ATTRIBUTES: {
		className: { defaultValue: "d-radio" },
		height: { independent: true },
		text: {},
		value: {},
		checked: {},
		readOnly: {},
	},
	_isReadOnly: function() {
		let radioButton = this,
			radioGroup = radioButton._radioGroup;
		let extraReadOnly = false;
		let column = radioGroup._cellColumn;
		if (column) {
			let grid = column._grid;
			if (grid) {
				extraReadOnly = !grid.shouldEditing(column);
			}
		}
		return (
			radioButton._readOnly ||
			radioGroup._readOnly ||
			radioGroup._readOnly2 ||
			extraReadOnly
		);
	},
	onClick: function(event: any) {
		let radioButton = this;
		if (event.target === radioButton._dom) {
			return;
		}
		if (!radioButton._isReadOnly()) {
			if (!radioButton._checked) {
				radioButton._checked = true;
				if (radioButton._radioGroup) {
					radioButton._radioGroup._valueChange(radioButton);
				}
			}
		}
	},
	refreshDom: function(dom: any) {
		$invokeSuper.call(this, arguments);
		let radioButton = this,
			doms = radioButton._doms,
			checked = radioButton._checked,
			text = radioButton._text,
			jDom;
		if (dom) {
			$fly(dom).toggleClass(
				radioButton._className + "-readonly",
				radioButton._isReadOnly(),
			);
			if (checked) {
				$fly(doms.icon).removeClass("unchecked").addClass("checked");
			} else {
				$fly(doms.icon).removeClass("checked").addClass("unchecked");
			}
			$fly(doms.text).html(text);
		}
	},
	createDom: function() {
		let radioButton = this,
			dom,
			doms = {};
		dom = $DomUtils.xCreate(
			{
				tagName: "div",
				className: radioButton._className,
				content: [
					{ tagName: "span", className: "icon", contextKey: "icon" },
					{
						tagName: "span",
						className: "text",
						contextKey: "text",
						content: radioButton._text,
					},
				],
			},
			null,
			doms,
		);
		radioButton._doms = doms;
		$fly([doms.icon, doms.text])
			.hover(
				function() {
					if (!radioButton._isReadOnly()) {
						$fly(dom).addClass(radioButton._className + "-hover");
					}
				},
				function() {
					if (!radioButton._isReadOnly()) {
						$fly(dom).removeClass(radioButton._className + "-hover");
					}
				},
			)
			.mousedown(function(event: any) {
				if (!radioButton._isReadOnly()) {
					$fly(dom).addClass(radioButton._className + "-click");
				}
				$(document).one("mouseup", function() {
					if (!radioButton._isReadOnly()) {
						$fly(dom).removeClass(radioButton._className + "-click");
					}
				});
			});
		return dom;
	},
	isFocusable: function() {
		return !this._isReadOnly() && $invokeSuper.call(this);
	},
});
dorado.widget.RadioGroup = $extend(dorado.widget.AbstractDataEditor, {
	$className: "dorado.widget.RadioGroup",
	ATTRIBUTES: {
		className: { defaultValue: "d-radiogroup" },
		height: { independent: true },
		layout: { defaultValue: "flow" },
		columnCount: { defaultValue: 3 },
		radioButtons: {
			setter: function(radioButtons: any) {
				let radioGroup = this,
					oldValue = this._radioButtons,
					dom = radioGroup._dom;
				if (oldValue) {
					radioGroup.clearRadioButtons();
				}
				radioGroup._radioButtons = radioButtons;
				this._dontGenerateButtons = radioButtons && radioButtons.length;
				if (radioButtons) {
					for (let i = 0; i < radioButtons.length; i++) {
						let radioButton = radioButtons[i];
						if (!(radioButton instanceof dorado.widget.RadioButton)) {
							radioButtons[i] = radioButton = new dorado.widget.RadioButton(
								radioButton,
							);
						}
						if (dom) {
							radioButton._radioGroup = radioGroup;
							if (radioButton._value === radioGroup._value) {
								radioGroup.currentRadioButton = radioButton;
								radioButton._checked = true;
							}
							radioButton.render(dom);
						}
						radioGroup.registerInnerControl(radioButton);
					}
				}
				if (radioGroup._rendered && radioGroup.isActualVisible()) {
					radioGroup.doOnResize();
				}
			},
		},
		value: {
			setter: function(value: any) {
				this.setValue(value);
			},
		},
		readOnly: {},
	},
	EVENTS: { onValueChange: {} },
	setValue: function(value: any) {
		let radioGroup = this,
			radioButtons = radioGroup._radioButtons;
		if (radioButtons) {
			let found = false;
			for (let i = 0, j = radioButtons.length; i < j; i++) {
				let radioButton = radioButtons[i];
				if (value + "" === radioButton._value + "") {
					found = true;
					radioGroup._setValue(radioButton);
					break;
				}
			}
			if (!found) {
				radioGroup._setValue(null);
			}
		}
		radioGroup._value = value;
		if (!radioGroup._dataSet && radioGroup._rendered) {
			radioGroup._lastPost = value;
		}
	},
	addRadioButton: function(radioButton: any, index: any) {
		let radioGroup = this,
			radioButtons = radioGroup._radioButtons,
			dom = radioGroup._dom,
			refDom;
		if (!radioButtons) {
			radioButtons = radioGroup._radioButtons = [];
		}
		if (!(radioButton instanceof dorado.widget.RadioButton)) {
			radioButton = new dorado.widget.RadioButton(radioButton);
		}
		if (typeof index === "number") {
			let refButton = radioButtons[index];
			if (refButton) {
				refDom = refButton._dom;
			}
			radioButtons.insert(radioButton, index);
		} else {
			radioButtons.push(radioButton);
		}
		if (dom) {
			radioButton._radioGroup = radioGroup;
			if (radioButton._value === radioGroup._value) {
				radioGroup.currentRadioButton = radioButton;
				radioButton._checked = true;
			}
			radioButton.render(dom, refDom);
		}
		radioGroup.registerInnerControl(radioButton);
	},
	removeRadioButton: function(radioButton: any) {
		let radioGroup = this,
			radioButtons = radioGroup._radioButtons,
			index;
		if (!radioButtons) {
			return;
		}
		if (typeof radioButton === "number") {
			index = radioButton;
			radioButton = radioButtons[radioButton];
			radioGroup.unregisterInnerControl(radioButton);
			radioButton.destroy();
			radioButtons.removeAt(index);
			if (radioGroup.currentRadioButton === radioButton) {
				radioGroup.currentRadioButton = null;
			}
		} else {
			if (radioButton && radioButton.destroy) {
				radioGroup.unregisterInnerControl(radioButton);
				radioButton.destroy();
				if (radioGroup.currentRadioButton === radioButton) {
					radioGroup.currentRadioButton = null;
				}
			}
		}
	},
	clearRadioButtons: function() {
		let radioGroup = this,
			radioButtons = radioGroup._radioButtons || [],
			radioButton;
		for (let i = 0; i < radioButtons.length; i++) {
			radioButton = radioButtons[i];
			radioGroup.unregisterInnerControl(radioButton);
			radioButton.destroy();
		}
		radioGroup._radioButtons = null;
		radioGroup.currentRadioButton = null;
	},
	_setValue: function(radioButton: any) {
		let radioGroup = this,
			value = radioButton ? radioButton._value : null;
		if (radioGroup.currentRadioButton === radioButton) {
			return;
		}
		if (radioGroup.currentRadioButton) {
			radioGroup.currentRadioButton._checked = false;
			radioGroup.currentRadioButton.refresh();
		}
		if (radioButton) {
			radioButton._checked = true;
			radioButton.refresh();
		}
		radioGroup.currentRadioButton = radioButton;
	},
	_valueChange: function(radioButton: any) {
		let radioGroup = this,
			value = radioButton ? radioButton._value : null;
		if (
			radioGroup.currentRadioButton === radioButton ||
			radioGroup._value === value
		) {
			return;
		}
		let currentValue = radioGroup._value;
		radioGroup._value = value;
		let postResult = radioGroup.post();
		if (postResult === false) {
			radioGroup._value = currentValue;
			if (radioButton) {
				radioButton._checked = false;
				radioButton.refresh();
			}
		}
		this._setValue(radioButton);
		radioGroup.fireEvent("onValueChange", radioGroup, {});
	},
	post: function(force: any, silent: any) {
		let modified = this._lastPost !== this._value;
		if (!force && !modified) {
			return true;
		}
		let lastPost = this._lastPost;
		try {
			this._lastPost = this._value;
			let eventArg = { processDefault: true };
			this.fireEvent("beforePost", this, eventArg);
			if (eventArg.processDefault === false) {
				return false;
			}
			if (this.doPost) {
				this.doPost();
			}
			this.fireEvent("onPost", this);
			return true;
		} catch (e) {
			this._lastPost = lastPost;
			let eventArg = { exception: e, processDefault: true };
			this.fireEvent("onPostFailed", this, eventArg);
			if (eventArg.processDefault && !silent) {
				dorado.Exception.processException(e);
			} else {
				dorado.Exception.removeException(e);
			}
			return false;
		}
	},
	createDom: function() {
		let radioGroup = this,
			layout = radioGroup._layout,
			radioButtons = radioGroup._radioButtons;
		let dom = $DomUtils.xCreate({
			tagName: "div",
			className: radioGroup._className,
		});
		if (radioButtons) {
			for (let i = 0, j = radioButtons.length; i < j; i++) {
				let radioButton = radioButtons[i];
				radioButton._radioGroup = radioGroup;
				if (radioButton._value === radioGroup._value) {
					radioGroup.currentRadioButton = radioButton;
					radioButton._checked = true;
				}
				radioButton.render(dom);
			}
		}
		return dom;
	},
	refreshDom: function(dom: any) {
		$invokeSuper.call(this, arguments);
		this.refreshExternalReadOnly();
		let group = this,
			layout = group._layout,
			radioButtonsRebuilded = false;
		if (group._dataSet) {
			let value, dirty;
			if (group._property) {
				let bindingInfo = group._bindingInfo;
				if (bindingInfo.entity instanceof dorado.Entity) {
					value = bindingInfo.entity.get(group._property);
					dirty = bindingInfo.entity.isDirty(group._property);
				}
				if (!group._dontGenerateButtons && bindingInfo.propertyDef) {
					let oldMapping = group._propertyDefMapping,
						mapping = bindingInfo.propertyDef._mapping;
					if ((oldMapping || mapping) && oldMapping !== mapping) {
						let radioButtons = [];
						if (mapping) {
							group._propertyDefMapping = mapping;
							for (let i = 0; i < mapping.length; i++) {
								let item = mapping[i];
								radioButtons.push({ value: item.key, text: item.value });
							}
						}
						if (radioButtons) {
							group.set("radioButtons", radioButtons);
							group._dontGenerateButtons = false;
							radioButtonsRebuilded = true;
						}
					}
				}
			}
			group.setValue(value);
			group._lastPost = value;
			group.setDirty(dirty);
		}
		if (layout === "flow" || layout === "grid") {
			$fly(dom).addClass(group._className + "-flow");
		} else {
			$fly(dom).removeClass(group._className + "-flow");
		}
		if (!radioButtonsRebuilded) {
			let radioButtons = group._radioButtons;
			if (radioButtons) {
				for (let i = 0, j = radioButtons.length; i < j; i++) {
					radioButtons[i].refresh();
				}
			}
		}
	},
	doOnResize: function() {
		let group = this,
			radioButtons = group._radioButtons,
			layout = group._layout,
			columnCount = group._columnCount || 3;
		if (radioButtons) {
			if (layout === "grid") {
				let width = $fly(group._dom).width(),
					averageWidth = Math.floor(width / columnCount);
				for (let i = 0, j = radioButtons.length; i < j; i++) {
					let radioButton = radioButtons[i];
					radioButton._width = averageWidth;
					radioButton.resetDimension();
				}
			} else {
				for (let i = 0, j = radioButtons.length; i < j; i++) {
					let radioButton = radioButtons[i];
					radioButton._width = "auto";
					radioButton.resetDimension();
				}
			}
		}
		$invokeSuper.call(this, arguments);
	},
	doOnKeyDown: function(event: any) {
		if (event.ctrlKey) {
			return true;
		}
		let group = this,
			radioButtons = group._radioButtons,
			currentRadioButton = group.currentRadioButton,
			currentButtonIndex = currentRadioButton
				? radioButtons.indexOf(currentRadioButton)
				: -1,
			buttonCount = radioButtons.length,
			newIndex,
			newRadioButton,
			retValue = true;
		switch (event.keyCode) {
			case 38:
			case 37:
				if (currentButtonIndex === 0) {
					newIndex = buttonCount - 1;
				} else {
					if (currentButtonIndex > 0 && currentButtonIndex < buttonCount) {
						newIndex = currentButtonIndex - 1;
					} else {
						newIndex = 0;
					}
				}
				retValue = false;
				break;
			case 39:
			case 40:
				if (currentButtonIndex >= 0 && currentButtonIndex < buttonCount - 1) {
					newIndex = currentButtonIndex + 1;
				} else {
					newIndex = 0;
				}
				retValue = false;
				break;
		}
		newRadioButton = radioButtons[newIndex];
		if (newRadioButton) {
			group._valueChange(newRadioButton);
		}
		return retValue;
	},
});
(function() {
	function isInputOrTextArea(dom: any) {
		return ["input", "textarea"].indexOf(dom.tagName.toLowerCase()) >= 0;
	}
	let attributesRelativeWithTrigger = [
		"dataSet",
		"dataType",
		"dataPath",
		"property",
	];
	dorado.widget.editor.PostException = $extend(dorado.Exception, {
		$className: "dorado.widget.editor.PostException",
		constructor: function(messages: any) {
			$invokeSuper.call(this, [dorado.Toolkits.getTopMessage(messages).text]);
			this.messages = messages;
		},
	});
	dorado.widget.AbstractTextBox = $extend(dorado.widget.AbstractDataEditor, {
		$className: "dorado.widget.AbstractTextBox",
		_triggerChanged: true,
		_realEditable: true,
		ATTRIBUTES: {
			className: { defaultValue: "d-text-box" },
			text: {
				skipRefresh: true,
				getter: function() {
					return this.doGetText();
				},
				setter: function(text: any) {
					this.doSetText(text);
				},
			},
			value: {
				skipRefresh: true,
				getter: function() {
					let text = this.doGetText();
					if (this._value !== undefined && text === this._valueText) {
						return this._value;
					} else {
						if (text === undefined) {
							text = null;
						}
						return text;
					}
				},
				setter: function(value: any) {
					this._value = value;
					let text = (this._valueText = dorado.$String.toText(value));
					this.doSetText(text);
				},
			},
			editable: { defaultValue: true },
			readOnly: {},
			modified: {
				getter: function() {
					return this._focused ? this._valueText !== this.get("text") : false;
				},
			},
			validationState: { readOnly: true, defaultValue: "none" },
			validationMessages: { readOnly: true },
			trigger: {
				skipRefresh: true,
				componentReference: true,
				setter: function(v: any) {
					if (v instanceof Array && v.length === 0) {
						v = null;
					}
					this._trigger = v;
					if (this._rendered && this.isActualVisible()) {
						this.refreshTriggerDoms();
					} else {
						this._triggerChanged = true;
					}
				},
			},
		},
		EVENTS: { onTextEdit: {}, onTriggerClick: {}, onValidationStateChange: {} },
		doSet: function(attr: any, value: any, skipUnknownAttribute: any, lockWritingTimes: any) {
			if (attributesRelativeWithTrigger.indexOf(attr) >= 0) {
				this._triggerChanged = true;
			}
			return $invokeSuper.call(this, [
				attr,
				value,
				skipUnknownAttribute,
				lockWritingTimes,
			]);
		},
		createDom: function() {
			let textDom = (this._textDom = this.createTextDom());
			textDom.style.width = "100%";
			textDom.style.height = "100%";
			let dom = $DomUtils.xCreate({
				tagName: "div",
				content: {
					tagName: "div",
					className: "editor-wrapper",
					content: textDom,
				},
			});
			this._editorWrapper = dom.firstChild;
			let self = this;
			jQuery(dom)
				.addClassOnHover(this._className + "-hover", null, function() {
					return !self._realReadOnly;
				})
				.mousedown(function(evt: any) {
					evt.stopPropagation();
				});
			if (this._text) {
				this.doSetText(this._text);
			}
			return dom;
		},
		refreshTriggerDoms: function() {
			let triggerButtons = this._triggerButtons,
				triggerButton;
			if (triggerButtons) {
				for (let i = 0; i < triggerButtons.length; i++) {
					triggerButton = triggerButtons[i];
					triggerButton.destroy();
				}
			}
			let triggerWidth = $setting["widget.TextEditor.triggerWidth"] || 18;
			let triggersWidth = 0;
			let triggers = this.get("trigger");
			if (triggers) {
				if (!(triggers instanceof Array)) {
					triggers = [triggers];
				}
				this._triggerButtons = triggerButtons = [];
				for (let i = triggers.length - 1, trigger; i >= 0; i--) {
					trigger = triggers[i];
					triggerButton = trigger.createTriggerButton(this);
					if (triggerButton) {
						triggerButtons.push(triggerButton);
						this.registerInnerControl(triggerButton);
						triggerButton.set("style", "right:" + triggersWidth + "px");
						triggerButton.render(this._dom);
						triggersWidth += triggerWidth;
					}
				}
			}
		},
		getTriggerButton: function(trigger: any) {
			let triggerButtons = this._triggerButtons,
				triggerButton;
			if (triggerButtons) {
				for (let i = 0; i < triggerButtons.length; i++) {
					triggerButton = triggerButtons[i];
					if (triggerButton._trigger === trigger) {
						return triggerButton;
					}
				}
			}
		},
		refreshDom: function(dom: any) {
			$invokeSuper.call(this, [dom]);
			this.refreshExternalReadOnly();
			this.resetReadOnly();
			if (this._dataSet) {
				let value,
					dirty,
					timestamp = 0;
				this._entity = null;
				if (this._property) {
					let bindingInfo = this._bindingInfo,
						state,
						messages;
					if (bindingInfo.propertyDef && this._initBindingProperties) {
						this._initBindingProperties(bindingInfo.propertyDef);
					}
					timestamp = bindingInfo.timestamp;
					if (bindingInfo.entity instanceof dorado.Entity) {
						let e = (this._entity = bindingInfo.entity);
						if (this._dataType) {
							value = e.get(this._property);
						} else {
							value = e.getText(this._property);
						}
						dirty = e.isDirty(this._property);
						state = e.getMessageState(this._property);
						messages = e.getMessages(this._property);
					}
					if (timestamp !== this.timestamp) {
						this.set("value", value);
						if (this._editorFocused) {
							this._lastPost = this._lastEdit = this.get("text");
						}
					}
					this.setValidationState(state, messages);
					this.setDirty(dirty);
				}
			}
			if (this._triggerChanged) {
				this._triggerChanged = false;
				this.refreshTriggerDoms();
			}
		},
		validate: function(text: any) {
			if (this._skipValidate) {
				return null;
			}
			if (this.doValidate) {
				return this.doValidate(text);
			}
		},
		setValidationState: function(state: any, messages: any) {
			state = state || "none";
			if (this._validationState === state) {
				return;
			}
			this._validationState = state;
			this._validationMessages = dorado.Toolkits.trimMessages(
				messages,
				"error",
			);
			if (this._dom) {
				let dom = this._dom,
					warnCls = this._className + "-warn",
					errorCls = this._className + "-error";
				$fly(dom)
					.toggleClass(warnCls, state === "warn")
					.toggleClass(errorCls, state === "error");
				if (dorado.TipManager) {
					if ((state === "warn" || state === "error") && messages) {
						let message = dorado.Toolkits.getTopMessage(messages);
						dorado.TipManager.initTip(dom, { text: message.text });
					} else {
						dorado.TipManager.deleteTip(dom);
					}
				}
			}
			this.fireEvent("onValidationStateChange", this);
		},
		onMouseDown: function() {
			if (this._realReadOnly) {
				return;
			}
			let triggers = this.get("trigger");
			if (triggers) {
				if (!(triggers instanceof Array)) {
					triggers = [triggers];
				}
				let self = this;
				jQuery.each(triggers, function(i: any, trigger: any) {
					if (trigger.onEditorMouseDown) {
						trigger.onEditorMouseDown(self);
					}
				});
			}
		},
		doSetFocus: function() {},
		doOnFocus: function() {
			if (this._realReadOnly) {
				return;
			}
			if (!dorado.Browser.isTouch && this._textDom) {
				try {
					this._textDom.focus();
				} catch (e) {}
			}
			this._lastPost = this._lastEdit = this.get("text");
			this._editorFocused = true;
			if (this._useBlankText) {
				this.doSetText("");
			}
			dorado.Toolkits.setDelayedAction(
				this,
				"$editObserverTimerId",
				function() {
					let text = this.get("text");
					if (this._lastEdit !== text) {
						this._lastEdit = text;
						this.textEdited();
					}
					dorado.Toolkits.setDelayedAction(
						this,
						"$editObserverTimerId",
						arguments.callee,
						50,
					);
				},
				50,
			);
			let triggers = this.get("trigger");
			if (triggers) {
				if (!(triggers instanceof Array)) {
					triggers = [triggers];
				}
				for (let i = 0; i < triggers.length; i++) {
					let trigger = triggers[i];
					if (trigger.onEditorFocus) {
						trigger.onEditorFocus(this);
					}
				}
			}
		},
		doOnBlur: function() {
			if (this._realReadOnly) {
				return;
			}
			dorado.Toolkits.cancelDelayedAction(this, "$editObserverTimerId");
			if (!this._duringRefreshDom) {
				this.post();
			}
			delete this._lastPost;
			delete this._lastEdit;
			this._editorFocused = false;
			if (this._blankText) {
				this.doSetText(this.doGetText());
			}
		},
		resetReadOnly: function() {
			let readOnly = !!(this._readOnly || this._readOnly2);
			this._realReadOnly = readOnly;
			$fly(this.getDom()).toggleClass(
				"d-readonly " + this._className + "-readonly",
				readOnly,
			);
			if (readOnly && !this._realEditable === readOnly) {
				return;
			}
			let textDomReadOnly = true;
			if (!readOnly && this._editable) {
				let realEditable = true;
				if (isInputOrTextArea(this._textDom)) {
					let triggers = this.get("trigger"),
						realEditable = true;
					if (triggers && !(triggers instanceof Array)) {
						triggers = [triggers];
					}
					if (triggers) {
						for (let i = 0; i < triggers.length; i++) {
							let trigger = triggers[i];
							if (!trigger.get("editable")) {
								realEditable = false;
								break;
							}
						}
					}
				}
				textDomReadOnly = !realEditable;
			}
			this._realEditable = !textDomReadOnly;
			this._textDom.readOnly = textDomReadOnly;
		},
		onTriggerClick: function(trigger: any) {
			if (this._realReadOnly) {
				return;
			}
			let eventArg = { processDefault: true };
			this.fireEvent("onTriggerClick", this, eventArg);
			if (eventArg.processDefault) {
				trigger.execute(this);
			}
			if (!dorado.Browser.isTouch) {
				$setTimeout(
					this,
					function() {
						try {
							this._textDom.focus();
						} catch (e) {}
					},
					0,
				);
			} else {
				this._editorFocused = true;
			}
		},
		doOnKeyDown: function(evt: any) {
			function forwardKeyDownEvent(trigger: any, editor: any) {
				if (trigger) {
					if (trigger instanceof Array) {
						for (let i = 0; i < trigger.length; i++) {
							let t = trigger[i];
							if (t.onEditorKeyDown) {
								let result = t.onEditorKeyDown(editor, evt);
								if (result === false) {
									return false;
								} else {
									if (!result) {
										break;
									}
								}
							}
						}
					} else {
						if (trigger.onEditorKeyDown) {
							if (trigger.onEditorKeyDown(editor, evt) === false) {
								return false;
							}
						}
					}
				}
				return true;
			}
			let retValue = true,
				trigger = this.get("trigger"),
				firstTrigger;
			if (trigger) {
				firstTrigger = trigger instanceof Array ? trigger[0] : trigger;
			}
			switch (evt.keyCode) {
				case 36:
				case 35:
				case 38:
				case 27:
					retValue = forwardKeyDownEvent(trigger, this);
					break;
				case 40:
					retValue = forwardKeyDownEvent(trigger, this);
					if (retValue && evt.altKey && firstTrigger) {
						this.onTriggerClick(firstTrigger);
						retValue = false;
					}
					break;
				case 118:
					retValue = forwardKeyDownEvent(trigger, this);
					if (retValue && firstTrigger) {
						this.onTriggerClick(firstTrigger);
						retValue = false;
					}
					break;
				case 8:
					if (firstTrigger && firstTrigger._autoOpen) {
						if (!firstTrigger.get("opened")) {
							this.onTriggerClick(firstTrigger);
						}
						retValue = forwardKeyDownEvent(trigger, this);
					}
					break;
				case 13:
					retValue = forwardKeyDownEvent(trigger, this);
					if (retValue) {
						let b = this.post();
						retValue = b === true || b == null;
					}
					break;
				default:
					retValue = forwardKeyDownEvent(trigger, this);
			}
			return retValue;
		},
		textEdited: function() {
			this.fireEvent("onTextEdit", this);
			if (
				this._dataSet &&
				this._entity &&
				this._property &&
				!this._entity.isDirty()
			) {
				this._entity.setState(dorado.Entity.STATE_MODIFIED);
			}
		},
		setDirty: function(dirty: any) {
			if (!this._supportsDirtyFlag) {
				return;
			}
			if (!dorado.Browser.isTouch) {
				let dirtyFlag = this._dirtyFlag;
				if (dirty) {
					if (!dirtyFlag) {
						this._dirtyFlag = dirtyFlag = $DomUtils.xCreate({
							tagName: "LABEL",
							className: "d-dirty-flag",
						});
						this._dom.appendChild(dirtyFlag);
					}
					dirtyFlag.style.display = "";
				} else {
					if (dirtyFlag) {
						dirtyFlag.style.display = "none";
					}
				}
			} else {
				$invokeSuper.call(this, [dirty]);
			}
		},
		post: function(force: any, silent: any) {
			if (!this._editorFocused && !force) {
				return false;
			}
			try {
				let text = this.get("text"),
					state,
					result,
					modified = this._lastPost !== text,
					validationResults;
				if (
					force ||
					modified ||
					(this._validationState === "none" && text === "")
				) {
					this._lastPost = text;
					let eventArg = { processDefault: true };
					if (force || modified) {
						this.fireEvent("beforePost", this, eventArg);
					}
					if (eventArg.processDefault === false) {
						return false;
					}
					validationResults = this.validate(text);
					if (validationResults) {
						let topValidationResult =
							dorado.Toolkits.getTopMessage(validationResults);
						if (topValidationResult) {
							state = topValidationResult.state;
							if (state === "error") {
								this.cancel();
								dorado.Exception.processException(
									new dorado.widget.editor.PostException(validationResults),
								);
								return false;
							}
						}
					}
					if (force || modified) {
						this.doPost();
						this.fireEvent("onPost", this);
						result = true;
					}
				}
				if (result) {
					this.setValidationState(state, validationResults);
				}
				return result;
			} catch (e) {
				if (e instanceof dorado.widget.editor.PostException) {
					this.setValidationState("error", e.messages);
				}
				let eventArg = { exception: e, processDefault: true };
				this.fireEvent("onPostFailed", this, eventArg);
				if (eventArg.processDefault && !silent) {
					dorado.Exception.processException(e);
				} else {
					dorado.Exception.removeException(e);
				}
				return false;
			}
		},
	});
	dorado.widget.AbstractTextEditor = $extend(dorado.widget.AbstractTextBox, {
		$className: "dorado.widget.AbstractTextEditor",
		ATTRIBUTES: {
			value: {
				skipRefresh: true,
				getter: function() {
					let text = this.doGetText();
					if (this._value !== undefined && text === this._valueText) {
						return this._value;
					} else {
						if (text === undefined) {
							text = null;
						}
						return text;
					}
				},
				setter: function(value: any) {
					this._value = value;
					let text = dorado.$String.toText(value);
					this._skipValidateEmpty = true;
					this.validate(text);
					this._text = this._valueText = text;
					this.doSetText(text);
					this.setValidationState(null);
				},
			},
			text: {
				skipRefresh: true,
				setter: function(text: any) {
					this.validate(text);
					this._text = text;
					this.doSetText(text);
					this.setValidationState(null);
				},
			},
			blankText: {},
			required: {},
			minLength: { skipRefresh: true },
			maxLength: { skipRefresh: true },
			selectTextOnFocus: { defaultValue: !dorado.Browser.isTouch },
			validators: {
				setter: function(value: any) {
					let validators = [];
					for (let i = 0; i < value.length; i++) {
						let v = value[i];
						if (!(v instanceof dorado.validator.Validator)) {
							v = dorado.Toolkits.createInstance(
								"validator",
								v,
								function(type: any) {
									return dorado.util.Common.getClassType(
										"dorado.validator." + type + "Validator",
										true,
									);
								},
							);
						}
						validators.push(v);
					}
					this._validators = validators;
				},
			},
		},
		createDom: function() {
			let text = this._text,
				dom = $invokeSuper.call(this);
			if (!text) {
				this.doSetText("");
			}
			return dom;
		},
		doGetText: function() {
			if (this._useBlankText) {
				return "";
			}
			return this._textDom ? this._textDom.value : this._text;
		},
		doSetText: function(text: any) {
			this._useBlankText = !this._focused && text === "" && this._blankText;
			if (this._textDom) {
				if (this._useBlankText) {
					if (
						dorado.Browser.msie &&
						dorado.Browser.version < 9 &&
						this._textDom.getAttribute("type") === "password"
					) {
						this._useBlankText = false;
					} else {
						text = this._blankText;
					}
				}
				$fly(this._textDom).toggleClass("blank-text", !!this._useBlankText);
				if (
					this._useBlankText &&
					this._textDom.getAttribute("type") === "password"
				) {
					this._textDom.setAttribute("type", "");
					this._isPassword = true;
				} else {
					if (!this._useBlankText && this._isPassword) {
						this._textDom.setAttribute("type", "password");
						delete this._isPassword;
					}
				}
				this._textDom.value = text || "";
			} else {
				this._text = text;
			}
		},
		doValidate: function(text: any) {
			let validationResults = [];
			let skipValidateEmpty = this._skipValidateEmpty;
			this._skipValidateEmpty = false;
			if (!skipValidateEmpty && this._required && jQuery.trim(text) === "") {
				validationResults.push({
					state: "error",
					text: $resource("dorado.data.ErrorContentRequired"),
				});
			}
			if (text.length) {
				let validator = $singleton(dorado.validator.LengthValidator);
				validator.set({
					minLength: this._minLength,
					maxLength: this._maxLength,
				});
				let results = validator.validate(text);
				if (results) {
					validationResults = validationResults.concat(results);
				}
				if (this._validators) {
					jQuery.each(this._validators, function(i: any, validator: any) {
						results = validator.validate(text);
						if (results) {
							validationResults = validationResults.concat(results);
						}
					});
				}
			}
			return validationResults;
		},
		doRefreshData: function() {
			let p = this._property,
				e = this._entity;
			if (e instanceof dorado.Entity) {
				if (this._dataType) {
					this.set("value", e.get(p));
				} else {
					this.set("text", e.getText(p));
				}
			} else {
				this.set("value", e[p]);
			}
			this.setDirty(false);
		},
		doPost: function() {
			let p = this._property,
				e = this._entity;
			if (!p || !e) {
				return false;
			}
			if (this._dataSet) {
				let bindingInfo = this.getBindingInfo();
				if (this._mapping) {
					e.set(p, this.get("value"));
				} else {
					if (bindingInfo.propertyDef && bindingInfo.propertyDef._mapping) {
						e.setText(p, this.get("value"));
					} else {
						if (bindingInfo.dataType) {
							if (this._dataType === bindingInfo.dataType) {
								e.set(p, this.get("value"));
							} else {
								e.setText(p, this.get("text"));
							}
						} else {
							e.set(p, this.get("value"));
						}
					}
				}
			} else {
				if (e instanceof dorado.Entity) {
					let v = this.get("value");
					if (v instanceof dorado.Entity) {
						e.set(p, v);
					} else {
						e.setText(p, this.get("text"));
					}
					this.setDirty(e.isDirty(p));
				} else {
					e[p] = this.get("value");
					this.setDirty(true);
				}
			}
			return true;
		},
		doSetFocus: function() {
			$invokeSuper.call(this);
			if (this._selectTextOnFocus && this._realEditable) {
				if (this.get("focused") && this._editorFocused) {
					if (dorado.Browser.isTouch) {
						let input = this._textDom;
						setTimeout(function() {
							input.selectionStart = 0;
							input.selectionEnd = $fly(input).val().length;
						}, 100);
					} else {
						try {
							this._textDom.select();
						} catch (e) {}
					}
				}
			}
		},
	});
	dorado.widget.TextEditor = $extend(dorado.widget.AbstractTextEditor, {
		$className: "dorado.widget.TextEditor",
		ATTRIBUTES: {
			width: { defaultValue: 150 },
			height: { independent: true, readOnly: true },
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
							index[key + ""] = mapping[i].value || null;
						}
					} else {
						delete this._mappingIndex;
					}
					delete this._mappingRevIndex;
				},
			},
			value: {
				skipRefresh: true,
				getter: function() {
					let text = this._editorFocused ? this.doGetText() : this._text;
					if (this._value !== undefined && text === this._valueText) {
						return this._value;
					} else {
						if (text && this._mapping) {
							text = this.getMappedKey(text);
						}
						if (text === undefined) {
							text = null;
						}
						let dataType = this.get("dataType");
						if (dataType) {
							try {
								let value = (this._value = dataType.parse(
									text,
									this._editorFocused ? this._typeFormat : this._displayFormat,
								));
								this._valueText = text;
								return value;
							} catch (e) {
								dorado.Exception.removeException(e);
								return null;
							}
						} else {
							return text;
						}
					}
				},
				setter: function(value: any) {
					this._value = value;
					let valueText, text;
					let dataType = this.get("dataType");
					if (dataType) {
						text = dataType.toText(
							value,
							this._editorFocused ? this._typeFormat : this._displayFormat,
						);
						valueText = dataType.toText(value, this._typeFormat);
					} else {
						valueText = text = dorado.$String.toText(value);
					}
					if (text && this._mapping) {
						text = this.getMappedValue(text);
					}
					this._skipValidateEmpty = true;
					this.validate(valueText);
					this._valueText = valueText;
					this._text = text;
					this.doSetText(text);
					this.setValidationState(null);
				},
			},
			text: {
				skipRefresh: true,
				getter: function() {
					return (
						(!this.get("dataType") || this._editorFocused
							? this.doGetText()
							: this._text) || ""
					);
				},
				setter: function(text: any) {
					let t = text;
					let dataType = this.get("dataType");
					if (dataType) {
						try {
							if (!this._editorFocused) {
								let value = dataType.parse(t, this._typeFormat);
								t = dataType.toText(value, this._displayFormat);
							}
						} catch (e) {}
					}
					this.validate(t);
					this._text = text;
					this.doSetText(t);
					this.setValidationState(null);
				},
			},
			dataType: {
				getter: function() {
					let dataType;
					if (this._dataType) {
						dataType = dorado.LazyLoadDataType.dataTypeGetter.call(this);
					} else {
						if (this._property && this._dataSet) {
							let bindingInfo = this._bindingInfo || this.getBindingInfo();
							if (
								bindingInfo &&
								!(bindingInfo.propertyDef && bindingInfo.propertyDef._mapping)
							) {
								dataType = bindingInfo.dataType;
							}
						}
					}
					return dataType;
				},
			},
			password: {},
			displayFormat: {},
			typeFormat: { skipRefresh: true },
			modified: {
				getter: function() {
					return this._editorFocused
						? this._lastPost === this.doGetText()
						: false;
				},
			},
			trigger: {
				getter: function(p: any, v: any) {
					let trigger = this._trigger;
					if (trigger === undefined && this._view) {
						let dataType = this.get("dataType"),
							dtCode = dataType ? dataType._code : 0;
						if (dtCode === dorado.DataType.DATE) {
							trigger = this._view.id("defaultDateDropDown");
						} else {
							if (dtCode === dorado.DataType.DATETIME) {
								trigger = this._view.id("defaultDateTimeDropDown");
							}
						}
					}
					return trigger;
				},
			},
		},
		createTextDom: function() {
			let textDom = document.createElement("INPUT");
			textDom.className = "editor";
			if (this._password) {
				textDom.type = "password";
			} else {
				let dataType = this.get("dataType");
				if (
					dataType &&
					dataType.code >= dorado.DataType.PRIMITIVE_INT &&
					dataType.code <= dorado.DataType.FLOAT
				) {
					textDom.type = "number";
				}
			}
			if (dorado.Browser.msie && dorado.Browser.version > 7) {
				textDom.style.top = 0;
				textDom.style.position = "absolute";
			} else {
				textDom.style.padding = 0;
			}
			if (dorado.Browser.isTouch) {
				textDom.setAttribute("form", dorado.widget.editor.GET_DEAMON_FORM().id);
			}
			return textDom;
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
		doValidate: function(text: any) {
			let validationResults = [];
			try {
				if (text.length) {
					if (this._mapping && this.getMappedKey(text) === undefined) {
						validationResults.push({
							state: "error",
							text: $resource("dorado.form.InputTextOutOfMapping"),
						});
					}
				}
				let dataType = this._dataType;
				if (dataType) {
					dataType.parse(text, this._typeFormat);
				}
				validationResults = $invokeSuper.call(this, [text]);
			} catch (e) {
				dorado.Exception.removeException(e);
				validationResults = [
					{ state: "error", text: dorado.Exception.getExceptionMessage(e) },
				];
			}
			return validationResults;
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
		doOnFocus: function() {
			let maxLength = this._maxLength || 0;
			if (!this._realReadOnly && !this._mapping) {
				let dataType = this.get("dataType");
				if (dataType) {
					if (
						this._validationState !== "error" &&
						this._valueText !== undefined
					) {
						this.doSetText(this._valueText);
					}
					let dCode = dataType._code;
					if (
						dCode === dorado.DataType.PRIMITIVE_CHAR ||
						dCode === dorado.DataType.CHARACTER
					) {
						maxLength = 1;
					}
				}
			}
			if (maxLength) {
				this._textDom.setAttribute("maxLength", maxLength);
			} else {
				this._textDom.removeAttribute("maxLength");
			}
			$invokeSuper.call(this);
		},
		doOnBlur: function() {
			if (this._realReadOnly) {
				$invokeSuper.call(this);
			} else {
				this._text = this.doGetText();
				try {
					$invokeSuper.call(this);
				} finally {
					let text,
						dataType = this.get("dataType");
					if (dataType && !this._mapping && this._validationState !== "error") {
						text = dataType.toText(this.get("value"), this._displayFormat);
					} else {
						text = this._text;
					}
					this.doSetText(text);
				}
			}
		},
		doOnKeyPress: function(evt: any) {
			let dataType = this.get("dataType");
			if (!dataType) {
				return true;
			}
			let k = evt.keyCode || evt.which;
			if (dorado.Browser.mozilla) {
				if ([8, 37, 38, 39, 40].indexOf(k) >= 0) {
					return true;
				}
			}
			let b = true,
				$d = dorado.DataType;
			switch (dataType._code) {
				case $d.INTEGER:
				case $d.PRIMITIVE_INT:
					b = k === 44 || k === 45 || (k >= 48 && k <= 57);
					break;
				case $d.FLOAT:
				case $d.PRIMITIVE_FLOAT:
					b = k === 44 || k === 45 || k === 46 || (k >= 48 && k <= 57);
					break;
			}
			return b;
		},
	});
	dorado.widget.PasswordEditor = $extend(dorado.widget.AbstractTextEditor, {
		$className: "dorado.widget.PasswordEditor",
		ATTRIBUTES: {
			width: { defaultValue: 150 },
			height: { independent: true, readOnly: true },
		},
		createTextDom: function() {
			let textDom = document.createElement("INPUT");
			textDom.className = "editor";
			textDom.type = "password";
			if (dorado.Browser.msie && dorado.Browser.version > 7) {
				textDom.style.top = 0;
				textDom.style.position = "absolute";
			} else {
				textDom.style.padding = 0;
			}
			return textDom;
		},
		doOnFocus: function() {
			let maxLength = this._maxLength || 0;
			if (maxLength) {
				this._textDom.setAttribute("maxLength", maxLength);
			} else {
				this._textDom.removeAttribute("maxLength");
			}
			$invokeSuper.call(this);
		},
	});
})();
(function() {
	dorado.widget.TextArea = $extend(dorado.widget.AbstractTextEditor, {
		$className: "dorado.widget.TextArea",
		ATTRIBUTES: {
			width: { independent: false, defaultValue: 150 },
			height: { independent: false, defaultValue: 60 },
			className: { defaultValue: "d-text-area" },
			selectTextOnFocus: { defaultValue: false },
		},
		createDom: function() {
			let doms = (this._doms = {});
			let dom = $DomUtils.xCreate(
				{
					tagName: "DIV",
					style: {
						position: "relative",
						whiteSpace: "nowrap",
						overflow: "hidden",
					},
					content: {
						tagName: "DIV",
						contextKey: "textDomWrapper",
						style: { width: "100%", height: "100%" },
						content: {
							tagName: "TEXTAREA",
							contextKey: "textDom",
							className: "textarea",
							style: { width: "100%", height: "100%", whiteSpace: "pre-wrap" },
						},
					},
				},
				null,
				doms,
			);
			this._textDomWrapper = doms.textDomWrapper;
			this._textDom = doms.textDom;
			let self = this;
			jQuery(dom)
				.addClassOnHover(this._className + "-hover", null, function() {
					return !self._realReadOnly;
				})
				.mousedown(function(evt: any) {
					evt.stopPropagation();
				});
			if (this._text) {
				this.doSetText(this._text);
			}
			if (!dorado.Browser.isTouch) {
				this._modernScroller = $DomUtils.modernScroll(this._textDom, {
					listenContentSize: true,
				});
			}
			if (dorado.Browser.msie && dorado.Browser.version < 8) {
				this.doOnAttachToDocument = this.doOnResize;
			}
			return dom;
		},
		doOnAttachToDocument: function() {
			$invokeSuper.call(this);
			let textarea = this;
			if (dorado.Browser.isTouch) {
				if (dorado.Browser.android && dorado.Browser.chrome) {
					$fly(textarea._textDom).css("overflow", "hidden");
				}
				textarea._modernScroller = $DomUtils.modernScroll(
					textarea._textDom.parentNode,
					{
						updateBeforeScroll: true,
						scrollSize: function(dir: any, container: any, content: any) {
							return dir === "h" ? content.scrollWidth : content.scrollHeight;
						},
						render: function(left: any, top: any) {
							if (this.content && !this._renderScrollAttr) {
								this.content.scrollTop = top;
								this.content.scrollLeft = left;
							}
						},
						autoHide: false,
						bouncing: false,
					},
				);
				$fly(textarea._textDom)
					.bind("scroll", function() {
						textarea._modernScroller._renderScrollAttr = true;
						textarea._modernScroller.update();
						textarea._modernScroller.scrollTo(
							this.scrollLeft,
							this.scrollTop,
							false,
						);
						textarea._modernScroller._renderScrollAttr = false;
					})
					.bind("focus", function() {
						textarea._modernScroller.showScrollbar();
					})
					.bind("blur", function() {
						textarea._modernScroller.hideScrollbar();
					});
			}
		},
		refreshTriggerDoms: function() {
			let triggerButtons = this._triggerButtons,
				triggerButton,
				triggerPanel = this._triggerPanel;
			if (triggerButtons && triggerPanel) {
				for (let i = 0; i < triggerButtons.length; i++) {
					triggerButton = triggerButtons[i];
					triggerButton.destroy();
				}
			}
			let triggers = this.get("trigger");
			if (triggers) {
				if (!triggerPanel) {
					triggerPanel = this._triggerPanel = $create("DIV");
					triggerPanel.className = "d-trigger-panel";
					this._dom.appendChild(triggerPanel);
				}
				triggerPanel.style.display = "";
				if (!(triggers instanceof Array)) {
					triggers = [triggers];
				}
				let trigger;
				this._triggerButtons = triggerButtons = [];
				for (let i = 0; i < triggers.length; i++) {
					trigger = triggers[i];
					triggerButton = trigger.createTriggerButton(this);
					triggerButtons.push(triggerButton);
					this.registerInnerControl(triggerButton);
					triggerButton.render(triggerPanel);
				}
				this._triggersArranged = false;
				this.doOnResize = this.resizeTextDom;
				this.resizeTextDom();
			} else {
				if (triggerPanel) {
					triggerPanel.style.display = "none";
				}
				if (dorado.Browser.msie && dorado.Browser.version < 9) {
					this.doOnResize = this.resizeTextDom;
					this.resizeTextDom();
				} else {
					this._textDomWrapper.style.width = "100%";
					delete this.doOnResize;
				}
			}
		},
		resizeTextDom: function() {
			if (!this._attached || !this.isActualVisible()) {
				return;
			}
			let w = this._dom.clientWidth,
				h = this._dom.clientHeight;
			if (this._triggerPanel) {
				w -= this._triggerPanel.offsetWidth;
			}
			if (w > 0 && h > 0) {
				this._textDomWrapper.style.width = w + "px";
				this._textDomWrapper.style.height = h + "px";
				if (dorado.Browser.msie && dorado.Browser.version < 8) {
					this._textDom.style.height = h + "px";
				}
			}
		},
		doOnKeyDown: function(evt: any) {
			if (evt.ctrlKey) {
				return true;
			}
			if (evt.keyCode === 13) {
				return;
			}
			return $invokeSuper.call(this, arguments);
		},
		doOnFocus: function() {
			if (this._useBlankText) {
				this.doSetText("");
			}
			let maxLength = this._maxLength || 0;
			if (maxLength) {
				this._textDom.setAttribute("maxLength", maxLength);
			} else {
				this._textDom.removeAttribute("maxLength");
			}
			$invokeSuper.call(this, arguments);
		},
		doOnBlur: function() {
			if (this._realReadOnly) {
				return;
			}
			try {
				$invokeSuper.call(this, arguments);
			} finally {
				this.doSetText(this.doGetText());
			}
		},
	});
})();
dorado.widget.Trigger = $extend(dorado.widget.Component, {
	$className: "dorado.widget.Trigger",
	ATTRIBUTES: {
		className: { defaultValue: "d-trigger", writeBeforeReady: true },
		exClassName: {
			skipRefresh: true,
			setter: function(v: any) {
				if (this._rendered && this._exClassName) {
					$fly(this.getDom()).removeClass(this._exClassName);
				}
				this._exClassName = v;
				if (this._rendered && v) {
					$fly(this.getDom()).addClass(v);
				}
			},
		},
		icon: { writeBeforeReady: true },
		iconClass: {
			writeBeforeReady: true,
			defaultValue: "d-trigger-icon-custom",
		},
		editable: { defaultValue: true },
		buttonVisible: { defaultValue: true },
	},
	EVENTS: { beforeExecute: {}, onExecute: {} },
	createTriggerButton: function(editor: any) {
		let trigger = this;
		if (!trigger._buttonVisible) {
			return;
		}
		let control = new dorado.widget.SimpleIconButton({
			exClassName:
				(trigger._className || "") + " " + (trigger._exClassName || ""),
			icon: trigger._icon,
			iconClass: trigger._icon ? null : trigger._iconClass,
			onMouseDown: function(self: any, arg: any) {
				dorado.widget.setFocusedControl(self);
				arg.returnValue = false;
			},
			onClick: function(self: any, arg: any) {
				editor.onTriggerClick(trigger);
				arg.returnValue = false;
			},
		});
		jQuery(control.getDom()).addClassOnClick(
			"d-trigger-down",
			null,
			function() {
				return !editor.get("readOnly");
			},
		);
		return control;
	},
	execute: function(editor: any) {
		this.fireEvent("onExecute", this, { editor: editor });
	},
});
dorado.widget.View.registerDefaultComponent("triggerClear", function() {
	return new dorado.widget.Trigger({
		exClassName: "d-trigger-clear",
		iconClass: "d-trigger-icon-clear",
		onExecute: function(self: any, arg: any) {
			arg.editor.set("text", "");
			arg.editor.post();
		},
	});
});
dorado.widget.DropDown = $extend(dorado.widget.Trigger, {
	$className: "dorado.widget.DropDown",
	focusable: true,
	ATTRIBUTES: {
		iconClass: { defaultValue: "d-trigger-icon-drop" },
		width: {},
		minWidth: { defaultValue: 20 },
		maxWidth: {},
		height: {},
		minHeight: { defaultValue: 10 },
		maxHeight: { defaultValue: 400 },
		autoOpen: {},
		postValueOnSelect: { defaultValue: true },
		assignmentMap: {},
		opened: {
			readOnly: true,
			getter: function() {
				return !!this._box;
			},
		},
		editor: { readOnly: true },
		box: { readOnly: true },
	},
	EVENTS: { onOpen: {}, onClose: {}, onValueSelect: {} },
	createDropDownBox: function() {
		return new dorado.widget.DropDownBox();
	},
	initDropDownBox: dorado._NULL_FUNCTION,
	onEditorMouseDown: function(editor: any) {
		if (this._autoOpen && !editor._realReadOnly && !this.get("opened")) {
			$setTimeout(
				this,
				function() {
					this._skipEditorOnFocusProcedure = true;
					this.execute(editor);
				},
				100,
			);
		}
	},
	onEditorFocus: function(editor: any) {
		if (
			this._autoOpen &&
			!editor._realReadOnly &&
			!this._skipEditorOnFocusProcedure
		) {
			if (dorado.widget.getFocusedControl() === editor) {
				$setTimeout(
					this,
					function() {
						this.execute(editor);
					},
					50,
				);
			}
		}
		delete this._skipEditorOnFocusProcedure;
	},
	onEditorKeyDown: function(editor: any, evt: any) {
		if (editor !== this._editor) {
			return true;
		}
		dorado.widget.disableKeyBubble = this._editor;
		try {
			return this.doOnEditorKeyDown
				? this.doOnEditorKeyDown(editor, evt)
				: true;
		} finally {
			dorado.widget.disableKeyBubble = null;
		}
	},
	doOnEditorKeyDown: function(editor: any, evt: any) {
		let retValue = true;
		if (this.get("opened")) {
			switch (evt.keyCode) {
				case 27:
					this.close();
					retValue = false;
					break;
			}
		}
		return retValue;
	},
	execute: function(editor: any) {
		if (this._skipExecute) {
			return;
		}
		this._skipExecute = true;
		$setTimeout(
			this,
			function() {
				delete this._skipExecute;
			},
			300,
		);
		if (this.get("opened")) {
			this.close();
			let triggerButton = editor.getTriggerButton(this);
			if (triggerButton) {
				$fly(triggerButton.getDom()).removeClass("d-opened");
			}
		} else {
			let arg = { editor: editor, processDefault: true };
			this.fireEvent("beforeExecute", this, arg);
			if (!arg.processDefault) {
				return;
			}
			this.open(editor);
		}
		$invokeSuper.call(this, arguments);
	},
	open: function(editor: any) {
		function getBoxCache(win: any) {
			let boxCache;
			try {
				if (win.dorado) {
					boxCache = win.dorado._DROPDOWN_BOX_CACHE;
					if (!boxCache) {
						win.dorado._DROPDOWN_BOX_CACHE = boxCache = {};
					}
				}
			} catch (e) {}
			return boxCache;
		}
		if (this._box) {
			this._box.hide();
		}
		this._editor = editor;
		this.fireEvent("onOpen", this, { editor: editor });
		let dropdown = this,
			editorDom = editor.getDom();
		let win = $DomUtils.getOwnerWindow(editorDom) || window;
		let boxCache = getBoxCache(win);
		let box = boxCache ? boxCache[dorado.id + "$" + dropdown._uniqueId] : null;
		if (!box) {
			box = dropdown.createDropDownBox();
			dropdown._duringShowAnimation = true;
			if (dorado.Object.isInstanceOf(box, dorado.widget.DropDownBox)) {
				box.bind("onDropDownBoxShow", function() {
					if (dropdown.onDropDownBoxShow) {
						dropdown.onDropDownBoxShow();
					}
				});
				dropdown._duringShowAnimation = false;
				if (dropdown.shouldAutoRelocate()) {
					dropdown._relocateTimeId = setInterval(function() {
						let editorDom = dropdown._editor && dropdown._editor.getDom();
						if (editorDom) {
							let offset = $fly(editorDom).offset();
							if (
								offset.left !== dropdown._currentEditorOffsetLeft ||
								offset.top !== dropdown._currentEditorOffsetTop ||
								editorDom.offsetWidth !== dropdown._currentEditorOffsetWidth ||
								editorDom.offsetHeight !== dropdown._currentEditorOffsetHeight
							) {
								dropdown.locate();
							}
						}
					}, 300);
					dropdown._relocateListener = function() {
						dropdown.locate();
					};
					$fly(window).bind("resize", dropdown._relocateListener);
				}
				if (dropdown._shouldRelocate) {
					dropdown.locate();
				}
			} else {
				if (dorado.Object.isInstanceOf(box, dorado.widget.FloatControl)) {
					box._useAsDropDownBox = true;
					box.set({ center: true, modal: true });
					box.bind("afterShow", function() {
						if (dropdown.onDropDownBoxShow) {
							dropdown.onDropDownBoxShow();
						}
					});
					box.bind("afterHide", function() {
						dropdown.close();
					});
				}
			}
			(dropdown._view || $topView).registerInnerControl(box);
			box._dropDown = dropdown;
			box.render(box._renderTo || win.document.body);
			if (box instanceof dorado.widget.Container) {
				let boxDom = box.getDom(),
					containerDom = box.get("containerDom");
				box._edgeWidth = boxDom.offsetWidth - containerDom.offsetWidth;
				box._edgeHeight = boxDom.offsetHeight - containerDom.offsetHeight;
			} else {
				box._edgeWidth = box._edgeHeight = 0;
			}
			if (boxCache) {
				boxCache[dorado.id + "$" + dropdown._uniqueId] = box;
			}
		}
		box._dropDown = dropdown;
		box._editor = editor;
		box._focusParent = editor;
		dropdown._box = box;
		editor.bind(
			"onBlur._closeDropDown",
			function() {
				dropdown.close();
			},
			{ once: true },
		);
		if (dorado.Object.isInstanceOf(box, dorado.widget.DropDownBox)) {
			dropdown.locate();
		} else {
			box._focusParent = editor;
			box.show();
		}
		let triggerButton = editor.getTriggerButton(dropdown);
		if (triggerButton) {
			$fly(triggerButton.getDom()).addClass("d-opened");
		}
	},
	shouldAutoRelocate: function() {
		return true;
	},
	locate: function() {
		if (!this._box || !this._editor || !this._editor._actualVisible) {
			return;
		}
		if (dorado.Object.isInstanceOf(this._box, dorado.widget.DropDownBox)) {
			this.doLocate();
		}
	},
	getDefaultWidth: function(editor: any) {
		return $fly(editor.getDom()).outerWidth();
	},
	doLocate: function() {
		let dropdown = this,
			box = dropdown._box,
			editor = dropdown._editor;
		let editorDom = editor.getDom(),
			boxDom = box.getDom(),
			boxContainer = boxDom.parentNode;
		let $boxDom = $fly(boxDom);
		let boxContainerHeight = boxContainer.clientHeight,
			realMaxHeight = boxContainerHeight;
		let currentEditorOffset = $fly(editorDom).offset();
		dropdown._currentEditorOffsetLeft = currentEditorOffset.left;
		dropdown._currentEditorOffsetTop = currentEditorOffset.top;
		dropdown._currentEditorOffsetWidth = editorDom.offsetWidth;
		dropdown._currentEditorOffsetHeight = editorDom.offsetHeight;
		dropdown._boxVisible = box.get("visible");
		let offsetTargetTop = dropdown._currentEditorOffsetTop;
		let offsetTargetBottom =
			boxContainerHeight -
			offsetTargetTop -
			dropdown._currentEditorOffsetHeight;
		let align = "innerLeft",
			vAlign = "bottom";
		if (offsetTargetTop > offsetTargetBottom) {
			vAlign = "top";
			realMaxHeight = offsetTargetTop;
		} else {
			realMaxHeight = offsetTargetBottom;
		}
		dropdown._realMaxWidth = dropdown._maxWidth - (box.widthAdjust || 0);
		dropdown._realMaxHeight =
			(realMaxHeight < dropdown._maxHeight
				? realMaxHeight
				: dropdown._maxHeight) - (box.heightAdjust || 0);
		let boxWidth = dropdown._width || dropdown.getDefaultWidth(editor);
		if (dropdown._realMaxWidth > 0 && boxWidth > dropdown._realMaxWidth) {
			boxWidth = dropdown._realMaxWidth;
		}
		if (boxWidth < dropdown._minWidth) {
			boxWidth = dropdown._minWidth;
		}
		if (boxWidth < box._edgeWidth) {
			boxWidth = box._edgeWidth;
		}
		let boxHeight = dropdown._height || 0;
		if (dropdown._realMaxHeight > 0 && boxHeight > dropdown._realMaxHeight) {
			boxHeight = dropdown._realMaxHeight;
		}
		if (boxHeight < dropdown._minHeight) {
			boxHeight = dropdown._minHeight;
		}
		if (boxHeight < box._edgeHeight) {
			boxHeight = box._edgeHeight;
		}
		if (!dropdown._boxVisible) {
			boxDom.style.visibility = "hidden";
			boxDom.style.display = "";
		}
		box.set({ width: boxWidth, height: boxHeight });
		if (!dropdown._boxVisible) {
			box._visible = true;
			box.setActualVisible(true);
		} else {
			box.refresh();
		}
		let containerDom = box.get("containerDom");
		dropdown._edgeWidth = boxDom.offsetWidth - containerDom.offsetWidth;
		dropdown._edgeHeight = boxDom.offsetHeight - containerDom.offsetHeight;
		let currentBoxWidth = boxWidth,
			currentBoxHeight = boxHeight;
		dropdown.initDropDownBox(box, editor);
		if (!dropdown._boxVisible) {
			box._visible = false;
			box.setActualVisible(false);
		}
		let control = box.get("control"),
			controlDom = control ? control.getDom() : containerDom.firstChild;
		if (!dropdown._width) {
			if (controlDom) {
				boxWidth = controlDom.offsetWidth + dropdown._edgeWidth;
			}
			if (boxWidth > dropdown._realMaxWidth) {
				boxWidth = dropdown._realMaxWidth;
			}
			if (boxWidth < dropdown._minWidth) {
				boxWidth = dropdown._minWidth;
			}
		}
		if (!dropdown._height) {
			if (controlDom) {
				boxHeight = controlDom.offsetHeight + dropdown._edgeHeight;
			}
			if (boxHeight > dropdown._realMaxHeight) {
				boxHeight = dropdown._realMaxHeight;
			}
			if (boxHeight < dropdown._minHeight) {
				boxHeight = dropdown._minHeight;
			}
		}
		if (dropdown._currentEditorOffsetWidth > boxWidth) {
			align = "innerRight";
		}
		if (vAlign === "top" && boxHeight < offsetTargetBottom) {
			vAlign = "bottom";
		}
		if (currentBoxWidth < boxWidth || currentBoxHeight !== boxHeight) {
			let config = {};
			if (currentBoxWidth < boxWidth) {
				config.width = boxWidth;
			}
			if (currentBoxHeight !== boxHeight) {
				config.height = boxHeight;
			}
			if (!dropdown._boxVisible) {
				box._visible = true;
				dorado.widget.Control.SKIP_REFRESH_ON_VISIBLE = true;
				box.setActualVisible(true);
				box.set(config).refresh();
				box._visible = false;
				dorado.widget.Control.SKIP_REFRESH_ON_VISIBLE = false;
				box.setActualVisible(false);
			} else {
				box.set(config).refresh();
			}
		}
		let widthOverflow =
			boxDom.parentNode.clientWidth -
			($fly(editorDom).offset().left + boxWidth);
		if (widthOverflow > 0) {
			widthOverflow = 0;
		}
		if (dropdown._boxVisible) {
			$DomUtils.dockAround(boxDom, editorDom, {
				align: align,
				offsetLeft: widthOverflow,
				vAlign: vAlign,
				autoAdjustPosition: false,
			});
		} else {
			boxDom.style.visibility = "hidden";
			boxDom.style.display = "none";
			box.show({
				animateType: boxHeight > 10 ? undefined : "none",
				anchorTarget: editor,
				editor: editor,
				align: align,
				offsetLeft: widthOverflow,
				vAlign: vAlign,
				autoAdjustPosition: false,
			});
		}
	},
	close: function(selectedValue: any) {
		let dropdown = this;
		if (!dropdown._editor) {
			return;
		}
		clearInterval(dropdown._relocateTimeId);
		$fly(window).unbind("resize", dropdown._relocateListener);
		let editor = dropdown._editor;
		let eventArg = {
			editor: editor,
			selectedValue: selectedValue,
			processDefault: true,
		};
		dropdown.fireEvent("onClose", dropdown, eventArg);
		let triggerButton = editor.getTriggerButton(dropdown);
		if (triggerButton) {
			$fly(triggerButton.getDom()).removeClass("d-opened");
		}
		let box = dropdown._box;
		if (!box) {
			return;
		}
		let entityForAssignment;
		if (dropdown.getEntityForAssignment) {
			entityForAssignment = dropdown.getEntityForAssignment();
		}
		dropdown._box = null;
		dropdown._editor = null;
		editor.unbind("onBlur._closeDropDown");
		if (dorado.Object.isInstanceOf(box, dorado.widget.FloatControl)) {
			box.hide();
		}
		if (eventArg.selectedValue !== undefined) {
			dropdown.fireEvent("onValueSelect", dropdown, eventArg);
			if (eventArg.processDefault && eventArg.selectedValue !== undefined) {
				dropdown.assignValue(editor, entityForAssignment, eventArg);
			}
		}
		let editorDom = editor.getDom();
		let win = $DomUtils.getOwnerWindow(editorDom) || window;
		win._doradoCurrentDropDown = null;
	},
	assignValue: function(editor: any, entityForAssignment: any, eventArg: any) {
		selectedValue = eventArg.selectedValue;
		entityForAssignment = entityForAssignment || selectedValue;
		let shouldPostEditor = true;
		let targetEntity =
			editor._entity || (editor._cellEditor && editor._cellEditor.data);
		if (
			this._assignmentMap &&
			entityForAssignment &&
			entityForAssignment instanceof Object &&
			targetEntity &&
			targetEntity instanceof Object
		) {
			let assignmentMap = this._assignmentMap,
				maps = [];
			assignmentMap = assignmentMap.replace(/,/g, ";").split(";");
			for (let i = 0; i < assignmentMap.length; i++) {
				let map = assignmentMap[i],
					index = map.indexOf("=");
				if (index >= 0) {
					maps.push({
						writeProperty: map.substring(0, index),
						readProperty: map.substring(index + 1),
					});
				} else {
					maps.push({ writeProperty: map, readProperty: map });
				}
			}
			for (let i = 0; i < maps.length; i++) {
				let map = maps[i],
					value;
				if (map.readProperty === "$this") {
					value = entityForAssignment;
				} else {
					value =
						entityForAssignment instanceof dorado.Entity
							? entityForAssignment.get(map.readProperty)
							: entityForAssignment[map.readProperty];
				}
				if (value instanceof dorado.Entity) {
					if (value.isEmptyItem) {
						value = null;
					} else {
						value = dorado.Core.clone(value);
					}
				}
				if (targetEntity instanceof dorado.Entity) {
					targetEntity.set(map.writeProperty, value);
				} else {
					targetEntity[map.writeProperty] = value;
				}
			}
			shouldPostEditor = false;
		} else {
			if (
				selectedValue instanceof dorado.Entity ||
				selectedValue instanceof dorado.EntityList
			) {
				selectedValue = dorado.Core.clone(selectedValue);
			}
			editor.set("value", selectedValue);
		}
		if (shouldPostEditor && this._postValueOnSelect) {
			editor.post();
		}
	},
});
dorado.widget.DropDown.findDropDown = function(control: any) {
	function findDropDownBox(control: any) {
		let parent = control._parent;
		while (parent) {
			if (
				dorado.Object.isInstanceOf(parent, dorado.widget.DropDownBox) ||
				(dorado.Object.isInstanceOf(parent, dorado.widget.FloatControl) &&
					parent._useAsDropDownBox)
			) {
				return parent;
			}
			parent = parent._parent;
		}
		return null;
	}
	let box = findDropDownBox(control);
	return box ? box._dropDown : null;
};
(function() {
	let DEFAULT_OK_MESSAGES = [{ state: "ok" }];
	let DEFAULT_VALIDATING_MESSAGES = [{ state: "validating" }];
	dorado.widget.DataMessage = $extend(
		[dorado.widget.Control, dorado.widget.PropertyDataControl],
		{
			$className: "dorado.widget.DataMessage",
			ATTRIBUTES: {
				className: { defaultValue: "d-data-message" },
				showIconOnly: { writeBeforeReady: true },
				showMultiMessage: { writeBeforeReady: true },
				messages: {
					setter: function(messages: any) {
						this._messages = dorado.Toolkits.trimMessages(messages, "info");
					},
				},
			},
			processDataSetMessage: function(messageCode: any, arg: any, data: any) {
				switch (messageCode) {
					case dorado.widget.DataSet.MESSAGE_REFRESH:
					case dorado.widget.DataSet.MESSAGE_DATA_CHANGED:
					case dorado.widget.DataSet.MESSAGE_CURRENT_CHANGED:
					case dorado.widget.DataSet.MESSAGE_ENTITY_STATE_CHANGED:
						this._messages = null;
						this.refresh(true);
						break;
				}
			},
			createMessageDom: function() {
				return $DomUtils.xCreate({
					tagName: "DIV",
					content: [
						{
							tagName: "DIV",
							content: { tagName: "DIV", className: "spinner" },
						},
						{ tagName: "DIV", className: "text" },
					],
				});
			},
			refreshSingleMessageDom: function(dom: any, message: any) {
				let state, text;
				if (message) {
					state = message.state;
					text = message.text;
				}
				dom.className = "d-message d-message-" + (state || "none");
				let iconDom = dom.firstChild,
					textDom = dom.lastChild;
				iconDom.className = "icon icon-" + (state || "none");
				if (!this._showIconOnly) {
					textDom.innerText = text || "";
					textDom.style.display = "";
				} else {
					textDom.style.display = "none";
					if (dorado.TipManager) {
						if (text) {
							dorado.TipManager.initTip(dom, { text: text });
						} else {
							dorado.TipManager.deleteTip(dom);
						}
					}
				}
			},
			refreshDom: function(dom: any) {
				$invokeSuper.call(this, arguments);
				let entity,
					messages = this._messages;
				if (!messages && this._dataSet) {
					let entity = this.getBindingData();
					if (entity instanceof dorado.Entity) {
						messages = entity.getMessages(this._property);
					} else {
						entity = null;
					}
					if (entity && this._property) {
						let state = entity.getValidateState(this._property);
						if (state === "validating") {
							messages = DEFAULT_VALIDATING_MESSAGES;
						} else {
							if (!messages || messages.length === 0) {
								if (state === "ok") {
									messages = DEFAULT_OK_MESSAGES;
								} else {
									let propertyDef = this.getBindingPropertyDef();
									if (propertyDef && propertyDef._description) {
										messages = [
											{ state: "info", text: propertyDef._description },
										];
									}
								}
							}
						}
					}
				}
				if (!this._showMultiMessage) {
					let message = dorado.Toolkits.getTopMessage(messages);
					let messageDom = dom.firstChild;
					if (!messageDom) {
						messageDom = this.createMessageDom();
						dom.appendChild(messageDom);
					}
					this.refreshSingleMessageDom(messageDom, message);
				} else {
				}
			},
		},
	);
})();
(function() {
	let specialFormConfigProps = [
		"view",
		"tags",
		"formProfile",
		"width",
		"height",
		"className",
		"exClassName",
		"visible",
		"hideMode",
		"layoutConstraint",
		"readOnly",
		"style",
	];
	let DEFAULT_OK_MESSAGES = [{ state: "ok" }];
	dorado.widget.FormConfig = $class({
		$className: "dorado.widget.FormConfig",
		ATTRIBUTES: {
			width: {},
			height: {},
			className: {},
			exClassName: {},
			ui: {},
			editorType: { writeBeforeReady: true },
			entity: {},
			dataSet: { componentReference: true },
			dataPath: { writeBeforeReady: true },
			labelSeparator: {},
			showLabel: { defaultValue: true, writeBeforeReady: true },
			labelWidth: { defaultValue: 80, writeBeforeReady: true },
			labelSpacing: { defaultValue: 3, writeBeforeReady: true },
			labelPosition: { writeBeforeReady: true },
			labelAlign: { writeBeforeReady: true },
			editorWidth: { writeBeforeReady: true },
			showHint: { writeBeforeReady: true, defaultValue: true },
			hintWidth: { defaultValue: 22, writeBeforeReady: true },
			hintSpacing: { defaultValue: 3, writeBeforeReady: true },
			showHintMessage: { writeBeforeReady: true },
			hintPosition: { writeBeforeReady: true },
			hintControl: { readOnly: true },
			readOnly: {},
		},
	});
	dorado.widget.FormProfileSupport = $class({
		onProfileChange: function() {
			let formProfile = this._formProfile;
			if (dorado.Object.isInstanceOf(formProfile, dorado.widget.FormProfile)) {
				let readOnly = formProfile.get("readOnly");
				if (this._realReadOnly !== readOnly) {
					this._realReadOnly = readOnly;
				}
				this.set(formProfile.getConfig(), {
					skipUnknownAttribute: true,
					tryNextOnError: true,
					preventOverwriting: true,
					lockWritingTimes: this instanceof dorado.widget.FormElement,
				});
			}
		},
	});
	dorado.widget.FormProfile = $extend(
		[dorado.widget.Component, dorado.widget.FormConfig],
		{
			$className: "dorado.widget.FormProfile",
			ATTRIBUTES: {
				entity: {
					defaultValue: function() {
						return new dorado.widget.FormProfile.DefaultEntity();
					},
				},
			},
			constructor: function(config: any) {
				this._bindingElements = new dorado.ObjectGroup();
				dorado.widget.Component.prototype.constructor.call(this, config);
				this.bind("onAttributeChange", function(self: any, arg: any) {
					let attr = arg.attribute;
					if (
						!dorado.widget.Control.prototype.ATTRIBUTES[attr] &&
						dorado.widget.FormConfig.prototype.ATTRIBUTES[attr]
					) {
						if (self._config) {
							delete self._config;
						}
						dorado.Toolkits.setDelayedAction(
							self,
							"$profileChangeTimerId",
							function() {
								self._bindingElements.invoke("onProfileChange");
							},
							20,
						);
					}
				});
			},
			addBindingElement: function(element: any) {
				this._bindingElements.objects.push(element);
			},
			removeBindingElement: function(element: any) {
				this._bindingElements.objects.push(element);
			},
			getConfig: function() {
				if (this._config) {
					return this._config;
				}
				let formProfile = this;
				let attrs = formProfile.ATTRIBUTES,
					attrWatcher = formProfile.getAttributeWatcher(),
					config = (formProfile._config = {});
				for (let attr in attrs) {
					if (!attrs.hasOwnProperty(attr)) {
						continue;
					}
					if (attr === "entity" && (formProfile._dataSet || this._dataSet)) {
						continue;
					}
					let def = attrs[attr];
					if (
						def.readOnly ||
						def.writeOnly ||
						(!attrWatcher.getWritingTimes(attr) &&
							typeof def.defaultValue !== "function")
					) {
						continue;
					}
					if (
						specialFormConfigProps.indexOf(attr) >= 0 &&
						formProfile instanceof dorado.widget.Control
					) {
						continue;
					}
					let value = formProfile.get(attr);
					if (
						def.componentReference &&
						!(value instanceof dorado.widget.Component)
					) {
						continue;
					}
					if (value !== undefined) {
						config[attr] = value;
					}
				}
				return config;
			},
		},
	);
	dorado.widget.FormProfile.DefaultEntity = $class({});
	dorado.widget.AbstractFormElement = $extend(
		[
			dorado.widget.Control,
			dorado.widget.PropertyDataControl,
			dorado.widget.FormProfileSupport,
		],
		{
			ATTRIBUTES: {
				formProfile: {
					componentReference: true,
					setter: function(formProfile: any) {
						if (this._formProfile === formProfile) {
							return;
						}
						if (
							dorado.Object.isInstanceOf(
								this._formProfile,
								dorado.widget.FormProfile,
							)
						) {
							this._formProfile.removeBindingElement(this);
						}
						if (
							formProfile &&
							!dorado.Object.isInstanceOf(
								formProfile,
								dorado.widget.FormProfile,
							)
						) {
							let ref = formProfile;
							formProfile = ref.view.id(ref.component);
						}
						this._formProfile = formProfile;
						if (
							dorado.Object.isInstanceOf(formProfile, dorado.widget.FormProfile)
						) {
							formProfile.addBindingElement(this);
							this.onProfileChange();
						}
					},
				},
				dataSet: {
					setter: function(dataSet: any, attr: any) {
						dorado.widget.DataControl.prototype.ATTRIBUTES.dataSet.setter.call(
							this,
							dataSet,
							attr,
						);
						delete this._propertyDef;
						this.resetBinding();
					},
				},
				dataPath: {
					setter: function(v: any) {
						this._dataPath = v;
						delete this._propertyDef;
						this.resetBinding();
					},
				},
				property: {
					writeBeforeReady: true,
					setter: function(v: any) {
						this._property = v;
						delete this._propertyDef;
						this.resetBinding();
					},
				},
				entity: {},
			},
			_constructor: function(config: any) {
				let formProfile = config && config.formProfile;
				if (formProfile) {
					delete config.formProfile;
				}
				dorado.widget.Control.prototype._constructor.call(this, config);
				if (formProfile) {
					this.set("formProfile", formProfile);
				}
			},
			destroy: function() {
				if (this._destroyed) {
					return;
				}
				this.set("formProfile", null);
				$invokeSuper.call(this, arguments);
			},
		},
	);
	dorado.widget.FormElement = $extend(
		[dorado.widget.AbstractFormElement, dorado.widget.FormConfig],
		{
			$className: "dorado.widget.FormElement",
			ATTRIBUTES: {
				width: { defaultValue: 260, writeBeforeReady: true },
				height: { independent: true, writeBeforeReady: true },
				className: { defaultValue: "d-form-element" },
				label: {},
				hint: {
					setter: function(hint: any) {
						function trimSingleHint(hint: any) {
							if (!hint) {
								return null;
							}
							if (typeof hint === "string") {
								hint = [{ state: "info", text: hint }];
							} else {
								hint.state = hint.state || "info";
								hint = [hint];
							}
							return hint;
						}
						function trimHints(hint: any) {
							if (!hint) {
								return null;
							}
							if (hint instanceof Array) {
								let array = [];
								for (let i = 0; i < hint.length; i++) {
									let h = trimSingleHint(hint[i]);
									if (!h) {
										continue;
									}
									array.push(h);
								}
								hint = array.length ? array : null;
							} else {
								hint = trimSingleHint(hint);
							}
							return hint;
						}
						this._hint = trimHints(hint);
						let hintControl = this.getHintControl(true);
						if (hintControl) {
							hintControl.set("messages", this._hint);
						}
					},
				},
				editor: { writeBeforeReady: true, innerComponent: "TextEditor" },
				trigger: {},
				editable: { defaultValue: true },
				value: { path: "editor.value" },
				entity: {
					setter: function(entity: any) {
						this._entity = entity;
						if (this._rendered) {
							let hintControl = this.getHintControl(false);
							if (hintControl) {
								hintControl.set("messages", null);
							}
						}
					},
				},
				readOnly: {
					skipRefresh: true,
					setter: function(v: any) {
						this._readOnly = v;
						this.resetEditorReadOnly();
					},
				},
			},
			createDom: function() {
				let attrWatcher = this.getAttributeWatcher();
				if (
					!this._formProfile &&
					attrWatcher.getWritingTimes("formProfile") === 0
				) {
					let view = this.get("view") || dorado.widget.View.TOP;
					this.set("formProfile", view.id("defaultFormProfile"));
				}
				let config = [],
					content = [];
				if (this._showLabel) {
					let labelClass = " form-label-align-" + (this._labelAlign || "left");
					if (this._labelPosition === "top") {
						config.push({
							contextKey: "labelEl",
							tagName: "DIV",
							className: "form-label form-label-top" + labelClass,
						});
					} else {
						config.push({
							contextKey: "labelEl",
							tagName: "DIV",
							className: "form-label form-label-left" + labelClass,
						});
					}
				}
				if (this._labelPosition === "top") {
					let contentConfig = {
						contextKey: "contentEl",
						tagName: "DIV",
						className: "form-content form-content-bottom",
						content: content,
					};
					config.push(contentConfig);
				} else {
					let contentConfig = {
						contextKey: "contentEl",
						tagName: "DIV",
						className: "form-content form-content-right",
						content: content,
					};
					config.push(contentConfig);
				}
				if (this._hintPosition === "bottom") {
					content.push({
						contextKey: "editorEl",
						tagName: "DIV",
						className: "form-editor form-editor-top",
					});
				} else {
					content.push({
						contextKey: "editorEl",
						tagName: "DIV",
						className: "form-editor form-editor-left",
					});
				}
				if (this._showHint) {
					if (this._hintPosition === "bottom") {
						content.push({
							contextKey: "hintEl",
							tagName: "DIV",
							className: "form-hint form-hint-bottom",
						});
					} else {
						content.push({
							contextKey: "hintEl",
							tagName: "DIV",
							className: "form-hint form-hint-right",
						});
					}
				}
				let doms = {},
					dom = $DomUtils.xCreate(
						{ tagName: "DIV", content: config },
						null,
						doms,
					);
				this._labelEl = doms.labelEl;
				this._contentEl = doms.contentEl;
				this._editorEl = doms.editorEl;
				this._hintEl = doms.hintEl;
				return dom;
			},
			setFocus: function() {
				if (this._focused) {
					$invokeSuper.call(this);
				} else {
					let editor = this.getEditor(false);
					if (editor) {
						editor.setFocus();
					} else {
						$invokeSuper.call(this);
					}
				}
			},
			createEditor: function(editorType: any) {
				let editor = dorado.Toolkits.createInstance(
					"widget",
					editorType,
					function() {
						return (
							dorado.Toolkits.getPrototype("widget", editorType) ||
							dorado.widget.TextEditor
						);
					},
				);
				return editor;
			},
			getEditor: function(create: any) {
				let control = this._editor;
				if (this._controlRegistered) {
					let config1 = {},
						config2 = {},
						attrs = control.ATTRIBUTES;
					this.initEditorConfig(config1);
					for (let attr in config1) {
						if (!attrs[attr] || attrs[attr].writeOnly) {
							continue;
						}
						if (config1[attr] != null) {
							config2[attr] = config1[attr];
						}
					}
					control.set(config2, {
						skipUnknownAttribute: true,
						tryNextOnError: true,
						preventOverwriting: true,
						lockWritingTimes: true,
					});
					return control;
				}
				if (!control && create) {
					let propertyDef = this.getBindingPropertyDef();
					if (propertyDef) {
						if (!this._editorType) {
							let propertyDataType = propertyDef.get("dataType");
							if (propertyDataType) {
								if (
									propertyDataType._code === dorado.DataType.PRIMITIVE_BOOLEAN ||
									propertyDataType._code === dorado.DataType.BOOLEAN
								) {
									this._editorType = !propertyDef._mapping
										? "CheckBox"
										: "RadioGroup";
								}
							}
						}
						if (this._trigger === undefined && propertyDef._mapping) {
							if (!this._editorType || this._editorType === "TextEditor") {
								this._trigger = new dorado.widget.AutoMappingDropDown({
									items: propertyDef._mapping,
								});
							}
						}
					}
					let originEditor = this._editor;
					this._editor = control = this.createEditor(this._editorType);
					if (originEditor !== control) {
						if (originEditor) {
							this.unregisterInnerControl(originEditor);
						}
						if (control) {
							this.registerInnerControl(control);
						}
					}
				}
				if (control) {
					let config = {};
					this.initEditorConfig(config);
					control.set(config, {
						skipUnknownAttribute: true,
						tryNextOnError: true,
						preventOverwriting: true,
						lockWritingTimes: true,
					});
					this._controlRegistered = true;
					if (
						this._showHint &&
						control instanceof dorado.widget.AbstractEditor
					) {
						if (control instanceof dorado.widget.AbstractTextBox) {
							control.bind(
								"onValidationStateChange",
								$scopify(this, this.onEditorStateChange),
							);
							control.bind("onPost", $scopify(this, this.onEditorPost));
						}
						control.bind(
							"onPostFailed",
							$scopify(this, this.onEditorPostFailed),
						);
					}
				}
				return control;
			},
			getHintControl: function(create: any) {
				let control = this._hintControl;
				if (!control && create) {
					let config = {
						width: this._hintWidth,
						showIconOnly: !this._showHintMessage,
						messages: this._hint,
					};
					if (this._dataPath) {
						config.dataPath = this._dataPath;
					}
					if (this._dataSet && this._property) {
						config.dataSet = this._dataSet;
						config.property = this._property;
					}
					this._hintControl = control = new dorado.widget.DataMessage(config);
				}
				if (control && !this._hintControlRegistered) {
					this._hintControlRegistered = true;
					this.registerInnerControl(control);
				}
				return control;
			},
			initEditorConfig: function(config: any) {
				if (this._trigger !== undefined) {
					config.trigger = this._trigger;
				}
				if (this._editable !== undefined) {
					config.editable = this._editable;
				}
				config.readOnly = this._readOnly || this._realReadOnly;
				if (this._dataSet && this._property) {
					config.dataSet = this._dataSet;
				} else {
					if (this._entity) {
						config.entity = this._entity;
					}
				}
				if (this._dataPath) {
					config.dataPath = this._dataPath;
				}
				if (this._property) {
					config.property = this._property;
				}
			},
			resetEditorReadOnly: function() {
				if (
					this._editor &&
					this._editor instanceof dorado.widget.AbstractEditor
				) {
					this._editor.set("readOnly", this._readOnly || this._realReadOnly);
				}
			},
			onEditorStateChange: function(editor: any, arg: any) {
				let hintControl = this.getHintControl(false);
				if (hintControl) {
					hintControl.set("messages", editor.get("validationMessages"));
				}
			},
			onEditorPost: function(editor: any, arg: any) {
				let hintControl = this.getHintControl(false);
				if (hintControl) {
					messages = editor.get("validationMessages");
					hintControl.set("messages", messages || DEFAULT_OK_MESSAGES);
				}
			},
			onEditorPostFailed: function(editor: any, arg: any) {
				if (!this._dataSet && !this._property) {
					let exception = arg.exception;
					if (exception instanceof dorado.widget.editor.PostException) {
						let hintControl = this.getHintControl(false);
						if (hintControl) {
							hintControl.set("messages", exception.messages);
						}
					}
				}
				arg.processDefault = false;
			},
			getBindingPropertyDef: function() {
				let p = this._propertyDef;
				if (p === undefined) {
					this._propertyDef = p = $invokeSuper.call(this) || null;
				}
				return p;
			},
			processDataSetMessage: function(messageCode: any, arg: any, data: any) {
				switch (messageCode) {
					case dorado.widget.DataSet.MESSAGE_REFRESH:
						this.refresh(true);
						break;
				}
			},
			getLabel: function() {
				let label = this._label;
				if (!label && this._dataSet && this._property) {
					let p = this.getBindingPropertyDef();
					if (p) {
						label = p._label || p._name;
					}
				}
				return label || this._property || "";
			},
			isRequired: function() {
				let p;
				if (this._dataSet && this._property) {
					p = this.getBindingPropertyDef();
				}
				let required = p ? p._required : false;
				if (!required) {
					let editor = this._editor;
					required =
						editor &&
						editor instanceof dorado.widget.TextEditor &&
						editor.get("required");
				}
				return required;
			},
			resetBinding: function() {
				if (!this._ready) {
					return;
				}
				let config = {
					dataSet: this._dataSet,
					dataPath: this._dataPath,
					property: this._property,
				};
				let editor = this.getEditor(false),
					hintControl = this.getHintControl(false);
				if (editor) {
					editor.set(config);
				}
				if (hintControl) {
					hintControl.set(config);
				}
			},
			refreshDom: function(dom: any) {
				let height = this._height || this._realHeight;
				$invokeSuper.call(this, arguments);
				let dom = this._dom,
					labelEl = this._labelEl,
					contentEl = this._contentEl,
					editorEl = this._editorEl,
					hintEl = this._hintEl;
				let heightDefined =
					this.getAttributeWatcher().getWritingTimes("height");
				if (labelEl) {
					let label = this.getLabel();
					labelEl.innerText =
						label + (this._labelSeparator && label ? this._labelSeparator : "");
					if (this._labelPosition === "top") {
						if (heightDefined) {
							contentEl.style.height =
								dom.offsetHeight - labelEl.offsetHeight + "px";
						}
					} else {
						$fly(labelEl).outerWidth(this._labelWidth);
						if (dorado.Browser.msie && dorado.Browser.version < 7) {
							contentEl.style.marginLeft = this._labelWidth + "px";
						} else {
							contentEl.style.marginLeft =
								this._labelWidth + this._labelSpacing + "px";
						}
					}
				}
				if (hintEl) {
					let hintControl = this.getHintControl(true);
					if (this._hintPosition === "bottom") {
						if (heightDefined) {
							editorEl.style.height =
								contentEl.offsetHeight - hintEl.offsetHeight + "px";
						}
					} else {
						hintEl.style.width = this._hintWidth + "px";
						editorEl.style.marginRight =
							this._hintWidth + this._hintSpacing + "px";
					}
					if (!hintControl.get("rendered")) {
						hintControl.render(hintEl);
					}
				}
				let editor = this.getEditor(true);
				if (editor) {
					let attrWatcher = editor.getAttributeWatcher();
					let autoWidth =
						!editor.ATTRIBUTES.width.independent &&
						!attrWatcher.getWritingTimes("width");
					let autoHeight =
						!editor.ATTRIBUTES.height.independent &&
						!attrWatcher.getWritingTimes("height") &&
						heightDefined;
					if (this._labelPosition === "top") {
						autoHeight = height && autoHeight;
					}
					if (autoWidth) {
						let editorWidth = 0;
						if (this._realWidth > 0) {
							editorWidth = this._realWidth;
							if (this._showLabel && this._labelPosition !== "top") {
								editorWidth -= this._labelWidth + this._labelSpacing;
								if (this._showHint && this._hintPosition !== "bottom") {
									editorWidth -= this._hintWidth + this._hintSpacing;
								}
							} else {
								editorWidth = 0;
							}
						}
						editor._realWidth =
							editorWidth > 0 ? editorWidth : editorEl.offsetWidth;
					}
					if (
						this._editorWidth > 0 &&
						editor._realWidth > 0 &&
						this._editorWidth < editor._realWidth
					) {
						editor._realWidth = this._editorWidth;
					}
					if (autoHeight) {
						if (editorEl.offsetHeight) {
							editor._realHeight = editorEl.offsetHeight;
						} else {
							if (
								height &&
								(this._labelPosition !== "top" || !this._showLabel) &&
								(this._hintPosition !== "bottom" || !this._showHint)
							) {
								editor._realHeight = height;
							}
						}
					}
					if (!editor._rendered) {
						editor.render(editorEl);
					} else {
					}
				}
				if (labelEl) {
					let required = !!this.isRequired();
					$fly(labelEl).toggleClass("form-label-required", required);
				}
			},
			refreshData: function() {
				let editor = this.getEditor(false);
				if (
					editor != null &&
					dorado.Object.isInstanceOf(editor, dorado.widget.AbstractEditor)
				) {
					editor.refreshData();
				}
			},
			isFocusable: function() {
				let editor = this._editor;
				return $invokeSuper.call(this) && editor && editor.isFocusable();
			},
			getFocusableSubControls: function() {
				return [this._editor];
			},
		},
	);
	dorado.widget.View.registerDefaultComponent(
		"defaultFormProfile",
		function() {
			return new dorado.widget.FormProfile();
		},
	);
})();
(function() {
	let _ELEMENT_ID_SEED = 0;
	dorado.widget.autoform = {};
	dorado.widget.autoform.AutoFormElement = $extend(dorado.widget.FormElement, {
		$className: "dorado.widget.autoform.AutoFormElement",
		ATTRIBUTES: {
			width: { independent: false },
			name: {
				writeOnce: true,
				setter: function(name: any) {
					this._name = name;
					if (
						name &&
						!this.getAttributeWatcher().getWritingTimes("property") &&
						!name.startsWith("_unnamed")
					) {
						this._property = name;
					}
				},
			},
		},
	});
	dorado.widget.AutoForm = $extend(
		[
			dorado.widget.Container,
			dorado.widget.FormProfile,
			dorado.widget.FormProfileSupport,
		],
		{
			$className: "dorado.widget.AutoForm",
			ATTRIBUTES: {
				className: { defaultValue: "d-auto-form" },
				formProfile: {
					componentReference: true,
					setter: function(formProfile: any) {
						if (this._formProfile === formProfile) {
							return;
						}
						if (
							dorado.Object.isInstanceOf(
								this._formProfile,
								dorado.widget.FormProfile,
							)
						) {
							this._formProfile.removeBindingElement(this);
						}
						this._formProfile = formProfile;
						if (
							dorado.Object.isInstanceOf(formProfile, dorado.widget.FormProfile)
						) {
							formProfile.addBindingElement(this);
							this.onProfileChange();
						}
					},
				},
				cols: {
					skipRefresh: true,
					setter: function(cols: any) {
						this._cols = cols;
						if (this._rendered) {
							this.refreshFormLayout();
						}
					},
				},
				rowHeight: { defaultValue: 22 },
				colPadding: { defaultValue: 6 },
				rowPadding: { defaultValue: 6 },
				stretchWidth: {},
				padding: { defaultValue: 8 },
				dataType: { getter: dorado.LazyLoadDataType.dataTypeGetter },
				autoCreateElements: {},
				elements: {
					setter: function(elements: any) {
						if (this._rendered) {
							let layout = this.get("layout");
							layout.disableRendering();
							for (let i = this._elements.items.length - 1; i >= 0; i--) {
								this.removeElement(this._elements.items[i]);
							}
							if (!elements) {
								return;
							}
							for (let i = 0, len = elements.length; i < len; i++) {
								this.addElement(elements[i]);
							}
							layout.enableRendering();
						} else {
							this._elementConfigs = elements;
						}
					},
				},
				createOwnEntity: { defaultValue: true },
				createPrivateDataSet: { writeBeforeReady: true },
				entity: {
					getter: function() {
						if (this._dataSet && this._dataSet._ready) {
							let entity = this._dataSet.getData(this._dataPath, {
								loadMode: "auto",
								firstResultOnly: true,
							});
							if (entity && entity instanceof dorado.EntityList) {
								entity = entity.current;
							}
							return entity;
						} else {
							return this._entity;
						}
					},
					setter: function(entity: any) {
						if (
							this._dataSet &&
							this._dataSet._ready &&
							this._dataSet.get("userData") === "autoFormPrivateDataSet"
						) {
							this._dataSet.set("data", entity);
						} else {
							this._entity = entity;
						}
					},
				},
			},
			constructor: function(config: any) {
				let autoform = this;
				autoform._elements = new dorado.util.KeyedArray(function(element: any) {
					return element instanceof dorado.widget.autoform.AutoFormElement
						? element._name
						: element._id;
				});
				$invokeSuper.call(autoform, [config]);
			},
			_constructor: function(config: any) {
				let autoform = this;
				autoform.set({ layout: "Form", contentOverflow: "visible" });
				autoform._bindingElements = new dorado.ObjectGroup();
				$invokeSuper.call(autoform, [config]);
				if (
					autoform._createOwnEntity &&
					autoform.getAttributeWatcher().getWritingTimes("entity") === 0
				) {
					let defaultEntity = new dorado.widget.FormProfile.DefaultEntity();
					autoform.set("entity", defaultEntity);
				}
				if (autoform._elementConfigs) {
					let configs = autoform._elementConfigs;
					for (let i = 0, len = configs.length; i < len; i++) {
						autoform.addElement(configs[i]);
					}
					delete autoform._elementConfigs;
				}
				autoform.bind("onAttributeChange", function(self: any, arg: any) {
					let attr = arg.attribute;
					if (attr === "readOnly") {
						let readOnly = autoform._readOnly,
							objects = autoform._bindingElements.objects;
						for (let i = 0; i < objects.length; i++) {
							let object = objects[i];
							if (object instanceof dorado.widget.FormElement) {
								object._realReadOnly = readOnly;
								object.resetEditorReadOnly();
							}
						}
					} else {
						if (
							!dorado.widget.Control.prototype.ATTRIBUTES[attr] &&
							dorado.widget.FormConfig.prototype.ATTRIBUTES[attr]
						) {
							if (autoform._config) {
								delete autoform._config;
							}
							dorado.Toolkits.setDelayedAction(
								autoform,
								"$profileChangeTimerId",
								function() {
									autoform._bindingElements.invoke("onProfileChange");
								},
								20,
							);
						}
					}
				});
			},
			doGet: function(attr: any) {
				let c = attr.charAt(0);
				if (c === "#" || c === "&") {
					let elementName = attr.substring(1);
					return this.getElement(elementName);
				} else {
					return $invokeSuper.call(this, [attr]);
				}
			},
			addBindingElement: function(element: any) {
				if (!this._privateDataSetInited) {
					this._privateDataSetInited = true;
					if (!this._dataSet && this._createPrivateDataSet) {
						let dataType = this.get("dataType");
						let dataSet = new dorado.widget.DataSet({
							dataType: dataType,
							userData: "autoFormPrivateDataSet",
							onReady: {
								listener: function(self: any) {
									self.insert();
								},
								options: { once: true },
							},
						});
						let parentControl = this.get("parent") || $topView;
						if (
							parentControl &&
							parentControl instanceof dorado.widget.Container
						) {
							parentControl.addChild(dataSet);
						}
						dataSet.onReady();
						this.set({ dataSet: dataSet, dataPath: null });
					}
				}
				$invokeSuper.call(this, [element]);
			},
			addElement: function(element: any) {
				let elements = this._elements,
					constraint;
				if (!(element instanceof dorado.widget.Control)) {
					let config = element;
					if (!config.name) {
						config.name = config.property || "_unnamed_" + ++_ELEMENT_ID_SEED;
					}
					element = this.createInnerComponent(config, function(type: any) {
						if (!type) {
							return dorado.widget.autoform.AutoFormElement;
						}
					});
				}
				if (element instanceof dorado.widget.AbstractFormElement) {
					element.set("formProfile", this, {
						skipUnknownAttribute: true,
						preventOverwriting: true,
						lockWritingTimes: true,
					});
				}
				elements.append(element);
				this.addChild(element);
				return element;
			},
			removeElement: function(element: any) {
				this._elements.remove(element);
				this.removeChild(element);
			},
			getElement: function(name: any) {
				return this._elements.get(name);
			},
			createDom: function() {
				let attrWatcher = this.getAttributeWatcher();
				if (
					!this._formProfile &&
					attrWatcher.getWritingTimes("formProfile") === 0
				) {
					let view = this.get("view") || dorado.widget.View.TOP;
					this.set("formProfile", view.id("defaultFormProfile"));
				}
				return $invokeSuper.call(this, arguments);
			},
			refreshDom: function(dom: any) {
				if (this._autoCreateElements && !this._defaultElementsGenerated) {
					this.generateDefaultElements();
				}
				let layout = this.get("layout");
				this.initLayout(layout);
				$invokeSuper.call(this, arguments);
			},
			refreshFormLayout: function() {
				let layout = this.get("layout");
				this.initLayout(layout);
				layout.refresh();
			},
			initLayout: function(layout: any) {
				configs = {};
				if (this._cols) {
					configs.cols = this._cols;
				}
				if (this._rowHeight >= 0) {
					configs.rowHeight = this._rowHeight;
				}
				if (this._colPadding >= 0) {
					configs.colPadding = this._colPadding;
				}
				if (this._rowPadding >= 0) {
					configs.rowPadding = this._rowPadding;
				}
				if (this._stretchWidth) {
					configs.stretchWidth = this._stretchWidth;
				}
				if (this._padding >= 0) {
					configs.padding = this._padding;
				}
				layout.set(configs);
			},
			generateDefaultElements: function() {
				let dataType = this.get("dataType");
				if (!dataType && this._dataSet) {
					let dataPath = dorado.DataPath.create(this._dataPath);
					dataType = dataPath.getDataType(this._dataSet.get("dataType"));
				}
				if (!dataType && this._entity) {
					dataType = this._entity.dataType;
				}
				if (dataType && dataType instanceof dorado.EntityDataType) {
					this._defaultElementsGenerated = true;
					let layout = this.get("layout");
					layout.disableRendering();
					let self = this,
						elements = self._elements,
						config;
					dataType.get("propertyDefs").each(function(propertyDef: any) {
						if (!propertyDef._visible) {
							return;
						}
						let name = propertyDef._name,
							element = elements.get(name);
						if (!element) {
							config = {
								name: name,
								dataSet: self._dataSet,
								dataPath: self._dataPath,
								property: name,
							};
						} else {
							config = { property: name };
							self.removeElement(element);
							self.addElement(element);
						}
						let propertyDataType = propertyDef.get("dataType");
						if (
							propertyDataType instanceof dorado.EntityDataType ||
							propertyDataType instanceof dorado.AggregationDataType
						) {
							return;
						}
						if (!element) {
							element = self.addElement(config);
						} else {
							element.set(config, {
								skipUnknownAttribute: true,
								tryNextOnError: true,
								preventOverwriting: true,
								lockWritingTimes: true,
							});
						}
					});
					layout.enableRendering();
				}
			},
			validate: function(silent: any) {
				let result = true,
					elements = this._elements,
					errorMessages;
				this._elements.each(function(element: any) {
					if (element instanceof dorado.widget.FormElement) {
						let editor = element.get("editor");
						if (editor && editor instanceof dorado.widget.AbstractTextBox) {
							if (editor.get("validationState") === "none") {
								editor.post(false, true);
							}
							if (result && editor.get("validationState") === "error") {
								result = false;
								errorMessages = editor.get("validationMessages");
							}
						}
					}
				});
				if (!result && !silent) {
					throw new dorado.widget.editor.PostException(errorMessages);
				}
				return result;
			},
			refreshData: function() {
				this._elements.each(function(element: any) {
					if (element instanceof dorado.widget.AbstractFormElement) {
						element.refreshData();
					}
				});
			},
		},
	);
})();
