package com.bstek.dorado.data.type;

/**
 * 用于描述int的数据类型。
 *
 */
public class PrimitiveIntDataType extends IntegerDataType {

	@Override
	public Object fromText(String text) {
		if (text == null) {
			return 0;
		}
		return super.fromText(text);
	}

	@Override
	public Object fromObject(Object value) {
		if (value == null) {
			return 0;
		}
		return super.fromObject(value);
	}

}
