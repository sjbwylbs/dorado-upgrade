package com.bstek.dorado.data.type;

import java.math.BigDecimal;

import org.apache.commons.lang3.StringUtils;

/**
 * 用于描述java.math.BigDecimal的数据类型。
 *
 */
public class BigDecimalDataType extends DecimalDataType {

	@Override
	public Object fromText(String text) {
		if (StringUtils.isEmpty(text)) {
			return null;
		}
		else {
			return new BigDecimal(text);
		}
	}

	@Override
	public Object fromObject(Object value) {
		if (value == null) {
			return null;
		}
		else if (value instanceof BigDecimal) {
			return value;
		}
		else if (value instanceof Number) {
			return new BigDecimal(value.toString());
		}
		else if (value instanceof String) {
			return fromText((String) value);
		}
		else {
			throw new DataConvertException(value.getClass(), BigDecimal.class);
		}
	}

}
