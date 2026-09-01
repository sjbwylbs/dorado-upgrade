package com.bstek.dorado.data.entity;

import com.bstek.dorado.data.type.EntityDataType;

public class EnhanceableMapEntityEnhancer extends MapEntityEnhancer {

	public EnhanceableMapEntityEnhancer(EntityDataType dataType) {
		super(dataType);
	}

	@Override
	protected Object internalReadProperty(Object entity, String property) throws Exception {
		return ((EnhanceableEntity) entity).internalReadProperty(property);
	}

	@Override
	protected void internalWriteProperty(Object entity, String property, Object value) throws Exception {
		((EnhanceableEntity) entity).internalWriteProperty(property, value);
	}

}
