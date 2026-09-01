package com.bstek.dorado.view.widget.base.tab;

import java.util.List;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.view.annotation.Widget;


@Widget(name = "VerticalTabControl", category = "General", dependsPackage = "base-widget-desktop")
@ClientObject(prototype = "dorado.widget.VerticalTabControl", shortTypeName = "VerticalTabControl")
public class VerticalTabControl extends TabColumn {

	private int tabColumnWidth = 200;

	@Override
	@XmlSubNode(implTypes = "com.bstek.dorado.view.widget.base.tab.*")
	@ClientProperty
	public List<Tab> getTabs() {
		return super.getTabs();
	}

	@ClientProperty(escapeValue = "200")
	public int getTabColumnWidth() {
		return tabColumnWidth;
	}

	public void setTabColumnWidth(int tabColumnWidth) {
		this.tabColumnWidth = tabColumnWidth;
	}

}
