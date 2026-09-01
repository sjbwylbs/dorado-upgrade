package com.bstek.dorado.data.provider.manager;

import org.aopalliance.intercept.MethodInterceptor;
import org.springframework.beans.factory.InitializingBean;

import com.bstek.dorado.data.config.definition.DataProviderDefinitionManager;
import com.bstek.dorado.spring.RemovableBean;

public class DataProviderInterceptorRegister implements InitializingBean, RemovableBean {

	private DataProviderDefinitionManager dataProviderDefinitionManager;

	private MethodInterceptor methodInterceptor;

	public void setDataProviderDefinitionManager(DataProviderDefinitionManager dataProviderDefinitionManager) {
		this.dataProviderDefinitionManager = dataProviderDefinitionManager;
	}

	public void setMethodInterceptor(MethodInterceptor methodInterceptor) {
		this.methodInterceptor = methodInterceptor;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		if (methodInterceptor != null) {
			dataProviderDefinitionManager.addDataProviderMethodInterceptor(methodInterceptor);
		}
	}

}
