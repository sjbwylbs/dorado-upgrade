package com.bstek.dorado.view.widget.base;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "SimpleIconButton", category = "General", dependsPackage = "base-widget")
@ClientObject(prototype = "dorado.widget.SimpleIconButton", shortTypeName = "SimpleIconButton")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class SimpleIconButton extends SimpleButton {

	private String icon;

	private String iconClass;

	private boolean showTrigger;

	@IdeProperty(highlight = 1)
	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getIconClass() {
		return iconClass;
	}

	public void setIconClass(String iconClass) {
		this.iconClass = iconClass;
	}

	public boolean getShowTrigger() {
		return showTrigger;
	}

	public void setShowTrigger(boolean showTrigger) {
		this.showTrigger = showTrigger;
	}

}
