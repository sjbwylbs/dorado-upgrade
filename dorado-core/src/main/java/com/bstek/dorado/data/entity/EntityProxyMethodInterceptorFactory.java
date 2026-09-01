package com.bstek.dorado.data.entity;

import org.aopalliance.intercept.MethodInterceptor;

import com.bstek.dorado.data.type.EntityDataType;

public interface EntityProxyMethodInterceptorFactory {

	/**
	 * 根据传入的数据类型和相应的Class类型，创建并返回一组方法拦截器。
	 * @throws Exception
	 */
	MethodInterceptor[] createInterceptors(EntityDataType dataType, Class<?> classType, Object entity) throws Exception;

}
