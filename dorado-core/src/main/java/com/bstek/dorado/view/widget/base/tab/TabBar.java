package com.bstek.dorado.view.widget.base.tab;

import java.util.List;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "TabBar", category = "General", dependsPackage = "base-widget-desktop")
@ClientObject(prototype = "dorado.widget.TabBar", shortTypeName = "TabBar")
public class TabBar extends AbstractTabControl {

	private TabPlacement tabPlacement = TabPlacement.top;

	private boolean showMenuButton;

	private int tabMinWidth;

	@Override
	@XmlSubNode(implTypes = "com.bstek.dorado.view.widget.base.tab.Tab")
	@ClientProperty
	public List<Tab> getTabs() {
		return super.getTabs();
	}

	@ClientProperty(escapeValue = "top")
	public TabPlacement getTabPlacement() {
		return tabPlacement;
	}

	public void setTabPlacement(TabPlacement tabPlacement) {
		this.tabPlacement = tabPlacement;
	}

	public boolean isShowMenuButton() {
		return showMenuButton;
	}

	public void setShowMenuButton(boolean showMenuButton) {
		this.showMenuButton = showMenuButton;
	}

	public int getTabMinWidth() {
		return tabMinWidth;
	}

	public void setTabMinWidth(int tabMinWidth) {
		this.tabMinWidth = tabMinWidth;
	}

}
