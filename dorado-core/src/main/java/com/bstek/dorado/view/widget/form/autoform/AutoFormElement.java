package com.bstek.dorado.view.widget.form.autoform;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.IdeObject;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.form.FormElement;

@Widget(name = "AutoFormElement", category = "AutoForm", dependsPackage = "base-widget")
@ClientObject(prototype = "dorado.widget.autoform.AutoFormElement", shortTypeName = "Default")
@IdeObject(labelProperty = "id,name,property")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class AutoFormElement extends FormElement {

	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
