package com.bstek.dorado.data.type;

/**
 * 用于描述java.lang.Long的数据类型。
 *
 */
public class LongDataType extends IntegralDataType {

	@Override
	public Object fromText(String text) {
		if (text == null) {
			return null;
		}
		else {
			return Long.valueOf(text);
		}
	}

	@Override
	public Object fromObject(Object value) {
		if (value == null) {
			return null;
		}
		else if (value instanceof Long) {
			return value;
		}
		else if (value instanceof Number) {
			return ((Number) value).longValue();
		}
		else if (value instanceof String) {
			return fromText((String) value);
		}
		else {
			throw new DataConvertException(value.getClass(), Long.class);
		}
	}

}
