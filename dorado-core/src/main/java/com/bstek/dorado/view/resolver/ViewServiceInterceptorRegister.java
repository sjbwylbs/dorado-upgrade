package com.bstek.dorado.view.resolver;

import org.aopalliance.intercept.MethodInterceptor;
import org.springframework.beans.factory.InitializingBean;

import com.bstek.dorado.spring.RemovableBean;

public class ViewServiceInterceptorRegister implements InitializingBean, RemovableBean {

	private ViewServiceResolver viewServiceResolver;

	private MethodInterceptor methodInterceptor;

	public void setViewServiceResolver(ViewServiceResolver viewServiceResolver) {
		this.viewServiceResolver = viewServiceResolver;
	}

	public void setMethodInterceptor(MethodInterceptor methodInterceptor) {
		this.methodInterceptor = methodInterceptor;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		if (methodInterceptor != null) {
			viewServiceResolver.addMethodInterceptor(methodInterceptor);
		}
	}

}
