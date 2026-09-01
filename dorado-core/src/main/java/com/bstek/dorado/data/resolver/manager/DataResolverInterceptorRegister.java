package com.bstek.dorado.data.resolver.manager;

import org.aopalliance.intercept.MethodInterceptor;
import org.springframework.beans.factory.InitializingBean;

import com.bstek.dorado.data.config.definition.DataResolverDefinitionManager;
import com.bstek.dorado.spring.RemovableBean;

public class DataResolverInterceptorRegister implements InitializingBean, RemovableBean {

	private DataResolverDefinitionManager dataResolverDefinitionManager;

	private MethodInterceptor methodInterceptor;

	public void setDataResolverDefinitionManager(DataResolverDefinitionManager dataResolverDefinitionManager) {
		this.dataResolverDefinitionManager = dataResolverDefinitionManager;
	}

	public void setMethodInterceptor(MethodInterceptor methodInterceptor) {
		this.methodInterceptor = methodInterceptor;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		if (methodInterceptor != null) {
			dataResolverDefinitionManager.addDataResolverMethodInterceptor(methodInterceptor);
		}
	}

}
