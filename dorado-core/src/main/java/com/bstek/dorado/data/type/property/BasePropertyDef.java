package com.bstek.dorado.data.type.property;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;

/**
 * 基本属性。
 *
 */
@XmlNode(nodeName = "PropertyDef", label = "PropertyDef", parser = "spring:dorado.propertyDefParser",
		definitionType = "com.bstek.dorado.data.config.definition.PropertyDefDefinition")
@ClientObject(prototype = "dorado.BasePropertyDef", shortTypeName = "Default")
public class BasePropertyDef extends PropertyDefSupport {

	private String propertyPath;

	public BasePropertyDef() {
	}

	public BasePropertyDef(String name) {
		setName(name);
	}

	@ClientProperty(ignored = true)
	public String getPropertyPath() {
		return propertyPath;
	}

	public void setPropertyPath(String propertyPath) {
		this.propertyPath = propertyPath;
	}

}
