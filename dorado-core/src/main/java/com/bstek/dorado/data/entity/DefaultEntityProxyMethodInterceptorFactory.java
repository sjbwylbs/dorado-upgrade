package com.bstek.dorado.data.entity;

import java.util.Map;

import org.aopalliance.intercept.MethodInterceptor;

import com.bstek.dorado.data.type.EntityDataType;

public class DefaultEntityProxyMethodInterceptorFactory implements EntityProxyMethodInterceptorFactory {

	@Override
	public MethodInterceptor[] createInterceptors(EntityDataType dataType, Class<?> classType, Object entity)
			throws Exception {
		MethodInterceptor mi;
		if (Map.class.isAssignableFrom(classType)) {
			mi = new DefaultMapEntityInterceptor(dataType);
		}
		else {
			mi = new DefaultBeanEntityInterceptor(dataType, classType);
		}
		return new MethodInterceptor[] { mi };
	}

}
