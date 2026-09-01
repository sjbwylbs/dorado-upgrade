package com.bstek.dorado.data.type;

import java.util.UUID;

/**
 * 用于描述java.util.UUID的数据类型。
 *
 */
public class UUIDDataType extends SimpleDataType {

	@Override
	public Object fromText(String text) {
		if (text == null || text.length() == 0) {
			return null;
		}
		else {
			return UUID.fromString(text);
		}
	}

	@Override
	public Object fromObject(Object value) {
		if (value == null) {
			return null;
		}
		else if (value instanceof UUID) {
			return value;
		}
		else if (value instanceof String) {
			return fromText((String) value);
		}
		else {
			throw new DataConvertException(value.getClass(), UUID.class);
		}
	}

}
