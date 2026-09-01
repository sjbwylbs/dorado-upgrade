package com.bstek.dorado.view.type.property.validator;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.core.resource.ResourceManager;
import com.bstek.dorado.core.resource.ResourceManagerUtils;

@XmlNode(fixedProperties = "type=range")
@ClientObject(prototype = "dorado.validator.RangeValidator", shortTypeName = "Range")
public class RangeValidator extends BaseValidator {

	private static final ResourceManager resourceManager = ResourceManagerUtils.get(RangeValidator.class);

	private double minValue;

	private RangeValidateMode minValueValidateMode = RangeValidateMode.ignore;

	private double maxValue;

	private RangeValidateMode maxValueValidateMode = RangeValidateMode.ignore;

	@ClientProperty(escapeValue = "-1")
	public double getMinValue() {
		return minValue;
	}

	public void setMinValue(double minValue) {
		this.minValue = minValue;
	}

	@ClientProperty(escapeValue = "ignore")
	public RangeValidateMode getMinValueValidateMode() {
		return minValueValidateMode;
	}

	public void setMinValueValidateMode(RangeValidateMode minValueValidateMode) {
		this.minValueValidateMode = minValueValidateMode;
	}

	@ClientProperty(escapeValue = "-1")
	public double getMaxValue() {
		return maxValue;
	}

	public void setMaxValue(double maxValue) {
		this.maxValue = maxValue;
	}

	@ClientProperty(escapeValue = "ignore")
	public RangeValidateMode getMaxValueValidateMode() {
		return maxValueValidateMode;
	}

	public void setMaxValueValidateMode(RangeValidateMode maxValueValidateMode) {
		this.maxValueValidateMode = maxValueValidateMode;
	}

	@Override
	protected Object doValidate(Object value) throws Exception {
		if (!(value instanceof Number)) {
			return null;
		}

		double f = ((Number) value).doubleValue();
		boolean invalid = false;
		if (minValueValidateMode != RangeValidateMode.ignore) {
			String subMessage = "";
			if (f == minValue && minValueValidateMode != RangeValidateMode.allowEquals) {
				invalid = true;
				subMessage = resourceManager.getString("dorado.data/errorOrEqualTo");
			}
			if (f < minValue) {
				invalid = true;
			}
			if (invalid) {
				return resourceManager.getString("dorado.data/errorNumberTooLess", subMessage, minValue);
			}
		}
		if (maxValueValidateMode != RangeValidateMode.ignore) {
			String subMessage = "";
			if (f == maxValue && maxValueValidateMode != RangeValidateMode.allowEquals) {
				invalid = true;
				subMessage = resourceManager.getString("dorado.data/errorOrEqualTo");
			}
			if (f > maxValue) {
				invalid = true;
			}
			if (invalid) {
				return resourceManager.getString("dorado.data/errorNumberTooGreat", subMessage, maxValue);
			}
		}
		return null;
	}

}
