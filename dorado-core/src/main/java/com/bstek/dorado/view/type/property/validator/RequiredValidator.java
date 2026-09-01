package com.bstek.dorado.view.type.property.validator;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.core.resource.ResourceManager;
import com.bstek.dorado.core.resource.ResourceManagerUtils;

@XmlNode(fixedProperties = "type=required")
@ClientObject(prototype = "dorado.validator.RequiredValidator", shortTypeName = "Required")
public class RequiredValidator extends BaseValidator {

	private static final ResourceManager resourceManager = ResourceManagerUtils.get(RequiredValidator.class);

	private boolean trimBeforeValid = true;

	private boolean acceptZeroOrFalse;

	@ClientProperty(escapeValue = "true")
	public boolean isTrimBeforeValid() {
		return trimBeforeValid;
	}

	public void setTrimBeforeValid(boolean trimBeforeValid) {
		this.trimBeforeValid = trimBeforeValid;
	}

	public boolean isAcceptZeroOrFalse() {
		return acceptZeroOrFalse;
	}

	public void setAcceptZeroOrFalse(boolean acceptZeroOrFalse) {
		this.acceptZeroOrFalse = acceptZeroOrFalse;
	}

	@Override
	protected Object doValidate(Object value) throws Exception {
		boolean valid = (value != null);
		if (valid) {
			if (value instanceof String) {
				String s = (String) value;
				if (trimBeforeValid) {
					s = s.trim();
				}
				valid = StringUtils.isNotEmpty(s);
			}
			else if (value instanceof Number) {
				valid = (((Number) value).doubleValue() != 0 || acceptZeroOrFalse);
			}
			else if (value instanceof Boolean) {
				valid = (!((Boolean) value).booleanValue() || acceptZeroOrFalse);
			}
		}

		if (!valid) {
			return resourceManager.getString("dorado.data/errorContentRequired");
		}
		return null;
	}

}
