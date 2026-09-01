package com.bstek.dorado.data;

import java.util.Collection;

public interface JsonConvertContext {

	/**
	 * @return
	 */
	public Collection<Object> getEntityCollection();

	/**
	 * @return
	 */
	public Collection<Collection<?>> getEntityListCollection();

	/**
	 * @return
	 */
	public DataTypeResolver getDataTypeResolver();

}
