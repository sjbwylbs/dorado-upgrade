package com.bstek.dorado.view.widget.base.menu;

import java.util.List;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.widget.InnerElementList;

@ClientObject(prototype = "dorado.widget.menu.MenuItem", shortTypeName = "Default")
@XmlNode(clientTypes = ClientType.DESKTOP)
public class MenuItem extends TextMenuItem implements MenuItemGroup {

	private final List<BaseMenuItem> menuItems = new InnerElementList<>(this);

	@Override
	public void addItem(BaseMenuItem menuItem) {
		menuItems.add(menuItem);
	}

	public BaseMenuItem getItem(String name) {
		for (BaseMenuItem item : menuItems) {
			if (name.equals(item.getName())) {
				return item;
			}
		}
		return null;
	}

	@Override
	@XmlSubNode
	@ClientProperty
	public List<BaseMenuItem> getItems() {
		return menuItems;
	}

}
