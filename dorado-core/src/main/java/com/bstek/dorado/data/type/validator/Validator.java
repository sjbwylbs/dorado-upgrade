package com.bstek.dorado.data.type.validator;

import java.util.List;

import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.common.Namable;

@XmlNode(nodeName = "Validator", icon = "/com/bstek/dorado/view/type/property/validator/Validator.png",
		properties = @XmlProperty(propertyName = "name", parser = "spring:dorado.staticPropertyParser",
				attributeOnly = true))
public interface Validator extends Namable {

	List<ValidationMessage> validate(Object value) throws Exception;

}
