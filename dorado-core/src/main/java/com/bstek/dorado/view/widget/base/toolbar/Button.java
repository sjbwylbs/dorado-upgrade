package com.bstek.dorado.view.widget.base.toolbar;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.view.annotation.Widget;

@Widget(category = "ToolBar", dependsPackage = "base-widget")
@ClientObject(prototype = "dorado.widget.toolbar.ToolBarButton", shortTypeName = "ToolBarButton")
@XmlNode(nodeName = "ToolBarButton", label = "ToolBarButton")
public class Button extends com.bstek.dorado.view.widget.base.Button {

	private boolean showMenuOnHover;

	private boolean hideMenuOnMouseLeave = false;

	private int hideMenuOnMouseLeaveDelay = 300;

	@ClientProperty(escapeValue = "false")
	public boolean isShowMenuOnHover() {
		return showMenuOnHover;
	}

	public void setShowMenuOnHover(boolean showMenuOnHover) {
		this.showMenuOnHover = showMenuOnHover;
	}

	public boolean isHideMenuOnMouseLeave() {
		return hideMenuOnMouseLeave;
	}

	public void setHideMenuOnMouseLeave(boolean hideMenuOnMouseLeave) {
		this.hideMenuOnMouseLeave = hideMenuOnMouseLeave;
	}

	@ClientProperty(escapeValue = "300")
	public int getHideMenuOnMouseLeaveDelay() {
		return hideMenuOnMouseLeaveDelay;
	}

	public void setHideMenuOnMouseLeaveDelay(int hideMenuOnMouseLeaveDelay) {
		this.hideMenuOnMouseLeaveDelay = hideMenuOnMouseLeaveDelay;
	}

}
