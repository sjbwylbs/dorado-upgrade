package com.bstek.dorado.view.type.property.validator;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.core.resource.ResourceManager;
import com.bstek.dorado.core.resource.ResourceManagerUtils;

@XmlNode(fixedProperties = "type=charLength")
@ClientObject(prototype = "dorado.validator.CharLengthValidator", shortTypeName = "CharLength")
public class CharLengthValidator extends BaseValidator {

	private static final ResourceManager resourceManager = ResourceManagerUtils.get(CharLengthValidator.class);

	private int minLength = -1;

	private int maxLength = -1;

	public int getMinLength() {
		return minLength;
	}

	public void setMinLength(int minLength) {
		this.minLength = minLength;
	}

	public int getMaxLength() {
		return maxLength;
	}

	public void setMaxLength(int maxLength) {
		this.maxLength = maxLength;
	}

	@Override
	protected Object doValidate(Object value) throws Exception {
		if (value instanceof String) {
			int len = ((String) value).getBytes().length;
			if (minLength > 0 && len < minLength) {
				return resourceManager.getString("data/errorContentTooShort", minLength);
			}
			if (maxLength > 0 && len > maxLength) {
				return resourceManager.getString("data/errorContentTooLong", maxLength);
			}
		}
		return null;
	}

}
