package com.bstek.dorado.view.widget.form;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.datacontrol.AbstractDataControl;

@Widget(name = "TemplateField", category = "Form", dependsPackage = "base-widget")
@ClientObject(prototype = "dorado.widget.TemplateField", shortTypeName = "TemplateField")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class TemplateField extends AbstractDataControl {

	private String template;

	@IdeProperty(highlight = 1, editor = "multiLines")
	public String getTemplate() {
		return template;
	}

	public void setTemplate(String template) {
		this.template = template;
	}

}
