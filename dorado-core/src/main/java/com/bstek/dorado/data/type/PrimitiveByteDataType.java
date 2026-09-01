package com.bstek.dorado.data.type;

/**
 * 用于描述byte的数据类型。
 *
 */
public class PrimitiveByteDataType extends ByteDataType {

	@Override
	public Object fromText(String text) {
		if (text == null) {
			return (byte) 0;
		}
		return super.fromText(text);
	}

	@Override
	public Object fromObject(Object value) {
		if (value == null) {
			return (byte) 0;
		}
		return super.fromObject(value);
	}

}
