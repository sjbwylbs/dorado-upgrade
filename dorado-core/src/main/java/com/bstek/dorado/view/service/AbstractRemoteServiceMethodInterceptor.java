package com.bstek.dorado.view.service;

import org.aopalliance.intercept.MethodInvocation;

import com.bstek.dorado.common.proxy.PatternMethodInterceptor;
import com.bstek.dorado.web.DoradoContext;

public abstract class AbstractRemoteServiceMethodInterceptor extends PatternMethodInterceptor {

	@Override
	public final Object invoke(MethodInvocation invocation) throws Throwable {
		String serviceName = (String) DoradoContext.getCurrent()
			.getAttribute(AbstractRemoteServiceProcessor.SERVICE_NAME_ATTRIBUTE);
		return invoke(invocation, serviceName);
	}

	protected abstract Object invoke(MethodInvocation invocation, String serviceName) throws Throwable;

}
