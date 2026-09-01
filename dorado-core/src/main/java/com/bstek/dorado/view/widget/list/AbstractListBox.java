package com.bstek.dorado.view.widget.list;

import com.bstek.dorado.annotation.ClientEvent;
import com.bstek.dorado.annotation.ClientEvents;

@ClientEvents({ @ClientEvent(name = "onRenderRow") })
public abstract class AbstractListBox extends RowList {

	private String property;

	private String renderer;

	public String getProperty() {
		return property;
	}

	public void setProperty(String property) {
		this.property = property;
	}

	public String getRenderer() {
		return renderer;
	}

	public void setRenderer(String renderer) {
		this.renderer = renderer;
	}

}
