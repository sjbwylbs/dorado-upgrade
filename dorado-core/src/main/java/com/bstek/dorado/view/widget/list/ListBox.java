package com.bstek.dorado.view.widget.list;

import java.util.List;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "ListBox", category = "Collection", dependsPackage = "base-widget-desktop")
@ClientObject(prototype = "dorado.widget.ListBox", shortTypeName = "ListBox")
public class ListBox extends AbstractListBox {

	private List<?> items;

	@XmlProperty
	@ClientProperty
	@IdeProperty(editor = "collection[any]", highlight = 1)
	public List<?> getItems() {
		return items;
	}

	public void setItems(List<?> items) {
		this.items = items;
	}

}
