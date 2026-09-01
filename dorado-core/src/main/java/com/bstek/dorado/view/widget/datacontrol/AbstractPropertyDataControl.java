package com.bstek.dorado.view.widget.datacontrol;

import com.bstek.dorado.annotation.IdeProperty;

public abstract class AbstractPropertyDataControl extends AbstractDataControl implements PropertyDataControl {

	private String property;

	@Override
	@IdeProperty(highlight = 1)
	public String getProperty() {
		return property;
	}

	@Override
	public void setProperty(String property) {
		this.property = property;
	}

}
