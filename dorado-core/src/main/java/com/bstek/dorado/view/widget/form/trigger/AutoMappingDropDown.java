package com.bstek.dorado.view.widget.form.trigger;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "AutoMappingDropDown", category = "Trigger", dependsPackage = "base-widget-desktop",
		autoGenerateId = true)
@ClientObject(prototype = "dorado.widget.AutoMappingDropDown", shortTypeName = "AutoMappingDropDown")
@XmlNode(clientTypes = ClientType.DESKTOP)
public class AutoMappingDropDown extends RowListDropDown {

	private String property = "value";

	public AutoMappingDropDown() {
		setDynaFilter(true);
	}

	@Override
	@ClientProperty(escapeValue = "true")
	public boolean isDynaFilter() {
		return super.isDynaFilter();
	}

	@Override
	@ClientProperty(escapeValue = "value")
	public String getProperty() {
		return property;
	}

	@Override
	public void setProperty(String property) {
		this.property = property;
	}

}
