package com.bstek.dorado.data.type;

import org.apache.commons.lang3.StringUtils;

/**
 * 用于描述java.lang.Double的数据类型。
 *
 */
public class DoubleDataType extends DecimalDataType {

	@Override
	public Object fromText(String text) {
		if (StringUtils.isEmpty(text)) {
			return null;
		}
		else {
			return Double.valueOf(text);
		}
	}

	@Override
	public Object fromObject(Object value) {
		if (value == null) {
			return null;
		}
		else if (value instanceof Double) {
			return value;
		}
		else if (value instanceof Number) {
			return ((Number) value).doubleValue();
		}
		else if (value instanceof String) {
			return fromText((String) value);
		}
		else {
			throw new DataConvertException(value.getClass(), Double.class);
		}
	}

}
