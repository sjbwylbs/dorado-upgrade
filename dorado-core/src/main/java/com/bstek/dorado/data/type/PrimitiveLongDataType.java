package com.bstek.dorado.data.type;

/**
 * 用于描述long的数据类型。
 *
 */
public class PrimitiveLongDataType extends LongDataType {

	@Override
	public Class<?> getMatchType() {
		return long.class;
	}

	@Override
	public Object fromText(String text) {
		if (text == null) {
			return 0L;
		}
		return super.fromText(text);
	}

	@Override
	public Object fromObject(Object value) {
		if (value == null) {
			return 0L;
		}
		return super.fromObject(value);
	}

}
