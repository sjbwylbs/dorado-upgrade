package com.bstek.dorado.view.widget.base;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "FieldSet", category = "General", dependsPackage = "base-widget-desktop")
@ClientObject(prototype = "dorado.widget.FieldSet", shortTypeName = "FieldSet")
public class FieldSet extends AbstractPanel {

	public FieldSet() {
		this.setCollapseable(true);
	}

	@ClientProperty(escapeValue = "true")
	@Override
	public void setCollapseable(boolean collapseable) {
		super.setCollapseable(collapseable);
	}

}
