package com.bstek.dorado.view.widget.base.tab;

import java.util.List;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.view.annotation.Widget;


@Widget(name = "TabControl", category = "General", dependsPackage = "base-widget-desktop")
@ClientObject(prototype = "dorado.widget.TabControl", shortTypeName = "TabControl")
public class TabControl extends TabBar {

	private boolean dynaHeight = false;

	@ClientProperty(escapeValue = "false")
	public boolean isDynaHeight() {
		return dynaHeight;
	}

	public void setDynaHeight(boolean dynaHeight) {
		this.dynaHeight = dynaHeight;
	}

	@Override
	@XmlSubNode(implTypes = "com.bstek.dorado.view.widget.base.tab.*")
	@ClientProperty
	public List<Tab> getTabs() {
		return super.getTabs();
	}

}
