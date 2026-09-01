package com.bstek.dorado.util.proxy;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;

public interface MethodInterceptorFilter {

	public boolean filter(MethodInterceptor methodInterceptor, MethodInvocation methodInvocation);

}
