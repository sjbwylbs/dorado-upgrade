package com.bstek.dorado.data.type;

/**
 * 用于描述java.lang.Character的数据类型。
 *
 */
public class CharacterDataType extends SimpleDataType {

	@Override
	public Object fromText(String text) {
		if (text == null || text.isEmpty()) {
			return null;
		}
		else {
			return text.charAt(0);
		}
	}

	@Override
	public Object fromObject(Object value) {
		if (value == null) {
			return null;
		}
		else if (value instanceof Character) {
			return value;
		}
		else if (value instanceof String) {
			return fromText((String) value);
		}
		else {
			throw new DataConvertException(value.getClass(), Character.class);
		}
	}

}
