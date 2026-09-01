package com.bstek.dorado.data.type;

import org.apache.commons.lang3.StringUtils;

/**
 * 用于描述double的数据类型。
 *
 */
public class PrimitiveDoubleDataType extends DoubleDataType {

	@Override
	public Object fromText(String text) {
		if (StringUtils.isEmpty(text)) {
			return (double) 0;
		}
		return super.fromText(text);
	}

	@Override
	public Object fromObject(Object value) {
		if (value == null) {
			return (double) 0;
		}
		return super.fromObject(value);
	}

}
