package com.bstek.dorado.data.entity;

import com.bstek.dorado.data.type.EntityDataType;

public class EnhanceableBeanEntityEnhancer extends BeanEntityEnhancer {

	public EnhanceableBeanEntityEnhancer(EntityDataType dataType, Class<?> beanType) throws Exception {
		super(dataType, beanType);
	}

}
