package com.bstek.dorado.data.type;

/**
 * 用于描述short的数据类型。
 *
 */
public class PrimitiveShortDataType extends ShortDataType {

	@Override
	public Object fromText(String text) {
		if (text == null) {
			return (short) 0;
		}
		return super.fromText(text);
	}

	@Override
	public Object fromObject(Object value) {
		if (value == null) {
			return (short) 0;
		}
		return super.fromObject(value);
	}

}
