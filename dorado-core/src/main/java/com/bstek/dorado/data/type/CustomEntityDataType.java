package com.bstek.dorado.data.type;

import java.util.Map;

public interface CustomEntityDataType<T> extends EntityDataType {

	/**
	 * 尝试将一个Map转换成本DataType所描述的类型。
	 * @param map 要转换的Map。
	 * @return 转换后得到的数据。
	 */
	T fromMap(Map<String, Object> map) throws Exception;

	/**
	 * 将一个数据对象转换成Map。
	 * @param customEntity 数据对象。
	 * @return 转换后得到的Map。
	 */
	Map<String, Object> toMap(T customEntity) throws Exception;

}
