package com.bstek.dorado.view.widget.base.tab;

import java.util.List;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "TabColumn", category = "General", dependsPackage = "base-widget-desktop")
@ClientObject(prototype = "dorado.widget.TabColumn", shortTypeName = "TabColumn")
public class TabColumn extends AbstractTabControl {

	private VerticalTabPlacement tabPlacement = VerticalTabPlacement.left;

	private boolean verticalText = false;

	@Override
	@XmlSubNode(implTypes = "com.bstek.dorado.view.widget.base.tab.Tab")
	@ClientProperty
	public List<Tab> getTabs() {
		return super.getTabs();
	}

	@ClientProperty(escapeValue = "left")
	public VerticalTabPlacement getTabPlacement() {
		return tabPlacement;
	}

	public void setTabPlacement(VerticalTabPlacement tabPlacement) {
		this.tabPlacement = tabPlacement;
	}

	@ClientProperty
	public boolean isVerticalText() {
		return verticalText;
	}

	public void setVerticalText(boolean verticalText) {
		this.verticalText = verticalText;
	}

}
