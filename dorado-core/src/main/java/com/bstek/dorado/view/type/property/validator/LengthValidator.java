package com.bstek.dorado.view.type.property.validator;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.core.resource.ResourceManager;
import com.bstek.dorado.core.resource.ResourceManagerUtils;

@XmlNode(fixedProperties = "type=length")
@ClientObject(prototype = "dorado.validator.LengthValidator", shortTypeName = "Length")
public class LengthValidator extends BaseValidator {

	private static final ResourceManager resourceManager = ResourceManagerUtils.get(LengthValidator.class);

	private int minLength = -1;

	private int maxLength = -1;

	@ClientProperty(escapeValue = "-1")
	public int getMinLength() {
		return minLength;
	}

	public void setMinLength(int minLength) {
		this.minLength = minLength;
	}

	@ClientProperty(escapeValue = "-1")
	public int getMaxLength() {
		return maxLength;
	}

	public void setMaxLength(int maxLength) {
		this.maxLength = maxLength;
	}

	@Override
	protected Object doValidate(Object value) throws Exception {
		if (value instanceof String) {
			int len = ((String) value).length();
			if (minLength > 0 && len < minLength) {
				return resourceManager.getString("dorado.data/errorContentTooShort", minLength);
			}
			if (maxLength > 0 && len > maxLength) {
				return resourceManager.getString("dorado.data/errorContentTooLong", maxLength);
			}
		}
		return null;
	}

}
