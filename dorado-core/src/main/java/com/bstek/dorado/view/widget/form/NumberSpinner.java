package com.bstek.dorado.view.widget.form;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "NumberSpinner", category = "Form", dependsPackage = "base-widget-desktop")
@ClientObject(prototype = "dorado.widget.NumberSpinner", shortTypeName = "NumberSpinner")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class NumberSpinner extends Spinner {

	private int min = Integer.MIN_VALUE;

	private int max = Integer.MAX_VALUE;

	private boolean selectTextOnFocus = true;

	@ClientProperty(escapeValue = "-2147483648")
	public int getMin() {
		return min;
	}

	public void setMin(int min) {
		this.min = min;
	}

	@ClientProperty(escapeValue = "2147483647")
	public int getMax() {
		return max;
	}

	public void setMax(int max) {
		this.max = max;
	}

	@ClientProperty(escapeValue = "true")
	public boolean isSelectTextOnFocus() {
		return selectTextOnFocus;
	}

	public void setSelectTextOnFocus(boolean selectTextOnFocus) {
		this.selectTextOnFocus = selectTextOnFocus;
	}

}
