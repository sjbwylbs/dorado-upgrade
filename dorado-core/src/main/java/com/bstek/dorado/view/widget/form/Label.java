package com.bstek.dorado.view.widget.form;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.datacontrol.AbstractPropertyDataControl;

@Widget(name = "Label", category = "Form", dependsPackage = "base-widget")
@ClientObject(prototype = "dorado.widget.Label", shortTypeName = "Label")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class Label extends AbstractPropertyDataControl {

	private String text;

	@IdeProperty(enumValues = "default,bold,h1,h2,h3")
	@Override
	public String getUi() {
		return super.getUi();
	}

	@IdeProperty(highlight = 1)
	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

}
