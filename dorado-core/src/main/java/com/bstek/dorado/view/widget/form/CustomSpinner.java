package com.bstek.dorado.view.widget.form;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "CustomSpinner", category = "Form", dependsPackage = "base-widget-desktop")
@ClientObject(prototype = "dorado.widget.CustomSpinner", shortTypeName = "CustomSpinner")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class CustomSpinner extends Spinner {

	private String value;

	private String pattern;

	@Override
	@IdeProperty(visible = false)
	public String getText() {
		return super.getText();
	}

	@ClientProperty(outputter = "class:com.bstek.dorado.view.widget.form.CustomSpinnerValueOutputter")
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	@IdeProperty(highlight = 1)
	public String getPattern() {
		return pattern;
	}

	public void setPattern(String pattern) {
		this.pattern = pattern;
	}

}
