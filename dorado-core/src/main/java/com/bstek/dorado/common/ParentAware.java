package com.bstek.dorado.common;

/**
 * 可获知父对象的对象的通用接口。
 *
 */
public interface ParentAware<T> {

	/**
	 * 设置父对象
	 */
	void setParent(T parent);

	T getParent();

}
