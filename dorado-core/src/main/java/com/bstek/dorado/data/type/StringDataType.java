package com.bstek.dorado.data.type;

/**
 * 用于描述java.lang.String的数据类型。
 *
 */
public class StringDataType extends SimpleDataType {

	@Override
	public Object fromText(String text) {
		return text;
	}

	@Override
	public Object fromObject(Object value) {
		return (value == null) ? null : value.toString();
	}

}
