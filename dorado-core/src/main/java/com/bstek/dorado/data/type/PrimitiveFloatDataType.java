package com.bstek.dorado.data.type;

import org.apache.commons.lang3.StringUtils;

/**
 * 用于描述float的数据类型。
 *
 */
public class PrimitiveFloatDataType extends FloatDataType {

	@Override
	public Object fromText(String text) {
		if (StringUtils.isEmpty(text)) {
			return (float) 0;
		}
		return super.fromText(text);
	}

	@Override
	public Object fromObject(Object value) {
		if (value == null) {
			return (float) 0;
		}
		return super.fromObject(value);
	}

}
